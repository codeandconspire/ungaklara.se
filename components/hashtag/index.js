var html = require('choo/html');
var nanoraf = require('nanoraf');
var Component = require('choo/component');
var { vh } = require('../base');

module.exports = class Hashtag extends Component {
	constructor(id, state, emit) {
		super(id);
		this.local = state.components[id] = { id };
	}

	update(text, href) {
		return false;
	}

	load(element) {
		var inview;
		var offset, height;
		var onscroll = nanoraf(function () {
			var { scrollY } = window;
			if (scrollY > offset + height) {
				if (inview) element.style.setProperty('--Hashtag-offset', 1);
				return;
			}
			if (scrollY + vh() < offset) {
				if (inview) element.style.setProperty('--Hashtag-offset', 0);
				return;
			}
			var ratio = 1 - (offset + height - scrollY) / (vh() + height);
			element.style.setProperty('--Hashtag-offset', ratio.toFixed(3));
			inview = true;
		});
		var onresize = nanoraf(function () {
			height = element.offsetHeight;
			offset = element.offsetTop;
			var parent = element;
			while ((parent = parent.offsetParent)) offset += parent.offsetTop;
			onscroll();
		});

		onresize();
		onscroll();
		window.addEventListener('resize', onresize);
		window.addEventListener('scroll', onscroll, { passive: true });
		return function () {
			window.removeEventListener('resize', onscroll);
			window.removeEventListener('scroll', onscroll);
		};
	}

	createElement(text, href, opts = {}) {
		this.local.text = text;
		this.local.href = href;

		var children = html`
			<svg class="Hashtag-image" width="250" height="250" viewBox="0 0 250 250">
				<g fill="none" fill-rule="nonzero">
					<path
						id="${this.local.id}-path"
						d="M125.5 216a90.5 90.5 0 1 1 0-181 90.5 90.5 0 0 1 0 181zm0-1a89.5 89.5 0 1 0 0-179 89.5 89.5 0 0 0 0 179z"
					/>
				</g>
				<text width="250" height="250" class="Hashtag-text">
					<textPath alignment-baseline="top" xlink:href="#${this.local.id}-path">#${text}</textPath>
				</text>
			</svg>
		`;

		var attrs = {
			id: this.local.id,
			class: 'Hashtag'
		};

		if (href) {
			attrs.href = href;
			if (opts.target) {
				attrs.target = opts.target;
				if (opts.target === '_blank') attrs.rel = 'noopener noreferrer';
			}
			return html`<a ${attrs}>${children}</a>`;
		}

		return html`<div ${attrs}>${children}</div>`;
	}
};
