import { createClient, filter } from '@prismicio/client'
import { TICKSTER_API_KEY } from '$env/static/private'
import parseJSON from 'date-fns/parseJSON'
import addYears from 'date-fns/addYears'
import { error } from '@sveltejs/kit'

var PAGE_SIZE = 12
var EVENT_URL =
  /https?:\/\/(?:secure|www).tickster.com\/(?:\w{2}\/(?:events\/)?)?(.+?)(?:\/|$)/

export async function load({ fetch, url }) {
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
    throw error(404, 'Not found')
  }

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

    const pairs = await Promise.all(
      response.results.map(async (doc) => [
        await getEvent(doc.data.buy_link.url),
        doc
      ])
    )

    return pairs.sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([, doc]) => doc)
  }

  async function getEvent(url) {
    if (!url) return null

    try {
      const match = url.match(EVENT_URL)
      if (!match) return null
      const [, id] = match

      const res = await fetch(
        `https://api.tickster.com/sv/api/0.4/events/${id}?key=${TICKSTER_API_KEY}`
      )

      if (!res.ok) return null

      const { event } = await res.json()

      return event.childEvents.length
        ? event.childEvents.map((event) => parseJSON(event.start)).sort()[0]
        : parseJSON(event.start)
    } catch (err) {
      return null
    }
  }
}
