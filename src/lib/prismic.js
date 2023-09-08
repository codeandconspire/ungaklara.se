import { createClient as createPrismicClient } from '@prismicio/client'

/**
 * @param {{ fetch: typeof globalThis.fetch, request?: import('@prismicio/client').HttpRequestLike}} props
 * @returns {import('@prismicio/client').Client}
 */
export function createClient({ request, fetch }) {
  const client = createPrismicClient('unga-klara', { fetch })
  if (request) client.enableAutoPreviewsFromReq(request)
  return client
}
