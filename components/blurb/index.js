var html = require('choo/html');
var { i18n, loader } = require('../base');

var text = i18n();

module.exports = blurb;
module.exports.loading = loading;

function blurb(props) {
	var attrs;
	if (props.link) {
		attrs = { href: props.link.href };
		if (props.external) {
			attrs.target = '_blank';
			attrs.rel = 'noopener noreferrer';
		}
	}
	return html`
		<div class="Blurb">
			${props.heading ? html`<h2 class="u-spaceB1 u-textLabel">${props.heading}</h2>` : null}
			<div class="Blurb-body">
				<div class="Text Text--large">${props.body}</div>
			</div>
			${attrs
				? html` <a class="Blurb-link" ${attrs}>${props.link.text || text`Read more`}</a> `
				: null}
		</div>
	`;
}

function loading() {
	return html`
		<div class="Blurb is-loading">
			<h2 class="u-spaceB1 u-textLabel">${loader(6)}</h2>
			<div class="Blurb-body">
				<div class="Text Text--large">${loader(38)}</div>
			</div>
			<span class="Blurb-link">${loader(4)}</span>
		</div>
	`;
}
