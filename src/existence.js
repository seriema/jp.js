jQuery.fn.missing = function () { return !this.length; };
jQuery.fn.exists = function () { return !jQuery.fn.missing(); };
