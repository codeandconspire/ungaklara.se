var html = require('choo/html')
var sv = require('date-fns/locale/sv')
var format = require('date-fns/format')
var isToday = require('date-fns/is_today')
var isTomorrow = require('date-fns/is_tomorrow')
var { i18n, timestamp, capitalize } = require('../base')

var text = i18n()

module.exports = ticket

function ticket (props) {
  var day
  if (isToday(props.date)) day = text`Today`
  else if (isTomorrow(props.date)) day = text`Tomorrow`
  else day = format(props.date, 'dddd', { locale: sv })

  return html`
    <article class="Ticket">
      <div class="Ticket-main">
        <strong class="Ticket-day">${capitalize(day)}</strong>
        <time datetime="${JSON.stringify(props.date).replace(/^"|"$/, '')}">
          <span class="Ticket-date">${props.date.getDate()}</span>
          <br>
          <span class="Ticket-month">${format(props.date, 'MMMM', { locale: sv })}</span>
        </time>
      </div>
      <div class="Ticket-details">
        <div>
          <span>${timestamp(props.date)}</span>
          <br>
          <span>${props.location}</span>
        </div>
        ${props.href ? html`
          <a class="Ticket-link" href="${props.href}" target="_blank" rel="noopener noreferrer">
            ${text`Buy ticket`}
          </a>
        ` : null}
      </div>
    </article>
  `
}
