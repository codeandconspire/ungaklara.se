var html = require('choo/html');
var { srcset } = require('../base');

module.exports = figure;

function figure(opts = {}) {
	var img = opts.image;
	const sources = srcset(img.url, opts.sources);
	var aspect = null;
	const attrs = Object.assign(
		{
			class: 'Text-image',
			srcset: sources,
			sizes: opts.sizes,
			src: sources.split(' ')[0],
			alt: img.alt || ''
		},
		img.dimensions
	);
	if (img && img.dimensions.width && img.dimensions.height) {
		aspect = `--Text-figure-aspect: ${(100 * img.dimensions.height) / img.dimensions.width}%;`;
	}

	return html`
		<figure class="Text u-sizeFull">
			<div class="Text-aspect" style="${aspect}">
				<img ${attrs} />
			</div>
			${opts.caption
				? html` <figcaption class="Text-muted Text-small">${opts.caption}</figcaption> `
				: null}
		</figure>
	`;
}
