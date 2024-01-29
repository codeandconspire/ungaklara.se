import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { build } from '$service-worker'

// Clean old assets
cleanupOutdatedCaches()

// Precache all assets
precacheAndRoute(build)
