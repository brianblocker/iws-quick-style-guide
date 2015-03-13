/**
 * @jsx React.DOM
 */

var Th;
var React           = require('react');
var Backbone        = require('backbone');
var SortIndicator   = require('./sort_indicator.jsx');

Th = React.createClass({
  propTypes: {
    triggerSort: React.PropTypes.string
  },
  render: function () {
    var classes = [this.props.className || ''];
    var sort_indicator = null;
    var new_props = {style:{}};

    if (this.props.triggerSort || this.props.sortDirection) {
      classes.push('sortable');

      sort_indicator = <SortIndicator direction={this.props.sortDirection} />
    }

    ['minimal', 'locked', 'resizable'].forEach(function (val) {
      if (this.props[val]) {
        classes.push(val);
      }
    }, this);

    if (this.props.width) {
      new_props.style.width = this.props.width;
    }

    new_props.className = classes.length > 1 ? classes.join(' ') : classes[0];

    return (
      <th {...new_props} onClick={this._handleClick}>
        {this.props.children}
        {sort_indicator}
      </th>
    );
  },
  _handleClick: function (e) {
    if (this.props.handleClick) {
      this.props.handleClick(e);
    }
  }
});

module.exports = Th;
