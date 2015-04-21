/**
 * @jsx React.DOM
 */

var ListRow;
var _             = require('underscore');
var React         = require('react');
var Backbone      = require('backbone');
var HeadingModel  = require('./heading_model');
var AlarmModel    = require('./alarm_model');
var Tr            = require('../../components/tr.jsx');
var Td            = require('../../components/td.jsx');
var transformers  = require('./transformers.jsx')

ListRow = React.createClass({
  propTypes: {
    heading: React.PropTypes.instanceOf(HeadingModel).isRequired,
    managed_case: React.PropTypes.instanceOf(AlarmModel).isRequired
  },
  shouldComponentUpdate: function (newProps, newState) {
    return true;
    var new_case  = newProps.managed_case ? newProps.managed_case.toJSON() : {};
    var old_case  = this.props.managed_case.toJSON();

    if (this.props.className !== newProps.className) {
      return true;
    }

    if (! _.isEqual(old_case, new_case)) {
      return true;
    }

    return false;
  },
  render: function () {
    var cols = this.buildCols();

    return (
      <Tr className={this.props.className} onClick={this.handleClick}>
        {cols}
      </Tr>
    );
  },
  handleClick: function (e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  },
  buildCols: function () {
    var name;
    var value;
    var alarm   = this.props.alarm;
    var heading = this.props.heading;
    var fields  = [];

    while (heading) {
      name  = heading.get('name');
      type  = heading.get('type');
      value = transformers[type] && transformers[type].call(this, alarm, name);

      fields.push(
        <Td store={alarm} key={heading.cid}>
          {value}
        </Td>
      );

      heading = heading.next;
    }

    return fields;
  },
  acknowledgeAlarm: function () {
    this.props.alarm.set('acknowledged', true);
    this.setState({});
  },
  clearAlarm: function () {
    this.props.alarm.set({
      acknowledged: true,
      cleared:      true
    });

    this.setState({});
  }
});

module.exports = ListRow;
