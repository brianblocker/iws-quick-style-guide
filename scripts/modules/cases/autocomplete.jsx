/**
 * @jsx React.DOM
 */

var Autocomplete;
var keyMap;
var $           = require('jquery');
var React       = require('react');
var Backbone    = require('backbone');
var Button      = require('../../components/button.jsx');
var Dropdown    = require('./dropdown.jsx');
var _           = require('underscore');
var Hotkeys     = require('react-hotkeys').HotKeys;

keyMap = {
  'moveUp':   'up',
  'moveDown': 'down',
  'select':   'enter'
};

function determineValue (value, multi) {
  if (multi) {
    return determineMultiValues(value);
  }

  return determineSingleValue(value);
}

function determineMultiValues (values) {
  if (! Array.isArray(values)) {
    values = [values];
  }

  return values;
}

function determineSingleValue (value) {
  if (Array.isArray(value)) {
    throw 'Expected ' + value + ' to not be an Array';
  }

  if (_.isString(value)) {
    value = {text: value};
  }

  return value;
}

Autocomplete = React.createClass({
  statics: {
    determineValue: determineValue
  },
  propTypes: {
    editing:    React.PropTypes.bool,
    multi:      React.PropTypes.bool,
    options:    React.PropTypes.array,
    generator:  React.PropTypes.func
  },
  getInitialState: function () {
    var value = Autocomplete.determineValue(this.props.value, this.props.multi);

    return {
      editing:    this.props.editing,
      value:      value,
      textValue:  (value && value.text) || '',
      active:     null,
      options:    this.props.options
    };
  },
  getDefaultProps: function () {
    return {
      editing:    false,
      multi:      false,
      options:    [],
      generator:  null
    };
  },
  componentDidMount: function () {
    this.focusSearch();
  },
  componentDidUpdate: function () {
    this.focusSearch();
  },
  render: function () {
    var options;
    var handlers = {
      moveUp:   this.moveUp,
      moveDown: this.moveDown,
      select:   this.selectItem
    };

    if (this.state.editing) {
      options = this.buildOptions();
    }

    return (
      <Hotkeys keyMap={keyMap} handlers={handlers}>
        <div className="fv-autocomplete">
          <input ref="input" className="inputable" type="text" placeholder="search criteria" ref="input" onChange={this.handleChange} defaultValue={this.state.textValue} />
          {options}
        </div>
      </Hotkeys>
    );
  },
  buildOptions: function () {
    var options = this.state.options;
    var text    = this.state.textValue;

    if (this.props.generator) {
      options = this.props.generator(this.state.textValue);
    }

    options = options || [];
    options = options.map(function (option, index) {
      var classes = ['option', 'selectable'];

      classes.push('active-' + (index === this.state.active));

      return (
        <li key={index} className={classes.join(' ')} onClick={this.handleSelect.bind(this, option)}>{option.label}</li>
      );
    }, this);

    if (options.length < 1) {
      options = (
        <li className="muted option unselectable">No matches found</li>
      );
    }

    return (
      <div className="options">
        <ul ref="options">
          {options}
        </ul>
      </div>
    );
  },
  handleSelect: function (option, e) {
    var current_value = this.state.value;

    e.preventDefault();
    e.stopPropagation();

    if (this.props.multi) {
      current_value = this.state.value.slice();
      current_value.push(option);
    }

    this.setState({
      value:      current_value,
      textValue:  ''
    });

    if (this.props.onSelect) {
      this.props.onSelect(option, current_value);
    }
  },
  handleChange: function (e) {
    var options = this.state.options;

    if (this.props.generator) {
      options = this.props.generator(e.target.value)
    }

    this.setState({
      textValue:  e.target.value,
      active:     e.target.value ? 0 : null,
      options:    options
    });
  },
  moveDown: function () {
    var current = this.state.active;


    if (current === null) {
      current = -1;
    }

    current++;

    this.setState({active: current});
  },
  moveUp: function () {
    var current = this.state.active;

    if (current === null) {
      current = 1;
    }

    current--;

    this.setState({active: current});
  },
  focusSearch: function () {
    if (! this.state.editing) {
      return;
    }

    var node = React.findDOMNode(this.refs.input);

    node.focus();
  }
});

module.exports = Autocomplete;
