/**
 * @param {string} uri
 * @param {(number|[number, string])[]} sizes
 * @param {{ type?: string, transforms?: string, aspect?: number }} [opts]
 * @returns string
 */
export function srcset(uri, sizes, opts = {}) {
  const type = opts.type || 'fetch'
  let transforms = opts.transforms
  if (!transforms) transforms = 'c_fill,f_auto,q_auto'
  if (!/c_/.test(transforms)) transforms += ',c_fill'
  if (!/f_/.test(transforms)) transforms += ',f_auto'
  if (!/q_/.test(transforms)) transforms += ',q_auto'

  // trim prismic domain from uri
  let parts = uri.split('images.prismic.io/unga-klara/')
  uri = encodeURIComponent(parts[parts.length - 1])

  return sizes
    .map(function (size) {
      let transform = transforms
      if (Array.isArray(size)) {
        transform = size[1]
        if (!/c_/.test(transform)) transform += ',c_fill'
        if (!/f_/.test(transform)) transform += ',f_auto'
        if (!/q_/.test(transform)) transform += ',q_auto'
        size = size[0]
      }
      if (opts.aspect) transform += `,h_${Math.floor(size * opts.aspect)}`

      return `/media/${type}/${transform},w_${size}/${uri} ${size}w`
    })
    .join(',')
}
