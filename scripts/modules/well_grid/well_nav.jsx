/**
 * @jsx React.DOM
 */

var WellNav;
var React = require('react');
var Tabs  = require('../../components/tabs.jsx');

WellNav = React.createClass({
  render: function () {
    return (
      <div className="tab-group">
        {this._buildTabGroups()}
      </div>
    );
  },
  _buildTabGroups: function () {
    var groups = [];

    groups.push([
      {text: 'Well Dash'},
      {text: 'Details'},
      {text: 'Management'},
      {text: 'Status / Config'},
      {text: 'Events'},
      {text: 'Alarms'}
    ]);

    groups.push([
      {text: this.props.type + ' details'},
      {text: 'Analyze'}
    ]);

    return groups.map(function (group, index) {
      return (
        <Tabs tabs={group} key={index} />
      );
    });
  }
});

module.exports = WellNav;
