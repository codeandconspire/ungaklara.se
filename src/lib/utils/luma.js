export default function luma(str) {
  var hex = str.replace(/^#/, '')
  var rgb = parseInt(hex, 16)
  var r = (rgb >> 16) & 0xff
  var g = (rgb >> 8) & 0xff
  var b = (rgb >> 0) & 0xff

  // per ITU-R BT.709
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
