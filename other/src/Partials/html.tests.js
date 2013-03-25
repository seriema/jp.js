module('HTML validation');

test( "Same amount of partials found with classes as with data-attributes", function() {
    var withClass = $('[class^="partial-"]');
    var withAttr = $('[data-partial]');

    ok(withClass.length === withAttr.length);
});

test( "All with class also has data-attribute", function() {
    expect(0);

    var withClass = $('[class^="partial-"]');
    var withAttr = $('[data-partial]');

    withClass.each(function () {
        var matched = false;
        var wClass = $(this);
        withAttr.each(function () {
            if (wClass[0] === $(this)[0]) {
                matched = true;
                return false;
            }
        });
        if(!matched)
            ok(false, "Didn't find element with classes: " + wClass.attr('class'));
    });
});

test( "All with data-attribute also has class", function() {
    expect(0);

    var withClass = $('[class^="partial-"]');
    var withAttr = $('[data-partial]');

    withAttr.each(function () {
        var matched = false;
        var wAttr = $(this);
        withClass.each(function () {
            if (wAttr[0] === $(this)[0]) {
                matched = true;
                return false;
            }
        });
        if (!matched)
            ok(false, "Didn't find element with data-attributes: " + wAttr.attr('data-partial'));
    });
});
