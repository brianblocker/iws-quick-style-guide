var React               = require('react');
var Perf                = React.addons.Perf;
var Dispatcher          = require('flux').Dispatcher;
var alarms_module       = require('./modules/alarms');
var ListView            = alarms_module.ListView;
var list_view_store     = alarms_module.list_view_store;
var _data_list_headings = require('./data/alarms_list_headings');
var _data_list_body     = require('./data/alarms_list_body')(15);
var list_headings       = list_view_store.get('headings');
var alarm_list          = list_view_store.get('alarms');

list_headings.set(_data_list_headings);
list_view_store.set('first', list_headings.at(0));
list_headings.linkSiblings();

alarm_list.set(_data_list_body);

function render (id) {
  React.render(
    React.createElement(ListView, {
      headings: list_headings,
      store:    list_view_store
    }),
    document.getElementById(id)
  );
};

render('alarms-list');

module.exports = render;
