var html = require('choo/html');
var { Elements } = require('prismic-richtext');
var embed = require('../embed');
var { srcset, resolve, filetype } = require('../base');

module.exports = serialize;

function serialize(type, node, content, children) {
	switch (type) {
		case Elements.embed: {
			const provider = node.oembed.provider_name.toLowerCase();
			const id = embed.id(node.oembed);
			if (!id) return null;

			return embed({
				url: node.oembed.embed_url,
				title: node.oembed.title,
				src: `/media/${provider}/w_900/${id}`,
				width: node.oembed.thumbnail_width,
				height: node.oembed.thumbnail_height,
				sizes: '39em',
				srcset: srcset(id, [400, 900, 1800], { type: provider })
			});
		}
		case Elements.image: {
			const sizes = [400, 600, 800, 1200].map(function (size, index) {
				return Math.min(size, node.dimensions.width * (index + 1));
			});
			let src = node.url;
			const attrs = { alt: node.alt || '' };
			if (!/\.svg$/.test(node.url)) {
				attrs.sizes = '39em';
				attrs.srcset = srcset(node.url, sizes);
				src = srcset(node.url, [800]).split(' ')[0];
			}
			return html`
				<figure>
					<img ${attrs} src="${src}" />
					${node.copyright
						? html`
								<figcaption>
									<small class="Text-muted">${node.copyright}</small>
								</figcaption>
						  `
						: null}
				</figure>
			`;
		}
		case Elements.hyperlink: {
			const attrs = { href: resolve(node.data) };
			if (node.data.url && filetype(node.data.url)) attrs.download = '';
			if (node.data.target && node.data.target === '_blank') {
				attrs.target = node.data.target;
				if (node.data.target === '_blank') {
					attrs.rel = 'noopener noreferrer';
				}
			}
			return html`<a ${attrs}>${children}</a>`;
		}
		case Elements.paragraph: {
			var rule = new RegExp('^[--]+$').test(node.text);
			if (rule) {
				return html`<hr />`;
			}
			return html`<p>${children}</p>`;
		}
		default:
			return null;
	}
}
