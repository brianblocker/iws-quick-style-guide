(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.alarms_bundle = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var React               = require('react');
var Perf                = React.addons.Perf;
var Dispatcher          = require('flux').Dispatcher;
var alarms_module       = require('./modules/alarms');
var ListView            = alarms_module.ListView;
var list_view_store     = alarms_module.list_view_store;
var _data_list_headings = require('./data/alarms_list_headings');
var _data_list_body     = require('./data/alarms_list_body')(15);
var list_headings       = list_view_store.get('headings');
var alarm_list          = list_view_store.get('alarms');

list_headings.set(_data_list_headings);
list_view_store.set('first', list_headings.at(0));
list_headings.linkSiblings();

alarm_list.set(_data_list_body);

function render (id) {
  React.render(
    React.createElement(ListView, {
      headings: list_headings,
      store:    list_view_store
    }),
    document.getElementById(id)
  );
};

render('alarms-list');

module.exports = render;



},{"./data/alarms_list_body":11,"./data/alarms_list_headings":12,"./modules/alarms":27,"flux":"flux","react":"react"}],2:[function(require,module,exports){
function classNames() {
	var classes = '';
	var arg;

	for (var i = 0; i < arguments.length; i++) {
		arg = arguments[i];
		if (!arg) {
			continue;
		}

		if ('string' === typeof arg || 'number' === typeof arg) {
			classes += ' ' + arg;
		} else if (Object.prototype.toString.call(arg) === '[object Array]') {
			classes += ' ' + classNames.apply(null, arg);
		} else if ('object' === typeof arg) {
			for (var key in arg) {
				if (!arg.hasOwnProperty(key) || !arg[key]) {
					continue;
				}
				classes += ' ' + key;
			}
		}
	}
	return classes.substr(1);
}

// safely export classNames in case the script is included directly on a page
if (typeof module !== 'undefined' && module.exports) {
	module.exports = classNames;
}

},{}],3:[function(require,module,exports){
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



},{"./icon.jsx":4,"react":"react"}],4:[function(require,module,exports){
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



},{"react":"react","underscore":"underscore"}],5:[function(require,module,exports){
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



},{"./icon.jsx":4,"react":"react"}],6:[function(require,module,exports){
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



},{"./button.jsx":3,"react":"react"}],7:[function(require,module,exports){
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



},{"./sort_indicator.jsx":5,"backbone":"backbone","react":"react"}],9:[function(require,module,exports){
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
"use strict";

module.exports = {
  DATE_FORMAT: 'MMM D, YYYY h:mm:ss a'
};



},{}],11:[function(require,module,exports){
var ack_states = [true, false, false, false];
var clr_states = [true, false, false, false, false];
var criticals  = [true, false, false, false];
var codes      = ['C2080', 'AF97', 'Down'];
var messages   = ['Communication failure', 'underload fault', 'ground fault', 'motor overload'];
var wells      = [{name: 'Lufko Walrus', status: 'Running'}, {name: 'Algers Marcus', status: 'Down'}, {name: 'Sparsec Muflo', status: 'Down'}];
var cases      = [Array(), Array(2), Array(1), Array(), Array()]

function randomize (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generate (num) {
  var i;
  var well;
  var critical;
  var cleared;
  var normal;
  var values = [];

  for (i = 0; i < num; i++) {
    well      = randomize(wells);
    critical  = randomize(criticals);
    cleared   = false;//randomize(clr_states) && ! critical;
    normal    = well.status === 'Running' && ! critical;

    values.push({
      acknowledged: randomize(ack_states),
      cleared:      cleared,
      created_date: new Date(),
      critical:     critical,
      code:         randomize(codes),
      normal:       normal,
      well:         well,
      message:      randomize(messages),
      cases:        randomize(cases)
    });
  }

  return values;
}

module.exports = generate;



},{}],12:[function(require,module,exports){
var values = [];

values = [
  {
    minimal:    true,
    name:       'status',
    type:       'status'
  },
  {
    name:       'details',
    title:      'Alarm details',
    type:       'alarm_details'
  },
  {
    name:       'well',
    title:      'Well',
    type:       'well'
  },
  {
    name:       'date',
    title:      'Date',
    type:       'date'
  },
  {
    name:       'actions',
    title:      'Action',
    type:       'alarm_actions'
  },
  {
    minimal:    true,
    name:       'cases',
    title:      'Cases',
    type:       'cases'
  }
];

module.exports = values;



},{}],13:[function(require,module,exports){
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

ActiveRowDetails = React.createClass({displayName: "ActiveRowDetails",
  propTypes: {
    model: React.PropTypes.instanceOf(Backbone.Model).isRequired
  },
  mixins: [React.addons.PureRenderMixin],
  getInitialState: function () {
    return this.props.model.toJSON();
  },
  render: function () {
    var class_names = ['active'];
    var model       = this.props.model;
    var size_toggle = this.props.minimized ? 'expand' : 'compress';
    var tabs        = this._getTabs();

    class_names.push(this.props.className);

    return (
      React.createElement(Tr, {className: class_names.join(' ')}, 
        React.createElement(Td, {colSpan: store.get('headings').length}, 
          React.createElement("fieldset", {className: "separator"}, 
            React.createElement("legend", {align: "center"}, 
              React.createElement(Tabs, {tabs: tabs})
            )
          ), 
          this.props.children
        )
      )
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



},{"../../components/icon.jsx":4,"../../components/tabs.jsx":6,"../../components/td.jsx":7,"../../components/tr.jsx":9,"./dispatcher":20,"./list_view_store":31,"backbone":"backbone","jquery":"jquery","moment":"moment","react":"react"}],14:[function(require,module,exports){
var AlarmCollection;
var Backbone  = require('backbone');
var AlarmModel = require('./alarm_model');

AlarmCollection = Backbone.Collection.extend({
  model: AlarmModel,
  linkSiblings: function () {
    this.each(function (header, index) {
      header.prev = this.at(index - 1);
      header.next = this.at(index + 1);
    }, this);
  },
  comparator: function (first, second) {
    if (first.get('critical')) {
      return -1;
    }

    return 1;
  }
});

module.exports = AlarmCollection;



},{"./alarm_model":17,"backbone":"backbone"}],15:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var AlarmHistory;
var React       = require('react');
var $           = require('jquery');
var Backbone    = require('backbone');
var constants   = require('../../constants');
var Tr          = require('../../components/tr.jsx');
var Td          = require('../../components/td.jsx');
var Tabs        = require('../../components/tabs.jsx');
var Icon        = require('./icon_wrapper.jsx');
var moment      = require('moment');

AlarmHistory = React.createClass({displayName: "AlarmHistory",
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
        React.createElement("tr", null, 
          React.createElement("td", {colSpan: "3"}, 
            React.createElement(Icon, {type: "circle-o-notch", spin: true}), " Loading data from server..."
          )
        )
      );
    }

    return this.state.collection.map(function (model, index) {
      var odd     = index % 2 ? 'odd' : '';
      var date    = moment(model.get('date')).format(constants.DATE_FORMAT);
      var title   = model.get('title');
      var comment = model.get('comment');

      return (
        React.createElement("tr", {key: model.cid, className: odd}, 
          React.createElement("td", {className: "datefield"}, date), ",", 
          React.createElement("td", null, title), ",", 
          React.createElement("td", null, comment)
        )
      );
    }, this);
  },
  render: function () {
    var items = this._buildTable();

    return (
      React.createElement("div", null, 
        React.createElement("table", {className: "full"}, 
          React.createElement("thead", null, 
            React.createElement("tr", null, 
              React.createElement("th", {className: "datefield"}, "Date"), React.createElement("th", null, "Action"), React.createElement("th", null, "Comments")
            )
          ), 
          React.createElement("tbody", null, 
            items
          )
        )
      )
    );
  }
});

module.exports = AlarmHistory;



},{"../../components/tabs.jsx":6,"../../components/td.jsx":7,"../../components/tr.jsx":9,"../../constants":10,"./icon_wrapper.jsx":26,"backbone":"backbone","jquery":"jquery","moment":"moment","react":"react"}],16:[function(require,module,exports){
var AlarmHistoryCollection;
var Backbone  = require('backbone');

AlarmHistoryCollection = Backbone.Collection.extend({
  fetch: function () {
    this.set([
      {
        date:     new Date(),
        title:    'Joe Smith executed a call',
        comment:  'This is just a comment'
      },
      {
        date:     new Date(),
        title:    'Alarm created by user',
        comment:  ''
      }
    ]);

    this.trigger('request');

    setTimeout(function () {
      this.trigger('sync', this);
    }.bind(this), 1000);
  },
  url: function () {
    return '';
  }
});

module.exports = AlarmHistoryCollection;



},{"backbone":"backbone"}],17:[function(require,module,exports){
var AlarmModel;
var Backbone = require('backbone');

AlarmModel = Backbone.Model.extend({});

module.exports = AlarmModel;



},{"backbone":"backbone"}],18:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var AndOrSelector;
var types_map = {};
var React     = require('react');
var Icon      = require('./icon_wrapper.jsx');
var Dropdown  = require('./dropdown.jsx');
var AND_VALUE = 'and';
var OR_VALUE  = 'or'

types_map[AND_VALUE] = 'all';
types_map[OR_VALUE]  = 'any';

AndOrSelector = React.createClass({displayName: "AndOrSelector",
  statics: {
    AND:  AND_VALUE,
    OR:   OR_VALUE
  },
  mixins: [React.addons.PureRenderMixin],
  getInitialState: function () {
    return {
      editing: false
    };
  },
  getDefaultProps: function () {
    return {
      type: AND_VALUE
    };
  },
  render: function () {
    var current   = types_map[this.props.type];
    var contents  = this.state.editing ? this._buildEditor() : (React.createElement("span", null, React.createElement("a", null, current), ":"));
    var props;

    props = {
      className:    'chain and-or',
      onMouseLeave: this._handleMouseLeave,
      onClick:      this._toggleEditing
    };

    return (
      React.createElement("span", React.__spread({},  props), 
        contents
      )
    );
  },
  _buildEditor: function () {
    var props;
    var choices = [
      {text: types_map[AND_VALUE], value: AND_VALUE},
      {text: types_map[OR_VALUE], value: OR_VALUE}
    ];

    props = {
      ref:      'dropdown',
      theme:    'light',
      selected: types_map[this.props.type],
      choices:  choices,
      onChoice: this._handleSelection,
      open:     true
    };

    return (
      React.createElement(Dropdown, React.__spread({},  props))
    );
  },
  _endEditing: function () {
    this.setState({editing: false});
  },
  _handleMouseLeave: function () {
    this._endEditing();
  },
  _toggleEditing: function (e) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({editing: ! this.state.editing});
  },
  _handleOrSelection: function () {
    this._handleSelection(OR_VALUE);
  },
  _handleAndSelection: function () {
    this._handleSelection(AND_VALUE);
  },
  _handleSelection: function (choice) {
    this._endEditing();

    if (this.props.onChange) {
      this.props.onChange(choice);
    }
  }
});

module.exports = AndOrSelector;



},{"./dropdown.jsx":21,"./icon_wrapper.jsx":26,"react":"react"}],19:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var Autocomplete;
var keyMap;
var $           = require('jquery');
var React       = require('react');
var Backbone    = require('backbone');
var Button      = require('../../components/button.jsx');
var Dropdown    = require('./dropdown.jsx');
var _           = require('underscore');
var Hotkeys     = require('react-hotkeys').HotKeys;

keyMap = {
  'moveUp':   'up',
  'moveDown': 'down',
  'select':   'enter'
};

function determineValue (value, multi) {
  if (multi) {
    return determineMultiValues(value);
  }

  return determineSingleValue(value);
}

function determineMultiValues (values) {
  if (! Array.isArray(values)) {
    values = [values];
  }

  return values;
}

function determineSingleValue (value) {
  if (Array.isArray(value)) {
    throw 'Expected ' + value + ' to not be an Array';
  }

  if (_.isString(value)) {
    value = {text: value};
  }

  return value;
}

Autocomplete = React.createClass({displayName: "Autocomplete",
  statics: {
    determineValue: determineValue
  },
  propTypes: {
    editing:    React.PropTypes.bool,
    multi:      React.PropTypes.bool,
    options:    React.PropTypes.array,
    generator:  React.PropTypes.func
  },
  getInitialState: function () {
    var value = Autocomplete.determineValue(this.props.value, this.props.multi);

    return {
      editing:    this.props.editing,
      value:      value,
      textValue:  (value && value.text) || '',
      active:     null,
      options:    this.props.options
    };
  },
  getDefaultProps: function () {
    return {
      editing:    false,
      multi:      false,
      options:    [],
      generator:  null
    };
  },
  componentDidMount: function () {
    this.focusSearch();
  },
  componentDidUpdate: function () {
    this.focusSearch();
  },
  render: function () {
    var options;
    var handlers = {
      moveUp:   this.moveUp,
      moveDown: this.moveDown,
      select:   this.selectItem
    };

    if (this.state.editing) {
      options = this.buildOptions();
    }

    return (
      React.createElement(Hotkeys, {keyMap: keyMap, handlers: handlers}, 
        React.createElement("div", {className: "fv-autocomplete"}, 
          React.createElement("input", {ref: "input", className: "inputable", type: "text", placeholder: "search criteria", ref: "input", onChange: this.handleChange, defaultValue: this.state.textValue}), 
          options
        )
      )
    );
  },
  buildOptions: function () {
    var options = this.state.options;
    var text    = this.state.textValue;

    if (this.props.generator) {
      options = this.props.generator(this.state.textValue);
    }

    options = options || [];
    options = options.map(function (option, index) {
      var classes = ['option', 'selectable'];

      classes.push('active-' + (index === this.state.active));

      return (
        React.createElement("li", {key: index, className: classes.join(' '), onClick: this.handleSelect.bind(this, option)}, option.label)
      );
    }, this);

    if (options.length < 1) {
      options = (
        React.createElement("li", {className: "muted option unselectable"}, "No matches found")
      );
    }

    return (
      React.createElement("div", {className: "options"}, 
        React.createElement("ul", {ref: "options"}, 
          options
        )
      )
    );
  },
  handleSelect: function (option, e) {
    var current_value = this.state.value;

    e.preventDefault();
    e.stopPropagation();

    if (this.props.multi) {
      current_value = this.state.value.slice();
      current_value.push(option);
    }

    this.setState({
      value:      current_value,
      textValue:  ''
    });

    if (this.props.onSelect) {
      this.props.onSelect(option, current_value);
    }
  },
  handleChange: function (e) {
    var options = this.state.options;

    if (this.props.generator) {
      options = this.props.generator(e.target.value)
    }

    this.setState({
      textValue:  e.target.value,
      active:     e.target.value ? 0 : null,
      options:    options
    });
  },
  moveDown: function () {
    var current = this.state.active;


    if (current === null) {
      current = -1;
    }

    current++;

    this.setState({active: current});
  },
  moveUp: function () {
    var current = this.state.active;

    if (current === null) {
      current = 1;
    }

    current--;

    this.setState({active: current});
  },
  focusSearch: function () {
    if (! this.state.editing) {
      return;
    }

    var node = React.findDOMNode(this.refs.input);

    node.focus();
  }
});

module.exports = Autocomplete;



},{"../../components/button.jsx":3,"./dropdown.jsx":21,"backbone":"backbone","jquery":"jquery","react":"react","react-hotkeys":"react-hotkeys","underscore":"underscore"}],20:[function(require,module,exports){
var Dispatcher = require('flux').Dispatcher;

module.exports = new Dispatcher();



},{"flux":"flux"}],21:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var Dropdown;
var DropdownChoice;
var offscreen_handlers;
var $           = require('jquery');
var React       = require('react');
var Button      = require('../../components/button.jsx');
var $window     = $(window);

offscreen_handlers = {
  left: function ($el, newState) {
    if ($el.is(':offscreen-right')) {
      newState.align = 'right';
    }
  },
  right: function ($el, newState) {
    if ($el.is(':offscreen-left')) {
      newState.align = 'left';
    }
  }
};

DropdownChoice = React.createClass({displayName: "DropdownChoice",
  render: function () {
    var buttonProps = {
      text:       this.props.text,
      onClick:    this._clickHandler,
      className:  this.props.theme
    };

    return (
      React.createElement("li", {className: "choice"}, React.createElement(Button, React.__spread({},  buttonProps)))
    );
  },
  _clickHandler: function () {
    if (this.props.onChoice) {
      this.props.onChoice(this.props.value);
    }
  }
});

Dropdown = React.createClass({displayName: "Dropdown",
  propTypes: {
    selected: React.PropTypes.string.isRequired,
    choices:  React.PropTypes.array
  },
  mixins: [React.addons.PureRenderMixin],
  getInitialState: function () {
    return {
      open:   !! this.props.open,
      align:  this.props.align || 'left'
    };
  },
  componentWillReceiveProps: function (nextProps) {
    if (nextProps.align) {
      this.setState({align: nextProps.align});
    }
  },
  componentDidMount: function () {
    this._ensureDropdownVisibility();
  },
  componentDidUpdate: function () {
    this._ensureDropdownVisibility();
  },
  getDefaultProps: function () {
    return {
      choices: []
    };
  },
  render: function () {
    var choices = this.state.open && this._buildChoices();
    var classes = ['dropdown', 'align-' + this.state.align];
    var buttonProps;

    buttonProps = {
      text:       this.props.selected,
      afterIcon:  'caret-down',
      onClick:    this._toggleOpen
    };

    this.props.className && classes.push(this.props.className);

    if (this.props.theme) {
      classes.push(this.props.theme);
      buttonProps.className = this.props.theme;
    }

    return (
      React.createElement("div", {className: classes.join(' '), onMouseLeave: this._handleLeave}, 
        React.createElement("div", {className: "selected"}, 
          React.createElement(Button, React.__spread({},  buttonProps))
        ), 
        choices
      )
    );
  },
  _handleLeave: function () {
    this.setState({open: false});
  },
  _toggleOpen: function (e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }

    this.setState({
      open: ! this.state.open
    });
  },
  _buildChoices: function () {
    var choices = [];

    choices = this.props.choices.map(function (choice, index) {
      if (choice.separator) {
        return (React.createElement("li", {className: "separator", key: index}));
      }

      var props = {
        key:      index,
        text:     choice.text,
        onChoice: this._handleChoice,
        theme:    this.props.theme,
        value:    choice.value
      };

      return (
        React.createElement(DropdownChoice, React.__spread({},  props))
      );
    }, this);

    return (React.createElement("ul", {ref: "dropdown"}, choices));
  },
  _handleChoice: function (value) {
    if (this.props.onChoice) {
      this.props.onChoice(value);
    }

    this.setState({open: false});
  },
  _ensureDropdownVisibility: function () {
    if (! this.state.open) {
      return null;
    }

    var dropdown  = this.refs.dropdown;
    var $el       = $(dropdown.getDOMNode());
    var newState  = {};
    var handler   = offscreen_handlers[this.state.align];

    handler && handler($el, newState);

    this.setState(newState);
  },
  _exit: function () {
    this.setState({open: false});
  }
});

module.exports = Dropdown;



},{"../../components/button.jsx":3,"jquery":"jquery","react":"react"}],22:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var FilterBox;
var React         = require('react');
var Backbone      = require('backbone');
var Autocomplete  = require('./autocomplete.jsx');
var Button        = require('../../components/button.jsx');
var Dropdown      = require('./dropdown.jsx');
var AndOr         = require('./and_or_selector.jsx');
var criteria      = require('./filter_box_definition');

FilterBox = React.createClass({displayName: "FilterBox",
  propTypes: {
    filterType: React.PropTypes.oneOf([AndOr.AND, AndOr.OR]),
    lockType:   React.PropTypes.bool,
    criteria:   React.PropTypes.object.isRequired
  },
  componentDidMount: function () {
    this.focusSearch();

    document.addEventListener('click', this.handleDocumentClick);
  },
  componentWillUnmount: function () {
    document.removeEventListener('click', this.handleDocumentClick);
  },
  componentDidUpdate: function () {
    this.focusSearch();
  },
  getDefaultProps: function () {
    return {
      filterType: AndOr.AND,
      lockType:   false,
      editing:    false
    }
  },
  getInitialState: function () {
    return {
      filterType: this.props.filterType,
      editing:    this.props.editing
    };
  },
  render: function () {
    var groups = this.buildGroups();

    return (
      React.createElement("div", {className: "filter-box", onClick: this.handleClick}, 
        React.createElement(Button, {className: "search-action pull-right feaux-button", icon: "search", onClick: this.initiateSearch}), 

        React.createElement("div", {className: "chain-group"}, 
          React.createElement("span", {className: "chain"}, 
            "Find alarms matching"
          ), 

          React.createElement(AndOr, {onChange: this.handleFilterTypeChange, type: this.state.filterType})
        ), 

        groups
      )
    );
  },
  handleDocumentClick: function () {
    this.endEditing();
  },
  buildGroups: function () {
    var input_props;
    var groups    = [];
    var generator = this.props.criteria.toOptions.bind(this.props.criteria);

    input_props = {
      type:         'text',
      className:    'chain inputable',
      placeholder:  'search criteria',
      ref:          'searchCriteria',
      onChange:     this.handleSearchCriteria
    };

    if (this.state.editing) {
      groups.push(
        React.createElement("div", {className: "chain-group", key: "searchCriteria"}, 
          React.createElement(Autocomplete, {ref: "searchCriteria", name: "something", onSelect: this.handleSelect, generator: generator, editing: true})
        )
      );
    }

    return groups;
  },
  handleSelect: function (value) {
    this.props.criteria.use(value.value);
    this.endEditing();
  },
  handleFilterTypeChange: function (value) {
    if (! this.props.lockType) {
      this.setState({filterType: value});
    }
  },
  initiateSearch: function () {
    this.endEditing();
  },
  handleClick: function (e) {
    // In the test env, we do not have stopImmediatePropagation, so our
    // tests will break if we don't use an `if` statement here
    if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
      e.nativeEvent.stopImmediatePropagation();
    }

    e.stopPropagation();
    e.preventDefault();

    this.enableEditing();
  },
  enableEditing: function () {
    if (! this.state.editing) {
      this.setState({editing: true});
    }
  },
  endEditing: function () {
    if (this.state.editing) {
      this.setState({editing: false});
    }
  },
  focusSearch: function () {
    if (! this.state.editing) {
      return;
    }

    /*var node = React.findDOMNode(this.refs.searchCriteria);

    node.focus();*/
  }
});

module.exports = FilterBox;



},{"../../components/button.jsx":3,"./and_or_selector.jsx":18,"./autocomplete.jsx":19,"./dropdown.jsx":21,"./filter_box_definition":23,"backbone":"backbone","react":"react"}],23:[function(require,module,exports){
"use strict";

var _             = require('underscore');
var date_matchers = ['day', 'date'];
var escapeRegex   = require('../../utils/escape_regex');
var definition;

definition = {
  criteria: {
    well: {
      display:  'Well name',
      locked:   false,
      value:    null,
      type:     'string',
      negate:   false
    },
    reporter: {
      display:  'Reported by',
      locked:   false,
      value:    null,
      type:     'string',
      negate:   false
    },
    reported: {
      display:  'Reported on',
      matchers: date_matchers,
      locked:   false,
      value:    null,
      type:     'day',
      negate:   false
    },
    reported_between: {
      display:  'Reported between',
      matchers: date_matchers,
      locked:   false,
      value:    [],
      type:     'daterange'
    },
    reported_gt: {
      display:  'Reported after',
      matchers: date_matchers,
      locked:   false,
      value:    null,
      type:     'day'
    },
    reported_lt: {
      display:  'Reported before',
      matchers: date_matchers,
      locked:   false,
      value:    null,
      type:     'day'
    },
    updated: {
      display:  'Updated on',
      matchers: date_matchers,
      locked:   false,
      value:    null,
      type:     'day',
      negate:   false
    },
    updated_between: {
      display:  'Updated between',
      matchers: date_matchers,
      locked:   false,
      value:    [],
      type:     'daterange'
    },
    updated_gt: {
      display:  'Updated after',
      matchers: date_matchers,
      locked:   false,
      value:    null,
      type:     'day'
    },
    updated_lt: {
      display:  'Updated before',
      matchers: date_matchers,
      locked:   false,
      value:    null,
      type:     'day'
    },
    tags: {
      display:  'Tags',
      locked:   false,
      type:     'tag',
      negate:   false,
      multi:    true
    },
    priority: {
      display:  'Priority',
      locked:   false,
      type:     'number',
      negate:   false
    },
    priority_gt: {
      display:  'Priority above',
      locked:   false,
      type:     'number'
    },
    priority_lt: {
      display:  'Priority below',
      locked:   false,
      type:     'number'
    },
    issue_type: {
      display:  'Issue type',
      locked:   false,
      type:     'string',
      multi:    true
    },
    issue_subtype: {
      display:  'Issue subtype',
      locked:   false,
      type:     'string',
      multi:    true
    }
  }
};

function Builder (criteria) {
  this.criteria   = _.extend({}, criteria);
  this.free_text  = null;
}

Builder.prototype.matchCriteria = function (string) {
  console.time('matchCriteria')
  var results;
  var pattern   = /./;
  var values    = [];
  var keys      = Object.keys(this.criteria);
  var truthTest = function () {return true;};

  if (string && string.length > 0) {
    pattern   = new RegExp(escapeRegex(string || ''), 'i');
    truthTest = pattern.test.bind(pattern);
  }

  keys.forEach(function (key) {
    var matchers;
    var i;
    var len;
    var criteria = this.criteria[key];

    if (! this.isAvailable(key)) {
      return false;
    }

    if (truthTest(key)) {
      return values.push(key);
    }

    if (truthTest('[' + criteria.display + ']')) {
      return values.push(key);
    }

    matchers = criteria.matchers || [];

    for (i = 0, len = matchers.length; i < len; i++) {
      if (pattern.test(matchers[i])) {
        values.push(key);

        return true;
      }
    }
  }, this);

  results = _.pick(this.criteria, values);
  console.timeEnd('matchCriteria')

  return results;
};

Builder.prototype.toOptions = function (string) {
  var results = this.matchCriteria(string);
  var options = _.map(results, function (item, key) {
    return {value: key, label: item.display};
  });

  if (string && ! this.free_text && ! /^\[/.test(string)) {
    options.unshift({
      label:  string,
      value:  string
    });
  }

  return options;
};

Builder.prototype.set = function (key, prop, value) {
  if (! key || ! prop) {
    throw 'key and prop are required';
  }

  if (this.criteria.hasOwnProperty(key)) {
    this.criteria[key][prop] = value;

    return true;
  }
};

Builder.prototype.use = function (key) {
  return this.set(key, 'used', true);
};

Builder.prototype.refund = function (key) {
  return this.set(key, 'used');
};

Builder.prototype.lock = function (key) {
  return this.set(key, 'locked', true);
};

Builder.prototype.unlock = function (key) {
  return this.set(key, 'locked', false);
};

Builder.prototype.isAvailable = function (key) {
  var criteria = this.criteria[key];

  if (! criteria) {
    return false;
  }

  return ! criteria.locked && ! criteria.used;
};

module.exports = {
  definition: definition.criteria,
  Builder: Builder
};



},{"../../utils/escape_regex":36,"underscore":"underscore"}],24:[function(require,module,exports){
"use strict";

var Backbone  = require('backbone');
var Model     = require('./heading_model');

module.exports = Backbone.Collection.extend({
  model: Model,
  linkSiblings: function () {
    this.each(function (header, index) {
      header.prev = this.at(index - 1);
      header.next = this.at(index + 1);
    }, this);
  },
  registerWithDispatcher: function (dispatcher) {
    this.dispatch_token = dispather.register(function (payload) {
      console.log(payload);
    }.bind(this));
  }
});



},{"./heading_model":25,"backbone":"backbone"}],25:[function(require,module,exports){
var Model;
var Backbone = require('backbone');

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
  }
});

module.exports = Model;



},{"backbone":"backbone"}],26:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var IconWrapper;
var mappings;
var _     = require('underscore');
var Icon  = require('../../components/icon.jsx');
var React = require('react');

/**
 * Allows mapping a case status to a particular icon type
 */
mappings = {
  'alarm':                        'bell',
  'alarm-acknowledged':           'bell-slash',
  'alarm-acknowledged-critical':  'bell-slash',
  'alarm-critical':               'bell',
  'alarm-acknowledged-normal':    'bell-slash-o',
  'alarm-normal':                 'bell-o',
  'alarm-cleared':                'check-circle'
};

/**
 * Wraps the Icon component, see that component for usage examples
 */
IconWrapper = React.createClass({displayName: "IconWrapper",
  mixins: [React.addons.PureRenderMixin],
  render: function () {
    var newProps = _.extend({}, this.props);

    newProps.className  = newProps.type;
    newProps.type       = mappings[newProps.type] || newProps.type;

    return (
      React.createElement(Icon, React.__spread({},  newProps))
    );
  }
});

module.exports = IconWrapper;



},{"../../components/icon.jsx":4,"react":"react","underscore":"underscore"}],27:[function(require,module,exports){
module.exports = {
  dispatcher:       require('./dispatcher'),
  AlarmModel:        require('./alarm_model'),
  AlarmCollection:   require('./alarm_collection'),
  ListView:         require('./list_view.jsx'),
  list_view_store:  require('./list_view_store')
};



},{"./alarm_collection":14,"./alarm_model":17,"./dispatcher":20,"./list_view.jsx":30,"./list_view_store":31}],28:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var ListFilter;
var React       = require('react');
var Backbone    = require('backbone');
var Icon        = require('./icon_wrapper.jsx');
var Dropdown    = require('./dropdown.jsx');
var FilterBox   = require('./filter_box.jsx');
var criteria    = require('./filter_box_definition');

ListFilter = React.createClass({displayName: "ListFilter",
  propTypes: {
    store: React.PropTypes.instanceOf(Backbone.Model).isRequired
  },
  render: function () {
    var choices;
    var builder = new criteria.Builder(criteria.definition);

    choices = [
      {text: 'New from current...'},
      {text: 'New from blank...'},
      {separator: true},
      {text: 'Critical alarms'},
      {text: 'Newest alarms'},
      {text: 'Acknowledged Alarms'}
    ];

    return (
      React.createElement("caption", {className: "list-filter"}, 
        React.createElement("div", {className: "filter-selection"}, 
          React.createElement("ul", {className: "pull-right inline"}, 
            React.createElement("li", null, "Quick filters:"), 
            React.createElement("li", null, 
              React.createElement(Dropdown, {selected: "Active alarms", align: "right", choices: choices})
            ), 
            React.createElement("li", {className: "icon-group"}, 
              React.createElement("a", {onClick: this._saveFilter}, React.createElement(Icon, {type: "save", size: "lg"})), 
              React.createElement("a", {onClick: this._deleteFilter}, React.createElement(Icon, {type: "trash-o", size: "lg"}))
            )
          )
        ), 

        React.createElement(FilterBox, {criteria: builder})
      )
    );
  }
});

module.exports = ListFilter;



},{"./dropdown.jsx":21,"./filter_box.jsx":22,"./filter_box_definition":23,"./icon_wrapper.jsx":26,"backbone":"backbone","react":"react"}],29:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var ListRow;
var _             = require('underscore');
var React         = require('react');
var Backbone      = require('backbone');
var HeadingModel  = require('./heading_model');
var AlarmModel    = require('./alarm_model');
var Tr            = require('../../components/tr.jsx');
var Td            = require('../../components/td.jsx');
var transformers  = require('./transformers.jsx')

ListRow = React.createClass({displayName: "ListRow",
  propTypes: {
    heading: React.PropTypes.instanceOf(HeadingModel).isRequired,
    managed_case: React.PropTypes.instanceOf(AlarmModel).isRequired
  },
  shouldComponentUpdate: function (newProps, newState) {
    return true;
    var new_case  = newProps.managed_case ? newProps.managed_case.toJSON() : {};
    var old_case  = this.props.managed_case.toJSON();

    if (this.props.className !== newProps.className) {
      return true;
    }

    if (! _.isEqual(old_case, new_case)) {
      return true;
    }

    return false;
  },
  render: function () {
    var cols = this.buildCols();

    return (
      React.createElement(Tr, {className: this.props.className, onClick: this.handleClick}, 
        cols
      )
    );
  },
  handleClick: function (e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  },
  buildCols: function () {
    var name;
    var value;
    var alarm   = this.props.alarm;
    var heading = this.props.heading;
    var fields  = [];

    while (heading) {
      name  = heading.get('name');
      type  = heading.get('type');
      value = transformers[type] && transformers[type].call(this, alarm, name);

      fields.push(
        React.createElement(Td, {store: alarm, key: heading.cid}, 
          value
        )
      );

      heading = heading.next;
    }

    return fields;
  },
  acknowledgeAlarm: function () {
    this.props.alarm.set('acknowledged', true);
    this.setState({});
  },
  clearAlarm: function () {
    this.props.alarm.set({
      acknowledged: true,
      cleared:      true
    });

    this.setState({});
  }
});

module.exports = ListRow;



},{"../../components/td.jsx":7,"../../components/tr.jsx":9,"./alarm_model":17,"./heading_model":25,"./transformers.jsx":35,"backbone":"backbone","react":"react","underscore":"underscore"}],30:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var AlarmsList;
var React   = require('react');
var Thead   = require('./thead_wrapper.jsx');
var Tbody   = require('./tbody_wrapper.jsx');
var Filter  = require('./list_filter.jsx');

AlarmsList = React.createClass({displayName: "AlarmsList",
  render: function () {
    var props = {store: this.props.store};

    return (
      React.createElement("div", null, 
        React.createElement("table", {className: "full inline-details"}, 
          React.createElement(Filter, React.__spread({},  props)), 
          React.createElement(Thead, React.__spread({},  props)), 
          React.createElement(Tbody, React.__spread({},  props))
        )
      )
    );
  }
});

module.exports = AlarmsList;



},{"./list_filter.jsx":28,"./tbody_wrapper.jsx":32,"./thead_wrapper.jsx":34,"react":"react"}],31:[function(require,module,exports){
"use strict";

var store;
var Backbone          = require('backbone');
var HeadingCollection = require('./heading_collection');
var AlarmCollection    = require('./alarm_collection');

store = new Backbone.Model({
  alarms:    new AlarmCollection(),
  first:    null,
  headings: new HeadingCollection(),
  selected: null
});

module.exports = store;



},{"./alarm_collection":14,"./heading_collection":24,"backbone":"backbone"}],32:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var TbodyWrapper;
var React             = require('react');
var Backbone          = require('backbone');
var Scroller          = require('../../utils/scroller_coaster');
var RowDetails        = require('./active_row_details.jsx');
var AlarmHistoryView  = require('./alarm_history.jsx');
var HistoryCollection = require('./alarm_history_collection');
var ListRow           = require('./list_row.jsx');
var classNames        = require('classnames');

TbodyWrapper = React.createClass({displayName: "TbodyWrapper",
  propTypes: {
    store: React.PropTypes.instanceOf(Backbone.Model).isRequired
  },
  mixins: [React.addons.PureRenderMixin],
  getInitialState: function () {
    return {
      activeAlarm: null,
      minimized:  false,
      previous:   null,
      increment:  false
    };
  },
  componentDidUpdate: function () {
    var elements;
    var active = this.state.activeAlarm;

    if (! active) {
      return false;
    }

    elements = [
      this.refs[active].getDOMNode(),
      this.refs.activeAlarm.getDOMNode()
    ];

    Scroller(elements, {steps: 250});
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
    var alarms   = store.get('alarms');
    var heading = store.get('first');
    var prev    = null;
    var next    = null;

    alarms.each(function (model, index) {
      var activeProps;
      var rowProps;
      var selected_row;
      var class_names;
      var active  = this.state.activeAlarm === model.cid;
      var odd     = index % 2 ? 'odd' : null;

      next = alarms.at(index + 1);

      class_names = classNames({
        odd: odd,
        active: active
      });

      rowProps = {
        className:    class_names,
        ref:          model.cid,
        key:          model.cid,
        onClick:      this._handleAlarmSelection.bind(this, model.cid),
        alarm:        model,
        heading:      heading
      };

      data.push(
        React.createElement(ListRow, React.__spread({},  rowProps))
      );

      if (active) {
        activeProps = {
          className:  odd,
          model:      model,
          prev:       prev && prev.cid,
          next:       next && next.cid,
          switcher:   this._handleAlarmSelection,
          sizeToggle: this._toggleMinimize,
          key:        model.cid + '-active',
          ref:        'activeAlarm',
          minimized:  this.state.minimized
        };

        data.push(
          React.createElement(RowDetails, React.__spread({},  activeProps), 
            React.createElement(AlarmHistoryView, {collection: new HistoryCollection()})
          )
        );
      }

      prev = model;
    }, this);

    return data;
  },
  _handleAlarmSelection: function (cid, increment) {
    var current = this.state.activeAlarm;

    if (current === cid) {
      cid = null;
    }

    this.setState({
      activeAlarm: cid,
      increment:  increment === true,
      previous:   cid ? current : null
    });
  },
});

module.exports = TbodyWrapper;



},{"../../utils/scroller_coaster":37,"./active_row_details.jsx":13,"./alarm_history.jsx":15,"./alarm_history_collection":16,"./list_row.jsx":29,"backbone":"backbone","classnames":2,"react":"react"}],33:[function(require,module,exports){
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



},{"../../components/th.jsx":8,"backbone":"backbone","react":"react"}],34:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var Thead;
var React     = require('react');
var Backbone  = require('backbone');
var Th        = require('./th_wrapper.jsx');

Thead = React.createClass({displayName: "Thead",
  propTypes: {
    store: React.PropTypes.instanceOf(Backbone.Model).isRequired
  },
  render: function () {
    var cols = this._buildColumns();

    return (
      React.createElement("thead", {className: this.props.className}, 
        React.createElement("tr", null, 
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
      data.className    = current.get('type') === 'alarm_actions' ? 'actions-col' : '';

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



},{"./th_wrapper.jsx":33,"backbone":"backbone","react":"react"}],35:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var Button    = require('../../components/button.jsx');
var Icon      = require('./icon_wrapper.jsx');
var moment    = require('moment');
var React     = require('react');
var constants = require('../../constants');

/**
 * Each transformer should take case and attr_name params
 */
module.exports = {
  alarm_details: function (model) {
    var code    = model.get('code');
    var message = model.get('message');

    return (
      React.createElement("div", null, 
        code, " - ", message
      )
    )
  },
  status: function (model) {
    var values = ['alarm'];
    var checks = ['acknowledged', 'critical', 'normal'];

    if (model.get('cleared')) {
      values.push('cleared');

      checks = [];
    }

    checks.forEach(function (label) {
      if (model.get(label)) {
        values.push(label);
      }
    });

    return (React.createElement(Icon, {type: values.join('-')}));
  },
  well: function (model) {
    var well = model.get('well');

    return (
      React.createElement("div", null, 
        React.createElement("div", null, well.name), 
        React.createElement("div", {className: "muted small"}, "Well status: ", well.status)
      )
    );
  },
  date: function (model) {
    var created   = moment(model.get('created_date')).format(constants.DATE_FORMAT);

    return (React.createElement("div", null, created));
  },
  cases: function (model) {
    var content;
    var button_text = 'Create';
    var length      = model.get('cases').length;

    content = (React.createElement(Button, {icon: "plus", text: button_text, className: "block"}));

    if (length) {
      button_text = ['View ', '(', length, ')'].join('');
      content = (
        React.createElement("div", {className: "button-group piped"}, 
          React.createElement(Button, {feaux: true, icon: "plus"}), 
          React.createElement(Button, {feaux: true, text: button_text})
        )
      );
    }

    return (
      React.createElement("div", null, 
        content
      )
    );
  },
  alarm_actions: function (model) {
    var buttonProps;
    var button = (React.createElement("span", {className: "nodata"}, "None available"));

    if (model.get('cleared')) {
      return button;
    }

    buttonProps = {
      text:     'Acknowledge',
      icon:     'bell-slash',
      onClick:  this.acknowledgeAlarm
    };

    if (model.get('acknowledged')) {
      buttonProps = {
        text:     'Clear',
        icon:     'check',
        onClick:  this.clearAlarm
      };
    }

    return (
      React.createElement("div", {className: "button-group button-drop"}, 
        React.createElement(Button, {icon: "caret-down"}), 
        React.createElement(Button, React.__spread({},  buttonProps))
      )
    );
  }
};



},{"../../components/button.jsx":3,"../../constants":10,"./icon_wrapper.jsx":26,"moment":"moment","react":"react"}],36:[function(require,module,exports){
"use strict";

// See http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex

var specials;
var regex;

specials = [
  // order matters for these
    '-'
  , '['
  , ']'
  // order doesn't matter for any of these
  , '/'
  , '{'
  , '}'
  , '('
  , ')'
  , '*'
  , '+'
  , '?'
  , '.'
  , '\\'
  , '^'
  , '$'
  , '|'
];

regex = new RegExp('[' + specials.join('\\') + ']', 'g');

module.exports = function (string) {
  return string.replace(regex, '\\$&');
};



},{}],37:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9hbGFybXMuanMiLCJub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2NvbXBvbmVudHMvYnV0dG9uLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2NvbXBvbmVudHMvaWNvbi5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9jb21wb25lbnRzL3NvcnRfaW5kaWNhdG9yLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2NvbXBvbmVudHMvdGFicy5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9jb21wb25lbnRzL3RkLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2NvbXBvbmVudHMvdGguanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvY29tcG9uZW50cy90ci5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9jb25zdGFudHMuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9kYXRhL2FsYXJtc19saXN0X2JvZHkuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9kYXRhL2FsYXJtc19saXN0X2hlYWRpbmdzLmpzIiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9hbGFybXMvYWN0aXZlX3Jvd19kZXRhaWxzLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvYWxhcm1zL2FsYXJtX2NvbGxlY3Rpb24uanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL2FsYXJtcy9hbGFybV9oaXN0b3J5LmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvYWxhcm1zL2FsYXJtX2hpc3RvcnlfY29sbGVjdGlvbi5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvYWxhcm1zL2FsYXJtX21vZGVsLmpzIiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9hbGFybXMvYW5kX29yX3NlbGVjdG9yLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvYWxhcm1zL2F1dG9jb21wbGV0ZS5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL2FsYXJtcy9kaXNwYXRjaGVyLmpzIiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9hbGFybXMvZHJvcGRvd24uanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9hbGFybXMvZmlsdGVyX2JveC5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL2FsYXJtcy9maWx0ZXJfYm94X2RlZmluaXRpb24uanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL2FsYXJtcy9oZWFkaW5nX2NvbGxlY3Rpb24uanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL2FsYXJtcy9oZWFkaW5nX21vZGVsLmpzIiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9hbGFybXMvaWNvbl93cmFwcGVyLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvYWxhcm1zL2luZGV4LmpzIiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9hbGFybXMvbGlzdF9maWx0ZXIuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9hbGFybXMvbGlzdF9yb3cuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9hbGFybXMvbGlzdF92aWV3LmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvYWxhcm1zL2xpc3Rfdmlld19zdG9yZS5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvYWxhcm1zL3Rib2R5X3dyYXBwZXIuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9hbGFybXMvdGhfd3JhcHBlci5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL2FsYXJtcy90aGVhZF93cmFwcGVyLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvYWxhcm1zL3RyYW5zZm9ybWVycy5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy91dGlscy9lc2NhcGVfcmVnZXguanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy91dGlscy9zY3JvbGxlcl9jb2FzdGVyL2luZGV4LmpzIl0sIm5h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LElBQUksSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7SUFFbkM7TUFDRSxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJO1FBQzdCLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTztPQUNyQjtLQUNGO0dBQ0Y7RUFDRCxNQUFNLEVBQUUsVUFBVSxLQUFLLEVBQUU7SUFDdkIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMzQixJQUFJLElBQUksTUFBTSxHQUFHLENBQUMsY0FBYyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQzs7SUFFcEQsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQzlCLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7TUFFdkIsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNsQixLQUFLOztJQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxLQUFLLEVBQUU7TUFDOUIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDcEI7QUFDUCxLQUFLLENBQUMsQ0FBQzs7SUFFSCxRQUFRLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO0dBQzlEO0VBQ0QsSUFBSSxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQ3pCLElBQUksSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7SUFFN0I7TUFDRSxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJO1FBQzdCLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzNDLEtBQUssQ0FBQyxh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TUFBTSxHQUFHLENBQUMsQ0FBQzs7QUFFdEYsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDOztFQUV2QyxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQzs7QUFFRixlQUFlLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxTQUFTLElBQUksRUFBRSxTQUFTLEVBQUU7RUFDekQsSUFBSSxRQUFRLENBQUM7QUFDZixFQUFFLElBQUksT0FBTyxDQUFDOztFQUVaLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUM7RUFDdEMsUUFBUSxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3ZDLEVBQUUsT0FBTyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRW5ELEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQzs7RUFFbEQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO0lBQ2YscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUM3QztBQUNILENBQUMsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQzs7QUFFakMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJlYWN0ICAgICAgICAgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFBlcmYgICAgICAgICAgICAgICAgPSBSZWFjdC5hZGRvbnMuUGVyZjtcbnZhciBEaXNwYXRjaGVyICAgICAgICAgID0gcmVxdWlyZSgnZmx1eCcpLkRpc3BhdGNoZXI7XG52YXIgYWxhcm1zX21vZHVsZSAgICAgICA9IHJlcXVpcmUoJy4vbW9kdWxlcy9hbGFybXMnKTtcbnZhciBMaXN0VmlldyAgICAgICAgICAgID0gYWxhcm1zX21vZHVsZS5MaXN0VmlldztcbnZhciBsaXN0X3ZpZXdfc3RvcmUgICAgID0gYWxhcm1zX21vZHVsZS5saXN0X3ZpZXdfc3RvcmU7XG52YXIgX2RhdGFfbGlzdF9oZWFkaW5ncyA9IHJlcXVpcmUoJy4vZGF0YS9hbGFybXNfbGlzdF9oZWFkaW5ncycpO1xudmFyIF9kYXRhX2xpc3RfYm9keSAgICAgPSByZXF1aXJlKCcuL2RhdGEvYWxhcm1zX2xpc3RfYm9keScpKDE1KTtcbnZhciBsaXN0X2hlYWRpbmdzICAgICAgID0gbGlzdF92aWV3X3N0b3JlLmdldCgnaGVhZGluZ3MnKTtcbnZhciBhbGFybV9saXN0ICAgICAgICAgID0gbGlzdF92aWV3X3N0b3JlLmdldCgnYWxhcm1zJyk7XG5cbmxpc3RfaGVhZGluZ3Muc2V0KF9kYXRhX2xpc3RfaGVhZGluZ3MpO1xubGlzdF92aWV3X3N0b3JlLnNldCgnZmlyc3QnLCBsaXN0X2hlYWRpbmdzLmF0KDApKTtcbmxpc3RfaGVhZGluZ3MubGlua1NpYmxpbmdzKCk7XG5cbmFsYXJtX2xpc3Quc2V0KF9kYXRhX2xpc3RfYm9keSk7XG5cbmZ1bmN0aW9uIHJlbmRlciAoaWQpIHtcbiAgUmVhY3QucmVuZGVyKFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGlzdFZpZXcsIHtcbiAgICAgIGhlYWRpbmdzOiBsaXN0X2hlYWRpbmdzLFxuICAgICAgc3RvcmU6ICAgIGxpc3Rfdmlld19zdG9yZVxuICAgIH0pLFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxuICApO1xufTtcblxucmVuZGVyKCdhbGFybXMtbGlzdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbmRlcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyRnNZWEp0Y3k1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hKUVVGSkxFdEJRVXNzYVVKQlFXbENMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU16UXl4SlFVRkpMRWxCUVVrc2EwSkJRV3RDTEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRE8wRkJRelZETEVsQlFVa3NWVUZCVlN4WlFVRlpMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF5eFZRVUZWTEVOQlFVTTdRVUZEY2tRc1NVRkJTU3hoUVVGaExGTkJRVk1zVDBGQlR5eERRVUZETEd0Q1FVRnJRaXhEUVVGRExFTkJRVU03UVVGRGRFUXNTVUZCU1N4UlFVRlJMR05CUVdNc1lVRkJZU3hEUVVGRExGRkJRVkVzUTBGQlF6dEJRVU5xUkN4SlFVRkpMR1ZCUVdVc1QwRkJUeXhoUVVGaExFTkJRVU1zWlVGQlpTeERRVUZETzBGQlEzaEVMRWxCUVVrc2JVSkJRVzFDTEVkQlFVY3NUMEZCVHl4RFFVRkRMRFpDUVVFMlFpeERRVUZETEVOQlFVTTdRVUZEYWtVc1NVRkJTU3hsUVVGbExFOUJRVThzVDBGQlR5eERRVUZETEhsQ1FVRjVRaXhEUVVGRExFTkJRVU1zUlVGQlJTeERRVUZETEVOQlFVTTdRVUZEYWtVc1NVRkJTU3hoUVVGaExGTkJRVk1zWlVGQlpTeERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJRenRCUVVNeFJDeEpRVUZKTEZWQlFWVXNXVUZCV1N4bFFVRmxMRU5CUVVNc1IwRkJSeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZET3p0QlFVVjRSQ3hoUVVGaExFTkJRVU1zUjBGQlJ5eERRVUZETEcxQ1FVRnRRaXhEUVVGRExFTkJRVU03UVVGRGRrTXNaVUZCWlN4RFFVRkRMRWRCUVVjc1EwRkJReXhQUVVGUExFVkJRVVVzWVVGQllTeERRVUZETEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRMnhFTEdGQlFXRXNRMEZCUXl4WlFVRlpMRVZCUVVVc1EwRkJRenM3UVVGRk4wSXNWVUZCVlN4RFFVRkRMRWRCUVVjc1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF6czdRVUZGYUVNc1UwRkJVeXhOUVVGTkxFVkJRVVVzUlVGQlJTeEZRVUZGTzBWQlEyNUNMRXRCUVVzc1EwRkJReXhOUVVGTk8wbEJRMVlzUzBGQlN5eERRVUZETEdGQlFXRXNRMEZCUXl4UlFVRlJMRVZCUVVVN1RVRkROVUlzVVVGQlVTeEZRVUZGTEdGQlFXRTdUVUZEZGtJc1MwRkJTeXhMUVVGTExHVkJRV1U3UzBGRE1VSXNRMEZCUXp0SlFVTkdMRkZCUVZFc1EwRkJReXhqUVVGakxFTkJRVU1zUlVGQlJTeERRVUZETzBkQlF6VkNMRU5CUVVNN1FVRkRTaXhEUVVGRExFTkJRVU03TzBGQlJVWXNUVUZCVFN4RFFVRkRMR0ZCUVdFc1EwRkJReXhEUVVGRE96dEJRVVYwUWl4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExFMUJRVTBzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJblpoY2lCU1pXRmpkQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRbktUdGNiblpoY2lCUVpYSm1JQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEMGdVbVZoWTNRdVlXUmtiMjV6TGxCbGNtWTdYRzUyWVhJZ1JHbHpjR0YwWTJobGNpQWdJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KMlpzZFhnbktTNUVhWE53WVhSamFHVnlPMXh1ZG1GeUlHRnNZWEp0YzE5dGIyUjFiR1VnSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2N1TDIxdlpIVnNaWE12WVd4aGNtMXpKeWs3WEc1MllYSWdUR2x6ZEZacFpYY2dJQ0FnSUNBZ0lDQWdJQ0E5SUdGc1lYSnRjMTl0YjJSMWJHVXVUR2x6ZEZacFpYYzdYRzUyWVhJZ2JHbHpkRjkyYVdWM1gzTjBiM0psSUNBZ0lDQTlJR0ZzWVhKdGMxOXRiMlIxYkdVdWJHbHpkRjkyYVdWM1gzTjBiM0psTzF4dWRtRnlJRjlrWVhSaFgyeHBjM1JmYUdWaFpHbHVaM01nUFNCeVpYRjFhWEpsS0NjdUwyUmhkR0V2WVd4aGNtMXpYMnhwYzNSZmFHVmhaR2x1WjNNbktUdGNiblpoY2lCZlpHRjBZVjlzYVhOMFgySnZaSGtnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTlrWVhSaEwyRnNZWEp0YzE5c2FYTjBYMkp2WkhrbktTZ3hOU2s3WEc1MllYSWdiR2x6ZEY5b1pXRmthVzVuY3lBZ0lDQWdJQ0E5SUd4cGMzUmZkbWxsZDE5emRHOXlaUzVuWlhRb0oyaGxZV1JwYm1kekp5azdYRzUyWVhJZ1lXeGhjbTFmYkdsemRDQWdJQ0FnSUNBZ0lDQTlJR3hwYzNSZmRtbGxkMTl6ZEc5eVpTNW5aWFFvSjJGc1lYSnRjeWNwTzF4dVhHNXNhWE4wWDJobFlXUnBibWR6TG5ObGRDaGZaR0YwWVY5c2FYTjBYMmhsWVdScGJtZHpLVHRjYm14cGMzUmZkbWxsZDE5emRHOXlaUzV6WlhRb0oyWnBjbk4wSnl3Z2JHbHpkRjlvWldGa2FXNW5jeTVoZENnd0tTazdYRzVzYVhOMFgyaGxZV1JwYm1kekxteHBibXRUYVdKc2FXNW5jeWdwTzF4dVhHNWhiR0Z5YlY5c2FYTjBMbk5sZENoZlpHRjBZVjlzYVhOMFgySnZaSGtwTzF4dVhHNW1kVzVqZEdsdmJpQnlaVzVrWlhJZ0tHbGtLU0I3WEc0Z0lGSmxZV04wTG5KbGJtUmxjaWhjYmlBZ0lDQlNaV0ZqZEM1amNtVmhkR1ZGYkdWdFpXNTBLRXhwYzNSV2FXVjNMQ0I3WEc0Z0lDQWdJQ0JvWldGa2FXNW5jem9nYkdsemRGOW9aV0ZrYVc1bmN5eGNiaUFnSUNBZ0lITjBiM0psT2lBZ0lDQnNhWE4wWDNacFpYZGZjM1J2Y21WY2JpQWdJQ0I5S1N4Y2JpQWdJQ0JrYjJOMWJXVnVkQzVuWlhSRmJHVnRaVzUwUW5sSlpDaHBaQ2xjYmlBZ0tUdGNibjA3WEc1Y2JuSmxibVJsY2lnbllXeGhjbTF6TFd4cGMzUW5LVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCeVpXNWtaWEk3WEc0aVhYMD0iLCJmdW5jdGlvbiBjbGFzc05hbWVzKCkge1xuXHR2YXIgY2xhc3NlcyA9ICcnO1xuXHR2YXIgYXJnO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0YXJnID0gYXJndW1lbnRzW2ldO1xuXHRcdGlmICghYXJnKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBhcmcgfHwgJ251bWJlcicgPT09IHR5cGVvZiBhcmcpIHtcblx0XHRcdGNsYXNzZXMgKz0gJyAnICsgYXJnO1xuXHRcdH0gZWxzZSBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZykgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcblx0XHRcdGNsYXNzZXMgKz0gJyAnICsgY2xhc3NOYW1lcy5hcHBseShudWxsLCBhcmcpO1xuXHRcdH0gZWxzZSBpZiAoJ29iamVjdCcgPT09IHR5cGVvZiBhcmcpIHtcblx0XHRcdGZvciAodmFyIGtleSBpbiBhcmcpIHtcblx0XHRcdFx0aWYgKCFhcmcuaGFzT3duUHJvcGVydHkoa2V5KSB8fCAhYXJnW2tleV0pIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGtleTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIGNsYXNzZXMuc3Vic3RyKDEpO1xufVxuXG4vLyBzYWZlbHkgZXhwb3J0IGNsYXNzTmFtZXMgaW4gY2FzZSB0aGUgc2NyaXB0IGlzIGluY2x1ZGVkIGRpcmVjdGx5IG9uIGEgcGFnZVxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gY2xhc3NOYW1lcztcbn1cbiIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgQnV0dG9uO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBJY29uICA9IHJlcXVpcmUoJy4vaWNvbi5qc3gnKTtcblxuQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkJ1dHRvblwiLFxuICBtaXhpbnM6IFtSZWFjdC5hZGRvbnMuUHVyZVJlbmRlck1peGluXSxcbiAgcHJvcFR5cGVzOiB7XG4gICAgaWNvbjogICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgb25DbGljazogIFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIGhyZWY6ICAgICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBpY29uICAgICAgPSB0aGlzLnByb3BzLmljb24gPyBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiB0aGlzLnByb3BzLmljb24sIHJlZjogXCJpY29uXCJ9KSA6IG51bGw7XG4gICAgdmFyIGNsYXNzZXMgICA9IFsnYnV0dG9uJ107XG4gICAgdmFyIGFmdGVySWNvbiA9IHRoaXMucHJvcHMuYWZ0ZXJJY29uID8gUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogdGhpcy5wcm9wcy5hZnRlckljb24sIHJlZjogXCJhZnRlci1pY29uXCJ9KSA6IG51bGw7XG4gICAgdmFyIHRleHQgICAgICA9IHRoaXMucHJvcHMudGV4dCA/IChSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcInRleHRcIn0sIHRoaXMucHJvcHMudGV4dCkpIDogbnVsbDtcbiAgICB2YXIgcHJvcHM7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5mZWF1eCkge1xuICAgICAgY2xhc3NlcyA9IFsnZmVhdXgtYnV0dG9uJ107XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY2xhc3NOYW1lKSB7XG4gICAgICBjbGFzc2VzLnB1c2godGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuICAgIH1cblxuICAgIHByb3BzID0ge1xuICAgICAgaHJlZjogICAgICAgdGhpcy5wcm9wcy5ocmVmLFxuICAgICAgYWN0aW9uOiAgICAgdGhpcy5wcm9wcy5hY3Rpb24sXG4gICAgICBvbkNsaWNrOiAgICB0aGlzLl9oYW5kbGVDbGljayxcbiAgICAgIGNsYXNzTmFtZTogIGNsYXNzZXMuam9pbignICcpXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCBSZWFjdC5fX3NwcmVhZCh7fSwgIHByb3BzKSwgXG4gICAgICAgIGljb24sIFxuICAgICAgICB0ZXh0LCBcbiAgICAgICAgYWZ0ZXJJY29uXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgX2hhbmRsZUNsaWNrOiBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgdGhpcy5wcm9wcy5vbkNsaWNrICYmIHRoaXMucHJvcHMub25DbGljayhlKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQnV0dG9uO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDJOdmJYQnZibVZ1ZEhNdlluVjBkRzl1TG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHM3UVVGRlFTeEhRVUZIT3p0QlFVVklMRWxCUVVrc1RVRkJUU3hEUVVGRE8wRkJRMWdzU1VGQlNTeExRVUZMTEVkQlFVY3NUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8wRkJRemRDTEVsQlFVa3NTVUZCU1N4SlFVRkpMRTlCUVU4c1EwRkJReXhaUVVGWkxFTkJRVU1zUTBGQlF6czdRVUZGYkVNc05FSkJRVFJDTEhOQ1FVRkJPMFZCUXpGQ0xFMUJRVTBzUlVGQlJTeERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1pVRkJaU3hEUVVGRE8wVkJRM1JETEZOQlFWTXNSVUZCUlR0SlFVTlVMRWxCUVVrc1RVRkJUU3hMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEUxQlFVMDdTVUZEYUVNc1QwRkJUeXhIUVVGSExFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1R0SlFVTTVRaXhKUVVGSkxFMUJRVTBzUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4TlFVRk5PMGRCUTJwRE8wVkJRMFFzVFVGQlRTeEZRVUZGTEZsQlFWazdTVUZEYkVJc1NVRkJTU3hKUVVGSkxGRkJRVkVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRWRCUVVjc2IwSkJRVU1zU1VGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NSVUZCUXl4RFFVRkRMRWRCUVVFc1JVRkJSeXhEUVVGRExFMUJRVTBzUTBGQlFTeERRVUZITEVOQlFVRXNSMEZCUnl4SlFVRkpMRU5CUVVNN1NVRkRjRVlzU1VGQlNTeFBRVUZQTEV0QlFVc3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRKUVVNelFpeEpRVUZKTEZOQlFWTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUjBGQlJ5eHZRa0ZCUXl4SlFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExFbEJRVUVzUlVGQlNTeERRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhGUVVGRExFTkJRVU1zUjBGQlFTeEZRVUZITEVOQlFVTXNXVUZCV1N4RFFVRkJMRU5CUVVjc1EwRkJRU3hIUVVGSExFbEJRVWtzUTBGQlF6dEpRVU53Unl4SlFVRkpMRWxCUVVrc1VVRkJVU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NTVUZCU1N4dlFrRkJRU3hOUVVGTExFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRTFCUVU4c1EwRkJRU3hGUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCV1N4RFFVRkJMRWxCUVVrc1NVRkJTU3hEUVVGRE8wRkJReTlHTEVsQlFVa3NTVUZCU1N4TFFVRkxMRU5CUVVNN08wbEJSVllzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1JVRkJSVHROUVVOd1FpeFBRVUZQTEVkQlFVY3NRMEZCUXl4alFVRmpMRU5CUVVNc1EwRkJRenRCUVVOcVF5eExRVUZMT3p0SlFVVkVMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVWQlFVVTdUVUZEZUVJc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8wRkJRM3BETEV0QlFVczdPMGxCUlVRc1MwRkJTeXhIUVVGSE8wMUJRMDRzU1VGQlNTeFJRVUZSTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTVHROUVVNelFpeE5RVUZOTEUxQlFVMHNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTk8wMUJRemRDTEU5QlFVOHNTMEZCU3l4SlFVRkpMRU5CUVVNc1dVRkJXVHROUVVNM1FpeFRRVUZUTEVkQlFVY3NUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU03UVVGRGJrTXNTMEZCU3l4RFFVRkRPenRKUVVWR08wMUJRMFVzYjBKQlFVRXNSMEZCUlN4RlFVRkJMR2RDUVVGQkxFZEJRVUVzUTBGQlJTeEhRVUZITEV0QlFVOHNRMEZCUVN4RlFVRkJPMUZCUTFnc1NVRkJTU3hGUVVGRE8xRkJRMHdzU1VGQlNTeEZRVUZETzFGQlEwd3NVMEZCVlR0TlFVTlVMRU5CUVVFN1RVRkRTanRIUVVOSU8wVkJRMFFzV1VGQldTeEZRVUZGTEZWQlFWVXNRMEZCUXl4RlFVRkZPMGxCUTNwQ0xFTkJRVU1zUTBGQlF5eGpRVUZqTEVWQlFVVXNRMEZCUXp0QlFVTjJRaXhKUVVGSkxFTkJRVU1zUTBGQlF5eGxRVUZsTEVWQlFVVXNRMEZCUXpzN1NVRkZjRUlzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1IwRkROME03UVVGRFNDeERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEUxQlFVMHNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFLbHh1SUNvZ1FHcHplQ0JTWldGamRDNUVUMDFjYmlBcUwxeHVYRzUyWVhJZ1FuVjBkRzl1TzF4dWRtRnlJRkpsWVdOMElEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRbktUdGNiblpoY2lCSlkyOXVJQ0E5SUhKbGNYVnBjbVVvSnk0dmFXTnZiaTVxYzNnbktUdGNibHh1UW5WMGRHOXVJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dUlDQnRhWGhwYm5NNklGdFNaV0ZqZEM1aFpHUnZibk11VUhWeVpWSmxibVJsY2sxcGVHbHVYU3hjYmlBZ2NISnZjRlI1Y0dWek9pQjdYRzRnSUNBZ2FXTnZiam9nSUNBZ0lGSmxZV04wTGxCeWIzQlVlWEJsY3k1emRISnBibWNzWEc0Z0lDQWdiMjVEYkdsamF6b2dJRkpsWVdOMExsQnliM0JVZVhCbGN5NW1kVzVqTEZ4dUlDQWdJR2h5WldZNklDQWdJQ0JTWldGamRDNVFjbTl3Vkhsd1pYTXVjM1J5YVc1blhHNGdJSDBzWEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJwWTI5dUlDQWdJQ0FnUFNCMGFHbHpMbkJ5YjNCekxtbGpiMjRnUHlBOFNXTnZiaUIwZVhCbFBYdDBhR2x6TG5CeWIzQnpMbWxqYjI1OUlISmxaajFjSW1samIyNWNJaUF2UGlBNklHNTFiR3c3WEc0Z0lDQWdkbUZ5SUdOc1lYTnpaWE1nSUNBOUlGc25ZblYwZEc5dUoxMDdYRzRnSUNBZ2RtRnlJR0ZtZEdWeVNXTnZiaUE5SUhSb2FYTXVjSEp2Y0hNdVlXWjBaWEpKWTI5dUlEOGdQRWxqYjI0Z2RIbHdaVDE3ZEdocGN5NXdjbTl3Y3k1aFpuUmxja2xqYjI1OUlISmxaajFjSW1GbWRHVnlMV2xqYjI1Y0lpQXZQaUE2SUc1MWJHdzdYRzRnSUNBZ2RtRnlJSFJsZUhRZ0lDQWdJQ0E5SUhSb2FYTXVjSEp2Y0hNdWRHVjRkQ0EvSUNnOGMzQmhiaUJqYkdGemMwNWhiV1U5WENKMFpYaDBYQ0krZTNSb2FYTXVjSEp2Y0hNdWRHVjRkSDA4TDNOd1lXNCtLU0E2SUc1MWJHdzdYRzRnSUNBZ2RtRnlJSEJ5YjNCek8xeHVYRzRnSUNBZ2FXWWdLSFJvYVhNdWNISnZjSE11Wm1WaGRYZ3BJSHRjYmlBZ0lDQWdJR05zWVhOelpYTWdQU0JiSjJabFlYVjRMV0oxZEhSdmJpZGRPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2gwYUdsekxuQnliM0J6TG1Oc1lYTnpUbUZ0WlNrZ2UxeHVJQ0FnSUNBZ1kyeGhjM05sY3k1d2RYTm9LSFJvYVhNdWNISnZjSE11WTJ4aGMzTk9ZVzFsS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0J3Y205d2N5QTlJSHRjYmlBZ0lDQWdJR2h5WldZNklDQWdJQ0FnSUhSb2FYTXVjSEp2Y0hNdWFISmxaaXhjYmlBZ0lDQWdJR0ZqZEdsdmJqb2dJQ0FnSUhSb2FYTXVjSEp2Y0hNdVlXTjBhVzl1TEZ4dUlDQWdJQ0FnYjI1RGJHbGphem9nSUNBZ2RHaHBjeTVmYUdGdVpHeGxRMnhwWTJzc1hHNGdJQ0FnSUNCamJHRnpjMDVoYldVNklDQmpiR0Z6YzJWekxtcHZhVzRvSnlBbktWeHVJQ0FnSUgwN1hHNWNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEdFZ2V5NHVMbkJ5YjNCemZUNWNiaUFnSUNBZ0lDQWdlMmxqYjI1OVhHNGdJQ0FnSUNBZ0lIdDBaWGgwZlZ4dUlDQWdJQ0FnSUNCN1lXWjBaWEpKWTI5dWZWeHVJQ0FnSUNBZ1BDOWhQbHh1SUNBZ0lDazdYRzRnSUgwc1hHNGdJRjlvWVc1a2JHVkRiR2xqYXpvZ1puVnVZM1JwYjI0Z0tHVXBJSHRjYmlBZ0lDQmxMbkJ5WlhabGJuUkVaV1poZFd4MEtDazdYRzRnSUNBZ1pTNXpkRzl3VUhKdmNHRm5ZWFJwYjI0b0tUdGNibHh1SUNBZ0lIUm9hWE11Y0hKdmNITXViMjVEYkdsamF5QW1KaUIwYUdsekxuQnliM0J6TG05dVEyeHBZMnNvWlNrN1hHNGdJSDFjYm4wcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRUoxZEhSdmJqdGNiaUpkZlE9PSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgSWNvbjtcbnZhciBfICAgICA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBpY29uLCBjdXJyZW50bHkgdXNpbmcgdGhlIGZvbnQgYXdlc29tZSBpY29uIGxpYnJhcnlcbiAqXG4gKiBAZXhhbXBsZXNcbiAqIDxJY29uIHR5cGU9XCJjaGVja1wiIC8+XG4gKiA8SWNvbiB0eXBlPVwidXNlclwiIGNsYXNzTmFtZT1cIm11dGVkXCIgLz5cbiAqIDxJY29uIHR5cGU9XCJiYW5cIiBzdGFjaz1cIjJ4XCIgLz5cbiAqL1xuSWNvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJJY29uXCIsXG4gIHByb3BUeXBlczoge1xuICAgIHN0YWNrOiAgICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgdHlwZTogICAgICAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZTogIFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgfSxcbiAgbWl4aW5zOiBbUmVhY3QuYWRkb25zLlB1cmVSZW5kZXJNaXhpbl0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjbGFzc2VzID0gWydmYSBmYS1pY29uJ107XG4gICAgdmFyIHByb3BzICAgPSBfLm9taXQodGhpcy5wcm9wcywgWydzdGFjaycsICd0eXBlJywgJ2NsYXNzTmFtZSddKTtcblxuICAgIGlmICh0aGlzLnByb3BzLnN0YWNrKSB7XG4gICAgICBjbGFzc2VzLnB1c2goJ2ZhLXN0YWNrLScgKyB0aGlzLnByb3BzLnN0YWNrKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5zcGluKSB7XG4gICAgICBjbGFzc2VzLnB1c2goJ2ZhLXNwaW4nKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy50eXBlKSB7XG4gICAgICBjbGFzc2VzLnB1c2goJ2ZhLScgKyB0aGlzLnByb3BzLnR5cGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmNsYXNzTmFtZSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKHRoaXMucHJvcHMuY2xhc3NOYW1lKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnNpemUpIHtcbiAgICAgIGNsYXNzZXMucHVzaCgnZmEtJyArIHRoaXMucHJvcHMuc2l6ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgcHJvcHMsIHtjbGFzc05hbWU6IGNsYXNzZXMuam9pbignICcpfSkpXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSWNvbjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyTnZiWEJ2Ym1WdWRITXZhV052Ymk1cWMzZ2lYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3TzBGQlJVRXNSMEZCUnpzN1FVRkZTQ3hKUVVGSkxFbEJRVWtzUTBGQlF6dEJRVU5VTEVsQlFVa3NRMEZCUXl4UFFVRlBMRTlCUVU4c1EwRkJReXhaUVVGWkxFTkJRVU1zUTBGQlF6dEJRVU5zUXl4SlFVRkpMRXRCUVVzc1IwRkJSeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdPMEZCUlRkQ08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1IwRkZSenRCUVVOSUxEQkNRVUV3UWl4dlFrRkJRVHRGUVVONFFpeFRRVUZUTEVWQlFVVTdTVUZEVkN4TFFVRkxMRTlCUVU4c1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTzBsQlEyeERMRWxCUVVrc1VVRkJVU3hMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEUxQlFVMHNRMEZCUXl4VlFVRlZPMGxCUXpkRExGTkJRVk1zUjBGQlJ5eExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwN1IwRkRia003UlVGRFJDeE5RVUZOTEVWQlFVVXNRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExHVkJRV1VzUTBGQlF6dEZRVU4wUXl4TlFVRk5MRVZCUVVVc1dVRkJXVHRKUVVOc1FpeEpRVUZKTEU5QlFVOHNSMEZCUnl4RFFVRkRMRmxCUVZrc1EwRkJReXhEUVVGRE8wRkJRMnBETEVsQlFVa3NTVUZCU1N4TFFVRkxMRXRCUVVzc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVNc1QwRkJUeXhGUVVGRkxFMUJRVTBzUlVGQlJTeFhRVUZYTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRKUVVWcVJTeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhGUVVGRk8wMUJRM0JDTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1YwRkJWeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1FVRkRia1FzUzBGQlN6czdTVUZGUkN4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeEZRVUZGTzAxQlEyNUNMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdRVUZET1VJc1MwRkJTenM3U1VGRlJDeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hGUVVGRk8wMUJRMjVDTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkROVU1zUzBGQlN6czdTVUZGUkN4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVTBGQlV5eEZRVUZGTzAxQlEzaENMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNN1FVRkRlRU1zUzBGQlN6czdTVUZGUkN4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeEZRVUZGTzAxQlEyNUNMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRE5VTXNTMEZCU3pzN1NVRkZSRHROUVVORkxHOUNRVUZCTEVkQlFVVXNSVUZCUVN4blFrRkJRU3hIUVVGQkxFTkJRVVVzUjBGQlJ5eExRVUZMTEVWQlFVTXNRMEZCUXl4RFFVRkJMRk5CUVVFc1JVRkJVeXhEUVVGRkxFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkhMRU5CUVVFc1EwRkJTU3hEUVVGQk8wMUJRMmhFTzBkQlEwZzdRVUZEU0N4RFFVRkRMRU5CUVVNc1EwRkJRenM3UVVGRlNDeE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMRWxCUVVrc1EwRkJReUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4cUtseHVJQ29nUUdwemVDQlNaV0ZqZEM1RVQwMWNiaUFxTDF4dVhHNTJZWElnU1dOdmJqdGNiblpoY2lCZklDQWdJQ0E5SUhKbGNYVnBjbVVvSjNWdVpHVnljMk52Y21VbktUdGNiblpoY2lCU1pXRmpkQ0E5SUhKbGNYVnBjbVVvSjNKbFlXTjBKeWs3WEc1Y2JpOHFLbHh1SUNvZ1EzSmxZWFJsY3lCaGJpQnBZMjl1TENCamRYSnlaVzUwYkhrZ2RYTnBibWNnZEdobElHWnZiblFnWVhkbGMyOXRaU0JwWTI5dUlHeHBZbkpoY25sY2JpQXFYRzRnS2lCQVpYaGhiWEJzWlhOY2JpQXFJRHhKWTI5dUlIUjVjR1U5WENKamFHVmphMXdpSUM4K1hHNGdLaUE4U1dOdmJpQjBlWEJsUFZ3aWRYTmxjbHdpSUdOc1lYTnpUbUZ0WlQxY0ltMTFkR1ZrWENJZ0x6NWNiaUFxSUR4SlkyOXVJSFI1Y0dVOVhDSmlZVzVjSWlCemRHRmphejFjSWpKNFhDSWdMejVjYmlBcUwxeHVTV052YmlBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNiaUFnY0hKdmNGUjVjR1Z6T2lCN1hHNGdJQ0FnYzNSaFkyczZJQ0FnSUNBZ1VtVmhZM1F1VUhKdmNGUjVjR1Z6TG5OMGNtbHVaeXhjYmlBZ0lDQjBlWEJsT2lBZ0lDQWdJQ0JTWldGamRDNVFjbTl3Vkhsd1pYTXVjM1J5YVc1bkxtbHpVbVZ4ZFdseVpXUXNYRzRnSUNBZ1kyeGhjM05PWVcxbE9pQWdVbVZoWTNRdVVISnZjRlI1Y0dWekxuTjBjbWx1WjF4dUlDQjlMRnh1SUNCdGFYaHBibk02SUZ0U1pXRmpkQzVoWkdSdmJuTXVVSFZ5WlZKbGJtUmxjazFwZUdsdVhTeGNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZG1GeUlHTnNZWE56WlhNZ1BTQmJKMlpoSUdaaExXbGpiMjRuWFR0Y2JpQWdJQ0IyWVhJZ2NISnZjSE1nSUNBOUlGOHViMjFwZENoMGFHbHpMbkJ5YjNCekxDQmJKM04wWVdOckp5d2dKM1I1Y0dVbkxDQW5ZMnhoYzNOT1lXMWxKMTBwTzF4dVhHNGdJQ0FnYVdZZ0tIUm9hWE11Y0hKdmNITXVjM1JoWTJzcElIdGNiaUFnSUNBZ0lHTnNZWE56WlhNdWNIVnphQ2duWm1FdGMzUmhZMnN0SnlBcklIUm9hWE11Y0hKdmNITXVjM1JoWTJzcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdsbUlDaDBhR2x6TG5CeWIzQnpMbk53YVc0cElIdGNiaUFnSUNBZ0lHTnNZWE56WlhNdWNIVnphQ2duWm1FdGMzQnBiaWNwTzF4dUlDQWdJSDFjYmx4dUlDQWdJR2xtSUNoMGFHbHpMbkJ5YjNCekxuUjVjR1VwSUh0Y2JpQWdJQ0FnSUdOc1lYTnpaWE11Y0hWemFDZ25abUV0SnlBcklIUm9hWE11Y0hKdmNITXVkSGx3WlNrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tIUm9hWE11Y0hKdmNITXVZMnhoYzNOT1lXMWxLU0I3WEc0Z0lDQWdJQ0JqYkdGemMyVnpMbkIxYzJnb2RHaHBjeTV3Y205d2N5NWpiR0Z6YzA1aGJXVXBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLSFJvYVhNdWNISnZjSE11YzJsNlpTa2dlMXh1SUNBZ0lDQWdZMnhoYzNObGN5NXdkWE5vS0NkbVlTMG5JQ3NnZEdocGN5NXdjbTl3Y3k1emFYcGxLVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BHa2dleTR1TG5CeWIzQnpmU0JqYkdGemMwNWhiV1U5ZTJOc1lYTnpaWE11YW05cGJpZ25JQ2NwZlQ0OEwyaytYRzRnSUNBZ0tUdGNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnU1dOdmJqdGNiaUpkZlE9PSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgU29ydEluZGljYXRvcjtcbnZhciBjbGFzc19tYXA7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEljb24gPSByZXF1aXJlKCcuL2ljb24uanN4Jyk7XG5cbmNsYXNzX21hcCA9IHtcbiAgYXNjOiAgJ3NvcnQtdXAnLFxuICBkZXNjOiAnc29ydC1kb3duJ1xufTtcblxuU29ydEluZGljYXRvciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJTb3J0SW5kaWNhdG9yXCIsXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBpY29uICAgICAgPSBudWxsO1xuICAgIHZhciBkaXJlY3Rpb24gPSBjbGFzc19tYXBbdGhpcy5wcm9wcy5kaXJlY3Rpb25dO1xuXG4gICAgaWYgKGRpcmVjdGlvbikge1xuICAgICAgaWNvbiA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IGRpcmVjdGlvbiwgc3RhY2s6IFwiMXhcIn0pO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcImZhLXN0YWNrIHNvcnRlclwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IFwic29ydFwiLCBzdGFjazogXCIxeFwifSksIFxuICAgICAgICBpY29uXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU29ydEluZGljYXRvcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyTnZiWEJ2Ym1WdWRITXZjMjl5ZEY5cGJtUnBZMkYwYjNJdWFuTjRJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCT3p0QlFVVkJMRWRCUVVjN08wRkJSVWdzU1VGQlNTeGhRVUZoTEVOQlFVTTdRVUZEYkVJc1NVRkJTU3hUUVVGVExFTkJRVU03UVVGRFpDeEpRVUZKTEV0QlFVc3NSMEZCUnl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRE4wSXNTVUZCU1N4SlFVRkpMRWRCUVVjc1QwRkJUeXhEUVVGRExGbEJRVmtzUTBGQlF5eERRVUZET3p0QlFVVnFReXhUUVVGVExFZEJRVWM3UlVGRFZpeEhRVUZITEVkQlFVY3NVMEZCVXp0RlFVTm1MRWxCUVVrc1JVRkJSU3hYUVVGWE8wRkJRMjVDTEVOQlFVTXNRMEZCUXpzN1FVRkZSaXh0UTBGQmJVTXNOa0pCUVVFN1JVRkRha01zVFVGQlRTeEZRVUZGTEZsQlFWazdTVUZEYkVJc1NVRkJTU3hKUVVGSkxGRkJRVkVzU1VGQlNTeERRVUZETzBGQlEzcENMRWxCUVVrc1NVRkJTU3hUUVVGVExFZEJRVWNzVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03TzBsQlJXaEVMRWxCUVVrc1UwRkJVeXhGUVVGRk8wMUJRMklzU1VGQlNTeEhRVUZITEc5Q1FVRkRMRWxCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zU1VGQlFTeEZRVUZKTEVOQlFVVXNVMEZCVXl4RlFVRkRMRU5CUVVNc1MwRkJRU3hGUVVGTExFTkJRVU1zU1VGQlNTeERRVUZCTEVOQlFVY3NRMEZCUVN4RFFVRkRPMEZCUTJ4RUxFdEJRVXM3TzBsQlJVUTdUVUZEUlN4dlFrRkJRU3hOUVVGTExFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMR2xDUVVGclFpeERRVUZCTEVWQlFVRTdVVUZEYUVNc2IwSkJRVU1zU1VGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJReXhOUVVGQkxFVkJRVTBzUTBGQlF5eExRVUZCTEVWQlFVc3NRMEZCUXl4SlFVRkpMRU5CUVVFc1EwRkJSeXhEUVVGQkxFVkJRVUU3VVVGRE9VSXNTVUZCU3p0TlFVTkVMRU5CUVVFN1RVRkRVRHRIUVVOSU8wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eGhRVUZoTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRk52Y25SSmJtUnBZMkYwYjNJN1hHNTJZWElnWTJ4aGMzTmZiV0Z3TzF4dWRtRnlJRkpsWVdOMElEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRbktUdGNiblpoY2lCSlkyOXVJRDBnY21WeGRXbHlaU2duTGk5cFkyOXVMbXB6ZUNjcE8xeHVYRzVqYkdGemMxOXRZWEFnUFNCN1hHNGdJR0Z6WXpvZ0lDZHpiM0owTFhWd0p5eGNiaUFnWkdWell6b2dKM052Y25RdFpHOTNiaWRjYm4wN1hHNWNibE52Y25SSmJtUnBZMkYwYjNJZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQnBZMjl1SUNBZ0lDQWdQU0J1ZFd4c08xeHVJQ0FnSUhaaGNpQmthWEpsWTNScGIyNGdQU0JqYkdGemMxOXRZWEJiZEdocGN5NXdjbTl3Y3k1a2FYSmxZM1JwYjI1ZE8xeHVYRzRnSUNBZ2FXWWdLR1JwY21WamRHbHZiaWtnZTF4dUlDQWdJQ0FnYVdOdmJpQTlJRHhKWTI5dUlIUjVjR1U5ZTJScGNtVmpkR2x2Ym4wZ2MzUmhZMnM5WENJeGVGd2lJQzgrTzF4dUlDQWdJSDFjYmx4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThjM0JoYmlCamJHRnpjMDVoYldVOVhDSm1ZUzF6ZEdGamF5QnpiM0owWlhKY0lqNWNiaUFnSUNBZ0lDQWdQRWxqYjI0Z2RIbHdaVDFjSW5OdmNuUmNJaUJ6ZEdGamF6MWNJakY0WENJZ0x6NWNiaUFnSUNBZ0lDQWdlMmxqYjI1OVhHNGdJQ0FnSUNBOEwzTndZVzQrWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1UyOXlkRWx1WkdsallYUnZjanRjYmlKZGZRPT0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFRhYnM7XG52YXIgUmVhY3QgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgQnV0dG9uICA9IHJlcXVpcmUoJy4vYnV0dG9uLmpzeCcpO1xuXG5UYWJzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRhYnNcIixcbiAgcHJvcFR5cGVzOiB7XG4gICAgYWN0aW9uOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICB0YWJzOiAgIFJlYWN0LlByb3BUeXBlcy5hcnJheVxuICB9LFxuICBtaXhpbnM6IFtSZWFjdC5hZGRvbnMuUHVyZVJlbmRlck1peGluXSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCB7Y2xhc3NOYW1lOiBcInRhYnNcIn0sIFxuICAgICAgICB0aGlzLl9idWlsZFRhYnMoKVxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIF9idWlsZFRhYnM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy50YWJzLm1hcChmdW5jdGlvbiAodGFiLCBpbmRleCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtrZXk6IGluZGV4fSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHtvbkNsaWNrOiB0YWIuYWN0aW9uLCBpY29uOiB0YWIuaWNvbiwgdGV4dDogdGFiLnRleHR9KVxuICAgICAgICApXG4gICAgICApO1xuICAgIH0sIHRoaXMpO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUYWJzO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDJOdmJYQnZibVZ1ZEhNdmRHRmljeTVxYzNnaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRTdPMEZCUlVFc1IwRkJSenM3UVVGRlNDeEpRVUZKTEVsQlFVa3NRMEZCUXp0QlFVTlVMRWxCUVVrc1MwRkJTeXhMUVVGTExFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0QlFVTXZRaXhKUVVGSkxFMUJRVTBzU1VGQlNTeFBRVUZQTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNN08wRkJSWFJETERCQ1FVRXdRaXh2UWtGQlFUdEZRVU40UWl4VFFVRlRMRVZCUVVVN1NVRkRWQ3hOUVVGTkxFVkJRVVVzUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4SlFVRkpPMGxCUXpWQ0xFbEJRVWtzU1VGQlNTeExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRXRCUVVzN1IwRkRPVUk3UlVGRFJDeE5RVUZOTEVWQlFVVXNRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExHVkJRV1VzUTBGQlF6dEZRVU4wUXl4TlFVRk5MRVZCUVVVc1dVRkJXVHRKUVVOc1FqdE5RVU5GTEc5Q1FVRkJMRWxCUVVjc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNUVUZCVHl4RFFVRkJMRVZCUVVFN1VVRkRiRUlzU1VGQlNTeERRVUZETEZWQlFWVXNSVUZCUnp0TlFVTm9RaXhEUVVGQk8wMUJRMHc3UjBGRFNEdEZRVU5FTEZWQlFWVXNSVUZCUlN4WlFVRlpPMGxCUTNSQ0xFOUJRVThzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVlVzUjBGQlJ5eEZRVUZGTEV0QlFVc3NSVUZCUlR0TlFVTXZRenRSUVVORkxHOUNRVUZCTEVsQlFVY3NSVUZCUVN4RFFVRkJMRU5CUVVNc1IwRkJRU3hGUVVGSExFTkJRVVVzUzBGQlR5eERRVUZCTEVWQlFVRTdWVUZEWkN4dlFrRkJReXhOUVVGTkxFVkJRVUVzUTBGQlFTeERRVUZETEU5QlFVRXNSVUZCVHl4RFFVRkZMRWRCUVVjc1EwRkJReXhOUVVGTkxFVkJRVU1zUTBGQlF5eEpRVUZCTEVWQlFVa3NRMEZCUlN4SFFVRkhMRU5CUVVNc1NVRkJTU3hGUVVGRExFTkJRVU1zU1VGQlFTeEZRVUZKTEVOQlFVVXNSMEZCUnl4RFFVRkRMRWxCUVVzc1EwRkJRU3hEUVVGSExFTkJRVUU3VVVGRE5VUXNRMEZCUVR0UlFVTk1PMHRCUTBnc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dEhRVU5XTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlFQnFjM2dnVW1WaFkzUXVSRTlOWEc0Z0tpOWNibHh1ZG1GeUlGUmhZbk03WEc1MllYSWdVbVZoWTNRZ0lDQTlJSEpsY1hWcGNtVW9KM0psWVdOMEp5azdYRzUyWVhJZ1FuVjBkRzl1SUNBOUlISmxjWFZwY21Vb0p5NHZZblYwZEc5dUxtcHplQ2NwTzF4dVhHNVVZV0p6SUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVJQ0J3Y205d1ZIbHdaWE02SUh0Y2JpQWdJQ0JoWTNScGIyNDZJRkpsWVdOMExsQnliM0JVZVhCbGN5NW1kVzVqTEZ4dUlDQWdJSFJoWW5NNklDQWdVbVZoWTNRdVVISnZjRlI1Y0dWekxtRnljbUY1WEc0Z0lIMHNYRzRnSUcxcGVHbHVjem9nVzFKbFlXTjBMbUZrWkc5dWN5NVFkWEpsVW1WdVpHVnlUV2w0YVc1ZExGeHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQSFZzSUdOc1lYTnpUbUZ0WlQxY0luUmhZbk5jSWo1Y2JpQWdJQ0FnSUNBZ2UzUm9hWE11WDJKMWFXeGtWR0ZpY3lncGZWeHVJQ0FnSUNBZ1BDOTFiRDVjYmlBZ0lDQXBPMXh1SUNCOUxGeHVJQ0JmWW5WcGJHUlVZV0p6T2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVjSEp2Y0hNdWRHRmljeTV0WVhBb1puVnVZM1JwYjI0Z0tIUmhZaXdnYVc1a1pYZ3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQWdJRHhzYVNCclpYazllMmx1WkdWNGZUNWNiaUFnSUNBZ0lDQWdJQ0E4UW5WMGRHOXVJRzl1UTJ4cFkyczllM1JoWWk1aFkzUnBiMjU5SUdsamIyNDllM1JoWWk1cFkyOXVmU0IwWlhoMFBYdDBZV0l1ZEdWNGRIMGdMejVjYmlBZ0lDQWdJQ0FnUEM5c2FUNWNiaUFnSUNBZ0lDazdYRzRnSUNBZ2ZTd2dkR2hwY3lrN1hHNGdJSDFjYm4wcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRlJoWW5NN1hHNGlYWDA9IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBUZDtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cblRkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRkXCIsXG4gIG1peGluczogW1JlYWN0LmFkZG9ucy5QdXJlUmVuZGVyTWl4aW5dLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgUmVhY3QuX19zcHJlYWQoe30sICB0aGlzLnByb3BzKSwgXG4gICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW5cbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyTnZiWEJ2Ym1WdWRITXZkR1F1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPenRCUVVWQkxFZEJRVWM3TzBGQlJVZ3NTVUZCU1N4RlFVRkZMRU5CUVVNN1FVRkRVQ3hKUVVGSkxFdEJRVXNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN08wRkJSVGRDTEhkQ1FVRjNRaXhyUWtGQlFUdEZRVU4wUWl4TlFVRk5MRVZCUVVVc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETEdWQlFXVXNRMEZCUXp0QlFVTjRReXhGUVVGRkxFMUJRVTBzUlVGQlJTeFpRVUZaT3p0SlFVVnNRanROUVVORkxHOUNRVUZCTEVsQlFVY3NSVUZCUVN4blFrRkJRU3hIUVVGQkxFTkJRVVVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCVHl4RFFVRkJMRVZCUVVFN1VVRkRha0lzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UlFVRlRPMDFCUTJ4Q0xFTkJRVUU3VFVGRFREdEhRVU5JTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4RlFVRkZMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlFQnFjM2dnVW1WaFkzUXVSRTlOWEc0Z0tpOWNibHh1ZG1GeUlGUmtPMXh1ZG1GeUlGSmxZV04wSUQwZ2NtVnhkV2x5WlNnbmNtVmhZM1FuS1R0Y2JseHVWR1FnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJRzFwZUdsdWN6b2dXMUpsWVdOMExtRmtaRzl1Y3k1UWRYSmxVbVZ1WkdWeVRXbDRhVzVkTEZ4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUlDZ3BJSHRjYmx4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThkR1FnZXk0dUxuUm9hWE11Y0hKdmNITjlQbHh1SUNBZ0lDQWdJQ0I3ZEdocGN5NXdjbTl3Y3k1amFHbHNaSEpsYm4xY2JpQWdJQ0FnSUR3dmRHUStYRzRnSUNBZ0tUdGNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVkdRN1hHNGlYWDA9IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBUaDtcbnZhciBSZWFjdCAgICAgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEJhY2tib25lICAgICAgICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgU29ydEluZGljYXRvciAgID0gcmVxdWlyZSgnLi9zb3J0X2luZGljYXRvci5qc3gnKTtcblxuVGggPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGhcIixcbiAgcHJvcFR5cGVzOiB7XG4gICAgdHJpZ2dlclNvcnQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNsYXNzZXMgPSBbdGhpcy5wcm9wcy5jbGFzc05hbWUgfHwgJyddO1xuICAgIHZhciBzb3J0X2luZGljYXRvciA9IG51bGw7XG4gICAgdmFyIG5ld19wcm9wcyA9IHtzdHlsZTp7fX07XG5cbiAgICBpZiAodGhpcy5wcm9wcy50cmlnZ2VyU29ydCB8fCB0aGlzLnByb3BzLnNvcnREaXJlY3Rpb24pIHtcbiAgICAgIGNsYXNzZXMucHVzaCgnc29ydGFibGUnKTtcblxuICAgICAgc29ydF9pbmRpY2F0b3IgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFNvcnRJbmRpY2F0b3IsIHtkaXJlY3Rpb246IHRoaXMucHJvcHMuc29ydERpcmVjdGlvbn0pXG4gICAgfVxuXG4gICAgWydtaW5pbWFsJywgJ2xvY2tlZCcsICdyZXNpemFibGUnXS5mb3JFYWNoKGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzW3ZhbF0pIHtcbiAgICAgICAgY2xhc3Nlcy5wdXNoKHZhbCk7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy53aWR0aCkge1xuICAgICAgbmV3X3Byb3BzLnN0eWxlLndpZHRoID0gdGhpcy5wcm9wcy53aWR0aDtcbiAgICB9XG5cbiAgICBuZXdfcHJvcHMuY2xhc3NOYW1lID0gY2xhc3Nlcy5sZW5ndGggPiAxID8gY2xhc3Nlcy5qb2luKCcgJykgOiBjbGFzc2VzWzBdO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBSZWFjdC5fX3NwcmVhZCh7fSwgIG5ld19wcm9wcywge29uQ2xpY2s6IHRoaXMuX2hhbmRsZUNsaWNrfSksIFxuICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuLCBcbiAgICAgICAgc29ydF9pbmRpY2F0b3JcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBfaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuaGFuZGxlQ2xpY2spIHtcbiAgICAgIHRoaXMucHJvcHMuaGFuZGxlQ2xpY2soZSk7XG4gICAgfVxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyTnZiWEJ2Ym1WdWRITXZkR2d1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPenRCUVVWQkxFZEJRVWM3TzBGQlJVZ3NTVUZCU1N4RlFVRkZMRU5CUVVNN1FVRkRVQ3hKUVVGSkxFdEJRVXNzWVVGQllTeFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1FVRkRka01zU1VGQlNTeFJRVUZSTEZWQlFWVXNUMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRE8wRkJRekZETEVsQlFVa3NZVUZCWVN4TFFVRkxMRTlCUVU4c1EwRkJReXh6UWtGQmMwSXNRMEZCUXl4RFFVRkRPenRCUVVWMFJDeDNRa0ZCZDBJc2EwSkJRVUU3UlVGRGRFSXNVMEZCVXl4RlFVRkZPMGxCUTFRc1YwRkJWeXhGUVVGRkxFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNUVUZCVFR0SFFVTndRenRGUVVORUxFMUJRVTBzUlVGQlJTeFpRVUZaTzBsQlEyeENMRWxCUVVrc1QwRkJUeXhIUVVGSExFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4VFFVRlRMRWxCUVVrc1JVRkJSU3hEUVVGRExFTkJRVU03U1VGRE0wTXNTVUZCU1N4alFVRmpMRWRCUVVjc1NVRkJTU3hEUVVGRE8wRkJRemxDTEVsQlFVa3NTVUZCU1N4VFFVRlRMRWRCUVVjc1EwRkJReXhMUVVGTExFTkJRVU1zUlVGQlJTeERRVUZETEVOQlFVTTdPMGxCUlROQ0xFbEJRVWtzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4WFFVRlhMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eGhRVUZoTEVWQlFVVTdRVUZETlVRc1RVRkJUU3hQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPenROUVVWNlFpeGpRVUZqTEVkQlFVY3NiMEpCUVVNc1lVRkJZU3hGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExHRkJRV01zUTBGQlFTeERRVUZITEVOQlFVRTdRVUZETjBVc1MwRkJTenM3U1VGRlJDeERRVUZETEZOQlFWTXNSVUZCUlN4UlFVRlJMRVZCUVVVc1YwRkJWeXhEUVVGRExFTkJRVU1zVDBGQlR5eERRVUZETEZWQlFWVXNSMEZCUnl4RlFVRkZPMDFCUTNoRUxFbEJRVWtzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSVHRSUVVOdVFpeFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE8wOUJRMjVDTzBGQlExQXNTMEZCU3l4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE96dEpRVVZVTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFVkJRVVU3VFVGRGNFSXNVMEZCVXl4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNN1FVRkRMME1zUzBGQlN6czdRVUZGVEN4SlFVRkpMRk5CUVZNc1EwRkJReXhUUVVGVExFZEJRVWNzVDBGQlR5eERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRWRCUVVjc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNSMEZCUnl4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03TzBsQlJURkZPMDFCUTBVc2IwSkJRVUVzU1VGQlJ5eEZRVUZCTEdkQ1FVRkJMRWRCUVVFc1EwRkJSU3hIUVVGSExGTkJRVk1zUlVGQlF5eERRVUZETEVOQlFVRXNUMEZCUVN4RlFVRlBMRU5CUVVVc1NVRkJTU3hEUVVGRExGbEJRV01zUTBGQlFTeERRVUZCTEVWQlFVRTdVVUZETlVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFJRVUZSTEVWQlFVTTdVVUZEY0VJc1kwRkJaVHROUVVOaUxFTkJRVUU3VFVGRFREdEhRVU5JTzBWQlEwUXNXVUZCV1N4RlFVRkZMRlZCUVZVc1EwRkJReXhGUVVGRk8wbEJRM3BDTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhYUVVGWExFVkJRVVU3VFVGRE1VSXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdTMEZETTBJN1IwRkRSanRCUVVOSUxFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVklMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzUlVGQlJTeERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5b3FYRzRnS2lCQWFuTjRJRkpsWVdOMExrUlBUVnh1SUNvdlhHNWNiblpoY2lCVWFEdGNiblpoY2lCU1pXRmpkQ0FnSUNBZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQ2NwTzF4dWRtRnlJRUpoWTJ0aWIyNWxJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KMkpoWTJ0aWIyNWxKeWs3WEc1MllYSWdVMjl5ZEVsdVpHbGpZWFJ2Y2lBZ0lEMGdjbVZ4ZFdseVpTZ25MaTl6YjNKMFgybHVaR2xqWVhSdmNpNXFjM2duS1R0Y2JseHVWR2dnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJSEJ5YjNCVWVYQmxjem9nZTF4dUlDQWdJSFJ5YVdkblpYSlRiM0owT2lCU1pXRmpkQzVRY205d1ZIbHdaWE11YzNSeWFXNW5YRzRnSUgwc1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCamJHRnpjMlZ6SUQwZ1czUm9hWE11Y0hKdmNITXVZMnhoYzNOT1lXMWxJSHg4SUNjblhUdGNiaUFnSUNCMllYSWdjMjl5ZEY5cGJtUnBZMkYwYjNJZ1BTQnVkV3hzTzF4dUlDQWdJSFpoY2lCdVpYZGZjSEp2Y0hNZ1BTQjdjM1I1YkdVNmUzMTlPMXh1WEc0Z0lDQWdhV1lnS0hSb2FYTXVjSEp2Y0hNdWRISnBaMmRsY2xOdmNuUWdmSHdnZEdocGN5NXdjbTl3Y3k1emIzSjBSR2x5WldOMGFXOXVLU0I3WEc0Z0lDQWdJQ0JqYkdGemMyVnpMbkIxYzJnb0ozTnZjblJoWW14bEp5azdYRzVjYmlBZ0lDQWdJSE52Y25SZmFXNWthV05oZEc5eUlEMGdQRk52Y25SSmJtUnBZMkYwYjNJZ1pHbHlaV04wYVc5dVBYdDBhR2x6TG5CeWIzQnpMbk52Y25SRWFYSmxZM1JwYjI1OUlDOCtYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1d5ZHRhVzVwYldGc0p5d2dKMnh2WTJ0bFpDY3NJQ2R5WlhOcGVtRmliR1VuWFM1bWIzSkZZV05vS0daMWJtTjBhVzl1SUNoMllXd3BJSHRjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbkJ5YjNCelczWmhiRjBwSUh0Y2JpQWdJQ0FnSUNBZ1kyeGhjM05sY3k1d2RYTm9LSFpoYkNrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlN3Z2RHaHBjeWs3WEc1Y2JpQWdJQ0JwWmlBb2RHaHBjeTV3Y205d2N5NTNhV1IwYUNrZ2UxeHVJQ0FnSUNBZ2JtVjNYM0J5YjNCekxuTjBlV3hsTG5kcFpIUm9JRDBnZEdocGN5NXdjbTl3Y3k1M2FXUjBhRHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnVaWGRmY0hKdmNITXVZMnhoYzNOT1lXMWxJRDBnWTJ4aGMzTmxjeTVzWlc1bmRHZ2dQaUF4SUQ4Z1kyeGhjM05sY3k1cWIybHVLQ2NnSnlrZ09pQmpiR0Z6YzJWeld6QmRPMXh1WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeDBhQ0I3TGk0dWJtVjNYM0J5YjNCemZTQnZia05zYVdOclBYdDBhR2x6TGw5b1lXNWtiR1ZEYkdsamEzMCtYRzRnSUNBZ0lDQWdJSHQwYUdsekxuQnliM0J6TG1Ob2FXeGtjbVZ1ZlZ4dUlDQWdJQ0FnSUNCN2MyOXlkRjlwYm1ScFkyRjBiM0o5WEc0Z0lDQWdJQ0E4TDNSb1BseHVJQ0FnSUNrN1hHNGdJSDBzWEc0Z0lGOW9ZVzVrYkdWRGJHbGphem9nWm5WdVkzUnBiMjRnS0dVcElIdGNiaUFnSUNCcFppQW9kR2hwY3k1d2NtOXdjeTVvWVc1a2JHVkRiR2xqYXlrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTV3Y205d2N5NW9ZVzVrYkdWRGJHbGpheWhsS1R0Y2JpQWdJQ0I5WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlGUm9PMXh1SWwxOSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgVHI7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG5UciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUclwiLFxuICBtaXhpbnM6IFtSZWFjdC5hZGRvbnMuUHVyZVJlbmRlck1peGluXSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBSZWFjdC5fX3NwcmVhZCh7fSwgIHRoaXMucHJvcHMpLCBcbiAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlblxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDJOdmJYQnZibVZ1ZEhNdmRISXVhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRVVZCTEVkQlFVYzdPMEZCUlVnc1NVRkJTU3hGUVVGRkxFTkJRVU03UVVGRFVDeEpRVUZKTEV0QlFVc3NSMEZCUnl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03TzBGQlJUZENMSGRDUVVGM1FpeHJRa0ZCUVR0RlFVTjBRaXhOUVVGTkxFVkJRVVVzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4RFFVRkRMR1ZCUVdVc1EwRkJRenRGUVVOMFF5eE5RVUZOTEVWQlFVVXNXVUZCV1R0SlFVTnNRanROUVVORkxHOUNRVUZCTEVsQlFVY3NSVUZCUVN4blFrRkJRU3hIUVVGQkxFTkJRVVVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCVHl4RFFVRkJMRVZCUVVFN1VVRkRha0lzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UlFVRlRPMDFCUTJ4Q0xFTkJRVUU3VFVGRFREdEhRVU5JTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4RlFVRkZMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlFQnFjM2dnVW1WaFkzUXVSRTlOWEc0Z0tpOWNibHh1ZG1GeUlGUnlPMXh1ZG1GeUlGSmxZV04wSUQwZ2NtVnhkV2x5WlNnbmNtVmhZM1FuS1R0Y2JseHVWSElnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJRzFwZUdsdWN6b2dXMUpsWVdOMExtRmtaRzl1Y3k1UWRYSmxVbVZ1WkdWeVRXbDRhVzVkTEZ4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BIUnlJSHN1TGk1MGFHbHpMbkJ5YjNCemZUNWNiaUFnSUNBZ0lDQWdlM1JvYVhNdWNISnZjSE11WTJocGJHUnlaVzU5WEc0Z0lDQWdJQ0E4TDNSeVBseHVJQ0FnSUNrN1hHNGdJSDFjYm4wcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRlJ5TzF4dUlsMTkiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIERBVEVfRk9STUFUOiAnTU1NIEQsIFlZWVkgaDptbTpzcyBhJ1xufTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyTnZibk4wWVc1MGN5NXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4WlFVRlpMRU5CUVVNN08wRkJSV0lzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnp0RlFVTm1MRmRCUVZjc1JVRkJSU3gxUWtGQmRVSTdRMEZEY2tNc1EwRkJReUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWx3aWRYTmxJSE4wY21samRGd2lPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUh0Y2JpQWdSRUZVUlY5R1QxSk5RVlE2SUNkTlRVMGdSQ3dnV1ZsWldTQm9PbTF0T25OeklHRW5YRzU5TzF4dUlsMTkiLCJ2YXIgYWNrX3N0YXRlcyA9IFt0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXTtcbnZhciBjbHJfc3RhdGVzID0gW3RydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXTtcbnZhciBjcml0aWNhbHMgID0gW3RydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2VdO1xudmFyIGNvZGVzICAgICAgPSBbJ0MyMDgwJywgJ0FGOTcnLCAnRG93biddO1xudmFyIG1lc3NhZ2VzICAgPSBbJ0NvbW11bmljYXRpb24gZmFpbHVyZScsICd1bmRlcmxvYWQgZmF1bHQnLCAnZ3JvdW5kIGZhdWx0JywgJ21vdG9yIG92ZXJsb2FkJ107XG52YXIgd2VsbHMgICAgICA9IFt7bmFtZTogJ0x1ZmtvIFdhbHJ1cycsIHN0YXR1czogJ1J1bm5pbmcnfSwge25hbWU6ICdBbGdlcnMgTWFyY3VzJywgc3RhdHVzOiAnRG93bid9LCB7bmFtZTogJ1NwYXJzZWMgTXVmbG8nLCBzdGF0dXM6ICdEb3duJ31dO1xudmFyIGNhc2VzICAgICAgPSBbQXJyYXkoKSwgQXJyYXkoMiksIEFycmF5KDEpLCBBcnJheSgpLCBBcnJheSgpXVxuXG5mdW5jdGlvbiByYW5kb21pemUgKGFycikge1xuICByZXR1cm4gYXJyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpXTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGUgKG51bSkge1xuICB2YXIgaTtcbiAgdmFyIHdlbGw7XG4gIHZhciBjcml0aWNhbDtcbiAgdmFyIGNsZWFyZWQ7XG4gIHZhciBub3JtYWw7XG4gIHZhciB2YWx1ZXMgPSBbXTtcblxuICBmb3IgKGkgPSAwOyBpIDwgbnVtOyBpKyspIHtcbiAgICB3ZWxsICAgICAgPSByYW5kb21pemUod2VsbHMpO1xuICAgIGNyaXRpY2FsICA9IHJhbmRvbWl6ZShjcml0aWNhbHMpO1xuICAgIGNsZWFyZWQgICA9IGZhbHNlOy8vcmFuZG9taXplKGNscl9zdGF0ZXMpICYmICEgY3JpdGljYWw7XG4gICAgbm9ybWFsICAgID0gd2VsbC5zdGF0dXMgPT09ICdSdW5uaW5nJyAmJiAhIGNyaXRpY2FsO1xuXG4gICAgdmFsdWVzLnB1c2goe1xuICAgICAgYWNrbm93bGVkZ2VkOiByYW5kb21pemUoYWNrX3N0YXRlcyksXG4gICAgICBjbGVhcmVkOiAgICAgIGNsZWFyZWQsXG4gICAgICBjcmVhdGVkX2RhdGU6IG5ldyBEYXRlKCksXG4gICAgICBjcml0aWNhbDogICAgIGNyaXRpY2FsLFxuICAgICAgY29kZTogICAgICAgICByYW5kb21pemUoY29kZXMpLFxuICAgICAgbm9ybWFsOiAgICAgICBub3JtYWwsXG4gICAgICB3ZWxsOiAgICAgICAgIHdlbGwsXG4gICAgICBtZXNzYWdlOiAgICAgIHJhbmRvbWl6ZShtZXNzYWdlcyksXG4gICAgICBjYXNlczogICAgICAgIHJhbmRvbWl6ZShjYXNlcylcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2VuZXJhdGU7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMlJoZEdFdllXeGhjbTF6WDJ4cGMzUmZZbTlrZVM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hKUVVGSkxGVkJRVlVzUjBGQlJ5eERRVUZETEVsQlFVa3NSVUZCUlN4TFFVRkxMRVZCUVVVc1MwRkJTeXhGUVVGRkxFdEJRVXNzUTBGQlF5eERRVUZETzBGQlF6ZERMRWxCUVVrc1ZVRkJWU3hIUVVGSExFTkJRVU1zU1VGQlNTeEZRVUZGTEV0QlFVc3NSVUZCUlN4TFFVRkxMRVZCUVVVc1MwRkJTeXhGUVVGRkxFdEJRVXNzUTBGQlF5eERRVUZETzBGQlEzQkVMRWxCUVVrc1UwRkJVeXhKUVVGSkxFTkJRVU1zU1VGQlNTeEZRVUZGTEV0QlFVc3NSVUZCUlN4TFFVRkxMRVZCUVVVc1MwRkJTeXhEUVVGRExFTkJRVU03UVVGRE4wTXNTVUZCU1N4TFFVRkxMRkZCUVZFc1EwRkJReXhQUVVGUExFVkJRVVVzVFVGQlRTeEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUXpORExFbEJRVWtzVVVGQlVTeExRVUZMTEVOQlFVTXNkVUpCUVhWQ0xFVkJRVVVzYVVKQlFXbENMRVZCUVVVc1kwRkJZeXhGUVVGRkxHZENRVUZuUWl4RFFVRkRMRU5CUVVNN1FVRkRhRWNzU1VGQlNTeExRVUZMTEZGQlFWRXNRMEZCUXl4RFFVRkRMRWxCUVVrc1JVRkJSU3hqUVVGakxFVkJRVVVzVFVGQlRTeEZRVUZGTEZOQlFWTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1NVRkJTU3hGUVVGRkxHVkJRV1VzUlVGQlJTeE5RVUZOTEVWQlFVVXNUVUZCVFN4RFFVRkRMRVZCUVVVc1EwRkJReXhKUVVGSkxFVkJRVVVzWlVGQlpTeEZRVUZGTEUxQlFVMHNSVUZCUlN4TlFVRk5MRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJReTlKTEVsQlFVa3NTMEZCU3l4UlFVRlJMRU5CUVVNc1MwRkJTeXhGUVVGRkxFVkJRVVVzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RlFVRkZMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUlVGQlJTeExRVUZMTEVWQlFVVXNSVUZCUlN4TFFVRkxMRVZCUVVVc1EwRkJRenM3UVVGRmFFVXNVMEZCVXl4VFFVRlRMRVZCUVVVc1IwRkJSeXhGUVVGRk8wVkJRM1pDTEU5QlFVOHNSMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFVMHNSVUZCUlN4SFFVRkhMRWRCUVVjc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEzSkVMRU5CUVVNN08wRkJSVVFzVTBGQlV5eFJRVUZSTEVWQlFVVXNSMEZCUnl4RlFVRkZPMFZCUTNSQ0xFbEJRVWtzUTBGQlF5eERRVUZETzBWQlEwNHNTVUZCU1N4SlFVRkpMRU5CUVVNN1JVRkRWQ3hKUVVGSkxGRkJRVkVzUTBGQlF6dEZRVU5pTEVsQlFVa3NUMEZCVHl4RFFVRkRPMFZCUTFvc1NVRkJTU3hOUVVGTkxFTkJRVU03UVVGRFlpeEZRVUZGTEVsQlFVa3NUVUZCVFN4SFFVRkhMRVZCUVVVc1EwRkJRenM3UlVGRmFFSXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eEhRVUZITEVWQlFVVXNRMEZCUXl4RlFVRkZMRVZCUVVVN1NVRkRlRUlzU1VGQlNTeFJRVUZSTEZOQlFWTXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRKUVVNM1FpeFJRVUZSTEVsQlFVa3NVMEZCVXl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8wbEJRMnBETEU5QlFVOHNTMEZCU3l4TFFVRkxMRU5CUVVNN1FVRkRkRUlzU1VGQlNTeE5RVUZOTEUxQlFVMHNTVUZCU1N4RFFVRkRMRTFCUVUwc1MwRkJTeXhUUVVGVExFbEJRVWtzUlVGQlJTeFJRVUZSTEVOQlFVTTdPMGxCUlhCRUxFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTTdUVUZEVml4WlFVRlpMRVZCUVVVc1UwRkJVeXhEUVVGRExGVkJRVlVzUTBGQlF6dE5RVU51UXl4UFFVRlBMRTlCUVU4c1QwRkJUenROUVVOeVFpeFpRVUZaTEVWQlFVVXNTVUZCU1N4SlFVRkpMRVZCUVVVN1RVRkRlRUlzVVVGQlVTeE5RVUZOTEZGQlFWRTdUVUZEZEVJc1NVRkJTU3hWUVVGVkxGTkJRVk1zUTBGQlF5eExRVUZMTEVOQlFVTTdUVUZET1VJc1RVRkJUU3hSUVVGUkxFMUJRVTA3VFVGRGNFSXNTVUZCU1N4VlFVRlZMRWxCUVVrN1RVRkRiRUlzVDBGQlR5eFBRVUZQTEZOQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNN1RVRkRha01zUzBGQlN5eFRRVUZUTEZOQlFWTXNRMEZCUXl4TFFVRkxMRU5CUVVNN1MwRkRMMElzUTBGQlF5eERRVUZETzBGQlExQXNSMEZCUnpzN1JVRkZSQ3hQUVVGUExFMUJRVTBzUTBGQlF6dEJRVU5vUWl4RFFVRkRPenRCUVVWRUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NVVUZCVVN4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpZG1GeUlHRmphMTl6ZEdGMFpYTWdQU0JiZEhKMVpTd2dabUZzYzJVc0lHWmhiSE5sTENCbVlXeHpaVjA3WEc1MllYSWdZMnh5WDNOMFlYUmxjeUE5SUZ0MGNuVmxMQ0JtWVd4elpTd2dabUZzYzJVc0lHWmhiSE5sTENCbVlXeHpaVjA3WEc1MllYSWdZM0pwZEdsallXeHpJQ0E5SUZ0MGNuVmxMQ0JtWVd4elpTd2dabUZzYzJVc0lHWmhiSE5sWFR0Y2JuWmhjaUJqYjJSbGN5QWdJQ0FnSUQwZ1d5ZERNakE0TUNjc0lDZEJSamszSnl3Z0owUnZkMjRuWFR0Y2JuWmhjaUJ0WlhOellXZGxjeUFnSUQwZ1d5ZERiMjF0ZFc1cFkyRjBhVzl1SUdaaGFXeDFjbVVuTENBbmRXNWtaWEpzYjJGa0lHWmhkV3gwSnl3Z0oyZHliM1Z1WkNCbVlYVnNkQ2NzSUNkdGIzUnZjaUJ2ZG1WeWJHOWhaQ2RkTzF4dWRtRnlJSGRsYkd4eklDQWdJQ0FnUFNCYmUyNWhiV1U2SUNkTWRXWnJieUJYWVd4eWRYTW5MQ0J6ZEdGMGRYTTZJQ2RTZFc1dWFXNW5KMzBzSUh0dVlXMWxPaUFuUVd4blpYSnpJRTFoY21OMWN5Y3NJSE4wWVhSMWN6b2dKMFJ2ZDI0bmZTd2dlMjVoYldVNklDZFRjR0Z5YzJWaklFMTFabXh2Snl3Z2MzUmhkSFZ6T2lBblJHOTNiaWQ5WFR0Y2JuWmhjaUJqWVhObGN5QWdJQ0FnSUQwZ1cwRnljbUY1S0Nrc0lFRnljbUY1S0RJcExDQkJjbkpoZVNneEtTd2dRWEp5WVhrb0tTd2dRWEp5WVhrb0tWMWNibHh1Wm5WdVkzUnBiMjRnY21GdVpHOXRhWHBsSUNoaGNuSXBJSHRjYmlBZ2NtVjBkWEp1SUdGeWNsdE5ZWFJvTG1ac2IyOXlLRTFoZEdndWNtRnVaRzl0S0NrZ0tpQmhjbkl1YkdWdVozUm9LVjA3WEc1OVhHNWNibVoxYm1OMGFXOXVJR2RsYm1WeVlYUmxJQ2h1ZFcwcElIdGNiaUFnZG1GeUlHazdYRzRnSUhaaGNpQjNaV3hzTzF4dUlDQjJZWElnWTNKcGRHbGpZV3c3WEc0Z0lIWmhjaUJqYkdWaGNtVmtPMXh1SUNCMllYSWdibTl5YldGc08xeHVJQ0IyWVhJZ2RtRnNkV1Z6SUQwZ1cxMDdYRzVjYmlBZ1ptOXlJQ2hwSUQwZ01Ec2dhU0E4SUc1MWJUc2dhU3NyS1NCN1hHNGdJQ0FnZDJWc2JDQWdJQ0FnSUQwZ2NtRnVaRzl0YVhwbEtIZGxiR3h6S1R0Y2JpQWdJQ0JqY21sMGFXTmhiQ0FnUFNCeVlXNWtiMjFwZW1Vb1kzSnBkR2xqWVd4ektUdGNiaUFnSUNCamJHVmhjbVZrSUNBZ1BTQm1ZV3h6WlRzdkwzSmhibVJ2YldsNlpTaGpiSEpmYzNSaGRHVnpLU0FtSmlBaElHTnlhWFJwWTJGc08xeHVJQ0FnSUc1dmNtMWhiQ0FnSUNBOUlIZGxiR3d1YzNSaGRIVnpJRDA5UFNBblVuVnVibWx1WnljZ0ppWWdJU0JqY21sMGFXTmhiRHRjYmx4dUlDQWdJSFpoYkhWbGN5NXdkWE5vS0h0Y2JpQWdJQ0FnSUdGamEyNXZkMnhsWkdkbFpEb2djbUZ1Wkc5dGFYcGxLR0ZqYTE5emRHRjBaWE1wTEZ4dUlDQWdJQ0FnWTJ4bFlYSmxaRG9nSUNBZ0lDQmpiR1ZoY21Wa0xGeHVJQ0FnSUNBZ1kzSmxZWFJsWkY5a1lYUmxPaUJ1WlhjZ1JHRjBaU2dwTEZ4dUlDQWdJQ0FnWTNKcGRHbGpZV3c2SUNBZ0lDQmpjbWwwYVdOaGJDeGNiaUFnSUNBZ0lHTnZaR1U2SUNBZ0lDQWdJQ0FnY21GdVpHOXRhWHBsS0dOdlpHVnpLU3hjYmlBZ0lDQWdJRzV2Y20xaGJEb2dJQ0FnSUNBZ2JtOXliV0ZzTEZ4dUlDQWdJQ0FnZDJWc2JEb2dJQ0FnSUNBZ0lDQjNaV3hzTEZ4dUlDQWdJQ0FnYldWemMyRm5aVG9nSUNBZ0lDQnlZVzVrYjIxcGVtVW9iV1Z6YzJGblpYTXBMRnh1SUNBZ0lDQWdZMkZ6WlhNNklDQWdJQ0FnSUNCeVlXNWtiMjFwZW1Vb1kyRnpaWE1wWEc0Z0lDQWdmU2s3WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnZG1Gc2RXVnpPMXh1ZlZ4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlHZGxibVZ5WVhSbE8xeHVJbDE5IiwidmFyIHZhbHVlcyA9IFtdO1xuXG52YWx1ZXMgPSBbXG4gIHtcbiAgICBtaW5pbWFsOiAgICB0cnVlLFxuICAgIG5hbWU6ICAgICAgICdzdGF0dXMnLFxuICAgIHR5cGU6ICAgICAgICdzdGF0dXMnXG4gIH0sXG4gIHtcbiAgICBuYW1lOiAgICAgICAnZGV0YWlscycsXG4gICAgdGl0bGU6ICAgICAgJ0FsYXJtIGRldGFpbHMnLFxuICAgIHR5cGU6ICAgICAgICdhbGFybV9kZXRhaWxzJ1xuICB9LFxuICB7XG4gICAgbmFtZTogICAgICAgJ3dlbGwnLFxuICAgIHRpdGxlOiAgICAgICdXZWxsJyxcbiAgICB0eXBlOiAgICAgICAnd2VsbCdcbiAgfSxcbiAge1xuICAgIG5hbWU6ICAgICAgICdkYXRlJyxcbiAgICB0aXRsZTogICAgICAnRGF0ZScsXG4gICAgdHlwZTogICAgICAgJ2RhdGUnXG4gIH0sXG4gIHtcbiAgICBuYW1lOiAgICAgICAnYWN0aW9ucycsXG4gICAgdGl0bGU6ICAgICAgJ0FjdGlvbicsXG4gICAgdHlwZTogICAgICAgJ2FsYXJtX2FjdGlvbnMnXG4gIH0sXG4gIHtcbiAgICBtaW5pbWFsOiAgICB0cnVlLFxuICAgIG5hbWU6ICAgICAgICdjYXNlcycsXG4gICAgdGl0bGU6ICAgICAgJ0Nhc2VzJyxcbiAgICB0eXBlOiAgICAgICAnY2FzZXMnXG4gIH1cbl07XG5cbm1vZHVsZS5leHBvcnRzID0gdmFsdWVzO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDJSaGRHRXZZV3hoY20xelgyeHBjM1JmYUdWaFpHbHVaM011YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNTVUZCU1N4TlFVRk5MRWRCUVVjc1JVRkJSU3hEUVVGRE96dEJRVVZvUWl4TlFVRk5MRWRCUVVjN1JVRkRVRHRKUVVORkxFOUJRVThzUzBGQlN5eEpRVUZKTzBsQlEyaENMRWxCUVVrc1VVRkJVU3hSUVVGUk8wbEJRM0JDTEVsQlFVa3NVVUZCVVN4UlFVRlJPMGRCUTNKQ08wVkJRMFE3U1VGRFJTeEpRVUZKTEZGQlFWRXNVMEZCVXp0SlFVTnlRaXhMUVVGTExFOUJRVThzWlVGQlpUdEpRVU16UWl4SlFVRkpMRkZCUVZFc1pVRkJaVHRIUVVNMVFqdEZRVU5FTzBsQlEwVXNTVUZCU1N4UlFVRlJMRTFCUVUwN1NVRkRiRUlzUzBGQlN5eFBRVUZQTEUxQlFVMDdTVUZEYkVJc1NVRkJTU3hSUVVGUkxFMUJRVTA3UjBGRGJrSTdSVUZEUkR0SlFVTkZMRWxCUVVrc1VVRkJVU3hOUVVGTk8wbEJRMnhDTEV0QlFVc3NUMEZCVHl4TlFVRk5PMGxCUTJ4Q0xFbEJRVWtzVVVGQlVTeE5RVUZOTzBkQlEyNUNPMFZCUTBRN1NVRkRSU3hKUVVGSkxGRkJRVkVzVTBGQlV6dEpRVU55UWl4TFFVRkxMRTlCUVU4c1VVRkJVVHRKUVVOd1FpeEpRVUZKTEZGQlFWRXNaVUZCWlR0SFFVTTFRanRGUVVORU8wbEJRMFVzVDBGQlR5eExRVUZMTEVsQlFVazdTVUZEYUVJc1NVRkJTU3hSUVVGUkxFOUJRVTg3U1VGRGJrSXNTMEZCU3l4UFFVRlBMRTlCUVU4N1NVRkRia0lzU1VGQlNTeFJRVUZSTEU5QlFVODdSMEZEY0VJN1FVRkRTQ3hEUVVGRExFTkJRVU03TzBGQlJVWXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhOUVVGTkxFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKMllYSWdkbUZzZFdWeklEMGdXMTA3WEc1Y2JuWmhiSFZsY3lBOUlGdGNiaUFnZTF4dUlDQWdJRzFwYm1sdFlXdzZJQ0FnSUhSeWRXVXNYRzRnSUNBZ2JtRnRaVG9nSUNBZ0lDQWdKM04wWVhSMWN5Y3NYRzRnSUNBZ2RIbHdaVG9nSUNBZ0lDQWdKM04wWVhSMWN5ZGNiaUFnZlN4Y2JpQWdlMXh1SUNBZ0lHNWhiV1U2SUNBZ0lDQWdJQ2RrWlhSaGFXeHpKeXhjYmlBZ0lDQjBhWFJzWlRvZ0lDQWdJQ0FuUVd4aGNtMGdaR1YwWVdsc2N5Y3NYRzRnSUNBZ2RIbHdaVG9nSUNBZ0lDQWdKMkZzWVhKdFgyUmxkR0ZwYkhNblhHNGdJSDBzWEc0Z0lIdGNiaUFnSUNCdVlXMWxPaUFnSUNBZ0lDQW5kMlZzYkNjc1hHNGdJQ0FnZEdsMGJHVTZJQ0FnSUNBZ0oxZGxiR3duTEZ4dUlDQWdJSFI1Y0dVNklDQWdJQ0FnSUNkM1pXeHNKMXh1SUNCOUxGeHVJQ0I3WEc0Z0lDQWdibUZ0WlRvZ0lDQWdJQ0FnSjJSaGRHVW5MRnh1SUNBZ0lIUnBkR3hsT2lBZ0lDQWdJQ2RFWVhSbEp5eGNiaUFnSUNCMGVYQmxPaUFnSUNBZ0lDQW5aR0YwWlNkY2JpQWdmU3hjYmlBZ2UxeHVJQ0FnSUc1aGJXVTZJQ0FnSUNBZ0lDZGhZM1JwYjI1ekp5eGNiaUFnSUNCMGFYUnNaVG9nSUNBZ0lDQW5RV04wYVc5dUp5eGNiaUFnSUNCMGVYQmxPaUFnSUNBZ0lDQW5ZV3hoY20xZllXTjBhVzl1Y3lkY2JpQWdmU3hjYmlBZ2UxeHVJQ0FnSUcxcGJtbHRZV3c2SUNBZ0lIUnlkV1VzWEc0Z0lDQWdibUZ0WlRvZ0lDQWdJQ0FnSjJOaGMyVnpKeXhjYmlBZ0lDQjBhWFJzWlRvZ0lDQWdJQ0FuUTJGelpYTW5MRnh1SUNBZ0lIUjVjR1U2SUNBZ0lDQWdJQ2RqWVhObGN5ZGNiaUFnZlZ4dVhUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0IyWVd4MVpYTTdYRzRpWFgwPSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgQWN0aXZlUm93RGV0YWlscztcbnZhciAkICAgICAgICAgICA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIFJlYWN0ICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBCYWNrYm9uZSAgICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgVHIgICAgICAgICAgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL3RyLmpzeCcpO1xudmFyIFRkICAgICAgICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy90ZC5qc3gnKTtcbnZhciBUYWJzICAgICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvdGFicy5qc3gnKTtcbnZhciBJY29uICAgICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvaWNvbi5qc3gnKTtcbnZhciBzdG9yZSAgICAgICA9IHJlcXVpcmUoJy4vbGlzdF92aWV3X3N0b3JlJyk7XG52YXIgZGlzcGF0Y2hlciAgPSByZXF1aXJlKCcuL2Rpc3BhdGNoZXInKTtcbnZhciBtb21lbnQgICAgICA9IHJlcXVpcmUoJ21vbWVudCcpO1xuXG5BY3RpdmVSb3dEZXRhaWxzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkFjdGl2ZVJvd0RldGFpbHNcIixcbiAgcHJvcFR5cGVzOiB7XG4gICAgbW9kZWw6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEJhY2tib25lLk1vZGVsKS5pc1JlcXVpcmVkXG4gIH0sXG4gIG1peGluczogW1JlYWN0LmFkZG9ucy5QdXJlUmVuZGVyTWl4aW5dLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5tb2RlbC50b0pTT04oKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNsYXNzX25hbWVzID0gWydhY3RpdmUnXTtcbiAgICB2YXIgbW9kZWwgICAgICAgPSB0aGlzLnByb3BzLm1vZGVsO1xuICAgIHZhciBzaXplX3RvZ2dsZSA9IHRoaXMucHJvcHMubWluaW1pemVkID8gJ2V4cGFuZCcgOiAnY29tcHJlc3MnO1xuICAgIHZhciB0YWJzICAgICAgICA9IHRoaXMuX2dldFRhYnMoKTtcblxuICAgIGNsYXNzX25hbWVzLnB1c2godGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHIsIHtjbGFzc05hbWU6IGNsYXNzX25hbWVzLmpvaW4oJyAnKX0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRkLCB7Y29sU3Bhbjogc3RvcmUuZ2V0KCdoZWFkaW5ncycpLmxlbmd0aH0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJmaWVsZHNldFwiLCB7Y2xhc3NOYW1lOiBcInNlcGFyYXRvclwifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGVnZW5kXCIsIHthbGlnbjogXCJjZW50ZXJcIn0sIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYnMsIHt0YWJzOiB0YWJzfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICApLCBcbiAgICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBfZ2V0VGFiczogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0YWJzID0gW1xuICAgICAge2ljb246ICdhcnJvdy11cCcsICAgIGFjdGlvbjogdGhpcy5fc2VsZWN0UHJldn0sXG4gICAgICB7aWNvbjogJ2Fycm93LWRvd24nLCAgYWN0aW9uOiB0aGlzLl9zZWxlY3ROZXh0fSxcbiAgICAgIHtpY29uOiAnY2xvc2UnLCAgICAgICBhY3Rpb246IHRoaXMuX2Nsb3NlfVxuICAgIF07XG5cbiAgICBpZiAoISB0aGlzLnByb3BzLnByZXYpIHtcbiAgICAgIGRlbGV0ZSB0YWJzWzBdO1xuICAgIH1cblxuICAgIGlmICghIHRoaXMucHJvcHMubmV4dCkge1xuICAgICAgZGVsZXRlIHRhYnNbMV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhYnM7XG4gIH0sXG4gIF9zZWxlY3RQcmV2OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMucHJldikge1xuICAgICAgdGhpcy5fc3dpdGNoKHRoaXMucHJvcHMucHJldik7XG4gICAgfVxuICB9LFxuICBfc2VsZWN0TmV4dDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLm5leHQpIHtcbiAgICAgIHRoaXMuX3N3aXRjaCh0aGlzLnByb3BzLm5leHQpO1xuICAgIH1cbiAgfSxcbiAgX2Nsb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fc3dpdGNoKCk7XG4gIH0sXG4gIF9zd2l0Y2g6IGZ1bmN0aW9uIChjaWQpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5zd2l0Y2hlcikge1xuICAgICAgdGhpcy5wcm9wcy5zd2l0Y2hlcihjaWQsIHRydWUpO1xuICAgIH1cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQWN0aXZlUm93RGV0YWlscztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdllXeGhjbTF6TDJGamRHbDJaVjl5YjNkZlpHVjBZV2xzY3k1cWMzZ2lYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3TzBGQlJVRXNSMEZCUnpzN1FVRkZTQ3hKUVVGSkxHZENRVUZuUWl4RFFVRkRPMEZCUTNKQ0xFbEJRVWtzUTBGQlF5eGhRVUZoTEU5QlFVOHNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRCUVVOd1F5eEpRVUZKTEV0QlFVc3NVMEZCVXl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRGJrTXNTVUZCU1N4UlFVRlJMRTFCUVUwc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETzBGQlEzUkRMRWxCUVVrc1JVRkJSU3haUVVGWkxFOUJRVThzUTBGQlF5eDVRa0ZCZVVJc1EwRkJReXhEUVVGRE8wRkJRM0pFTEVsQlFVa3NSVUZCUlN4WlFVRlpMRTlCUVU4c1EwRkJReXg1UWtGQmVVSXNRMEZCUXl4RFFVRkRPMEZCUTNKRUxFbEJRVWtzU1VGQlNTeFZRVUZWTEU5QlFVOHNRMEZCUXl3eVFrRkJNa0lzUTBGQlF5eERRVUZETzBGQlEzWkVMRWxCUVVrc1NVRkJTU3hWUVVGVkxFOUJRVThzUTBGQlF5d3lRa0ZCTWtJc1EwRkJReXhEUVVGRE8wRkJRM1pFTEVsQlFVa3NTMEZCU3l4VFFVRlRMRTlCUVU4c1EwRkJReXh0UWtGQmJVSXNRMEZCUXl4RFFVRkRPMEZCUXk5RExFbEJRVWtzVlVGQlZTeEpRVUZKTEU5QlFVOHNRMEZCUXl4alFVRmpMRU5CUVVNc1EwRkJRenRCUVVNeFF5eEpRVUZKTEUxQlFVMHNVVUZCVVN4UFFVRlBMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03TzBGQlJYQkRMSE5EUVVGelF5eG5RMEZCUVR0RlFVTndReXhUUVVGVExFVkJRVVU3U1VGRFZDeExRVUZMTEVWQlFVVXNTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhWUVVGVkxFTkJRVU1zVVVGQlVTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRlZCUVZVN1IwRkROMFE3UlVGRFJDeE5RVUZOTEVWQlFVVXNRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExHVkJRV1VzUTBGQlF6dEZRVU4wUXl4bFFVRmxMRVZCUVVVc1dVRkJXVHRKUVVNelFpeFBRVUZQTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUlVGQlJTeERRVUZETzBkQlEyeERPMFZCUTBRc1RVRkJUU3hGUVVGRkxGbEJRVms3U1VGRGJFSXNTVUZCU1N4WFFVRlhMRWRCUVVjc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEpRVU0zUWl4SlFVRkpMRXRCUVVzc1UwRkJVeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXp0SlFVTnVReXhKUVVGSkxGZEJRVmNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRk5CUVZNc1IwRkJSeXhSUVVGUkxFZEJRVWNzVlVGQlZTeERRVUZETzBGQlEyNUZMRWxCUVVrc1NVRkJTU3hKUVVGSkxGVkJRVlVzU1VGQlNTeERRVUZETEZGQlFWRXNSVUZCUlN4RFFVRkRPenRCUVVWMFF5eEpRVUZKTEZkQlFWY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXpzN1NVRkZka003VFVGRFJTeHZRa0ZCUXl4RlFVRkZMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZGTEZkQlFWY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGSExFTkJRVUVzUlVGQlFUdFJRVU53UXl4dlFrRkJReXhGUVVGRkxFVkJRVUVzUTBGQlFTeERRVUZETEU5QlFVRXNSVUZCVHl4RFFVRkZMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNUVUZCVVN4RFFVRkJMRVZCUVVFN1ZVRkRla01zYjBKQlFVRXNWVUZCVXl4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eFhRVUZaTEVOQlFVRXNSVUZCUVR0WlFVTTVRaXh2UWtGQlFTeFJRVUZQTEVWQlFVRXNRMEZCUVN4RFFVRkRMRXRCUVVFc1JVRkJTeXhEUVVGRExGRkJRVk1zUTBGQlFTeEZRVUZCTzJOQlEzSkNMRzlDUVVGRExFbEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNTVUZCUVN4RlFVRkpMRU5CUVVVc1NVRkJTeXhEUVVGQkxFTkJRVWNzUTBGQlFUdFpRVU5pTEVOQlFVRTdWVUZEUVN4RFFVRkJMRVZCUVVFN1ZVRkRWaXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWTTdVVUZEYkVJc1EwRkJRVHROUVVOR0xFTkJRVUU3VFVGRFREdEhRVU5JTzBWQlEwUXNVVUZCVVN4RlFVRkZMRmxCUVZrN1NVRkRjRUlzU1VGQlNTeEpRVUZKTEVkQlFVYzdUVUZEVkN4RFFVRkRMRWxCUVVrc1JVRkJSU3hWUVVGVkxFdEJRVXNzVFVGQlRTeEZRVUZGTEVsQlFVa3NRMEZCUXl4WFFVRlhMRU5CUVVNN1RVRkRMME1zUTBGQlF5eEpRVUZKTEVWQlFVVXNXVUZCV1N4SFFVRkhMRTFCUVUwc1JVRkJSU3hKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETzAxQlF5OURMRU5CUVVNc1NVRkJTU3hGUVVGRkxFOUJRVThzVVVGQlVTeE5RVUZOTEVWQlFVVXNTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJRenRCUVVOb1JDeExRVUZMTEVOQlFVTTdPMGxCUlVZc1NVRkJTU3hGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RlFVRkZPMDFCUTNKQ0xFOUJRVThzU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUTNKQ0xFdEJRVXM3TzBsQlJVUXNTVUZCU1N4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeEZRVUZGTzAxQlEzSkNMRTlCUVU4c1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEzSkNMRXRCUVVzN08wbEJSVVFzVDBGQlR5eEpRVUZKTEVOQlFVTTdSMEZEWWp0RlFVTkVMRmRCUVZjc1JVRkJSU3haUVVGWk8wbEJRM1pDTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFVkJRVVU3VFVGRGJrSXNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMHRCUXk5Q08wZEJRMFk3UlVGRFJDeFhRVUZYTEVWQlFVVXNXVUZCV1R0SlFVTjJRaXhKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RlFVRkZPMDFCUTI1Q0xFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dExRVU12UWp0SFFVTkdPMFZCUTBRc1RVRkJUU3hGUVVGRkxGbEJRVms3U1VGRGJFSXNTVUZCU1N4RFFVRkRMRTlCUVU4c1JVRkJSU3hEUVVGRE8wZEJRMmhDTzBWQlEwUXNUMEZCVHl4RlFVRkZMRlZCUVZVc1IwRkJSeXhGUVVGRk8wbEJRM1JDTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGUkxFVkJRVVU3VFVGRGRrSXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGUkxFTkJRVU1zUjBGQlJ5eEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPMHRCUTJoRE8wZEJRMFk3UVVGRFNDeERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEdkQ1FVRm5RaXhEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeW9xWEc0Z0tpQkFhbk40SUZKbFlXTjBMa1JQVFZ4dUlDb3ZYRzVjYm5aaGNpQkJZM1JwZG1WU2IzZEVaWFJoYVd4ek8xeHVkbUZ5SUNRZ0lDQWdJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25hbkYxWlhKNUp5azdYRzUyWVhJZ1VtVmhZM1FnSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDY3BPMXh1ZG1GeUlFSmhZMnRpYjI1bElDQWdJRDBnY21WeGRXbHlaU2duWW1GamEySnZibVVuS1R0Y2JuWmhjaUJVY2lBZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHVMeTR1TDJOdmJYQnZibVZ1ZEhNdmRISXVhbk40SnlrN1hHNTJZWElnVkdRZ0lDQWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDY3VMaTh1TGk5amIyMXdiMjVsYm5SekwzUmtMbXB6ZUNjcE8xeHVkbUZ5SUZSaFluTWdJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTR2TGk0dlkyOXRjRzl1Wlc1MGN5OTBZV0p6TG1wemVDY3BPMXh1ZG1GeUlFbGpiMjRnSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duTGk0dkxpNHZZMjl0Y0c5dVpXNTBjeTlwWTI5dUxtcHplQ2NwTzF4dWRtRnlJSE4wYjNKbElDQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpOXNhWE4wWDNacFpYZGZjM1J2Y21VbktUdGNiblpoY2lCa2FYTndZWFJqYUdWeUlDQTlJSEpsY1hWcGNtVW9KeTR2WkdsemNHRjBZMmhsY2ljcE8xeHVkbUZ5SUcxdmJXVnVkQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25iVzl0Wlc1MEp5azdYRzVjYmtGamRHbDJaVkp2ZDBSbGRHRnBiSE1nUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJSEJ5YjNCVWVYQmxjem9nZTF4dUlDQWdJRzF2WkdWc09pQlNaV0ZqZEM1UWNtOXdWSGx3WlhNdWFXNXpkR0Z1WTJWUFppaENZV05yWW05dVpTNU5iMlJsYkNrdWFYTlNaWEYxYVhKbFpGeHVJQ0I5TEZ4dUlDQnRhWGhwYm5NNklGdFNaV0ZqZEM1aFpHUnZibk11VUhWeVpWSmxibVJsY2sxcGVHbHVYU3hjYmlBZ1oyVjBTVzVwZEdsaGJGTjBZWFJsT2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVjSEp2Y0hNdWJXOWtaV3d1ZEc5S1UwOU9LQ2s3WEc0Z0lIMHNYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQmpiR0Z6YzE5dVlXMWxjeUE5SUZzbllXTjBhWFpsSjEwN1hHNGdJQ0FnZG1GeUlHMXZaR1ZzSUNBZ0lDQWdJRDBnZEdocGN5NXdjbTl3Y3k1dGIyUmxiRHRjYmlBZ0lDQjJZWElnYzJsNlpWOTBiMmRuYkdVZ1BTQjBhR2x6TG5CeWIzQnpMbTFwYm1sdGFYcGxaQ0EvSUNkbGVIQmhibVFuSURvZ0oyTnZiWEJ5WlhOekp6dGNiaUFnSUNCMllYSWdkR0ZpY3lBZ0lDQWdJQ0FnUFNCMGFHbHpMbDluWlhSVVlXSnpLQ2s3WEc1Y2JpQWdJQ0JqYkdGemMxOXVZVzFsY3k1d2RYTm9LSFJvYVhNdWNISnZjSE11WTJ4aGMzTk9ZVzFsS1R0Y2JseHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4VkhJZ1kyeGhjM05PWVcxbFBYdGpiR0Z6YzE5dVlXMWxjeTVxYjJsdUtDY2dKeWw5UGx4dUlDQWdJQ0FnSUNBOFZHUWdZMjlzVTNCaGJqMTdjM1J2Y21VdVoyVjBLQ2RvWldGa2FXNW5jeWNwTG14bGJtZDBhSDArWEc0Z0lDQWdJQ0FnSUNBZ1BHWnBaV3hrYzJWMElHTnNZWE56VG1GdFpUMWNJbk5sY0dGeVlYUnZjbHdpUGx4dUlDQWdJQ0FnSUNBZ0lDQWdQR3hsWjJWdVpDQmhiR2xuYmoxY0ltTmxiblJsY2x3aVBseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFZHRmljeUIwWVdKelBYdDBZV0p6ZlNBdlBseHVJQ0FnSUNBZ0lDQWdJQ0FnUEM5c1pXZGxibVErWEc0Z0lDQWdJQ0FnSUNBZ1BDOW1hV1ZzWkhObGRENWNiaUFnSUNBZ0lDQWdJQ0I3ZEdocGN5NXdjbTl3Y3k1amFHbHNaSEpsYm4xY2JpQWdJQ0FnSUNBZ1BDOVVaRDVjYmlBZ0lDQWdJRHd2VkhJK1hHNGdJQ0FnS1R0Y2JpQWdmU3hjYmlBZ1gyZGxkRlJoWW5NNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnZEdGaWN5QTlJRnRjYmlBZ0lDQWdJSHRwWTI5dU9pQW5ZWEp5YjNjdGRYQW5MQ0FnSUNCaFkzUnBiMjQ2SUhSb2FYTXVYM05sYkdWamRGQnlaWFo5TEZ4dUlDQWdJQ0FnZTJsamIyNDZJQ2RoY25KdmR5MWtiM2R1Snl3Z0lHRmpkR2x2YmpvZ2RHaHBjeTVmYzJWc1pXTjBUbVY0ZEgwc1hHNGdJQ0FnSUNCN2FXTnZiam9nSjJOc2IzTmxKeXdnSUNBZ0lDQWdZV04wYVc5dU9pQjBhR2x6TGw5amJHOXpaWDFjYmlBZ0lDQmRPMXh1WEc0Z0lDQWdhV1lnS0NFZ2RHaHBjeTV3Y205d2N5NXdjbVYyS1NCN1hHNGdJQ0FnSUNCa1pXeGxkR1VnZEdGaWMxc3dYVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnBaaUFvSVNCMGFHbHpMbkJ5YjNCekxtNWxlSFFwSUh0Y2JpQWdJQ0FnSUdSbGJHVjBaU0IwWVdKeld6RmRPMXh1SUNBZ0lIMWNibHh1SUNBZ0lISmxkSFZ5YmlCMFlXSnpPMXh1SUNCOUxGeHVJQ0JmYzJWc1pXTjBVSEpsZGpvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lHbG1JQ2gwYUdsekxuQnliM0J6TG5CeVpYWXBJSHRjYmlBZ0lDQWdJSFJvYVhNdVgzTjNhWFJqYUNoMGFHbHpMbkJ5YjNCekxuQnlaWFlwTzF4dUlDQWdJSDFjYmlBZ2ZTeGNiaUFnWDNObGJHVmpkRTVsZUhRNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnBaaUFvZEdocGN5NXdjbTl3Y3k1dVpYaDBLU0I3WEc0Z0lDQWdJQ0IwYUdsekxsOXpkMmwwWTJnb2RHaHBjeTV3Y205d2N5NXVaWGgwS1R0Y2JpQWdJQ0I5WEc0Z0lIMHNYRzRnSUY5amJHOXpaVG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhSb2FYTXVYM04zYVhSamFDZ3BPMXh1SUNCOUxGeHVJQ0JmYzNkcGRHTm9PaUJtZFc1amRHbHZiaUFvWTJsa0tTQjdYRzRnSUNBZ2FXWWdLSFJvYVhNdWNISnZjSE11YzNkcGRHTm9aWElwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVjSEp2Y0hNdWMzZHBkR05vWlhJb1kybGtMQ0IwY25WbEtUdGNiaUFnSUNCOVhHNGdJSDFjYm4wcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRUZqZEdsMlpWSnZkMFJsZEdGcGJITTdYRzRpWFgwPSIsInZhciBBbGFybUNvbGxlY3Rpb247XG52YXIgQmFja2JvbmUgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBBbGFybU1vZGVsID0gcmVxdWlyZSgnLi9hbGFybV9tb2RlbCcpO1xuXG5BbGFybUNvbGxlY3Rpb24gPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gIG1vZGVsOiBBbGFybU1vZGVsLFxuICBsaW5rU2libGluZ3M6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVhY2goZnVuY3Rpb24gKGhlYWRlciwgaW5kZXgpIHtcbiAgICAgIGhlYWRlci5wcmV2ID0gdGhpcy5hdChpbmRleCAtIDEpO1xuICAgICAgaGVhZGVyLm5leHQgPSB0aGlzLmF0KGluZGV4ICsgMSk7XG4gICAgfSwgdGhpcyk7XG4gIH0sXG4gIGNvbXBhcmF0b3I6IGZ1bmN0aW9uIChmaXJzdCwgc2Vjb25kKSB7XG4gICAgaWYgKGZpcnN0LmdldCgnY3JpdGljYWwnKSkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIHJldHVybiAxO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBbGFybUNvbGxlY3Rpb247XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZZV3hoY20xekwyRnNZWEp0WDJOdmJHeGxZM1JwYjI0dWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzU1VGQlNTeGxRVUZsTEVOQlFVTTdRVUZEY0VJc1NVRkJTU3hSUVVGUkxFbEJRVWtzVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPMEZCUTNCRExFbEJRVWtzVlVGQlZTeEhRVUZITEU5QlFVOHNRMEZCUXl4bFFVRmxMRU5CUVVNc1EwRkJRenM3UVVGRk1VTXNaVUZCWlN4SFFVRkhMRkZCUVZFc1EwRkJReXhWUVVGVkxFTkJRVU1zVFVGQlRTeERRVUZETzBWQlF6TkRMRXRCUVVzc1JVRkJSU3hWUVVGVk8wVkJRMnBDTEZsQlFWa3NSVUZCUlN4WlFVRlpPMGxCUTNoQ0xFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNWVUZCVlN4TlFVRk5MRVZCUVVVc1MwRkJTeXhGUVVGRk8wMUJRMnBETEUxQlFVMHNRMEZCUXl4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRExFVkJRVVVzUTBGQlF5eExRVUZMTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNN1RVRkRha01zVFVGQlRTeERRVUZETEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1JVRkJSU3hEUVVGRExFdEJRVXNzUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXp0TFFVTnNReXhGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETzBkQlExWTdSVUZEUkN4VlFVRlZMRVZCUVVVc1ZVRkJWU3hMUVVGTExFVkJRVVVzVFVGQlRTeEZRVUZGTzBsQlEyNURMRWxCUVVrc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eFZRVUZWTEVOQlFVTXNSVUZCUlR0TlFVTjZRaXhQUVVGUExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEyaENMRXRCUVVzN08wbEJSVVFzVDBGQlR5eERRVUZETEVOQlFVTTdSMEZEVmp0QlFVTklMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZJTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1pVRkJaU3hEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lkbUZ5SUVGc1lYSnRRMjlzYkdWamRHbHZianRjYm5aaGNpQkNZV05yWW05dVpTQWdQU0J5WlhGMWFYSmxLQ2RpWVdOclltOXVaU2NwTzF4dWRtRnlJRUZzWVhKdFRXOWtaV3dnUFNCeVpYRjFhWEpsS0NjdUwyRnNZWEp0WDIxdlpHVnNKeWs3WEc1Y2JrRnNZWEp0UTI5c2JHVmpkR2x2YmlBOUlFSmhZMnRpYjI1bExrTnZiR3hsWTNScGIyNHVaWGgwWlc1a0tIdGNiaUFnYlc5a1pXdzZJRUZzWVhKdFRXOWtaV3dzWEc0Z0lHeHBibXRUYVdKc2FXNW5jem9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhSb2FYTXVaV0ZqYUNobWRXNWpkR2x2YmlBb2FHVmhaR1Z5TENCcGJtUmxlQ2tnZTF4dUlDQWdJQ0FnYUdWaFpHVnlMbkJ5WlhZZ1BTQjBhR2x6TG1GMEtHbHVaR1Y0SUMwZ01TazdYRzRnSUNBZ0lDQm9aV0ZrWlhJdWJtVjRkQ0E5SUhSb2FYTXVZWFFvYVc1a1pYZ2dLeUF4S1R0Y2JpQWdJQ0I5TENCMGFHbHpLVHRjYmlBZ2ZTeGNiaUFnWTI5dGNHRnlZWFJ2Y2pvZ1puVnVZM1JwYjI0Z0tHWnBjbk4wTENCelpXTnZibVFwSUh0Y2JpQWdJQ0JwWmlBb1ptbHljM1F1WjJWMEtDZGpjbWwwYVdOaGJDY3BLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdMVEU3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdjbVYwZFhKdUlERTdYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUVGc1lYSnRRMjlzYkdWamRHbHZianRjYmlKZGZRPT0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIEFsYXJtSGlzdG9yeTtcbnZhciBSZWFjdCAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgJCAgICAgICAgICAgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBCYWNrYm9uZSAgICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgY29uc3RhbnRzICAgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMnKTtcbnZhciBUciAgICAgICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvdHIuanN4Jyk7XG52YXIgVGQgICAgICAgICAgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL3RkLmpzeCcpO1xudmFyIFRhYnMgICAgICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy90YWJzLmpzeCcpO1xudmFyIEljb24gICAgICAgID0gcmVxdWlyZSgnLi9pY29uX3dyYXBwZXIuanN4Jyk7XG52YXIgbW9tZW50ICAgICAgPSByZXF1aXJlKCdtb21lbnQnKTtcblxuQWxhcm1IaXN0b3J5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkFsYXJtSGlzdG9yeVwiLFxuICBwcm9wVHlwZXM6IHtcbiAgICBjb2xsZWN0aW9uOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihCYWNrYm9uZS5Db2xsZWN0aW9uKS5pc1JlcXVpcmVkXG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLnByb3BzLmNvbGxlY3Rpb24sXG4gICAgICBmZXRjaGluZzogICBmYWxzZVxuICAgIH07XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zdGF0ZS5jb2xsZWN0aW9uLm9uKCdyZXF1ZXN0JywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCEgdGhpcy5pc01vdW50ZWQoKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe2ZldGNoaW5nOiB0cnVlfSk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICB0aGlzLnN0YXRlLmNvbGxlY3Rpb24ub24oJ3N5bmMnLCBmdW5jdGlvbiAoY29sbGVjdGlvbikge1xuICAgICAgaWYgKCEgdGhpcy5pc01vdW50ZWQoKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZmV0Y2hlciA9IGZhbHNlO1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgY29sbGVjdGlvbjogY29sbGVjdGlvbixcbiAgICAgICAgZmV0Y2hpbmc6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHRoaXMuZmV0Y2hlciA9IHRoaXMuc3RhdGUuY29sbGVjdGlvbi5mZXRjaCgpO1xuICB9LFxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc3RhdGUuY29sbGVjdGlvbi5vZmYobnVsbCwgbnVsbCwgdGhpcyk7XG5cbiAgICBpZiAodGhpcy5mZXRjaGVyKSB7XG4gICAgICB0aGlzLmZldGNoZXIuYWJvcnQoKTtcbiAgICB9XG4gIH0sXG4gIF9idWlsZFRhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZmV0Y2hpbmcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBudWxsLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwge2NvbFNwYW46IFwiM1wifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiBcImNpcmNsZS1vLW5vdGNoXCIsIHNwaW46IHRydWV9KSwgXCIgTG9hZGluZyBkYXRhIGZyb20gc2VydmVyLi4uXCJcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuY29sbGVjdGlvbi5tYXAoZnVuY3Rpb24gKG1vZGVsLCBpbmRleCkge1xuICAgICAgdmFyIG9kZCAgICAgPSBpbmRleCAlIDIgPyAnb2RkJyA6ICcnO1xuICAgICAgdmFyIGRhdGUgICAgPSBtb21lbnQobW9kZWwuZ2V0KCdkYXRlJykpLmZvcm1hdChjb25zdGFudHMuREFURV9GT1JNQVQpO1xuICAgICAgdmFyIHRpdGxlICAgPSBtb2RlbC5nZXQoJ3RpdGxlJyk7XG4gICAgICB2YXIgY29tbWVudCA9IG1vZGVsLmdldCgnY29tbWVudCcpO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwge2tleTogbW9kZWwuY2lkLCBjbGFzc05hbWU6IG9kZH0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCB7Y2xhc3NOYW1lOiBcImRhdGVmaWVsZFwifSwgZGF0ZSksIFwiLFwiLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgdGl0bGUpLCBcIixcIiwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIGNvbW1lbnQpXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSwgdGhpcyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBpdGVtcyA9IHRoaXMuX2J1aWxkVGFibGUoKTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge2NsYXNzTmFtZTogXCJmdWxsXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhlYWRcIiwgbnVsbCwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgbnVsbCwgXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7Y2xhc3NOYW1lOiBcImRhdGVmaWVsZFwifSwgXCJEYXRlXCIpLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJBY3Rpb25cIiksIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIkNvbW1lbnRzXCIpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRib2R5XCIsIG51bGwsIFxuICAgICAgICAgICAgaXRlbXNcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBbGFybUhpc3Rvcnk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZZV3hoY20xekwyRnNZWEp0WDJocGMzUnZjbmt1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPenRCUVVWQkxFZEJRVWM3TzBGQlJVZ3NTVUZCU1N4WlFVRlpMRU5CUVVNN1FVRkRha0lzU1VGQlNTeExRVUZMTEZOQlFWTXNUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8wRkJRMjVETEVsQlFVa3NRMEZCUXl4aFFVRmhMRTlCUVU4c1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEJRVU53UXl4SlFVRkpMRkZCUVZFc1RVRkJUU3hQUVVGUExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTTdRVUZEZEVNc1NVRkJTU3hUUVVGVExFdEJRVXNzVDBGQlR5eERRVUZETEdsQ1FVRnBRaXhEUVVGRExFTkJRVU03UVVGRE4wTXNTVUZCU1N4RlFVRkZMRmxCUVZrc1QwRkJUeXhEUVVGRExIbENRVUY1UWl4RFFVRkRMRU5CUVVNN1FVRkRja1FzU1VGQlNTeEZRVUZGTEZsQlFWa3NUMEZCVHl4RFFVRkRMSGxDUVVGNVFpeERRVUZETEVOQlFVTTdRVUZEY2tRc1NVRkJTU3hKUVVGSkxGVkJRVlVzVDBGQlR5eERRVUZETERKQ1FVRXlRaXhEUVVGRExFTkJRVU03UVVGRGRrUXNTVUZCU1N4SlFVRkpMRlZCUVZVc1QwRkJUeXhEUVVGRExHOUNRVUZ2UWl4RFFVRkRMRU5CUVVNN1FVRkRhRVFzU1VGQlNTeE5RVUZOTEZGQlFWRXNUMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE96dEJRVVZ3UXl4clEwRkJhME1zTkVKQlFVRTdSVUZEYUVNc1UwRkJVeXhGUVVGRk8wbEJRMVFzVlVGQlZTeEZRVUZGTEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1ZVRkJWU3hEUVVGRExGRkJRVkVzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXl4VlFVRlZPMGRCUTNaRk8wVkJRMFFzWlVGQlpTeEZRVUZGTEZsQlFWazdTVUZETTBJc1QwRkJUenROUVVOTUxGVkJRVlVzUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRlZCUVZVN1RVRkRha01zVVVGQlVTeEpRVUZKTEV0QlFVczdTMEZEYkVJc1EwRkJRenRIUVVOSU8wVkJRMFFzYVVKQlFXbENMRVZCUVVVc1dVRkJXVHRKUVVNM1FpeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRlZCUVZVc1EwRkJReXhGUVVGRkxFTkJRVU1zVTBGQlV5eEZRVUZGTEZsQlFWazdUVUZET1VNc1NVRkJTU3hGUVVGRkxFbEJRVWtzUTBGQlF5eFRRVUZUTEVWQlFVVXNSVUZCUlR0UlFVTjBRaXhQUVVGUExFdEJRVXNzUTBGQlF6dEJRVU55UWl4UFFVRlBPenROUVVWRUxFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4UlFVRlJMRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU4wUXl4TFFVRkxMRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU03TzBsQlJWUXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhWUVVGVkxFTkJRVU1zUlVGQlJTeERRVUZETEUxQlFVMHNSVUZCUlN4VlFVRlZMRlZCUVZVc1JVRkJSVHROUVVOeVJDeEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRk5CUVZNc1JVRkJSU3hGUVVGRk8xRkJRM1JDTEU5QlFVOHNTMEZCU3l4RFFVRkRPMEZCUTNKQ0xFOUJRVTg3TzBGQlJWQXNUVUZCVFN4SlFVRkpMRU5CUVVNc1QwRkJUeXhIUVVGSExFdEJRVXNzUTBGQlF6czdUVUZGY2tJc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF6dFJRVU5hTEZWQlFWVXNSVUZCUlN4VlFVRlZPMUZCUTNSQ0xGRkJRVkVzUlVGQlJTeExRVUZMTzA5QlEyaENMRU5CUVVNc1EwRkJRenRCUVVOVUxFdEJRVXNzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXpzN1NVRkZWQ3hKUVVGSkxFTkJRVU1zVDBGQlR5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1ZVRkJWU3hEUVVGRExFdEJRVXNzUlVGQlJTeERRVUZETzBkQlF6bERPMFZCUTBRc2IwSkJRVzlDTEVWQlFVVXNXVUZCV1R0QlFVTndReXhKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNWVUZCVlN4RFFVRkRMRWRCUVVjc1EwRkJReXhKUVVGSkxFVkJRVVVzU1VGQlNTeEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPenRKUVVVMVF5eEpRVUZKTEVsQlFVa3NRMEZCUXl4UFFVRlBMRVZCUVVVN1RVRkRhRUlzU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4TFFVRkxMRVZCUVVVc1EwRkJRenRMUVVOMFFqdEhRVU5HTzBWQlEwUXNWMEZCVnl4RlFVRkZMRmxCUVZrN1NVRkRka0lzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRkZCUVZFc1JVRkJSVHROUVVOMlFqdFJRVU5GTEc5Q1FVRkJMRWxCUVVjc1JVRkJRU3hKUVVGRExFVkJRVUU3VlVGRFJpeHZRa0ZCUVN4SlFVRkhMRVZCUVVFc1EwRkJRU3hEUVVGRExFOUJRVUVzUlVGQlR5eERRVUZETEVkQlFVa3NRMEZCUVN4RlFVRkJPMWxCUTJRc2IwSkJRVU1zU1VGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJReXhuUWtGQlFTeEZRVUZuUWl4RFFVRkRMRWxCUVVFc1JVRkJTU3hEUVVGRkxFbEJRVXNzUTBGQlFTeERRVUZITEVOQlFVRXNSVUZCUVN3NFFrRkJRVHRCUVVGQkxGVkJRM1pETEVOQlFVRTdVVUZEUml4RFFVRkJPMUZCUTB3N1FVRkRVaXhMUVVGTE96dEpRVVZFTEU5QlFVOHNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhWUVVGVkxFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFWVXNTMEZCU3l4RlFVRkZMRXRCUVVzc1JVRkJSVHROUVVOMlJDeEpRVUZKTEVkQlFVY3NUMEZCVHl4TFFVRkxMRWRCUVVjc1EwRkJReXhIUVVGSExFdEJRVXNzUjBGQlJ5eEZRVUZGTEVOQlFVTTdUVUZEY2tNc1NVRkJTU3hKUVVGSkxFMUJRVTBzVFVGQlRTeERRVUZETEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU1zUTBGQlF5eE5RVUZOTEVOQlFVTXNVMEZCVXl4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRE8wMUJRM1JGTEVsQlFVa3NTMEZCU3l4TFFVRkxMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdRVUZEZGtNc1RVRkJUU3hKUVVGSkxFOUJRVThzUjBGQlJ5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE96dE5RVVZ1UXp0UlFVTkZMRzlDUVVGQkxFbEJRVWNzUlVGQlFTeERRVUZCTEVOQlFVTXNSMEZCUVN4RlFVRkhMRU5CUVVVc1MwRkJTeXhEUVVGRExFZEJRVWNzUlVGQlF5eERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkZMRWRCUVVzc1EwRkJRU3hGUVVGQk8xVkJRMnhETEc5Q1FVRkJMRWxCUVVjc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNWMEZCV1N4RFFVRkJMRVZCUVVNc1NVRkJWU3hEUVVGQkxFVkJRVUVzUjBGQlFTeEZRVUZCTzBGQlFVRXNWVUZEY2tNc2IwSkJRVUVzU1VGQlJ5eEZRVUZCTEVsQlFVTXNSVUZCUXl4TFFVRlhMRU5CUVVFc1JVRkJRU3hIUVVGQkxFVkJRVUU3UVVGQlFTeFZRVU5vUWl4dlFrRkJRU3hKUVVGSExFVkJRVUVzU1VGQlF5eEZRVUZETEU5QlFXRXNRMEZCUVR0UlFVTm1MRU5CUVVFN1VVRkRURHRMUVVOSUxFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVTTdSMEZEVmp0RlFVTkVMRTFCUVUwc1JVRkJSU3haUVVGWk8wRkJRM1JDTEVsQlFVa3NTVUZCU1N4TFFVRkxMRWRCUVVjc1NVRkJTU3hEUVVGRExGZEJRVmNzUlVGQlJTeERRVUZET3p0SlFVVXZRanROUVVORkxHOUNRVUZCTEV0QlFVa3NSVUZCUVN4SlFVRkRMRVZCUVVFN1VVRkRTQ3h2UWtGQlFTeFBRVUZOTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExFMUJRVThzUTBGQlFTeEZRVUZCTzFWQlEzUkNMRzlDUVVGQkxFOUJRVTBzUlVGQlFTeEpRVUZETEVWQlFVRTdXVUZEVEN4dlFrRkJRU3hKUVVGSExFVkJRVUVzU1VGQlF5eEZRVUZCTzJOQlEwWXNiMEpCUVVFc1NVRkJSeXhGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4WFFVRlpMRU5CUVVFc1JVRkJRU3hOUVVGVExFTkJRVUVzUlVGQlFTeHZRa0ZCUVN4SlFVRkhMRVZCUVVFc1NVRkJReXhGUVVGQkxGRkJRVmNzUTBGQlFTeEZRVUZCTEc5Q1FVRkJMRWxCUVVjc1JVRkJRU3hKUVVGRExFVkJRVUVzVlVGQllTeERRVUZCTzFsQlEyaEZMRU5CUVVFN1ZVRkRReXhEUVVGQkxFVkJRVUU3VlVGRFVpeHZRa0ZCUVN4UFFVRk5MRVZCUVVFc1NVRkJReXhGUVVGQk8xbEJRMG9zUzBGQlRUdFZRVU5FTEVOQlFVRTdVVUZEUml4RFFVRkJPMDFCUTBvc1EwRkJRVHROUVVOT08wZEJRMGc3UVVGRFNDeERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEZsQlFWa3NRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFLbHh1SUNvZ1FHcHplQ0JTWldGamRDNUVUMDFjYmlBcUwxeHVYRzUyWVhJZ1FXeGhjbTFJYVhOMGIzSjVPMXh1ZG1GeUlGSmxZV04wSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duY21WaFkzUW5LVHRjYm5aaGNpQWtJQ0FnSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSjJweGRXVnllU2NwTzF4dWRtRnlJRUpoWTJ0aWIyNWxJQ0FnSUQwZ2NtVnhkV2x5WlNnblltRmphMkp2Ym1VbktUdGNiblpoY2lCamIyNXpkR0Z1ZEhNZ0lDQTlJSEpsY1hWcGNtVW9KeTR1THk0dUwyTnZibk4wWVc1MGN5Y3BPMXh1ZG1GeUlGUnlJQ0FnSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duTGk0dkxpNHZZMjl0Y0c5dVpXNTBjeTkwY2k1cWMzZ25LVHRjYm5aaGNpQlVaQ0FnSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dUx5NHVMMk52YlhCdmJtVnVkSE12ZEdRdWFuTjRKeWs3WEc1MllYSWdWR0ZpY3lBZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NjdUxpOHVMaTlqYjIxd2IyNWxiblJ6TDNSaFluTXVhbk40SnlrN1hHNTJZWElnU1dOdmJpQWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDY3VMMmxqYjI1ZmQzSmhjSEJsY2k1cWMzZ25LVHRjYm5aaGNpQnRiMjFsYm5RZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSjIxdmJXVnVkQ2NwTzF4dVhHNUJiR0Z5YlVocGMzUnZjbmtnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJSEJ5YjNCVWVYQmxjem9nZTF4dUlDQWdJR052Ykd4bFkzUnBiMjQ2SUZKbFlXTjBMbEJ5YjNCVWVYQmxjeTVwYm5OMFlXNWpaVTltS0VKaFkydGliMjVsTGtOdmJHeGxZM1JwYjI0cExtbHpVbVZ4ZFdseVpXUmNiaUFnZlN4Y2JpQWdaMlYwU1c1cGRHbGhiRk4wWVhSbE9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIdGNiaUFnSUNBZ0lHTnZiR3hsWTNScGIyNDZJSFJvYVhNdWNISnZjSE11WTI5c2JHVmpkR2x2Yml4Y2JpQWdJQ0FnSUdabGRHTm9hVzVuT2lBZ0lHWmhiSE5sWEc0Z0lDQWdmVHRjYmlBZ2ZTeGNiaUFnWTI5dGNHOXVaVzUwUkdsa1RXOTFiblE2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMGFHbHpMbk4wWVhSbExtTnZiR3hsWTNScGIyNHViMjRvSjNKbGNYVmxjM1FuTENCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQnBaaUFvSVNCMGFHbHpMbWx6VFc5MWJuUmxaQ2dwS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVHRjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaDdabVYwWTJocGJtYzZJSFJ5ZFdWOUtUdGNiaUFnSUNCOUxDQjBhR2x6S1R0Y2JseHVJQ0FnSUhSb2FYTXVjM1JoZEdVdVkyOXNiR1ZqZEdsdmJpNXZiaWduYzNsdVl5Y3NJR1oxYm1OMGFXOXVJQ2hqYjJ4c1pXTjBhVzl1S1NCN1hHNGdJQ0FnSUNCcFppQW9JU0IwYUdsekxtbHpUVzkxYm5SbFpDZ3BLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpUdGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR2hwY3k1bVpYUmphR1Z5SUQwZ1ptRnNjMlU3WEc1Y2JpQWdJQ0FnSUhSb2FYTXVjMlYwVTNSaGRHVW9lMXh1SUNBZ0lDQWdJQ0JqYjJ4c1pXTjBhVzl1T2lCamIyeHNaV04wYVc5dUxGeHVJQ0FnSUNBZ0lDQm1aWFJqYUdsdVp6b2dabUZzYzJWY2JpQWdJQ0FnSUgwcE8xeHVJQ0FnSUgwc0lIUm9hWE1wTzF4dVhHNGdJQ0FnZEdocGN5NW1aWFJqYUdWeUlEMGdkR2hwY3k1emRHRjBaUzVqYjJ4c1pXTjBhVzl1TG1abGRHTm9LQ2s3WEc0Z0lIMHNYRzRnSUdOdmJYQnZibVZ1ZEZkcGJHeFZibTF2ZFc1ME9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkR2hwY3k1emRHRjBaUzVqYjJ4c1pXTjBhVzl1TG05bVppaHVkV3hzTENCdWRXeHNMQ0IwYUdsektUdGNibHh1SUNBZ0lHbG1JQ2gwYUdsekxtWmxkR05vWlhJcElIdGNiaUFnSUNBZ0lIUm9hWE11Wm1WMFkyaGxjaTVoWW05eWRDZ3BPMXh1SUNBZ0lIMWNiaUFnZlN4Y2JpQWdYMkoxYVd4a1ZHRmliR1U2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCcFppQW9kR2hwY3k1emRHRjBaUzVtWlhSamFHbHVaeWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJQ0FnUEhSeVBseHVJQ0FnSUNBZ0lDQWdJRHgwWkNCamIyeFRjR0Z1UFZ3aU0xd2lQbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BFbGpiMjRnZEhsd1pUMWNJbU5wY21Oc1pTMXZMVzV2ZEdOb1hDSWdjM0JwYmoxN2RISjFaWDBnTHo0Z1RHOWhaR2x1WnlCa1lYUmhJR1p5YjIwZ2MyVnlkbVZ5TGk0dVhHNGdJQ0FnSUNBZ0lDQWdQQzkwWkQ1Y2JpQWdJQ0FnSUNBZ1BDOTBjajVjYmlBZ0lDQWdJQ2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11YzNSaGRHVXVZMjlzYkdWamRHbHZiaTV0WVhBb1puVnVZM1JwYjI0Z0tHMXZaR1ZzTENCcGJtUmxlQ2tnZTF4dUlDQWdJQ0FnZG1GeUlHOWtaQ0FnSUNBZ1BTQnBibVJsZUNBbElESWdQeUFuYjJSa0p5QTZJQ2NuTzF4dUlDQWdJQ0FnZG1GeUlHUmhkR1VnSUNBZ1BTQnRiMjFsYm5Rb2JXOWtaV3d1WjJWMEtDZGtZWFJsSnlrcExtWnZjbTFoZENoamIyNXpkR0Z1ZEhNdVJFRlVSVjlHVDFKTlFWUXBPMXh1SUNBZ0lDQWdkbUZ5SUhScGRHeGxJQ0FnUFNCdGIyUmxiQzVuWlhRb0ozUnBkR3hsSnlrN1hHNGdJQ0FnSUNCMllYSWdZMjl0YldWdWRDQTlJRzF2WkdWc0xtZGxkQ2duWTI5dGJXVnVkQ2NwTzF4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnSUNBOGRISWdhMlY1UFh0dGIyUmxiQzVqYVdSOUlHTnNZWE56VG1GdFpUMTdiMlJrZlQ1Y2JpQWdJQ0FnSUNBZ0lDQThkR1FnWTJ4aGMzTk9ZVzFsUFZ3aVpHRjBaV1pwWld4a1hDSStlMlJoZEdWOVBDOTBaRDRzWEc0Z0lDQWdJQ0FnSUNBZ1BIUmtQbnQwYVhSc1pYMDhMM1JrUGl4Y2JpQWdJQ0FnSUNBZ0lDQThkR1ErZTJOdmJXMWxiblI5UEM5MFpENWNiaUFnSUNBZ0lDQWdQQzkwY2o1Y2JpQWdJQ0FnSUNrN1hHNGdJQ0FnZlN3Z2RHaHBjeWs3WEc0Z0lIMHNYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQnBkR1Z0Y3lBOUlIUm9hWE11WDJKMWFXeGtWR0ZpYkdVb0tUdGNibHh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOFpHbDJQbHh1SUNBZ0lDQWdJQ0E4ZEdGaWJHVWdZMnhoYzNOT1lXMWxQVndpWm5Wc2JGd2lQbHh1SUNBZ0lDQWdJQ0FnSUR4MGFHVmhaRDVjYmlBZ0lDQWdJQ0FnSUNBZ0lEeDBjajVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdQSFJvSUdOc1lYTnpUbUZ0WlQxY0ltUmhkR1ZtYVdWc1pGd2lQa1JoZEdVOEwzUm9QangwYUQ1QlkzUnBiMjQ4TDNSb1BqeDBhRDVEYjIxdFpXNTBjend2ZEdnK1hHNGdJQ0FnSUNBZ0lDQWdJQ0E4TDNSeVBseHVJQ0FnSUNBZ0lDQWdJRHd2ZEdobFlXUStYRzRnSUNBZ0lDQWdJQ0FnUEhSaWIyUjVQbHh1SUNBZ0lDQWdJQ0FnSUNBZ2UybDBaVzF6ZlZ4dUlDQWdJQ0FnSUNBZ0lEd3ZkR0p2WkhrK1hHNGdJQ0FnSUNBZ0lEd3ZkR0ZpYkdVK1hHNGdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQXBPMXh1SUNCOVhHNTlLVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCQmJHRnliVWhwYzNSdmNuazdYRzRpWFgwPSIsInZhciBBbGFybUhpc3RvcnlDb2xsZWN0aW9uO1xudmFyIEJhY2tib25lICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG5cbkFsYXJtSGlzdG9yeUNvbGxlY3Rpb24gPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gIGZldGNoOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXQoW1xuICAgICAge1xuICAgICAgICBkYXRlOiAgICAgbmV3IERhdGUoKSxcbiAgICAgICAgdGl0bGU6ICAgICdKb2UgU21pdGggZXhlY3V0ZWQgYSBjYWxsJyxcbiAgICAgICAgY29tbWVudDogICdUaGlzIGlzIGp1c3QgYSBjb21tZW50J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZGF0ZTogICAgIG5ldyBEYXRlKCksXG4gICAgICAgIHRpdGxlOiAgICAnQWxhcm0gY3JlYXRlZCBieSB1c2VyJyxcbiAgICAgICAgY29tbWVudDogICcnXG4gICAgICB9XG4gICAgXSk7XG5cbiAgICB0aGlzLnRyaWdnZXIoJ3JlcXVlc3QnKTtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy50cmlnZ2VyKCdzeW5jJywgdGhpcyk7XG4gICAgfS5iaW5kKHRoaXMpLCAxMDAwKTtcbiAgfSxcbiAgdXJsOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBbGFybUhpc3RvcnlDb2xsZWN0aW9uO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WVd4aGNtMXpMMkZzWVhKdFgyaHBjM1J2Y25sZlkyOXNiR1ZqZEdsdmJpNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4SlFVRkpMSE5DUVVGelFpeERRVUZETzBGQlF6TkNMRWxCUVVrc1VVRkJVU3hKUVVGSkxFOUJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXpzN1FVRkZjRU1zYzBKQlFYTkNMRWRCUVVjc1VVRkJVU3hEUVVGRExGVkJRVlVzUTBGQlF5eE5RVUZOTEVOQlFVTTdSVUZEYkVRc1MwRkJTeXhGUVVGRkxGbEJRVms3U1VGRGFrSXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJRenROUVVOUU8xRkJRMFVzU1VGQlNTeE5RVUZOTEVsQlFVa3NTVUZCU1N4RlFVRkZPMUZCUTNCQ0xFdEJRVXNzUzBGQlN5d3lRa0ZCTWtJN1VVRkRja01zVDBGQlR5eEhRVUZITEhkQ1FVRjNRanRQUVVOdVF6dE5RVU5FTzFGQlEwVXNTVUZCU1N4TlFVRk5MRWxCUVVrc1NVRkJTU3hGUVVGRk8xRkJRM0JDTEV0QlFVc3NTMEZCU3l4MVFrRkJkVUk3VVVGRGFrTXNUMEZCVHl4SFFVRkhMRVZCUVVVN1QwRkRZanRCUVVOUUxFdEJRVXNzUTBGQlF5eERRVUZET3p0QlFVVlFMRWxCUVVrc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXpzN1NVRkZlRUlzVlVGQlZTeERRVUZETEZsQlFWazdUVUZEY2tJc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eE5RVUZOTEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN1MwRkROVUlzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU03UjBGRGNrSTdSVUZEUkN4SFFVRkhMRVZCUVVVc1dVRkJXVHRKUVVObUxFOUJRVThzUlVGQlJTeERRVUZETzBkQlExZzdRVUZEU0N4RFFVRkRMRU5CUVVNc1EwRkJRenM3UVVGRlNDeE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMSE5DUVVGelFpeERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWRtRnlJRUZzWVhKdFNHbHpkRzl5ZVVOdmJHeGxZM1JwYjI0N1hHNTJZWElnUW1GamEySnZibVVnSUQwZ2NtVnhkV2x5WlNnblltRmphMkp2Ym1VbktUdGNibHh1UVd4aGNtMUlhWE4wYjNKNVEyOXNiR1ZqZEdsdmJpQTlJRUpoWTJ0aWIyNWxMa052Ykd4bFkzUnBiMjR1WlhoMFpXNWtLSHRjYmlBZ1ptVjBZMmc2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMGFHbHpMbk5sZENoYlhHNGdJQ0FnSUNCN1hHNGdJQ0FnSUNBZ0lHUmhkR1U2SUNBZ0lDQnVaWGNnUkdGMFpTZ3BMRnh1SUNBZ0lDQWdJQ0IwYVhSc1pUb2dJQ0FnSjBwdlpTQlRiV2wwYUNCbGVHVmpkWFJsWkNCaElHTmhiR3duTEZ4dUlDQWdJQ0FnSUNCamIyMXRaVzUwT2lBZ0oxUm9hWE1nYVhNZ2FuVnpkQ0JoSUdOdmJXMWxiblFuWEc0Z0lDQWdJQ0I5TEZ4dUlDQWdJQ0FnZTF4dUlDQWdJQ0FnSUNCa1lYUmxPaUFnSUNBZ2JtVjNJRVJoZEdVb0tTeGNiaUFnSUNBZ0lDQWdkR2wwYkdVNklDQWdJQ2RCYkdGeWJTQmpjbVZoZEdWa0lHSjVJSFZ6WlhJbkxGeHVJQ0FnSUNBZ0lDQmpiMjF0Wlc1ME9pQWdKeWRjYmlBZ0lDQWdJSDFjYmlBZ0lDQmRLVHRjYmx4dUlDQWdJSFJvYVhNdWRISnBaMmRsY2lnbmNtVnhkV1Z6ZENjcE8xeHVYRzRnSUNBZ2MyVjBWR2x0Wlc5MWRDaG1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhJb0ozTjVibU1uTENCMGFHbHpLVHRjYmlBZ0lDQjlMbUpwYm1Rb2RHaHBjeWtzSURFd01EQXBPMXh1SUNCOUxGeHVJQ0IxY213NklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z0p5YzdYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUVGc1lYSnRTR2x6ZEc5eWVVTnZiR3hsWTNScGIyNDdYRzRpWFgwPSIsInZhciBBbGFybU1vZGVsO1xudmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcblxuQWxhcm1Nb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7fSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQWxhcm1Nb2RlbDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdllXeGhjbTF6TDJGc1lYSnRYMjF2WkdWc0xtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVa3NWVUZCVlN4RFFVRkRPMEZCUTJZc1NVRkJTU3hSUVVGUkxFZEJRVWNzVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPenRCUVVWdVF5eFZRVUZWTEVkQlFVY3NVVUZCVVN4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zUlVGQlJTeERRVUZETEVOQlFVTTdPMEZCUlhaRExFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NWVUZCVlN4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpZG1GeUlFRnNZWEp0VFc5a1pXdzdYRzUyWVhJZ1FtRmphMkp2Ym1VZ1BTQnlaWEYxYVhKbEtDZGlZV05yWW05dVpTY3BPMXh1WEc1QmJHRnliVTF2WkdWc0lEMGdRbUZqYTJKdmJtVXVUVzlrWld3dVpYaDBaVzVrS0h0OUtUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JCYkdGeWJVMXZaR1ZzTzF4dUlsMTkiLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIEFuZE9yU2VsZWN0b3I7XG52YXIgdHlwZXNfbWFwID0ge307XG52YXIgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBJY29uICAgICAgPSByZXF1aXJlKCcuL2ljb25fd3JhcHBlci5qc3gnKTtcbnZhciBEcm9wZG93biAgPSByZXF1aXJlKCcuL2Ryb3Bkb3duLmpzeCcpO1xudmFyIEFORF9WQUxVRSA9ICdhbmQnO1xudmFyIE9SX1ZBTFVFICA9ICdvcidcblxudHlwZXNfbWFwW0FORF9WQUxVRV0gPSAnYWxsJztcbnR5cGVzX21hcFtPUl9WQUxVRV0gID0gJ2FueSc7XG5cbkFuZE9yU2VsZWN0b3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQW5kT3JTZWxlY3RvclwiLFxuICBzdGF0aWNzOiB7XG4gICAgQU5EOiAgQU5EX1ZBTFVFLFxuICAgIE9SOiAgIE9SX1ZBTFVFXG4gIH0sXG4gIG1peGluczogW1JlYWN0LmFkZG9ucy5QdXJlUmVuZGVyTWl4aW5dLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZWRpdGluZzogZmFsc2VcbiAgICB9O1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogQU5EX1ZBTFVFXG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGN1cnJlbnQgICA9IHR5cGVzX21hcFt0aGlzLnByb3BzLnR5cGVdO1xuICAgIHZhciBjb250ZW50cyAgPSB0aGlzLnN0YXRlLmVkaXRpbmcgPyB0aGlzLl9idWlsZEVkaXRvcigpIDogKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIG51bGwsIGN1cnJlbnQpLCBcIjpcIikpO1xuICAgIHZhciBwcm9wcztcblxuICAgIHByb3BzID0ge1xuICAgICAgY2xhc3NOYW1lOiAgICAnY2hhaW4gYW5kLW9yJyxcbiAgICAgIG9uTW91c2VMZWF2ZTogdGhpcy5faGFuZGxlTW91c2VMZWF2ZSxcbiAgICAgIG9uQ2xpY2s6ICAgICAgdGhpcy5fdG9nZ2xlRWRpdGluZ1xuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgUmVhY3QuX19zcHJlYWQoe30sICBwcm9wcyksIFxuICAgICAgICBjb250ZW50c1xuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIF9idWlsZEVkaXRvcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9wcztcbiAgICB2YXIgY2hvaWNlcyA9IFtcbiAgICAgIHt0ZXh0OiB0eXBlc19tYXBbQU5EX1ZBTFVFXSwgdmFsdWU6IEFORF9WQUxVRX0sXG4gICAgICB7dGV4dDogdHlwZXNfbWFwW09SX1ZBTFVFXSwgdmFsdWU6IE9SX1ZBTFVFfVxuICAgIF07XG5cbiAgICBwcm9wcyA9IHtcbiAgICAgIHJlZjogICAgICAnZHJvcGRvd24nLFxuICAgICAgdGhlbWU6ICAgICdsaWdodCcsXG4gICAgICBzZWxlY3RlZDogdHlwZXNfbWFwW3RoaXMucHJvcHMudHlwZV0sXG4gICAgICBjaG9pY2VzOiAgY2hvaWNlcyxcbiAgICAgIG9uQ2hvaWNlOiB0aGlzLl9oYW5kbGVTZWxlY3Rpb24sXG4gICAgICBvcGVuOiAgICAgdHJ1ZVxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChEcm9wZG93biwgUmVhY3QuX19zcHJlYWQoe30sICBwcm9wcykpXG4gICAgKTtcbiAgfSxcbiAgX2VuZEVkaXRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtlZGl0aW5nOiBmYWxzZX0pO1xuICB9LFxuICBfaGFuZGxlTW91c2VMZWF2ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX2VuZEVkaXRpbmcoKTtcbiAgfSxcbiAgX3RvZ2dsZUVkaXRpbmc6IGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtlZGl0aW5nOiAhIHRoaXMuc3RhdGUuZWRpdGluZ30pO1xuICB9LFxuICBfaGFuZGxlT3JTZWxlY3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9oYW5kbGVTZWxlY3Rpb24oT1JfVkFMVUUpO1xuICB9LFxuICBfaGFuZGxlQW5kU2VsZWN0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5faGFuZGxlU2VsZWN0aW9uKEFORF9WQUxVRSk7XG4gIH0sXG4gIF9oYW5kbGVTZWxlY3Rpb246IGZ1bmN0aW9uIChjaG9pY2UpIHtcbiAgICB0aGlzLl9lbmRFZGl0aW5nKCk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5vbkNoYW5nZSkge1xuICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShjaG9pY2UpO1xuICAgIH1cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQW5kT3JTZWxlY3RvcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdllXeGhjbTF6TDJGdVpGOXZjbDl6Wld4bFkzUnZjaTVxYzNnaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRTdPMEZCUlVFc1IwRkJSenM3UVVGRlNDeEpRVUZKTEdGQlFXRXNRMEZCUXp0QlFVTnNRaXhKUVVGSkxGTkJRVk1zUjBGQlJ5eEZRVUZGTEVOQlFVTTdRVUZEYmtJc1NVRkJTU3hMUVVGTExFOUJRVThzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUTJwRExFbEJRVWtzU1VGQlNTeFJRVUZSTEU5QlFVOHNRMEZCUXl4dlFrRkJiMElzUTBGQlF5eERRVUZETzBGQlF6bERMRWxCUVVrc1VVRkJVU3hKUVVGSkxFOUJRVThzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhEUVVGRE8wRkJRekZETEVsQlFVa3NVMEZCVXl4SFFVRkhMRXRCUVVzc1EwRkJRenRCUVVOMFFpeEpRVUZKTEZGQlFWRXNTVUZCU1N4SlFVRkpPenRCUVVWd1FpeFRRVUZUTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWRCUVVjc1MwRkJTeXhEUVVGRE8wRkJRemRDTEZOQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1NVRkJTU3hMUVVGTExFTkJRVU03TzBGQlJUZENMRzFEUVVGdFF5dzJRa0ZCUVR0RlFVTnFReXhQUVVGUExFVkJRVVU3U1VGRFVDeEhRVUZITEVkQlFVY3NVMEZCVXp0SlFVTm1MRVZCUVVVc1NVRkJTU3hSUVVGUk8wZEJRMlk3UlVGRFJDeE5RVUZOTEVWQlFVVXNRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExHVkJRV1VzUTBGQlF6dEZRVU4wUXl4bFFVRmxMRVZCUVVVc1dVRkJXVHRKUVVNelFpeFBRVUZQTzAxQlEwd3NUMEZCVHl4RlFVRkZMRXRCUVVzN1MwRkRaaXhEUVVGRE8wZEJRMGc3UlVGRFJDeGxRVUZsTEVWQlFVVXNXVUZCV1R0SlFVTXpRaXhQUVVGUE8wMUJRMHdzU1VGQlNTeEZRVUZGTEZOQlFWTTdTMEZEYUVJc1EwRkJRenRIUVVOSU8wVkJRMFFzVFVGQlRTeEZRVUZGTEZsQlFWazdTVUZEYkVJc1NVRkJTU3hQUVVGUExFdEJRVXNzVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03U1VGRE0wTXNTVUZCU1N4UlFVRlJMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVkQlFVY3NTVUZCU1N4RFFVRkRMRmxCUVZrc1JVRkJSU3hKUVVGSkxHOUNRVUZCTEUxQlFVc3NSVUZCUVN4SlFVRkRMRVZCUVVFc2IwSkJRVUVzUjBGQlJTeEZRVUZCTEVsQlFVTXNSVUZCUXl4UFFVRlpMRU5CUVVFc1JVRkJRU3hIUVVGUkxFTkJRVUVzUTBGQlF5eERRVUZETzBGQlEyaEhMRWxCUVVrc1NVRkJTU3hMUVVGTExFTkJRVU03TzBsQlJWWXNTMEZCU3l4SFFVRkhPMDFCUTA0c1UwRkJVeXhMUVVGTExHTkJRV003VFVGRE5VSXNXVUZCV1N4RlFVRkZMRWxCUVVrc1EwRkJReXhwUWtGQmFVSTdUVUZEY0VNc1QwRkJUeXhQUVVGUExFbEJRVWtzUTBGQlF5eGpRVUZqTzBGQlEzWkRMRXRCUVVzc1EwRkJRenM3U1VGRlJqdE5RVU5GTEc5Q1FVRkJMRTFCUVVzc1JVRkJRU3huUWtGQlFTeEhRVUZCTEVOQlFVVXNSMEZCUnl4TFFVRlBMRU5CUVVFc1JVRkJRVHRSUVVOa0xGRkJRVk03VFVGRFRDeERRVUZCTzAxQlExQTdSMEZEU0R0RlFVTkVMRmxCUVZrc1JVRkJSU3haUVVGWk8wbEJRM2hDTEVsQlFVa3NTMEZCU3l4RFFVRkRPMGxCUTFZc1NVRkJTU3hQUVVGUExFZEJRVWM3VFVGRFdpeERRVUZETEVsQlFVa3NSVUZCUlN4VFFVRlRMRU5CUVVNc1UwRkJVeXhEUVVGRExFVkJRVVVzUzBGQlN5eEZRVUZGTEZOQlFWTXNRMEZCUXp0TlFVTTVReXhEUVVGRExFbEJRVWtzUlVGQlJTeFRRVUZUTEVOQlFVTXNVVUZCVVN4RFFVRkRMRVZCUVVVc1MwRkJTeXhGUVVGRkxGRkJRVkVzUTBGQlF6dEJRVU5zUkN4TFFVRkxMRU5CUVVNN08wbEJSVVlzUzBGQlN5eEhRVUZITzAxQlEwNHNSMEZCUnl4UFFVRlBMRlZCUVZVN1RVRkRjRUlzUzBGQlN5eExRVUZMTEU5QlFVODdUVUZEYWtJc1VVRkJVU3hGUVVGRkxGTkJRVk1zUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1EwRkJRenROUVVOd1F5eFBRVUZQTEVkQlFVY3NUMEZCVHp0TlFVTnFRaXhSUVVGUkxFVkJRVVVzU1VGQlNTeERRVUZETEdkQ1FVRm5RanROUVVNdlFpeEpRVUZKTEUxQlFVMHNTVUZCU1R0QlFVTndRaXhMUVVGTExFTkJRVU03TzBsQlJVWTdUVUZEUlN4dlFrRkJReXhSUVVGUkxFVkJRVUVzWjBKQlFVRXNSMEZCUVN4RFFVRkZMRWRCUVVjc1MwRkJUU3hEUVVGQkxFTkJRVWNzUTBGQlFUdE5RVU4yUWp0SFFVTklPMFZCUTBRc1YwRkJWeXhGUVVGRkxGbEJRVms3U1VGRGRrSXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExFOUJRVThzUlVGQlJTeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRPMGRCUTJwRE8wVkJRMFFzYVVKQlFXbENMRVZCUVVVc1dVRkJXVHRKUVVNM1FpeEpRVUZKTEVOQlFVTXNWMEZCVnl4RlFVRkZMRU5CUVVNN1IwRkRjRUk3UlVGRFJDeGpRVUZqTEVWQlFVVXNWVUZCVlN4RFFVRkRMRVZCUVVVN1NVRkRNMElzUTBGQlF5eERRVUZETEdOQlFXTXNSVUZCUlN4RFFVRkRPMEZCUTNaQ0xFbEJRVWtzUTBGQlF5eERRVUZETEdWQlFXVXNSVUZCUlN4RFFVRkRPenRKUVVWd1FpeEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNc1QwRkJUeXhGUVVGRkxFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVGRE8wZEJRMmhFTzBWQlEwUXNhMEpCUVd0Q0xFVkJRVVVzV1VGQldUdEpRVU01UWl4SlFVRkpMRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1IwRkRha003UlVGRFJDeHRRa0ZCYlVJc1JVRkJSU3haUVVGWk8wbEJReTlDTEVsQlFVa3NRMEZCUXl4blFrRkJaMElzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0SFFVTnNRenRGUVVORUxHZENRVUZuUWl4RlFVRkZMRlZCUVZVc1RVRkJUU3hGUVVGRk8wRkJRM1JETEVsQlFVa3NTVUZCU1N4RFFVRkRMRmRCUVZjc1JVRkJSU3hEUVVGRE96dEpRVVZ1UWl4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVVVGQlVTeEZRVUZGTzAxQlEzWkNMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVVVGQlVTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMHRCUXpkQ08wZEJRMFk3UVVGRFNDeERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEdGQlFXRXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFLbHh1SUNvZ1FHcHplQ0JTWldGamRDNUVUMDFjYmlBcUwxeHVYRzUyWVhJZ1FXNWtUM0pUWld4bFkzUnZjanRjYm5aaGNpQjBlWEJsYzE5dFlYQWdQU0I3ZlR0Y2JuWmhjaUJTWldGamRDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQ2NwTzF4dWRtRnlJRWxqYjI0Z0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dmFXTnZibDkzY21Gd2NHVnlMbXB6ZUNjcE8xeHVkbUZ5SUVSeWIzQmtiM2R1SUNBOUlISmxjWFZwY21Vb0p5NHZaSEp2Y0dSdmQyNHVhbk40SnlrN1hHNTJZWElnUVU1RVgxWkJURlZGSUQwZ0oyRnVaQ2M3WEc1MllYSWdUMUpmVmtGTVZVVWdJRDBnSjI5eUoxeHVYRzUwZVhCbGMxOXRZWEJiUVU1RVgxWkJURlZGWFNBOUlDZGhiR3duTzF4dWRIbHdaWE5mYldGd1cwOVNYMVpCVEZWRlhTQWdQU0FuWVc1NUp6dGNibHh1UVc1a1QzSlRaV3hsWTNSdmNpQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ2MzUmhkR2xqY3pvZ2UxeHVJQ0FnSUVGT1JEb2dJRUZPUkY5V1FVeFZSU3hjYmlBZ0lDQlBVam9nSUNCUFVsOVdRVXhWUlZ4dUlDQjlMRnh1SUNCdGFYaHBibk02SUZ0U1pXRmpkQzVoWkdSdmJuTXVVSFZ5WlZKbGJtUmxjazFwZUdsdVhTeGNiaUFnWjJWMFNXNXBkR2xoYkZOMFlYUmxPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSHRjYmlBZ0lDQWdJR1ZrYVhScGJtYzZJR1poYkhObFhHNGdJQ0FnZlR0Y2JpQWdmU3hjYmlBZ1oyVjBSR1ZtWVhWc2RGQnliM0J6T2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUh0Y2JpQWdJQ0FnSUhSNWNHVTZJRUZPUkY5V1FVeFZSVnh1SUNBZ0lIMDdYRzRnSUgwc1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCamRYSnlaVzUwSUNBZ1BTQjBlWEJsYzE5dFlYQmJkR2hwY3k1d2NtOXdjeTUwZVhCbFhUdGNiaUFnSUNCMllYSWdZMjl1ZEdWdWRITWdJRDBnZEdocGN5NXpkR0YwWlM1bFpHbDBhVzVuSUQ4Z2RHaHBjeTVmWW5WcGJHUkZaR2wwYjNJb0tTQTZJQ2c4YzNCaGJqNDhZVDU3WTNWeWNtVnVkSDA4TDJFK09qd3ZjM0JoYmo0cE8xeHVJQ0FnSUhaaGNpQndjbTl3Y3p0Y2JseHVJQ0FnSUhCeWIzQnpJRDBnZTF4dUlDQWdJQ0FnWTJ4aGMzTk9ZVzFsT2lBZ0lDQW5ZMmhoYVc0Z1lXNWtMVzl5Snl4Y2JpQWdJQ0FnSUc5dVRXOTFjMlZNWldGMlpUb2dkR2hwY3k1ZmFHRnVaR3hsVFc5MWMyVk1aV0YyWlN4Y2JpQWdJQ0FnSUc5dVEyeHBZMnM2SUNBZ0lDQWdkR2hwY3k1ZmRHOW5aMnhsUldScGRHbHVaMXh1SUNBZ0lIMDdYRzVjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BITndZVzRnZXk0dUxuQnliM0J6ZlQ1Y2JpQWdJQ0FnSUNBZ2UyTnZiblJsYm5SemZWeHVJQ0FnSUNBZ1BDOXpjR0Z1UGx4dUlDQWdJQ2s3WEc0Z0lIMHNYRzRnSUY5aWRXbHNaRVZrYVhSdmNqb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCd2NtOXdjenRjYmlBZ0lDQjJZWElnWTJodmFXTmxjeUE5SUZ0Y2JpQWdJQ0FnSUh0MFpYaDBPaUIwZVhCbGMxOXRZWEJiUVU1RVgxWkJURlZGWFN3Z2RtRnNkV1U2SUVGT1JGOVdRVXhWUlgwc1hHNGdJQ0FnSUNCN2RHVjRkRG9nZEhsd1pYTmZiV0Z3VzA5U1gxWkJURlZGWFN3Z2RtRnNkV1U2SUU5U1gxWkJURlZGZlZ4dUlDQWdJRjA3WEc1Y2JpQWdJQ0J3Y205d2N5QTlJSHRjYmlBZ0lDQWdJSEpsWmpvZ0lDQWdJQ0FuWkhKdmNHUnZkMjRuTEZ4dUlDQWdJQ0FnZEdobGJXVTZJQ0FnSUNkc2FXZG9kQ2NzWEc0Z0lDQWdJQ0J6Wld4bFkzUmxaRG9nZEhsd1pYTmZiV0Z3VzNSb2FYTXVjSEp2Y0hNdWRIbHdaVjBzWEc0Z0lDQWdJQ0JqYUc5cFkyVnpPaUFnWTJodmFXTmxjeXhjYmlBZ0lDQWdJRzl1UTJodmFXTmxPaUIwYUdsekxsOW9ZVzVrYkdWVFpXeGxZM1JwYjI0c1hHNGdJQ0FnSUNCdmNHVnVPaUFnSUNBZ2RISjFaVnh1SUNBZ0lIMDdYRzVjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BFUnliM0JrYjNkdUlIc3VMaTV3Y205d2MzMGdMejVjYmlBZ0lDQXBPMXh1SUNCOUxGeHVJQ0JmWlc1a1JXUnBkR2x1WnpvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTJWa2FYUnBibWM2SUdaaGJITmxmU2s3WEc0Z0lIMHNYRzRnSUY5b1lXNWtiR1ZOYjNWelpVeGxZWFpsT2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2RHaHBjeTVmWlc1a1JXUnBkR2x1WnlncE8xeHVJQ0I5TEZ4dUlDQmZkRzluWjJ4bFJXUnBkR2x1WnpvZ1puVnVZM1JwYjI0Z0tHVXBJSHRjYmlBZ0lDQmxMbkJ5WlhabGJuUkVaV1poZFd4MEtDazdYRzRnSUNBZ1pTNXpkRzl3VUhKdmNHRm5ZWFJwYjI0b0tUdGNibHh1SUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTJWa2FYUnBibWM2SUNFZ2RHaHBjeTV6ZEdGMFpTNWxaR2wwYVc1bmZTazdYRzRnSUgwc1hHNGdJRjlvWVc1a2JHVlBjbE5sYkdWamRHbHZiam9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhSb2FYTXVYMmhoYm1Sc1pWTmxiR1ZqZEdsdmJpaFBVbDlXUVV4VlJTazdYRzRnSUgwc1hHNGdJRjlvWVc1a2JHVkJibVJUWld4bFkzUnBiMjQ2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMGFHbHpMbDlvWVc1a2JHVlRaV3hsWTNScGIyNG9RVTVFWDFaQlRGVkZLVHRjYmlBZ2ZTeGNiaUFnWDJoaGJtUnNaVk5sYkdWamRHbHZiam9nWm5WdVkzUnBiMjRnS0dOb2IybGpaU2tnZTF4dUlDQWdJSFJvYVhNdVgyVnVaRVZrYVhScGJtY29LVHRjYmx4dUlDQWdJR2xtSUNoMGFHbHpMbkJ5YjNCekxtOXVRMmhoYm1kbEtTQjdYRzRnSUNBZ0lDQjBhR2x6TG5CeWIzQnpMbTl1UTJoaGJtZGxLR05vYjJsalpTazdYRzRnSUNBZ2ZWeHVJQ0I5WEc1OUtUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JCYm1SUGNsTmxiR1ZqZEc5eU8xeHVJbDE5IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBBdXRvY29tcGxldGU7XG52YXIga2V5TWFwO1xudmFyICQgICAgICAgICAgID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgUmVhY3QgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEJhY2tib25lICAgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBCdXR0b24gICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvYnV0dG9uLmpzeCcpO1xudmFyIERyb3Bkb3duICAgID0gcmVxdWlyZSgnLi9kcm9wZG93bi5qc3gnKTtcbnZhciBfICAgICAgICAgICA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciBIb3RrZXlzICAgICA9IHJlcXVpcmUoJ3JlYWN0LWhvdGtleXMnKS5Ib3RLZXlzO1xuXG5rZXlNYXAgPSB7XG4gICdtb3ZlVXAnOiAgICd1cCcsXG4gICdtb3ZlRG93bic6ICdkb3duJyxcbiAgJ3NlbGVjdCc6ICAgJ2VudGVyJ1xufTtcblxuZnVuY3Rpb24gZGV0ZXJtaW5lVmFsdWUgKHZhbHVlLCBtdWx0aSkge1xuICBpZiAobXVsdGkpIHtcbiAgICByZXR1cm4gZGV0ZXJtaW5lTXVsdGlWYWx1ZXModmFsdWUpO1xuICB9XG5cbiAgcmV0dXJuIGRldGVybWluZVNpbmdsZVZhbHVlKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gZGV0ZXJtaW5lTXVsdGlWYWx1ZXMgKHZhbHVlcykge1xuICBpZiAoISBBcnJheS5pc0FycmF5KHZhbHVlcykpIHtcbiAgICB2YWx1ZXMgPSBbdmFsdWVzXTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZXM7XG59XG5cbmZ1bmN0aW9uIGRldGVybWluZVNpbmdsZVZhbHVlICh2YWx1ZSkge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICB0aHJvdyAnRXhwZWN0ZWQgJyArIHZhbHVlICsgJyB0byBub3QgYmUgYW4gQXJyYXknO1xuICB9XG5cbiAgaWYgKF8uaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFsdWUgPSB7dGV4dDogdmFsdWV9O1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5BdXRvY29tcGxldGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQXV0b2NvbXBsZXRlXCIsXG4gIHN0YXRpY3M6IHtcbiAgICBkZXRlcm1pbmVWYWx1ZTogZGV0ZXJtaW5lVmFsdWVcbiAgfSxcbiAgcHJvcFR5cGVzOiB7XG4gICAgZWRpdGluZzogICAgUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgbXVsdGk6ICAgICAgUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgb3B0aW9uczogICAgUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuICAgIGdlbmVyYXRvcjogIFJlYWN0LlByb3BUeXBlcy5mdW5jXG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZSA9IEF1dG9jb21wbGV0ZS5kZXRlcm1pbmVWYWx1ZSh0aGlzLnByb3BzLnZhbHVlLCB0aGlzLnByb3BzLm11bHRpKTtcblxuICAgIHJldHVybiB7XG4gICAgICBlZGl0aW5nOiAgICB0aGlzLnByb3BzLmVkaXRpbmcsXG4gICAgICB2YWx1ZTogICAgICB2YWx1ZSxcbiAgICAgIHRleHRWYWx1ZTogICh2YWx1ZSAmJiB2YWx1ZS50ZXh0KSB8fCAnJyxcbiAgICAgIGFjdGl2ZTogICAgIG51bGwsXG4gICAgICBvcHRpb25zOiAgICB0aGlzLnByb3BzLm9wdGlvbnNcbiAgICB9O1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZWRpdGluZzogICAgZmFsc2UsXG4gICAgICBtdWx0aTogICAgICBmYWxzZSxcbiAgICAgIG9wdGlvbnM6ICAgIFtdLFxuICAgICAgZ2VuZXJhdG9yOiAgbnVsbFxuICAgIH07XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mb2N1c1NlYXJjaCgpO1xuICB9LFxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZvY3VzU2VhcmNoKCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zO1xuICAgIHZhciBoYW5kbGVycyA9IHtcbiAgICAgIG1vdmVVcDogICB0aGlzLm1vdmVVcCxcbiAgICAgIG1vdmVEb3duOiB0aGlzLm1vdmVEb3duLFxuICAgICAgc2VsZWN0OiAgIHRoaXMuc2VsZWN0SXRlbVxuICAgIH07XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5lZGl0aW5nKSB7XG4gICAgICBvcHRpb25zID0gdGhpcy5idWlsZE9wdGlvbnMoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChIb3RrZXlzLCB7a2V5TWFwOiBrZXlNYXAsIGhhbmRsZXJzOiBoYW5kbGVyc30sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZnYtYXV0b2NvbXBsZXRlXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3JlZjogXCJpbnB1dFwiLCBjbGFzc05hbWU6IFwiaW5wdXRhYmxlXCIsIHR5cGU6IFwidGV4dFwiLCBwbGFjZWhvbGRlcjogXCJzZWFyY2ggY3JpdGVyaWFcIiwgcmVmOiBcImlucHV0XCIsIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZUNoYW5nZSwgZGVmYXVsdFZhbHVlOiB0aGlzLnN0YXRlLnRleHRWYWx1ZX0pLCBcbiAgICAgICAgICBvcHRpb25zXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBidWlsZE9wdGlvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMuc3RhdGUub3B0aW9ucztcbiAgICB2YXIgdGV4dCAgICA9IHRoaXMuc3RhdGUudGV4dFZhbHVlO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuZ2VuZXJhdG9yKSB7XG4gICAgICBvcHRpb25zID0gdGhpcy5wcm9wcy5nZW5lcmF0b3IodGhpcy5zdGF0ZS50ZXh0VmFsdWUpO1xuICAgIH1cblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IFtdO1xuICAgIG9wdGlvbnMgPSBvcHRpb25zLm1hcChmdW5jdGlvbiAob3B0aW9uLCBpbmRleCkge1xuICAgICAgdmFyIGNsYXNzZXMgPSBbJ29wdGlvbicsICdzZWxlY3RhYmxlJ107XG5cbiAgICAgIGNsYXNzZXMucHVzaCgnYWN0aXZlLScgKyAoaW5kZXggPT09IHRoaXMuc3RhdGUuYWN0aXZlKSk7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7a2V5OiBpbmRleCwgY2xhc3NOYW1lOiBjbGFzc2VzLmpvaW4oJyAnKSwgb25DbGljazogdGhpcy5oYW5kbGVTZWxlY3QuYmluZCh0aGlzLCBvcHRpb24pfSwgb3B0aW9uLmxhYmVsKVxuICAgICAgKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIGlmIChvcHRpb25zLmxlbmd0aCA8IDEpIHtcbiAgICAgIG9wdGlvbnMgPSAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7Y2xhc3NOYW1lOiBcIm11dGVkIG9wdGlvbiB1bnNlbGVjdGFibGVcIn0sIFwiTm8gbWF0Y2hlcyBmb3VuZFwiKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm9wdGlvbnNcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwge3JlZjogXCJvcHRpb25zXCJ9LCBcbiAgICAgICAgICBvcHRpb25zXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBoYW5kbGVTZWxlY3Q6IGZ1bmN0aW9uIChvcHRpb24sIGUpIHtcbiAgICB2YXIgY3VycmVudF92YWx1ZSA9IHRoaXMuc3RhdGUudmFsdWU7XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIGlmICh0aGlzLnByb3BzLm11bHRpKSB7XG4gICAgICBjdXJyZW50X3ZhbHVlID0gdGhpcy5zdGF0ZS52YWx1ZS5zbGljZSgpO1xuICAgICAgY3VycmVudF92YWx1ZS5wdXNoKG9wdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2YWx1ZTogICAgICBjdXJyZW50X3ZhbHVlLFxuICAgICAgdGV4dFZhbHVlOiAgJydcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLnByb3BzLm9uU2VsZWN0KSB7XG4gICAgICB0aGlzLnByb3BzLm9uU2VsZWN0KG9wdGlvbiwgY3VycmVudF92YWx1ZSk7XG4gICAgfVxuICB9LFxuICBoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLnN0YXRlLm9wdGlvbnM7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5nZW5lcmF0b3IpIHtcbiAgICAgIG9wdGlvbnMgPSB0aGlzLnByb3BzLmdlbmVyYXRvcihlLnRhcmdldC52YWx1ZSlcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHRleHRWYWx1ZTogIGUudGFyZ2V0LnZhbHVlLFxuICAgICAgYWN0aXZlOiAgICAgZS50YXJnZXQudmFsdWUgPyAwIDogbnVsbCxcbiAgICAgIG9wdGlvbnM6ICAgIG9wdGlvbnNcbiAgICB9KTtcbiAgfSxcbiAgbW92ZURvd246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3VycmVudCA9IHRoaXMuc3RhdGUuYWN0aXZlO1xuXG5cbiAgICBpZiAoY3VycmVudCA9PT0gbnVsbCkge1xuICAgICAgY3VycmVudCA9IC0xO1xuICAgIH1cblxuICAgIGN1cnJlbnQrKztcblxuICAgIHRoaXMuc2V0U3RhdGUoe2FjdGl2ZTogY3VycmVudH0pO1xuICB9LFxuICBtb3ZlVXA6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3VycmVudCA9IHRoaXMuc3RhdGUuYWN0aXZlO1xuXG4gICAgaWYgKGN1cnJlbnQgPT09IG51bGwpIHtcbiAgICAgIGN1cnJlbnQgPSAxO1xuICAgIH1cblxuICAgIGN1cnJlbnQtLTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe2FjdGl2ZTogY3VycmVudH0pO1xuICB9LFxuICBmb2N1c1NlYXJjaDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghIHRoaXMuc3RhdGUuZWRpdGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBub2RlID0gUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmlucHV0KTtcblxuICAgIG5vZGUuZm9jdXMoKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0b2NvbXBsZXRlO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WVd4aGNtMXpMMkYxZEc5amIyMXdiR1YwWlM1cWMzZ2lYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3TzBGQlJVRXNSMEZCUnpzN1FVRkZTQ3hKUVVGSkxGbEJRVmtzUTBGQlF6dEJRVU5xUWl4SlFVRkpMRTFCUVUwc1EwRkJRenRCUVVOWUxFbEJRVWtzUTBGQlF5eGhRVUZoTEU5QlFVOHNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRCUVVOd1F5eEpRVUZKTEV0QlFVc3NVMEZCVXl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRGJrTXNTVUZCU1N4UlFVRlJMRTFCUVUwc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETzBGQlEzUkRMRWxCUVVrc1RVRkJUU3hSUVVGUkxFOUJRVThzUTBGQlF5dzJRa0ZCTmtJc1EwRkJReXhEUVVGRE8wRkJRM3BFTEVsQlFVa3NVVUZCVVN4TlFVRk5MRTlCUVU4c1EwRkJReXhuUWtGQlowSXNRMEZCUXl4RFFVRkRPMEZCUXpWRExFbEJRVWtzUTBGQlF5eGhRVUZoTEU5QlFVOHNRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJRenRCUVVONFF5eEpRVUZKTEU5QlFVOHNUMEZCVHl4UFFVRlBMRU5CUVVNc1pVRkJaU3hEUVVGRExFTkJRVU1zVDBGQlR5eERRVUZET3p0QlFVVnVSQ3hOUVVGTkxFZEJRVWM3UlVGRFVDeFJRVUZSTEVsQlFVa3NTVUZCU1R0RlFVTm9RaXhWUVVGVkxFVkJRVVVzVFVGQlRUdEZRVU5zUWl4UlFVRlJMRWxCUVVrc1QwRkJUenRCUVVOeVFpeERRVUZETEVOQlFVTTdPMEZCUlVZc1UwRkJVeXhqUVVGakxFVkJRVVVzUzBGQlN5eEZRVUZGTEV0QlFVc3NSVUZCUlR0RlFVTnlReXhKUVVGSkxFdEJRVXNzUlVGQlJUdEpRVU5VTEU5QlFVOHNiMEpCUVc5Q0xFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdRVUZEZGtNc1IwRkJSenM3UlVGRlJDeFBRVUZQTEc5Q1FVRnZRaXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzBGQlEzSkRMRU5CUVVNN08wRkJSVVFzVTBGQlV5eHZRa0ZCYjBJc1JVRkJSU3hOUVVGTkxFVkJRVVU3UlVGRGNrTXNTVUZCU1N4RlFVRkZMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETEVWQlFVVTdTVUZETTBJc1RVRkJUU3hIUVVGSExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdRVUZEZEVJc1IwRkJSenM3UlVGRlJDeFBRVUZQTEUxQlFVMHNRMEZCUXp0QlFVTm9RaXhEUVVGRE96dEJRVVZFTEZOQlFWTXNiMEpCUVc5Q0xFVkJRVVVzUzBGQlN5eEZRVUZGTzBWQlEzQkRMRWxCUVVrc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTXNSVUZCUlR0SlFVTjRRaXhOUVVGTkxGZEJRVmNzUjBGQlJ5eExRVUZMTEVkQlFVY3NjVUpCUVhGQ0xFTkJRVU03UVVGRGRFUXNSMEZCUnpzN1JVRkZSQ3hKUVVGSkxFTkJRVU1zUTBGQlF5eFJRVUZSTEVOQlFVTXNTMEZCU3l4RFFVRkRMRVZCUVVVN1NVRkRja0lzUzBGQlN5eEhRVUZITEVOQlFVTXNTVUZCU1N4RlFVRkZMRXRCUVVzc1EwRkJReXhEUVVGRE8wRkJRekZDTEVkQlFVYzdPMFZCUlVRc1QwRkJUeXhMUVVGTExFTkJRVU03UVVGRFppeERRVUZET3p0QlFVVkVMR3REUVVGclF5dzBRa0ZCUVR0RlFVTm9ReXhQUVVGUExFVkJRVVU3U1VGRFVDeGpRVUZqTEVWQlFVVXNZMEZCWXp0SFFVTXZRanRGUVVORUxGTkJRVk1zUlVGQlJUdEpRVU5VTEU5QlFVOHNTMEZCU3l4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFbEJRVWs3U1VGRGFFTXNTMEZCU3l4UFFVRlBMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNUdEpRVU5vUXl4UFFVRlBMRXRCUVVzc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eExRVUZMTzBsQlEycERMRk5CUVZNc1IwRkJSeXhMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVazdSMEZEYWtNN1JVRkRSQ3hsUVVGbExFVkJRVVVzV1VGQldUdEJRVU12UWl4SlFVRkpMRWxCUVVrc1MwRkJTeXhIUVVGSExGbEJRVmtzUTBGQlF5eGpRVUZqTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenM3U1VGRk5VVXNUMEZCVHp0TlFVTk1MRTlCUVU4c1MwRkJTeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVODdUVUZET1VJc1MwRkJTeXhQUVVGUExFdEJRVXM3VFVGRGFrSXNVMEZCVXl4SFFVRkhMRU5CUVVNc1MwRkJTeXhKUVVGSkxFdEJRVXNzUTBGQlF5eEpRVUZKTEV0QlFVc3NSVUZCUlR0TlFVTjJReXhOUVVGTkxFMUJRVTBzU1VGQlNUdE5RVU5vUWl4UFFVRlBMRXRCUVVzc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTzB0QlF5OUNMRU5CUVVNN1IwRkRTRHRGUVVORUxHVkJRV1VzUlVGQlJTeFpRVUZaTzBsQlF6TkNMRTlCUVU4N1RVRkRUQ3hQUVVGUExFdEJRVXNzUzBGQlN6dE5RVU5xUWl4TFFVRkxMRTlCUVU4c1MwRkJTenROUVVOcVFpeFBRVUZQTEV0QlFVc3NSVUZCUlR0TlFVTmtMRk5CUVZNc1IwRkJSeXhKUVVGSk8wdEJRMnBDTEVOQlFVTTdSMEZEU0R0RlFVTkVMR2xDUVVGcFFpeEZRVUZGTEZsQlFWazdTVUZETjBJc1NVRkJTU3hEUVVGRExGZEJRVmNzUlVGQlJTeERRVUZETzBkQlEzQkNPMFZCUTBRc2EwSkJRV3RDTEVWQlFVVXNXVUZCV1R0SlFVTTVRaXhKUVVGSkxFTkJRVU1zVjBGQlZ5eEZRVUZGTEVOQlFVTTdSMEZEY0VJN1JVRkRSQ3hOUVVGTkxFVkJRVVVzV1VGQldUdEpRVU5zUWl4SlFVRkpMRTlCUVU4c1EwRkJRenRKUVVOYUxFbEJRVWtzVVVGQlVTeEhRVUZITzAxQlEySXNUVUZCVFN4SlFVRkpMRWxCUVVrc1EwRkJReXhOUVVGTk8wMUJRM0pDTEZGQlFWRXNSVUZCUlN4SlFVRkpMRU5CUVVNc1VVRkJVVHROUVVOMlFpeE5RVUZOTEVsQlFVa3NTVUZCU1N4RFFVRkRMRlZCUVZVN1FVRkRMMElzUzBGQlN5eERRVUZET3p0SlFVVkdMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVWQlFVVTdUVUZEZEVJc1QwRkJUeXhIUVVGSExFbEJRVWtzUTBGQlF5eFpRVUZaTEVWQlFVVXNRMEZCUXp0QlFVTndReXhMUVVGTE96dEpRVVZFTzAxQlEwVXNiMEpCUVVNc1QwRkJUeXhGUVVGQkxFTkJRVUVzUTBGQlF5eE5RVUZCTEVWQlFVMHNRMEZCUlN4TlFVRk5MRVZCUVVNc1EwRkJReXhSUVVGQkxFVkJRVkVzUTBGQlJTeFJRVUZWTEVOQlFVRXNSVUZCUVR0UlFVTXpReXh2UWtGQlFTeExRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExHbENRVUZyUWl4RFFVRkJMRVZCUVVFN1ZVRkRMMElzYjBKQlFVRXNUMEZCVFN4RlFVRkJMRU5CUVVFc1EwRkJReXhIUVVGQkxFVkJRVWNzUTBGQlF5eFBRVUZCTEVWQlFVOHNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhYUVVGQkxFVkJRVmNzUTBGQlF5eEpRVUZCTEVWQlFVa3NRMEZCUXl4TlFVRkJMRVZCUVUwc1EwRkJReXhYUVVGQkxFVkJRVmNzUTBGQlF5eHBRa0ZCUVN4RlFVRnBRaXhEUVVGRExFZEJRVUVzUlVGQlJ5eERRVUZETEU5QlFVRXNSVUZCVHl4RFFVRkRMRkZCUVVFc1JVRkJVU3hEUVVGRkxFbEJRVWtzUTBGQlF5eFpRVUZaTEVWQlFVTXNRMEZCUXl4WlFVRkJMRVZCUVZrc1EwRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWVXNRMEZCUVN4RFFVRkhMRU5CUVVFc1JVRkJRVHRWUVVOcVN5eFBRVUZSTzFGQlEwd3NRMEZCUVR0TlFVTkZMRU5CUVVFN1RVRkRWanRIUVVOSU8wVkJRMFFzV1VGQldTeEZRVUZGTEZsQlFWazdTVUZEZUVJc1NVRkJTU3hQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNN1FVRkRja01zU1VGQlNTeEpRVUZKTEVsQlFVa3NUVUZCVFN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF6czdTVUZGYmtNc1NVRkJTU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWTXNSVUZCUlR0TlFVTjRRaXhQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0QlFVTXpSQ3hMUVVGTE96dEpRVVZFTEU5QlFVOHNSMEZCUnl4UFFVRlBMRWxCUVVrc1JVRkJSU3hEUVVGRE8wbEJRM2hDTEU5QlFVOHNSMEZCUnl4UFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVlVzVFVGQlRTeEZRVUZGTEV0QlFVc3NSVUZCUlR0QlFVTnVSQ3hOUVVGTkxFbEJRVWtzVDBGQlR5eEhRVUZITEVOQlFVTXNVVUZCVVN4RlFVRkZMRmxCUVZrc1EwRkJReXhEUVVGRE96dEJRVVUzUXl4TlFVRk5MRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zVTBGQlV5eEpRVUZKTEV0QlFVc3NTMEZCU3l4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETEVOQlFVTTdPMDFCUlhoRU8xRkJRMFVzYjBKQlFVRXNTVUZCUnl4RlFVRkJMRU5CUVVFc1EwRkJReXhIUVVGQkxFVkJRVWNzUTBGQlJTeExRVUZMTEVWQlFVTXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJSU3hQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkRMRU5CUVVNc1QwRkJRU3hGUVVGUExFTkJRVVVzU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxFMUJRVTBzUTBGQlJ5eERRVUZCTEVWQlFVTXNUVUZCVFN4RFFVRkRMRXRCUVZjc1EwRkJRVHRSUVVOb1NEdEJRVU5TTEV0QlFVc3NSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenM3U1VGRlZDeEpRVUZKTEU5QlFVOHNRMEZCUXl4TlFVRk5MRWRCUVVjc1EwRkJReXhGUVVGRk8wMUJRM1JDTEU5QlFVODdVVUZEVEN4dlFrRkJRU3hKUVVGSExFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMREpDUVVFMFFpeERRVUZCTEVWQlFVRXNhMEpCUVhGQ0xFTkJRVUU3VDBGRGFFVXNRMEZCUXp0QlFVTlNMRXRCUVVzN08wbEJSVVE3VFVGRFJTeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEZOQlFWVXNRMEZCUVN4RlFVRkJPMUZCUTNaQ0xHOUNRVUZCTEVsQlFVY3NSVUZCUVN4RFFVRkJMRU5CUVVNc1IwRkJRU3hGUVVGSExFTkJRVU1zVTBGQlZTeERRVUZCTEVWQlFVRTdWVUZEWml4UFFVRlJPMUZCUTA0c1EwRkJRVHROUVVORUxFTkJRVUU3VFVGRFRqdEhRVU5JTzBWQlEwUXNXVUZCV1N4RlFVRkZMRlZCUVZVc1RVRkJUU3hGUVVGRkxFTkJRVU1zUlVGQlJUdEJRVU55UXl4SlFVRkpMRWxCUVVrc1lVRkJZU3hIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRPenRKUVVWeVF5eERRVUZETEVOQlFVTXNZMEZCWXl4RlFVRkZMRU5CUVVNN1FVRkRka0lzU1VGQlNTeERRVUZETEVOQlFVTXNaVUZCWlN4RlFVRkZMRU5CUVVNN08wbEJSWEJDTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFVkJRVVU3VFVGRGNFSXNZVUZCWVN4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVc3NSVUZCUlN4RFFVRkRPMDFCUTNwRExHRkJRV0VzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1FVRkRha01zUzBGQlN6czdTVUZGUkN4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRE8wMUJRMW9zUzBGQlN5eFBRVUZQTEdGQlFXRTdUVUZEZWtJc1UwRkJVeXhIUVVGSExFVkJRVVU3UVVGRGNFSXNTMEZCU3l4RFFVRkRMRU5CUVVNN08wbEJSVWdzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRkZCUVZFc1JVRkJSVHROUVVOMlFpeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRkZCUVZFc1EwRkJReXhOUVVGTkxFVkJRVVVzWVVGQllTeERRVUZETEVOQlFVTTdTMEZETlVNN1IwRkRSanRGUVVORUxGbEJRVmtzUlVGQlJTeFZRVUZWTEVOQlFVTXNSVUZCUlR0QlFVTTNRaXhKUVVGSkxFbEJRVWtzVDBGQlR5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRE96dEpRVVZxUXl4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVTBGQlV5eEZRVUZGTzAxQlEzaENMRTlCUVU4c1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF6dEJRVU53UkN4TFFVRkxPenRKUVVWRUxFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTTdUVUZEV2l4VFFVRlRMRWRCUVVjc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF5eExRVUZMTzAxQlF6RkNMRTFCUVUwc1RVRkJUU3hEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEV0QlFVc3NSMEZCUnl4RFFVRkRMRWRCUVVjc1NVRkJTVHROUVVOeVF5eFBRVUZQTEV0QlFVc3NUMEZCVHp0TFFVTndRaXhEUVVGRExFTkJRVU03UjBGRFNqdEZRVU5FTEZGQlFWRXNSVUZCUlN4WlFVRlpPMEZCUTNoQ0xFbEJRVWtzU1VGQlNTeFBRVUZQTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU03UVVGRGNFTTdPMGxCUlVrc1NVRkJTU3hQUVVGUExFdEJRVXNzU1VGQlNTeEZRVUZGTzAxQlEzQkNMRTlCUVU4c1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU51UWl4TFFVRkxPenRCUVVWTUxFbEJRVWtzVDBGQlR5eEZRVUZGTEVOQlFVTTdPMGxCUlZZc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEUxQlFVMHNSVUZCUlN4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVGRE8wZEJRMnhETzBWQlEwUXNUVUZCVFN4RlFVRkZMRmxCUVZrN1FVRkRkRUlzU1VGQlNTeEpRVUZKTEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF6czdTVUZGYUVNc1NVRkJTU3hQUVVGUExFdEJRVXNzU1VGQlNTeEZRVUZGTzAxQlEzQkNMRTlCUVU4c1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRGJFSXNTMEZCU3pzN1FVRkZUQ3hKUVVGSkxFOUJRVThzUlVGQlJTeERRVUZET3p0SlFVVldMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF5eE5RVUZOTEVWQlFVVXNUMEZCVHl4RFFVRkRMRU5CUVVNc1EwRkJRenRIUVVOc1F6dEZRVU5FTEZkQlFWY3NSVUZCUlN4WlFVRlpPMGxCUTNaQ0xFbEJRVWtzUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1JVRkJSVHROUVVONFFpeFBRVUZQTzBGQlEySXNTMEZCU3pzN1FVRkZUQ3hKUVVGSkxFbEJRVWtzU1VGQlNTeEhRVUZITEV0QlFVc3NRMEZCUXl4WFFVRlhMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXpzN1NVRkZPVU1zU1VGQlNTeERRVUZETEV0QlFVc3NSVUZCUlN4RFFVRkRPMGRCUTJRN1FVRkRTQ3hEUVVGRExFTkJRVU1zUTBGQlF6czdRVUZGU0N4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExGbEJRVmtzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dRR3B6ZUNCU1pXRmpkQzVFVDAxY2JpQXFMMXh1WEc1MllYSWdRWFYwYjJOdmJYQnNaWFJsTzF4dWRtRnlJR3RsZVUxaGNEdGNiblpoY2lBa0lDQWdJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KMnB4ZFdWeWVTY3BPMXh1ZG1GeUlGSmxZV04wSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duY21WaFkzUW5LVHRjYm5aaGNpQkNZV05yWW05dVpTQWdJQ0E5SUhKbGNYVnBjbVVvSjJKaFkydGliMjVsSnlrN1hHNTJZWElnUW5WMGRHOXVJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDY3VMaTh1TGk5amIyMXdiMjVsYm5SekwySjFkSFJ2Ymk1cWMzZ25LVHRjYm5aaGNpQkVjbTl3Wkc5M2JpQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dlpISnZjR1J2ZDI0dWFuTjRKeWs3WEc1MllYSWdYeUFnSUNBZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkMWJtUmxjbk5qYjNKbEp5azdYRzUyWVhJZ1NHOTBhMlY1Y3lBZ0lDQWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDMW9iM1JyWlhsekp5a3VTRzkwUzJWNWN6dGNibHh1YTJWNVRXRndJRDBnZTF4dUlDQW5iVzkyWlZWd0p6b2dJQ0FuZFhBbkxGeHVJQ0FuYlc5MlpVUnZkMjRuT2lBblpHOTNiaWNzWEc0Z0lDZHpaV3hsWTNRbk9pQWdJQ2RsYm5SbGNpZGNibjA3WEc1Y2JtWjFibU4wYVc5dUlHUmxkR1Z5YldsdVpWWmhiSFZsSUNoMllXeDFaU3dnYlhWc2RHa3BJSHRjYmlBZ2FXWWdLRzExYkhScEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUdSbGRHVnliV2x1WlUxMWJIUnBWbUZzZFdWektIWmhiSFZsS1R0Y2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCa1pYUmxjbTFwYm1WVGFXNW5iR1ZXWVd4MVpTaDJZV3gxWlNrN1hHNTlYRzVjYm1aMWJtTjBhVzl1SUdSbGRHVnliV2x1WlUxMWJIUnBWbUZzZFdWeklDaDJZV3gxWlhNcElIdGNiaUFnYVdZZ0tDRWdRWEp5WVhrdWFYTkJjbkpoZVNoMllXeDFaWE1wS1NCN1hHNGdJQ0FnZG1Gc2RXVnpJRDBnVzNaaGJIVmxjMTA3WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnZG1Gc2RXVnpPMXh1ZlZ4dVhHNW1kVzVqZEdsdmJpQmtaWFJsY20xcGJtVlRhVzVuYkdWV1lXeDFaU0FvZG1Gc2RXVXBJSHRjYmlBZ2FXWWdLRUZ5Y21GNUxtbHpRWEp5WVhrb2RtRnNkV1VwS1NCN1hHNGdJQ0FnZEdoeWIzY2dKMFY0Y0dWamRHVmtJQ2NnS3lCMllXeDFaU0FySUNjZ2RHOGdibTkwSUdKbElHRnVJRUZ5Y21GNUp6dGNiaUFnZlZ4dVhHNGdJR2xtSUNoZkxtbHpVM1J5YVc1bktIWmhiSFZsS1NrZ2UxeHVJQ0FnSUhaaGJIVmxJRDBnZTNSbGVIUTZJSFpoYkhWbGZUdGNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQjJZV3gxWlR0Y2JuMWNibHh1UVhWMGIyTnZiWEJzWlhSbElEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1SUNCemRHRjBhV056T2lCN1hHNGdJQ0FnWkdWMFpYSnRhVzVsVm1Gc2RXVTZJR1JsZEdWeWJXbHVaVlpoYkhWbFhHNGdJSDBzWEc0Z0lIQnliM0JVZVhCbGN6b2dlMXh1SUNBZ0lHVmthWFJwYm1jNklDQWdJRkpsWVdOMExsQnliM0JVZVhCbGN5NWliMjlzTEZ4dUlDQWdJRzExYkhScE9pQWdJQ0FnSUZKbFlXTjBMbEJ5YjNCVWVYQmxjeTVpYjI5c0xGeHVJQ0FnSUc5d2RHbHZibk02SUNBZ0lGSmxZV04wTGxCeWIzQlVlWEJsY3k1aGNuSmhlU3hjYmlBZ0lDQm5aVzVsY21GMGIzSTZJQ0JTWldGamRDNVFjbTl3Vkhsd1pYTXVablZ1WTF4dUlDQjlMRnh1SUNCblpYUkpibWwwYVdGc1UzUmhkR1U2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMllYSWdkbUZzZFdVZ1BTQkJkWFJ2WTI5dGNHeGxkR1V1WkdWMFpYSnRhVzVsVm1Gc2RXVW9kR2hwY3k1d2NtOXdjeTUyWVd4MVpTd2dkR2hwY3k1d2NtOXdjeTV0ZFd4MGFTazdYRzVjYmlBZ0lDQnlaWFIxY200Z2UxeHVJQ0FnSUNBZ1pXUnBkR2x1WnpvZ0lDQWdkR2hwY3k1d2NtOXdjeTVsWkdsMGFXNW5MRnh1SUNBZ0lDQWdkbUZzZFdVNklDQWdJQ0FnZG1Gc2RXVXNYRzRnSUNBZ0lDQjBaWGgwVm1Gc2RXVTZJQ0FvZG1Gc2RXVWdKaVlnZG1Gc2RXVXVkR1Y0ZENrZ2ZId2dKeWNzWEc0Z0lDQWdJQ0JoWTNScGRtVTZJQ0FnSUNCdWRXeHNMRnh1SUNBZ0lDQWdiM0IwYVc5dWN6b2dJQ0FnZEdocGN5NXdjbTl3Y3k1dmNIUnBiMjV6WEc0Z0lDQWdmVHRjYmlBZ2ZTeGNiaUFnWjJWMFJHVm1ZWFZzZEZCeWIzQnpPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSHRjYmlBZ0lDQWdJR1ZrYVhScGJtYzZJQ0FnSUdaaGJITmxMRnh1SUNBZ0lDQWdiWFZzZEdrNklDQWdJQ0FnWm1Gc2MyVXNYRzRnSUNBZ0lDQnZjSFJwYjI1ek9pQWdJQ0JiWFN4Y2JpQWdJQ0FnSUdkbGJtVnlZWFJ2Y2pvZ0lHNTFiR3hjYmlBZ0lDQjlPMXh1SUNCOUxGeHVJQ0JqYjIxd2IyNWxiblJFYVdSTmIzVnVkRG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhSb2FYTXVabTlqZFhOVFpXRnlZMmdvS1R0Y2JpQWdmU3hjYmlBZ1kyOXRjRzl1Wlc1MFJHbGtWWEJrWVhSbE9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkR2hwY3k1bWIyTjFjMU5sWVhKamFDZ3BPMXh1SUNCOUxGeHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ2IzQjBhVzl1Y3p0Y2JpQWdJQ0IyWVhJZ2FHRnVaR3hsY25NZ1BTQjdYRzRnSUNBZ0lDQnRiM1psVlhBNklDQWdkR2hwY3k1dGIzWmxWWEFzWEc0Z0lDQWdJQ0J0YjNabFJHOTNiam9nZEdocGN5NXRiM1psUkc5M2JpeGNiaUFnSUNBZ0lITmxiR1ZqZERvZ0lDQjBhR2x6TG5ObGJHVmpkRWwwWlcxY2JpQWdJQ0I5TzF4dVhHNGdJQ0FnYVdZZ0tIUm9hWE11YzNSaGRHVXVaV1JwZEdsdVp5a2dlMXh1SUNBZ0lDQWdiM0IwYVc5dWN5QTlJSFJvYVhNdVluVnBiR1JQY0hScGIyNXpLQ2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeEliM1JyWlhseklHdGxlVTFoY0QxN2EyVjVUV0Z3ZlNCb1lXNWtiR1Z5Y3oxN2FHRnVaR3hsY25OOVBseHVJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltWjJMV0YxZEc5amIyMXdiR1YwWlZ3aVBseHVJQ0FnSUNBZ0lDQWdJRHhwYm5CMWRDQnlaV1k5WENKcGJuQjFkRndpSUdOc1lYTnpUbUZ0WlQxY0ltbHVjSFYwWVdKc1pWd2lJSFI1Y0dVOVhDSjBaWGgwWENJZ2NHeGhZMlZvYjJ4a1pYSTlYQ0p6WldGeVkyZ2dZM0pwZEdWeWFXRmNJaUJ5WldZOVhDSnBibkIxZEZ3aUlHOXVRMmhoYm1kbFBYdDBhR2x6TG1oaGJtUnNaVU5vWVc1blpYMGdaR1ZtWVhWc2RGWmhiSFZsUFh0MGFHbHpMbk4wWVhSbExuUmxlSFJXWVd4MVpYMGdMejVjYmlBZ0lDQWdJQ0FnSUNCN2IzQjBhVzl1YzMxY2JpQWdJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdJQ0E4TDBodmRHdGxlWE0rWEc0Z0lDQWdLVHRjYmlBZ2ZTeGNiaUFnWW5WcGJHUlBjSFJwYjI1ek9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkbUZ5SUc5d2RHbHZibk1nUFNCMGFHbHpMbk4wWVhSbExtOXdkR2x2Ym5NN1hHNGdJQ0FnZG1GeUlIUmxlSFFnSUNBZ1BTQjBhR2x6TG5OMFlYUmxMblJsZUhSV1lXeDFaVHRjYmx4dUlDQWdJR2xtSUNoMGFHbHpMbkJ5YjNCekxtZGxibVZ5WVhSdmNpa2dlMXh1SUNBZ0lDQWdiM0IwYVc5dWN5QTlJSFJvYVhNdWNISnZjSE11WjJWdVpYSmhkRzl5S0hSb2FYTXVjM1JoZEdVdWRHVjRkRlpoYkhWbEtUdGNiaUFnSUNCOVhHNWNiaUFnSUNCdmNIUnBiMjV6SUQwZ2IzQjBhVzl1Y3lCOGZDQmJYVHRjYmlBZ0lDQnZjSFJwYjI1eklEMGdiM0IwYVc5dWN5NXRZWEFvWm5WdVkzUnBiMjRnS0c5d2RHbHZiaXdnYVc1a1pYZ3BJSHRjYmlBZ0lDQWdJSFpoY2lCamJHRnpjMlZ6SUQwZ1d5ZHZjSFJwYjI0bkxDQW5jMlZzWldOMFlXSnNaU2RkTzF4dVhHNGdJQ0FnSUNCamJHRnpjMlZ6TG5CMWMyZ29KMkZqZEdsMlpTMG5JQ3NnS0dsdVpHVjRJRDA5UFNCMGFHbHpMbk4wWVhSbExtRmpkR2wyWlNrcE8xeHVYRzRnSUNBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ0lDQThiR2tnYTJWNVBYdHBibVJsZUgwZ1kyeGhjM05PWVcxbFBYdGpiR0Z6YzJWekxtcHZhVzRvSnlBbktYMGdiMjVEYkdsamF6MTdkR2hwY3k1b1lXNWtiR1ZUWld4bFkzUXVZbWx1WkNoMGFHbHpMQ0J2Y0hScGIyNHBmVDU3YjNCMGFXOXVMbXhoWW1Wc2ZUd3ZiR2srWEc0Z0lDQWdJQ0FwTzF4dUlDQWdJSDBzSUhSb2FYTXBPMXh1WEc0Z0lDQWdhV1lnS0c5d2RHbHZibk11YkdWdVozUm9JRHdnTVNrZ2UxeHVJQ0FnSUNBZ2IzQjBhVzl1Y3lBOUlDaGNiaUFnSUNBZ0lDQWdQR3hwSUdOc1lYTnpUbUZ0WlQxY0ltMTFkR1ZrSUc5d2RHbHZiaUIxYm5ObGJHVmpkR0ZpYkdWY0lqNU9ieUJ0WVhSamFHVnpJR1p2ZFc1a1BDOXNhVDVjYmlBZ0lDQWdJQ2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aWIzQjBhVzl1YzF3aVBseHVJQ0FnSUNBZ0lDQThkV3dnY21WbVBWd2liM0IwYVc5dWMxd2lQbHh1SUNBZ0lDQWdJQ0FnSUh0dmNIUnBiMjV6ZlZ4dUlDQWdJQ0FnSUNBOEwzVnNQbHh1SUNBZ0lDQWdQQzlrYVhZK1hHNGdJQ0FnS1R0Y2JpQWdmU3hjYmlBZ2FHRnVaR3hsVTJWc1pXTjBPaUJtZFc1amRHbHZiaUFvYjNCMGFXOXVMQ0JsS1NCN1hHNGdJQ0FnZG1GeUlHTjFjbkpsYm5SZmRtRnNkV1VnUFNCMGFHbHpMbk4wWVhSbExuWmhiSFZsTzF4dVhHNGdJQ0FnWlM1d2NtVjJaVzUwUkdWbVlYVnNkQ2dwTzF4dUlDQWdJR1V1YzNSdmNGQnliM0JoWjJGMGFXOXVLQ2s3WEc1Y2JpQWdJQ0JwWmlBb2RHaHBjeTV3Y205d2N5NXRkV3gwYVNrZ2UxeHVJQ0FnSUNBZ1kzVnljbVZ1ZEY5MllXeDFaU0E5SUhSb2FYTXVjM1JoZEdVdWRtRnNkV1V1YzJ4cFkyVW9LVHRjYmlBZ0lDQWdJR04xY25KbGJuUmZkbUZzZFdVdWNIVnphQ2h2Y0hScGIyNHBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTF4dUlDQWdJQ0FnZG1Gc2RXVTZJQ0FnSUNBZ1kzVnljbVZ1ZEY5MllXeDFaU3hjYmlBZ0lDQWdJSFJsZUhSV1lXeDFaVG9nSUNjblhHNGdJQ0FnZlNrN1hHNWNiaUFnSUNCcFppQW9kR2hwY3k1d2NtOXdjeTV2YmxObGJHVmpkQ2tnZTF4dUlDQWdJQ0FnZEdocGN5NXdjbTl3Y3k1dmJsTmxiR1ZqZENodmNIUnBiMjRzSUdOMWNuSmxiblJmZG1Gc2RXVXBPMXh1SUNBZ0lIMWNiaUFnZlN4Y2JpQWdhR0Z1Wkd4bFEyaGhibWRsT2lCbWRXNWpkR2x2YmlBb1pTa2dlMXh1SUNBZ0lIWmhjaUJ2Y0hScGIyNXpJRDBnZEdocGN5NXpkR0YwWlM1dmNIUnBiMjV6TzF4dVhHNGdJQ0FnYVdZZ0tIUm9hWE11Y0hKdmNITXVaMlZ1WlhKaGRHOXlLU0I3WEc0Z0lDQWdJQ0J2Y0hScGIyNXpJRDBnZEdocGN5NXdjbTl3Y3k1blpXNWxjbUYwYjNJb1pTNTBZWEpuWlhRdWRtRnNkV1VwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdkR2hwY3k1elpYUlRkR0YwWlNoN1hHNGdJQ0FnSUNCMFpYaDBWbUZzZFdVNklDQmxMblJoY21kbGRDNTJZV3gxWlN4Y2JpQWdJQ0FnSUdGamRHbDJaVG9nSUNBZ0lHVXVkR0Z5WjJWMExuWmhiSFZsSUQ4Z01DQTZJRzUxYkd3c1hHNGdJQ0FnSUNCdmNIUnBiMjV6T2lBZ0lDQnZjSFJwYjI1elhHNGdJQ0FnZlNrN1hHNGdJSDBzWEc0Z0lHMXZkbVZFYjNkdU9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkbUZ5SUdOMWNuSmxiblFnUFNCMGFHbHpMbk4wWVhSbExtRmpkR2wyWlR0Y2JseHVYRzRnSUNBZ2FXWWdLR04xY25KbGJuUWdQVDA5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJR04xY25KbGJuUWdQU0F0TVR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JqZFhKeVpXNTBLeXM3WEc1Y2JpQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdGhZM1JwZG1VNklHTjFjbkpsYm5SOUtUdGNiaUFnZlN4Y2JpQWdiVzkyWlZWd09pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkbUZ5SUdOMWNuSmxiblFnUFNCMGFHbHpMbk4wWVhSbExtRmpkR2wyWlR0Y2JseHVJQ0FnSUdsbUlDaGpkWEp5Wlc1MElEMDlQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQmpkWEp5Wlc1MElEMGdNVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQmpkWEp5Wlc1MExTMDdYRzVjYmlBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0aFkzUnBkbVU2SUdOMWNuSmxiblI5S1R0Y2JpQWdmU3hjYmlBZ1ptOWpkWE5UWldGeVkyZzZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0JwWmlBb0lTQjBhR2x6TG5OMFlYUmxMbVZrYVhScGJtY3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJqdGNiaUFnSUNCOVhHNWNiaUFnSUNCMllYSWdibTlrWlNBOUlGSmxZV04wTG1acGJtUkVUMDFPYjJSbEtIUm9hWE11Y21WbWN5NXBibkIxZENrN1hHNWNiaUFnSUNCdWIyUmxMbVp2WTNWektDazdYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUVGMWRHOWpiMjF3YkdWMFpUdGNiaUpkZlE9PSIsInZhciBEaXNwYXRjaGVyID0gcmVxdWlyZSgnZmx1eCcpLkRpc3BhdGNoZXI7XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IERpc3BhdGNoZXIoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdllXeGhjbTF6TDJScGMzQmhkR05vWlhJdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzU1VGQlNTeFZRVUZWTEVkQlFVY3NUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRExGVkJRVlVzUTBGQlF6czdRVUZGTlVNc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eEpRVUZKTEZWQlFWVXNSVUZCUlN4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpZG1GeUlFUnBjM0JoZEdOb1pYSWdQU0J5WlhGMWFYSmxLQ2RtYkhWNEp5a3VSR2x6Y0dGMFkyaGxjanRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCdVpYY2dSR2x6Y0dGMFkyaGxjaWdwTzF4dUlsMTkiLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIERyb3Bkb3duO1xudmFyIERyb3Bkb3duQ2hvaWNlO1xudmFyIG9mZnNjcmVlbl9oYW5kbGVycztcbnZhciAkICAgICAgICAgICA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIFJlYWN0ICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBCdXR0b24gICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvYnV0dG9uLmpzeCcpO1xudmFyICR3aW5kb3cgICAgID0gJCh3aW5kb3cpO1xuXG5vZmZzY3JlZW5faGFuZGxlcnMgPSB7XG4gIGxlZnQ6IGZ1bmN0aW9uICgkZWwsIG5ld1N0YXRlKSB7XG4gICAgaWYgKCRlbC5pcygnOm9mZnNjcmVlbi1yaWdodCcpKSB7XG4gICAgICBuZXdTdGF0ZS5hbGlnbiA9ICdyaWdodCc7XG4gICAgfVxuICB9LFxuICByaWdodDogZnVuY3Rpb24gKCRlbCwgbmV3U3RhdGUpIHtcbiAgICBpZiAoJGVsLmlzKCc6b2Zmc2NyZWVuLWxlZnQnKSkge1xuICAgICAgbmV3U3RhdGUuYWxpZ24gPSAnbGVmdCc7XG4gICAgfVxuICB9XG59O1xuXG5Ecm9wZG93bkNob2ljZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJEcm9wZG93bkNob2ljZVwiLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYnV0dG9uUHJvcHMgPSB7XG4gICAgICB0ZXh0OiAgICAgICB0aGlzLnByb3BzLnRleHQsXG4gICAgICBvbkNsaWNrOiAgICB0aGlzLl9jbGlja0hhbmRsZXIsXG4gICAgICBjbGFzc05hbWU6ICB0aGlzLnByb3BzLnRoZW1lXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwge2NsYXNzTmFtZTogXCJjaG9pY2VcIn0sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCBSZWFjdC5fX3NwcmVhZCh7fSwgIGJ1dHRvblByb3BzKSkpXG4gICAgKTtcbiAgfSxcbiAgX2NsaWNrSGFuZGxlcjogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLm9uQ2hvaWNlKSB7XG4gICAgICB0aGlzLnByb3BzLm9uQ2hvaWNlKHRoaXMucHJvcHMudmFsdWUpO1xuICAgIH1cbiAgfVxufSk7XG5cbkRyb3Bkb3duID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkRyb3Bkb3duXCIsXG4gIHByb3BUeXBlczoge1xuICAgIHNlbGVjdGVkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2hvaWNlczogIFJlYWN0LlByb3BUeXBlcy5hcnJheVxuICB9LFxuICBtaXhpbnM6IFtSZWFjdC5hZGRvbnMuUHVyZVJlbmRlck1peGluXSxcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9wZW46ICAgISEgdGhpcy5wcm9wcy5vcGVuLFxuICAgICAgYWxpZ246ICB0aGlzLnByb3BzLmFsaWduIHx8ICdsZWZ0J1xuICAgIH07XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uIChuZXh0UHJvcHMpIHtcbiAgICBpZiAobmV4dFByb3BzLmFsaWduKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHthbGlnbjogbmV4dFByb3BzLmFsaWdufSk7XG4gICAgfVxuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX2Vuc3VyZURyb3Bkb3duVmlzaWJpbGl0eSgpO1xuICB9LFxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9lbnN1cmVEcm9wZG93blZpc2liaWxpdHkoKTtcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNob2ljZXM6IFtdXG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNob2ljZXMgPSB0aGlzLnN0YXRlLm9wZW4gJiYgdGhpcy5fYnVpbGRDaG9pY2VzKCk7XG4gICAgdmFyIGNsYXNzZXMgPSBbJ2Ryb3Bkb3duJywgJ2FsaWduLScgKyB0aGlzLnN0YXRlLmFsaWduXTtcbiAgICB2YXIgYnV0dG9uUHJvcHM7XG5cbiAgICBidXR0b25Qcm9wcyA9IHtcbiAgICAgIHRleHQ6ICAgICAgIHRoaXMucHJvcHMuc2VsZWN0ZWQsXG4gICAgICBhZnRlckljb246ICAnY2FyZXQtZG93bicsXG4gICAgICBvbkNsaWNrOiAgICB0aGlzLl90b2dnbGVPcGVuXG4gICAgfTtcblxuICAgIHRoaXMucHJvcHMuY2xhc3NOYW1lICYmIGNsYXNzZXMucHVzaCh0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy50aGVtZSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKHRoaXMucHJvcHMudGhlbWUpO1xuICAgICAgYnV0dG9uUHJvcHMuY2xhc3NOYW1lID0gdGhpcy5wcm9wcy50aGVtZTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBjbGFzc2VzLmpvaW4oJyAnKSwgb25Nb3VzZUxlYXZlOiB0aGlzLl9oYW5kbGVMZWF2ZX0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic2VsZWN0ZWRcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCBSZWFjdC5fX3NwcmVhZCh7fSwgIGJ1dHRvblByb3BzKSlcbiAgICAgICAgKSwgXG4gICAgICAgIGNob2ljZXNcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBfaGFuZGxlTGVhdmU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtvcGVuOiBmYWxzZX0pO1xuICB9LFxuICBfdG9nZ2xlT3BlbjogZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5vbkNsaWNrKSB7XG4gICAgICB0aGlzLnByb3BzLm9uQ2xpY2soZSk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBvcGVuOiAhIHRoaXMuc3RhdGUub3BlblxuICAgIH0pO1xuICB9LFxuICBfYnVpbGRDaG9pY2VzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNob2ljZXMgPSBbXTtcblxuICAgIGNob2ljZXMgPSB0aGlzLnByb3BzLmNob2ljZXMubWFwKGZ1bmN0aW9uIChjaG9pY2UsIGluZGV4KSB7XG4gICAgICBpZiAoY2hvaWNlLnNlcGFyYXRvcikge1xuICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7Y2xhc3NOYW1lOiBcInNlcGFyYXRvclwiLCBrZXk6IGluZGV4fSkpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcHJvcHMgPSB7XG4gICAgICAgIGtleTogICAgICBpbmRleCxcbiAgICAgICAgdGV4dDogICAgIGNob2ljZS50ZXh0LFxuICAgICAgICBvbkNob2ljZTogdGhpcy5faGFuZGxlQ2hvaWNlLFxuICAgICAgICB0aGVtZTogICAgdGhpcy5wcm9wcy50aGVtZSxcbiAgICAgICAgdmFsdWU6ICAgIGNob2ljZS52YWx1ZVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChEcm9wZG93bkNob2ljZSwgUmVhY3QuX19zcHJlYWQoe30sICBwcm9wcykpXG4gICAgICApO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwge3JlZjogXCJkcm9wZG93blwifSwgY2hvaWNlcykpO1xuICB9LFxuICBfaGFuZGxlQ2hvaWNlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5vbkNob2ljZSkge1xuICAgICAgdGhpcy5wcm9wcy5vbkNob2ljZSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7b3BlbjogZmFsc2V9KTtcbiAgfSxcbiAgX2Vuc3VyZURyb3Bkb3duVmlzaWJpbGl0eTogZnVuY3Rpb24gKCkge1xuICAgIGlmICghIHRoaXMuc3RhdGUub3Blbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIGRyb3Bkb3duICA9IHRoaXMucmVmcy5kcm9wZG93bjtcbiAgICB2YXIgJGVsICAgICAgID0gJChkcm9wZG93bi5nZXRET01Ob2RlKCkpO1xuICAgIHZhciBuZXdTdGF0ZSAgPSB7fTtcbiAgICB2YXIgaGFuZGxlciAgID0gb2Zmc2NyZWVuX2hhbmRsZXJzW3RoaXMuc3RhdGUuYWxpZ25dO1xuXG4gICAgaGFuZGxlciAmJiBoYW5kbGVyKCRlbCwgbmV3U3RhdGUpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XG4gIH0sXG4gIF9leGl0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7b3BlbjogZmFsc2V9KTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRHJvcGRvd247XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZZV3hoY20xekwyUnliM0JrYjNkdUxtcHplQ0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVRzN1FVRkZRU3hIUVVGSE96dEJRVVZJTEVsQlFVa3NVVUZCVVN4RFFVRkRPMEZCUTJJc1NVRkJTU3hqUVVGakxFTkJRVU03UVVGRGJrSXNTVUZCU1N4clFrRkJhMElzUTBGQlF6dEJRVU4yUWl4SlFVRkpMRU5CUVVNc1lVRkJZU3hQUVVGUExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdRVUZEY0VNc1NVRkJTU3hMUVVGTExGTkJRVk1zVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUTI1RExFbEJRVWtzVFVGQlRTeFJRVUZSTEU5QlFVOHNRMEZCUXl3MlFrRkJOa0lzUTBGQlF5eERRVUZETzBGQlEzcEVMRWxCUVVrc1QwRkJUeXhQUVVGUExFTkJRVU1zUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXpzN1FVRkZOVUlzYTBKQlFXdENMRWRCUVVjN1JVRkRia0lzU1VGQlNTeEZRVUZGTEZWQlFWVXNSMEZCUnl4RlFVRkZMRkZCUVZFc1JVRkJSVHRKUVVNM1FpeEpRVUZKTEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc2EwSkJRV3RDTEVOQlFVTXNSVUZCUlR0TlFVTTVRaXhSUVVGUkxFTkJRVU1zUzBGQlN5eEhRVUZITEU5QlFVOHNRMEZCUXp0TFFVTXhRanRIUVVOR08wVkJRMFFzUzBGQlN5eEZRVUZGTEZWQlFWVXNSMEZCUnl4RlFVRkZMRkZCUVZFc1JVRkJSVHRKUVVNNVFpeEpRVUZKTEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNSVUZCUlR0TlFVTTNRaXhSUVVGUkxFTkJRVU1zUzBGQlN5eEhRVUZITEUxQlFVMHNRMEZCUXp0TFFVTjZRanRIUVVOR08wRkJRMGdzUTBGQlF5eERRVUZET3p0QlFVVkdMRzlEUVVGdlF5dzRRa0ZCUVR0RlFVTnNReXhOUVVGTkxFVkJRVVVzV1VGQldUdEpRVU5zUWl4SlFVRkpMRmRCUVZjc1IwRkJSenROUVVOb1FpeEpRVUZKTEZGQlFWRXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSk8wMUJRek5DTEU5QlFVOHNTMEZCU3l4SlFVRkpMRU5CUVVNc1lVRkJZVHROUVVNNVFpeFRRVUZUTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTE8wRkJRMnhETEV0QlFVc3NRMEZCUXpzN1NVRkZSanROUVVORkxHOUNRVUZCTEVsQlFVY3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zVVVGQlV5eERRVUZCTEVWQlFVRXNiMEpCUVVNc1RVRkJUU3hGUVVGQkxHZENRVUZCTEVkQlFVRXNRMEZCUlN4SFFVRkhMRmRCUVZrc1EwRkJRU3hEUVVGSExFTkJRVXNzUTBGQlFUdE5RVU4yUkR0SFFVTklPMFZCUTBRc1lVRkJZU3hGUVVGRkxGbEJRVms3U1VGRGVrSXNTVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGRkJRVkVzUlVGQlJUdE5RVU4yUWl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGRkJRVkVzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE8wdEJRM1pETzBkQlEwWTdRVUZEU0N4RFFVRkRMRU5CUVVNc1EwRkJRenM3UVVGRlNDdzRRa0ZCT0VJc2QwSkJRVUU3UlVGRE5VSXNVMEZCVXl4RlFVRkZPMGxCUTFRc1VVRkJVU3hGUVVGRkxFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNUVUZCVFN4RFFVRkRMRlZCUVZVN1NVRkRNME1zVDBGQlR5eEhRVUZITEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1MwRkJTenRIUVVOb1F6dEZRVU5FTEUxQlFVMHNSVUZCUlN4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zWlVGQlpTeERRVUZETzBWQlEzUkRMR1ZCUVdVc1JVRkJSU3haUVVGWk8wbEJRek5DTEU5QlFVODdUVUZEVEN4SlFVRkpMRWxCUVVrc1EwRkJReXhGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1R0TlFVTXhRaXhMUVVGTExFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRWxCUVVrc1RVRkJUVHRMUVVOdVF5eERRVUZETzBkQlEwZzdSVUZEUkN4NVFrRkJlVUlzUlVGQlJTeFZRVUZWTEZOQlFWTXNSVUZCUlR0SlFVTTVReXhKUVVGSkxGTkJRVk1zUTBGQlF5eExRVUZMTEVWQlFVVTdUVUZEYmtJc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEV0QlFVc3NSVUZCUlN4VFFVRlRMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF6dExRVU42UXp0SFFVTkdPMFZCUTBRc2FVSkJRV2xDTEVWQlFVVXNXVUZCV1R0SlFVTTNRaXhKUVVGSkxFTkJRVU1zZVVKQlFYbENMRVZCUVVVc1EwRkJRenRIUVVOc1F6dEZRVU5FTEd0Q1FVRnJRaXhGUVVGRkxGbEJRVms3U1VGRE9VSXNTVUZCU1N4RFFVRkRMSGxDUVVGNVFpeEZRVUZGTEVOQlFVTTdSMEZEYkVNN1JVRkRSQ3hsUVVGbExFVkJRVVVzV1VGQldUdEpRVU16UWl4UFFVRlBPMDFCUTB3c1QwRkJUeXhGUVVGRkxFVkJRVVU3UzBGRFdpeERRVUZETzBkQlEwZzdSVUZEUkN4TlFVRk5MRVZCUVVVc1dVRkJXVHRKUVVOc1FpeEpRVUZKTEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzU1VGQlNTeEpRVUZKTEVOQlFVTXNZVUZCWVN4RlFVRkZMRU5CUVVNN1NVRkRkRVFzU1VGQlNTeFBRVUZQTEVkQlFVY3NRMEZCUXl4VlFVRlZMRVZCUVVVc1VVRkJVU3hIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1FVRkROVVFzU1VGQlNTeEpRVUZKTEZkQlFWY3NRMEZCUXpzN1NVRkZhRUlzVjBGQlZ5eEhRVUZITzAxQlExb3NTVUZCU1N4UlFVRlJMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVVVGQlVUdE5RVU12UWl4VFFVRlRMRWRCUVVjc1dVRkJXVHROUVVONFFpeFBRVUZQTEV0QlFVc3NTVUZCU1N4RFFVRkRMRmRCUVZjN1FVRkRiRU1zUzBGQlN5eERRVUZET3p0QlFVVk9MRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVsQlFVa3NUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPenRKUVVVelJDeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhGUVVGRk8wMUJRM0JDTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0TlFVTXZRaXhYUVVGWExFTkJRVU1zVTBGQlV5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRE8wRkJReTlETEV0QlFVczdPMGxCUlVRN1RVRkRSU3h2UWtGQlFTeExRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRkxFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVNc1EwRkJReXhaUVVGQkxFVkJRVmtzUTBGQlJTeEpRVUZKTEVOQlFVTXNXVUZCWXl4RFFVRkJMRVZCUVVFN1VVRkRiRVVzYjBKQlFVRXNTMEZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eFZRVUZYTEVOQlFVRXNSVUZCUVR0VlFVTjRRaXh2UWtGQlF5eE5RVUZOTEVWQlFVRXNaMEpCUVVFc1IwRkJRU3hEUVVGRkxFZEJRVWNzVjBGQldTeERRVUZCTEVOQlFVY3NRMEZCUVR0UlFVTjJRaXhEUVVGQkxFVkJRVUU3VVVGRFRDeFBRVUZSTzAxQlEwd3NRMEZCUVR0TlFVTk9PMGRCUTBnN1JVRkRSQ3haUVVGWkxFVkJRVVVzV1VGQldUdEpRVU40UWl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zU1VGQlNTeEZRVUZGTEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNN1IwRkRPVUk3UlVGRFJDeFhRVUZYTEVWQlFVVXNWVUZCVlN4RFFVRkRMRVZCUVVVN1NVRkRlRUlzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1JVRkJSVHROUVVOMFFpeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU0xUWl4TFFVRkxPenRKUVVWRUxFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTTdUVUZEV2l4SlFVRkpMRVZCUVVVc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVazdTMEZEZUVJc1EwRkJReXhEUVVGRE8wZEJRMG83UlVGRFJDeGhRVUZoTEVWQlFVVXNXVUZCV1R0QlFVTTNRaXhKUVVGSkxFbEJRVWtzVDBGQlR5eEhRVUZITEVWQlFVVXNRMEZCUXpzN1NVRkZha0lzVDBGQlR5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExFZEJRVWNzUTBGQlF5eFZRVUZWTEUxQlFVMHNSVUZCUlN4TFFVRkxMRVZCUVVVN1RVRkRlRVFzU1VGQlNTeE5RVUZOTEVOQlFVTXNVMEZCVXl4RlFVRkZPMUZCUTNCQ0xGRkJRVkVzYjBKQlFVRXNTVUZCUnl4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eFhRVUZCTEVWQlFWY3NRMEZCUXl4SFFVRkJMRVZCUVVjc1EwRkJSU3hMUVVGTkxFTkJRVUVzUTBGQlJ5eERRVUZCTEVWQlFVVTdRVUZETVVRc1QwRkJUenM3VFVGRlJDeEpRVUZKTEV0QlFVc3NSMEZCUnp0UlFVTldMRWRCUVVjc1QwRkJUeXhMUVVGTE8xRkJRMllzU1VGQlNTeE5RVUZOTEUxQlFVMHNRMEZCUXl4SlFVRkpPMUZCUTNKQ0xGRkJRVkVzUlVGQlJTeEpRVUZKTEVOQlFVTXNZVUZCWVR0UlFVTTFRaXhMUVVGTExFdEJRVXNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxPMUZCUXpGQ0xFdEJRVXNzUzBGQlN5eE5RVUZOTEVOQlFVTXNTMEZCU3p0QlFVTTVRaXhQUVVGUExFTkJRVU03TzAxQlJVWTdVVUZEUlN4dlFrRkJReXhqUVVGakxFVkJRVUVzWjBKQlFVRXNSMEZCUVN4RFFVRkZMRWRCUVVjc1MwRkJUU3hEUVVGQkxFTkJRVWNzUTBGQlFUdFJRVU0zUWp0QlFVTlNMRXRCUVVzc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6czdTVUZGVkN4UlFVRlJMRzlDUVVGQkxFbEJRVWNzUlVGQlFTeERRVUZCTEVOQlFVTXNSMEZCUVN4RlFVRkhMRU5CUVVNc1ZVRkJWeXhEUVVGQkxFVkJRVU1zVDBGQllTeERRVUZCTEVWQlFVVTdSMEZETlVNN1JVRkRSQ3hoUVVGaExFVkJRVVVzVlVGQlZTeExRVUZMTEVWQlFVVTdTVUZET1VJc1NVRkJTU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWRXNSVUZCUlR0TlFVTjJRaXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRCUVVOcVF5eExRVUZMT3p0SlFVVkVMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF5eEpRVUZKTEVWQlFVVXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJRenRIUVVNNVFqdEZRVU5FTEhsQ1FVRjVRaXhGUVVGRkxGbEJRVms3U1VGRGNrTXNTVUZCU1N4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeEZRVUZGTzAxQlEzSkNMRTlCUVU4c1NVRkJTU3hEUVVGRE8wRkJRMnhDTEV0QlFVczdPMGxCUlVRc1NVRkJTU3hSUVVGUkxFbEJRVWtzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNN1NVRkRia01zU1VGQlNTeEhRVUZITEZOQlFWTXNRMEZCUXl4RFFVRkRMRkZCUVZFc1EwRkJReXhWUVVGVkxFVkJRVVVzUTBGQlF5eERRVUZETzBsQlEzcERMRWxCUVVrc1VVRkJVU3hKUVVGSkxFVkJRVVVzUTBGQlF6dEJRVU4yUWl4SlFVRkpMRWxCUVVrc1QwRkJUeXhMUVVGTExHdENRVUZyUWl4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdPMEZCUlhwRUxFbEJRVWtzVDBGQlR5eEpRVUZKTEU5QlFVOHNRMEZCUXl4SFFVRkhMRVZCUVVVc1VVRkJVU3hEUVVGRExFTkJRVU03TzBsQlJXeERMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdSMEZEZWtJN1JVRkRSQ3hMUVVGTExFVkJRVVVzV1VGQldUdEpRVU5xUWl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zU1VGQlNTeEZRVUZGTEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNN1IwRkRPVUk3UVVGRFNDeERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEZGQlFWRXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFLbHh1SUNvZ1FHcHplQ0JTWldGamRDNUVUMDFjYmlBcUwxeHVYRzUyWVhJZ1JISnZjR1J2ZDI0N1hHNTJZWElnUkhKdmNHUnZkMjVEYUc5cFkyVTdYRzUyWVhJZ2IyWm1jMk55WldWdVgyaGhibVJzWlhKek8xeHVkbUZ5SUNRZ0lDQWdJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25hbkYxWlhKNUp5azdYRzUyWVhJZ1VtVmhZM1FnSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDY3BPMXh1ZG1GeUlFSjFkSFJ2YmlBZ0lDQWdJRDBnY21WeGRXbHlaU2duTGk0dkxpNHZZMjl0Y0c5dVpXNTBjeTlpZFhSMGIyNHVhbk40SnlrN1hHNTJZWElnSkhkcGJtUnZkeUFnSUNBZ1BTQWtLSGRwYm1SdmR5azdYRzVjYm05bVpuTmpjbVZsYmw5b1lXNWtiR1Z5Y3lBOUlIdGNiaUFnYkdWbWREb2dablZ1WTNScGIyNGdLQ1JsYkN3Z2JtVjNVM1JoZEdVcElIdGNiaUFnSUNCcFppQW9KR1ZzTG1sektDYzZiMlptYzJOeVpXVnVMWEpwWjJoMEp5a3BJSHRjYmlBZ0lDQWdJRzVsZDFOMFlYUmxMbUZzYVdkdUlEMGdKM0pwWjJoMEp6dGNiaUFnSUNCOVhHNGdJSDBzWEc0Z0lISnBaMmgwT2lCbWRXNWpkR2x2YmlBb0pHVnNMQ0J1WlhkVGRHRjBaU2tnZTF4dUlDQWdJR2xtSUNna1pXd3VhWE1vSnpwdlptWnpZM0psWlc0dGJHVm1kQ2NwS1NCN1hHNGdJQ0FnSUNCdVpYZFRkR0YwWlM1aGJHbG5iaUE5SUNkc1pXWjBKenRjYmlBZ0lDQjlYRzRnSUgxY2JuMDdYRzVjYmtSeWIzQmtiM2R1UTJodmFXTmxJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnWW5WMGRHOXVVSEp2Y0hNZ1BTQjdYRzRnSUNBZ0lDQjBaWGgwT2lBZ0lDQWdJQ0IwYUdsekxuQnliM0J6TG5SbGVIUXNYRzRnSUNBZ0lDQnZia05zYVdOck9pQWdJQ0IwYUdsekxsOWpiR2xqYTBoaGJtUnNaWElzWEc0Z0lDQWdJQ0JqYkdGemMwNWhiV1U2SUNCMGFHbHpMbkJ5YjNCekxuUm9aVzFsWEc0Z0lDQWdmVHRjYmx4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThiR2tnWTJ4aGMzTk9ZVzFsUFZ3aVkyaHZhV05sWENJK1BFSjFkSFJ2YmlCN0xpNHVZblYwZEc5dVVISnZjSE45SUM4K1BDOXNhVDVjYmlBZ0lDQXBPMXh1SUNCOUxGeHVJQ0JmWTJ4cFkydElZVzVrYkdWeU9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdhV1lnS0hSb2FYTXVjSEp2Y0hNdWIyNURhRzlwWTJVcElIdGNiaUFnSUNBZ0lIUm9hWE11Y0hKdmNITXViMjVEYUc5cFkyVW9kR2hwY3k1d2NtOXdjeTUyWVd4MVpTazdYRzRnSUNBZ2ZWeHVJQ0I5WEc1OUtUdGNibHh1UkhKdmNHUnZkMjRnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJSEJ5YjNCVWVYQmxjem9nZTF4dUlDQWdJSE5sYkdWamRHVmtPaUJTWldGamRDNVFjbTl3Vkhsd1pYTXVjM1J5YVc1bkxtbHpVbVZ4ZFdseVpXUXNYRzRnSUNBZ1kyaHZhV05sY3pvZ0lGSmxZV04wTGxCeWIzQlVlWEJsY3k1aGNuSmhlVnh1SUNCOUxGeHVJQ0J0YVhocGJuTTZJRnRTWldGamRDNWhaR1J2Ym5NdVVIVnlaVkpsYm1SbGNrMXBlR2x1WFN4Y2JpQWdaMlYwU1c1cGRHbGhiRk4wWVhSbE9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIdGNiaUFnSUNBZ0lHOXdaVzQ2SUNBZ0lTRWdkR2hwY3k1d2NtOXdjeTV2Y0dWdUxGeHVJQ0FnSUNBZ1lXeHBaMjQ2SUNCMGFHbHpMbkJ5YjNCekxtRnNhV2R1SUh4OElDZHNaV1owSjF4dUlDQWdJSDA3WEc0Z0lIMHNYRzRnSUdOdmJYQnZibVZ1ZEZkcGJHeFNaV05sYVhabFVISnZjSE02SUdaMWJtTjBhVzl1SUNodVpYaDBVSEp2Y0hNcElIdGNiaUFnSUNCcFppQW9ibVY0ZEZCeWIzQnpMbUZzYVdkdUtTQjdYRzRnSUNBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0aGJHbG5iam9nYm1WNGRGQnliM0J6TG1Gc2FXZHVmU2s3WEc0Z0lDQWdmVnh1SUNCOUxGeHVJQ0JqYjIxd2IyNWxiblJFYVdSTmIzVnVkRG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhSb2FYTXVYMlZ1YzNWeVpVUnliM0JrYjNkdVZtbHphV0pwYkdsMGVTZ3BPMXh1SUNCOUxGeHVJQ0JqYjIxd2IyNWxiblJFYVdSVmNHUmhkR1U2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMGFHbHpMbDlsYm5OMWNtVkVjbTl3Wkc5M2JsWnBjMmxpYVd4cGRIa29LVHRjYmlBZ2ZTeGNiaUFnWjJWMFJHVm1ZWFZzZEZCeWIzQnpPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSHRjYmlBZ0lDQWdJR05vYjJsalpYTTZJRnRkWEc0Z0lDQWdmVHRjYmlBZ2ZTeGNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZG1GeUlHTm9iMmxqWlhNZ1BTQjBhR2x6TG5OMFlYUmxMbTl3Wlc0Z0ppWWdkR2hwY3k1ZlluVnBiR1JEYUc5cFkyVnpLQ2s3WEc0Z0lDQWdkbUZ5SUdOc1lYTnpaWE1nUFNCYkoyUnliM0JrYjNkdUp5d2dKMkZzYVdkdUxTY2dLeUIwYUdsekxuTjBZWFJsTG1Gc2FXZHVYVHRjYmlBZ0lDQjJZWElnWW5WMGRHOXVVSEp2Y0hNN1hHNWNiaUFnSUNCaWRYUjBiMjVRY205d2N5QTlJSHRjYmlBZ0lDQWdJSFJsZUhRNklDQWdJQ0FnSUhSb2FYTXVjSEp2Y0hNdWMyVnNaV04wWldRc1hHNGdJQ0FnSUNCaFpuUmxja2xqYjI0NklDQW5ZMkZ5WlhRdFpHOTNiaWNzWEc0Z0lDQWdJQ0J2YmtOc2FXTnJPaUFnSUNCMGFHbHpMbDkwYjJkbmJHVlBjR1Z1WEc0Z0lDQWdmVHRjYmx4dUlDQWdJSFJvYVhNdWNISnZjSE11WTJ4aGMzTk9ZVzFsSUNZbUlHTnNZWE56WlhNdWNIVnphQ2gwYUdsekxuQnliM0J6TG1Oc1lYTnpUbUZ0WlNrN1hHNWNiaUFnSUNCcFppQW9kR2hwY3k1d2NtOXdjeTUwYUdWdFpTa2dlMXh1SUNBZ0lDQWdZMnhoYzNObGN5NXdkWE5vS0hSb2FYTXVjSEp2Y0hNdWRHaGxiV1VwTzF4dUlDQWdJQ0FnWW5WMGRHOXVVSEp2Y0hNdVkyeGhjM05PWVcxbElEMGdkR2hwY3k1d2NtOXdjeTUwYUdWdFpUdGNiaUFnSUNCOVhHNWNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTllMk5zWVhOelpYTXVhbTlwYmlnbklDY3BmU0J2YmsxdmRYTmxUR1ZoZG1VOWUzUm9hWE11WDJoaGJtUnNaVXhsWVhabGZUNWNiaUFnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSnpaV3hsWTNSbFpGd2lQbHh1SUNBZ0lDQWdJQ0FnSUR4Q2RYUjBiMjRnZXk0dUxtSjFkSFJ2YmxCeWIzQnpmU0F2UGx4dUlDQWdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQWdJQ0FnZTJOb2IybGpaWE45WEc0Z0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBcE8xeHVJQ0I5TEZ4dUlDQmZhR0Z1Wkd4bFRHVmhkbVU2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHR2Y0dWdU9pQm1ZV3h6WlgwcE8xeHVJQ0I5TEZ4dUlDQmZkRzluWjJ4bFQzQmxiam9nWm5WdVkzUnBiMjRnS0dVcElIdGNiaUFnSUNCcFppQW9kR2hwY3k1d2NtOXdjeTV2YmtOc2FXTnJLU0I3WEc0Z0lDQWdJQ0IwYUdsekxuQnliM0J6TG05dVEyeHBZMnNvWlNrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaDdYRzRnSUNBZ0lDQnZjR1Z1T2lBaElIUm9hWE11YzNSaGRHVXViM0JsYmx4dUlDQWdJSDBwTzF4dUlDQjlMRnh1SUNCZlluVnBiR1JEYUc5cFkyVnpPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZG1GeUlHTm9iMmxqWlhNZ1BTQmJYVHRjYmx4dUlDQWdJR05vYjJsalpYTWdQU0IwYUdsekxuQnliM0J6TG1Ob2IybGpaWE11YldGd0tHWjFibU4wYVc5dUlDaGphRzlwWTJVc0lHbHVaR1Y0S1NCN1hHNGdJQ0FnSUNCcFppQW9ZMmh2YVdObExuTmxjR0Z5WVhSdmNpa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdLRHhzYVNCamJHRnpjMDVoYldVOVhDSnpaWEJoY21GMGIzSmNJaUJyWlhrOWUybHVaR1Y0ZlNBdlBpazdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFpoY2lCd2NtOXdjeUE5SUh0Y2JpQWdJQ0FnSUNBZ2EyVjVPaUFnSUNBZ0lHbHVaR1Y0TEZ4dUlDQWdJQ0FnSUNCMFpYaDBPaUFnSUNBZ1kyaHZhV05sTG5SbGVIUXNYRzRnSUNBZ0lDQWdJRzl1UTJodmFXTmxPaUIwYUdsekxsOW9ZVzVrYkdWRGFHOXBZMlVzWEc0Z0lDQWdJQ0FnSUhSb1pXMWxPaUFnSUNCMGFHbHpMbkJ5YjNCekxuUm9aVzFsTEZ4dUlDQWdJQ0FnSUNCMllXeDFaVG9nSUNBZ1kyaHZhV05sTG5aaGJIVmxYRzRnSUNBZ0lDQjlPMXh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdJQ0E4UkhKdmNHUnZkMjVEYUc5cFkyVWdleTR1TG5CeWIzQnpmU0F2UGx4dUlDQWdJQ0FnS1R0Y2JpQWdJQ0I5TENCMGFHbHpLVHRjYmx4dUlDQWdJSEpsZEhWeWJpQW9QSFZzSUhKbFpqMWNJbVJ5YjNCa2IzZHVYQ0krZTJOb2IybGpaWE45UEM5MWJENHBPMXh1SUNCOUxGeHVJQ0JmYUdGdVpHeGxRMmh2YVdObE9pQm1kVzVqZEdsdmJpQW9kbUZzZFdVcElIdGNiaUFnSUNCcFppQW9kR2hwY3k1d2NtOXdjeTV2YmtOb2IybGpaU2tnZTF4dUlDQWdJQ0FnZEdocGN5NXdjbTl3Y3k1dmJrTm9iMmxqWlNoMllXeDFaU2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdkR2hwY3k1elpYUlRkR0YwWlNoN2IzQmxiam9nWm1Gc2MyVjlLVHRjYmlBZ2ZTeGNiaUFnWDJWdWMzVnlaVVJ5YjNCa2IzZHVWbWx6YVdKcGJHbDBlVG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUdsbUlDZ2hJSFJvYVhNdWMzUmhkR1V1YjNCbGJpa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHNTFiR3c3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdkbUZ5SUdSeWIzQmtiM2R1SUNBOUlIUm9hWE11Y21WbWN5NWtjbTl3Wkc5M2JqdGNiaUFnSUNCMllYSWdKR1ZzSUNBZ0lDQWdJRDBnSkNoa2NtOXdaRzkzYmk1blpYUkVUMDFPYjJSbEtDa3BPMXh1SUNBZ0lIWmhjaUJ1WlhkVGRHRjBaU0FnUFNCN2ZUdGNiaUFnSUNCMllYSWdhR0Z1Wkd4bGNpQWdJRDBnYjJabWMyTnlaV1Z1WDJoaGJtUnNaWEp6VzNSb2FYTXVjM1JoZEdVdVlXeHBaMjVkTzF4dVhHNGdJQ0FnYUdGdVpHeGxjaUFtSmlCb1lXNWtiR1Z5S0NSbGJDd2dibVYzVTNSaGRHVXBPMXh1WEc0Z0lDQWdkR2hwY3k1elpYUlRkR0YwWlNodVpYZFRkR0YwWlNrN1hHNGdJSDBzWEc0Z0lGOWxlR2wwT2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2RHaHBjeTV6WlhSVGRHRjBaU2g3YjNCbGJqb2dabUZzYzJWOUtUdGNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnUkhKdmNHUnZkMjQ3WEc0aVhYMD0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIEZpbHRlckJveDtcbnZhciBSZWFjdCAgICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBCYWNrYm9uZSAgICAgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBBdXRvY29tcGxldGUgID0gcmVxdWlyZSgnLi9hdXRvY29tcGxldGUuanN4Jyk7XG52YXIgQnV0dG9uICAgICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvYnV0dG9uLmpzeCcpO1xudmFyIERyb3Bkb3duICAgICAgPSByZXF1aXJlKCcuL2Ryb3Bkb3duLmpzeCcpO1xudmFyIEFuZE9yICAgICAgICAgPSByZXF1aXJlKCcuL2FuZF9vcl9zZWxlY3Rvci5qc3gnKTtcbnZhciBjcml0ZXJpYSAgICAgID0gcmVxdWlyZSgnLi9maWx0ZXJfYm94X2RlZmluaXRpb24nKTtcblxuRmlsdGVyQm94ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkZpbHRlckJveFwiLFxuICBwcm9wVHlwZXM6IHtcbiAgICBmaWx0ZXJUeXBlOiBSZWFjdC5Qcm9wVHlwZXMub25lT2YoW0FuZE9yLkFORCwgQW5kT3IuT1JdKSxcbiAgICBsb2NrVHlwZTogICBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgICBjcml0ZXJpYTogICBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZvY3VzU2VhcmNoKCk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlRG9jdW1lbnRDbGljayk7XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZURvY3VtZW50Q2xpY2spO1xuICB9LFxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZvY3VzU2VhcmNoKCk7XG4gIH0sXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBmaWx0ZXJUeXBlOiBBbmRPci5BTkQsXG4gICAgICBsb2NrVHlwZTogICBmYWxzZSxcbiAgICAgIGVkaXRpbmc6ICAgIGZhbHNlXG4gICAgfVxuICB9LFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZmlsdGVyVHlwZTogdGhpcy5wcm9wcy5maWx0ZXJUeXBlLFxuICAgICAgZWRpdGluZzogICAgdGhpcy5wcm9wcy5lZGl0aW5nXG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGdyb3VwcyA9IHRoaXMuYnVpbGRHcm91cHMoKTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZmlsdGVyLWJveFwiLCBvbkNsaWNrOiB0aGlzLmhhbmRsZUNsaWNrfSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7Y2xhc3NOYW1lOiBcInNlYXJjaC1hY3Rpb24gcHVsbC1yaWdodCBmZWF1eC1idXR0b25cIiwgaWNvbjogXCJzZWFyY2hcIiwgb25DbGljazogdGhpcy5pbml0aWF0ZVNlYXJjaH0pLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY2hhaW4tZ3JvdXBcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwiY2hhaW5cIn0sIFxuICAgICAgICAgICAgXCJGaW5kIGFsYXJtcyBtYXRjaGluZ1wiXG4gICAgICAgICAgKSwgXG5cbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEFuZE9yLCB7b25DaGFuZ2U6IHRoaXMuaGFuZGxlRmlsdGVyVHlwZUNoYW5nZSwgdHlwZTogdGhpcy5zdGF0ZS5maWx0ZXJUeXBlfSlcbiAgICAgICAgKSwgXG5cbiAgICAgICAgZ3JvdXBzXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgaGFuZGxlRG9jdW1lbnRDbGljazogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZW5kRWRpdGluZygpO1xuICB9LFxuICBidWlsZEdyb3VwczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBpbnB1dF9wcm9wcztcbiAgICB2YXIgZ3JvdXBzICAgID0gW107XG4gICAgdmFyIGdlbmVyYXRvciA9IHRoaXMucHJvcHMuY3JpdGVyaWEudG9PcHRpb25zLmJpbmQodGhpcy5wcm9wcy5jcml0ZXJpYSk7XG5cbiAgICBpbnB1dF9wcm9wcyA9IHtcbiAgICAgIHR5cGU6ICAgICAgICAgJ3RleHQnLFxuICAgICAgY2xhc3NOYW1lOiAgICAnY2hhaW4gaW5wdXRhYmxlJyxcbiAgICAgIHBsYWNlaG9sZGVyOiAgJ3NlYXJjaCBjcml0ZXJpYScsXG4gICAgICByZWY6ICAgICAgICAgICdzZWFyY2hDcml0ZXJpYScsXG4gICAgICBvbkNoYW5nZTogICAgIHRoaXMuaGFuZGxlU2VhcmNoQ3JpdGVyaWFcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuc3RhdGUuZWRpdGluZykge1xuICAgICAgZ3JvdXBzLnB1c2goXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjaGFpbi1ncm91cFwiLCBrZXk6IFwic2VhcmNoQ3JpdGVyaWFcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQXV0b2NvbXBsZXRlLCB7cmVmOiBcInNlYXJjaENyaXRlcmlhXCIsIG5hbWU6IFwic29tZXRoaW5nXCIsIG9uU2VsZWN0OiB0aGlzLmhhbmRsZVNlbGVjdCwgZ2VuZXJhdG9yOiBnZW5lcmF0b3IsIGVkaXRpbmc6IHRydWV9KVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBncm91cHM7XG4gIH0sXG4gIGhhbmRsZVNlbGVjdDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdGhpcy5wcm9wcy5jcml0ZXJpYS51c2UodmFsdWUudmFsdWUpO1xuICAgIHRoaXMuZW5kRWRpdGluZygpO1xuICB9LFxuICBoYW5kbGVGaWx0ZXJUeXBlQ2hhbmdlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAoISB0aGlzLnByb3BzLmxvY2tUeXBlKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtmaWx0ZXJUeXBlOiB2YWx1ZX0pO1xuICAgIH1cbiAgfSxcbiAgaW5pdGlhdGVTZWFyY2g6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuZEVkaXRpbmcoKTtcbiAgfSxcbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgLy8gSW4gdGhlIHRlc3QgZW52LCB3ZSBkbyBub3QgaGF2ZSBzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24sIHNvIG91clxuICAgIC8vIHRlc3RzIHdpbGwgYnJlYWsgaWYgd2UgZG9uJ3QgdXNlIGFuIGBpZmAgc3RhdGVtZW50IGhlcmVcbiAgICBpZiAoZS5uYXRpdmVFdmVudCAmJiBlLm5hdGl2ZUV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbikge1xuICAgICAgZS5uYXRpdmVFdmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIHRoaXMuZW5hYmxlRWRpdGluZygpO1xuICB9LFxuICBlbmFibGVFZGl0aW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCEgdGhpcy5zdGF0ZS5lZGl0aW5nKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtlZGl0aW5nOiB0cnVlfSk7XG4gICAgfVxuICB9LFxuICBlbmRFZGl0aW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZWRpdGluZykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZWRpdGluZzogZmFsc2V9KTtcbiAgICB9XG4gIH0sXG4gIGZvY3VzU2VhcmNoOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCEgdGhpcy5zdGF0ZS5lZGl0aW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyp2YXIgbm9kZSA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5zZWFyY2hDcml0ZXJpYSk7XG5cbiAgICBub2RlLmZvY3VzKCk7Ki9cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRmlsdGVyQm94O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WVd4aGNtMXpMMlpwYkhSbGNsOWliM2d1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPenRCUVVWQkxFZEJRVWM3TzBGQlJVZ3NTVUZCU1N4VFFVRlRMRU5CUVVNN1FVRkRaQ3hKUVVGSkxFdEJRVXNzVjBGQlZ5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1FVRkRja01zU1VGQlNTeFJRVUZSTEZGQlFWRXNUMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRE8wRkJRM2hETEVsQlFVa3NXVUZCV1N4SlFVRkpMRTlCUVU4c1EwRkJReXh2UWtGQmIwSXNRMEZCUXl4RFFVRkRPMEZCUTJ4RUxFbEJRVWtzVFVGQlRTeFZRVUZWTEU5QlFVOHNRMEZCUXl3MlFrRkJOa0lzUTBGQlF5eERRVUZETzBGQlF6TkVMRWxCUVVrc1VVRkJVU3hSUVVGUkxFOUJRVThzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhEUVVGRE8wRkJRemxETEVsQlFVa3NTMEZCU3l4WFFVRlhMRTlCUVU4c1EwRkJReXgxUWtGQmRVSXNRMEZCUXl4RFFVRkRPMEZCUTNKRUxFbEJRVWtzVVVGQlVTeFJRVUZSTEU5QlFVOHNRMEZCUXl4NVFrRkJlVUlzUTBGQlF5eERRVUZET3p0QlFVVjJSQ3dyUWtGQkswSXNlVUpCUVVFN1JVRkROMElzVTBGQlV5eEZRVUZGTzBsQlExUXNWVUZCVlN4RlFVRkZMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1JVRkJSU3hMUVVGTExFTkJRVU1zUlVGQlJTeERRVUZETEVOQlFVTTdTVUZEZUVRc1VVRkJVU3hKUVVGSkxFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1R0SlFVTm9ReXhSUVVGUkxFbEJRVWtzUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1ZVRkJWVHRIUVVNNVF6dEZRVU5FTEdsQ1FVRnBRaXhGUVVGRkxGbEJRVms3UVVGRGFrTXNTVUZCU1N4SlFVRkpMRU5CUVVNc1YwRkJWeXhGUVVGRkxFTkJRVU03TzBsQlJXNUNMRkZCUVZFc1EwRkJReXhuUWtGQlowSXNRMEZCUXl4UFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExHMUNRVUZ0UWl4RFFVRkRMRU5CUVVNN1IwRkRPVVE3UlVGRFJDeHZRa0ZCYjBJc1JVRkJSU3haUVVGWk8wbEJRMmhETEZGQlFWRXNRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eFBRVUZQTEVWQlFVVXNTVUZCU1N4RFFVRkRMRzFDUVVGdFFpeERRVUZETEVOQlFVTTdSMEZEYWtVN1JVRkRSQ3hyUWtGQmEwSXNSVUZCUlN4WlFVRlpPMGxCUXpsQ0xFbEJRVWtzUTBGQlF5eFhRVUZYTEVWQlFVVXNRMEZCUXp0SFFVTndRanRGUVVORUxHVkJRV1VzUlVGQlJTeFpRVUZaTzBsQlF6TkNMRTlCUVU4N1RVRkRUQ3hWUVVGVkxFVkJRVVVzUzBGQlN5eERRVUZETEVkQlFVYzdUVUZEY2tJc1VVRkJVU3hKUVVGSkxFdEJRVXM3VFVGRGFrSXNUMEZCVHl4TFFVRkxMRXRCUVVzN1MwRkRiRUk3UjBGRFJqdEZRVU5FTEdWQlFXVXNSVUZCUlN4WlFVRlpPMGxCUXpOQ0xFOUJRVTg3VFVGRFRDeFZRVUZWTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhWUVVGVk8wMUJRMnBETEU5QlFVOHNTMEZCU3l4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVTg3UzBGREwwSXNRMEZCUXp0SFFVTklPMFZCUTBRc1RVRkJUU3hGUVVGRkxGbEJRVms3UVVGRGRFSXNTVUZCU1N4SlFVRkpMRTFCUVUwc1IwRkJSeXhKUVVGSkxFTkJRVU1zVjBGQlZ5eEZRVUZGTEVOQlFVTTdPMGxCUldoRE8wMUJRMFVzYjBKQlFVRXNTMEZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eFpRVUZCTEVWQlFWa3NRMEZCUXl4UFFVRkJMRVZCUVU4c1EwRkJSU3hKUVVGSkxFTkJRVU1zVjBGQllTeERRVUZCTEVWQlFVRTdRVUZETjBRc1VVRkJVU3h2UWtGQlF5eE5RVUZOTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExIVkRRVUZCTEVWQlFYVkRMRU5CUVVNc1NVRkJRU3hGUVVGSkxFTkJRVU1zVVVGQlFTeEZRVUZSTEVOQlFVTXNUMEZCUVN4RlFVRlBMRU5CUVVVc1NVRkJTU3hEUVVGRExHTkJRV1VzUTBGQlFTeERRVUZITEVOQlFVRXNSVUZCUVRzN1VVRkZlRWNzYjBKQlFVRXNTMEZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eGhRVUZqTEVOQlFVRXNSVUZCUVR0VlFVTXpRaXh2UWtGQlFTeE5RVUZMTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExFOUJRVkVzUTBGQlFTeEZRVUZCTzBGQlFVRXNXVUZCUVN4elFrRkJRVHRCUVVGQkxFRkJSV3hETEZWQlFXbENMRU5CUVVFc1JVRkJRVHM3VlVGRlVDeHZRa0ZCUXl4TFFVRkxMRVZCUVVFc1EwRkJRU3hEUVVGRExGRkJRVUVzUlVGQlVTeERRVUZGTEVsQlFVa3NRMEZCUXl4elFrRkJjMElzUlVGQlF5eERRVUZETEVsQlFVRXNSVUZCU1N4RFFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVlVGQlZ5eERRVUZCTEVOQlFVY3NRMEZCUVR0QlFVTjJSaXhSUVVGakxFTkJRVUVzUlVGQlFUczdVVUZGVEN4TlFVRlBPMDFCUTBvc1EwRkJRVHROUVVOT08wZEJRMGc3UlVGRFJDeHRRa0ZCYlVJc1JVRkJSU3haUVVGWk8wbEJReTlDTEVsQlFVa3NRMEZCUXl4VlFVRlZMRVZCUVVVc1EwRkJRenRIUVVOdVFqdEZRVU5FTEZkQlFWY3NSVUZCUlN4WlFVRlpPMGxCUTNaQ0xFbEJRVWtzVjBGQlZ5eERRVUZETzBsQlEyaENMRWxCUVVrc1RVRkJUU3hOUVVGTkxFVkJRVVVzUTBGQlF6dEJRVU4yUWl4SlFVRkpMRWxCUVVrc1UwRkJVeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVVUZCVVN4RFFVRkRMRk5CUVZNc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenM3U1VGRmVFVXNWMEZCVnl4SFFVRkhPMDFCUTFvc1NVRkJTU3hWUVVGVkxFMUJRVTA3VFVGRGNFSXNVMEZCVXl4TFFVRkxMR2xDUVVGcFFqdE5RVU12UWl4WFFVRlhMRWRCUVVjc2FVSkJRV2xDTzAxQlF5OUNMRWRCUVVjc1YwRkJWeXhuUWtGQlowSTdUVUZET1VJc1VVRkJVU3hOUVVGTkxFbEJRVWtzUTBGQlF5eHZRa0ZCYjBJN1FVRkROME1zUzBGQlN5eERRVUZET3p0SlFVVkdMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVWQlFVVTdUVUZEZEVJc1RVRkJUU3hEUVVGRExFbEJRVWs3VVVGRFZDeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEdGQlFVRXNSVUZCWVN4RFFVRkRMRWRCUVVFc1JVRkJSeXhEUVVGRExHZENRVUZwUWl4RFFVRkJMRVZCUVVFN1ZVRkRhRVFzYjBKQlFVTXNXVUZCV1N4RlFVRkJMRU5CUVVFc1EwRkJReXhIUVVGQkxFVkJRVWNzUTBGQlF5eG5Ra0ZCUVN4RlFVRm5RaXhEUVVGRExFbEJRVUVzUlVGQlNTeERRVUZETEZkQlFVRXNSVUZCVnl4RFFVRkRMRkZCUVVFc1JVRkJVU3hEUVVGRkxFbEJRVWtzUTBGQlF5eFpRVUZaTEVWQlFVTXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJSU3hUUVVGVExFVkJRVU1zUTBGQlF5eFBRVUZCTEVWQlFVOHNRMEZCUlN4SlFVRkxMRU5CUVVFc1EwRkJSeXhEUVVGQk8xRkJRM0JJTEVOQlFVRTdUMEZEVUN4RFFVRkRPMEZCUTFJc1MwRkJTenM3U1VGRlJDeFBRVUZQTEUxQlFVMHNRMEZCUXp0SFFVTm1PMFZCUTBRc1dVRkJXU3hGUVVGRkxGVkJRVlVzUzBGQlN5eEZRVUZGTzBsQlF6ZENMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03U1VGRGNrTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRE8wZEJRMjVDTzBWQlEwUXNjMEpCUVhOQ0xFVkJRVVVzVlVGQlZTeExRVUZMTEVWQlFVVTdTVUZEZGtNc1NVRkJTU3hGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVVUZCVVN4RlFVRkZPMDFCUTNwQ0xFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4VlFVRlZMRVZCUVVVc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF6dExRVU53UXp0SFFVTkdPMFZCUTBRc1kwRkJZeXhGUVVGRkxGbEJRVms3U1VGRE1VSXNTVUZCU1N4RFFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRE8wZEJRMjVDTzBGQlEwZ3NSVUZCUlN4WFFVRlhMRVZCUVVVc1ZVRkJWU3hEUVVGRExFVkJRVVU3UVVGRE5VSTdPMGxCUlVrc1NVRkJTU3hEUVVGRExFTkJRVU1zVjBGQlZ5eEpRVUZKTEVOQlFVTXNRMEZCUXl4WFFVRlhMRU5CUVVNc2QwSkJRWGRDTEVWQlFVVTdUVUZETTBRc1EwRkJReXhEUVVGRExGZEJRVmNzUTBGQlF5eDNRa0ZCZDBJc1JVRkJSU3hEUVVGRE8wRkJReTlETEV0QlFVczdPMGxCUlVRc1EwRkJReXhEUVVGRExHVkJRV1VzUlVGQlJTeERRVUZETzBGQlEzaENMRWxCUVVrc1EwRkJReXhEUVVGRExHTkJRV01zUlVGQlJTeERRVUZET3p0SlFVVnVRaXhKUVVGSkxFTkJRVU1zWVVGQllTeEZRVUZGTEVOQlFVTTdSMEZEZEVJN1JVRkRSQ3hoUVVGaExFVkJRVVVzV1VGQldUdEpRVU42UWl4SlFVRkpMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVWQlFVVTdUVUZEZUVJc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEU5QlFVOHNSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRE8wdEJRMmhETzBkQlEwWTdSVUZEUkN4VlFVRlZMRVZCUVVVc1dVRkJXVHRKUVVOMFFpeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhGUVVGRk8wMUJRM1JDTEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhQUVVGUExFVkJRVVVzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXp0TFFVTnFRenRIUVVOR08wVkJRMFFzVjBGQlZ5eEZRVUZGTEZsQlFWazdTVUZEZGtJc1NVRkJTU3hGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RlFVRkZPMDFCUTNoQ0xFOUJRVTg3UVVGRFlpeExRVUZMTzBGQlEwdzdRVUZEUVR0QlFVTkJPenRIUVVWSE8wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFRRVUZUTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRVpwYkhSbGNrSnZlRHRjYm5aaGNpQlNaV0ZqZENBZ0lDQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbmNtVmhZM1FuS1R0Y2JuWmhjaUJDWVdOclltOXVaU0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25ZbUZqYTJKdmJtVW5LVHRjYm5aaGNpQkJkWFJ2WTI5dGNHeGxkR1VnSUQwZ2NtVnhkV2x5WlNnbkxpOWhkWFJ2WTI5dGNHeGxkR1V1YW5ONEp5azdYRzUyWVhJZ1FuVjBkRzl1SUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dUx5NHVMMk52YlhCdmJtVnVkSE12WW5WMGRHOXVMbXB6ZUNjcE8xeHVkbUZ5SUVSeWIzQmtiM2R1SUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2N1TDJSeWIzQmtiM2R1TG1wemVDY3BPMXh1ZG1GeUlFRnVaRTl5SUNBZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NjdUwyRnVaRjl2Y2w5elpXeGxZM1J2Y2k1cWMzZ25LVHRjYm5aaGNpQmpjbWwwWlhKcFlTQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpOW1hV3gwWlhKZlltOTRYMlJsWm1sdWFYUnBiMjRuS1R0Y2JseHVSbWxzZEdWeVFtOTRJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dUlDQndjbTl3Vkhsd1pYTTZJSHRjYmlBZ0lDQm1hV3gwWlhKVWVYQmxPaUJTWldGamRDNVFjbTl3Vkhsd1pYTXViMjVsVDJZb1cwRnVaRTl5TGtGT1JDd2dRVzVrVDNJdVQxSmRLU3hjYmlBZ0lDQnNiMk5yVkhsd1pUb2dJQ0JTWldGamRDNVFjbTl3Vkhsd1pYTXVZbTl2YkN4Y2JpQWdJQ0JqY21sMFpYSnBZVG9nSUNCU1pXRmpkQzVRY205d1ZIbHdaWE11YjJKcVpXTjBMbWx6VW1WeGRXbHlaV1JjYmlBZ2ZTeGNiaUFnWTI5dGNHOXVaVzUwUkdsa1RXOTFiblE2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMGFHbHpMbVp2WTNWelUyVmhjbU5vS0NrN1hHNWNiaUFnSUNCa2IyTjFiV1Z1ZEM1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkamJHbGpheWNzSUhSb2FYTXVhR0Z1Wkd4bFJHOWpkVzFsYm5SRGJHbGpheWs3WEc0Z0lIMHNYRzRnSUdOdmJYQnZibVZ1ZEZkcGJHeFZibTF2ZFc1ME9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdaRzlqZFcxbGJuUXVjbVZ0YjNabFJYWmxiblJNYVhOMFpXNWxjaWduWTJ4cFkyc25MQ0IwYUdsekxtaGhibVJzWlVSdlkzVnRaVzUwUTJ4cFkyc3BPMXh1SUNCOUxGeHVJQ0JqYjIxd2IyNWxiblJFYVdSVmNHUmhkR1U2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMGFHbHpMbVp2WTNWelUyVmhjbU5vS0NrN1hHNGdJSDBzWEc0Z0lHZGxkRVJsWm1GMWJIUlFjbTl3Y3pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCN1hHNGdJQ0FnSUNCbWFXeDBaWEpVZVhCbE9pQkJibVJQY2k1QlRrUXNYRzRnSUNBZ0lDQnNiMk5yVkhsd1pUb2dJQ0JtWVd4elpTeGNiaUFnSUNBZ0lHVmthWFJwYm1jNklDQWdJR1poYkhObFhHNGdJQ0FnZlZ4dUlDQjlMRnh1SUNCblpYUkpibWwwYVdGc1UzUmhkR1U2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCeVpYUjFjbTRnZTF4dUlDQWdJQ0FnWm1sc2RHVnlWSGx3WlRvZ2RHaHBjeTV3Y205d2N5NW1hV3gwWlhKVWVYQmxMRnh1SUNBZ0lDQWdaV1JwZEdsdVp6b2dJQ0FnZEdocGN5NXdjbTl3Y3k1bFpHbDBhVzVuWEc0Z0lDQWdmVHRjYmlBZ2ZTeGNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZG1GeUlHZHliM1Z3Y3lBOUlIUm9hWE11WW5WcGJHUkhjbTkxY0hNb0tUdGNibHh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW1acGJIUmxjaTFpYjNoY0lpQnZia05zYVdOclBYdDBhR2x6TG1oaGJtUnNaVU5zYVdOcmZUNWNiaUFnSUNBZ0lDQWdQRUoxZEhSdmJpQmpiR0Z6YzA1aGJXVTlYQ0p6WldGeVkyZ3RZV04wYVc5dUlIQjFiR3d0Y21sbmFIUWdabVZoZFhndFluVjBkRzl1WENJZ2FXTnZiajFjSW5ObFlYSmphRndpSUc5dVEyeHBZMnM5ZTNSb2FYTXVhVzVwZEdsaGRHVlRaV0Z5WTJoOUlDOCtYRzVjYmlBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0pqYUdGcGJpMW5jbTkxY0Z3aVBseHVJQ0FnSUNBZ0lDQWdJRHh6Y0dGdUlHTnNZWE56VG1GdFpUMWNJbU5vWVdsdVhDSStYRzRnSUNBZ0lDQWdJQ0FnSUNCR2FXNWtJR0ZzWVhKdGN5QnRZWFJqYUdsdVoxeHVJQ0FnSUNBZ0lDQWdJRHd2YzNCaGJqNWNibHh1SUNBZ0lDQWdJQ0FnSUR4QmJtUlBjaUJ2YmtOb1lXNW5aVDE3ZEdocGN5NW9ZVzVrYkdWR2FXeDBaWEpVZVhCbFEyaGhibWRsZlNCMGVYQmxQWHQwYUdsekxuTjBZWFJsTG1acGJIUmxjbFI1Y0dWOUlDOCtYRzRnSUNBZ0lDQWdJRHd2WkdsMlBseHVYRzRnSUNBZ0lDQWdJSHRuY205MWNITjlYRzRnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FwTzF4dUlDQjlMRnh1SUNCb1lXNWtiR1ZFYjJOMWJXVnVkRU5zYVdOck9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkR2hwY3k1bGJtUkZaR2wwYVc1bktDazdYRzRnSUgwc1hHNGdJR0oxYVd4a1IzSnZkWEJ6T2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2RtRnlJR2x1Y0hWMFgzQnliM0J6TzF4dUlDQWdJSFpoY2lCbmNtOTFjSE1nSUNBZ1BTQmJYVHRjYmlBZ0lDQjJZWElnWjJWdVpYSmhkRzl5SUQwZ2RHaHBjeTV3Y205d2N5NWpjbWwwWlhKcFlTNTBiMDl3ZEdsdmJuTXVZbWx1WkNoMGFHbHpMbkJ5YjNCekxtTnlhWFJsY21saEtUdGNibHh1SUNBZ0lHbHVjSFYwWDNCeWIzQnpJRDBnZTF4dUlDQWdJQ0FnZEhsd1pUb2dJQ0FnSUNBZ0lDQW5kR1Y0ZENjc1hHNGdJQ0FnSUNCamJHRnpjMDVoYldVNklDQWdJQ2RqYUdGcGJpQnBibkIxZEdGaWJHVW5MRnh1SUNBZ0lDQWdjR3hoWTJWb2IyeGtaWEk2SUNBbmMyVmhjbU5vSUdOeWFYUmxjbWxoSnl4Y2JpQWdJQ0FnSUhKbFpqb2dJQ0FnSUNBZ0lDQWdKM05sWVhKamFFTnlhWFJsY21saEp5eGNiaUFnSUNBZ0lHOXVRMmhoYm1kbE9pQWdJQ0FnZEdocGN5NW9ZVzVrYkdWVFpXRnlZMmhEY21sMFpYSnBZVnh1SUNBZ0lIMDdYRzVjYmlBZ0lDQnBaaUFvZEdocGN5NXpkR0YwWlM1bFpHbDBhVzVuS1NCN1hHNGdJQ0FnSUNCbmNtOTFjSE11Y0hWemFDaGNiaUFnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSmphR0ZwYmkxbmNtOTFjRndpSUd0bGVUMWNJbk5sWVhKamFFTnlhWFJsY21saFhDSStYRzRnSUNBZ0lDQWdJQ0FnUEVGMWRHOWpiMjF3YkdWMFpTQnlaV1k5WENKelpXRnlZMmhEY21sMFpYSnBZVndpSUc1aGJXVTlYQ0p6YjIxbGRHaHBibWRjSWlCdmJsTmxiR1ZqZEQxN2RHaHBjeTVvWVc1a2JHVlRaV3hsWTNSOUlHZGxibVZ5WVhSdmNqMTdaMlZ1WlhKaGRHOXlmU0JsWkdsMGFXNW5QWHQwY25WbGZTQXZQbHh1SUNBZ0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBZ0lDazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2NtVjBkWEp1SUdkeWIzVndjenRjYmlBZ2ZTeGNiaUFnYUdGdVpHeGxVMlZzWldOME9pQm1kVzVqZEdsdmJpQW9kbUZzZFdVcElIdGNiaUFnSUNCMGFHbHpMbkJ5YjNCekxtTnlhWFJsY21saExuVnpaU2gyWVd4MVpTNTJZV3gxWlNrN1hHNGdJQ0FnZEdocGN5NWxibVJGWkdsMGFXNW5LQ2s3WEc0Z0lIMHNYRzRnSUdoaGJtUnNaVVpwYkhSbGNsUjVjR1ZEYUdGdVoyVTZJR1oxYm1OMGFXOXVJQ2gyWVd4MVpTa2dlMXh1SUNBZ0lHbG1JQ2doSUhSb2FYTXVjSEp2Y0hNdWJHOWphMVI1Y0dVcElIdGNiaUFnSUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTJacGJIUmxjbFI1Y0dVNklIWmhiSFZsZlNrN1hHNGdJQ0FnZlZ4dUlDQjlMRnh1SUNCcGJtbDBhV0YwWlZObFlYSmphRG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhSb2FYTXVaVzVrUldScGRHbHVaeWdwTzF4dUlDQjlMRnh1SUNCb1lXNWtiR1ZEYkdsamF6b2dablZ1WTNScGIyNGdLR1VwSUh0Y2JpQWdJQ0F2THlCSmJpQjBhR1VnZEdWemRDQmxibllzSUhkbElHUnZJRzV2ZENCb1lYWmxJSE4wYjNCSmJXMWxaR2xoZEdWUWNtOXdZV2RoZEdsdmJpd2djMjhnYjNWeVhHNGdJQ0FnTHk4Z2RHVnpkSE1nZDJsc2JDQmljbVZoYXlCcFppQjNaU0JrYjI0bmRDQjFjMlVnWVc0Z1lHbG1ZQ0J6ZEdGMFpXMWxiblFnYUdWeVpWeHVJQ0FnSUdsbUlDaGxMbTVoZEdsMlpVVjJaVzUwSUNZbUlHVXVibUYwYVhabFJYWmxiblF1YzNSdmNFbHRiV1ZrYVdGMFpWQnliM0JoWjJGMGFXOXVLU0I3WEc0Z0lDQWdJQ0JsTG01aGRHbDJaVVYyWlc1MExuTjBiM0JKYlcxbFpHbGhkR1ZRY205d1lXZGhkR2x2YmlncE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdVdWMzUnZjRkJ5YjNCaFoyRjBhVzl1S0NrN1hHNGdJQ0FnWlM1d2NtVjJaVzUwUkdWbVlYVnNkQ2dwTzF4dVhHNGdJQ0FnZEdocGN5NWxibUZpYkdWRlpHbDBhVzVuS0NrN1hHNGdJSDBzWEc0Z0lHVnVZV0pzWlVWa2FYUnBibWM2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCcFppQW9JU0IwYUdsekxuTjBZWFJsTG1Wa2FYUnBibWNwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVjMlYwVTNSaGRHVW9lMlZrYVhScGJtYzZJSFJ5ZFdWOUtUdGNiaUFnSUNCOVhHNGdJSDBzWEc0Z0lHVnVaRVZrYVhScGJtYzZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0JwWmlBb2RHaHBjeTV6ZEdGMFpTNWxaR2wwYVc1bktTQjdYRzRnSUNBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0bFpHbDBhVzVuT2lCbVlXeHpaWDBwTzF4dUlDQWdJSDFjYmlBZ2ZTeGNiaUFnWm05amRYTlRaV0Z5WTJnNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnBaaUFvSVNCMGFHbHpMbk4wWVhSbExtVmthWFJwYm1jcElIdGNiaUFnSUNBZ0lISmxkSFZ5Ymp0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2S25aaGNpQnViMlJsSUQwZ1VtVmhZM1F1Wm1sdVpFUlBUVTV2WkdVb2RHaHBjeTV5WldaekxuTmxZWEpqYUVOeWFYUmxjbWxoS1R0Y2JseHVJQ0FnSUc1dlpHVXVabTlqZFhNb0tUc3FMMXh1SUNCOVhHNTlLVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCR2FXeDBaWEpDYjNnN1hHNGlYWDA9IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfICAgICAgICAgICAgID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyIGRhdGVfbWF0Y2hlcnMgPSBbJ2RheScsICdkYXRlJ107XG52YXIgZXNjYXBlUmVnZXggICA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL2VzY2FwZV9yZWdleCcpO1xudmFyIGRlZmluaXRpb247XG5cbmRlZmluaXRpb24gPSB7XG4gIGNyaXRlcmlhOiB7XG4gICAgd2VsbDoge1xuICAgICAgZGlzcGxheTogICdXZWxsIG5hbWUnLFxuICAgICAgbG9ja2VkOiAgIGZhbHNlLFxuICAgICAgdmFsdWU6ICAgIG51bGwsXG4gICAgICB0eXBlOiAgICAgJ3N0cmluZycsXG4gICAgICBuZWdhdGU6ICAgZmFsc2VcbiAgICB9LFxuICAgIHJlcG9ydGVyOiB7XG4gICAgICBkaXNwbGF5OiAgJ1JlcG9ydGVkIGJ5JyxcbiAgICAgIGxvY2tlZDogICBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICBudWxsLFxuICAgICAgdHlwZTogICAgICdzdHJpbmcnLFxuICAgICAgbmVnYXRlOiAgIGZhbHNlXG4gICAgfSxcbiAgICByZXBvcnRlZDoge1xuICAgICAgZGlzcGxheTogICdSZXBvcnRlZCBvbicsXG4gICAgICBtYXRjaGVyczogZGF0ZV9tYXRjaGVycyxcbiAgICAgIGxvY2tlZDogICBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICBudWxsLFxuICAgICAgdHlwZTogICAgICdkYXknLFxuICAgICAgbmVnYXRlOiAgIGZhbHNlXG4gICAgfSxcbiAgICByZXBvcnRlZF9iZXR3ZWVuOiB7XG4gICAgICBkaXNwbGF5OiAgJ1JlcG9ydGVkIGJldHdlZW4nLFxuICAgICAgbWF0Y2hlcnM6IGRhdGVfbWF0Y2hlcnMsXG4gICAgICBsb2NrZWQ6ICAgZmFsc2UsXG4gICAgICB2YWx1ZTogICAgW10sXG4gICAgICB0eXBlOiAgICAgJ2RhdGVyYW5nZSdcbiAgICB9LFxuICAgIHJlcG9ydGVkX2d0OiB7XG4gICAgICBkaXNwbGF5OiAgJ1JlcG9ydGVkIGFmdGVyJyxcbiAgICAgIG1hdGNoZXJzOiBkYXRlX21hdGNoZXJzLFxuICAgICAgbG9ja2VkOiAgIGZhbHNlLFxuICAgICAgdmFsdWU6ICAgIG51bGwsXG4gICAgICB0eXBlOiAgICAgJ2RheSdcbiAgICB9LFxuICAgIHJlcG9ydGVkX2x0OiB7XG4gICAgICBkaXNwbGF5OiAgJ1JlcG9ydGVkIGJlZm9yZScsXG4gICAgICBtYXRjaGVyczogZGF0ZV9tYXRjaGVycyxcbiAgICAgIGxvY2tlZDogICBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICBudWxsLFxuICAgICAgdHlwZTogICAgICdkYXknXG4gICAgfSxcbiAgICB1cGRhdGVkOiB7XG4gICAgICBkaXNwbGF5OiAgJ1VwZGF0ZWQgb24nLFxuICAgICAgbWF0Y2hlcnM6IGRhdGVfbWF0Y2hlcnMsXG4gICAgICBsb2NrZWQ6ICAgZmFsc2UsXG4gICAgICB2YWx1ZTogICAgbnVsbCxcbiAgICAgIHR5cGU6ICAgICAnZGF5JyxcbiAgICAgIG5lZ2F0ZTogICBmYWxzZVxuICAgIH0sXG4gICAgdXBkYXRlZF9iZXR3ZWVuOiB7XG4gICAgICBkaXNwbGF5OiAgJ1VwZGF0ZWQgYmV0d2VlbicsXG4gICAgICBtYXRjaGVyczogZGF0ZV9tYXRjaGVycyxcbiAgICAgIGxvY2tlZDogICBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICBbXSxcbiAgICAgIHR5cGU6ICAgICAnZGF0ZXJhbmdlJ1xuICAgIH0sXG4gICAgdXBkYXRlZF9ndDoge1xuICAgICAgZGlzcGxheTogICdVcGRhdGVkIGFmdGVyJyxcbiAgICAgIG1hdGNoZXJzOiBkYXRlX21hdGNoZXJzLFxuICAgICAgbG9ja2VkOiAgIGZhbHNlLFxuICAgICAgdmFsdWU6ICAgIG51bGwsXG4gICAgICB0eXBlOiAgICAgJ2RheSdcbiAgICB9LFxuICAgIHVwZGF0ZWRfbHQ6IHtcbiAgICAgIGRpc3BsYXk6ICAnVXBkYXRlZCBiZWZvcmUnLFxuICAgICAgbWF0Y2hlcnM6IGRhdGVfbWF0Y2hlcnMsXG4gICAgICBsb2NrZWQ6ICAgZmFsc2UsXG4gICAgICB2YWx1ZTogICAgbnVsbCxcbiAgICAgIHR5cGU6ICAgICAnZGF5J1xuICAgIH0sXG4gICAgdGFnczoge1xuICAgICAgZGlzcGxheTogICdUYWdzJyxcbiAgICAgIGxvY2tlZDogICBmYWxzZSxcbiAgICAgIHR5cGU6ICAgICAndGFnJyxcbiAgICAgIG5lZ2F0ZTogICBmYWxzZSxcbiAgICAgIG11bHRpOiAgICB0cnVlXG4gICAgfSxcbiAgICBwcmlvcml0eToge1xuICAgICAgZGlzcGxheTogICdQcmlvcml0eScsXG4gICAgICBsb2NrZWQ6ICAgZmFsc2UsXG4gICAgICB0eXBlOiAgICAgJ251bWJlcicsXG4gICAgICBuZWdhdGU6ICAgZmFsc2VcbiAgICB9LFxuICAgIHByaW9yaXR5X2d0OiB7XG4gICAgICBkaXNwbGF5OiAgJ1ByaW9yaXR5IGFib3ZlJyxcbiAgICAgIGxvY2tlZDogICBmYWxzZSxcbiAgICAgIHR5cGU6ICAgICAnbnVtYmVyJ1xuICAgIH0sXG4gICAgcHJpb3JpdHlfbHQ6IHtcbiAgICAgIGRpc3BsYXk6ICAnUHJpb3JpdHkgYmVsb3cnLFxuICAgICAgbG9ja2VkOiAgIGZhbHNlLFxuICAgICAgdHlwZTogICAgICdudW1iZXInXG4gICAgfSxcbiAgICBpc3N1ZV90eXBlOiB7XG4gICAgICBkaXNwbGF5OiAgJ0lzc3VlIHR5cGUnLFxuICAgICAgbG9ja2VkOiAgIGZhbHNlLFxuICAgICAgdHlwZTogICAgICdzdHJpbmcnLFxuICAgICAgbXVsdGk6ICAgIHRydWVcbiAgICB9LFxuICAgIGlzc3VlX3N1YnR5cGU6IHtcbiAgICAgIGRpc3BsYXk6ICAnSXNzdWUgc3VidHlwZScsXG4gICAgICBsb2NrZWQ6ICAgZmFsc2UsXG4gICAgICB0eXBlOiAgICAgJ3N0cmluZycsXG4gICAgICBtdWx0aTogICAgdHJ1ZVxuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gQnVpbGRlciAoY3JpdGVyaWEpIHtcbiAgdGhpcy5jcml0ZXJpYSAgID0gXy5leHRlbmQoe30sIGNyaXRlcmlhKTtcbiAgdGhpcy5mcmVlX3RleHQgID0gbnVsbDtcbn1cblxuQnVpbGRlci5wcm90b3R5cGUubWF0Y2hDcml0ZXJpYSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgY29uc29sZS50aW1lKCdtYXRjaENyaXRlcmlhJylcbiAgdmFyIHJlc3VsdHM7XG4gIHZhciBwYXR0ZXJuICAgPSAvLi87XG4gIHZhciB2YWx1ZXMgICAgPSBbXTtcbiAgdmFyIGtleXMgICAgICA9IE9iamVjdC5rZXlzKHRoaXMuY3JpdGVyaWEpO1xuICB2YXIgdHJ1dGhUZXN0ID0gZnVuY3Rpb24gKCkge3JldHVybiB0cnVlO307XG5cbiAgaWYgKHN0cmluZyAmJiBzdHJpbmcubGVuZ3RoID4gMCkge1xuICAgIHBhdHRlcm4gICA9IG5ldyBSZWdFeHAoZXNjYXBlUmVnZXgoc3RyaW5nIHx8ICcnKSwgJ2knKTtcbiAgICB0cnV0aFRlc3QgPSBwYXR0ZXJuLnRlc3QuYmluZChwYXR0ZXJuKTtcbiAgfVxuXG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIG1hdGNoZXJzO1xuICAgIHZhciBpO1xuICAgIHZhciBsZW47XG4gICAgdmFyIGNyaXRlcmlhID0gdGhpcy5jcml0ZXJpYVtrZXldO1xuXG4gICAgaWYgKCEgdGhpcy5pc0F2YWlsYWJsZShrZXkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRydXRoVGVzdChrZXkpKSB7XG4gICAgICByZXR1cm4gdmFsdWVzLnB1c2goa2V5KTtcbiAgICB9XG5cbiAgICBpZiAodHJ1dGhUZXN0KCdbJyArIGNyaXRlcmlhLmRpc3BsYXkgKyAnXScpKSB7XG4gICAgICByZXR1cm4gdmFsdWVzLnB1c2goa2V5KTtcbiAgICB9XG5cbiAgICBtYXRjaGVycyA9IGNyaXRlcmlhLm1hdGNoZXJzIHx8IFtdO1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0gbWF0Y2hlcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmIChwYXR0ZXJuLnRlc3QobWF0Y2hlcnNbaV0pKSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKGtleSk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9LCB0aGlzKTtcblxuICByZXN1bHRzID0gXy5waWNrKHRoaXMuY3JpdGVyaWEsIHZhbHVlcyk7XG4gIGNvbnNvbGUudGltZUVuZCgnbWF0Y2hDcml0ZXJpYScpXG5cbiAgcmV0dXJuIHJlc3VsdHM7XG59O1xuXG5CdWlsZGVyLnByb3RvdHlwZS50b09wdGlvbnMgPSBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gIHZhciByZXN1bHRzID0gdGhpcy5tYXRjaENyaXRlcmlhKHN0cmluZyk7XG4gIHZhciBvcHRpb25zID0gXy5tYXAocmVzdWx0cywgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuICAgIHJldHVybiB7dmFsdWU6IGtleSwgbGFiZWw6IGl0ZW0uZGlzcGxheX07XG4gIH0pO1xuXG4gIGlmIChzdHJpbmcgJiYgISB0aGlzLmZyZWVfdGV4dCAmJiAhIC9eXFxbLy50ZXN0KHN0cmluZykpIHtcbiAgICBvcHRpb25zLnVuc2hpZnQoe1xuICAgICAgbGFiZWw6ICBzdHJpbmcsXG4gICAgICB2YWx1ZTogIHN0cmluZ1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIG9wdGlvbnM7XG59O1xuXG5CdWlsZGVyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoa2V5LCBwcm9wLCB2YWx1ZSkge1xuICBpZiAoISBrZXkgfHwgISBwcm9wKSB7XG4gICAgdGhyb3cgJ2tleSBhbmQgcHJvcCBhcmUgcmVxdWlyZWQnO1xuICB9XG5cbiAgaWYgKHRoaXMuY3JpdGVyaWEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgIHRoaXMuY3JpdGVyaWFba2V5XVtwcm9wXSA9IHZhbHVlO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cbkJ1aWxkZXIucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIHRoaXMuc2V0KGtleSwgJ3VzZWQnLCB0cnVlKTtcbn07XG5cbkJ1aWxkZXIucHJvdG90eXBlLnJlZnVuZCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIHRoaXMuc2V0KGtleSwgJ3VzZWQnKTtcbn07XG5cbkJ1aWxkZXIucHJvdG90eXBlLmxvY2sgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiB0aGlzLnNldChrZXksICdsb2NrZWQnLCB0cnVlKTtcbn07XG5cbkJ1aWxkZXIucHJvdG90eXBlLnVubG9jayA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIHRoaXMuc2V0KGtleSwgJ2xvY2tlZCcsIGZhbHNlKTtcbn07XG5cbkJ1aWxkZXIucHJvdG90eXBlLmlzQXZhaWxhYmxlID0gZnVuY3Rpb24gKGtleSkge1xuICB2YXIgY3JpdGVyaWEgPSB0aGlzLmNyaXRlcmlhW2tleV07XG5cbiAgaWYgKCEgY3JpdGVyaWEpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gISBjcml0ZXJpYS5sb2NrZWQgJiYgISBjcml0ZXJpYS51c2VkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRlZmluaXRpb246IGRlZmluaXRpb24uY3JpdGVyaWEsXG4gIEJ1aWxkZXI6IEJ1aWxkZXJcbn07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZZV3hoY20xekwyWnBiSFJsY2w5aWIzaGZaR1ZtYVc1cGRHbHZiaTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeFpRVUZaTEVOQlFVTTdPMEZCUldJc1NVRkJTU3hEUVVGRExHVkJRV1VzVDBGQlR5eERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPMEZCUXpGRExFbEJRVWtzWVVGQllTeEhRVUZITEVOQlFVTXNTMEZCU3l4RlFVRkZMRTFCUVUwc1EwRkJReXhEUVVGRE8wRkJRM0JETEVsQlFVa3NWMEZCVnl4TFFVRkxMRTlCUVU4c1EwRkJReXd3UWtGQk1FSXNRMEZCUXl4RFFVRkRPMEZCUTNoRUxFbEJRVWtzVlVGQlZTeERRVUZET3p0QlFVVm1MRlZCUVZVc1IwRkJSenRGUVVOWUxGRkJRVkVzUlVGQlJUdEpRVU5TTEVsQlFVa3NSVUZCUlR0TlFVTktMRTlCUVU4c1IwRkJSeXhYUVVGWE8wMUJRM0pDTEUxQlFVMHNTVUZCU1N4TFFVRkxPMDFCUTJZc1MwRkJTeXhMUVVGTExFbEJRVWs3VFVGRFpDeEpRVUZKTEUxQlFVMHNVVUZCVVR0TlFVTnNRaXhOUVVGTkxFbEJRVWtzUzBGQlN6dExRVU5vUWp0SlFVTkVMRkZCUVZFc1JVRkJSVHROUVVOU0xFOUJRVThzUjBGQlJ5eGhRVUZoTzAxQlEzWkNMRTFCUVUwc1NVRkJTU3hMUVVGTE8wMUJRMllzUzBGQlN5eExRVUZMTEVsQlFVazdUVUZEWkN4SlFVRkpMRTFCUVUwc1VVRkJVVHROUVVOc1FpeE5RVUZOTEVsQlFVa3NTMEZCU3p0TFFVTm9RanRKUVVORUxGRkJRVkVzUlVGQlJUdE5RVU5TTEU5QlFVOHNSMEZCUnl4aFFVRmhPMDFCUTNaQ0xGRkJRVkVzUlVGQlJTeGhRVUZoTzAxQlEzWkNMRTFCUVUwc1NVRkJTU3hMUVVGTE8wMUJRMllzUzBGQlN5eExRVUZMTEVsQlFVazdUVUZEWkN4SlFVRkpMRTFCUVUwc1MwRkJTenROUVVObUxFMUJRVTBzU1VGQlNTeExRVUZMTzB0QlEyaENPMGxCUTBRc1owSkJRV2RDTEVWQlFVVTdUVUZEYUVJc1QwRkJUeXhIUVVGSExHdENRVUZyUWp0TlFVTTFRaXhSUVVGUkxFVkJRVVVzWVVGQllUdE5RVU4yUWl4TlFVRk5MRWxCUVVrc1MwRkJTenROUVVObUxFdEJRVXNzUzBGQlN5eEZRVUZGTzAxQlExb3NTVUZCU1N4TlFVRk5MRmRCUVZjN1MwRkRkRUk3U1VGRFJDeFhRVUZYTEVWQlFVVTdUVUZEV0N4UFFVRlBMRWRCUVVjc1owSkJRV2RDTzAxQlF6RkNMRkZCUVZFc1JVRkJSU3hoUVVGaE8wMUJRM1pDTEUxQlFVMHNTVUZCU1N4TFFVRkxPMDFCUTJZc1MwRkJTeXhMUVVGTExFbEJRVWs3VFVGRFpDeEpRVUZKTEUxQlFVMHNTMEZCU3p0TFFVTm9RanRKUVVORUxGZEJRVmNzUlVGQlJUdE5RVU5ZTEU5QlFVOHNSMEZCUnl4cFFrRkJhVUk3VFVGRE0wSXNVVUZCVVN4RlFVRkZMR0ZCUVdFN1RVRkRka0lzVFVGQlRTeEpRVUZKTEV0QlFVczdUVUZEWml4TFFVRkxMRXRCUVVzc1NVRkJTVHROUVVOa0xFbEJRVWtzVFVGQlRTeExRVUZMTzB0QlEyaENPMGxCUTBRc1QwRkJUeXhGUVVGRk8wMUJRMUFzVDBGQlR5eEhRVUZITEZsQlFWazdUVUZEZEVJc1VVRkJVU3hGUVVGRkxHRkJRV0U3VFVGRGRrSXNUVUZCVFN4SlFVRkpMRXRCUVVzN1RVRkRaaXhMUVVGTExFdEJRVXNzU1VGQlNUdE5RVU5rTEVsQlFVa3NUVUZCVFN4TFFVRkxPMDFCUTJZc1RVRkJUU3hKUVVGSkxFdEJRVXM3UzBGRGFFSTdTVUZEUkN4bFFVRmxMRVZCUVVVN1RVRkRaaXhQUVVGUExFZEJRVWNzYVVKQlFXbENPMDFCUXpOQ0xGRkJRVkVzUlVGQlJTeGhRVUZoTzAxQlEzWkNMRTFCUVUwc1NVRkJTU3hMUVVGTE8wMUJRMllzUzBGQlN5eExRVUZMTEVWQlFVVTdUVUZEV2l4SlFVRkpMRTFCUVUwc1YwRkJWenRMUVVOMFFqdEpRVU5FTEZWQlFWVXNSVUZCUlR0TlFVTldMRTlCUVU4c1IwRkJSeXhsUVVGbE8wMUJRM3BDTEZGQlFWRXNSVUZCUlN4aFFVRmhPMDFCUTNaQ0xFMUJRVTBzU1VGQlNTeExRVUZMTzAxQlEyWXNTMEZCU3l4TFFVRkxMRWxCUVVrN1RVRkRaQ3hKUVVGSkxFMUJRVTBzUzBGQlN6dExRVU5vUWp0SlFVTkVMRlZCUVZVc1JVRkJSVHROUVVOV0xFOUJRVThzUjBGQlJ5eG5Ra0ZCWjBJN1RVRkRNVUlzVVVGQlVTeEZRVUZGTEdGQlFXRTdUVUZEZGtJc1RVRkJUU3hKUVVGSkxFdEJRVXM3VFVGRFppeExRVUZMTEV0QlFVc3NTVUZCU1R0TlFVTmtMRWxCUVVrc1RVRkJUU3hMUVVGTE8wdEJRMmhDTzBsQlEwUXNTVUZCU1N4RlFVRkZPMDFCUTBvc1QwRkJUeXhIUVVGSExFMUJRVTA3VFVGRGFFSXNUVUZCVFN4SlFVRkpMRXRCUVVzN1RVRkRaaXhKUVVGSkxFMUJRVTBzUzBGQlN6dE5RVU5tTEUxQlFVMHNTVUZCU1N4TFFVRkxPMDFCUTJZc1MwRkJTeXhMUVVGTExFbEJRVWs3UzBGRFpqdEpRVU5FTEZGQlFWRXNSVUZCUlR0TlFVTlNMRTlCUVU4c1IwRkJSeXhWUVVGVk8wMUJRM0JDTEUxQlFVMHNTVUZCU1N4TFFVRkxPMDFCUTJZc1NVRkJTU3hOUVVGTkxGRkJRVkU3VFVGRGJFSXNUVUZCVFN4SlFVRkpMRXRCUVVzN1MwRkRhRUk3U1VGRFJDeFhRVUZYTEVWQlFVVTdUVUZEV0N4UFFVRlBMRWRCUVVjc1owSkJRV2RDTzAxQlF6RkNMRTFCUVUwc1NVRkJTU3hMUVVGTE8wMUJRMllzU1VGQlNTeE5RVUZOTEZGQlFWRTdTMEZEYmtJN1NVRkRSQ3hYUVVGWExFVkJRVVU3VFVGRFdDeFBRVUZQTEVkQlFVY3NaMEpCUVdkQ08wMUJRekZDTEUxQlFVMHNTVUZCU1N4TFFVRkxPMDFCUTJZc1NVRkJTU3hOUVVGTkxGRkJRVkU3UzBGRGJrSTdTVUZEUkN4VlFVRlZMRVZCUVVVN1RVRkRWaXhQUVVGUExFZEJRVWNzV1VGQldUdE5RVU4wUWl4TlFVRk5MRWxCUVVrc1MwRkJTenROUVVObUxFbEJRVWtzVFVGQlRTeFJRVUZSTzAxQlEyeENMRXRCUVVzc1MwRkJTeXhKUVVGSk8wdEJRMlk3U1VGRFJDeGhRVUZoTEVWQlFVVTdUVUZEWWl4UFFVRlBMRWRCUVVjc1pVRkJaVHROUVVONlFpeE5RVUZOTEVsQlFVa3NTMEZCU3p0TlFVTm1MRWxCUVVrc1RVRkJUU3hSUVVGUk8wMUJRMnhDTEV0QlFVc3NTMEZCU3l4SlFVRkpPMHRCUTJZN1IwRkRSanRCUVVOSUxFTkJRVU1zUTBGQlF6czdRVUZGUml4VFFVRlRMRTlCUVU4c1JVRkJSU3hSUVVGUkxFVkJRVVU3UlVGRE1VSXNTVUZCU1N4RFFVRkRMRkZCUVZFc1MwRkJTeXhEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEVWQlFVVXNSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenRGUVVONlF5eEpRVUZKTEVOQlFVTXNVMEZCVXl4SlFVRkpMRWxCUVVrc1EwRkJRenRCUVVONlFpeERRVUZET3p0QlFVVkVMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zWVVGQllTeEhRVUZITEZWQlFWVXNUVUZCVFN4RlFVRkZPMFZCUTJ4RUxFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNaVUZCWlN4RFFVRkRPMFZCUXpkQ0xFbEJRVWtzVDBGQlR5eERRVUZETzBWQlExb3NTVUZCU1N4UFFVRlBMRXRCUVVzc1IwRkJSeXhEUVVGRE8wVkJRM0JDTEVsQlFVa3NUVUZCVFN4TlFVRk5MRVZCUVVVc1EwRkJRenRGUVVOdVFpeEpRVUZKTEVsQlFVa3NVVUZCVVN4TlFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0QlFVTTNReXhGUVVGRkxFbEJRVWtzVTBGQlV5eEhRVUZITEZsQlFWa3NRMEZCUXl4UFFVRlBMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU03TzBWQlJUTkRMRWxCUVVrc1RVRkJUU3hKUVVGSkxFMUJRVTBzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RlFVRkZPMGxCUXk5Q0xFOUJRVThzUzBGQlN5eEpRVUZKTEUxQlFVMHNRMEZCUXl4WFFVRlhMRU5CUVVNc1RVRkJUU3hKUVVGSkxFVkJRVVVzUTBGQlF5eEZRVUZGTEVkQlFVY3NRMEZCUXl4RFFVRkRPMGxCUTNaRUxGTkJRVk1zUjBGQlJ5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU16UXl4SFFVRkhPenRGUVVWRUxFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNWVUZCVlN4SFFVRkhMRVZCUVVVN1NVRkRNVUlzU1VGQlNTeFJRVUZSTEVOQlFVTTdTVUZEWWl4SlFVRkpMRU5CUVVNc1EwRkJRenRKUVVOT0xFbEJRVWtzUjBGQlJ5eERRVUZETzBGQlExb3NTVUZCU1N4SlFVRkpMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPenRKUVVWc1F5eEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRmRCUVZjc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJUdE5RVU16UWl4UFFVRlBMRXRCUVVzc1EwRkJRenRCUVVOdVFpeExRVUZMT3p0SlFVVkVMRWxCUVVrc1UwRkJVeXhEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTzAxQlEyeENMRTlCUVU4c1RVRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0QlFVTTVRaXhMUVVGTE96dEpRVVZFTEVsQlFVa3NVMEZCVXl4RFFVRkRMRWRCUVVjc1IwRkJSeXhSUVVGUkxFTkJRVU1zVDBGQlR5eEhRVUZITEVkQlFVY3NRMEZCUXl4RlFVRkZPMDFCUXpORExFOUJRVThzVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVNNVFpeExRVUZMT3p0QlFVVk1MRWxCUVVrc1VVRkJVU3hIUVVGSExGRkJRVkVzUTBGQlF5eFJRVUZSTEVsQlFVa3NSVUZCUlN4RFFVRkRPenRKUVVWdVF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVVc1IwRkJSeXhIUVVGSExGRkJRVkVzUTBGQlF5eE5RVUZOTEVWQlFVVXNRMEZCUXl4SFFVRkhMRWRCUVVjc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJUdE5RVU12UXl4SlFVRkpMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRVZCUVVVN1FVRkRja01zVVVGQlVTeE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE96dFJRVVZxUWl4UFFVRlBMRWxCUVVrc1EwRkJRenRQUVVOaU8wdEJRMFk3UVVGRFRDeEhRVUZITEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN08wVkJSVlFzVDBGQlR5eEhRVUZITEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExGRkJRVkVzUlVGQlJTeE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVTXhReXhGUVVGRkxFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNaVUZCWlN4RFFVRkRPenRGUVVWb1F5eFBRVUZQTEU5QlFVOHNRMEZCUXp0QlFVTnFRaXhEUVVGRExFTkJRVU03TzBGQlJVWXNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhUUVVGVExFZEJRVWNzVlVGQlZTeE5RVUZOTEVWQlFVVTdSVUZET1VNc1NVRkJTU3hQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETEdGQlFXRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenRGUVVONlF5eEpRVUZKTEU5QlFVOHNSMEZCUnl4RFFVRkRMRU5CUVVNc1IwRkJSeXhEUVVGRExFOUJRVThzUlVGQlJTeFZRVUZWTEVsQlFVa3NSVUZCUlN4SFFVRkhMRVZCUVVVN1NVRkRhRVFzVDBGQlR5eERRVUZETEV0QlFVc3NSVUZCUlN4SFFVRkhMRVZCUVVVc1MwRkJTeXhGUVVGRkxFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0QlFVTTNReXhIUVVGSExFTkJRVU1zUTBGQlF6czdSVUZGU0N4SlFVRkpMRTFCUVUwc1NVRkJTU3hGUVVGRkxFbEJRVWtzUTBGQlF5eFRRVUZUTEVsQlFVa3NSVUZCUlN4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eEZRVUZGTzBsQlEzUkVMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU03VFVGRFpDeExRVUZMTEVkQlFVY3NUVUZCVFR0TlFVTmtMRXRCUVVzc1IwRkJSeXhOUVVGTk8wdEJRMllzUTBGQlF5eERRVUZETzBGQlExQXNSMEZCUnpzN1JVRkZSQ3hQUVVGUExFOUJRVThzUTBGQlF6dEJRVU5xUWl4RFFVRkRMRU5CUVVNN08wRkJSVVlzVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXl4SFFVRkhMRWRCUVVjc1ZVRkJWU3hIUVVGSExFVkJRVVVzU1VGQlNTeEZRVUZGTEV0QlFVc3NSVUZCUlR0RlFVTnNSQ3hKUVVGSkxFVkJRVVVzUjBGQlJ5eEpRVUZKTEVWQlFVVXNTVUZCU1N4RlFVRkZPMGxCUTI1Q0xFMUJRVTBzTWtKQlFUSkNMRU5CUVVNN1FVRkRkRU1zUjBGQlJ6czdSVUZGUkN4SlFVRkpMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zWTBGQll5eERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZPMEZCUTNwRExFbEJRVWtzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eExRVUZMTEVOQlFVTTdPMGxCUldwRExFOUJRVThzU1VGQlNTeERRVUZETzBkQlEySTdRVUZEU0N4RFFVRkRMRU5CUVVNN08wRkJSVVlzVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXl4SFFVRkhMRWRCUVVjc1ZVRkJWU3hIUVVGSExFVkJRVVU3UlVGRGNrTXNUMEZCVHl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFZEJRVWNzUlVGQlJTeE5RVUZOTEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkRja01zUTBGQlF5eERRVUZET3p0QlFVVkdMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zVFVGQlRTeEhRVUZITEZWQlFWVXNSMEZCUnl4RlFVRkZPMFZCUTNoRExFOUJRVThzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4SFFVRkhMRVZCUVVVc1RVRkJUU3hEUVVGRExFTkJRVU03UVVGREwwSXNRMEZCUXl4RFFVRkRPenRCUVVWR0xFOUJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4SFFVRkhMRlZCUVZVc1IwRkJSeXhGUVVGRk8wVkJRM1JETEU5QlFVOHNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhIUVVGSExFVkJRVVVzVVVGQlVTeEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPMEZCUTNaRExFTkJRVU1zUTBGQlF6czdRVUZGUml4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRExFMUJRVTBzUjBGQlJ5eFZRVUZWTEVkQlFVY3NSVUZCUlR0RlFVTjRReXhQUVVGUExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNSMEZCUnl4RlFVRkZMRkZCUVZFc1JVRkJSU3hMUVVGTExFTkJRVU1zUTBGQlF6dEJRVU40UXl4RFFVRkRMRU5CUVVNN08wRkJSVVlzVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXl4WFFVRlhMRWRCUVVjc1ZVRkJWU3hIUVVGSExFVkJRVVU3UVVGREwwTXNSVUZCUlN4SlFVRkpMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPenRGUVVWc1F5eEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVRkZPMGxCUTJRc1QwRkJUeXhMUVVGTExFTkJRVU03UVVGRGFrSXNSMEZCUnpzN1JVRkZSQ3hQUVVGUExFVkJRVVVzVVVGQlVTeERRVUZETEUxQlFVMHNTVUZCU1N4RlFVRkZMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU03UVVGRE9VTXNRMEZCUXl4RFFVRkRPenRCUVVWR0xFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVYzdSVUZEWml4VlFVRlZMRVZCUVVVc1ZVRkJWU3hEUVVGRExGRkJRVkU3UlVGREwwSXNUMEZCVHl4RlFVRkZMRTlCUVU4N1EwRkRha0lzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbHdpZFhObElITjBjbWxqZEZ3aU8xeHVYRzUyWVhJZ1h5QWdJQ0FnSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSjNWdVpHVnljMk52Y21VbktUdGNiblpoY2lCa1lYUmxYMjFoZEdOb1pYSnpJRDBnV3lka1lYa25MQ0FuWkdGMFpTZGRPMXh1ZG1GeUlHVnpZMkZ3WlZKbFoyVjRJQ0FnUFNCeVpYRjFhWEpsS0NjdUxpOHVMaTkxZEdsc2N5OWxjMk5oY0dWZmNtVm5aWGduS1R0Y2JuWmhjaUJrWldacGJtbDBhVzl1TzF4dVhHNWtaV1pwYm1sMGFXOXVJRDBnZTF4dUlDQmpjbWwwWlhKcFlUb2dlMXh1SUNBZ0lIZGxiR3c2SUh0Y2JpQWdJQ0FnSUdScGMzQnNZWGs2SUNBblYyVnNiQ0J1WVcxbEp5eGNiaUFnSUNBZ0lHeHZZMnRsWkRvZ0lDQm1ZV3h6WlN4Y2JpQWdJQ0FnSUhaaGJIVmxPaUFnSUNCdWRXeHNMRnh1SUNBZ0lDQWdkSGx3WlRvZ0lDQWdJQ2R6ZEhKcGJtY25MRnh1SUNBZ0lDQWdibVZuWVhSbE9pQWdJR1poYkhObFhHNGdJQ0FnZlN4Y2JpQWdJQ0J5WlhCdmNuUmxjam9nZTF4dUlDQWdJQ0FnWkdsemNHeGhlVG9nSUNkU1pYQnZjblJsWkNCaWVTY3NYRzRnSUNBZ0lDQnNiMk5yWldRNklDQWdabUZzYzJVc1hHNGdJQ0FnSUNCMllXeDFaVG9nSUNBZ2JuVnNiQ3hjYmlBZ0lDQWdJSFI1Y0dVNklDQWdJQ0FuYzNSeWFXNW5KeXhjYmlBZ0lDQWdJRzVsWjJGMFpUb2dJQ0JtWVd4elpWeHVJQ0FnSUgwc1hHNGdJQ0FnY21Wd2IzSjBaV1E2SUh0Y2JpQWdJQ0FnSUdScGMzQnNZWGs2SUNBblVtVndiM0owWldRZ2IyNG5MRnh1SUNBZ0lDQWdiV0YwWTJobGNuTTZJR1JoZEdWZmJXRjBZMmhsY25Nc1hHNGdJQ0FnSUNCc2IyTnJaV1E2SUNBZ1ptRnNjMlVzWEc0Z0lDQWdJQ0IyWVd4MVpUb2dJQ0FnYm5Wc2JDeGNiaUFnSUNBZ0lIUjVjR1U2SUNBZ0lDQW5aR0Y1Snl4Y2JpQWdJQ0FnSUc1bFoyRjBaVG9nSUNCbVlXeHpaVnh1SUNBZ0lIMHNYRzRnSUNBZ2NtVndiM0owWldSZlltVjBkMlZsYmpvZ2UxeHVJQ0FnSUNBZ1pHbHpjR3hoZVRvZ0lDZFNaWEJ2Y25SbFpDQmlaWFIzWldWdUp5eGNiaUFnSUNBZ0lHMWhkR05vWlhKek9pQmtZWFJsWDIxaGRHTm9aWEp6TEZ4dUlDQWdJQ0FnYkc5amEyVmtPaUFnSUdaaGJITmxMRnh1SUNBZ0lDQWdkbUZzZFdVNklDQWdJRnRkTEZ4dUlDQWdJQ0FnZEhsd1pUb2dJQ0FnSUNka1lYUmxjbUZ1WjJVblhHNGdJQ0FnZlN4Y2JpQWdJQ0J5WlhCdmNuUmxaRjluZERvZ2UxeHVJQ0FnSUNBZ1pHbHpjR3hoZVRvZ0lDZFNaWEJ2Y25SbFpDQmhablJsY2ljc1hHNGdJQ0FnSUNCdFlYUmphR1Z5Y3pvZ1pHRjBaVjl0WVhSamFHVnljeXhjYmlBZ0lDQWdJR3h2WTJ0bFpEb2dJQ0JtWVd4elpTeGNiaUFnSUNBZ0lIWmhiSFZsT2lBZ0lDQnVkV3hzTEZ4dUlDQWdJQ0FnZEhsd1pUb2dJQ0FnSUNka1lYa25YRzRnSUNBZ2ZTeGNiaUFnSUNCeVpYQnZjblJsWkY5c2REb2dlMXh1SUNBZ0lDQWdaR2x6Y0d4aGVUb2dJQ2RTWlhCdmNuUmxaQ0JpWldadmNtVW5MRnh1SUNBZ0lDQWdiV0YwWTJobGNuTTZJR1JoZEdWZmJXRjBZMmhsY25Nc1hHNGdJQ0FnSUNCc2IyTnJaV1E2SUNBZ1ptRnNjMlVzWEc0Z0lDQWdJQ0IyWVd4MVpUb2dJQ0FnYm5Wc2JDeGNiaUFnSUNBZ0lIUjVjR1U2SUNBZ0lDQW5aR0Y1SjF4dUlDQWdJSDBzWEc0Z0lDQWdkWEJrWVhSbFpEb2dlMXh1SUNBZ0lDQWdaR2x6Y0d4aGVUb2dJQ2RWY0dSaGRHVmtJRzl1Snl4Y2JpQWdJQ0FnSUcxaGRHTm9aWEp6T2lCa1lYUmxYMjFoZEdOb1pYSnpMRnh1SUNBZ0lDQWdiRzlqYTJWa09pQWdJR1poYkhObExGeHVJQ0FnSUNBZ2RtRnNkV1U2SUNBZ0lHNTFiR3dzWEc0Z0lDQWdJQ0IwZVhCbE9pQWdJQ0FnSjJSaGVTY3NYRzRnSUNBZ0lDQnVaV2RoZEdVNklDQWdabUZzYzJWY2JpQWdJQ0I5TEZ4dUlDQWdJSFZ3WkdGMFpXUmZZbVYwZDJWbGJqb2dlMXh1SUNBZ0lDQWdaR2x6Y0d4aGVUb2dJQ2RWY0dSaGRHVmtJR0psZEhkbFpXNG5MRnh1SUNBZ0lDQWdiV0YwWTJobGNuTTZJR1JoZEdWZmJXRjBZMmhsY25Nc1hHNGdJQ0FnSUNCc2IyTnJaV1E2SUNBZ1ptRnNjMlVzWEc0Z0lDQWdJQ0IyWVd4MVpUb2dJQ0FnVzEwc1hHNGdJQ0FnSUNCMGVYQmxPaUFnSUNBZ0oyUmhkR1Z5WVc1blpTZGNiaUFnSUNCOUxGeHVJQ0FnSUhWd1pHRjBaV1JmWjNRNklIdGNiaUFnSUNBZ0lHUnBjM0JzWVhrNklDQW5WWEJrWVhSbFpDQmhablJsY2ljc1hHNGdJQ0FnSUNCdFlYUmphR1Z5Y3pvZ1pHRjBaVjl0WVhSamFHVnljeXhjYmlBZ0lDQWdJR3h2WTJ0bFpEb2dJQ0JtWVd4elpTeGNiaUFnSUNBZ0lIWmhiSFZsT2lBZ0lDQnVkV3hzTEZ4dUlDQWdJQ0FnZEhsd1pUb2dJQ0FnSUNka1lYa25YRzRnSUNBZ2ZTeGNiaUFnSUNCMWNHUmhkR1ZrWDJ4ME9pQjdYRzRnSUNBZ0lDQmthWE53YkdGNU9pQWdKMVZ3WkdGMFpXUWdZbVZtYjNKbEp5eGNiaUFnSUNBZ0lHMWhkR05vWlhKek9pQmtZWFJsWDIxaGRHTm9aWEp6TEZ4dUlDQWdJQ0FnYkc5amEyVmtPaUFnSUdaaGJITmxMRnh1SUNBZ0lDQWdkbUZzZFdVNklDQWdJRzUxYkd3c1hHNGdJQ0FnSUNCMGVYQmxPaUFnSUNBZ0oyUmhlU2RjYmlBZ0lDQjlMRnh1SUNBZ0lIUmhaM002SUh0Y2JpQWdJQ0FnSUdScGMzQnNZWGs2SUNBblZHRm5jeWNzWEc0Z0lDQWdJQ0JzYjJOclpXUTZJQ0FnWm1Gc2MyVXNYRzRnSUNBZ0lDQjBlWEJsT2lBZ0lDQWdKM1JoWnljc1hHNGdJQ0FnSUNCdVpXZGhkR1U2SUNBZ1ptRnNjMlVzWEc0Z0lDQWdJQ0J0ZFd4MGFUb2dJQ0FnZEhKMVpWeHVJQ0FnSUgwc1hHNGdJQ0FnY0hKcGIzSnBkSGs2SUh0Y2JpQWdJQ0FnSUdScGMzQnNZWGs2SUNBblVISnBiM0pwZEhrbkxGeHVJQ0FnSUNBZ2JHOWphMlZrT2lBZ0lHWmhiSE5sTEZ4dUlDQWdJQ0FnZEhsd1pUb2dJQ0FnSUNkdWRXMWlaWEluTEZ4dUlDQWdJQ0FnYm1WbllYUmxPaUFnSUdaaGJITmxYRzRnSUNBZ2ZTeGNiaUFnSUNCd2NtbHZjbWwwZVY5bmREb2dlMXh1SUNBZ0lDQWdaR2x6Y0d4aGVUb2dJQ2RRY21sdmNtbDBlU0JoWW05MlpTY3NYRzRnSUNBZ0lDQnNiMk5yWldRNklDQWdabUZzYzJVc1hHNGdJQ0FnSUNCMGVYQmxPaUFnSUNBZ0oyNTFiV0psY2lkY2JpQWdJQ0I5TEZ4dUlDQWdJSEJ5YVc5eWFYUjVYMngwT2lCN1hHNGdJQ0FnSUNCa2FYTndiR0Y1T2lBZ0oxQnlhVzl5YVhSNUlHSmxiRzkzSnl4Y2JpQWdJQ0FnSUd4dlkydGxaRG9nSUNCbVlXeHpaU3hjYmlBZ0lDQWdJSFI1Y0dVNklDQWdJQ0FuYm5WdFltVnlKMXh1SUNBZ0lIMHNYRzRnSUNBZ2FYTnpkV1ZmZEhsd1pUb2dlMXh1SUNBZ0lDQWdaR2x6Y0d4aGVUb2dJQ2RKYzNOMVpTQjBlWEJsSnl4Y2JpQWdJQ0FnSUd4dlkydGxaRG9nSUNCbVlXeHpaU3hjYmlBZ0lDQWdJSFI1Y0dVNklDQWdJQ0FuYzNSeWFXNW5KeXhjYmlBZ0lDQWdJRzExYkhScE9pQWdJQ0IwY25WbFhHNGdJQ0FnZlN4Y2JpQWdJQ0JwYzNOMVpWOXpkV0owZVhCbE9pQjdYRzRnSUNBZ0lDQmthWE53YkdGNU9pQWdKMGx6YzNWbElITjFZblI1Y0dVbkxGeHVJQ0FnSUNBZ2JHOWphMlZrT2lBZ0lHWmhiSE5sTEZ4dUlDQWdJQ0FnZEhsd1pUb2dJQ0FnSUNkemRISnBibWNuTEZ4dUlDQWdJQ0FnYlhWc2RHazZJQ0FnSUhSeWRXVmNiaUFnSUNCOVhHNGdJSDFjYm4wN1hHNWNibVoxYm1OMGFXOXVJRUoxYVd4a1pYSWdLR055YVhSbGNtbGhLU0I3WEc0Z0lIUm9hWE11WTNKcGRHVnlhV0VnSUNBOUlGOHVaWGgwWlc1a0tIdDlMQ0JqY21sMFpYSnBZU2s3WEc0Z0lIUm9hWE11Wm5KbFpWOTBaWGgwSUNBOUlHNTFiR3c3WEc1OVhHNWNia0oxYVd4a1pYSXVjSEp2ZEc5MGVYQmxMbTFoZEdOb1EzSnBkR1Z5YVdFZ1BTQm1kVzVqZEdsdmJpQW9jM1J5YVc1bktTQjdYRzRnSUdOdmJuTnZiR1V1ZEdsdFpTZ25iV0YwWTJoRGNtbDBaWEpwWVNjcFhHNGdJSFpoY2lCeVpYTjFiSFJ6TzF4dUlDQjJZWElnY0dGMGRHVnliaUFnSUQwZ0x5NHZPMXh1SUNCMllYSWdkbUZzZFdWeklDQWdJRDBnVzEwN1hHNGdJSFpoY2lCclpYbHpJQ0FnSUNBZ1BTQlBZbXBsWTNRdWEyVjVjeWgwYUdsekxtTnlhWFJsY21saEtUdGNiaUFnZG1GeUlIUnlkWFJvVkdWemRDQTlJR1oxYm1OMGFXOXVJQ2dwSUh0eVpYUjFjbTRnZEhKMVpUdDlPMXh1WEc0Z0lHbG1JQ2h6ZEhKcGJtY2dKaVlnYzNSeWFXNW5MbXhsYm1kMGFDQStJREFwSUh0Y2JpQWdJQ0J3WVhSMFpYSnVJQ0FnUFNCdVpYY2dVbVZuUlhod0tHVnpZMkZ3WlZKbFoyVjRLSE4wY21sdVp5QjhmQ0FuSnlrc0lDZHBKeWs3WEc0Z0lDQWdkSEoxZEdoVVpYTjBJRDBnY0dGMGRHVnliaTUwWlhOMExtSnBibVFvY0dGMGRHVnliaWs3WEc0Z0lIMWNibHh1SUNCclpYbHpMbVp2Y2tWaFkyZ29ablZ1WTNScGIyNGdLR3RsZVNrZ2UxeHVJQ0FnSUhaaGNpQnRZWFJqYUdWeWN6dGNiaUFnSUNCMllYSWdhVHRjYmlBZ0lDQjJZWElnYkdWdU8xeHVJQ0FnSUhaaGNpQmpjbWwwWlhKcFlTQTlJSFJvYVhNdVkzSnBkR1Z5YVdGYmEyVjVYVHRjYmx4dUlDQWdJR2xtSUNnaElIUm9hWE11YVhOQmRtRnBiR0ZpYkdVb2EyVjVLU2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR1poYkhObE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdsbUlDaDBjblYwYUZSbGMzUW9hMlY1S1NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhaaGJIVmxjeTV3ZFhOb0tHdGxlU2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdhV1lnS0hSeWRYUm9WR1Z6ZENnbld5Y2dLeUJqY21sMFpYSnBZUzVrYVhOd2JHRjVJQ3NnSjEwbktTa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlIWmhiSFZsY3k1d2RYTm9LR3RsZVNrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYldGMFkyaGxjbk1nUFNCamNtbDBaWEpwWVM1dFlYUmphR1Z5Y3lCOGZDQmJYVHRjYmx4dUlDQWdJR1p2Y2lBb2FTQTlJREFzSUd4bGJpQTlJRzFoZEdOb1pYSnpMbXhsYm1kMGFEc2dhU0E4SUd4bGJqc2dhU3NyS1NCN1hHNGdJQ0FnSUNCcFppQW9jR0YwZEdWeWJpNTBaWE4wS0cxaGRHTm9aWEp6VzJsZEtTa2dlMXh1SUNBZ0lDQWdJQ0IyWVd4MVpYTXVjSFZ6YUNoclpYa3BPMXh1WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUIwY25WbE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JpQWdmU3dnZEdocGN5azdYRzVjYmlBZ2NtVnpkV3gwY3lBOUlGOHVjR2xqYXloMGFHbHpMbU55YVhSbGNtbGhMQ0IyWVd4MVpYTXBPMXh1SUNCamIyNXpiMnhsTG5ScGJXVkZibVFvSjIxaGRHTm9RM0pwZEdWeWFXRW5LVnh1WEc0Z0lISmxkSFZ5YmlCeVpYTjFiSFJ6TzF4dWZUdGNibHh1UW5WcGJHUmxjaTV3Y205MGIzUjVjR1V1ZEc5UGNIUnBiMjV6SUQwZ1puVnVZM1JwYjI0Z0tITjBjbWx1WnlrZ2UxeHVJQ0IyWVhJZ2NtVnpkV3gwY3lBOUlIUm9hWE11YldGMFkyaERjbWwwWlhKcFlTaHpkSEpwYm1jcE8xeHVJQ0IyWVhJZ2IzQjBhVzl1Y3lBOUlGOHViV0Z3S0hKbGMzVnNkSE1zSUdaMWJtTjBhVzl1SUNocGRHVnRMQ0JyWlhrcElIdGNiaUFnSUNCeVpYUjFjbTRnZTNaaGJIVmxPaUJyWlhrc0lHeGhZbVZzT2lCcGRHVnRMbVJwYzNCc1lYbDlPMXh1SUNCOUtUdGNibHh1SUNCcFppQW9jM1J5YVc1bklDWW1JQ0VnZEdocGN5NW1jbVZsWDNSbGVIUWdKaVlnSVNBdlhseGNXeTh1ZEdWemRDaHpkSEpwYm1jcEtTQjdYRzRnSUNBZ2IzQjBhVzl1Y3k1MWJuTm9hV1owS0h0Y2JpQWdJQ0FnSUd4aFltVnNPaUFnYzNSeWFXNW5MRnh1SUNBZ0lDQWdkbUZzZFdVNklDQnpkSEpwYm1kY2JpQWdJQ0I5S1R0Y2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCdmNIUnBiMjV6TzF4dWZUdGNibHh1UW5WcGJHUmxjaTV3Y205MGIzUjVjR1V1YzJWMElEMGdablZ1WTNScGIyNGdLR3RsZVN3Z2NISnZjQ3dnZG1Gc2RXVXBJSHRjYmlBZ2FXWWdLQ0VnYTJWNUlIeDhJQ0VnY0hKdmNDa2dlMXh1SUNBZ0lIUm9jbTkzSUNkclpYa2dZVzVrSUhCeWIzQWdZWEpsSUhKbGNYVnBjbVZrSnp0Y2JpQWdmVnh1WEc0Z0lHbG1JQ2gwYUdsekxtTnlhWFJsY21saExtaGhjMDkzYmxCeWIzQmxjblI1S0d0bGVTa3BJSHRjYmlBZ0lDQjBhR2x6TG1OeWFYUmxjbWxoVzJ0bGVWMWJjSEp2Y0YwZ1BTQjJZV3gxWlR0Y2JseHVJQ0FnSUhKbGRIVnliaUIwY25WbE8xeHVJQ0I5WEc1OU8xeHVYRzVDZFdsc1pHVnlMbkJ5YjNSdmRIbHdaUzUxYzJVZ1BTQm1kVzVqZEdsdmJpQW9hMlY1S1NCN1hHNGdJSEpsZEhWeWJpQjBhR2x6TG5ObGRDaHJaWGtzSUNkMWMyVmtKeXdnZEhKMVpTazdYRzU5TzF4dVhHNUNkV2xzWkdWeUxuQnliM1J2ZEhsd1pTNXlaV1oxYm1RZ1BTQm1kVzVqZEdsdmJpQW9hMlY1S1NCN1hHNGdJSEpsZEhWeWJpQjBhR2x6TG5ObGRDaHJaWGtzSUNkMWMyVmtKeWs3WEc1OU8xeHVYRzVDZFdsc1pHVnlMbkJ5YjNSdmRIbHdaUzVzYjJOcklEMGdablZ1WTNScGIyNGdLR3RsZVNrZ2UxeHVJQ0J5WlhSMWNtNGdkR2hwY3k1elpYUW9hMlY1TENBbmJHOWphMlZrSnl3Z2RISjFaU2s3WEc1OU8xeHVYRzVDZFdsc1pHVnlMbkJ5YjNSdmRIbHdaUzUxYm14dlkyc2dQU0JtZFc1amRHbHZiaUFvYTJWNUtTQjdYRzRnSUhKbGRIVnliaUIwYUdsekxuTmxkQ2hyWlhrc0lDZHNiMk5yWldRbkxDQm1ZV3h6WlNrN1hHNTlPMXh1WEc1Q2RXbHNaR1Z5TG5CeWIzUnZkSGx3WlM1cGMwRjJZV2xzWVdKc1pTQTlJR1oxYm1OMGFXOXVJQ2hyWlhrcElIdGNiaUFnZG1GeUlHTnlhWFJsY21saElEMGdkR2hwY3k1amNtbDBaWEpwWVZ0clpYbGRPMXh1WEc0Z0lHbG1JQ2doSUdOeWFYUmxjbWxoS1NCN1hHNGdJQ0FnY21WMGRYSnVJR1poYkhObE8xeHVJQ0I5WEc1Y2JpQWdjbVYwZFhKdUlDRWdZM0pwZEdWeWFXRXViRzlqYTJWa0lDWW1JQ0VnWTNKcGRHVnlhV0V1ZFhObFpEdGNibjA3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2UxeHVJQ0JrWldacGJtbDBhVzl1T2lCa1pXWnBibWwwYVc5dUxtTnlhWFJsY21saExGeHVJQ0JDZFdsc1pHVnlPaUJDZFdsc1pHVnlYRzU5TzF4dUlsMTkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEJhY2tib25lICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgTW9kZWwgICAgID0gcmVxdWlyZSgnLi9oZWFkaW5nX21vZGVsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuICBtb2RlbDogTW9kZWwsXG4gIGxpbmtTaWJsaW5nczogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoaGVhZGVyLCBpbmRleCkge1xuICAgICAgaGVhZGVyLnByZXYgPSB0aGlzLmF0KGluZGV4IC0gMSk7XG4gICAgICBoZWFkZXIubmV4dCA9IHRoaXMuYXQoaW5kZXggKyAxKTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcbiAgcmVnaXN0ZXJXaXRoRGlzcGF0Y2hlcjogZnVuY3Rpb24gKGRpc3BhdGNoZXIpIHtcbiAgICB0aGlzLmRpc3BhdGNoX3Rva2VuID0gZGlzcGF0aGVyLnJlZ2lzdGVyKGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICBjb25zb2xlLmxvZyhwYXlsb2FkKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9XG59KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdllXeGhjbTF6TDJobFlXUnBibWRmWTI5c2JHVmpkR2x2Ymk1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3haUVVGWkxFTkJRVU03TzBGQlJXSXNTVUZCU1N4UlFVRlJMRWxCUVVrc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETzBGQlEzQkRMRWxCUVVrc1MwRkJTeXhQUVVGUExFOUJRVThzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhEUVVGRE96dEJRVVV6UXl4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExGRkJRVkVzUTBGQlF5eFZRVUZWTEVOQlFVTXNUVUZCVFN4RFFVRkRPMFZCUXpGRExFdEJRVXNzUlVGQlJTeExRVUZMTzBWQlExb3NXVUZCV1N4RlFVRkZMRmxCUVZrN1NVRkRlRUlzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4VlFVRlZMRTFCUVUwc1JVRkJSU3hMUVVGTExFVkJRVVU3VFVGRGFrTXNUVUZCVFN4RFFVRkRMRWxCUVVrc1IwRkJSeXhKUVVGSkxFTkJRVU1zUlVGQlJTeERRVUZETEV0QlFVc3NSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJRenROUVVOcVF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4SFFVRkhMRWxCUVVrc1EwRkJReXhGUVVGRkxFTkJRVU1zUzBGQlN5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRPMHRCUTJ4RExFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVTTdSMEZEVmp0RlFVTkVMSE5DUVVGelFpeEZRVUZGTEZWQlFWVXNWVUZCVlN4RlFVRkZPMGxCUXpWRExFbEJRVWtzUTBGQlF5eGpRVUZqTEVkQlFVY3NVMEZCVXl4RFFVRkRMRkZCUVZFc1EwRkJReXhWUVVGVkxFOUJRVThzUlVGQlJUdE5RVU14UkN4UFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzB0QlEzUkNMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTTdSMEZEWmp0RFFVTkdMRU5CUVVNc1EwRkJReUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWx3aWRYTmxJSE4wY21samRGd2lPMXh1WEc1MllYSWdRbUZqYTJKdmJtVWdJRDBnY21WeGRXbHlaU2duWW1GamEySnZibVVuS1R0Y2JuWmhjaUJOYjJSbGJDQWdJQ0FnUFNCeVpYRjFhWEpsS0NjdUwyaGxZV1JwYm1kZmJXOWtaV3duS1R0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQkNZV05yWW05dVpTNURiMnhzWldOMGFXOXVMbVY0ZEdWdVpDaDdYRzRnSUcxdlpHVnNPaUJOYjJSbGJDeGNiaUFnYkdsdWExTnBZbXhwYm1kek9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkR2hwY3k1bFlXTm9LR1oxYm1OMGFXOXVJQ2hvWldGa1pYSXNJR2x1WkdWNEtTQjdYRzRnSUNBZ0lDQm9aV0ZrWlhJdWNISmxkaUE5SUhSb2FYTXVZWFFvYVc1a1pYZ2dMU0F4S1R0Y2JpQWdJQ0FnSUdobFlXUmxjaTV1WlhoMElEMGdkR2hwY3k1aGRDaHBibVJsZUNBcklERXBPMXh1SUNBZ0lIMHNJSFJvYVhNcE8xeHVJQ0I5TEZ4dUlDQnlaV2RwYzNSbGNsZHBkR2hFYVhOd1lYUmphR1Z5T2lCbWRXNWpkR2x2YmlBb1pHbHpjR0YwWTJobGNpa2dlMXh1SUNBZ0lIUm9hWE11WkdsemNHRjBZMmhmZEc5clpXNGdQU0JrYVhOd1lYUm9aWEl1Y21WbmFYTjBaWElvWm5WdVkzUnBiMjRnS0hCaGVXeHZZV1FwSUh0Y2JpQWdJQ0FnSUdOdmJuTnZiR1V1Ykc5bktIQmhlV3h2WVdRcE8xeHVJQ0FnSUgwdVltbHVaQ2gwYUdsektTazdYRzRnSUgxY2JuMHBPMXh1SWwxOSIsInZhciBNb2RlbDtcbnZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG5cbk1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgZGVmYXVsdHM6IHtcbiAgICBkaXJlY3Rpb246ICBudWxsLFxuICAgIGxvY2tlZDogICAgIGZhbHNlLFxuICAgIG1pbmltYWw6ICAgIGZhbHNlLFxuICAgIG5hbWU6ICAgICAgIG51bGwsXG4gICAgcmVzaXphYmxlOiAgZmFsc2UsXG4gICAgc29ydGFibGU6ICAgZmFsc2UsXG4gICAgdGl0bGU6ICAgICAgbnVsbCxcbiAgICB3aWR0aDogICAgICBudWxsXG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WVd4aGNtMXpMMmhsWVdScGJtZGZiVzlrWld3dWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzU1VGQlNTeExRVUZMTEVOQlFVTTdRVUZEVml4SlFVRkpMRkZCUVZFc1IwRkJSeXhQUVVGUExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTTdPMEZCUlc1RExFdEJRVXNzUjBGQlJ5eFJRVUZSTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkJRenRGUVVNMVFpeFJRVUZSTEVWQlFVVTdTVUZEVWl4VFFVRlRMRWRCUVVjc1NVRkJTVHRKUVVOb1FpeE5RVUZOTEUxQlFVMHNTMEZCU3p0SlFVTnFRaXhQUVVGUExFdEJRVXNzUzBGQlN6dEpRVU5xUWl4SlFVRkpMRkZCUVZFc1NVRkJTVHRKUVVOb1FpeFRRVUZUTEVkQlFVY3NTMEZCU3p0SlFVTnFRaXhSUVVGUkxFbEJRVWtzUzBGQlN6dEpRVU5xUWl4TFFVRkxMRTlCUVU4c1NVRkJTVHRKUVVOb1FpeExRVUZMTEU5QlFVOHNTVUZCU1R0SFFVTnFRanRCUVVOSUxFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVklMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzUzBGQlN5eERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWRtRnlJRTF2WkdWc08xeHVkbUZ5SUVKaFkydGliMjVsSUQwZ2NtVnhkV2x5WlNnblltRmphMkp2Ym1VbktUdGNibHh1VFc5a1pXd2dQU0JDWVdOclltOXVaUzVOYjJSbGJDNWxlSFJsYm1Rb2UxeHVJQ0JrWldaaGRXeDBjem9nZTF4dUlDQWdJR1JwY21WamRHbHZiam9nSUc1MWJHd3NYRzRnSUNBZ2JHOWphMlZrT2lBZ0lDQWdabUZzYzJVc1hHNGdJQ0FnYldsdWFXMWhiRG9nSUNBZ1ptRnNjMlVzWEc0Z0lDQWdibUZ0WlRvZ0lDQWdJQ0FnYm5Wc2JDeGNiaUFnSUNCeVpYTnBlbUZpYkdVNklDQm1ZV3h6WlN4Y2JpQWdJQ0J6YjNKMFlXSnNaVG9nSUNCbVlXeHpaU3hjYmlBZ0lDQjBhWFJzWlRvZ0lDQWdJQ0J1ZFd4c0xGeHVJQ0FnSUhkcFpIUm9PaUFnSUNBZ0lHNTFiR3hjYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1RXOWtaV3c3WEc0aVhYMD0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIEljb25XcmFwcGVyO1xudmFyIG1hcHBpbmdzO1xudmFyIF8gICAgID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyIEljb24gID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9pY29uLmpzeCcpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuLyoqXG4gKiBBbGxvd3MgbWFwcGluZyBhIGNhc2Ugc3RhdHVzIHRvIGEgcGFydGljdWxhciBpY29uIHR5cGVcbiAqL1xubWFwcGluZ3MgPSB7XG4gICdhbGFybSc6ICAgICAgICAgICAgICAgICAgICAgICAgJ2JlbGwnLFxuICAnYWxhcm0tYWNrbm93bGVkZ2VkJzogICAgICAgICAgICdiZWxsLXNsYXNoJyxcbiAgJ2FsYXJtLWFja25vd2xlZGdlZC1jcml0aWNhbCc6ICAnYmVsbC1zbGFzaCcsXG4gICdhbGFybS1jcml0aWNhbCc6ICAgICAgICAgICAgICAgJ2JlbGwnLFxuICAnYWxhcm0tYWNrbm93bGVkZ2VkLW5vcm1hbCc6ICAgICdiZWxsLXNsYXNoLW8nLFxuICAnYWxhcm0tbm9ybWFsJzogICAgICAgICAgICAgICAgICdiZWxsLW8nLFxuICAnYWxhcm0tY2xlYXJlZCc6ICAgICAgICAgICAgICAgICdjaGVjay1jaXJjbGUnXG59O1xuXG4vKipcbiAqIFdyYXBzIHRoZSBJY29uIGNvbXBvbmVudCwgc2VlIHRoYXQgY29tcG9uZW50IGZvciB1c2FnZSBleGFtcGxlc1xuICovXG5JY29uV3JhcHBlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJJY29uV3JhcHBlclwiLFxuICBtaXhpbnM6IFtSZWFjdC5hZGRvbnMuUHVyZVJlbmRlck1peGluXSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5ld1Byb3BzID0gXy5leHRlbmQoe30sIHRoaXMucHJvcHMpO1xuXG4gICAgbmV3UHJvcHMuY2xhc3NOYW1lICA9IG5ld1Byb3BzLnR5cGU7XG4gICAgbmV3UHJvcHMudHlwZSAgICAgICA9IG1hcHBpbmdzW25ld1Byb3BzLnR5cGVdIHx8IG5ld1Byb3BzLnR5cGU7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCBSZWFjdC5fX3NwcmVhZCh7fSwgIG5ld1Byb3BzKSlcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBJY29uV3JhcHBlcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdllXeGhjbTF6TDJsamIyNWZkM0poY0hCbGNpNXFjM2dpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN08wRkJSVUVzUjBGQlJ6czdRVUZGU0N4SlFVRkpMRmRCUVZjc1EwRkJRenRCUVVOb1FpeEpRVUZKTEZGQlFWRXNRMEZCUXp0QlFVTmlMRWxCUVVrc1EwRkJReXhQUVVGUExFOUJRVThzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXp0QlFVTnNReXhKUVVGSkxFbEJRVWtzU1VGQlNTeFBRVUZQTEVOQlFVTXNNa0pCUVRKQ0xFTkJRVU1zUTBGQlF6dEJRVU5xUkN4SlFVRkpMRXRCUVVzc1IwRkJSeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdPMEZCUlRkQ096dEhRVVZITzBGQlEwZ3NVVUZCVVN4SFFVRkhPMFZCUTFRc1QwRkJUeXg1UWtGQmVVSXNUVUZCVFR0RlFVTjBReXh2UWtGQmIwSXNXVUZCV1N4WlFVRlpPMFZCUXpWRExEWkNRVUUyUWl4SFFVRkhMRmxCUVZrN1JVRkROVU1zWjBKQlFXZENMR2RDUVVGblFpeE5RVUZOTzBWQlEzUkRMREpDUVVFeVFpeExRVUZMTEdOQlFXTTdSVUZET1VNc1kwRkJZeXhyUWtGQmEwSXNVVUZCVVR0RlFVTjRReXhsUVVGbExHbENRVUZwUWl4alFVRmpPMEZCUTJoRUxFTkJRVU1zUTBGQlF6czdRVUZGUmpzN1IwRkZSenRCUVVOSUxHbERRVUZwUXl3eVFrRkJRVHRGUVVNdlFpeE5RVUZOTEVWQlFVVXNRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExHVkJRV1VzUTBGQlF6dEZRVU4wUXl4TlFVRk5MRVZCUVVVc1dVRkJXVHRCUVVOMFFpeEpRVUZKTEVsQlFVa3NVVUZCVVN4SFFVRkhMRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zUlVGQlJTeEZRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenM3U1VGRmVFTXNVVUZCVVN4RFFVRkRMRk5CUVZNc1NVRkJTU3hSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETzBGQlEzaERMRWxCUVVrc1VVRkJVU3hEUVVGRExFbEJRVWtzVTBGQlV5eFJRVUZSTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxGRkJRVkVzUTBGQlF5eEpRVUZKTEVOQlFVTTdPMGxCUlM5RU8wMUJRMFVzYjBKQlFVTXNTVUZCU1N4RlFVRkJMR2RDUVVGQkxFZEJRVUVzUTBGQlJTeEhRVUZITEZGQlFWTXNRMEZCUVN4RFFVRkhMRU5CUVVFN1RVRkRkRUk3UjBGRFNEdEJRVU5JTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NWMEZCVnl4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlvcVhHNGdLaUJBYW5ONElGSmxZV04wTGtSUFRWeHVJQ292WEc1Y2JuWmhjaUJKWTI5dVYzSmhjSEJsY2p0Y2JuWmhjaUJ0WVhCd2FXNW5jenRjYm5aaGNpQmZJQ0FnSUNBOUlISmxjWFZwY21Vb0ozVnVaR1Z5YzJOdmNtVW5LVHRjYm5aaGNpQkpZMjl1SUNBOUlISmxjWFZwY21Vb0p5NHVMeTR1TDJOdmJYQnZibVZ1ZEhNdmFXTnZiaTVxYzNnbktUdGNiblpoY2lCU1pXRmpkQ0E5SUhKbGNYVnBjbVVvSjNKbFlXTjBKeWs3WEc1Y2JpOHFLbHh1SUNvZ1FXeHNiM2R6SUcxaGNIQnBibWNnWVNCallYTmxJSE4wWVhSMWN5QjBieUJoSUhCaGNuUnBZM1ZzWVhJZ2FXTnZiaUIwZVhCbFhHNGdLaTljYm0xaGNIQnBibWR6SUQwZ2UxeHVJQ0FuWVd4aGNtMG5PaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDZGlaV3hzSnl4Y2JpQWdKMkZzWVhKdExXRmphMjV2ZDJ4bFpHZGxaQ2M2SUNBZ0lDQWdJQ0FnSUNBblltVnNiQzF6YkdGemFDY3NYRzRnSUNkaGJHRnliUzFoWTJ0dWIzZHNaV1JuWldRdFkzSnBkR2xqWVd3bk9pQWdKMkpsYkd3dGMyeGhjMmduTEZ4dUlDQW5ZV3hoY20wdFkzSnBkR2xqWVd3bk9pQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNkaVpXeHNKeXhjYmlBZ0oyRnNZWEp0TFdGamEyNXZkMnhsWkdkbFpDMXViM0p0WVd3bk9pQWdJQ0FuWW1Wc2JDMXpiR0Z6YUMxdkp5eGNiaUFnSjJGc1lYSnRMVzV2Y20xaGJDYzZJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQW5ZbVZzYkMxdkp5eGNiaUFnSjJGc1lYSnRMV05zWldGeVpXUW5PaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQW5ZMmhsWTJzdFkybHlZMnhsSjF4dWZUdGNibHh1THlvcVhHNGdLaUJYY21Gd2N5QjBhR1VnU1dOdmJpQmpiMjF3YjI1bGJuUXNJSE5sWlNCMGFHRjBJR052YlhCdmJtVnVkQ0JtYjNJZ2RYTmhaMlVnWlhoaGJYQnNaWE5jYmlBcUwxeHVTV052YmxkeVlYQndaWElnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJRzFwZUdsdWN6b2dXMUpsWVdOMExtRmtaRzl1Y3k1UWRYSmxVbVZ1WkdWeVRXbDRhVzVkTEZ4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnYm1WM1VISnZjSE1nUFNCZkxtVjRkR1Z1WkNoN2ZTd2dkR2hwY3k1d2NtOXdjeWs3WEc1Y2JpQWdJQ0J1WlhkUWNtOXdjeTVqYkdGemMwNWhiV1VnSUQwZ2JtVjNVSEp2Y0hNdWRIbHdaVHRjYmlBZ0lDQnVaWGRRY205d2N5NTBlWEJsSUNBZ0lDQWdJRDBnYldGd2NHbHVaM05iYm1WM1VISnZjSE11ZEhsd1pWMGdmSHdnYm1WM1VISnZjSE11ZEhsd1pUdGNibHh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOFNXTnZiaUI3TGk0dWJtVjNVSEp2Y0hOOUlDOCtYRzRnSUNBZ0tUdGNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnU1dOdmJsZHlZWEJ3WlhJN1hHNGlYWDA9IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRpc3BhdGNoZXI6ICAgICAgIHJlcXVpcmUoJy4vZGlzcGF0Y2hlcicpLFxuICBBbGFybU1vZGVsOiAgICAgICAgcmVxdWlyZSgnLi9hbGFybV9tb2RlbCcpLFxuICBBbGFybUNvbGxlY3Rpb246ICAgcmVxdWlyZSgnLi9hbGFybV9jb2xsZWN0aW9uJyksXG4gIExpc3RWaWV3OiAgICAgICAgIHJlcXVpcmUoJy4vbGlzdF92aWV3LmpzeCcpLFxuICBsaXN0X3ZpZXdfc3RvcmU6ICByZXF1aXJlKCcuL2xpc3Rfdmlld19zdG9yZScpXG59O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WVd4aGNtMXpMMmx1WkdWNExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjN1JVRkRaaXhWUVVGVkxGRkJRVkVzVDBGQlR5eERRVUZETEdOQlFXTXNRMEZCUXp0RlFVTjZReXhWUVVGVkxGTkJRVk1zVDBGQlR5eERRVUZETEdWQlFXVXNRMEZCUXp0RlFVTXpReXhsUVVGbExFbEJRVWtzVDBGQlR5eERRVUZETEc5Q1FVRnZRaXhEUVVGRE8wVkJRMmhFTEZGQlFWRXNWVUZCVlN4UFFVRlBMRU5CUVVNc2FVSkJRV2xDTEVOQlFVTTdSVUZETlVNc1pVRkJaU3hIUVVGSExFOUJRVThzUTBGQlF5eHRRa0ZCYlVJc1EwRkJRenREUVVNdlF5eERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCN1hHNGdJR1JwYzNCaGRHTm9aWEk2SUNBZ0lDQWdJSEpsY1hWcGNtVW9KeTR2WkdsemNHRjBZMmhsY2ljcExGeHVJQ0JCYkdGeWJVMXZaR1ZzT2lBZ0lDQWdJQ0FnY21WeGRXbHlaU2duTGk5aGJHRnliVjl0YjJSbGJDY3BMRnh1SUNCQmJHRnliVU52Ykd4bFkzUnBiMjQ2SUNBZ2NtVnhkV2x5WlNnbkxpOWhiR0Z5YlY5amIyeHNaV04wYVc5dUp5a3NYRzRnSUV4cGMzUldhV1YzT2lBZ0lDQWdJQ0FnSUhKbGNYVnBjbVVvSnk0dmJHbHpkRjkyYVdWM0xtcHplQ2NwTEZ4dUlDQnNhWE4wWDNacFpYZGZjM1J2Y21VNklDQnlaWEYxYVhKbEtDY3VMMnhwYzNSZmRtbGxkMTl6ZEc5eVpTY3BYRzU5TzF4dUlsMTkiLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIExpc3RGaWx0ZXI7XG52YXIgUmVhY3QgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEJhY2tib25lICAgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBJY29uICAgICAgICA9IHJlcXVpcmUoJy4vaWNvbl93cmFwcGVyLmpzeCcpO1xudmFyIERyb3Bkb3duICAgID0gcmVxdWlyZSgnLi9kcm9wZG93bi5qc3gnKTtcbnZhciBGaWx0ZXJCb3ggICA9IHJlcXVpcmUoJy4vZmlsdGVyX2JveC5qc3gnKTtcbnZhciBjcml0ZXJpYSAgICA9IHJlcXVpcmUoJy4vZmlsdGVyX2JveF9kZWZpbml0aW9uJyk7XG5cbkxpc3RGaWx0ZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiTGlzdEZpbHRlclwiLFxuICBwcm9wVHlwZXM6IHtcbiAgICBzdG9yZTogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoQmFja2JvbmUuTW9kZWwpLmlzUmVxdWlyZWRcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNob2ljZXM7XG4gICAgdmFyIGJ1aWxkZXIgPSBuZXcgY3JpdGVyaWEuQnVpbGRlcihjcml0ZXJpYS5kZWZpbml0aW9uKTtcblxuICAgIGNob2ljZXMgPSBbXG4gICAgICB7dGV4dDogJ05ldyBmcm9tIGN1cnJlbnQuLi4nfSxcbiAgICAgIHt0ZXh0OiAnTmV3IGZyb20gYmxhbmsuLi4nfSxcbiAgICAgIHtzZXBhcmF0b3I6IHRydWV9LFxuICAgICAge3RleHQ6ICdDcml0aWNhbCBhbGFybXMnfSxcbiAgICAgIHt0ZXh0OiAnTmV3ZXN0IGFsYXJtcyd9LFxuICAgICAge3RleHQ6ICdBY2tub3dsZWRnZWQgQWxhcm1zJ31cbiAgICBdO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJjYXB0aW9uXCIsIHtjbGFzc05hbWU6IFwibGlzdC1maWx0ZXJcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZmlsdGVyLXNlbGVjdGlvblwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIHtjbGFzc05hbWU6IFwicHVsbC1yaWdodCBpbmxpbmVcIn0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIFwiUXVpY2sgZmlsdGVyczpcIiksIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERyb3Bkb3duLCB7c2VsZWN0ZWQ6IFwiQWN0aXZlIGFsYXJtc1wiLCBhbGlnbjogXCJyaWdodFwiLCBjaG9pY2VzOiBjaG9pY2VzfSlcbiAgICAgICAgICAgICksIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtjbGFzc05hbWU6IFwiaWNvbi1ncm91cFwifSwgXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtvbkNsaWNrOiB0aGlzLl9zYXZlRmlsdGVyfSwgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogXCJzYXZlXCIsIHNpemU6IFwibGdcIn0pKSwgXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtvbkNsaWNrOiB0aGlzLl9kZWxldGVGaWx0ZXJ9LCBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiBcInRyYXNoLW9cIiwgc2l6ZTogXCJsZ1wifSkpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZpbHRlckJveCwge2NyaXRlcmlhOiBidWlsZGVyfSlcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaXN0RmlsdGVyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WVd4aGNtMXpMMnhwYzNSZlptbHNkR1Z5TG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHM3UVVGRlFTeEhRVUZIT3p0QlFVVklMRWxCUVVrc1ZVRkJWU3hEUVVGRE8wRkJRMllzU1VGQlNTeExRVUZMTEZOQlFWTXNUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8wRkJRMjVETEVsQlFVa3NVVUZCVVN4TlFVRk5MRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6dEJRVU4wUXl4SlFVRkpMRWxCUVVrc1ZVRkJWU3hQUVVGUExFTkJRVU1zYjBKQlFXOUNMRU5CUVVNc1EwRkJRenRCUVVOb1JDeEpRVUZKTEZGQlFWRXNUVUZCVFN4UFFVRlBMRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNRMEZCUXp0QlFVTTFReXhKUVVGSkxGTkJRVk1zUzBGQlN5eFBRVUZQTEVOQlFVTXNhMEpCUVd0Q0xFTkJRVU1zUTBGQlF6dEJRVU01UXl4SlFVRkpMRkZCUVZFc1RVRkJUU3hQUVVGUExFTkJRVU1zZVVKQlFYbENMRU5CUVVNc1EwRkJRenM3UVVGRmNrUXNaME5CUVdkRExEQkNRVUZCTzBWQlF6bENMRk5CUVZNc1JVRkJSVHRKUVVOVUxFdEJRVXNzUlVGQlJTeExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRlZCUVZVc1EwRkJReXhSUVVGUkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNWVUZCVlR0SFFVTTNSRHRGUVVORUxFMUJRVTBzUlVGQlJTeFpRVUZaTzBsQlEyeENMRWxCUVVrc1QwRkJUeXhEUVVGRE8wRkJRMmhDTEVsQlFVa3NTVUZCU1N4UFFVRlBMRWRCUVVjc1NVRkJTU3hSUVVGUkxFTkJRVU1zVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJRenM3U1VGRmVFUXNUMEZCVHl4SFFVRkhPMDFCUTFJc1EwRkJReXhKUVVGSkxFVkJRVVVzY1VKQlFYRkNMRU5CUVVNN1RVRkROMElzUTBGQlF5eEpRVUZKTEVWQlFVVXNiVUpCUVcxQ0xFTkJRVU03VFVGRE0wSXNRMEZCUXl4VFFVRlRMRVZCUVVVc1NVRkJTU3hEUVVGRE8wMUJRMnBDTEVOQlFVTXNTVUZCU1N4RlFVRkZMR2xDUVVGcFFpeERRVUZETzAxQlEzcENMRU5CUVVNc1NVRkJTU3hGUVVGRkxHVkJRV1VzUTBGQlF6dE5RVU4yUWl4RFFVRkRMRWxCUVVrc1JVRkJSU3h4UWtGQmNVSXNRMEZCUXp0QlFVTnVReXhMUVVGTExFTkJRVU03TzBsQlJVWTdUVUZEUlN4dlFrRkJRU3hUUVVGUkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMR0ZCUVdNc1EwRkJRU3hGUVVGQk8xRkJReTlDTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNhMEpCUVcxQ0xFTkJRVUVzUlVGQlFUdFZRVU5vUXl4dlFrRkJRU3hKUVVGSExFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRzFDUVVGdlFpeERRVUZCTEVWQlFVRTdXVUZEYUVNc2IwSkJRVUVzU1VGQlJ5eEZRVUZCTEVsQlFVTXNSVUZCUVN4blFrRkJiVUlzUTBGQlFTeEZRVUZCTzFsQlEzWkNMRzlDUVVGQkxFbEJRVWNzUlVGQlFTeEpRVUZETEVWQlFVRTdZMEZEUml4dlFrRkJReXhSUVVGUkxFVkJRVUVzUTBGQlFTeERRVUZETEZGQlFVRXNSVUZCVVN4RFFVRkRMR1ZCUVVFc1JVRkJaU3hEUVVGRExFdEJRVUVzUlVGQlN5eERRVUZETEU5QlFVRXNSVUZCVHl4RFFVRkRMRTlCUVVFc1JVRkJUeXhEUVVGRkxFOUJRVkVzUTBGQlFTeERRVUZITEVOQlFVRTdXVUZEYkVVc1EwRkJRU3hGUVVGQk8xbEJRMHdzYjBKQlFVRXNTVUZCUnl4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eFpRVUZoTEVOQlFVRXNSVUZCUVR0alFVTjZRaXh2UWtGQlFTeEhRVUZGTEVWQlFVRXNRMEZCUVN4RFFVRkRMRTlCUVVFc1JVRkJUeXhEUVVGRkxFbEJRVWtzUTBGQlF5eFhRVUZoTEVOQlFVRXNSVUZCUVN4dlFrRkJReXhKUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEVsQlFVRXNSVUZCU1N4RFFVRkRMRTFCUVVFc1JVRkJUU3hEUVVGRExFbEJRVUVzUlVGQlNTeERRVUZETEVsQlFVa3NRMEZCUVN4RFFVRkhMRU5CUVVrc1EwRkJRU3hGUVVGQk8yTkJRMmhGTEc5Q1FVRkJMRWRCUVVVc1JVRkJRU3hEUVVGQkxFTkJRVU1zVDBGQlFTeEZRVUZQTEVOQlFVVXNTVUZCU1N4RFFVRkRMR0ZCUVdVc1EwRkJRU3hGUVVGQkxHOUNRVUZETEVsQlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1NVRkJRU3hGUVVGSkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNTVUZCUVN4RlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGQkxFTkJRVWNzUTBGQlNTeERRVUZCTzFsQlEyeEZMRU5CUVVFN1ZVRkRSaXhEUVVGQk8wRkJRMllzVVVGQll5eERRVUZCTEVWQlFVRTdPMUZCUlU0c2IwSkJRVU1zVTBGQlV5eEZRVUZCTEVOQlFVRXNRMEZCUXl4UlFVRkJMRVZCUVZFc1EwRkJSU3hQUVVGUkxFTkJRVUVzUTBGQlJ5eERRVUZCTzAxQlEzaENMRU5CUVVFN1RVRkRWanRIUVVOSU8wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFZRVUZWTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRXhwYzNSR2FXeDBaWEk3WEc1MllYSWdVbVZoWTNRZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQ2NwTzF4dWRtRnlJRUpoWTJ0aWIyNWxJQ0FnSUQwZ2NtVnhkV2x5WlNnblltRmphMkp2Ym1VbktUdGNiblpoY2lCSlkyOXVJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR2YVdOdmJsOTNjbUZ3Y0dWeUxtcHplQ2NwTzF4dWRtRnlJRVJ5YjNCa2IzZHVJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpOWtjbTl3Wkc5M2JpNXFjM2duS1R0Y2JuWmhjaUJHYVd4MFpYSkNiM2dnSUNBOUlISmxjWFZwY21Vb0p5NHZabWxzZEdWeVgySnZlQzVxYzNnbktUdGNiblpoY2lCamNtbDBaWEpwWVNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR2Wm1sc2RHVnlYMkp2ZUY5a1pXWnBibWwwYVc5dUp5azdYRzVjYmt4cGMzUkdhV3gwWlhJZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUhCeWIzQlVlWEJsY3pvZ2UxeHVJQ0FnSUhOMGIzSmxPaUJTWldGamRDNVFjbTl3Vkhsd1pYTXVhVzV6ZEdGdVkyVlBaaWhDWVdOclltOXVaUzVOYjJSbGJDa3VhWE5TWlhGMWFYSmxaRnh1SUNCOUxGeHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ1kyaHZhV05sY3p0Y2JpQWdJQ0IyWVhJZ1luVnBiR1JsY2lBOUlHNWxkeUJqY21sMFpYSnBZUzVDZFdsc1pHVnlLR055YVhSbGNtbGhMbVJsWm1sdWFYUnBiMjRwTzF4dVhHNGdJQ0FnWTJodmFXTmxjeUE5SUZ0Y2JpQWdJQ0FnSUh0MFpYaDBPaUFuVG1WM0lHWnliMjBnWTNWeWNtVnVkQzR1TGlkOUxGeHVJQ0FnSUNBZ2UzUmxlSFE2SUNkT1pYY2dabkp2YlNCaWJHRnVheTR1TGlkOUxGeHVJQ0FnSUNBZ2UzTmxjR0Z5WVhSdmNqb2dkSEoxWlgwc1hHNGdJQ0FnSUNCN2RHVjRkRG9nSjBOeWFYUnBZMkZzSUdGc1lYSnRjeWQ5TEZ4dUlDQWdJQ0FnZTNSbGVIUTZJQ2RPWlhkbGMzUWdZV3hoY20xekozMHNYRzRnSUNBZ0lDQjdkR1Y0ZERvZ0owRmphMjV2ZDJ4bFpHZGxaQ0JCYkdGeWJYTW5mVnh1SUNBZ0lGMDdYRzVjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BHTmhjSFJwYjI0Z1kyeGhjM05PWVcxbFBWd2liR2x6ZEMxbWFXeDBaWEpjSWo1Y2JpQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKbWFXeDBaWEl0YzJWc1pXTjBhVzl1WENJK1hHNGdJQ0FnSUNBZ0lDQWdQSFZzSUdOc1lYTnpUbUZ0WlQxY0luQjFiR3d0Y21sbmFIUWdhVzVzYVc1bFhDSStYRzRnSUNBZ0lDQWdJQ0FnSUNBOGJHaytVWFZwWTJzZ1ptbHNkR1Z5Y3pvOEwyeHBQbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BHeHBQbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQThSSEp2Y0dSdmQyNGdjMlZzWldOMFpXUTlYQ0pCWTNScGRtVWdZV3hoY20xelhDSWdZV3hwWjI0OVhDSnlhV2RvZEZ3aUlHTm9iMmxqWlhNOWUyTm9iMmxqWlhOOUlDOCtYRzRnSUNBZ0lDQWdJQ0FnSUNBOEwyeHBQbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BHeHBJR05zWVhOelRtRnRaVDFjSW1samIyNHRaM0p2ZFhCY0lqNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1BHRWdiMjVEYkdsamF6MTdkR2hwY3k1ZmMyRjJaVVpwYkhSbGNuMCtQRWxqYjI0Z2RIbHdaVDFjSW5OaGRtVmNJaUJ6YVhwbFBWd2liR2RjSWlBdlBqd3ZZVDVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdQR0VnYjI1RGJHbGphejE3ZEdocGN5NWZaR1ZzWlhSbFJtbHNkR1Z5ZlQ0OFNXTnZiaUIwZVhCbFBWd2lkSEpoYzJndGIxd2lJSE5wZW1VOVhDSnNaMXdpSUM4K1BDOWhQbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BDOXNhVDVjYmlBZ0lDQWdJQ0FnSUNBOEwzVnNQbHh1SUNBZ0lDQWdJQ0E4TDJScGRqNWNibHh1SUNBZ0lDQWdJQ0E4Um1sc2RHVnlRbTk0SUdOeWFYUmxjbWxoUFh0aWRXbHNaR1Z5ZlNBdlBseHVJQ0FnSUNBZ1BDOWpZWEIwYVc5dVBseHVJQ0FnSUNrN1hHNGdJSDFjYm4wcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRXhwYzNSR2FXeDBaWEk3WEc0aVhYMD0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIExpc3RSb3c7XG52YXIgXyAgICAgICAgICAgICA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciBSZWFjdCAgICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBCYWNrYm9uZSAgICAgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBIZWFkaW5nTW9kZWwgID0gcmVxdWlyZSgnLi9oZWFkaW5nX21vZGVsJyk7XG52YXIgQWxhcm1Nb2RlbCAgICA9IHJlcXVpcmUoJy4vYWxhcm1fbW9kZWwnKTtcbnZhciBUciAgICAgICAgICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy90ci5qc3gnKTtcbnZhciBUZCAgICAgICAgICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy90ZC5qc3gnKTtcbnZhciB0cmFuc2Zvcm1lcnMgID0gcmVxdWlyZSgnLi90cmFuc2Zvcm1lcnMuanN4JylcblxuTGlzdFJvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJMaXN0Um93XCIsXG4gIHByb3BUeXBlczoge1xuICAgIGhlYWRpbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEhlYWRpbmdNb2RlbCkuaXNSZXF1aXJlZCxcbiAgICBtYW5hZ2VkX2Nhc2U6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEFsYXJtTW9kZWwpLmlzUmVxdWlyZWRcbiAgfSxcbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBmdW5jdGlvbiAobmV3UHJvcHMsIG5ld1N0YXRlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gICAgdmFyIG5ld19jYXNlICA9IG5ld1Byb3BzLm1hbmFnZWRfY2FzZSA/IG5ld1Byb3BzLm1hbmFnZWRfY2FzZS50b0pTT04oKSA6IHt9O1xuICAgIHZhciBvbGRfY2FzZSAgPSB0aGlzLnByb3BzLm1hbmFnZWRfY2FzZS50b0pTT04oKTtcblxuICAgIGlmICh0aGlzLnByb3BzLmNsYXNzTmFtZSAhPT0gbmV3UHJvcHMuY2xhc3NOYW1lKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoISBfLmlzRXF1YWwob2xkX2Nhc2UsIG5ld19jYXNlKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29scyA9IHRoaXMuYnVpbGRDb2xzKCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUciwge2NsYXNzTmFtZTogdGhpcy5wcm9wcy5jbGFzc05hbWUsIG9uQ2xpY2s6IHRoaXMuaGFuZGxlQ2xpY2t9LCBcbiAgICAgICAgY29sc1xuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbiAoZSkge1xuICAgIGlmICh0aGlzLnByb3BzLm9uQ2xpY2spIHtcbiAgICAgIHRoaXMucHJvcHMub25DbGljayhlKTtcbiAgICB9XG4gIH0sXG4gIGJ1aWxkQ29sczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBuYW1lO1xuICAgIHZhciB2YWx1ZTtcbiAgICB2YXIgYWxhcm0gICA9IHRoaXMucHJvcHMuYWxhcm07XG4gICAgdmFyIGhlYWRpbmcgPSB0aGlzLnByb3BzLmhlYWRpbmc7XG4gICAgdmFyIGZpZWxkcyAgPSBbXTtcblxuICAgIHdoaWxlIChoZWFkaW5nKSB7XG4gICAgICBuYW1lICA9IGhlYWRpbmcuZ2V0KCduYW1lJyk7XG4gICAgICB0eXBlICA9IGhlYWRpbmcuZ2V0KCd0eXBlJyk7XG4gICAgICB2YWx1ZSA9IHRyYW5zZm9ybWVyc1t0eXBlXSAmJiB0cmFuc2Zvcm1lcnNbdHlwZV0uY2FsbCh0aGlzLCBhbGFybSwgbmFtZSk7XG5cbiAgICAgIGZpZWxkcy5wdXNoKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRkLCB7c3RvcmU6IGFsYXJtLCBrZXk6IGhlYWRpbmcuY2lkfSwgXG4gICAgICAgICAgdmFsdWVcbiAgICAgICAgKVxuICAgICAgKTtcblxuICAgICAgaGVhZGluZyA9IGhlYWRpbmcubmV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmllbGRzO1xuICB9LFxuICBhY2tub3dsZWRnZUFsYXJtOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wcm9wcy5hbGFybS5zZXQoJ2Fja25vd2xlZGdlZCcsIHRydWUpO1xuICAgIHRoaXMuc2V0U3RhdGUoe30pO1xuICB9LFxuICBjbGVhckFsYXJtOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wcm9wcy5hbGFybS5zZXQoe1xuICAgICAgYWNrbm93bGVkZ2VkOiB0cnVlLFxuICAgICAgY2xlYXJlZDogICAgICB0cnVlXG4gICAgfSk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHt9KTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdFJvdztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdllXeGhjbTF6TDJ4cGMzUmZjbTkzTG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHM3UVVGRlFTeEhRVUZIT3p0QlFVVklMRWxCUVVrc1QwRkJUeXhEUVVGRE8wRkJRMW9zU1VGQlNTeERRVUZETEdWQlFXVXNUMEZCVHl4RFFVRkRMRmxCUVZrc1EwRkJReXhEUVVGRE8wRkJRekZETEVsQlFVa3NTMEZCU3l4WFFVRlhMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU55UXl4SlFVRkpMRkZCUVZFc1VVRkJVU3hQUVVGUExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTTdRVUZEZUVNc1NVRkJTU3haUVVGWkxFbEJRVWtzVDBGQlR5eERRVUZETEdsQ1FVRnBRaXhEUVVGRExFTkJRVU03UVVGREwwTXNTVUZCU1N4VlFVRlZMRTFCUVUwc1QwRkJUeXhEUVVGRExHVkJRV1VzUTBGQlF5eERRVUZETzBGQlF6ZERMRWxCUVVrc1JVRkJSU3hqUVVGakxFOUJRVThzUTBGQlF5eDVRa0ZCZVVJc1EwRkJReXhEUVVGRE8wRkJRM1pFTEVsQlFVa3NSVUZCUlN4alFVRmpMRTlCUVU4c1EwRkJReXg1UWtGQmVVSXNRMEZCUXl4RFFVRkRPMEZCUTNaRUxFbEJRVWtzV1VGQldTeEpRVUZKTEU5QlFVOHNRMEZCUXl4dlFrRkJiMElzUTBGQlF6czdRVUZGYWtRc05rSkJRVFpDTEhWQ1FVRkJPMFZCUXpOQ0xGTkJRVk1zUlVGQlJUdEpRVU5VTEU5QlFVOHNSVUZCUlN4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExGVkJRVlVzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXl4VlFVRlZPMGxCUXpWRUxGbEJRVmtzUlVGQlJTeExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRlZCUVZVc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF5eFZRVUZWTzBkQlEyaEZPMFZCUTBRc2NVSkJRWEZDTEVWQlFVVXNWVUZCVlN4UlFVRlJMRVZCUVVVc1VVRkJVU3hGUVVGRk8wbEJRMjVFTEU5QlFVOHNTVUZCU1N4RFFVRkRPMGxCUTFvc1NVRkJTU3hSUVVGUkxFbEJRVWtzVVVGQlVTeERRVUZETEZsQlFWa3NSMEZCUnl4UlFVRlJMRU5CUVVNc1dVRkJXU3hEUVVGRExFMUJRVTBzUlVGQlJTeEhRVUZITEVWQlFVVXNRMEZCUXp0QlFVTm9SaXhKUVVGSkxFbEJRVWtzVVVGQlVTeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1dVRkJXU3hEUVVGRExFMUJRVTBzUlVGQlJTeERRVUZET3p0SlFVVnFSQ3hKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4TFFVRkxMRkZCUVZFc1EwRkJReXhUUVVGVExFVkJRVVU3VFVGREwwTXNUMEZCVHl4SlFVRkpMRU5CUVVNN1FVRkRiRUlzUzBGQlN6czdTVUZGUkN4SlFVRkpMRVZCUVVVc1EwRkJReXhEUVVGRExFOUJRVThzUTBGQlF5eFJRVUZSTEVWQlFVVXNVVUZCVVN4RFFVRkRMRVZCUVVVN1RVRkRia01zVDBGQlR5eEpRVUZKTEVOQlFVTTdRVUZEYkVJc1MwRkJTenM3U1VGRlJDeFBRVUZQTEV0QlFVc3NRMEZCUXp0SFFVTmtPMFZCUTBRc1RVRkJUU3hGUVVGRkxGbEJRVms3UVVGRGRFSXNTVUZCU1N4SlFVRkpMRWxCUVVrc1IwRkJSeXhKUVVGSkxFTkJRVU1zVTBGQlV5eEZRVUZGTEVOQlFVTTdPMGxCUlRWQ08wMUJRMFVzYjBKQlFVTXNSVUZCUlN4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRk5CUVZNc1JVRkJReXhEUVVGRExFOUJRVUVzUlVGQlR5eERRVUZGTEVsQlFVa3NRMEZCUXl4WFFVRmhMRU5CUVVFc1JVRkJRVHRSUVVNM1JDeEpRVUZMTzAxQlEwZ3NRMEZCUVR0TlFVTk1PMGRCUTBnN1JVRkRSQ3hYUVVGWExFVkJRVVVzVlVGQlZTeERRVUZETEVWQlFVVTdTVUZEZUVJc1NVRkJTU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNSVUZCUlR0TlFVTjBRaXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRMUVVOMlFqdEhRVU5HTzBWQlEwUXNVMEZCVXl4RlFVRkZMRmxCUVZrN1NVRkRja0lzU1VGQlNTeEpRVUZKTEVOQlFVTTdTVUZEVkN4SlFVRkpMRXRCUVVzc1EwRkJRenRKUVVOV0xFbEJRVWtzUzBGQlN5eExRVUZMTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRE8wbEJReTlDTEVsQlFVa3NUMEZCVHl4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR5eERRVUZETzBGQlEzSkRMRWxCUVVrc1NVRkJTU3hOUVVGTkxFbEJRVWtzUlVGQlJTeERRVUZET3p0SlFVVnFRaXhQUVVGUExFOUJRVThzUlVGQlJUdE5RVU5rTEVsQlFVa3NTVUZCU1N4UFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETzAxQlF6VkNMRWxCUVVrc1NVRkJTU3hQUVVGUExFTkJRVU1zUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUTJ4RExFMUJRVTBzUzBGQlN5eEhRVUZITEZsQlFWa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3haUVVGWkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1JVRkJSU3hMUVVGTExFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVTTdPMDFCUlhwRkxFMUJRVTBzUTBGQlF5eEpRVUZKTzFGQlExUXNiMEpCUVVNc1JVRkJSU3hGUVVGQkxFTkJRVUVzUTBGQlF5eExRVUZCTEVWQlFVc3NRMEZCUlN4TFFVRkxMRVZCUVVNc1EwRkJReXhIUVVGQkxFVkJRVWNzUTBGQlJTeFBRVUZQTEVOQlFVTXNSMEZCU3l4RFFVRkJMRVZCUVVFN1ZVRkRha01zUzBGQlRUdFJRVU5LTEVOQlFVRTdRVUZEWWl4UFFVRlBMRU5CUVVNN08wMUJSVVlzVDBGQlR5eEhRVUZITEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNN1FVRkROMElzUzBGQlN6czdTVUZGUkN4UFFVRlBMRTFCUVUwc1EwRkJRenRIUVVObU8wVkJRMFFzWjBKQlFXZENMRVZCUVVVc1dVRkJXVHRKUVVNMVFpeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zWTBGQll5eEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPMGxCUXpORExFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNN1IwRkRia0k3UlVGRFJDeFZRVUZWTEVWQlFVVXNXVUZCV1R0SlFVTjBRaXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNN1RVRkRia0lzV1VGQldTeEZRVUZGTEVsQlFVazdUVUZEYkVJc1QwRkJUeXhQUVVGUExFbEJRVWs3UVVGRGVFSXNTMEZCU3l4RFFVRkRMRU5CUVVNN08wbEJSVWdzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJRenRIUVVOdVFqdEJRVU5JTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NUMEZCVHl4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlvcVhHNGdLaUJBYW5ONElGSmxZV04wTGtSUFRWeHVJQ292WEc1Y2JuWmhjaUJNYVhOMFVtOTNPMXh1ZG1GeUlGOGdJQ0FnSUNBZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkMWJtUmxjbk5qYjNKbEp5azdYRzUyWVhJZ1VtVmhZM1FnSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSjNKbFlXTjBKeWs3WEc1MllYSWdRbUZqYTJKdmJtVWdJQ0FnSUNBOUlISmxjWFZwY21Vb0oySmhZMnRpYjI1bEp5azdYRzUyWVhJZ1NHVmhaR2x1WjAxdlpHVnNJQ0E5SUhKbGNYVnBjbVVvSnk0dmFHVmhaR2x1WjE5dGIyUmxiQ2NwTzF4dWRtRnlJRUZzWVhKdFRXOWtaV3dnSUNBZ1BTQnlaWEYxYVhKbEtDY3VMMkZzWVhKdFgyMXZaR1ZzSnlrN1hHNTJZWElnVkhJZ0lDQWdJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR1THk0dUwyTnZiWEJ2Ym1WdWRITXZkSEl1YW5ONEp5azdYRzUyWVhJZ1ZHUWdJQ0FnSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dUx5NHVMMk52YlhCdmJtVnVkSE12ZEdRdWFuTjRKeWs3WEc1MllYSWdkSEpoYm5ObWIzSnRaWEp6SUNBOUlISmxjWFZwY21Vb0p5NHZkSEpoYm5ObWIzSnRaWEp6TG1wemVDY3BYRzVjYmt4cGMzUlNiM2NnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJSEJ5YjNCVWVYQmxjem9nZTF4dUlDQWdJR2hsWVdScGJtYzZJRkpsWVdOMExsQnliM0JVZVhCbGN5NXBibk4wWVc1alpVOW1LRWhsWVdScGJtZE5iMlJsYkNrdWFYTlNaWEYxYVhKbFpDeGNiaUFnSUNCdFlXNWhaMlZrWDJOaGMyVTZJRkpsWVdOMExsQnliM0JVZVhCbGN5NXBibk4wWVc1alpVOW1LRUZzWVhKdFRXOWtaV3dwTG1selVtVnhkV2x5WldSY2JpQWdmU3hjYmlBZ2MyaHZkV3hrUTI5dGNHOXVaVzUwVlhCa1lYUmxPaUJtZFc1amRHbHZiaUFvYm1WM1VISnZjSE1zSUc1bGQxTjBZWFJsS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFJ5ZFdVN1hHNGdJQ0FnZG1GeUlHNWxkMTlqWVhObElDQTlJRzVsZDFCeWIzQnpMbTFoYm1GblpXUmZZMkZ6WlNBL0lHNWxkMUJ5YjNCekxtMWhibUZuWldSZlkyRnpaUzUwYjBwVFQwNG9LU0E2SUh0OU8xeHVJQ0FnSUhaaGNpQnZiR1JmWTJGelpTQWdQU0IwYUdsekxuQnliM0J6TG0xaGJtRm5aV1JmWTJGelpTNTBiMHBUVDA0b0tUdGNibHh1SUNBZ0lHbG1JQ2gwYUdsekxuQnliM0J6TG1Oc1lYTnpUbUZ0WlNBaFBUMGdibVYzVUhKdmNITXVZMnhoYzNOT1lXMWxLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkSEoxWlR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb0lTQmZMbWx6UlhGMVlXd29iMnhrWDJOaGMyVXNJRzVsZDE5allYTmxLU2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSFJ5ZFdVN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnY21WMGRYSnVJR1poYkhObE8xeHVJQ0I5TEZ4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnWTI5c2N5QTlJSFJvYVhNdVluVnBiR1JEYjJ4ektDazdYRzVjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BGUnlJR05zWVhOelRtRnRaVDE3ZEdocGN5NXdjbTl3Y3k1amJHRnpjMDVoYldWOUlHOXVRMnhwWTJzOWUzUm9hWE11YUdGdVpHeGxRMnhwWTJ0OVBseHVJQ0FnSUNBZ0lDQjdZMjlzYzMxY2JpQWdJQ0FnSUR3dlZISStYRzRnSUNBZ0tUdGNiaUFnZlN4Y2JpQWdhR0Z1Wkd4bFEyeHBZMnM2SUdaMWJtTjBhVzl1SUNobEtTQjdYRzRnSUNBZ2FXWWdLSFJvYVhNdWNISnZjSE11YjI1RGJHbGpheWtnZTF4dUlDQWdJQ0FnZEdocGN5NXdjbTl3Y3k1dmJrTnNhV05yS0dVcE8xeHVJQ0FnSUgxY2JpQWdmU3hjYmlBZ1luVnBiR1JEYjJ4ek9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkbUZ5SUc1aGJXVTdYRzRnSUNBZ2RtRnlJSFpoYkhWbE8xeHVJQ0FnSUhaaGNpQmhiR0Z5YlNBZ0lEMGdkR2hwY3k1d2NtOXdjeTVoYkdGeWJUdGNiaUFnSUNCMllYSWdhR1ZoWkdsdVp5QTlJSFJvYVhNdWNISnZjSE11YUdWaFpHbHVaenRjYmlBZ0lDQjJZWElnWm1sbGJHUnpJQ0E5SUZ0ZE8xeHVYRzRnSUNBZ2QyaHBiR1VnS0dobFlXUnBibWNwSUh0Y2JpQWdJQ0FnSUc1aGJXVWdJRDBnYUdWaFpHbHVaeTVuWlhRb0oyNWhiV1VuS1R0Y2JpQWdJQ0FnSUhSNWNHVWdJRDBnYUdWaFpHbHVaeTVuWlhRb0ozUjVjR1VuS1R0Y2JpQWdJQ0FnSUhaaGJIVmxJRDBnZEhKaGJuTm1iM0p0WlhKelczUjVjR1ZkSUNZbUlIUnlZVzV6Wm05eWJXVnljMXQwZVhCbFhTNWpZV3hzS0hSb2FYTXNJR0ZzWVhKdExDQnVZVzFsS1R0Y2JseHVJQ0FnSUNBZ1ptbGxiR1J6TG5CMWMyZ29YRzRnSUNBZ0lDQWdJRHhVWkNCemRHOXlaVDE3WVd4aGNtMTlJR3RsZVQxN2FHVmhaR2x1Wnk1amFXUjlQbHh1SUNBZ0lDQWdJQ0FnSUh0MllXeDFaWDFjYmlBZ0lDQWdJQ0FnUEM5VVpENWNiaUFnSUNBZ0lDazdYRzVjYmlBZ0lDQWdJR2hsWVdScGJtY2dQU0JvWldGa2FXNW5MbTVsZUhRN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnY21WMGRYSnVJR1pwWld4a2N6dGNiaUFnZlN4Y2JpQWdZV05yYm05M2JHVmtaMlZCYkdGeWJUb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFJvYVhNdWNISnZjSE11WVd4aGNtMHVjMlYwS0NkaFkydHViM2RzWldSblpXUW5MQ0IwY25WbEtUdGNiaUFnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHQ5S1R0Y2JpQWdmU3hjYmlBZ1kyeGxZWEpCYkdGeWJUb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFJvYVhNdWNISnZjSE11WVd4aGNtMHVjMlYwS0h0Y2JpQWdJQ0FnSUdGamEyNXZkMnhsWkdkbFpEb2dkSEoxWlN4Y2JpQWdJQ0FnSUdOc1pXRnlaV1E2SUNBZ0lDQWdkSEoxWlZ4dUlDQWdJSDBwTzF4dVhHNGdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaDdmU2s3WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFeHBjM1JTYjNjN1hHNGlYWDA9IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBBbGFybXNMaXN0O1xudmFyIFJlYWN0ICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFRoZWFkICAgPSByZXF1aXJlKCcuL3RoZWFkX3dyYXBwZXIuanN4Jyk7XG52YXIgVGJvZHkgICA9IHJlcXVpcmUoJy4vdGJvZHlfd3JhcHBlci5qc3gnKTtcbnZhciBGaWx0ZXIgID0gcmVxdWlyZSgnLi9saXN0X2ZpbHRlci5qc3gnKTtcblxuQWxhcm1zTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJBbGFybXNMaXN0XCIsXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9wcyA9IHtzdG9yZTogdGhpcy5wcm9wcy5zdG9yZX07XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRhYmxlXCIsIHtjbGFzc05hbWU6IFwiZnVsbCBpbmxpbmUtZGV0YWlsc1wifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGaWx0ZXIsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgcHJvcHMpKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUaGVhZCwgUmVhY3QuX19zcHJlYWQoe30sICBwcm9wcykpLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRib2R5LCBSZWFjdC5fX3NwcmVhZCh7fSwgIHByb3BzKSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFsYXJtc0xpc3Q7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZZV3hoY20xekwyeHBjM1JmZG1sbGR5NXFjM2dpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN08wRkJSVUVzUjBGQlJ6czdRVUZGU0N4SlFVRkpMRlZCUVZVc1EwRkJRenRCUVVObUxFbEJRVWtzUzBGQlN5eExRVUZMTEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVNdlFpeEpRVUZKTEV0QlFVc3NTMEZCU3l4UFFVRlBMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNRMEZCUXp0QlFVTTNReXhKUVVGSkxFdEJRVXNzUzBGQlN5eFBRVUZQTEVOQlFVTXNjVUpCUVhGQ0xFTkJRVU1zUTBGQlF6dEJRVU0zUXl4SlFVRkpMRTFCUVUwc1NVRkJTU3hQUVVGUExFTkJRVU1zYlVKQlFXMUNMRU5CUVVNc1EwRkJRenM3UVVGRk0wTXNaME5CUVdkRExEQkNRVUZCTzBWQlF6bENMRTFCUVUwc1JVRkJSU3haUVVGWk8wRkJRM1JDTEVsQlFVa3NTVUZCU1N4TFFVRkxMRWRCUVVjc1EwRkJReXhMUVVGTExFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenM3U1VGRmRFTTdUVUZEUlN4dlFrRkJRU3hMUVVGSkxFVkJRVUVzU1VGQlF5eEZRVUZCTzFGQlEwZ3NiMEpCUVVFc1QwRkJUU3hGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4eFFrRkJjMElzUTBGQlFTeEZRVUZCTzFWQlEzSkRMRzlDUVVGRExFMUJRVTBzUlVGQlFTeG5Ra0ZCUVN4SFFVRkJMRU5CUVVVc1IwRkJSeXhMUVVGTkxFTkJRVUVzUTBGQlJ5eERRVUZCTEVWQlFVRTdWVUZEY2tJc2IwSkJRVU1zUzBGQlN5eEZRVUZCTEdkQ1FVRkJMRWRCUVVFc1EwRkJSU3hIUVVGSExFdEJRVTBzUTBGQlFTeERRVUZITEVOQlFVRXNSVUZCUVR0VlFVTndRaXh2UWtGQlF5eExRVUZMTEVWQlFVRXNaMEpCUVVFc1IwRkJRU3hEUVVGRkxFZEJRVWNzUzBGQlRTeERRVUZCTEVOQlFVY3NRMEZCUVR0UlFVTmtMRU5CUVVFN1RVRkRTaXhEUVVGQk8wMUJRMDQ3UjBGRFNEdEJRVU5JTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NWVUZCVlN4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlvcVhHNGdLaUJBYW5ONElGSmxZV04wTGtSUFRWeHVJQ292WEc1Y2JuWmhjaUJCYkdGeWJYTk1hWE4wTzF4dWRtRnlJRkpsWVdOMElDQWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDY3BPMXh1ZG1GeUlGUm9aV0ZrSUNBZ1BTQnlaWEYxYVhKbEtDY3VMM1JvWldGa1gzZHlZWEJ3WlhJdWFuTjRKeWs3WEc1MllYSWdWR0p2WkhrZ0lDQTlJSEpsY1hWcGNtVW9KeTR2ZEdKdlpIbGZkM0poY0hCbGNpNXFjM2duS1R0Y2JuWmhjaUJHYVd4MFpYSWdJRDBnY21WeGRXbHlaU2duTGk5c2FYTjBYMlpwYkhSbGNpNXFjM2duS1R0Y2JseHVRV3hoY20xelRHbHpkQ0E5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkbUZ5SUhCeWIzQnpJRDBnZTNOMGIzSmxPaUIwYUdsekxuQnliM0J6TG5OMGIzSmxmVHRjYmx4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThaR2wyUGx4dUlDQWdJQ0FnSUNBOGRHRmliR1VnWTJ4aGMzTk9ZVzFsUFZ3aVpuVnNiQ0JwYm14cGJtVXRaR1YwWVdsc2Mxd2lQbHh1SUNBZ0lDQWdJQ0FnSUR4R2FXeDBaWElnZXk0dUxuQnliM0J6ZlNBdlBseHVJQ0FnSUNBZ0lDQWdJRHhVYUdWaFpDQjdMaTR1Y0hKdmNITjlJQzgrWEc0Z0lDQWdJQ0FnSUNBZ1BGUmliMlI1SUhzdUxpNXdjbTl3YzMwZ0x6NWNiaUFnSUNBZ0lDQWdQQzkwWVdKc1pUNWNiaUFnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFRnNZWEp0YzB4cGMzUTdYRzRpWFgwPSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3RvcmU7XG52YXIgQmFja2JvbmUgICAgICAgICAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyIEhlYWRpbmdDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9oZWFkaW5nX2NvbGxlY3Rpb24nKTtcbnZhciBBbGFybUNvbGxlY3Rpb24gICAgPSByZXF1aXJlKCcuL2FsYXJtX2NvbGxlY3Rpb24nKTtcblxuc3RvcmUgPSBuZXcgQmFja2JvbmUuTW9kZWwoe1xuICBhbGFybXM6ICAgIG5ldyBBbGFybUNvbGxlY3Rpb24oKSxcbiAgZmlyc3Q6ICAgIG51bGwsXG4gIGhlYWRpbmdzOiBuZXcgSGVhZGluZ0NvbGxlY3Rpb24oKSxcbiAgc2VsZWN0ZWQ6IG51bGxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JlO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WVd4aGNtMXpMMnhwYzNSZmRtbGxkMTl6ZEc5eVpTNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4WlFVRlpMRU5CUVVNN08wRkJSV0lzU1VGQlNTeExRVUZMTEVOQlFVTTdRVUZEVml4SlFVRkpMRkZCUVZFc1dVRkJXU3hQUVVGUExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTTdRVUZETlVNc1NVRkJTU3hwUWtGQmFVSXNSMEZCUnl4UFFVRlBMRU5CUVVNc2MwSkJRWE5DTEVOQlFVTXNRMEZCUXp0QlFVTjRSQ3hKUVVGSkxHVkJRV1VzVFVGQlRTeFBRVUZQTEVOQlFVTXNiMEpCUVc5Q0xFTkJRVU1zUTBGQlF6czdRVUZGZGtRc1MwRkJTeXhIUVVGSExFbEJRVWtzVVVGQlVTeERRVUZETEV0QlFVc3NRMEZCUXp0RlFVTjZRaXhOUVVGTkxFdEJRVXNzU1VGQlNTeGxRVUZsTEVWQlFVVTdSVUZEYUVNc1MwRkJTeXhMUVVGTExFbEJRVWs3UlVGRFpDeFJRVUZSTEVWQlFVVXNTVUZCU1N4cFFrRkJhVUlzUlVGQlJUdEZRVU5xUXl4UlFVRlJMRVZCUVVVc1NVRkJTVHRCUVVOb1FpeERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEV0QlFVc3NRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklsd2lkWE5sSUhOMGNtbGpkRndpTzF4dVhHNTJZWElnYzNSdmNtVTdYRzUyWVhJZ1FtRmphMkp2Ym1VZ0lDQWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDZGlZV05yWW05dVpTY3BPMXh1ZG1GeUlFaGxZV1JwYm1kRGIyeHNaV04wYVc5dUlEMGdjbVZ4ZFdseVpTZ25MaTlvWldGa2FXNW5YMk52Ykd4bFkzUnBiMjRuS1R0Y2JuWmhjaUJCYkdGeWJVTnZiR3hsWTNScGIyNGdJQ0FnUFNCeVpYRjFhWEpsS0NjdUwyRnNZWEp0WDJOdmJHeGxZM1JwYjI0bktUdGNibHh1YzNSdmNtVWdQU0J1WlhjZ1FtRmphMkp2Ym1VdVRXOWtaV3dvZTF4dUlDQmhiR0Z5YlhNNklDQWdJRzVsZHlCQmJHRnliVU52Ykd4bFkzUnBiMjRvS1N4Y2JpQWdabWx5YzNRNklDQWdJRzUxYkd3c1hHNGdJR2hsWVdScGJtZHpPaUJ1WlhjZ1NHVmhaR2x1WjBOdmJHeGxZM1JwYjI0b0tTeGNiaUFnYzJWc1pXTjBaV1E2SUc1MWJHeGNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlITjBiM0psTzF4dUlsMTkiLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFRib2R5V3JhcHBlcjtcbnZhciBSZWFjdCAgICAgICAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgQmFja2JvbmUgICAgICAgICAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyIFNjcm9sbGVyICAgICAgICAgID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvc2Nyb2xsZXJfY29hc3RlcicpO1xudmFyIFJvd0RldGFpbHMgICAgICAgID0gcmVxdWlyZSgnLi9hY3RpdmVfcm93X2RldGFpbHMuanN4Jyk7XG52YXIgQWxhcm1IaXN0b3J5VmlldyAgPSByZXF1aXJlKCcuL2FsYXJtX2hpc3RvcnkuanN4Jyk7XG52YXIgSGlzdG9yeUNvbGxlY3Rpb24gPSByZXF1aXJlKCcuL2FsYXJtX2hpc3RvcnlfY29sbGVjdGlvbicpO1xudmFyIExpc3RSb3cgICAgICAgICAgID0gcmVxdWlyZSgnLi9saXN0X3Jvdy5qc3gnKTtcbnZhciBjbGFzc05hbWVzICAgICAgICA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxuVGJvZHlXcmFwcGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRib2R5V3JhcHBlclwiLFxuICBwcm9wVHlwZXM6IHtcbiAgICBzdG9yZTogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoQmFja2JvbmUuTW9kZWwpLmlzUmVxdWlyZWRcbiAgfSxcbiAgbWl4aW5zOiBbUmVhY3QuYWRkb25zLlB1cmVSZW5kZXJNaXhpbl0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY3RpdmVBbGFybTogbnVsbCxcbiAgICAgIG1pbmltaXplZDogIGZhbHNlLFxuICAgICAgcHJldmlvdXM6ICAgbnVsbCxcbiAgICAgIGluY3JlbWVudDogIGZhbHNlXG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVsZW1lbnRzO1xuICAgIHZhciBhY3RpdmUgPSB0aGlzLnN0YXRlLmFjdGl2ZUFsYXJtO1xuXG4gICAgaWYgKCEgYWN0aXZlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZWxlbWVudHMgPSBbXG4gICAgICB0aGlzLnJlZnNbYWN0aXZlXS5nZXRET01Ob2RlKCksXG4gICAgICB0aGlzLnJlZnMuYWN0aXZlQWxhcm0uZ2V0RE9NTm9kZSgpXG4gICAgXTtcblxuICAgIFNjcm9sbGVyKGVsZW1lbnRzLCB7c3RlcHM6IDI1MH0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcm93cyA9IHRoaXMuX2J1aWxkUm93cygpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiLCB7Y2xhc3NOYW1lOiB0aGlzLnByb3BzLmNsYXNzTmFtZX0sIFxuICAgICAgICByb3dzXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgX2J1aWxkUm93czogZnVuY3Rpb24gKCkge1xuICAgIHZhciBkYXRhICAgID0gW107XG4gICAgdmFyIHN0b3JlICAgPSB0aGlzLnByb3BzLnN0b3JlO1xuICAgIHZhciBhbGFybXMgICA9IHN0b3JlLmdldCgnYWxhcm1zJyk7XG4gICAgdmFyIGhlYWRpbmcgPSBzdG9yZS5nZXQoJ2ZpcnN0Jyk7XG4gICAgdmFyIHByZXYgICAgPSBudWxsO1xuICAgIHZhciBuZXh0ICAgID0gbnVsbDtcblxuICAgIGFsYXJtcy5lYWNoKGZ1bmN0aW9uIChtb2RlbCwgaW5kZXgpIHtcbiAgICAgIHZhciBhY3RpdmVQcm9wcztcbiAgICAgIHZhciByb3dQcm9wcztcbiAgICAgIHZhciBzZWxlY3RlZF9yb3c7XG4gICAgICB2YXIgY2xhc3NfbmFtZXM7XG4gICAgICB2YXIgYWN0aXZlICA9IHRoaXMuc3RhdGUuYWN0aXZlQWxhcm0gPT09IG1vZGVsLmNpZDtcbiAgICAgIHZhciBvZGQgICAgID0gaW5kZXggJSAyID8gJ29kZCcgOiBudWxsO1xuXG4gICAgICBuZXh0ID0gYWxhcm1zLmF0KGluZGV4ICsgMSk7XG5cbiAgICAgIGNsYXNzX25hbWVzID0gY2xhc3NOYW1lcyh7XG4gICAgICAgIG9kZDogb2RkLFxuICAgICAgICBhY3RpdmU6IGFjdGl2ZVxuICAgICAgfSk7XG5cbiAgICAgIHJvd1Byb3BzID0ge1xuICAgICAgICBjbGFzc05hbWU6ICAgIGNsYXNzX25hbWVzLFxuICAgICAgICByZWY6ICAgICAgICAgIG1vZGVsLmNpZCxcbiAgICAgICAga2V5OiAgICAgICAgICBtb2RlbC5jaWQsXG4gICAgICAgIG9uQ2xpY2s6ICAgICAgdGhpcy5faGFuZGxlQWxhcm1TZWxlY3Rpb24uYmluZCh0aGlzLCBtb2RlbC5jaWQpLFxuICAgICAgICBhbGFybTogICAgICAgIG1vZGVsLFxuICAgICAgICBoZWFkaW5nOiAgICAgIGhlYWRpbmdcbiAgICAgIH07XG5cbiAgICAgIGRhdGEucHVzaChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMaXN0Um93LCBSZWFjdC5fX3NwcmVhZCh7fSwgIHJvd1Byb3BzKSlcbiAgICAgICk7XG5cbiAgICAgIGlmIChhY3RpdmUpIHtcbiAgICAgICAgYWN0aXZlUHJvcHMgPSB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAgb2RkLFxuICAgICAgICAgIG1vZGVsOiAgICAgIG1vZGVsLFxuICAgICAgICAgIHByZXY6ICAgICAgIHByZXYgJiYgcHJldi5jaWQsXG4gICAgICAgICAgbmV4dDogICAgICAgbmV4dCAmJiBuZXh0LmNpZCxcbiAgICAgICAgICBzd2l0Y2hlcjogICB0aGlzLl9oYW5kbGVBbGFybVNlbGVjdGlvbixcbiAgICAgICAgICBzaXplVG9nZ2xlOiB0aGlzLl90b2dnbGVNaW5pbWl6ZSxcbiAgICAgICAgICBrZXk6ICAgICAgICBtb2RlbC5jaWQgKyAnLWFjdGl2ZScsXG4gICAgICAgICAgcmVmOiAgICAgICAgJ2FjdGl2ZUFsYXJtJyxcbiAgICAgICAgICBtaW5pbWl6ZWQ6ICB0aGlzLnN0YXRlLm1pbmltaXplZFxuICAgICAgICB9O1xuXG4gICAgICAgIGRhdGEucHVzaChcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvd0RldGFpbHMsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgYWN0aXZlUHJvcHMpLCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQWxhcm1IaXN0b3J5Vmlldywge2NvbGxlY3Rpb246IG5ldyBIaXN0b3J5Q29sbGVjdGlvbigpfSlcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHByZXYgPSBtb2RlbDtcbiAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiBkYXRhO1xuICB9LFxuICBfaGFuZGxlQWxhcm1TZWxlY3Rpb246IGZ1bmN0aW9uIChjaWQsIGluY3JlbWVudCkge1xuICAgIHZhciBjdXJyZW50ID0gdGhpcy5zdGF0ZS5hY3RpdmVBbGFybTtcblxuICAgIGlmIChjdXJyZW50ID09PSBjaWQpIHtcbiAgICAgIGNpZCA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBhY3RpdmVBbGFybTogY2lkLFxuICAgICAgaW5jcmVtZW50OiAgaW5jcmVtZW50ID09PSB0cnVlLFxuICAgICAgcHJldmlvdXM6ICAgY2lkID8gY3VycmVudCA6IG51bGxcbiAgICB9KTtcbiAgfSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRib2R5V3JhcHBlcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdllXeGhjbTF6TDNSaWIyUjVYM2R5WVhCd1pYSXVhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRVVZCTEVkQlFVYzdPMEZCUlVnc1NVRkJTU3haUVVGWkxFTkJRVU03UVVGRGFrSXNTVUZCU1N4TFFVRkxMR1ZCUVdVc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzBGQlEzcERMRWxCUVVrc1VVRkJVU3haUVVGWkxFOUJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXp0QlFVTTFReXhKUVVGSkxGRkJRVkVzV1VGQldTeFBRVUZQTEVOQlFVTXNPRUpCUVRoQ0xFTkJRVU1zUTBGQlF6dEJRVU5vUlN4SlFVRkpMRlZCUVZVc1ZVRkJWU3hQUVVGUExFTkJRVU1zTUVKQlFUQkNMRU5CUVVNc1EwRkJRenRCUVVNMVJDeEpRVUZKTEdkQ1FVRm5RaXhKUVVGSkxFOUJRVThzUTBGQlF5eHhRa0ZCY1VJc1EwRkJReXhEUVVGRE8wRkJRM1pFTEVsQlFVa3NhVUpCUVdsQ0xFZEJRVWNzVDBGQlR5eERRVUZETERSQ1FVRTBRaXhEUVVGRExFTkJRVU03UVVGRE9VUXNTVUZCU1N4UFFVRlBMR0ZCUVdFc1QwRkJUeXhEUVVGRExHZENRVUZuUWl4RFFVRkRMRU5CUVVNN1FVRkRiRVFzU1VGQlNTeFZRVUZWTEZWQlFWVXNUMEZCVHl4RFFVRkRMRmxCUVZrc1EwRkJReXhEUVVGRE96dEJRVVU1UXl4clEwRkJhME1zTkVKQlFVRTdSVUZEYUVNc1UwRkJVeXhGUVVGRk8wbEJRMVFzUzBGQlN5eEZRVUZGTEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1ZVRkJWU3hEUVVGRExGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4VlFVRlZPMGRCUXpkRU8wVkJRMFFzVFVGQlRTeEZRVUZGTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkJReXhsUVVGbExFTkJRVU03UlVGRGRFTXNaVUZCWlN4RlFVRkZMRmxCUVZrN1NVRkRNMElzVDBGQlR6dE5RVU5NTEZkQlFWY3NSVUZCUlN4SlFVRkpPMDFCUTJwQ0xGTkJRVk1zUjBGQlJ5eExRVUZMTzAxQlEycENMRkZCUVZFc1NVRkJTU3hKUVVGSk8wMUJRMmhDTEZOQlFWTXNSMEZCUnl4TFFVRkxPMHRCUTJ4Q0xFTkJRVU03UjBGRFNEdEZRVU5FTEd0Q1FVRnJRaXhGUVVGRkxGbEJRVms3U1VGRE9VSXNTVUZCU1N4UlFVRlJMRU5CUVVNN1FVRkRha0lzU1VGQlNTeEpRVUZKTEUxQlFVMHNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdTVUZGY0VNc1NVRkJTU3hGUVVGRkxFMUJRVTBzUlVGQlJUdE5RVU5hTEU5QlFVOHNTMEZCU3l4RFFVRkRPMEZCUTI1Q0xFdEJRVXM3TzBsQlJVUXNVVUZCVVN4SFFVRkhPMDFCUTFRc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXl4VlFVRlZMRVZCUVVVN1RVRkRPVUlzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4WFFVRlhMRU5CUVVNc1ZVRkJWU3hGUVVGRk8wRkJRM2hETEV0QlFVc3NRMEZCUXpzN1NVRkZSaXhSUVVGUkxFTkJRVU1zVVVGQlVTeEZRVUZGTEVOQlFVTXNTMEZCU3l4RlFVRkZMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU03UjBGRGJFTTdSVUZEUkN4TlFVRk5MRVZCUVVVc1dVRkJXVHRCUVVOMFFpeEpRVUZKTEVsQlFVa3NTVUZCU1N4SFFVRkhMRWxCUVVrc1EwRkJReXhWUVVGVkxFVkJRVVVzUTBGQlF6czdTVUZGTjBJN1RVRkRSU3h2UWtGQlFTeFBRVUZOTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVnl4RFFVRkJMRVZCUVVFN1VVRkRja01zU1VGQlN6dE5RVU5CTEVOQlFVRTdUVUZEVWp0SFFVTklPMFZCUTBRc1ZVRkJWU3hGUVVGRkxGbEJRVms3U1VGRGRFSXNTVUZCU1N4SlFVRkpMRTFCUVUwc1JVRkJSU3hEUVVGRE8wbEJRMnBDTEVsQlFVa3NTMEZCU3l4TFFVRkxMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETzBsQlF5OUNMRWxCUVVrc1RVRkJUU3hMUVVGTExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1NVRkRia01zU1VGQlNTeFBRVUZQTEVkQlFVY3NTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEpRVU5xUXl4SlFVRkpMRWxCUVVrc1RVRkJUU3hKUVVGSkxFTkJRVU03UVVGRGRrSXNTVUZCU1N4SlFVRkpMRWxCUVVrc1RVRkJUU3hKUVVGSkxFTkJRVU03TzBsQlJXNUNMRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU1zVlVGQlZTeExRVUZMTEVWQlFVVXNTMEZCU3l4RlFVRkZPMDFCUTJ4RExFbEJRVWtzVjBGQlZ5eERRVUZETzAxQlEyaENMRWxCUVVrc1VVRkJVU3hEUVVGRE8wMUJRMklzU1VGQlNTeFpRVUZaTEVOQlFVTTdUVUZEYWtJc1NVRkJTU3hYUVVGWExFTkJRVU03VFVGRGFFSXNTVUZCU1N4TlFVRk5MRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFhRVUZYTEV0QlFVc3NTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJRenRCUVVONlJDeE5RVUZOTEVsQlFVa3NSMEZCUnl4UFFVRlBMRXRCUVVzc1IwRkJSeXhEUVVGRExFZEJRVWNzUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXpzN1FVRkZOME1zVFVGQlRTeEpRVUZKTEVkQlFVY3NUVUZCVFN4RFFVRkRMRVZCUVVVc1EwRkJReXhMUVVGTExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdPMDFCUlRWQ0xGZEJRVmNzUjBGQlJ5eFZRVUZWTEVOQlFVTTdVVUZEZGtJc1IwRkJSeXhGUVVGRkxFZEJRVWM3VVVGRFVpeE5RVUZOTEVWQlFVVXNUVUZCVFR0QlFVTjBRaXhQUVVGUExFTkJRVU1zUTBGQlF6czdUVUZGU0N4UlFVRlJMRWRCUVVjN1VVRkRWQ3hUUVVGVExFdEJRVXNzVjBGQlZ6dFJRVU42UWl4SFFVRkhMRmRCUVZjc1MwRkJTeXhEUVVGRExFZEJRVWM3VVVGRGRrSXNSMEZCUnl4WFFVRlhMRXRCUVVzc1EwRkJReXhIUVVGSE8xRkJRM1pDTEU5QlFVOHNUMEZCVHl4SlFVRkpMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1JVRkJSU3hMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETzFGQlF6bEVMRXRCUVVzc1UwRkJVeXhMUVVGTE8xRkJRMjVDTEU5QlFVOHNUMEZCVHl4UFFVRlBPMEZCUXpkQ0xFOUJRVThzUTBGQlF6czdUVUZGUml4SlFVRkpMRU5CUVVNc1NVRkJTVHRSUVVOUUxHOUNRVUZETEU5QlFVOHNSVUZCUVN4blFrRkJRU3hIUVVGQkxFTkJRVVVzUjBGQlJ5eFJRVUZUTEVOQlFVRXNRMEZCUnl4RFFVRkJPMEZCUTJwRExFOUJRVThzUTBGQlF6czdUVUZGUml4SlFVRkpMRTFCUVUwc1JVRkJSVHRSUVVOV0xGZEJRVmNzUjBGQlJ6dFZRVU5hTEZOQlFWTXNSMEZCUnl4SFFVRkhPMVZCUTJZc1MwRkJTeXhQUVVGUExFdEJRVXM3VlVGRGFrSXNTVUZCU1N4UlFVRlJMRWxCUVVrc1NVRkJTU3hKUVVGSkxFTkJRVU1zUjBGQlJ6dFZRVU0xUWl4SlFVRkpMRkZCUVZFc1NVRkJTU3hKUVVGSkxFbEJRVWtzUTBGQlF5eEhRVUZITzFWQlF6VkNMRkZCUVZFc1NVRkJTU3hKUVVGSkxFTkJRVU1zY1VKQlFYRkNPMVZCUTNSRExGVkJRVlVzUlVGQlJTeEpRVUZKTEVOQlFVTXNaVUZCWlR0VlFVTm9ReXhIUVVGSExGTkJRVk1zUzBGQlN5eERRVUZETEVkQlFVY3NSMEZCUnl4VFFVRlRPMVZCUTJwRExFZEJRVWNzVTBGQlV5eGhRVUZoTzFWQlEzcENMRk5CUVZNc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWTTdRVUZETVVNc1UwRkJVeXhEUVVGRE96dFJRVVZHTEVsQlFVa3NRMEZCUXl4SlFVRkpPMVZCUTFBc2IwSkJRVU1zVlVGQlZTeEZRVUZCTEdkQ1FVRkJMRWRCUVVFc1EwRkJSU3hIUVVGSExGZEJRV0VzUTBGQlFTeEZRVUZCTzFsQlF6TkNMRzlDUVVGRExHZENRVUZuUWl4RlFVRkJMRU5CUVVFc1EwRkJReXhWUVVGQkxFVkJRVlVzUTBGQlJTeEpRVUZKTEdsQ1FVRnBRaXhGUVVGSExFTkJRVUVzUTBGQlJ5eERRVUZCTzFWQlF6bERMRU5CUVVFN1UwRkRaQ3hEUVVGRE8wRkJRMVlzVDBGQlR6czdUVUZGUkN4SlFVRkpMRWRCUVVjc1MwRkJTeXhEUVVGRE8wRkJRMjVDTEV0QlFVc3NSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenM3U1VGRlZDeFBRVUZQTEVsQlFVa3NRMEZCUXp0SFFVTmlPMFZCUTBRc2NVSkJRWEZDTEVWQlFVVXNWVUZCVlN4SFFVRkhMRVZCUVVVc1UwRkJVeXhGUVVGRk8wRkJRMjVFTEVsQlFVa3NTVUZCU1N4UFFVRlBMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTTdPMGxCUlhKRExFbEJRVWtzVDBGQlR5eExRVUZMTEVkQlFVY3NSVUZCUlR0TlFVTnVRaXhIUVVGSExFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEycENMRXRCUVVzN08wbEJSVVFzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXp0TlFVTmFMRmRCUVZjc1JVRkJSU3hIUVVGSE8wMUJRMmhDTEZOQlFWTXNSMEZCUnl4VFFVRlRMRXRCUVVzc1NVRkJTVHROUVVNNVFpeFJRVUZSTEVsQlFVa3NSMEZCUnl4SFFVRkhMRTlCUVU4c1IwRkJSeXhKUVVGSk8wdEJRMnBETEVOQlFVTXNRMEZCUXp0SFFVTktPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhaUVVGWkxFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUZSaWIyUjVWM0poY0hCbGNqdGNiblpoY2lCU1pXRmpkQ0FnSUNBZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0ozSmxZV04wSnlrN1hHNTJZWElnUW1GamEySnZibVVnSUNBZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkaVlXTnJZbTl1WlNjcE8xeHVkbUZ5SUZOamNtOXNiR1Z5SUNBZ0lDQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpNHZMaTR2ZFhScGJITXZjMk55YjJ4c1pYSmZZMjloYzNSbGNpY3BPMXh1ZG1GeUlGSnZkMFJsZEdGcGJITWdJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTloWTNScGRtVmZjbTkzWDJSbGRHRnBiSE11YW5ONEp5azdYRzUyWVhJZ1FXeGhjbTFJYVhOMGIzSjVWbWxsZHlBZ1BTQnlaWEYxYVhKbEtDY3VMMkZzWVhKdFgyaHBjM1J2Y25rdWFuTjRKeWs3WEc1MllYSWdTR2x6ZEc5eWVVTnZiR3hsWTNScGIyNGdQU0J5WlhGMWFYSmxLQ2N1TDJGc1lYSnRYMmhwYzNSdmNubGZZMjlzYkdWamRHbHZiaWNwTzF4dWRtRnlJRXhwYzNSU2IzY2dJQ0FnSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duTGk5c2FYTjBYM0p2ZHk1cWMzZ25LVHRjYm5aaGNpQmpiR0Z6YzA1aGJXVnpJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KMk5zWVhOemJtRnRaWE1uS1R0Y2JseHVWR0p2WkhsWGNtRndjR1Z5SUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVJQ0J3Y205d1ZIbHdaWE02SUh0Y2JpQWdJQ0J6ZEc5eVpUb2dVbVZoWTNRdVVISnZjRlI1Y0dWekxtbHVjM1JoYm1ObFQyWW9RbUZqYTJKdmJtVXVUVzlrWld3cExtbHpVbVZ4ZFdseVpXUmNiaUFnZlN4Y2JpQWdiV2w0YVc1ek9pQmJVbVZoWTNRdVlXUmtiMjV6TGxCMWNtVlNaVzVrWlhKTmFYaHBibDBzWEc0Z0lHZGxkRWx1YVhScFlXeFRkR0YwWlRvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCN1hHNGdJQ0FnSUNCaFkzUnBkbVZCYkdGeWJUb2diblZzYkN4Y2JpQWdJQ0FnSUcxcGJtbHRhWHBsWkRvZ0lHWmhiSE5sTEZ4dUlDQWdJQ0FnY0hKbGRtbHZkWE02SUNBZ2JuVnNiQ3hjYmlBZ0lDQWdJR2x1WTNKbGJXVnVkRG9nSUdaaGJITmxYRzRnSUNBZ2ZUdGNiaUFnZlN4Y2JpQWdZMjl0Y0c5dVpXNTBSR2xrVlhCa1lYUmxPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZG1GeUlHVnNaVzFsYm5Sek8xeHVJQ0FnSUhaaGNpQmhZM1JwZG1VZ1BTQjBhR2x6TG5OMFlYUmxMbUZqZEdsMlpVRnNZWEp0TzF4dVhHNGdJQ0FnYVdZZ0tDRWdZV04wYVhabEtTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlU3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdaV3hsYldWdWRITWdQU0JiWEc0Z0lDQWdJQ0IwYUdsekxuSmxabk5iWVdOMGFYWmxYUzVuWlhSRVQwMU9iMlJsS0Nrc1hHNGdJQ0FnSUNCMGFHbHpMbkpsWm5NdVlXTjBhWFpsUVd4aGNtMHVaMlYwUkU5TlRtOWtaU2dwWEc0Z0lDQWdYVHRjYmx4dUlDQWdJRk5qY205c2JHVnlLR1ZzWlcxbGJuUnpMQ0I3YzNSbGNITTZJREkxTUgwcE8xeHVJQ0I5TEZ4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnY205M2N5QTlJSFJvYVhNdVgySjFhV3hrVW05M2N5Z3BPMXh1WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeDBZbTlrZVNCamJHRnpjMDVoYldVOWUzUm9hWE11Y0hKdmNITXVZMnhoYzNOT1lXMWxmVDVjYmlBZ0lDQWdJQ0FnZTNKdmQzTjlYRzRnSUNBZ0lDQThMM1JpYjJSNVBseHVJQ0FnSUNrN1hHNGdJSDBzWEc0Z0lGOWlkV2xzWkZKdmQzTTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ1pHRjBZU0FnSUNBOUlGdGRPMXh1SUNBZ0lIWmhjaUJ6ZEc5eVpTQWdJRDBnZEdocGN5NXdjbTl3Y3k1emRHOXlaVHRjYmlBZ0lDQjJZWElnWVd4aGNtMXpJQ0FnUFNCemRHOXlaUzVuWlhRb0oyRnNZWEp0Y3ljcE8xeHVJQ0FnSUhaaGNpQm9aV0ZrYVc1bklEMGdjM1J2Y21VdVoyVjBLQ2RtYVhKemRDY3BPMXh1SUNBZ0lIWmhjaUJ3Y21WMklDQWdJRDBnYm5Wc2JEdGNiaUFnSUNCMllYSWdibVY0ZENBZ0lDQTlJRzUxYkd3N1hHNWNiaUFnSUNCaGJHRnliWE11WldGamFDaG1kVzVqZEdsdmJpQW9iVzlrWld3c0lHbHVaR1Y0S1NCN1hHNGdJQ0FnSUNCMllYSWdZV04wYVhabFVISnZjSE03WEc0Z0lDQWdJQ0IyWVhJZ2NtOTNVSEp2Y0hNN1hHNGdJQ0FnSUNCMllYSWdjMlZzWldOMFpXUmZjbTkzTzF4dUlDQWdJQ0FnZG1GeUlHTnNZWE56WDI1aGJXVnpPMXh1SUNBZ0lDQWdkbUZ5SUdGamRHbDJaU0FnUFNCMGFHbHpMbk4wWVhSbExtRmpkR2wyWlVGc1lYSnRJRDA5UFNCdGIyUmxiQzVqYVdRN1hHNGdJQ0FnSUNCMllYSWdiMlJrSUNBZ0lDQTlJR2x1WkdWNElDVWdNaUEvSUNkdlpHUW5JRG9nYm5Wc2JEdGNibHh1SUNBZ0lDQWdibVY0ZENBOUlHRnNZWEp0Y3k1aGRDaHBibVJsZUNBcklERXBPMXh1WEc0Z0lDQWdJQ0JqYkdGemMxOXVZVzFsY3lBOUlHTnNZWE56VG1GdFpYTW9lMXh1SUNBZ0lDQWdJQ0J2WkdRNklHOWtaQ3hjYmlBZ0lDQWdJQ0FnWVdOMGFYWmxPaUJoWTNScGRtVmNiaUFnSUNBZ0lIMHBPMXh1WEc0Z0lDQWdJQ0J5YjNkUWNtOXdjeUE5SUh0Y2JpQWdJQ0FnSUNBZ1kyeGhjM05PWVcxbE9pQWdJQ0JqYkdGemMxOXVZVzFsY3l4Y2JpQWdJQ0FnSUNBZ2NtVm1PaUFnSUNBZ0lDQWdJQ0J0YjJSbGJDNWphV1FzWEc0Z0lDQWdJQ0FnSUd0bGVUb2dJQ0FnSUNBZ0lDQWdiVzlrWld3dVkybGtMRnh1SUNBZ0lDQWdJQ0J2YmtOc2FXTnJPaUFnSUNBZ0lIUm9hWE11WDJoaGJtUnNaVUZzWVhKdFUyVnNaV04wYVc5dUxtSnBibVFvZEdocGN5d2diVzlrWld3dVkybGtLU3hjYmlBZ0lDQWdJQ0FnWVd4aGNtMDZJQ0FnSUNBZ0lDQnRiMlJsYkN4Y2JpQWdJQ0FnSUNBZ2FHVmhaR2x1WnpvZ0lDQWdJQ0JvWldGa2FXNW5YRzRnSUNBZ0lDQjlPMXh1WEc0Z0lDQWdJQ0JrWVhSaExuQjFjMmdvWEc0Z0lDQWdJQ0FnSUR4TWFYTjBVbTkzSUhzdUxpNXliM2RRY205d2MzMGdMejVjYmlBZ0lDQWdJQ2s3WEc1Y2JpQWdJQ0FnSUdsbUlDaGhZM1JwZG1VcElIdGNiaUFnSUNBZ0lDQWdZV04wYVhabFVISnZjSE1nUFNCN1hHNGdJQ0FnSUNBZ0lDQWdZMnhoYzNOT1lXMWxPaUFnYjJSa0xGeHVJQ0FnSUNBZ0lDQWdJRzF2WkdWc09pQWdJQ0FnSUcxdlpHVnNMRnh1SUNBZ0lDQWdJQ0FnSUhCeVpYWTZJQ0FnSUNBZ0lIQnlaWFlnSmlZZ2NISmxkaTVqYVdRc1hHNGdJQ0FnSUNBZ0lDQWdibVY0ZERvZ0lDQWdJQ0FnYm1WNGRDQW1KaUJ1WlhoMExtTnBaQ3hjYmlBZ0lDQWdJQ0FnSUNCemQybDBZMmhsY2pvZ0lDQjBhR2x6TGw5b1lXNWtiR1ZCYkdGeWJWTmxiR1ZqZEdsdmJpeGNiaUFnSUNBZ0lDQWdJQ0J6YVhwbFZHOW5aMnhsT2lCMGFHbHpMbDkwYjJkbmJHVk5hVzVwYldsNlpTeGNiaUFnSUNBZ0lDQWdJQ0JyWlhrNklDQWdJQ0FnSUNCdGIyUmxiQzVqYVdRZ0t5QW5MV0ZqZEdsMlpTY3NYRzRnSUNBZ0lDQWdJQ0FnY21WbU9pQWdJQ0FnSUNBZ0oyRmpkR2wyWlVGc1lYSnRKeXhjYmlBZ0lDQWdJQ0FnSUNCdGFXNXBiV2w2WldRNklDQjBhR2x6TG5OMFlYUmxMbTFwYm1sdGFYcGxaRnh1SUNBZ0lDQWdJQ0I5TzF4dVhHNGdJQ0FnSUNBZ0lHUmhkR0V1Y0hWemFDaGNiaUFnSUNBZ0lDQWdJQ0E4VW05M1JHVjBZV2xzY3lCN0xpNHVZV04wYVhabFVISnZjSE45UGx4dUlDQWdJQ0FnSUNBZ0lDQWdQRUZzWVhKdFNHbHpkRzl5ZVZacFpYY2dZMjlzYkdWamRHbHZiajE3Ym1WM0lFaHBjM1J2Y25sRGIyeHNaV04wYVc5dUtDbDlJQzgrWEc0Z0lDQWdJQ0FnSUNBZ1BDOVNiM2RFWlhSaGFXeHpQbHh1SUNBZ0lDQWdJQ0FwTzF4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCd2NtVjJJRDBnYlc5a1pXdzdYRzRnSUNBZ2ZTd2dkR2hwY3lrN1hHNWNiaUFnSUNCeVpYUjFjbTRnWkdGMFlUdGNiaUFnZlN4Y2JpQWdYMmhoYm1Sc1pVRnNZWEp0VTJWc1pXTjBhVzl1T2lCbWRXNWpkR2x2YmlBb1kybGtMQ0JwYm1OeVpXMWxiblFwSUh0Y2JpQWdJQ0IyWVhJZ1kzVnljbVZ1ZENBOUlIUm9hWE11YzNSaGRHVXVZV04wYVhabFFXeGhjbTA3WEc1Y2JpQWdJQ0JwWmlBb1kzVnljbVZ1ZENBOVBUMGdZMmxrS1NCN1hHNGdJQ0FnSUNCamFXUWdQU0J1ZFd4c08xeHVJQ0FnSUgxY2JseHVJQ0FnSUhSb2FYTXVjMlYwVTNSaGRHVW9lMXh1SUNBZ0lDQWdZV04wYVhabFFXeGhjbTA2SUdOcFpDeGNiaUFnSUNBZ0lHbHVZM0psYldWdWREb2dJR2x1WTNKbGJXVnVkQ0E5UFQwZ2RISjFaU3hjYmlBZ0lDQWdJSEJ5WlhacGIzVnpPaUFnSUdOcFpDQS9JR04xY25KbGJuUWdPaUJ1ZFd4c1hHNGdJQ0FnZlNrN1hHNGdJSDBzWEc1OUtUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JVWW05a2VWZHlZWEJ3WlhJN1hHNGlYWDA9IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBUaFdyYXBwZXI7XG52YXIgVGggICAgICAgICAgICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy90aC5qc3gnKTtcbnZhciBSZWFjdCAgICAgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEJhY2tib25lICAgICAgICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG5cblRoV3JhcHBlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUaFdyYXBwZXJcIixcbiAgcHJvcFR5cGVzOiB7XG4gICAgc3RvcmU6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEJhY2tib25lLk1vZGVsKS5pc1JlcXVpcmVkXG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnN0b3JlLnRvSlNPTigpO1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucHJvcHMuc3RvcmUub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChzdG9yZSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZShzdG9yZS50b0pTT04oKSk7XG4gICAgfSwgdGhpcyk7XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgc3RvcmUub2ZmKCdjaGFuZ2UnLCBudWxsLCB0aGlzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5ld19wcm9wcztcbiAgICB2YXIgZGF0YSAgICAgID0gdGhpcy5zdGF0ZTtcblxuICAgIG5ld19wcm9wcyA9IHtcbiAgICAgIHRyaWdnZXJTb3J0OiAgICBkYXRhLnNvcnRhYmxlICYmIGRhdGEubmFtZSA/IGRhdGEubmFtZSA6IG51bGwsXG4gICAgICBzb3J0RGlyZWN0aW9uOiAgZGF0YS5kaXJlY3Rpb24sXG4gICAgICBtaW5pbWFsOiAgICAgICAgZGF0YS5taW5pbWFsLFxuICAgICAgbG9ja2VkOiAgICAgICAgIGRhdGEubG9ja2VkLFxuICAgICAgcmVzaXphYmxlOiAgICAgIGRhdGEucmVzaXphYmxlLFxuICAgICAgd2lkdGg6ICAgICAgICAgIGRhdGEud2lkdGhcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGgsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgdGhpcy5wcm9wcywgIG5ld19wcm9wcyksIFxuICAgICAgICBkYXRhLnRpdGxlXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGhXcmFwcGVyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WVd4aGNtMXpMM1JvWDNkeVlYQndaWEl1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPenRCUVVWQkxFZEJRVWM3TzBGQlJVZ3NTVUZCU1N4VFFVRlRMRU5CUVVNN1FVRkRaQ3hKUVVGSkxFVkJRVVVzWjBKQlFXZENMRTlCUVU4c1EwRkJReXg1UWtGQmVVSXNRMEZCUXl4RFFVRkRPMEZCUTNwRUxFbEJRVWtzUzBGQlN5eGhRVUZoTEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVOMlF5eEpRVUZKTEZGQlFWRXNWVUZCVlN4UFFVRlBMRU5CUVVNc1ZVRkJWU3hEUVVGRExFTkJRVU03TzBGQlJURkRMQ3RDUVVFclFpeDVRa0ZCUVR0RlFVTTNRaXhUUVVGVExFVkJRVVU3U1VGRFZDeExRVUZMTEVWQlFVVXNTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhWUVVGVkxFTkJRVU1zVVVGQlVTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRlZCUVZVN1IwRkROMFE3UlVGRFJDeGxRVUZsTEVWQlFVVXNXVUZCV1R0SlFVTXpRaXhQUVVGUExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRE8wZEJRMnhETzBWQlEwUXNhVUpCUVdsQ0xFVkJRVVVzV1VGQldUdEpRVU0zUWl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eEZRVUZGTEVOQlFVTXNVVUZCVVN4RlFVRkZMRlZCUVZVc1MwRkJTeXhGUVVGRk8wMUJRemRETEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUlVGQlJTeERRVUZETEVOQlFVTTdTMEZETDBJc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dEhRVU5XTzBWQlEwUXNiMEpCUVc5Q0xFVkJRVVVzV1VGQldUdEpRVU5vUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExGRkJRVkVzUlVGQlJTeEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN1IwRkRha003UlVGRFJDeE5RVUZOTEVWQlFVVXNXVUZCV1R0SlFVTnNRaXhKUVVGSkxGTkJRVk1zUTBGQlF6dEJRVU5zUWl4SlFVRkpMRWxCUVVrc1NVRkJTU3hSUVVGUkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTTdPMGxCUlROQ0xGTkJRVk1zUjBGQlJ6dE5RVU5XTEZkQlFWY3NTMEZCU3l4SlFVRkpMRU5CUVVNc1VVRkJVU3hKUVVGSkxFbEJRVWtzUTBGQlF5eEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRMRWxCUVVrc1IwRkJSeXhKUVVGSk8wMUJRemRFTEdGQlFXRXNSMEZCUnl4SlFVRkpMRU5CUVVNc1UwRkJVenROUVVNNVFpeFBRVUZQTEZOQlFWTXNTVUZCU1N4RFFVRkRMRTlCUVU4N1RVRkROVUlzVFVGQlRTeFZRVUZWTEVsQlFVa3NRMEZCUXl4TlFVRk5PMDFCUXpOQ0xGTkJRVk1zVDBGQlR5eEpRVUZKTEVOQlFVTXNVMEZCVXp0TlFVTTVRaXhMUVVGTExGZEJRVmNzU1VGQlNTeERRVUZETEV0QlFVczdRVUZEYUVNc1MwRkJTeXhEUVVGRE96dEpRVVZHTzAxQlEwVXNiMEpCUVVNc1JVRkJSU3hGUVVGQkxHZENRVUZCTEVkQlFVRXNRMEZCUlN4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFVkJRVU1zUTBGQlJTeEhRVUZITEZOQlFWY3NRMEZCUVN4RlFVRkJPMUZCUTJoRExFbEJRVWtzUTBGQlF5eExRVUZOTzAxQlExUXNRMEZCUVR0TlFVTk1PMGRCUTBnN1FVRkRTQ3hEUVVGRExFTkJRVU1zUTBGQlF6czdRVUZGU0N4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExGTkJRVk1zUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dRR3B6ZUNCU1pXRmpkQzVFVDAxY2JpQXFMMXh1WEc1MllYSWdWR2hYY21Gd2NHVnlPMXh1ZG1GeUlGUm9JQ0FnSUNBZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHVMeTR1TDJOdmJYQnZibVZ1ZEhNdmRHZ3Vhbk40SnlrN1hHNTJZWElnVW1WaFkzUWdJQ0FnSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duY21WaFkzUW5LVHRjYm5aaGNpQkNZV05yWW05dVpTQWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDZGlZV05yWW05dVpTY3BPMXh1WEc1VWFGZHlZWEJ3WlhJZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUhCeWIzQlVlWEJsY3pvZ2UxeHVJQ0FnSUhOMGIzSmxPaUJTWldGamRDNVFjbTl3Vkhsd1pYTXVhVzV6ZEdGdVkyVlBaaWhDWVdOclltOXVaUzVOYjJSbGJDa3VhWE5TWlhGMWFYSmxaRnh1SUNCOUxGeHVJQ0JuWlhSSmJtbDBhV0ZzVTNSaGRHVTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1d2NtOXdjeTV6ZEc5eVpTNTBiMHBUVDA0b0tUdGNiaUFnZlN4Y2JpQWdZMjl0Y0c5dVpXNTBSR2xrVFc5MWJuUTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IwYUdsekxuQnliM0J6TG5OMGIzSmxMbTl1S0NkamFHRnVaMlVuTENCbWRXNWpkR2x2YmlBb2MzUnZjbVVwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVjMlYwVTNSaGRHVW9jM1J2Y21VdWRHOUtVMDlPS0NrcE8xeHVJQ0FnSUgwc0lIUm9hWE1wTzF4dUlDQjlMRnh1SUNCamIyMXdiMjVsYm5SWGFXeHNWVzV0YjNWdWREb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSE4wYjNKbExtOW1aaWduWTJoaGJtZGxKeXdnYm5Wc2JDd2dkR2hwY3lrN1hHNGdJSDBzWEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJ1WlhkZmNISnZjSE03WEc0Z0lDQWdkbUZ5SUdSaGRHRWdJQ0FnSUNBOUlIUm9hWE11YzNSaGRHVTdYRzVjYmlBZ0lDQnVaWGRmY0hKdmNITWdQU0I3WEc0Z0lDQWdJQ0IwY21sbloyVnlVMjl5ZERvZ0lDQWdaR0YwWVM1emIzSjBZV0pzWlNBbUppQmtZWFJoTG01aGJXVWdQeUJrWVhSaExtNWhiV1VnT2lCdWRXeHNMRnh1SUNBZ0lDQWdjMjl5ZEVScGNtVmpkR2x2YmpvZ0lHUmhkR0V1WkdseVpXTjBhVzl1TEZ4dUlDQWdJQ0FnYldsdWFXMWhiRG9nSUNBZ0lDQWdJR1JoZEdFdWJXbHVhVzFoYkN4Y2JpQWdJQ0FnSUd4dlkydGxaRG9nSUNBZ0lDQWdJQ0JrWVhSaExteHZZMnRsWkN4Y2JpQWdJQ0FnSUhKbGMybDZZV0pzWlRvZ0lDQWdJQ0JrWVhSaExuSmxjMmw2WVdKc1pTeGNiaUFnSUNBZ0lIZHBaSFJvT2lBZ0lDQWdJQ0FnSUNCa1lYUmhMbmRwWkhSb1hHNGdJQ0FnZlR0Y2JseHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4VkdnZ2V5NHVMblJvYVhNdWNISnZjSE45SUhzdUxpNXVaWGRmY0hKdmNITjlQbHh1SUNBZ0lDQWdJQ0I3WkdGMFlTNTBhWFJzWlgxY2JpQWdJQ0FnSUR3dlZHZytYRzRnSUNBZ0tUdGNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVkdoWGNtRndjR1Z5TzF4dUlsMTkiLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFRoZWFkO1xudmFyIFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgQmFja2JvbmUgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBUaCAgICAgICAgPSByZXF1aXJlKCcuL3RoX3dyYXBwZXIuanN4Jyk7XG5cblRoZWFkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRoZWFkXCIsXG4gIHByb3BUeXBlczoge1xuICAgIHN0b3JlOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihCYWNrYm9uZS5Nb2RlbCkuaXNSZXF1aXJlZFxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29scyA9IHRoaXMuX2J1aWxkQ29sdW1ucygpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aGVhZFwiLCB7Y2xhc3NOYW1lOiB0aGlzLnByb3BzLmNsYXNzTmFtZX0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgbnVsbCwgXG4gICAgICAgICAgY29sc1xuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgX2J1aWxkQ29sdW1uczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBkYXRhO1xuICAgIHZhciBjb2x1bW5zID0gW107XG4gICAgdmFyIHN0b3JlID0gdGhpcy5wcm9wcy5zdG9yZTtcbiAgICB2YXIgY3VycmVudCA9IHN0b3JlLmdldCgnZmlyc3QnKTtcblxuICAgIHdoaWxlIChjdXJyZW50KSB7XG4gICAgICBkYXRhICAgICAgICAgICAgICA9IHt9O1xuICAgICAgZGF0YS5oYW5kbGVDbGljayAgPSBjdXJyZW50LmdldCgnc29ydGFibGUnKSA/IHRoaXMuX3NvcnRIYW5kbGVyLmJpbmQodGhpcywgY3VycmVudCkgOiBudWxsO1xuICAgICAgZGF0YS5zdG9yZSAgICAgICAgPSBjdXJyZW50O1xuICAgICAgZGF0YS5jbGFzc05hbWUgICAgPSBjdXJyZW50LmdldCgndHlwZScpID09PSAnYWxhcm1fYWN0aW9ucycgPyAnYWN0aW9ucy1jb2wnIDogJyc7XG5cbiAgICAgIGNvbHVtbnMucHVzaChSZWFjdC5jcmVhdGVFbGVtZW50KFRoLCBSZWFjdC5fX3NwcmVhZCh7fSwgIGRhdGEsIHtrZXk6IGN1cnJlbnQuY2lkfSkpKTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbHVtbnM7XG4gIH0sXG4gIF9zb3J0SGFuZGxlcjogZnVuY3Rpb24gKHNvcnRlZSkge1xuICAgIHZhciBzdG9yZSAgID0gdGhpcy5wcm9wcy5zdG9yZTtcbiAgICB2YXIgY3VycmVudCA9IHN0b3JlLmdldCgnc29ydGVlJyk7XG5cbiAgICBpZiAoY3VycmVudC5jaWQgIT09IHNvcnRlZS5jaWQpIHtcbiAgICAgIGN1cnJlbnQuZW5kU29ydGluZygpO1xuICAgIH1cblxuICAgIHN0b3JlLnNldCgnc29ydGVlJywgc29ydGVlKTtcbiAgICBzb3J0ZWUudG9nZ2xlU29ydERpcmVjdGlvbigpO1xuXG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRoZWFkO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WVd4aGNtMXpMM1JvWldGa1gzZHlZWEJ3WlhJdWFuTjRJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCT3p0QlFVVkJMRWRCUVVjN08wRkJSVWdzU1VGQlNTeExRVUZMTEVOQlFVTTdRVUZEVml4SlFVRkpMRXRCUVVzc1QwRkJUeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdRVUZEYWtNc1NVRkJTU3hSUVVGUkxFbEJRVWtzVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPMEZCUTNCRExFbEJRVWtzUlVGQlJTeFZRVUZWTEU5QlFVOHNRMEZCUXl4clFrRkJhMElzUTBGQlF5eERRVUZET3p0QlFVVTFReXd5UWtGQk1rSXNjVUpCUVVFN1JVRkRla0lzVTBGQlV5eEZRVUZGTzBsQlExUXNTMEZCU3l4RlFVRkZMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zVlVGQlZTeERRVUZETEZGQlFWRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhWUVVGVk8wZEJRemRFTzBWQlEwUXNUVUZCVFN4RlFVRkZMRmxCUVZrN1FVRkRkRUlzU1VGQlNTeEpRVUZKTEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1lVRkJZU3hGUVVGRkxFTkJRVU03TzBsQlJXaERPMDFCUTBVc2IwSkJRVUVzVDBGQlRTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWY3NRMEZCUVN4RlFVRkJPMUZCUTNSRExHOUNRVUZCTEVsQlFVY3NSVUZCUVN4SlFVRkRMRVZCUVVFN1ZVRkRSQ3hKUVVGTE8xRkJRMGdzUTBGQlFUdE5RVU5ETEVOQlFVRTdUVUZEVWp0SFFVTklPMFZCUTBRc1lVRkJZU3hGUVVGRkxGbEJRVms3U1VGRGVrSXNTVUZCU1N4SlFVRkpMRU5CUVVNN1NVRkRWQ3hKUVVGSkxFOUJRVThzUjBGQlJ5eEZRVUZGTEVOQlFVTTdTVUZEYWtJc1NVRkJTU3hMUVVGTExFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNN1FVRkRha01zU1VGQlNTeEpRVUZKTEU5QlFVOHNSMEZCUnl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZET3p0SlFVVnFReXhQUVVGUExFOUJRVThzUlVGQlJUdE5RVU5rTEVsQlFVa3NaMEpCUVdkQ0xFVkJRVVVzUTBGQlF6dE5RVU4yUWl4SlFVRkpMRU5CUVVNc1YwRkJWeXhKUVVGSkxFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCVlN4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRTlCUVU4c1EwRkJReXhIUVVGSExFbEJRVWtzUTBGQlF6dE5RVU16Uml4SlFVRkpMRU5CUVVNc1MwRkJTeXhWUVVGVkxFOUJRVThzUTBGQlF6dEJRVU5zUXl4TlFVRk5MRWxCUVVrc1EwRkJReXhUUVVGVExFMUJRVTBzVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhsUVVGbExFZEJRVWNzWVVGQllTeEhRVUZITEVWQlFVVXNRMEZCUXpzN1RVRkZha1lzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4dlFrRkJReXhGUVVGRkxFVkJRVUVzWjBKQlFVRXNSMEZCUVN4RFFVRkZMRWRCUVVjc1NVRkJTU3hGUVVGRExFTkJRVU1zUTBGQlFTeEhRVUZCTEVWQlFVY3NRMEZCUlN4UFFVRlBMRU5CUVVNc1IwRkJTU3hEUVVGQkxFTkJRVUVzUTBGQlJ5eERRVUZCTEVOQlFVTXNRMEZCUXp0TlFVTnFSQ3hQUVVGUExFZEJRVWNzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXp0QlFVTTNRaXhMUVVGTE96dEpRVVZFTEU5QlFVOHNUMEZCVHl4RFFVRkRPMGRCUTJoQ08wVkJRMFFzV1VGQldTeEZRVUZGTEZWQlFWVXNUVUZCVFN4RlFVRkZPMGxCUXpsQ0xFbEJRVWtzUzBGQlN5eExRVUZMTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRE8wRkJRMjVETEVsQlFVa3NTVUZCU1N4UFFVRlBMRWRCUVVjc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXpzN1NVRkZiRU1zU1VGQlNTeFBRVUZQTEVOQlFVTXNSMEZCUnl4TFFVRkxMRTFCUVUwc1EwRkJReXhIUVVGSExFVkJRVVU3VFVGRE9VSXNUMEZCVHl4RFFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRE8wRkJRek5DTEV0QlFVczdPMGxCUlVRc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eFJRVUZSTEVWQlFVVXNUVUZCVFN4RFFVRkRMRU5CUVVNN1FVRkRhRU1zU1VGQlNTeE5RVUZOTEVOQlFVTXNiVUpCUVcxQ0xFVkJRVVVzUTBGQlF6czdSMEZGT1VJN1FVRkRTQ3hEUVVGRExFTkJRVU1zUTBGQlF6czdRVUZGU0N4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExFdEJRVXNzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dRR3B6ZUNCU1pXRmpkQzVFVDAxY2JpQXFMMXh1WEc1MllYSWdWR2hsWVdRN1hHNTJZWElnVW1WaFkzUWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbmNtVmhZM1FuS1R0Y2JuWmhjaUJDWVdOclltOXVaU0FnUFNCeVpYRjFhWEpsS0NkaVlXTnJZbTl1WlNjcE8xeHVkbUZ5SUZSb0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHZkR2hmZDNKaGNIQmxjaTVxYzNnbktUdGNibHh1VkdobFlXUWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lIQnliM0JVZVhCbGN6b2dlMXh1SUNBZ0lITjBiM0psT2lCU1pXRmpkQzVRY205d1ZIbHdaWE11YVc1emRHRnVZMlZQWmloQ1lXTnJZbTl1WlM1TmIyUmxiQ2t1YVhOU1pYRjFhWEpsWkZ4dUlDQjlMRnh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMllYSWdZMjlzY3lBOUlIUm9hWE11WDJKMWFXeGtRMjlzZFcxdWN5Z3BPMXh1WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeDBhR1ZoWkNCamJHRnpjMDVoYldVOWUzUm9hWE11Y0hKdmNITXVZMnhoYzNOT1lXMWxmVDVjYmlBZ0lDQWdJQ0FnUEhSeVBseHVJQ0FnSUNBZ0lDQWdJSHRqYjJ4emZWeHVJQ0FnSUNBZ0lDQThMM1J5UGx4dUlDQWdJQ0FnUEM5MGFHVmhaRDVjYmlBZ0lDQXBPMXh1SUNCOUxGeHVJQ0JmWW5WcGJHUkRiMngxYlc1ek9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkbUZ5SUdSaGRHRTdYRzRnSUNBZ2RtRnlJR052YkhWdGJuTWdQU0JiWFR0Y2JpQWdJQ0IyWVhJZ2MzUnZjbVVnUFNCMGFHbHpMbkJ5YjNCekxuTjBiM0psTzF4dUlDQWdJSFpoY2lCamRYSnlaVzUwSUQwZ2MzUnZjbVV1WjJWMEtDZG1hWEp6ZENjcE8xeHVYRzRnSUNBZ2QyaHBiR1VnS0dOMWNuSmxiblFwSUh0Y2JpQWdJQ0FnSUdSaGRHRWdJQ0FnSUNBZ0lDQWdJQ0FnSUQwZ2UzMDdYRzRnSUNBZ0lDQmtZWFJoTG1oaGJtUnNaVU5zYVdOcklDQTlJR04xY25KbGJuUXVaMlYwS0NkemIzSjBZV0pzWlNjcElEOGdkR2hwY3k1ZmMyOXlkRWhoYm1Sc1pYSXVZbWx1WkNoMGFHbHpMQ0JqZFhKeVpXNTBLU0E2SUc1MWJHdzdYRzRnSUNBZ0lDQmtZWFJoTG5OMGIzSmxJQ0FnSUNBZ0lDQTlJR04xY25KbGJuUTdYRzRnSUNBZ0lDQmtZWFJoTG1Oc1lYTnpUbUZ0WlNBZ0lDQTlJR04xY25KbGJuUXVaMlYwS0NkMGVYQmxKeWtnUFQwOUlDZGhiR0Z5YlY5aFkzUnBiMjV6SnlBL0lDZGhZM1JwYjI1ekxXTnZiQ2NnT2lBbkp6dGNibHh1SUNBZ0lDQWdZMjlzZFcxdWN5NXdkWE5vS0R4VWFDQjdMaTR1WkdGMFlYMGdhMlY1UFh0amRYSnlaVzUwTG1OcFpIMGdMejRwTzF4dUlDQWdJQ0FnWTNWeWNtVnVkQ0E5SUdOMWNuSmxiblF1Ym1WNGREdGNiaUFnSUNCOVhHNWNiaUFnSUNCeVpYUjFjbTRnWTI5c2RXMXVjenRjYmlBZ2ZTeGNiaUFnWDNOdmNuUklZVzVrYkdWeU9pQm1kVzVqZEdsdmJpQW9jMjl5ZEdWbEtTQjdYRzRnSUNBZ2RtRnlJSE4wYjNKbElDQWdQU0IwYUdsekxuQnliM0J6TG5OMGIzSmxPMXh1SUNBZ0lIWmhjaUJqZFhKeVpXNTBJRDBnYzNSdmNtVXVaMlYwS0NkemIzSjBaV1VuS1R0Y2JseHVJQ0FnSUdsbUlDaGpkWEp5Wlc1MExtTnBaQ0FoUFQwZ2MyOXlkR1ZsTG1OcFpDa2dlMXh1SUNBZ0lDQWdZM1Z5Y21WdWRDNWxibVJUYjNKMGFXNW5LQ2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdjM1J2Y21VdWMyVjBLQ2R6YjNKMFpXVW5MQ0J6YjNKMFpXVXBPMXh1SUNBZ0lITnZjblJsWlM1MGIyZG5iR1ZUYjNKMFJHbHlaV04wYVc5dUtDazdYRzVjYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1ZHaGxZV1E3WEc0aVhYMD0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIEJ1dHRvbiAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvYnV0dG9uLmpzeCcpO1xudmFyIEljb24gICAgICA9IHJlcXVpcmUoJy4vaWNvbl93cmFwcGVyLmpzeCcpO1xudmFyIG1vbWVudCAgICA9IHJlcXVpcmUoJ21vbWVudCcpO1xudmFyIFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzJyk7XG5cbi8qKlxuICogRWFjaCB0cmFuc2Zvcm1lciBzaG91bGQgdGFrZSBjYXNlIGFuZCBhdHRyX25hbWUgcGFyYW1zXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhbGFybV9kZXRhaWxzOiBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICB2YXIgY29kZSAgICA9IG1vZGVsLmdldCgnY29kZScpO1xuICAgIHZhciBtZXNzYWdlID0gbW9kZWwuZ2V0KCdtZXNzYWdlJyk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgICAgY29kZSwgXCIgLSBcIiwgbWVzc2FnZVxuICAgICAgKVxuICAgIClcbiAgfSxcbiAgc3RhdHVzOiBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICB2YXIgdmFsdWVzID0gWydhbGFybSddO1xuICAgIHZhciBjaGVja3MgPSBbJ2Fja25vd2xlZGdlZCcsICdjcml0aWNhbCcsICdub3JtYWwnXTtcblxuICAgIGlmIChtb2RlbC5nZXQoJ2NsZWFyZWQnKSkge1xuICAgICAgdmFsdWVzLnB1c2goJ2NsZWFyZWQnKTtcblxuICAgICAgY2hlY2tzID0gW107XG4gICAgfVxuXG4gICAgY2hlY2tzLmZvckVhY2goZnVuY3Rpb24gKGxhYmVsKSB7XG4gICAgICBpZiAobW9kZWwuZ2V0KGxhYmVsKSkge1xuICAgICAgICB2YWx1ZXMucHVzaChsYWJlbCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IHZhbHVlcy5qb2luKCctJyl9KSk7XG4gIH0sXG4gIHdlbGw6IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgIHZhciB3ZWxsID0gbW9kZWwuZ2V0KCd3ZWxsJyk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCB3ZWxsLm5hbWUpLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm11dGVkIHNtYWxsXCJ9LCBcIldlbGwgc3RhdHVzOiBcIiwgd2VsbC5zdGF0dXMpXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgZGF0ZTogZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgdmFyIGNyZWF0ZWQgICA9IG1vbWVudChtb2RlbC5nZXQoJ2NyZWF0ZWRfZGF0ZScpKS5mb3JtYXQoY29uc3RhbnRzLkRBVEVfRk9STUFUKTtcblxuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBjcmVhdGVkKSk7XG4gIH0sXG4gIGNhc2VzOiBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICB2YXIgY29udGVudDtcbiAgICB2YXIgYnV0dG9uX3RleHQgPSAnQ3JlYXRlJztcbiAgICB2YXIgbGVuZ3RoICAgICAgPSBtb2RlbC5nZXQoJ2Nhc2VzJykubGVuZ3RoO1xuXG4gICAgY29udGVudCA9IChSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwge2ljb246IFwicGx1c1wiLCB0ZXh0OiBidXR0b25fdGV4dCwgY2xhc3NOYW1lOiBcImJsb2NrXCJ9KSk7XG5cbiAgICBpZiAobGVuZ3RoKSB7XG4gICAgICBidXR0b25fdGV4dCA9IFsnVmlldyAnLCAnKCcsIGxlbmd0aCwgJyknXS5qb2luKCcnKTtcbiAgICAgIGNvbnRlbnQgPSAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJidXR0b24tZ3JvdXAgcGlwZWRcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7ZmVhdXg6IHRydWUsIGljb246IFwicGx1c1wifSksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7ZmVhdXg6IHRydWUsIHRleHQ6IGJ1dHRvbl90ZXh0fSlcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgICAgY29udGVudFxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIGFsYXJtX2FjdGlvbnM6IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgIHZhciBidXR0b25Qcm9wcztcbiAgICB2YXIgYnV0dG9uID0gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwibm9kYXRhXCJ9LCBcIk5vbmUgYXZhaWxhYmxlXCIpKTtcblxuICAgIGlmIChtb2RlbC5nZXQoJ2NsZWFyZWQnKSkge1xuICAgICAgcmV0dXJuIGJ1dHRvbjtcbiAgICB9XG5cbiAgICBidXR0b25Qcm9wcyA9IHtcbiAgICAgIHRleHQ6ICAgICAnQWNrbm93bGVkZ2UnLFxuICAgICAgaWNvbjogICAgICdiZWxsLXNsYXNoJyxcbiAgICAgIG9uQ2xpY2s6ICB0aGlzLmFja25vd2xlZGdlQWxhcm1cbiAgICB9O1xuXG4gICAgaWYgKG1vZGVsLmdldCgnYWNrbm93bGVkZ2VkJykpIHtcbiAgICAgIGJ1dHRvblByb3BzID0ge1xuICAgICAgICB0ZXh0OiAgICAgJ0NsZWFyJyxcbiAgICAgICAgaWNvbjogICAgICdjaGVjaycsXG4gICAgICAgIG9uQ2xpY2s6ICB0aGlzLmNsZWFyQWxhcm1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJidXR0b24tZ3JvdXAgYnV0dG9uLWRyb3BcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwge2ljb246IFwiY2FyZXQtZG93blwifSksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgUmVhY3QuX19zcHJlYWQoe30sICBidXR0b25Qcm9wcykpXG4gICAgICApXG4gICAgKTtcbiAgfVxufTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdllXeGhjbTF6TDNSeVlXNXpabTl5YldWeWN5NXFjM2dpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN08wRkJSVUVzUjBGQlJ6czdRVUZGU0N4SlFVRkpMRTFCUVUwc1RVRkJUU3hQUVVGUExFTkJRVU1zTmtKQlFUWkNMRU5CUVVNc1EwRkJRenRCUVVOMlJDeEpRVUZKTEVsQlFVa3NVVUZCVVN4UFFVRlBMRU5CUVVNc2IwSkJRVzlDTEVOQlFVTXNRMEZCUXp0QlFVTTVReXhKUVVGSkxFMUJRVTBzVFVGQlRTeFBRVUZQTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1FVRkRiRU1zU1VGQlNTeExRVUZMTEU5QlFVOHNUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8wRkJRMnBETEVsQlFVa3NVMEZCVXl4SFFVRkhMRTlCUVU4c1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4RFFVRkRPenRCUVVVelF6czdSMEZGUnp0QlFVTklMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWM3UlVGRFppeGhRVUZoTEVWQlFVVXNWVUZCVlN4TFFVRkxMRVZCUVVVN1NVRkRPVUlzU1VGQlNTeEpRVUZKTEUxQlFVMHNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dEJRVU53UXl4SlFVRkpMRWxCUVVrc1QwRkJUeXhIUVVGSExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN08wbEJSVzVETzAxQlEwVXNiMEpCUVVFc1MwRkJTU3hGUVVGQkxFbEJRVU1zUlVGQlFUdFJRVU5HTEVsQlFVa3NSVUZCUXl4TFFVRkJMRVZCUVVrc1QwRkJVVHROUVVOa0xFTkJRVUU3UzBGRFVEdEhRVU5HTzBWQlEwUXNUVUZCVFN4RlFVRkZMRlZCUVZVc1MwRkJTeXhGUVVGRk8wbEJRM1pDTEVsQlFVa3NUVUZCVFN4SFFVRkhMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRE0wSXNTVUZCU1N4SlFVRkpMRTFCUVUwc1IwRkJSeXhEUVVGRExHTkJRV01zUlVGQlJTeFZRVUZWTEVWQlFVVXNVVUZCVVN4RFFVRkRMRU5CUVVNN08wbEJSWEJFTEVsQlFVa3NTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhUUVVGVExFTkJRVU1zUlVGQlJUdEJRVU01UWl4TlFVRk5MRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdPMDFCUlhaQ0xFMUJRVTBzUjBGQlJ5eEZRVUZGTEVOQlFVTTdRVUZEYkVJc1MwRkJTenM3U1VGRlJDeE5RVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRMRlZCUVZVc1MwRkJTeXhGUVVGRk8wMUJRemxDTEVsQlFVa3NTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhMUVVGTExFTkJRVU1zUlVGQlJUdFJRVU53UWl4TlFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzA5QlEzQkNPMEZCUTFBc1MwRkJTeXhEUVVGRExFTkJRVU03TzBsQlJVZ3NVVUZCVVN4dlFrRkJReXhKUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEVsQlFVRXNSVUZCU1N4RFFVRkZMRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZGTEVOQlFVRXNRMEZCUnl4RFFVRkJMRVZCUVVVN1IwRkRNME03UlVGRFJDeEpRVUZKTEVWQlFVVXNWVUZCVlN4TFFVRkxMRVZCUVVVN1FVRkRla0lzU1VGQlNTeEpRVUZKTEVsQlFVa3NSMEZCUnl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZET3p0SlFVVTNRanROUVVORkxHOUNRVUZCTEV0QlFVa3NSVUZCUVN4SlFVRkRMRVZCUVVFN1VVRkRTQ3h2UWtGQlFTeExRVUZKTEVWQlFVRXNTVUZCUXl4RlFVRkRMRWxCUVVrc1EwRkJReXhKUVVGWExFTkJRVUVzUlVGQlFUdFJRVU4wUWl4dlFrRkJRU3hMUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMR0ZCUVdNc1EwRkJRU3hGUVVGQkxHVkJRVUVzUlVGQll5eEpRVUZKTEVOQlFVTXNUVUZCWVN4RFFVRkJPMDFCUTNwRUxFTkJRVUU3VFVGRFRqdEhRVU5JTzBWQlEwUXNTVUZCU1N4RlFVRkZMRlZCUVZVc1MwRkJTeXhGUVVGRk8wRkJRM3BDTEVsQlFVa3NTVUZCU1N4UFFVRlBMRXRCUVVzc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zVTBGQlV5eERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRPenRKUVVWb1JpeFJRVUZSTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hKUVVGRExFVkJRVU1zVDBGQll5eERRVUZCTEVWQlFVVTdSMEZETDBJN1JVRkRSQ3hMUVVGTExFVkJRVVVzVlVGQlZTeExRVUZMTEVWQlFVVTdTVUZEZEVJc1NVRkJTU3hQUVVGUExFTkJRVU03U1VGRFdpeEpRVUZKTEZkQlFWY3NSMEZCUnl4UlFVRlJMRU5CUVVNN1FVRkRMMElzU1VGQlNTeEpRVUZKTEUxQlFVMHNVVUZCVVN4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETEUxQlFVMHNRMEZCUXpzN1FVRkZhRVFzU1VGQlNTeFBRVUZQTEVsQlFVa3NiMEpCUVVNc1RVRkJUU3hGUVVGQkxFTkJRVUVzUTBGQlF5eEpRVUZCTEVWQlFVa3NRMEZCUXl4TlFVRkJMRVZCUVUwc1EwRkJReXhKUVVGQkxFVkJRVWtzUTBGQlJTeFhRVUZYTEVWQlFVTXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhQUVVGUExFTkJRVUVzUTBGQlJ5eERRVUZCTEVOQlFVTXNRMEZCUXpzN1NVRkZlRVVzU1VGQlNTeE5RVUZOTEVWQlFVVTdUVUZEVml4WFFVRlhMRWRCUVVjc1EwRkJReXhQUVVGUExFVkJRVVVzUjBGQlJ5eEZRVUZGTEUxQlFVMHNSVUZCUlN4SFFVRkhMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zUlVGQlJTeERRVUZETEVOQlFVTTdUVUZEYmtRc1QwRkJUenRSUVVOTUxHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zYjBKQlFYRkNMRU5CUVVFc1JVRkJRVHRWUVVOc1F5eHZRa0ZCUXl4TlFVRk5MRVZCUVVFc1EwRkJRU3hEUVVGRExFdEJRVUVzUlVGQlN5eERRVUZGTEVsQlFVa3NSVUZCUXl4RFFVRkRMRWxCUVVFc1JVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlFTeERRVUZITEVOQlFVRXNSVUZCUVR0VlFVTnVReXh2UWtGQlF5eE5RVUZOTEVWQlFVRXNRMEZCUVN4RFFVRkRMRXRCUVVFc1JVRkJTeXhEUVVGRkxFbEJRVWtzUlVGQlF5eERRVUZETEVsQlFVRXNSVUZCU1N4RFFVRkZMRmRCUVZrc1EwRkJRU3hEUVVGSExFTkJRVUU3VVVGRGRFTXNRMEZCUVR0UFFVTlFMRU5CUVVNN1FVRkRVaXhMUVVGTE96dEpRVVZFTzAxQlEwVXNiMEpCUVVFc1MwRkJTU3hGUVVGQkxFbEJRVU1zUlVGQlFUdFJRVU5HTEU5QlFWRTdUVUZEVEN4RFFVRkJPMDFCUTA0N1IwRkRTRHRGUVVORUxHRkJRV0VzUlVGQlJTeFZRVUZWTEV0QlFVc3NSVUZCUlR0SlFVTTVRaXhKUVVGSkxGZEJRVmNzUTBGQlF6dEJRVU53UWl4SlFVRkpMRWxCUVVrc1RVRkJUU3hKUVVGSkxHOUNRVUZCTEUxQlFVc3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zVVVGQlV5eERRVUZCTEVWQlFVRXNaMEpCUVhGQ0xFTkJRVUVzUTBGQlF5eERRVUZET3p0SlFVVTVSQ3hKUVVGSkxFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNVMEZCVXl4RFFVRkRMRVZCUVVVN1RVRkRlRUlzVDBGQlR5eE5RVUZOTEVOQlFVTTdRVUZEY0VJc1MwRkJTenM3U1VGRlJDeFhRVUZYTEVkQlFVYzdUVUZEV2l4SlFVRkpMRTFCUVUwc1lVRkJZVHROUVVOMlFpeEpRVUZKTEUxQlFVMHNXVUZCV1R0TlFVTjBRaXhQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETEdkQ1FVRm5RanRCUVVOeVF5eExRVUZMTEVOQlFVTTdPMGxCUlVZc1NVRkJTU3hMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEdOQlFXTXNRMEZCUXl4RlFVRkZPMDFCUXpkQ0xGZEJRVmNzUjBGQlJ6dFJRVU5hTEVsQlFVa3NUVUZCVFN4UFFVRlBPMUZCUTJwQ0xFbEJRVWtzVFVGQlRTeFBRVUZQTzFGQlEycENMRTlCUVU4c1IwRkJSeXhKUVVGSkxFTkJRVU1zVlVGQlZUdFBRVU14UWl4RFFVRkRPMEZCUTFJc1MwRkJTenM3U1VGRlJEdE5RVU5GTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNNRUpCUVRKQ0xFTkJRVUVzUlVGQlFUdFJRVU40UXl4dlFrRkJReXhOUVVGTkxFVkJRVUVzUTBGQlFTeERRVUZETEVsQlFVRXNSVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJRU3hEUVVGSExFTkJRVUVzUlVGQlFUdFJRVU0xUWl4dlFrRkJReXhOUVVGTkxFVkJRVUVzWjBKQlFVRXNSMEZCUVN4RFFVRkZMRWRCUVVjc1YwRkJXU3hEUVVGQkxFTkJRVWNzUTBGQlFUdE5RVU4yUWl4RFFVRkJPMDFCUTA0N1IwRkRTRHREUVVOR0xFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUVKMWRIUnZiaUFnSUNBOUlISmxjWFZwY21Vb0p5NHVMeTR1TDJOdmJYQnZibVZ1ZEhNdlluVjBkRzl1TG1wemVDY3BPMXh1ZG1GeUlFbGpiMjRnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR2YVdOdmJsOTNjbUZ3Y0dWeUxtcHplQ2NwTzF4dWRtRnlJRzF2YldWdWRDQWdJQ0E5SUhKbGNYVnBjbVVvSjIxdmJXVnVkQ2NwTzF4dWRtRnlJRkpsWVdOMElDQWdJQ0E5SUhKbGNYVnBjbVVvSjNKbFlXTjBKeWs3WEc1MllYSWdZMjl1YzNSaGJuUnpJRDBnY21WeGRXbHlaU2duTGk0dkxpNHZZMjl1YzNSaGJuUnpKeWs3WEc1Y2JpOHFLbHh1SUNvZ1JXRmphQ0IwY21GdWMyWnZjbTFsY2lCemFHOTFiR1FnZEdGclpTQmpZWE5sSUdGdVpDQmhkSFJ5WDI1aGJXVWdjR0Z5WVcxelhHNGdLaTljYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnZTF4dUlDQmhiR0Z5YlY5a1pYUmhhV3h6T2lCbWRXNWpkR2x2YmlBb2JXOWtaV3dwSUh0Y2JpQWdJQ0IyWVhJZ1kyOWtaU0FnSUNBOUlHMXZaR1ZzTG1kbGRDZ25ZMjlrWlNjcE8xeHVJQ0FnSUhaaGNpQnRaWE56WVdkbElEMGdiVzlrWld3dVoyVjBLQ2R0WlhOellXZGxKeWs3WEc1Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQR1JwZGo1Y2JpQWdJQ0FnSUNBZ2UyTnZaR1Y5SUMwZ2UyMWxjM05oWjJWOVhHNGdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQXBYRzRnSUgwc1hHNGdJSE4wWVhSMWN6b2dablZ1WTNScGIyNGdLRzF2WkdWc0tTQjdYRzRnSUNBZ2RtRnlJSFpoYkhWbGN5QTlJRnNuWVd4aGNtMG5YVHRjYmlBZ0lDQjJZWElnWTJobFkydHpJRDBnV3lkaFkydHViM2RzWldSblpXUW5MQ0FuWTNKcGRHbGpZV3duTENBbmJtOXliV0ZzSjEwN1hHNWNiaUFnSUNCcFppQW9iVzlrWld3dVoyVjBLQ2RqYkdWaGNtVmtKeWtwSUh0Y2JpQWdJQ0FnSUhaaGJIVmxjeTV3ZFhOb0tDZGpiR1ZoY21Wa0p5azdYRzVjYmlBZ0lDQWdJR05vWldOcmN5QTlJRnRkTzF4dUlDQWdJSDFjYmx4dUlDQWdJR05vWldOcmN5NW1iM0pGWVdOb0tHWjFibU4wYVc5dUlDaHNZV0psYkNrZ2UxeHVJQ0FnSUNBZ2FXWWdLRzF2WkdWc0xtZGxkQ2hzWVdKbGJDa3BJSHRjYmlBZ0lDQWdJQ0FnZG1Gc2RXVnpMbkIxYzJnb2JHRmlaV3dwTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDBwTzF4dVhHNGdJQ0FnY21WMGRYSnVJQ2c4U1dOdmJpQjBlWEJsUFh0MllXeDFaWE11YW05cGJpZ25MU2NwZlNBdlBpazdYRzRnSUgwc1hHNGdJSGRsYkd3NklHWjFibU4wYVc5dUlDaHRiMlJsYkNrZ2UxeHVJQ0FnSUhaaGNpQjNaV3hzSUQwZ2JXOWtaV3d1WjJWMEtDZDNaV3hzSnlrN1hHNWNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEdScGRqNWNiaUFnSUNBZ0lDQWdQR1JwZGo1N2QyVnNiQzV1WVcxbGZUd3ZaR2wyUGx4dUlDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW0xMWRHVmtJSE50WVd4c1hDSStWMlZzYkNCemRHRjBkWE02SUh0M1pXeHNMbk4wWVhSMWMzMDhMMlJwZGo1Y2JpQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDazdYRzRnSUgwc1hHNGdJR1JoZEdVNklHWjFibU4wYVc5dUlDaHRiMlJsYkNrZ2UxeHVJQ0FnSUhaaGNpQmpjbVZoZEdWa0lDQWdQU0J0YjIxbGJuUW9iVzlrWld3dVoyVjBLQ2RqY21WaGRHVmtYMlJoZEdVbktTa3VabTl5YldGMEtHTnZibk4wWVc1MGN5NUVRVlJGWDBaUFVrMUJWQ2s3WEc1Y2JpQWdJQ0J5WlhSMWNtNGdLRHhrYVhZK2UyTnlaV0YwWldSOVBDOWthWFkrS1R0Y2JpQWdmU3hjYmlBZ1kyRnpaWE02SUdaMWJtTjBhVzl1SUNodGIyUmxiQ2tnZTF4dUlDQWdJSFpoY2lCamIyNTBaVzUwTzF4dUlDQWdJSFpoY2lCaWRYUjBiMjVmZEdWNGRDQTlJQ2REY21WaGRHVW5PMXh1SUNBZ0lIWmhjaUJzWlc1bmRHZ2dJQ0FnSUNBOUlHMXZaR1ZzTG1kbGRDZ25ZMkZ6WlhNbktTNXNaVzVuZEdnN1hHNWNiaUFnSUNCamIyNTBaVzUwSUQwZ0tEeENkWFIwYjI0Z2FXTnZiajFjSW5Cc2RYTmNJaUIwWlhoMFBYdGlkWFIwYjI1ZmRHVjRkSDBnWTJ4aGMzTk9ZVzFsUFZ3aVlteHZZMnRjSWlBdlBpazdYRzVjYmlBZ0lDQnBaaUFvYkdWdVozUm9LU0I3WEc0Z0lDQWdJQ0JpZFhSMGIyNWZkR1Y0ZENBOUlGc25WbWxsZHlBbkxDQW5LQ2NzSUd4bGJtZDBhQ3dnSnlrblhTNXFiMmx1S0NjbktUdGNiaUFnSUNBZ0lHTnZiblJsYm5RZ1BTQW9YRzRnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2lZblYwZEc5dUxXZHliM1Z3SUhCcGNHVmtYQ0krWEc0Z0lDQWdJQ0FnSUNBZ1BFSjFkSFJ2YmlCbVpXRjFlRDE3ZEhKMVpYMGdhV052YmoxY0luQnNkWE5jSWlBdlBseHVJQ0FnSUNBZ0lDQWdJRHhDZFhSMGIyNGdabVZoZFhnOWUzUnlkV1Y5SUhSbGVIUTllMkoxZEhSdmJsOTBaWGgwZlNBdlBseHVJQ0FnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FnSUNrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHhrYVhZK1hHNGdJQ0FnSUNBZ0lIdGpiMjUwWlc1MGZWeHVJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdLVHRjYmlBZ2ZTeGNiaUFnWVd4aGNtMWZZV04wYVc5dWN6b2dablZ1WTNScGIyNGdLRzF2WkdWc0tTQjdYRzRnSUNBZ2RtRnlJR0oxZEhSdmJsQnliM0J6TzF4dUlDQWdJSFpoY2lCaWRYUjBiMjRnUFNBb1BITndZVzRnWTJ4aGMzTk9ZVzFsUFZ3aWJtOWtZWFJoWENJK1RtOXVaU0JoZG1GcGJHRmliR1U4TDNOd1lXNCtLVHRjYmx4dUlDQWdJR2xtSUNodGIyUmxiQzVuWlhRb0oyTnNaV0Z5WldRbktTa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHSjFkSFJ2Ymp0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JpZFhSMGIyNVFjbTl3Y3lBOUlIdGNiaUFnSUNBZ0lIUmxlSFE2SUNBZ0lDQW5RV05yYm05M2JHVmtaMlVuTEZ4dUlDQWdJQ0FnYVdOdmJqb2dJQ0FnSUNkaVpXeHNMWE5zWVhOb0p5eGNiaUFnSUNBZ0lHOXVRMnhwWTJzNklDQjBhR2x6TG1GamEyNXZkMnhsWkdkbFFXeGhjbTFjYmlBZ0lDQjlPMXh1WEc0Z0lDQWdhV1lnS0cxdlpHVnNMbWRsZENnbllXTnJibTkzYkdWa1oyVmtKeWtwSUh0Y2JpQWdJQ0FnSUdKMWRIUnZibEJ5YjNCeklEMGdlMXh1SUNBZ0lDQWdJQ0IwWlhoME9pQWdJQ0FnSjBOc1pXRnlKeXhjYmlBZ0lDQWdJQ0FnYVdOdmJqb2dJQ0FnSUNkamFHVmpheWNzWEc0Z0lDQWdJQ0FnSUc5dVEyeHBZMnM2SUNCMGFHbHpMbU5zWldGeVFXeGhjbTFjYmlBZ0lDQWdJSDA3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aVluVjBkRzl1TFdkeWIzVndJR0oxZEhSdmJpMWtjbTl3WENJK1hHNGdJQ0FnSUNBZ0lEeENkWFIwYjI0Z2FXTnZiajFjSW1OaGNtVjBMV1J2ZDI1Y0lpQXZQbHh1SUNBZ0lDQWdJQ0E4UW5WMGRHOXVJSHN1TGk1aWRYUjBiMjVRY205d2MzMGdMejVjYmlBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNrN1hHNGdJSDFjYm4wN1hHNGlYWDA9IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIFNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM0NDYxNzAvZXNjYXBlLXN0cmluZy1mb3ItdXNlLWluLWphdmFzY3JpcHQtcmVnZXhcblxudmFyIHNwZWNpYWxzO1xudmFyIHJlZ2V4O1xuXG5zcGVjaWFscyA9IFtcbiAgLy8gb3JkZXIgbWF0dGVycyBmb3IgdGhlc2VcbiAgICAnLSdcbiAgLCAnWydcbiAgLCAnXSdcbiAgLy8gb3JkZXIgZG9lc24ndCBtYXR0ZXIgZm9yIGFueSBvZiB0aGVzZVxuICAsICcvJ1xuICAsICd7J1xuICAsICd9J1xuICAsICcoJ1xuICAsICcpJ1xuICAsICcqJ1xuICAsICcrJ1xuICAsICc/J1xuICAsICcuJ1xuICAsICdcXFxcJ1xuICAsICdeJ1xuICAsICckJ1xuICAsICd8J1xuXTtcblxucmVnZXggPSBuZXcgUmVnRXhwKCdbJyArIHNwZWNpYWxzLmpvaW4oJ1xcXFwnKSArICddJywgJ2cnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShyZWdleCwgJ1xcXFwkJicpO1xufTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwzVjBhV3h6TDJWelkyRndaVjl5WldkbGVDNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4WlFVRlpMRU5CUVVNN08wRkJSV0lzTWtaQlFUSkdPenRCUVVVelJpeEpRVUZKTEZGQlFWRXNRMEZCUXp0QlFVTmlMRWxCUVVrc1MwRkJTeXhEUVVGRE96dEJRVVZXTEZGQlFWRXNSMEZCUnpzN1NVRkZVQ3hIUVVGSE8wbEJRMGdzUjBGQlJ6dEJRVU5RTEVsQlFVa3NSMEZCUnpzN1NVRkZTQ3hIUVVGSE8wbEJRMGdzUjBGQlJ6dEpRVU5JTEVkQlFVYzdTVUZEU0N4SFFVRkhPMGxCUTBnc1IwRkJSenRKUVVOSUxFZEJRVWM3U1VGRFNDeEhRVUZITzBsQlEwZ3NSMEZCUnp0SlFVTklMRWRCUVVjN1NVRkRTQ3hKUVVGSk8wbEJRMG9zUjBGQlJ6dEpRVU5JTEVkQlFVYzdTVUZEU0N4SFFVRkhPMEZCUTFBc1EwRkJReXhEUVVGRE96dEJRVVZHTEV0QlFVc3NSMEZCUnl4SlFVRkpMRTFCUVUwc1EwRkJReXhIUVVGSExFZEJRVWNzVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhIUVVGSExFVkJRVVVzUjBGQlJ5eERRVUZETEVOQlFVTTdPMEZCUlhwRUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NWVUZCVlN4TlFVRk5MRVZCUVVVN1JVRkRha01zVDBGQlR5eE5RVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRMRXRCUVVzc1JVRkJSU3hOUVVGTkxFTkJRVU1zUTBGQlF6dERRVU4wUXl4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpWENKMWMyVWdjM1J5YVdOMFhDSTdYRzVjYmk4dklGTmxaU0JvZEhSd09pOHZjM1JoWTJ0dmRtVnlabXh2ZHk1amIyMHZjWFZsYzNScGIyNXpMek0wTkRZeE56QXZaWE5qWVhCbExYTjBjbWx1WnkxbWIzSXRkWE5sTFdsdUxXcGhkbUZ6WTNKcGNIUXRjbVZuWlhoY2JseHVkbUZ5SUhOd1pXTnBZV3h6TzF4dWRtRnlJSEpsWjJWNE8xeHVYRzV6Y0dWamFXRnNjeUE5SUZ0Y2JpQWdMeThnYjNKa1pYSWdiV0YwZEdWeWN5Qm1iM0lnZEdobGMyVmNiaUFnSUNBbkxTZGNiaUFnTENBbld5ZGNiaUFnTENBblhTZGNiaUFnTHk4Z2IzSmtaWElnWkc5bGMyNG5kQ0J0WVhSMFpYSWdabTl5SUdGdWVTQnZaaUIwYUdWelpWeHVJQ0FzSUNjdkoxeHVJQ0FzSUNkN0oxeHVJQ0FzSUNkOUoxeHVJQ0FzSUNjb0oxeHVJQ0FzSUNjcEoxeHVJQ0FzSUNjcUoxeHVJQ0FzSUNjckoxeHVJQ0FzSUNjL0oxeHVJQ0FzSUNjdUoxeHVJQ0FzSUNkY1hGeGNKMXh1SUNBc0lDZGVKMXh1SUNBc0lDY2tKMXh1SUNBc0lDZDhKMXh1WFR0Y2JseHVjbVZuWlhnZ1BTQnVaWGNnVW1WblJYaHdLQ2RiSnlBcklITndaV05wWVd4ekxtcHZhVzRvSjF4Y1hGd25LU0FySUNkZEp5d2dKMmNuS1R0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQm1kVzVqZEdsdmJpQW9jM1J5YVc1bktTQjdYRzRnSUhKbGRIVnliaUJ6ZEhKcGJtY3VjbVZ3YkdGalpTaHlaV2RsZUN3Z0oxeGNYRndrSmljcE8xeHVmVHRjYmlKZGZRPT0iLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG5mdW5jdGlvbiBTY3JvbGxlckNvYXN0ZXIgKGVsZW1lbnRzLCBvcHRpb25zKSB7XG4gIGlmICghICh0aGlzIGluc3RhbmNlb2YgU2Nyb2xsZXJDb2FzdGVyKSkge1xuICAgIHJldHVybiBuZXcgU2Nyb2xsZXJDb2FzdGVyKGVsZW1lbnRzLCBvcHRpb25zKTtcbiAgfVxuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHRoaXMuZWxlbWVudHMgICAgID0gQXJyYXkuaXNBcnJheShlbGVtZW50cykgPyBlbGVtZW50cyA6IFtlbGVtZW50c107XG4gIHRoaXMuY3VycmVudCAgICAgID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICB0aGlzLnN0YXJ0ICAgICAgICA9IDA7XG4gIHRoaXMuc3RlcHMgICAgICAgID0gb3B0aW9ucy5zdGVwcyB8fCAxNTA7XG5cbiAgdGhpcy5jYWxjdWxhdGVTY3JvbGxQb3NpdGlvbigpLnN0ZXAoMCk7XG59XG5cblNjcm9sbGVyQ29hc3Rlci5wcm90b3R5cGUuZ2V0VG9wID0gZnVuY3Rpb24gZ2V0VG9wICgpIHtcbiAgcmV0dXJuICQodGhpcy5lbGVtZW50c1swXSkub2Zmc2V0KCkudG9wIHx8IDA7XG59O1xuXG5TY3JvbGxlckNvYXN0ZXIucHJvdG90eXBlLmdldFRvdGFsSGVpZ2h0ID0gZnVuY3Rpb24gZ2V0VG90YWxIZWlnaHQgKCkge1xuICB2YXIgaGVpZ2h0ID0gMDtcblxuICB0aGlzLmVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgaGVpZ2h0ICs9ICQoZWwpLm91dGVySGVpZ2h0KCk7XG4gIH0pO1xuXG4gIHJldHVybiBoZWlnaHQ7XG59O1xuXG5TY3JvbGxlckNvYXN0ZXIucHJvdG90eXBlLmNhbGN1bGF0ZVNjcm9sbFBvc2l0aW9uID0gZnVuY3Rpb24gY2FsY3VsYXRlU2Nyb2xsUG9zaXRpb24gKCkge1xuICB2YXIgd2luZG93X2hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcbiAgdmFyIG1pZCAgICAgICAgICAgPSB3aW5kb3dfaGVpZ2h0IC8gMjtcbiAgdmFyIHRvcCAgICAgICAgICAgPSB0aGlzLmdldFRvcCgpO1xuICB2YXIgaGVpZ2h0ICAgICAgICA9IHRoaXMuZ2V0VG90YWxIZWlnaHQoKTtcbiAgdmFyIGRlc3RpbmF0aW9uICAgPSBoZWlnaHQgPiB3aW5kb3dfaGVpZ2h0ID8gdG9wIDogdG9wIC0gbWlkICsgaGVpZ2h0IC0gKGhlaWdodCAvIDIpXG5cbiAgdGhpcy5kaWZmID0gZGVzdGluYXRpb24gLSB0aGlzLmN1cnJlbnQ7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5TY3JvbGxlckNvYXN0ZXIucHJvdG90eXBlLnN0ZXAgPSBmdW5jdGlvbiBzdGVwICh0aW1lc3RhbXApIHtcbiAgdmFyIHByb2dyZXNzO1xuICB2YXIgcGVyY2VudDtcblxuICB0aGlzLnN0YXJ0ICA9IHRoaXMuc3RhcnQgfHwgdGltZXN0YW1wO1xuICBwcm9ncmVzcyAgICA9IHRpbWVzdGFtcCAtIHRoaXMuc3RhcnQ7XG4gIHBlcmNlbnQgICAgID0gTWF0aC5taW4ocHJvZ3Jlc3MgLyB0aGlzLnN0ZXBzLCAxKTtcblxuICBzY3JvbGxUbygwLCB0aGlzLmN1cnJlbnQgKyAodGhpcy5kaWZmICogcGVyY2VudCkpO1xuXG4gIGlmIChwZXJjZW50IDwgMSkge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnN0ZXAuYmluZCh0aGlzKSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2Nyb2xsZXJDb2FzdGVyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDNWMGFXeHpMM05qY205c2JHVnlYMk52WVhOMFpYSXZhVzVrWlhndWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzU1VGQlNTeERRVUZETEVkQlFVY3NUMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE96dEJRVVV4UWl4VFFVRlRMR1ZCUVdVc1JVRkJSU3hSUVVGUkxFVkJRVVVzVDBGQlR5eEZRVUZGTzBWQlF6TkRMRWxCUVVrc1IwRkJSeXhKUVVGSkxGbEJRVmtzWlVGQlpTeERRVUZETEVWQlFVVTdTVUZEZGtNc1QwRkJUeXhKUVVGSkxHVkJRV1VzUTBGQlF5eFJRVUZSTEVWQlFVVXNUMEZCVHl4RFFVRkRMRU5CUVVNN1FVRkRiRVFzUjBGQlJ6czdRVUZGU0N4RlFVRkZMRTlCUVU4c1IwRkJSeXhQUVVGUExFbEJRVWtzUlVGQlJTeERRVUZET3p0RlFVVjRRaXhKUVVGSkxFTkJRVU1zVVVGQlVTeFBRVUZQTEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1VVRkJVU3hEUVVGRExFZEJRVWNzVVVGQlVTeEhRVUZITEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1JVRkRjRVVzU1VGQlNTeERRVUZETEU5QlFVOHNVVUZCVVN4RFFVRkRMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU1zVTBGQlV5eEZRVUZGTEVOQlFVTTdSVUZETVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzVlVGQlZTeERRVUZETEVOQlFVTTdRVUZEZUVJc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eFZRVUZWTEU5QlFVOHNRMEZCUXl4TFFVRkxMRWxCUVVrc1IwRkJSeXhEUVVGRE96dEZRVVY2UXl4SlFVRkpMRU5CUVVNc2RVSkJRWFZDTEVWQlFVVXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRGVrTXNRMEZCUXpzN1FVRkZSQ3hsUVVGbExFTkJRVU1zVTBGQlV5eERRVUZETEUxQlFVMHNSMEZCUnl4VFFVRlRMRTFCUVUwc1NVRkJTVHRGUVVOd1JDeFBRVUZQTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1IwRkJSeXhKUVVGSkxFTkJRVU1zUTBGQlF6dEJRVU12UXl4RFFVRkRMRU5CUVVNN08wRkJSVVlzWlVGQlpTeERRVUZETEZOQlFWTXNRMEZCUXl4alFVRmpMRWRCUVVjc1UwRkJVeXhqUVVGakxFbEJRVWs3UVVGRGRFVXNSVUZCUlN4SlFVRkpMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU03TzBWQlJXWXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhQUVVGUExFTkJRVU1zVlVGQlZTeEZRVUZGTEVWQlFVVTdTVUZEYkVNc1RVRkJUU3hKUVVGSkxFTkJRVU1zUTBGQlF5eEZRVUZGTEVOQlFVTXNRMEZCUXl4WFFVRlhMRVZCUVVVc1EwRkJRenRCUVVOc1F5eEhRVUZITEVOQlFVTXNRMEZCUXpzN1JVRkZTQ3hQUVVGUExFMUJRVTBzUTBGQlF6dEJRVU5vUWl4RFFVRkRMRU5CUVVNN08wRkJSVVlzWlVGQlpTeERRVUZETEZOQlFWTXNRMEZCUXl4MVFrRkJkVUlzUjBGQlJ5eFRRVUZUTEhWQ1FVRjFRaXhKUVVGSk8wVkJRM1JHTEVsQlFVa3NZVUZCWVN4SFFVRkhMRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF5eE5RVUZOTEVWQlFVVXNRMEZCUXp0RlFVTjJReXhKUVVGSkxFZEJRVWNzWVVGQllTeGhRVUZoTEVkQlFVY3NRMEZCUXl4RFFVRkRPMFZCUTNSRExFbEJRVWtzUjBGQlJ5eGhRVUZoTEVsQlFVa3NRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJRenRGUVVOc1F5eEpRVUZKTEUxQlFVMHNWVUZCVlN4SlFVRkpMRU5CUVVNc1kwRkJZeXhGUVVGRkxFTkJRVU03UVVGRE5VTXNSVUZCUlN4SlFVRkpMRmRCUVZjc1MwRkJTeXhOUVVGTkxFZEJRVWNzWVVGQllTeEhRVUZITEVkQlFVY3NSMEZCUnl4SFFVRkhMRWRCUVVjc1IwRkJSeXhIUVVGSExFMUJRVTBzU1VGQlNTeE5RVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRPenRCUVVWMFJpeEZRVUZGTEVsQlFVa3NRMEZCUXl4SlFVRkpMRWRCUVVjc1YwRkJWeXhIUVVGSExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTTdPMFZCUlhaRExFOUJRVThzU1VGQlNTeERRVUZETzBGQlEyUXNRMEZCUXl4RFFVRkRPenRCUVVWR0xHVkJRV1VzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4SFFVRkhMRk5CUVZNc1NVRkJTU3hGUVVGRkxGTkJRVk1zUlVGQlJUdEZRVU42UkN4SlFVRkpMRkZCUVZFc1EwRkJRenRCUVVObUxFVkJRVVVzU1VGQlNTeFBRVUZQTEVOQlFVTTdPMFZCUlZvc1NVRkJTU3hEUVVGRExFdEJRVXNzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4SlFVRkpMRk5CUVZNc1EwRkJRenRGUVVOMFF5eFJRVUZSTEUxQlFVMHNVMEZCVXl4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU03UVVGRGRrTXNSVUZCUlN4UFFVRlBMRTlCUVU4c1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eFJRVUZSTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF6czdRVUZGYmtRc1JVRkJSU3hSUVVGUkxFTkJRVU1zUTBGQlF5eEZRVUZGTEVsQlFVa3NRMEZCUXl4UFFVRlBMRWxCUVVrc1NVRkJTU3hEUVVGRExFbEJRVWtzUjBGQlJ5eFBRVUZQTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRGUVVWc1JDeEpRVUZKTEU5QlFVOHNSMEZCUnl4RFFVRkRMRVZCUVVVN1NVRkRaaXh4UWtGQmNVSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RFFVRkRPMGRCUXpkRE8wRkJRMGdzUTBGQlF5eERRVUZET3p0QlFVVkdMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzWlVGQlpTeERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWRtRnlJQ1FnUFNCeVpYRjFhWEpsS0NkcWNYVmxjbmtuS1R0Y2JseHVablZ1WTNScGIyNGdVMk55YjJ4c1pYSkRiMkZ6ZEdWeUlDaGxiR1Z0Wlc1MGN5d2diM0IwYVc5dWN5a2dlMXh1SUNCcFppQW9JU0FvZEdocGN5QnBibk4wWVc1alpXOW1JRk5qY205c2JHVnlRMjloYzNSbGNpa3BJSHRjYmlBZ0lDQnlaWFIxY200Z2JtVjNJRk5qY205c2JHVnlRMjloYzNSbGNpaGxiR1Z0Wlc1MGN5d2diM0IwYVc5dWN5azdYRzRnSUgxY2JseHVJQ0J2Y0hScGIyNXpJRDBnYjNCMGFXOXVjeUI4ZkNCN2ZUdGNibHh1SUNCMGFHbHpMbVZzWlcxbGJuUnpJQ0FnSUNBOUlFRnljbUY1TG1selFYSnlZWGtvWld4bGJXVnVkSE1wSUQ4Z1pXeGxiV1Z1ZEhNZ09pQmJaV3hsYldWdWRITmRPMXh1SUNCMGFHbHpMbU4xY25KbGJuUWdJQ0FnSUNBOUlDUW9kMmx1Wkc5M0tTNXpZM0p2Ykd4VWIzQW9LVHRjYmlBZ2RHaHBjeTV6ZEdGeWRDQWdJQ0FnSUNBZ1BTQXdPMXh1SUNCMGFHbHpMbk4wWlhCeklDQWdJQ0FnSUNBOUlHOXdkR2x2Ym5NdWMzUmxjSE1nZkh3Z01UVXdPMXh1WEc0Z0lIUm9hWE11WTJGc1kzVnNZWFJsVTJOeWIyeHNVRzl6YVhScGIyNG9LUzV6ZEdWd0tEQXBPMXh1ZlZ4dVhHNVRZM0p2Ykd4bGNrTnZZWE4wWlhJdWNISnZkRzkwZVhCbExtZGxkRlJ2Y0NBOUlHWjFibU4wYVc5dUlHZGxkRlJ2Y0NBb0tTQjdYRzRnSUhKbGRIVnliaUFrS0hSb2FYTXVaV3hsYldWdWRITmJNRjBwTG05bVpuTmxkQ2dwTG5SdmNDQjhmQ0F3TzF4dWZUdGNibHh1VTJOeWIyeHNaWEpEYjJGemRHVnlMbkJ5YjNSdmRIbHdaUzVuWlhSVWIzUmhiRWhsYVdkb2RDQTlJR1oxYm1OMGFXOXVJR2RsZEZSdmRHRnNTR1ZwWjJoMElDZ3BJSHRjYmlBZ2RtRnlJR2hsYVdkb2RDQTlJREE3WEc1Y2JpQWdkR2hwY3k1bGJHVnRaVzUwY3k1bWIzSkZZV05vS0daMWJtTjBhVzl1SUNobGJDa2dlMXh1SUNBZ0lHaGxhV2RvZENBclBTQWtLR1ZzS1M1dmRYUmxja2hsYVdkb2RDZ3BPMXh1SUNCOUtUdGNibHh1SUNCeVpYUjFjbTRnYUdWcFoyaDBPMXh1ZlR0Y2JseHVVMk55YjJ4c1pYSkRiMkZ6ZEdWeUxuQnliM1J2ZEhsd1pTNWpZV3hqZFd4aGRHVlRZM0p2Ykd4UWIzTnBkR2x2YmlBOUlHWjFibU4wYVc5dUlHTmhiR04xYkdGMFpWTmpjbTlzYkZCdmMybDBhVzl1SUNncElIdGNiaUFnZG1GeUlIZHBibVJ2ZDE5b1pXbG5hSFFnUFNBa0tIZHBibVJ2ZHlrdWFHVnBaMmgwS0NrN1hHNGdJSFpoY2lCdGFXUWdJQ0FnSUNBZ0lDQWdJRDBnZDJsdVpHOTNYMmhsYVdkb2RDQXZJREk3WEc0Z0lIWmhjaUIwYjNBZ0lDQWdJQ0FnSUNBZ0lEMGdkR2hwY3k1blpYUlViM0FvS1R0Y2JpQWdkbUZ5SUdobGFXZG9kQ0FnSUNBZ0lDQWdQU0IwYUdsekxtZGxkRlJ2ZEdGc1NHVnBaMmgwS0NrN1hHNGdJSFpoY2lCa1pYTjBhVzVoZEdsdmJpQWdJRDBnYUdWcFoyaDBJRDRnZDJsdVpHOTNYMmhsYVdkb2RDQS9JSFJ2Y0NBNklIUnZjQ0F0SUcxcFpDQXJJR2hsYVdkb2RDQXRJQ2hvWldsbmFIUWdMeUF5S1Z4dVhHNGdJSFJvYVhNdVpHbG1aaUE5SUdSbGMzUnBibUYwYVc5dUlDMGdkR2hwY3k1amRYSnlaVzUwTzF4dVhHNGdJSEpsZEhWeWJpQjBhR2x6TzF4dWZUdGNibHh1VTJOeWIyeHNaWEpEYjJGemRHVnlMbkJ5YjNSdmRIbHdaUzV6ZEdWd0lEMGdablZ1WTNScGIyNGdjM1JsY0NBb2RHbHRaWE4wWVcxd0tTQjdYRzRnSUhaaGNpQndjbTluY21WemN6dGNiaUFnZG1GeUlIQmxjbU5sYm5RN1hHNWNiaUFnZEdocGN5NXpkR0Z5ZENBZ1BTQjBhR2x6TG5OMFlYSjBJSHg4SUhScGJXVnpkR0Z0Y0R0Y2JpQWdjSEp2WjNKbGMzTWdJQ0FnUFNCMGFXMWxjM1JoYlhBZ0xTQjBhR2x6TG5OMFlYSjBPMXh1SUNCd1pYSmpaVzUwSUNBZ0lDQTlJRTFoZEdndWJXbHVLSEJ5YjJkeVpYTnpJQzhnZEdocGN5NXpkR1Z3Y3l3Z01TazdYRzVjYmlBZ2MyTnliMnhzVkc4b01Dd2dkR2hwY3k1amRYSnlaVzUwSUNzZ0tIUm9hWE11WkdsbVppQXFJSEJsY21ObGJuUXBLVHRjYmx4dUlDQnBaaUFvY0dWeVkyVnVkQ0E4SURFcElIdGNiaUFnSUNCeVpYRjFaWE4wUVc1cGJXRjBhVzl1Um5KaGJXVW9kR2hwY3k1emRHVndMbUpwYm1Rb2RHaHBjeWtwTzF4dUlDQjlYRzU5TzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlGTmpjbTlzYkdWeVEyOWhjM1JsY2p0Y2JpSmRmUT09Il19
