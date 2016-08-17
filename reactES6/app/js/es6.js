
if (!Object.assign) {
	Object.assign = function() {

		if (arguments.length === 0) {
			return null;
		}

		let target = arguments[0] || {};

		for (var i = 1; i < arguments.length; i++) {

			var source = arguments[i];

			for (var name in source) {
				target[name] = source[name];
			}
		}

		return target;
	};
}

if (!window.Symbol) {
	window.Symbol = {
		iterator: "Symbol.iterator"
	};

	Array.prototype[Symbol.iterator] = function() {

		var target = this;

		var index = 0;

		return {
			next: function() {

				var value = target[index];

				index++;

				return {
					value: value,
					done: index >= target.length
				};
			}
		};

	};

}
