/**
 * @jsx React.DOM
 */

var AndOrSelector;
var types_map = {};
var React     = require('react');
var Icon      = require('./icon_wrapper.jsx');
var Dropdown  = require('./dropdown.jsx');
var AND_VALUE = 'and';
var OR_VALUE  = 'or'

types_map[AND_VALUE] = 'all';
types_map[OR_VALUE]  = 'any';

AndOrSelector = React.createClass({
  statics: {
    AND:  AND_VALUE,
    OR:   OR_VALUE
  },
  mixins: [React.addons.PureRenderMixin],
  getInitialState: function () {
    return {
      editing: false
    };
  },
  getDefaultProps: function () {
    return {
      type: AND_VALUE
    };
  },
  render: function () {
    var current   = types_map[this.props.type];
    var contents  = this.state.editing ? this._buildEditor() : (<span><a>{current}</a>:</span>);
    var props;

    props = {
      className:    'chain and-or',
      onMouseLeave: this._handleMouseLeave,
      onClick:      this._toggleEditing
    };

    return (
      <span {...props}>
        {contents}
      </span>
    );
  },
  _buildEditor: function () {
    var props;
    var choices = [
      {text: types_map[AND_VALUE], value: AND_VALUE},
      {text: types_map[OR_VALUE], value: OR_VALUE}
    ];

    props = {
      ref:      'dropdown',
      theme:    'light',
      selected: types_map[this.props.type],
      choices:  choices,
      onChoice: this._handleSelection,
      open:     true
    };

    return (
      <Dropdown {...props} />
    );
  },
  _endEditing: function () {
    this.setState({editing: false});
  },
  _handleMouseLeave: function () {
    this._endEditing();
  },
  _toggleEditing: function (e) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({editing: ! this.state.editing});
  },
  _handleOrSelection: function () {
    this._handleSelection(OR_VALUE);
  },
  _handleAndSelection: function () {
    this._handleSelection(AND_VALUE);
  },
  _handleSelection: function (choice) {
    this._endEditing();

    if (this.props.onChange) {
      this.props.onChange(choice);
    }
  }
});

module.exports = AndOrSelector;
