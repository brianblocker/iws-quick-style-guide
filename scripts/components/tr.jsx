/**
 * @jsx React.DOM
 */

var Tr;
var React = require('react');

Tr = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  render: function () {
    return (
      <tr {...this.props}>
        {this.props.children}
      </tr>
    );
  }
});

module.exports = Tr;
