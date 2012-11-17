(function ($) {
	"use strict";

	$.fn.missing = function () {
		return !this.length;
	};

	$.fn.exists = function () {
		return !$.fn.missing();
	};
}(jQuery));