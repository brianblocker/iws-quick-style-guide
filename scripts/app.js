"use strict";

var thead;
var tbody;
var headings;
var React                 = require('react');
var Dispatcher            = require('flux').Dispatcher;
var Backbone              = require('backbone');
var well_grid_module      = require('./modules/well_grid');
var WellGridView          = well_grid_module.view;
var well_store            = well_grid_module.store;
var well_headings         = well_store.get('headings');
var well_list             = well_store.get('wells');
var well_grid_dispatcher  = well_grid_module.dispatcher;
var _data_well_headings   = require('./data/well_headings');
var _data_well_body       = require('./data/well_body')(50);

well_headings.set(_data_well_headings);

well_store.set('first',  well_headings.at(0));
well_store.set('sortee', well_headings.at(1));

well_headings.each(function (header, index) {
  var prev = well_headings.at(index - 1);
  var next = well_headings.at(index + 1);

  header.prev = prev;
  header.next = next;
});

well_list.set(_data_well_body);

/**
 * Render the well list
 **/
React.render(
  React.createElement(WellGridView, {
    dispatcher: well_grid_dispatcher,
    store: well_store}
  ),
  document.getElementById('well-list'));
