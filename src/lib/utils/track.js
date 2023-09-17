import { browser } from '$app/environment'

export function track(event, props) {
  if (browser && 'gtag' in window && typeof window.gtag === 'function') {
    try {
      window.gtag('event', event, props)
    } catch (err) {
      console.error(err)
    }
  }
}
