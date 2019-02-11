var html = require('choo/html')

var SPOTIFY_URI = /(\w+)(?:\/|:)(\w+)(?:$|\?|")/

module.exports = spotify

// render spotify embed
// (str, any) -> Element
function spotify (uri, body) {
  let parts = uri.match(SPOTIFY_URI)
  if (!parts) return null

  return html`
    <div class="Spotify u-paddedBox">
      <div class="Text Text--fat Text--large">
        ${body || null}
        <iframe src="https://open.spotify.com/embed/${parts[1]}/${parts[2]}" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
      </div>
    </div>
  `
}
