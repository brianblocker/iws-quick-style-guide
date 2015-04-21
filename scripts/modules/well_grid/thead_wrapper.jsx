/**
 * @jsx React.DOM
 */

var Thead;
var React     = require('react');
var Backbone  = require('backbone');
var Tr        = require('../../components/tr.jsx');
var Th        = require('./th_wrapper.jsx');

Thead = React.createClass({
  propTypes: {
    store: React.PropTypes.instanceOf(Backbone.Model).isRequired
  },
  render: function () {
    var cols = this._buildColumns();

    return (
      <thead className={this.props.className}>
        <Tr>
          {cols}
        </Tr>
      </thead>
    );
  },
  _buildColumns: function () {
    var data;
    var columns = [];
    var store = this.props.store;
    var current = store.get('first');

    while (current) {
      data              = {};
      data.handleClick  = current.get('sortable') ? this._sortHandler.bind(this, current) : null;
      data.store        = current;
      data.className    = current.get('type') === 'actions' ? 'actions-col' : '';

      columns.push(<Th {...data} key={current.cid} />);
      current = current.next;
    }

    return columns;
  },
  _sortHandler: function (sortee) {
    var store   = this.props.store;
    var current = store.get('sortee');

    if (current.cid !== sortee.cid) {
      current.endSorting();
    }

    store.set('sortee', sortee);
    sortee.toggleSortDirection();

  }
});

module.exports = Thead;
