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

  var status = getStatus(props.status)

  return html`
    <article class="Ticket ${props.status === 3 ? 'Ticket--disabled' : ''}">
      <div class="Ticket-main">
        <div>
          <strong class="Ticket-day">${capitalize(day)}</strong>
          ${status ? html`<span class="Ticket-status Ticket-status--${props.status}">${status}</span>` : null}
        </div>
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
        ${props.status !== 3 && props.href ? html`
          <a class="Ticket-link" href="${props.href}" target="_blank" rel="noopener noreferrer">
            ${text`Buy ticket`}
          </a>
        ` : null}
      </div>
    </article>
  `
}

function getStatus (num) {
  switch (num) {
    case 2: return text`Few left`
    case 3: return text`Sold out`
    default: return null
  }
}
