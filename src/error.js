(function ($) {
	"use strict";

	var logError = function (OS, browser, version, message, url, lineNumber) {
		log = {
			'client': {
				'OS': OS,
				'browser': browser,
				'version': version
			},
			'error': {
				'message': message,
				'url': url,
				'lineNumber': lineNumber
			}
		};
		
		// send error to server somewhere
	}

	window.onerror = function(message, url, lineNumber) {
		if (!window.browserDetect) {
			window.browserDetect = BrowserDetect;
			window.browserDetect.init();
		}
		
		logError(window.browserDetect.OS, window.browserDetect, window.browserDetect.version, message, url, lineNumber);

		return true; // prevents browser error messages
	};
}());

