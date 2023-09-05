import { createClient, filter } from '@prismicio/client'
import { TICKSTER_API_KEY } from '$env/static/private'
import parseJSON from 'date-fns/parseJSON'
import addYears from 'date-fns/addYears'
import { error } from '@sveltejs/kit'

const store = {}
const PAGE_SIZE = 12
const EVENT_URL =
  /https?:\/\/(?:secure|www).tickster.com\/(?:\w{2}\/(?:events\/)?)?(.+?)(?:\/|$)/

export async function load({ fetch, url, platform }) {
  const tab = url.pathname.split('/').pop()
  const store = getStore(platform)

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
      }
    })

    if (tab === 'arkiv') return response.results

    const events = await Promise.all(
      response.results.map(async (doc) => {
        const production = await getProduction(doc.data.buy_link.url)
        const shows = production?.childEvents.map((event) => {
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

  async function getProduction(url) {
    if (!url) return null

    try {
      const match = url.match(EVENT_URL)
      if (!match) return null
      const [, id] = match

      const cached = await store.get(id)
      if (cached) return JSON.parse(cached)

      const res = await fetch(
        `https://api.tickster.com/sv/api/0.4/events/${id}?key=${TICKSTER_API_KEY}`
      )

      if (!res.ok) return null

      const body = await res.json()

      await store.put(id, JSON.stringify(body), {
        expirationTtl: 60 * 10 // 10 minutes
      })

      return body
    } catch (err) {
      return null
    }
  }
}

function getFirstDate({ production }) {
  return production.shows?.length
    ? production.shows.map((event) => parseJSON(event.start)).sort()[0]
    : parseJSON(production.event?.start)
}

/**
 * @param {object} platform
 * @returns {KVNamespace}
 */
function getStore(platform) {
  return (
    platform?.env?.STORE || {
      async get(key) {
        return store[key]
      },
      async put(key, value) {
        store[key] = value
      }
    }
  )
}
