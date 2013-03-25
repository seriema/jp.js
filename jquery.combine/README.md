# jquery.combine

Combine regular JS objects using basic set theory: union, intersection, difference, and symmetric difference.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/seriema/jp.js/master/jquery.combine/dist/jquery.combine.min.js
[max]: https://raw.github.com/seriema/jp.js/master/jquery.combine/dist/jquery.combine.js

In your web page:

```html
<script src="libs/jquery/jquery.js"></script>
<script src="dist/jquery.combine.min.js"></script>
```

## Documentation
_(Coming soon)_

## Examples

### Union
Union is pretty much the same as $.extend() in regular jQuery.
```javascript
var a = { one: 1, two: 2 };
var b = { one: 1, three: 3 };

var result = $.union(a, b);  // { one: 1, two: 2, three: 3 }
```

### Intersection
```javascript
var a = { one: 1, two: 2 };
var b = { one: 1, three: 3 };

var result = $.intersection(a, b); // { one: 1 }
```

### Difference
```javascript
var u = { one: 1, two: 2 };
var a = { one: 1, three: 3 };

var result = $.difference(u, a); // { two: 2 }
```

### Symmetric difference
```javascript
var a = { one: 1, two: 2 };
var b = { one: 1, three: 3 };

var result = $.symmetric(a, b); // { two: 2, three: 3 }
```



## Release History
v0.0.1 - 25 March 2013 - Completed library code and basic documentation.
