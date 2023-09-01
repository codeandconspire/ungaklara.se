export const page = dedent`
  {
    ...pageFields
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
    }
  }
`

function dedent(strings, ...parts) {
  return strings.reduce((acc, str, i) => {
    return (
      acc +
      str.replace(/^\s+/gm, '\n') +
      (parts[i] || '').replace(/^\s+/gm, '\n')
    )
  }, '')
}
