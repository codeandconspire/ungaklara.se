import { POSTMARK_API_TOKEN } from '$env/static/private'
import { error, fail } from '@sveltejs/kit'
import { filter } from '@prismicio/client'

import { getProduction } from '$lib/tickster.js'
import { createClient } from '$lib/prismic.js'

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
        ...on signup {
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
        ...on school_booking_form {
          non-repeat {
            ...non-repeatFields
          }
        }
        ...on upcoming_shows {
          non-repeat {
            ...non-repeatFields
            event {
              ...on event {
                ...eventFields
              }
            }
          }
        }
      }
    }
  }
`.replace(/\n\s+/g, '\n')

export async function load(event) {
  const { fetch, params, request } = event
  /** @type {{ slug?: string }} */
  const { slug = 'start' } = params

  try {
    const client = createClient({ fetch, request })
    const page = await client.getByUID('page', slug, { graphQuery })
    const data = { page }

    // Populate data with relational slice data
    await Promise.all(
      page.data.body.map(async (slice) => {
        if (slice.slice_type === 'upcoming_shows') {
          const events = slice.primary.event?.id
            ? [slice.primary.event]
            : await client
                .get({
                  filters: [
                    filter.at('document.type', 'event'),
                    filter.dateAfter('my.event.archive_on', Date.now())
                  ]
                })
                .then((response) => response.results)

          try {
            data[slice.id] = await Promise.all(
              events.map(async (_event) => {
                const production = await getProduction(
                  _event.data.buy_link.url,
                  event
                )
                return { ..._event, production }
              })
            )
          } catch {
            // Fail silently
          }
        }
      })
    )

    return data
  } catch (err) {
    console.error(err)
    throw error(404, 'Not found')
  }
}

export const actions = {
  async booking({ fetch, request }) {
    const data = await request.formData()

    const groups = {}
    for (const [key, value] of data.entries()) {
      const [group, name] = key.split(':')
      if (!groups[group]) groups[group] = {}
      groups[group][name] = value
    }

    const res = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': POSTMARK_API_TOKEN
      },
      body: JSON.stringify({
        MessageStream: 'outbound',
        To: 'info@ungaklara.se',
        From: 'ungaklara.se <bokning@ungaklara.se>',
        Subject: 'Bokningsförfrågan',
        TextBody: Object.entries(groups).reduce((acc, [key, value]) => {
          acc += `\n${key}\n`
          acc += Object.entries(value).reduce((acc, [key, value]) => {
            acc += `${key}: ${value}\n`
            return acc
          }, '')
          return acc
        }, ''),
        HtmlBody: `
          <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html
            xmlns="http://www.w3.org/1999/xhtml"
            xmlns:v="urn:schemas-microsoft-com:vml"
            xmlns:o="urn:schemas-microsoft-com:office:office">
            <head>
              <meta
                http-equiv="Content-Type"
                content="text/html charset=UTF-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta name="format-detection" content="telephone=no" />
              <meta name="x-apple-disable-message-reformatting" />
              <title></title>
              <!--[if gte mso 9]>
                <xml>
                  <o:OfficeDocumentSettings>
                    <o:AllowPNG />
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                  </o:OfficeDocumentSettings>
                </xml>
              <![endif]-->
              <style>
                @media only screen and (max-width: 480px) {
                  @-ms-viewport {
                    width: 320px;
                  }
                  @viewport {
                    width: 320px;
                  }
                }

                /* CLIENT-SPECIFIC STYLES */
                body,
                table,
                td,
                a {
                  -webkit-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
                }

                /* Prevent WebKit and Windows mobile changing default text sizes */
                table,
                td {
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                }

                table,
                tr,
                td {
                  border-collapse: collapse !important;
                }

                /* Remove spacing between tables in Outlook 2007 and up */
                img {
                  -ms-interpolation-mode: bicubic;
                }

                /* RESET STYLES */
                img {
                  border: 0;
                  height: auto;
                  line-height: 100%;
                  outline: none;
                  text-decoration: none;
                  -ms-interpolation-mode: bicubic;
                }

                body {
                  height: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  width: 100% !important;
                }

                /* iOS BLUE LINKS */
                a[x-apple-data-detectors] {
                  color: inherit !important;
                  text-decoration: none !important;
                  font-size: inherit !important;
                  font-family: inherit !important;
                  font-weight: inherit !important;
                  line-height: inherit !important;
                }

                a[x-apple-data-detectors] {
                  color: inherit !important;
                  text-decoration: none !important;
                }

                #outlook a {
                  padding: 0;
                }
              </style>
            </head>
            <body
              style="width: 100% !important; margin: 0 !important; padding: 0 !important; mso-line-height-rule: exactly; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
              <div
                style="display: none !important; visibility: hidden; opacity: 0; overflow: hidden; mso-hide: all; height: 0; width: 0; max-height: 0; max-width: 0; font-size: 1px; line-height: 1px; color: #1F1F22;">
                Skickat via bokningsformulär på ungaklara.se
              </div>
              <div
                style="display: none !important; visibility: hidden; opacity: 0; overflow: hidden; mso-hide: all; height: 0; width: 0; max-height: 0; max-width: 0;">
                ‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;
              </div>
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                <tbody>
                  <tr>
                    <td style="padding: 0 20px;">
                      ${Object.entries(groups).reduce(
                        (acc, [key, value], index) => {
                          if (!index) acc += '<br /><br />'
                          acc += `<strong>${key}</strong>`
                          acc += Object.entries(value).reduce(
                            (acc, [key, value]) => {
                              acc += `<br /><strong>${key}:</strong> ${value}`
                              return acc
                            },
                            ''
                          )
                          return acc
                        },
                        ''
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </body>
          </html>
        `
      })
    })

    if (res.status !== 200) {
      return fail(500, { booking: { success: false } })
    }

    return { booking: { success: true } }
  }
}
