/**
 * @jsx React.DOM
 */

var CasesList;
var React   = require('react');
var Thead   = require('./thead_wrapper.jsx');
var Tbody   = require('./tbody_wrapper.jsx');
var Filter  = require('./list_filter.jsx');

CasesList = React.createClass({
  render: function () {
    var props = {store: this.props.store};

    return (
      <div>
        <table className="full inline-details">
          <Filter {...props} />
          <Thead {...props} />
          <Tbody {...props} />
        </table>
      </div>
    );
  }
});

module.exports = CasesList;
