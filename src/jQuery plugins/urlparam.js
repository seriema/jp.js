(function ($) {
	"use strict";

	var getUrlParameter = function (name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
	};

	var setUrlParameter = function (name, value) {
		var queries = window.location.search;
		var currentValue = $.urlParam(name);
		var newQuery = name + '=' + value;

		if (currentValue) {
			window.location.search = queries.replace(name + '=' + currentValue, newQuery);
		}
		else {
			if (queries)
				window.location.search = queries + '&' + newQuery;
			else
				window.location.search = '?' + newQuery;
		}
	};


	$.urlParam = function (name, value) {
		if (value === undefined) {
			return getUrlParameter(name);
		}
		else {
			setUrlParameter(name, value);
			return this;
		}
	};
})(jQuery);