import { error } from '@sveltejs/kit'
import { createClient } from '@prismicio/client'

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
                description
                featured_image
              }
            }
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
      }
    }
  }
`

export async function load({ fetch, params }) {
  /** @type {{ slug?: string }} */
  const { slug = 'start' } = params

  try {
    const client = createClient('unga-klara', { fetch })
    const page = await client.getByUID('page', slug, { graphQuery })
    return { page }
  } catch (err) {
    throw error(404, 'Not found')
  }
}
