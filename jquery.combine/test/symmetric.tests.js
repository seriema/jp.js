(function($) {
	module('Symmetric.common');

	test('Does not modify first parameter', function () {
		var a = { foo: "abc", bar: "abc" };
		var b = { foo: "abc", baz: "def" };
		var original = $.extend({}, a);

		$.symmetric(a, b);

		deepEqual(a, original);
	});

	test('No parameters returns empty object', function () {
		var result = $.symmetric();

		deepEqual(result, {});
	});

	test('One parameter returns that parameter', function () {
		var a = { foo: "baz", bar: "abc" };
		var result = $.symmetric(a);
		var original = $.extend({}, a);

		deepEqual(result, original);
	});

	module('Symmetric.simple');

	test('Value on left, no value on right, gives left value', function () {
		var a = { prop: "value" };
		var b = {};
		var result = $.symmetric(a, b);

		deepEqual(result, a);
	});

	test('No value on left, value on right, gives right value', function () {
		var a = {};
		var b = { prop: "value" };
		var result = $.symmetric(a, b);

		deepEqual(result, b);
	});

	test('No values on objects, gives empty object', function () {
		var a = {};
		var b = {};
		var result = $.symmetric(a, b);

		deepEqual(result, {});
	});

	test('Property on left and property on right, gives both properties', function () {
		var a = { prop1: "foo" };
		var b = { prop2: "bar" };
		var result = $.symmetric(a, b);

		deepEqual(result.prop1, a.prop1);
		deepEqual(result.prop2, b.prop2);
	});

	test('One value on left, other value on right, gives empty object', function () {
		var a = { prop: "foo" };
		var b = { prop: "bar" };
		var result = $.symmetric(a, b);

		deepEqual(result, {});
	});

	test('Two objects returns symmetric difference', function () {
		var a = { foo: "abc", bar: "cde" };
		var b = { baz: "fgh" };
		var expected = { foo: "abc", bar: "cde", baz: "fgh" };
		var result = $.symmetric(a, b);

		deepEqual(result, expected);
	});

	test('Three objects returns symmetric difference of all three', function () {
		var a = { one: 1, foo: 'bar' };
		var b = { two: 2, foo: 'bar' };
		var c = { three: 3, foo: 'bar' };
		var expected = { one: 1, two: 2, three: 3 };
		var result = $.symmetric(a, b, c);

		deepEqual(result, expected);
	});
	
	test('Three simple objects with same properties returns empty object', function () {
		var a = { foo: 1 };
		var b = { foo: 2 };
		var c = { foo: 3 };
		var expected = { };
		var result = $.symmetric(a, b, c);

		deepEqual(result, expected);
	});

	test('Four objects gives symmetric difference of all four', function () {
		var a = { one: 1 };
		var b = { two: 2 };
		var c = { three: 3 };
		var d = { four: 4 };
		var expected = { one: 1, two: 2, three: 3, four: 4 };
		var result = $.symmetric(a, b, c, d);

		deepEqual(result, expected);
	});

/* TODO: Currently not supported
	module('symmetric.recursive');

	test('First paramater as "true" does a deep symmetric (recursively one level)', function () {
		var a = { foo: { one: 1, two: 2 } };
		var b = { foo: { one: 1, three: 3 } };
		var expected = { foo: { one: 1,  two: 2, three: 3 } };
		var result = $.symmetric(true, a, b);

		deepEqual(result, expected);
	});

	test('First paramater as "true" does a deep symmetric (recursively two levels)', function () {
		var a = { foo: { bar: { one: 1, two: 2 }, baz: { three: 3, four: 4 } } };
		var b = { foo: { bar: { one: 1, three: 3 }, baz: { four: 4 } } };
		var expected = { foo: { bar: { one: 1, two: 2, three: 3  }, baz: { three: 3, four: 4 } } };
		var result = $.symmetric(true, a, b);

		deepEqual(result, expected);
	});
*/
}(jQuery));