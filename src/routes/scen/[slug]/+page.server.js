import { createClient } from '$lib/prismic.js'
import { error } from '@sveltejs/kit'

import { getProduction } from '../../../lib/tickster.js'

export async function load(event) {
  const { fetch, params, request } = event
  try {
    const client = createClient({ fetch, request })
    const [page, resources] = await Promise.all([
      client.getByUID('event', params.slug),
      client.getByUID('page', 'pedagogiskt-material').catch(() => null)
    ])

    return {
      page,
      production: await getProduction(page.data.buy_link.url, event),
      resources: resources?.data.body.filter(
        (slice) =>
          slice.slice_type === 'resources' && slice.primary.event.id === page.id
      )
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    error(500, message)
  }
}
