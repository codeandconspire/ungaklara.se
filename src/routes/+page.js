import { createClient } from '@prismicio/client'
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
                description
                featured_image
              }
            }
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
    console.log(err)
    throw error(404, 'Not found')
  }
}
