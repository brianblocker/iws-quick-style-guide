(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.app_bundle = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var thead;
var tbody;
var headings;
var React                 = require('react');
var Dispatcher            = require('flux').Dispatcher;
var Backbone              = require('backbone');
var well_grid_module      = require('./modules/well_grid');
var WellGridView          = well_grid_module.view;
var well_store            = well_grid_module.store;
var well_headings         = well_store.get('headings');
var well_list             = well_store.get('wells');
var well_grid_dispatcher  = well_grid_module.dispatcher;
var _data_well_headings   = require('./data/well_headings');
var _data_well_body       = require('./data/well_body')(50);

well_headings.set(_data_well_headings);

well_store.set('first',  well_headings.at(0));
well_store.set('sortee', well_headings.at(1));

well_headings.each(function (header, index) {
  var prev = well_headings.at(index - 1);
  var next = well_headings.at(index + 1);

  header.prev = prev;
  header.next = next;
});

well_list.set(_data_well_body);

/**
 * Render the well list
 **/
React.render(
  React.createElement(WellGridView, {
    dispatcher: well_grid_dispatcher,
    store: well_store}
  ),
  document.getElementById('well-list'));



},{"./data/well_body":10,"./data/well_headings":11,"./modules/well_grid":17,"backbone":"backbone","flux":"flux","react":"react"}],2:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var Button;
var React = require('react');
var Icon  = require('./icon.jsx');

Button = React.createClass({displayName: "Button",
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    icon:     React.PropTypes.string,
    onClick:  React.PropTypes.func,
    href:     React.PropTypes.string
  },
  render: function () {
    var icon      = this.props.icon ? React.createElement(Icon, {type: this.props.icon, ref: "icon"}) : null;
    var classes   = ['button'];
    var afterIcon = this.props.afterIcon ? React.createElement(Icon, {type: this.props.afterIcon, ref: "after-icon"}) : null;
    var text      = this.props.text ? (React.createElement("span", {className: "text"}, this.props.text)) : null;
    var props;

    if (this.props.className) {
      classes.push(this.props.className);
    }

    props = {
      href:       this.props.href,
      action:     this.props.action,
      onClick:    this._handleClick,
      className:  classes.join(' ')
    };

    return (
      React.createElement("a", React.__spread({},  props), 
        icon, 
        text, 
        afterIcon
      )
    );
  },
  _handleClick: function (e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onClick && this.props.onClick(e);
  }
});

module.exports = Button;



},{"./icon.jsx":3,"react":"react"}],3:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var Icon;
var _     = require('underscore');
var React = require('react');

/**
 * Creates an icon, currently using the font awesome icon library
 *
 * @examples
 * <Icon type="check" />
 * <Icon type="user" className="muted" />
 * <Icon type="ban" stack="2x" />
 */
Icon = React.createClass({displayName: "Icon",
  propTypes: {
    stack:      React.PropTypes.string,
    type:       React.PropTypes.string.isRequired,
    className:  React.PropTypes.string
  },
  mixins: [React.addons.PureRenderMixin],
  render: function () {
    var classes = ['fa fa-icon'];
    var props   = _.omit(this.props, ['stack', 'type', 'className']);

    if (this.props.stack) {
      classes.push('fa-stack-' + this.props.stack);
    }

    if (this.props.spin) {
      classes.push('fa-spin');
    }

    if (this.props.type) {
      classes.push('fa-' + this.props.type);
    }

    if (this.props.className) {
      classes.push(this.props.className)
    }

    if (this.props.size) {
      classes.push('fa-' + this.props.size);
    }

    return (
      React.createElement("i", React.__spread({},  props, {className: classes.join(' ')}))
    );
  }
});

module.exports = Icon;



},{"react":"react","underscore":"underscore"}],4:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var SortIndicator;
var class_map;
var React = require('react');
var Icon = require('./icon.jsx');

class_map = {
  asc:  'sort-up',
  desc: 'sort-down'
};

SortIndicator = React.createClass({displayName: "SortIndicator",
  render: function () {
    var icon      = null;
    var direction = class_map[this.props.direction];

    if (direction) {
      icon = React.createElement(Icon, {type: direction, stack: "1x"});
    }

    return (
      React.createElement("span", {className: "fa-stack sorter"}, 
        React.createElement(Icon, {type: "sort", stack: "1x"}), 
        icon
      )
    );
  }
});

module.exports = SortIndicator;



},{"./icon.jsx":3,"react":"react"}],5:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var Tabs;
var React   = require('react');
var Button  = require('./button.jsx');

Tabs = React.createClass({displayName: "Tabs",
  propTypes: {
    action: React.PropTypes.func,
    tabs:   React.PropTypes.array
  },
  mixins: [React.addons.PureRenderMixin],
  render: function () {
    return (
      React.createElement("ul", {className: "tabs"}, 
        this._buildTabs()
      )
    );
  },
  _buildTabs: function () {
    return this.props.tabs.map(function (tab, index) {
      return (
        React.createElement("li", {key: index}, 
          React.createElement(Button, {onClick: tab.action, icon: tab.icon, text: tab.text})
        )
      );
    }, this);
  }
});

module.exports = Tabs;



},{"./button.jsx":2,"react":"react"}],6:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var Tbody;
var key_map;
var $           = require('jquery');
var React       = require('react');
var Backbone    = require('backbone');
var Scroller    = require('../utils/scroller_coaster');
var Button      = require('./button.jsx');
var Tr          = require('./tr.jsx');
var Td          = require('./td.jsx');
var Icon        = require('./icon.jsx');
var RowDetails  = require('../modules/well_grid/active_row_details.jsx');
var moment      = require('moment');

/**
 * Each transformer should well and attr_name params
 */
var transformers = {
  string:   function (well, name) {
              return well.get(name);
            },
  date:     function (well, name) {
              return moment(well.get(name)).format('MMM D, YYYY h:mm:ssa');
            },
  status:   function (well, name) {
              return (React.createElement(Icon, {type: "check"}));
            },
  actions:  function (well, name) {
              return (
                React.createElement("div", {className: "button-group button-drop"}, 
                  React.createElement(Button, null, 
                    React.createElement(Icon, {type: "caret-down"})
                  ), 
                  React.createElement(Button, null, 
                    React.createElement(Icon, {type: "plus"}), 
                    "Create Case"
                  )
                )
              );
            }
};

key_map = {
  38: 'prev',
  40: 'next'
};

Tbody = React.createClass({displayName: "Tbody",
  propTypes: {
    store: React.PropTypes.instanceOf(Backbone.Model).isRequired
  },
  getInitialState: function () {
    return {
      activeWell: null,
      minimized:  false
    };
  },
  componentDidUpdate: function () {
    var elements;
    var active = this.state.activeWell;

    if (! active) {
      return false;
    }

    elements = [
      this.refs[active].getDOMNode(),
      this.refs.activeWell.getDOMNode()
    ];

    Scroller(elements, {steps: 250});
  },
  componentDidMount: function () {
    $(document).on('keydown.' + this.props.store.cid, function (e) {
      var cid;
      var direction = key_map[e.which];

      if (! this.state.activeWell) {
        return true;
      }

      if (direction) {
        e.preventDefault();
      }

      cid = this.refs.activeWell.props[direction];

      if (cid) {
        this._handleWellSelection(cid);
      }
    }.bind(this));
  },
  componentWillUnmount: function () {
    $(document).off('.' + this.props.store.cid);
  },
  render: function () {
    var rows = this._buildRows();

    return (
      React.createElement("tbody", {className: this.props.className}, 
        rows
      )
    );
  },
  _buildRows: function () {
    var data    = [];
    var store   = this.props.store;
    var wells   = store.get('wells');
    var heading = store.get('first');
    var prev    = null;
    var next    = null;

    wells.each(function (well, index) {
      var selected_row;
      var well_row;
      var active        = this.state.activeWell === well.cid;
      var contents      = this._buildRow(well, heading);
      var odd           = index % 2 > 0 ? 'odd' : '';
      var active_props   = {};

      next = wells.at(index + 1);

      well_row = (
        React.createElement(Tr, {className: odd + (active ? ' active' : ''), ref: well.cid, key: well.cid, onClick: this._handleWellSelection.bind(this, well.cid)}, 
          contents
        )
      );

      data.push(well_row);

      if (active) {
        active_props = {
          className:  odd,
          store:      well,
          prev:       prev,
          next:       next && next.cid,
          switcher:   this._handleWellSelection,
          sizeToggle: this._toggleMinimize,
          key:        well.cid + '-active',
          ref:        'activeWell',
          minimized:  this.state.minimized
        };

        data.push(React.createElement(RowDetails, React.__spread({},  active_props)));
      }

      prev = well.cid;
    }, this);

    return data;
  },
  _buildRow: function (well, heading) {
    var name;
    var value;
    var fields = [];

    while (heading) {
      name = heading.get('name');
      type = heading.get('type');
      value = transformers[type] && transformers[type].call(this, well, name);

      fields.push(
        React.createElement(Td, {store: well, column: heading, key: heading.cid}, 
          value
        )
      );

      heading = heading.next;
    }

    return fields;
  },
  _handleWellSelection: function (cid, increment) {
    var current     = this.state.activeWell;
    var current_top = 0;
    var next_top    = 0;

    if (current === cid) {
      cid = null;
    }

    this.setState({
      activeWell: cid,
      increment:  increment === true,
      previous:   cid ? current : null
    });
  },
  _toggleMinimize: function () {
    this.setState({minimized: ! this.state.minimized});
  }
});

module.exports = Tbody;



},{"../modules/well_grid/active_row_details.jsx":13,"../utils/scroller_coaster":24,"./button.jsx":2,"./icon.jsx":3,"./td.jsx":7,"./tr.jsx":9,"backbone":"backbone","jquery":"jquery","moment":"moment","react":"react"}],7:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var Td;
var React = require('react');

Td = React.createClass({displayName: "Td",
  mixins: [React.addons.PureRenderMixin],
  render: function () {

    return (
      React.createElement("td", React.__spread({},  this.props), 
        this.props.children
      )
    );
  }
});

module.exports = Td;



},{"react":"react"}],8:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var Th;
var React           = require('react');
var Backbone        = require('backbone');
var SortIndicator   = require('./sort_indicator.jsx');

Th = React.createClass({displayName: "Th",
  propTypes: {
    triggerSort: React.PropTypes.string
  },
  render: function () {
    var classes = [this.props.className || ''];
    var sort_indicator = null;
    var new_props = {style:{}};

    if (this.props.triggerSort || this.props.sortDirection) {
      classes.push('sortable');

      sort_indicator = React.createElement(SortIndicator, {direction: this.props.sortDirection})
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
      React.createElement("th", React.__spread({},  new_props, {onClick: this._handleClick}), 
        this.props.children, 
        sort_indicator
      )
    );
  },
  _handleClick: function (e) {
    if (this.props.handleClick) {
      this.props.handleClick(e);
    }
  }
});

module.exports = Th;



},{"./sort_indicator.jsx":4,"backbone":"backbone","react":"react"}],9:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var Tr;
var React = require('react');

Tr = React.createClass({displayName: "Tr",
  mixins: [React.addons.PureRenderMixin],
  render: function () {
    return (
      React.createElement("tr", React.__spread({},  this.props), 
        this.props.children
      )
    );
  }
});

module.exports = Tr;



},{"react":"react"}],10:[function(require,module,exports){
var names     = ['Neo', 'Well', 'Scandis', 'Forto', 'Lorum', 'Parnac', 'Lufkis', 'Blocker', 'Midland', 'OKC', 'Bull', 'Hundo', 'Ferris', 'Alameda', 'Rafael', 'San Pedro'];
var states    = ['Connected', 'Connected', 'Connected', 'Connected', 'Disconnected', 'Unknown'];
var statuses  = ['ok', 'ok', 'ok', 'ok', 'error'];
var texts     = ['2 days', '3 days', 'Unknown', '1 day', '3 months'];
var types     = ['esp', 'plunger', 'crank', 'pcp'];

function randomize (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generate (num) {
  var i;
  var values = [];

  for (i = 0; i < num; i++) {
    values.push({
      status:                   'ok',
      Well_Name:                randomize(names) + ' ' + randomize(names),
      FG_Last_Received_Date:    new Date(),
      Well_State_Text:          randomize(states),
      Current_State_Time_Text:  randomize(texts),
      Lift_Type:                randomize(types),
    });
  }

  return values;
}

module.exports = generate;



},{}],11:[function(require,module,exports){
var values = [];

values = [
  {
    locked:     true,
    minimal:    true,
    name:       'status',
    sortable:   true,
    type:       'status'
  },
  {
    direction:  'asc',
    locked:     true,
    name:       'Well_Name',
    sortable:   true,
    title:      'Well Name',
    type:       'string'
  },
  {
    name:       'Well_State_Text',
    resizable:  true,
    sortable:   true,
    title:      'Well State',
    type:       'string'
  },
  {
    name:       'Current_State_Time_Text',
    resizable:  true,
    sortable:   true,
    title:      'Current State Time',
    type:       'string'
  },
  {
    name:       'FG_Last_Received_Date',
    resizable:  true,
    sortable:   true,
    title:      'FG Last Received Date',
    type:       'date'
  },
  {
    name:       'well-actions',
    resizable:  false,
    sortable:   false,
    title:      'Actions',
    type:       'actions'
  }
];

module.exports = values;



},{}],12:[function(require,module,exports){
"use strict";

module.exports = {
  CHANGE_SORT:      'sort',
  CHANGE_SORT_DIR:  'sort-dir'
};



},{}],13:[function(require,module,exports){
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

ActiveRowDetails = React.createClass({displayName: "ActiveRowDetails",
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
          React.createElement("div", {className: className, key: index}, 
            React.createElement("div", {className: "box"}, 
              item.text
            )
          )
        );
      });

      quick_look = (
        React.createElement("div", {className: "quick-look", ref: "quick-look"}, 
          React.createElement("div", {className: "control"}, 
            React.createElement("a", {className: "button", onClick: this._moveForward}, React.createElement(Icon, {type: "arrow-left"}))
          ), 
          React.createElement("div", {className: "content"}, 

            React.createElement("div", {className: "triclopse"}, 
              React.createElement("div", {className: "inner"}, 

                quick_items

              )
            )

          ), 
          React.createElement("div", {className: "control"}, 
            React.createElement("a", {className: "button", onClick: this._moveBackward}, React.createElement(Icon, {type: "arrow-right"}))
          )
        )
      );
    }

    class_names.push(this.props.className);

    return (
      React.createElement(Tr, {className: class_names.join(' ')}, 
        React.createElement(Td, {colSpan: store.get('headings').length}, 
          React.createElement("fieldset", {className: "separator"}, 
            React.createElement("legend", {align: "center"}, 
              React.createElement(Tabs, {tabs: tabs})
            )
          ), 
          quick_look, 
          React.createElement(WellNav, {wellId: well.cid, size: "small", type: well.get('Lift_Type')})
        )
      )
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



},{"../../components/icon.jsx":3,"../../components/tabs.jsx":5,"../../components/td.jsx":7,"../../components/tr.jsx":9,"./dispatcher":14,"./store":19,"./well_nav.jsx":23,"jquery":"jquery","react":"react"}],14:[function(require,module,exports){
"use strict";

var Dispatcher = require('flux').Dispatcher;

module.exports = new Dispatcher();



},{"flux":"flux"}],15:[function(require,module,exports){
"use strict";

var Backbone = require('backbone');
var Model    = require('./heading_model');

module.exports = Backbone.Collection.extend({
  model: Model,
  changeSort: function (sortee) {
    var model = this.parent;

    if (! model) {
      return false;
    }

    model.get('sortee').endSorting();
    model.set('sortee', sortee);

    payload.sortee.toggleSortDirection();
  },
  changeSortDirection: function (sortee) {
    sortee.toggleSortDirection();
  },
  registerWithDispatcher: function (dispatcher) {
    this.dispatch_token = dispatcher.register(function (payload) {
      switch (payload.action) {
        case table_actions.CHANGE_SORT:
          this.changeSort(payload.sortee);
          break;
        case table_actions.CHANGE_SORT_DIR:
          this.changeSortDirection(payload.sortee);
          break;
      }
    }.bind(this));
  }
});



},{"./heading_model":16,"backbone":"backbone"}],16:[function(require,module,exports){
"use strict";

var directions;
var Model;
var Backbone = require('backbone');

directions = {
  asc:  'desc',
  desc: 'asc'
};

Model = Backbone.Model.extend({
  defaults: {
    direction:  null,
    locked:     false,
    minimal:    false,
    name:       null,
    resizable:  false,
    sortable:   false,
    title:      null,
    width:      null
  },
  toggleSortDirection: function () {
    var current = this.get('direction');
    var next    = 'asc';

    if (current) {
      next = directions[current];
    }

    this.set('direction', next);
  },
  endSorting: function () {
    this.set('direction', null);
  }
});

module.exports = Model;



},{"backbone":"backbone"}],17:[function(require,module,exports){
module.exports = {
  actions:            require('./actions'),
  dispatcher:         require('./dispatcher'),
  store:              require('./store'),
  heading_collection: require('./heading_collection'),
  heading_model:      require('./heading_model'),
  view:               require('./view.jsx')
};



},{"./actions":12,"./dispatcher":14,"./heading_collection":15,"./heading_model":16,"./store":19,"./view.jsx":22}],18:[function(require,module,exports){
"use strict";

function QuickLook (items) {
  var prev;
  var last;

  if (! Array.isArray(items)) {
    items = [items];
  }

  last = items[items.length - 1];

  items.forEach(function (item) {
    if (prev) {
      prev.next = item;
    }

    item.prev = prev;
    prev = item;
  });

  items[0].prev = last;
  last.next     = items[0];

  this.current = items[0];
  this.items = items;
  this.init();
}

QuickLook.prototype.init = function () {
  this.items.forEach(function (item, index) {
    item.text = 'Quick Look ' + index;
    item.id   = 'ql-' + index;
  });
};

QuickLook.prototype.get3 = function () {
  var i;
  var current = this.current;
  var items = [];

  for (i = 0; i < 3; i++) {
    items.push(current);
    current = current.next;
  }

  return items;
};

QuickLook.prototype.goBack = function () {
  this.current = this.current.prev;
};

QuickLook.prototype.goForward = function () {
  this.current = this.current.next;
};

QuickLook.prototype.toJSON = function () {
  return this.get3();
}

module.exports = QuickLook;



},{}],19:[function(require,module,exports){
"use strict";

var store;
var Backbone      = require('backbone');
var TableHeadings = require('./heading_collection');
var table_actions = require('./actions');
var dispatcher    = require('./dispatcher');
var QuickLook     = require('./quick_look');
var well_headings = new TableHeadings();
var wells         = new Backbone.Collection();

well_headings.registerWithDispatcher(dispatcher);

store = new Backbone.Model({
  wells:    wells,
  first:    null,
  headings: well_headings,
  selected: null,
  sortee:   null,
  quick:    new QuickLook([{width: 1}, {width: 1}, {width: 1}, {width: 1}, {width: 1}, {width: 1}])
});

store.get('headings').parent = store;

module.exports = store;



},{"./actions":12,"./dispatcher":14,"./heading_collection":15,"./quick_look":18,"backbone":"backbone"}],20:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var ThWrapper;
var Th              = require('../../components/th.jsx');
var React           = require('react');
var Backbone        = require('backbone');

ThWrapper = React.createClass({displayName: "ThWrapper",
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
      React.createElement(Th, React.__spread({},  this.props,  new_props), 
        data.title
      )
    );
  }
});

module.exports = ThWrapper;



},{"../../components/th.jsx":8,"backbone":"backbone","react":"react"}],21:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var Thead;
var React     = require('react');
var Backbone  = require('backbone');
var Tr        = require('../../components/tr.jsx');
var Th        = require('./th_wrapper.jsx');

Thead = React.createClass({displayName: "Thead",
  propTypes: {
    store: React.PropTypes.instanceOf(Backbone.Model).isRequired
  },
  render: function () {
    var cols = this._buildColumns();

    return (
      React.createElement("thead", {className: this.props.className}, 
        React.createElement(Tr, null, 
          cols
        )
      )
    );
  },
  _buildColumns: function () {
    var data;
    var columns = [];
    var store = this.props.store;
    var current = store.get('first');

    while (current) {
      data              = {};
      data.handleClick  = current.get('sortable') ? this._sortHandler.bind(this, current) : null;
      data.store        = current;
      data.className    = current.get('type') === 'actions' ? 'actions-col' : '';

      columns.push(React.createElement(Th, React.__spread({},  data, {key: current.cid})));
      current = current.next;
    }

    return columns;
  },
  _sortHandler: function (sortee) {
    var store   = this.props.store;
    var current = store.get('sortee');

    if (current.cid !== sortee.cid) {
      current.endSorting();
    }

    store.set('sortee', sortee);
    sortee.toggleSortDirection();

  }
});

module.exports = Thead;



},{"../../components/tr.jsx":9,"./th_wrapper.jsx":20,"backbone":"backbone","react":"react"}],22:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var WellList;
var React = require('react');
var Th    = require('../../components/th.jsx');
var Thead = require('./thead_wrapper.jsx');
var Tbody = require('../../components/tbody.jsx');

var sizes = {
  200: 250,
  250: 200
};

WellList = React.createClass({displayName: "WellList",
  render: function () {
    return (
      React.createElement("table", {className: "full inline-details"}, 
        React.createElement("caption", null, React.createElement("div", {onClick: this._changeWidthHandler}, "toggle 2nd col width width example")), 
        React.createElement(Thead, {store: this.props.store}), 
        React.createElement(Tbody, {store: this.props.store})
      )
    );
  },
  _changeWidthHandler: function () {
    var store = this.props.store.get('headings');
    var third = store.at(2);

    third.set('width', sizes[third.get('width')] || 200);
  }
});

module.exports = WellList;



},{"../../components/tbody.jsx":6,"../../components/th.jsx":8,"./thead_wrapper.jsx":21,"react":"react"}],23:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var WellNav;
var React = require('react');
var Tabs  = require('../../components/tabs.jsx');

WellNav = React.createClass({displayName: "WellNav",
  render: function () {
    return (
      React.createElement("div", {className: "tab-group"}, 
        this._buildTabGroups()
      )
    );
  },
  _buildTabGroups: function () {
    var groups = [];

    groups.push([
      {text: 'Well Dash'},
      {text: 'Details'},
      {text: 'Management'},
      {text: 'Status / Config'},
      {text: 'Events'},
      {text: 'Alarms'}
    ]);

    groups.push([
      {text: this.props.type + ' details'},
      {text: 'Analyze'}
    ]);

    return groups.map(function (group, index) {
      return (
        React.createElement(Tabs, {tabs: group, key: index})
      );
    });
  }
});

