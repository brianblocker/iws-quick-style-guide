var $ = require('jquery');

function ScrollerCoaster (elements, options) {
  if (! (this instanceof ScrollerCoaster)) {
    return new ScrollerCoaster(elements, options);
  }

  options = options || {};

  this.elements     = Array.isArray(elements) ? elements : [elements];
  this.current      = $(window).scrollTop();
  this.start        = 0;
  this.steps        = options.steps || 150;

  this.calculateScrollPosition().step(0);
}

ScrollerCoaster.prototype.getTop = function getTop () {
  return $(this.elements[0]).offset().top || 0;
};

ScrollerCoaster.prototype.getTotalHeight = function getTotalHeight () {
  var height = 0;

  this.elements.forEach(function (el) {
    height += $(el).outerHeight();
  });

  return height;
};

ScrollerCoaster.prototype.calculateScrollPosition = function calculateScrollPosition () {
  var window_height = $(window).height();
  var mid           = window_height / 2;
  var top           = this.getTop();
  var height        = this.getTotalHeight();
  var destination   = height > window_height ? top : top - mid + height - (height / 2)

  this.diff = destination - this.current;

  return this;
};

ScrollerCoaster.prototype.step = function step (timestamp) {
  var progress;
  var percent;

  this.start  = this.start || timestamp;
  progress    = timestamp - this.start;
  percent     = Math.min(progress / this.steps, 1);

  scrollTo(0, this.current + (this.diff * percent));

  if (percent < 1) {
    requestAnimationFrame(this.step.bind(this));
  }
};

module.exports = ScrollerCoaster;
