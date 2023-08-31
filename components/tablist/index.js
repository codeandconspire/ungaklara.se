var html = require('choo/html');

module.exports = tablist;

// render list of tabs
// (obj?, arr) -> Element
function tablist(opts, tabs) {
	if (!tabs) {
		tabs = opts;
		opts = {};
	}

	var expanded = false;
	var children = tabs.map(function (tab) {
		var attrs = { class: 'Tablist-tab' };

		if (!opts.static) {
			Object.assign(attrs, {
				role: 'tab',
				tabindex: -1,
				class: 'Tablist-tab',
				'aria-selected': 'false'
			});
		}

		Object.keys(tab).forEach(function (key) {
			if (key === 'controls') {
				attrs['aria-controls'] = tab[key];
				if (!tab.href) attrs.href = '#' + tab[key];
			} else if (key === 'selected' && tab[key]) {
				expanded = true;
				attrs.class += ' is-selected';
				if (!opts.static) {
					attrs.tabindex = 0;
					attrs['aria-selected'] = 'true';
				}
			} else if (key !== 'text') {
				attrs[key] = tab[key];
			}
		});

		if (attrs.href) return html`<a ${attrs}>${tab.text}</a>`;
		return html`<button ${attrs}>${tab.text}</button>`;
	});

	if (opts.static) return html`<nav class="Tablist">${children}</nav>`;

	return html`
		<ol class="Tablist" role="tablist" aria-expanded="${expanded ? 'true' : 'false'}">
			${children}
		</ol>
	`;
}
