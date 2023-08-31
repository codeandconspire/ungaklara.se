var { hexToRgb, luma } = require('../components/base');

module.exports = ui;

function ui(state, emitter) {
	state.ui = {
		isLoading: false
	};

	if (typeof window !== 'undefined') {
		emitter.on('meta', function (props) {
			var theme = props['theme-color'];
			var rgb = theme && hexToRgb(theme);
			if (rgb) {
				document.documentElement.style.setProperty('--theme-color', rgb);
				if (luma(theme) < 110) {
					document.documentElement.style.setProperty('--theme-color-is-dark', '255, 255, 255');
				} else {
					document.documentElement.style.removeProperty('--theme-color-is-dark');
				}
			} else {
				document.documentElement.style.removeProperty('--theme-color');
				document.documentElement.style.removeProperty('--theme-color-is-dark');
			}
		});
	}

	var queue = 0;
	emitter.on('prismic:request', function () {
		queue++;
		state.ui.isLoading = true;
	});
	emitter.on('prismic:response', done);
	emitter.on('prismic:error', done);

	function done() {
		queue--;
		state.ui.isLoading = queue !== 0;
	}
}
