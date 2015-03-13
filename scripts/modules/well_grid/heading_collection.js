"use strict";

var Backbone = require('backbone');
var Model    = require('./heading_model');

module.exports = Backbone.Collection.extend({
  model: Model,
  changeSort: function (sortee) {
    var model = this.parent;

    if (! model) {
      return false;
    }

    model.get('sortee').endSorting();
    model.set('sortee', sortee);

    payload.sortee.toggleSortDirection();
  },
  changeSortDirection: function (sortee) {
    sortee.toggleSortDirection();
  },
  registerWithDispatcher: function (dispatcher) {
    this.dispatch_token = dispatcher.register(function (payload) {
      switch (payload.action) {
        case table_actions.CHANGE_SORT:
          this.changeSort(payload.sortee);
          break;
        case table_actions.CHANGE_SORT_DIR:
          this.changeSortDirection(payload.sortee);
          break;
      }
    }.bind(this));
  }
});
