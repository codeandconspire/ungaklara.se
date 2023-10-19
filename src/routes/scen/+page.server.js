import { createClient } from '$lib/prismic.js'
import { filter } from '@prismicio/client'
import { error } from '@sveltejs/kit'

import { getProduction } from '../../lib/tickster.js'

const PAGE_SIZE = 12

export async function load(event) {
  const { fetch, request, url } = event
  const { page } = Object.fromEntries(url.searchParams)

  const client = createClient({ fetch, request })

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
        const production = await getProduction(doc.data.buy_link.url, event)
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
  if (!production) return null
  return production.shows?.length
    ? production.shows.map((event) => new Date(event.start)).sort()[0]
    : new Date(production.event?.start)
}
