/**
 * @jsx React.DOM
 */

var Tabs;
var React = require('react');
var Icon  = require('./icon.jsx');

Tabs = React.createClass({
  propTypes: {
    action: React.PropTypes.func
  },
  render: function () {
    return (
      <ul className="tabs">
        {this._buildTabs()}
      </ul>
    );
  },
  _buildTabs: function () {
    return this.props.tabs.map(function (tab, index) {
      var icon = tab.icon ? <Icon type={tab.icon} /> : null;

      return (
        <li key={index}>
          <a href={tab.href} className="button small" onClick={tab.action}>
            {icon}
            {tab.text}
          </a>
        </li>
      );
    }, this);
  }
});

module.exports = Tabs;
