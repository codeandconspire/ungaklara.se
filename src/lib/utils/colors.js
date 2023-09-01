// convert hex color code to rgb value
// str -> arr

export function hexToRgb(hex) {
	// expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)].join(', ')
		: null;
}

// get color ligtness from hex
// str -> num
export function luma(str) {
	var hex = str.replace(/^#/, '');
	var rgb = parseInt(hex, 16);
	var r = (rgb >> 16) & 0xff;
	var g = (rgb >> 8) & 0xff;
	var b = (rgb >> 0) & 0xff;

	// per ITU-R BT.709
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
