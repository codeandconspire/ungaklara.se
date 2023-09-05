import { TICKSTER_API_KEY } from '$env/static/private'

const store = {}

const EVENT_URL =
  /https?:\/\/(?:secure|www).tickster.com\/(?:\w{2}\/(?:events\/)?)?(.+?)(?:\/|$)/

/**
 * @param {string} url
 * @param {object} [platform]
 * @returns {Promise<object?>}
 */
export default async function getProduction(url, platform) {
  if (!url) return null

  const store = getStore(platform)

  try {
    const match = url.match(EVENT_URL)
    if (!match) return null
    const [, id] = match

    const cached = await store.get(id)
    if (cached) return JSON.parse(cached)

    const res = await fetch(
      `https://api.tickster.com/sv/api/0.4/events/${id}?key=${TICKSTER_API_KEY}`
    )

    if (!res.ok) return null

    const body = await res.json()

    await store.put(id, JSON.stringify(body), {
      expirationTtl: 60 * 10 // 10 minutes
    })

    return body
  } catch (err) {
    return null
  }
}

/**
 * @param {object} platform
 * @returns {KVNamespace}
 */
function getStore(platform) {
  return (
    platform?.env?.STORE || {
      async get(key) {
        return store[key]
      },
      async put(key, value) {
        store[key] = value
      }
    }
  )
}
