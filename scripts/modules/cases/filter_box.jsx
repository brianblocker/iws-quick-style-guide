/**
 * @jsx React.DOM
 */

var FilterBox;
var React         = require('react');
var Backbone      = require('backbone');
var Autocomplete  = require('./autocomplete.jsx');
var Button        = require('../../components/button.jsx');
var Dropdown      = require('./dropdown.jsx');
var AndOr         = require('./and_or_selector.jsx');
var criteria      = require('./filter_box_definition');

FilterBox = React.createClass({
  propTypes: {
    filterType: React.PropTypes.oneOf([AndOr.AND, AndOr.OR]),
    lockType:   React.PropTypes.bool,
    criteria:   React.PropTypes.object.isRequired
  },
  componentDidMount: function () {
    this.focusSearch();

    document.addEventListener('click', this.handleDocumentClick);
  },
  componentWillUnmount: function () {
    document.removeEventListener('click', this.handleDocumentClick);
  },
  componentDidUpdate: function () {
    this.focusSearch();
  },
  getDefaultProps: function () {
    return {
      filterType: AndOr.AND,
      lockType:   false,
      editing:    false
    }
  },
  getInitialState: function () {
    return {
      filterType: this.props.filterType,
      editing:    this.props.editing
    };
  },
  render: function () {
    var groups = this.buildGroups();

    return (
      <div className="filter-box" onClick={this.handleClick}>
        <Button className="search-action pull-right feaux-button" icon="search" onClick={this.initiateSearch} />

        <div className="chain-group">
          <span className="chain">
            Find cases matching
          </span>

          <AndOr onChange={this.handleFilterTypeChange} type={this.state.filterType} />
        </div>

        {groups}
      </div>
    );
  },
  handleDocumentClick: function () {
    this.endEditing();
  },
  buildGroups: function () {
    var input_props;
    var groups    = [];
    var generator = this.props.criteria.toOptions.bind(this.props.criteria);

    input_props = {
      type:         'text',
      className:    'chain inputable',
      placeholder:  'search criteria',
      ref:          'searchCriteria',
      onChange:     this.handleSearchCriteria
    };

    if (this.state.editing) {
      groups.push(
        <div className="chain-group" key="searchCriteria">
          <Autocomplete ref="searchCriteria" name="something" onSelect={this.handleSelect} generator={generator} editing={true} />
        </div>
      );
    }

    return groups;
  },
  handleSelect: function (value) {
    this.props.criteria.use(value.value);
    this.endEditing();
  },
  handleFilterTypeChange: function (value) {
    if (! this.props.lockType) {
      this.setState({filterType: value});
    }
  },
  initiateSearch: function () {
    this.endEditing();
  },
  handleClick: function (e) {
    // In the test env, we do not have stopImmediatePropagation, so our
    // tests will break if we don't use an `if` statement here
    if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
      e.nativeEvent.stopImmediatePropagation();
    }

    e.stopPropagation();
    e.preventDefault();

    this.enableEditing();
  },
  enableEditing: function () {
    if (! this.state.editing) {
      this.setState({editing: true});
    }
  },
  endEditing: function () {
    if (this.state.editing) {
      this.setState({editing: false});
    }
  },
  focusSearch: function () {
    if (! this.state.editing) {
      return;
    }

    /*var node = React.findDOMNode(this.refs.searchCriteria);

    node.focus();*/
  }
});

module.exports = FilterBox;
