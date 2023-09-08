import { createClient } from '$lib/prismic.js'
import { error } from '@sveltejs/kit'

const graphQuery = `
  {
    page {
      ...pageFields
      parent {
        ...on page {
          title
          shortname
        }
      }
      body {
        ...on link_blurb {
          non-repeat {
            ...non-repeatFields
            link {
              ...on page {
                theme
                title
                parent
                description
                featured_image
              }
            }
          }
        }
        ...on file_blurb {
          non-repeat {
            ...non-repeatFields
          }
        }
        ...on any_blurb {
          non-repeat {
            ...non-repeatFields
          }
        }
        ...on heading {
          non-repeat {
            ...non-repeatFields
          }
        }
        ...on text {
          non-repeat {
            ...non-repeatFields
          }
          repeat {
            ...repeatFields
          }
        }
        ...on accordion {
          non-repeat {
            ...non-repeatFields
          }
          repeat {
            ...repeatFields
          }
        }
        ...on button {
          non-repeat {
            ...non-repeatFields
          }
        }
        ...on author {
          non-repeat {
            ...non-repeatFields
          }
        }
        ...on quote {
          non-repeat {
            ...non-repeatFields
          }
        }
        ...on team {
          non-repeat {
            ...non-repeatFields
          }
          repeat {
            ...repeatFields
          }
        }
        ...on video {
          non-repeat {
            ...non-repeatFields
          }
          repeat {
            ...repeatFields
          }
        }
        ...on image {
          non-repeat {
            ...non-repeatFields
          }
        }
        ...on resources {
          non-repeat {
            ...non-repeatFields
            event {
              ...on event {
                title
                theme
                description
                poster
              }
            }
          }
          repeat {
            ...repeatFields
          }
        }
      }
    }
  }
`.replace(/\n\s+/g, '\n')

export async function load({ fetch, params, request }) {
  /** @type {{ slug?: string }} */
  const { slug = 'start' } = params

  try {
    const client = createClient({ fetch, request })
    const page = await client.getByUID('page', slug, { graphQuery })
    return { page }
  } catch (err) {
    console.log(err)
    throw error(404, 'Not found')
  }
}
