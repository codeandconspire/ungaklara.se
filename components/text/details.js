var html = require('choo/html');

module.exports = details;

function details(summary, body) {
	return html`
		<details>
			<summary onclick=${onclick}>${summary}</summary>
			${body}
		</details>
	`;

	function onclick(event) {
		var parent = event.currentTarget.parentElement;
		window.requestAnimationFrame(function () {
			if (parent.open) parent.scrollIntoView(true);
		});
	}
}
