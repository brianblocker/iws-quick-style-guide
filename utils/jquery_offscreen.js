var $       = require('_jquery');
var $window = $(window);

module.exports = $.extend($.expr[':'], {
  'offscreen-top': function (el) {
    return $(el).offset().top < $window.scrollTop();
  },
  'offscreen-right': function (el) {
    var $el = $(el);

    return $el.offset().left + $el.outerWidth() - $window.scrollLeft() > $window.width();
  },
  'offscreen-bottom': function (el) {
    var $el = $(el);

    return $el.offset().top + $el.outerHeight() - $window.scrollTop() > $window.height();
  },
  'offscreen-left': function (el) {
    return $(el).offset().left < $window.scrollLeft();
  }
});
