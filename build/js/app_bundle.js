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

    if (this.props.feaux) {
      classes = ['feaux-button'];
    }

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9hcHAuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9jb21wb25lbnRzL2J1dHRvbi5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9jb21wb25lbnRzL2ljb24uanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvY29tcG9uZW50cy9zb3J0X2luZGljYXRvci5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9jb21wb25lbnRzL3RhYnMuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvY29tcG9uZW50cy90Ym9keS5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9jb21wb25lbnRzL3RkLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2NvbXBvbmVudHMvdGguanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvY29tcG9uZW50cy90ci5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9kYXRhL3dlbGxfYm9keS5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2RhdGEvd2VsbF9oZWFkaW5ncy5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvd2VsbF9ncmlkL2FjdGlvbnMuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL3dlbGxfZ3JpZC9hY3RpdmVfcm93X2RldGFpbHMuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy93ZWxsX2dyaWQvZGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvd2VsbF9ncmlkL2hlYWRpbmdfY29sbGVjdGlvbi5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvd2VsbF9ncmlkL2hlYWRpbmdfbW9kZWwuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL3dlbGxfZ3JpZC9pbmRleC5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvd2VsbF9ncmlkL3F1aWNrX2xvb2suanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL3dlbGxfZ3JpZC9zdG9yZS5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvd2VsbF9ncmlkL3RoX3dyYXBwZXIuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy93ZWxsX2dyaWQvdGhlYWRfd3JhcHBlci5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL3dlbGxfZ3JpZC92aWV3LmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvd2VsbF9ncmlkL3dlbGxfbmF2LmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3V0aWxzL3Njcm9sbGVyX2NvYXN0ZXIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFZLENBQUM7O0FBRWIsSUFBSSxLQUFLLENBQUM7QUFDVixJQUFJLEtBQUssQ0FBQztBQUNWLElBQUksUUFBUSxDQUFDO0FBQ2IsSUFBSSxLQUFLLG1CQUFtQixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0MsSUFBSSxVQUFVLGNBQWMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQztBQUN2RCxJQUFJLFFBQVEsZ0JBQWdCLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNoRCxJQUFJLGdCQUFnQixRQUFRLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQzNELElBQUksWUFBWSxZQUFZLGdCQUFnQixDQUFDLElBQUks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QUFFLENBQUM7RUFDbEMsSUFBSSxNQUFNLFVBQVUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQzVDLEVBQUUsSUFBSSxXQUFXLEtBQUssTUFBTSxHQUFHLGFBQWEsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxNQUFNLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQzs7QUFFdEYsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDOztFQUV2QyxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQzs7QUFFRixlQUFlLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxTQUFTLElBQUksRUFBRSxTQUFTLEVBQUU7RUFDekQsSUFBSSxRQUFRLENBQUM7QUFDZixFQUFFLElBQUksT0FBTyxDQUFDOztFQUVaLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUM7RUFDdEMsUUFBUSxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3ZDLEVBQUUsT0FBTyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRW5ELEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQzs7RUFFbEQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO0lBQ2YscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUM3QztBQUNILENBQUMsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQzs7QUFFakMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciB0aGVhZDtcbnZhciB0Ym9keTtcbnZhciBoZWFkaW5ncztcbnZhciBSZWFjdCAgICAgICAgICAgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIERpc3BhdGNoZXIgICAgICAgICAgICA9IHJlcXVpcmUoJ2ZsdXgnKS5EaXNwYXRjaGVyO1xudmFyIEJhY2tib25lICAgICAgICAgICAgICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgd2VsbF9ncmlkX21vZHVsZSAgICAgID0gcmVxdWlyZSgnLi9tb2R1bGVzL3dlbGxfZ3JpZCcpO1xudmFyIFdlbGxHcmlkVmlldyAgICAgICAgICA9IHdlbGxfZ3JpZF9tb2R1bGUudmlldztcbnZhciB3ZWxsX3N0b3JlICAgICAgICAgICAgPSB3ZWxsX2dyaWRfbW9kdWxlLnN0b3JlO1xudmFyIHdlbGxfaGVhZGluZ3MgICAgICAgICA9IHdlbGxfc3RvcmUuZ2V0KCdoZWFkaW5ncycpO1xudmFyIHdlbGxfbGlzdCAgICAgICAgICAgICA9IHdlbGxfc3RvcmUuZ2V0KCd3ZWxscycpO1xudmFyIHdlbGxfZ3JpZF9kaXNwYXRjaGVyICA9IHdlbGxfZ3JpZF9tb2R1bGUuZGlzcGF0Y2hlcjtcbnZhciBfZGF0YV93ZWxsX2hlYWRpbmdzICAgPSByZXF1aXJlKCcuL2RhdGEvd2VsbF9oZWFkaW5ncycpO1xudmFyIF9kYXRhX3dlbGxfYm9keSAgICAgICA9IHJlcXVpcmUoJy4vZGF0YS93ZWxsX2JvZHknKSg1MCk7XG5cbndlbGxfaGVhZGluZ3Muc2V0KF9kYXRhX3dlbGxfaGVhZGluZ3MpO1xuXG53ZWxsX3N0b3JlLnNldCgnZmlyc3QnLCAgd2VsbF9oZWFkaW5ncy5hdCgwKSk7XG53ZWxsX3N0b3JlLnNldCgnc29ydGVlJywgd2VsbF9oZWFkaW5ncy5hdCgxKSk7XG5cbndlbGxfaGVhZGluZ3MuZWFjaChmdW5jdGlvbiAoaGVhZGVyLCBpbmRleCkge1xuICB2YXIgcHJldiA9IHdlbGxfaGVhZGluZ3MuYXQoaW5kZXggLSAxKTtcbiAgdmFyIG5leHQgPSB3ZWxsX2hlYWRpbmdzLmF0KGluZGV4ICsgMSk7XG5cbiAgaGVhZGVyLnByZXYgPSBwcmV2O1xuICBoZWFkZXIubmV4dCA9IG5leHQ7XG59KTtcblxud2VsbF9saXN0LnNldChfZGF0YV93ZWxsX2JvZHkpO1xuXG4vKipcbiAqIFJlbmRlciB0aGUgd2VsbCBsaXN0XG4gKiovXG5SZWFjdC5yZW5kZXIoXG4gIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV2VsbEdyaWRWaWV3LCB7XG4gICAgZGlzcGF0Y2hlcjogd2VsbF9ncmlkX2Rpc3BhdGNoZXIsXG4gICAgc3RvcmU6IHdlbGxfc3RvcmV9XG4gICksXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWxsLWxpc3QnKSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMkZ3Y0M1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3haUVVGWkxFTkJRVU03TzBGQlJXSXNTVUZCU1N4TFFVRkxMRU5CUVVNN1FVRkRWaXhKUVVGSkxFdEJRVXNzUTBGQlF6dEJRVU5XTEVsQlFVa3NVVUZCVVN4RFFVRkRPMEZCUTJJc1NVRkJTU3hMUVVGTExHMUNRVUZ0UWl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRE4wTXNTVUZCU1N4VlFVRlZMR05CUVdNc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETEZWQlFWVXNRMEZCUXp0QlFVTjJSQ3hKUVVGSkxGRkJRVkVzWjBKQlFXZENMRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6dEJRVU5vUkN4SlFVRkpMR2RDUVVGblFpeFJRVUZSTEU5QlFVOHNRMEZCUXl4eFFrRkJjVUlzUTBGQlF5eERRVUZETzBGQlF6TkVMRWxCUVVrc1dVRkJXU3haUVVGWkxHZENRVUZuUWl4RFFVRkRMRWxCUVVrc1EwRkJRenRCUVVOc1JDeEpRVUZKTEZWQlFWVXNZMEZCWXl4blFrRkJaMElzUTBGQlF5eExRVUZMTEVOQlFVTTdRVUZEYmtRc1NVRkJTU3hoUVVGaExGZEJRVmNzVlVGQlZTeERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJRenRCUVVOMlJDeEpRVUZKTEZOQlFWTXNaVUZCWlN4VlFVRlZMRU5CUVVNc1IwRkJSeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzBGQlEzQkVMRWxCUVVrc2IwSkJRVzlDTEVsQlFVa3NaMEpCUVdkQ0xFTkJRVU1zVlVGQlZTeERRVUZETzBGQlEzaEVMRWxCUVVrc2JVSkJRVzFDTEV0QlFVc3NUMEZCVHl4RFFVRkRMSE5DUVVGelFpeERRVUZETEVOQlFVTTdRVUZETlVRc1NVRkJTU3hsUVVGbExGTkJRVk1zVDBGQlR5eERRVUZETEd0Q1FVRnJRaXhEUVVGRExFTkJRVU1zUlVGQlJTeERRVUZETEVOQlFVTTdPMEZCUlRWRUxHRkJRV0VzUTBGQlF5eEhRVUZITEVOQlFVTXNiVUpCUVcxQ0xFTkJRVU1zUTBGQlF6czdRVUZGZGtNc1ZVRkJWU3hEUVVGRExFZEJRVWNzUTBGQlF5eFBRVUZQTEVkQlFVY3NZVUZCWVN4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlF6bERMRlZCUVZVc1EwRkJReXhIUVVGSExFTkJRVU1zVVVGQlVTeEZRVUZGTEdGQlFXRXNRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6czdRVUZGT1VNc1lVRkJZU3hEUVVGRExFbEJRVWtzUTBGQlF5eFZRVUZWTEUxQlFVMHNSVUZCUlN4TFFVRkxMRVZCUVVVN1JVRkRNVU1zU1VGQlNTeEpRVUZKTEVkQlFVY3NZVUZCWVN4RFFVRkRMRVZCUVVVc1EwRkJReXhMUVVGTExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEZWtNc1JVRkJSU3hKUVVGSkxFbEJRVWtzUjBGQlJ5eGhRVUZoTEVOQlFVTXNSVUZCUlN4RFFVRkRMRXRCUVVzc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF6czdSVUZGZGtNc1RVRkJUU3hEUVVGRExFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTTdSVUZEYmtJc1RVRkJUU3hEUVVGRExFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTTdRVUZEY2tJc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NVMEZCVXl4RFFVRkRMRWRCUVVjc1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF6czdRVUZGTDBJN08wbEJSVWs3UVVGRFNpeExRVUZMTEVOQlFVTXNUVUZCVFR0RlFVTldMRXRCUVVzc1EwRkJReXhoUVVGaExFTkJRVU1zV1VGQldTeEZRVUZGTzBsQlEyaERMRlZCUVZVc1JVRkJSU3h2UWtGQmIwSTdTVUZEYUVNc1MwRkJTeXhGUVVGRkxGVkJRVlVzUTBGQlF6dEhRVU51UWp0RlFVTkVMRkZCUVZFc1EwRkJReXhqUVVGakxFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklsd2lkWE5sSUhOMGNtbGpkRndpTzF4dVhHNTJZWElnZEdobFlXUTdYRzUyWVhJZ2RHSnZaSGs3WEc1MllYSWdhR1ZoWkdsdVozTTdYRzUyWVhJZ1VtVmhZM1FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duY21WaFkzUW5LVHRjYm5aaGNpQkVhWE53WVhSamFHVnlJQ0FnSUNBZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkbWJIVjRKeWt1UkdsemNHRjBZMmhsY2p0Y2JuWmhjaUJDWVdOclltOXVaU0FnSUNBZ0lDQWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDZGlZV05yWW05dVpTY3BPMXh1ZG1GeUlIZGxiR3hmWjNKcFpGOXRiMlIxYkdVZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dmJXOWtkV3hsY3k5M1pXeHNYMmR5YVdRbktUdGNiblpoY2lCWFpXeHNSM0pwWkZacFpYY2dJQ0FnSUNBZ0lDQWdQU0IzWld4c1gyZHlhV1JmYlc5a2RXeGxMblpwWlhjN1hHNTJZWElnZDJWc2JGOXpkRzl5WlNBZ0lDQWdJQ0FnSUNBZ0lEMGdkMlZzYkY5bmNtbGtYMjF2WkhWc1pTNXpkRzl5WlR0Y2JuWmhjaUIzWld4c1gyaGxZV1JwYm1keklDQWdJQ0FnSUNBZ1BTQjNaV3hzWDNOMGIzSmxMbWRsZENnbmFHVmhaR2x1WjNNbktUdGNiblpoY2lCM1pXeHNYMnhwYzNRZ0lDQWdJQ0FnSUNBZ0lDQWdQU0IzWld4c1gzTjBiM0psTG1kbGRDZ25kMlZzYkhNbktUdGNiblpoY2lCM1pXeHNYMmR5YVdSZlpHbHpjR0YwWTJobGNpQWdQU0IzWld4c1gyZHlhV1JmYlc5a2RXeGxMbVJwYzNCaGRHTm9aWEk3WEc1MllYSWdYMlJoZEdGZmQyVnNiRjlvWldGa2FXNW5jeUFnSUQwZ2NtVnhkV2x5WlNnbkxpOWtZWFJoTDNkbGJHeGZhR1ZoWkdsdVozTW5LVHRjYm5aaGNpQmZaR0YwWVY5M1pXeHNYMkp2WkhrZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NjdUwyUmhkR0V2ZDJWc2JGOWliMlI1Snlrb05UQXBPMXh1WEc1M1pXeHNYMmhsWVdScGJtZHpMbk5sZENoZlpHRjBZVjkzWld4c1gyaGxZV1JwYm1kektUdGNibHh1ZDJWc2JGOXpkRzl5WlM1elpYUW9KMlpwY25OMEp5d2dJSGRsYkd4ZmFHVmhaR2x1WjNNdVlYUW9NQ2twTzF4dWQyVnNiRjl6ZEc5eVpTNXpaWFFvSjNOdmNuUmxaU2NzSUhkbGJHeGZhR1ZoWkdsdVozTXVZWFFvTVNrcE8xeHVYRzUzWld4c1gyaGxZV1JwYm1kekxtVmhZMmdvWm5WdVkzUnBiMjRnS0dobFlXUmxjaXdnYVc1a1pYZ3BJSHRjYmlBZ2RtRnlJSEJ5WlhZZ1BTQjNaV3hzWDJobFlXUnBibWR6TG1GMEtHbHVaR1Y0SUMwZ01TazdYRzRnSUhaaGNpQnVaWGgwSUQwZ2QyVnNiRjlvWldGa2FXNW5jeTVoZENocGJtUmxlQ0FySURFcE8xeHVYRzRnSUdobFlXUmxjaTV3Y21WMklEMGdjSEpsZGp0Y2JpQWdhR1ZoWkdWeUxtNWxlSFFnUFNCdVpYaDBPMXh1ZlNrN1hHNWNibmRsYkd4ZmJHbHpkQzV6WlhRb1gyUmhkR0ZmZDJWc2JGOWliMlI1S1R0Y2JseHVMeW9xWEc0Z0tpQlNaVzVrWlhJZ2RHaGxJSGRsYkd3Z2JHbHpkRnh1SUNvcUwxeHVVbVZoWTNRdWNtVnVaR1Z5S0Z4dUlDQlNaV0ZqZEM1amNtVmhkR1ZGYkdWdFpXNTBLRmRsYkd4SGNtbGtWbWxsZHl3Z2UxeHVJQ0FnSUdScGMzQmhkR05vWlhJNklIZGxiR3hmWjNKcFpGOWthWE53WVhSamFHVnlMRnh1SUNBZ0lITjBiM0psT2lCM1pXeHNYM04wYjNKbGZWeHVJQ0FwTEZ4dUlDQmtiMk4xYldWdWRDNW5aWFJGYkdWdFpXNTBRbmxKWkNnbmQyVnNiQzFzYVhOMEp5a3BPMXh1SWwxOSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgQnV0dG9uO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBJY29uICA9IHJlcXVpcmUoJy4vaWNvbi5qc3gnKTtcblxuQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkJ1dHRvblwiLFxuICBtaXhpbnM6IFtSZWFjdC5hZGRvbnMuUHVyZVJlbmRlck1peGluXSxcbiAgcHJvcFR5cGVzOiB7XG4gICAgaWNvbjogICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgb25DbGljazogIFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIGhyZWY6ICAgICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBpY29uICAgICAgPSB0aGlzLnByb3BzLmljb24gPyBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiB0aGlzLnByb3BzLmljb24sIHJlZjogXCJpY29uXCJ9KSA6IG51bGw7XG4gICAgdmFyIGNsYXNzZXMgICA9IFsnYnV0dG9uJ107XG4gICAgdmFyIGFmdGVySWNvbiA9IHRoaXMucHJvcHMuYWZ0ZXJJY29uID8gUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogdGhpcy5wcm9wcy5hZnRlckljb24sIHJlZjogXCJhZnRlci1pY29uXCJ9KSA6IG51bGw7XG4gICAgdmFyIHRleHQgICAgICA9IHRoaXMucHJvcHMudGV4dCA/IChSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcInRleHRcIn0sIHRoaXMucHJvcHMudGV4dCkpIDogbnVsbDtcbiAgICB2YXIgcHJvcHM7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5mZWF1eCkge1xuICAgICAgY2xhc3NlcyA9IFsnZmVhdXgtYnV0dG9uJ107XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY2xhc3NOYW1lKSB7XG4gICAgICBjbGFzc2VzLnB1c2godGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuICAgIH1cblxuICAgIHByb3BzID0ge1xuICAgICAgaHJlZjogICAgICAgdGhpcy5wcm9wcy5ocmVmLFxuICAgICAgYWN0aW9uOiAgICAgdGhpcy5wcm9wcy5hY3Rpb24sXG4gICAgICBvbkNsaWNrOiAgICB0aGlzLl9oYW5kbGVDbGljayxcbiAgICAgIGNsYXNzTmFtZTogIGNsYXNzZXMuam9pbignICcpXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCBSZWFjdC5fX3NwcmVhZCh7fSwgIHByb3BzKSwgXG4gICAgICAgIGljb24sIFxuICAgICAgICB0ZXh0LCBcbiAgICAgICAgYWZ0ZXJJY29uXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgX2hhbmRsZUNsaWNrOiBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgdGhpcy5wcm9wcy5vbkNsaWNrICYmIHRoaXMucHJvcHMub25DbGljayhlKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQnV0dG9uO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDJOdmJYQnZibVZ1ZEhNdlluVjBkRzl1TG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHM3UVVGRlFTeEhRVUZIT3p0QlFVVklMRWxCUVVrc1RVRkJUU3hEUVVGRE8wRkJRMWdzU1VGQlNTeExRVUZMTEVkQlFVY3NUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8wRkJRemRDTEVsQlFVa3NTVUZCU1N4SlFVRkpMRTlCUVU4c1EwRkJReXhaUVVGWkxFTkJRVU1zUTBGQlF6czdRVUZGYkVNc05FSkJRVFJDTEhOQ1FVRkJPMFZCUXpGQ0xFMUJRVTBzUlVGQlJTeERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1pVRkJaU3hEUVVGRE8wVkJRM1JETEZOQlFWTXNSVUZCUlR0SlFVTlVMRWxCUVVrc1RVRkJUU3hMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEUxQlFVMDdTVUZEYUVNc1QwRkJUeXhIUVVGSExFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1R0SlFVTTVRaXhKUVVGSkxFMUJRVTBzUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4TlFVRk5PMGRCUTJwRE8wVkJRMFFzVFVGQlRTeEZRVUZGTEZsQlFWazdTVUZEYkVJc1NVRkJTU3hKUVVGSkxGRkJRVkVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRWRCUVVjc2IwSkJRVU1zU1VGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NSVUZCUXl4RFFVRkRMRWRCUVVFc1JVRkJSeXhEUVVGRExFMUJRVTBzUTBGQlFTeERRVUZITEVOQlFVRXNSMEZCUnl4SlFVRkpMRU5CUVVNN1NVRkRjRVlzU1VGQlNTeFBRVUZQTEV0QlFVc3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRKUVVNelFpeEpRVUZKTEZOQlFWTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUjBGQlJ5eHZRa0ZCUXl4SlFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExFbEJRVUVzUlVGQlNTeERRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhGUVVGRExFTkJRVU1zUjBGQlFTeEZRVUZITEVOQlFVTXNXVUZCV1N4RFFVRkJMRU5CUVVjc1EwRkJRU3hIUVVGSExFbEJRVWtzUTBGQlF6dEpRVU53Unl4SlFVRkpMRWxCUVVrc1VVRkJVU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NTVUZCU1N4dlFrRkJRU3hOUVVGTExFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRTFCUVU4c1EwRkJRU3hGUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCV1N4RFFVRkJMRWxCUVVrc1NVRkJTU3hEUVVGRE8wRkJReTlHTEVsQlFVa3NTVUZCU1N4TFFVRkxMRU5CUVVNN08wbEJSVllzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1JVRkJSVHROUVVOd1FpeFBRVUZQTEVkQlFVY3NRMEZCUXl4alFVRmpMRU5CUVVNc1EwRkJRenRCUVVOcVF5eExRVUZMT3p0SlFVVkVMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVWQlFVVTdUVUZEZUVJc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8wRkJRM3BETEV0QlFVczdPMGxCUlVRc1MwRkJTeXhIUVVGSE8wMUJRMDRzU1VGQlNTeFJRVUZSTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTVHROUVVNelFpeE5RVUZOTEUxQlFVMHNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTk8wMUJRemRDTEU5QlFVOHNTMEZCU3l4SlFVRkpMRU5CUVVNc1dVRkJXVHROUVVNM1FpeFRRVUZUTEVkQlFVY3NUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU03UVVGRGJrTXNTMEZCU3l4RFFVRkRPenRKUVVWR08wMUJRMFVzYjBKQlFVRXNSMEZCUlN4RlFVRkJMR2RDUVVGQkxFZEJRVUVzUTBGQlJTeEhRVUZITEV0QlFVOHNRMEZCUVN4RlFVRkJPMUZCUTFnc1NVRkJTU3hGUVVGRE8xRkJRMHdzU1VGQlNTeEZRVUZETzFGQlEwd3NVMEZCVlR0TlFVTlVMRU5CUVVFN1RVRkRTanRIUVVOSU8wVkJRMFFzV1VGQldTeEZRVUZGTEZWQlFWVXNRMEZCUXl4RlFVRkZPMGxCUTNwQ0xFTkJRVU1zUTBGQlF5eGpRVUZqTEVWQlFVVXNRMEZCUXp0QlFVTjJRaXhKUVVGSkxFTkJRVU1zUTBGQlF5eGxRVUZsTEVWQlFVVXNRMEZCUXpzN1NVRkZjRUlzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1IwRkROME03UVVGRFNDeERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEUxQlFVMHNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFLbHh1SUNvZ1FHcHplQ0JTWldGamRDNUVUMDFjYmlBcUwxeHVYRzUyWVhJZ1FuVjBkRzl1TzF4dWRtRnlJRkpsWVdOMElEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRbktUdGNiblpoY2lCSlkyOXVJQ0E5SUhKbGNYVnBjbVVvSnk0dmFXTnZiaTVxYzNnbktUdGNibHh1UW5WMGRHOXVJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dUlDQnRhWGhwYm5NNklGdFNaV0ZqZEM1aFpHUnZibk11VUhWeVpWSmxibVJsY2sxcGVHbHVYU3hjYmlBZ2NISnZjRlI1Y0dWek9pQjdYRzRnSUNBZ2FXTnZiam9nSUNBZ0lGSmxZV04wTGxCeWIzQlVlWEJsY3k1emRISnBibWNzWEc0Z0lDQWdiMjVEYkdsamF6b2dJRkpsWVdOMExsQnliM0JVZVhCbGN5NW1kVzVqTEZ4dUlDQWdJR2h5WldZNklDQWdJQ0JTWldGamRDNVFjbTl3Vkhsd1pYTXVjM1J5YVc1blhHNGdJSDBzWEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJwWTI5dUlDQWdJQ0FnUFNCMGFHbHpMbkJ5YjNCekxtbGpiMjRnUHlBOFNXTnZiaUIwZVhCbFBYdDBhR2x6TG5CeWIzQnpMbWxqYjI1OUlISmxaajFjSW1samIyNWNJaUF2UGlBNklHNTFiR3c3WEc0Z0lDQWdkbUZ5SUdOc1lYTnpaWE1nSUNBOUlGc25ZblYwZEc5dUoxMDdYRzRnSUNBZ2RtRnlJR0ZtZEdWeVNXTnZiaUE5SUhSb2FYTXVjSEp2Y0hNdVlXWjBaWEpKWTI5dUlEOGdQRWxqYjI0Z2RIbHdaVDE3ZEdocGN5NXdjbTl3Y3k1aFpuUmxja2xqYjI1OUlISmxaajFjSW1GbWRHVnlMV2xqYjI1Y0lpQXZQaUE2SUc1MWJHdzdYRzRnSUNBZ2RtRnlJSFJsZUhRZ0lDQWdJQ0E5SUhSb2FYTXVjSEp2Y0hNdWRHVjRkQ0EvSUNnOGMzQmhiaUJqYkdGemMwNWhiV1U5WENKMFpYaDBYQ0krZTNSb2FYTXVjSEp2Y0hNdWRHVjRkSDA4TDNOd1lXNCtLU0E2SUc1MWJHdzdYRzRnSUNBZ2RtRnlJSEJ5YjNCek8xeHVYRzRnSUNBZ2FXWWdLSFJvYVhNdWNISnZjSE11Wm1WaGRYZ3BJSHRjYmlBZ0lDQWdJR05zWVhOelpYTWdQU0JiSjJabFlYVjRMV0oxZEhSdmJpZGRPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2gwYUdsekxuQnliM0J6TG1Oc1lYTnpUbUZ0WlNrZ2UxeHVJQ0FnSUNBZ1kyeGhjM05sY3k1d2RYTm9LSFJvYVhNdWNISnZjSE11WTJ4aGMzTk9ZVzFsS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0J3Y205d2N5QTlJSHRjYmlBZ0lDQWdJR2h5WldZNklDQWdJQ0FnSUhSb2FYTXVjSEp2Y0hNdWFISmxaaXhjYmlBZ0lDQWdJR0ZqZEdsdmJqb2dJQ0FnSUhSb2FYTXVjSEp2Y0hNdVlXTjBhVzl1TEZ4dUlDQWdJQ0FnYjI1RGJHbGphem9nSUNBZ2RHaHBjeTVmYUdGdVpHeGxRMnhwWTJzc1hHNGdJQ0FnSUNCamJHRnpjMDVoYldVNklDQmpiR0Z6YzJWekxtcHZhVzRvSnlBbktWeHVJQ0FnSUgwN1hHNWNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEdFZ2V5NHVMbkJ5YjNCemZUNWNiaUFnSUNBZ0lDQWdlMmxqYjI1OVhHNGdJQ0FnSUNBZ0lIdDBaWGgwZlZ4dUlDQWdJQ0FnSUNCN1lXWjBaWEpKWTI5dWZWeHVJQ0FnSUNBZ1BDOWhQbHh1SUNBZ0lDazdYRzRnSUgwc1hHNGdJRjlvWVc1a2JHVkRiR2xqYXpvZ1puVnVZM1JwYjI0Z0tHVXBJSHRjYmlBZ0lDQmxMbkJ5WlhabGJuUkVaV1poZFd4MEtDazdYRzRnSUNBZ1pTNXpkRzl3VUhKdmNHRm5ZWFJwYjI0b0tUdGNibHh1SUNBZ0lIUm9hWE11Y0hKdmNITXViMjVEYkdsamF5QW1KaUIwYUdsekxuQnliM0J6TG05dVEyeHBZMnNvWlNrN1hHNGdJSDFjYm4wcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRUoxZEhSdmJqdGNiaUpkZlE9PSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgSWNvbjtcbnZhciBfICAgICA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBpY29uLCBjdXJyZW50bHkgdXNpbmcgdGhlIGZvbnQgYXdlc29tZSBpY29uIGxpYnJhcnlcbiAqXG4gKiBAZXhhbXBsZXNcbiAqIDxJY29uIHR5cGU9XCJjaGVja1wiIC8+XG4gKiA8SWNvbiB0eXBlPVwidXNlclwiIGNsYXNzTmFtZT1cIm11dGVkXCIgLz5cbiAqIDxJY29uIHR5cGU9XCJiYW5cIiBzdGFjaz1cIjJ4XCIgLz5cbiAqL1xuSWNvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJJY29uXCIsXG4gIHByb3BUeXBlczoge1xuICAgIHN0YWNrOiAgICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgdHlwZTogICAgICAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZTogIFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgfSxcbiAgbWl4aW5zOiBbUmVhY3QuYWRkb25zLlB1cmVSZW5kZXJNaXhpbl0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjbGFzc2VzID0gWydmYSBmYS1pY29uJ107XG4gICAgdmFyIHByb3BzICAgPSBfLm9taXQodGhpcy5wcm9wcywgWydzdGFjaycsICd0eXBlJywgJ2NsYXNzTmFtZSddKTtcblxuICAgIGlmICh0aGlzLnByb3BzLnN0YWNrKSB7XG4gICAgICBjbGFzc2VzLnB1c2goJ2ZhLXN0YWNrLScgKyB0aGlzLnByb3BzLnN0YWNrKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5zcGluKSB7XG4gICAgICBjbGFzc2VzLnB1c2goJ2ZhLXNwaW4nKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy50eXBlKSB7XG4gICAgICBjbGFzc2VzLnB1c2goJ2ZhLScgKyB0aGlzLnByb3BzLnR5cGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmNsYXNzTmFtZSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKHRoaXMucHJvcHMuY2xhc3NOYW1lKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnNpemUpIHtcbiAgICAgIGNsYXNzZXMucHVzaCgnZmEtJyArIHRoaXMucHJvcHMuc2l6ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgcHJvcHMsIHtjbGFzc05hbWU6IGNsYXNzZXMuam9pbignICcpfSkpXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSWNvbjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyTnZiWEJ2Ym1WdWRITXZhV052Ymk1cWMzZ2lYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3TzBGQlJVRXNSMEZCUnpzN1FVRkZTQ3hKUVVGSkxFbEJRVWtzUTBGQlF6dEJRVU5VTEVsQlFVa3NRMEZCUXl4UFFVRlBMRTlCUVU4c1EwRkJReXhaUVVGWkxFTkJRVU1zUTBGQlF6dEJRVU5zUXl4SlFVRkpMRXRCUVVzc1IwRkJSeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdPMEZCUlRkQ08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1IwRkZSenRCUVVOSUxEQkNRVUV3UWl4dlFrRkJRVHRGUVVONFFpeFRRVUZUTEVWQlFVVTdTVUZEVkN4TFFVRkxMRTlCUVU4c1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTzBsQlEyeERMRWxCUVVrc1VVRkJVU3hMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEUxQlFVMHNRMEZCUXl4VlFVRlZPMGxCUXpkRExGTkJRVk1zUjBGQlJ5eExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwN1IwRkRia003UlVGRFJDeE5RVUZOTEVWQlFVVXNRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExHVkJRV1VzUTBGQlF6dEZRVU4wUXl4TlFVRk5MRVZCUVVVc1dVRkJXVHRKUVVOc1FpeEpRVUZKTEU5QlFVOHNSMEZCUnl4RFFVRkRMRmxCUVZrc1EwRkJReXhEUVVGRE8wRkJRMnBETEVsQlFVa3NTVUZCU1N4TFFVRkxMRXRCUVVzc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVNc1QwRkJUeXhGUVVGRkxFMUJRVTBzUlVGQlJTeFhRVUZYTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRKUVVWcVJTeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhGUVVGRk8wMUJRM0JDTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1YwRkJWeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1FVRkRia1FzUzBGQlN6czdTVUZGUkN4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeEZRVUZGTzAxQlEyNUNMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdRVUZET1VJc1MwRkJTenM3U1VGRlJDeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hGUVVGRk8wMUJRMjVDTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkROVU1zUzBGQlN6czdTVUZGUkN4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVTBGQlV5eEZRVUZGTzAxQlEzaENMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNN1FVRkRlRU1zUzBGQlN6czdTVUZGUkN4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeEZRVUZGTzAxQlEyNUNMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRE5VTXNTMEZCU3pzN1NVRkZSRHROUVVORkxHOUNRVUZCTEVkQlFVVXNSVUZCUVN4blFrRkJRU3hIUVVGQkxFTkJRVVVzUjBGQlJ5eExRVUZMTEVWQlFVTXNRMEZCUXl4RFFVRkJMRk5CUVVFc1JVRkJVeXhEUVVGRkxFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkhMRU5CUVVFc1EwRkJTU3hEUVVGQk8wMUJRMmhFTzBkQlEwZzdRVUZEU0N4RFFVRkRMRU5CUVVNc1EwRkJRenM3UVVGRlNDeE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMRWxCUVVrc1EwRkJReUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4cUtseHVJQ29nUUdwemVDQlNaV0ZqZEM1RVQwMWNiaUFxTDF4dVhHNTJZWElnU1dOdmJqdGNiblpoY2lCZklDQWdJQ0E5SUhKbGNYVnBjbVVvSjNWdVpHVnljMk52Y21VbktUdGNiblpoY2lCU1pXRmpkQ0E5SUhKbGNYVnBjbVVvSjNKbFlXTjBKeWs3WEc1Y2JpOHFLbHh1SUNvZ1EzSmxZWFJsY3lCaGJpQnBZMjl1TENCamRYSnlaVzUwYkhrZ2RYTnBibWNnZEdobElHWnZiblFnWVhkbGMyOXRaU0JwWTI5dUlHeHBZbkpoY25sY2JpQXFYRzRnS2lCQVpYaGhiWEJzWlhOY2JpQXFJRHhKWTI5dUlIUjVjR1U5WENKamFHVmphMXdpSUM4K1hHNGdLaUE4U1dOdmJpQjBlWEJsUFZ3aWRYTmxjbHdpSUdOc1lYTnpUbUZ0WlQxY0ltMTFkR1ZrWENJZ0x6NWNiaUFxSUR4SlkyOXVJSFI1Y0dVOVhDSmlZVzVjSWlCemRHRmphejFjSWpKNFhDSWdMejVjYmlBcUwxeHVTV052YmlBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNiaUFnY0hKdmNGUjVjR1Z6T2lCN1hHNGdJQ0FnYzNSaFkyczZJQ0FnSUNBZ1VtVmhZM1F1VUhKdmNGUjVjR1Z6TG5OMGNtbHVaeXhjYmlBZ0lDQjBlWEJsT2lBZ0lDQWdJQ0JTWldGamRDNVFjbTl3Vkhsd1pYTXVjM1J5YVc1bkxtbHpVbVZ4ZFdseVpXUXNYRzRnSUNBZ1kyeGhjM05PWVcxbE9pQWdVbVZoWTNRdVVISnZjRlI1Y0dWekxuTjBjbWx1WjF4dUlDQjlMRnh1SUNCdGFYaHBibk02SUZ0U1pXRmpkQzVoWkdSdmJuTXVVSFZ5WlZKbGJtUmxjazFwZUdsdVhTeGNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZG1GeUlHTnNZWE56WlhNZ1BTQmJKMlpoSUdaaExXbGpiMjRuWFR0Y2JpQWdJQ0IyWVhJZ2NISnZjSE1nSUNBOUlGOHViMjFwZENoMGFHbHpMbkJ5YjNCekxDQmJKM04wWVdOckp5d2dKM1I1Y0dVbkxDQW5ZMnhoYzNOT1lXMWxKMTBwTzF4dVhHNGdJQ0FnYVdZZ0tIUm9hWE11Y0hKdmNITXVjM1JoWTJzcElIdGNiaUFnSUNBZ0lHTnNZWE56WlhNdWNIVnphQ2duWm1FdGMzUmhZMnN0SnlBcklIUm9hWE11Y0hKdmNITXVjM1JoWTJzcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdsbUlDaDBhR2x6TG5CeWIzQnpMbk53YVc0cElIdGNiaUFnSUNBZ0lHTnNZWE56WlhNdWNIVnphQ2duWm1FdGMzQnBiaWNwTzF4dUlDQWdJSDFjYmx4dUlDQWdJR2xtSUNoMGFHbHpMbkJ5YjNCekxuUjVjR1VwSUh0Y2JpQWdJQ0FnSUdOc1lYTnpaWE11Y0hWemFDZ25abUV0SnlBcklIUm9hWE11Y0hKdmNITXVkSGx3WlNrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tIUm9hWE11Y0hKdmNITXVZMnhoYzNOT1lXMWxLU0I3WEc0Z0lDQWdJQ0JqYkdGemMyVnpMbkIxYzJnb2RHaHBjeTV3Y205d2N5NWpiR0Z6YzA1aGJXVXBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLSFJvYVhNdWNISnZjSE11YzJsNlpTa2dlMXh1SUNBZ0lDQWdZMnhoYzNObGN5NXdkWE5vS0NkbVlTMG5JQ3NnZEdocGN5NXdjbTl3Y3k1emFYcGxLVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BHa2dleTR1TG5CeWIzQnpmU0JqYkdGemMwNWhiV1U5ZTJOc1lYTnpaWE11YW05cGJpZ25JQ2NwZlQ0OEwyaytYRzRnSUNBZ0tUdGNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnU1dOdmJqdGNiaUpkZlE9PSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgU29ydEluZGljYXRvcjtcbnZhciBjbGFzc19tYXA7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEljb24gPSByZXF1aXJlKCcuL2ljb24uanN4Jyk7XG5cbmNsYXNzX21hcCA9IHtcbiAgYXNjOiAgJ3NvcnQtdXAnLFxuICBkZXNjOiAnc29ydC1kb3duJ1xufTtcblxuU29ydEluZGljYXRvciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJTb3J0SW5kaWNhdG9yXCIsXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBpY29uICAgICAgPSBudWxsO1xuICAgIHZhciBkaXJlY3Rpb24gPSBjbGFzc19tYXBbdGhpcy5wcm9wcy5kaXJlY3Rpb25dO1xuXG4gICAgaWYgKGRpcmVjdGlvbikge1xuICAgICAgaWNvbiA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IGRpcmVjdGlvbiwgc3RhY2s6IFwiMXhcIn0pO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcImZhLXN0YWNrIHNvcnRlclwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IFwic29ydFwiLCBzdGFjazogXCIxeFwifSksIFxuICAgICAgICBpY29uXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU29ydEluZGljYXRvcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyTnZiWEJ2Ym1WdWRITXZjMjl5ZEY5cGJtUnBZMkYwYjNJdWFuTjRJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCT3p0QlFVVkJMRWRCUVVjN08wRkJSVWdzU1VGQlNTeGhRVUZoTEVOQlFVTTdRVUZEYkVJc1NVRkJTU3hUUVVGVExFTkJRVU03UVVGRFpDeEpRVUZKTEV0QlFVc3NSMEZCUnl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRE4wSXNTVUZCU1N4SlFVRkpMRWRCUVVjc1QwRkJUeXhEUVVGRExGbEJRVmtzUTBGQlF5eERRVUZET3p0QlFVVnFReXhUUVVGVExFZEJRVWM3UlVGRFZpeEhRVUZITEVkQlFVY3NVMEZCVXp0RlFVTm1MRWxCUVVrc1JVRkJSU3hYUVVGWE8wRkJRMjVDTEVOQlFVTXNRMEZCUXpzN1FVRkZSaXh0UTBGQmJVTXNOa0pCUVVFN1JVRkRha01zVFVGQlRTeEZRVUZGTEZsQlFWazdTVUZEYkVJc1NVRkJTU3hKUVVGSkxGRkJRVkVzU1VGQlNTeERRVUZETzBGQlEzcENMRWxCUVVrc1NVRkJTU3hUUVVGVExFZEJRVWNzVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03TzBsQlJXaEVMRWxCUVVrc1UwRkJVeXhGUVVGRk8wMUJRMklzU1VGQlNTeEhRVUZITEc5Q1FVRkRMRWxCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zU1VGQlFTeEZRVUZKTEVOQlFVVXNVMEZCVXl4RlFVRkRMRU5CUVVNc1MwRkJRU3hGUVVGTExFTkJRVU1zU1VGQlNTeERRVUZCTEVOQlFVY3NRMEZCUVN4RFFVRkRPMEZCUTJ4RUxFdEJRVXM3TzBsQlJVUTdUVUZEUlN4dlFrRkJRU3hOUVVGTExFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMR2xDUVVGclFpeERRVUZCTEVWQlFVRTdVVUZEYUVNc2IwSkJRVU1zU1VGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJReXhOUVVGQkxFVkJRVTBzUTBGQlF5eExRVUZCTEVWQlFVc3NRMEZCUXl4SlFVRkpMRU5CUVVFc1EwRkJSeXhEUVVGQkxFVkJRVUU3VVVGRE9VSXNTVUZCU3p0TlFVTkVMRU5CUVVFN1RVRkRVRHRIUVVOSU8wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eGhRVUZoTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRk52Y25SSmJtUnBZMkYwYjNJN1hHNTJZWElnWTJ4aGMzTmZiV0Z3TzF4dWRtRnlJRkpsWVdOMElEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRbktUdGNiblpoY2lCSlkyOXVJRDBnY21WeGRXbHlaU2duTGk5cFkyOXVMbXB6ZUNjcE8xeHVYRzVqYkdGemMxOXRZWEFnUFNCN1hHNGdJR0Z6WXpvZ0lDZHpiM0owTFhWd0p5eGNiaUFnWkdWell6b2dKM052Y25RdFpHOTNiaWRjYm4wN1hHNWNibE52Y25SSmJtUnBZMkYwYjNJZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQnBZMjl1SUNBZ0lDQWdQU0J1ZFd4c08xeHVJQ0FnSUhaaGNpQmthWEpsWTNScGIyNGdQU0JqYkdGemMxOXRZWEJiZEdocGN5NXdjbTl3Y3k1a2FYSmxZM1JwYjI1ZE8xeHVYRzRnSUNBZ2FXWWdLR1JwY21WamRHbHZiaWtnZTF4dUlDQWdJQ0FnYVdOdmJpQTlJRHhKWTI5dUlIUjVjR1U5ZTJScGNtVmpkR2x2Ym4wZ2MzUmhZMnM5WENJeGVGd2lJQzgrTzF4dUlDQWdJSDFjYmx4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThjM0JoYmlCamJHRnpjMDVoYldVOVhDSm1ZUzF6ZEdGamF5QnpiM0owWlhKY0lqNWNiaUFnSUNBZ0lDQWdQRWxqYjI0Z2RIbHdaVDFjSW5OdmNuUmNJaUJ6ZEdGamF6MWNJakY0WENJZ0x6NWNiaUFnSUNBZ0lDQWdlMmxqYjI1OVhHNGdJQ0FnSUNBOEwzTndZVzQrWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1UyOXlkRWx1WkdsallYUnZjanRjYmlKZGZRPT0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFRhYnM7XG52YXIgUmVhY3QgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgQnV0dG9uICA9IHJlcXVpcmUoJy4vYnV0dG9uLmpzeCcpO1xuXG5UYWJzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRhYnNcIixcbiAgcHJvcFR5cGVzOiB7XG4gICAgYWN0aW9uOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICB0YWJzOiAgIFJlYWN0LlByb3BUeXBlcy5hcnJheVxuICB9LFxuICBtaXhpbnM6IFtSZWFjdC5hZGRvbnMuUHVyZVJlbmRlck1peGluXSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCB7Y2xhc3NOYW1lOiBcInRhYnNcIn0sIFxuICAgICAgICB0aGlzLl9idWlsZFRhYnMoKVxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIF9idWlsZFRhYnM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy50YWJzLm1hcChmdW5jdGlvbiAodGFiLCBpbmRleCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtrZXk6IGluZGV4fSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHtvbkNsaWNrOiB0YWIuYWN0aW9uLCBpY29uOiB0YWIuaWNvbiwgdGV4dDogdGFiLnRleHR9KVxuICAgICAgICApXG4gICAgICApO1xuICAgIH0sIHRoaXMpO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUYWJzO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDJOdmJYQnZibVZ1ZEhNdmRHRmljeTVxYzNnaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRTdPMEZCUlVFc1IwRkJSenM3UVVGRlNDeEpRVUZKTEVsQlFVa3NRMEZCUXp0QlFVTlVMRWxCUVVrc1MwRkJTeXhMUVVGTExFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0QlFVTXZRaXhKUVVGSkxFMUJRVTBzU1VGQlNTeFBRVUZQTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNN08wRkJSWFJETERCQ1FVRXdRaXh2UWtGQlFUdEZRVU40UWl4VFFVRlRMRVZCUVVVN1NVRkRWQ3hOUVVGTkxFVkJRVVVzUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4SlFVRkpPMGxCUXpWQ0xFbEJRVWtzU1VGQlNTeExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRXRCUVVzN1IwRkRPVUk3UlVGRFJDeE5RVUZOTEVWQlFVVXNRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExHVkJRV1VzUTBGQlF6dEZRVU4wUXl4TlFVRk5MRVZCUVVVc1dVRkJXVHRKUVVOc1FqdE5RVU5GTEc5Q1FVRkJMRWxCUVVjc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNUVUZCVHl4RFFVRkJMRVZCUVVFN1VVRkRiRUlzU1VGQlNTeERRVUZETEZWQlFWVXNSVUZCUnp0TlFVTm9RaXhEUVVGQk8wMUJRMHc3UjBGRFNEdEZRVU5FTEZWQlFWVXNSVUZCUlN4WlFVRlpPMGxCUTNSQ0xFOUJRVThzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVlVzUjBGQlJ5eEZRVUZGTEV0QlFVc3NSVUZCUlR0TlFVTXZRenRSUVVORkxHOUNRVUZCTEVsQlFVY3NSVUZCUVN4RFFVRkJMRU5CUVVNc1IwRkJRU3hGUVVGSExFTkJRVVVzUzBGQlR5eERRVUZCTEVWQlFVRTdWVUZEWkN4dlFrRkJReXhOUVVGTkxFVkJRVUVzUTBGQlFTeERRVUZETEU5QlFVRXNSVUZCVHl4RFFVRkZMRWRCUVVjc1EwRkJReXhOUVVGTkxFVkJRVU1zUTBGQlF5eEpRVUZCTEVWQlFVa3NRMEZCUlN4SFFVRkhMRU5CUVVNc1NVRkJTU3hGUVVGRExFTkJRVU1zU1VGQlFTeEZRVUZKTEVOQlFVVXNSMEZCUnl4RFFVRkRMRWxCUVVzc1EwRkJRU3hEUVVGSExFTkJRVUU3VVVGRE5VUXNRMEZCUVR0UlFVTk1PMHRCUTBnc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dEhRVU5XTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlFQnFjM2dnVW1WaFkzUXVSRTlOWEc0Z0tpOWNibHh1ZG1GeUlGUmhZbk03WEc1MllYSWdVbVZoWTNRZ0lDQTlJSEpsY1hWcGNtVW9KM0psWVdOMEp5azdYRzUyWVhJZ1FuVjBkRzl1SUNBOUlISmxjWFZwY21Vb0p5NHZZblYwZEc5dUxtcHplQ2NwTzF4dVhHNVVZV0p6SUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVJQ0J3Y205d1ZIbHdaWE02SUh0Y2JpQWdJQ0JoWTNScGIyNDZJRkpsWVdOMExsQnliM0JVZVhCbGN5NW1kVzVqTEZ4dUlDQWdJSFJoWW5NNklDQWdVbVZoWTNRdVVISnZjRlI1Y0dWekxtRnljbUY1WEc0Z0lIMHNYRzRnSUcxcGVHbHVjem9nVzFKbFlXTjBMbUZrWkc5dWN5NVFkWEpsVW1WdVpHVnlUV2w0YVc1ZExGeHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQSFZzSUdOc1lYTnpUbUZ0WlQxY0luUmhZbk5jSWo1Y2JpQWdJQ0FnSUNBZ2UzUm9hWE11WDJKMWFXeGtWR0ZpY3lncGZWeHVJQ0FnSUNBZ1BDOTFiRDVjYmlBZ0lDQXBPMXh1SUNCOUxGeHVJQ0JmWW5WcGJHUlVZV0p6T2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVjSEp2Y0hNdWRHRmljeTV0WVhBb1puVnVZM1JwYjI0Z0tIUmhZaXdnYVc1a1pYZ3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQWdJRHhzYVNCclpYazllMmx1WkdWNGZUNWNiaUFnSUNBZ0lDQWdJQ0E4UW5WMGRHOXVJRzl1UTJ4cFkyczllM1JoWWk1aFkzUnBiMjU5SUdsamIyNDllM1JoWWk1cFkyOXVmU0IwWlhoMFBYdDBZV0l1ZEdWNGRIMGdMejVjYmlBZ0lDQWdJQ0FnUEM5c2FUNWNiaUFnSUNBZ0lDazdYRzRnSUNBZ2ZTd2dkR2hwY3lrN1hHNGdJSDFjYm4wcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRlJoWW5NN1hHNGlYWDA9IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBUYm9keTtcbnZhciBrZXlfbWFwO1xudmFyICQgICAgICAgICAgID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgUmVhY3QgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEJhY2tib25lICAgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBTY3JvbGxlciAgICA9IHJlcXVpcmUoJy4uL3V0aWxzL3Njcm9sbGVyX2NvYXN0ZXInKTtcbnZhciBCdXR0b24gICAgICA9IHJlcXVpcmUoJy4vYnV0dG9uLmpzeCcpO1xudmFyIFRyICAgICAgICAgID0gcmVxdWlyZSgnLi90ci5qc3gnKTtcbnZhciBUZCAgICAgICAgICA9IHJlcXVpcmUoJy4vdGQuanN4Jyk7XG52YXIgSWNvbiAgICAgICAgPSByZXF1aXJlKCcuL2ljb24uanN4Jyk7XG52YXIgUm93RGV0YWlscyAgPSByZXF1aXJlKCcuLi9tb2R1bGVzL3dlbGxfZ3JpZC9hY3RpdmVfcm93X2RldGFpbHMuanN4Jyk7XG52YXIgbW9tZW50ICAgICAgPSByZXF1aXJlKCdtb21lbnQnKTtcblxuLyoqXG4gKiBFYWNoIHRyYW5zZm9ybWVyIHNob3VsZCB3ZWxsIGFuZCBhdHRyX25hbWUgcGFyYW1zXG4gKi9cbnZhciB0cmFuc2Zvcm1lcnMgPSB7XG4gIHN0cmluZzogICBmdW5jdGlvbiAod2VsbCwgbmFtZSkge1xuICAgICAgICAgICAgICByZXR1cm4gd2VsbC5nZXQobmFtZSk7XG4gICAgICAgICAgICB9LFxuICBkYXRlOiAgICAgZnVuY3Rpb24gKHdlbGwsIG5hbWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG1vbWVudCh3ZWxsLmdldChuYW1lKSkuZm9ybWF0KCdNTU0gRCwgWVlZWSBoOm1tOnNzYScpO1xuICAgICAgICAgICAgfSxcbiAgc3RhdHVzOiAgIGZ1bmN0aW9uICh3ZWxsLCBuYW1lKSB7XG4gICAgICAgICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogXCJjaGVja1wifSkpO1xuICAgICAgICAgICAgfSxcbiAgYWN0aW9uczogIGZ1bmN0aW9uICh3ZWxsLCBuYW1lKSB7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImJ1dHRvbi1ncm91cCBidXR0b24tZHJvcFwifSwgXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgbnVsbCwgXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IFwiY2FyZXQtZG93blwifSlcbiAgICAgICAgICAgICAgICAgICksIFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIG51bGwsIFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiBcInBsdXNcIn0pLCBcbiAgICAgICAgICAgICAgICAgICAgXCJDcmVhdGUgQ2FzZVwiXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxufTtcblxua2V5X21hcCA9IHtcbiAgMzg6ICdwcmV2JyxcbiAgNDA6ICduZXh0J1xufTtcblxuVGJvZHkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGJvZHlcIixcbiAgcHJvcFR5cGVzOiB7XG4gICAgc3RvcmU6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEJhY2tib25lLk1vZGVsKS5pc1JlcXVpcmVkXG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY3RpdmVXZWxsOiBudWxsLFxuICAgICAgbWluaW1pemVkOiAgZmFsc2VcbiAgICB9O1xuICB9LFxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWxlbWVudHM7XG4gICAgdmFyIGFjdGl2ZSA9IHRoaXMuc3RhdGUuYWN0aXZlV2VsbDtcblxuICAgIGlmICghIGFjdGl2ZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGVsZW1lbnRzID0gW1xuICAgICAgdGhpcy5yZWZzW2FjdGl2ZV0uZ2V0RE9NTm9kZSgpLFxuICAgICAgdGhpcy5yZWZzLmFjdGl2ZVdlbGwuZ2V0RE9NTm9kZSgpXG4gICAgXTtcblxuICAgIFNjcm9sbGVyKGVsZW1lbnRzLCB7c3RlcHM6IDI1MH0pO1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgICQoZG9jdW1lbnQpLm9uKCdrZXlkb3duLicgKyB0aGlzLnByb3BzLnN0b3JlLmNpZCwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciBjaWQ7XG4gICAgICB2YXIgZGlyZWN0aW9uID0ga2V5X21hcFtlLndoaWNoXTtcblxuICAgICAgaWYgKCEgdGhpcy5zdGF0ZS5hY3RpdmVXZWxsKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGlyZWN0aW9uKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cblxuICAgICAgY2lkID0gdGhpcy5yZWZzLmFjdGl2ZVdlbGwucHJvcHNbZGlyZWN0aW9uXTtcblxuICAgICAgaWYgKGNpZCkge1xuICAgICAgICB0aGlzLl9oYW5kbGVXZWxsU2VsZWN0aW9uKGNpZCk7XG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAkKGRvY3VtZW50KS5vZmYoJy4nICsgdGhpcy5wcm9wcy5zdG9yZS5jaWQpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcm93cyA9IHRoaXMuX2J1aWxkUm93cygpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiLCB7Y2xhc3NOYW1lOiB0aGlzLnByb3BzLmNsYXNzTmFtZX0sIFxuICAgICAgICByb3dzXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgX2J1aWxkUm93czogZnVuY3Rpb24gKCkge1xuICAgIHZhciBkYXRhICAgID0gW107XG4gICAgdmFyIHN0b3JlICAgPSB0aGlzLnByb3BzLnN0b3JlO1xuICAgIHZhciB3ZWxscyAgID0gc3RvcmUuZ2V0KCd3ZWxscycpO1xuICAgIHZhciBoZWFkaW5nID0gc3RvcmUuZ2V0KCdmaXJzdCcpO1xuICAgIHZhciBwcmV2ICAgID0gbnVsbDtcbiAgICB2YXIgbmV4dCAgICA9IG51bGw7XG5cbiAgICB3ZWxscy5lYWNoKGZ1bmN0aW9uICh3ZWxsLCBpbmRleCkge1xuICAgICAgdmFyIHNlbGVjdGVkX3JvdztcbiAgICAgIHZhciB3ZWxsX3JvdztcbiAgICAgIHZhciBhY3RpdmUgICAgICAgID0gdGhpcy5zdGF0ZS5hY3RpdmVXZWxsID09PSB3ZWxsLmNpZDtcbiAgICAgIHZhciBjb250ZW50cyAgICAgID0gdGhpcy5fYnVpbGRSb3cod2VsbCwgaGVhZGluZyk7XG4gICAgICB2YXIgb2RkICAgICAgICAgICA9IGluZGV4ICUgMiA+IDAgPyAnb2RkJyA6ICcnO1xuICAgICAgdmFyIGFjdGl2ZV9wcm9wcyAgID0ge307XG5cbiAgICAgIG5leHQgPSB3ZWxscy5hdChpbmRleCArIDEpO1xuXG4gICAgICB3ZWxsX3JvdyA9IChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUciwge2NsYXNzTmFtZTogb2RkICsgKGFjdGl2ZSA/ICcgYWN0aXZlJyA6ICcnKSwgcmVmOiB3ZWxsLmNpZCwga2V5OiB3ZWxsLmNpZCwgb25DbGljazogdGhpcy5faGFuZGxlV2VsbFNlbGVjdGlvbi5iaW5kKHRoaXMsIHdlbGwuY2lkKX0sIFxuICAgICAgICAgIGNvbnRlbnRzXG4gICAgICAgIClcbiAgICAgICk7XG5cbiAgICAgIGRhdGEucHVzaCh3ZWxsX3Jvdyk7XG5cbiAgICAgIGlmIChhY3RpdmUpIHtcbiAgICAgICAgYWN0aXZlX3Byb3BzID0ge1xuICAgICAgICAgIGNsYXNzTmFtZTogIG9kZCxcbiAgICAgICAgICBzdG9yZTogICAgICB3ZWxsLFxuICAgICAgICAgIHByZXY6ICAgICAgIHByZXYsXG4gICAgICAgICAgbmV4dDogICAgICAgbmV4dCAmJiBuZXh0LmNpZCxcbiAgICAgICAgICBzd2l0Y2hlcjogICB0aGlzLl9oYW5kbGVXZWxsU2VsZWN0aW9uLFxuICAgICAgICAgIHNpemVUb2dnbGU6IHRoaXMuX3RvZ2dsZU1pbmltaXplLFxuICAgICAgICAgIGtleTogICAgICAgIHdlbGwuY2lkICsgJy1hY3RpdmUnLFxuICAgICAgICAgIHJlZjogICAgICAgICdhY3RpdmVXZWxsJyxcbiAgICAgICAgICBtaW5pbWl6ZWQ6ICB0aGlzLnN0YXRlLm1pbmltaXplZFxuICAgICAgICB9O1xuXG4gICAgICAgIGRhdGEucHVzaChSZWFjdC5jcmVhdGVFbGVtZW50KFJvd0RldGFpbHMsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgYWN0aXZlX3Byb3BzKSkpO1xuICAgICAgfVxuXG4gICAgICBwcmV2ID0gd2VsbC5jaWQ7XG4gICAgfSwgdGhpcyk7XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfSxcbiAgX2J1aWxkUm93OiBmdW5jdGlvbiAod2VsbCwgaGVhZGluZykge1xuICAgIHZhciBuYW1lO1xuICAgIHZhciB2YWx1ZTtcbiAgICB2YXIgZmllbGRzID0gW107XG5cbiAgICB3aGlsZSAoaGVhZGluZykge1xuICAgICAgbmFtZSA9IGhlYWRpbmcuZ2V0KCduYW1lJyk7XG4gICAgICB0eXBlID0gaGVhZGluZy5nZXQoJ3R5cGUnKTtcbiAgICAgIHZhbHVlID0gdHJhbnNmb3JtZXJzW3R5cGVdICYmIHRyYW5zZm9ybWVyc1t0eXBlXS5jYWxsKHRoaXMsIHdlbGwsIG5hbWUpO1xuXG4gICAgICBmaWVsZHMucHVzaChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZCwge3N0b3JlOiB3ZWxsLCBjb2x1bW46IGhlYWRpbmcsIGtleTogaGVhZGluZy5jaWR9LCBcbiAgICAgICAgICB2YWx1ZVxuICAgICAgICApXG4gICAgICApO1xuXG4gICAgICBoZWFkaW5nID0gaGVhZGluZy5uZXh0O1xuICAgIH1cblxuICAgIHJldHVybiBmaWVsZHM7XG4gIH0sXG4gIF9oYW5kbGVXZWxsU2VsZWN0aW9uOiBmdW5jdGlvbiAoY2lkLCBpbmNyZW1lbnQpIHtcbiAgICB2YXIgY3VycmVudCAgICAgPSB0aGlzLnN0YXRlLmFjdGl2ZVdlbGw7XG4gICAgdmFyIGN1cnJlbnRfdG9wID0gMDtcbiAgICB2YXIgbmV4dF90b3AgICAgPSAwO1xuXG4gICAgaWYgKGN1cnJlbnQgPT09IGNpZCkge1xuICAgICAgY2lkID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGFjdGl2ZVdlbGw6IGNpZCxcbiAgICAgIGluY3JlbWVudDogIGluY3JlbWVudCA9PT0gdHJ1ZSxcbiAgICAgIHByZXZpb3VzOiAgIGNpZCA/IGN1cnJlbnQgOiBudWxsXG4gICAgfSk7XG4gIH0sXG4gIF90b2dnbGVNaW5pbWl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe21pbmltaXplZDogISB0aGlzLnN0YXRlLm1pbmltaXplZH0pO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUYm9keTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyTnZiWEJ2Ym1WdWRITXZkR0p2WkhrdWFuTjRJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCT3p0QlFVVkJMRWRCUVVjN08wRkJSVWdzU1VGQlNTeExRVUZMTEVOQlFVTTdRVUZEVml4SlFVRkpMRTlCUVU4c1EwRkJRenRCUVVOYUxFbEJRVWtzUTBGQlF5eGhRVUZoTEU5QlFVOHNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRCUVVOd1F5eEpRVUZKTEV0QlFVc3NVMEZCVXl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRGJrTXNTVUZCU1N4UlFVRlJMRTFCUVUwc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETzBGQlEzUkRMRWxCUVVrc1VVRkJVU3hOUVVGTkxFOUJRVThzUTBGQlF5d3lRa0ZCTWtJc1EwRkJReXhEUVVGRE8wRkJRM1pFTEVsQlFVa3NUVUZCVFN4UlFVRlJMRTlCUVU4c1EwRkJReXhqUVVGakxFTkJRVU1zUTBGQlF6dEJRVU14UXl4SlFVRkpMRVZCUVVVc1dVRkJXU3hQUVVGUExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTTdRVUZEZEVNc1NVRkJTU3hGUVVGRkxGbEJRVmtzVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPMEZCUTNSRExFbEJRVWtzU1VGQlNTeFZRVUZWTEU5QlFVOHNRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJRenRCUVVONFF5eEpRVUZKTEZWQlFWVXNTVUZCU1N4UFFVRlBMRU5CUVVNc05rTkJRVFpETEVOQlFVTXNRMEZCUXp0QlFVTjZSU3hKUVVGSkxFMUJRVTBzVVVGQlVTeFBRVUZQTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN08wRkJSWEJET3p0SFFVVkhPMEZCUTBnc1NVRkJTU3haUVVGWkxFZEJRVWM3UlVGRGFrSXNUVUZCVFN4SlFVRkpMRlZCUVZVc1NVRkJTU3hGUVVGRkxFbEJRVWtzUlVGQlJUdGpRVU53UWl4UFFVRlBMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdZVUZEZGtJN1JVRkRXQ3hKUVVGSkxFMUJRVTBzVlVGQlZTeEpRVUZKTEVWQlFVVXNTVUZCU1N4RlFVRkZPMk5CUTNCQ0xFOUJRVThzVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF5eE5RVUZOTEVOQlFVTXNjMEpCUVhOQ0xFTkJRVU1zUTBGQlF6dGhRVU01UkR0RlFVTllMRTFCUVUwc1NVRkJTU3hWUVVGVkxFbEJRVWtzUlVGQlJTeEpRVUZKTEVWQlFVVTdZMEZEY0VJc1VVRkJVU3h2UWtGQlF5eEpRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRWxCUVVFc1JVRkJTU3hEUVVGRExFOUJRVThzUTBGQlFTeERRVUZITEVOQlFVRXNSVUZCUlR0aFFVTm9RenRGUVVOWUxFOUJRVThzUjBGQlJ5eFZRVUZWTEVsQlFVa3NSVUZCUlN4SlFVRkpMRVZCUVVVN1kwRkRjRUk3WjBKQlEwVXNiMEpCUVVFc1MwRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl3d1FrRkJNa0lzUTBGQlFTeEZRVUZCTzJ0Q1FVTjRReXh2UWtGQlF5eE5RVUZOTEVWQlFVRXNTVUZCUXl4RlFVRkJPMjlDUVVOT0xHOUNRVUZETEVsQlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1NVRkJRU3hGUVVGSkxFTkJRVU1zV1VGQldTeERRVUZCTEVOQlFVY3NRMEZCUVR0clFrRkRia0lzUTBGQlFTeEZRVUZCTzJ0Q1FVTlVMRzlDUVVGRExFMUJRVTBzUlVGQlFTeEpRVUZETEVWQlFVRTdiMEpCUTA0c2IwSkJRVU1zU1VGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJReXhOUVVGTkxFTkJRVUVzUTBGQlJ5eERRVUZCTEVWQlFVRTdRVUZCUVN4dlFrRkJRU3hoUVVGQk8wRkJRVUVzYTBKQlJXSXNRMEZCUVR0blFrRkRUQ3hEUVVGQk8yZENRVU5PTzJGQlEwZzdRVUZEWWl4RFFVRkRMRU5CUVVNN08wRkJSVVlzVDBGQlR5eEhRVUZITzBWQlExSXNSVUZCUlN4RlFVRkZMRTFCUVUwN1JVRkRWaXhGUVVGRkxFVkJRVVVzVFVGQlRUdEJRVU5hTEVOQlFVTXNRMEZCUXpzN1FVRkZSaXd5UWtGQk1rSXNjVUpCUVVFN1JVRkRla0lzVTBGQlV5eEZRVUZGTzBsQlExUXNTMEZCU3l4RlFVRkZMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zVlVGQlZTeERRVUZETEZGQlFWRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhWUVVGVk8wZEJRemRFTzBWQlEwUXNaVUZCWlN4RlFVRkZMRmxCUVZrN1NVRkRNMElzVDBGQlR6dE5RVU5NTEZWQlFWVXNSVUZCUlN4SlFVRkpPMDFCUTJoQ0xGTkJRVk1zUjBGQlJ5eExRVUZMTzB0QlEyeENMRU5CUVVNN1IwRkRTRHRGUVVORUxHdENRVUZyUWl4RlFVRkZMRmxCUVZrN1NVRkRPVUlzU1VGQlNTeFJRVUZSTEVOQlFVTTdRVUZEYWtJc1NVRkJTU3hKUVVGSkxFMUJRVTBzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRlZCUVZVc1EwRkJRenM3U1VGRmJrTXNTVUZCU1N4RlFVRkZMRTFCUVUwc1JVRkJSVHROUVVOYUxFOUJRVThzUzBGQlN5eERRVUZETzBGQlEyNUNMRXRCUVVzN08wbEJSVVFzVVVGQlVTeEhRVUZITzAxQlExUXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF5eFZRVUZWTEVWQlFVVTdUVUZET1VJc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eFZRVUZWTEVOQlFVTXNWVUZCVlN4RlFVRkZPMEZCUTNaRExFdEJRVXNzUTBGQlF6czdTVUZGUml4UlFVRlJMRU5CUVVNc1VVRkJVU3hGUVVGRkxFTkJRVU1zUzBGQlN5eEZRVUZGTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNN1IwRkRiRU03UlVGRFJDeHBRa0ZCYVVJc1JVRkJSU3haUVVGWk8wbEJRemRDTEVOQlFVTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhGUVVGRkxFTkJRVU1zVlVGQlZTeEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUlVGQlJTeFZRVUZWTEVOQlFVTXNSVUZCUlR0TlFVTTNSQ3hKUVVGSkxFZEJRVWNzUTBGQlF6dEJRVU5rTEUxQlFVMHNTVUZCU1N4VFFVRlRMRWRCUVVjc1QwRkJUeXhEUVVGRExFTkJRVU1zUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXpzN1RVRkZha01zU1VGQlNTeEZRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1ZVRkJWU3hGUVVGRk8xRkJRek5DTEU5QlFVOHNTVUZCU1N4RFFVRkRPMEZCUTNCQ0xFOUJRVTg3TzAxQlJVUXNTVUZCU1N4VFFVRlRMRVZCUVVVN1VVRkRZaXhEUVVGRExFTkJRVU1zWTBGQll5eEZRVUZGTEVOQlFVTTdRVUZETTBJc1QwRkJUenM3UVVGRlVDeE5RVUZOTEVkQlFVY3NSMEZCUnl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExGVkJRVlVzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN08wMUJSVFZETEVsQlFVa3NSMEZCUnl4RlFVRkZPMUZCUTFBc1NVRkJTU3hEUVVGRExHOUNRVUZ2UWl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE8wOUJRMmhETzB0QlEwWXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF6dEhRVU5tTzBWQlEwUXNiMEpCUVc5Q0xFVkJRVVVzV1VGQldUdEpRVU5vUXl4RFFVRkRMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUjBGQlJ5eERRVUZETEVkQlFVY3NSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0SFFVTTNRenRGUVVORUxFMUJRVTBzUlVGQlJTeFpRVUZaTzBGQlEzUkNMRWxCUVVrc1NVRkJTU3hKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETEZWQlFWVXNSVUZCUlN4RFFVRkRPenRKUVVVM1FqdE5RVU5GTEc5Q1FVRkJMRTlCUVUwc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhUUVVGWExFTkJRVUVzUlVGQlFUdFJRVU55UXl4SlFVRkxPMDFCUTBFc1EwRkJRVHROUVVOU08wZEJRMGc3UlVGRFJDeFZRVUZWTEVWQlFVVXNXVUZCV1R0SlFVTjBRaXhKUVVGSkxFbEJRVWtzVFVGQlRTeEZRVUZGTEVOQlFVTTdTVUZEYWtJc1NVRkJTU3hMUVVGTExFdEJRVXNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNN1NVRkRMMElzU1VGQlNTeExRVUZMTEV0QlFVc3NTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEpRVU5xUXl4SlFVRkpMRTlCUVU4c1IwRkJSeXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMGxCUTJwRExFbEJRVWtzU1VGQlNTeE5RVUZOTEVsQlFVa3NRMEZCUXp0QlFVTjJRaXhKUVVGSkxFbEJRVWtzU1VGQlNTeE5RVUZOTEVsQlFVa3NRMEZCUXpzN1NVRkZia0lzUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4VlFVRlZMRWxCUVVrc1JVRkJSU3hMUVVGTExFVkJRVVU3VFVGRGFFTXNTVUZCU1N4WlFVRlpMRU5CUVVNN1RVRkRha0lzU1VGQlNTeFJRVUZSTEVOQlFVTTdUVUZEWWl4SlFVRkpMRTFCUVUwc1ZVRkJWU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZWQlFWVXNTMEZCU3l4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRE8wMUJRM1pFTEVsQlFVa3NVVUZCVVN4UlFVRlJMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeEZRVUZGTEU5QlFVOHNRMEZCUXl4RFFVRkRPMDFCUTJ4RUxFbEJRVWtzUjBGQlJ5eGhRVUZoTEV0QlFVc3NSMEZCUnl4RFFVRkRMRWRCUVVjc1EwRkJReXhIUVVGSExFdEJRVXNzUjBGQlJ5eEZRVUZGTEVOQlFVTTdRVUZEY2tRc1RVRkJUU3hKUVVGSkxGbEJRVmtzUzBGQlN5eEZRVUZGTEVOQlFVTTdPMEZCUlRsQ0xFMUJRVTBzU1VGQlNTeEhRVUZITEV0QlFVc3NRMEZCUXl4RlFVRkZMRU5CUVVNc1MwRkJTeXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZET3p0TlFVVXpRaXhSUVVGUk8xRkJRMDRzYjBKQlFVTXNSVUZCUlN4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlJTeEhRVUZITEVsQlFVa3NUVUZCVFN4SFFVRkhMRk5CUVZNc1IwRkJSeXhGUVVGRkxFTkJRVU1zUlVGQlF5eERRVUZETEVkQlFVRXNSVUZCUnl4RFFVRkZMRWxCUVVrc1EwRkJReXhIUVVGSExFVkJRVU1zUTBGQlF5eEhRVUZCTEVWQlFVY3NRMEZCUlN4SlFVRkpMRU5CUVVNc1IwRkJSeXhGUVVGRExFTkJRVU1zVDBGQlFTeEZRVUZQTEVOQlFVVXNTVUZCU1N4RFFVRkRMRzlDUVVGdlFpeERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRVZCUVVVc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlJ5eERRVUZCTEVWQlFVRTdWVUZEY0Vrc1VVRkJVenRSUVVOUUxFTkJRVUU3UVVGRFlpeFBRVUZQTEVOQlFVTTdPMEZCUlZJc1RVRkJUU3hKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPenROUVVWd1FpeEpRVUZKTEUxQlFVMHNSVUZCUlR0UlFVTldMRmxCUVZrc1IwRkJSenRWUVVOaUxGTkJRVk1zUjBGQlJ5eEhRVUZITzFWQlEyWXNTMEZCU3l4UFFVRlBMRWxCUVVrN1ZVRkRhRUlzU1VGQlNTeFJRVUZSTEVsQlFVazdWVUZEYUVJc1NVRkJTU3hSUVVGUkxFbEJRVWtzU1VGQlNTeEpRVUZKTEVOQlFVTXNSMEZCUnp0VlFVTTFRaXhSUVVGUkxFbEJRVWtzU1VGQlNTeERRVUZETEc5Q1FVRnZRanRWUVVOeVF5eFZRVUZWTEVWQlFVVXNTVUZCU1N4RFFVRkRMR1ZCUVdVN1ZVRkRhRU1zUjBGQlJ5eFRRVUZUTEVsQlFVa3NRMEZCUXl4SFFVRkhMRWRCUVVjc1UwRkJVenRWUVVOb1F5eEhRVUZITEZOQlFWTXNXVUZCV1R0VlFVTjRRaXhUUVVGVExFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4VFFVRlRPMEZCUXpGRExGTkJRVk1zUTBGQlF6czdVVUZGUml4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExHOUNRVUZETEZWQlFWVXNSVUZCUVN4blFrRkJRU3hIUVVGQkxFTkJRVVVzUjBGQlJ5eFpRVUZoTEVOQlFVRXNRMEZCUnl4RFFVRkJMRU5CUVVNc1EwRkJRenRCUVVOd1JDeFBRVUZQT3p0TlFVVkVMRWxCUVVrc1IwRkJSeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETzBGQlEzUkNMRXRCUVVzc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6czdTVUZGVkN4UFFVRlBMRWxCUVVrc1EwRkJRenRIUVVOaU8wVkJRMFFzVTBGQlV5eEZRVUZGTEZWQlFWVXNTVUZCU1N4RlFVRkZMRTlCUVU4c1JVRkJSVHRKUVVOc1F5eEpRVUZKTEVsQlFVa3NRMEZCUXp0SlFVTlVMRWxCUVVrc1MwRkJTeXhEUVVGRE8wRkJRMlFzU1VGQlNTeEpRVUZKTEUxQlFVMHNSMEZCUnl4RlFVRkZMRU5CUVVNN08wbEJSV2hDTEU5QlFVOHNUMEZCVHl4RlFVRkZPMDFCUTJRc1NVRkJTU3hIUVVGSExFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1RVRkRNMElzU1VGQlNTeEhRVUZITEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03UVVGRGFrTXNUVUZCVFN4TFFVRkxMRWRCUVVjc1dVRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEZsQlFWa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeEZRVUZGTEVsQlFVa3NSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenM3VFVGRmVFVXNUVUZCVFN4RFFVRkRMRWxCUVVrN1VVRkRWQ3h2UWtGQlF5eEZRVUZGTEVWQlFVRXNRMEZCUVN4RFFVRkRMRXRCUVVFc1JVRkJTeXhEUVVGRkxFbEJRVWtzUlVGQlF5eERRVUZETEUxQlFVRXNSVUZCVFN4RFFVRkZMRTlCUVU4c1JVRkJReXhEUVVGRExFZEJRVUVzUlVGQlJ5eERRVUZGTEU5QlFVOHNRMEZCUXl4SFFVRkxMRU5CUVVFc1JVRkJRVHRWUVVOcVJDeExRVUZOTzFGQlEwb3NRMEZCUVR0QlFVTmlMRTlCUVU4c1EwRkJRenM3VFVGRlJpeFBRVUZQTEVkQlFVY3NUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJRenRCUVVNM1FpeExRVUZMT3p0SlFVVkVMRTlCUVU4c1RVRkJUU3hEUVVGRE8wZEJRMlk3UlVGRFJDeHZRa0ZCYjBJc1JVRkJSU3hWUVVGVkxFZEJRVWNzUlVGQlJTeFRRVUZUTEVWQlFVVTdTVUZET1VNc1NVRkJTU3hQUVVGUExFOUJRVThzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4VlFVRlZMRU5CUVVNN1NVRkRlRU1zU1VGQlNTeFhRVUZYTEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUTNoQ0xFbEJRVWtzU1VGQlNTeFJRVUZSTEUxQlFVMHNRMEZCUXl4RFFVRkRPenRKUVVWd1FpeEpRVUZKTEU5QlFVOHNTMEZCU3l4SFFVRkhMRVZCUVVVN1RVRkRia0lzUjBGQlJ5eEhRVUZITEVsQlFVa3NRMEZCUXp0QlFVTnFRaXhMUVVGTE96dEpRVVZFTEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNN1RVRkRXaXhWUVVGVkxFVkJRVVVzUjBGQlJ6dE5RVU5tTEZOQlFWTXNSMEZCUnl4VFFVRlRMRXRCUVVzc1NVRkJTVHROUVVNNVFpeFJRVUZSTEVsQlFVa3NSMEZCUnl4SFFVRkhMRTlCUVU4c1IwRkJSeXhKUVVGSk8wdEJRMnBETEVOQlFVTXNRMEZCUXp0SFFVTktPMFZCUTBRc1pVRkJaU3hGUVVGRkxGbEJRVms3U1VGRE0wSXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExGTkJRVk1zUlVGQlJTeEZRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zUTBGQlF6dEhRVU53UkR0QlFVTklMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZJTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1MwRkJTeXhEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeW9xWEc0Z0tpQkFhbk40SUZKbFlXTjBMa1JQVFZ4dUlDb3ZYRzVjYm5aaGNpQlVZbTlrZVR0Y2JuWmhjaUJyWlhsZmJXRndPMXh1ZG1GeUlDUWdJQ0FnSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duYW5GMVpYSjVKeWs3WEc1MllYSWdVbVZoWTNRZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQ2NwTzF4dWRtRnlJRUpoWTJ0aWIyNWxJQ0FnSUQwZ2NtVnhkV2x5WlNnblltRmphMkp2Ym1VbktUdGNiblpoY2lCVFkzSnZiR3hsY2lBZ0lDQTlJSEpsY1hWcGNtVW9KeTR1TDNWMGFXeHpMM05qY205c2JHVnlYMk52WVhOMFpYSW5LVHRjYm5aaGNpQkNkWFIwYjI0Z0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dlluVjBkRzl1TG1wemVDY3BPMXh1ZG1GeUlGUnlJQ0FnSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duTGk5MGNpNXFjM2duS1R0Y2JuWmhjaUJVWkNBZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHZkR1F1YW5ONEp5azdYRzUyWVhJZ1NXTnZiaUFnSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2N1TDJsamIyNHVhbk40SnlrN1hHNTJZWElnVW05M1JHVjBZV2xzY3lBZ1BTQnlaWEYxYVhKbEtDY3VMaTl0YjJSMWJHVnpMM2RsYkd4ZlozSnBaQzloWTNScGRtVmZjbTkzWDJSbGRHRnBiSE11YW5ONEp5azdYRzUyWVhJZ2JXOXRaVzUwSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2R0YjIxbGJuUW5LVHRjYmx4dUx5b3FYRzRnS2lCRllXTm9JSFJ5WVc1elptOXliV1Z5SUhOb2IzVnNaQ0IzWld4c0lHRnVaQ0JoZEhSeVgyNWhiV1VnY0dGeVlXMXpYRzRnS2k5Y2JuWmhjaUIwY21GdWMyWnZjbTFsY25NZ1BTQjdYRzRnSUhOMGNtbHVaem9nSUNCbWRXNWpkR2x2YmlBb2QyVnNiQ3dnYm1GdFpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2QyVnNiQzVuWlhRb2JtRnRaU2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlMRnh1SUNCa1lYUmxPaUFnSUNBZ1puVnVZM1JwYjI0Z0tIZGxiR3dzSUc1aGJXVXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHMXZiV1Z1ZENoM1pXeHNMbWRsZENodVlXMWxLU2t1Wm05eWJXRjBLQ2ROVFUwZ1JDd2dXVmxaV1NCb09tMXRPbk56WVNjcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlN4Y2JpQWdjM1JoZEhWek9pQWdJR1oxYm1OMGFXOXVJQ2gzWld4c0xDQnVZVzFsS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUFvUEVsamIyNGdkSGx3WlQxY0ltTm9aV05yWENJZ0x6NHBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTeGNiaUFnWVdOMGFXOXVjem9nSUdaMWJtTjBhVzl1SUNoM1pXeHNMQ0J1WVcxbEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKaWRYUjBiMjR0WjNKdmRYQWdZblYwZEc5dUxXUnliM0JjSWo1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeENkWFIwYjI0K1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHhKWTI5dUlIUjVjR1U5WENKallYSmxkQzFrYjNkdVhDSWdMejVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlFuVjBkRzl1UGx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BFSjFkSFJ2Ymo1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQRWxqYjI0Z2RIbHdaVDFjSW5Cc2RYTmNJaUF2UGx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQkRjbVZoZEdVZ1EyRnpaVnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5Q2RYUjBiMjQrWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDazdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNTlPMXh1WEc1clpYbGZiV0Z3SUQwZ2UxeHVJQ0F6T0RvZ0ozQnlaWFluTEZ4dUlDQTBNRG9nSjI1bGVIUW5YRzU5TzF4dVhHNVVZbTlrZVNBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNiaUFnY0hKdmNGUjVjR1Z6T2lCN1hHNGdJQ0FnYzNSdmNtVTZJRkpsWVdOMExsQnliM0JVZVhCbGN5NXBibk4wWVc1alpVOW1LRUpoWTJ0aWIyNWxMazF2WkdWc0tTNXBjMUpsY1hWcGNtVmtYRzRnSUgwc1hHNGdJR2RsZEVsdWFYUnBZV3hUZEdGMFpUb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjdYRzRnSUNBZ0lDQmhZM1JwZG1WWFpXeHNPaUJ1ZFd4c0xGeHVJQ0FnSUNBZ2JXbHVhVzFwZW1Wa09pQWdabUZzYzJWY2JpQWdJQ0I5TzF4dUlDQjlMRnh1SUNCamIyMXdiMjVsYm5SRWFXUlZjR1JoZEdVNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnWld4bGJXVnVkSE03WEc0Z0lDQWdkbUZ5SUdGamRHbDJaU0E5SUhSb2FYTXVjM1JoZEdVdVlXTjBhWFpsVjJWc2JEdGNibHh1SUNBZ0lHbG1JQ2doSUdGamRHbDJaU2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR1poYkhObE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdWc1pXMWxiblJ6SUQwZ1cxeHVJQ0FnSUNBZ2RHaHBjeTV5WldaelcyRmpkR2wyWlYwdVoyVjBSRTlOVG05a1pTZ3BMRnh1SUNBZ0lDQWdkR2hwY3k1eVpXWnpMbUZqZEdsMlpWZGxiR3d1WjJWMFJFOU5UbTlrWlNncFhHNGdJQ0FnWFR0Y2JseHVJQ0FnSUZOamNtOXNiR1Z5S0dWc1pXMWxiblJ6TENCN2MzUmxjSE02SURJMU1IMHBPMXh1SUNCOUxGeHVJQ0JqYjIxd2IyNWxiblJFYVdSTmIzVnVkRG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUNRb1pHOWpkVzFsYm5RcExtOXVLQ2RyWlhsa2IzZHVMaWNnS3lCMGFHbHpMbkJ5YjNCekxuTjBiM0psTG1OcFpDd2dablZ1WTNScGIyNGdLR1VwSUh0Y2JpQWdJQ0FnSUhaaGNpQmphV1E3WEc0Z0lDQWdJQ0IyWVhJZ1pHbHlaV04wYVc5dUlEMGdhMlY1WDIxaGNGdGxMbmRvYVdOb1hUdGNibHh1SUNBZ0lDQWdhV1lnS0NFZ2RHaHBjeTV6ZEdGMFpTNWhZM1JwZG1WWFpXeHNLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUIwY25WbE8xeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnBaaUFvWkdseVpXTjBhVzl1S1NCN1hHNGdJQ0FnSUNBZ0lHVXVjSEpsZG1WdWRFUmxabUYxYkhRb0tUdGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdZMmxrSUQwZ2RHaHBjeTV5WldaekxtRmpkR2wyWlZkbGJHd3VjSEp2Y0hOYlpHbHlaV04wYVc5dVhUdGNibHh1SUNBZ0lDQWdhV1lnS0dOcFpDa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxsOW9ZVzVrYkdWWFpXeHNVMlZzWldOMGFXOXVLR05wWkNrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlM1aWFXNWtLSFJvYVhNcEtUdGNiaUFnZlN4Y2JpQWdZMjl0Y0c5dVpXNTBWMmxzYkZWdWJXOTFiblE2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNBa0tHUnZZM1Z0Wlc1MEtTNXZabVlvSnk0bklDc2dkR2hwY3k1d2NtOXdjeTV6ZEc5eVpTNWphV1FwTzF4dUlDQjlMRnh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMllYSWdjbTkzY3lBOUlIUm9hWE11WDJKMWFXeGtVbTkzY3lncE8xeHVYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4MFltOWtlU0JqYkdGemMwNWhiV1U5ZTNSb2FYTXVjSEp2Y0hNdVkyeGhjM05PWVcxbGZUNWNiaUFnSUNBZ0lDQWdlM0p2ZDNOOVhHNGdJQ0FnSUNBOEwzUmliMlI1UGx4dUlDQWdJQ2s3WEc0Z0lIMHNYRzRnSUY5aWRXbHNaRkp2ZDNNNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnWkdGMFlTQWdJQ0E5SUZ0ZE8xeHVJQ0FnSUhaaGNpQnpkRzl5WlNBZ0lEMGdkR2hwY3k1d2NtOXdjeTV6ZEc5eVpUdGNiaUFnSUNCMllYSWdkMlZzYkhNZ0lDQTlJSE4wYjNKbExtZGxkQ2duZDJWc2JITW5LVHRjYmlBZ0lDQjJZWElnYUdWaFpHbHVaeUE5SUhOMGIzSmxMbWRsZENnblptbHljM1FuS1R0Y2JpQWdJQ0IyWVhJZ2NISmxkaUFnSUNBOUlHNTFiR3c3WEc0Z0lDQWdkbUZ5SUc1bGVIUWdJQ0FnUFNCdWRXeHNPMXh1WEc0Z0lDQWdkMlZzYkhNdVpXRmphQ2htZFc1amRHbHZiaUFvZDJWc2JDd2dhVzVrWlhncElIdGNiaUFnSUNBZ0lIWmhjaUJ6Wld4bFkzUmxaRjl5YjNjN1hHNGdJQ0FnSUNCMllYSWdkMlZzYkY5eWIzYzdYRzRnSUNBZ0lDQjJZWElnWVdOMGFYWmxJQ0FnSUNBZ0lDQTlJSFJvYVhNdWMzUmhkR1V1WVdOMGFYWmxWMlZzYkNBOVBUMGdkMlZzYkM1amFXUTdYRzRnSUNBZ0lDQjJZWElnWTI5dWRHVnVkSE1nSUNBZ0lDQTlJSFJvYVhNdVgySjFhV3hrVW05M0tIZGxiR3dzSUdobFlXUnBibWNwTzF4dUlDQWdJQ0FnZG1GeUlHOWtaQ0FnSUNBZ0lDQWdJQ0FnUFNCcGJtUmxlQ0FsSURJZ1BpQXdJRDhnSjI5a1pDY2dPaUFuSnp0Y2JpQWdJQ0FnSUhaaGNpQmhZM1JwZG1WZmNISnZjSE1nSUNBOUlIdDlPMXh1WEc0Z0lDQWdJQ0J1WlhoMElEMGdkMlZzYkhNdVlYUW9hVzVrWlhnZ0t5QXhLVHRjYmx4dUlDQWdJQ0FnZDJWc2JGOXliM2NnUFNBb1hHNGdJQ0FnSUNBZ0lEeFVjaUJqYkdGemMwNWhiV1U5ZTI5a1pDQXJJQ2hoWTNScGRtVWdQeUFuSUdGamRHbDJaU2NnT2lBbkp5bDlJSEpsWmoxN2QyVnNiQzVqYVdSOUlHdGxlVDE3ZDJWc2JDNWphV1I5SUc5dVEyeHBZMnM5ZTNSb2FYTXVYMmhoYm1Sc1pWZGxiR3hUWld4bFkzUnBiMjR1WW1sdVpDaDBhR2x6TENCM1pXeHNMbU5wWkNsOVBseHVJQ0FnSUNBZ0lDQWdJSHRqYjI1MFpXNTBjMzFjYmlBZ0lDQWdJQ0FnUEM5VWNqNWNiaUFnSUNBZ0lDazdYRzVjYmlBZ0lDQWdJR1JoZEdFdWNIVnphQ2gzWld4c1gzSnZkeWs3WEc1Y2JpQWdJQ0FnSUdsbUlDaGhZM1JwZG1VcElIdGNiaUFnSUNBZ0lDQWdZV04wYVhabFgzQnliM0J6SUQwZ2UxeHVJQ0FnSUNBZ0lDQWdJR05zWVhOelRtRnRaVG9nSUc5a1pDeGNiaUFnSUNBZ0lDQWdJQ0J6ZEc5eVpUb2dJQ0FnSUNCM1pXeHNMRnh1SUNBZ0lDQWdJQ0FnSUhCeVpYWTZJQ0FnSUNBZ0lIQnlaWFlzWEc0Z0lDQWdJQ0FnSUNBZ2JtVjRkRG9nSUNBZ0lDQWdibVY0ZENBbUppQnVaWGgwTG1OcFpDeGNiaUFnSUNBZ0lDQWdJQ0J6ZDJsMFkyaGxjam9nSUNCMGFHbHpMbDlvWVc1a2JHVlhaV3hzVTJWc1pXTjBhVzl1TEZ4dUlDQWdJQ0FnSUNBZ0lITnBlbVZVYjJkbmJHVTZJSFJvYVhNdVgzUnZaMmRzWlUxcGJtbHRhWHBsTEZ4dUlDQWdJQ0FnSUNBZ0lHdGxlVG9nSUNBZ0lDQWdJSGRsYkd3dVkybGtJQ3NnSnkxaFkzUnBkbVVuTEZ4dUlDQWdJQ0FnSUNBZ0lISmxaam9nSUNBZ0lDQWdJQ2RoWTNScGRtVlhaV3hzSnl4Y2JpQWdJQ0FnSUNBZ0lDQnRhVzVwYldsNlpXUTZJQ0IwYUdsekxuTjBZWFJsTG0xcGJtbHRhWHBsWkZ4dUlDQWdJQ0FnSUNCOU8xeHVYRzRnSUNBZ0lDQWdJR1JoZEdFdWNIVnphQ2c4VW05M1JHVjBZV2xzY3lCN0xpNHVZV04wYVhabFgzQnliM0J6ZlNBdlBpazdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSEJ5WlhZZ1BTQjNaV3hzTG1OcFpEdGNiaUFnSUNCOUxDQjBhR2x6S1R0Y2JseHVJQ0FnSUhKbGRIVnliaUJrWVhSaE8xeHVJQ0I5TEZ4dUlDQmZZblZwYkdSU2IzYzZJR1oxYm1OMGFXOXVJQ2gzWld4c0xDQm9aV0ZrYVc1bktTQjdYRzRnSUNBZ2RtRnlJRzVoYldVN1hHNGdJQ0FnZG1GeUlIWmhiSFZsTzF4dUlDQWdJSFpoY2lCbWFXVnNaSE1nUFNCYlhUdGNibHh1SUNBZ0lIZG9hV3hsSUNob1pXRmthVzVuS1NCN1hHNGdJQ0FnSUNCdVlXMWxJRDBnYUdWaFpHbHVaeTVuWlhRb0oyNWhiV1VuS1R0Y2JpQWdJQ0FnSUhSNWNHVWdQU0JvWldGa2FXNW5MbWRsZENnbmRIbHdaU2NwTzF4dUlDQWdJQ0FnZG1Gc2RXVWdQU0IwY21GdWMyWnZjbTFsY25OYmRIbHdaVjBnSmlZZ2RISmhibk5tYjNKdFpYSnpXM1I1Y0dWZExtTmhiR3dvZEdocGN5d2dkMlZzYkN3Z2JtRnRaU2s3WEc1Y2JpQWdJQ0FnSUdacFpXeGtjeTV3ZFhOb0tGeHVJQ0FnSUNBZ0lDQThWR1FnYzNSdmNtVTllM2RsYkd4OUlHTnZiSFZ0YmoxN2FHVmhaR2x1WjMwZ2EyVjVQWHRvWldGa2FXNW5MbU5wWkgwK1hHNGdJQ0FnSUNBZ0lDQWdlM1poYkhWbGZWeHVJQ0FnSUNBZ0lDQThMMVJrUGx4dUlDQWdJQ0FnS1R0Y2JseHVJQ0FnSUNBZ2FHVmhaR2x1WnlBOUlHaGxZV1JwYm1jdWJtVjRkRHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnlaWFIxY200Z1ptbGxiR1J6TzF4dUlDQjlMRnh1SUNCZmFHRnVaR3hsVjJWc2JGTmxiR1ZqZEdsdmJqb2dablZ1WTNScGIyNGdLR05wWkN3Z2FXNWpjbVZ0Wlc1MEtTQjdYRzRnSUNBZ2RtRnlJR04xY25KbGJuUWdJQ0FnSUQwZ2RHaHBjeTV6ZEdGMFpTNWhZM1JwZG1WWFpXeHNPMXh1SUNBZ0lIWmhjaUJqZFhKeVpXNTBYM1J2Y0NBOUlEQTdYRzRnSUNBZ2RtRnlJRzVsZUhSZmRHOXdJQ0FnSUQwZ01EdGNibHh1SUNBZ0lHbG1JQ2hqZFhKeVpXNTBJRDA5UFNCamFXUXBJSHRjYmlBZ0lDQWdJR05wWkNBOUlHNTFiR3c3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdkR2hwY3k1elpYUlRkR0YwWlNoN1hHNGdJQ0FnSUNCaFkzUnBkbVZYWld4c09pQmphV1FzWEc0Z0lDQWdJQ0JwYm1OeVpXMWxiblE2SUNCcGJtTnlaVzFsYm5RZ1BUMDlJSFJ5ZFdVc1hHNGdJQ0FnSUNCd2NtVjJhVzkxY3pvZ0lDQmphV1FnUHlCamRYSnlaVzUwSURvZ2JuVnNiRnh1SUNBZ0lIMHBPMXh1SUNCOUxGeHVJQ0JmZEc5bloyeGxUV2x1YVcxcGVtVTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdHRhVzVwYldsNlpXUTZJQ0VnZEdocGN5NXpkR0YwWlM1dGFXNXBiV2w2WldSOUtUdGNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVkdKdlpIazdYRzRpWFgwPSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgVGQ7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG5UZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZFwiLFxuICBtaXhpbnM6IFtSZWFjdC5hZGRvbnMuUHVyZVJlbmRlck1peGluXSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgdGhpcy5wcm9wcyksIFxuICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMk52YlhCdmJtVnVkSE12ZEdRdWFuTjRJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCT3p0QlFVVkJMRWRCUVVjN08wRkJSVWdzU1VGQlNTeEZRVUZGTEVOQlFVTTdRVUZEVUN4SlFVRkpMRXRCUVVzc1IwRkJSeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdPMEZCUlRkQ0xIZENRVUYzUWl4clFrRkJRVHRGUVVOMFFpeE5RVUZOTEVWQlFVVXNRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExHVkJRV1VzUTBGQlF6dEJRVU40UXl4RlFVRkZMRTFCUVUwc1JVRkJSU3haUVVGWk96dEpRVVZzUWp0TlFVTkZMRzlDUVVGQkxFbEJRVWNzUlVGQlFTeG5Ra0ZCUVN4SFFVRkJMRU5CUVVVc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlR5eERRVUZCTEVWQlFVRTdVVUZEYWtJc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFJRVUZUTzAxQlEyeENMRU5CUVVFN1RVRkRURHRIUVVOSU8wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eEZRVUZGTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRlJrTzF4dWRtRnlJRkpsWVdOMElEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRbktUdGNibHh1VkdRZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUcxcGVHbHVjem9nVzFKbFlXTjBMbUZrWkc5dWN5NVFkWEpsVW1WdVpHVnlUV2w0YVc1ZExGeHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JseHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4ZEdRZ2V5NHVMblJvYVhNdWNISnZjSE45UGx4dUlDQWdJQ0FnSUNCN2RHaHBjeTV3Y205d2N5NWphR2xzWkhKbGJuMWNiaUFnSUNBZ0lEd3ZkR1ErWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1ZHUTdYRzRpWFgwPSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgVGg7XG52YXIgUmVhY3QgICAgICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBCYWNrYm9uZSAgICAgICAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyIFNvcnRJbmRpY2F0b3IgICA9IHJlcXVpcmUoJy4vc29ydF9pbmRpY2F0b3IuanN4Jyk7XG5cblRoID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRoXCIsXG4gIHByb3BUeXBlczoge1xuICAgIHRyaWdnZXJTb3J0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjbGFzc2VzID0gW3RoaXMucHJvcHMuY2xhc3NOYW1lIHx8ICcnXTtcbiAgICB2YXIgc29ydF9pbmRpY2F0b3IgPSBudWxsO1xuICAgIHZhciBuZXdfcHJvcHMgPSB7c3R5bGU6e319O1xuXG4gICAgaWYgKHRoaXMucHJvcHMudHJpZ2dlclNvcnQgfHwgdGhpcy5wcm9wcy5zb3J0RGlyZWN0aW9uKSB7XG4gICAgICBjbGFzc2VzLnB1c2goJ3NvcnRhYmxlJyk7XG5cbiAgICAgIHNvcnRfaW5kaWNhdG9yID0gUmVhY3QuY3JlYXRlRWxlbWVudChTb3J0SW5kaWNhdG9yLCB7ZGlyZWN0aW9uOiB0aGlzLnByb3BzLnNvcnREaXJlY3Rpb259KVxuICAgIH1cblxuICAgIFsnbWluaW1hbCcsICdsb2NrZWQnLCAncmVzaXphYmxlJ10uZm9yRWFjaChmdW5jdGlvbiAodmFsKSB7XG4gICAgICBpZiAodGhpcy5wcm9wc1t2YWxdKSB7XG4gICAgICAgIGNsYXNzZXMucHVzaCh2YWwpO1xuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMud2lkdGgpIHtcbiAgICAgIG5ld19wcm9wcy5zdHlsZS53aWR0aCA9IHRoaXMucHJvcHMud2lkdGg7XG4gICAgfVxuXG4gICAgbmV3X3Byb3BzLmNsYXNzTmFtZSA9IGNsYXNzZXMubGVuZ3RoID4gMSA/IGNsYXNzZXMuam9pbignICcpIDogY2xhc3Nlc1swXTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgUmVhY3QuX19zcHJlYWQoe30sICBuZXdfcHJvcHMsIHtvbkNsaWNrOiB0aGlzLl9oYW5kbGVDbGlja30pLCBcbiAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlbiwgXG4gICAgICAgIHNvcnRfaW5kaWNhdG9yXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgX2hhbmRsZUNsaWNrOiBmdW5jdGlvbiAoZSkge1xuICAgIGlmICh0aGlzLnByb3BzLmhhbmRsZUNsaWNrKSB7XG4gICAgICB0aGlzLnByb3BzLmhhbmRsZUNsaWNrKGUpO1xuICAgIH1cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGg7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMk52YlhCdmJtVnVkSE12ZEdndWFuTjRJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCT3p0QlFVVkJMRWRCUVVjN08wRkJSVWdzU1VGQlNTeEZRVUZGTEVOQlFVTTdRVUZEVUN4SlFVRkpMRXRCUVVzc1lVRkJZU3hQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdRVUZEZGtNc1NVRkJTU3hSUVVGUkxGVkJRVlVzVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPMEZCUXpGRExFbEJRVWtzWVVGQllTeExRVUZMTEU5QlFVOHNRMEZCUXl4elFrRkJjMElzUTBGQlF5eERRVUZET3p0QlFVVjBSQ3gzUWtGQmQwSXNhMEpCUVVFN1JVRkRkRUlzVTBGQlV5eEZRVUZGTzBsQlExUXNWMEZCVnl4RlFVRkZMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zVFVGQlRUdEhRVU53UXp0RlFVTkVMRTFCUVUwc1JVRkJSU3haUVVGWk8wbEJRMnhDTEVsQlFVa3NUMEZCVHl4SFFVRkhMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVsQlFVa3NSVUZCUlN4RFFVRkRMRU5CUVVNN1NVRkRNME1zU1VGQlNTeGpRVUZqTEVkQlFVY3NTVUZCU1N4RFFVRkRPMEZCUXpsQ0xFbEJRVWtzU1VGQlNTeFRRVUZUTEVkQlFVY3NRMEZCUXl4TFFVRkxMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU03TzBsQlJUTkNMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFhRVUZYTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhoUVVGaExFVkJRVVU3UVVGRE5VUXNUVUZCVFN4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZET3p0TlFVVjZRaXhqUVVGakxFZEJRVWNzYjBKQlFVTXNZVUZCWVN4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMR0ZCUVdNc1EwRkJRU3hEUVVGSExFTkJRVUU3UVVGRE4wVXNTMEZCU3pzN1NVRkZSQ3hEUVVGRExGTkJRVk1zUlVGQlJTeFJRVUZSTEVWQlFVVXNWMEZCVnl4RFFVRkRMRU5CUVVNc1QwRkJUeXhEUVVGRExGVkJRVlVzUjBGQlJ5eEZRVUZGTzAxQlEzaEVMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlR0UlFVTnVRaXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPMDlCUTI1Q08wRkJRMUFzUzBGQlN5eEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPenRKUVVWVUxFbEJRVWtzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRVZCUVVVN1RVRkRjRUlzVTBGQlV5eERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTTdRVUZETDBNc1MwRkJTenM3UVVGRlRDeEpRVUZKTEZOQlFWTXNRMEZCUXl4VFFVRlRMRWRCUVVjc1QwRkJUeXhEUVVGRExFMUJRVTBzUjBGQlJ5eERRVUZETEVkQlFVY3NUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUjBGQlJ5eFBRVUZQTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN08wbEJSVEZGTzAxQlEwVXNiMEpCUVVFc1NVRkJSeXhGUVVGQkxHZENRVUZCTEVkQlFVRXNRMEZCUlN4SFFVRkhMRk5CUVZNc1JVRkJReXhEUVVGRExFTkJRVUVzVDBGQlFTeEZRVUZQTEVOQlFVVXNTVUZCU1N4RFFVRkRMRmxCUVdNc1EwRkJRU3hEUVVGQkxFVkJRVUU3VVVGRE5VTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGUkxFVkJRVU03VVVGRGNFSXNZMEZCWlR0TlFVTmlMRU5CUVVFN1RVRkRURHRIUVVOSU8wVkJRMFFzV1VGQldTeEZRVUZGTEZWQlFWVXNRMEZCUXl4RlFVRkZPMGxCUTNwQ0xFbEJRVWtzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4WFFVRlhMRVZCUVVVN1RVRkRNVUlzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UzBGRE0wSTdSMEZEUmp0QlFVTklMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZJTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1JVRkJSU3hEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeW9xWEc0Z0tpQkFhbk40SUZKbFlXTjBMa1JQVFZ4dUlDb3ZYRzVjYm5aaGNpQlVhRHRjYm5aaGNpQlNaV0ZqZENBZ0lDQWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDZHlaV0ZqZENjcE8xeHVkbUZ5SUVKaFkydGliMjVsSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSjJKaFkydGliMjVsSnlrN1hHNTJZWElnVTI5eWRFbHVaR2xqWVhSdmNpQWdJRDBnY21WeGRXbHlaU2duTGk5emIzSjBYMmx1WkdsallYUnZjaTVxYzNnbktUdGNibHh1VkdnZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUhCeWIzQlVlWEJsY3pvZ2UxeHVJQ0FnSUhSeWFXZG5aWEpUYjNKME9pQlNaV0ZqZEM1UWNtOXdWSGx3WlhNdWMzUnlhVzVuWEc0Z0lIMHNYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQmpiR0Z6YzJWeklEMGdXM1JvYVhNdWNISnZjSE11WTJ4aGMzTk9ZVzFsSUh4OElDY25YVHRjYmlBZ0lDQjJZWElnYzI5eWRGOXBibVJwWTJGMGIzSWdQU0J1ZFd4c08xeHVJQ0FnSUhaaGNpQnVaWGRmY0hKdmNITWdQU0I3YzNSNWJHVTZlMzE5TzF4dVhHNGdJQ0FnYVdZZ0tIUm9hWE11Y0hKdmNITXVkSEpwWjJkbGNsTnZjblFnZkh3Z2RHaHBjeTV3Y205d2N5NXpiM0owUkdseVpXTjBhVzl1S1NCN1hHNGdJQ0FnSUNCamJHRnpjMlZ6TG5CMWMyZ29KM052Y25SaFlteGxKeWs3WEc1Y2JpQWdJQ0FnSUhOdmNuUmZhVzVrYVdOaGRHOXlJRDBnUEZOdmNuUkpibVJwWTJGMGIzSWdaR2x5WldOMGFXOXVQWHQwYUdsekxuQnliM0J6TG5OdmNuUkVhWEpsWTNScGIyNTlJQzgrWEc0Z0lDQWdmVnh1WEc0Z0lDQWdXeWR0YVc1cGJXRnNKeXdnSjJ4dlkydGxaQ2NzSUNkeVpYTnBlbUZpYkdVblhTNW1iM0pGWVdOb0tHWjFibU4wYVc5dUlDaDJZV3dwSUh0Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG5CeWIzQnpXM1poYkYwcElIdGNiaUFnSUNBZ0lDQWdZMnhoYzNObGN5NXdkWE5vS0haaGJDazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTd2dkR2hwY3lrN1hHNWNiaUFnSUNCcFppQW9kR2hwY3k1d2NtOXdjeTUzYVdSMGFDa2dlMXh1SUNBZ0lDQWdibVYzWDNCeWIzQnpMbk4wZVd4bExuZHBaSFJvSUQwZ2RHaHBjeTV3Y205d2N5NTNhV1IwYUR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0J1WlhkZmNISnZjSE11WTJ4aGMzTk9ZVzFsSUQwZ1kyeGhjM05sY3k1c1pXNW5kR2dnUGlBeElEOGdZMnhoYzNObGN5NXFiMmx1S0NjZ0p5a2dPaUJqYkdGemMyVnpXekJkTzF4dVhHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHgwYUNCN0xpNHVibVYzWDNCeWIzQnpmU0J2YmtOc2FXTnJQWHQwYUdsekxsOW9ZVzVrYkdWRGJHbGphMzArWEc0Z0lDQWdJQ0FnSUh0MGFHbHpMbkJ5YjNCekxtTm9hV3hrY21WdWZWeHVJQ0FnSUNBZ0lDQjdjMjl5ZEY5cGJtUnBZMkYwYjNKOVhHNGdJQ0FnSUNBOEwzUm9QbHh1SUNBZ0lDazdYRzRnSUgwc1hHNGdJRjlvWVc1a2JHVkRiR2xqYXpvZ1puVnVZM1JwYjI0Z0tHVXBJSHRjYmlBZ0lDQnBaaUFvZEdocGN5NXdjbTl3Y3k1b1lXNWtiR1ZEYkdsamF5a2dlMXh1SUNBZ0lDQWdkR2hwY3k1d2NtOXdjeTVvWVc1a2JHVkRiR2xqYXlobEtUdGNiaUFnSUNCOVhHNGdJSDFjYm4wcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRlJvTzF4dUlsMTkiLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFRyO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuVHIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVHJcIixcbiAgbWl4aW5zOiBbUmVhY3QuYWRkb25zLlB1cmVSZW5kZXJNaXhpbl0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgUmVhY3QuX19zcHJlYWQoe30sICB0aGlzLnByb3BzKSwgXG4gICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW5cbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyTnZiWEJ2Ym1WdWRITXZkSEl1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPenRCUVVWQkxFZEJRVWM3TzBGQlJVZ3NTVUZCU1N4RlFVRkZMRU5CUVVNN1FVRkRVQ3hKUVVGSkxFdEJRVXNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN08wRkJSVGRDTEhkQ1FVRjNRaXhyUWtGQlFUdEZRVU4wUWl4TlFVRk5MRVZCUVVVc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETEdWQlFXVXNRMEZCUXp0RlFVTjBReXhOUVVGTkxFVkJRVVVzV1VGQldUdEpRVU5zUWp0TlFVTkZMRzlDUVVGQkxFbEJRVWNzUlVGQlFTeG5Ra0ZCUVN4SFFVRkJMRU5CUVVVc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlR5eERRVUZCTEVWQlFVRTdVVUZEYWtJc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFJRVUZUTzAxQlEyeENMRU5CUVVFN1RVRkRURHRIUVVOSU8wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eEZRVUZGTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRlJ5TzF4dWRtRnlJRkpsWVdOMElEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRbktUdGNibHh1VkhJZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUcxcGVHbHVjem9nVzFKbFlXTjBMbUZrWkc5dWN5NVFkWEpsVW1WdVpHVnlUV2w0YVc1ZExGeHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQSFJ5SUhzdUxpNTBhR2x6TG5CeWIzQnpmVDVjYmlBZ0lDQWdJQ0FnZTNSb2FYTXVjSEp2Y0hNdVkyaHBiR1J5Wlc1OVhHNGdJQ0FnSUNBOEwzUnlQbHh1SUNBZ0lDazdYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUZSeU8xeHVJbDE5IiwidmFyIG5hbWVzICAgICA9IFsnTmVvJywgJ1dlbGwnLCAnU2NhbmRpcycsICdGb3J0bycsICdMb3J1bScsICdQYXJuYWMnLCAnTHVma2lzJywgJ0Jsb2NrZXInLCAnTWlkbGFuZCcsICdPS0MnLCAnQnVsbCcsICdIdW5kbycsICdGZXJyaXMnLCAnQWxhbWVkYScsICdSYWZhZWwnLCAnU2FuIFBlZHJvJ107XG52YXIgc3RhdGVzICAgID0gWydDb25uZWN0ZWQnLCAnQ29ubmVjdGVkJywgJ0Nvbm5lY3RlZCcsICdDb25uZWN0ZWQnLCAnRGlzY29ubmVjdGVkJywgJ1Vua25vd24nXTtcbnZhciBzdGF0dXNlcyAgPSBbJ29rJywgJ29rJywgJ29rJywgJ29rJywgJ2Vycm9yJ107XG52YXIgdGV4dHMgICAgID0gWycyIGRheXMnLCAnMyBkYXlzJywgJ1Vua25vd24nLCAnMSBkYXknLCAnMyBtb250aHMnXTtcbnZhciB0eXBlcyAgICAgPSBbJ2VzcCcsICdwbHVuZ2VyJywgJ2NyYW5rJywgJ3BjcCddO1xuXG5mdW5jdGlvbiByYW5kb21pemUgKGFycikge1xuICByZXR1cm4gYXJyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpXTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGUgKG51bSkge1xuICB2YXIgaTtcbiAgdmFyIHZhbHVlcyA9IFtdO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBudW07IGkrKykge1xuICAgIHZhbHVlcy5wdXNoKHtcbiAgICAgIHN0YXR1czogICAgICAgICAgICAgICAgICAgJ29rJyxcbiAgICAgIFdlbGxfTmFtZTogICAgICAgICAgICAgICAgcmFuZG9taXplKG5hbWVzKSArICcgJyArIHJhbmRvbWl6ZShuYW1lcyksXG4gICAgICBGR19MYXN0X1JlY2VpdmVkX0RhdGU6ICAgIG5ldyBEYXRlKCksXG4gICAgICBXZWxsX1N0YXRlX1RleHQ6ICAgICAgICAgIHJhbmRvbWl6ZShzdGF0ZXMpLFxuICAgICAgQ3VycmVudF9TdGF0ZV9UaW1lX1RleHQ6ICByYW5kb21pemUodGV4dHMpLFxuICAgICAgTGlmdF9UeXBlOiAgICAgICAgICAgICAgICByYW5kb21pemUodHlwZXMpLFxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZW5lcmF0ZTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyUmhkR0V2ZDJWc2JGOWliMlI1TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRWxCUVVrc1MwRkJTeXhQUVVGUExFTkJRVU1zUzBGQlN5eEZRVUZGTEUxQlFVMHNSVUZCUlN4VFFVRlRMRVZCUVVVc1QwRkJUeXhGUVVGRkxFOUJRVThzUlVGQlJTeFJRVUZSTEVWQlFVVXNVVUZCVVN4RlFVRkZMRk5CUVZNc1JVRkJSU3hUUVVGVExFVkJRVVVzUzBGQlN5eEZRVUZGTEUxQlFVMHNSVUZCUlN4UFFVRlBMRVZCUVVVc1VVRkJVU3hGUVVGRkxGTkJRVk1zUlVGQlJTeFJRVUZSTEVWQlFVVXNWMEZCVnl4RFFVRkRMRU5CUVVNN1FVRkRNMHNzU1VGQlNTeE5RVUZOTEUxQlFVMHNRMEZCUXl4WFFVRlhMRVZCUVVVc1YwRkJWeXhGUVVGRkxGZEJRVmNzUlVGQlJTeFhRVUZYTEVWQlFVVXNZMEZCWXl4RlFVRkZMRk5CUVZNc1EwRkJReXhEUVVGRE8wRkJRMmhITEVsQlFVa3NVVUZCVVN4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxFbEJRVWtzUlVGQlJTeEpRVUZKTEVWQlFVVXNTVUZCU1N4RlFVRkZMRTlCUVU4c1EwRkJReXhEUVVGRE8wRkJRMnhFTEVsQlFVa3NTMEZCU3l4UFFVRlBMRU5CUVVNc1VVRkJVU3hGUVVGRkxGRkJRVkVzUlVGQlJTeFRRVUZUTEVWQlFVVXNUMEZCVHl4RlFVRkZMRlZCUVZVc1EwRkJReXhEUVVGRE8wRkJRM0pGTEVsQlFVa3NTMEZCU3l4UFFVRlBMRU5CUVVNc1MwRkJTeXhGUVVGRkxGTkJRVk1zUlVGQlJTeFBRVUZQTEVWQlFVVXNTMEZCU3l4RFFVRkRMRU5CUVVNN08wRkJSVzVFTEZOQlFWTXNVMEZCVXl4RlFVRkZMRWRCUVVjc1JVRkJSVHRGUVVOMlFpeFBRVUZQTEVkQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVWQlFVVXNSMEZCUnl4SFFVRkhMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU55UkN4RFFVRkRPenRCUVVWRUxGTkJRVk1zVVVGQlVTeEZRVUZGTEVkQlFVY3NSVUZCUlR0RlFVTjBRaXhKUVVGSkxFTkJRVU1zUTBGQlF6dEJRVU5TTEVWQlFVVXNTVUZCU1N4TlFVRk5MRWRCUVVjc1JVRkJSU3hEUVVGRE96dEZRVVZvUWl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVVzUTBGQlF5eEhRVUZITEVkQlFVY3NSVUZCUlN4RFFVRkRMRVZCUVVVc1JVRkJSVHRKUVVONFFpeE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRPMDFCUTFZc1RVRkJUU3h2UWtGQmIwSXNTVUZCU1R0TlFVTTVRaXhUUVVGVExHbENRVUZwUWl4VFFVRlRMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUjBGQlJ5eEhRVUZITEZOQlFWTXNRMEZCUXl4TFFVRkxMRU5CUVVNN1RVRkRia1VzY1VKQlFYRkNMRXRCUVVzc1NVRkJTU3hKUVVGSkxFVkJRVVU3VFVGRGNFTXNaVUZCWlN4WFFVRlhMRk5CUVZNc1EwRkJReXhOUVVGTkxFTkJRVU03VFVGRE0wTXNkVUpCUVhWQ0xFZEJRVWNzVTBGQlV5eERRVUZETEV0QlFVc3NRMEZCUXp0TlFVTXhReXhUUVVGVExHbENRVUZwUWl4VFFVRlRMRU5CUVVNc1MwRkJTeXhEUVVGRE8wdEJRek5ETEVOQlFVTXNRMEZCUXp0QlFVTlFMRWRCUVVjN08wVkJSVVFzVDBGQlR5eE5RVUZOTEVOQlFVTTdRVUZEYUVJc1EwRkJRenM3UVVGRlJDeE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMRkZCUVZFc1EwRkJReUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW5aaGNpQnVZVzFsY3lBZ0lDQWdQU0JiSjA1bGJ5Y3NJQ2RYWld4c0p5d2dKMU5qWVc1a2FYTW5MQ0FuUm05eWRHOG5MQ0FuVEc5eWRXMG5MQ0FuVUdGeWJtRmpKeXdnSjB4MVptdHBjeWNzSUNkQ2JHOWphMlZ5Snl3Z0owMXBaR3hoYm1RbkxDQW5UMHRESnl3Z0owSjFiR3duTENBblNIVnVaRzhuTENBblJtVnljbWx6Snl3Z0owRnNZVzFsWkdFbkxDQW5VbUZtWVdWc0p5d2dKMU5oYmlCUVpXUnlieWRkTzF4dWRtRnlJSE4wWVhSbGN5QWdJQ0E5SUZzblEyOXVibVZqZEdWa0p5d2dKME52Ym01bFkzUmxaQ2NzSUNkRGIyNXVaV04wWldRbkxDQW5RMjl1Ym1WamRHVmtKeXdnSjBScGMyTnZibTVsWTNSbFpDY3NJQ2RWYm10dWIzZHVKMTA3WEc1MllYSWdjM1JoZEhWelpYTWdJRDBnV3lkdmF5Y3NJQ2R2YXljc0lDZHZheWNzSUNkdmF5Y3NJQ2RsY25KdmNpZGRPMXh1ZG1GeUlIUmxlSFJ6SUNBZ0lDQTlJRnNuTWlCa1lYbHpKeXdnSnpNZ1pHRjVjeWNzSUNkVmJtdHViM2R1Snl3Z0p6RWdaR0Y1Snl3Z0p6TWdiVzl1ZEdoekoxMDdYRzUyWVhJZ2RIbHdaWE1nSUNBZ0lEMGdXeWRsYzNBbkxDQW5jR3gxYm1kbGNpY3NJQ2RqY21GdWF5Y3NJQ2R3WTNBblhUdGNibHh1Wm5WdVkzUnBiMjRnY21GdVpHOXRhWHBsSUNoaGNuSXBJSHRjYmlBZ2NtVjBkWEp1SUdGeWNsdE5ZWFJvTG1ac2IyOXlLRTFoZEdndWNtRnVaRzl0S0NrZ0tpQmhjbkl1YkdWdVozUm9LVjA3WEc1OVhHNWNibVoxYm1OMGFXOXVJR2RsYm1WeVlYUmxJQ2h1ZFcwcElIdGNiaUFnZG1GeUlHazdYRzRnSUhaaGNpQjJZV3gxWlhNZ1BTQmJYVHRjYmx4dUlDQm1iM0lnS0drZ1BTQXdPeUJwSUR3Z2JuVnRPeUJwS3lzcElIdGNiaUFnSUNCMllXeDFaWE11Y0hWemFDaDdYRzRnSUNBZ0lDQnpkR0YwZFhNNklDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDZHZheWNzWEc0Z0lDQWdJQ0JYWld4c1gwNWhiV1U2SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEpoYm1SdmJXbDZaU2h1WVcxbGN5a2dLeUFuSUNjZ0t5QnlZVzVrYjIxcGVtVW9ibUZ0WlhNcExGeHVJQ0FnSUNBZ1JrZGZUR0Z6ZEY5U1pXTmxhWFpsWkY5RVlYUmxPaUFnSUNCdVpYY2dSR0YwWlNncExGeHVJQ0FnSUNBZ1YyVnNiRjlUZEdGMFpWOVVaWGgwT2lBZ0lDQWdJQ0FnSUNCeVlXNWtiMjFwZW1Vb2MzUmhkR1Z6S1N4Y2JpQWdJQ0FnSUVOMWNuSmxiblJmVTNSaGRHVmZWR2x0WlY5VVpYaDBPaUFnY21GdVpHOXRhWHBsS0hSbGVIUnpLU3hjYmlBZ0lDQWdJRXhwWm5SZlZIbHdaVG9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbUZ1Wkc5dGFYcGxLSFI1Y0dWektTeGNiaUFnSUNCOUtUdGNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQjJZV3gxWlhNN1hHNTlYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnWjJWdVpYSmhkR1U3WEc0aVhYMD0iLCJ2YXIgdmFsdWVzID0gW107XG5cbnZhbHVlcyA9IFtcbiAge1xuICAgIGxvY2tlZDogICAgIHRydWUsXG4gICAgbWluaW1hbDogICAgdHJ1ZSxcbiAgICBuYW1lOiAgICAgICAnc3RhdHVzJyxcbiAgICBzb3J0YWJsZTogICB0cnVlLFxuICAgIHR5cGU6ICAgICAgICdzdGF0dXMnXG4gIH0sXG4gIHtcbiAgICBkaXJlY3Rpb246ICAnYXNjJyxcbiAgICBsb2NrZWQ6ICAgICB0cnVlLFxuICAgIG5hbWU6ICAgICAgICdXZWxsX05hbWUnLFxuICAgIHNvcnRhYmxlOiAgIHRydWUsXG4gICAgdGl0bGU6ICAgICAgJ1dlbGwgTmFtZScsXG4gICAgdHlwZTogICAgICAgJ3N0cmluZydcbiAgfSxcbiAge1xuICAgIG5hbWU6ICAgICAgICdXZWxsX1N0YXRlX1RleHQnLFxuICAgIHJlc2l6YWJsZTogIHRydWUsXG4gICAgc29ydGFibGU6ICAgdHJ1ZSxcbiAgICB0aXRsZTogICAgICAnV2VsbCBTdGF0ZScsXG4gICAgdHlwZTogICAgICAgJ3N0cmluZydcbiAgfSxcbiAge1xuICAgIG5hbWU6ICAgICAgICdDdXJyZW50X1N0YXRlX1RpbWVfVGV4dCcsXG4gICAgcmVzaXphYmxlOiAgdHJ1ZSxcbiAgICBzb3J0YWJsZTogICB0cnVlLFxuICAgIHRpdGxlOiAgICAgICdDdXJyZW50IFN0YXRlIFRpbWUnLFxuICAgIHR5cGU6ICAgICAgICdzdHJpbmcnXG4gIH0sXG4gIHtcbiAgICBuYW1lOiAgICAgICAnRkdfTGFzdF9SZWNlaXZlZF9EYXRlJyxcbiAgICByZXNpemFibGU6ICB0cnVlLFxuICAgIHNvcnRhYmxlOiAgIHRydWUsXG4gICAgdGl0bGU6ICAgICAgJ0ZHIExhc3QgUmVjZWl2ZWQgRGF0ZScsXG4gICAgdHlwZTogICAgICAgJ2RhdGUnXG4gIH0sXG4gIHtcbiAgICBuYW1lOiAgICAgICAnd2VsbC1hY3Rpb25zJyxcbiAgICByZXNpemFibGU6ICBmYWxzZSxcbiAgICBzb3J0YWJsZTogICBmYWxzZSxcbiAgICB0aXRsZTogICAgICAnQWN0aW9ucycsXG4gICAgdHlwZTogICAgICAgJ2FjdGlvbnMnXG4gIH1cbl07XG5cbm1vZHVsZS5leHBvcnRzID0gdmFsdWVzO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDJSaGRHRXZkMlZzYkY5b1pXRmthVzVuY3k1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hKUVVGSkxFMUJRVTBzUjBGQlJ5eEZRVUZGTEVOQlFVTTdPMEZCUldoQ0xFMUJRVTBzUjBGQlJ6dEZRVU5RTzBsQlEwVXNUVUZCVFN4TlFVRk5MRWxCUVVrN1NVRkRhRUlzVDBGQlR5eExRVUZMTEVsQlFVazdTVUZEYUVJc1NVRkJTU3hSUVVGUkxGRkJRVkU3U1VGRGNFSXNVVUZCVVN4SlFVRkpMRWxCUVVrN1NVRkRhRUlzU1VGQlNTeFJRVUZSTEZGQlFWRTdSMEZEY2tJN1JVRkRSRHRKUVVORkxGTkJRVk1zUjBGQlJ5eExRVUZMTzBsQlEycENMRTFCUVUwc1RVRkJUU3hKUVVGSk8wbEJRMmhDTEVsQlFVa3NVVUZCVVN4WFFVRlhPMGxCUTNaQ0xGRkJRVkVzU1VGQlNTeEpRVUZKTzBsQlEyaENMRXRCUVVzc1QwRkJUeXhYUVVGWE8wbEJRM1pDTEVsQlFVa3NVVUZCVVN4UlFVRlJPMGRCUTNKQ08wVkJRMFE3U1VGRFJTeEpRVUZKTEZGQlFWRXNhVUpCUVdsQ08wbEJRemRDTEZOQlFWTXNSMEZCUnl4SlFVRkpPMGxCUTJoQ0xGRkJRVkVzU1VGQlNTeEpRVUZKTzBsQlEyaENMRXRCUVVzc1QwRkJUeXhaUVVGWk8wbEJRM2hDTEVsQlFVa3NVVUZCVVN4UlFVRlJPMGRCUTNKQ08wVkJRMFE3U1VGRFJTeEpRVUZKTEZGQlFWRXNlVUpCUVhsQ08wbEJRM0pETEZOQlFWTXNSMEZCUnl4SlFVRkpPMGxCUTJoQ0xGRkJRVkVzU1VGQlNTeEpRVUZKTzBsQlEyaENMRXRCUVVzc1QwRkJUeXh2UWtGQmIwSTdTVUZEYUVNc1NVRkJTU3hSUVVGUkxGRkJRVkU3UjBGRGNrSTdSVUZEUkR0SlFVTkZMRWxCUVVrc1VVRkJVU3gxUWtGQmRVSTdTVUZEYmtNc1UwRkJVeXhIUVVGSExFbEJRVWs3U1VGRGFFSXNVVUZCVVN4SlFVRkpMRWxCUVVrN1NVRkRhRUlzUzBGQlN5eFBRVUZQTEhWQ1FVRjFRanRKUVVOdVF5eEpRVUZKTEZGQlFWRXNUVUZCVFR0SFFVTnVRanRGUVVORU8wbEJRMFVzU1VGQlNTeFJRVUZSTEdOQlFXTTdTVUZETVVJc1UwRkJVeXhIUVVGSExFdEJRVXM3U1VGRGFrSXNVVUZCVVN4SlFVRkpMRXRCUVVzN1NVRkRha0lzUzBGQlN5eFBRVUZQTEZOQlFWTTdTVUZEY2tJc1NVRkJTU3hSUVVGUkxGTkJRVk03UjBGRGRFSTdRVUZEU0N4RFFVRkRMRU5CUVVNN08wRkJSVVlzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4TlFVRk5MRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SjJZWElnZG1Gc2RXVnpJRDBnVzEwN1hHNWNiblpoYkhWbGN5QTlJRnRjYmlBZ2UxeHVJQ0FnSUd4dlkydGxaRG9nSUNBZ0lIUnlkV1VzWEc0Z0lDQWdiV2x1YVcxaGJEb2dJQ0FnZEhKMVpTeGNiaUFnSUNCdVlXMWxPaUFnSUNBZ0lDQW5jM1JoZEhWekp5eGNiaUFnSUNCemIzSjBZV0pzWlRvZ0lDQjBjblZsTEZ4dUlDQWdJSFI1Y0dVNklDQWdJQ0FnSUNkemRHRjBkWE1uWEc0Z0lIMHNYRzRnSUh0Y2JpQWdJQ0JrYVhKbFkzUnBiMjQ2SUNBbllYTmpKeXhjYmlBZ0lDQnNiMk5yWldRNklDQWdJQ0IwY25WbExGeHVJQ0FnSUc1aGJXVTZJQ0FnSUNBZ0lDZFhaV3hzWDA1aGJXVW5MRnh1SUNBZ0lITnZjblJoWW14bE9pQWdJSFJ5ZFdVc1hHNGdJQ0FnZEdsMGJHVTZJQ0FnSUNBZ0oxZGxiR3dnVG1GdFpTY3NYRzRnSUNBZ2RIbHdaVG9nSUNBZ0lDQWdKM04wY21sdVp5ZGNiaUFnZlN4Y2JpQWdlMXh1SUNBZ0lHNWhiV1U2SUNBZ0lDQWdJQ2RYWld4c1gxTjBZWFJsWDFSbGVIUW5MRnh1SUNBZ0lISmxjMmw2WVdKc1pUb2dJSFJ5ZFdVc1hHNGdJQ0FnYzI5eWRHRmliR1U2SUNBZ2RISjFaU3hjYmlBZ0lDQjBhWFJzWlRvZ0lDQWdJQ0FuVjJWc2JDQlRkR0YwWlNjc1hHNGdJQ0FnZEhsd1pUb2dJQ0FnSUNBZ0ozTjBjbWx1WnlkY2JpQWdmU3hjYmlBZ2UxeHVJQ0FnSUc1aGJXVTZJQ0FnSUNBZ0lDZERkWEp5Wlc1MFgxTjBZWFJsWDFScGJXVmZWR1Y0ZENjc1hHNGdJQ0FnY21WemFYcGhZbXhsT2lBZ2RISjFaU3hjYmlBZ0lDQnpiM0owWVdKc1pUb2dJQ0IwY25WbExGeHVJQ0FnSUhScGRHeGxPaUFnSUNBZ0lDZERkWEp5Wlc1MElGTjBZWFJsSUZScGJXVW5MRnh1SUNBZ0lIUjVjR1U2SUNBZ0lDQWdJQ2R6ZEhKcGJtY25YRzRnSUgwc1hHNGdJSHRjYmlBZ0lDQnVZVzFsT2lBZ0lDQWdJQ0FuUmtkZlRHRnpkRjlTWldObGFYWmxaRjlFWVhSbEp5eGNiaUFnSUNCeVpYTnBlbUZpYkdVNklDQjBjblZsTEZ4dUlDQWdJSE52Y25SaFlteGxPaUFnSUhSeWRXVXNYRzRnSUNBZ2RHbDBiR1U2SUNBZ0lDQWdKMFpISUV4aGMzUWdVbVZqWldsMlpXUWdSR0YwWlNjc1hHNGdJQ0FnZEhsd1pUb2dJQ0FnSUNBZ0oyUmhkR1VuWEc0Z0lIMHNYRzRnSUh0Y2JpQWdJQ0J1WVcxbE9pQWdJQ0FnSUNBbmQyVnNiQzFoWTNScGIyNXpKeXhjYmlBZ0lDQnlaWE5wZW1GaWJHVTZJQ0JtWVd4elpTeGNiaUFnSUNCemIzSjBZV0pzWlRvZ0lDQm1ZV3h6WlN4Y2JpQWdJQ0IwYVhSc1pUb2dJQ0FnSUNBblFXTjBhVzl1Y3ljc1hHNGdJQ0FnZEhsd1pUb2dJQ0FnSUNBZ0oyRmpkR2x2Ym5NblhHNGdJSDFjYmwwN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdkbUZzZFdWek8xeHVJbDE5IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDSEFOR0VfU09SVDogICAgICAnc29ydCcsXG4gIENIQU5HRV9TT1JUX0RJUjogICdzb3J0LWRpcidcbn07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZkMlZzYkY5bmNtbGtMMkZqZEdsdmJuTXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1dVRkJXU3hEUVVGRE96dEJRVVZpTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjN1JVRkRaaXhYUVVGWExFOUJRVThzVFVGQlRUdEZRVU40UWl4bFFVRmxMRWRCUVVjc1ZVRkJWVHREUVVNM1FpeERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaVhDSjFjMlVnYzNSeWFXTjBYQ0k3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2UxeHVJQ0JEU0VGT1IwVmZVMDlTVkRvZ0lDQWdJQ0FuYzI5eWRDY3NYRzRnSUVOSVFVNUhSVjlUVDFKVVgwUkpVam9nSUNkemIzSjBMV1JwY2lkY2JuMDdYRzRpWFgwPSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgQWN0aXZlUm93RGV0YWlscztcbnZhciAkICAgICAgICAgICA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIFJlYWN0ICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBUciAgICAgICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvdHIuanN4Jyk7XG52YXIgVGQgICAgICAgICAgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL3RkLmpzeCcpO1xudmFyIFRhYnMgICAgICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy90YWJzLmpzeCcpO1xudmFyIEljb24gICAgICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9pY29uLmpzeCcpO1xudmFyIFdlbGxOYXYgICAgID0gcmVxdWlyZSgnLi93ZWxsX25hdi5qc3gnKTtcbnZhciBzdG9yZSAgICAgICA9IHJlcXVpcmUoJy4vc3RvcmUnKTtcbnZhciBkaXNwYXRjaGVyICA9IHJlcXVpcmUoJy4vZGlzcGF0Y2hlcicpO1xuXG5BY3RpdmVSb3dEZXRhaWxzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkFjdGl2ZVJvd0RldGFpbHNcIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtxdWljazogc3RvcmUuZ2V0KCdxdWljaycpLnRvSlNPTigpfTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIga2V5X21hcCA9IHszOTogJ19tb3ZlQmFja3dhcmQnLCAzNzogJ19tb3ZlRm9yd2FyZCd9O1xuICAgICQoZG9jdW1lbnQpLm9uKCdrZXlkb3duLicgKyB0aGlzLnByb3BzLnN0b3JlLmNpZCwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciB3aGVyZSA9IGtleV9tYXBbZS53aGljaF07XG5cbiAgICAgIGlmICghIHdoZXJlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHRoaXNbd2hlcmVdKCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAkKGRvY3VtZW50KS5vZmYoJy4nICsgdGhpcy5wcm9wcy5zdG9yZS5jaWQpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcXVpY2tfbG9vaztcbiAgICB2YXIgcXVpY2tfaXRlbXM7XG4gICAgdmFyIGNsYXNzX25hbWVzID0gWydhY3RpdmUnXTtcbiAgICB2YXIgd2VsbCAgICAgICAgPSB0aGlzLnByb3BzLnN0b3JlO1xuICAgIHZhciBzaXplX3RvZ2dsZSA9IHRoaXMucHJvcHMubWluaW1pemVkID8gJ2V4cGFuZCcgOiAnY29tcHJlc3MnO1xuICAgIHZhciB0YWJzICAgICAgICA9IHRoaXMuX2dldFRhYnMoKTtcblxuICAgIGlmICghIHRoaXMucHJvcHMubWluaW1pemVkKSB7XG4gICAgICBxdWlja19pdGVtcyA9IHRoaXMuc3RhdGUucXVpY2subWFwKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgICAgICB2YXIgY2xhc3NOYW1lID0gJ2NvbC0xJztcblxuICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICBjbGFzc05hbWUgKz0gJyBvZmZzZXQtMyc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogY2xhc3NOYW1lLCBrZXk6IGluZGV4fSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiYm94XCJ9LCBcbiAgICAgICAgICAgICAgaXRlbS50ZXh0XG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICAgIHF1aWNrX2xvb2sgPSAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJxdWljay1sb29rXCIsIHJlZjogXCJxdWljay1sb29rXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29udHJvbFwifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7Y2xhc3NOYW1lOiBcImJ1dHRvblwiLCBvbkNsaWNrOiB0aGlzLl9tb3ZlRm9yd2FyZH0sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IFwiYXJyb3ctbGVmdFwifSkpXG4gICAgICAgICAgKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbnRlbnRcIn0sIFxuXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwidHJpY2xvcHNlXCJ9LCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImlubmVyXCJ9LCBcblxuICAgICAgICAgICAgICAgIHF1aWNrX2l0ZW1zXG5cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbnRyb2xcIn0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2NsYXNzTmFtZTogXCJidXR0b25cIiwgb25DbGljazogdGhpcy5fbW92ZUJhY2t3YXJkfSwgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogXCJhcnJvdy1yaWdodFwifSkpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIGNsYXNzX25hbWVzLnB1c2godGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHIsIHtjbGFzc05hbWU6IGNsYXNzX25hbWVzLmpvaW4oJyAnKX0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRkLCB7Y29sU3Bhbjogc3RvcmUuZ2V0KCdoZWFkaW5ncycpLmxlbmd0aH0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJmaWVsZHNldFwiLCB7Y2xhc3NOYW1lOiBcInNlcGFyYXRvclwifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGVnZW5kXCIsIHthbGlnbjogXCJjZW50ZXJcIn0sIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYnMsIHt0YWJzOiB0YWJzfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICApLCBcbiAgICAgICAgICBxdWlja19sb29rLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFdlbGxOYXYsIHt3ZWxsSWQ6IHdlbGwuY2lkLCBzaXplOiBcInNtYWxsXCIsIHR5cGU6IHdlbGwuZ2V0KCdMaWZ0X1R5cGUnKX0pXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBfZ2V0VGFiczogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0YWJzID0gW1xuICAgICAge2ljb246IHt0eXBlOiAnYXJyb3ctdXAnfSwgICAgYWN0aW9uOiB0aGlzLl9zZWxlY3RQcmV2fSxcbiAgICAgIHtpY29uOiB7dHlwZTogJ2Fycm93LWRvd24nfSwgIGFjdGlvbjogdGhpcy5fc2VsZWN0TmV4dH0sXG4gICAgICB7aWNvbjoge3R5cGU6IHNpemVfdG9nZ2xlfSwgICBhY3Rpb246IHRoaXMuX3NpemVUb2dnbGV9LFxuICAgICAge2ljb246IHt0eXBlOiAnY2xvc2UnfSwgICAgICAgYWN0aW9uOiB0aGlzLl9jbG9zZX1cbiAgICBdO1xuXG4gICAgaWYgKCEgdGhpcy5wcm9wcy5wcmV2KSB7XG4gICAgICBkZWxldGUgdGFic1swXTtcbiAgICB9XG5cbiAgICBpZiAoISB0aGlzLnByb3BzLm5leHQpIHtcbiAgICAgIGRlbGV0ZSB0YWJzWzFdO1xuICAgIH1cblxuICAgIHJldHVybiB0YWJzO1xuICB9LFxuICBfbW92ZUZvcndhcmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBzdG9yZS5nZXQoJ3F1aWNrJykuZ29CYWNrKCk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtxdWljazogc3RvcmUuZ2V0KCdxdWljaycpLnRvSlNPTigpfSk7XG4gIH0sXG4gIF9tb3ZlQmFja3dhcmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBzdG9yZS5nZXQoJ3F1aWNrJykuZ29Gb3J3YXJkKCk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtxdWljazogc3RvcmUuZ2V0KCdxdWljaycpLnRvSlNPTigpfSk7XG4gIH0sXG4gIF9zZWxlY3RQcmV2OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMucHJldikge1xuICAgICAgdGhpcy5fc3dpdGNoKHRoaXMucHJvcHMucHJldik7XG4gICAgfVxuICB9LFxuICBfc2VsZWN0TmV4dDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLm5leHQpIHtcbiAgICAgIHRoaXMuX3N3aXRjaCh0aGlzLnByb3BzLm5leHQpO1xuICAgIH1cbiAgfSxcbiAgX3NpemVUb2dnbGU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5zaXplVG9nZ2xlKSB7XG4gICAgICB0aGlzLnByb3BzLnNpemVUb2dnbGUoKTtcbiAgICB9XG4gIH0sXG4gIF9jbG9zZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX3N3aXRjaCgpO1xuICB9LFxuICBfc3dpdGNoOiBmdW5jdGlvbiAoY2lkKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuc3dpdGNoZXIpIHtcbiAgICAgIHRoaXMucHJvcHMuc3dpdGNoZXIoY2lkLCB0cnVlKTtcbiAgICB9XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFjdGl2ZVJvd0RldGFpbHM7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZkMlZzYkY5bmNtbGtMMkZqZEdsMlpWOXliM2RmWkdWMFlXbHNjeTVxYzNnaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRTdPMEZCUlVFc1IwRkJSenM3UVVGRlNDeEpRVUZKTEdkQ1FVRm5RaXhEUVVGRE8wRkJRM0pDTEVsQlFVa3NRMEZCUXl4aFFVRmhMRTlCUVU4c1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEJRVU53UXl4SlFVRkpMRXRCUVVzc1UwRkJVeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdRVUZEYmtNc1NVRkJTU3hGUVVGRkxGbEJRVmtzVDBGQlR5eERRVUZETEhsQ1FVRjVRaXhEUVVGRExFTkJRVU03UVVGRGNrUXNTVUZCU1N4RlFVRkZMRmxCUVZrc1QwRkJUeXhEUVVGRExIbENRVUY1UWl4RFFVRkRMRU5CUVVNN1FVRkRja1FzU1VGQlNTeEpRVUZKTEZWQlFWVXNUMEZCVHl4RFFVRkRMREpDUVVFeVFpeERRVUZETEVOQlFVTTdRVUZEZGtRc1NVRkJTU3hKUVVGSkxGVkJRVlVzVDBGQlR5eERRVUZETERKQ1FVRXlRaXhEUVVGRExFTkJRVU03UVVGRGRrUXNTVUZCU1N4UFFVRlBMRTlCUVU4c1QwRkJUeXhEUVVGRExHZENRVUZuUWl4RFFVRkRMRU5CUVVNN1FVRkROVU1zU1VGQlNTeExRVUZMTEZOQlFWTXNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8wRkJRM0pETEVsQlFVa3NWVUZCVlN4SlFVRkpMRTlCUVU4c1EwRkJReXhqUVVGakxFTkJRVU1zUTBGQlF6czdRVUZGTVVNc2MwTkJRWE5ETEdkRFFVRkJPMFZCUTNCRExHVkJRV1VzUlVGQlJTeFpRVUZaTzBsQlF6TkNMRTlCUVU4c1EwRkJReXhMUVVGTExFVkJRVVVzUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF5eERRVUZETzBkQlF6ZERPMFZCUTBRc2FVSkJRV2xDTEVWQlFVVXNXVUZCV1R0SlFVTTNRaXhKUVVGSkxFOUJRVThzUjBGQlJ5eERRVUZETEVWQlFVVXNSVUZCUlN4bFFVRmxMRVZCUVVVc1JVRkJSU3hGUVVGRkxHTkJRV01zUTBGQlF5eERRVUZETzBsQlEzaEVMRU5CUVVNc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF5eEZRVUZGTEVOQlFVTXNWVUZCVlN4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEVkQlFVY3NSVUZCUlN4VlFVRlZMRU5CUVVNc1JVRkJSVHRCUVVOdVJTeE5RVUZOTEVsQlFVa3NTMEZCU3l4SFFVRkhMRTlCUVU4c1EwRkJReXhEUVVGRExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdPMDFCUlRkQ0xFbEJRVWtzUlVGQlJTeExRVUZMTEVWQlFVVTdVVUZEV0N4UFFVRlBMRWxCUVVrc1EwRkJRenRCUVVOd1FpeFBRVUZQT3p0QlFVVlFMRTFCUVUwc1EwRkJReXhEUVVGRExHTkJRV01zUlVGQlJTeERRVUZET3p0TlFVVnVRaXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVWQlFVVXNRMEZCUXp0TFFVTm1MRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTTdSMEZEWmp0RlFVTkVMRzlDUVVGdlFpeEZRVUZGTEZsQlFWazdTVUZEYUVNc1EwRkJReXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEVkQlFVY3NRMEZCUXl4SFFVRkhMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN1IwRkROME03UlVGRFJDeE5RVUZOTEVWQlFVVXNXVUZCV1R0SlFVTnNRaXhKUVVGSkxGVkJRVlVzUTBGQlF6dEpRVU5tTEVsQlFVa3NWMEZCVnl4RFFVRkRPMGxCUTJoQ0xFbEJRVWtzVjBGQlZ5eEhRVUZITEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1NVRkROMElzU1VGQlNTeEpRVUZKTEZWQlFWVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU03U1VGRGJrTXNTVUZCU1N4WFFVRlhMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVkQlFVY3NVVUZCVVN4SFFVRkhMRlZCUVZVc1EwRkJRenRCUVVOdVJTeEpRVUZKTEVsQlFVa3NTVUZCU1N4VlFVRlZMRWxCUVVrc1EwRkJReXhSUVVGUkxFVkJRVVVzUTBGQlF6czdTVUZGYkVNc1NVRkJTU3hGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4RlFVRkZPMDFCUXpGQ0xGZEJRVmNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlZTeEpRVUZKTEVWQlFVVXNTMEZCU3l4RlFVRkZPMEZCUTJoRkxGRkJRVkVzU1VGQlNTeFRRVUZUTEVkQlFVY3NUMEZCVHl4RFFVRkRPenRSUVVWNFFpeEpRVUZKTEV0QlFVc3NTMEZCU3l4RFFVRkRMRVZCUVVVN1ZVRkRaaXhUUVVGVExFbEJRVWtzVjBGQlZ5eERRVUZETzBGQlEyNURMRk5CUVZNN08xRkJSVVE3VlVGRFJTeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZGTEZOQlFWTXNSVUZCUXl4RFFVRkRMRWRCUVVFc1JVRkJSeXhEUVVGRkxFdEJRVThzUTBGQlFTeEZRVUZCTzFsQlEzSkRMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc1MwRkJUU3hEUVVGQkxFVkJRVUU3WTBGRGJFSXNTVUZCU1N4RFFVRkRMRWxCUVVzN1dVRkRVQ3hEUVVGQk8xVkJRMFlzUTBGQlFUdFZRVU5PTzBGQlExWXNUMEZCVHl4RFFVRkRMRU5CUVVNN08wMUJSVWdzVlVGQlZUdFJRVU5TTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNXVUZCUVN4RlFVRlpMRU5CUVVNc1IwRkJRU3hGUVVGSExFTkJRVU1zV1VGQllTeERRVUZCTEVWQlFVRTdWVUZETTBNc2IwSkJRVUVzUzBGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhUUVVGVkxFTkJRVUVzUlVGQlFUdFpRVU4yUWl4dlFrRkJRU3hIUVVGRkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRkZCUVVFc1JVRkJVU3hEUVVGRExFOUJRVUVzUlVGQlR5eERRVUZGTEVsQlFVa3NRMEZCUXl4WlFVRmpMRU5CUVVFc1JVRkJRU3h2UWtGQlF5eEpRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRWxCUVVFc1JVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlFTeERRVUZITEVOQlFVa3NRMEZCUVR0VlFVTTFSU3hEUVVGQkxFVkJRVUU3UVVGRGFFSXNWVUZCVlN4dlFrRkJRU3hMUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRk5CUVZVc1EwRkJRU3hGUVVGQk96dFpRVVYyUWl4dlFrRkJRU3hMUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRmRCUVZrc1EwRkJRU3hGUVVGQk8wRkJRM1pETEdOQlFXTXNiMEpCUVVFc1MwRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4UFFVRlJMRU5CUVVFc1JVRkJRVHM3UVVGRmNrTXNaMEpCUVdsQ0xGZEJRVms3TzJOQlJWUXNRMEZCUVR0QlFVTndRaXhaUVVGclFpeERRVUZCT3p0VlFVVkdMRU5CUVVFc1JVRkJRVHRWUVVOT0xHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zVTBGQlZTeERRVUZCTEVWQlFVRTdXVUZEZGtJc2IwSkJRVUVzUjBGQlJTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhSUVVGQkxFVkJRVkVzUTBGQlF5eFBRVUZCTEVWQlFVOHNRMEZCUlN4SlFVRkpMRU5CUVVNc1lVRkJaU3hEUVVGQkxFVkJRVUVzYjBKQlFVTXNTVUZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhKUVVGQkxFVkJRVWtzUTBGQlF5eGhRVUZoTEVOQlFVRXNRMEZCUnl4RFFVRkpMRU5CUVVFN1ZVRkRPVVVzUTBGQlFUdFJRVU5HTEVOQlFVRTdUMEZEVUN4RFFVRkRPMEZCUTFJc1MwRkJTenM3UVVGRlRDeEpRVUZKTEZkQlFWY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXpzN1NVRkZka003VFVGRFJTeHZRa0ZCUXl4RlFVRkZMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZGTEZkQlFWY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGSExFTkJRVUVzUlVGQlFUdFJRVU53UXl4dlFrRkJReXhGUVVGRkxFVkJRVUVzUTBGQlFTeERRVUZETEU5QlFVRXNSVUZCVHl4RFFVRkZMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNUVUZCVVN4RFFVRkJMRVZCUVVFN1ZVRkRla01zYjBKQlFVRXNWVUZCVXl4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eFhRVUZaTEVOQlFVRXNSVUZCUVR0WlFVTTVRaXh2UWtGQlFTeFJRVUZQTEVWQlFVRXNRMEZCUVN4RFFVRkRMRXRCUVVFc1JVRkJTeXhEUVVGRExGRkJRVk1zUTBGQlFTeEZRVUZCTzJOQlEzSkNMRzlDUVVGRExFbEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNTVUZCUVN4RlFVRkpMRU5CUVVVc1NVRkJTeXhEUVVGQkxFTkJRVWNzUTBGQlFUdFpRVU5pTEVOQlFVRTdWVUZEUVN4RFFVRkJMRVZCUVVFN1ZVRkRWaXhWUVVGVkxFVkJRVU03VlVGRFdpeHZRa0ZCUXl4UFFVRlBMRVZCUVVFc1EwRkJRU3hEUVVGRExFMUJRVUVzUlVGQlRTeERRVUZGTEVsQlFVa3NRMEZCUXl4SFFVRkhMRVZCUVVNc1EwRkJReXhKUVVGQkxFVkJRVWtzUTBGQlF5eFBRVUZCTEVWQlFVOHNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJSU3hKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEZkQlFWY3NRMEZCUlN4RFFVRkJMRU5CUVVjc1EwRkJRVHRSUVVOd1JTeERRVUZCTzAxQlEwWXNRMEZCUVR0TlFVTk1PMGRCUTBnN1JVRkRSQ3hSUVVGUkxFVkJRVVVzV1VGQldUdEpRVU53UWl4SlFVRkpMRWxCUVVrc1IwRkJSenROUVVOVUxFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlFVTXNTVUZCU1N4RlFVRkZMRlZCUVZVc1EwRkJReXhMUVVGTExFMUJRVTBzUlVGQlJTeEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRPMDFCUTNaRUxFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlFVTXNTVUZCU1N4RlFVRkZMRmxCUVZrc1EwRkJReXhIUVVGSExFMUJRVTBzUlVGQlJTeEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRPMDFCUTNaRUxFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlFVTXNTVUZCU1N4RlFVRkZMRmRCUVZjc1EwRkJReXhKUVVGSkxFMUJRVTBzUlVGQlJTeEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRPMDFCUTNaRUxFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlFVTXNTVUZCU1N4RlFVRkZMRTlCUVU4c1EwRkJReXhSUVVGUkxFMUJRVTBzUlVGQlJTeEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRPMEZCUTNoRUxFdEJRVXNzUTBGQlF6czdTVUZGUml4SlFVRkpMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVWQlFVVTdUVUZEY2tJc1QwRkJUeXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEY2tJc1MwRkJTenM3U1VGRlJDeEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFVkJRVVU3VFVGRGNrSXNUMEZCVHl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRGNrSXNTMEZCU3pzN1NVRkZSQ3hQUVVGUExFbEJRVWtzUTBGQlF6dEhRVU5pTzBWQlEwUXNXVUZCV1N4RlFVRkZMRmxCUVZrN1FVRkROVUlzU1VGQlNTeExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRExFMUJRVTBzUlVGQlJTeERRVUZET3p0SlFVVTFRaXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNTMEZCU3l4RlFVRkZMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRE8wZEJRM0pFTzBWQlEwUXNZVUZCWVN4RlFVRkZMRmxCUVZrN1FVRkROMElzU1VGQlNTeExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRExGTkJRVk1zUlVGQlJTeERRVUZET3p0SlFVVXZRaXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNTMEZCU3l4RlFVRkZMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRE8wZEJRM0pFTzBWQlEwUXNWMEZCVnl4RlFVRkZMRmxCUVZrN1NVRkRka0lzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1JVRkJSVHROUVVOdVFpeEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdTMEZETDBJN1IwRkRSanRGUVVORUxGZEJRVmNzUlVGQlJTeFpRVUZaTzBsQlEzWkNMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVWQlFVVTdUVUZEYmtJc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8wdEJReTlDTzBkQlEwWTdSVUZEUkN4WFFVRlhMRVZCUVVVc1dVRkJXVHRKUVVOMlFpeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1ZVRkJWU3hGUVVGRk8wMUJRM3BDTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1ZVRkJWU3hGUVVGRkxFTkJRVU03UzBGRGVrSTdSMEZEUmp0RlFVTkVMRTFCUVUwc1JVRkJSU3haUVVGWk8wbEJRMnhDTEVsQlFVa3NRMEZCUXl4UFFVRlBMRVZCUVVVc1EwRkJRenRIUVVOb1FqdEZRVU5FTEU5QlFVOHNSVUZCUlN4VlFVRlZMRWRCUVVjc1JVRkJSVHRKUVVOMFFpeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1VVRkJVU3hGUVVGRk8wMUJRM1pDTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1VVRkJVU3hEUVVGRExFZEJRVWNzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0TFFVTm9RenRIUVVOR08wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eG5Ra0ZCWjBJc1EwRkJReUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4cUtseHVJQ29nUUdwemVDQlNaV0ZqZEM1RVQwMWNiaUFxTDF4dVhHNTJZWElnUVdOMGFYWmxVbTkzUkdWMFlXbHNjenRjYm5aaGNpQWtJQ0FnSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSjJweGRXVnllU2NwTzF4dWRtRnlJRkpsWVdOMElDQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbmNtVmhZM1FuS1R0Y2JuWmhjaUJVY2lBZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHVMeTR1TDJOdmJYQnZibVZ1ZEhNdmRISXVhbk40SnlrN1hHNTJZWElnVkdRZ0lDQWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDY3VMaTh1TGk5amIyMXdiMjVsYm5SekwzUmtMbXB6ZUNjcE8xeHVkbUZ5SUZSaFluTWdJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTR2TGk0dlkyOXRjRzl1Wlc1MGN5OTBZV0p6TG1wemVDY3BPMXh1ZG1GeUlFbGpiMjRnSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duTGk0dkxpNHZZMjl0Y0c5dVpXNTBjeTlwWTI5dUxtcHplQ2NwTzF4dWRtRnlJRmRsYkd4T1lYWWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpOTNaV3hzWDI1aGRpNXFjM2duS1R0Y2JuWmhjaUJ6ZEc5eVpTQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHZjM1J2Y21VbktUdGNiblpoY2lCa2FYTndZWFJqYUdWeUlDQTlJSEpsY1hWcGNtVW9KeTR2WkdsemNHRjBZMmhsY2ljcE8xeHVYRzVCWTNScGRtVlNiM2RFWlhSaGFXeHpJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dUlDQm5aWFJKYm1sMGFXRnNVM1JoZEdVNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2UzRjFhV05yT2lCemRHOXlaUzVuWlhRb0ozRjFhV05ySnlrdWRHOUtVMDlPS0NsOU8xeHVJQ0I5TEZ4dUlDQmpiMjF3YjI1bGJuUkVhV1JOYjNWdWREb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCclpYbGZiV0Z3SUQwZ2V6TTVPaUFuWDIxdmRtVkNZV05yZDJGeVpDY3NJRE0zT2lBblgyMXZkbVZHYjNKM1lYSmtKMzA3WEc0Z0lDQWdKQ2hrYjJOMWJXVnVkQ2t1YjI0b0oydGxlV1J2ZDI0dUp5QXJJSFJvYVhNdWNISnZjSE11YzNSdmNtVXVZMmxrTENCbWRXNWpkR2x2YmlBb1pTa2dlMXh1SUNBZ0lDQWdkbUZ5SUhkb1pYSmxJRDBnYTJWNVgyMWhjRnRsTG5kb2FXTm9YVHRjYmx4dUlDQWdJQ0FnYVdZZ0tDRWdkMmhsY21VcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlIUnlkV1U3WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdVdWNISmxkbVZ1ZEVSbFptRjFiSFFvS1R0Y2JseHVJQ0FnSUNBZ2RHaHBjMXQzYUdWeVpWMG9LVHRjYmlBZ0lDQjlMbUpwYm1Rb2RHaHBjeWtwTzF4dUlDQjlMRnh1SUNCamIyMXdiMjVsYm5SWGFXeHNWVzV0YjNWdWREb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJQ1FvWkc5amRXMWxiblFwTG05bVppZ25MaWNnS3lCMGFHbHpMbkJ5YjNCekxuTjBiM0psTG1OcFpDazdYRzRnSUgwc1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCeGRXbGphMTlzYjI5ck8xeHVJQ0FnSUhaaGNpQnhkV2xqYTE5cGRHVnRjenRjYmlBZ0lDQjJZWElnWTJ4aGMzTmZibUZ0WlhNZ1BTQmJKMkZqZEdsMlpTZGRPMXh1SUNBZ0lIWmhjaUIzWld4c0lDQWdJQ0FnSUNBOUlIUm9hWE11Y0hKdmNITXVjM1J2Y21VN1hHNGdJQ0FnZG1GeUlITnBlbVZmZEc5bloyeGxJRDBnZEdocGN5NXdjbTl3Y3k1dGFXNXBiV2w2WldRZ1B5QW5aWGh3WVc1a0p5QTZJQ2RqYjIxd2NtVnpjeWM3WEc0Z0lDQWdkbUZ5SUhSaFluTWdJQ0FnSUNBZ0lEMGdkR2hwY3k1ZloyVjBWR0ZpY3lncE8xeHVYRzRnSUNBZ2FXWWdLQ0VnZEdocGN5NXdjbTl3Y3k1dGFXNXBiV2w2WldRcElIdGNiaUFnSUNBZ0lIRjFhV05yWDJsMFpXMXpJRDBnZEdocGN5NXpkR0YwWlM1eGRXbGpheTV0WVhBb1puVnVZM1JwYjI0Z0tHbDBaVzBzSUdsdVpHVjRLU0I3WEc0Z0lDQWdJQ0FnSUhaaGNpQmpiR0Z6YzA1aGJXVWdQU0FuWTI5c0xURW5PMXh1WEc0Z0lDQWdJQ0FnSUdsbUlDaHBibVJsZUNBOVBUMGdNQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lHTnNZWE56VG1GdFpTQXJQU0FuSUc5bVpuTmxkQzB6Snp0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTllMk5zWVhOelRtRnRaWDBnYTJWNVBYdHBibVJsZUgwK1hHNGdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbUp2ZUZ3aVBseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCN2FYUmxiUzUwWlhoMGZWeHVJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0lDQWdJQ2s3WEc0Z0lDQWdJQ0I5S1R0Y2JseHVJQ0FnSUNBZ2NYVnBZMnRmYkc5dmF5QTlJQ2hjYmlBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0p4ZFdsamF5MXNiMjlyWENJZ2NtVm1QVndpY1hWcFkyc3RiRzl2YTF3aVBseHVJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2lZMjl1ZEhKdmJGd2lQbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BHRWdZMnhoYzNOT1lXMWxQVndpWW5WMGRHOXVYQ0lnYjI1RGJHbGphejE3ZEdocGN5NWZiVzkyWlVadmNuZGhjbVI5UGp4SlkyOXVJSFI1Y0dVOVhDSmhjbkp2ZHkxc1pXWjBYQ0lnTHo0OEwyRStYRzRnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0pqYjI1MFpXNTBYQ0krWEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2lkSEpwWTJ4dmNITmxYQ0krWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2lhVzV1WlhKY0lqNWNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSHR4ZFdsamExOXBkR1Z0YzMxY2JseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4dVhHNGdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hHNGdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSmpiMjUwY205c1hDSStYRzRnSUNBZ0lDQWdJQ0FnSUNBOFlTQmpiR0Z6YzA1aGJXVTlYQ0ppZFhSMGIyNWNJaUJ2YmtOc2FXTnJQWHQwYUdsekxsOXRiM1psUW1GamEzZGhjbVI5UGp4SlkyOXVJSFI1Y0dVOVhDSmhjbkp2ZHkxeWFXZG9kRndpSUM4K1BDOWhQbHh1SUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBZ0lDazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1kyeGhjM05mYm1GdFpYTXVjSFZ6YUNoMGFHbHpMbkJ5YjNCekxtTnNZWE56VG1GdFpTazdYRzVjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BGUnlJR05zWVhOelRtRnRaVDE3WTJ4aGMzTmZibUZ0WlhNdWFtOXBiaWduSUNjcGZUNWNiaUFnSUNBZ0lDQWdQRlJrSUdOdmJGTndZVzQ5ZTNOMGIzSmxMbWRsZENnbmFHVmhaR2x1WjNNbktTNXNaVzVuZEdoOVBseHVJQ0FnSUNBZ0lDQWdJRHhtYVdWc1pITmxkQ0JqYkdGemMwNWhiV1U5WENKelpYQmhjbUYwYjNKY0lqNWNiaUFnSUNBZ0lDQWdJQ0FnSUR4c1pXZGxibVFnWVd4cFoyNDlYQ0pqWlc1MFpYSmNJajVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdQRlJoWW5NZ2RHRmljejE3ZEdGaWMzMGdMejVjYmlBZ0lDQWdJQ0FnSUNBZ0lEd3ZiR1ZuWlc1a1BseHVJQ0FnSUNBZ0lDQWdJRHd2Wm1sbGJHUnpaWFErWEc0Z0lDQWdJQ0FnSUNBZ2UzRjFhV05yWDJ4dmIydDlYRzRnSUNBZ0lDQWdJQ0FnUEZkbGJHeE9ZWFlnZDJWc2JFbGtQWHQzWld4c0xtTnBaSDBnYzJsNlpUMWNJbk50WVd4c1hDSWdkSGx3WlQxN2QyVnNiQzVuWlhRb0oweHBablJmVkhsd1pTY3BmU0F2UGx4dUlDQWdJQ0FnSUNBOEwxUmtQbHh1SUNBZ0lDQWdQQzlVY2o1Y2JpQWdJQ0FwTzF4dUlDQjlMRnh1SUNCZloyVjBWR0ZpY3pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUIwWVdKeklEMGdXMXh1SUNBZ0lDQWdlMmxqYjI0NklIdDBlWEJsT2lBbllYSnliM2N0ZFhBbmZTd2dJQ0FnWVdOMGFXOXVPaUIwYUdsekxsOXpaV3hsWTNSUWNtVjJmU3hjYmlBZ0lDQWdJSHRwWTI5dU9pQjdkSGx3WlRvZ0oyRnljbTkzTFdSdmQyNG5mU3dnSUdGamRHbHZiam9nZEdocGN5NWZjMlZzWldOMFRtVjRkSDBzWEc0Z0lDQWdJQ0I3YVdOdmJqb2dlM1I1Y0dVNklITnBlbVZmZEc5bloyeGxmU3dnSUNCaFkzUnBiMjQ2SUhSb2FYTXVYM05wZW1WVWIyZG5iR1Y5TEZ4dUlDQWdJQ0FnZTJsamIyNDZJSHQwZVhCbE9pQW5ZMnh2YzJVbmZTd2dJQ0FnSUNBZ1lXTjBhVzl1T2lCMGFHbHpMbDlqYkc5elpYMWNiaUFnSUNCZE8xeHVYRzRnSUNBZ2FXWWdLQ0VnZEdocGN5NXdjbTl3Y3k1d2NtVjJLU0I3WEc0Z0lDQWdJQ0JrWld4bGRHVWdkR0ZpYzFzd1hUdGNiaUFnSUNCOVhHNWNiaUFnSUNCcFppQW9JU0IwYUdsekxuQnliM0J6TG01bGVIUXBJSHRjYmlBZ0lDQWdJR1JsYkdWMFpTQjBZV0p6V3pGZE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUhKbGRIVnliaUIwWVdKek8xeHVJQ0I5TEZ4dUlDQmZiVzkyWlVadmNuZGhjbVE2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCemRHOXlaUzVuWlhRb0ozRjFhV05ySnlrdVoyOUNZV05yS0NrN1hHNWNiaUFnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHR4ZFdsamF6b2djM1J2Y21VdVoyVjBLQ2R4ZFdsamF5Y3BMblJ2U2xOUFRpZ3BmU2s3WEc0Z0lIMHNYRzRnSUY5dGIzWmxRbUZqYTNkaGNtUTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J6ZEc5eVpTNW5aWFFvSjNGMWFXTnJKeWt1WjI5R2IzSjNZWEprS0NrN1hHNWNiaUFnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHR4ZFdsamF6b2djM1J2Y21VdVoyVjBLQ2R4ZFdsamF5Y3BMblJ2U2xOUFRpZ3BmU2s3WEc0Z0lIMHNYRzRnSUY5elpXeGxZM1JRY21WMk9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdhV1lnS0hSb2FYTXVjSEp2Y0hNdWNISmxkaWtnZTF4dUlDQWdJQ0FnZEdocGN5NWZjM2RwZEdOb0tIUm9hWE11Y0hKdmNITXVjSEpsZGlrN1hHNGdJQ0FnZlZ4dUlDQjlMRnh1SUNCZmMyVnNaV04wVG1WNGREb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJR2xtSUNoMGFHbHpMbkJ5YjNCekxtNWxlSFFwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVYM04zYVhSamFDaDBhR2x6TG5CeWIzQnpMbTVsZUhRcE8xeHVJQ0FnSUgxY2JpQWdmU3hjYmlBZ1gzTnBlbVZVYjJkbmJHVTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0JwWmlBb2RHaHBjeTV3Y205d2N5NXphWHBsVkc5bloyeGxLU0I3WEc0Z0lDQWdJQ0IwYUdsekxuQnliM0J6TG5OcGVtVlViMmRuYkdVb0tUdGNiaUFnSUNCOVhHNGdJSDBzWEc0Z0lGOWpiRzl6WlRvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIUm9hWE11WDNOM2FYUmphQ2dwTzF4dUlDQjlMRnh1SUNCZmMzZHBkR05vT2lCbWRXNWpkR2x2YmlBb1kybGtLU0I3WEc0Z0lDQWdhV1lnS0hSb2FYTXVjSEp2Y0hNdWMzZHBkR05vWlhJcElIdGNiaUFnSUNBZ0lIUm9hWE11Y0hKdmNITXVjM2RwZEdOb1pYSW9ZMmxrTENCMGNuVmxLVHRjYmlBZ0lDQjlYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUVGamRHbDJaVkp2ZDBSbGRHRnBiSE03WEc0aVhYMD0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERpc3BhdGNoZXIgPSByZXF1aXJlKCdmbHV4JykuRGlzcGF0Y2hlcjtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGlzcGF0Y2hlcigpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12ZDJWc2JGOW5jbWxrTDJScGMzQmhkR05vWlhJdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzV1VGQldTeERRVUZET3p0QlFVVmlMRWxCUVVrc1ZVRkJWU3hIUVVGSExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXl4VlFVRlZMRU5CUVVNN08wRkJSVFZETEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1NVRkJTU3hWUVVGVkxFVkJRVVVzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbHdpZFhObElITjBjbWxqZEZ3aU8xeHVYRzUyWVhJZ1JHbHpjR0YwWTJobGNpQTlJSEpsY1hWcGNtVW9KMlpzZFhnbktTNUVhWE53WVhSamFHVnlPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUc1bGR5QkVhWE53WVhSamFHVnlLQ2s3WEc0aVhYMD0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBNb2RlbCAgICA9IHJlcXVpcmUoJy4vaGVhZGluZ19tb2RlbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgbW9kZWw6IE1vZGVsLFxuICBjaGFuZ2VTb3J0OiBmdW5jdGlvbiAoc29ydGVlKSB7XG4gICAgdmFyIG1vZGVsID0gdGhpcy5wYXJlbnQ7XG5cbiAgICBpZiAoISBtb2RlbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG1vZGVsLmdldCgnc29ydGVlJykuZW5kU29ydGluZygpO1xuICAgIG1vZGVsLnNldCgnc29ydGVlJywgc29ydGVlKTtcblxuICAgIHBheWxvYWQuc29ydGVlLnRvZ2dsZVNvcnREaXJlY3Rpb24oKTtcbiAgfSxcbiAgY2hhbmdlU29ydERpcmVjdGlvbjogZnVuY3Rpb24gKHNvcnRlZSkge1xuICAgIHNvcnRlZS50b2dnbGVTb3J0RGlyZWN0aW9uKCk7XG4gIH0sXG4gIHJlZ2lzdGVyV2l0aERpc3BhdGNoZXI6IGZ1bmN0aW9uIChkaXNwYXRjaGVyKSB7XG4gICAgdGhpcy5kaXNwYXRjaF90b2tlbiA9IGRpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgIHN3aXRjaCAocGF5bG9hZC5hY3Rpb24pIHtcbiAgICAgICAgY2FzZSB0YWJsZV9hY3Rpb25zLkNIQU5HRV9TT1JUOlxuICAgICAgICAgIHRoaXMuY2hhbmdlU29ydChwYXlsb2FkLnNvcnRlZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgdGFibGVfYWN0aW9ucy5DSEFOR0VfU09SVF9ESVI6XG4gICAgICAgICAgdGhpcy5jaGFuZ2VTb3J0RGlyZWN0aW9uKHBheWxvYWQuc29ydGVlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpO1xuICB9XG59KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdmQyVnNiRjluY21sa0wyaGxZV1JwYm1kZlkyOXNiR1ZqZEdsdmJpNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4WlFVRlpMRU5CUVVNN08wRkJSV0lzU1VGQlNTeFJRVUZSTEVkQlFVY3NUMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRE8wRkJRMjVETEVsQlFVa3NTMEZCU3l4TlFVRk5MRTlCUVU4c1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4RFFVRkRPenRCUVVVeFF5eE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMRkZCUVZFc1EwRkJReXhWUVVGVkxFTkJRVU1zVFVGQlRTeERRVUZETzBWQlF6RkRMRXRCUVVzc1JVRkJSU3hMUVVGTE8wVkJRMW9zVlVGQlZTeEZRVUZGTEZWQlFWVXNUVUZCVFN4RlFVRkZPMEZCUTJoRExFbEJRVWtzU1VGQlNTeExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJRenM3U1VGRmVFSXNTVUZCU1N4RlFVRkZMRXRCUVVzc1JVRkJSVHROUVVOWUxFOUJRVThzUzBGQlN5eERRVUZETzBGQlEyNUNMRXRCUVVzN08wbEJSVVFzUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhWUVVGVkxFVkJRVVVzUTBGQlF6dEJRVU55UXl4SlFVRkpMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zVVVGQlVTeEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVRkRPenRKUVVVMVFpeFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRzFDUVVGdFFpeEZRVUZGTEVOQlFVTTdSMEZEZEVNN1JVRkRSQ3h0UWtGQmJVSXNSVUZCUlN4VlFVRlZMRTFCUVUwc1JVRkJSVHRKUVVOeVF5eE5RVUZOTEVOQlFVTXNiVUpCUVcxQ0xFVkJRVVVzUTBGQlF6dEhRVU01UWp0RlFVTkVMSE5DUVVGelFpeEZRVUZGTEZWQlFWVXNWVUZCVlN4RlFVRkZPMGxCUXpWRExFbEJRVWtzUTBGQlF5eGpRVUZqTEVkQlFVY3NWVUZCVlN4RFFVRkRMRkZCUVZFc1EwRkJReXhWUVVGVkxFOUJRVThzUlVGQlJUdE5RVU16UkN4UlFVRlJMRTlCUVU4c1EwRkJReXhOUVVGTk8xRkJRM0JDTEV0QlFVc3NZVUZCWVN4RFFVRkRMRmRCUVZjN1ZVRkROVUlzU1VGQlNTeERRVUZETEZWQlFWVXNRMEZCUXl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03VlVGRGFFTXNUVUZCVFR0UlFVTlNMRXRCUVVzc1lVRkJZU3hEUVVGRExHVkJRV1U3VlVGRGFFTXNTVUZCU1N4RFFVRkRMRzFDUVVGdFFpeERRVUZETEU5QlFVOHNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenRWUVVONlF5eE5RVUZOTzA5QlExUTdTMEZEUml4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETzBkQlEyWTdRMEZEUml4RFFVRkRMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmNJblZ6WlNCemRISnBZM1JjSWp0Y2JseHVkbUZ5SUVKaFkydGliMjVsSUQwZ2NtVnhkV2x5WlNnblltRmphMkp2Ym1VbktUdGNiblpoY2lCTmIyUmxiQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHZhR1ZoWkdsdVoxOXRiMlJsYkNjcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRUpoWTJ0aWIyNWxMa052Ykd4bFkzUnBiMjR1WlhoMFpXNWtLSHRjYmlBZ2JXOWtaV3c2SUUxdlpHVnNMRnh1SUNCamFHRnVaMlZUYjNKME9pQm1kVzVqZEdsdmJpQW9jMjl5ZEdWbEtTQjdYRzRnSUNBZ2RtRnlJRzF2WkdWc0lEMGdkR2hwY3k1d1lYSmxiblE3WEc1Y2JpQWdJQ0JwWmlBb0lTQnRiMlJsYkNrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHMXZaR1ZzTG1kbGRDZ25jMjl5ZEdWbEp5a3VaVzVrVTI5eWRHbHVaeWdwTzF4dUlDQWdJRzF2WkdWc0xuTmxkQ2duYzI5eWRHVmxKeXdnYzI5eWRHVmxLVHRjYmx4dUlDQWdJSEJoZVd4dllXUXVjMjl5ZEdWbExuUnZaMmRzWlZOdmNuUkVhWEpsWTNScGIyNG9LVHRjYmlBZ2ZTeGNiaUFnWTJoaGJtZGxVMjl5ZEVScGNtVmpkR2x2YmpvZ1puVnVZM1JwYjI0Z0tITnZjblJsWlNrZ2UxeHVJQ0FnSUhOdmNuUmxaUzUwYjJkbmJHVlRiM0owUkdseVpXTjBhVzl1S0NrN1hHNGdJSDBzWEc0Z0lISmxaMmx6ZEdWeVYybDBhRVJwYzNCaGRHTm9aWEk2SUdaMWJtTjBhVzl1SUNoa2FYTndZWFJqYUdWeUtTQjdYRzRnSUNBZ2RHaHBjeTVrYVhOd1lYUmphRjkwYjJ0bGJpQTlJR1JwYzNCaGRHTm9aWEl1Y21WbmFYTjBaWElvWm5WdVkzUnBiMjRnS0hCaGVXeHZZV1FwSUh0Y2JpQWdJQ0FnSUhOM2FYUmphQ0FvY0dGNWJHOWhaQzVoWTNScGIyNHBJSHRjYmlBZ0lDQWdJQ0FnWTJGelpTQjBZV0pzWlY5aFkzUnBiMjV6TGtOSVFVNUhSVjlUVDFKVU9seHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdVkyaGhibWRsVTI5eWRDaHdZWGxzYjJGa0xuTnZjblJsWlNrN1hHNGdJQ0FnSUNBZ0lDQWdZbkpsWVdzN1hHNGdJQ0FnSUNBZ0lHTmhjMlVnZEdGaWJHVmZZV04wYVc5dWN5NURTRUZPUjBWZlUwOVNWRjlFU1ZJNlhHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1amFHRnVaMlZUYjNKMFJHbHlaV04wYVc5dUtIQmhlV3h2WVdRdWMyOXlkR1ZsS1R0Y2JpQWdJQ0FnSUNBZ0lDQmljbVZoYXp0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5TG1KcGJtUW9kR2hwY3lrcE8xeHVJQ0I5WEc1OUtUdGNiaUpkZlE9PSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZGlyZWN0aW9ucztcbnZhciBNb2RlbDtcbnZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG5cbmRpcmVjdGlvbnMgPSB7XG4gIGFzYzogICdkZXNjJyxcbiAgZGVzYzogJ2FzYydcbn07XG5cbk1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgZGVmYXVsdHM6IHtcbiAgICBkaXJlY3Rpb246ICBudWxsLFxuICAgIGxvY2tlZDogICAgIGZhbHNlLFxuICAgIG1pbmltYWw6ICAgIGZhbHNlLFxuICAgIG5hbWU6ICAgICAgIG51bGwsXG4gICAgcmVzaXphYmxlOiAgZmFsc2UsXG4gICAgc29ydGFibGU6ICAgZmFsc2UsXG4gICAgdGl0bGU6ICAgICAgbnVsbCxcbiAgICB3aWR0aDogICAgICBudWxsXG4gIH0sXG4gIHRvZ2dsZVNvcnREaXJlY3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3VycmVudCA9IHRoaXMuZ2V0KCdkaXJlY3Rpb24nKTtcbiAgICB2YXIgbmV4dCAgICA9ICdhc2MnO1xuXG4gICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgIG5leHQgPSBkaXJlY3Rpb25zW2N1cnJlbnRdO1xuICAgIH1cblxuICAgIHRoaXMuc2V0KCdkaXJlY3Rpb24nLCBuZXh0KTtcbiAgfSxcbiAgZW5kU29ydGluZzogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0KCdkaXJlY3Rpb24nLCBudWxsKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWw7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZkMlZzYkY5bmNtbGtMMmhsWVdScGJtZGZiVzlrWld3dWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzV1VGQldTeERRVUZET3p0QlFVVmlMRWxCUVVrc1ZVRkJWU3hEUVVGRE8wRkJRMllzU1VGQlNTeExRVUZMTEVOQlFVTTdRVUZEVml4SlFVRkpMRkZCUVZFc1IwRkJSeXhQUVVGUExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTTdPMEZCUlc1RExGVkJRVlVzUjBGQlJ6dEZRVU5ZTEVkQlFVY3NSMEZCUnl4TlFVRk5PMFZCUTFvc1NVRkJTU3hGUVVGRkxFdEJRVXM3UVVGRFlpeERRVUZETEVOQlFVTTdPMEZCUlVZc1MwRkJTeXhIUVVGSExGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4RFFVRkRPMFZCUXpWQ0xGRkJRVkVzUlVGQlJUdEpRVU5TTEZOQlFWTXNSMEZCUnl4SlFVRkpPMGxCUTJoQ0xFMUJRVTBzVFVGQlRTeExRVUZMTzBsQlEycENMRTlCUVU4c1MwRkJTeXhMUVVGTE8wbEJRMnBDTEVsQlFVa3NVVUZCVVN4SlFVRkpPMGxCUTJoQ0xGTkJRVk1zUjBGQlJ5eExRVUZMTzBsQlEycENMRkZCUVZFc1NVRkJTU3hMUVVGTE8wbEJRMnBDTEV0QlFVc3NUMEZCVHl4SlFVRkpPMGxCUTJoQ0xFdEJRVXNzVDBGQlR5eEpRVUZKTzBkQlEycENPMFZCUTBRc2JVSkJRVzFDTEVWQlFVVXNXVUZCV1R0SlFVTXZRaXhKUVVGSkxFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRE8wRkJRM2hETEVsQlFVa3NTVUZCU1N4SlFVRkpMRTFCUVUwc1MwRkJTeXhEUVVGRE96dEpRVVZ3UWl4SlFVRkpMRTlCUVU4c1JVRkJSVHROUVVOWUxFbEJRVWtzUjBGQlJ5eFZRVUZWTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1FVRkRha01zUzBGQlN6czdTVUZGUkN4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExGZEJRVmNzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0SFFVTTNRanRGUVVORUxGVkJRVlVzUlVGQlJTeFpRVUZaTzBsQlEzUkNMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zVjBGQlZ5eEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPMGRCUXpkQ08wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eExRVUZMTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpjSW5WelpTQnpkSEpwWTNSY0lqdGNibHh1ZG1GeUlHUnBjbVZqZEdsdmJuTTdYRzUyWVhJZ1RXOWtaV3c3WEc1MllYSWdRbUZqYTJKdmJtVWdQU0J5WlhGMWFYSmxLQ2RpWVdOclltOXVaU2NwTzF4dVhHNWthWEpsWTNScGIyNXpJRDBnZTF4dUlDQmhjMk02SUNBblpHVnpZeWNzWEc0Z0lHUmxjMk02SUNkaGMyTW5YRzU5TzF4dVhHNU5iMlJsYkNBOUlFSmhZMnRpYjI1bExrMXZaR1ZzTG1WNGRHVnVaQ2g3WEc0Z0lHUmxabUYxYkhSek9pQjdYRzRnSUNBZ1pHbHlaV04wYVc5dU9pQWdiblZzYkN4Y2JpQWdJQ0JzYjJOclpXUTZJQ0FnSUNCbVlXeHpaU3hjYmlBZ0lDQnRhVzVwYldGc09pQWdJQ0JtWVd4elpTeGNiaUFnSUNCdVlXMWxPaUFnSUNBZ0lDQnVkV3hzTEZ4dUlDQWdJSEpsYzJsNllXSnNaVG9nSUdaaGJITmxMRnh1SUNBZ0lITnZjblJoWW14bE9pQWdJR1poYkhObExGeHVJQ0FnSUhScGRHeGxPaUFnSUNBZ0lHNTFiR3dzWEc0Z0lDQWdkMmxrZEdnNklDQWdJQ0FnYm5Wc2JGeHVJQ0I5TEZ4dUlDQjBiMmRuYkdWVGIzSjBSR2x5WldOMGFXOXVPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZG1GeUlHTjFjbkpsYm5RZ1BTQjBhR2x6TG1kbGRDZ25aR2x5WldOMGFXOXVKeWs3WEc0Z0lDQWdkbUZ5SUc1bGVIUWdJQ0FnUFNBbllYTmpKenRjYmx4dUlDQWdJR2xtSUNoamRYSnlaVzUwS1NCN1hHNGdJQ0FnSUNCdVpYaDBJRDBnWkdseVpXTjBhVzl1YzF0amRYSnlaVzUwWFR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0IwYUdsekxuTmxkQ2duWkdseVpXTjBhVzl1Snl3Z2JtVjRkQ2s3WEc0Z0lIMHNYRzRnSUdWdVpGTnZjblJwYm1jNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjBhR2x6TG5ObGRDZ25aR2x5WldOMGFXOXVKeXdnYm5Wc2JDazdYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUUxdlpHVnNPMXh1SWwxOSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBhY3Rpb25zOiAgICAgICAgICAgIHJlcXVpcmUoJy4vYWN0aW9ucycpLFxuICBkaXNwYXRjaGVyOiAgICAgICAgIHJlcXVpcmUoJy4vZGlzcGF0Y2hlcicpLFxuICBzdG9yZTogICAgICAgICAgICAgIHJlcXVpcmUoJy4vc3RvcmUnKSxcbiAgaGVhZGluZ19jb2xsZWN0aW9uOiByZXF1aXJlKCcuL2hlYWRpbmdfY29sbGVjdGlvbicpLFxuICBoZWFkaW5nX21vZGVsOiAgICAgIHJlcXVpcmUoJy4vaGVhZGluZ19tb2RlbCcpLFxuICB2aWV3OiAgICAgICAgICAgICAgIHJlcXVpcmUoJy4vdmlldy5qc3gnKVxufTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdmQyVnNiRjluY21sa0wybHVaR1Y0TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWM3UlVGRFppeFBRVUZQTEdGQlFXRXNUMEZCVHl4RFFVRkRMRmRCUVZjc1EwRkJRenRGUVVONFF5eFZRVUZWTEZWQlFWVXNUMEZCVHl4RFFVRkRMR05CUVdNc1EwRkJRenRGUVVNelF5eExRVUZMTEdWQlFXVXNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJRenRGUVVOMFF5eHJRa0ZCYTBJc1JVRkJSU3hQUVVGUExFTkJRVU1zYzBKQlFYTkNMRU5CUVVNN1JVRkRia1FzWVVGQllTeFBRVUZQTEU5QlFVOHNRMEZCUXl4cFFrRkJhVUlzUTBGQlF6dEZRVU01UXl4SlFVRkpMR2RDUVVGblFpeFBRVUZQTEVOQlFVTXNXVUZCV1N4RFFVRkRPME5CUXpGRExFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKdGIyUjFiR1V1Wlhod2IzSjBjeUE5SUh0Y2JpQWdZV04wYVc5dWN6b2dJQ0FnSUNBZ0lDQWdJQ0J5WlhGMWFYSmxLQ2N1TDJGamRHbHZibk1uS1N4Y2JpQWdaR2x6Y0dGMFkyaGxjam9nSUNBZ0lDQWdJQ0J5WlhGMWFYSmxLQ2N1TDJScGMzQmhkR05vWlhJbktTeGNiaUFnYzNSdmNtVTZJQ0FnSUNBZ0lDQWdJQ0FnSUNCeVpYRjFhWEpsS0NjdUwzTjBiM0psSnlrc1hHNGdJR2hsWVdScGJtZGZZMjlzYkdWamRHbHZiam9nY21WeGRXbHlaU2duTGk5b1pXRmthVzVuWDJOdmJHeGxZM1JwYjI0bktTeGNiaUFnYUdWaFpHbHVaMTl0YjJSbGJEb2dJQ0FnSUNCeVpYRjFhWEpsS0NjdUwyaGxZV1JwYm1kZmJXOWtaV3duS1N4Y2JpQWdkbWxsZHpvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J5WlhGMWFYSmxLQ2N1TDNacFpYY3Vhbk40SnlsY2JuMDdYRzRpWFgwPSIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBRdWlja0xvb2sgKGl0ZW1zKSB7XG4gIHZhciBwcmV2O1xuICB2YXIgbGFzdDtcblxuICBpZiAoISBBcnJheS5pc0FycmF5KGl0ZW1zKSkge1xuICAgIGl0ZW1zID0gW2l0ZW1zXTtcbiAgfVxuXG4gIGxhc3QgPSBpdGVtc1tpdGVtcy5sZW5ndGggLSAxXTtcblxuICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgaWYgKHByZXYpIHtcbiAgICAgIHByZXYubmV4dCA9IGl0ZW07XG4gICAgfVxuXG4gICAgaXRlbS5wcmV2ID0gcHJldjtcbiAgICBwcmV2ID0gaXRlbTtcbiAgfSk7XG5cbiAgaXRlbXNbMF0ucHJldiA9IGxhc3Q7XG4gIGxhc3QubmV4dCAgICAgPSBpdGVtc1swXTtcblxuICB0aGlzLmN1cnJlbnQgPSBpdGVtc1swXTtcbiAgdGhpcy5pdGVtcyA9IGl0ZW1zO1xuICB0aGlzLmluaXQoKTtcbn1cblxuUXVpY2tMb29rLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLml0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgaXRlbS50ZXh0ID0gJ1F1aWNrIExvb2sgJyArIGluZGV4O1xuICAgIGl0ZW0uaWQgICA9ICdxbC0nICsgaW5kZXg7XG4gIH0pO1xufTtcblxuUXVpY2tMb29rLnByb3RvdHlwZS5nZXQzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaTtcbiAgdmFyIGN1cnJlbnQgPSB0aGlzLmN1cnJlbnQ7XG4gIHZhciBpdGVtcyA9IFtdO1xuXG4gIGZvciAoaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICBpdGVtcy5wdXNoKGN1cnJlbnQpO1xuICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHQ7XG4gIH1cblxuICByZXR1cm4gaXRlbXM7XG59O1xuXG5RdWlja0xvb2sucHJvdG90eXBlLmdvQmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5jdXJyZW50ID0gdGhpcy5jdXJyZW50LnByZXY7XG59O1xuXG5RdWlja0xvb2sucHJvdG90eXBlLmdvRm9yd2FyZCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5jdXJyZW50ID0gdGhpcy5jdXJyZW50Lm5leHQ7XG59O1xuXG5RdWlja0xvb2sucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuZ2V0MygpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWNrTG9vaztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdmQyVnNiRjluY21sa0wzRjFhV05yWDJ4dmIyc3Vhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1dVRkJXU3hEUVVGRE96dEJRVVZpTEZOQlFWTXNVMEZCVXl4RlFVRkZMRXRCUVVzc1JVRkJSVHRGUVVONlFpeEpRVUZKTEVsQlFVa3NRMEZCUXp0QlFVTllMRVZCUVVVc1NVRkJTU3hKUVVGSkxFTkJRVU03TzBWQlJWUXNTVUZCU1N4RlFVRkZMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zUzBGQlN5eERRVUZETEVWQlFVVTdTVUZETVVJc1MwRkJTeXhIUVVGSExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdRVUZEY0VJc1IwRkJSenM3UVVGRlNDeEZRVUZGTEVsQlFVa3NSMEZCUnl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXpzN1JVRkZMMElzUzBGQlN5eERRVUZETEU5QlFVOHNRMEZCUXl4VlFVRlZMRWxCUVVrc1JVRkJSVHRKUVVNMVFpeEpRVUZKTEVsQlFVa3NSVUZCUlR0TlFVTlNMRWxCUVVrc1EwRkJReXhKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEzWkNMRXRCUVVzN08wbEJSVVFzU1VGQlNTeERRVUZETEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNN1NVRkRha0lzU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXp0QlFVTm9RaXhIUVVGSExFTkJRVU1zUTBGQlF6czdSVUZGU0N4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXp0QlFVTjJRaXhGUVVGRkxFbEJRVWtzUTBGQlF5eEpRVUZKTEU5QlFVOHNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE96dEZRVVY2UWl4SlFVRkpMRU5CUVVNc1QwRkJUeXhIUVVGSExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0RlFVTjRRaXhKUVVGSkxFTkJRVU1zUzBGQlN5eEhRVUZITEV0QlFVc3NRMEZCUXp0RlFVTnVRaXhKUVVGSkxFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlFVTTdRVUZEWkN4RFFVRkRPenRCUVVWRUxGTkJRVk1zUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4SFFVRkhMRmxCUVZrN1JVRkRja01zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1ZVRkJWU3hKUVVGSkxFVkJRVVVzUzBGQlN5eEZRVUZGTzBsQlEzaERMRWxCUVVrc1EwRkJReXhKUVVGSkxFZEJRVWNzWVVGQllTeEhRVUZITEV0QlFVc3NRMEZCUXp0SlFVTnNReXhKUVVGSkxFTkJRVU1zUlVGQlJTeExRVUZMTEV0QlFVc3NSMEZCUnl4TFFVRkxMRU5CUVVNN1IwRkRNMElzUTBGQlF5eERRVUZETzBGQlEwd3NRMEZCUXl4RFFVRkRPenRCUVVWR0xGTkJRVk1zUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4SFFVRkhMRmxCUVZrN1JVRkRja01zU1VGQlNTeERRVUZETEVOQlFVTTdSVUZEVGl4SlFVRkpMRTlCUVU4c1IwRkJSeXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETzBGQlF6ZENMRVZCUVVVc1NVRkJTU3hMUVVGTExFZEJRVWNzUlVGQlJTeERRVUZET3p0RlFVVm1MRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc1JVRkJSU3hGUVVGRk8wbEJRM1JDTEV0QlFVc3NRMEZCUXl4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03U1VGRGNFSXNUMEZCVHl4SFFVRkhMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU03UVVGRE0wSXNSMEZCUnpzN1JVRkZSQ3hQUVVGUExFdEJRVXNzUTBGQlF6dEJRVU5tTEVOQlFVTXNRMEZCUXpzN1FVRkZSaXhUUVVGVExFTkJRVU1zVTBGQlV5eERRVUZETEUxQlFVMHNSMEZCUnl4WlFVRlpPMFZCUTNaRExFbEJRVWtzUTBGQlF5eFBRVUZQTEVkQlFVY3NTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU03UVVGRGJrTXNRMEZCUXl4RFFVRkRPenRCUVVWR0xGTkJRVk1zUTBGQlF5eFRRVUZUTEVOQlFVTXNVMEZCVXl4SFFVRkhMRmxCUVZrN1JVRkRNVU1zU1VGQlNTeERRVUZETEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF6dEJRVU51UXl4RFFVRkRMRU5CUVVNN08wRkJSVVlzVTBGQlV5eERRVUZETEZOQlFWTXNRMEZCUXl4TlFVRk5MRWRCUVVjc1dVRkJXVHRGUVVOMlF5eFBRVUZQTEVsQlFVa3NRMEZCUXl4SlFVRkpMRVZCUVVVc1EwRkJRenRCUVVOeVFpeERRVUZET3p0QlFVVkVMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzVTBGQlV5eERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaVhDSjFjMlVnYzNSeWFXTjBYQ0k3WEc1Y2JtWjFibU4wYVc5dUlGRjFhV05yVEc5dmF5QW9hWFJsYlhNcElIdGNiaUFnZG1GeUlIQnlaWFk3WEc0Z0lIWmhjaUJzWVhOME8xeHVYRzRnSUdsbUlDZ2hJRUZ5Y21GNUxtbHpRWEp5WVhrb2FYUmxiWE1wS1NCN1hHNGdJQ0FnYVhSbGJYTWdQU0JiYVhSbGJYTmRPMXh1SUNCOVhHNWNiaUFnYkdGemRDQTlJR2wwWlcxelcybDBaVzF6TG14bGJtZDBhQ0F0SURGZE8xeHVYRzRnSUdsMFpXMXpMbVp2Y2tWaFkyZ29ablZ1WTNScGIyNGdLR2wwWlcwcElIdGNiaUFnSUNCcFppQW9jSEpsZGlrZ2UxeHVJQ0FnSUNBZ2NISmxkaTV1WlhoMElEMGdhWFJsYlR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwZEdWdExuQnlaWFlnUFNCd2NtVjJPMXh1SUNBZ0lIQnlaWFlnUFNCcGRHVnRPMXh1SUNCOUtUdGNibHh1SUNCcGRHVnRjMXN3WFM1d2NtVjJJRDBnYkdGemREdGNiaUFnYkdGemRDNXVaWGgwSUNBZ0lDQTlJR2wwWlcxeld6QmRPMXh1WEc0Z0lIUm9hWE11WTNWeWNtVnVkQ0E5SUdsMFpXMXpXekJkTzF4dUlDQjBhR2x6TG1sMFpXMXpJRDBnYVhSbGJYTTdYRzRnSUhSb2FYTXVhVzVwZENncE8xeHVmVnh1WEc1UmRXbGphMHh2YjJzdWNISnZkRzkwZVhCbExtbHVhWFFnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUhSb2FYTXVhWFJsYlhNdVptOXlSV0ZqYUNobWRXNWpkR2x2YmlBb2FYUmxiU3dnYVc1a1pYZ3BJSHRjYmlBZ0lDQnBkR1Z0TG5SbGVIUWdQU0FuVVhWcFkyc2dURzl2YXlBbklDc2dhVzVrWlhnN1hHNGdJQ0FnYVhSbGJTNXBaQ0FnSUQwZ0ozRnNMU2NnS3lCcGJtUmxlRHRjYmlBZ2ZTazdYRzU5TzF4dVhHNVJkV2xqYTB4dmIyc3VjSEp2ZEc5MGVYQmxMbWRsZERNZ1BTQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lIWmhjaUJwTzF4dUlDQjJZWElnWTNWeWNtVnVkQ0E5SUhSb2FYTXVZM1Z5Y21WdWREdGNiaUFnZG1GeUlHbDBaVzF6SUQwZ1cxMDdYRzVjYmlBZ1ptOXlJQ2hwSUQwZ01Ec2dhU0E4SURNN0lHa3JLeWtnZTF4dUlDQWdJR2wwWlcxekxuQjFjMmdvWTNWeWNtVnVkQ2s3WEc0Z0lDQWdZM1Z5Y21WdWRDQTlJR04xY25KbGJuUXVibVY0ZER0Y2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCcGRHVnRjenRjYm4wN1hHNWNibEYxYVdOclRHOXZheTV3Y205MGIzUjVjR1V1WjI5Q1lXTnJJRDBnWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0IwYUdsekxtTjFjbkpsYm5RZ1BTQjBhR2x6TG1OMWNuSmxiblF1Y0hKbGRqdGNibjA3WEc1Y2JsRjFhV05yVEc5dmF5NXdjbTkwYjNSNWNHVXVaMjlHYjNKM1lYSmtJRDBnWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0IwYUdsekxtTjFjbkpsYm5RZ1BTQjBhR2x6TG1OMWNuSmxiblF1Ym1WNGREdGNibjA3WEc1Y2JsRjFhV05yVEc5dmF5NXdjbTkwYjNSNWNHVXVkRzlLVTA5T0lEMGdablZ1WTNScGIyNGdLQ2tnZTF4dUlDQnlaWFIxY200Z2RHaHBjeTVuWlhRektDazdYRzU5WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1VYVnBZMnRNYjI5ck8xeHVJbDE5IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdG9yZTtcbnZhciBCYWNrYm9uZSAgICAgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBUYWJsZUhlYWRpbmdzID0gcmVxdWlyZSgnLi9oZWFkaW5nX2NvbGxlY3Rpb24nKTtcbnZhciB0YWJsZV9hY3Rpb25zID0gcmVxdWlyZSgnLi9hY3Rpb25zJyk7XG52YXIgZGlzcGF0Y2hlciAgICA9IHJlcXVpcmUoJy4vZGlzcGF0Y2hlcicpO1xudmFyIFF1aWNrTG9vayAgICAgPSByZXF1aXJlKCcuL3F1aWNrX2xvb2snKTtcbnZhciB3ZWxsX2hlYWRpbmdzID0gbmV3IFRhYmxlSGVhZGluZ3MoKTtcbnZhciB3ZWxscyAgICAgICAgID0gbmV3IEJhY2tib25lLkNvbGxlY3Rpb24oKTtcblxud2VsbF9oZWFkaW5ncy5yZWdpc3RlcldpdGhEaXNwYXRjaGVyKGRpc3BhdGNoZXIpO1xuXG5zdG9yZSA9IG5ldyBCYWNrYm9uZS5Nb2RlbCh7XG4gIHdlbGxzOiAgICB3ZWxscyxcbiAgZmlyc3Q6ICAgIG51bGwsXG4gIGhlYWRpbmdzOiB3ZWxsX2hlYWRpbmdzLFxuICBzZWxlY3RlZDogbnVsbCxcbiAgc29ydGVlOiAgIG51bGwsXG4gIHF1aWNrOiAgICBuZXcgUXVpY2tMb29rKFt7d2lkdGg6IDF9LCB7d2lkdGg6IDF9LCB7d2lkdGg6IDF9LCB7d2lkdGg6IDF9LCB7d2lkdGg6IDF9LCB7d2lkdGg6IDF9XSlcbn0pO1xuXG5zdG9yZS5nZXQoJ2hlYWRpbmdzJykucGFyZW50ID0gc3RvcmU7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RvcmU7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZkMlZzYkY5bmNtbGtMM04wYjNKbExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEZsQlFWa3NRMEZCUXpzN1FVRkZZaXhKUVVGSkxFdEJRVXNzUTBGQlF6dEJRVU5XTEVsQlFVa3NVVUZCVVN4UlFVRlJMRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6dEJRVU40UXl4SlFVRkpMR0ZCUVdFc1IwRkJSeXhQUVVGUExFTkJRVU1zYzBKQlFYTkNMRU5CUVVNc1EwRkJRenRCUVVOd1JDeEpRVUZKTEdGQlFXRXNSMEZCUnl4UFFVRlBMRU5CUVVNc1YwRkJWeXhEUVVGRExFTkJRVU03UVVGRGVrTXNTVUZCU1N4VlFVRlZMRTFCUVUwc1QwRkJUeXhEUVVGRExHTkJRV01zUTBGQlF5eERRVUZETzBGQlF6VkRMRWxCUVVrc1UwRkJVeXhQUVVGUExFOUJRVThzUTBGQlF5eGpRVUZqTEVOQlFVTXNRMEZCUXp0QlFVTTFReXhKUVVGSkxHRkJRV0VzUjBGQlJ5eEpRVUZKTEdGQlFXRXNSVUZCUlN4RFFVRkRPMEZCUTNoRExFbEJRVWtzUzBGQlN5eFhRVUZYTEVsQlFVa3NVVUZCVVN4RFFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRE96dEJRVVU1UXl4aFFVRmhMRU5CUVVNc2MwSkJRWE5DTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNN08wRkJSV3BFTEV0QlFVc3NSMEZCUnl4SlFVRkpMRkZCUVZFc1EwRkJReXhMUVVGTExFTkJRVU03UlVGRGVrSXNTMEZCU3l4TFFVRkxMRXRCUVVzN1JVRkRaaXhMUVVGTExFdEJRVXNzU1VGQlNUdEZRVU5rTEZGQlFWRXNSVUZCUlN4aFFVRmhPMFZCUTNaQ0xGRkJRVkVzUlVGQlJTeEpRVUZKTzBWQlEyUXNUVUZCVFN4SlFVRkpMRWxCUVVrN1JVRkRaQ3hMUVVGTExFdEJRVXNzU1VGQlNTeFRRVUZUTEVOQlFVTXNRMEZCUXl4RFFVRkRMRXRCUVVzc1JVRkJSU3hEUVVGRExFTkJRVU1zUlVGQlJTeERRVUZETEV0QlFVc3NSVUZCUlN4RFFVRkRMRU5CUVVNc1JVRkJSU3hEUVVGRExFdEJRVXNzUlVGQlJTeERRVUZETEVOQlFVTXNSVUZCUlN4RFFVRkRMRXRCUVVzc1JVRkJSU3hEUVVGRExFTkJRVU1zUlVGQlJTeERRVUZETEV0QlFVc3NSVUZCUlN4RFFVRkRMRU5CUVVNc1JVRkJSU3hEUVVGRExFdEJRVXNzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUTI1SExFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVklMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNUVUZCVFN4SFFVRkhMRXRCUVVzc1EwRkJRenM3UVVGRmNrTXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhMUVVGTExFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKY0luVnpaU0J6ZEhKcFkzUmNJanRjYmx4dWRtRnlJSE4wYjNKbE8xeHVkbUZ5SUVKaFkydGliMjVsSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2RpWVdOclltOXVaU2NwTzF4dWRtRnlJRlJoWW14bFNHVmhaR2x1WjNNZ1BTQnlaWEYxYVhKbEtDY3VMMmhsWVdScGJtZGZZMjlzYkdWamRHbHZiaWNwTzF4dWRtRnlJSFJoWW14bFgyRmpkR2x2Ym5NZ1BTQnlaWEYxYVhKbEtDY3VMMkZqZEdsdmJuTW5LVHRjYm5aaGNpQmthWE53WVhSamFHVnlJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpOWthWE53WVhSamFHVnlKeWs3WEc1MllYSWdVWFZwWTJ0TWIyOXJJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHZjWFZwWTJ0ZmJHOXZheWNwTzF4dWRtRnlJSGRsYkd4ZmFHVmhaR2x1WjNNZ1BTQnVaWGNnVkdGaWJHVklaV0ZrYVc1bmN5Z3BPMXh1ZG1GeUlIZGxiR3h6SUNBZ0lDQWdJQ0FnUFNCdVpYY2dRbUZqYTJKdmJtVXVRMjlzYkdWamRHbHZiaWdwTzF4dVhHNTNaV3hzWDJobFlXUnBibWR6TG5KbFoybHpkR1Z5VjJsMGFFUnBjM0JoZEdOb1pYSW9aR2x6Y0dGMFkyaGxjaWs3WEc1Y2JuTjBiM0psSUQwZ2JtVjNJRUpoWTJ0aWIyNWxMazF2WkdWc0tIdGNiaUFnZDJWc2JITTZJQ0FnSUhkbGJHeHpMRnh1SUNCbWFYSnpkRG9nSUNBZ2JuVnNiQ3hjYmlBZ2FHVmhaR2x1WjNNNklIZGxiR3hmYUdWaFpHbHVaM01zWEc0Z0lITmxiR1ZqZEdWa09pQnVkV3hzTEZ4dUlDQnpiM0owWldVNklDQWdiblZzYkN4Y2JpQWdjWFZwWTJzNklDQWdJRzVsZHlCUmRXbGphMHh2YjJzb1czdDNhV1IwYURvZ01YMHNJSHQzYVdSMGFEb2dNWDBzSUh0M2FXUjBhRG9nTVgwc0lIdDNhV1IwYURvZ01YMHNJSHQzYVdSMGFEb2dNWDBzSUh0M2FXUjBhRG9nTVgxZEtWeHVmU2s3WEc1Y2JuTjBiM0psTG1kbGRDZ25hR1ZoWkdsdVozTW5LUzV3WVhKbGJuUWdQU0J6ZEc5eVpUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0J6ZEc5eVpUdGNiaUpkZlE9PSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgVGhXcmFwcGVyO1xudmFyIFRoICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvdGguanN4Jyk7XG52YXIgUmVhY3QgICAgICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBCYWNrYm9uZSAgICAgICAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xuXG5UaFdyYXBwZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGhXcmFwcGVyXCIsXG4gIHByb3BUeXBlczoge1xuICAgIHN0b3JlOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihCYWNrYm9uZS5Nb2RlbCkuaXNSZXF1aXJlZFxuICB9LFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5zdG9yZS50b0pTT04oKTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnByb3BzLnN0b3JlLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoc3RvcmUpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoc3RvcmUudG9KU09OKCkpO1xuICAgIH0sIHRoaXMpO1xuICB9LFxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHN0b3JlLm9mZignY2hhbmdlJywgbnVsbCwgdGhpcyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBuZXdfcHJvcHM7XG4gICAgdmFyIGRhdGEgICAgICA9IHRoaXMuc3RhdGU7XG5cbiAgICBuZXdfcHJvcHMgPSB7XG4gICAgICB0cmlnZ2VyU29ydDogICAgZGF0YS5zb3J0YWJsZSAmJiBkYXRhLm5hbWUgPyBkYXRhLm5hbWUgOiBudWxsLFxuICAgICAgc29ydERpcmVjdGlvbjogIGRhdGEuZGlyZWN0aW9uLFxuICAgICAgbWluaW1hbDogICAgICAgIGRhdGEubWluaW1hbCxcbiAgICAgIGxvY2tlZDogICAgICAgICBkYXRhLmxvY2tlZCxcbiAgICAgIHJlc2l6YWJsZTogICAgICBkYXRhLnJlc2l6YWJsZSxcbiAgICAgIHdpZHRoOiAgICAgICAgICBkYXRhLndpZHRoXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRoLCBSZWFjdC5fX3NwcmVhZCh7fSwgIHRoaXMucHJvcHMsICBuZXdfcHJvcHMpLCBcbiAgICAgICAgZGF0YS50aXRsZVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRoV3JhcHBlcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdmQyVnNiRjluY21sa0wzUm9YM2R5WVhCd1pYSXVhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRVVZCTEVkQlFVYzdPMEZCUlVnc1NVRkJTU3hUUVVGVExFTkJRVU03UVVGRFpDeEpRVUZKTEVWQlFVVXNaMEpCUVdkQ0xFOUJRVThzUTBGQlF5eDVRa0ZCZVVJc1EwRkJReXhEUVVGRE8wRkJRM3BFTEVsQlFVa3NTMEZCU3l4aFFVRmhMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU4yUXl4SlFVRkpMRkZCUVZFc1ZVRkJWU3hQUVVGUExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTTdPMEZCUlRGRExDdENRVUVyUWl4NVFrRkJRVHRGUVVNM1FpeFRRVUZUTEVWQlFVVTdTVUZEVkN4TFFVRkxMRVZCUVVVc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eFZRVUZWTEVOQlFVTXNVVUZCVVN4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExGVkJRVlU3UjBGRE4wUTdSVUZEUkN4bFFVRmxMRVZCUVVVc1dVRkJXVHRKUVVNelFpeFBRVUZQTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUlVGQlJTeERRVUZETzBkQlEyeERPMFZCUTBRc2FVSkJRV2xDTEVWQlFVVXNXVUZCV1R0SlFVTTNRaXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXl4RlFVRkZMRU5CUVVNc1VVRkJVU3hGUVVGRkxGVkJRVlVzUzBGQlN5eEZRVUZGTzAxQlF6ZERMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVMHNSVUZCUlN4RFFVRkRMRU5CUVVNN1MwRkRMMElzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0SFFVTldPMFZCUTBRc2IwSkJRVzlDTEVWQlFVVXNXVUZCV1R0SlFVTm9ReXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEZGQlFWRXNSVUZCUlN4SlFVRkpMRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU03UjBGRGFrTTdSVUZEUkN4TlFVRk5MRVZCUVVVc1dVRkJXVHRKUVVOc1FpeEpRVUZKTEZOQlFWTXNRMEZCUXp0QlFVTnNRaXhKUVVGSkxFbEJRVWtzU1VGQlNTeFJRVUZSTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNN08wbEJSVE5DTEZOQlFWTXNSMEZCUnp0TlFVTldMRmRCUVZjc1MwRkJTeXhKUVVGSkxFTkJRVU1zVVVGQlVTeEpRVUZKTEVsQlFVa3NRMEZCUXl4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRExFbEJRVWtzUjBGQlJ5eEpRVUZKTzAxQlF6ZEVMR0ZCUVdFc1IwRkJSeXhKUVVGSkxFTkJRVU1zVTBGQlV6dE5RVU01UWl4UFFVRlBMRk5CUVZNc1NVRkJTU3hEUVVGRExFOUJRVTg3VFVGRE5VSXNUVUZCVFN4VlFVRlZMRWxCUVVrc1EwRkJReXhOUVVGTk8wMUJRek5DTEZOQlFWTXNUMEZCVHl4SlFVRkpMRU5CUVVNc1UwRkJVenROUVVNNVFpeExRVUZMTEZkQlFWY3NTVUZCU1N4RFFVRkRMRXRCUVVzN1FVRkRhRU1zUzBGQlN5eERRVUZET3p0SlFVVkdPMDFCUTBVc2IwSkJRVU1zUlVGQlJTeEZRVUZCTEdkQ1FVRkJMRWRCUVVFc1EwRkJSU3hIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVWQlFVTXNRMEZCUlN4SFFVRkhMRk5CUVZjc1EwRkJRU3hGUVVGQk8xRkJRMmhETEVsQlFVa3NRMEZCUXl4TFFVRk5PMDFCUTFRc1EwRkJRVHROUVVOTU8wZEJRMGc3UVVGRFNDeERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEZOQlFWTXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFLbHh1SUNvZ1FHcHplQ0JTWldGamRDNUVUMDFjYmlBcUwxeHVYRzUyWVhJZ1ZHaFhjbUZ3Y0dWeU8xeHVkbUZ5SUZSb0lDQWdJQ0FnSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dUx5NHVMMk52YlhCdmJtVnVkSE12ZEdndWFuTjRKeWs3WEc1MllYSWdVbVZoWTNRZ0lDQWdJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRbktUdGNiblpoY2lCQ1lXTnJZbTl1WlNBZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkaVlXTnJZbTl1WlNjcE8xeHVYRzVVYUZkeVlYQndaWElnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJSEJ5YjNCVWVYQmxjem9nZTF4dUlDQWdJSE4wYjNKbE9pQlNaV0ZqZEM1UWNtOXdWSGx3WlhNdWFXNXpkR0Z1WTJWUFppaENZV05yWW05dVpTNU5iMlJsYkNrdWFYTlNaWEYxYVhKbFpGeHVJQ0I5TEZ4dUlDQm5aWFJKYm1sMGFXRnNVM1JoZEdVNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTV3Y205d2N5NXpkRzl5WlM1MGIwcFRUMDRvS1R0Y2JpQWdmU3hjYmlBZ1kyOXRjRzl1Wlc1MFJHbGtUVzkxYm5RNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjBhR2x6TG5CeWIzQnpMbk4wYjNKbExtOXVLQ2RqYUdGdVoyVW5MQ0JtZFc1amRHbHZiaUFvYzNSdmNtVXBJSHRjYmlBZ0lDQWdJSFJvYVhNdWMyVjBVM1JoZEdVb2MzUnZjbVV1ZEc5S1UwOU9LQ2twTzF4dUlDQWdJSDBzSUhSb2FYTXBPMXh1SUNCOUxGeHVJQ0JqYjIxd2IyNWxiblJYYVd4c1ZXNXRiM1Z1ZERvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lITjBiM0psTG05bVppZ25ZMmhoYm1kbEp5d2diblZzYkN3Z2RHaHBjeWs3WEc0Z0lIMHNYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQnVaWGRmY0hKdmNITTdYRzRnSUNBZ2RtRnlJR1JoZEdFZ0lDQWdJQ0E5SUhSb2FYTXVjM1JoZEdVN1hHNWNiaUFnSUNCdVpYZGZjSEp2Y0hNZ1BTQjdYRzRnSUNBZ0lDQjBjbWxuWjJWeVUyOXlkRG9nSUNBZ1pHRjBZUzV6YjNKMFlXSnNaU0FtSmlCa1lYUmhMbTVoYldVZ1B5QmtZWFJoTG01aGJXVWdPaUJ1ZFd4c0xGeHVJQ0FnSUNBZ2MyOXlkRVJwY21WamRHbHZiam9nSUdSaGRHRXVaR2x5WldOMGFXOXVMRnh1SUNBZ0lDQWdiV2x1YVcxaGJEb2dJQ0FnSUNBZ0lHUmhkR0V1YldsdWFXMWhiQ3hjYmlBZ0lDQWdJR3h2WTJ0bFpEb2dJQ0FnSUNBZ0lDQmtZWFJoTG14dlkydGxaQ3hjYmlBZ0lDQWdJSEpsYzJsNllXSnNaVG9nSUNBZ0lDQmtZWFJoTG5KbGMybDZZV0pzWlN4Y2JpQWdJQ0FnSUhkcFpIUm9PaUFnSUNBZ0lDQWdJQ0JrWVhSaExuZHBaSFJvWEc0Z0lDQWdmVHRjYmx4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThWR2dnZXk0dUxuUm9hWE11Y0hKdmNITjlJSHN1TGk1dVpYZGZjSEp2Y0hOOVBseHVJQ0FnSUNBZ0lDQjdaR0YwWVM1MGFYUnNaWDFjYmlBZ0lDQWdJRHd2VkdnK1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdWR2hYY21Gd2NHVnlPMXh1SWwxOSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgVGhlYWQ7XG52YXIgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBCYWNrYm9uZSAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyIFRyICAgICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvdHIuanN4Jyk7XG52YXIgVGggICAgICAgID0gcmVxdWlyZSgnLi90aF93cmFwcGVyLmpzeCcpO1xuXG5UaGVhZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUaGVhZFwiLFxuICBwcm9wVHlwZXM6IHtcbiAgICBzdG9yZTogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoQmFja2JvbmUuTW9kZWwpLmlzUmVxdWlyZWRcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbHMgPSB0aGlzLl9idWlsZENvbHVtbnMoKTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhlYWRcIiwge2NsYXNzTmFtZTogdGhpcy5wcm9wcy5jbGFzc05hbWV9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUciwgbnVsbCwgXG4gICAgICAgICAgY29sc1xuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgX2J1aWxkQ29sdW1uczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBkYXRhO1xuICAgIHZhciBjb2x1bW5zID0gW107XG4gICAgdmFyIHN0b3JlID0gdGhpcy5wcm9wcy5zdG9yZTtcbiAgICB2YXIgY3VycmVudCA9IHN0b3JlLmdldCgnZmlyc3QnKTtcblxuICAgIHdoaWxlIChjdXJyZW50KSB7XG4gICAgICBkYXRhICAgICAgICAgICAgICA9IHt9O1xuICAgICAgZGF0YS5oYW5kbGVDbGljayAgPSBjdXJyZW50LmdldCgnc29ydGFibGUnKSA/IHRoaXMuX3NvcnRIYW5kbGVyLmJpbmQodGhpcywgY3VycmVudCkgOiBudWxsO1xuICAgICAgZGF0YS5zdG9yZSAgICAgICAgPSBjdXJyZW50O1xuICAgICAgZGF0YS5jbGFzc05hbWUgICAgPSBjdXJyZW50LmdldCgndHlwZScpID09PSAnYWN0aW9ucycgPyAnYWN0aW9ucy1jb2wnIDogJyc7XG5cbiAgICAgIGNvbHVtbnMucHVzaChSZWFjdC5jcmVhdGVFbGVtZW50KFRoLCBSZWFjdC5fX3NwcmVhZCh7fSwgIGRhdGEsIHtrZXk6IGN1cnJlbnQuY2lkfSkpKTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbHVtbnM7XG4gIH0sXG4gIF9zb3J0SGFuZGxlcjogZnVuY3Rpb24gKHNvcnRlZSkge1xuICAgIHZhciBzdG9yZSAgID0gdGhpcy5wcm9wcy5zdG9yZTtcbiAgICB2YXIgY3VycmVudCA9IHN0b3JlLmdldCgnc29ydGVlJyk7XG5cbiAgICBpZiAoY3VycmVudC5jaWQgIT09IHNvcnRlZS5jaWQpIHtcbiAgICAgIGN1cnJlbnQuZW5kU29ydGluZygpO1xuICAgIH1cblxuICAgIHN0b3JlLnNldCgnc29ydGVlJywgc29ydGVlKTtcbiAgICBzb3J0ZWUudG9nZ2xlU29ydERpcmVjdGlvbigpO1xuXG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRoZWFkO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12ZDJWc2JGOW5jbWxrTDNSb1pXRmtYM2R5WVhCd1pYSXVhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRVVZCTEVkQlFVYzdPMEZCUlVnc1NVRkJTU3hMUVVGTExFTkJRVU03UVVGRFZpeEpRVUZKTEV0QlFVc3NUMEZCVHl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRGFrTXNTVUZCU1N4UlFVRlJMRWxCUVVrc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETzBGQlEzQkRMRWxCUVVrc1JVRkJSU3hWUVVGVkxFOUJRVThzUTBGQlF5eDVRa0ZCZVVJc1EwRkJReXhEUVVGRE8wRkJRMjVFTEVsQlFVa3NSVUZCUlN4VlFVRlZMRTlCUVU4c1EwRkJReXhyUWtGQmEwSXNRMEZCUXl4RFFVRkRPenRCUVVVMVF5d3lRa0ZCTWtJc2NVSkJRVUU3UlVGRGVrSXNVMEZCVXl4RlFVRkZPMGxCUTFRc1MwRkJTeXhGUVVGRkxFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNWVUZCVlN4RFFVRkRMRkZCUVZFc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eFZRVUZWTzBkQlF6ZEVPMFZCUTBRc1RVRkJUU3hGUVVGRkxGbEJRVms3UVVGRGRFSXNTVUZCU1N4SlFVRkpMRWxCUVVrc1IwRkJSeXhKUVVGSkxFTkJRVU1zWVVGQllTeEZRVUZGTEVOQlFVTTdPMGxCUldoRE8wMUJRMFVzYjBKQlFVRXNUMEZCVFN4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRk5CUVZjc1EwRkJRU3hGUVVGQk8xRkJRM1JETEc5Q1FVRkRMRVZCUVVVc1JVRkJRU3hKUVVGRExFVkJRVUU3VlVGRFJDeEpRVUZMTzFGQlEwZ3NRMEZCUVR0TlFVTkRMRU5CUVVFN1RVRkRVanRIUVVOSU8wVkJRMFFzWVVGQllTeEZRVUZGTEZsQlFWazdTVUZEZWtJc1NVRkJTU3hKUVVGSkxFTkJRVU03U1VGRFZDeEpRVUZKTEU5QlFVOHNSMEZCUnl4RlFVRkZMRU5CUVVNN1NVRkRha0lzU1VGQlNTeExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU03UVVGRGFrTXNTVUZCU1N4SlFVRkpMRTlCUVU4c1IwRkJSeXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPenRKUVVWcVF5eFBRVUZQTEU5QlFVOHNSVUZCUlR0TlFVTmtMRWxCUVVrc1owSkJRV2RDTEVWQlFVVXNRMEZCUXp0TlFVTjJRaXhKUVVGSkxFTkJRVU1zVjBGQlZ5eEpRVUZKTEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJWU3hEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxFOUJRVThzUTBGQlF5eEhRVUZITEVsQlFVa3NRMEZCUXp0TlFVTXpSaXhKUVVGSkxFTkJRVU1zUzBGQlN5eFZRVUZWTEU5QlFVOHNRMEZCUXp0QlFVTnNReXhOUVVGTkxFbEJRVWtzUTBGQlF5eFRRVUZUTEUxQlFVMHNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eFRRVUZUTEVkQlFVY3NZVUZCWVN4SFFVRkhMRVZCUVVVc1EwRkJRenM3VFVGRk0wVXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXh2UWtGQlF5eEZRVUZGTEVWQlFVRXNaMEpCUVVFc1IwRkJRU3hEUVVGRkxFZEJRVWNzU1VGQlNTeEZRVUZETEVOQlFVTXNRMEZCUVN4SFFVRkJMRVZCUVVjc1EwRkJSU3hQUVVGUExFTkJRVU1zUjBGQlNTeERRVUZCTEVOQlFVRXNRMEZCUnl4RFFVRkJMRU5CUVVNc1EwRkJRenROUVVOcVJDeFBRVUZQTEVkQlFVY3NUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJRenRCUVVNM1FpeExRVUZMT3p0SlFVVkVMRTlCUVU4c1QwRkJUeXhEUVVGRE8wZEJRMmhDTzBWQlEwUXNXVUZCV1N4RlFVRkZMRlZCUVZVc1RVRkJUU3hGUVVGRk8wbEJRemxDTEVsQlFVa3NTMEZCU3l4TFFVRkxMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETzBGQlEyNURMRWxCUVVrc1NVRkJTU3hQUVVGUExFZEJRVWNzUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenM3U1VGRmJFTXNTVUZCU1N4UFFVRlBMRU5CUVVNc1IwRkJSeXhMUVVGTExFMUJRVTBzUTBGQlF5eEhRVUZITEVWQlFVVTdUVUZET1VJc1QwRkJUeXhEUVVGRExGVkJRVlVzUlVGQlJTeERRVUZETzBGQlF6TkNMRXRCUVVzN08wbEJSVVFzUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4UlFVRlJMRVZCUVVVc1RVRkJUU3hEUVVGRExFTkJRVU03UVVGRGFFTXNTVUZCU1N4TlFVRk5MRU5CUVVNc2JVSkJRVzFDTEVWQlFVVXNRMEZCUXpzN1IwRkZPVUk3UVVGRFNDeERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEV0QlFVc3NRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFLbHh1SUNvZ1FHcHplQ0JTWldGamRDNUVUMDFjYmlBcUwxeHVYRzUyWVhJZ1ZHaGxZV1E3WEc1MllYSWdVbVZoWTNRZ0lDQWdJRDBnY21WeGRXbHlaU2duY21WaFkzUW5LVHRjYm5aaGNpQkNZV05yWW05dVpTQWdQU0J5WlhGMWFYSmxLQ2RpWVdOclltOXVaU2NwTzF4dWRtRnlJRlJ5SUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dUx5NHVMMk52YlhCdmJtVnVkSE12ZEhJdWFuTjRKeWs3WEc1MllYSWdWR2dnSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duTGk5MGFGOTNjbUZ3Y0dWeUxtcHplQ2NwTzF4dVhHNVVhR1ZoWkNBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNiaUFnY0hKdmNGUjVjR1Z6T2lCN1hHNGdJQ0FnYzNSdmNtVTZJRkpsWVdOMExsQnliM0JVZVhCbGN5NXBibk4wWVc1alpVOW1LRUpoWTJ0aWIyNWxMazF2WkdWc0tTNXBjMUpsY1hWcGNtVmtYRzRnSUgwc1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCamIyeHpJRDBnZEdocGN5NWZZblZwYkdSRGIyeDFiVzV6S0NrN1hHNWNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEhSb1pXRmtJR05zWVhOelRtRnRaVDE3ZEdocGN5NXdjbTl3Y3k1amJHRnpjMDVoYldWOVBseHVJQ0FnSUNBZ0lDQThWSEkrWEc0Z0lDQWdJQ0FnSUNBZ2UyTnZiSE45WEc0Z0lDQWdJQ0FnSUR3dlZISStYRzRnSUNBZ0lDQThMM1JvWldGa1BseHVJQ0FnSUNrN1hHNGdJSDBzWEc0Z0lGOWlkV2xzWkVOdmJIVnRibk02SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMllYSWdaR0YwWVR0Y2JpQWdJQ0IyWVhJZ1kyOXNkVzF1Y3lBOUlGdGRPMXh1SUNBZ0lIWmhjaUJ6ZEc5eVpTQTlJSFJvYVhNdWNISnZjSE11YzNSdmNtVTdYRzRnSUNBZ2RtRnlJR04xY25KbGJuUWdQU0J6ZEc5eVpTNW5aWFFvSjJacGNuTjBKeWs3WEc1Y2JpQWdJQ0IzYUdsc1pTQW9ZM1Z5Y21WdWRDa2dlMXh1SUNBZ0lDQWdaR0YwWVNBZ0lDQWdJQ0FnSUNBZ0lDQWdQU0I3ZlR0Y2JpQWdJQ0FnSUdSaGRHRXVhR0Z1Wkd4bFEyeHBZMnNnSUQwZ1kzVnljbVZ1ZEM1blpYUW9KM052Y25SaFlteGxKeWtnUHlCMGFHbHpMbDl6YjNKMFNHRnVaR3hsY2k1aWFXNWtLSFJvYVhNc0lHTjFjbkpsYm5RcElEb2diblZzYkR0Y2JpQWdJQ0FnSUdSaGRHRXVjM1J2Y21VZ0lDQWdJQ0FnSUQwZ1kzVnljbVZ1ZER0Y2JpQWdJQ0FnSUdSaGRHRXVZMnhoYzNOT1lXMWxJQ0FnSUQwZ1kzVnljbVZ1ZEM1blpYUW9KM1I1Y0dVbktTQTlQVDBnSjJGamRHbHZibk1uSUQ4Z0oyRmpkR2x2Ym5NdFkyOXNKeUE2SUNjbk8xeHVYRzRnSUNBZ0lDQmpiMngxYlc1ekxuQjFjMmdvUEZSb0lIc3VMaTVrWVhSaGZTQnJaWGs5ZTJOMWNuSmxiblF1WTJsa2ZTQXZQaWs3WEc0Z0lDQWdJQ0JqZFhKeVpXNTBJRDBnWTNWeWNtVnVkQzV1WlhoME8xeHVJQ0FnSUgxY2JseHVJQ0FnSUhKbGRIVnliaUJqYjJ4MWJXNXpPMXh1SUNCOUxGeHVJQ0JmYzI5eWRFaGhibVJzWlhJNklHWjFibU4wYVc5dUlDaHpiM0owWldVcElIdGNiaUFnSUNCMllYSWdjM1J2Y21VZ0lDQTlJSFJvYVhNdWNISnZjSE11YzNSdmNtVTdYRzRnSUNBZ2RtRnlJR04xY25KbGJuUWdQU0J6ZEc5eVpTNW5aWFFvSjNOdmNuUmxaU2NwTzF4dVhHNGdJQ0FnYVdZZ0tHTjFjbkpsYm5RdVkybGtJQ0U5UFNCemIzSjBaV1V1WTJsa0tTQjdYRzRnSUNBZ0lDQmpkWEp5Wlc1MExtVnVaRk52Y25ScGJtY29LVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnpkRzl5WlM1elpYUW9KM052Y25SbFpTY3NJSE52Y25SbFpTazdYRzRnSUNBZ2MyOXlkR1ZsTG5SdloyZHNaVk52Y25SRWFYSmxZM1JwYjI0b0tUdGNibHh1SUNCOVhHNTlLVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCVWFHVmhaRHRjYmlKZGZRPT0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFdlbGxMaXN0O1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBUaCAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvdGguanN4Jyk7XG52YXIgVGhlYWQgPSByZXF1aXJlKCcuL3RoZWFkX3dyYXBwZXIuanN4Jyk7XG52YXIgVGJvZHkgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL3Rib2R5LmpzeCcpO1xuXG52YXIgc2l6ZXMgPSB7XG4gIDIwMDogMjUwLFxuICAyNTA6IDIwMFxufTtcblxuV2VsbExpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiV2VsbExpc3RcIixcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0YWJsZVwiLCB7Y2xhc3NOYW1lOiBcImZ1bGwgaW5saW5lLWRldGFpbHNcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiY2FwdGlvblwiLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtvbkNsaWNrOiB0aGlzLl9jaGFuZ2VXaWR0aEhhbmRsZXJ9LCBcInRvZ2dsZSAybmQgY29sIHdpZHRoIHdpZHRoIGV4YW1wbGVcIikpLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUaGVhZCwge3N0b3JlOiB0aGlzLnByb3BzLnN0b3JlfSksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRib2R5LCB7c3RvcmU6IHRoaXMucHJvcHMuc3RvcmV9KVxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIF9jaGFuZ2VXaWR0aEhhbmRsZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3RvcmUgPSB0aGlzLnByb3BzLnN0b3JlLmdldCgnaGVhZGluZ3MnKTtcbiAgICB2YXIgdGhpcmQgPSBzdG9yZS5hdCgyKTtcblxuICAgIHRoaXJkLnNldCgnd2lkdGgnLCBzaXplc1t0aGlyZC5nZXQoJ3dpZHRoJyldIHx8IDIwMCk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdlbGxMaXN0O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12ZDJWc2JGOW5jbWxrTDNacFpYY3Vhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRVVZCTEVkQlFVYzdPMEZCUlVnc1NVRkJTU3hSUVVGUkxFTkJRVU03UVVGRFlpeEpRVUZKTEV0QlFVc3NSMEZCUnl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRE4wSXNTVUZCU1N4RlFVRkZMRTFCUVUwc1QwRkJUeXhEUVVGRExIbENRVUY1UWl4RFFVRkRMRU5CUVVNN1FVRkRMME1zU1VGQlNTeExRVUZMTEVkQlFVY3NUMEZCVHl4RFFVRkRMSEZDUVVGeFFpeERRVUZETEVOQlFVTTdRVUZETTBNc1NVRkJTU3hMUVVGTExFZEJRVWNzVDBGQlR5eERRVUZETERSQ1FVRTBRaXhEUVVGRExFTkJRVU03TzBGQlJXeEVMRWxCUVVrc1MwRkJTeXhIUVVGSE8wVkJRMVlzUjBGQlJ5eEZRVUZGTEVkQlFVYzdSVUZEVWl4SFFVRkhMRVZCUVVVc1IwRkJSenRCUVVOV0xFTkJRVU1zUTBGQlF6czdRVUZGUml3NFFrRkJPRUlzZDBKQlFVRTdSVUZETlVJc1RVRkJUU3hGUVVGRkxGbEJRVms3U1VGRGJFSTdUVUZEUlN4dlFrRkJRU3hQUVVGTkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMSEZDUVVGelFpeERRVUZCTEVWQlFVRTdVVUZEY2tNc2IwSkJRVUVzVTBGQlVTeEZRVUZCTEVsQlFVTXNSVUZCUVN4dlFrRkJRU3hMUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEU5QlFVRXNSVUZCVHl4RFFVRkZMRWxCUVVrc1EwRkJReXh0UWtGQmNVSXNRMEZCUVN4RlFVRkJMRzlEUVVGM1F5eERRVUZWTEVOQlFVRXNSVUZCUVR0UlFVTnVSeXh2UWtGQlF5eExRVUZMTEVWQlFVRXNRMEZCUVN4RFFVRkRMRXRCUVVFc1JVRkJTeXhEUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCVFN4RFFVRkJMRU5CUVVjc1EwRkJRU3hGUVVGQk8xRkJRMnhETEc5Q1FVRkRMRXRCUVVzc1JVRkJRU3hEUVVGQkxFTkJRVU1zUzBGQlFTeEZRVUZMTEVOQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTkxFTkJRVUVzUTBGQlJ5eERRVUZCTzAxQlF6VkNMRU5CUVVFN1RVRkRVanRIUVVOSU8wVkJRMFFzYlVKQlFXMUNMRVZCUVVVc1dVRkJXVHRKUVVNdlFpeEpRVUZKTEV0QlFVc3NSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNN1FVRkRha1FzU1VGQlNTeEpRVUZKTEV0QlFVc3NSMEZCUnl4TFFVRkxMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZET3p0SlFVVjRRaXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEU5QlFVOHNSVUZCUlN4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXl4SlFVRkpMRWRCUVVjc1EwRkJReXhEUVVGRE8wZEJRM1JFTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4UlFVRlJMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlFQnFjM2dnVW1WaFkzUXVSRTlOWEc0Z0tpOWNibHh1ZG1GeUlGZGxiR3hNYVhOME8xeHVkbUZ5SUZKbFlXTjBJRDBnY21WeGRXbHlaU2duY21WaFkzUW5LVHRjYm5aaGNpQlVhQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHVMeTR1TDJOdmJYQnZibVZ1ZEhNdmRHZ3Vhbk40SnlrN1hHNTJZWElnVkdobFlXUWdQU0J5WlhGMWFYSmxLQ2N1TDNSb1pXRmtYM2R5WVhCd1pYSXVhbk40SnlrN1hHNTJZWElnVkdKdlpIa2dQU0J5WlhGMWFYSmxLQ2N1TGk4dUxpOWpiMjF3YjI1bGJuUnpMM1JpYjJSNUxtcHplQ2NwTzF4dVhHNTJZWElnYzJsNlpYTWdQU0I3WEc0Z0lESXdNRG9nTWpVd0xGeHVJQ0F5TlRBNklESXdNRnh1ZlR0Y2JseHVWMlZzYkV4cGMzUWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOGRHRmliR1VnWTJ4aGMzTk9ZVzFsUFZ3aVpuVnNiQ0JwYm14cGJtVXRaR1YwWVdsc2Mxd2lQbHh1SUNBZ0lDQWdJQ0E4WTJGd2RHbHZiajQ4WkdsMklHOXVRMnhwWTJzOWUzUm9hWE11WDJOb1lXNW5aVmRwWkhSb1NHRnVaR3hsY24wK2RHOW5aMnhsSURKdVpDQmpiMndnZDJsa2RHZ2dkMmxrZEdnZ1pYaGhiWEJzWlR3dlpHbDJQand2WTJGd2RHbHZiajVjYmlBZ0lDQWdJQ0FnUEZSb1pXRmtJSE4wYjNKbFBYdDBhR2x6TG5CeWIzQnpMbk4wYjNKbGZTQXZQbHh1SUNBZ0lDQWdJQ0E4VkdKdlpIa2djM1J2Y21VOWUzUm9hWE11Y0hKdmNITXVjM1J2Y21WOUlDOCtYRzRnSUNBZ0lDQThMM1JoWW14bFBseHVJQ0FnSUNrN1hHNGdJSDBzWEc0Z0lGOWphR0Z1WjJWWGFXUjBhRWhoYm1Sc1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ2MzUnZjbVVnUFNCMGFHbHpMbkJ5YjNCekxuTjBiM0psTG1kbGRDZ25hR1ZoWkdsdVozTW5LVHRjYmlBZ0lDQjJZWElnZEdocGNtUWdQU0J6ZEc5eVpTNWhkQ2d5S1R0Y2JseHVJQ0FnSUhSb2FYSmtMbk5sZENnbmQybGtkR2duTENCemFYcGxjMXQwYUdseVpDNW5aWFFvSjNkcFpIUm9KeWxkSUh4OElESXdNQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlGZGxiR3hNYVhOME8xeHVJbDE5IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBXZWxsTmF2O1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBUYWJzICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvdGFicy5qc3gnKTtcblxuV2VsbE5hdiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJXZWxsTmF2XCIsXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwidGFiLWdyb3VwXCJ9LCBcbiAgICAgICAgdGhpcy5fYnVpbGRUYWJHcm91cHMoKVxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIF9idWlsZFRhYkdyb3VwczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBncm91cHMgPSBbXTtcblxuICAgIGdyb3Vwcy5wdXNoKFtcbiAgICAgIHt0ZXh0OiAnV2VsbCBEYXNoJ30sXG4gICAgICB7dGV4dDogJ0RldGFpbHMnfSxcbiAgICAgIHt0ZXh0OiAnTWFuYWdlbWVudCd9LFxuICAgICAge3RleHQ6ICdTdGF0dXMgLyBDb25maWcnfSxcbiAgICAgIHt0ZXh0OiAnRXZlbnRzJ30sXG4gICAgICB7dGV4dDogJ0FsYXJtcyd9XG4gICAgXSk7XG5cbiAgICBncm91cHMucHVzaChbXG4gICAgICB7dGV4dDogdGhpcy5wcm9wcy50eXBlICsgJyBkZXRhaWxzJ30sXG4gICAgICB7dGV4dDogJ0FuYWx5emUnfVxuICAgIF0pO1xuXG4gICAgcmV0dXJuIGdyb3Vwcy5tYXAoZnVuY3Rpb24gKGdyb3VwLCBpbmRleCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYWJzLCB7dGFiczogZ3JvdXAsIGtleTogaW5kZXh9KVxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gV2VsbE5hdjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdmQyVnNiRjluY21sa0wzZGxiR3hmYm1GMkxtcHplQ0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVRzN1FVRkZRU3hIUVVGSE96dEJRVVZJTEVsQlFVa3NUMEZCVHl4RFFVRkRPMEZCUTFvc1NVRkJTU3hMUVVGTExFZEJRVWNzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUXpkQ0xFbEJRVWtzU1VGQlNTeEpRVUZKTEU5QlFVOHNRMEZCUXl3eVFrRkJNa0lzUTBGQlF5eERRVUZET3p0QlFVVnFSQ3cyUWtGQk5rSXNkVUpCUVVFN1JVRkRNMElzVFVGQlRTeEZRVUZGTEZsQlFWazdTVUZEYkVJN1RVRkRSU3h2UWtGQlFTeExRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExGZEJRVmtzUTBGQlFTeEZRVUZCTzFGQlEzaENMRWxCUVVrc1EwRkJReXhsUVVGbExFVkJRVWM3VFVGRGNFSXNRMEZCUVR0TlFVTk9PMGRCUTBnN1JVRkRSQ3hsUVVGbExFVkJRVVVzV1VGQldUdEJRVU12UWl4SlFVRkpMRWxCUVVrc1RVRkJUU3hIUVVGSExFVkJRVVVzUTBGQlF6czdTVUZGYUVJc1RVRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF6dE5RVU5XTEVOQlFVTXNTVUZCU1N4RlFVRkZMRmRCUVZjc1EwRkJRenROUVVOdVFpeERRVUZETEVsQlFVa3NSVUZCUlN4VFFVRlRMRU5CUVVNN1RVRkRha0lzUTBGQlF5eEpRVUZKTEVWQlFVVXNXVUZCV1N4RFFVRkRPMDFCUTNCQ0xFTkJRVU1zU1VGQlNTeEZRVUZGTEdsQ1FVRnBRaXhEUVVGRE8wMUJRM3BDTEVOQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1EwRkJRenROUVVOb1FpeERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRU5CUVVNN1FVRkRkRUlzUzBGQlN5eERRVUZETEVOQlFVTTdPMGxCUlVnc1RVRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF6dE5RVU5XTEVOQlFVTXNTVUZCU1N4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeEhRVUZITEZWQlFWVXNRMEZCUXp0TlFVTndReXhEUVVGRExFbEJRVWtzUlVGQlJTeFRRVUZUTEVOQlFVTTdRVUZEZGtJc1MwRkJTeXhEUVVGRExFTkJRVU03TzBsQlJVZ3NUMEZCVHl4TlFVRk5MRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVlVzUzBGQlN5eEZRVUZGTEV0QlFVc3NSVUZCUlR0TlFVTjRRenRSUVVORkxHOUNRVUZETEVsQlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1NVRkJRU3hGUVVGSkxFTkJRVVVzUzBGQlN5eEZRVUZETEVOQlFVTXNSMEZCUVN4RlFVRkhMRU5CUVVVc1MwRkJUU3hEUVVGQkxFTkJRVWNzUTBGQlFUdFJRVU5xUXp0TFFVTklMRU5CUVVNc1EwRkJRenRIUVVOS08wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFBRVUZQTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRmRsYkd4T1lYWTdYRzUyWVhJZ1VtVmhZM1FnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQ2NwTzF4dWRtRnlJRlJoWW5NZ0lEMGdjbVZ4ZFdseVpTZ25MaTR2TGk0dlkyOXRjRzl1Wlc1MGN5OTBZV0p6TG1wemVDY3BPMXh1WEc1WFpXeHNUbUYySUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSjBZV0l0WjNKdmRYQmNJajVjYmlBZ0lDQWdJQ0FnZTNSb2FYTXVYMkoxYVd4a1ZHRmlSM0p2ZFhCektDbDlYRzRnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FwTzF4dUlDQjlMRnh1SUNCZlluVnBiR1JVWVdKSGNtOTFjSE02SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMllYSWdaM0p2ZFhCeklEMGdXMTA3WEc1Y2JpQWdJQ0JuY205MWNITXVjSFZ6YUNoYlhHNGdJQ0FnSUNCN2RHVjRkRG9nSjFkbGJHd2dSR0Z6YUNkOUxGeHVJQ0FnSUNBZ2UzUmxlSFE2SUNkRVpYUmhhV3h6SjMwc1hHNGdJQ0FnSUNCN2RHVjRkRG9nSjAxaGJtRm5aVzFsYm5RbmZTeGNiaUFnSUNBZ0lIdDBaWGgwT2lBblUzUmhkSFZ6SUM4Z1EyOXVabWxuSjMwc1hHNGdJQ0FnSUNCN2RHVjRkRG9nSjBWMlpXNTBjeWQ5TEZ4dUlDQWdJQ0FnZTNSbGVIUTZJQ2RCYkdGeWJYTW5mVnh1SUNBZ0lGMHBPMXh1WEc0Z0lDQWdaM0p2ZFhCekxuQjFjMmdvVzF4dUlDQWdJQ0FnZTNSbGVIUTZJSFJvYVhNdWNISnZjSE11ZEhsd1pTQXJJQ2NnWkdWMFlXbHNjeWQ5TEZ4dUlDQWdJQ0FnZTNSbGVIUTZJQ2RCYm1Gc2VYcGxKMzFjYmlBZ0lDQmRLVHRjYmx4dUlDQWdJSEpsZEhWeWJpQm5jbTkxY0hNdWJXRndLR1oxYm1OMGFXOXVJQ2huY205MWNDd2dhVzVrWlhncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBZ0lEeFVZV0p6SUhSaFluTTllMmR5YjNWd2ZTQnJaWGs5ZTJsdVpHVjRmU0F2UGx4dUlDQWdJQ0FnS1R0Y2JpQWdJQ0I5S1R0Y2JpQWdmVnh1ZlNrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdWMlZzYkU1aGRqdGNiaUpkZlE9PSIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbmZ1bmN0aW9uIFNjcm9sbGVyQ29hc3RlciAoZWxlbWVudHMsIG9wdGlvbnMpIHtcbiAgaWYgKCEgKHRoaXMgaW5zdGFuY2VvZiBTY3JvbGxlckNvYXN0ZXIpKSB7XG4gICAgcmV0dXJuIG5ldyBTY3JvbGxlckNvYXN0ZXIoZWxlbWVudHMsIG9wdGlvbnMpO1xuICB9XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdGhpcy5lbGVtZW50cyAgICAgPSBBcnJheS5pc0FycmF5KGVsZW1lbnRzKSA/IGVsZW1lbnRzIDogW2VsZW1lbnRzXTtcbiAgdGhpcy5jdXJyZW50ICAgICAgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gIHRoaXMuc3RhcnQgICAgICAgID0gMDtcbiAgdGhpcy5zdGVwcyAgICAgICAgPSBvcHRpb25zLnN0ZXBzIHx8IDE1MDtcblxuICB0aGlzLmNhbGN1bGF0ZVNjcm9sbFBvc2l0aW9uKCkuc3RlcCgwKTtcbn1cblxuU2Nyb2xsZXJDb2FzdGVyLnByb3RvdHlwZS5nZXRUb3AgPSBmdW5jdGlvbiBnZXRUb3AgKCkge1xuICByZXR1cm4gJCh0aGlzLmVsZW1lbnRzWzBdKS5vZmZzZXQoKS50b3AgfHwgMDtcbn07XG5cblNjcm9sbGVyQ29hc3Rlci5wcm90b3R5cGUuZ2V0VG90YWxIZWlnaHQgPSBmdW5jdGlvbiBnZXRUb3RhbEhlaWdodCAoKSB7XG4gIHZhciBoZWlnaHQgPSAwO1xuXG4gIHRoaXMuZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICBoZWlnaHQgKz0gJChlbCkub3V0ZXJIZWlnaHQoKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhlaWdodDtcbn07XG5cblNjcm9sbGVyQ29hc3Rlci5wcm90b3R5cGUuY2FsY3VsYXRlU2Nyb2xsUG9zaXRpb24gPSBmdW5jdGlvbiBjYWxjdWxhdGVTY3JvbGxQb3NpdGlvbiAoKSB7XG4gIHZhciB3aW5kb3dfaGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xuICB2YXIgbWlkICAgICAgICAgICA9IHdpbmRvd19oZWlnaHQgLyAyO1xuICB2YXIgdG9wICAgICAgICAgICA9IHRoaXMuZ2V0VG9wKCk7XG4gIHZhciBoZWlnaHQgICAgICAgID0gdGhpcy5nZXRUb3RhbEhlaWdodCgpO1xuICB2YXIgZGVzdGluYXRpb24gICA9IGhlaWdodCA+IHdpbmRvd19oZWlnaHQgPyB0b3AgOiB0b3AgLSBtaWQgKyBoZWlnaHQgLSAoaGVpZ2h0IC8gMilcblxuICB0aGlzLmRpZmYgPSBkZXN0aW5hdGlvbiAtIHRoaXMuY3VycmVudDtcblxuICByZXR1cm4gdGhpcztcbn07XG5cblNjcm9sbGVyQ29hc3Rlci5wcm90b3R5cGUuc3RlcCA9IGZ1bmN0aW9uIHN0ZXAgKHRpbWVzdGFtcCkge1xuICB2YXIgcHJvZ3Jlc3M7XG4gIHZhciBwZXJjZW50O1xuXG4gIHRoaXMuc3RhcnQgID0gdGhpcy5zdGFydCB8fCB0aW1lc3RhbXA7XG4gIHByb2dyZXNzICAgID0gdGltZXN0YW1wIC0gdGhpcy5zdGFydDtcbiAgcGVyY2VudCAgICAgPSBNYXRoLm1pbihwcm9ncmVzcyAvIHRoaXMuc3RlcHMsIDEpO1xuXG4gIHNjcm9sbFRvKDAsIHRoaXMuY3VycmVudCArICh0aGlzLmRpZmYgKiBwZXJjZW50KSk7XG5cbiAgaWYgKHBlcmNlbnQgPCAxKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuc3RlcC5iaW5kKHRoaXMpKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTY3JvbGxlckNvYXN0ZXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM1YwYVd4ekwzTmpjbTlzYkdWeVgyTnZZWE4wWlhJdmFXNWtaWGd1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNTVUZCU1N4RFFVRkRMRWRCUVVjc1QwRkJUeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZET3p0QlFVVXhRaXhUUVVGVExHVkJRV1VzUlVGQlJTeFJRVUZSTEVWQlFVVXNUMEZCVHl4RlFVRkZPMFZCUXpORExFbEJRVWtzUjBGQlJ5eEpRVUZKTEZsQlFWa3NaVUZCWlN4RFFVRkRMRVZCUVVVN1NVRkRka01zVDBGQlR5eEpRVUZKTEdWQlFXVXNRMEZCUXl4UlFVRlJMRVZCUVVVc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRGJFUXNSMEZCUnpzN1FVRkZTQ3hGUVVGRkxFOUJRVThzUjBGQlJ5eFBRVUZQTEVsQlFVa3NSVUZCUlN4RFFVRkRPenRGUVVWNFFpeEpRVUZKTEVOQlFVTXNVVUZCVVN4UFFVRlBMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NVVUZCVVN4SFFVRkhMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03UlVGRGNFVXNTVUZCU1N4RFFVRkRMRTlCUVU4c1VVRkJVU3hEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNVMEZCVXl4RlFVRkZMRU5CUVVNN1JVRkRNVU1zU1VGQlNTeERRVUZETEV0QlFVc3NWVUZCVlN4RFFVRkRMRU5CUVVNN1FVRkRlRUlzUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4VlFVRlZMRTlCUVU4c1EwRkJReXhMUVVGTExFbEJRVWtzUjBGQlJ5eERRVUZET3p0RlFVVjZReXhKUVVGSkxFTkJRVU1zZFVKQlFYVkNMRVZCUVVVc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEZWtNc1EwRkJRenM3UVVGRlJDeGxRVUZsTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwc1IwRkJSeXhUUVVGVExFMUJRVTBzU1VGQlNUdEZRVU53UkN4UFFVRlBMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTXZReXhEUVVGRExFTkJRVU03TzBGQlJVWXNaVUZCWlN4RFFVRkRMRk5CUVZNc1EwRkJReXhqUVVGakxFZEJRVWNzVTBGQlV5eGpRVUZqTEVsQlFVazdRVUZEZEVVc1JVRkJSU3hKUVVGSkxFMUJRVTBzUjBGQlJ5eERRVUZETEVOQlFVTTdPMFZCUldZc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eFBRVUZQTEVOQlFVTXNWVUZCVlN4RlFVRkZMRVZCUVVVN1NVRkRiRU1zVFVGQlRTeEpRVUZKTEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJReXhYUVVGWExFVkJRVVVzUTBGQlF6dEJRVU5zUXl4SFFVRkhMRU5CUVVNc1EwRkJRenM3UlVGRlNDeFBRVUZQTEUxQlFVMHNRMEZCUXp0QlFVTm9RaXhEUVVGRExFTkJRVU03TzBGQlJVWXNaVUZCWlN4RFFVRkRMRk5CUVZNc1EwRkJReXgxUWtGQmRVSXNSMEZCUnl4VFFVRlRMSFZDUVVGMVFpeEpRVUZKTzBWQlEzUkdMRWxCUVVrc1lVRkJZU3hIUVVGSExFTkJRVU1zUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJRenRGUVVOMlF5eEpRVUZKTEVkQlFVY3NZVUZCWVN4aFFVRmhMRWRCUVVjc1EwRkJReXhEUVVGRE8wVkJRM1JETEVsQlFVa3NSMEZCUnl4aFFVRmhMRWxCUVVrc1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF6dEZRVU5zUXl4SlFVRkpMRTFCUVUwc1ZVRkJWU3hKUVVGSkxFTkJRVU1zWTBGQll5eEZRVUZGTEVOQlFVTTdRVUZETlVNc1JVRkJSU3hKUVVGSkxGZEJRVmNzUzBGQlN5eE5RVUZOTEVkQlFVY3NZVUZCWVN4SFFVRkhMRWRCUVVjc1IwRkJSeXhIUVVGSExFZEJRVWNzUjBGQlJ5eEhRVUZITEUxQlFVMHNTVUZCU1N4TlFVRk5MRWRCUVVjc1EwRkJReXhEUVVGRE96dEJRVVYwUml4RlFVRkZMRWxCUVVrc1EwRkJReXhKUVVGSkxFZEJRVWNzVjBGQlZ5eEhRVUZITEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNN08wVkJSWFpETEU5QlFVOHNTVUZCU1N4RFFVRkRPMEZCUTJRc1EwRkJReXhEUVVGRE96dEJRVVZHTEdWQlFXVXNRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTU3hIUVVGSExGTkJRVk1zU1VGQlNTeEZRVUZGTEZOQlFWTXNSVUZCUlR0RlFVTjZSQ3hKUVVGSkxGRkJRVkVzUTBGQlF6dEJRVU5tTEVWQlFVVXNTVUZCU1N4UFFVRlBMRU5CUVVNN08wVkJSVm9zU1VGQlNTeERRVUZETEV0QlFVc3NTVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhKUVVGSkxGTkJRVk1zUTBGQlF6dEZRVU4wUXl4UlFVRlJMRTFCUVUwc1UwRkJVeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTTdRVUZEZGtNc1JVRkJSU3hQUVVGUExFOUJRVThzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4UlFVRlJMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZia1FzUlVGQlJTeFJRVUZSTEVOQlFVTXNRMEZCUXl4RlFVRkZMRWxCUVVrc1EwRkJReXhQUVVGUExFbEJRVWtzU1VGQlNTeERRVUZETEVsQlFVa3NSMEZCUnl4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVGRE96dEZRVVZzUkN4SlFVRkpMRTlCUVU4c1IwRkJSeXhEUVVGRExFVkJRVVU3U1VGRFppeHhRa0ZCY1VJc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRE8wZEJRemRETzBGQlEwZ3NRMEZCUXl4RFFVRkRPenRCUVVWR0xFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NaVUZCWlN4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpZG1GeUlDUWdQU0J5WlhGMWFYSmxLQ2RxY1hWbGNua25LVHRjYmx4dVpuVnVZM1JwYjI0Z1UyTnliMnhzWlhKRGIyRnpkR1Z5SUNobGJHVnRaVzUwY3l3Z2IzQjBhVzl1Y3lrZ2UxeHVJQ0JwWmlBb0lTQW9kR2hwY3lCcGJuTjBZVzVqWlc5bUlGTmpjbTlzYkdWeVEyOWhjM1JsY2lrcElIdGNiaUFnSUNCeVpYUjFjbTRnYm1WM0lGTmpjbTlzYkdWeVEyOWhjM1JsY2lobGJHVnRaVzUwY3l3Z2IzQjBhVzl1Y3lrN1hHNGdJSDFjYmx4dUlDQnZjSFJwYjI1eklEMGdiM0IwYVc5dWN5QjhmQ0I3ZlR0Y2JseHVJQ0IwYUdsekxtVnNaVzFsYm5SeklDQWdJQ0E5SUVGeWNtRjVMbWx6UVhKeVlYa29aV3hsYldWdWRITXBJRDhnWld4bGJXVnVkSE1nT2lCYlpXeGxiV1Z1ZEhOZE8xeHVJQ0IwYUdsekxtTjFjbkpsYm5RZ0lDQWdJQ0E5SUNRb2QybHVaRzkzS1M1elkzSnZiR3hVYjNBb0tUdGNiaUFnZEdocGN5NXpkR0Z5ZENBZ0lDQWdJQ0FnUFNBd08xeHVJQ0IwYUdsekxuTjBaWEJ6SUNBZ0lDQWdJQ0E5SUc5d2RHbHZibk11YzNSbGNITWdmSHdnTVRVd08xeHVYRzRnSUhSb2FYTXVZMkZzWTNWc1lYUmxVMk55YjJ4c1VHOXphWFJwYjI0b0tTNXpkR1Z3S0RBcE8xeHVmVnh1WEc1VFkzSnZiR3hsY2tOdllYTjBaWEl1Y0hKdmRHOTBlWEJsTG1kbGRGUnZjQ0E5SUdaMWJtTjBhVzl1SUdkbGRGUnZjQ0FvS1NCN1hHNGdJSEpsZEhWeWJpQWtLSFJvYVhNdVpXeGxiV1Z1ZEhOYk1GMHBMbTltWm5ObGRDZ3BMblJ2Y0NCOGZDQXdPMXh1ZlR0Y2JseHVVMk55YjJ4c1pYSkRiMkZ6ZEdWeUxuQnliM1J2ZEhsd1pTNW5aWFJVYjNSaGJFaGxhV2RvZENBOUlHWjFibU4wYVc5dUlHZGxkRlJ2ZEdGc1NHVnBaMmgwSUNncElIdGNiaUFnZG1GeUlHaGxhV2RvZENBOUlEQTdYRzVjYmlBZ2RHaHBjeTVsYkdWdFpXNTBjeTVtYjNKRllXTm9LR1oxYm1OMGFXOXVJQ2hsYkNrZ2UxeHVJQ0FnSUdobGFXZG9kQ0FyUFNBa0tHVnNLUzV2ZFhSbGNraGxhV2RvZENncE8xeHVJQ0I5S1R0Y2JseHVJQ0J5WlhSMWNtNGdhR1ZwWjJoME8xeHVmVHRjYmx4dVUyTnliMnhzWlhKRGIyRnpkR1Z5TG5CeWIzUnZkSGx3WlM1allXeGpkV3hoZEdWVFkzSnZiR3hRYjNOcGRHbHZiaUE5SUdaMWJtTjBhVzl1SUdOaGJHTjFiR0YwWlZOamNtOXNiRkJ2YzJsMGFXOXVJQ2dwSUh0Y2JpQWdkbUZ5SUhkcGJtUnZkMTlvWldsbmFIUWdQU0FrS0hkcGJtUnZkeWt1YUdWcFoyaDBLQ2s3WEc0Z0lIWmhjaUJ0YVdRZ0lDQWdJQ0FnSUNBZ0lEMGdkMmx1Wkc5M1gyaGxhV2RvZENBdklESTdYRzRnSUhaaGNpQjBiM0FnSUNBZ0lDQWdJQ0FnSUQwZ2RHaHBjeTVuWlhSVWIzQW9LVHRjYmlBZ2RtRnlJR2hsYVdkb2RDQWdJQ0FnSUNBZ1BTQjBhR2x6TG1kbGRGUnZkR0ZzU0dWcFoyaDBLQ2s3WEc0Z0lIWmhjaUJrWlhOMGFXNWhkR2x2YmlBZ0lEMGdhR1ZwWjJoMElENGdkMmx1Wkc5M1gyaGxhV2RvZENBL0lIUnZjQ0E2SUhSdmNDQXRJRzFwWkNBcklHaGxhV2RvZENBdElDaG9aV2xuYUhRZ0x5QXlLVnh1WEc0Z0lIUm9hWE11WkdsbVppQTlJR1JsYzNScGJtRjBhVzl1SUMwZ2RHaHBjeTVqZFhKeVpXNTBPMXh1WEc0Z0lISmxkSFZ5YmlCMGFHbHpPMXh1ZlR0Y2JseHVVMk55YjJ4c1pYSkRiMkZ6ZEdWeUxuQnliM1J2ZEhsd1pTNXpkR1Z3SUQwZ1puVnVZM1JwYjI0Z2MzUmxjQ0FvZEdsdFpYTjBZVzF3S1NCN1hHNGdJSFpoY2lCd2NtOW5jbVZ6Y3p0Y2JpQWdkbUZ5SUhCbGNtTmxiblE3WEc1Y2JpQWdkR2hwY3k1emRHRnlkQ0FnUFNCMGFHbHpMbk4wWVhKMElIeDhJSFJwYldWemRHRnRjRHRjYmlBZ2NISnZaM0psYzNNZ0lDQWdQU0IwYVcxbGMzUmhiWEFnTFNCMGFHbHpMbk4wWVhKME8xeHVJQ0J3WlhKalpXNTBJQ0FnSUNBOUlFMWhkR2d1YldsdUtIQnliMmR5WlhOeklDOGdkR2hwY3k1emRHVndjeXdnTVNrN1hHNWNiaUFnYzJOeWIyeHNWRzhvTUN3Z2RHaHBjeTVqZFhKeVpXNTBJQ3NnS0hSb2FYTXVaR2xtWmlBcUlIQmxjbU5sYm5RcEtUdGNibHh1SUNCcFppQW9jR1Z5WTJWdWRDQThJREVwSUh0Y2JpQWdJQ0J5WlhGMVpYTjBRVzVwYldGMGFXOXVSbkpoYldVb2RHaHBjeTV6ZEdWd0xtSnBibVFvZEdocGN5a3BPMXh1SUNCOVhHNTlPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUZOamNtOXNiR1Z5UTI5aGMzUmxjanRjYmlKZGZRPT0iXX0=