module.exports = WellNav;



},{"../../components/tabs.jsx":5,"react":"react"}],24:[function(require,module,exports){
var $ = require('jquery');

function ScrollerCoaster (elements, options) {
  if (! (this instanceof ScrollerCoaster)) {
    return new ScrollerCoaster(elements, options);
  }

  options = options || {};

  this.elements     = Array.isArray(elements) ? elements : [elements];
  this.current      = $(window).scrollTop();
  this.start        = 0;
  this.steps        = options.steps || 150;

  this.calculateScrollPosition().step(0);
}

ScrollerCoaster.prototype.getTop = function getTop () {
  return $(this.elements[0]).offset().top || 0;
};

ScrollerCoaster.prototype.getTotalHeight = function getTotalHeight () {
  var height = 0;

  this.elements.forEach(function (el) {
    height += $(el).outerHeight();
  });

  return height;
};

ScrollerCoaster.prototype.calculateScrollPosition = function calculateScrollPosition () {
  var window_height = $(window).height();
  var mid           = window_height / 2;
  var top           = this.getTop();
  var height        = this.getTotalHeight();
  var destination   = height > window_height ? top : top - mid + height - (height / 2)

  this.diff = destination - this.current;

  return this;
};

ScrollerCoaster.prototype.step = function step (timestamp) {
  var progress;
  var percent;

  this.start  = this.start || timestamp;
  progress    = timestamp - this.start;
  percent     = Math.min(progress / this.steps, 1);

  scrollTo(0, this.current + (this.diff * percent));

  if (percent < 1) {
    requestAnimationFrame(this.step.bind(this));
  }
};

module.exports = ScrollerCoaster;



},{"jquery":"jquery"}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9hcHAuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9jb21wb25lbnRzL2J1dHRvbi5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9jb21wb25lbnRzL2ljb24uanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvY29tcG9uZW50cy9zb3J0X2luZGljYXRvci5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9jb21wb25lbnRzL3RhYnMuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvY29tcG9uZW50cy90Ym9keS5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9jb21wb25lbnRzL3RkLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2NvbXBvbmVudHMvdGguanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvY29tcG9uZW50cy90ci5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9kYXRhL3dlbGxfYm9keS5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2RhdGEvd2VsbF9oZWFkaW5ncy5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvd2VsbF9ncmlkL2FjdGlvbnMuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL3dlbGxfZ3JpZC9hY3RpdmVfcm93X2RldGFpbHMuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy93ZWxsX2dyaWQvZGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvd2VsbF9ncmlkL2hlYWRpbmdfY29sbGVjdGlvbi5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvd2VsbF9ncmlkL2hlYWRpbmdfbW9kZWwuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL3dlbGxfZ3JpZC9pbmRleC5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvd2VsbF9ncmlkL3F1aWNrX2xvb2suanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL3dlbGxfZ3JpZC9zdG9yZS5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvd2VsbF9ncmlkL3RoX3dyYXBwZXIuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy93ZWxsX2dyaWQvdGhlYWRfd3JhcHBlci5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL3dlbGxfZ3JpZC92aWV3LmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvd2VsbF9ncmlkL3dlbGxfbmF2LmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3V0aWxzL3Njcm9sbGVyX2NvYXN0ZXIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFZLENBQUM7O0FBRWIsSUFBSSxLQUFLLENBQUM7QUFDVixJQUFJLEtBQUssQ0FBQztBQUNWLElBQUksUUFBUSxDQUFDO0FBQ2IsSUFBSSxLQUFLLG1CQUFtQixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0MsSUFBSSxVQUFVLGNBQWMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQztBQUN2RCxJQUFJLFFBQVEsZ0JBQWdCLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNoRCxJQUFJLGdCQUFnQixRQUFRLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQzNELElBQUksWUFBWSxZQUFZLGdCQUFnQixDQUFDLElBQUks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QUcsYUFBYSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLE1BQU0sSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDOztBQUV0RixFQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7O0VBRXZDLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyxDQUFDOztBQUVGLGVBQWUsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFNBQVMsSUFBSSxFQUFFLFNBQVMsRUFBRTtFQUN6RCxJQUFJLFFBQVEsQ0FBQztBQUNmLEVBQUUsSUFBSSxPQUFPLENBQUM7O0VBRVosSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLFNBQVMsQ0FBQztFQUN0QyxRQUFRLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDdkMsRUFBRSxPQUFPLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFbkQsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDOztFQUVsRCxJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUU7SUFDZixxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQzdDO0FBQ0gsQ0FBQyxDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsZUFBZSxDQUFDOztBQUVqQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHRoZWFkO1xudmFyIHRib2R5O1xudmFyIGhlYWRpbmdzO1xudmFyIFJlYWN0ICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgRGlzcGF0Y2hlciAgICAgICAgICAgID0gcmVxdWlyZSgnZmx1eCcpLkRpc3BhdGNoZXI7XG52YXIgQmFja2JvbmUgICAgICAgICAgICAgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciB3ZWxsX2dyaWRfbW9kdWxlICAgICAgPSByZXF1aXJlKCcuL21vZHVsZXMvd2VsbF9ncmlkJyk7XG52YXIgV2VsbEdyaWRWaWV3ICAgICAgICAgID0gd2VsbF9ncmlkX21vZHVsZS52aWV3O1xudmFyIHdlbGxfc3RvcmUgICAgICAgICAgICA9IHdlbGxfZ3JpZF9tb2R1bGUuc3RvcmU7XG52YXIgd2VsbF9oZWFkaW5ncyAgICAgICAgID0gd2VsbF9zdG9yZS5nZXQoJ2hlYWRpbmdzJyk7XG52YXIgd2VsbF9saXN0ICAgICAgICAgICAgID0gd2VsbF9zdG9yZS5nZXQoJ3dlbGxzJyk7XG52YXIgd2VsbF9ncmlkX2Rpc3BhdGNoZXIgID0gd2VsbF9ncmlkX21vZHVsZS5kaXNwYXRjaGVyO1xudmFyIF9kYXRhX3dlbGxfaGVhZGluZ3MgICA9IHJlcXVpcmUoJy4vZGF0YS93ZWxsX2hlYWRpbmdzJyk7XG52YXIgX2RhdGFfd2VsbF9ib2R5ICAgICAgID0gcmVxdWlyZSgnLi9kYXRhL3dlbGxfYm9keScpKDUwKTtcblxud2VsbF9oZWFkaW5ncy5zZXQoX2RhdGFfd2VsbF9oZWFkaW5ncyk7XG5cbndlbGxfc3RvcmUuc2V0KCdmaXJzdCcsICB3ZWxsX2hlYWRpbmdzLmF0KDApKTtcbndlbGxfc3RvcmUuc2V0KCdzb3J0ZWUnLCB3ZWxsX2hlYWRpbmdzLmF0KDEpKTtcblxud2VsbF9oZWFkaW5ncy5lYWNoKGZ1bmN0aW9uIChoZWFkZXIsIGluZGV4KSB7XG4gIHZhciBwcmV2ID0gd2VsbF9oZWFkaW5ncy5hdChpbmRleCAtIDEpO1xuICB2YXIgbmV4dCA9IHdlbGxfaGVhZGluZ3MuYXQoaW5kZXggKyAxKTtcblxuICBoZWFkZXIucHJldiA9IHByZXY7XG4gIGhlYWRlci5uZXh0ID0gbmV4dDtcbn0pO1xuXG53ZWxsX2xpc3Quc2V0KF9kYXRhX3dlbGxfYm9keSk7XG5cbi8qKlxuICogUmVuZGVyIHRoZSB3ZWxsIGxpc3RcbiAqKi9cblJlYWN0LnJlbmRlcihcbiAgUmVhY3QuY3JlYXRlRWxlbWVudChXZWxsR3JpZFZpZXcsIHtcbiAgICBkaXNwYXRjaGVyOiB3ZWxsX2dyaWRfZGlzcGF0Y2hlcixcbiAgICBzdG9yZTogd2VsbF9zdG9yZX1cbiAgKSxcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dlbGwtbGlzdCcpKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyRndjQzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeFpRVUZaTEVOQlFVTTdPMEZCUldJc1NVRkJTU3hMUVVGTExFTkJRVU03UVVGRFZpeEpRVUZKTEV0QlFVc3NRMEZCUXp0QlFVTldMRWxCUVVrc1VVRkJVU3hEUVVGRE8wRkJRMklzU1VGQlNTeExRVUZMTEcxQ1FVRnRRaXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdRVUZETjBNc1NVRkJTU3hWUVVGVkxHTkJRV01zVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRMRlZCUVZVc1EwRkJRenRCUVVOMlJDeEpRVUZKTEZGQlFWRXNaMEpCUVdkQ0xFOUJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXp0QlFVTm9SQ3hKUVVGSkxHZENRVUZuUWl4UlFVRlJMRTlCUVU4c1EwRkJReXh4UWtGQmNVSXNRMEZCUXl4RFFVRkRPMEZCUXpORUxFbEJRVWtzV1VGQldTeFpRVUZaTEdkQ1FVRm5RaXhEUVVGRExFbEJRVWtzUTBGQlF6dEJRVU5zUkN4SlFVRkpMRlZCUVZVc1kwRkJZeXhuUWtGQlowSXNRMEZCUXl4TFFVRkxMRU5CUVVNN1FVRkRia1FzU1VGQlNTeGhRVUZoTEZkQlFWY3NWVUZCVlN4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6dEJRVU4yUkN4SlFVRkpMRk5CUVZNc1pVRkJaU3hWUVVGVkxFTkJRVU1zUjBGQlJ5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUTNCRUxFbEJRVWtzYjBKQlFXOUNMRWxCUVVrc1owSkJRV2RDTEVOQlFVTXNWVUZCVlN4RFFVRkRPMEZCUTNoRUxFbEJRVWtzYlVKQlFXMUNMRXRCUVVzc1QwRkJUeXhEUVVGRExITkNRVUZ6UWl4RFFVRkRMRU5CUVVNN1FVRkROVVFzU1VGQlNTeGxRVUZsTEZOQlFWTXNUMEZCVHl4RFFVRkRMR3RDUVVGclFpeERRVUZETEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNN08wRkJSVFZFTEdGQlFXRXNRMEZCUXl4SFFVRkhMRU5CUVVNc2JVSkJRVzFDTEVOQlFVTXNRMEZCUXpzN1FVRkZka01zVlVGQlZTeERRVUZETEVkQlFVY3NRMEZCUXl4UFFVRlBMRWRCUVVjc1lVRkJZU3hEUVVGRExFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUXpsRExGVkJRVlVzUTBGQlF5eEhRVUZITEVOQlFVTXNVVUZCVVN4RlFVRkZMR0ZCUVdFc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZPVU1zWVVGQllTeERRVUZETEVsQlFVa3NRMEZCUXl4VlFVRlZMRTFCUVUwc1JVRkJSU3hMUVVGTExFVkJRVVU3UlVGRE1VTXNTVUZCU1N4SlFVRkpMRWRCUVVjc1lVRkJZU3hEUVVGRExFVkJRVVVzUTBGQlF5eExRVUZMTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRla01zUlVGQlJTeEpRVUZKTEVsQlFVa3NSMEZCUnl4aFFVRmhMRU5CUVVNc1JVRkJSU3hEUVVGRExFdEJRVXNzUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXpzN1JVRkZka01zVFVGQlRTeERRVUZETEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNN1JVRkRia0lzVFVGQlRTeERRVUZETEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNN1FVRkRja0lzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1UwRkJVeXhEUVVGRExFZEJRVWNzUTBGQlF5eGxRVUZsTEVOQlFVTXNRMEZCUXpzN1FVRkZMMEk3TzBsQlJVazdRVUZEU2l4TFFVRkxMRU5CUVVNc1RVRkJUVHRGUVVOV0xFdEJRVXNzUTBGQlF5eGhRVUZoTEVOQlFVTXNXVUZCV1N4RlFVRkZPMGxCUTJoRExGVkJRVlVzUlVGQlJTeHZRa0ZCYjBJN1NVRkRhRU1zUzBGQlN5eEZRVUZGTEZWQlFWVXNRMEZCUXp0SFFVTnVRanRGUVVORUxGRkJRVkVzUTBGQlF5eGpRVUZqTEVOQlFVTXNWMEZCVnl4RFFVRkRMRU5CUVVNc1EwRkJReUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWx3aWRYTmxJSE4wY21samRGd2lPMXh1WEc1MllYSWdkR2hsWVdRN1hHNTJZWElnZEdKdlpIazdYRzUyWVhJZ2FHVmhaR2x1WjNNN1hHNTJZWElnVW1WaFkzUWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRbktUdGNiblpoY2lCRWFYTndZWFJqYUdWeUlDQWdJQ0FnSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2RtYkhWNEp5a3VSR2x6Y0dGMFkyaGxjanRjYm5aaGNpQkNZV05yWW05dVpTQWdJQ0FnSUNBZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkaVlXTnJZbTl1WlNjcE8xeHVkbUZ5SUhkbGJHeGZaM0pwWkY5dGIyUjFiR1VnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR2Ylc5a2RXeGxjeTkzWld4c1gyZHlhV1FuS1R0Y2JuWmhjaUJYWld4c1IzSnBaRlpwWlhjZ0lDQWdJQ0FnSUNBZ1BTQjNaV3hzWDJkeWFXUmZiVzlrZFd4bExuWnBaWGM3WEc1MllYSWdkMlZzYkY5emRHOXlaU0FnSUNBZ0lDQWdJQ0FnSUQwZ2QyVnNiRjluY21sa1gyMXZaSFZzWlM1emRHOXlaVHRjYm5aaGNpQjNaV3hzWDJobFlXUnBibWR6SUNBZ0lDQWdJQ0FnUFNCM1pXeHNYM04wYjNKbExtZGxkQ2duYUdWaFpHbHVaM01uS1R0Y2JuWmhjaUIzWld4c1gyeHBjM1FnSUNBZ0lDQWdJQ0FnSUNBZ1BTQjNaV3hzWDNOMGIzSmxMbWRsZENnbmQyVnNiSE1uS1R0Y2JuWmhjaUIzWld4c1gyZHlhV1JmWkdsemNHRjBZMmhsY2lBZ1BTQjNaV3hzWDJkeWFXUmZiVzlrZFd4bExtUnBjM0JoZEdOb1pYSTdYRzUyWVhJZ1gyUmhkR0ZmZDJWc2JGOW9aV0ZrYVc1bmN5QWdJRDBnY21WeGRXbHlaU2duTGk5a1lYUmhMM2RsYkd4ZmFHVmhaR2x1WjNNbktUdGNiblpoY2lCZlpHRjBZVjkzWld4c1gySnZaSGtnSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2N1TDJSaGRHRXZkMlZzYkY5aWIyUjVKeWtvTlRBcE8xeHVYRzUzWld4c1gyaGxZV1JwYm1kekxuTmxkQ2hmWkdGMFlWOTNaV3hzWDJobFlXUnBibWR6S1R0Y2JseHVkMlZzYkY5emRHOXlaUzV6WlhRb0oyWnBjbk4wSnl3Z0lIZGxiR3hmYUdWaFpHbHVaM011WVhRb01Da3BPMXh1ZDJWc2JGOXpkRzl5WlM1elpYUW9KM052Y25SbFpTY3NJSGRsYkd4ZmFHVmhaR2x1WjNNdVlYUW9NU2twTzF4dVhHNTNaV3hzWDJobFlXUnBibWR6TG1WaFkyZ29ablZ1WTNScGIyNGdLR2hsWVdSbGNpd2dhVzVrWlhncElIdGNiaUFnZG1GeUlIQnlaWFlnUFNCM1pXeHNYMmhsWVdScGJtZHpMbUYwS0dsdVpHVjRJQzBnTVNrN1hHNGdJSFpoY2lCdVpYaDBJRDBnZDJWc2JGOW9aV0ZrYVc1bmN5NWhkQ2hwYm1SbGVDQXJJREVwTzF4dVhHNGdJR2hsWVdSbGNpNXdjbVYySUQwZ2NISmxkanRjYmlBZ2FHVmhaR1Z5TG01bGVIUWdQU0J1WlhoME8xeHVmU2s3WEc1Y2JuZGxiR3hmYkdsemRDNXpaWFFvWDJSaGRHRmZkMlZzYkY5aWIyUjVLVHRjYmx4dUx5b3FYRzRnS2lCU1pXNWtaWElnZEdobElIZGxiR3dnYkdsemRGeHVJQ29xTDF4dVVtVmhZM1F1Y21WdVpHVnlLRnh1SUNCU1pXRmpkQzVqY21WaGRHVkZiR1Z0Wlc1MEtGZGxiR3hIY21sa1ZtbGxkeXdnZTF4dUlDQWdJR1JwYzNCaGRHTm9aWEk2SUhkbGJHeGZaM0pwWkY5a2FYTndZWFJqYUdWeUxGeHVJQ0FnSUhOMGIzSmxPaUIzWld4c1gzTjBiM0psZlZ4dUlDQXBMRnh1SUNCa2IyTjFiV1Z1ZEM1blpYUkZiR1Z0Wlc1MFFubEpaQ2duZDJWc2JDMXNhWE4wSnlrcE8xeHVJbDE5IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBCdXR0b247XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEljb24gID0gcmVxdWlyZSgnLi9pY29uLmpzeCcpO1xuXG5CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQnV0dG9uXCIsXG4gIG1peGluczogW1JlYWN0LmFkZG9ucy5QdXJlUmVuZGVyTWl4aW5dLFxuICBwcm9wVHlwZXM6IHtcbiAgICBpY29uOiAgICAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBvbkNsaWNrOiAgUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgaHJlZjogICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGljb24gICAgICA9IHRoaXMucHJvcHMuaWNvbiA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IHRoaXMucHJvcHMuaWNvbiwgcmVmOiBcImljb25cIn0pIDogbnVsbDtcbiAgICB2YXIgY2xhc3NlcyAgID0gWydidXR0b24nXTtcbiAgICB2YXIgYWZ0ZXJJY29uID0gdGhpcy5wcm9wcy5hZnRlckljb24gPyBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiB0aGlzLnByb3BzLmFmdGVySWNvbiwgcmVmOiBcImFmdGVyLWljb25cIn0pIDogbnVsbDtcbiAgICB2YXIgdGV4dCAgICAgID0gdGhpcy5wcm9wcy50ZXh0ID8gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwidGV4dFwifSwgdGhpcy5wcm9wcy50ZXh0KSkgOiBudWxsO1xuICAgIHZhciBwcm9wcztcblxuICAgIGlmICh0aGlzLnByb3BzLmNsYXNzTmFtZSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcbiAgICB9XG5cbiAgICBwcm9wcyA9IHtcbiAgICAgIGhyZWY6ICAgICAgIHRoaXMucHJvcHMuaHJlZixcbiAgICAgIGFjdGlvbjogICAgIHRoaXMucHJvcHMuYWN0aW9uLFxuICAgICAgb25DbGljazogICAgdGhpcy5faGFuZGxlQ2xpY2ssXG4gICAgICBjbGFzc05hbWU6ICBjbGFzc2VzLmpvaW4oJyAnKVxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwgUmVhY3QuX19zcHJlYWQoe30sICBwcm9wcyksIFxuICAgICAgICBpY29uLCBcbiAgICAgICAgdGV4dCwgXG4gICAgICAgIGFmdGVySWNvblxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIF9oYW5kbGVDbGljazogZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIHRoaXMucHJvcHMub25DbGljayAmJiB0aGlzLnByb3BzLm9uQ2xpY2soZSk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1dHRvbjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyTnZiWEJ2Ym1WdWRITXZZblYwZEc5dUxtcHplQ0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVRzN1FVRkZRU3hIUVVGSE96dEJRVVZJTEVsQlFVa3NUVUZCVFN4RFFVRkRPMEZCUTFnc1NVRkJTU3hMUVVGTExFZEJRVWNzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUXpkQ0xFbEJRVWtzU1VGQlNTeEpRVUZKTEU5QlFVOHNRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJRenM3UVVGRmJFTXNORUpCUVRSQ0xITkNRVUZCTzBWQlF6RkNMRTFCUVUwc1JVRkJSU3hEUVVGRExFdEJRVXNzUTBGQlF5eE5RVUZOTEVOQlFVTXNaVUZCWlN4RFFVRkRPMFZCUTNSRExGTkJRVk1zUlVGQlJUdEpRVU5VTEVsQlFVa3NUVUZCVFN4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFMUJRVTA3U1VGRGFFTXNUMEZCVHl4SFFVRkhMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNUdEpRVU01UWl4SlFVRkpMRTFCUVUwc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTzBkQlEycERPMFZCUTBRc1RVRkJUU3hGUVVGRkxGbEJRVms3U1VGRGJFSXNTVUZCU1N4SlFVRkpMRkZCUVZFc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVkQlFVY3NiMEpCUVVNc1NVRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eEpRVUZCTEVWQlFVa3NRMEZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUlVGQlF5eERRVUZETEVkQlFVRXNSVUZCUnl4RFFVRkRMRTFCUVUwc1EwRkJRU3hEUVVGSExFTkJRVUVzUjBGQlJ5eEpRVUZKTEVOQlFVTTdTVUZEY0VZc1NVRkJTU3hQUVVGUExFdEJRVXNzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0SlFVTXpRaXhKUVVGSkxGTkJRVk1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRk5CUVZNc1IwRkJSeXh2UWtGQlF5eEpRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRWxCUVVFc1JVRkJTU3hEUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4RlFVRkRMRU5CUVVNc1IwRkJRU3hGUVVGSExFTkJRVU1zV1VGQldTeERRVUZCTEVOQlFVY3NRMEZCUVN4SFFVRkhMRWxCUVVrc1EwRkJRenRKUVVOd1J5eEpRVUZKTEVsQlFVa3NVVUZCVVN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzU1VGQlNTeHZRa0ZCUVN4TlFVRkxMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEUxQlFVOHNRMEZCUVN4RlFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQldTeERRVUZCTEVsQlFVa3NTVUZCU1N4RFFVRkRPMEZCUXk5R0xFbEJRVWtzU1VGQlNTeExRVUZMTEVOQlFVTTdPMGxCUlZZc1NVRkJTU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWTXNSVUZCUlR0TlFVTjRRaXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRGVrTXNTMEZCU3pzN1NVRkZSQ3hMUVVGTExFZEJRVWM3VFVGRFRpeEpRVUZKTEZGQlFWRXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSk8wMUJRek5DTEUxQlFVMHNUVUZCVFN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTA3VFVGRE4wSXNUMEZCVHl4TFFVRkxMRWxCUVVrc1EwRkJReXhaUVVGWk8wMUJRemRDTEZOQlFWTXNSMEZCUnl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF6dEJRVU51UXl4TFFVRkxMRU5CUVVNN08wbEJSVVk3VFVGRFJTeHZRa0ZCUVN4SFFVRkZMRVZCUVVFc1owSkJRVUVzUjBGQlFTeERRVUZGTEVkQlFVY3NTMEZCVHl4RFFVRkJMRVZCUVVFN1VVRkRXQ3hKUVVGSkxFVkJRVU03VVVGRFRDeEpRVUZKTEVWQlFVTTdVVUZEVEN4VFFVRlZPMDFCUTFRc1EwRkJRVHROUVVOS08wZEJRMGc3UlVGRFJDeFpRVUZaTEVWQlFVVXNWVUZCVlN4RFFVRkRMRVZCUVVVN1NVRkRla0lzUTBGQlF5eERRVUZETEdOQlFXTXNSVUZCUlN4RFFVRkRPMEZCUTNaQ0xFbEJRVWtzUTBGQlF5eERRVUZETEdWQlFXVXNSVUZCUlN4RFFVRkRPenRKUVVWd1FpeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1NVRkJTU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRIUVVNM1F6dEJRVU5JTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NUVUZCVFN4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlvcVhHNGdLaUJBYW5ONElGSmxZV04wTGtSUFRWeHVJQ292WEc1Y2JuWmhjaUJDZFhSMGIyNDdYRzUyWVhJZ1VtVmhZM1FnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQ2NwTzF4dWRtRnlJRWxqYjI0Z0lEMGdjbVZ4ZFdseVpTZ25MaTlwWTI5dUxtcHplQ2NwTzF4dVhHNUNkWFIwYjI0Z1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUcxcGVHbHVjem9nVzFKbFlXTjBMbUZrWkc5dWN5NVFkWEpsVW1WdVpHVnlUV2w0YVc1ZExGeHVJQ0J3Y205d1ZIbHdaWE02SUh0Y2JpQWdJQ0JwWTI5dU9pQWdJQ0FnVW1WaFkzUXVVSEp2Y0ZSNWNHVnpMbk4wY21sdVp5eGNiaUFnSUNCdmJrTnNhV05yT2lBZ1VtVmhZM1F1VUhKdmNGUjVjR1Z6TG1aMWJtTXNYRzRnSUNBZ2FISmxaam9nSUNBZ0lGSmxZV04wTGxCeWIzQlVlWEJsY3k1emRISnBibWRjYmlBZ2ZTeGNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZG1GeUlHbGpiMjRnSUNBZ0lDQTlJSFJvYVhNdWNISnZjSE11YVdOdmJpQS9JRHhKWTI5dUlIUjVjR1U5ZTNSb2FYTXVjSEp2Y0hNdWFXTnZibjBnY21WbVBWd2lhV052Ymx3aUlDOCtJRG9nYm5Wc2JEdGNiaUFnSUNCMllYSWdZMnhoYzNObGN5QWdJRDBnV3lkaWRYUjBiMjRuWFR0Y2JpQWdJQ0IyWVhJZ1lXWjBaWEpKWTI5dUlEMGdkR2hwY3k1d2NtOXdjeTVoWm5SbGNrbGpiMjRnUHlBOFNXTnZiaUIwZVhCbFBYdDBhR2x6TG5CeWIzQnpMbUZtZEdWeVNXTnZibjBnY21WbVBWd2lZV1owWlhJdGFXTnZibHdpSUM4K0lEb2diblZzYkR0Y2JpQWdJQ0IyWVhJZ2RHVjRkQ0FnSUNBZ0lEMGdkR2hwY3k1d2NtOXdjeTUwWlhoMElEOGdLRHh6Y0dGdUlHTnNZWE56VG1GdFpUMWNJblJsZUhSY0lqNTdkR2hwY3k1d2NtOXdjeTUwWlhoMGZUd3ZjM0JoYmo0cElEb2diblZzYkR0Y2JpQWdJQ0IyWVhJZ2NISnZjSE03WEc1Y2JpQWdJQ0JwWmlBb2RHaHBjeTV3Y205d2N5NWpiR0Z6YzA1aGJXVXBJSHRjYmlBZ0lDQWdJR05zWVhOelpYTXVjSFZ6YUNoMGFHbHpMbkJ5YjNCekxtTnNZWE56VG1GdFpTazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2NISnZjSE1nUFNCN1hHNGdJQ0FnSUNCb2NtVm1PaUFnSUNBZ0lDQjBhR2x6TG5CeWIzQnpMbWh5WldZc1hHNGdJQ0FnSUNCaFkzUnBiMjQ2SUNBZ0lDQjBhR2x6TG5CeWIzQnpMbUZqZEdsdmJpeGNiaUFnSUNBZ0lHOXVRMnhwWTJzNklDQWdJSFJvYVhNdVgyaGhibVJzWlVOc2FXTnJMRnh1SUNBZ0lDQWdZMnhoYzNOT1lXMWxPaUFnWTJ4aGMzTmxjeTVxYjJsdUtDY2dKeWxjYmlBZ0lDQjlPMXh1WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeGhJSHN1TGk1d2NtOXdjMzArWEc0Z0lDQWdJQ0FnSUh0cFkyOXVmVnh1SUNBZ0lDQWdJQ0I3ZEdWNGRIMWNiaUFnSUNBZ0lDQWdlMkZtZEdWeVNXTnZibjFjYmlBZ0lDQWdJRHd2WVQ1Y2JpQWdJQ0FwTzF4dUlDQjlMRnh1SUNCZmFHRnVaR3hsUTJ4cFkyczZJR1oxYm1OMGFXOXVJQ2hsS1NCN1hHNGdJQ0FnWlM1d2NtVjJaVzUwUkdWbVlYVnNkQ2dwTzF4dUlDQWdJR1V1YzNSdmNGQnliM0JoWjJGMGFXOXVLQ2s3WEc1Y2JpQWdJQ0IwYUdsekxuQnliM0J6TG05dVEyeHBZMnNnSmlZZ2RHaHBjeTV3Y205d2N5NXZia05zYVdOcktHVXBPMXh1SUNCOVhHNTlLVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCQ2RYUjBiMjQ3WEc0aVhYMD0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIEljb247XG52YXIgXyAgICAgPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gaWNvbiwgY3VycmVudGx5IHVzaW5nIHRoZSBmb250IGF3ZXNvbWUgaWNvbiBsaWJyYXJ5XG4gKlxuICogQGV4YW1wbGVzXG4gKiA8SWNvbiB0eXBlPVwiY2hlY2tcIiAvPlxuICogPEljb24gdHlwZT1cInVzZXJcIiBjbGFzc05hbWU9XCJtdXRlZFwiIC8+XG4gKiA8SWNvbiB0eXBlPVwiYmFuXCIgc3RhY2s9XCIyeFwiIC8+XG4gKi9cbkljb24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiSWNvblwiLFxuICBwcm9wVHlwZXM6IHtcbiAgICBzdGFjazogICAgICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIHR5cGU6ICAgICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBjbGFzc05hbWU6ICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIG1peGluczogW1JlYWN0LmFkZG9ucy5QdXJlUmVuZGVyTWl4aW5dLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2xhc3NlcyA9IFsnZmEgZmEtaWNvbiddO1xuICAgIHZhciBwcm9wcyAgID0gXy5vbWl0KHRoaXMucHJvcHMsIFsnc3RhY2snLCAndHlwZScsICdjbGFzc05hbWUnXSk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5zdGFjaykge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdmYS1zdGFjay0nICsgdGhpcy5wcm9wcy5zdGFjayk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuc3Bpbikge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdmYS1zcGluJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMudHlwZSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdmYS0nICsgdGhpcy5wcm9wcy50eXBlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jbGFzc05hbWUpIHtcbiAgICAgIGNsYXNzZXMucHVzaCh0aGlzLnByb3BzLmNsYXNzTmFtZSlcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5zaXplKSB7XG4gICAgICBjbGFzc2VzLnB1c2goJ2ZhLScgKyB0aGlzLnByb3BzLnNpemUpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaVwiLCBSZWFjdC5fX3NwcmVhZCh7fSwgIHByb3BzLCB7Y2xhc3NOYW1lOiBjbGFzc2VzLmpvaW4oJyAnKX0pKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEljb247XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMk52YlhCdmJtVnVkSE12YVdOdmJpNXFjM2dpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN08wRkJSVUVzUjBGQlJ6czdRVUZGU0N4SlFVRkpMRWxCUVVrc1EwRkJRenRCUVVOVUxFbEJRVWtzUTBGQlF5eFBRVUZQTEU5QlFVOHNRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJRenRCUVVOc1F5eEpRVUZKTEV0QlFVc3NSMEZCUnl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03TzBGQlJUZENPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdSMEZGUnp0QlFVTklMREJDUVVFd1FpeHZRa0ZCUVR0RlFVTjRRaXhUUVVGVExFVkJRVVU3U1VGRFZDeExRVUZMTEU5QlFVOHNTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhOUVVGTk8wbEJRMnhETEVsQlFVa3NVVUZCVVN4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFMUJRVTBzUTBGQlF5eFZRVUZWTzBsQlF6ZERMRk5CUVZNc1IwRkJSeXhMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEUxQlFVMDdSMEZEYmtNN1JVRkRSQ3hOUVVGTkxFVkJRVVVzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4RFFVRkRMR1ZCUVdVc1EwRkJRenRGUVVOMFF5eE5RVUZOTEVWQlFVVXNXVUZCV1R0SlFVTnNRaXhKUVVGSkxFOUJRVThzUjBGQlJ5eERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPMEZCUTJwRExFbEJRVWtzU1VGQlNTeExRVUZMTEV0QlFVc3NRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eEZRVUZGTEVOQlFVTXNUMEZCVHl4RlFVRkZMRTFCUVUwc1JVRkJSU3hYUVVGWExFTkJRVU1zUTBGQlF5eERRVUZET3p0SlFVVnFSU3hKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4RlFVRkZPMDFCUTNCQ0xFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNWMEZCVnl4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdRVUZEYmtRc1MwRkJTenM3U1VGRlJDeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hGUVVGRk8wMUJRMjVDTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRE9VSXNTMEZCU3pzN1NVRkZSQ3hKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RlFVRkZPMDFCUTI1Q0xFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdRVUZETlVNc1MwRkJTenM3U1VGRlJDeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhGUVVGRk8wMUJRM2hDTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTTdRVUZEZUVNc1MwRkJTenM3U1VGRlJDeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hGUVVGRk8wMUJRMjVDTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkROVU1zUzBGQlN6czdTVUZGUkR0TlFVTkZMRzlDUVVGQkxFZEJRVVVzUlVGQlFTeG5Ra0ZCUVN4SFFVRkJMRU5CUVVVc1IwRkJSeXhMUVVGTExFVkJRVU1zUTBGQlF5eERRVUZCTEZOQlFVRXNSVUZCVXl4RFFVRkZMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZITEVOQlFVRXNRMEZCU1N4RFFVRkJPMDFCUTJoRU8wZEJRMGc3UVVGRFNDeERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEVsQlFVa3NRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFLbHh1SUNvZ1FHcHplQ0JTWldGamRDNUVUMDFjYmlBcUwxeHVYRzUyWVhJZ1NXTnZianRjYm5aaGNpQmZJQ0FnSUNBOUlISmxjWFZwY21Vb0ozVnVaR1Z5YzJOdmNtVW5LVHRjYm5aaGNpQlNaV0ZqZENBOUlISmxjWFZwY21Vb0ozSmxZV04wSnlrN1hHNWNiaThxS2x4dUlDb2dRM0psWVhSbGN5QmhiaUJwWTI5dUxDQmpkWEp5Wlc1MGJIa2dkWE5wYm1jZ2RHaGxJR1p2Ym5RZ1lYZGxjMjl0WlNCcFkyOXVJR3hwWW5KaGNubGNiaUFxWEc0Z0tpQkFaWGhoYlhCc1pYTmNiaUFxSUR4SlkyOXVJSFI1Y0dVOVhDSmphR1ZqYTF3aUlDOCtYRzRnS2lBOFNXTnZiaUIwZVhCbFBWd2lkWE5sY2x3aUlHTnNZWE56VG1GdFpUMWNJbTExZEdWa1hDSWdMejVjYmlBcUlEeEpZMjl1SUhSNWNHVTlYQ0ppWVc1Y0lpQnpkR0ZqYXoxY0lqSjRYQ0lnTHo1Y2JpQXFMMXh1U1dOdmJpQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ2NISnZjRlI1Y0dWek9pQjdYRzRnSUNBZ2MzUmhZMnM2SUNBZ0lDQWdVbVZoWTNRdVVISnZjRlI1Y0dWekxuTjBjbWx1Wnl4Y2JpQWdJQ0IwZVhCbE9pQWdJQ0FnSUNCU1pXRmpkQzVRY205d1ZIbHdaWE11YzNSeWFXNW5MbWx6VW1WeGRXbHlaV1FzWEc0Z0lDQWdZMnhoYzNOT1lXMWxPaUFnVW1WaFkzUXVVSEp2Y0ZSNWNHVnpMbk4wY21sdVoxeHVJQ0I5TEZ4dUlDQnRhWGhwYm5NNklGdFNaV0ZqZEM1aFpHUnZibk11VUhWeVpWSmxibVJsY2sxcGVHbHVYU3hjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2RtRnlJR05zWVhOelpYTWdQU0JiSjJaaElHWmhMV2xqYjI0blhUdGNiaUFnSUNCMllYSWdjSEp2Y0hNZ0lDQTlJRjh1YjIxcGRDaDBhR2x6TG5CeWIzQnpMQ0JiSjNOMFlXTnJKeXdnSjNSNWNHVW5MQ0FuWTJ4aGMzTk9ZVzFsSjEwcE8xeHVYRzRnSUNBZ2FXWWdLSFJvYVhNdWNISnZjSE11YzNSaFkyc3BJSHRjYmlBZ0lDQWdJR05zWVhOelpYTXVjSFZ6YUNnblptRXRjM1JoWTJzdEp5QXJJSFJvYVhNdWNISnZjSE11YzNSaFkyc3BPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2gwYUdsekxuQnliM0J6TG5Od2FXNHBJSHRjYmlBZ0lDQWdJR05zWVhOelpYTXVjSFZ6YUNnblptRXRjM0JwYmljcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdsbUlDaDBhR2x6TG5CeWIzQnpMblI1Y0dVcElIdGNiaUFnSUNBZ0lHTnNZWE56WlhNdWNIVnphQ2duWm1FdEp5QXJJSFJvYVhNdWNISnZjSE11ZEhsd1pTazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLSFJvYVhNdWNISnZjSE11WTJ4aGMzTk9ZVzFsS1NCN1hHNGdJQ0FnSUNCamJHRnpjMlZ6TG5CMWMyZ29kR2hwY3k1d2NtOXdjeTVqYkdGemMwNWhiV1VwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdhV1lnS0hSb2FYTXVjSEp2Y0hNdWMybDZaU2tnZTF4dUlDQWdJQ0FnWTJ4aGMzTmxjeTV3ZFhOb0tDZG1ZUzBuSUNzZ2RHaHBjeTV3Y205d2N5NXphWHBsS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQR2tnZXk0dUxuQnliM0J6ZlNCamJHRnpjMDVoYldVOWUyTnNZWE56WlhNdWFtOXBiaWduSUNjcGZUNDhMMmsrWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1NXTnZianRjYmlKZGZRPT0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFNvcnRJbmRpY2F0b3I7XG52YXIgY2xhc3NfbWFwO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBJY29uID0gcmVxdWlyZSgnLi9pY29uLmpzeCcpO1xuXG5jbGFzc19tYXAgPSB7XG4gIGFzYzogICdzb3J0LXVwJyxcbiAgZGVzYzogJ3NvcnQtZG93bidcbn07XG5cblNvcnRJbmRpY2F0b3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiU29ydEluZGljYXRvclwiLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaWNvbiAgICAgID0gbnVsbDtcbiAgICB2YXIgZGlyZWN0aW9uID0gY2xhc3NfbWFwW3RoaXMucHJvcHMuZGlyZWN0aW9uXTtcblxuICAgIGlmIChkaXJlY3Rpb24pIHtcbiAgICAgIGljb24gPSBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiBkaXJlY3Rpb24sIHN0YWNrOiBcIjF4XCJ9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJmYS1zdGFjayBzb3J0ZXJcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiBcInNvcnRcIiwgc3RhY2s6IFwiMXhcIn0pLCBcbiAgICAgICAgaWNvblxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNvcnRJbmRpY2F0b3I7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMk52YlhCdmJtVnVkSE12YzI5eWRGOXBibVJwWTJGMGIzSXVhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRVVZCTEVkQlFVYzdPMEZCUlVnc1NVRkJTU3hoUVVGaExFTkJRVU03UVVGRGJFSXNTVUZCU1N4VFFVRlRMRU5CUVVNN1FVRkRaQ3hKUVVGSkxFdEJRVXNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1FVRkROMElzU1VGQlNTeEpRVUZKTEVkQlFVY3NUMEZCVHl4RFFVRkRMRmxCUVZrc1EwRkJReXhEUVVGRE96dEJRVVZxUXl4VFFVRlRMRWRCUVVjN1JVRkRWaXhIUVVGSExFZEJRVWNzVTBGQlV6dEZRVU5tTEVsQlFVa3NSVUZCUlN4WFFVRlhPMEZCUTI1Q0xFTkJRVU1zUTBGQlF6czdRVUZGUml4dFEwRkJiVU1zTmtKQlFVRTdSVUZEYWtNc1RVRkJUU3hGUVVGRkxGbEJRVms3U1VGRGJFSXNTVUZCU1N4SlFVRkpMRkZCUVZFc1NVRkJTU3hEUVVGRE8wRkJRM3BDTEVsQlFVa3NTVUZCU1N4VFFVRlRMRWRCUVVjc1UwRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN08wbEJSV2hFTEVsQlFVa3NVMEZCVXl4RlFVRkZPMDFCUTJJc1NVRkJTU3hIUVVGSExHOUNRVUZETEVsQlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1NVRkJRU3hGUVVGSkxFTkJRVVVzVTBGQlV5eEZRVUZETEVOQlFVTXNTMEZCUVN4RlFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGQkxFTkJRVWNzUTBGQlFTeERRVUZETzBGQlEyeEVMRXRCUVVzN08wbEJSVVE3VFVGRFJTeHZRa0ZCUVN4TlFVRkxMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEdsQ1FVRnJRaXhEUVVGQkxFVkJRVUU3VVVGRGFFTXNiMEpCUVVNc1NVRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eEpRVUZCTEVWQlFVa3NRMEZCUXl4TlFVRkJMRVZCUVUwc1EwRkJReXhMUVVGQkxFVkJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVRXNRMEZCUnl4RFFVRkJMRVZCUVVFN1VVRkRPVUlzU1VGQlN6dE5RVU5FTEVOQlFVRTdUVUZEVUR0SFFVTklPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhoUVVGaExFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUZOdmNuUkpibVJwWTJGMGIzSTdYRzUyWVhJZ1kyeGhjM05mYldGd08xeHVkbUZ5SUZKbFlXTjBJRDBnY21WeGRXbHlaU2duY21WaFkzUW5LVHRjYm5aaGNpQkpZMjl1SUQwZ2NtVnhkV2x5WlNnbkxpOXBZMjl1TG1wemVDY3BPMXh1WEc1amJHRnpjMTl0WVhBZ1BTQjdYRzRnSUdGell6b2dJQ2R6YjNKMExYVndKeXhjYmlBZ1pHVnpZem9nSjNOdmNuUXRaRzkzYmlkY2JuMDdYRzVjYmxOdmNuUkpibVJwWTJGMGIzSWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJwWTI5dUlDQWdJQ0FnUFNCdWRXeHNPMXh1SUNBZ0lIWmhjaUJrYVhKbFkzUnBiMjRnUFNCamJHRnpjMTl0WVhCYmRHaHBjeTV3Y205d2N5NWthWEpsWTNScGIyNWRPMXh1WEc0Z0lDQWdhV1lnS0dScGNtVmpkR2x2YmlrZ2UxeHVJQ0FnSUNBZ2FXTnZiaUE5SUR4SlkyOXVJSFI1Y0dVOWUyUnBjbVZqZEdsdmJuMGdjM1JoWTJzOVhDSXhlRndpSUM4K08xeHVJQ0FnSUgxY2JseHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4YzNCaGJpQmpiR0Z6YzA1aGJXVTlYQ0ptWVMxemRHRmpheUJ6YjNKMFpYSmNJajVjYmlBZ0lDQWdJQ0FnUEVsamIyNGdkSGx3WlQxY0luTnZjblJjSWlCemRHRmphejFjSWpGNFhDSWdMejVjYmlBZ0lDQWdJQ0FnZTJsamIyNTlYRzRnSUNBZ0lDQThMM053WVc0K1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdVMjl5ZEVsdVpHbGpZWFJ2Y2p0Y2JpSmRmUT09IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBUYWJzO1xudmFyIFJlYWN0ICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEJ1dHRvbiAgPSByZXF1aXJlKCcuL2J1dHRvbi5qc3gnKTtcblxuVGFicyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUYWJzXCIsXG4gIHByb3BUeXBlczoge1xuICAgIGFjdGlvbjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgdGFiczogICBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlcbiAgfSxcbiAgbWl4aW5zOiBbUmVhY3QuYWRkb25zLlB1cmVSZW5kZXJNaXhpbl0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwge2NsYXNzTmFtZTogXCJ0YWJzXCJ9LCBcbiAgICAgICAgdGhpcy5fYnVpbGRUYWJzKClcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBfYnVpbGRUYWJzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMudGFicy5tYXAoZnVuY3Rpb24gKHRhYiwgaW5kZXgpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7a2V5OiBpbmRleH0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7b25DbGljazogdGFiLmFjdGlvbiwgaWNvbjogdGFiLmljb24sIHRleHQ6IHRhYi50ZXh0fSlcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9LCB0aGlzKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGFicztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyTnZiWEJ2Ym1WdWRITXZkR0ZpY3k1cWMzZ2lYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3TzBGQlJVRXNSMEZCUnpzN1FVRkZTQ3hKUVVGSkxFbEJRVWtzUTBGQlF6dEJRVU5VTEVsQlFVa3NTMEZCU3l4TFFVRkxMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU12UWl4SlFVRkpMRTFCUVUwc1NVRkJTU3hQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTTdPMEZCUlhSRExEQkNRVUV3UWl4dlFrRkJRVHRGUVVONFFpeFRRVUZUTEVWQlFVVTdTVUZEVkN4TlFVRk5MRVZCUVVVc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTzBsQlF6VkNMRWxCUVVrc1NVRkJTU3hMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEV0QlFVczdSMEZET1VJN1JVRkRSQ3hOUVVGTkxFVkJRVVVzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4RFFVRkRMR1ZCUVdVc1EwRkJRenRGUVVOMFF5eE5RVUZOTEVWQlFVVXNXVUZCV1R0SlFVTnNRanROUVVORkxHOUNRVUZCTEVsQlFVY3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zVFVGQlR5eERRVUZCTEVWQlFVRTdVVUZEYkVJc1NVRkJTU3hEUVVGRExGVkJRVlVzUlVGQlJ6dE5RVU5vUWl4RFFVRkJPMDFCUTB3N1IwRkRTRHRGUVVORUxGVkJRVlVzUlVGQlJTeFpRVUZaTzBsQlEzUkNMRTlCUVU4c1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVZVc1IwRkJSeXhGUVVGRkxFdEJRVXNzUlVGQlJUdE5RVU12UXp0UlFVTkZMRzlDUVVGQkxFbEJRVWNzUlVGQlFTeERRVUZCTEVOQlFVTXNSMEZCUVN4RlFVRkhMRU5CUVVVc1MwRkJUeXhEUVVGQkxFVkJRVUU3VlVGRFpDeHZRa0ZCUXl4TlFVRk5MRVZCUVVFc1EwRkJRU3hEUVVGRExFOUJRVUVzUlVGQlR5eERRVUZGTEVkQlFVY3NRMEZCUXl4TlFVRk5MRVZCUVVNc1EwRkJReXhKUVVGQkxFVkJRVWtzUTBGQlJTeEhRVUZITEVOQlFVTXNTVUZCU1N4RlFVRkRMRU5CUVVNc1NVRkJRU3hGUVVGSkxFTkJRVVVzUjBGQlJ5eERRVUZETEVsQlFVc3NRMEZCUVN4RFFVRkhMRU5CUVVFN1VVRkROVVFzUTBGQlFUdFJRVU5NTzB0QlEwZ3NSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenRIUVVOV08wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRlJoWW5NN1hHNTJZWElnVW1WaFkzUWdJQ0E5SUhKbGNYVnBjbVVvSjNKbFlXTjBKeWs3WEc1MllYSWdRblYwZEc5dUlDQTlJSEpsY1hWcGNtVW9KeTR2WW5WMGRHOXVMbXB6ZUNjcE8xeHVYRzVVWVdKeklEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1SUNCd2NtOXdWSGx3WlhNNklIdGNiaUFnSUNCaFkzUnBiMjQ2SUZKbFlXTjBMbEJ5YjNCVWVYQmxjeTVtZFc1akxGeHVJQ0FnSUhSaFluTTZJQ0FnVW1WaFkzUXVVSEp2Y0ZSNWNHVnpMbUZ5Y21GNVhHNGdJSDBzWEc0Z0lHMXBlR2x1Y3pvZ1cxSmxZV04wTG1Ga1pHOXVjeTVRZFhKbFVtVnVaR1Z5VFdsNGFXNWRMRnh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEhWc0lHTnNZWE56VG1GdFpUMWNJblJoWW5OY0lqNWNiaUFnSUNBZ0lDQWdlM1JvYVhNdVgySjFhV3hrVkdGaWN5Z3BmVnh1SUNBZ0lDQWdQQzkxYkQ1Y2JpQWdJQ0FwTzF4dUlDQjlMRnh1SUNCZlluVnBiR1JVWVdKek9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11Y0hKdmNITXVkR0ZpY3k1dFlYQW9ablZ1WTNScGIyNGdLSFJoWWl3Z2FXNWtaWGdwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0FnSUR4c2FTQnJaWGs5ZTJsdVpHVjRmVDVjYmlBZ0lDQWdJQ0FnSUNBOFFuVjBkRzl1SUc5dVEyeHBZMnM5ZTNSaFlpNWhZM1JwYjI1OUlHbGpiMjQ5ZTNSaFlpNXBZMjl1ZlNCMFpYaDBQWHQwWVdJdWRHVjRkSDBnTHo1Y2JpQWdJQ0FnSUNBZ1BDOXNhVDVjYmlBZ0lDQWdJQ2s3WEc0Z0lDQWdmU3dnZEdocGN5azdYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUZSaFluTTdYRzRpWFgwPSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgVGJvZHk7XG52YXIga2V5X21hcDtcbnZhciAkICAgICAgICAgICA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIFJlYWN0ICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBCYWNrYm9uZSAgICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgU2Nyb2xsZXIgICAgPSByZXF1aXJlKCcuLi91dGlscy9zY3JvbGxlcl9jb2FzdGVyJyk7XG52YXIgQnV0dG9uICAgICAgPSByZXF1aXJlKCcuL2J1dHRvbi5qc3gnKTtcbnZhciBUciAgICAgICAgICA9IHJlcXVpcmUoJy4vdHIuanN4Jyk7XG52YXIgVGQgICAgICAgICAgPSByZXF1aXJlKCcuL3RkLmpzeCcpO1xudmFyIEljb24gICAgICAgID0gcmVxdWlyZSgnLi9pY29uLmpzeCcpO1xudmFyIFJvd0RldGFpbHMgID0gcmVxdWlyZSgnLi4vbW9kdWxlcy93ZWxsX2dyaWQvYWN0aXZlX3Jvd19kZXRhaWxzLmpzeCcpO1xudmFyIG1vbWVudCAgICAgID0gcmVxdWlyZSgnbW9tZW50Jyk7XG5cbi8qKlxuICogRWFjaCB0cmFuc2Zvcm1lciBzaG91bGQgd2VsbCBhbmQgYXR0cl9uYW1lIHBhcmFtc1xuICovXG52YXIgdHJhbnNmb3JtZXJzID0ge1xuICBzdHJpbmc6ICAgZnVuY3Rpb24gKHdlbGwsIG5hbWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHdlbGwuZ2V0KG5hbWUpO1xuICAgICAgICAgICAgfSxcbiAgZGF0ZTogICAgIGZ1bmN0aW9uICh3ZWxsLCBuYW1lKSB7XG4gICAgICAgICAgICAgIHJldHVybiBtb21lbnQod2VsbC5nZXQobmFtZSkpLmZvcm1hdCgnTU1NIEQsIFlZWVkgaDptbTpzc2EnKTtcbiAgICAgICAgICAgIH0sXG4gIHN0YXR1czogICBmdW5jdGlvbiAod2VsbCwgbmFtZSkge1xuICAgICAgICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IFwiY2hlY2tcIn0pKTtcbiAgICAgICAgICAgIH0sXG4gIGFjdGlvbnM6ICBmdW5jdGlvbiAod2VsbCwgbmFtZSkge1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJidXR0b24tZ3JvdXAgYnV0dG9uLWRyb3BcIn0sIFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIG51bGwsIFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiBcImNhcmV0LWRvd25cIn0pXG4gICAgICAgICAgICAgICAgICApLCBcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCBudWxsLCBcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogXCJwbHVzXCJ9KSwgXG4gICAgICAgICAgICAgICAgICAgIFwiQ3JlYXRlIENhc2VcIlxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbn07XG5cbmtleV9tYXAgPSB7XG4gIDM4OiAncHJldicsXG4gIDQwOiAnbmV4dCdcbn07XG5cblRib2R5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRib2R5XCIsXG4gIHByb3BUeXBlczoge1xuICAgIHN0b3JlOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihCYWNrYm9uZS5Nb2RlbCkuaXNSZXF1aXJlZFxuICB9LFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWN0aXZlV2VsbDogbnVsbCxcbiAgICAgIG1pbmltaXplZDogIGZhbHNlXG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVsZW1lbnRzO1xuICAgIHZhciBhY3RpdmUgPSB0aGlzLnN0YXRlLmFjdGl2ZVdlbGw7XG5cbiAgICBpZiAoISBhY3RpdmUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBlbGVtZW50cyA9IFtcbiAgICAgIHRoaXMucmVmc1thY3RpdmVdLmdldERPTU5vZGUoKSxcbiAgICAgIHRoaXMucmVmcy5hY3RpdmVXZWxsLmdldERPTU5vZGUoKVxuICAgIF07XG5cbiAgICBTY3JvbGxlcihlbGVtZW50cywge3N0ZXBzOiAyNTB9KTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAkKGRvY3VtZW50KS5vbigna2V5ZG93bi4nICsgdGhpcy5wcm9wcy5zdG9yZS5jaWQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgY2lkO1xuICAgICAgdmFyIGRpcmVjdGlvbiA9IGtleV9tYXBbZS53aGljaF07XG5cbiAgICAgIGlmICghIHRoaXMuc3RhdGUuYWN0aXZlV2VsbCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRpcmVjdGlvbikge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNpZCA9IHRoaXMucmVmcy5hY3RpdmVXZWxsLnByb3BzW2RpcmVjdGlvbl07XG5cbiAgICAgIGlmIChjaWQpIHtcbiAgICAgICAgdGhpcy5faGFuZGxlV2VsbFNlbGVjdGlvbihjaWQpO1xuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgJChkb2N1bWVudCkub2ZmKCcuJyArIHRoaXMucHJvcHMuc3RvcmUuY2lkKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJvd3MgPSB0aGlzLl9idWlsZFJvd3MoKTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGJvZHlcIiwge2NsYXNzTmFtZTogdGhpcy5wcm9wcy5jbGFzc05hbWV9LCBcbiAgICAgICAgcm93c1xuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIF9idWlsZFJvd3M6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGF0YSAgICA9IFtdO1xuICAgIHZhciBzdG9yZSAgID0gdGhpcy5wcm9wcy5zdG9yZTtcbiAgICB2YXIgd2VsbHMgICA9IHN0b3JlLmdldCgnd2VsbHMnKTtcbiAgICB2YXIgaGVhZGluZyA9IHN0b3JlLmdldCgnZmlyc3QnKTtcbiAgICB2YXIgcHJldiAgICA9IG51bGw7XG4gICAgdmFyIG5leHQgICAgPSBudWxsO1xuXG4gICAgd2VsbHMuZWFjaChmdW5jdGlvbiAod2VsbCwgaW5kZXgpIHtcbiAgICAgIHZhciBzZWxlY3RlZF9yb3c7XG4gICAgICB2YXIgd2VsbF9yb3c7XG4gICAgICB2YXIgYWN0aXZlICAgICAgICA9IHRoaXMuc3RhdGUuYWN0aXZlV2VsbCA9PT0gd2VsbC5jaWQ7XG4gICAgICB2YXIgY29udGVudHMgICAgICA9IHRoaXMuX2J1aWxkUm93KHdlbGwsIGhlYWRpbmcpO1xuICAgICAgdmFyIG9kZCAgICAgICAgICAgPSBpbmRleCAlIDIgPiAwID8gJ29kZCcgOiAnJztcbiAgICAgIHZhciBhY3RpdmVfcHJvcHMgICA9IHt9O1xuXG4gICAgICBuZXh0ID0gd2VsbHMuYXQoaW5kZXggKyAxKTtcblxuICAgICAgd2VsbF9yb3cgPSAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHIsIHtjbGFzc05hbWU6IG9kZCArIChhY3RpdmUgPyAnIGFjdGl2ZScgOiAnJyksIHJlZjogd2VsbC5jaWQsIGtleTogd2VsbC5jaWQsIG9uQ2xpY2s6IHRoaXMuX2hhbmRsZVdlbGxTZWxlY3Rpb24uYmluZCh0aGlzLCB3ZWxsLmNpZCl9LCBcbiAgICAgICAgICBjb250ZW50c1xuICAgICAgICApXG4gICAgICApO1xuXG4gICAgICBkYXRhLnB1c2god2VsbF9yb3cpO1xuXG4gICAgICBpZiAoYWN0aXZlKSB7XG4gICAgICAgIGFjdGl2ZV9wcm9wcyA9IHtcbiAgICAgICAgICBjbGFzc05hbWU6ICBvZGQsXG4gICAgICAgICAgc3RvcmU6ICAgICAgd2VsbCxcbiAgICAgICAgICBwcmV2OiAgICAgICBwcmV2LFxuICAgICAgICAgIG5leHQ6ICAgICAgIG5leHQgJiYgbmV4dC5jaWQsXG4gICAgICAgICAgc3dpdGNoZXI6ICAgdGhpcy5faGFuZGxlV2VsbFNlbGVjdGlvbixcbiAgICAgICAgICBzaXplVG9nZ2xlOiB0aGlzLl90b2dnbGVNaW5pbWl6ZSxcbiAgICAgICAgICBrZXk6ICAgICAgICB3ZWxsLmNpZCArICctYWN0aXZlJyxcbiAgICAgICAgICByZWY6ICAgICAgICAnYWN0aXZlV2VsbCcsXG4gICAgICAgICAgbWluaW1pemVkOiAgdGhpcy5zdGF0ZS5taW5pbWl6ZWRcbiAgICAgICAgfTtcblxuICAgICAgICBkYXRhLnB1c2goUmVhY3QuY3JlYXRlRWxlbWVudChSb3dEZXRhaWxzLCBSZWFjdC5fX3NwcmVhZCh7fSwgIGFjdGl2ZV9wcm9wcykpKTtcbiAgICAgIH1cblxuICAgICAgcHJldiA9IHdlbGwuY2lkO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH0sXG4gIF9idWlsZFJvdzogZnVuY3Rpb24gKHdlbGwsIGhlYWRpbmcpIHtcbiAgICB2YXIgbmFtZTtcbiAgICB2YXIgdmFsdWU7XG4gICAgdmFyIGZpZWxkcyA9IFtdO1xuXG4gICAgd2hpbGUgKGhlYWRpbmcpIHtcbiAgICAgIG5hbWUgPSBoZWFkaW5nLmdldCgnbmFtZScpO1xuICAgICAgdHlwZSA9IGhlYWRpbmcuZ2V0KCd0eXBlJyk7XG4gICAgICB2YWx1ZSA9IHRyYW5zZm9ybWVyc1t0eXBlXSAmJiB0cmFuc2Zvcm1lcnNbdHlwZV0uY2FsbCh0aGlzLCB3ZWxsLCBuYW1lKTtcblxuICAgICAgZmllbGRzLnB1c2goXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGQsIHtzdG9yZTogd2VsbCwgY29sdW1uOiBoZWFkaW5nLCBrZXk6IGhlYWRpbmcuY2lkfSwgXG4gICAgICAgICAgdmFsdWVcbiAgICAgICAgKVxuICAgICAgKTtcblxuICAgICAgaGVhZGluZyA9IGhlYWRpbmcubmV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmllbGRzO1xuICB9LFxuICBfaGFuZGxlV2VsbFNlbGVjdGlvbjogZnVuY3Rpb24gKGNpZCwgaW5jcmVtZW50KSB7XG4gICAgdmFyIGN1cnJlbnQgICAgID0gdGhpcy5zdGF0ZS5hY3RpdmVXZWxsO1xuICAgIHZhciBjdXJyZW50X3RvcCA9IDA7XG4gICAgdmFyIG5leHRfdG9wICAgID0gMDtcblxuICAgIGlmIChjdXJyZW50ID09PSBjaWQpIHtcbiAgICAgIGNpZCA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBhY3RpdmVXZWxsOiBjaWQsXG4gICAgICBpbmNyZW1lbnQ6ICBpbmNyZW1lbnQgPT09IHRydWUsXG4gICAgICBwcmV2aW91czogICBjaWQgPyBjdXJyZW50IDogbnVsbFxuICAgIH0pO1xuICB9LFxuICBfdG9nZ2xlTWluaW1pemU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHttaW5pbWl6ZWQ6ICEgdGhpcy5zdGF0ZS5taW5pbWl6ZWR9KTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGJvZHk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMk52YlhCdmJtVnVkSE12ZEdKdlpIa3Vhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRVVZCTEVkQlFVYzdPMEZCUlVnc1NVRkJTU3hMUVVGTExFTkJRVU03UVVGRFZpeEpRVUZKTEU5QlFVOHNRMEZCUXp0QlFVTmFMRWxCUVVrc1EwRkJReXhoUVVGaExFOUJRVThzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0QlFVTndReXhKUVVGSkxFdEJRVXNzVTBGQlV5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1FVRkRia01zU1VGQlNTeFJRVUZSTEUxQlFVMHNUMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRE8wRkJRM1JETEVsQlFVa3NVVUZCVVN4TlFVRk5MRTlCUVU4c1EwRkJReXd5UWtGQk1rSXNRMEZCUXl4RFFVRkRPMEZCUTNaRUxFbEJRVWtzVFVGQlRTeFJRVUZSTEU5QlFVOHNRMEZCUXl4alFVRmpMRU5CUVVNc1EwRkJRenRCUVVNeFF5eEpRVUZKTEVWQlFVVXNXVUZCV1N4UFFVRlBMRU5CUVVNc1ZVRkJWU3hEUVVGRExFTkJRVU03UVVGRGRFTXNTVUZCU1N4RlFVRkZMRmxCUVZrc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETzBGQlEzUkRMRWxCUVVrc1NVRkJTU3hWUVVGVkxFOUJRVThzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXp0QlFVTjRReXhKUVVGSkxGVkJRVlVzU1VGQlNTeFBRVUZQTEVOQlFVTXNOa05CUVRaRExFTkJRVU1zUTBGQlF6dEJRVU42UlN4SlFVRkpMRTFCUVUwc1VVRkJVU3hQUVVGUExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdPMEZCUlhCRE96dEhRVVZITzBGQlEwZ3NTVUZCU1N4WlFVRlpMRWRCUVVjN1JVRkRha0lzVFVGQlRTeEpRVUZKTEZWQlFWVXNTVUZCU1N4RlFVRkZMRWxCUVVrc1JVRkJSVHRqUVVOd1FpeFBRVUZQTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03WVVGRGRrSTdSVUZEV0N4SlFVRkpMRTFCUVUwc1ZVRkJWU3hKUVVGSkxFVkJRVVVzU1VGQlNTeEZRVUZGTzJOQlEzQkNMRTlCUVU4c1RVRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zYzBKQlFYTkNMRU5CUVVNc1EwRkJRenRoUVVNNVJEdEZRVU5ZTEUxQlFVMHNTVUZCU1N4VlFVRlZMRWxCUVVrc1JVRkJSU3hKUVVGSkxFVkJRVVU3WTBGRGNFSXNVVUZCVVN4dlFrRkJReXhKUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEVsQlFVRXNSVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJRU3hEUVVGSExFTkJRVUVzUlVGQlJUdGhRVU5vUXp0RlFVTllMRTlCUVU4c1IwRkJSeXhWUVVGVkxFbEJRVWtzUlVGQlJTeEpRVUZKTEVWQlFVVTdZMEZEY0VJN1owSkJRMFVzYjBKQlFVRXNTMEZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5d3dRa0ZCTWtJc1EwRkJRU3hGUVVGQk8ydENRVU40UXl4dlFrRkJReXhOUVVGTkxFVkJRVUVzU1VGQlF5eEZRVUZCTzI5Q1FVTk9MRzlDUVVGRExFbEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNTVUZCUVN4RlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGQkxFTkJRVWNzUTBGQlFUdHJRa0ZEYmtJc1EwRkJRU3hGUVVGQk8ydENRVU5VTEc5Q1FVRkRMRTFCUVUwc1JVRkJRU3hKUVVGRExFVkJRVUU3YjBKQlEwNHNiMEpCUVVNc1NVRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eEpRVUZCTEVWQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVFc1EwRkJSeXhEUVVGQkxFVkJRVUU3UVVGQlFTeHZRa0ZCUVN4aFFVRkJPMEZCUVVFc2EwSkJSV0lzUTBGQlFUdG5Ra0ZEVEN4RFFVRkJPMmRDUVVOT08yRkJRMGc3UVVGRFlpeERRVUZETEVOQlFVTTdPMEZCUlVZc1QwRkJUeXhIUVVGSE8wVkJRMUlzUlVGQlJTeEZRVUZGTEUxQlFVMDdSVUZEVml4RlFVRkZMRVZCUVVVc1RVRkJUVHRCUVVOYUxFTkJRVU1zUTBGQlF6czdRVUZGUml3eVFrRkJNa0lzY1VKQlFVRTdSVUZEZWtJc1UwRkJVeXhGUVVGRk8wbEJRMVFzUzBGQlN5eEZRVUZGTEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1ZVRkJWU3hEUVVGRExGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4VlFVRlZPMGRCUXpkRU8wVkJRMFFzWlVGQlpTeEZRVUZGTEZsQlFWazdTVUZETTBJc1QwRkJUenROUVVOTUxGVkJRVlVzUlVGQlJTeEpRVUZKTzAxQlEyaENMRk5CUVZNc1IwRkJSeXhMUVVGTE8wdEJRMnhDTEVOQlFVTTdSMEZEU0R0RlFVTkVMR3RDUVVGclFpeEZRVUZGTEZsQlFWazdTVUZET1VJc1NVRkJTU3hSUVVGUkxFTkJRVU03UVVGRGFrSXNTVUZCU1N4SlFVRkpMRTFCUVUwc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZWQlFWVXNRMEZCUXpzN1NVRkZia01zU1VGQlNTeEZRVUZGTEUxQlFVMHNSVUZCUlR0TlFVTmFMRTlCUVU4c1MwRkJTeXhEUVVGRE8wRkJRMjVDTEV0QlFVczdPMGxCUlVRc1VVRkJVU3hIUVVGSE8wMUJRMVFzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJReXhWUVVGVkxFVkJRVVU3VFVGRE9VSXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zVlVGQlZTeEZRVUZGTzBGQlEzWkRMRXRCUVVzc1EwRkJRenM3U1VGRlJpeFJRVUZSTEVOQlFVTXNVVUZCVVN4RlFVRkZMRU5CUVVNc1MwRkJTeXhGUVVGRkxFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdSMEZEYkVNN1JVRkRSQ3hwUWtGQmFVSXNSVUZCUlN4WlFVRlpPMGxCUXpkQ0xFTkJRVU1zUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1ZVRkJWU3hIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1JVRkJSU3hWUVVGVkxFTkJRVU1zUlVGQlJUdE5RVU0zUkN4SlFVRkpMRWRCUVVjc1EwRkJRenRCUVVOa0xFMUJRVTBzU1VGQlNTeFRRVUZUTEVkQlFVY3NUMEZCVHl4RFFVRkRMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6czdUVUZGYWtNc1NVRkJTU3hGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNWVUZCVlN4RlFVRkZPMUZCUXpOQ0xFOUJRVThzU1VGQlNTeERRVUZETzBGQlEzQkNMRTlCUVU4N08wMUJSVVFzU1VGQlNTeFRRVUZUTEVWQlFVVTdVVUZEWWl4RFFVRkRMRU5CUVVNc1kwRkJZeXhGUVVGRkxFTkJRVU03UVVGRE0wSXNUMEZCVHpzN1FVRkZVQ3hOUVVGTkxFZEJRVWNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdPMDFCUlRWRExFbEJRVWtzUjBGQlJ5eEZRVUZGTzFGQlExQXNTVUZCU1N4RFFVRkRMRzlDUVVGdlFpeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPMDlCUTJoRE8wdEJRMFlzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRenRIUVVObU8wVkJRMFFzYjBKQlFXOUNMRVZCUVVVc1dVRkJXVHRKUVVOb1F5eERRVUZETEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNc1IwRkJSeXhEUVVGRExFZEJRVWNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF6dEhRVU0zUXp0RlFVTkVMRTFCUVUwc1JVRkJSU3haUVVGWk8wRkJRM1JDTEVsQlFVa3NTVUZCU1N4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRExGVkJRVlVzUlVGQlJTeERRVUZET3p0SlFVVTNRanROUVVORkxHOUNRVUZCTEU5QlFVMHNSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4VFFVRlhMRU5CUVVFc1JVRkJRVHRSUVVOeVF5eEpRVUZMTzAxQlEwRXNRMEZCUVR0TlFVTlNPMGRCUTBnN1JVRkRSQ3hWUVVGVkxFVkJRVVVzV1VGQldUdEpRVU4wUWl4SlFVRkpMRWxCUVVrc1RVRkJUU3hGUVVGRkxFTkJRVU03U1VGRGFrSXNTVUZCU1N4TFFVRkxMRXRCUVVzc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTTdTVUZETDBJc1NVRkJTU3hMUVVGTExFdEJRVXNzUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRKUVVOcVF5eEpRVUZKTEU5QlFVOHNSMEZCUnl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzBsQlEycERMRWxCUVVrc1NVRkJTU3hOUVVGTkxFbEJRVWtzUTBGQlF6dEJRVU4yUWl4SlFVRkpMRWxCUVVrc1NVRkJTU3hOUVVGTkxFbEJRVWtzUTBGQlF6czdTVUZGYmtJc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eFZRVUZWTEVsQlFVa3NSVUZCUlN4TFFVRkxMRVZCUVVVN1RVRkRhRU1zU1VGQlNTeFpRVUZaTEVOQlFVTTdUVUZEYWtJc1NVRkJTU3hSUVVGUkxFTkJRVU03VFVGRFlpeEpRVUZKTEUxQlFVMHNWVUZCVlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGVkJRVlVzUzBGQlN5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRPMDFCUTNaRUxFbEJRVWtzVVVGQlVTeFJRVUZSTEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTU3hGUVVGRkxFOUJRVThzUTBGQlF5eERRVUZETzAxQlEyeEVMRWxCUVVrc1IwRkJSeXhoUVVGaExFdEJRVXNzUjBGQlJ5eERRVUZETEVkQlFVY3NRMEZCUXl4SFFVRkhMRXRCUVVzc1IwRkJSeXhGUVVGRkxFTkJRVU03UVVGRGNrUXNUVUZCVFN4SlFVRkpMRmxCUVZrc1MwRkJTeXhGUVVGRkxFTkJRVU03TzBGQlJUbENMRTFCUVUwc1NVRkJTU3hIUVVGSExFdEJRVXNzUTBGQlF5eEZRVUZGTEVOQlFVTXNTMEZCU3l4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRE96dE5RVVV6UWl4UlFVRlJPMUZCUTA0c2IwSkJRVU1zUlVGQlJTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJSU3hIUVVGSExFbEJRVWtzVFVGQlRTeEhRVUZITEZOQlFWTXNSMEZCUnl4RlFVRkZMRU5CUVVNc1JVRkJReXhEUVVGRExFZEJRVUVzUlVGQlJ5eERRVUZGTEVsQlFVa3NRMEZCUXl4SFFVRkhMRVZCUVVNc1EwRkJReXhIUVVGQkxFVkJRVWNzUTBGQlJTeEpRVUZKTEVOQlFVTXNSMEZCUnl4RlFVRkRMRU5CUVVNc1QwRkJRU3hGUVVGUExFTkJRVVVzU1VGQlNTeERRVUZETEc5Q1FVRnZRaXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJSeXhEUVVGQkxFVkJRVUU3VlVGRGNFa3NVVUZCVXp0UlFVTlFMRU5CUVVFN1FVRkRZaXhQUVVGUExFTkJRVU03TzBGQlJWSXNUVUZCVFN4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZET3p0TlFVVndRaXhKUVVGSkxFMUJRVTBzUlVGQlJUdFJRVU5XTEZsQlFWa3NSMEZCUnp0VlFVTmlMRk5CUVZNc1IwRkJSeXhIUVVGSE8xVkJRMllzUzBGQlN5eFBRVUZQTEVsQlFVazdWVUZEYUVJc1NVRkJTU3hSUVVGUkxFbEJRVWs3VlVGRGFFSXNTVUZCU1N4UlFVRlJMRWxCUVVrc1NVRkJTU3hKUVVGSkxFTkJRVU1zUjBGQlJ6dFZRVU0xUWl4UlFVRlJMRWxCUVVrc1NVRkJTU3hEUVVGRExHOUNRVUZ2UWp0VlFVTnlReXhWUVVGVkxFVkJRVVVzU1VGQlNTeERRVUZETEdWQlFXVTdWVUZEYUVNc1IwRkJSeXhUUVVGVExFbEJRVWtzUTBGQlF5eEhRVUZITEVkQlFVY3NVMEZCVXp0VlFVTm9ReXhIUVVGSExGTkJRVk1zV1VGQldUdFZRVU40UWl4VFFVRlRMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTzBGQlF6RkRMRk5CUVZNc1EwRkJRenM3VVVGRlJpeEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRzlDUVVGRExGVkJRVlVzUlVGQlFTeG5Ra0ZCUVN4SFFVRkJMRU5CUVVVc1IwRkJSeXhaUVVGaExFTkJRVUVzUTBGQlJ5eERRVUZCTEVOQlFVTXNRMEZCUXp0QlFVTndSQ3hQUVVGUE96dE5RVVZFTEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRE8wRkJRM1JDTEV0QlFVc3NSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenM3U1VGRlZDeFBRVUZQTEVsQlFVa3NRMEZCUXp0SFFVTmlPMFZCUTBRc1UwRkJVeXhGUVVGRkxGVkJRVlVzU1VGQlNTeEZRVUZGTEU5QlFVOHNSVUZCUlR0SlFVTnNReXhKUVVGSkxFbEJRVWtzUTBGQlF6dEpRVU5VTEVsQlFVa3NTMEZCU3l4RFFVRkRPMEZCUTJRc1NVRkJTU3hKUVVGSkxFMUJRVTBzUjBGQlJ5eEZRVUZGTEVOQlFVTTdPMGxCUldoQ0xFOUJRVThzVDBGQlR5eEZRVUZGTzAxQlEyUXNTVUZCU1N4SFFVRkhMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdUVUZETTBJc1NVRkJTU3hIUVVGSExFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1FVRkRha01zVFVGQlRTeExRVUZMTEVkQlFVY3NXVUZCV1N4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxGbEJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxFbEJRVWtzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXpzN1RVRkZlRVVzVFVGQlRTeERRVUZETEVsQlFVazdVVUZEVkN4dlFrRkJReXhGUVVGRkxFVkJRVUVzUTBGQlFTeERRVUZETEV0QlFVRXNSVUZCU3l4RFFVRkZMRWxCUVVrc1JVRkJReXhEUVVGRExFMUJRVUVzUlVGQlRTeERRVUZGTEU5QlFVOHNSVUZCUXl4RFFVRkRMRWRCUVVFc1JVRkJSeXhEUVVGRkxFOUJRVThzUTBGQlF5eEhRVUZMTEVOQlFVRXNSVUZCUVR0VlFVTnFSQ3hMUVVGTk8xRkJRMG9zUTBGQlFUdEJRVU5pTEU5QlFVOHNRMEZCUXpzN1RVRkZSaXhQUVVGUExFZEJRVWNzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXp0QlFVTTNRaXhMUVVGTE96dEpRVVZFTEU5QlFVOHNUVUZCVFN4RFFVRkRPMGRCUTJZN1JVRkRSQ3h2UWtGQmIwSXNSVUZCUlN4VlFVRlZMRWRCUVVjc1JVRkJSU3hUUVVGVExFVkJRVVU3U1VGRE9VTXNTVUZCU1N4UFFVRlBMRTlCUVU4c1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFZRVUZWTEVOQlFVTTdTVUZEZUVNc1NVRkJTU3hYUVVGWExFZEJRVWNzUTBGQlF5eERRVUZETzBGQlEzaENMRWxCUVVrc1NVRkJTU3hSUVVGUkxFMUJRVTBzUTBGQlF5eERRVUZET3p0SlFVVndRaXhKUVVGSkxFOUJRVThzUzBGQlN5eEhRVUZITEVWQlFVVTdUVUZEYmtJc1IwRkJSeXhIUVVGSExFbEJRVWtzUTBGQlF6dEJRVU5xUWl4TFFVRkxPenRKUVVWRUxFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTTdUVUZEV2l4VlFVRlZMRVZCUVVVc1IwRkJSenROUVVObUxGTkJRVk1zUjBGQlJ5eFRRVUZUTEV0QlFVc3NTVUZCU1R0TlFVTTVRaXhSUVVGUkxFbEJRVWtzUjBGQlJ5eEhRVUZITEU5QlFVOHNSMEZCUnl4SlFVRkpPMHRCUTJwRExFTkJRVU1zUTBGQlF6dEhRVU5LTzBWQlEwUXNaVUZCWlN4RlFVRkZMRmxCUVZrN1NVRkRNMElzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRk5CUVZNc1JVRkJSU3hGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNc1EwRkJRenRIUVVOd1JEdEJRVU5JTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NTMEZCU3l4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlvcVhHNGdLaUJBYW5ONElGSmxZV04wTGtSUFRWeHVJQ292WEc1Y2JuWmhjaUJVWW05a2VUdGNiblpoY2lCclpYbGZiV0Z3TzF4dWRtRnlJQ1FnSUNBZ0lDQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbmFuRjFaWEo1SnlrN1hHNTJZWElnVW1WaFkzUWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDZHlaV0ZqZENjcE8xeHVkbUZ5SUVKaFkydGliMjVsSUNBZ0lEMGdjbVZ4ZFdseVpTZ25ZbUZqYTJKdmJtVW5LVHRjYm5aaGNpQlRZM0p2Ykd4bGNpQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dUwzVjBhV3h6TDNOamNtOXNiR1Z5WDJOdllYTjBaWEluS1R0Y2JuWmhjaUJDZFhSMGIyNGdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHZZblYwZEc5dUxtcHplQ2NwTzF4dWRtRnlJRlJ5SUNBZ0lDQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpOTBjaTVxYzNnbktUdGNiblpoY2lCVVpDQWdJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR2ZEdRdWFuTjRKeWs3WEc1MllYSWdTV052YmlBZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NjdUwybGpiMjR1YW5ONEp5azdYRzUyWVhJZ1VtOTNSR1YwWVdsc2N5QWdQU0J5WlhGMWFYSmxLQ2N1TGk5dGIyUjFiR1Z6TDNkbGJHeGZaM0pwWkM5aFkzUnBkbVZmY205M1gyUmxkR0ZwYkhNdWFuTjRKeWs3WEc1MllYSWdiVzl0Wlc1MElDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkdGIyMWxiblFuS1R0Y2JseHVMeW9xWEc0Z0tpQkZZV05vSUhSeVlXNXpabTl5YldWeUlITm9iM1ZzWkNCM1pXeHNJR0Z1WkNCaGRIUnlYMjVoYldVZ2NHRnlZVzF6WEc0Z0tpOWNiblpoY2lCMGNtRnVjMlp2Y20xbGNuTWdQU0I3WEc0Z0lITjBjbWx1WnpvZ0lDQm1kVzVqZEdsdmJpQW9kMlZzYkN3Z2JtRnRaU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdkMlZzYkM1blpYUW9ibUZ0WlNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5TEZ4dUlDQmtZWFJsT2lBZ0lDQWdablZ1WTNScGIyNGdLSGRsYkd3c0lHNWhiV1VwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJRzF2YldWdWRDaDNaV3hzTG1kbGRDaHVZVzFsS1NrdVptOXliV0YwS0NkTlRVMGdSQ3dnV1ZsWldTQm9PbTF0T25OellTY3BPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTeGNiaUFnYzNSaGRIVnpPaUFnSUdaMWJtTjBhVzl1SUNoM1pXeHNMQ0J1WVcxbEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlBb1BFbGpiMjRnZEhsd1pUMWNJbU5vWldOclhDSWdMejRwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdmU3hjYmlBZ1lXTjBhVzl1Y3pvZ0lHWjFibU4wYVc5dUlDaDNaV3hzTENCdVlXMWxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSmlkWFIwYjI0dFozSnZkWEFnWW5WMGRHOXVMV1J5YjNCY0lqNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHhDZFhSMGIyNCtYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4SlkyOXVJSFI1Y0dVOVhDSmpZWEpsZEMxa2IzZHVYQ0lnTHo1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZRblYwZEc5dVBseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQRUoxZEhSdmJqNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEVsamIyNGdkSGx3WlQxY0luQnNkWE5jSWlBdlBseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JEY21WaGRHVWdRMkZ6WlZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOUNkWFIwYjI0K1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYRzU5TzF4dVhHNXJaWGxmYldGd0lEMGdlMXh1SUNBek9Eb2dKM0J5WlhZbkxGeHVJQ0EwTURvZ0oyNWxlSFFuWEc1OU8xeHVYRzVVWW05a2VTQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ2NISnZjRlI1Y0dWek9pQjdYRzRnSUNBZ2MzUnZjbVU2SUZKbFlXTjBMbEJ5YjNCVWVYQmxjeTVwYm5OMFlXNWpaVTltS0VKaFkydGliMjVsTGsxdlpHVnNLUzVwYzFKbGNYVnBjbVZrWEc0Z0lIMHNYRzRnSUdkbGRFbHVhWFJwWVd4VGRHRjBaVG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUI3WEc0Z0lDQWdJQ0JoWTNScGRtVlhaV3hzT2lCdWRXeHNMRnh1SUNBZ0lDQWdiV2x1YVcxcGVtVmtPaUFnWm1Gc2MyVmNiaUFnSUNCOU8xeHVJQ0I5TEZ4dUlDQmpiMjF3YjI1bGJuUkVhV1JWY0dSaGRHVTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ1pXeGxiV1Z1ZEhNN1hHNGdJQ0FnZG1GeUlHRmpkR2wyWlNBOUlIUm9hWE11YzNSaGRHVXVZV04wYVhabFYyVnNiRHRjYmx4dUlDQWdJR2xtSUNnaElHRmpkR2wyWlNrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHVnNaVzFsYm5SeklEMGdXMXh1SUNBZ0lDQWdkR2hwY3k1eVpXWnpXMkZqZEdsMlpWMHVaMlYwUkU5TlRtOWtaU2dwTEZ4dUlDQWdJQ0FnZEdocGN5NXlaV1p6TG1GamRHbDJaVmRsYkd3dVoyVjBSRTlOVG05a1pTZ3BYRzRnSUNBZ1hUdGNibHh1SUNBZ0lGTmpjbTlzYkdWeUtHVnNaVzFsYm5SekxDQjdjM1JsY0hNNklESTFNSDBwTzF4dUlDQjlMRnh1SUNCamIyMXdiMjVsYm5SRWFXUk5iM1Z1ZERvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDUW9aRzlqZFcxbGJuUXBMbTl1S0NkclpYbGtiM2R1TGljZ0t5QjBhR2x6TG5CeWIzQnpMbk4wYjNKbExtTnBaQ3dnWm5WdVkzUnBiMjRnS0dVcElIdGNiaUFnSUNBZ0lIWmhjaUJqYVdRN1hHNGdJQ0FnSUNCMllYSWdaR2x5WldOMGFXOXVJRDBnYTJWNVgyMWhjRnRsTG5kb2FXTm9YVHRjYmx4dUlDQWdJQ0FnYVdZZ0tDRWdkR2hwY3k1emRHRjBaUzVoWTNScGRtVlhaV3hzS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCMGNuVmxPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JwWmlBb1pHbHlaV04wYVc5dUtTQjdYRzRnSUNBZ0lDQWdJR1V1Y0hKbGRtVnVkRVJsWm1GMWJIUW9LVHRjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnWTJsa0lEMGdkR2hwY3k1eVpXWnpMbUZqZEdsMlpWZGxiR3d1Y0hKdmNITmJaR2x5WldOMGFXOXVYVHRjYmx4dUlDQWdJQ0FnYVdZZ0tHTnBaQ2tnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbDlvWVc1a2JHVlhaV3hzVTJWc1pXTjBhVzl1S0dOcFpDazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTNWlhVzVrS0hSb2FYTXBLVHRjYmlBZ2ZTeGNiaUFnWTI5dGNHOXVaVzUwVjJsc2JGVnViVzkxYm5RNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQWtLR1J2WTNWdFpXNTBLUzV2Wm1Zb0p5NG5JQ3NnZEdocGN5NXdjbTl3Y3k1emRHOXlaUzVqYVdRcE8xeHVJQ0I5TEZ4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnY205M2N5QTlJSFJvYVhNdVgySjFhV3hrVW05M2N5Z3BPMXh1WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeDBZbTlrZVNCamJHRnpjMDVoYldVOWUzUm9hWE11Y0hKdmNITXVZMnhoYzNOT1lXMWxmVDVjYmlBZ0lDQWdJQ0FnZTNKdmQzTjlYRzRnSUNBZ0lDQThMM1JpYjJSNVBseHVJQ0FnSUNrN1hHNGdJSDBzWEc0Z0lGOWlkV2xzWkZKdmQzTTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ1pHRjBZU0FnSUNBOUlGdGRPMXh1SUNBZ0lIWmhjaUJ6ZEc5eVpTQWdJRDBnZEdocGN5NXdjbTl3Y3k1emRHOXlaVHRjYmlBZ0lDQjJZWElnZDJWc2JITWdJQ0E5SUhOMGIzSmxMbWRsZENnbmQyVnNiSE1uS1R0Y2JpQWdJQ0IyWVhJZ2FHVmhaR2x1WnlBOUlITjBiM0psTG1kbGRDZ25abWx5YzNRbktUdGNiaUFnSUNCMllYSWdjSEpsZGlBZ0lDQTlJRzUxYkd3N1hHNGdJQ0FnZG1GeUlHNWxlSFFnSUNBZ1BTQnVkV3hzTzF4dVhHNGdJQ0FnZDJWc2JITXVaV0ZqYUNobWRXNWpkR2x2YmlBb2QyVnNiQ3dnYVc1a1pYZ3BJSHRjYmlBZ0lDQWdJSFpoY2lCelpXeGxZM1JsWkY5eWIzYzdYRzRnSUNBZ0lDQjJZWElnZDJWc2JGOXliM2M3WEc0Z0lDQWdJQ0IyWVhJZ1lXTjBhWFpsSUNBZ0lDQWdJQ0E5SUhSb2FYTXVjM1JoZEdVdVlXTjBhWFpsVjJWc2JDQTlQVDBnZDJWc2JDNWphV1E3WEc0Z0lDQWdJQ0IyWVhJZ1kyOXVkR1Z1ZEhNZ0lDQWdJQ0E5SUhSb2FYTXVYMkoxYVd4a1VtOTNLSGRsYkd3c0lHaGxZV1JwYm1jcE8xeHVJQ0FnSUNBZ2RtRnlJRzlrWkNBZ0lDQWdJQ0FnSUNBZ1BTQnBibVJsZUNBbElESWdQaUF3SUQ4Z0oyOWtaQ2NnT2lBbkp6dGNiaUFnSUNBZ0lIWmhjaUJoWTNScGRtVmZjSEp2Y0hNZ0lDQTlJSHQ5TzF4dVhHNGdJQ0FnSUNCdVpYaDBJRDBnZDJWc2JITXVZWFFvYVc1a1pYZ2dLeUF4S1R0Y2JseHVJQ0FnSUNBZ2QyVnNiRjl5YjNjZ1BTQW9YRzRnSUNBZ0lDQWdJRHhVY2lCamJHRnpjMDVoYldVOWUyOWtaQ0FySUNoaFkzUnBkbVVnUHlBbklHRmpkR2wyWlNjZ09pQW5KeWw5SUhKbFpqMTdkMlZzYkM1amFXUjlJR3RsZVQxN2QyVnNiQzVqYVdSOUlHOXVRMnhwWTJzOWUzUm9hWE11WDJoaGJtUnNaVmRsYkd4VFpXeGxZM1JwYjI0dVltbHVaQ2gwYUdsekxDQjNaV3hzTG1OcFpDbDlQbHh1SUNBZ0lDQWdJQ0FnSUh0amIyNTBaVzUwYzMxY2JpQWdJQ0FnSUNBZ1BDOVVjajVjYmlBZ0lDQWdJQ2s3WEc1Y2JpQWdJQ0FnSUdSaGRHRXVjSFZ6YUNoM1pXeHNYM0p2ZHlrN1hHNWNiaUFnSUNBZ0lHbG1JQ2hoWTNScGRtVXBJSHRjYmlBZ0lDQWdJQ0FnWVdOMGFYWmxYM0J5YjNCeklEMGdlMXh1SUNBZ0lDQWdJQ0FnSUdOc1lYTnpUbUZ0WlRvZ0lHOWtaQ3hjYmlBZ0lDQWdJQ0FnSUNCemRHOXlaVG9nSUNBZ0lDQjNaV3hzTEZ4dUlDQWdJQ0FnSUNBZ0lIQnlaWFk2SUNBZ0lDQWdJSEJ5WlhZc1hHNGdJQ0FnSUNBZ0lDQWdibVY0ZERvZ0lDQWdJQ0FnYm1WNGRDQW1KaUJ1WlhoMExtTnBaQ3hjYmlBZ0lDQWdJQ0FnSUNCemQybDBZMmhsY2pvZ0lDQjBhR2x6TGw5b1lXNWtiR1ZYWld4c1UyVnNaV04wYVc5dUxGeHVJQ0FnSUNBZ0lDQWdJSE5wZW1WVWIyZG5iR1U2SUhSb2FYTXVYM1J2WjJkc1pVMXBibWx0YVhwbExGeHVJQ0FnSUNBZ0lDQWdJR3RsZVRvZ0lDQWdJQ0FnSUhkbGJHd3VZMmxrSUNzZ0p5MWhZM1JwZG1VbkxGeHVJQ0FnSUNBZ0lDQWdJSEpsWmpvZ0lDQWdJQ0FnSUNkaFkzUnBkbVZYWld4c0p5eGNiaUFnSUNBZ0lDQWdJQ0J0YVc1cGJXbDZaV1E2SUNCMGFHbHpMbk4wWVhSbExtMXBibWx0YVhwbFpGeHVJQ0FnSUNBZ0lDQjlPMXh1WEc0Z0lDQWdJQ0FnSUdSaGRHRXVjSFZ6YUNnOFVtOTNSR1YwWVdsc2N5QjdMaTR1WVdOMGFYWmxYM0J5YjNCemZTQXZQaWs3WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhCeVpYWWdQU0IzWld4c0xtTnBaRHRjYmlBZ0lDQjlMQ0IwYUdsektUdGNibHh1SUNBZ0lISmxkSFZ5YmlCa1lYUmhPMXh1SUNCOUxGeHVJQ0JmWW5WcGJHUlNiM2M2SUdaMWJtTjBhVzl1SUNoM1pXeHNMQ0JvWldGa2FXNW5LU0I3WEc0Z0lDQWdkbUZ5SUc1aGJXVTdYRzRnSUNBZ2RtRnlJSFpoYkhWbE8xeHVJQ0FnSUhaaGNpQm1hV1ZzWkhNZ1BTQmJYVHRjYmx4dUlDQWdJSGRvYVd4bElDaG9aV0ZrYVc1bktTQjdYRzRnSUNBZ0lDQnVZVzFsSUQwZ2FHVmhaR2x1Wnk1blpYUW9KMjVoYldVbktUdGNiaUFnSUNBZ0lIUjVjR1VnUFNCb1pXRmthVzVuTG1kbGRDZ25kSGx3WlNjcE8xeHVJQ0FnSUNBZ2RtRnNkV1VnUFNCMGNtRnVjMlp2Y20xbGNuTmJkSGx3WlYwZ0ppWWdkSEpoYm5ObWIzSnRaWEp6VzNSNWNHVmRMbU5oYkd3b2RHaHBjeXdnZDJWc2JDd2dibUZ0WlNrN1hHNWNiaUFnSUNBZ0lHWnBaV3hrY3k1d2RYTm9LRnh1SUNBZ0lDQWdJQ0E4VkdRZ2MzUnZjbVU5ZTNkbGJHeDlJR052YkhWdGJqMTdhR1ZoWkdsdVozMGdhMlY1UFh0b1pXRmthVzVuTG1OcFpIMCtYRzRnSUNBZ0lDQWdJQ0FnZTNaaGJIVmxmVnh1SUNBZ0lDQWdJQ0E4TDFSa1BseHVJQ0FnSUNBZ0tUdGNibHh1SUNBZ0lDQWdhR1ZoWkdsdVp5QTlJR2hsWVdScGJtY3VibVY0ZER0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0J5WlhSMWNtNGdabWxsYkdSek8xeHVJQ0I5TEZ4dUlDQmZhR0Z1Wkd4bFYyVnNiRk5sYkdWamRHbHZiam9nWm5WdVkzUnBiMjRnS0dOcFpDd2dhVzVqY21WdFpXNTBLU0I3WEc0Z0lDQWdkbUZ5SUdOMWNuSmxiblFnSUNBZ0lEMGdkR2hwY3k1emRHRjBaUzVoWTNScGRtVlhaV3hzTzF4dUlDQWdJSFpoY2lCamRYSnlaVzUwWDNSdmNDQTlJREE3WEc0Z0lDQWdkbUZ5SUc1bGVIUmZkRzl3SUNBZ0lEMGdNRHRjYmx4dUlDQWdJR2xtSUNoamRYSnlaVzUwSUQwOVBTQmphV1FwSUh0Y2JpQWdJQ0FnSUdOcFpDQTlJRzUxYkd3N1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaDdYRzRnSUNBZ0lDQmhZM1JwZG1WWFpXeHNPaUJqYVdRc1hHNGdJQ0FnSUNCcGJtTnlaVzFsYm5RNklDQnBibU55WlcxbGJuUWdQVDA5SUhSeWRXVXNYRzRnSUNBZ0lDQndjbVYyYVc5MWN6b2dJQ0JqYVdRZ1B5QmpkWEp5Wlc1MElEb2diblZzYkZ4dUlDQWdJSDBwTzF4dUlDQjlMRnh1SUNCZmRHOW5aMnhsVFdsdWFXMXBlbVU2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHR0YVc1cGJXbDZaV1E2SUNFZ2RHaHBjeTV6ZEdGMFpTNXRhVzVwYldsNlpXUjlLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1ZHSnZaSGs3WEc0aVhYMD0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFRkO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuVGQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGRcIixcbiAgbWl4aW5zOiBbUmVhY3QuYWRkb25zLlB1cmVSZW5kZXJNaXhpbl0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBSZWFjdC5fX3NwcmVhZCh7fSwgIHRoaXMucHJvcHMpLCBcbiAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlblxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRkO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDJOdmJYQnZibVZ1ZEhNdmRHUXVhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRVVZCTEVkQlFVYzdPMEZCUlVnc1NVRkJTU3hGUVVGRkxFTkJRVU03UVVGRFVDeEpRVUZKTEV0QlFVc3NSMEZCUnl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03TzBGQlJUZENMSGRDUVVGM1FpeHJRa0ZCUVR0RlFVTjBRaXhOUVVGTkxFVkJRVVVzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4RFFVRkRMR1ZCUVdVc1EwRkJRenRCUVVONFF5eEZRVUZGTEUxQlFVMHNSVUZCUlN4WlFVRlpPenRKUVVWc1FqdE5RVU5GTEc5Q1FVRkJMRWxCUVVjc1JVRkJRU3huUWtGQlFTeEhRVUZCTEVOQlFVVXNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJUeXhEUVVGQkxFVkJRVUU3VVVGRGFrSXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGVE8wMUJRMnhDTEVOQlFVRTdUVUZEVER0SFFVTklPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhGUVVGRkxFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUZSa08xeHVkbUZ5SUZKbFlXTjBJRDBnY21WeGRXbHlaU2duY21WaFkzUW5LVHRjYmx4dVZHUWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lHMXBlR2x1Y3pvZ1cxSmxZV04wTG1Ga1pHOXVjeTVRZFhKbFVtVnVaR1Z5VFdsNGFXNWRMRnh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1SUNncElIdGNibHh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOGRHUWdleTR1TG5Sb2FYTXVjSEp2Y0hOOVBseHVJQ0FnSUNBZ0lDQjdkR2hwY3k1d2NtOXdjeTVqYUdsc1pISmxibjFjYmlBZ0lDQWdJRHd2ZEdRK1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdWR1E3WEc0aVhYMD0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFRoO1xudmFyIFJlYWN0ICAgICAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgQmFja2JvbmUgICAgICAgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBTb3J0SW5kaWNhdG9yICAgPSByZXF1aXJlKCcuL3NvcnRfaW5kaWNhdG9yLmpzeCcpO1xuXG5UaCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUaFwiLFxuICBwcm9wVHlwZXM6IHtcbiAgICB0cmlnZ2VyU29ydDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2xhc3NlcyA9IFt0aGlzLnByb3BzLmNsYXNzTmFtZSB8fCAnJ107XG4gICAgdmFyIHNvcnRfaW5kaWNhdG9yID0gbnVsbDtcbiAgICB2YXIgbmV3X3Byb3BzID0ge3N0eWxlOnt9fTtcblxuICAgIGlmICh0aGlzLnByb3BzLnRyaWdnZXJTb3J0IHx8IHRoaXMucHJvcHMuc29ydERpcmVjdGlvbikge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdzb3J0YWJsZScpO1xuXG4gICAgICBzb3J0X2luZGljYXRvciA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoU29ydEluZGljYXRvciwge2RpcmVjdGlvbjogdGhpcy5wcm9wcy5zb3J0RGlyZWN0aW9ufSlcbiAgICB9XG5cbiAgICBbJ21pbmltYWwnLCAnbG9ja2VkJywgJ3Jlc2l6YWJsZSddLmZvckVhY2goZnVuY3Rpb24gKHZhbCkge1xuICAgICAgaWYgKHRoaXMucHJvcHNbdmFsXSkge1xuICAgICAgICBjbGFzc2VzLnB1c2godmFsKTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcblxuICAgIGlmICh0aGlzLnByb3BzLndpZHRoKSB7XG4gICAgICBuZXdfcHJvcHMuc3R5bGUud2lkdGggPSB0aGlzLnByb3BzLndpZHRoO1xuICAgIH1cblxuICAgIG5ld19wcm9wcy5jbGFzc05hbWUgPSBjbGFzc2VzLmxlbmd0aCA+IDEgPyBjbGFzc2VzLmpvaW4oJyAnKSA6IGNsYXNzZXNbMF07XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgbmV3X3Byb3BzLCB7b25DbGljazogdGhpcy5faGFuZGxlQ2xpY2t9KSwgXG4gICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW4sIFxuICAgICAgICBzb3J0X2luZGljYXRvclxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIF9oYW5kbGVDbGljazogZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5oYW5kbGVDbGljaykge1xuICAgICAgdGhpcy5wcm9wcy5oYW5kbGVDbGljayhlKTtcbiAgICB9XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRoO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDJOdmJYQnZibVZ1ZEhNdmRHZ3Vhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRVVZCTEVkQlFVYzdPMEZCUlVnc1NVRkJTU3hGUVVGRkxFTkJRVU03UVVGRFVDeEpRVUZKTEV0QlFVc3NZVUZCWVN4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRGRrTXNTVUZCU1N4UlFVRlJMRlZCUVZVc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETzBGQlF6RkRMRWxCUVVrc1lVRkJZU3hMUVVGTExFOUJRVThzUTBGQlF5eHpRa0ZCYzBJc1EwRkJReXhEUVVGRE96dEJRVVYwUkN4M1FrRkJkMElzYTBKQlFVRTdSVUZEZEVJc1UwRkJVeXhGUVVGRk8wbEJRMVFzVjBGQlZ5eEZRVUZGTEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1RVRkJUVHRIUVVOd1F6dEZRVU5FTEUxQlFVMHNSVUZCUlN4WlFVRlpPMGxCUTJ4Q0xFbEJRVWtzVDBGQlR5eEhRVUZITEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhUUVVGVExFbEJRVWtzUlVGQlJTeERRVUZETEVOQlFVTTdTVUZETTBNc1NVRkJTU3hqUVVGakxFZEJRVWNzU1VGQlNTeERRVUZETzBGQlF6bENMRWxCUVVrc1NVRkJTU3hUUVVGVExFZEJRVWNzUTBGQlF5eExRVUZMTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNN08wbEJSVE5DTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhYUVVGWExFbEJRVWtzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4aFFVRmhMRVZCUVVVN1FVRkROVVFzVFVGQlRTeFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRE96dE5RVVY2UWl4alFVRmpMRWRCUVVjc2IwSkJRVU1zWVVGQllTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEdGQlFXTXNRMEZCUVN4RFFVRkhMRU5CUVVFN1FVRkROMFVzUzBGQlN6czdTVUZGUkN4RFFVRkRMRk5CUVZNc1JVRkJSU3hSUVVGUkxFVkJRVVVzVjBGQlZ5eERRVUZETEVOQlFVTXNUMEZCVHl4RFFVRkRMRlZCUVZVc1IwRkJSeXhGUVVGRk8wMUJRM2hFTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJUdFJRVU51UWl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzA5QlEyNUNPMEZCUTFBc1MwRkJTeXhGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZET3p0SlFVVlVMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTEVWQlFVVTdUVUZEY0VJc1UwRkJVeXhEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU03UVVGREwwTXNTMEZCU3pzN1FVRkZUQ3hKUVVGSkxGTkJRVk1zUTBGQlF5eFRRVUZUTEVkQlFVY3NUMEZCVHl4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFZEJRVWNzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1IwRkJSeXhQUVVGUExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdPMGxCUlRGRk8wMUJRMFVzYjBKQlFVRXNTVUZCUnl4RlFVRkJMR2RDUVVGQkxFZEJRVUVzUTBGQlJTeEhRVUZITEZOQlFWTXNSVUZCUXl4RFFVRkRMRU5CUVVFc1QwRkJRU3hGUVVGUExFTkJRVVVzU1VGQlNTeERRVUZETEZsQlFXTXNRMEZCUVN4RFFVRkJMRVZCUVVFN1VVRkROVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UlFVRlJMRVZCUVVNN1VVRkRjRUlzWTBGQlpUdE5RVU5pTEVOQlFVRTdUVUZEVER0SFFVTklPMFZCUTBRc1dVRkJXU3hGUVVGRkxGVkJRVlVzUTBGQlF5eEZRVUZGTzBsQlEzcENMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFhRVUZYTEVWQlFVVTdUVUZETVVJc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1MwRkRNMEk3UjBGRFJqdEJRVU5JTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NSVUZCUlN4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlvcVhHNGdLaUJBYW5ONElGSmxZV04wTGtSUFRWeHVJQ292WEc1Y2JuWmhjaUJVYUR0Y2JuWmhjaUJTWldGamRDQWdJQ0FnSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDY3BPMXh1ZG1GeUlFSmhZMnRpYjI1bElDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0oySmhZMnRpYjI1bEp5azdYRzUyWVhJZ1UyOXlkRWx1WkdsallYUnZjaUFnSUQwZ2NtVnhkV2x5WlNnbkxpOXpiM0owWDJsdVpHbGpZWFJ2Y2k1cWMzZ25LVHRjYmx4dVZHZ2dQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lIQnliM0JVZVhCbGN6b2dlMXh1SUNBZ0lIUnlhV2RuWlhKVGIzSjBPaUJTWldGamRDNVFjbTl3Vkhsd1pYTXVjM1J5YVc1blhHNGdJSDBzWEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJqYkdGemMyVnpJRDBnVzNSb2FYTXVjSEp2Y0hNdVkyeGhjM05PWVcxbElIeDhJQ2NuWFR0Y2JpQWdJQ0IyWVhJZ2MyOXlkRjlwYm1ScFkyRjBiM0lnUFNCdWRXeHNPMXh1SUNBZ0lIWmhjaUJ1WlhkZmNISnZjSE1nUFNCN2MzUjViR1U2ZTMxOU8xeHVYRzRnSUNBZ2FXWWdLSFJvYVhNdWNISnZjSE11ZEhKcFoyZGxjbE52Y25RZ2ZId2dkR2hwY3k1d2NtOXdjeTV6YjNKMFJHbHlaV04wYVc5dUtTQjdYRzRnSUNBZ0lDQmpiR0Z6YzJWekxuQjFjMmdvSjNOdmNuUmhZbXhsSnlrN1hHNWNiaUFnSUNBZ0lITnZjblJmYVc1a2FXTmhkRzl5SUQwZ1BGTnZjblJKYm1ScFkyRjBiM0lnWkdseVpXTjBhVzl1UFh0MGFHbHpMbkJ5YjNCekxuTnZjblJFYVhKbFkzUnBiMjU5SUM4K1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnV3lkdGFXNXBiV0ZzSnl3Z0oyeHZZMnRsWkNjc0lDZHlaWE5wZW1GaWJHVW5YUzVtYjNKRllXTm9LR1oxYm1OMGFXOXVJQ2gyWVd3cElIdGNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxuQnliM0J6VzNaaGJGMHBJSHRjYmlBZ0lDQWdJQ0FnWTJ4aGMzTmxjeTV3ZFhOb0tIWmhiQ2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmU3dnZEdocGN5azdYRzVjYmlBZ0lDQnBaaUFvZEdocGN5NXdjbTl3Y3k1M2FXUjBhQ2tnZTF4dUlDQWdJQ0FnYm1WM1gzQnliM0J6TG5OMGVXeGxMbmRwWkhSb0lEMGdkR2hwY3k1d2NtOXdjeTUzYVdSMGFEdGNiaUFnSUNCOVhHNWNiaUFnSUNCdVpYZGZjSEp2Y0hNdVkyeGhjM05PWVcxbElEMGdZMnhoYzNObGN5NXNaVzVuZEdnZ1BpQXhJRDhnWTJ4aGMzTmxjeTVxYjJsdUtDY2dKeWtnT2lCamJHRnpjMlZ6V3pCZE8xeHVYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4MGFDQjdMaTR1Ym1WM1gzQnliM0J6ZlNCdmJrTnNhV05yUFh0MGFHbHpMbDlvWVc1a2JHVkRiR2xqYTMwK1hHNGdJQ0FnSUNBZ0lIdDBhR2x6TG5CeWIzQnpMbU5vYVd4a2NtVnVmVnh1SUNBZ0lDQWdJQ0I3YzI5eWRGOXBibVJwWTJGMGIzSjlYRzRnSUNBZ0lDQThMM1JvUGx4dUlDQWdJQ2s3WEc0Z0lIMHNYRzRnSUY5b1lXNWtiR1ZEYkdsamF6b2dablZ1WTNScGIyNGdLR1VwSUh0Y2JpQWdJQ0JwWmlBb2RHaHBjeTV3Y205d2N5NW9ZVzVrYkdWRGJHbGpheWtnZTF4dUlDQWdJQ0FnZEdocGN5NXdjbTl3Y3k1b1lXNWtiR1ZEYkdsamF5aGxLVHRjYmlBZ0lDQjlYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUZSb08xeHVJbDE5IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBUcjtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cblRyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRyXCIsXG4gIG1peGluczogW1JlYWN0LmFkZG9ucy5QdXJlUmVuZGVyTWl4aW5dLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgdGhpcy5wcm9wcyksIFxuICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVHI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMk52YlhCdmJtVnVkSE12ZEhJdWFuTjRJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCT3p0QlFVVkJMRWRCUVVjN08wRkJSVWdzU1VGQlNTeEZRVUZGTEVOQlFVTTdRVUZEVUN4SlFVRkpMRXRCUVVzc1IwRkJSeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdPMEZCUlRkQ0xIZENRVUYzUWl4clFrRkJRVHRGUVVOMFFpeE5RVUZOTEVWQlFVVXNRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExHVkJRV1VzUTBGQlF6dEZRVU4wUXl4TlFVRk5MRVZCUVVVc1dVRkJXVHRKUVVOc1FqdE5RVU5GTEc5Q1FVRkJMRWxCUVVjc1JVRkJRU3huUWtGQlFTeEhRVUZCTEVOQlFVVXNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJUeXhEUVVGQkxFVkJRVUU3VVVGRGFrSXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGVE8wMUJRMnhDTEVOQlFVRTdUVUZEVER0SFFVTklPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhGUVVGRkxFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUZSeU8xeHVkbUZ5SUZKbFlXTjBJRDBnY21WeGRXbHlaU2duY21WaFkzUW5LVHRjYmx4dVZISWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lHMXBlR2x1Y3pvZ1cxSmxZV04wTG1Ga1pHOXVjeTVRZFhKbFVtVnVaR1Z5VFdsNGFXNWRMRnh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEhSeUlIc3VMaTUwYUdsekxuQnliM0J6ZlQ1Y2JpQWdJQ0FnSUNBZ2UzUm9hWE11Y0hKdmNITXVZMmhwYkdSeVpXNTlYRzRnSUNBZ0lDQThMM1J5UGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlGUnlPMXh1SWwxOSIsInZhciBuYW1lcyAgICAgPSBbJ05lbycsICdXZWxsJywgJ1NjYW5kaXMnLCAnRm9ydG8nLCAnTG9ydW0nLCAnUGFybmFjJywgJ0x1ZmtpcycsICdCbG9ja2VyJywgJ01pZGxhbmQnLCAnT0tDJywgJ0J1bGwnLCAnSHVuZG8nLCAnRmVycmlzJywgJ0FsYW1lZGEnLCAnUmFmYWVsJywgJ1NhbiBQZWRybyddO1xudmFyIHN0YXRlcyAgICA9IFsnQ29ubmVjdGVkJywgJ0Nvbm5lY3RlZCcsICdDb25uZWN0ZWQnLCAnQ29ubmVjdGVkJywgJ0Rpc2Nvbm5lY3RlZCcsICdVbmtub3duJ107XG52YXIgc3RhdHVzZXMgID0gWydvaycsICdvaycsICdvaycsICdvaycsICdlcnJvciddO1xudmFyIHRleHRzICAgICA9IFsnMiBkYXlzJywgJzMgZGF5cycsICdVbmtub3duJywgJzEgZGF5JywgJzMgbW9udGhzJ107XG52YXIgdHlwZXMgICAgID0gWydlc3AnLCAncGx1bmdlcicsICdjcmFuaycsICdwY3AnXTtcblxuZnVuY3Rpb24gcmFuZG9taXplIChhcnIpIHtcbiAgcmV0dXJuIGFycltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnIubGVuZ3RoKV07XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlIChudW0pIHtcbiAgdmFyIGk7XG4gIHZhciB2YWx1ZXMgPSBbXTtcblxuICBmb3IgKGkgPSAwOyBpIDwgbnVtOyBpKyspIHtcbiAgICB2YWx1ZXMucHVzaCh7XG4gICAgICBzdGF0dXM6ICAgICAgICAgICAgICAgICAgICdvaycsXG4gICAgICBXZWxsX05hbWU6ICAgICAgICAgICAgICAgIHJhbmRvbWl6ZShuYW1lcykgKyAnICcgKyByYW5kb21pemUobmFtZXMpLFxuICAgICAgRkdfTGFzdF9SZWNlaXZlZF9EYXRlOiAgICBuZXcgRGF0ZSgpLFxuICAgICAgV2VsbF9TdGF0ZV9UZXh0OiAgICAgICAgICByYW5kb21pemUoc3RhdGVzKSxcbiAgICAgIEN1cnJlbnRfU3RhdGVfVGltZV9UZXh0OiAgcmFuZG9taXplKHRleHRzKSxcbiAgICAgIExpZnRfVHlwZTogICAgICAgICAgICAgICAgcmFuZG9taXplKHR5cGVzKSxcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2VuZXJhdGU7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMlJoZEdFdmQyVnNiRjlpYjJSNUxtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVa3NTMEZCU3l4UFFVRlBMRU5CUVVNc1MwRkJTeXhGUVVGRkxFMUJRVTBzUlVGQlJTeFRRVUZUTEVWQlFVVXNUMEZCVHl4RlFVRkZMRTlCUVU4c1JVRkJSU3hSUVVGUkxFVkJRVVVzVVVGQlVTeEZRVUZGTEZOQlFWTXNSVUZCUlN4VFFVRlRMRVZCUVVVc1MwRkJTeXhGUVVGRkxFMUJRVTBzUlVGQlJTeFBRVUZQTEVWQlFVVXNVVUZCVVN4RlFVRkZMRk5CUVZNc1JVRkJSU3hSUVVGUkxFVkJRVVVzVjBGQlZ5eERRVUZETEVOQlFVTTdRVUZETTBzc1NVRkJTU3hOUVVGTkxFMUJRVTBzUTBGQlF5eFhRVUZYTEVWQlFVVXNWMEZCVnl4RlFVRkZMRmRCUVZjc1JVRkJSU3hYUVVGWExFVkJRVVVzWTBGQll5eEZRVUZGTEZOQlFWTXNRMEZCUXl4RFFVRkRPMEZCUTJoSExFbEJRVWtzVVVGQlVTeEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRWxCUVVrc1JVRkJSU3hKUVVGSkxFVkJRVVVzU1VGQlNTeEZRVUZGTEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUTJ4RUxFbEJRVWtzUzBGQlN5eFBRVUZQTEVOQlFVTXNVVUZCVVN4RlFVRkZMRkZCUVZFc1JVRkJSU3hUUVVGVExFVkJRVVVzVDBGQlR5eEZRVUZGTEZWQlFWVXNRMEZCUXl4RFFVRkRPMEZCUTNKRkxFbEJRVWtzUzBGQlN5eFBRVUZQTEVOQlFVTXNTMEZCU3l4RlFVRkZMRk5CUVZNc1JVRkJSU3hQUVVGUExFVkJRVVVzUzBGQlN5eERRVUZETEVOQlFVTTdPMEZCUlc1RUxGTkJRVk1zVTBGQlV5eEZRVUZGTEVkQlFVY3NSVUZCUlR0RlFVTjJRaXhQUVVGUExFZEJRVWNzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFVkJRVVVzUjBGQlJ5eEhRVUZITEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVOeVJDeERRVUZET3p0QlFVVkVMRk5CUVZNc1VVRkJVU3hGUVVGRkxFZEJRVWNzUlVGQlJUdEZRVU4wUWl4SlFVRkpMRU5CUVVNc1EwRkJRenRCUVVOU0xFVkJRVVVzU1VGQlNTeE5RVUZOTEVkQlFVY3NSVUZCUlN4RFFVRkRPenRGUVVWb1FpeExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVVc1EwRkJReXhIUVVGSExFZEJRVWNzUlVGQlJTeERRVUZETEVWQlFVVXNSVUZCUlR0SlFVTjRRaXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETzAxQlExWXNUVUZCVFN4dlFrRkJiMElzU1VGQlNUdE5RVU01UWl4VFFVRlRMR2xDUVVGcFFpeFRRVUZUTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1IwRkJSeXhIUVVGSExGTkJRVk1zUTBGQlF5eExRVUZMTEVOQlFVTTdUVUZEYmtVc2NVSkJRWEZDTEV0QlFVc3NTVUZCU1N4SlFVRkpMRVZCUVVVN1RVRkRjRU1zWlVGQlpTeFhRVUZYTEZOQlFWTXNRMEZCUXl4TlFVRk5MRU5CUVVNN1RVRkRNME1zZFVKQlFYVkNMRWRCUVVjc1UwRkJVeXhEUVVGRExFdEJRVXNzUTBGQlF6dE5RVU14UXl4VFFVRlRMR2xDUVVGcFFpeFRRVUZUTEVOQlFVTXNTMEZCU3l4RFFVRkRPMHRCUXpORExFTkJRVU1zUTBGQlF6dEJRVU5RTEVkQlFVYzdPMFZCUlVRc1QwRkJUeXhOUVVGTkxFTkJRVU03UVVGRGFFSXNRMEZCUXpzN1FVRkZSQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEZGQlFWRXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkluWmhjaUJ1WVcxbGN5QWdJQ0FnUFNCYkowNWxieWNzSUNkWFpXeHNKeXdnSjFOallXNWthWE1uTENBblJtOXlkRzhuTENBblRHOXlkVzBuTENBblVHRnlibUZqSnl3Z0oweDFabXRwY3ljc0lDZENiRzlqYTJWeUp5d2dKMDFwWkd4aGJtUW5MQ0FuVDB0REp5d2dKMEoxYkd3bkxDQW5TSFZ1Wkc4bkxDQW5SbVZ5Y21sekp5d2dKMEZzWVcxbFpHRW5MQ0FuVW1GbVlXVnNKeXdnSjFOaGJpQlFaV1J5YnlkZE8xeHVkbUZ5SUhOMFlYUmxjeUFnSUNBOUlGc25RMjl1Ym1WamRHVmtKeXdnSjBOdmJtNWxZM1JsWkNjc0lDZERiMjV1WldOMFpXUW5MQ0FuUTI5dWJtVmpkR1ZrSnl3Z0owUnBjMk52Ym01bFkzUmxaQ2NzSUNkVmJtdHViM2R1SjEwN1hHNTJZWElnYzNSaGRIVnpaWE1nSUQwZ1d5ZHZheWNzSUNkdmF5Y3NJQ2R2YXljc0lDZHZheWNzSUNkbGNuSnZjaWRkTzF4dWRtRnlJSFJsZUhSeklDQWdJQ0E5SUZzbk1pQmtZWGx6Snl3Z0p6TWdaR0Y1Y3ljc0lDZFZibXR1YjNkdUp5d2dKekVnWkdGNUp5d2dKek1nYlc5dWRHaHpKMTA3WEc1MllYSWdkSGx3WlhNZ0lDQWdJRDBnV3lkbGMzQW5MQ0FuY0d4MWJtZGxjaWNzSUNkamNtRnVheWNzSUNkd1kzQW5YVHRjYmx4dVpuVnVZM1JwYjI0Z2NtRnVaRzl0YVhwbElDaGhjbklwSUh0Y2JpQWdjbVYwZFhKdUlHRnljbHROWVhSb0xtWnNiMjl5S0UxaGRHZ3VjbUZ1Wkc5dEtDa2dLaUJoY25JdWJHVnVaM1JvS1YwN1hHNTlYRzVjYm1aMWJtTjBhVzl1SUdkbGJtVnlZWFJsSUNodWRXMHBJSHRjYmlBZ2RtRnlJR2s3WEc0Z0lIWmhjaUIyWVd4MVpYTWdQU0JiWFR0Y2JseHVJQ0JtYjNJZ0tHa2dQU0F3T3lCcElEd2diblZ0T3lCcEt5c3BJSHRjYmlBZ0lDQjJZV3gxWlhNdWNIVnphQ2g3WEc0Z0lDQWdJQ0J6ZEdGMGRYTTZJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ2R2YXljc1hHNGdJQ0FnSUNCWFpXeHNYMDVoYldVNklDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKaGJtUnZiV2w2WlNodVlXMWxjeWtnS3lBbklDY2dLeUJ5WVc1a2IyMXBlbVVvYm1GdFpYTXBMRnh1SUNBZ0lDQWdSa2RmVEdGemRGOVNaV05sYVhabFpGOUVZWFJsT2lBZ0lDQnVaWGNnUkdGMFpTZ3BMRnh1SUNBZ0lDQWdWMlZzYkY5VGRHRjBaVjlVWlhoME9pQWdJQ0FnSUNBZ0lDQnlZVzVrYjIxcGVtVW9jM1JoZEdWektTeGNiaUFnSUNBZ0lFTjFjbkpsYm5SZlUzUmhkR1ZmVkdsdFpWOVVaWGgwT2lBZ2NtRnVaRzl0YVhwbEtIUmxlSFJ6S1N4Y2JpQWdJQ0FnSUV4cFpuUmZWSGx3WlRvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21GdVpHOXRhWHBsS0hSNWNHVnpLU3hjYmlBZ0lDQjlLVHRjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUIyWVd4MVpYTTdYRzU5WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1oyVnVaWEpoZEdVN1hHNGlYWDA9IiwidmFyIHZhbHVlcyA9IFtdO1xuXG52YWx1ZXMgPSBbXG4gIHtcbiAgICBsb2NrZWQ6ICAgICB0cnVlLFxuICAgIG1pbmltYWw6ICAgIHRydWUsXG4gICAgbmFtZTogICAgICAgJ3N0YXR1cycsXG4gICAgc29ydGFibGU6ICAgdHJ1ZSxcbiAgICB0eXBlOiAgICAgICAnc3RhdHVzJ1xuICB9LFxuICB7XG4gICAgZGlyZWN0aW9uOiAgJ2FzYycsXG4gICAgbG9ja2VkOiAgICAgdHJ1ZSxcbiAgICBuYW1lOiAgICAgICAnV2VsbF9OYW1lJyxcbiAgICBzb3J0YWJsZTogICB0cnVlLFxuICAgIHRpdGxlOiAgICAgICdXZWxsIE5hbWUnLFxuICAgIHR5cGU6ICAgICAgICdzdHJpbmcnXG4gIH0sXG4gIHtcbiAgICBuYW1lOiAgICAgICAnV2VsbF9TdGF0ZV9UZXh0JyxcbiAgICByZXNpemFibGU6ICB0cnVlLFxuICAgIHNvcnRhYmxlOiAgIHRydWUsXG4gICAgdGl0bGU6ICAgICAgJ1dlbGwgU3RhdGUnLFxuICAgIHR5cGU6ICAgICAgICdzdHJpbmcnXG4gIH0sXG4gIHtcbiAgICBuYW1lOiAgICAgICAnQ3VycmVudF9TdGF0ZV9UaW1lX1RleHQnLFxuICAgIHJlc2l6YWJsZTogIHRydWUsXG4gICAgc29ydGFibGU6ICAgdHJ1ZSxcbiAgICB0aXRsZTogICAgICAnQ3VycmVudCBTdGF0ZSBUaW1lJyxcbiAgICB0eXBlOiAgICAgICAnc3RyaW5nJ1xuICB9LFxuICB7XG4gICAgbmFtZTogICAgICAgJ0ZHX0xhc3RfUmVjZWl2ZWRfRGF0ZScsXG4gICAgcmVzaXphYmxlOiAgdHJ1ZSxcbiAgICBzb3J0YWJsZTogICB0cnVlLFxuICAgIHRpdGxlOiAgICAgICdGRyBMYXN0IFJlY2VpdmVkIERhdGUnLFxuICAgIHR5cGU6ICAgICAgICdkYXRlJ1xuICB9LFxuICB7XG4gICAgbmFtZTogICAgICAgJ3dlbGwtYWN0aW9ucycsXG4gICAgcmVzaXphYmxlOiAgZmFsc2UsXG4gICAgc29ydGFibGU6ICAgZmFsc2UsXG4gICAgdGl0bGU6ICAgICAgJ0FjdGlvbnMnLFxuICAgIHR5cGU6ICAgICAgICdhY3Rpb25zJ1xuICB9XG5dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZhbHVlcztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyUmhkR0V2ZDJWc2JGOW9aV0ZrYVc1bmN5NXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4SlFVRkpMRTFCUVUwc1IwRkJSeXhGUVVGRkxFTkJRVU03TzBGQlJXaENMRTFCUVUwc1IwRkJSenRGUVVOUU8wbEJRMFVzVFVGQlRTeE5RVUZOTEVsQlFVazdTVUZEYUVJc1QwRkJUeXhMUVVGTExFbEJRVWs3U1VGRGFFSXNTVUZCU1N4UlFVRlJMRkZCUVZFN1NVRkRjRUlzVVVGQlVTeEpRVUZKTEVsQlFVazdTVUZEYUVJc1NVRkJTU3hSUVVGUkxGRkJRVkU3UjBGRGNrSTdSVUZEUkR0SlFVTkZMRk5CUVZNc1IwRkJSeXhMUVVGTE8wbEJRMnBDTEUxQlFVMHNUVUZCVFN4SlFVRkpPMGxCUTJoQ0xFbEJRVWtzVVVGQlVTeFhRVUZYTzBsQlEzWkNMRkZCUVZFc1NVRkJTU3hKUVVGSk8wbEJRMmhDTEV0QlFVc3NUMEZCVHl4WFFVRlhPMGxCUTNaQ0xFbEJRVWtzVVVGQlVTeFJRVUZSTzBkQlEzSkNPMFZCUTBRN1NVRkRSU3hKUVVGSkxGRkJRVkVzYVVKQlFXbENPMGxCUXpkQ0xGTkJRVk1zUjBGQlJ5eEpRVUZKTzBsQlEyaENMRkZCUVZFc1NVRkJTU3hKUVVGSk8wbEJRMmhDTEV0QlFVc3NUMEZCVHl4WlFVRlpPMGxCUTNoQ0xFbEJRVWtzVVVGQlVTeFJRVUZSTzBkQlEzSkNPMFZCUTBRN1NVRkRSU3hKUVVGSkxGRkJRVkVzZVVKQlFYbENPMGxCUTNKRExGTkJRVk1zUjBGQlJ5eEpRVUZKTzBsQlEyaENMRkZCUVZFc1NVRkJTU3hKUVVGSk8wbEJRMmhDTEV0QlFVc3NUMEZCVHl4dlFrRkJiMEk3U1VGRGFFTXNTVUZCU1N4UlFVRlJMRkZCUVZFN1IwRkRja0k3UlVGRFJEdEpRVU5GTEVsQlFVa3NVVUZCVVN4MVFrRkJkVUk3U1VGRGJrTXNVMEZCVXl4SFFVRkhMRWxCUVVrN1NVRkRhRUlzVVVGQlVTeEpRVUZKTEVsQlFVazdTVUZEYUVJc1MwRkJTeXhQUVVGUExIVkNRVUYxUWp0SlFVTnVReXhKUVVGSkxGRkJRVkVzVFVGQlRUdEhRVU51UWp0RlFVTkVPMGxCUTBVc1NVRkJTU3hSUVVGUkxHTkJRV003U1VGRE1VSXNVMEZCVXl4SFFVRkhMRXRCUVVzN1NVRkRha0lzVVVGQlVTeEpRVUZKTEV0QlFVczdTVUZEYWtJc1MwRkJTeXhQUVVGUExGTkJRVk03U1VGRGNrSXNTVUZCU1N4UlFVRlJMRk5CUVZNN1IwRkRkRUk3UVVGRFNDeERRVUZETEVOQlFVTTdPMEZCUlVZc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eE5RVUZOTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUoyWVhJZ2RtRnNkV1Z6SUQwZ1cxMDdYRzVjYm5aaGJIVmxjeUE5SUZ0Y2JpQWdlMXh1SUNBZ0lHeHZZMnRsWkRvZ0lDQWdJSFJ5ZFdVc1hHNGdJQ0FnYldsdWFXMWhiRG9nSUNBZ2RISjFaU3hjYmlBZ0lDQnVZVzFsT2lBZ0lDQWdJQ0FuYzNSaGRIVnpKeXhjYmlBZ0lDQnpiM0owWVdKc1pUb2dJQ0IwY25WbExGeHVJQ0FnSUhSNWNHVTZJQ0FnSUNBZ0lDZHpkR0YwZFhNblhHNGdJSDBzWEc0Z0lIdGNiaUFnSUNCa2FYSmxZM1JwYjI0NklDQW5ZWE5qSnl4Y2JpQWdJQ0JzYjJOclpXUTZJQ0FnSUNCMGNuVmxMRnh1SUNBZ0lHNWhiV1U2SUNBZ0lDQWdJQ2RYWld4c1gwNWhiV1VuTEZ4dUlDQWdJSE52Y25SaFlteGxPaUFnSUhSeWRXVXNYRzRnSUNBZ2RHbDBiR1U2SUNBZ0lDQWdKMWRsYkd3Z1RtRnRaU2NzWEc0Z0lDQWdkSGx3WlRvZ0lDQWdJQ0FnSjNOMGNtbHVaeWRjYmlBZ2ZTeGNiaUFnZTF4dUlDQWdJRzVoYldVNklDQWdJQ0FnSUNkWFpXeHNYMU4wWVhSbFgxUmxlSFFuTEZ4dUlDQWdJSEpsYzJsNllXSnNaVG9nSUhSeWRXVXNYRzRnSUNBZ2MyOXlkR0ZpYkdVNklDQWdkSEoxWlN4Y2JpQWdJQ0IwYVhSc1pUb2dJQ0FnSUNBblYyVnNiQ0JUZEdGMFpTY3NYRzRnSUNBZ2RIbHdaVG9nSUNBZ0lDQWdKM04wY21sdVp5ZGNiaUFnZlN4Y2JpQWdlMXh1SUNBZ0lHNWhiV1U2SUNBZ0lDQWdJQ2REZFhKeVpXNTBYMU4wWVhSbFgxUnBiV1ZmVkdWNGRDY3NYRzRnSUNBZ2NtVnphWHBoWW14bE9pQWdkSEoxWlN4Y2JpQWdJQ0J6YjNKMFlXSnNaVG9nSUNCMGNuVmxMRnh1SUNBZ0lIUnBkR3hsT2lBZ0lDQWdJQ2REZFhKeVpXNTBJRk4wWVhSbElGUnBiV1VuTEZ4dUlDQWdJSFI1Y0dVNklDQWdJQ0FnSUNkemRISnBibWNuWEc0Z0lIMHNYRzRnSUh0Y2JpQWdJQ0J1WVcxbE9pQWdJQ0FnSUNBblJrZGZUR0Z6ZEY5U1pXTmxhWFpsWkY5RVlYUmxKeXhjYmlBZ0lDQnlaWE5wZW1GaWJHVTZJQ0IwY25WbExGeHVJQ0FnSUhOdmNuUmhZbXhsT2lBZ0lIUnlkV1VzWEc0Z0lDQWdkR2wwYkdVNklDQWdJQ0FnSjBaSElFeGhjM1FnVW1WalpXbDJaV1FnUkdGMFpTY3NYRzRnSUNBZ2RIbHdaVG9nSUNBZ0lDQWdKMlJoZEdVblhHNGdJSDBzWEc0Z0lIdGNiaUFnSUNCdVlXMWxPaUFnSUNBZ0lDQW5kMlZzYkMxaFkzUnBiMjV6Snl4Y2JpQWdJQ0J5WlhOcGVtRmliR1U2SUNCbVlXeHpaU3hjYmlBZ0lDQnpiM0owWVdKc1pUb2dJQ0JtWVd4elpTeGNiaUFnSUNCMGFYUnNaVG9nSUNBZ0lDQW5RV04wYVc5dWN5Y3NYRzRnSUNBZ2RIbHdaVG9nSUNBZ0lDQWdKMkZqZEdsdmJuTW5YRzRnSUgxY2JsMDdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnZG1Gc2RXVnpPMXh1SWwxOSIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ0hBTkdFX1NPUlQ6ICAgICAgJ3NvcnQnLFxuICBDSEFOR0VfU09SVF9ESVI6ICAnc29ydC1kaXInXG59O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12ZDJWc2JGOW5jbWxrTDJGamRHbHZibk11YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNXVUZCV1N4RFFVRkRPenRCUVVWaUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVYzdSVUZEWml4WFFVRlhMRTlCUVU4c1RVRkJUVHRGUVVONFFpeGxRVUZsTEVkQlFVY3NWVUZCVlR0RFFVTTNRaXhEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lYQ0oxYzJVZ2MzUnlhV04wWENJN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdlMXh1SUNCRFNFRk9SMFZmVTA5U1ZEb2dJQ0FnSUNBbmMyOXlkQ2NzWEc0Z0lFTklRVTVIUlY5VFQxSlVYMFJKVWpvZ0lDZHpiM0owTFdScGNpZGNibjA3WEc0aVhYMD0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIEFjdGl2ZVJvd0RldGFpbHM7XG52YXIgJCAgICAgICAgICAgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBSZWFjdCAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgVHIgICAgICAgICAgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL3RyLmpzeCcpO1xudmFyIFRkICAgICAgICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy90ZC5qc3gnKTtcbnZhciBUYWJzICAgICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvdGFicy5qc3gnKTtcbnZhciBJY29uICAgICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvaWNvbi5qc3gnKTtcbnZhciBXZWxsTmF2ICAgICA9IHJlcXVpcmUoJy4vd2VsbF9uYXYuanN4Jyk7XG52YXIgc3RvcmUgICAgICAgPSByZXF1aXJlKCcuL3N0b3JlJyk7XG52YXIgZGlzcGF0Y2hlciAgPSByZXF1aXJlKCcuL2Rpc3BhdGNoZXInKTtcblxuQWN0aXZlUm93RGV0YWlscyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJBY3RpdmVSb3dEZXRhaWxzXCIsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7cXVpY2s6IHN0b3JlLmdldCgncXVpY2snKS50b0pTT04oKX07XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGtleV9tYXAgPSB7Mzk6ICdfbW92ZUJhY2t3YXJkJywgMzc6ICdfbW92ZUZvcndhcmQnfTtcbiAgICAkKGRvY3VtZW50KS5vbigna2V5ZG93bi4nICsgdGhpcy5wcm9wcy5zdG9yZS5jaWQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgd2hlcmUgPSBrZXlfbWFwW2Uud2hpY2hdO1xuXG4gICAgICBpZiAoISB3aGVyZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB0aGlzW3doZXJlXSgpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgJChkb2N1bWVudCkub2ZmKCcuJyArIHRoaXMucHJvcHMuc3RvcmUuY2lkKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHF1aWNrX2xvb2s7XG4gICAgdmFyIHF1aWNrX2l0ZW1zO1xuICAgIHZhciBjbGFzc19uYW1lcyA9IFsnYWN0aXZlJ107XG4gICAgdmFyIHdlbGwgICAgICAgID0gdGhpcy5wcm9wcy5zdG9yZTtcbiAgICB2YXIgc2l6ZV90b2dnbGUgPSB0aGlzLnByb3BzLm1pbmltaXplZCA/ICdleHBhbmQnIDogJ2NvbXByZXNzJztcbiAgICB2YXIgdGFicyAgICAgICAgPSB0aGlzLl9nZXRUYWJzKCk7XG5cbiAgICBpZiAoISB0aGlzLnByb3BzLm1pbmltaXplZCkge1xuICAgICAgcXVpY2tfaXRlbXMgPSB0aGlzLnN0YXRlLnF1aWNrLm1hcChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIGNsYXNzTmFtZSA9ICdjb2wtMSc7XG5cbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgY2xhc3NOYW1lICs9ICcgb2Zmc2V0LTMnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IGNsYXNzTmFtZSwga2V5OiBpbmRleH0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImJveFwifSwgXG4gICAgICAgICAgICAgIGl0ZW0udGV4dFxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBxdWlja19sb29rID0gKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicXVpY2stbG9va1wiLCByZWY6IFwicXVpY2stbG9va1wifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbnRyb2xcIn0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2NsYXNzTmFtZTogXCJidXR0b25cIiwgb25DbGljazogdGhpcy5fbW92ZUZvcndhcmR9LCBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiBcImFycm93LWxlZnRcIn0pKVxuICAgICAgICAgICksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb250ZW50XCJ9LCBcblxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInRyaWNsb3BzZVwifSwgXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJpbm5lclwifSwgXG5cbiAgICAgICAgICAgICAgICBxdWlja19pdGVtc1xuXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcblxuICAgICAgICAgICksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb250cm9sXCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtjbGFzc05hbWU6IFwiYnV0dG9uXCIsIG9uQ2xpY2s6IHRoaXMuX21vdmVCYWNrd2FyZH0sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IFwiYXJyb3ctcmlnaHRcIn0pKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjbGFzc19uYW1lcy5wdXNoKHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRyLCB7Y2xhc3NOYW1lOiBjbGFzc19uYW1lcy5qb2luKCcgJyl9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZCwge2NvbFNwYW46IHN0b3JlLmdldCgnaGVhZGluZ3MnKS5sZW5ndGh9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZmllbGRzZXRcIiwge2NsYXNzTmFtZTogXCJzZXBhcmF0b3JcIn0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxlZ2VuZFwiLCB7YWxpZ246IFwiY2VudGVyXCJ9LCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYWJzLCB7dGFiczogdGFic30pXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSwgXG4gICAgICAgICAgcXVpY2tfbG9vaywgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChXZWxsTmF2LCB7d2VsbElkOiB3ZWxsLmNpZCwgc2l6ZTogXCJzbWFsbFwiLCB0eXBlOiB3ZWxsLmdldCgnTGlmdF9UeXBlJyl9KVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgX2dldFRhYnM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGFicyA9IFtcbiAgICAgIHtpY29uOiB7dHlwZTogJ2Fycm93LXVwJ30sICAgIGFjdGlvbjogdGhpcy5fc2VsZWN0UHJldn0sXG4gICAgICB7aWNvbjoge3R5cGU6ICdhcnJvdy1kb3duJ30sICBhY3Rpb246IHRoaXMuX3NlbGVjdE5leHR9LFxuICAgICAge2ljb246IHt0eXBlOiBzaXplX3RvZ2dsZX0sICAgYWN0aW9uOiB0aGlzLl9zaXplVG9nZ2xlfSxcbiAgICAgIHtpY29uOiB7dHlwZTogJ2Nsb3NlJ30sICAgICAgIGFjdGlvbjogdGhpcy5fY2xvc2V9XG4gICAgXTtcblxuICAgIGlmICghIHRoaXMucHJvcHMucHJldikge1xuICAgICAgZGVsZXRlIHRhYnNbMF07XG4gICAgfVxuXG4gICAgaWYgKCEgdGhpcy5wcm9wcy5uZXh0KSB7XG4gICAgICBkZWxldGUgdGFic1sxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGFicztcbiAgfSxcbiAgX21vdmVGb3J3YXJkOiBmdW5jdGlvbiAoKSB7XG4gICAgc3RvcmUuZ2V0KCdxdWljaycpLmdvQmFjaygpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7cXVpY2s6IHN0b3JlLmdldCgncXVpY2snKS50b0pTT04oKX0pO1xuICB9LFxuICBfbW92ZUJhY2t3YXJkOiBmdW5jdGlvbiAoKSB7XG4gICAgc3RvcmUuZ2V0KCdxdWljaycpLmdvRm9yd2FyZCgpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7cXVpY2s6IHN0b3JlLmdldCgncXVpY2snKS50b0pTT04oKX0pO1xuICB9LFxuICBfc2VsZWN0UHJldjogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnByZXYpIHtcbiAgICAgIHRoaXMuX3N3aXRjaCh0aGlzLnByb3BzLnByZXYpO1xuICAgIH1cbiAgfSxcbiAgX3NlbGVjdE5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5uZXh0KSB7XG4gICAgICB0aGlzLl9zd2l0Y2godGhpcy5wcm9wcy5uZXh0KTtcbiAgICB9XG4gIH0sXG4gIF9zaXplVG9nZ2xlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuc2l6ZVRvZ2dsZSkge1xuICAgICAgdGhpcy5wcm9wcy5zaXplVG9nZ2xlKCk7XG4gICAgfVxuICB9LFxuICBfY2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9zd2l0Y2goKTtcbiAgfSxcbiAgX3N3aXRjaDogZnVuY3Rpb24gKGNpZCkge1xuICAgIGlmICh0aGlzLnByb3BzLnN3aXRjaGVyKSB7XG4gICAgICB0aGlzLnByb3BzLnN3aXRjaGVyKGNpZCwgdHJ1ZSk7XG4gICAgfVxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBY3RpdmVSb3dEZXRhaWxzO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12ZDJWc2JGOW5jbWxrTDJGamRHbDJaVjl5YjNkZlpHVjBZV2xzY3k1cWMzZ2lYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3TzBGQlJVRXNSMEZCUnpzN1FVRkZTQ3hKUVVGSkxHZENRVUZuUWl4RFFVRkRPMEZCUTNKQ0xFbEJRVWtzUTBGQlF5eGhRVUZoTEU5QlFVOHNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRCUVVOd1F5eEpRVUZKTEV0QlFVc3NVMEZCVXl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRGJrTXNTVUZCU1N4RlFVRkZMRmxCUVZrc1QwRkJUeXhEUVVGRExIbENRVUY1UWl4RFFVRkRMRU5CUVVNN1FVRkRja1FzU1VGQlNTeEZRVUZGTEZsQlFWa3NUMEZCVHl4RFFVRkRMSGxDUVVGNVFpeERRVUZETEVOQlFVTTdRVUZEY2tRc1NVRkJTU3hKUVVGSkxGVkJRVlVzVDBGQlR5eERRVUZETERKQ1FVRXlRaXhEUVVGRExFTkJRVU03UVVGRGRrUXNTVUZCU1N4SlFVRkpMRlZCUVZVc1QwRkJUeXhEUVVGRExESkNRVUV5UWl4RFFVRkRMRU5CUVVNN1FVRkRka1FzU1VGQlNTeFBRVUZQTEU5QlFVOHNUMEZCVHl4RFFVRkRMR2RDUVVGblFpeERRVUZETEVOQlFVTTdRVUZETlVNc1NVRkJTU3hMUVVGTExGTkJRVk1zVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMEZCUTNKRExFbEJRVWtzVlVGQlZTeEpRVUZKTEU5QlFVOHNRMEZCUXl4alFVRmpMRU5CUVVNc1EwRkJRenM3UVVGRk1VTXNjME5CUVhORExHZERRVUZCTzBWQlEzQkRMR1ZCUVdVc1JVRkJSU3haUVVGWk8wbEJRek5DTEU5QlFVOHNRMEZCUXl4TFFVRkxMRVZCUVVVc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJReXhEUVVGRE8wZEJRemRETzBWQlEwUXNhVUpCUVdsQ0xFVkJRVVVzV1VGQldUdEpRVU0zUWl4SlFVRkpMRTlCUVU4c1IwRkJSeXhEUVVGRExFVkJRVVVzUlVGQlJTeGxRVUZsTEVWQlFVVXNSVUZCUlN4RlFVRkZMR05CUVdNc1EwRkJReXhEUVVGRE8wbEJRM2hFTEVOQlFVTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhGUVVGRkxFTkJRVU1zVlVGQlZTeEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUlVGQlJTeFZRVUZWTEVOQlFVTXNSVUZCUlR0QlFVTnVSU3hOUVVGTkxFbEJRVWtzUzBGQlN5eEhRVUZITEU5QlFVOHNRMEZCUXl4RFFVRkRMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03TzAxQlJUZENMRWxCUVVrc1JVRkJSU3hMUVVGTExFVkJRVVU3VVVGRFdDeFBRVUZQTEVsQlFVa3NRMEZCUXp0QlFVTndRaXhQUVVGUE96dEJRVVZRTEUxQlFVMHNRMEZCUXl4RFFVRkRMR05CUVdNc1JVRkJSU3hEUVVGRE96dE5RVVZ1UWl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFVkJRVVVzUTBGQlF6dExRVU5tTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU03UjBGRFpqdEZRVU5FTEc5Q1FVRnZRaXhGUVVGRkxGbEJRVms3U1VGRGFFTXNRMEZCUXl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExFZEJRVWNzUTBGQlF5eEhRVUZITEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdSMEZETjBNN1JVRkRSQ3hOUVVGTkxFVkJRVVVzV1VGQldUdEpRVU5zUWl4SlFVRkpMRlZCUVZVc1EwRkJRenRKUVVObUxFbEJRVWtzVjBGQlZ5eERRVUZETzBsQlEyaENMRWxCUVVrc1YwRkJWeXhIUVVGSExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdTVUZETjBJc1NVRkJTU3hKUVVGSkxGVkJRVlVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNN1NVRkRia01zU1VGQlNTeFhRVUZYTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhUUVVGVExFZEJRVWNzVVVGQlVTeEhRVUZITEZWQlFWVXNRMEZCUXp0QlFVTnVSU3hKUVVGSkxFbEJRVWtzU1VGQlNTeFZRVUZWTEVsQlFVa3NRMEZCUXl4UlFVRlJMRVZCUVVVc1EwRkJRenM3U1VGRmJFTXNTVUZCU1N4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVTBGQlV5eEZRVUZGTzAxQlF6RkNMRmRCUVZjc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJWU3hKUVVGSkxFVkJRVVVzUzBGQlN5eEZRVUZGTzBGQlEyaEZMRkZCUVZFc1NVRkJTU3hUUVVGVExFZEJRVWNzVDBGQlR5eERRVUZET3p0UlFVVjRRaXhKUVVGSkxFdEJRVXNzUzBGQlN5eERRVUZETEVWQlFVVTdWVUZEWml4VFFVRlRMRWxCUVVrc1YwRkJWeXhEUVVGRE8wRkJRMjVETEZOQlFWTTdPMUZCUlVRN1ZVRkRSU3h2UWtGQlFTeExRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRkxGTkJRVk1zUlVGQlF5eERRVUZETEVkQlFVRXNSVUZCUnl4RFFVRkZMRXRCUVU4c1EwRkJRU3hGUVVGQk8xbEJRM0pETEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNTMEZCVFN4RFFVRkJMRVZCUVVFN1kwRkRiRUlzU1VGQlNTeERRVUZETEVsQlFVczdXVUZEVUN4RFFVRkJPMVZCUTBZc1EwRkJRVHRWUVVOT08wRkJRMVlzVDBGQlR5eERRVUZETEVOQlFVTTdPMDFCUlVnc1ZVRkJWVHRSUVVOU0xHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zV1VGQlFTeEZRVUZaTEVOQlFVTXNSMEZCUVN4RlFVRkhMRU5CUVVNc1dVRkJZU3hEUVVGQkxFVkJRVUU3VlVGRE0wTXNiMEpCUVVFc1MwRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4VFFVRlZMRU5CUVVFc1JVRkJRVHRaUVVOMlFpeHZRa0ZCUVN4SFFVRkZMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEZGQlFVRXNSVUZCVVN4RFFVRkRMRTlCUVVFc1JVRkJUeXhEUVVGRkxFbEJRVWtzUTBGQlF5eFpRVUZqTEVOQlFVRXNSVUZCUVN4dlFrRkJReXhKUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEVsQlFVRXNSVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJRU3hEUVVGSExFTkJRVWtzUTBGQlFUdFZRVU0xUlN4RFFVRkJMRVZCUVVFN1FVRkRhRUlzVlVGQlZTeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEZOQlFWVXNRMEZCUVN4RlFVRkJPenRaUVVWMlFpeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEZkQlFWa3NRMEZCUVN4RlFVRkJPMEZCUTNaRExHTkJRV01zYjBKQlFVRXNTMEZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eFBRVUZSTEVOQlFVRXNSVUZCUVRzN1FVRkZja01zWjBKQlFXbENMRmRCUVZrN08yTkJSVlFzUTBGQlFUdEJRVU53UWl4WlFVRnJRaXhEUVVGQk96dFZRVVZHTEVOQlFVRXNSVUZCUVR0VlFVTk9MRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc1UwRkJWU3hEUVVGQkxFVkJRVUU3V1VGRGRrSXNiMEpCUVVFc1IwRkJSU3hGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4UlFVRkJMRVZCUVZFc1EwRkJReXhQUVVGQkxFVkJRVThzUTBGQlJTeEpRVUZKTEVOQlFVTXNZVUZCWlN4RFFVRkJMRVZCUVVFc2IwSkJRVU1zU1VGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJReXhoUVVGaExFTkJRVUVzUTBGQlJ5eERRVUZKTEVOQlFVRTdWVUZET1VVc1EwRkJRVHRSUVVOR0xFTkJRVUU3VDBGRFVDeERRVUZETzBGQlExSXNTMEZCU3pzN1FVRkZUQ3hKUVVGSkxGZEJRVmNzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6czdTVUZGZGtNN1RVRkRSU3h2UWtGQlF5eEZRVUZGTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRkxGZEJRVmNzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkhMRU5CUVVFc1JVRkJRVHRSUVVOd1F5eHZRa0ZCUXl4RlFVRkZMRVZCUVVFc1EwRkJRU3hEUVVGRExFOUJRVUVzUlVGQlR5eERRVUZGTEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJWU3hEUVVGRExFTkJRVU1zVFVGQlVTeERRVUZCTEVWQlFVRTdWVUZEZWtNc2IwSkJRVUVzVlVGQlV5eEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhYUVVGWkxFTkJRVUVzUlVGQlFUdFpRVU01UWl4dlFrRkJRU3hSUVVGUExFVkJRVUVzUTBGQlFTeERRVUZETEV0QlFVRXNSVUZCU3l4RFFVRkRMRkZCUVZNc1EwRkJRU3hGUVVGQk8yTkJRM0pDTEc5Q1FVRkRMRWxCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zU1VGQlFTeEZRVUZKTEVOQlFVVXNTVUZCU3l4RFFVRkJMRU5CUVVjc1EwRkJRVHRaUVVOaUxFTkJRVUU3VlVGRFFTeERRVUZCTEVWQlFVRTdWVUZEVml4VlFVRlZMRVZCUVVNN1ZVRkRXaXh2UWtGQlF5eFBRVUZQTEVWQlFVRXNRMEZCUVN4RFFVRkRMRTFCUVVFc1JVRkJUU3hEUVVGRkxFbEJRVWtzUTBGQlF5eEhRVUZITEVWQlFVTXNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJReXhQUVVGQkxFVkJRVThzUTBGQlF5eEpRVUZCTEVWQlFVa3NRMEZCUlN4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExGZEJRVmNzUTBGQlJTeERRVUZCTEVOQlFVY3NRMEZCUVR0UlFVTndSU3hEUVVGQk8wMUJRMFlzUTBGQlFUdE5RVU5NTzBkQlEwZzdSVUZEUkN4UlFVRlJMRVZCUVVVc1dVRkJXVHRKUVVOd1FpeEpRVUZKTEVsQlFVa3NSMEZCUnp0TlFVTlVMRU5CUVVNc1NVRkJTU3hGUVVGRkxFTkJRVU1zU1VGQlNTeEZRVUZGTEZWQlFWVXNRMEZCUXl4TFFVRkxMRTFCUVUwc1JVRkJSU3hKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETzAxQlEzWkVMRU5CUVVNc1NVRkJTU3hGUVVGRkxFTkJRVU1zU1VGQlNTeEZRVUZGTEZsQlFWa3NRMEZCUXl4SFFVRkhMRTFCUVUwc1JVRkJSU3hKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETzAxQlEzWkVMRU5CUVVNc1NVRkJTU3hGUVVGRkxFTkJRVU1zU1VGQlNTeEZRVUZGTEZkQlFWY3NRMEZCUXl4SlFVRkpMRTFCUVUwc1JVRkJSU3hKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETzAxQlEzWkVMRU5CUVVNc1NVRkJTU3hGUVVGRkxFTkJRVU1zU1VGQlNTeEZRVUZGTEU5QlFVOHNRMEZCUXl4UlFVRlJMRTFCUVUwc1JVRkJSU3hKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETzBGQlEzaEVMRXRCUVVzc1EwRkJRenM3U1VGRlJpeEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFVkJRVVU3VFVGRGNrSXNUMEZCVHl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRGNrSXNTMEZCU3pzN1NVRkZSQ3hKUVVGSkxFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRVZCUVVVN1RVRkRja0lzVDBGQlR5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRja0lzUzBGQlN6czdTVUZGUkN4UFFVRlBMRWxCUVVrc1EwRkJRenRIUVVOaU8wVkJRMFFzV1VGQldTeEZRVUZGTEZsQlFWazdRVUZETlVJc1NVRkJTU3hMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRE96dEpRVVUxUWl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUzBGQlN5eEZRVUZGTEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRPMGRCUTNKRU8wVkJRMFFzWVVGQllTeEZRVUZGTEZsQlFWazdRVUZETjBJc1NVRkJTU3hMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRMRk5CUVZNc1JVRkJSU3hEUVVGRE96dEpRVVV2UWl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUzBGQlN5eEZRVUZGTEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRPMGRCUTNKRU8wVkJRMFFzVjBGQlZ5eEZRVUZGTEZsQlFWazdTVUZEZGtJc1NVRkJTU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NSVUZCUlR0TlFVTnVRaXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UzBGREwwSTdSMEZEUmp0RlFVTkVMRmRCUVZjc1JVRkJSU3haUVVGWk8wbEJRM1pDTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFVkJRVVU3VFVGRGJrSXNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMHRCUXk5Q08wZEJRMFk3UlVGRFJDeFhRVUZYTEVWQlFVVXNXVUZCV1R0SlFVTjJRaXhKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNWVUZCVlN4RlFVRkZPMDFCUTNwQ0xFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNWVUZCVlN4RlFVRkZMRU5CUVVNN1MwRkRla0k3UjBGRFJqdEZRVU5FTEUxQlFVMHNSVUZCUlN4WlFVRlpPMGxCUTJ4Q0xFbEJRVWtzUTBGQlF5eFBRVUZQTEVWQlFVVXNRMEZCUXp0SFFVTm9RanRGUVVORUxFOUJRVThzUlVGQlJTeFZRVUZWTEVkQlFVY3NSVUZCUlR0SlFVTjBRaXhKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVVUZCVVN4RlFVRkZPMDFCUTNaQ0xFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWRCUVVjc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dExRVU5vUXp0SFFVTkdPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhuUWtGQlowSXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFLbHh1SUNvZ1FHcHplQ0JTWldGamRDNUVUMDFjYmlBcUwxeHVYRzUyWVhJZ1FXTjBhWFpsVW05M1JHVjBZV2xzY3p0Y2JuWmhjaUFrSUNBZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0oycHhkV1Z5ZVNjcE8xeHVkbUZ5SUZKbFlXTjBJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRbktUdGNiblpoY2lCVWNpQWdJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR1THk0dUwyTnZiWEJ2Ym1WdWRITXZkSEl1YW5ONEp5azdYRzUyWVhJZ1ZHUWdJQ0FnSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2N1TGk4dUxpOWpiMjF3YjI1bGJuUnpMM1JrTG1wemVDY3BPMXh1ZG1GeUlGUmhZbk1nSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duTGk0dkxpNHZZMjl0Y0c5dVpXNTBjeTkwWVdKekxtcHplQ2NwTzF4dWRtRnlJRWxqYjI0Z0lDQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpNHZMaTR2WTI5dGNHOXVaVzUwY3k5cFkyOXVMbXB6ZUNjcE8xeHVkbUZ5SUZkbGJHeE9ZWFlnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTkzWld4c1gyNWhkaTVxYzNnbktUdGNiblpoY2lCemRHOXlaU0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR2YzNSdmNtVW5LVHRjYm5aaGNpQmthWE53WVhSamFHVnlJQ0E5SUhKbGNYVnBjbVVvSnk0dlpHbHpjR0YwWTJobGNpY3BPMXh1WEc1QlkzUnBkbVZTYjNkRVpYUmhhV3h6SUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVJQ0JuWlhSSmJtbDBhV0ZzVTNSaGRHVTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdlM0YxYVdOck9pQnpkRzl5WlM1blpYUW9KM0YxYVdOckp5a3VkRzlLVTA5T0tDbDlPMXh1SUNCOUxGeHVJQ0JqYjIxd2IyNWxiblJFYVdSTmIzVnVkRG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQnJaWGxmYldGd0lEMGdlek01T2lBblgyMXZkbVZDWVdOcmQyRnlaQ2NzSURNM09pQW5YMjF2ZG1WR2IzSjNZWEprSjMwN1hHNGdJQ0FnSkNoa2IyTjFiV1Z1ZENrdWIyNG9KMnRsZVdSdmQyNHVKeUFySUhSb2FYTXVjSEp2Y0hNdWMzUnZjbVV1WTJsa0xDQm1kVzVqZEdsdmJpQW9aU2tnZTF4dUlDQWdJQ0FnZG1GeUlIZG9aWEpsSUQwZ2EyVjVYMjFoY0Z0bExuZG9hV05vWFR0Y2JseHVJQ0FnSUNBZ2FXWWdLQ0VnZDJobGNtVXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSFJ5ZFdVN1hHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHVXVjSEpsZG1WdWRFUmxabUYxYkhRb0tUdGNibHh1SUNBZ0lDQWdkR2hwYzF0M2FHVnlaVjBvS1R0Y2JpQWdJQ0I5TG1KcGJtUW9kR2hwY3lrcE8xeHVJQ0I5TEZ4dUlDQmpiMjF3YjI1bGJuUlhhV3hzVlc1dGIzVnVkRG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUNRb1pHOWpkVzFsYm5RcExtOW1aaWduTGljZ0t5QjBhR2x6TG5CeWIzQnpMbk4wYjNKbExtTnBaQ2s3WEc0Z0lIMHNYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQnhkV2xqYTE5c2IyOXJPMXh1SUNBZ0lIWmhjaUJ4ZFdsamExOXBkR1Z0Y3p0Y2JpQWdJQ0IyWVhJZ1kyeGhjM05mYm1GdFpYTWdQU0JiSjJGamRHbDJaU2RkTzF4dUlDQWdJSFpoY2lCM1pXeHNJQ0FnSUNBZ0lDQTlJSFJvYVhNdWNISnZjSE11YzNSdmNtVTdYRzRnSUNBZ2RtRnlJSE5wZW1WZmRHOW5aMnhsSUQwZ2RHaHBjeTV3Y205d2N5NXRhVzVwYldsNlpXUWdQeUFuWlhod1lXNWtKeUE2SUNkamIyMXdjbVZ6Y3ljN1hHNGdJQ0FnZG1GeUlIUmhZbk1nSUNBZ0lDQWdJRDBnZEdocGN5NWZaMlYwVkdGaWN5Z3BPMXh1WEc0Z0lDQWdhV1lnS0NFZ2RHaHBjeTV3Y205d2N5NXRhVzVwYldsNlpXUXBJSHRjYmlBZ0lDQWdJSEYxYVdOclgybDBaVzF6SUQwZ2RHaHBjeTV6ZEdGMFpTNXhkV2xqYXk1dFlYQW9ablZ1WTNScGIyNGdLR2wwWlcwc0lHbHVaR1Y0S1NCN1hHNGdJQ0FnSUNBZ0lIWmhjaUJqYkdGemMwNWhiV1VnUFNBblkyOXNMVEVuTzF4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2hwYm1SbGVDQTlQVDBnTUNrZ2UxeHVJQ0FnSUNBZ0lDQWdJR05zWVhOelRtRnRaU0FyUFNBbklHOW1abk5sZEMwekp6dGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5ZTJOc1lYTnpUbUZ0WlgwZ2EyVjVQWHRwYm1SbGVIMCtYRzRnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW1KdmVGd2lQbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQjdhWFJsYlM1MFpYaDBmVnh1SUNBZ0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdJQ0FnSUNrN1hHNGdJQ0FnSUNCOUtUdGNibHh1SUNBZ0lDQWdjWFZwWTJ0ZmJHOXZheUE5SUNoY2JpQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKeGRXbGpheTFzYjI5clhDSWdjbVZtUFZ3aWNYVnBZMnN0Ykc5dmExd2lQbHh1SUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpWTI5dWRISnZiRndpUGx4dUlDQWdJQ0FnSUNBZ0lDQWdQR0VnWTJ4aGMzTk9ZVzFsUFZ3aVluVjBkRzl1WENJZ2IyNURiR2xqYXoxN2RHaHBjeTVmYlc5MlpVWnZjbmRoY21SOVBqeEpZMjl1SUhSNWNHVTlYQ0poY25KdmR5MXNaV1owWENJZ0x6NDhMMkUrWEc0Z0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKamIyNTBaVzUwWENJK1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpZEhKcFkyeHZjSE5sWENJK1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpYVc1dVpYSmNJajVjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUh0eGRXbGphMTlwZEdWdGMzMWNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHVYRzRnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0pqYjI1MGNtOXNYQ0krWEc0Z0lDQWdJQ0FnSUNBZ0lDQThZU0JqYkdGemMwNWhiV1U5WENKaWRYUjBiMjVjSWlCdmJrTnNhV05yUFh0MGFHbHpMbDl0YjNabFFtRmphM2RoY21SOVBqeEpZMjl1SUhSNWNHVTlYQ0poY25KdmR5MXlhV2RvZEZ3aUlDOCtQQzloUGx4dUlDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQWdJQ2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdZMnhoYzNOZmJtRnRaWE11Y0hWemFDaDBhR2x6TG5CeWIzQnpMbU5zWVhOelRtRnRaU2s3WEc1Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQRlJ5SUdOc1lYTnpUbUZ0WlQxN1kyeGhjM05mYm1GdFpYTXVhbTlwYmlnbklDY3BmVDVjYmlBZ0lDQWdJQ0FnUEZSa0lHTnZiRk53WVc0OWUzTjBiM0psTG1kbGRDZ25hR1ZoWkdsdVozTW5LUzVzWlc1bmRHaDlQbHh1SUNBZ0lDQWdJQ0FnSUR4bWFXVnNaSE5sZENCamJHRnpjMDVoYldVOVhDSnpaWEJoY21GMGIzSmNJajVjYmlBZ0lDQWdJQ0FnSUNBZ0lEeHNaV2RsYm1RZ1lXeHBaMjQ5WENKalpXNTBaWEpjSWo1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEZSaFluTWdkR0ZpY3oxN2RHRmljMzBnTHo1Y2JpQWdJQ0FnSUNBZ0lDQWdJRHd2YkdWblpXNWtQbHh1SUNBZ0lDQWdJQ0FnSUR3dlptbGxiR1J6WlhRK1hHNGdJQ0FnSUNBZ0lDQWdlM0YxYVdOclgyeHZiMnQ5WEc0Z0lDQWdJQ0FnSUNBZ1BGZGxiR3hPWVhZZ2QyVnNiRWxrUFh0M1pXeHNMbU5wWkgwZ2MybDZaVDFjSW5OdFlXeHNYQ0lnZEhsd1pUMTdkMlZzYkM1blpYUW9KMHhwWm5SZlZIbHdaU2NwZlNBdlBseHVJQ0FnSUNBZ0lDQThMMVJrUGx4dUlDQWdJQ0FnUEM5VWNqNWNiaUFnSUNBcE8xeHVJQ0I5TEZ4dUlDQmZaMlYwVkdGaWN6b2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCMFlXSnpJRDBnVzF4dUlDQWdJQ0FnZTJsamIyNDZJSHQwZVhCbE9pQW5ZWEp5YjNjdGRYQW5mU3dnSUNBZ1lXTjBhVzl1T2lCMGFHbHpMbDl6Wld4bFkzUlFjbVYyZlN4Y2JpQWdJQ0FnSUh0cFkyOXVPaUI3ZEhsd1pUb2dKMkZ5Y205M0xXUnZkMjRuZlN3Z0lHRmpkR2x2YmpvZ2RHaHBjeTVmYzJWc1pXTjBUbVY0ZEgwc1hHNGdJQ0FnSUNCN2FXTnZiam9nZTNSNWNHVTZJSE5wZW1WZmRHOW5aMnhsZlN3Z0lDQmhZM1JwYjI0NklIUm9hWE11WDNOcGVtVlViMmRuYkdWOUxGeHVJQ0FnSUNBZ2UybGpiMjQ2SUh0MGVYQmxPaUFuWTJ4dmMyVW5mU3dnSUNBZ0lDQWdZV04wYVc5dU9pQjBhR2x6TGw5amJHOXpaWDFjYmlBZ0lDQmRPMXh1WEc0Z0lDQWdhV1lnS0NFZ2RHaHBjeTV3Y205d2N5NXdjbVYyS1NCN1hHNGdJQ0FnSUNCa1pXeGxkR1VnZEdGaWMxc3dYVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnBaaUFvSVNCMGFHbHpMbkJ5YjNCekxtNWxlSFFwSUh0Y2JpQWdJQ0FnSUdSbGJHVjBaU0IwWVdKeld6RmRPMXh1SUNBZ0lIMWNibHh1SUNBZ0lISmxkSFZ5YmlCMFlXSnpPMXh1SUNCOUxGeHVJQ0JmYlc5MlpVWnZjbmRoY21RNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnpkRzl5WlM1blpYUW9KM0YxYVdOckp5a3VaMjlDWVdOcktDazdYRzVjYmlBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0eGRXbGphem9nYzNSdmNtVXVaMlYwS0NkeGRXbGpheWNwTG5SdlNsTlBUaWdwZlNrN1hHNGdJSDBzWEc0Z0lGOXRiM1psUW1GamEzZGhjbVE2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCemRHOXlaUzVuWlhRb0ozRjFhV05ySnlrdVoyOUdiM0ozWVhKa0tDazdYRzVjYmlBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0eGRXbGphem9nYzNSdmNtVXVaMlYwS0NkeGRXbGpheWNwTG5SdlNsTlBUaWdwZlNrN1hHNGdJSDBzWEc0Z0lGOXpaV3hsWTNSUWNtVjJPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnYVdZZ0tIUm9hWE11Y0hKdmNITXVjSEpsZGlrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTVmYzNkcGRHTm9LSFJvYVhNdWNISnZjSE11Y0hKbGRpazdYRzRnSUNBZ2ZWeHVJQ0I5TEZ4dUlDQmZjMlZzWldOMFRtVjRkRG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUdsbUlDaDBhR2x6TG5CeWIzQnpMbTVsZUhRcElIdGNiaUFnSUNBZ0lIUm9hWE11WDNOM2FYUmphQ2gwYUdsekxuQnliM0J6TG01bGVIUXBPMXh1SUNBZ0lIMWNiaUFnZlN4Y2JpQWdYM05wZW1WVWIyZG5iR1U2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCcFppQW9kR2hwY3k1d2NtOXdjeTV6YVhwbFZHOW5aMnhsS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbkJ5YjNCekxuTnBlbVZVYjJkbmJHVW9LVHRjYmlBZ0lDQjlYRzRnSUgwc1hHNGdJRjlqYkc5elpUb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFJvYVhNdVgzTjNhWFJqYUNncE8xeHVJQ0I5TEZ4dUlDQmZjM2RwZEdOb09pQm1kVzVqZEdsdmJpQW9ZMmxrS1NCN1hHNGdJQ0FnYVdZZ0tIUm9hWE11Y0hKdmNITXVjM2RwZEdOb1pYSXBJSHRjYmlBZ0lDQWdJSFJvYVhNdWNISnZjSE11YzNkcGRHTm9aWElvWTJsa0xDQjBjblZsS1R0Y2JpQWdJQ0I5WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFRmpkR2wyWlZKdmQwUmxkR0ZwYkhNN1hHNGlYWDA9IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBEaXNwYXRjaGVyID0gcmVxdWlyZSgnZmx1eCcpLkRpc3BhdGNoZXI7XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IERpc3BhdGNoZXIoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdmQyVnNiRjluY21sa0wyUnBjM0JoZEdOb1pYSXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1dVRkJXU3hEUVVGRE96dEJRVVZpTEVsQlFVa3NWVUZCVlN4SFFVRkhMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF5eFZRVUZWTEVOQlFVTTdPMEZCUlRWRExFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NTVUZCU1N4VlFVRlZMRVZCUVVVc1EwRkJReUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWx3aWRYTmxJSE4wY21samRGd2lPMXh1WEc1MllYSWdSR2x6Y0dGMFkyaGxjaUE5SUhKbGNYVnBjbVVvSjJac2RYZ25LUzVFYVhOd1lYUmphR1Z5TzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlHNWxkeUJFYVhOd1lYUmphR1Z5S0NrN1hHNGlYWDA9IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgTW9kZWwgICAgPSByZXF1aXJlKCcuL2hlYWRpbmdfbW9kZWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gIG1vZGVsOiBNb2RlbCxcbiAgY2hhbmdlU29ydDogZnVuY3Rpb24gKHNvcnRlZSkge1xuICAgIHZhciBtb2RlbCA9IHRoaXMucGFyZW50O1xuXG4gICAgaWYgKCEgbW9kZWwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBtb2RlbC5nZXQoJ3NvcnRlZScpLmVuZFNvcnRpbmcoKTtcbiAgICBtb2RlbC5zZXQoJ3NvcnRlZScsIHNvcnRlZSk7XG5cbiAgICBwYXlsb2FkLnNvcnRlZS50b2dnbGVTb3J0RGlyZWN0aW9uKCk7XG4gIH0sXG4gIGNoYW5nZVNvcnREaXJlY3Rpb246IGZ1bmN0aW9uIChzb3J0ZWUpIHtcbiAgICBzb3J0ZWUudG9nZ2xlU29ydERpcmVjdGlvbigpO1xuICB9LFxuICByZWdpc3RlcldpdGhEaXNwYXRjaGVyOiBmdW5jdGlvbiAoZGlzcGF0Y2hlcikge1xuICAgIHRoaXMuZGlzcGF0Y2hfdG9rZW4gPSBkaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICBzd2l0Y2ggKHBheWxvYWQuYWN0aW9uKSB7XG4gICAgICAgIGNhc2UgdGFibGVfYWN0aW9ucy5DSEFOR0VfU09SVDpcbiAgICAgICAgICB0aGlzLmNoYW5nZVNvcnQocGF5bG9hZC5zb3J0ZWUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHRhYmxlX2FjdGlvbnMuQ0hBTkdFX1NPUlRfRElSOlxuICAgICAgICAgIHRoaXMuY2hhbmdlU29ydERpcmVjdGlvbihwYXlsb2FkLnNvcnRlZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfVxufSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZkMlZzYkY5bmNtbGtMMmhsWVdScGJtZGZZMjlzYkdWamRHbHZiaTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeFpRVUZaTEVOQlFVTTdPMEZCUldJc1NVRkJTU3hSUVVGUkxFZEJRVWNzVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPMEZCUTI1RExFbEJRVWtzUzBGQlN5eE5RVUZOTEU5QlFVOHNRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eERRVUZET3p0QlFVVXhReXhOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEZGQlFWRXNRMEZCUXl4VlFVRlZMRU5CUVVNc1RVRkJUU3hEUVVGRE8wVkJRekZETEV0QlFVc3NSVUZCUlN4TFFVRkxPMFZCUTFvc1ZVRkJWU3hGUVVGRkxGVkJRVlVzVFVGQlRTeEZRVUZGTzBGQlEyaERMRWxCUVVrc1NVRkJTU3hMUVVGTExFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXpzN1NVRkZlRUlzU1VGQlNTeEZRVUZGTEV0QlFVc3NSVUZCUlR0TlFVTllMRTlCUVU4c1MwRkJTeXhEUVVGRE8wRkJRMjVDTEV0QlFVczdPMGxCUlVRc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4VlFVRlZMRVZCUVVVc1EwRkJRenRCUVVOeVF5eEpRVUZKTEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1VVRkJVU3hGUVVGRkxFMUJRVTBzUTBGQlF5eERRVUZET3p0SlFVVTFRaXhQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETEcxQ1FVRnRRaXhGUVVGRkxFTkJRVU03UjBGRGRFTTdSVUZEUkN4dFFrRkJiVUlzUlVGQlJTeFZRVUZWTEUxQlFVMHNSVUZCUlR0SlFVTnlReXhOUVVGTkxFTkJRVU1zYlVKQlFXMUNMRVZCUVVVc1EwRkJRenRIUVVNNVFqdEZRVU5FTEhOQ1FVRnpRaXhGUVVGRkxGVkJRVlVzVlVGQlZTeEZRVUZGTzBsQlF6VkRMRWxCUVVrc1EwRkJReXhqUVVGakxFZEJRVWNzVlVGQlZTeERRVUZETEZGQlFWRXNRMEZCUXl4VlFVRlZMRTlCUVU4c1JVRkJSVHROUVVNelJDeFJRVUZSTEU5QlFVOHNRMEZCUXl4TlFVRk5PMUZCUTNCQ0xFdEJRVXNzWVVGQllTeERRVUZETEZkQlFWYzdWVUZETlVJc1NVRkJTU3hEUVVGRExGVkJRVlVzUTBGQlF5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1ZVRkRhRU1zVFVGQlRUdFJRVU5TTEV0QlFVc3NZVUZCWVN4RFFVRkRMR1ZCUVdVN1ZVRkRhRU1zU1VGQlNTeERRVUZETEcxQ1FVRnRRaXhEUVVGRExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0VlFVTjZReXhOUVVGTk8wOUJRMVE3UzBGRFJpeERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRE8wZEJRMlk3UTBGRFJpeERRVUZETEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpjSW5WelpTQnpkSEpwWTNSY0lqdGNibHh1ZG1GeUlFSmhZMnRpYjI1bElEMGdjbVZ4ZFdseVpTZ25ZbUZqYTJKdmJtVW5LVHRjYm5aaGNpQk5iMlJsYkNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR2YUdWaFpHbHVaMTl0YjJSbGJDY3BPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUVKaFkydGliMjVsTGtOdmJHeGxZM1JwYjI0dVpYaDBaVzVrS0h0Y2JpQWdiVzlrWld3NklFMXZaR1ZzTEZ4dUlDQmphR0Z1WjJWVGIzSjBPaUJtZFc1amRHbHZiaUFvYzI5eWRHVmxLU0I3WEc0Z0lDQWdkbUZ5SUcxdlpHVnNJRDBnZEdocGN5NXdZWEpsYm5RN1hHNWNiaUFnSUNCcFppQW9JU0J0YjJSbGJDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sTzF4dUlDQWdJSDFjYmx4dUlDQWdJRzF2WkdWc0xtZGxkQ2duYzI5eWRHVmxKeWt1Wlc1a1UyOXlkR2x1WnlncE8xeHVJQ0FnSUcxdlpHVnNMbk5sZENnbmMyOXlkR1ZsSnl3Z2MyOXlkR1ZsS1R0Y2JseHVJQ0FnSUhCaGVXeHZZV1F1YzI5eWRHVmxMblJ2WjJkc1pWTnZjblJFYVhKbFkzUnBiMjRvS1R0Y2JpQWdmU3hjYmlBZ1kyaGhibWRsVTI5eWRFUnBjbVZqZEdsdmJqb2dablZ1WTNScGIyNGdLSE52Y25SbFpTa2dlMXh1SUNBZ0lITnZjblJsWlM1MGIyZG5iR1ZUYjNKMFJHbHlaV04wYVc5dUtDazdYRzRnSUgwc1hHNGdJSEpsWjJsemRHVnlWMmwwYUVScGMzQmhkR05vWlhJNklHWjFibU4wYVc5dUlDaGthWE53WVhSamFHVnlLU0I3WEc0Z0lDQWdkR2hwY3k1a2FYTndZWFJqYUY5MGIydGxiaUE5SUdScGMzQmhkR05vWlhJdWNtVm5hWE4wWlhJb1puVnVZM1JwYjI0Z0tIQmhlV3h2WVdRcElIdGNiaUFnSUNBZ0lITjNhWFJqYUNBb2NHRjViRzloWkM1aFkzUnBiMjRwSUh0Y2JpQWdJQ0FnSUNBZ1kyRnpaU0IwWVdKc1pWOWhZM1JwYjI1ekxrTklRVTVIUlY5VFQxSlVPbHh1SUNBZ0lDQWdJQ0FnSUhSb2FYTXVZMmhoYm1kbFUyOXlkQ2h3WVhsc2IyRmtMbk52Y25SbFpTazdYRzRnSUNBZ0lDQWdJQ0FnWW5KbFlXczdYRzRnSUNBZ0lDQWdJR05oYzJVZ2RHRmliR1ZmWVdOMGFXOXVjeTVEU0VGT1IwVmZVMDlTVkY5RVNWSTZYRzRnSUNBZ0lDQWdJQ0FnZEdocGN5NWphR0Z1WjJWVGIzSjBSR2x5WldOMGFXOXVLSEJoZVd4dllXUXVjMjl5ZEdWbEtUdGNiaUFnSUNBZ0lDQWdJQ0JpY21WaGF6dGNiaUFnSUNBZ0lIMWNiaUFnSUNCOUxtSnBibVFvZEdocGN5a3BPMXh1SUNCOVhHNTlLVHRjYmlKZGZRPT0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGRpcmVjdGlvbnM7XG52YXIgTW9kZWw7XG52YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xuXG5kaXJlY3Rpb25zID0ge1xuICBhc2M6ICAnZGVzYycsXG4gIGRlc2M6ICdhc2MnXG59O1xuXG5Nb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gIGRlZmF1bHRzOiB7XG4gICAgZGlyZWN0aW9uOiAgbnVsbCxcbiAgICBsb2NrZWQ6ICAgICBmYWxzZSxcbiAgICBtaW5pbWFsOiAgICBmYWxzZSxcbiAgICBuYW1lOiAgICAgICBudWxsLFxuICAgIHJlc2l6YWJsZTogIGZhbHNlLFxuICAgIHNvcnRhYmxlOiAgIGZhbHNlLFxuICAgIHRpdGxlOiAgICAgIG51bGwsXG4gICAgd2lkdGg6ICAgICAgbnVsbFxuICB9LFxuICB0b2dnbGVTb3J0RGlyZWN0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGN1cnJlbnQgPSB0aGlzLmdldCgnZGlyZWN0aW9uJyk7XG4gICAgdmFyIG5leHQgICAgPSAnYXNjJztcblxuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICBuZXh0ID0gZGlyZWN0aW9uc1tjdXJyZW50XTtcbiAgICB9XG5cbiAgICB0aGlzLnNldCgnZGlyZWN0aW9uJywgbmV4dCk7XG4gIH0sXG4gIGVuZFNvcnRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldCgnZGlyZWN0aW9uJywgbnVsbCk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12ZDJWc2JGOW5jbWxrTDJobFlXUnBibWRmYlc5a1pXd3Vhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1dVRkJXU3hEUVVGRE96dEJRVVZpTEVsQlFVa3NWVUZCVlN4RFFVRkRPMEZCUTJZc1NVRkJTU3hMUVVGTExFTkJRVU03UVVGRFZpeEpRVUZKTEZGQlFWRXNSMEZCUnl4UFFVRlBMRU5CUVVNc1ZVRkJWU3hEUVVGRExFTkJRVU03TzBGQlJXNURMRlZCUVZVc1IwRkJSenRGUVVOWUxFZEJRVWNzUjBGQlJ5eE5RVUZOTzBWQlExb3NTVUZCU1N4RlFVRkZMRXRCUVVzN1FVRkRZaXhEUVVGRExFTkJRVU03TzBGQlJVWXNTMEZCU3l4SFFVRkhMRkZCUVZFc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETzBWQlF6VkNMRkZCUVZFc1JVRkJSVHRKUVVOU0xGTkJRVk1zUjBGQlJ5eEpRVUZKTzBsQlEyaENMRTFCUVUwc1RVRkJUU3hMUVVGTE8wbEJRMnBDTEU5QlFVOHNTMEZCU3l4TFFVRkxPMGxCUTJwQ0xFbEJRVWtzVVVGQlVTeEpRVUZKTzBsQlEyaENMRk5CUVZNc1IwRkJSeXhMUVVGTE8wbEJRMnBDTEZGQlFWRXNTVUZCU1N4TFFVRkxPMGxCUTJwQ0xFdEJRVXNzVDBGQlR5eEpRVUZKTzBsQlEyaENMRXRCUVVzc1QwRkJUeXhKUVVGSk8wZEJRMnBDTzBWQlEwUXNiVUpCUVcxQ0xFVkJRVVVzV1VGQldUdEpRVU12UWl4SlFVRkpMRTlCUVU4c1IwRkJSeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRPMEZCUTNoRExFbEJRVWtzU1VGQlNTeEpRVUZKTEUxQlFVMHNTMEZCU3l4RFFVRkRPenRKUVVWd1FpeEpRVUZKTEU5QlFVOHNSVUZCUlR0TlFVTllMRWxCUVVrc1IwRkJSeXhWUVVGVkxFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdRVUZEYWtNc1MwRkJTenM3U1VGRlJDeEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRmRCUVZjc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dEhRVU0zUWp0RlFVTkVMRlZCUVZVc1JVRkJSU3haUVVGWk8wbEJRM1JDTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1YwRkJWeXhGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETzBkQlF6ZENPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhMUVVGTExFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKY0luVnpaU0J6ZEhKcFkzUmNJanRjYmx4dWRtRnlJR1JwY21WamRHbHZibk03WEc1MllYSWdUVzlrWld3N1hHNTJZWElnUW1GamEySnZibVVnUFNCeVpYRjFhWEpsS0NkaVlXTnJZbTl1WlNjcE8xeHVYRzVrYVhKbFkzUnBiMjV6SUQwZ2UxeHVJQ0JoYzJNNklDQW5aR1Z6WXljc1hHNGdJR1JsYzJNNklDZGhjMk1uWEc1OU8xeHVYRzVOYjJSbGJDQTlJRUpoWTJ0aWIyNWxMazF2WkdWc0xtVjRkR1Z1WkNoN1hHNGdJR1JsWm1GMWJIUnpPaUI3WEc0Z0lDQWdaR2x5WldOMGFXOXVPaUFnYm5Wc2JDeGNiaUFnSUNCc2IyTnJaV1E2SUNBZ0lDQm1ZV3h6WlN4Y2JpQWdJQ0J0YVc1cGJXRnNPaUFnSUNCbVlXeHpaU3hjYmlBZ0lDQnVZVzFsT2lBZ0lDQWdJQ0J1ZFd4c0xGeHVJQ0FnSUhKbGMybDZZV0pzWlRvZ0lHWmhiSE5sTEZ4dUlDQWdJSE52Y25SaFlteGxPaUFnSUdaaGJITmxMRnh1SUNBZ0lIUnBkR3hsT2lBZ0lDQWdJRzUxYkd3c1hHNGdJQ0FnZDJsa2RHZzZJQ0FnSUNBZ2JuVnNiRnh1SUNCOUxGeHVJQ0IwYjJkbmJHVlRiM0owUkdseVpXTjBhVzl1T2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2RtRnlJR04xY25KbGJuUWdQU0IwYUdsekxtZGxkQ2duWkdseVpXTjBhVzl1SnlrN1hHNGdJQ0FnZG1GeUlHNWxlSFFnSUNBZ1BTQW5ZWE5qSnp0Y2JseHVJQ0FnSUdsbUlDaGpkWEp5Wlc1MEtTQjdYRzRnSUNBZ0lDQnVaWGgwSUQwZ1pHbHlaV04wYVc5dWMxdGpkWEp5Wlc1MFhUdGNiaUFnSUNCOVhHNWNiaUFnSUNCMGFHbHpMbk5sZENnblpHbHlaV04wYVc5dUp5d2dibVY0ZENrN1hHNGdJSDBzWEc0Z0lHVnVaRk52Y25ScGJtYzZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IwYUdsekxuTmxkQ2duWkdseVpXTjBhVzl1Snl3Z2JuVnNiQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFMXZaR1ZzTzF4dUlsMTkiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWN0aW9uczogICAgICAgICAgICByZXF1aXJlKCcuL2FjdGlvbnMnKSxcbiAgZGlzcGF0Y2hlcjogICAgICAgICByZXF1aXJlKCcuL2Rpc3BhdGNoZXInKSxcbiAgc3RvcmU6ICAgICAgICAgICAgICByZXF1aXJlKCcuL3N0b3JlJyksXG4gIGhlYWRpbmdfY29sbGVjdGlvbjogcmVxdWlyZSgnLi9oZWFkaW5nX2NvbGxlY3Rpb24nKSxcbiAgaGVhZGluZ19tb2RlbDogICAgICByZXF1aXJlKCcuL2hlYWRpbmdfbW9kZWwnKSxcbiAgdmlldzogICAgICAgICAgICAgICByZXF1aXJlKCcuL3ZpZXcuanN4Jylcbn07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZkMlZzYkY5bmNtbGtMMmx1WkdWNExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjN1JVRkRaaXhQUVVGUExHRkJRV0VzVDBGQlR5eERRVUZETEZkQlFWY3NRMEZCUXp0RlFVTjRReXhWUVVGVkxGVkJRVlVzVDBGQlR5eERRVUZETEdOQlFXTXNRMEZCUXp0RlFVTXpReXhMUVVGTExHVkJRV1VzVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXp0RlFVTjBReXhyUWtGQmEwSXNSVUZCUlN4UFFVRlBMRU5CUVVNc2MwSkJRWE5DTEVOQlFVTTdSVUZEYmtRc1lVRkJZU3hQUVVGUExFOUJRVThzUTBGQlF5eHBRa0ZCYVVJc1EwRkJRenRGUVVNNVF5eEpRVUZKTEdkQ1FVRm5RaXhQUVVGUExFTkJRVU1zV1VGQldTeERRVUZETzBOQlF6RkRMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SnRiMlIxYkdVdVpYaHdiM0owY3lBOUlIdGNiaUFnWVdOMGFXOXVjem9nSUNBZ0lDQWdJQ0FnSUNCeVpYRjFhWEpsS0NjdUwyRmpkR2x2Ym5NbktTeGNiaUFnWkdsemNHRjBZMmhsY2pvZ0lDQWdJQ0FnSUNCeVpYRjFhWEpsS0NjdUwyUnBjM0JoZEdOb1pYSW5LU3hjYmlBZ2MzUnZjbVU2SUNBZ0lDQWdJQ0FnSUNBZ0lDQnlaWEYxYVhKbEtDY3VMM04wYjNKbEp5a3NYRzRnSUdobFlXUnBibWRmWTI5c2JHVmpkR2x2YmpvZ2NtVnhkV2x5WlNnbkxpOW9aV0ZrYVc1blgyTnZiR3hsWTNScGIyNG5LU3hjYmlBZ2FHVmhaR2x1WjE5dGIyUmxiRG9nSUNBZ0lDQnlaWEYxYVhKbEtDY3VMMmhsWVdScGJtZGZiVzlrWld3bktTeGNiaUFnZG1sbGR6b2dJQ0FnSUNBZ0lDQWdJQ0FnSUNCeVpYRjFhWEpsS0NjdUwzWnBaWGN1YW5ONEp5bGNibjA3WEc0aVhYMD0iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gUXVpY2tMb29rIChpdGVtcykge1xuICB2YXIgcHJldjtcbiAgdmFyIGxhc3Q7XG5cbiAgaWYgKCEgQXJyYXkuaXNBcnJheShpdGVtcykpIHtcbiAgICBpdGVtcyA9IFtpdGVtc107XG4gIH1cblxuICBsYXN0ID0gaXRlbXNbaXRlbXMubGVuZ3RoIC0gMV07XG5cbiAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgIGlmIChwcmV2KSB7XG4gICAgICBwcmV2Lm5leHQgPSBpdGVtO1xuICAgIH1cblxuICAgIGl0ZW0ucHJldiA9IHByZXY7XG4gICAgcHJldiA9IGl0ZW07XG4gIH0pO1xuXG4gIGl0ZW1zWzBdLnByZXYgPSBsYXN0O1xuICBsYXN0Lm5leHQgICAgID0gaXRlbXNbMF07XG5cbiAgdGhpcy5jdXJyZW50ID0gaXRlbXNbMF07XG4gIHRoaXMuaXRlbXMgPSBpdGVtcztcbiAgdGhpcy5pbml0KCk7XG59XG5cblF1aWNrTG9vay5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgIGl0ZW0udGV4dCA9ICdRdWljayBMb29rICcgKyBpbmRleDtcbiAgICBpdGVtLmlkICAgPSAncWwtJyArIGluZGV4O1xuICB9KTtcbn07XG5cblF1aWNrTG9vay5wcm90b3R5cGUuZ2V0MyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGk7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5jdXJyZW50O1xuICB2YXIgaXRlbXMgPSBbXTtcblxuICBmb3IgKGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgaXRlbXMucHVzaChjdXJyZW50KTtcbiAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0O1xuICB9XG5cbiAgcmV0dXJuIGl0ZW1zO1xufTtcblxuUXVpY2tMb29rLnByb3RvdHlwZS5nb0JhY2sgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuY3VycmVudCA9IHRoaXMuY3VycmVudC5wcmV2O1xufTtcblxuUXVpY2tMb29rLnByb3RvdHlwZS5nb0ZvcndhcmQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuY3VycmVudCA9IHRoaXMuY3VycmVudC5uZXh0O1xufTtcblxuUXVpY2tMb29rLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmdldDMoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBRdWlja0xvb2s7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZkMlZzYkY5bmNtbGtMM0YxYVdOclgyeHZiMnN1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNXVUZCV1N4RFFVRkRPenRCUVVWaUxGTkJRVk1zVTBGQlV5eEZRVUZGTEV0QlFVc3NSVUZCUlR0RlFVTjZRaXhKUVVGSkxFbEJRVWtzUTBGQlF6dEJRVU5ZTEVWQlFVVXNTVUZCU1N4SlFVRkpMRU5CUVVNN08wVkJSVlFzU1VGQlNTeEZRVUZGTEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExFVkJRVVU3U1VGRE1VSXNTMEZCU3l4SFFVRkhMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03UVVGRGNFSXNSMEZCUnpzN1FVRkZTQ3hGUVVGRkxFbEJRVWtzUjBGQlJ5eExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF6czdSVUZGTDBJc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eFZRVUZWTEVsQlFVa3NSVUZCUlR0SlFVTTFRaXhKUVVGSkxFbEJRVWtzUlVGQlJUdE5RVU5TTEVsQlFVa3NRMEZCUXl4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRE8wRkJRM1pDTEV0QlFVczdPMGxCUlVRc1NVRkJTU3hEUVVGRExFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTTdTVUZEYWtJc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF6dEJRVU5vUWl4SFFVRkhMRU5CUVVNc1EwRkJRenM3UlVGRlNDeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF6dEJRVU4yUWl4RlFVRkZMRWxCUVVrc1EwRkJReXhKUVVGSkxFOUJRVThzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPenRGUVVWNlFpeEpRVUZKTEVOQlFVTXNUMEZCVHl4SFFVRkhMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEZRVU40UWl4SlFVRkpMRU5CUVVNc1MwRkJTeXhIUVVGSExFdEJRVXNzUTBGQlF6dEZRVU51UWl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxFTkJRVU03UVVGRFpDeERRVUZET3p0QlFVVkVMRk5CUVZNc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeEhRVUZITEZsQlFWazdSVUZEY2tNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNWVUZCVlN4SlFVRkpMRVZCUVVVc1MwRkJTeXhGUVVGRk8wbEJRM2hETEVsQlFVa3NRMEZCUXl4SlFVRkpMRWRCUVVjc1lVRkJZU3hIUVVGSExFdEJRVXNzUTBGQlF6dEpRVU5zUXl4SlFVRkpMRU5CUVVNc1JVRkJSU3hMUVVGTExFdEJRVXNzUjBGQlJ5eExRVUZMTEVOQlFVTTdSMEZETTBJc1EwRkJReXhEUVVGRE8wRkJRMHdzUTBGQlF5eERRVUZET3p0QlFVVkdMRk5CUVZNc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeEhRVUZITEZsQlFWazdSVUZEY2tNc1NVRkJTU3hEUVVGRExFTkJRVU03UlVGRFRpeEpRVUZKTEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRE8wRkJRemRDTEVWQlFVVXNTVUZCU1N4TFFVRkxMRWRCUVVjc1JVRkJSU3hEUVVGRE96dEZRVVZtTEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMGxCUTNSQ0xFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1NVRkRjRUlzVDBGQlR5eEhRVUZITEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNN1FVRkRNMElzUjBGQlJ6czdSVUZGUkN4UFFVRlBMRXRCUVVzc1EwRkJRenRCUVVObUxFTkJRVU1zUTBGQlF6czdRVUZGUml4VFFVRlRMRU5CUVVNc1UwRkJVeXhEUVVGRExFMUJRVTBzUjBGQlJ5eFpRVUZaTzBWQlEzWkRMRWxCUVVrc1EwRkJReXhQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNN1FVRkRia01zUTBGQlF5eERRVUZET3p0QlFVVkdMRk5CUVZNc1EwRkJReXhUUVVGVExFTkJRVU1zVTBGQlV5eEhRVUZITEZsQlFWazdSVUZETVVNc1NVRkJTU3hEUVVGRExFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJRenRCUVVOdVF5eERRVUZETEVOQlFVTTdPMEZCUlVZc1UwRkJVeXhEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTEVkQlFVY3NXVUZCV1R0RlFVTjJReXhQUVVGUExFbEJRVWtzUTBGQlF5eEpRVUZKTEVWQlFVVXNRMEZCUXp0QlFVTnlRaXhEUVVGRE96dEJRVVZFTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1UwRkJVeXhEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lYQ0oxYzJVZ2MzUnlhV04wWENJN1hHNWNibVoxYm1OMGFXOXVJRkYxYVdOclRHOXZheUFvYVhSbGJYTXBJSHRjYmlBZ2RtRnlJSEJ5WlhZN1hHNGdJSFpoY2lCc1lYTjBPMXh1WEc0Z0lHbG1JQ2doSUVGeWNtRjVMbWx6UVhKeVlYa29hWFJsYlhNcEtTQjdYRzRnSUNBZ2FYUmxiWE1nUFNCYmFYUmxiWE5kTzF4dUlDQjlYRzVjYmlBZ2JHRnpkQ0E5SUdsMFpXMXpXMmwwWlcxekxteGxibWQwYUNBdElERmRPMXh1WEc0Z0lHbDBaVzF6TG1admNrVmhZMmdvWm5WdVkzUnBiMjRnS0dsMFpXMHBJSHRjYmlBZ0lDQnBaaUFvY0hKbGRpa2dlMXh1SUNBZ0lDQWdjSEpsZGk1dVpYaDBJRDBnYVhSbGJUdGNiaUFnSUNCOVhHNWNiaUFnSUNCcGRHVnRMbkJ5WlhZZ1BTQndjbVYyTzF4dUlDQWdJSEJ5WlhZZ1BTQnBkR1Z0TzF4dUlDQjlLVHRjYmx4dUlDQnBkR1Z0YzFzd1hTNXdjbVYySUQwZ2JHRnpkRHRjYmlBZ2JHRnpkQzV1WlhoMElDQWdJQ0E5SUdsMFpXMXpXekJkTzF4dVhHNGdJSFJvYVhNdVkzVnljbVZ1ZENBOUlHbDBaVzF6V3pCZE8xeHVJQ0IwYUdsekxtbDBaVzF6SUQwZ2FYUmxiWE03WEc0Z0lIUm9hWE11YVc1cGRDZ3BPMXh1ZlZ4dVhHNVJkV2xqYTB4dmIyc3VjSEp2ZEc5MGVYQmxMbWx1YVhRZ1BTQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lIUm9hWE11YVhSbGJYTXVabTl5UldGamFDaG1kVzVqZEdsdmJpQW9hWFJsYlN3Z2FXNWtaWGdwSUh0Y2JpQWdJQ0JwZEdWdExuUmxlSFFnUFNBblVYVnBZMnNnVEc5dmF5QW5JQ3NnYVc1a1pYZzdYRzRnSUNBZ2FYUmxiUzVwWkNBZ0lEMGdKM0ZzTFNjZ0t5QnBibVJsZUR0Y2JpQWdmU2s3WEc1OU8xeHVYRzVSZFdsamEweHZiMnN1Y0hKdmRHOTBlWEJsTG1kbGRETWdQU0JtZFc1amRHbHZiaUFvS1NCN1hHNGdJSFpoY2lCcE8xeHVJQ0IyWVhJZ1kzVnljbVZ1ZENBOUlIUm9hWE11WTNWeWNtVnVkRHRjYmlBZ2RtRnlJR2wwWlcxeklEMGdXMTA3WEc1Y2JpQWdabTl5SUNocElEMGdNRHNnYVNBOElETTdJR2tyS3lrZ2UxeHVJQ0FnSUdsMFpXMXpMbkIxYzJnb1kzVnljbVZ1ZENrN1hHNGdJQ0FnWTNWeWNtVnVkQ0E5SUdOMWNuSmxiblF1Ym1WNGREdGNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQnBkR1Z0Y3p0Y2JuMDdYRzVjYmxGMWFXTnJURzl2YXk1d2NtOTBiM1I1Y0dVdVoyOUNZV05ySUQwZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNCMGFHbHpMbU4xY25KbGJuUWdQU0IwYUdsekxtTjFjbkpsYm5RdWNISmxkanRjYm4wN1hHNWNibEYxYVdOclRHOXZheTV3Y205MGIzUjVjR1V1WjI5R2IzSjNZWEprSUQwZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNCMGFHbHpMbU4xY25KbGJuUWdQU0IwYUdsekxtTjFjbkpsYm5RdWJtVjRkRHRjYm4wN1hHNWNibEYxYVdOclRHOXZheTV3Y205MGIzUjVjR1V1ZEc5S1UwOU9JRDBnWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0J5WlhSMWNtNGdkR2hwY3k1blpYUXpLQ2s3WEc1OVhHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdVWFZwWTJ0TWIyOXJPMXh1SWwxOSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3RvcmU7XG52YXIgQmFja2JvbmUgICAgICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgVGFibGVIZWFkaW5ncyA9IHJlcXVpcmUoJy4vaGVhZGluZ19jb2xsZWN0aW9uJyk7XG52YXIgdGFibGVfYWN0aW9ucyA9IHJlcXVpcmUoJy4vYWN0aW9ucycpO1xudmFyIGRpc3BhdGNoZXIgICAgPSByZXF1aXJlKCcuL2Rpc3BhdGNoZXInKTtcbnZhciBRdWlja0xvb2sgICAgID0gcmVxdWlyZSgnLi9xdWlja19sb29rJyk7XG52YXIgd2VsbF9oZWFkaW5ncyA9IG5ldyBUYWJsZUhlYWRpbmdzKCk7XG52YXIgd2VsbHMgICAgICAgICA9IG5ldyBCYWNrYm9uZS5Db2xsZWN0aW9uKCk7XG5cbndlbGxfaGVhZGluZ3MucmVnaXN0ZXJXaXRoRGlzcGF0Y2hlcihkaXNwYXRjaGVyKTtcblxuc3RvcmUgPSBuZXcgQmFja2JvbmUuTW9kZWwoe1xuICB3ZWxsczogICAgd2VsbHMsXG4gIGZpcnN0OiAgICBudWxsLFxuICBoZWFkaW5nczogd2VsbF9oZWFkaW5ncyxcbiAgc2VsZWN0ZWQ6IG51bGwsXG4gIHNvcnRlZTogICBudWxsLFxuICBxdWljazogICAgbmV3IFF1aWNrTG9vayhbe3dpZHRoOiAxfSwge3dpZHRoOiAxfSwge3dpZHRoOiAxfSwge3dpZHRoOiAxfSwge3dpZHRoOiAxfSwge3dpZHRoOiAxfV0pXG59KTtcblxuc3RvcmUuZ2V0KCdoZWFkaW5ncycpLnBhcmVudCA9IHN0b3JlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JlO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12ZDJWc2JGOW5jbWxrTDNOMGIzSmxMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxGbEJRVmtzUTBGQlF6czdRVUZGWWl4SlFVRkpMRXRCUVVzc1EwRkJRenRCUVVOV0xFbEJRVWtzVVVGQlVTeFJRVUZSTEU5QlFVOHNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJRenRCUVVONFF5eEpRVUZKTEdGQlFXRXNSMEZCUnl4UFFVRlBMRU5CUVVNc2MwSkJRWE5DTEVOQlFVTXNRMEZCUXp0QlFVTndSQ3hKUVVGSkxHRkJRV0VzUjBGQlJ5eFBRVUZQTEVOQlFVTXNWMEZCVnl4RFFVRkRMRU5CUVVNN1FVRkRla01zU1VGQlNTeFZRVUZWTEUxQlFVMHNUMEZCVHl4RFFVRkRMR05CUVdNc1EwRkJReXhEUVVGRE8wRkJRelZETEVsQlFVa3NVMEZCVXl4UFFVRlBMRTlCUVU4c1EwRkJReXhqUVVGakxFTkJRVU1zUTBGQlF6dEJRVU0xUXl4SlFVRkpMR0ZCUVdFc1IwRkJSeXhKUVVGSkxHRkJRV0VzUlVGQlJTeERRVUZETzBGQlEzaERMRWxCUVVrc1MwRkJTeXhYUVVGWExFbEJRVWtzVVVGQlVTeERRVUZETEZWQlFWVXNSVUZCUlN4RFFVRkRPenRCUVVVNVF5eGhRVUZoTEVOQlFVTXNjMEpCUVhOQ0xFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTTdPMEZCUldwRUxFdEJRVXNzUjBGQlJ5eEpRVUZKTEZGQlFWRXNRMEZCUXl4TFFVRkxMRU5CUVVNN1JVRkRla0lzUzBGQlN5eExRVUZMTEV0QlFVczdSVUZEWml4TFFVRkxMRXRCUVVzc1NVRkJTVHRGUVVOa0xGRkJRVkVzUlVGQlJTeGhRVUZoTzBWQlEzWkNMRkZCUVZFc1JVRkJSU3hKUVVGSk8wVkJRMlFzVFVGQlRTeEpRVUZKTEVsQlFVazdSVUZEWkN4TFFVRkxMRXRCUVVzc1NVRkJTU3hUUVVGVExFTkJRVU1zUTBGQlF5eERRVUZETEV0QlFVc3NSVUZCUlN4RFFVRkRMRU5CUVVNc1JVRkJSU3hEUVVGRExFdEJRVXNzUlVGQlJTeERRVUZETEVOQlFVTXNSVUZCUlN4RFFVRkRMRXRCUVVzc1JVRkJSU3hEUVVGRExFTkJRVU1zUlVGQlJTeERRVUZETEV0QlFVc3NSVUZCUlN4RFFVRkRMRU5CUVVNc1JVRkJSU3hEUVVGRExFdEJRVXNzUlVGQlJTeERRVUZETEVOQlFVTXNSVUZCUlN4RFFVRkRMRXRCUVVzc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEyNUhMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZJTEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJWU3hEUVVGRExFTkJRVU1zVFVGQlRTeEhRVUZITEV0QlFVc3NRMEZCUXpzN1FVRkZja01zVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4TFFVRkxMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmNJblZ6WlNCemRISnBZM1JjSWp0Y2JseHVkbUZ5SUhOMGIzSmxPMXh1ZG1GeUlFSmhZMnRpYjI1bElDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkaVlXTnJZbTl1WlNjcE8xeHVkbUZ5SUZSaFlteGxTR1ZoWkdsdVozTWdQU0J5WlhGMWFYSmxLQ2N1TDJobFlXUnBibWRmWTI5c2JHVmpkR2x2YmljcE8xeHVkbUZ5SUhSaFlteGxYMkZqZEdsdmJuTWdQU0J5WlhGMWFYSmxLQ2N1TDJGamRHbHZibk1uS1R0Y2JuWmhjaUJrYVhOd1lYUmphR1Z5SUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTlrYVhOd1lYUmphR1Z5SnlrN1hHNTJZWElnVVhWcFkydE1iMjlySUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR2Y1hWcFkydGZiRzl2YXljcE8xeHVkbUZ5SUhkbGJHeGZhR1ZoWkdsdVozTWdQU0J1WlhjZ1ZHRmliR1ZJWldGa2FXNW5jeWdwTzF4dWRtRnlJSGRsYkd4eklDQWdJQ0FnSUNBZ1BTQnVaWGNnUW1GamEySnZibVV1UTI5c2JHVmpkR2x2YmlncE8xeHVYRzUzWld4c1gyaGxZV1JwYm1kekxuSmxaMmx6ZEdWeVYybDBhRVJwYzNCaGRHTm9aWElvWkdsemNHRjBZMmhsY2lrN1hHNWNibk4wYjNKbElEMGdibVYzSUVKaFkydGliMjVsTGsxdlpHVnNLSHRjYmlBZ2QyVnNiSE02SUNBZ0lIZGxiR3h6TEZ4dUlDQm1hWEp6ZERvZ0lDQWdiblZzYkN4Y2JpQWdhR1ZoWkdsdVozTTZJSGRsYkd4ZmFHVmhaR2x1WjNNc1hHNGdJSE5sYkdWamRHVmtPaUJ1ZFd4c0xGeHVJQ0J6YjNKMFpXVTZJQ0FnYm5Wc2JDeGNiaUFnY1hWcFkyczZJQ0FnSUc1bGR5QlJkV2xqYTB4dmIyc29XM3QzYVdSMGFEb2dNWDBzSUh0M2FXUjBhRG9nTVgwc0lIdDNhV1IwYURvZ01YMHNJSHQzYVdSMGFEb2dNWDBzSUh0M2FXUjBhRG9nTVgwc0lIdDNhV1IwYURvZ01YMWRLVnh1ZlNrN1hHNWNibk4wYjNKbExtZGxkQ2duYUdWaFpHbHVaM01uS1M1d1lYSmxiblFnUFNCemRHOXlaVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCemRHOXlaVHRjYmlKZGZRPT0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFRoV3JhcHBlcjtcbnZhciBUaCAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL3RoLmpzeCcpO1xudmFyIFJlYWN0ICAgICAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgQmFja2JvbmUgICAgICAgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcblxuVGhXcmFwcGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRoV3JhcHBlclwiLFxuICBwcm9wVHlwZXM6IHtcbiAgICBzdG9yZTogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoQmFja2JvbmUuTW9kZWwpLmlzUmVxdWlyZWRcbiAgfSxcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuc3RvcmUudG9KU09OKCk7XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wcm9wcy5zdG9yZS5vbignY2hhbmdlJywgZnVuY3Rpb24gKHN0b3JlKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHN0b3JlLnRvSlNPTigpKTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICBzdG9yZS5vZmYoJ2NoYW5nZScsIG51bGwsIHRoaXMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbmV3X3Byb3BzO1xuICAgIHZhciBkYXRhICAgICAgPSB0aGlzLnN0YXRlO1xuXG4gICAgbmV3X3Byb3BzID0ge1xuICAgICAgdHJpZ2dlclNvcnQ6ICAgIGRhdGEuc29ydGFibGUgJiYgZGF0YS5uYW1lID8gZGF0YS5uYW1lIDogbnVsbCxcbiAgICAgIHNvcnREaXJlY3Rpb246ICBkYXRhLmRpcmVjdGlvbixcbiAgICAgIG1pbmltYWw6ICAgICAgICBkYXRhLm1pbmltYWwsXG4gICAgICBsb2NrZWQ6ICAgICAgICAgZGF0YS5sb2NrZWQsXG4gICAgICByZXNpemFibGU6ICAgICAgZGF0YS5yZXNpemFibGUsXG4gICAgICB3aWR0aDogICAgICAgICAgZGF0YS53aWR0aFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUaCwgUmVhY3QuX19zcHJlYWQoe30sICB0aGlzLnByb3BzLCAgbmV3X3Byb3BzKSwgXG4gICAgICAgIGRhdGEudGl0bGVcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaFdyYXBwZXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZkMlZzYkY5bmNtbGtMM1JvWDNkeVlYQndaWEl1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPenRCUVVWQkxFZEJRVWM3TzBGQlJVZ3NTVUZCU1N4VFFVRlRMRU5CUVVNN1FVRkRaQ3hKUVVGSkxFVkJRVVVzWjBKQlFXZENMRTlCUVU4c1EwRkJReXg1UWtGQmVVSXNRMEZCUXl4RFFVRkRPMEZCUTNwRUxFbEJRVWtzUzBGQlN5eGhRVUZoTEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVOMlF5eEpRVUZKTEZGQlFWRXNWVUZCVlN4UFFVRlBMRU5CUVVNc1ZVRkJWU3hEUVVGRExFTkJRVU03TzBGQlJURkRMQ3RDUVVFclFpeDVRa0ZCUVR0RlFVTTNRaXhUUVVGVExFVkJRVVU3U1VGRFZDeExRVUZMTEVWQlFVVXNTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhWUVVGVkxFTkJRVU1zVVVGQlVTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRlZCUVZVN1IwRkROMFE3UlVGRFJDeGxRVUZsTEVWQlFVVXNXVUZCV1R0SlFVTXpRaXhQUVVGUExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRE8wZEJRMnhETzBWQlEwUXNhVUpCUVdsQ0xFVkJRVVVzV1VGQldUdEpRVU0zUWl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eEZRVUZGTEVOQlFVTXNVVUZCVVN4RlFVRkZMRlZCUVZVc1MwRkJTeXhGUVVGRk8wMUJRemRETEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUlVGQlJTeERRVUZETEVOQlFVTTdTMEZETDBJc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dEhRVU5XTzBWQlEwUXNiMEpCUVc5Q0xFVkJRVVVzV1VGQldUdEpRVU5vUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExGRkJRVkVzUlVGQlJTeEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN1IwRkRha003UlVGRFJDeE5RVUZOTEVWQlFVVXNXVUZCV1R0SlFVTnNRaXhKUVVGSkxGTkJRVk1zUTBGQlF6dEJRVU5zUWl4SlFVRkpMRWxCUVVrc1NVRkJTU3hSUVVGUkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTTdPMGxCUlROQ0xGTkJRVk1zUjBGQlJ6dE5RVU5XTEZkQlFWY3NTMEZCU3l4SlFVRkpMRU5CUVVNc1VVRkJVU3hKUVVGSkxFbEJRVWtzUTBGQlF5eEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRMRWxCUVVrc1IwRkJSeXhKUVVGSk8wMUJRemRFTEdGQlFXRXNSMEZCUnl4SlFVRkpMRU5CUVVNc1UwRkJVenROUVVNNVFpeFBRVUZQTEZOQlFWTXNTVUZCU1N4RFFVRkRMRTlCUVU4N1RVRkROVUlzVFVGQlRTeFZRVUZWTEVsQlFVa3NRMEZCUXl4TlFVRk5PMDFCUXpOQ0xGTkJRVk1zVDBGQlR5eEpRVUZKTEVOQlFVTXNVMEZCVXp0TlFVTTVRaXhMUVVGTExGZEJRVmNzU1VGQlNTeERRVUZETEV0QlFVczdRVUZEYUVNc1MwRkJTeXhEUVVGRE96dEpRVVZHTzAxQlEwVXNiMEpCUVVNc1JVRkJSU3hGUVVGQkxHZENRVUZCTEVkQlFVRXNRMEZCUlN4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFVkJRVU1zUTBGQlJTeEhRVUZITEZOQlFWY3NRMEZCUVN4RlFVRkJPMUZCUTJoRExFbEJRVWtzUTBGQlF5eExRVUZOTzAxQlExUXNRMEZCUVR0TlFVTk1PMGRCUTBnN1FVRkRTQ3hEUVVGRExFTkJRVU1zUTBGQlF6czdRVUZGU0N4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExGTkJRVk1zUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dRR3B6ZUNCU1pXRmpkQzVFVDAxY2JpQXFMMXh1WEc1MllYSWdWR2hYY21Gd2NHVnlPMXh1ZG1GeUlGUm9JQ0FnSUNBZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHVMeTR1TDJOdmJYQnZibVZ1ZEhNdmRHZ3Vhbk40SnlrN1hHNTJZWElnVW1WaFkzUWdJQ0FnSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duY21WaFkzUW5LVHRjYm5aaGNpQkNZV05yWW05dVpTQWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDZGlZV05yWW05dVpTY3BPMXh1WEc1VWFGZHlZWEJ3WlhJZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUhCeWIzQlVlWEJsY3pvZ2UxeHVJQ0FnSUhOMGIzSmxPaUJTWldGamRDNVFjbTl3Vkhsd1pYTXVhVzV6ZEdGdVkyVlBaaWhDWVdOclltOXVaUzVOYjJSbGJDa3VhWE5TWlhGMWFYSmxaRnh1SUNCOUxGeHVJQ0JuWlhSSmJtbDBhV0ZzVTNSaGRHVTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1d2NtOXdjeTV6ZEc5eVpTNTBiMHBUVDA0b0tUdGNiaUFnZlN4Y2JpQWdZMjl0Y0c5dVpXNTBSR2xrVFc5MWJuUTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IwYUdsekxuQnliM0J6TG5OMGIzSmxMbTl1S0NkamFHRnVaMlVuTENCbWRXNWpkR2x2YmlBb2MzUnZjbVVwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVjMlYwVTNSaGRHVW9jM1J2Y21VdWRHOUtVMDlPS0NrcE8xeHVJQ0FnSUgwc0lIUm9hWE1wTzF4dUlDQjlMRnh1SUNCamIyMXdiMjVsYm5SWGFXeHNWVzV0YjNWdWREb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSE4wYjNKbExtOW1aaWduWTJoaGJtZGxKeXdnYm5Wc2JDd2dkR2hwY3lrN1hHNGdJSDBzWEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJ1WlhkZmNISnZjSE03WEc0Z0lDQWdkbUZ5SUdSaGRHRWdJQ0FnSUNBOUlIUm9hWE11YzNSaGRHVTdYRzVjYmlBZ0lDQnVaWGRmY0hKdmNITWdQU0I3WEc0Z0lDQWdJQ0IwY21sbloyVnlVMjl5ZERvZ0lDQWdaR0YwWVM1emIzSjBZV0pzWlNBbUppQmtZWFJoTG01aGJXVWdQeUJrWVhSaExtNWhiV1VnT2lCdWRXeHNMRnh1SUNBZ0lDQWdjMjl5ZEVScGNtVmpkR2x2YmpvZ0lHUmhkR0V1WkdseVpXTjBhVzl1TEZ4dUlDQWdJQ0FnYldsdWFXMWhiRG9nSUNBZ0lDQWdJR1JoZEdFdWJXbHVhVzFoYkN4Y2JpQWdJQ0FnSUd4dlkydGxaRG9nSUNBZ0lDQWdJQ0JrWVhSaExteHZZMnRsWkN4Y2JpQWdJQ0FnSUhKbGMybDZZV0pzWlRvZ0lDQWdJQ0JrWVhSaExuSmxjMmw2WVdKc1pTeGNiaUFnSUNBZ0lIZHBaSFJvT2lBZ0lDQWdJQ0FnSUNCa1lYUmhMbmRwWkhSb1hHNGdJQ0FnZlR0Y2JseHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4VkdnZ2V5NHVMblJvYVhNdWNISnZjSE45SUhzdUxpNXVaWGRmY0hKdmNITjlQbHh1SUNBZ0lDQWdJQ0I3WkdGMFlTNTBhWFJzWlgxY2JpQWdJQ0FnSUR3dlZHZytYRzRnSUNBZ0tUdGNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVkdoWGNtRndjR1Z5TzF4dUlsMTkiLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFRoZWFkO1xudmFyIFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgQmFja2JvbmUgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBUciAgICAgICAgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL3RyLmpzeCcpO1xudmFyIFRoICAgICAgICA9IHJlcXVpcmUoJy4vdGhfd3JhcHBlci5qc3gnKTtcblxuVGhlYWQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGhlYWRcIixcbiAgcHJvcFR5cGVzOiB7XG4gICAgc3RvcmU6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEJhY2tib25lLk1vZGVsKS5pc1JlcXVpcmVkXG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb2xzID0gdGhpcy5fYnVpbGRDb2x1bW5zKCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoZWFkXCIsIHtjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lfSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHIsIG51bGwsIFxuICAgICAgICAgIGNvbHNcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIF9idWlsZENvbHVtbnM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGF0YTtcbiAgICB2YXIgY29sdW1ucyA9IFtdO1xuICAgIHZhciBzdG9yZSA9IHRoaXMucHJvcHMuc3RvcmU7XG4gICAgdmFyIGN1cnJlbnQgPSBzdG9yZS5nZXQoJ2ZpcnN0Jyk7XG5cbiAgICB3aGlsZSAoY3VycmVudCkge1xuICAgICAgZGF0YSAgICAgICAgICAgICAgPSB7fTtcbiAgICAgIGRhdGEuaGFuZGxlQ2xpY2sgID0gY3VycmVudC5nZXQoJ3NvcnRhYmxlJykgPyB0aGlzLl9zb3J0SGFuZGxlci5iaW5kKHRoaXMsIGN1cnJlbnQpIDogbnVsbDtcbiAgICAgIGRhdGEuc3RvcmUgICAgICAgID0gY3VycmVudDtcbiAgICAgIGRhdGEuY2xhc3NOYW1lICAgID0gY3VycmVudC5nZXQoJ3R5cGUnKSA9PT0gJ2FjdGlvbnMnID8gJ2FjdGlvbnMtY29sJyA6ICcnO1xuXG4gICAgICBjb2x1bW5zLnB1c2goUmVhY3QuY3JlYXRlRWxlbWVudChUaCwgUmVhY3QuX19zcHJlYWQoe30sICBkYXRhLCB7a2V5OiBjdXJyZW50LmNpZH0pKSk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0O1xuICAgIH1cblxuICAgIHJldHVybiBjb2x1bW5zO1xuICB9LFxuICBfc29ydEhhbmRsZXI6IGZ1bmN0aW9uIChzb3J0ZWUpIHtcbiAgICB2YXIgc3RvcmUgICA9IHRoaXMucHJvcHMuc3RvcmU7XG4gICAgdmFyIGN1cnJlbnQgPSBzdG9yZS5nZXQoJ3NvcnRlZScpO1xuXG4gICAgaWYgKGN1cnJlbnQuY2lkICE9PSBzb3J0ZWUuY2lkKSB7XG4gICAgICBjdXJyZW50LmVuZFNvcnRpbmcoKTtcbiAgICB9XG5cbiAgICBzdG9yZS5zZXQoJ3NvcnRlZScsIHNvcnRlZSk7XG4gICAgc29ydGVlLnRvZ2dsZVNvcnREaXJlY3Rpb24oKTtcblxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaGVhZDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdmQyVnNiRjluY21sa0wzUm9aV0ZrWDNkeVlYQndaWEl1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPenRCUVVWQkxFZEJRVWM3TzBGQlJVZ3NTVUZCU1N4TFFVRkxMRU5CUVVNN1FVRkRWaXhKUVVGSkxFdEJRVXNzVDBGQlR5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1FVRkRha01zU1VGQlNTeFJRVUZSTEVsQlFVa3NUMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRE8wRkJRM0JETEVsQlFVa3NSVUZCUlN4VlFVRlZMRTlCUVU4c1EwRkJReXg1UWtGQmVVSXNRMEZCUXl4RFFVRkRPMEZCUTI1RUxFbEJRVWtzUlVGQlJTeFZRVUZWTEU5QlFVOHNRMEZCUXl4clFrRkJhMElzUTBGQlF5eERRVUZET3p0QlFVVTFReXd5UWtGQk1rSXNjVUpCUVVFN1JVRkRla0lzVTBGQlV5eEZRVUZGTzBsQlExUXNTMEZCU3l4RlFVRkZMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zVlVGQlZTeERRVUZETEZGQlFWRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhWUVVGVk8wZEJRemRFTzBWQlEwUXNUVUZCVFN4RlFVRkZMRmxCUVZrN1FVRkRkRUlzU1VGQlNTeEpRVUZKTEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1lVRkJZU3hGUVVGRkxFTkJRVU03TzBsQlJXaERPMDFCUTBVc2IwSkJRVUVzVDBGQlRTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWY3NRMEZCUVN4RlFVRkJPMUZCUTNSRExHOUNRVUZETEVWQlFVVXNSVUZCUVN4SlFVRkRMRVZCUVVFN1ZVRkRSQ3hKUVVGTE8xRkJRMGdzUTBGQlFUdE5RVU5ETEVOQlFVRTdUVUZEVWp0SFFVTklPMFZCUTBRc1lVRkJZU3hGUVVGRkxGbEJRVms3U1VGRGVrSXNTVUZCU1N4SlFVRkpMRU5CUVVNN1NVRkRWQ3hKUVVGSkxFOUJRVThzUjBGQlJ5eEZRVUZGTEVOQlFVTTdTVUZEYWtJc1NVRkJTU3hMUVVGTExFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNN1FVRkRha01zU1VGQlNTeEpRVUZKTEU5QlFVOHNSMEZCUnl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZET3p0SlFVVnFReXhQUVVGUExFOUJRVThzUlVGQlJUdE5RVU5rTEVsQlFVa3NaMEpCUVdkQ0xFVkJRVVVzUTBGQlF6dE5RVU4yUWl4SlFVRkpMRU5CUVVNc1YwRkJWeXhKUVVGSkxFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCVlN4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRTlCUVU4c1EwRkJReXhIUVVGSExFbEJRVWtzUTBGQlF6dE5RVU16Uml4SlFVRkpMRU5CUVVNc1MwRkJTeXhWUVVGVkxFOUJRVThzUTBGQlF6dEJRVU5zUXl4TlFVRk5MRWxCUVVrc1EwRkJReXhUUVVGVExFMUJRVTBzVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhUUVVGVExFZEJRVWNzWVVGQllTeEhRVUZITEVWQlFVVXNRMEZCUXpzN1RVRkZNMFVzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4dlFrRkJReXhGUVVGRkxFVkJRVUVzWjBKQlFVRXNSMEZCUVN4RFFVRkZMRWRCUVVjc1NVRkJTU3hGUVVGRExFTkJRVU1zUTBGQlFTeEhRVUZCTEVWQlFVY3NRMEZCUlN4UFFVRlBMRU5CUVVNc1IwRkJTU3hEUVVGQkxFTkJRVUVzUTBGQlJ5eERRVUZCTEVOQlFVTXNRMEZCUXp0TlFVTnFSQ3hQUVVGUExFZEJRVWNzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXp0QlFVTTNRaXhMUVVGTE96dEpRVVZFTEU5QlFVOHNUMEZCVHl4RFFVRkRPMGRCUTJoQ08wVkJRMFFzV1VGQldTeEZRVUZGTEZWQlFWVXNUVUZCVFN4RlFVRkZPMGxCUXpsQ0xFbEJRVWtzUzBGQlN5eExRVUZMTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRE8wRkJRMjVETEVsQlFVa3NTVUZCU1N4UFFVRlBMRWRCUVVjc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXpzN1NVRkZiRU1zU1VGQlNTeFBRVUZQTEVOQlFVTXNSMEZCUnl4TFFVRkxMRTFCUVUwc1EwRkJReXhIUVVGSExFVkJRVVU3VFVGRE9VSXNUMEZCVHl4RFFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRE8wRkJRek5DTEV0QlFVczdPMGxCUlVRc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eFJRVUZSTEVWQlFVVXNUVUZCVFN4RFFVRkRMRU5CUVVNN1FVRkRhRU1zU1VGQlNTeE5RVUZOTEVOQlFVTXNiVUpCUVcxQ0xFVkJRVVVzUTBGQlF6czdSMEZGT1VJN1FVRkRTQ3hEUVVGRExFTkJRVU1zUTBGQlF6czdRVUZGU0N4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExFdEJRVXNzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dRR3B6ZUNCU1pXRmpkQzVFVDAxY2JpQXFMMXh1WEc1MllYSWdWR2hsWVdRN1hHNTJZWElnVW1WaFkzUWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbmNtVmhZM1FuS1R0Y2JuWmhjaUJDWVdOclltOXVaU0FnUFNCeVpYRjFhWEpsS0NkaVlXTnJZbTl1WlNjcE8xeHVkbUZ5SUZSeUlDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHVMeTR1TDJOdmJYQnZibVZ1ZEhNdmRISXVhbk40SnlrN1hHNTJZWElnVkdnZ0lDQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpOTBhRjkzY21Gd2NHVnlMbXB6ZUNjcE8xeHVYRzVVYUdWaFpDQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ2NISnZjRlI1Y0dWek9pQjdYRzRnSUNBZ2MzUnZjbVU2SUZKbFlXTjBMbEJ5YjNCVWVYQmxjeTVwYm5OMFlXNWpaVTltS0VKaFkydGliMjVsTGsxdlpHVnNLUzVwYzFKbGNYVnBjbVZrWEc0Z0lIMHNYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQmpiMnh6SUQwZ2RHaHBjeTVmWW5WcGJHUkRiMngxYlc1ektDazdYRzVjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BIUm9aV0ZrSUdOc1lYTnpUbUZ0WlQxN2RHaHBjeTV3Y205d2N5NWpiR0Z6YzA1aGJXVjlQbHh1SUNBZ0lDQWdJQ0E4VkhJK1hHNGdJQ0FnSUNBZ0lDQWdlMk52YkhOOVhHNGdJQ0FnSUNBZ0lEd3ZWSEkrWEc0Z0lDQWdJQ0E4TDNSb1pXRmtQbHh1SUNBZ0lDazdYRzRnSUgwc1hHNGdJRjlpZFdsc1pFTnZiSFZ0Ym5NNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnWkdGMFlUdGNiaUFnSUNCMllYSWdZMjlzZFcxdWN5QTlJRnRkTzF4dUlDQWdJSFpoY2lCemRHOXlaU0E5SUhSb2FYTXVjSEp2Y0hNdWMzUnZjbVU3WEc0Z0lDQWdkbUZ5SUdOMWNuSmxiblFnUFNCemRHOXlaUzVuWlhRb0oyWnBjbk4wSnlrN1hHNWNiaUFnSUNCM2FHbHNaU0FvWTNWeWNtVnVkQ2tnZTF4dUlDQWdJQ0FnWkdGMFlTQWdJQ0FnSUNBZ0lDQWdJQ0FnUFNCN2ZUdGNiaUFnSUNBZ0lHUmhkR0V1YUdGdVpHeGxRMnhwWTJzZ0lEMGdZM1Z5Y21WdWRDNW5aWFFvSjNOdmNuUmhZbXhsSnlrZ1B5QjBhR2x6TGw5emIzSjBTR0Z1Wkd4bGNpNWlhVzVrS0hSb2FYTXNJR04xY25KbGJuUXBJRG9nYm5Wc2JEdGNiaUFnSUNBZ0lHUmhkR0V1YzNSdmNtVWdJQ0FnSUNBZ0lEMGdZM1Z5Y21WdWREdGNiaUFnSUNBZ0lHUmhkR0V1WTJ4aGMzTk9ZVzFsSUNBZ0lEMGdZM1Z5Y21WdWRDNW5aWFFvSjNSNWNHVW5LU0E5UFQwZ0oyRmpkR2x2Ym5NbklEOGdKMkZqZEdsdmJuTXRZMjlzSnlBNklDY25PMXh1WEc0Z0lDQWdJQ0JqYjJ4MWJXNXpMbkIxYzJnb1BGUm9JSHN1TGk1a1lYUmhmU0JyWlhrOWUyTjFjbkpsYm5RdVkybGtmU0F2UGlrN1hHNGdJQ0FnSUNCamRYSnlaVzUwSUQwZ1kzVnljbVZ1ZEM1dVpYaDBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lISmxkSFZ5YmlCamIyeDFiVzV6TzF4dUlDQjlMRnh1SUNCZmMyOXlkRWhoYm1Sc1pYSTZJR1oxYm1OMGFXOXVJQ2h6YjNKMFpXVXBJSHRjYmlBZ0lDQjJZWElnYzNSdmNtVWdJQ0E5SUhSb2FYTXVjSEp2Y0hNdWMzUnZjbVU3WEc0Z0lDQWdkbUZ5SUdOMWNuSmxiblFnUFNCemRHOXlaUzVuWlhRb0ozTnZjblJsWlNjcE8xeHVYRzRnSUNBZ2FXWWdLR04xY25KbGJuUXVZMmxrSUNFOVBTQnpiM0owWldVdVkybGtLU0I3WEc0Z0lDQWdJQ0JqZFhKeVpXNTBMbVZ1WkZOdmNuUnBibWNvS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6ZEc5eVpTNXpaWFFvSjNOdmNuUmxaU2NzSUhOdmNuUmxaU2s3WEc0Z0lDQWdjMjl5ZEdWbExuUnZaMmRzWlZOdmNuUkVhWEpsWTNScGIyNG9LVHRjYmx4dUlDQjlYRzU5S1R0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQlVhR1ZoWkR0Y2JpSmRmUT09IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBXZWxsTGlzdDtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgVGggICAgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL3RoLmpzeCcpO1xudmFyIFRoZWFkID0gcmVxdWlyZSgnLi90aGVhZF93cmFwcGVyLmpzeCcpO1xudmFyIFRib2R5ID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy90Ym9keS5qc3gnKTtcblxudmFyIHNpemVzID0ge1xuICAyMDA6IDI1MCxcbiAgMjUwOiAyMDBcbn07XG5cbldlbGxMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIldlbGxMaXN0XCIsXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge2NsYXNzTmFtZTogXCJmdWxsIGlubGluZS1kZXRhaWxzXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImNhcHRpb25cIiwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7b25DbGljazogdGhpcy5fY2hhbmdlV2lkdGhIYW5kbGVyfSwgXCJ0b2dnbGUgMm5kIGNvbCB3aWR0aCB3aWR0aCBleGFtcGxlXCIpKSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGhlYWQsIHtzdG9yZTogdGhpcy5wcm9wcy5zdG9yZX0pLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYm9keSwge3N0b3JlOiB0aGlzLnByb3BzLnN0b3JlfSlcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBfY2hhbmdlV2lkdGhIYW5kbGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHN0b3JlID0gdGhpcy5wcm9wcy5zdG9yZS5nZXQoJ2hlYWRpbmdzJyk7XG4gICAgdmFyIHRoaXJkID0gc3RvcmUuYXQoMik7XG5cbiAgICB0aGlyZC5zZXQoJ3dpZHRoJywgc2l6ZXNbdGhpcmQuZ2V0KCd3aWR0aCcpXSB8fCAyMDApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBXZWxsTGlzdDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdmQyVnNiRjluY21sa0wzWnBaWGN1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPenRCUVVWQkxFZEJRVWM3TzBGQlJVZ3NTVUZCU1N4UlFVRlJMRU5CUVVNN1FVRkRZaXhKUVVGSkxFdEJRVXNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1FVRkROMElzU1VGQlNTeEZRVUZGTEUxQlFVMHNUMEZCVHl4RFFVRkRMSGxDUVVGNVFpeERRVUZETEVOQlFVTTdRVUZETDBNc1NVRkJTU3hMUVVGTExFZEJRVWNzVDBGQlR5eERRVUZETEhGQ1FVRnhRaXhEUVVGRExFTkJRVU03UVVGRE0wTXNTVUZCU1N4TFFVRkxMRWRCUVVjc1QwRkJUeXhEUVVGRExEUkNRVUUwUWl4RFFVRkRMRU5CUVVNN08wRkJSV3hFTEVsQlFVa3NTMEZCU3l4SFFVRkhPMFZCUTFZc1IwRkJSeXhGUVVGRkxFZEJRVWM3UlVGRFVpeEhRVUZITEVWQlFVVXNSMEZCUnp0QlFVTldMRU5CUVVNc1EwRkJRenM3UVVGRlJpdzRRa0ZCT0VJc2QwSkJRVUU3UlVGRE5VSXNUVUZCVFN4RlFVRkZMRmxCUVZrN1NVRkRiRUk3VFVGRFJTeHZRa0ZCUVN4UFFVRk5MRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEhGQ1FVRnpRaXhEUVVGQkxFVkJRVUU3VVVGRGNrTXNiMEpCUVVFc1UwRkJVU3hGUVVGQkxFbEJRVU1zUlVGQlFTeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExFOUJRVUVzUlVGQlR5eERRVUZGTEVsQlFVa3NRMEZCUXl4dFFrRkJjVUlzUTBGQlFTeEZRVUZCTEc5RFFVRjNReXhEUVVGVkxFTkJRVUVzUlVGQlFUdFJRVU51Unl4dlFrRkJReXhMUVVGTExFVkJRVUVzUTBGQlFTeERRVUZETEV0QlFVRXNSVUZCU3l4RFFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlRTeERRVUZCTEVOQlFVY3NRMEZCUVN4RlFVRkJPMUZCUTJ4RExHOUNRVUZETEV0QlFVc3NSVUZCUVN4RFFVRkJMRU5CUVVNc1MwRkJRU3hGUVVGTExFTkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRk5MRU5CUVVFc1EwRkJSeXhEUVVGQk8wMUJRelZDTEVOQlFVRTdUVUZEVWp0SFFVTklPMFZCUTBRc2JVSkJRVzFDTEVWQlFVVXNXVUZCV1R0SlFVTXZRaXhKUVVGSkxFdEJRVXNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTTdRVUZEYWtRc1NVRkJTU3hKUVVGSkxFdEJRVXNzUjBGQlJ5eExRVUZMTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE96dEpRVVY0UWl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFOUJRVThzUlVGQlJTeExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF5eEpRVUZKTEVkQlFVY3NRMEZCUXl4RFFVRkRPMGRCUTNSRU8wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFJRVUZSTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRmRsYkd4TWFYTjBPMXh1ZG1GeUlGSmxZV04wSUQwZ2NtVnhkV2x5WlNnbmNtVmhZM1FuS1R0Y2JuWmhjaUJVYUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR1THk0dUwyTnZiWEJ2Ym1WdWRITXZkR2d1YW5ONEp5azdYRzUyWVhJZ1ZHaGxZV1FnUFNCeVpYRjFhWEpsS0NjdUwzUm9aV0ZrWDNkeVlYQndaWEl1YW5ONEp5azdYRzUyWVhJZ1ZHSnZaSGtnUFNCeVpYRjFhWEpsS0NjdUxpOHVMaTlqYjIxd2IyNWxiblJ6TDNSaWIyUjVMbXB6ZUNjcE8xeHVYRzUyWVhJZ2MybDZaWE1nUFNCN1hHNGdJREl3TURvZ01qVXdMRnh1SUNBeU5UQTZJREl3TUZ4dWZUdGNibHh1VjJWc2JFeHBjM1FnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThkR0ZpYkdVZ1kyeGhjM05PWVcxbFBWd2lablZzYkNCcGJteHBibVV0WkdWMFlXbHNjMXdpUGx4dUlDQWdJQ0FnSUNBOFkyRndkR2x2Ymo0OFpHbDJJRzl1UTJ4cFkyczllM1JvYVhNdVgyTm9ZVzVuWlZkcFpIUm9TR0Z1Wkd4bGNuMCtkRzluWjJ4bElESnVaQ0JqYjJ3Z2QybGtkR2dnZDJsa2RHZ2daWGhoYlhCc1pUd3ZaR2wyUGp3dlkyRndkR2x2Ymo1Y2JpQWdJQ0FnSUNBZ1BGUm9aV0ZrSUhOMGIzSmxQWHQwYUdsekxuQnliM0J6TG5OMGIzSmxmU0F2UGx4dUlDQWdJQ0FnSUNBOFZHSnZaSGtnYzNSdmNtVTllM1JvYVhNdWNISnZjSE11YzNSdmNtVjlJQzgrWEc0Z0lDQWdJQ0E4TDNSaFlteGxQbHh1SUNBZ0lDazdYRzRnSUgwc1hHNGdJRjlqYUdGdVoyVlhhV1IwYUVoaGJtUnNaWEk2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMllYSWdjM1J2Y21VZ1BTQjBhR2x6TG5CeWIzQnpMbk4wYjNKbExtZGxkQ2duYUdWaFpHbHVaM01uS1R0Y2JpQWdJQ0IyWVhJZ2RHaHBjbVFnUFNCemRHOXlaUzVoZENneUtUdGNibHh1SUNBZ0lIUm9hWEprTG5ObGRDZ25kMmxrZEdnbkxDQnphWHBsYzF0MGFHbHlaQzVuWlhRb0ozZHBaSFJvSnlsZElIeDhJREl3TUNrN1hHNGdJSDFjYm4wcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRmRsYkd4TWFYTjBPMXh1SWwxOSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgV2VsbE5hdjtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgVGFicyAgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL3RhYnMuanN4Jyk7XG5cbldlbGxOYXYgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiV2VsbE5hdlwiLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInRhYi1ncm91cFwifSwgXG4gICAgICAgIHRoaXMuX2J1aWxkVGFiR3JvdXBzKClcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBfYnVpbGRUYWJHcm91cHM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZ3JvdXBzID0gW107XG5cbiAgICBncm91cHMucHVzaChbXG4gICAgICB7dGV4dDogJ1dlbGwgRGFzaCd9LFxuICAgICAge3RleHQ6ICdEZXRhaWxzJ30sXG4gICAgICB7dGV4dDogJ01hbmFnZW1lbnQnfSxcbiAgICAgIHt0ZXh0OiAnU3RhdHVzIC8gQ29uZmlnJ30sXG4gICAgICB7dGV4dDogJ0V2ZW50cyd9LFxuICAgICAge3RleHQ6ICdBbGFybXMnfVxuICAgIF0pO1xuXG4gICAgZ3JvdXBzLnB1c2goW1xuICAgICAge3RleHQ6IHRoaXMucHJvcHMudHlwZSArICcgZGV0YWlscyd9LFxuICAgICAge3RleHQ6ICdBbmFseXplJ31cbiAgICBdKTtcblxuICAgIHJldHVybiBncm91cHMubWFwKGZ1bmN0aW9uIChncm91cCwgaW5kZXgpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFicywge3RhYnM6IGdyb3VwLCBrZXk6IGluZGV4fSlcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdlbGxOYXY7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZkMlZzYkY5bmNtbGtMM2RsYkd4ZmJtRjJMbXB6ZUNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFUczdRVUZGUVN4SFFVRkhPenRCUVVWSUxFbEJRVWtzVDBGQlR5eERRVUZETzBGQlExb3NTVUZCU1N4TFFVRkxMRWRCUVVjc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzBGQlF6ZENMRWxCUVVrc1NVRkJTU3hKUVVGSkxFOUJRVThzUTBGQlF5d3lRa0ZCTWtJc1EwRkJReXhEUVVGRE96dEJRVVZxUkN3MlFrRkJOa0lzZFVKQlFVRTdSVUZETTBJc1RVRkJUU3hGUVVGRkxGbEJRVms3U1VGRGJFSTdUVUZEUlN4dlFrRkJRU3hMUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRmRCUVZrc1EwRkJRU3hGUVVGQk8xRkJRM2hDTEVsQlFVa3NRMEZCUXl4bFFVRmxMRVZCUVVjN1RVRkRjRUlzUTBGQlFUdE5RVU5PTzBkQlEwZzdSVUZEUkN4bFFVRmxMRVZCUVVVc1dVRkJXVHRCUVVNdlFpeEpRVUZKTEVsQlFVa3NUVUZCVFN4SFFVRkhMRVZCUVVVc1EwRkJRenM3U1VGRmFFSXNUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJRenROUVVOV0xFTkJRVU1zU1VGQlNTeEZRVUZGTEZkQlFWY3NRMEZCUXp0TlFVTnVRaXhEUVVGRExFbEJRVWtzUlVGQlJTeFRRVUZUTEVOQlFVTTdUVUZEYWtJc1EwRkJReXhKUVVGSkxFVkJRVVVzV1VGQldTeERRVUZETzAxQlEzQkNMRU5CUVVNc1NVRkJTU3hGUVVGRkxHbENRVUZwUWl4RFFVRkRPMDFCUTNwQ0xFTkJRVU1zU1VGQlNTeEZRVUZGTEZGQlFWRXNRMEZCUXp0TlFVTm9RaXhEUVVGRExFbEJRVWtzUlVGQlJTeFJRVUZSTEVOQlFVTTdRVUZEZEVJc1MwRkJTeXhEUVVGRExFTkJRVU03TzBsQlJVZ3NUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJRenROUVVOV0xFTkJRVU1zU1VGQlNTeEZRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hIUVVGSExGVkJRVlVzUTBGQlF6dE5RVU53UXl4RFFVRkRMRWxCUVVrc1JVRkJSU3hUUVVGVExFTkJRVU03UVVGRGRrSXNTMEZCU3l4RFFVRkRMRU5CUVVNN08wbEJSVWdzVDBGQlR5eE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVZVc1MwRkJTeXhGUVVGRkxFdEJRVXNzUlVGQlJUdE5RVU40UXp0UlFVTkZMRzlDUVVGRExFbEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNTVUZCUVN4RlFVRkpMRU5CUVVVc1MwRkJTeXhGUVVGRExFTkJRVU1zUjBGQlFTeEZRVUZITEVOQlFVVXNTMEZCVFN4RFFVRkJMRU5CUVVjc1EwRkJRVHRSUVVOcVF6dExRVU5JTEVOQlFVTXNRMEZCUXp0SFFVTktPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhQUVVGUExFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUZkbGJHeE9ZWFk3WEc1MllYSWdVbVZoWTNRZ1BTQnlaWEYxYVhKbEtDZHlaV0ZqZENjcE8xeHVkbUZ5SUZSaFluTWdJRDBnY21WeGRXbHlaU2duTGk0dkxpNHZZMjl0Y0c5dVpXNTBjeTkwWVdKekxtcHplQ2NwTzF4dVhHNVhaV3hzVG1GMklEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0owWVdJdFozSnZkWEJjSWo1Y2JpQWdJQ0FnSUNBZ2UzUm9hWE11WDJKMWFXeGtWR0ZpUjNKdmRYQnpLQ2w5WEc0Z0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBcE8xeHVJQ0I5TEZ4dUlDQmZZblZwYkdSVVlXSkhjbTkxY0hNNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnWjNKdmRYQnpJRDBnVzEwN1hHNWNiaUFnSUNCbmNtOTFjSE11Y0hWemFDaGJYRzRnSUNBZ0lDQjdkR1Y0ZERvZ0oxZGxiR3dnUkdGemFDZDlMRnh1SUNBZ0lDQWdlM1JsZUhRNklDZEVaWFJoYVd4ekozMHNYRzRnSUNBZ0lDQjdkR1Y0ZERvZ0owMWhibUZuWlcxbGJuUW5mU3hjYmlBZ0lDQWdJSHQwWlhoME9pQW5VM1JoZEhWeklDOGdRMjl1Wm1sbkozMHNYRzRnSUNBZ0lDQjdkR1Y0ZERvZ0owVjJaVzUwY3lkOUxGeHVJQ0FnSUNBZ2UzUmxlSFE2SUNkQmJHRnliWE1uZlZ4dUlDQWdJRjBwTzF4dVhHNGdJQ0FnWjNKdmRYQnpMbkIxYzJnb1cxeHVJQ0FnSUNBZ2UzUmxlSFE2SUhSb2FYTXVjSEp2Y0hNdWRIbHdaU0FySUNjZ1pHVjBZV2xzY3lkOUxGeHVJQ0FnSUNBZ2UzUmxlSFE2SUNkQmJtRnNlWHBsSjMxY2JpQWdJQ0JkS1R0Y2JseHVJQ0FnSUhKbGRIVnliaUJuY205MWNITXViV0Z3S0daMWJtTjBhVzl1SUNobmNtOTFjQ3dnYVc1a1pYZ3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQWdJRHhVWVdKeklIUmhZbk05ZTJkeWIzVndmU0JyWlhrOWUybHVaR1Y0ZlNBdlBseHVJQ0FnSUNBZ0tUdGNiaUFnSUNCOUtUdGNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVjJWc2JFNWhkanRjYmlKZGZRPT0iLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG5mdW5jdGlvbiBTY3JvbGxlckNvYXN0ZXIgKGVsZW1lbnRzLCBvcHRpb25zKSB7XG4gIGlmICghICh0aGlzIGluc3RhbmNlb2YgU2Nyb2xsZXJDb2FzdGVyKSkge1xuICAgIHJldHVybiBuZXcgU2Nyb2xsZXJDb2FzdGVyKGVsZW1lbnRzLCBvcHRpb25zKTtcbiAgfVxuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHRoaXMuZWxlbWVudHMgICAgID0gQXJyYXkuaXNBcnJheShlbGVtZW50cykgPyBlbGVtZW50cyA6IFtlbGVtZW50c107XG4gIHRoaXMuY3VycmVudCAgICAgID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICB0aGlzLnN0YXJ0ICAgICAgICA9IDA7XG4gIHRoaXMuc3RlcHMgICAgICAgID0gb3B0aW9ucy5zdGVwcyB8fCAxNTA7XG5cbiAgdGhpcy5jYWxjdWxhdGVTY3JvbGxQb3NpdGlvbigpLnN0ZXAoMCk7XG59XG5cblNjcm9sbGVyQ29hc3Rlci5wcm90b3R5cGUuZ2V0VG9wID0gZnVuY3Rpb24gZ2V0VG9wICgpIHtcbiAgcmV0dXJuICQodGhpcy5lbGVtZW50c1swXSkub2Zmc2V0KCkudG9wIHx8IDA7XG59O1xuXG5TY3JvbGxlckNvYXN0ZXIucHJvdG90eXBlLmdldFRvdGFsSGVpZ2h0ID0gZnVuY3Rpb24gZ2V0VG90YWxIZWlnaHQgKCkge1xuICB2YXIgaGVpZ2h0ID0gMDtcblxuICB0aGlzLmVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgaGVpZ2h0ICs9ICQoZWwpLm91dGVySGVpZ2h0KCk7XG4gIH0pO1xuXG4gIHJldHVybiBoZWlnaHQ7XG59O1xuXG5TY3JvbGxlckNvYXN0ZXIucHJvdG90eXBlLmNhbGN1bGF0ZVNjcm9sbFBvc2l0aW9uID0gZnVuY3Rpb24gY2FsY3VsYXRlU2Nyb2xsUG9zaXRpb24gKCkge1xuICB2YXIgd2luZG93X2hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcbiAgdmFyIG1pZCAgICAgICAgICAgPSB3aW5kb3dfaGVpZ2h0IC8gMjtcbiAgdmFyIHRvcCAgICAgICAgICAgPSB0aGlzLmdldFRvcCgpO1xuICB2YXIgaGVpZ2h0ICAgICAgICA9IHRoaXMuZ2V0VG90YWxIZWlnaHQoKTtcbiAgdmFyIGRlc3RpbmF0aW9uICAgPSBoZWlnaHQgPiB3aW5kb3dfaGVpZ2h0ID8gdG9wIDogdG9wIC0gbWlkICsgaGVpZ2h0IC0gKGhlaWdodCAvIDIpXG5cbiAgdGhpcy5kaWZmID0gZGVzdGluYXRpb24gLSB0aGlzLmN1cnJlbnQ7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5TY3JvbGxlckNvYXN0ZXIucHJvdG90eXBlLnN0ZXAgPSBmdW5jdGlvbiBzdGVwICh0aW1lc3RhbXApIHtcbiAgdmFyIHByb2dyZXNzO1xuICB2YXIgcGVyY2VudDtcblxuICB0aGlzLnN0YXJ0ICA9IHRoaXMuc3RhcnQgfHwgdGltZXN0YW1wO1xuICBwcm9ncmVzcyAgICA9IHRpbWVzdGFtcCAtIHRoaXMuc3RhcnQ7XG4gIHBlcmNlbnQgICAgID0gTWF0aC5taW4ocHJvZ3Jlc3MgLyB0aGlzLnN0ZXBzLCAxKTtcblxuICBzY3JvbGxUbygwLCB0aGlzLmN1cnJlbnQgKyAodGhpcy5kaWZmICogcGVyY2VudCkpO1xuXG4gIGlmIChwZXJjZW50IDwgMSkge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnN0ZXAuYmluZCh0aGlzKSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2Nyb2xsZXJDb2FzdGVyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDNWMGFXeHpMM05qY205c2JHVnlYMk52WVhOMFpYSXZhVzVrWlhndWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzU1VGQlNTeERRVUZETEVkQlFVY3NUMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE96dEJRVVV4UWl4VFFVRlRMR1ZCUVdVc1JVRkJSU3hSUVVGUkxFVkJRVVVzVDBGQlR5eEZRVUZGTzBWQlF6TkRMRWxCUVVrc1IwRkJSeXhKUVVGSkxGbEJRVmtzWlVGQlpTeERRVUZETEVWQlFVVTdTVUZEZGtNc1QwRkJUeXhKUVVGSkxHVkJRV1VzUTBGQlF5eFJRVUZSTEVWQlFVVXNUMEZCVHl4RFFVRkRMRU5CUVVNN1FVRkRiRVFzUjBGQlJ6czdRVUZGU0N4RlFVRkZMRTlCUVU4c1IwRkJSeXhQUVVGUExFbEJRVWtzUlVGQlJTeERRVUZET3p0RlFVVjRRaXhKUVVGSkxFTkJRVU1zVVVGQlVTeFBRVUZQTEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1VVRkJVU3hEUVVGRExFZEJRVWNzVVVGQlVTeEhRVUZITEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1JVRkRjRVVzU1VGQlNTeERRVUZETEU5QlFVOHNVVUZCVVN4RFFVRkRMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU1zVTBGQlV5eEZRVUZGTEVOQlFVTTdSVUZETVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzVlVGQlZTeERRVUZETEVOQlFVTTdRVUZEZUVJc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eFZRVUZWTEU5QlFVOHNRMEZCUXl4TFFVRkxMRWxCUVVrc1IwRkJSeXhEUVVGRE96dEZRVVY2UXl4SlFVRkpMRU5CUVVNc2RVSkJRWFZDTEVWQlFVVXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRGVrTXNRMEZCUXpzN1FVRkZSQ3hsUVVGbExFTkJRVU1zVTBGQlV5eERRVUZETEUxQlFVMHNSMEZCUnl4VFFVRlRMRTFCUVUwc1NVRkJTVHRGUVVOd1JDeFBRVUZQTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1IwRkJSeXhKUVVGSkxFTkJRVU1zUTBGQlF6dEJRVU12UXl4RFFVRkRMRU5CUVVNN08wRkJSVVlzWlVGQlpTeERRVUZETEZOQlFWTXNRMEZCUXl4alFVRmpMRWRCUVVjc1UwRkJVeXhqUVVGakxFbEJRVWs3UVVGRGRFVXNSVUZCUlN4SlFVRkpMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU03TzBWQlJXWXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhQUVVGUExFTkJRVU1zVlVGQlZTeEZRVUZGTEVWQlFVVTdTVUZEYkVNc1RVRkJUU3hKUVVGSkxFTkJRVU1zUTBGQlF5eEZRVUZGTEVOQlFVTXNRMEZCUXl4WFFVRlhMRVZCUVVVc1EwRkJRenRCUVVOc1F5eEhRVUZITEVOQlFVTXNRMEZCUXpzN1JVRkZTQ3hQUVVGUExFMUJRVTBzUTBGQlF6dEJRVU5vUWl4RFFVRkRMRU5CUVVNN08wRkJSVVlzWlVGQlpTeERRVUZETEZOQlFWTXNRMEZCUXl4MVFrRkJkVUlzUjBGQlJ5eFRRVUZUTEhWQ1FVRjFRaXhKUVVGSk8wVkJRM1JHTEVsQlFVa3NZVUZCWVN4SFFVRkhMRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF5eE5RVUZOTEVWQlFVVXNRMEZCUXp0RlFVTjJReXhKUVVGSkxFZEJRVWNzWVVGQllTeGhRVUZoTEVkQlFVY3NRMEZCUXl4RFFVRkRPMFZCUTNSRExFbEJRVWtzUjBGQlJ5eGhRVUZoTEVsQlFVa3NRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJRenRGUVVOc1F5eEpRVUZKTEUxQlFVMHNWVUZCVlN4SlFVRkpMRU5CUVVNc1kwRkJZeXhGUVVGRkxFTkJRVU03UVVGRE5VTXNSVUZCUlN4SlFVRkpMRmRCUVZjc1MwRkJTeXhOUVVGTkxFZEJRVWNzWVVGQllTeEhRVUZITEVkQlFVY3NSMEZCUnl4SFFVRkhMRWRCUVVjc1IwRkJSeXhIUVVGSExFMUJRVTBzU1VGQlNTeE5RVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRPenRCUVVWMFJpeEZRVUZGTEVsQlFVa3NRMEZCUXl4SlFVRkpMRWRCUVVjc1YwRkJWeXhIUVVGSExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTTdPMFZCUlhaRExFOUJRVThzU1VGQlNTeERRVUZETzBGQlEyUXNRMEZCUXl4RFFVRkRPenRCUVVWR0xHVkJRV1VzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4SFFVRkhMRk5CUVZNc1NVRkJTU3hGUVVGRkxGTkJRVk1zUlVGQlJUdEZRVU42UkN4SlFVRkpMRkZCUVZFc1EwRkJRenRCUVVObUxFVkJRVVVzU1VGQlNTeFBRVUZQTEVOQlFVTTdPMFZCUlZvc1NVRkJTU3hEUVVGRExFdEJRVXNzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4SlFVRkpMRk5CUVZNc1EwRkJRenRGUVVOMFF5eFJRVUZSTEUxQlFVMHNVMEZCVXl4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU03UVVGRGRrTXNSVUZCUlN4UFFVRlBMRTlCUVU4c1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eFJRVUZSTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF6czdRVUZGYmtRc1JVRkJSU3hSUVVGUkxFTkJRVU1zUTBGQlF5eEZRVUZGTEVsQlFVa3NRMEZCUXl4UFFVRlBMRWxCUVVrc1NVRkJTU3hEUVVGRExFbEJRVWtzUjBGQlJ5eFBRVUZQTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRGUVVWc1JDeEpRVUZKTEU5QlFVOHNSMEZCUnl4RFFVRkRMRVZCUVVVN1NVRkRaaXh4UWtGQmNVSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RFFVRkRPMGRCUXpkRE8wRkJRMGdzUTBGQlF5eERRVUZET3p0QlFVVkdMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzWlVGQlpTeERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWRtRnlJQ1FnUFNCeVpYRjFhWEpsS0NkcWNYVmxjbmtuS1R0Y2JseHVablZ1WTNScGIyNGdVMk55YjJ4c1pYSkRiMkZ6ZEdWeUlDaGxiR1Z0Wlc1MGN5d2diM0IwYVc5dWN5a2dlMXh1SUNCcFppQW9JU0FvZEdocGN5QnBibk4wWVc1alpXOW1JRk5qY205c2JHVnlRMjloYzNSbGNpa3BJSHRjYmlBZ0lDQnlaWFIxY200Z2JtVjNJRk5qY205c2JHVnlRMjloYzNSbGNpaGxiR1Z0Wlc1MGN5d2diM0IwYVc5dWN5azdYRzRnSUgxY2JseHVJQ0J2Y0hScGIyNXpJRDBnYjNCMGFXOXVjeUI4ZkNCN2ZUdGNibHh1SUNCMGFHbHpMbVZzWlcxbGJuUnpJQ0FnSUNBOUlFRnljbUY1TG1selFYSnlZWGtvWld4bGJXVnVkSE1wSUQ4Z1pXeGxiV1Z1ZEhNZ09pQmJaV3hsYldWdWRITmRPMXh1SUNCMGFHbHpMbU4xY25KbGJuUWdJQ0FnSUNBOUlDUW9kMmx1Wkc5M0tTNXpZM0p2Ykd4VWIzQW9LVHRjYmlBZ2RHaHBjeTV6ZEdGeWRDQWdJQ0FnSUNBZ1BTQXdPMXh1SUNCMGFHbHpMbk4wWlhCeklDQWdJQ0FnSUNBOUlHOXdkR2x2Ym5NdWMzUmxjSE1nZkh3Z01UVXdPMXh1WEc0Z0lIUm9hWE11WTJGc1kzVnNZWFJsVTJOeWIyeHNVRzl6YVhScGIyNG9LUzV6ZEdWd0tEQXBPMXh1ZlZ4dVhHNVRZM0p2Ykd4bGNrTnZZWE4wWlhJdWNISnZkRzkwZVhCbExtZGxkRlJ2Y0NBOUlHWjFibU4wYVc5dUlHZGxkRlJ2Y0NBb0tTQjdYRzRnSUhKbGRIVnliaUFrS0hSb2FYTXVaV3hsYldWdWRITmJNRjBwTG05bVpuTmxkQ2dwTG5SdmNDQjhmQ0F3TzF4dWZUdGNibHh1VTJOeWIyeHNaWEpEYjJGemRHVnlMbkJ5YjNSdmRIbHdaUzVuWlhSVWIzUmhiRWhsYVdkb2RDQTlJR1oxYm1OMGFXOXVJR2RsZEZSdmRHRnNTR1ZwWjJoMElDZ3BJSHRjYmlBZ2RtRnlJR2hsYVdkb2RDQTlJREE3WEc1Y2JpQWdkR2hwY3k1bGJHVnRaVzUwY3k1bWIzSkZZV05vS0daMWJtTjBhVzl1SUNobGJDa2dlMXh1SUNBZ0lHaGxhV2RvZENBclBTQWtLR1ZzS1M1dmRYUmxja2hsYVdkb2RDZ3BPMXh1SUNCOUtUdGNibHh1SUNCeVpYUjFjbTRnYUdWcFoyaDBPMXh1ZlR0Y2JseHVVMk55YjJ4c1pYSkRiMkZ6ZEdWeUxuQnliM1J2ZEhsd1pTNWpZV3hqZFd4aGRHVlRZM0p2Ykd4UWIzTnBkR2x2YmlBOUlHWjFibU4wYVc5dUlHTmhiR04xYkdGMFpWTmpjbTlzYkZCdmMybDBhVzl1SUNncElIdGNiaUFnZG1GeUlIZHBibVJ2ZDE5b1pXbG5hSFFnUFNBa0tIZHBibVJ2ZHlrdWFHVnBaMmgwS0NrN1hHNGdJSFpoY2lCdGFXUWdJQ0FnSUNBZ0lDQWdJRDBnZDJsdVpHOTNYMmhsYVdkb2RDQXZJREk3WEc0Z0lIWmhjaUIwYjNBZ0lDQWdJQ0FnSUNBZ0lEMGdkR2hwY3k1blpYUlViM0FvS1R0Y2JpQWdkbUZ5SUdobGFXZG9kQ0FnSUNBZ0lDQWdQU0IwYUdsekxtZGxkRlJ2ZEdGc1NHVnBaMmgwS0NrN1hHNGdJSFpoY2lCa1pYTjBhVzVoZEdsdmJpQWdJRDBnYUdWcFoyaDBJRDRnZDJsdVpHOTNYMmhsYVdkb2RDQS9JSFJ2Y0NBNklIUnZjQ0F0SUcxcFpDQXJJR2hsYVdkb2RDQXRJQ2hvWldsbmFIUWdMeUF5S1Z4dVhHNGdJSFJvYVhNdVpHbG1aaUE5SUdSbGMzUnBibUYwYVc5dUlDMGdkR2hwY3k1amRYSnlaVzUwTzF4dVhHNGdJSEpsZEhWeWJpQjBhR2x6TzF4dWZUdGNibHh1VTJOeWIyeHNaWEpEYjJGemRHVnlMbkJ5YjNSdmRIbHdaUzV6ZEdWd0lEMGdablZ1WTNScGIyNGdjM1JsY0NBb2RHbHRaWE4wWVcxd0tTQjdYRzRnSUhaaGNpQndjbTluY21WemN6dGNiaUFnZG1GeUlIQmxjbU5sYm5RN1hHNWNiaUFnZEdocGN5NXpkR0Z5ZENBZ1BTQjBhR2x6TG5OMFlYSjBJSHg4SUhScGJXVnpkR0Z0Y0R0Y2JpQWdjSEp2WjNKbGMzTWdJQ0FnUFNCMGFXMWxjM1JoYlhBZ0xTQjBhR2x6TG5OMFlYSjBPMXh1SUNCd1pYSmpaVzUwSUNBZ0lDQTlJRTFoZEdndWJXbHVLSEJ5YjJkeVpYTnpJQzhnZEdocGN5NXpkR1Z3Y3l3Z01TazdYRzVjYmlBZ2MyTnliMnhzVkc4b01Dd2dkR2hwY3k1amRYSnlaVzUwSUNzZ0tIUm9hWE11WkdsbVppQXFJSEJsY21ObGJuUXBLVHRjYmx4dUlDQnBaaUFvY0dWeVkyVnVkQ0E4SURFcElIdGNiaUFnSUNCeVpYRjFaWE4wUVc1cGJXRjBhVzl1Um5KaGJXVW9kR2hwY3k1emRHVndMbUpwYm1Rb2RHaHBjeWtwTzF4dUlDQjlYRzU5TzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlGTmpjbTlzYkdWeVEyOWhjM1JsY2p0Y2JpSmRmUT09Il19
