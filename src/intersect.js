jQuery.intersect = function (obj1, obj2) {
	var newObj = {};

	$.each(obj1, function (index, leftValues) {
		if (!obj2[index] && leftValues)
			newObj[index] = leftValues;
	});

	$.each(obj2, function(index, newValues) {
	var oldValues = obj1[index];

	if (!oldValues) {
		if (newValues)
			newObj[index] = newValues;
		return;
	}

	var oldArray = oldValues.split(',');
	var newArray = newValues.split(',');

	var result = $.map(newArray, function(newValue, i) {
		return $.inArray(newValue, oldArray) === -1 ? null : newValue;
	});

	newObj[index] = result.join();
});
