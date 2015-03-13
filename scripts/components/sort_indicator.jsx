/**
 * @jsx React.DOM
 */

var SortIndicator;
var class_map;
var React = require('react');
var Icon = require('./icon.jsx');

class_map = {
  asc:  'sort-up',
  desc: 'sort-down'
};

SortIndicator = React.createClass({
  render: function () {
    var icon      = null;
    var direction = class_map[this.props.direction];

    if (direction) {
      icon = <Icon type={direction} stack="1x" />;
    }

    return (
      <span className="fa-stack sorter">
        <Icon type="sort" stack="1x" />
        {icon}
      </span>
    );
  }
});

module.exports = SortIndicator;
