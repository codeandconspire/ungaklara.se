import { createClient, filter } from '@prismicio/client'
import addYears from 'date-fns/addYears'
import { error } from '@sveltejs/kit'

export async function load({ fetch, url }) {
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
      pageSize: 100,
      orderings: {
        field: 'my.event.archive_on',
        direction: 'desc'
      }
    })

    return response.results
  }
}
