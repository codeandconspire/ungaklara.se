import { browser } from '$app/environment'

export default function track(event, props) {
  if (browser && 'gtag' in window && typeof window.gtag === 'function') {
    try {
      window.gtag('event', event, props)
    } catch (err) {
      console.error(err)
    }
  }
}
