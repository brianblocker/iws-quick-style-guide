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
  case_details: function (model) {
    var type    = model.get('type');
    var asset   = model.get('device');
    var subtype = model.get('subtype');
    var title   = type + ': ' + asset + ' (' + subtype + ')';
    var updated = moment(model.get('updated_date')).format(constants.DATE_FORMAT);

    return (
      <div>
        <div>{title}</div>
        <span className="muted small">Last update: {updated}</span>
        <a className="feaux-button small">Details</a>
      </div>
    )
  },
  status: function (model) {
    var status  = model.get('status');
    var props   = {
      type:       status,
      className:  status === 'closed' ? 'muted' : ''
    };

    return (<Icon {...props} />);
  },
  case_reported: function (model) {
    var reporter  = model.get('reporter');
    var created   = moment(model.get('created_date')).format(constants.DATE_FORMAT);

    return (
      <div>
        <div>{reporter}</div>
        <span className="muted small">{created}</span>
      </div>
    )
  },
  case_assignment: function (model) {
    var assignments = (<span className="nodata">No assignment</span>);
    var group       = model.get('assigned_group');
    var person      = model.get('assigned_person');

    if (group || person) {
      assignments = [
        <div key='group'>{group}</div>,
        <div key='person'>{person}</div>
      ];
    }

    return (
      <div>
        {assignments}
      </div>
    );
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
  case_actions: function (model) {
    var button = (<span className="nodata">None available</span>);

    if (model.get('reporter') !== 'Brian') {
      return button;
    }

    if (model.get('status') === 'closed') {
      return button;
    }

    button = (
      <Button icon="plus" text="Close case" onClick={this._closeCase} />
    );

    return button;
  }
};
