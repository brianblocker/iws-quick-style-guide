var AlarmCollection;
var Backbone  = require('backbone');
var AlarmModel = require('./alarm_model');

AlarmCollection = Backbone.Collection.extend({
  model: AlarmModel,
  linkSiblings: function () {
    this.each(function (header, index) {
      header.prev = this.at(index - 1);
      header.next = this.at(index + 1);
    }, this);
  },
  comparator: function (first, second) {
    return first.get('priority') - second.get('priority');
  }
});

module.exports = AlarmCollection;
