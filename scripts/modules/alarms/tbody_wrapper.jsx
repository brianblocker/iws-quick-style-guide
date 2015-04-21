/**
 * @jsx React.DOM
 */

var TbodyWrapper;
var React             = require('react');
var Backbone          = require('backbone');
var Scroller          = require('../../utils/scroller_coaster');
var RowDetails        = require('./active_row_details.jsx');
var AlarmHistoryView  = require('./alarm_history.jsx');
var HistoryCollection = require('./alarm_history_collection');
var ListRow           = require('./list_row.jsx');
var classNames        = require('classnames');

TbodyWrapper = React.createClass({
  propTypes: {
    store: React.PropTypes.instanceOf(Backbone.Model).isRequired
  },
  mixins: [React.addons.PureRenderMixin],
  getInitialState: function () {
    return {
      activeAlarm: null,
      minimized:  false,
      previous:   null,
      increment:  false
    };
  },
  componentDidUpdate: function () {
    var elements;
    var active = this.state.activeAlarm;

    if (! active) {
      return false;
    }

    elements = [
      this.refs[active].getDOMNode(),
      this.refs.activeAlarm.getDOMNode()
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
    var alarms   = store.get('alarms');
    var heading = store.get('first');
    var prev    = null;
    var next    = null;

    alarms.each(function (model, index) {
      var activeProps;
      var rowProps;
      var selected_row;
      var class_names;
      var active  = this.state.activeAlarm === model.cid;
      var odd     = index % 2 ? 'odd' : null;

      next = alarms.at(index + 1);

      class_names = classNames({
        odd: odd,
        active: active
      });

      rowProps = {
        className:    class_names,
        ref:          model.cid,
        key:          model.cid,
        onClick:      this._handleAlarmSelection.bind(this, model.cid),
        alarm:        model,
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
          switcher:   this._handleAlarmSelection,
          sizeToggle: this._toggleMinimize,
          key:        model.cid + '-active',
          ref:        'activeAlarm',
          minimized:  this.state.minimized
        };

        data.push(
          <RowDetails {...activeProps}>
            <AlarmHistoryView collection={new HistoryCollection()} />
          </RowDetails>
        );
      }

      prev = model;
    }, this);

    return data;
  },
  _handleAlarmSelection: function (cid, increment) {
    var current = this.state.activeAlarm;

    if (current === cid) {
      cid = null;
    }

    this.setState({
      activeAlarm: cid,
      increment:  increment === true,
      previous:   cid ? current : null
    });
  },
});

module.exports = TbodyWrapper;
