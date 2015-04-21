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
  'alarm':                        'bell',
  'alarm-acknowledged':           'bell-slash',
  'alarm-acknowledged-critical':  'bell-slash',
  'alarm-critical':               'bell',
  'alarm-acknowledged-normal':    'bell-slash-o',
  'alarm-normal':                 'bell-o',
  'alarm-cleared':                'check-circle'
};

/**
 * Wraps the Icon component, see that component for usage examples
 */
IconWrapper = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  render: function () {
    var newProps = _.extend({}, this.props);

    newProps.className  = newProps.type;
    newProps.type       = mappings[newProps.type] || newProps.type;

    return (
      <Icon {...newProps} />
    );
  }
});

module.exports = IconWrapper;
