"use strict";

var Backbone  = require('backbone');
var Model     = require('./heading_model');

module.exports = Backbone.Collection.extend({
  model: Model,
  linkSiblings: function () {
    this.each(function (header, index) {
      header.prev = this.at(index - 1);
      header.next = this.at(index + 1);
    }, this);
  },
  registerWithDispatcher: function (dispatcher) {
    this.dispatch_token = dispather.register(function (payload) {
      console.log(payload);
    }.bind(this));
  }
});
