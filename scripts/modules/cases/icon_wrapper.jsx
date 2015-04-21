/**
 * @jsx React.DOM
 */

var IconWrapper;
var mappings;
var _     = require('underscore');
var Icon  = require('../../components/icon.jsx');
var React = require('react');

/**
 * Allows mapping a case status to a particular icon type
 */
mappings = {
  active:   'play-circle',
  closed:   'times-circle',
  open:     'circle-o',
  resolved: 'check-circle'
};

/**
 * Wraps the Icon component, see that component for usage examples
 */
IconWrapper = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  render: function () {
    var newProps = _.extend({}, this.props);

    newProps.type = mappings[newProps.type] || newProps.type;

    return (
      <Icon {...newProps} />
    );
  }
});

module.exports = IconWrapper;
