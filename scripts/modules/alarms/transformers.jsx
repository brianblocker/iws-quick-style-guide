/**
 * @jsx React.DOM
 */

var Button    = require('../../components/button.jsx');
var Icon      = require('./icon_wrapper.jsx');
var moment    = require('moment');
var React     = require('react');
var constants = require('../../constants');

/**
 * Each transformer should take case and attr_name params
 */
module.exports = {
  alarm_details: function (model) {
    var code    = model.get('code');
    var message = model.get('message');

    return (
      <div>
        <div>{code} - {message}</div>
        <div className="muted small">Source: LWM</div>
      </div>
    )
  },
  priority: function (model) {
    var priority    = model.get('priority');
    var class_names = ['priority', 'priority-' + priority];

    return (
      <span className={class_names.join(' ')}>
        {priority}
      </span>
    );
  },
  status: function (model) {
    var values = ['alarm'];
    var checks = ['acknowledged', 'critical', 'normal'];

    if (model.get('cleared')) {
      values.push('cleared');

      checks = [];
    }

    checks.forEach(function (label) {
      if (model.get(label)) {
        values.push(label);
      }
    });

    return (<Icon type={values.join('-')} />);
  },
  well: function (model) {
    var well = model.get('well');

    return (
      <div>
        <div>{well.name}</div>
        <div className="muted small">Well status: {well.status}</div>
      </div>
    );
  },
  date: function (model) {
    var created   = moment(model.get('created_date')).format(constants.DATE_FORMAT);

    return (<div>{created}</div>);
  },
  cases: function (model) {
    var content;
    var button_text = 'Create';
    var length      = model.get('cases').length;

    content = (<Button icon="plus" text={button_text} className="block" />);

    if (length) {
      button_text = ['View ', '(', length, ')'].join('');
      content = (
        <div className="button-group piped">
          <Button feaux={true} icon="plus" />
          <Button feaux={true} text={button_text} />
        </div>
      );
    }

    return (
      <div>
        {content}
      </div>
    );
  },
  alarm_actions: function (model) {
    var buttonProps;
    var button = (<span className="nodata">None available</span>);

    if (model.get('cleared')) {
      return button;
    }

    buttonProps = {
      text:     'Acknowledge',
      icon:     'bell-slash',
      onClick:  this.acknowledgeAlarm
    };

    if (model.get('acknowledged')) {
      buttonProps = {
        text:     'Clear',
        icon:     'check',
        onClick:  this.clearAlarm
      };
    }

    return (
      <div className="button-group button-drop">
        <Button icon="caret-down" />
        <Button {...buttonProps} />
      </div>
    );
  }
};
