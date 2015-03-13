/**
 * @jsx React.DOM
 */

var Icon;
var React = require('react');

Icon = React.createClass({
  render: function () {
    var classes = ['fa'];

    if (this.props.stack) {
      classes.push('fa-stack-' + this.props.stack);
    }

    if (this.props.type) {
      classes.push('fa-' + this.props.type);
    }

    return (
      <i className={classes.join(' ')}></i>
    );
  }
});

module.exports = Icon;
