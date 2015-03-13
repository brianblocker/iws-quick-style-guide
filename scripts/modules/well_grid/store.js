"use strict";

var store;
var Backbone      = require('backbone');
var TableHeadings = require('./heading_collection');
var table_actions = require('./actions');
var dispatcher    = require('./dispatcher');
var QuickLook     = require('./quick_look');
var well_headings = new TableHeadings();
var wells         = new Backbone.Collection();

well_headings.registerWithDispatcher(dispatcher);



store = new Backbone.Model({
  wells:    wells,
  first:    null,
  headings: well_headings,
  selected: null,
  sortee:   null,
  quick:    new QuickLook([{width: 1}, {width: 1}, {width: 1}, {width: 1}, {width: 1}, {width: 1}])
});

store.get('headings').parent = store;

module.exports = store;
