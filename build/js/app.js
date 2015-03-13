(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{"./data/well_body":9,"./data/well_headings":10,"./modules/well_grid":16,"backbone":"backbone","flux":"flux","react":"react"}],2:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var Icon;
var React = require('react');

Icon = React.createClass({displayName: "Icon",
  render: function () {
    var classes = ['fa'];

    if (this.props.stack) {
      classes.push('fa-stack-' + this.props.stack);
    }

    if (this.props.type) {
      classes.push('fa-' + this.props.type);
    }

    return (
      React.createElement("i", {className: classes.join(' ')})
    );
  }
});

module.exports = Icon;


},{"react":"react"}],3:[function(require,module,exports){
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


},{"./icon.jsx":2,"react":"react"}],4:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var Tabs;
var React = require('react');
var Icon  = require('./icon.jsx');

Tabs = React.createClass({displayName: "Tabs",
  propTypes: {
    action: React.PropTypes.func
  },
  render: function () {
    return (
      React.createElement("ul", {className: "tabs"}, 
        this._buildTabs()
      )
    );
  },
  _buildTabs: function () {
    return this.props.tabs.map(function (tab, index) {
      var icon = tab.icon ? React.createElement(Icon, {type: tab.icon}) : null;

      return (
        React.createElement("li", {key: index}, 
          React.createElement("a", {href: tab.href, className: "button small", onClick: tab.action}, 
            icon, 
            tab.text
          )
        )
      );
    }, this);
  }
});

module.exports = Tabs;


},{"./icon.jsx":2,"react":"react"}],5:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var Tbody;
var key_map;
var $           = require('jquery')
var React       = require('react');
var Backbone    = require('backbone');
var Tr          = require('./tr.jsx');
var Td          = require('./td.jsx');
var Icon        = require('./icon.jsx');
var RowDetails  = require('../modules/well_grid/active_row_details.jsx');
var moment      = require('moment');

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
    var $beneath;
    var $active;
    var mid;
    var top;
    var position;
    var height;
    var window_height;
    var previous  = this.state.previous;
    var active    = this.state.activeWell;

    if (! active) {
      return false;
    }

    $active   = $(this.refs[active].getDOMNode());
    $beneath  = $(this.refs.activeWell.getDOMNode());

    window_height = $(window).height();
    mid           = window_height / 2;
    top           = $active.offset().top;
    height        = $active.outerHeight() + $beneath.outerHeight();
    position      = height > window_height ? top : top - mid + height - (height / 2);

    window.scrollTo(0, position);
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
      value = well.get(name);

      if (value instanceof Date) {
        value = moment(value).format('MMM D, YYYY h:mm:ssa');
      }

      if (value === 'ok') {
        value = (React.createElement(Icon, {type: "check"}));
      }

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


},{"../modules/well_grid/active_row_details.jsx":12,"./icon.jsx":2,"./td.jsx":6,"./tr.jsx":8,"backbone":"backbone","jquery":"jquery","moment":"moment","react":"react"}],6:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var Td;
var React = require('react');

Td = React.createClass({displayName: "Td",
  render: function () {

    return (
      React.createElement("td", React.__spread({},  this.props), 
        this.props.children
      )
    );
  }
});

module.exports = Td;


},{"react":"react"}],7:[function(require,module,exports){
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


},{"./sort_indicator.jsx":3,"backbone":"backbone","react":"react"}],8:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var Tr;
var React = require('react');

Tr = React.createClass({displayName: "Tr",
  render: function () {
    return (
      React.createElement("tr", React.__spread({},  this.props), 
        this.props.children
      )
    );
  }
});

