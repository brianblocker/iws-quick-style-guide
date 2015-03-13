/**
 * @jsx React.DOM
 */

var WellList;
var React = require('react');
var Th    = require('../components/th.jsx');
var Thead = require('../components/thead.jsx');
var Tbody = require('../components/tbody.jsx');

var sizes = {
  200: 250,
  250: 200
};

WellList = React.createClass({
  render: function () {
    return (
      <table className="full">
        <caption><div onClick={this._changeWidthHandler}>toggle 2nd col width width example</div></caption>
        <Thead store={this.props.store} />
        <Tbody store={this.props.store} />
      </table>
    );
  },
  _changeWidthHandler: function () {
    var store = this.props.store.get('headings');
    var third = store.at(2);

    third.set('width', sizes[third.get('width')] || 200);
    //console.log(headings);
  }
});

module.exports = WellList;
