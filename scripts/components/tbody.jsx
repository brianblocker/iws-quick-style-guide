/**
 * @jsx React.DOM
 */

var Tbody;
var key_map;
var $           = require('jquery')
var React       = require('react');
var Backbone    = require('backbone');
var Tr          = require('./tr.jsx');
var Td          = require('./td.jsx');
var Icon        = require('./icon.jsx');
var RowDetails  = require('../modules/well_grid/active_row_details.jsx');
var moment      = require('moment');

key_map = {
  38: 'prev',
  40: 'next'
};

Tbody = React.createClass({
  propTypes: {
    store: React.PropTypes.instanceOf(Backbone.Model).isRequired
  },
  getInitialState: function () {
    return {
      activeWell: null,
      minimized:  false
    };
  },
  componentDidUpdate: function () {
    var $beneath;
    var $active;
    var mid;
    var top;
    var position;
    var height;
    var window_height;
    var previous  = this.state.previous;
    var active    = this.state.activeWell;

    if (! active) {
      return false;
    }

    $active   = $(this.refs[active].getDOMNode());
    $beneath  = $(this.refs.activeWell.getDOMNode());

    window_height = $(window).height();
    mid           = window_height / 2;
    top           = $active.offset().top;
    height        = $active.outerHeight() + $beneath.outerHeight();
    position      = height > window_height ? top : top - mid + height - (height / 2);

    window.scrollTo(0, position);
  },
  componentDidMount: function () {
    $(document).on('keydown.' + this.props.store.cid, function (e) {
      var cid;
      var direction = key_map[e.which];

      if (! this.state.activeWell) {
        return true;
      }

      if (direction) {
        e.preventDefault();
      }

      cid = this.refs.activeWell.props[direction];

      if (cid) {
        this._handleWellSelection(cid);
      }
    }.bind(this));
  },
  componentWillUnmount: function () {
    $(document).off('.' + this.props.store.cid);
  },
  render: function () {
    var rows = this._buildRows();

    return (
      <tbody className={this.props.className}>
        {rows}
      </tbody>
    );
  },
  _buildRows: function () {
    var data    = [];
    var store   = this.props.store;
    var wells   = store.get('wells');
    var heading = store.get('first');
    var prev    = null;
    var next    = null;

    wells.each(function (well, index) {
      var selected_row;
      var well_row;
      var active        = this.state.activeWell === well.cid;
      var contents      = this._buildRow(well, heading);
      var odd           = index % 2 > 0 ? 'odd' : '';
      var active_props   = {};

      next = wells.at(index + 1);

      well_row = (
        <Tr className={odd + (active ? ' active' : '')} ref={well.cid} key={well.cid} onClick={this._handleWellSelection.bind(this, well.cid)}>
          {contents}
        </Tr>
      );

      data.push(well_row);

      if (active) {
        active_props = {
          className:  odd,
          store:      well,
          prev:       prev,
          next:       next && next.cid,
          switcher:   this._handleWellSelection,
          sizeToggle: this._toggleMinimize,
          key:        well.cid + '-active',
          ref:        'activeWell',
          minimized:  this.state.minimized
        };

        data.push(<RowDetails {...active_props} />);
      }

      prev = well.cid;
    }, this);

    return data;
  },
  _buildRow: function (well, heading) {
    var name;
    var value;
    var fields = [];

    while (heading) {
      name = heading.get('name');
      value = well.get(name);

      if (value instanceof Date) {
        value = moment(value).format('MMM D, YYYY h:mm:ssa');
      }

      if (value === 'ok') {
        value = (<Icon type="check" />);
      }

      fields.push(
        <Td store={well} column={heading} key={heading.cid}>
          {value}
        </Td>
      );

      heading = heading.next;
    }

    return fields;
  },
  _handleWellSelection: function (cid, increment) {
    var current     = this.state.activeWell;
    var current_top = 0;
    var next_top    = 0;

    if (current === cid) {
      cid = null;
    }

    this.setState({
      activeWell: cid,
      increment:  increment === true,
      previous:   cid ? current : null
    });
  },
  _toggleMinimize: function () {
    this.setState({minimized: ! this.state.minimized});
  }
});

module.exports = Tbody;
