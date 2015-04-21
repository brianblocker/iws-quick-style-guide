/**
 * @jsx React.DOM
 */

var ListRow;
var _             = require('underscore');
var React         = require('react');
var Backbone      = require('backbone');
var HeadingModel  = require('./heading_model');
var CaseModel     = require('./case_model');
var Tr            = require('../../components/tr.jsx');
var Td            = require('../../components/td.jsx');
var transformers  = require('./transformers.jsx')

ListRow = React.createClass({
  propTypes: {
    heading: React.PropTypes.instanceOf(HeadingModel).isRequired,
    managed_case: React.PropTypes.instanceOf(CaseModel).isRequired
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
    var cols = this._buildCols();

    return (
      <Tr className={this.props.className} onClick={this._handleClick}>
        {cols}
      </Tr>
    );
  },
  _handleClick: function (e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  },
  _buildCols: function () {
    var name;
    var value;
    var managed_case  = this.props.managed_case;
    var heading       = this.props.heading;
    var fields        = [];

    while (heading) {
      name  = heading.get('name');
      type  = heading.get('type');
      value = transformers[type] && transformers[type].call(this, managed_case, name);

      fields.push(
        <Td store={managed_case} key={heading.cid}>
          {value}
        </Td>
      );

      heading = heading.next;
    }

    return fields;
  },
  _closeCase: function () {
    if (confirm('This will permanently close this case. Are you sure?')) {
      this.props.managed_case.set('status', 'closed');
      this.setState({});
    }
  }
});

module.exports = ListRow;
