import { createClient, filter } from '@prismicio/client'
import parseJSON from 'date-fns/parseJSON'
import { error } from '@sveltejs/kit'

import getProduction from '$lib/production.js'

const PAGE_SIZE = 12

export async function load({ fetch, url, platform }) {
  const { page } = Object.fromEntries(url.searchParams)

  const client = createClient('unga-klara', { fetch })

  try {
    const [_page, { events, index, total }] = await Promise.all([
      client.getSingle('events'),
      // @ts-ignore
      getPage(+page || 1)
    ])

    return { page: _page, events, index, total }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw error(500, message)
  }

  /**
   * @param {number} page
   * @returns {Promise<{ events: (import('@prismicio/client').PrismicDocument & { production?: any })[], index: number, total: number }>}
   */
  async function getPage(page) {
    const response = await client.get({
      page,
      pageSize: PAGE_SIZE,
      filters: [
        filter.at('document.type', 'event'),
        filter.dateAfter('my.event.archive_on', Date.now())
      ],
      orderings: {
        field: 'document.first_publication_date',
        direction: 'desc'
      }
    })

    const events = await Promise.all(
      response.results.map(async (doc) => {
        const production = await getProduction(doc.data.buy_link.url, platform)
        return { ...doc, production }
      })
    )

    return {
      index: response.page,
      total: response.total_pages,
      events: events.sort((a, b) =>
        getFirstDate(a) < getFirstDate(b) ? -1 : 1
      )
    }
  }
}

function getFirstDate({ production }) {
  return production.shows?.length
    ? production.shows.map((event) => parseJSON(event.start)).sort()[0]
    : parseJSON(production.event?.start)
}
