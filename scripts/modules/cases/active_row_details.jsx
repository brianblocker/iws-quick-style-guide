/**
 * @jsx React.DOM
 */

var ActiveRowDetails;
var $           = require('jquery');
var React       = require('react');
var Backbone    = require('backbone');
var Tr          = require('../../components/tr.jsx');
var Td          = require('../../components/td.jsx');
var Tabs        = require('../../components/tabs.jsx');
var Icon        = require('../../components/icon.jsx');
var store       = require('./list_view_store');
var dispatcher  = require('./dispatcher');
var moment      = require('moment');

ActiveRowDetails = React.createClass({
  propTypes: {
    model: React.PropTypes.instanceOf(Backbone.Model).isRequired
  },
  mixins: [React.addons.PureRenderMixin],
  getInitialState: function () {
    return this.props.model.toJSON();
  },
  componentDidMount: function () {
    var key_map = {39: '_moveBackward', 37: '_moveForward'};
    $(document).on('keydown.' + this.props.model.cid, function (e) {
      var where = key_map[e.which];

      if (! where) {
        return true;
      }

      e.preventDefault();

      this[where]();
    }.bind(this));
  },
  componentWillUnmount: function () {
    $(document).off('.' + this.props.model.cid);
  },
  render: function () {
    var class_names = ['active'];
    var model       = this.props.model;
    var size_toggle = this.props.minimized ? 'expand' : 'compress';
    var tabs        = this._getTabs();

    class_names.push(this.props.className);

    return (
      <Tr className={class_names.join(' ')}>
        <Td colSpan={store.get('headings').length}>
          <fieldset className="separator">
            <legend align="center">
              <Tabs tabs={tabs} />
            </legend>
          </fieldset>
          {this.props.children}
        </Td>
      </Tr>
    );
  },
  _getTabs: function () {
    var tabs = [
      {icon: 'arrow-up',    action: this._selectPrev},
      {icon: 'arrow-down',  action: this._selectNext},
      {icon: 'close',       action: this._close}
    ];

    if (! this.props.prev) {
      delete tabs[0];
    }

    if (! this.props.next) {
      delete tabs[1];
    }

    return tabs;
  },
  _selectPrev: function () {
    if (this.props.prev) {
      this._switch(this.props.prev);
    }
  },
  _selectNext: function () {
    if (this.props.next) {
      this._switch(this.props.next);
    }
  },
  _close: function () {
    this._switch();
  },
  _switch: function (cid) {
    if (this.props.switcher) {
      this.props.switcher(cid, true);
    }
  }
});

module.exports = ActiveRowDetails;
