var fs = require('fs');
var path = require('path');

var TEMPLATE = fs.readFileSync(path.resolve(__dirname, 'template.png'));

module.exports = favicon;

function favicon(state, emitter) {
	if (typeof window === 'undefined') return;
	var link = document.head.querySelector('link[rel="shortcut icon"]');
	if (!link) return;

	var image = new window.Image();
	image.onload = init;
	image.src = [
		'data:image/png;base64',
		window.btoa(String.fromCharCode.apply(null, TEMPLATE))
	].join(',');

	function init() {
		var orgiHref = link.getAttribute('href');
		var origType = link.getAttribute('type');

		if (state.meta['theme-color']) {
			try {
				link.setAttribute('href', draw(image, state.meta['theme-color']));
				link.setAttribute('type', 'image/png');
			} catch (err) {}
		}

		emitter.on('meta', function (props) {
			var color = props['theme-color'];
			var href = orgiHref;
			var type = origType;
			if (color) {
				try {
					href = draw(image, color);
					type = 'image/png';
				} catch (err) {}
			}
			link.setAttribute('href', href);
			link.setAttribute('type', type);
		});
	}
}

// get image tinted with color as base64
// (Image, str) -> str
function draw(image, color) {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');

	canvas.width = 32;
	canvas.height = 32;

	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
	ctx.globalCompositeOperation = 'source-in';
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	return canvas.toDataURL();
}
