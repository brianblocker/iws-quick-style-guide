/**
 * @jsx React.DOM
 */

var Thead;
var React = require('react');

Thead = React.createClass({
  render: function () {
    return (
      <thead className={this.props.className}>
        {this.props.children}
      </thead>
    );
  }
});

module.exports = Thead;
