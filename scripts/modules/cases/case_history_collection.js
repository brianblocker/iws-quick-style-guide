var CaseHistoryCollection;
var Backbone  = require('backbone');

CaseHistoryCollection = Backbone.Collection.extend({
  fetch: function () {
    this.set([
      {
        date:     new Date(),
        title:    'Joe Smith executed a call',
        comment:  'This is just a comment'
      },
      {
        date:     new Date(),
        title:    'Case created by user',
        comment:  ''
      }
    ]);

    this.trigger('request');

    setTimeout(function () {
      this.trigger('sync', this);
    }.bind(this), 1000);
  },
  url: function () {
    return '';
  }
});

module.exports = CaseHistoryCollection;
