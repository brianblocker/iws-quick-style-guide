/**
 * @jsx React.DOM
 */

var TbodyWrapper;
var React             = require('react');
var Backbone          = require('backbone');
var Scroller          = require('../../utils/scroller_coaster');
var RowDetails        = require('./active_row_details.jsx');
var CaseHistoryView   = require('./case_history.jsx');
var HistoryCollection = require('./case_history_collection');
var ListRow           = require('./list_row.jsx');
var classNames        = require('classnames');

TbodyWrapper = React.createClass({
  propTypes: {
    store: React.PropTypes.instanceOf(Backbone.Model).isRequired
  },
  mixins: [React.addons.PureRenderMixin],
  getInitialState: function () {
    return {
      activeCase: null,
      minimized:  false,
      previous:   null,
      increment:  false
    };
  },
  componentDidUpdate: function () {
    var elements;
    var active = this.state.activeCase;

    if (! active) {
      return false;
    }

    elements = [
      this.refs[active].getDOMNode(),
      this.refs.activeCase.getDOMNode()
    ];

    Scroller(elements, {steps: 250});
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
    var cases   = store.get('cases');
    var heading = store.get('first');
    var prev    = null;
    var next    = null;

    cases.each(function (model, index) {
      var activeProps;
      var rowProps;
      var selected_row;
      var class_names;
      var active  = this.state.activeCase === model.cid;
      var odd     = index % 2 ? 'odd' : null;

      next = cases.at(index + 1);

      class_names = classNames({
        odd: odd,
        active: active
      });

      rowProps = {
        className:    class_names,
        ref:          model.cid,
        key:          model.cid,
        onClick:      this._handleCaseSelection.bind(this, model.cid),
        managed_case: model,
        heading:      heading
      };

      data.push(
        <ListRow {...rowProps} />
      );

      if (active) {
        activeProps = {
          className:  odd,
          model:      model,
          prev:       prev && prev.cid,
          next:       next && next.cid,
          switcher:   this._handleCaseSelection,
          sizeToggle: this._toggleMinimize,
          key:        model.cid + '-active',
          ref:        'activeCase',
          minimized:  this.state.minimized
        };

        data.push(
          <RowDetails {...activeProps}>
            <CaseHistoryView collection={new HistoryCollection()} />
          </RowDetails>
        );
      }

      prev = model;
    }, this);

    return data;
  },
  _handleCaseSelection: function (cid, increment) {
    var current = this.state.activeCase;

    if (current === cid) {
      cid = null;
    }

    this.setState({
      activeCase: cid,
      increment:  increment === true,
      previous:   cid ? current : null
    });
  },
});

module.exports = TbodyWrapper;
