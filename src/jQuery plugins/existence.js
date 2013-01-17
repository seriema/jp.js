(function ($) {
	"use strict";

	$.fn.missing = function () {
		return !this.length;
	};

	$.fn.exists = function () {
		return !this.missing();
	};
}(jQuery));