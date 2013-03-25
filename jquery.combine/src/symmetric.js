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

