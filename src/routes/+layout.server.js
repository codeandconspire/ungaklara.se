import { createClient, cookie } from '@prismicio/client'
import { error } from '@sveltejs/kit'

export const prerender = 'auto'

export async function load({ fetch, cookies }) {
  try {
    const client = createClient('unga-klara', { fetch })
    const settings = await client.getSingle('settings')
    const previewToken = cookies.get(cookie.preview)
    return { settings, previewToken }
  } catch (err) {
    throw error(404, 'Not found')
  }
}
