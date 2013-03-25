(function($) {
	'use strict';

	module('Difference.common');

	test('Does not modify first parameter', function () {
		var u = { foo: 'baz', bar: 'abc' };
		var a = { foo: 'baz' };
		var original = $.extend({}, u);

		$.difference(u, a);

		deepEqual(u, original);
	});

	test('Does not modify second parameter', function () {
		var u = { foo: 'baz', bar: 'abc' };
		var a = { foo: 'baz' };
		var original = $.extend({}, a);

		$.difference(u, a);

		deepEqual(a, original);
	});

	test('No parameters returns empty object', function () {
		var result = $.difference();

		deepEqual(result, {});
	});

	test('One parameter returns that parameter', function () {
		var u = { foo: 'baz', bar: 'abc' };
		var original = $.extend({}, u);
		var result = $.difference(u);

		deepEqual(result, original);
	});


	module('Difference.simple');

	test('Property on left, no property on right, gives left value', function () {
		var u = { prop: 'value' };
		var a = {};
		var result = $.difference(u, a);

		deepEqual(result, u);
	});

	test('No property on left, property on right, gives empty object', function () {
		var u = {};
		var a = { prop: 'value' };
		var result = $.difference(u, a);

		deepEqual(result, {});
	});

	test('No values on objects, gives empty object', function () {
		var u = {};
		var a = {};
		var result = $.difference(u, a);

		deepEqual(result, {});
	});

	test('Property on left and other property on right, gives left property', function () {
		var u = { prop1: 'foo' };
		var a = { prop2: 'bar' };
		var result = $.difference(u, a);

		deepEqual(result.prop1, u.prop1);
		ok(!result.prop2);
	});

	test('One value on left and other value on right, gives empty object', function () {
		var u = { prop: 'foo' };
		var a = { prop: 'bar' };
		var result = $.difference(u, a);

		deepEqual(result, {});
	});

	test('Two objects returns difference', function () {
		var u = { one: 1, two: 2 };
		var a = { one: 1, three: 3 };
		var expected = { two: 2 };

		var result = $.difference(u, a);

		deepEqual(result, expected);
	});


	module('Difference.multiple');

	test('Three simple objects returns difference of the first against the rest', function () {
		var u = { one: 1, two: 2, three: 3 };
		var a = { two: 2 };
		var b = { three: 3 };
		var expected = { one: 1 };
		var result = $.difference(u, a, b);

		deepEqual(result, expected);
	});

	test('Three objects returns difference of the first against the rest', function () {
		var u = { one: 1, two: 2, three: 3 };
		var a = { two: 2, four: 4 };
		var b = { three: 3, five: 5 };
		var expected = { one: 1 };
		var result = $.difference(u, a, b);

		deepEqual(result, expected);
	});

	test('Four simple objects gives difference of all four', function () {
		var u = { one: 1, two: 2, three: 3, four: 4  };
		var a = { two: 2 };
		var b = { three: 3 };
		var c = { four: 4 };
		var expected = { one: 1 };
		var result = $.difference(u, a, b, c);

		deepEqual(result, expected);
	});
}(jQuery));