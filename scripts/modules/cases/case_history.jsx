/**
 * @jsx React.DOM
 */

var CaseHistory;
var React       = require('react');
var $           = require('jquery');
var Backbone    = require('backbone');
var constants   = require('../../constants');
var Tr          = require('../../components/tr.jsx');
var Td          = require('../../components/td.jsx');
var Tabs        = require('../../components/tabs.jsx');
var Icon        = require('./icon_wrapper.jsx');
var moment      = require('moment');

CaseHistory = React.createClass({
  propTypes: {
    collection: React.PropTypes.instanceOf(Backbone.Collection).isRequired
  },
  getInitialState: function () {
    return {
      collection: this.props.collection,
      fetching:   false
    };
  },
  componentDidMount: function () {
    this.state.collection.on('request', function () {
      if (! this.isMounted()) {
        return false;
      }

      this.setState({fetching: true});
    }, this);

    this.state.collection.on('sync', function (collection) {
      if (! this.isMounted()) {
        return false;
      }

      this.fetcher = false;

      this.setState({
        collection: collection,
        fetching: false
      });
    }, this);

    this.fetcher = this.state.collection.fetch();
  },
  componentWillUnmount: function () {
    this.state.collection.off(null, null, this);

    if (this.fetcher) {
      this.fetcher.abort();
    }
  },
  _buildTable: function () {
    if (this.state.fetching) {
      return (
        <tr>
          <td colSpan="3">
            <Icon type="circle-o-notch" spin={true} /> Loading data from server...
          </td>
        </tr>
      );
    }

    return this.state.collection.map(function (model, index) {
      var odd     = index % 2 ? 'odd' : '';
      var date    = moment(model.get('date')).format(constants.DATE_FORMAT);
      var title   = model.get('title');
      var comment = model.get('comment');

      return (
        <tr key={model.cid} className={odd}>
          <td className="datefield">{date}</td>,
          <td>{title}</td>,
          <td>{comment}</td>
        </tr>
      );
    }, this);
  },
  render: function () {
    var items = this._buildTable();

    return (
      <div>
        <table className="full">
          <thead>
            <tr>
              <th className="datefield">Date</th><th>Action</th><th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {items}
          </tbody>
        </table>
      </div>
    );
  }
});

module.exports = CaseHistory;
