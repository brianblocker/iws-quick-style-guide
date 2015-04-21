"use strict";

var Backbone  = require('_backbone');
var _         = require('underscore');

/* jshint -W040 */
function mixer () {
  var child = this;
  var mixins = [].slice.call(arguments, 0);

  /* jshint +W040 */
  _.each(mixins, function (mixin) {
    if (! _.isFunction(mixin)) {
      throw new Error('mixin must be a function');
    }

    mixin = mixin(child);

    if(! _.isArray(mixin)) {
      mixin = [mixin];
    }

    child = child.extend(mixin[0] || {}, mixin[1] || {});
  });

  return child;
}

Backbone.Model.mixins = Backbone.Collection.mixins = Backbone.View.mixins = mixer;

module.exports = mixer;
