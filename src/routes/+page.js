import { error } from '@sveltejs/kit'
import { createClient } from '@prismicio/client'

export async function load({ fetch }) {
  try {
    const client = createClient('unga-klara', { fetch })
    const page = await client.getByUID('page', 'start')
    return { page }
  } catch (err) {
    throw error(404, 'Not found')
  }
}
