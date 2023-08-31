var html = require('choo/html');
var { i18n } = require('../base');

var text = i18n();

module.exports = facts;

// themed facts box
// arr -> Element
function facts(items) {
	var count = items.length;
	return html`
		<section class="FactsBox">
			<h2 class="FactsBox-heading">${text`Facts`}</h2>
			<dl class="FactsBox-list">
				${items.map(function (item, index) {
					var cols;
					if (count >= 6) cols = 3;
					if (count <= 4) cols = count;
					if (count === 5) cols = index < 4 ? 3 : 2;
					return html`
						<div
							class="FactsBox-cell u-md-size1of${Math.max(
								2,
								Math.floor(cols / 2)
							)} u-lg-size1of${cols}"
						>
							<dt class="FactsBox-label">${item.label}</dt>
							<dd class="FactsBox-value">${item.text}</dd>
						</div>
					`;
				})}
			</dl>
		</section>
	`;
}
