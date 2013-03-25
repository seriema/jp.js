(function($) {
	module('Difference.common');

	test('Does not modify first parameter', function () {
		var a = { foo: "baz", bar: "abc" };
		var b = { foo: "baz" };
		var original = $.extend({}, a);

		$.difference(a, b);

		deepEqual(a, original);
	});

	test('No parameters returns empty object', function () {
		var result = $.difference();

		deepEqual(result, {});
	});

	test('One parameter returns that parameter', function () {
		var a = { foo: "baz", bar: "abc" };
		var original = $.extend({}, a);
		var result = $.difference(a);

		deepEqual(result, original);
	});

	module('Difference.simple');

	test('Value on left, no value on right, gives left value', function () {
		var a = { prop: "value" };
		var b = {};
		var result = $.difference(a, b);

		deepEqual(result, a);
	});

	test('No value on left, value on right, gives no value', function () {
		var a = {};
		var b = { prop: "value" };
		var result = $.difference(a, b);

		deepEqual(result, {});
	});

	test('No values on objects, gives empty object', function () {
		var a = {};
		var b = {};
		var result = $.difference(a, b);

		deepEqual(result, {});
	});

	test('Property on left and other property on right, gives left property', function () {
		var a = { prop1: "foo" };
		var b = { prop2: "bar" };
		var result = $.difference(a, b);

		deepEqual(result.prop1, a.prop1);
		ok(!result.prop2);
	});

	test('One value on left and other value on right, gives empty object', function () {
		var a = { prop: "foo" };
		var b = { prop: "bar" };
		var result = $.difference(a, b);

		deepEqual(result, {});
	});

	test('Two objects returns difference', function () {
		var a = { foo: "abc", bar: "cde" };
		var b = { bar: "fgh" };
		var expected = { foo: "abc" };
		var result = $.difference(a, b);

		deepEqual(result, expected);
	});

	module('Difference.multiple');

	test('Three simple objects returns difference of all three', function () {
		var a = { one: 1, two: 2, three: 3 };
		var b = { two: 2 };
		var c = { three: 3 };
		var expected = { one: 1 };
		var result = $.difference(a, b, c);

		deepEqual(result, expected);
	});
/*
	test('Three objects returns difference of all three', function () {
		var a = { one: 1, two: 2, three: 3 };
		var b = { two: 2, four: 4 };
		var c = { three: 3, five: 5 };
		var expected = { one: 1, four: 4, five: 5 };
		var result = $.difference(a, b, c);

		deepEqual(result, expected);
	});

	test('Three simple objects where only one has a property, returns that property', function () {
		var a = { };
		var b = { foo: 'bar' };
		var c = { };
		var expected = { foo: 'bar' };
		var result = $.difference(a, b, c);

		deepEqual(result, expected);
	});
*/
	test('Four simple objects gives difference of all four', function () {
		var a = { one: 1, two: 2, three: 3, four: 4  };
		var b = { two: 2 };
		var c = { three: 3 };
		var d = { four: 4 };
		var expected = { one: 1 };
		var result = $.difference(a, b, c, d);

		deepEqual(result, expected);
	});
}(jQuery));