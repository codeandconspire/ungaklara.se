import { createClient } from '@prismicio/client'
import { error } from '@sveltejs/kit'

import { getProduction } from '../tickster.js'

export async function load({ fetch, params, platform }) {
  const client = createClient('unga-klara', { fetch })

  try {
    const page = await client.getByUID('event', params.slug)
    const production = await getProduction(page.data.buy_link.url, platform)
    return { page, production }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw error(500, message)
  }
}
