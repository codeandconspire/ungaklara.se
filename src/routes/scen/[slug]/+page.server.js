import { createClient } from '$lib/prismic.js'
import { error } from '@sveltejs/kit'

import { getProduction } from '../tickster.js'

export async function load({ fetch, params, request, platform }) {
  try {
    const client = createClient({ fetch, request })
    const page = await client.getByUID('event', params.slug)
    const production = await getProduction(page.data.buy_link.url, platform)
    return { page, production }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw error(500, message)
  }
}
