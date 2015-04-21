/**
 * @jsx React.DOM
 */

var ActiveRowDetails;
var $           = require('jquery');
var React       = require('react');
var Tr          = require('../../components/tr.jsx');
var Td          = require('../../components/td.jsx');
var Tabs        = require('../../components/tabs.jsx');
var Icon        = require('../../components/icon.jsx');
var WellNav     = require('./well_nav.jsx');
var store       = require('./store');
var dispatcher  = require('./dispatcher');

ActiveRowDetails = React.createClass({
  getInitialState: function () {
    return {quick: store.get('quick').toJSON()};
  },
  componentDidMount: function () {
    var key_map = {39: '_moveBackward', 37: '_moveForward'};
    $(document).on('keydown.' + this.props.store.cid, function (e) {
      var where = key_map[e.which];

      if (! where) {
        return true;
      }

      e.preventDefault();

      this[where]();
    }.bind(this));
  },
  componentWillUnmount: function () {
    $(document).off('.' + this.props.store.cid);
  },
  render: function () {
    var quick_look;
    var quick_items;
    var class_names = ['active'];
    var well        = this.props.store;
    var size_toggle = this.props.minimized ? 'expand' : 'compress';
    var tabs        = this._getTabs();

    if (! this.props.minimized) {
      quick_items = this.state.quick.map(function (item, index) {
        var className = 'col-1';

        if (index === 0) {
          className += ' offset-3';
        }

        return (
          <div className={className} key={index}>
            <div className="box">
              {item.text}
            </div>
          </div>
        );
      });

      quick_look = (
        <div className="quick-look" ref="quick-look">
          <div className="control">
            <a className="button" onClick={this._moveForward}><Icon type="arrow-left" /></a>
          </div>
          <div className="content">

            <div className="triclopse">
              <div className="inner">

                {quick_items}

              </div>
            </div>

          </div>
          <div className="control">
            <a className="button" onClick={this._moveBackward}><Icon type="arrow-right" /></a>
          </div>
        </div>
      );
    }

    class_names.push(this.props.className);

    return (
      <Tr className={class_names.join(' ')}>
        <Td colSpan={store.get('headings').length}>
          <fieldset className="separator">
            <legend align="center">
              <Tabs tabs={tabs} />
            </legend>
          </fieldset>
          {quick_look}
          <WellNav wellId={well.cid} size="small" type={well.get('Lift_Type')} />
        </Td>
      </Tr>
    );
  },
  _getTabs: function () {
    var tabs = [
      {icon: {type: 'arrow-up'},    action: this._selectPrev},
      {icon: {type: 'arrow-down'},  action: this._selectNext},
      {icon: {type: size_toggle},   action: this._sizeToggle},
      {icon: {type: 'close'},       action: this._close}
    ];

    if (! this.props.prev) {
      delete tabs[0];
    }

    if (! this.props.next) {
      delete tabs[1];
    }

    return tabs;
  },
  _moveForward: function () {
    store.get('quick').goBack();

    this.setState({quick: store.get('quick').toJSON()});
  },
  _moveBackward: function () {
    store.get('quick').goForward();

    this.setState({quick: store.get('quick').toJSON()});
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
  _sizeToggle: function () {
    if (this.props.sizeToggle) {
      this.props.sizeToggle();
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
