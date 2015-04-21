/**
 * @jsx React.DOM
 */

var ListFilter;
var React       = require('react');
var Backbone    = require('backbone');
var Icon        = require('./icon_wrapper.jsx');
var Dropdown    = require('./dropdown.jsx');
var FilterBox   = require('./filter_box.jsx');
var criteria    = require('./filter_box_definition');

ListFilter = React.createClass({
  propTypes: {
    store: React.PropTypes.instanceOf(Backbone.Model).isRequired
  },
  render: function () {
    var choices;
    var builder = new criteria.Builder(criteria.definition);

    choices = [
      {text: 'New from current...'},
      {text: 'New from blank...'},
      {separator: true},
      {text: 'Critical alarms'},
      {text: 'Newest alarms'},
      {text: 'Acknowledged Alarms'}
    ];

    return (
      <caption className="list-filter">
        <div className="filter-selection">
          <ul className="pull-right inline">
            <li>Quick filters:</li>
            <li>
              <Dropdown selected="Active alarms" align="right" choices={choices} />
            </li>
            <li className="icon-group">
              <a onClick={this._saveFilter}><Icon type="save" size="lg" /></a>
              <a onClick={this._deleteFilter}><Icon type="trash-o" size="lg" /></a>
            </li>
          </ul>
        </div>

        <FilterBox criteria={builder} />
      </caption>
    );
  }
});

module.exports = ListFilter;
