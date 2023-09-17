import { createClient, cookie } from '@prismicio/client'
import { redirect } from '@sveltejs/kit'

import { resolve } from '$lib/prismic.js'

export async function GET({ url, cookies }) {
  const { token, documentId } = Object.fromEntries(url.searchParams)
  const client = createClient('unga-klara', { fetch })
  const href = await client.resolvePreviewURL({
    linkResolver: resolve,
    defaultURL: '/',
    documentID: documentId,
    previewToken: token
  })

  cookies.set(cookie.preview, token, {
    maxAge: 60 * 60 * 12,
    httpOnly: false
  })

  throw redirect(302, href)
}
