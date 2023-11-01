import { TICKSTER_API_KEY } from '$env/static/private'
import startOfDay from 'date-fns/startOfDay'
import parseJSON from 'date-fns/parseJSON'

const store = {}

const EVENT_URL =
  /https?:\/\/(?:secure|www).tickster.com\/(?:\w{2}\/(?:events\/)?)?(.+?)(?:\/|$)/

/**
 * @param {string} url
 * @param {import('@sveltejs/kit').RequestEvent} event
 * @returns {Promise<object?>}
 */
export async function getProduction(url, { platform, fetch }) {
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
    const today = startOfDay(new Date())
    const production = {
      ...body,
      childEvents: undefined,
      shows: body?.childEvents
        .filter((event) => parseJSON(event.start) >= today)
        .map((event) => {
          return { ...event, goods: undefined }
        })
    }

    await store.put(id, JSON.stringify(production), {
      expirationTtl: 60 * 10 // 10 minutes
    })

    return production
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
