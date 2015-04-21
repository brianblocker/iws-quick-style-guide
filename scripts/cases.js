var React               = require('react');
var Perf                = React.addons.Perf;
var Dispatcher          = require('flux').Dispatcher;
var cases_module        = require('./modules/cases');
var ListView            = cases_module.ListView;
var list_view_store     = cases_module.list_view_store;
var _data_list_headings = require('./data/cases_list_headings');
var _data_list_body     = require('./data/cases_list_body')(15);
var list_headings       = list_view_store.get('headings');
var case_list           = list_view_store.get('cases');

list_headings.set(_data_list_headings);
list_view_store.set('first', list_headings.at(0));
list_headings.linkSiblings();

case_list.set(_data_list_body);

function render (id) {
  React.render(
    React.createElement(ListView, {
      headings: list_headings,
      store:    list_view_store
    }),
    document.getElementById(id)
  );
};

render('cases-list');

module.exports = render;
