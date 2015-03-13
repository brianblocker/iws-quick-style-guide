/**
 * @jsx React.DOM
 */

var Table;
var React = require('react');

Table = React.createClass({
  render: function () {
    return (
      <table {...this.props}>
        {this.props.children}
      </table>
    );
  }
});

module.exports = Table;
