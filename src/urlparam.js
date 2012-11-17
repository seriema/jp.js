jQuery.urlParam = function (name, value) {
	if (!value)
	    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
		
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

