/**
 * @jsx React.DOM
 */

var Button;
var React = require('react');
var Icon  = require('./icon.jsx');

Button = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    icon:     React.PropTypes.string,
    onClick:  React.PropTypes.func,
    href:     React.PropTypes.string
  },
  render: function () {
    var icon      = this.props.icon ? <Icon type={this.props.icon} ref="icon" /> : null;
    var classes   = ['button'];
    var afterIcon = this.props.afterIcon ? <Icon type={this.props.afterIcon} ref="after-icon" /> : null;
    var text      = this.props.text ? (<span className="text">{this.props.text}</span>) : null;
    var props;

    if (this.props.feaux) {
      classes = ['feaux-button'];
    }

    if (this.props.className) {
      classes.push(this.props.className);
    }

    props = {
      href:       this.props.href,
      action:     this.props.action,
      onClick:    this._handleClick,
      className:  classes.join(' ')
    };

    return (
      <a {...props}>
        {icon}
        {text}
        {afterIcon}
      </a>
    );
  },
  _handleClick: function (e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onClick && this.props.onClick(e);
  }
});

module.exports = Button;
