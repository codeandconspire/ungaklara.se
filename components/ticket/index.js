var html = require('choo/html')
var sv = require('date-fns/locale/sv')
var format = require('date-fns/format')
var isToday = require('date-fns/is_today')
var isTomorrow = require('date-fns/is_tomorrow')
var symbol = require('../symbol')
var { i18n, timestamp, capitalize } = require('../base')

var text = i18n()

module.exports = ticket

function ticket (props, onclick = null) {
  var day
  if (isToday(props.date)) day = text`Today`
  else if (isTomorrow(props.date)) day = text`Tomorrow`
  else day = format(props.date, 'dddd', { locale: sv })

  var status = getStatus(props.status)

  return html`
    <article class="Ticket ${props.status === 3 ? 'Ticket--disabled' : ''}">
      <div class="Ticket-everything u-paddedBox">
        <div class="Ticket-main">
          <div>
            <strong class="Ticket-day">${capitalize(day)}</strong>
            ${status ? html`<span class="Ticket-status Ticket-status--${props.status} u-textLabel">${status}</span>` : null}
          </div>
          <time datetime="${JSON.stringify(props.date).replace(/^"|"$/, '')}">
            <span class="Ticket-date">${props.date.getDate()}</span>
            <br>
            <span class="Ticket-month u-textLabel">${format(props.date, 'MMMM', { locale: sv })}</span>
          </time>
        </div>
        <div class="Ticket-details">
          <div>
            <span class="Ticket-detail"><span class="Ticket-icon">${symbol.clock()}</span> ${timestamp(props.date)}</span>
            <br>
            <span class="Ticket-detail"><span class="Ticket-icon">${symbol.location()}</span> ${props.location}</span>
            ${props.misc ? html`
              <br>
              <span class="Ticket-detail"><span class="Ticket-icon">${symbol.check()}</span> ${props.misc}</span>
            ` : null}
          </div>
          ${props.status !== 3 && props.href ? html`
            <a class="Ticket-link" href="${props.href}" target="_blank" rel="noopener noreferrer" onclick=${onclick}>
              ${symbol.arrow()} <span class="u-hiddenVisually">${text`Buy ticket`}</span>
            </a>
          ` : null}
        </div>
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