module.exports = Tr;


},{"react":"react"}],9:[function(require,module,exports){
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


},{}],10:[function(require,module,exports){
var values = [];

values = [
  {
    locked:     true,
    minimal:    true,
    name:       'status',
    sortable:   true
  },
  {
    direction:  'asc',
    locked:     true,
    name:       'Well_Name',
    sortable:   true,
    title:      'Well Name'
  },
  {
    name:       'Well_State_Text',
    resizable:  true,
    sortable:   true,
    title:      'Well State'
  },
  {
    name:       'Current_State_Time_Text',
    resizable:  true,
    sortable:   true,
    title:      'Current State Time'
  },
   {
    name:       'FG_Last_Received_Date',
    resizable:  true,
    sortable:   true,
    title:      'FG Last Received Date'
  }
];

module.exports = values;


},{}],11:[function(require,module,exports){
"use strict";

module.exports = {
  CHANGE_SORT:      'sort',
  CHANGE_SORT_DIR:  'sort-dir'
};


},{}],12:[function(require,module,exports){
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
    var tabs        = [
      {icon: 'arrow-up',    action: this._selectPrev},
      {icon: 'arrow-down',  action: this._selectNext},
      {icon: size_toggle,   action: this._sizeToggle},
      {icon: 'close',       action: this._close}
    ];

    if (! this.props.prev) {
      delete tabs[0];
    }

    if (! this.props.next) {
      delete tabs[1];
    }

    if (! this.props.minimized) {
      quick_items = this.state.quick.map(function (item, index) {
        var className = 'col-1';

        if (index === 0) {
          className += ' offset-3';
        }

        return (
          React.createElement("div", {className: className}, 
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


},{"../../components/icon.jsx":2,"../../components/tabs.jsx":4,"../../components/td.jsx":6,"../../components/tr.jsx":8,"./dispatcher":13,"./store":18,"./well_nav.jsx":22,"jquery":"jquery","react":"react"}],13:[function(require,module,exports){
"use strict";

var Dispatcher = require('flux').Dispatcher;

module.exports = new Dispatcher();


},{"flux":"flux"}],14:[function(require,module,exports){
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


},{"./heading_model":15,"backbone":"backbone"}],15:[function(require,module,exports){
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


},{"backbone":"backbone"}],16:[function(require,module,exports){
module.exports = {
  actions:            require('./actions'),
  dispatcher:         require('./dispatcher'),
  store:              require('./store'),
  heading_collection: require('./heading_collection'),
  heading_model:      require('./heading_model'),
  view:               require('./view.jsx')
};


},{"./actions":11,"./dispatcher":13,"./heading_collection":14,"./heading_model":15,"./store":18,"./view.jsx":21}],17:[function(require,module,exports){
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


},{}],18:[function(require,module,exports){
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


},{"./actions":11,"./dispatcher":13,"./heading_collection":14,"./quick_look":17,"backbone":"backbone"}],19:[function(require,module,exports){
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
      width:          data.width,
      handleClick:    this.props.handleClick
    };

    return (
      React.createElement(Th, React.__spread({},  new_props), 
        data.title
      )
    );
  }
});

module.exports = ThWrapper;


},{"../../components/th.jsx":7,"backbone":"backbone","react":"react"}],20:[function(require,module,exports){
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
      data.handleClick = current.get('sortable') ? this._sortHandler.bind(this, current) : null;
      data.store        = current;

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


},{"../../components/tr.jsx":8,"./th_wrapper.jsx":19,"backbone":"backbone","react":"react"}],21:[function(require,module,exports){
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
      React.createElement("table", {className: "full"}, 
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
    //console.log(headings);
  }
});

module.exports = WellList;


},{"../../components/tbody.jsx":5,"../../components/th.jsx":7,"./thead_wrapper.jsx":20,"react":"react"}],22:[function(require,module,exports){
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


},{"../../components/tabs.jsx":4,"react":"react"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9hcHAuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9jb21wb25lbnRzL2ljb24uanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvY29tcG9uZW50cy9zb3J0X2luZGljYXRvci5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9jb21wb25lbnRzL3RhYnMuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvY29tcG9uZW50cy90Ym9keS5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9jb21wb25lbnRzL3RkLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2NvbXBvbmVudHMvdGguanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvY29tcG9uZW50cy90ci5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9kYXRhL3dlbGxfYm9keS5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2RhdGEvd2VsbF9oZWFkaW5ncy5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvd2VsbF9ncmlkL2FjdGlvbnMuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL3dlbGxfZ3JpZC9hY3RpdmVfcm93X2RldGFpbHMuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy93ZWxsX2dyaWQvZGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvd2VsbF9ncmlkL2hlYWRpbmdfY29sbGVjdGlvbi5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvd2VsbF9ncmlkL2hlYWRpbmdfbW9kZWwuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL3dlbGxfZ3JpZC9pbmRleC5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvd2VsbF9ncmlkL3F1aWNrX2xvb2suanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL3dlbGxfZ3JpZC9zdG9yZS5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvd2VsbF9ncmlkL3RoX3dyYXBwZXIuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy93ZWxsX2dyaWQvdGhlYWRfd3JhcHBlci5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL3dlbGxfZ3JpZC92aWV3LmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvd2VsbF9ncmlkL3dlbGxfbmF2LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFlBQVksQ0FBQzs7QUFFYixJQUFJLEtBQUssQ0FBQztBQUNWLElBQUksS0FBSyxDQUFDO0FBQ1YsSUFBSSxRQUFRLENBQUM7QUFDYixJQUFJLEtBQUssbUJBQW1CLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QyxJQUFJLFVBQVUsY0FBYyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFDO0FBQ3ZELElBQUksUUFBUSxnQkFBZ0IsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2hELElBQUksZ0JBQWdCLFFBQVEsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDM0QsSUFBSSxZQUFZLFlBQVksZ0JBQWdCLENBQUMsSUFBSSxDQUFDO0FBQ2xELElBQUksVUFBVSxjQUFjLGdCQUFnQixDQUFDLEtBQUssQ0FBQztBQUNuRCxJQUFJLGFBQWEsV0FBVyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZELElBQUksU0FBUyxlQUFlLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDcEQsSUFBSSxvQkFBb0IsSUFBSSxnQkFBZ0Is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RSxpQkFBaUIsQ0FBQztNQUN6QixDQUFDLElBQUksRUFBRSxRQUFRLENBQUM7TUFDaEIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDO0FBQ3RCLEtBQUssQ0FBQyxDQUFDOztJQUVILE1BQU0sQ0FBQyxJQUFJLENBQUM7TUFDVixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7TUFDcEMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDO0FBQ3ZCLEtBQUssQ0FBQyxDQUFDOztJQUVILE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEtBQUssRUFBRSxLQUFLLEVBQUU7TUFDeEM7UUFDRSxvQkFBQyxJQUFJLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFFLEtBQUssRUFBQyxDQUFDLEdBQUEsRUFBRyxDQUFFLEtBQU0sQ0FBQSxDQUFHLENBQUE7UUFDakM7S0FDSCxDQUFDLENBQUM7R0FDSjtBQUNILENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgdGhlYWQ7XG52YXIgdGJvZHk7XG52YXIgaGVhZGluZ3M7XG52YXIgUmVhY3QgICAgICAgICAgICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBEaXNwYXRjaGVyICAgICAgICAgICAgPSByZXF1aXJlKCdmbHV4JykuRGlzcGF0Y2hlcjtcbnZhciBCYWNrYm9uZSAgICAgICAgICAgICAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyIHdlbGxfZ3JpZF9tb2R1bGUgICAgICA9IHJlcXVpcmUoJy4vbW9kdWxlcy93ZWxsX2dyaWQnKTtcbnZhciBXZWxsR3JpZFZpZXcgICAgICAgICAgPSB3ZWxsX2dyaWRfbW9kdWxlLnZpZXc7XG52YXIgd2VsbF9zdG9yZSAgICAgICAgICAgID0gd2VsbF9ncmlkX21vZHVsZS5zdG9yZTtcbnZhciB3ZWxsX2hlYWRpbmdzICAgICAgICAgPSB3ZWxsX3N0b3JlLmdldCgnaGVhZGluZ3MnKTtcbnZhciB3ZWxsX2xpc3QgICAgICAgICAgICAgPSB3ZWxsX3N0b3JlLmdldCgnd2VsbHMnKTtcbnZhciB3ZWxsX2dyaWRfZGlzcGF0Y2hlciAgPSB3ZWxsX2dyaWRfbW9kdWxlLmRpc3BhdGNoZXI7XG52YXIgX2RhdGFfd2VsbF9oZWFkaW5ncyAgID0gcmVxdWlyZSgnLi9kYXRhL3dlbGxfaGVhZGluZ3MnKTtcbnZhciBfZGF0YV93ZWxsX2JvZHkgICAgICAgPSByZXF1aXJlKCcuL2RhdGEvd2VsbF9ib2R5JykoNTApO1xuXG53ZWxsX2hlYWRpbmdzLnNldChfZGF0YV93ZWxsX2hlYWRpbmdzKTtcblxud2VsbF9zdG9yZS5zZXQoJ2ZpcnN0JywgIHdlbGxfaGVhZGluZ3MuYXQoMCkpO1xud2VsbF9zdG9yZS5zZXQoJ3NvcnRlZScsIHdlbGxfaGVhZGluZ3MuYXQoMSkpO1xuXG53ZWxsX2hlYWRpbmdzLmVhY2goZnVuY3Rpb24gKGhlYWRlciwgaW5kZXgpIHtcbiAgdmFyIHByZXYgPSB3ZWxsX2hlYWRpbmdzLmF0KGluZGV4IC0gMSk7XG4gIHZhciBuZXh0ID0gd2VsbF9oZWFkaW5ncy5hdChpbmRleCArIDEpO1xuXG4gIGhlYWRlci5wcmV2ID0gcHJldjtcbiAgaGVhZGVyLm5leHQgPSBuZXh0O1xufSk7XG5cbndlbGxfbGlzdC5zZXQoX2RhdGFfd2VsbF9ib2R5KTtcblxuLyoqXG4gKiBSZW5kZXIgdGhlIHdlbGwgbGlzdFxuICoqL1xuUmVhY3QucmVuZGVyKFxuICBSZWFjdC5jcmVhdGVFbGVtZW50KFdlbGxHcmlkVmlldywge1xuICAgIGRpc3BhdGNoZXI6IHdlbGxfZ3JpZF9kaXNwYXRjaGVyLFxuICAgIHN0b3JlOiB3ZWxsX3N0b3JlfVxuICApLFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2VsbC1saXN0JykpO1xuIiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBJY29uO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuSWNvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNsYXNzZXMgPSBbJ2ZhJ107XG5cbiAgICBpZiAodGhpcy5wcm9wcy5zdGFjaykge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdmYS1zdGFjay0nICsgdGhpcy5wcm9wcy5zdGFjayk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMudHlwZSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdmYS0nICsgdGhpcy5wcm9wcy50eXBlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGkgY2xhc3NOYW1lPXtjbGFzc2VzLmpvaW4oJyAnKX0+PC9pPlxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEljb247XG4iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFNvcnRJbmRpY2F0b3I7XG52YXIgY2xhc3NfbWFwO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBJY29uID0gcmVxdWlyZSgnLi9pY29uLmpzeCcpO1xuXG5jbGFzc19tYXAgPSB7XG4gIGFzYzogICdzb3J0LXVwJyxcbiAgZGVzYzogJ3NvcnQtZG93bidcbn07XG5cblNvcnRJbmRpY2F0b3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBpY29uICAgICAgPSBudWxsO1xuICAgIHZhciBkaXJlY3Rpb24gPSBjbGFzc19tYXBbdGhpcy5wcm9wcy5kaXJlY3Rpb25dO1xuXG4gICAgaWYgKGRpcmVjdGlvbikge1xuICAgICAgaWNvbiA9IDxJY29uIHR5cGU9e2RpcmVjdGlvbn0gc3RhY2s9XCIxeFwiIC8+O1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYS1zdGFjayBzb3J0ZXJcIj5cbiAgICAgICAgPEljb24gdHlwZT1cInNvcnRcIiBzdGFjaz1cIjF4XCIgLz5cbiAgICAgICAge2ljb259XG4gICAgICA8L3NwYW4+XG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU29ydEluZGljYXRvcjtcbiIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgVGFicztcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgSWNvbiAgPSByZXF1aXJlKCcuL2ljb24uanN4Jyk7XG5cblRhYnMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHByb3BUeXBlczoge1xuICAgIGFjdGlvbjogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDx1bCBjbGFzc05hbWU9XCJ0YWJzXCI+XG4gICAgICAgIHt0aGlzLl9idWlsZFRhYnMoKX1cbiAgICAgIDwvdWw+XG4gICAgKTtcbiAgfSxcbiAgX2J1aWxkVGFiczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnRhYnMubWFwKGZ1bmN0aW9uICh0YWIsIGluZGV4KSB7XG4gICAgICB2YXIgaWNvbiA9IHRhYi5pY29uID8gPEljb24gdHlwZT17dGFiLmljb259IC8+IDogbnVsbDtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGxpIGtleT17aW5kZXh9PlxuICAgICAgICAgIDxhIGhyZWY9e3RhYi5ocmVmfSBjbGFzc05hbWU9XCJidXR0b24gc21hbGxcIiBvbkNsaWNrPXt0YWIuYWN0aW9ufT5cbiAgICAgICAgICAgIHtpY29ufVxuICAgICAgICAgICAge3RhYi50ZXh0fVxuICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9saT5cbiAgICAgICk7XG4gICAgfSwgdGhpcyk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYnM7XG4iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFRib2R5O1xudmFyIGtleV9tYXA7XG52YXIgJCAgICAgICAgICAgPSByZXF1aXJlKCdqcXVlcnknKVxudmFyIFJlYWN0ICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBCYWNrYm9uZSAgICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgVHIgICAgICAgICAgPSByZXF1aXJlKCcuL3RyLmpzeCcpO1xudmFyIFRkICAgICAgICAgID0gcmVxdWlyZSgnLi90ZC5qc3gnKTtcbnZhciBJY29uICAgICAgICA9IHJlcXVpcmUoJy4vaWNvbi5qc3gnKTtcbnZhciBSb3dEZXRhaWxzICA9IHJlcXVpcmUoJy4uL21vZHVsZXMvd2VsbF9ncmlkL2FjdGl2ZV9yb3dfZGV0YWlscy5qc3gnKTtcbnZhciBtb21lbnQgICAgICA9IHJlcXVpcmUoJ21vbWVudCcpO1xuXG5rZXlfbWFwID0ge1xuICAzODogJ3ByZXYnLFxuICA0MDogJ25leHQnXG59O1xuXG5UYm9keSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgc3RvcmU6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEJhY2tib25lLk1vZGVsKS5pc1JlcXVpcmVkXG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY3RpdmVXZWxsOiBudWxsLFxuICAgICAgbWluaW1pemVkOiAgZmFsc2VcbiAgICB9O1xuICB9LFxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGJlbmVhdGg7XG4gICAgdmFyICRhY3RpdmU7XG4gICAgdmFyIG1pZDtcbiAgICB2YXIgdG9wO1xuICAgIHZhciBwb3NpdGlvbjtcbiAgICB2YXIgaGVpZ2h0O1xuICAgIHZhciB3aW5kb3dfaGVpZ2h0O1xuICAgIHZhciBwcmV2aW91cyAgPSB0aGlzLnN0YXRlLnByZXZpb3VzO1xuICAgIHZhciBhY3RpdmUgICAgPSB0aGlzLnN0YXRlLmFjdGl2ZVdlbGw7XG5cbiAgICBpZiAoISBhY3RpdmUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAkYWN0aXZlICAgPSAkKHRoaXMucmVmc1thY3RpdmVdLmdldERPTU5vZGUoKSk7XG4gICAgJGJlbmVhdGggID0gJCh0aGlzLnJlZnMuYWN0aXZlV2VsbC5nZXRET01Ob2RlKCkpO1xuXG4gICAgd2luZG93X2hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcbiAgICBtaWQgICAgICAgICAgID0gd2luZG93X2hlaWdodCAvIDI7XG4gICAgdG9wICAgICAgICAgICA9ICRhY3RpdmUub2Zmc2V0KCkudG9wO1xuICAgIGhlaWdodCAgICAgICAgPSAkYWN0aXZlLm91dGVySGVpZ2h0KCkgKyAkYmVuZWF0aC5vdXRlckhlaWdodCgpO1xuICAgIHBvc2l0aW9uICAgICAgPSBoZWlnaHQgPiB3aW5kb3dfaGVpZ2h0ID8gdG9wIDogdG9wIC0gbWlkICsgaGVpZ2h0IC0gKGhlaWdodCAvIDIpO1xuXG4gICAgd2luZG93LnNjcm9sbFRvKDAsIHBvc2l0aW9uKTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAkKGRvY3VtZW50KS5vbigna2V5ZG93bi4nICsgdGhpcy5wcm9wcy5zdG9yZS5jaWQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgY2lkO1xuICAgICAgdmFyIGRpcmVjdGlvbiA9IGtleV9tYXBbZS53aGljaF07XG5cbiAgICAgIGlmICghIHRoaXMuc3RhdGUuYWN0aXZlV2VsbCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRpcmVjdGlvbikge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNpZCA9IHRoaXMucmVmcy5hY3RpdmVXZWxsLnByb3BzW2RpcmVjdGlvbl07XG5cbiAgICAgIGlmIChjaWQpIHtcbiAgICAgICAgdGhpcy5faGFuZGxlV2VsbFNlbGVjdGlvbihjaWQpO1xuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgJChkb2N1bWVudCkub2ZmKCcuJyArIHRoaXMucHJvcHMuc3RvcmUuY2lkKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJvd3MgPSB0aGlzLl9idWlsZFJvd3MoKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8dGJvZHkgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmNsYXNzTmFtZX0+XG4gICAgICAgIHtyb3dzfVxuICAgICAgPC90Ym9keT5cbiAgICApO1xuICB9LFxuICBfYnVpbGRSb3dzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRhdGEgICAgPSBbXTtcbiAgICB2YXIgc3RvcmUgICA9IHRoaXMucHJvcHMuc3RvcmU7XG4gICAgdmFyIHdlbGxzICAgPSBzdG9yZS5nZXQoJ3dlbGxzJyk7XG4gICAgdmFyIGhlYWRpbmcgPSBzdG9yZS5nZXQoJ2ZpcnN0Jyk7XG4gICAgdmFyIHByZXYgICAgPSBudWxsO1xuICAgIHZhciBuZXh0ICAgID0gbnVsbDtcblxuICAgIHdlbGxzLmVhY2goZnVuY3Rpb24gKHdlbGwsIGluZGV4KSB7XG4gICAgICB2YXIgc2VsZWN0ZWRfcm93O1xuICAgICAgdmFyIHdlbGxfcm93O1xuICAgICAgdmFyIGFjdGl2ZSAgICAgICAgPSB0aGlzLnN0YXRlLmFjdGl2ZVdlbGwgPT09IHdlbGwuY2lkO1xuICAgICAgdmFyIGNvbnRlbnRzICAgICAgPSB0aGlzLl9idWlsZFJvdyh3ZWxsLCBoZWFkaW5nKTtcbiAgICAgIHZhciBvZGQgICAgICAgICAgID0gaW5kZXggJSAyID4gMCA/ICdvZGQnIDogJyc7XG4gICAgICB2YXIgYWN0aXZlX3Byb3BzICAgPSB7fTtcblxuICAgICAgbmV4dCA9IHdlbGxzLmF0KGluZGV4ICsgMSk7XG5cbiAgICAgIHdlbGxfcm93ID0gKFxuICAgICAgICA8VHIgY2xhc3NOYW1lPXtvZGQgKyAoYWN0aXZlID8gJyBhY3RpdmUnIDogJycpfSByZWY9e3dlbGwuY2lkfSBrZXk9e3dlbGwuY2lkfSBvbkNsaWNrPXt0aGlzLl9oYW5kbGVXZWxsU2VsZWN0aW9uLmJpbmQodGhpcywgd2VsbC5jaWQpfT5cbiAgICAgICAgICB7Y29udGVudHN9XG4gICAgICAgIDwvVHI+XG4gICAgICApO1xuXG4gICAgICBkYXRhLnB1c2god2VsbF9yb3cpO1xuXG4gICAgICBpZiAoYWN0aXZlKSB7XG4gICAgICAgIGFjdGl2ZV9wcm9wcyA9IHtcbiAgICAgICAgICBjbGFzc05hbWU6ICBvZGQsXG4gICAgICAgICAgc3RvcmU6ICAgICAgd2VsbCxcbiAgICAgICAgICBwcmV2OiAgICAgICBwcmV2LFxuICAgICAgICAgIG5leHQ6ICAgICAgIG5leHQgJiYgbmV4dC5jaWQsXG4gICAgICAgICAgc3dpdGNoZXI6ICAgdGhpcy5faGFuZGxlV2VsbFNlbGVjdGlvbixcbiAgICAgICAgICBzaXplVG9nZ2xlOiB0aGlzLl90b2dnbGVNaW5pbWl6ZSxcbiAgICAgICAgICBrZXk6ICAgICAgICB3ZWxsLmNpZCArICctYWN0aXZlJyxcbiAgICAgICAgICByZWY6ICAgICAgICAnYWN0aXZlV2VsbCcsXG4gICAgICAgICAgbWluaW1pemVkOiAgdGhpcy5zdGF0ZS5taW5pbWl6ZWRcbiAgICAgICAgfTtcblxuICAgICAgICBkYXRhLnB1c2goPFJvd0RldGFpbHMgey4uLmFjdGl2ZV9wcm9wc30gLz4pO1xuICAgICAgfVxuXG4gICAgICBwcmV2ID0gd2VsbC5jaWQ7XG4gICAgfSwgdGhpcyk7XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfSxcbiAgX2J1aWxkUm93OiBmdW5jdGlvbiAod2VsbCwgaGVhZGluZykge1xuICAgIHZhciBuYW1lO1xuICAgIHZhciB2YWx1ZTtcbiAgICB2YXIgZmllbGRzID0gW107XG5cbiAgICB3aGlsZSAoaGVhZGluZykge1xuICAgICAgbmFtZSA9IGhlYWRpbmcuZ2V0KCduYW1lJyk7XG4gICAgICB2YWx1ZSA9IHdlbGwuZ2V0KG5hbWUpO1xuXG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIHZhbHVlID0gbW9tZW50KHZhbHVlKS5mb3JtYXQoJ01NTSBELCBZWVlZIGg6bW06c3NhJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gJ29rJykge1xuICAgICAgICB2YWx1ZSA9ICg8SWNvbiB0eXBlPVwiY2hlY2tcIiAvPik7XG4gICAgICB9XG5cbiAgICAgIGZpZWxkcy5wdXNoKFxuICAgICAgICA8VGQgc3RvcmU9e3dlbGx9IGNvbHVtbj17aGVhZGluZ30ga2V5PXtoZWFkaW5nLmNpZH0+XG4gICAgICAgICAge3ZhbHVlfVxuICAgICAgICA8L1RkPlxuICAgICAgKTtcblxuICAgICAgaGVhZGluZyA9IGhlYWRpbmcubmV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmllbGRzO1xuICB9LFxuICBfaGFuZGxlV2VsbFNlbGVjdGlvbjogZnVuY3Rpb24gKGNpZCwgaW5jcmVtZW50KSB7XG4gICAgdmFyIGN1cnJlbnQgICAgID0gdGhpcy5zdGF0ZS5hY3RpdmVXZWxsO1xuICAgIHZhciBjdXJyZW50X3RvcCA9IDA7XG4gICAgdmFyIG5leHRfdG9wICAgID0gMDtcblxuICAgIGlmIChjdXJyZW50ID09PSBjaWQpIHtcbiAgICAgIGNpZCA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBhY3RpdmVXZWxsOiBjaWQsXG4gICAgICBpbmNyZW1lbnQ6ICBpbmNyZW1lbnQgPT09IHRydWUsXG4gICAgICBwcmV2aW91czogICBjaWQgPyBjdXJyZW50IDogbnVsbFxuICAgIH0pO1xuICB9LFxuICBfdG9nZ2xlTWluaW1pemU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHttaW5pbWl6ZWQ6ICEgdGhpcy5zdGF0ZS5taW5pbWl6ZWR9KTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGJvZHk7XG4iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFRkO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuVGQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDx0ZCB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgPC90ZD5cbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZDtcbiIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgVGg7XG52YXIgUmVhY3QgICAgICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBCYWNrYm9uZSAgICAgICAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyIFNvcnRJbmRpY2F0b3IgICA9IHJlcXVpcmUoJy4vc29ydF9pbmRpY2F0b3IuanN4Jyk7XG5cblRoID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICB0cmlnZ2VyU29ydDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2xhc3NlcyA9IFt0aGlzLnByb3BzLmNsYXNzTmFtZSB8fCAnJ107XG4gICAgdmFyIHNvcnRfaW5kaWNhdG9yID0gbnVsbDtcbiAgICB2YXIgbmV3X3Byb3BzID0ge3N0eWxlOnt9fTtcblxuICAgIGlmICh0aGlzLnByb3BzLnRyaWdnZXJTb3J0IHx8IHRoaXMucHJvcHMuc29ydERpcmVjdGlvbikge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdzb3J0YWJsZScpO1xuXG4gICAgICBzb3J0X2luZGljYXRvciA9IDxTb3J0SW5kaWNhdG9yIGRpcmVjdGlvbj17dGhpcy5wcm9wcy5zb3J0RGlyZWN0aW9ufSAvPlxuICAgIH1cblxuICAgIFsnbWluaW1hbCcsICdsb2NrZWQnLCAncmVzaXphYmxlJ10uZm9yRWFjaChmdW5jdGlvbiAodmFsKSB7XG4gICAgICBpZiAodGhpcy5wcm9wc1t2YWxdKSB7XG4gICAgICAgIGNsYXNzZXMucHVzaCh2YWwpO1xuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMud2lkdGgpIHtcbiAgICAgIG5ld19wcm9wcy5zdHlsZS53aWR0aCA9IHRoaXMucHJvcHMud2lkdGg7XG4gICAgfVxuXG4gICAgbmV3X3Byb3BzLmNsYXNzTmFtZSA9IGNsYXNzZXMubGVuZ3RoID4gMSA/IGNsYXNzZXMuam9pbignICcpIDogY2xhc3Nlc1swXTtcblxuICAgIHJldHVybiAoXG4gICAgICA8dGggey4uLm5ld19wcm9wc30gb25DbGljaz17dGhpcy5faGFuZGxlQ2xpY2t9PlxuICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cbiAgICAgICAge3NvcnRfaW5kaWNhdG9yfVxuICAgICAgPC90aD5cbiAgICApO1xuICB9LFxuICBfaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuaGFuZGxlQ2xpY2spIHtcbiAgICAgIHRoaXMucHJvcHMuaGFuZGxlQ2xpY2soZSk7XG4gICAgfVxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaDtcbiIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgVHI7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG5UciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDx0ciB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgPC90cj5cbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcjtcbiIsInZhciBuYW1lcyAgICAgPSBbJ05lbycsICdXZWxsJywgJ1NjYW5kaXMnLCAnRm9ydG8nLCAnTG9ydW0nLCAnUGFybmFjJywgJ0x1ZmtpcycsICdCbG9ja2VyJywgJ01pZGxhbmQnLCAnT0tDJywgJ0J1bGwnLCAnSHVuZG8nLCAnRmVycmlzJywgJ0FsYW1lZGEnLCAnUmFmYWVsJywgJ1NhbiBQZWRybyddO1xudmFyIHN0YXRlcyAgICA9IFsnQ29ubmVjdGVkJywgJ0Nvbm5lY3RlZCcsICdDb25uZWN0ZWQnLCAnQ29ubmVjdGVkJywgJ0Rpc2Nvbm5lY3RlZCcsICdVbmtub3duJ107XG52YXIgc3RhdHVzZXMgID0gWydvaycsICdvaycsICdvaycsICdvaycsICdlcnJvciddO1xudmFyIHRleHRzICAgICA9IFsnMiBkYXlzJywgJzMgZGF5cycsICdVbmtub3duJywgJzEgZGF5JywgJzMgbW9udGhzJ107XG52YXIgdHlwZXMgICAgID0gWydlc3AnLCAncGx1bmdlcicsICdjcmFuaycsICdwY3AnXTtcblxuZnVuY3Rpb24gcmFuZG9taXplIChhcnIpIHtcbiAgcmV0dXJuIGFycltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnIubGVuZ3RoKV07XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlIChudW0pIHtcbiAgdmFyIGk7XG4gIHZhciB2YWx1ZXMgPSBbXTtcblxuICBmb3IgKGkgPSAwOyBpIDwgbnVtOyBpKyspIHtcbiAgICB2YWx1ZXMucHVzaCh7XG4gICAgICBzdGF0dXM6ICAgICAgICAgICAgICAgICAgICdvaycsXG4gICAgICBXZWxsX05hbWU6ICAgICAgICAgICAgICAgIHJhbmRvbWl6ZShuYW1lcykgKyAnICcgKyByYW5kb21pemUobmFtZXMpLFxuICAgICAgRkdfTGFzdF9SZWNlaXZlZF9EYXRlOiAgICBuZXcgRGF0ZSgpLFxuICAgICAgV2VsbF9TdGF0ZV9UZXh0OiAgICAgICAgICByYW5kb21pemUoc3RhdGVzKSxcbiAgICAgIEN1cnJlbnRfU3RhdGVfVGltZV9UZXh0OiAgcmFuZG9taXplKHRleHRzKSxcbiAgICAgIExpZnRfVHlwZTogICAgICAgICAgICAgICAgcmFuZG9taXplKHR5cGVzKSxcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2VuZXJhdGU7XG4iLCJ2YXIgdmFsdWVzID0gW107XG5cbnZhbHVlcyA9IFtcbiAge1xuICAgIGxvY2tlZDogICAgIHRydWUsXG4gICAgbWluaW1hbDogICAgdHJ1ZSxcbiAgICBuYW1lOiAgICAgICAnc3RhdHVzJyxcbiAgICBzb3J0YWJsZTogICB0cnVlXG4gIH0sXG4gIHtcbiAgICBkaXJlY3Rpb246ICAnYXNjJyxcbiAgICBsb2NrZWQ6ICAgICB0cnVlLFxuICAgIG5hbWU6ICAgICAgICdXZWxsX05hbWUnLFxuICAgIHNvcnRhYmxlOiAgIHRydWUsXG4gICAgdGl0bGU6ICAgICAgJ1dlbGwgTmFtZSdcbiAgfSxcbiAge1xuICAgIG5hbWU6ICAgICAgICdXZWxsX1N0YXRlX1RleHQnLFxuICAgIHJlc2l6YWJsZTogIHRydWUsXG4gICAgc29ydGFibGU6ICAgdHJ1ZSxcbiAgICB0aXRsZTogICAgICAnV2VsbCBTdGF0ZSdcbiAgfSxcbiAge1xuICAgIG5hbWU6ICAgICAgICdDdXJyZW50X1N0YXRlX1RpbWVfVGV4dCcsXG4gICAgcmVzaXphYmxlOiAgdHJ1ZSxcbiAgICBzb3J0YWJsZTogICB0cnVlLFxuICAgIHRpdGxlOiAgICAgICdDdXJyZW50IFN0YXRlIFRpbWUnXG4gIH0sXG4gICB7XG4gICAgbmFtZTogICAgICAgJ0ZHX0xhc3RfUmVjZWl2ZWRfRGF0ZScsXG4gICAgcmVzaXphYmxlOiAgdHJ1ZSxcbiAgICBzb3J0YWJsZTogICB0cnVlLFxuICAgIHRpdGxlOiAgICAgICdGRyBMYXN0IFJlY2VpdmVkIERhdGUnXG4gIH1cbl07XG5cbm1vZHVsZS5leHBvcnRzID0gdmFsdWVzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDSEFOR0VfU09SVDogICAgICAnc29ydCcsXG4gIENIQU5HRV9TT1JUX0RJUjogICdzb3J0LWRpcidcbn07XG4iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIEFjdGl2ZVJvd0RldGFpbHM7XG52YXIgJCAgICAgICAgICAgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBSZWFjdCAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgVHIgICAgICAgICAgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL3RyLmpzeCcpO1xudmFyIFRkICAgICAgICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy90ZC5qc3gnKTtcbnZhciBUYWJzICAgICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvdGFicy5qc3gnKTtcbnZhciBJY29uICAgICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvaWNvbi5qc3gnKTtcbnZhciBXZWxsTmF2ICAgICA9IHJlcXVpcmUoJy4vd2VsbF9uYXYuanN4Jyk7XG52YXIgc3RvcmUgICAgICAgPSByZXF1aXJlKCcuL3N0b3JlJyk7XG52YXIgZGlzcGF0Y2hlciAgPSByZXF1aXJlKCcuL2Rpc3BhdGNoZXInKTtcblxuQWN0aXZlUm93RGV0YWlscyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtxdWljazogc3RvcmUuZ2V0KCdxdWljaycpLnRvSlNPTigpfTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIga2V5X21hcCA9IHszOTogJ19tb3ZlQmFja3dhcmQnLCAzNzogJ19tb3ZlRm9yd2FyZCd9O1xuICAgICQoZG9jdW1lbnQpLm9uKCdrZXlkb3duLicgKyB0aGlzLnByb3BzLnN0b3JlLmNpZCwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciB3aGVyZSA9IGtleV9tYXBbZS53aGljaF07XG5cbiAgICAgIGlmICghIHdoZXJlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHRoaXNbd2hlcmVdKCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAkKGRvY3VtZW50KS5vZmYoJy4nICsgdGhpcy5wcm9wcy5zdG9yZS5jaWQpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcXVpY2tfbG9vaztcbiAgICB2YXIgcXVpY2tfaXRlbXM7XG4gICAgdmFyIGNsYXNzX25hbWVzID0gWydhY3RpdmUnXTtcbiAgICB2YXIgd2VsbCAgICAgICAgPSB0aGlzLnByb3BzLnN0b3JlO1xuICAgIHZhciBzaXplX3RvZ2dsZSA9IHRoaXMucHJvcHMubWluaW1pemVkID8gJ2V4cGFuZCcgOiAnY29tcHJlc3MnO1xuICAgIHZhciB0YWJzICAgICAgICA9IFtcbiAgICAgIHtpY29uOiAnYXJyb3ctdXAnLCAgICBhY3Rpb246IHRoaXMuX3NlbGVjdFByZXZ9LFxuICAgICAge2ljb246ICdhcnJvdy1kb3duJywgIGFjdGlvbjogdGhpcy5fc2VsZWN0TmV4dH0sXG4gICAgICB7aWNvbjogc2l6ZV90b2dnbGUsICAgYWN0aW9uOiB0aGlzLl9zaXplVG9nZ2xlfSxcbiAgICAgIHtpY29uOiAnY2xvc2UnLCAgICAgICBhY3Rpb246IHRoaXMuX2Nsb3NlfVxuICAgIF07XG5cbiAgICBpZiAoISB0aGlzLnByb3BzLnByZXYpIHtcbiAgICAgIGRlbGV0ZSB0YWJzWzBdO1xuICAgIH1cblxuICAgIGlmICghIHRoaXMucHJvcHMubmV4dCkge1xuICAgICAgZGVsZXRlIHRhYnNbMV07XG4gICAgfVxuXG4gICAgaWYgKCEgdGhpcy5wcm9wcy5taW5pbWl6ZWQpIHtcbiAgICAgIHF1aWNrX2l0ZW1zID0gdGhpcy5zdGF0ZS5xdWljay5tYXAoZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgIHZhciBjbGFzc05hbWUgPSAnY29sLTEnO1xuXG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgIGNsYXNzTmFtZSArPSAnIG9mZnNldC0zJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJveFwiPlxuICAgICAgICAgICAgICB7aXRlbS50ZXh0fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgcXVpY2tfbG9vayA9IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJxdWljay1sb29rXCIgcmVmPVwicXVpY2stbG9va1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udHJvbFwiPlxuICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5fbW92ZUZvcndhcmR9PjxJY29uIHR5cGU9XCJhcnJvdy1sZWZ0XCIgLz48L2E+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250ZW50XCI+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHJpY2xvcHNlXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5uZXJcIj5cblxuICAgICAgICAgICAgICAgIHtxdWlja19pdGVtc31cblxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250cm9sXCI+XG4gICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLl9tb3ZlQmFja3dhcmR9PjxJY29uIHR5cGU9XCJhcnJvdy1yaWdodFwiIC8+PC9hPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgY2xhc3NfbmFtZXMucHVzaCh0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFRyIGNsYXNzTmFtZT17Y2xhc3NfbmFtZXMuam9pbignICcpfT5cbiAgICAgICAgPFRkIGNvbFNwYW49e3N0b3JlLmdldCgnaGVhZGluZ3MnKS5sZW5ndGh9PlxuICAgICAgICAgIDxmaWVsZHNldCBjbGFzc05hbWU9XCJzZXBhcmF0b3JcIj5cbiAgICAgICAgICAgIDxsZWdlbmQgYWxpZ249XCJjZW50ZXJcIj5cbiAgICAgICAgICAgICAgPFRhYnMgdGFicz17dGFic30gLz5cbiAgICAgICAgICAgIDwvbGVnZW5kPlxuICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgICAge3F1aWNrX2xvb2t9XG4gICAgICAgICAgPFdlbGxOYXYgd2VsbElkPXt3ZWxsLmNpZH0gc2l6ZT1cInNtYWxsXCIgdHlwZT17d2VsbC5nZXQoJ0xpZnRfVHlwZScpfSAvPlxuICAgICAgICA8L1RkPlxuICAgICAgPC9Ucj5cbiAgICApO1xuICB9LFxuICBfbW92ZUZvcndhcmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBzdG9yZS5nZXQoJ3F1aWNrJykuZ29CYWNrKCk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtxdWljazogc3RvcmUuZ2V0KCdxdWljaycpLnRvSlNPTigpfSk7XG4gIH0sXG4gIF9tb3ZlQmFja3dhcmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBzdG9yZS5nZXQoJ3F1aWNrJykuZ29Gb3J3YXJkKCk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtxdWljazogc3RvcmUuZ2V0KCdxdWljaycpLnRvSlNPTigpfSk7XG4gIH0sXG4gIF9zZWxlY3RQcmV2OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMucHJldikge1xuICAgICAgdGhpcy5fc3dpdGNoKHRoaXMucHJvcHMucHJldik7XG4gICAgfVxuICB9LFxuICBfc2VsZWN0TmV4dDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLm5leHQpIHtcbiAgICAgIHRoaXMuX3N3aXRjaCh0aGlzLnByb3BzLm5leHQpO1xuICAgIH1cbiAgfSxcbiAgX3NpemVUb2dnbGU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5zaXplVG9nZ2xlKSB7XG4gICAgICB0aGlzLnByb3BzLnNpemVUb2dnbGUoKTtcbiAgICB9XG4gIH0sXG4gIF9jbG9zZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX3N3aXRjaCgpO1xuICB9LFxuICBfc3dpdGNoOiBmdW5jdGlvbiAoY2lkKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuc3dpdGNoZXIpIHtcbiAgICAgIHRoaXMucHJvcHMuc3dpdGNoZXIoY2lkLCB0cnVlKTtcbiAgICB9XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFjdGl2ZVJvd0RldGFpbHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERpc3BhdGNoZXIgPSByZXF1aXJlKCdmbHV4JykuRGlzcGF0Y2hlcjtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGlzcGF0Y2hlcigpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgTW9kZWwgICAgPSByZXF1aXJlKCcuL2hlYWRpbmdfbW9kZWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gIG1vZGVsOiBNb2RlbCxcbiAgY2hhbmdlU29ydDogZnVuY3Rpb24gKHNvcnRlZSkge1xuICAgIHZhciBtb2RlbCA9IHRoaXMucGFyZW50O1xuXG4gICAgaWYgKCEgbW9kZWwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBtb2RlbC5nZXQoJ3NvcnRlZScpLmVuZFNvcnRpbmcoKTtcbiAgICBtb2RlbC5zZXQoJ3NvcnRlZScsIHNvcnRlZSk7XG5cbiAgICBwYXlsb2FkLnNvcnRlZS50b2dnbGVTb3J0RGlyZWN0aW9uKCk7XG4gIH0sXG4gIGNoYW5nZVNvcnREaXJlY3Rpb246IGZ1bmN0aW9uIChzb3J0ZWUpIHtcbiAgICBzb3J0ZWUudG9nZ2xlU29ydERpcmVjdGlvbigpO1xuICB9LFxuICByZWdpc3RlcldpdGhEaXNwYXRjaGVyOiBmdW5jdGlvbiAoZGlzcGF0Y2hlcikge1xuICAgIHRoaXMuZGlzcGF0Y2hfdG9rZW4gPSBkaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICBzd2l0Y2ggKHBheWxvYWQuYWN0aW9uKSB7XG4gICAgICAgIGNhc2UgdGFibGVfYWN0aW9ucy5DSEFOR0VfU09SVDpcbiAgICAgICAgICB0aGlzLmNoYW5nZVNvcnQocGF5bG9hZC5zb3J0ZWUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHRhYmxlX2FjdGlvbnMuQ0hBTkdFX1NPUlRfRElSOlxuICAgICAgICAgIHRoaXMuY2hhbmdlU29ydERpcmVjdGlvbihwYXlsb2FkLnNvcnRlZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGRpcmVjdGlvbnM7XG52YXIgTW9kZWw7XG52YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xuXG5kaXJlY3Rpb25zID0ge1xuICBhc2M6ICAnZGVzYycsXG4gIGRlc2M6ICdhc2MnXG59O1xuXG5Nb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gIGRlZmF1bHRzOiB7XG4gICAgZGlyZWN0aW9uOiAgbnVsbCxcbiAgICBsb2NrZWQ6ICAgICBmYWxzZSxcbiAgICBtaW5pbWFsOiAgICBmYWxzZSxcbiAgICBuYW1lOiAgICAgICBudWxsLFxuICAgIHJlc2l6YWJsZTogIGZhbHNlLFxuICAgIHNvcnRhYmxlOiAgIGZhbHNlLFxuICAgIHRpdGxlOiAgICAgIG51bGwsXG4gICAgd2lkdGg6ICAgICAgbnVsbFxuICB9LFxuICB0b2dnbGVTb3J0RGlyZWN0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGN1cnJlbnQgPSB0aGlzLmdldCgnZGlyZWN0aW9uJyk7XG4gICAgdmFyIG5leHQgICAgPSAnYXNjJztcblxuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICBuZXh0ID0gZGlyZWN0aW9uc1tjdXJyZW50XTtcbiAgICB9XG5cbiAgICB0aGlzLnNldCgnZGlyZWN0aW9uJywgbmV4dCk7XG4gIH0sXG4gIGVuZFNvcnRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldCgnZGlyZWN0aW9uJywgbnVsbCk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFjdGlvbnM6ICAgICAgICAgICAgcmVxdWlyZSgnLi9hY3Rpb25zJyksXG4gIGRpc3BhdGNoZXI6ICAgICAgICAgcmVxdWlyZSgnLi9kaXNwYXRjaGVyJyksXG4gIHN0b3JlOiAgICAgICAgICAgICAgcmVxdWlyZSgnLi9zdG9yZScpLFxuICBoZWFkaW5nX2NvbGxlY3Rpb246IHJlcXVpcmUoJy4vaGVhZGluZ19jb2xsZWN0aW9uJyksXG4gIGhlYWRpbmdfbW9kZWw6ICAgICAgcmVxdWlyZSgnLi9oZWFkaW5nX21vZGVsJyksXG4gIHZpZXc6ICAgICAgICAgICAgICAgcmVxdWlyZSgnLi92aWV3LmpzeCcpXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIFF1aWNrTG9vayAoaXRlbXMpIHtcbiAgdmFyIHByZXY7XG4gIHZhciBsYXN0O1xuXG4gIGlmICghIEFycmF5LmlzQXJyYXkoaXRlbXMpKSB7XG4gICAgaXRlbXMgPSBbaXRlbXNdO1xuICB9XG5cbiAgbGFzdCA9IGl0ZW1zW2l0ZW1zLmxlbmd0aCAtIDFdO1xuXG4gIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICBpZiAocHJldikge1xuICAgICAgcHJldi5uZXh0ID0gaXRlbTtcbiAgICB9XG5cbiAgICBpdGVtLnByZXYgPSBwcmV2O1xuICAgIHByZXYgPSBpdGVtO1xuICB9KTtcblxuICBpdGVtc1swXS5wcmV2ID0gbGFzdDtcbiAgbGFzdC5uZXh0ICAgICA9IGl0ZW1zWzBdO1xuXG4gIHRoaXMuY3VycmVudCA9IGl0ZW1zWzBdO1xuICB0aGlzLml0ZW1zID0gaXRlbXM7XG4gIHRoaXMuaW5pdCgpO1xufVxuXG5RdWlja0xvb2sucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcbiAgICBpdGVtLnRleHQgPSAnUXVpY2sgTG9vayAnICsgaW5kZXg7XG4gICAgaXRlbS5pZCAgID0gJ3FsLScgKyBpbmRleDtcbiAgfSk7XG59O1xuXG5RdWlja0xvb2sucHJvdG90eXBlLmdldDMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpO1xuICB2YXIgY3VycmVudCA9IHRoaXMuY3VycmVudDtcbiAgdmFyIGl0ZW1zID0gW107XG5cbiAgZm9yIChpID0gMDsgaSA8IDM7IGkrKykge1xuICAgIGl0ZW1zLnB1c2goY3VycmVudCk7XG4gICAgY3VycmVudCA9IGN1cnJlbnQubmV4dDtcbiAgfVxuXG4gIHJldHVybiBpdGVtcztcbn07XG5cblF1aWNrTG9vay5wcm90b3R5cGUuZ29CYWNrID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmN1cnJlbnQgPSB0aGlzLmN1cnJlbnQucHJldjtcbn07XG5cblF1aWNrTG9vay5wcm90b3R5cGUuZ29Gb3J3YXJkID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmN1cnJlbnQgPSB0aGlzLmN1cnJlbnQubmV4dDtcbn07XG5cblF1aWNrTG9vay5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5nZXQzKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUXVpY2tMb29rO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdG9yZTtcbnZhciBCYWNrYm9uZSAgICAgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBUYWJsZUhlYWRpbmdzID0gcmVxdWlyZSgnLi9oZWFkaW5nX2NvbGxlY3Rpb24nKTtcbnZhciB0YWJsZV9hY3Rpb25zID0gcmVxdWlyZSgnLi9hY3Rpb25zJyk7XG52YXIgZGlzcGF0Y2hlciAgICA9IHJlcXVpcmUoJy4vZGlzcGF0Y2hlcicpO1xudmFyIFF1aWNrTG9vayAgICAgPSByZXF1aXJlKCcuL3F1aWNrX2xvb2snKTtcbnZhciB3ZWxsX2hlYWRpbmdzID0gbmV3IFRhYmxlSGVhZGluZ3MoKTtcbnZhciB3ZWxscyAgICAgICAgID0gbmV3IEJhY2tib25lLkNvbGxlY3Rpb24oKTtcblxud2VsbF9oZWFkaW5ncy5yZWdpc3RlcldpdGhEaXNwYXRjaGVyKGRpc3BhdGNoZXIpO1xuXG5cblxuc3RvcmUgPSBuZXcgQmFja2JvbmUuTW9kZWwoe1xuICB3ZWxsczogICAgd2VsbHMsXG4gIGZpcnN0OiAgICBudWxsLFxuICBoZWFkaW5nczogd2VsbF9oZWFkaW5ncyxcbiAgc2VsZWN0ZWQ6IG51bGwsXG4gIHNvcnRlZTogICBudWxsLFxuICBxdWljazogICAgbmV3IFF1aWNrTG9vayhbe3dpZHRoOiAxfSwge3dpZHRoOiAxfSwge3dpZHRoOiAxfSwge3dpZHRoOiAxfSwge3dpZHRoOiAxfSwge3dpZHRoOiAxfV0pXG59KTtcblxuc3RvcmUuZ2V0KCdoZWFkaW5ncycpLnBhcmVudCA9IHN0b3JlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JlO1xuIiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBUaFdyYXBwZXI7XG52YXIgVGggICAgICAgICAgICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy90aC5qc3gnKTtcbnZhciBSZWFjdCAgICAgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEJhY2tib25lICAgICAgICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG5cblRoV3JhcHBlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgc3RvcmU6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEJhY2tib25lLk1vZGVsKS5pc1JlcXVpcmVkXG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnN0b3JlLnRvSlNPTigpO1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucHJvcHMuc3RvcmUub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChzdG9yZSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZShzdG9yZS50b0pTT04oKSk7XG4gICAgfSwgdGhpcyk7XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgc3RvcmUub2ZmKCdjaGFuZ2UnLCBudWxsLCB0aGlzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5ld19wcm9wcztcbiAgICB2YXIgZGF0YSAgICAgID0gdGhpcy5zdGF0ZTtcblxuICAgIG5ld19wcm9wcyA9IHtcbiAgICAgIHRyaWdnZXJTb3J0OiAgICBkYXRhLnNvcnRhYmxlICYmIGRhdGEubmFtZSA/IGRhdGEubmFtZSA6IG51bGwsXG4gICAgICBzb3J0RGlyZWN0aW9uOiAgZGF0YS5kaXJlY3Rpb24sXG4gICAgICBtaW5pbWFsOiAgICAgICAgZGF0YS5taW5pbWFsLFxuICAgICAgbG9ja2VkOiAgICAgICAgIGRhdGEubG9ja2VkLFxuICAgICAgcmVzaXphYmxlOiAgICAgIGRhdGEucmVzaXphYmxlLFxuICAgICAgd2lkdGg6ICAgICAgICAgIGRhdGEud2lkdGgsXG4gICAgICBoYW5kbGVDbGljazogICAgdGhpcy5wcm9wcy5oYW5kbGVDbGlja1xuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFRoIHsuLi5uZXdfcHJvcHN9PlxuICAgICAgICB7ZGF0YS50aXRsZX1cbiAgICAgIDwvVGg+XG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGhXcmFwcGVyO1xuIiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBUaGVhZDtcbnZhciBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEJhY2tib25lICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgVHIgICAgICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy90ci5qc3gnKTtcbnZhciBUaCAgICAgICAgPSByZXF1aXJlKCcuL3RoX3dyYXBwZXIuanN4Jyk7XG5cblRoZWFkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICBzdG9yZTogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoQmFja2JvbmUuTW9kZWwpLmlzUmVxdWlyZWRcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbHMgPSB0aGlzLl9idWlsZENvbHVtbnMoKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8dGhlYWQgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmNsYXNzTmFtZX0+XG4gICAgICAgIDxUcj5cbiAgICAgICAgICB7Y29sc31cbiAgICAgICAgPC9Ucj5cbiAgICAgIDwvdGhlYWQ+XG4gICAgKTtcbiAgfSxcbiAgX2J1aWxkQ29sdW1uczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBkYXRhO1xuICAgIHZhciBjb2x1bW5zID0gW107XG4gICAgdmFyIHN0b3JlID0gdGhpcy5wcm9wcy5zdG9yZTtcbiAgICB2YXIgY3VycmVudCA9IHN0b3JlLmdldCgnZmlyc3QnKTtcblxuICAgIHdoaWxlIChjdXJyZW50KSB7XG4gICAgICBkYXRhICAgICAgICAgICAgICA9IHt9O1xuICAgICAgZGF0YS5oYW5kbGVDbGljayA9IGN1cnJlbnQuZ2V0KCdzb3J0YWJsZScpID8gdGhpcy5fc29ydEhhbmRsZXIuYmluZCh0aGlzLCBjdXJyZW50KSA6IG51bGw7XG4gICAgICBkYXRhLnN0b3JlICAgICAgICA9IGN1cnJlbnQ7XG5cbiAgICAgIGNvbHVtbnMucHVzaCg8VGggey4uLmRhdGF9IGtleT17Y3VycmVudC5jaWR9IC8+KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbHVtbnM7XG4gIH0sXG4gIF9zb3J0SGFuZGxlcjogZnVuY3Rpb24gKHNvcnRlZSkge1xuICAgIHZhciBzdG9yZSAgID0gdGhpcy5wcm9wcy5zdG9yZTtcbiAgICB2YXIgY3VycmVudCA9IHN0b3JlLmdldCgnc29ydGVlJyk7XG5cbiAgICBpZiAoY3VycmVudC5jaWQgIT09IHNvcnRlZS5jaWQpIHtcbiAgICAgIGN1cnJlbnQuZW5kU29ydGluZygpO1xuICAgIH1cblxuICAgIHN0b3JlLnNldCgnc29ydGVlJywgc29ydGVlKTtcbiAgICBzb3J0ZWUudG9nZ2xlU29ydERpcmVjdGlvbigpO1xuXG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRoZWFkO1xuIiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBXZWxsTGlzdDtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgVGggICAgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL3RoLmpzeCcpO1xudmFyIFRoZWFkID0gcmVxdWlyZSgnLi90aGVhZF93cmFwcGVyLmpzeCcpO1xudmFyIFRib2R5ID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy90Ym9keS5qc3gnKTtcblxudmFyIHNpemVzID0ge1xuICAyMDA6IDI1MCxcbiAgMjUwOiAyMDBcbn07XG5cbldlbGxMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cImZ1bGxcIj5cbiAgICAgICAgPGNhcHRpb24+PGRpdiBvbkNsaWNrPXt0aGlzLl9jaGFuZ2VXaWR0aEhhbmRsZXJ9PnRvZ2dsZSAybmQgY29sIHdpZHRoIHdpZHRoIGV4YW1wbGU8L2Rpdj48L2NhcHRpb24+XG4gICAgICAgIDxUaGVhZCBzdG9yZT17dGhpcy5wcm9wcy5zdG9yZX0gLz5cbiAgICAgICAgPFRib2R5IHN0b3JlPXt0aGlzLnByb3BzLnN0b3JlfSAvPlxuICAgICAgPC90YWJsZT5cbiAgICApO1xuICB9LFxuICBfY2hhbmdlV2lkdGhIYW5kbGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHN0b3JlID0gdGhpcy5wcm9wcy5zdG9yZS5nZXQoJ2hlYWRpbmdzJyk7XG4gICAgdmFyIHRoaXJkID0gc3RvcmUuYXQoMik7XG5cbiAgICB0aGlyZC5zZXQoJ3dpZHRoJywgc2l6ZXNbdGhpcmQuZ2V0KCd3aWR0aCcpXSB8fCAyMDApO1xuICAgIC8vY29uc29sZS5sb2coaGVhZGluZ3MpO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBXZWxsTGlzdDtcbiIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgV2VsbE5hdjtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgVGFicyAgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL3RhYnMuanN4Jyk7XG5cbldlbGxOYXYgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRhYi1ncm91cFwiPlxuICAgICAgICB7dGhpcy5fYnVpbGRUYWJHcm91cHMoKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0sXG4gIF9idWlsZFRhYkdyb3VwczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBncm91cHMgPSBbXTtcblxuICAgIGdyb3Vwcy5wdXNoKFtcbiAgICAgIHt0ZXh0OiAnV2VsbCBEYXNoJ30sXG4gICAgICB7dGV4dDogJ0RldGFpbHMnfSxcbiAgICAgIHt0ZXh0OiAnTWFuYWdlbWVudCd9LFxuICAgICAge3RleHQ6ICdTdGF0dXMgLyBDb25maWcnfSxcbiAgICAgIHt0ZXh0OiAnRXZlbnRzJ30sXG4gICAgICB7dGV4dDogJ0FsYXJtcyd9XG4gICAgXSk7XG5cbiAgICBncm91cHMucHVzaChbXG4gICAgICB7dGV4dDogdGhpcy5wcm9wcy50eXBlICsgJyBkZXRhaWxzJ30sXG4gICAgICB7dGV4dDogJ0FuYWx5emUnfVxuICAgIF0pO1xuXG4gICAgcmV0dXJuIGdyb3Vwcy5tYXAoZnVuY3Rpb24gKGdyb3VwLCBpbmRleCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFRhYnMgdGFicz17Z3JvdXB9IGtleT17aW5kZXh9IC8+XG4gICAgICApO1xuICAgIH0pO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBXZWxsTmF2O1xuIl19
