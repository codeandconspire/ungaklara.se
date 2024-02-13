import { CLOUDINARY_SECRET } from '$env/static/private'
import { error } from '@sveltejs/kit'

const HEADERS = ['etag', 'last-modified', 'content-length', 'content-type']

export async function GET(request) {
  const url = new URL(request.url)
  let { type, transform, uri } = request.params

  const res = transform
    ? await fetch(
        `https://res.cloudinary.com/dykmd8idd/image/${type}/s--${btoa(
          `${transform}/${uri}${CLOUDINARY_SECRET}`
        ).substring(0, 8)}--/${transform}/${encodeURIComponent(uri)}`
      )
    : await fetch(url)

  if (!res.ok) {
    error(/** @type {import('@sveltejs/kit').NumericRange<400, 599>} */ (res.status), res.statusText)
  }

  return new Response(res.body, {
    headers: Object.fromEntries(
      HEADERS.map((header) => [header, res.headers.get(header)]).concat([
        ['Cache-Control', `public, max-age=${60 * 60 * 24 * 365}`]
      ])
    )
  })
}
