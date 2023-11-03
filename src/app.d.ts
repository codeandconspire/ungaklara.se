import type {
  CacheStorage,
  EventContext,
  fetch
} from '@cloudflare/workers-types'

type Env = {
  STORE: KVNamespace
  ASSETS: {
    fetch: typeof fetch
  }
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    interface Platform {
      env: Env
      context: EventContext<Env>
      caches: CacheStorage
    }
  }
}

export {}
