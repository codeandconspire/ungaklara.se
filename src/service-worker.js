import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { build, version } from '$service-worker'

// Clean old assets
cleanupOutdatedCaches()

// Precache all assets
precacheAndRoute(build.map((url) => ({ url, revision: version })))
