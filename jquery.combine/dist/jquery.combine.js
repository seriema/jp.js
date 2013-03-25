/*! jQuery Combine - v0.0.1 - 2013-03-25
* https://github.com/seriema/jp.js
* Copyright (c) 2013 John-Philip Johansson; Licensed MIT */
(function($) {
	/* Set difference of U and A, denoted U \ A, is the set of all members of U that are not members of A. 
	 * The set difference {1,2,3} \ {2,3,4} is {1} , while, conversely, the set difference {2,3,4} \ {1,2,3} is {4}.
	 * When A is a subset of U, the set difference U \ A is also called the complement of A in U. In this case, 
	 * if the choice of U is clear from the context, the notation Ac is sometimes used instead of U \ A, 
	 * particularly if U is a universal set as in the study of Venn diagrams.
	 */
	$.difference = function () {
		var u = $.extend({}, arguments[0]);
		var args = [].slice.call(arguments, 1);
		var i = args.length;

		while (i--) {
			var source = args[i];
			for (var prop in source)
				if (source.hasOwnProperty(prop))
					delete u[prop];
		}

		return u;
	};

}(jQuery));


(function($) {
	/* Intersection of the sets A and B, denoted A ∩ B, is the set of all objects that are members of both A and B. 
	 * The intersection of {1, 2, 3} and {2, 3, 4} is the set {2, 3} .
	 */
	$.intersection = function () {
		var result = $.extend({}, arguments[0]);
		var args = [].slice.call(arguments, 1);
		var i = args.length;

		while (i--) {
			var source = args[i];
			for (var prop in result) {
				if (source.hasOwnProperty(prop) && source[prop])
					result[prop] = source[prop];
				else
					delete result[prop];
			}
		}

		return result;
	};
}(jQuery));


(function($) {
	/* Cartesian product of A and B, denoted A × B, is the set whose members are all possible ordered pairs (a,b)
	 * where a is a member of A and b is a member of B. The cartesian product of {1, 2} and {red, white} is {(1, red),
	 * (1, white), (2, red), (2, white)}.
	 */
	$.product = function() {

	};

	/* Power set of a set A is the set whose members are all possible subsets of A. 
	 * For example, the power set of {1, 2} is { {}, {1}, {2}, {1,2} } .
	*/
	$.power = function() {

	};
}(jQuery));


(function($) {
	/* Symmetric difference of sets A and B is the set of all objects that are a member of exactly 
	 * one of A and B (elements which are in one of the sets, but not in both). For instance, 
	 * for the sets {1,2,3} and {2,3,4} , the symmetric difference set is {1,4} . It is the set difference 
	 * of the union and the intersection, (A ∪ B) \ (A ∩ B) or (A \ B) ∪ (B \ A).
	 */
	$.symmetric = function () {
		var result = {};
		var n = arguments.length;

		if (n === 1)
			return arguments[0];

		for(var i = 0; i < n; i++) {
			var source = arguments[i];
			var difference = {};
			for (var j = i+1; j < n; j++) {
				var comparison = arguments[j];
				difference = $.difference(difference, source, comparison);
			}
			result = $.union(result, difference);
		}

		return result;
	};

}(jQuery));


(function($) {
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

