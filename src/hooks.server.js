export async function handle({ event, resolve }) {
  const render = async () => {
    const response = await resolve(event)
    response.headers.set('cache-control', `s-maxage=${60 * 10}, max-age=0`)
    return response
  }

  if (!event.platform) return render()

  try {
    const { env, context, caches } = event.platform

    const url = new URL(event.request.url)

    // Try and fetch static asset
    const asset = new Request(url, { headers: event.request.headers })
    const res = await env.ASSETS.fetch(asset).catch(() => null)

    // Return any found asset as is
    if (res && res.status < 400) return res

    const cache = await caches.default
    let cached = await cache.match(url)

    if (cached) {
      context.waitUntil(
        render().then(
          // Update cache in background – like stale-while-revalidate
          // see: https://community.cloudflare.com/t/when-will-cloudflare-fully-support-stale-while-revalidate-with-asynchronous-background-revalidation/287764
          (res) => cache.put(url, res),
          console.error
        )
      )
      // @ts-ignore
      return cached
    }

    return await render().then(function (res) {
      // Cache response in background
      context.waitUntil(cache.put(url, res.clone()))
      return res
    })
  } catch {
    return render()
  }
}
