/**
 * @jsx React.DOM
 */

var Dropdown;
var DropdownChoice;
var offscreen_handlers;
var $           = require('jquery');
var React       = require('react');
var Button      = require('../../components/button.jsx');
var $window     = $(window);

offscreen_handlers = {
  left: function ($el, newState) {
    if ($el.is(':offscreen-right')) {
      newState.align = 'right';
    }
  },
  right: function ($el, newState) {
    if ($el.is(':offscreen-left')) {
      newState.align = 'left';
    }
  }
};

DropdownChoice = React.createClass({
  render: function () {
    var buttonProps = {
      text:       this.props.text,
      onClick:    this._clickHandler,
      className:  this.props.theme
    };

    return (
      <li className="choice"><Button {...buttonProps} /></li>
    );
  },
  _clickHandler: function () {
    if (this.props.onChoice) {
      this.props.onChoice(this.props.value);
    }
  }
});

Dropdown = React.createClass({
  propTypes: {
    selected: React.PropTypes.string.isRequired,
    choices:  React.PropTypes.array
  },
  mixins: [React.addons.PureRenderMixin],
  getInitialState: function () {
    return {
      open:   !! this.props.open,
      align:  this.props.align || 'left'
    };
  },
  componentWillReceiveProps: function (nextProps) {
    if (nextProps.align) {
      this.setState({align: nextProps.align});
    }
  },
  componentDidMount: function () {
    this._ensureDropdownVisibility();
  },
  componentDidUpdate: function () {
    this._ensureDropdownVisibility();
  },
  getDefaultProps: function () {
    return {
      choices: []
    };
  },
  render: function () {
    var choices = this.state.open && this._buildChoices();
    var classes = ['dropdown', 'align-' + this.state.align];
    var buttonProps;

    buttonProps = {
      text:       this.props.selected,
      afterIcon:  'caret-down',
      onClick:    this._toggleOpen
    };

    this.props.className && classes.push(this.props.className);

    if (this.props.theme) {
      classes.push(this.props.theme);
      buttonProps.className = this.props.theme;
    }

    return (
      <div className={classes.join(' ')} onMouseLeave={this._handleLeave}>
        <div className="selected">
          <Button {...buttonProps} />
        </div>
        {choices}
      </div>
    );
  },
  _handleLeave: function () {
    this.setState({open: false});
  },
  _toggleOpen: function (e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }

    this.setState({
      open: ! this.state.open
    });
  },
  _buildChoices: function () {
    var choices = [];

    choices = this.props.choices.map(function (choice, index) {
      if (choice.separator) {
        return (<li className="separator" key={index} />);
      }

      var props = {
        key:      index,
        text:     choice.text,
        onChoice: this._handleChoice,
        theme:    this.props.theme,
        value:    choice.value
      };

      return (
        <DropdownChoice {...props} />
      );
    }, this);

    return (<ul ref="dropdown">{choices}</ul>);
  },
  _handleChoice: function (value) {
    if (this.props.onChoice) {
      this.props.onChoice(value);
    }

    this.setState({open: false});
  },
  _ensureDropdownVisibility: function () {
    if (! this.state.open) {
      return null;
    }

    var dropdown  = this.refs.dropdown;
    var $el       = $(dropdown.getDOMNode());
    var newState  = {};
    var handler   = offscreen_handlers[this.state.align];

    handler && handler($el, newState);

    this.setState(newState);
  },
  _exit: function () {
    this.setState({open: false});
  }
});

module.exports = Dropdown;
