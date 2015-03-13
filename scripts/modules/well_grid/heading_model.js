"use strict";

var directions;
var Model;
var Backbone = require('backbone');

directions = {
  asc:  'desc',
  desc: 'asc'
};

Model = Backbone.Model.extend({
  defaults: {
    direction:  null,
    locked:     false,
    minimal:    false,
    name:       null,
    resizable:  false,
    sortable:   false,
    title:      null,
    width:      null
  },
  toggleSortDirection: function () {
    var current = this.get('direction');
    var next    = 'asc';

    if (current) {
      next = directions[current];
    }

    this.set('direction', next);
  },
  endSorting: function () {
    this.set('direction', null);
  }
});

module.exports = Model;
