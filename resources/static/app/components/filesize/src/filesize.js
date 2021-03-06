/**
 * filesize
 *
 * @method filesize
 * @param  {Mixed}   arg        String, Int or Float to transform
 * @param  {Object}  descriptor [Optional] Flags
 * @return {String}             Readable file size String
 */
function filesize (arg, descriptor = {}) {
	let result = [],
		skip = false,
		val = 0,
		e, base, bits, ceil, neg, num, output, round, unix, spacer, suffixes;

	if (isNaN(arg)) {
		throw new Error("Invalid arguments");
	}

	bits = descriptor.bits === true;
	unix = descriptor.unix === true;
	base = descriptor.base !== undefined ? descriptor.base : 2;
	round = descriptor.round !== undefined ? descriptor.round : unix ? 1 : 2;
	spacer = descriptor.spacer !== undefined ? descriptor.spacer : unix ? "" : " ";
	suffixes = descriptor.suffixes !== undefined ? descriptor.suffixes : {};
	output = descriptor.output !== undefined ? descriptor.output : "string";
	e = descriptor.exponent !== undefined ? descriptor.exponent : -1;
	num = Number(arg);
	neg = num < 0;
	ceil = base > 2 ? 1000 : 1024;

	// Flipping a negative number to determine the size
	if (neg) {
		num = -num;
	}

	// Zero is now a special case because bytes divide by 1
	if (num === 0) {
		result[0] = 0;
		result[1] = unix ? "" : !bits ? "B" : "b";
	} else {
		// Determining the exponent
		if (e === -1 || isNaN(e)) {
			e = Math.floor(Math.log(num) / Math.log(ceil));
		}

		// Exceeding supported length, time to reduce & multiply
		if (e > 8) {
			e = 8;
		}

		val = base === 2 ? num / Math.pow(2, e * 10) : num / Math.pow(1000, e);

		if (bits) {
			val = val * 8;

			if (val > ceil) {
				val = val / ceil;
				e++;
			}
		}

		result[0] = Number(val.toFixed(e > 0 ? round : 0));
		result[1] = base === 10 && e === 1 ? bits ? "kb" : "kB" : si[bits ? "bits" : "bytes"][e];

		if (!skip && unix) {
			result[1] = result[1].charAt(0);

			if (b.test(result[1])) {
				result[0] = Math.floor(result[0]);
				result[1] = "";
			}
		}
	}

	// Decorating a 'diff'
	if (neg) {
		result[0] = -result[0];
	}

	// Applying custom suffix
	result[1] = suffixes[result[1]] || result[1];

	// Returning Array, Object, or String (default)
	if (output === "array") {
		return result;
	}

	if (output === "exponent") {
		return e;
	}

	if (output === "object") {
		return {value: result[0], suffix: result[1]};
	}

	return result.join(spacer);
}
