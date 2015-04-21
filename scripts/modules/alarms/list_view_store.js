"use strict";

var store;
var Backbone          = require('backbone');
var HeadingCollection = require('./heading_collection');
var AlarmCollection    = require('./alarm_collection');

store = new Backbone.Model({
  alarms:    new AlarmCollection(),
  first:    null,
  headings: new HeadingCollection(),
  selected: null
});

module.exports = store;
