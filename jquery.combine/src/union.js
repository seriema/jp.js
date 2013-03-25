(function($) {
	'use strict';

	/* Union of the sets A and B, denoted A ∪ B, is the set of all objects that are a member of A, or B, or both.
	 * The union of {1, 2, 3} and {2, 3, 4} is the set {1, 2, 3, 4} .
	 */
	// Implementation taken from Underscore.js Version (1.4.4)
	$.union = function () {
		var destination = $.extend({}, arguments[0]);
		var args = [].slice.call(arguments, 1);
		var length = args.length;

		for (var i = 0; i < length; i++) { // incrementing for-loop, because order matters for union
			var source = args[i];
			for (var prop in source)
				if (source.hasOwnProperty(prop))
					destination[prop] = source[prop];
		}

		return destination;
	};

/*
	// Implementation taken from jQuery JavaScript Library v1.9.0, it supports recursion (deep copy) but look at how much code that requires!
	$.union = function (obj) {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !$.isFunction(target) ) {
			target = {};
		}

		// return argument if only one argument is passed
		if ( length === i ) {
			return target;
		}

		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( $.isPlainObject(copy) || (copyIsArray = $.isArray(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && $.isArray(src) ? src : [];

						} else {
							clone = src && $.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = $.union( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	}; */

}(jQuery));

