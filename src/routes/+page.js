import { error } from '@sveltejs/kit'
import { createClient } from '@prismicio/client'
import { page as pageQuery } from '$lib/queries.js'

const graphQuery = `
  {
    page ${pageQuery}
  }
`

export async function load({ fetch }) {
  try {
    const client = createClient('unga-klara', { fetch })
    const page = await client.getByUID('page', 'start', { graphQuery })
    return { page }
  } catch (err) {
    throw error(404, 'Not found')
  }
}
