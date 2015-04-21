/**
 * @jsx React.DOM
 */

var ThWrapper;
var Th              = require('../../components/th.jsx');
var React           = require('react');
var Backbone        = require('backbone');

ThWrapper = React.createClass({
  propTypes: {
    store: React.PropTypes.instanceOf(Backbone.Model).isRequired
  },
  getInitialState: function () {
    return this.props.store.toJSON();
  },
  componentDidMount: function () {
    this.props.store.on('change', function (store) {
      this.setState(store.toJSON());
    }, this);
  },
  componentWillUnmount: function () {
    store.off('change', null, this);
  },
  render: function () {
    var new_props;
    var data      = this.state;

    new_props = {
      triggerSort:    data.sortable && data.name ? data.name : null,
      sortDirection:  data.direction,
      minimal:        data.minimal,
      locked:         data.locked,
      resizable:      data.resizable,
      width:          data.width
    };

    return (
      <Th {...this.props} {...new_props}>
        {data.title}
      </Th>
    );
  }
});

module.exports = ThWrapper;
