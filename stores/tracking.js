/* global gtag */

module.exports = tracking

function tracking (state, emitter) {
  if (typeof gtag !== 'function') return

  emitter.on('navigate', function () {
    gtag('config', 'UA-129657568-1', {
      'page_title': state.title,
      'page_path': state.href
    })
  })

  emitter.on('track:purchase', function (value) {
    gtag('event', 'purchase', {
      'event_category': 'Tickets',
      'event_label': 'Buy ticket',
      'value': value
    })
  })

  emitter.on('track:view_item', function (value, category, label) {
    gtag('event', 'view_item', {
      'event_category': category,
      'event_label': label,
      'value': value
    })
  })

  emitter.on('track:view_item_list', function (value, category, label) {
    gtag('event', 'view_item_list', {
      'event_category': category,
      'event_label': label,
      'value': value
    })
  })
}
