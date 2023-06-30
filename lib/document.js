var dedent = require('dedent')
var hyperstream = require('hstream')

module.exports = document

function document () {
  return hyperstream({
    'meta[name="viewport"]': {
      content: 'width=device-width, initial-scale=1, viewport-fit=cover'
    },
    head: {
      _appendHtml: dedent`
        <meta property="og:site_name" content="Unga Klara">
        <link rel="dns-prefetch" href="https://unga-klara.cdn.prismic.io">
        <script>
          document.documentElement.setAttribute('scripting-enabled', '');
          window.onerror = function () {
            document.documentElement.removeAttribute('scripting-enabled');
            document.documentElement.setAttribute('scripting-initial-only', '');
          }
        </script>
        <link rel="shortcut icon" href="/favicon.ico">
        <link rel="apple-touch-icon" href="/icon.png">
        ${process.env.NODE_ENV === 'production' ? dedent`
          <!-- Google tag (gtag.js) -->
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-YEB7ZNVP3M"></script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-YEB7ZNVP3M');
          </script>
        ` : ''}
      `
    },
    body: {
      _appendHtml: dedent`
        <script>
          document.documentElement.setAttribute('style', '--theme-color: ' + window.initialState.meta['theme-color']);
        </script>
      `
    }
  })
}
