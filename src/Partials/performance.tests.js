(function () {
    module('Performance tests for jsperf.com');

    var partials = ['ajax-inplace-edit', 'ajax-simple-action', 'ajax-toggle-button', 'ajax-tooltip-confirm', 'ajax-tooltip-input', 'ajax-tooltip-select', 'ajax-tooltip-text', 'alert-box', 'article-action-list', 'article-quantity-picker', 'checkout-delivery', 'checkout-order-box', 'form-autocomplete', 'form-checkbox-tree', 'form-date', 'form-submit', 'generate-pricefile', 'image-gallery', 'tabular-view', 'tooltip', 'article-list', 'article-list-edit', 'article-configuration', 'checkout', 'content-navigation', 'header', 'form', 'products-listing', 'register', 'shop-box-landscape', 'shopping-list-details-shared', 'shopping-list-details', 'user-group-management', 'user-management'];

    var registered = [];
    QUnit.testStart(function() {
        registered = [];
    });

    var registerPartial = function (name, $element) {
        registered.push({
            name:name,
            element:$element
        });
    };

    var mapper = {};
    for (var a = 0, b = partials.length; a < b; ++a) {
        mapper[partials[a]] = registerPartial;
    }

    var _classSelector = function (selector) {
        if (document.getElementsByClassName)
            return document.getElementsByClassName(selector);
        else if (document.querySelectorAll)
            return document.querySelectorAll(selector);
        else
            $(selector);
    };
    var _classPrefix = document.getElementsByClassName ? 'partial-' : '.partial-';

    var _attrSelector = function (selector) {
        if (document.querySelectorAll)
            return document.querySelectorAll(selector);
        else
            $(selector);
    };

    test('Class - 1 lookup - jQuery', function () {
        $('[class*="partial-"]').each(function () {
            var found = $(this).attr('class').split(' ');
            for (var i = 0, j = found.length; i < j; ++i) {
                var name = found[i].substring(8);
                var constructor = mapper[name];
                constructor && constructor(name);
            }
        });

        strictEqual(registered.length, 0);
    });

    test('Class - n lookups - jQuery', function () {
        for (var i = partials.length; i--;) {
            $('.partial-' + partials[i]).each(function () {
                var constructor = mapper[partials[i]];
                constructor && constructor(partials[i], $(this));
            });
        }

        strictEqual(registered.length, 0);
    });

    test('Class - n lookups - vanilla', function () {
        for (var i = partials.length; i--;) {
            var matches = _classSelector(_classPrefix + partials[i]);
            for (var m = matches.length; m--;) {
                var constructor = mapper[partials[i]];
                constructor && constructor(partials[i], $(matches[m]));
            }
        }

        strictEqual(registered.length, 0);
    });

    test('Data-attribute - 1 lookup - jQuery', function () {
        $('[data-partial]').each(function () {
            var found = $(this).data('partial').split(' ');
            for (var i = found.length; i--;) {
                var constructor = mapper[found[i]];
                constructor && constructor(found[i], $(this));
            }
        });

        strictEqual(registered.length, 0);
    });

    test('Data-attribute - 1 lookup - vanilla', function () {
        var found = _attrSelector('data-partial');
        for (var i = found.length; i--;) {
            var matches = found[i].getAttribute('data-partial').split(' ');
            for (var m = matches.length; m--;) {
                var constructor = mapper[matches[m]];
                constructor && constructor(matches[m], $(found[i]));
            }
        }

        strictEqual(registered.length, 0);
    });

    test('Data-attribute - n lookups - jQuery', function () {
        for (var i = partials.length; i--;) {
            var matches = $('[data-partial*="' + partials[i] + '"]');
            var constructor = mapper[partials[i]];
            matches.each(function () {
                constructor && constructor(partials[i], $(this));
            });
        }

        strictEqual(registered.length, 0);
    });

    test('Data-attribute - n lookups - vanilla', function () {
        for (var i = partials.length; i--;) {
            var matches = _attrSelector('[data-partial*="' + partials[i] + '"]');
            for (var m = matches.length; m--;) {
                var constructor = mapper[partials[i]];
                constructor && constructor(partials[i], $(matches[m]));
            }
        }

        strictEqual(registered.length, 0);
    });

}());