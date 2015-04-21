var CaseCollection;
var Backbone  = require('backbone');
var CaseModel = require('./case_model');

CaseCollection = Backbone.Collection.extend({
  model: CaseModel,
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

module.exports = CaseCollection;
