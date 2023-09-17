import { createClient as createPrismicClient, cookie } from '@prismicio/client'

/**
 * @param {{ fetch: typeof globalThis.fetch, request?: import('@prismicio/client').HttpRequestLike}} props
 * @returns {import('@prismicio/client').Client}
 */
export function createClient({ request, fetch }) {
  const client = createPrismicClient('unga-klara', { fetch })
  if (request) client.enableAutoPreviewsFromReq(request)
  return client
}

export function resolve(doc) {
  if (!doc || doc.isBroken) return null
  if (typeof doc === 'string') return doc
  switch (doc.type) {
    case 'page': {
      const prefix = resolve(doc.data?.parent) || ''
      return `${prefix}/${doc.uid}`
    }
    case 'events':
      return `/scen`
    case 'event':
      return `/scen/${doc.uid}`
    case 'your_visit':
      return `/besoket`
    case 'Web':
    case 'Media':
      return doc.url?.replace(/^https?:\/\/#/, '#')
    default:
      switch (doc.link_type) {
        case 'Web':
        case 'Media':
          return doc.url?.replace(/^https?:\/\/#/, '#')
        default:
          return doc.uid
      }
  }
}
