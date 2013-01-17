module('Union');

test('Does not modify first parameter', function () {
	var a = original = { foo: "baz", bar: "abc" };
	var b = { foo: "baz" };

	$.union(a, b);

	deepEqual(a, original);
});

test('No parameters returns empty object', function () {
	var result = $.union();

	deepEqual(result, {});
});

test('One parameter returns that parameter', function () {
	var a = original = { foo: "baz", bar: "abc" };
	var result = $.union(a);

	deepEqual(result, a);
});

test('Value on left, no value on right, gives left value', function () {
	var a = { prop: "value" };
	var b = {};
	var result = $.union(a, b);

	deepEqual(result, a);
});

test('No value on left, value on right, gives right value', function () {
	var a = {};
	var b = { prop: "value" };
	var result = $.union(a, b);

	deepEqual(result, b);
});

test('No values on objects, gives empty object', function () {
	var a = {};
	var b = {};
	var result = $.union(a, b);

	deepEqual(result, {});
});

test('Property on left and property on right, gives both properties', function () {
	var a = { prop1: "foo" };
	var b = { prop2: "bar" };
	var result = $.union(a, b);

	deepEqual(result.prop1, a.prop1);
	deepEqual(result.prop2, b.prop2);
});

test('One value on left, other value on right, gives the right value', function () {
	var a = { prop: "foo" };
	var b = { prop: "bar" };
	var result = $.union(a, b);

	deepEqual(result, b);
});

test('Two objects returns union', function () {
	var a = { foo: "abc", bar: "cde" };
	var b = { baz: "fgh" };
	var expected = { foo: "abc", bar: "cde", baz: "fgh" };
	var result = $.union(a, b);

	deepEqual(result, expected);
});

test('Three objects returns union of all three', function () {
	var a = { one: 1 };
	var b = { two: 2 };
	var c = { three: 3 };
	var expected = { one: 1, two: 2, three: 3 };
	var result = $.union(a, b, c);

	deepEqual(result, expected);
});

test('Four objects gives union of all four', function () {
	var a = { one: 1 };
	var b = { two: 2 };
	var c = { three: 3 };
	var d = { four: 4 };
	var expected = { one: 1, two: 2, three: 3, four: 4 };
	var result = $.union(a, b, c, d);

	deepEqual(result, expected);
});

