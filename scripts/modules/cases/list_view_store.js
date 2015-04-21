"use strict";

var store;
var Backbone          = require('backbone');
var HeadingCollection = require('./heading_collection');
var CaseCollection    = require('./case_collection');

store = new Backbone.Model({
  cases:    new CaseCollection(),
  first:    null,
  headings: new HeadingCollection(),
  selected: null
});

module.exports = store;
