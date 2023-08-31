var html = require('choo/html');
var { i18n } = require('../base');

var text = i18n(require('./lang.json'));

module.exports = pagination;

function pagination(props) {
	return html`
		<div class="Pagination">
			<a class="Pagination-link u-textLabel" href="${props.href}" onclick=${props.onclick}
				><span class="Pagination-text">${text`Show more`}</span></a
			>
		</div>
	`;
}
