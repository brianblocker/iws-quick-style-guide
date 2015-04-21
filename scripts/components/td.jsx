/**
 * @jsx React.DOM
 */

var Td;
var React = require('react');

Td = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  render: function () {

    return (
      <td {...this.props}>
        {this.props.children}
      </td>
    );
  }
});

module.exports = Td;
