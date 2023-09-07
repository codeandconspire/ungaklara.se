import { createClient, filter } from '@prismicio/client'
import addYears from 'date-fns/addYears'
import { error } from '@sveltejs/kit'

export async function load({ fetch, url }) {
  const { page, tag, period } = Object.fromEntries(url.searchParams)

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
   * @returns {Promise<{ events: import('@prismicio/client').PrismicDocument[], index: number, total: number }>}
   */
  async function getPage(page) {
    var filters = [
      filter.at('document.type', 'event'),
      filter.dateBefore('my.event.archive_on', Date.now())
    ]

    if (tag) {
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
      pageSize: 24,
      orderings: {
        field: 'my.event.archive_on',
        direction: 'desc'
      }
    })

    return {
      index: response.page,
      total: response.total_pages,
      events: response.results
    }
  }
}
