/**
 * @jsx React.DOM
 */

var Tabs;
var React   = require('react');
var Button  = require('./button.jsx');

Tabs = React.createClass({
  propTypes: {
    action: React.PropTypes.func,
    tabs:   React.PropTypes.array
  },
  mixins: [React.addons.PureRenderMixin],
  render: function () {
    return (
      <ul className="tabs">
        {this._buildTabs()}
      </ul>
    );
  },
  _buildTabs: function () {
    return this.props.tabs.map(function (tab, index) {
      return (
        <li key={index}>
          <Button onClick={tab.action} icon={tab.icon} text={tab.text} />
        </li>
      );
    }, this);
  }
});

module.exports = Tabs;
