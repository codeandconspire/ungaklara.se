import { createClient, filter } from '@prismicio/client'
import parseJSON from 'date-fns/parseJSON'
import addYears from 'date-fns/addYears'
import { error } from '@sveltejs/kit'

import getProduction from '$lib/production.js'

const PAGE_SIZE = 12

export async function load({ fetch, url, platform }) {
  const tab = url.pathname.split('/').pop()

  const { page, tag, period } = Object.fromEntries(url.searchParams)

  const client = createClient('unga-klara', { fetch })

  try {
    const [_page, events] = await Promise.all([
      client.getSingle('events'),
      // @ts-ignore
      getPage(+page || 1)
    ])

    return { page: _page, events }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw error(500, message)
  }

  /**
   * @param {number} page
   * @returns {Promise<(import('@prismicio/client').PrismicDocument & { production?: any })[]>}
   */
  async function getPage(page) {
    const selector = tab === 'arkiv' ? 'dateBefore' : 'dateAfter'
    var filters = [
      filter.at('document.type', 'event'),
      filter[selector]('my.event.archive_on', Date.now())
    ]

    if (tag && tag !== 'on') {
      filters.push(filter.at('document.tags', [tag]))
    }

    if (period) {
      const min = new Date(+period, 0, 0)
      const max = addYears(min, 10)
      filters.push(
        filter.dateAfter('my.event.archive_on', min),
        filter.dateBefore('my.event.archive_on', max)
      )
    }

    const response = await client.get({
      page,
      filters,
      pageSize: tab === 'arkiv' ? PAGE_SIZE : 100,
      orderings: {
        field:
          tab === 'arkiv'
            ? 'my.event.archive_on'
            : 'document.first_publication_date',
        direction: 'desc'
      },
      graphQuery: `
        {
          event {
            ...eventFields
            resource_blurb {
              ...on teachers {
                description
                cta
              }
            }
          }
        }
      `
    })

    if (tab === 'arkiv') return response.results

    const events = await Promise.all(
      response.results.map(async (doc) => {
        const production = await getProduction(doc.data.buy_link.url, platform)
        const shows = production?.childEvents?.map((event) => {
          return { ...event, goods: undefined }
        })
        return {
          ...doc,
          // Drop exccessive data
          production: { ...production, shows, childEvents: undefined }
        }
      })
    )

    return events.sort((a, b) => (getFirstDate(a) < getFirstDate(b) ? -1 : 1))
  }
}

function getFirstDate({ production }) {
  return production.shows?.length
    ? production.shows.map((event) => parseJSON(event.start)).sort()[0]
    : parseJSON(production.event?.start)
}
