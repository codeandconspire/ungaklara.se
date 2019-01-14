module.exports = config

function config (ctx) {
  var plugins = [require('postcss-focus-visible')]
  if (ctx.env !== 'development') {
    plugins.push(require('postcss-custom-properties'))
  }

  return { plugins }
}
