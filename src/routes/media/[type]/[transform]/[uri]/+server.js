import { error } from '@sveltejs/kit'
import cloudinary from 'cloudinary'

const HEADERS = ['etag', 'last-modified', 'content-length', 'content-type']

cloudinary.config({
  secure: true,
  cloud_name: 'dykmd8idd',
  api_key: import.meta.env.CLOUDINARY_KEY,
  api_secret: import.meta.env.CLOUDINARY_SECRET
})

export async function GET(request) {
  const url = new URL(request.url)
  let { type, transform, uri } = request.params
  if (url.search) uri += `?${url.search}`

  if (type === 'fetch' && !/^(?:https?:)?\/\//.test(uri)) {
    uri = `https://images.prismic.io/unga-klara/${uri}`
  }

  const opts = { type: type, sign_url: true }
  if (transform) opts.raw_transformation = transform

  const res = await fetch(cloudinary.url(uri, opts))

  if (!res.ok) throw error(res.status, res.statusText)

  return new Response(res.body, {
    headers: Object.fromEntries(
      HEADERS.map((header) => [header, res.headers.get(header)]).concat([
        ['Cache-Control', `public, max-age=${60 * 60 * 24 * 365}`]
      ])
    )
  })
}
