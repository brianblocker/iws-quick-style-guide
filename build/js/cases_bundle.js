(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cases_bundle = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var React               = require('react');
var Perf                = React.addons.Perf;
var Dispatcher          = require('flux').Dispatcher;
var cases_module        = require('./modules/cases');
var ListView            = cases_module.ListView;
var list_view_store     = cases_module.list_view_store;
var _data_list_headings = require('./data/cases_list_headings');
var _data_list_body     = require('./data/cases_list_body')(15);
var list_headings       = list_view_store.get('headings');
var case_list           = list_view_store.get('cases');

list_headings.set(_data_list_headings);
list_view_store.set('first', list_headings.at(0));
list_headings.linkSiblings();

case_list.set(_data_list_body);

function render (id) {
  React.render(
    React.createElement(ListView, {
      headings: list_headings,
      store:    list_view_store
    }),
    document.getElementById(id)
  );
};

render('cases-list');

module.exports = render;



},{"./data/cases_list_body":11,"./data/cases_list_headings":12,"./modules/cases":27,"flux":"flux","react":"react"}],2:[function(require,module,exports){
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
var people     = [null, 'Hank Jones', 'Robert Salford'];
var groups     = [null, '@O&G L2'];
var subtypes   = ['alarm issue', 'production issue', 'comm issue'];
var devices    = ['Lufko Walrus', 'Manchild Fritz', 'Adept Node'];
var types      = ['Well support'];
var reporters  = ['Brian', 'Shahid', 'Rajesh'];
var statuses   = ['closed', 'resolved', 'open', 'active'];
var priorities = [1,2,3,4,5];

function randomize (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generate (num) {
  var i;
  var values = [];

  for (i = 0; i < num; i++) {
    values.push({
      status:                   randomize(statuses),
      priority:                 randomize(priorities),
      created_date:             new Date(),
      updated_date:             new Date(),
      reporter:                 randomize(reporters),
      subtype:                  randomize(subtypes),
      assigned_group:           randomize(groups),
      assigned_person:          randomize(people),
      type:                     randomize(types),
      device:                   randomize(devices)
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
    minimal:    true,
    name:       'priority',
    title:      'P',
    type:       'priority'
  },
  {
    name:       'details',
    title:      'Case',
    type:       'case_details'
  },
  {
    name:       'reported',
    title:      'Reported by',
    type:       'case_reported'
  },
  {
    name:       'assignment',
    title:      'Assignment',
    type:       'case_assignment'
  },
  {
    name:       'actions',
    title:      'Action',
    type:       'case_actions'
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



},{"./dropdown.jsx":21,"./icon_wrapper.jsx":26,"react":"react"}],15:[function(require,module,exports){
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



},{"../../components/button.jsx":3,"./dropdown.jsx":21,"backbone":"backbone","jquery":"jquery","react":"react","react-hotkeys":"react-hotkeys","underscore":"underscore"}],16:[function(require,module,exports){
var CaseCollection;
var Backbone  = require('backbone');
var CaseModel = require('./case_model');

CaseCollection = Backbone.Collection.extend({
  model: CaseModel,
  linkSiblings: function () {
    this.each(function (header, index) {
      header.prev = this.at(index - 1);
      header.next = this.at(index + 1);
    }, this);
  },
  comparator: function (first, second) {
    return first.get('priority') - second.get('priority');
  }
});

module.exports = CaseCollection;



},{"./case_model":19,"backbone":"backbone"}],17:[function(require,module,exports){
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

CaseHistory = React.createClass({displayName: "CaseHistory",
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

module.exports = CaseHistory;



},{"../../components/tabs.jsx":6,"../../components/td.jsx":7,"../../components/tr.jsx":9,"../../constants":10,"./icon_wrapper.jsx":26,"backbone":"backbone","jquery":"jquery","moment":"moment","react":"react"}],18:[function(require,module,exports){
var CaseHistoryCollection;
var Backbone  = require('backbone');

CaseHistoryCollection = Backbone.Collection.extend({
  fetch: function () {
    this.set([
      {
        date:     new Date(),
        title:    'Joe Smith executed a call',
        comment:  'This is just a comment'
      },
      {
        date:     new Date(),
        title:    'Case created by user',
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

module.exports = CaseHistoryCollection;



},{"backbone":"backbone"}],19:[function(require,module,exports){
var CaseModel;
var Backbone = require('backbone');

CaseModel = Backbone.Model.extend({});

module.exports = CaseModel;



},{"backbone":"backbone"}],20:[function(require,module,exports){
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
            "Find cases matching"
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



},{"../../components/button.jsx":3,"./and_or_selector.jsx":14,"./autocomplete.jsx":15,"./dropdown.jsx":21,"./filter_box_definition":23,"backbone":"backbone","react":"react"}],23:[function(require,module,exports){
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
  active:   'play-circle',
  closed:   'times-circle',
  open:     'circle-o',
  resolved: 'check-circle'
};

/**
 * Wraps the Icon component, see that component for usage examples
 */
IconWrapper = React.createClass({displayName: "IconWrapper",
  mixins: [React.addons.PureRenderMixin],
  render: function () {
    var newProps = _.extend({}, this.props);

    newProps.type = mappings[newProps.type] || newProps.type;

    return (
      React.createElement(Icon, React.__spread({},  newProps))
    );
  }
});

module.exports = IconWrapper;



},{"../../components/icon.jsx":4,"react":"react","underscore":"underscore"}],27:[function(require,module,exports){
module.exports = {
  dispatcher:       require('./dispatcher'),
  CaseModel:        require('./case_model'),
  CaseCollection:   require('./case_collection'),
  ListView:         require('./list_view.jsx'),
  list_view_store:  require('./list_view_store')
};



},{"./case_collection":16,"./case_model":19,"./dispatcher":20,"./list_view.jsx":30,"./list_view_store":31}],28:[function(require,module,exports){
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
      {text: 'Newest cases'},
      {text: 'Cases opened by me'},
      {text: 'Closed cases'}
    ];

    return (
      React.createElement("caption", {className: "list-filter"}, 
        React.createElement("div", {className: "filter-selection"}, 
          React.createElement("ul", {className: "pull-right inline"}, 
            React.createElement("li", null, "Quick filters:"), 
            React.createElement("li", null, 
              React.createElement(Dropdown, {selected: "Active cases", align: "right", choices: choices})
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
var CaseModel     = require('./case_model');
var Tr            = require('../../components/tr.jsx');
var Td            = require('../../components/td.jsx');
var transformers  = require('./transformers.jsx')

ListRow = React.createClass({displayName: "ListRow",
  propTypes: {
    heading: React.PropTypes.instanceOf(HeadingModel).isRequired,
    managed_case: React.PropTypes.instanceOf(CaseModel).isRequired
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
    var cols = this._buildCols();

    return (
      React.createElement(Tr, {className: this.props.className, onClick: this._handleClick}, 
        cols
      )
    );
  },
  _handleClick: function (e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  },
  _buildCols: function () {
    var name;
    var value;
    var managed_case  = this.props.managed_case;
    var heading       = this.props.heading;
    var fields        = [];

    while (heading) {
      name  = heading.get('name');
      type  = heading.get('type');
      value = transformers[type] && transformers[type].call(this, managed_case, name);

      fields.push(
        React.createElement(Td, {store: managed_case, key: heading.cid}, 
          value
        )
      );

      heading = heading.next;
    }

    return fields;
  },
  _closeCase: function () {
    if (confirm('This will permanently close this case. Are you sure?')) {
      this.props.managed_case.set('status', 'closed');
      this.setState({});
    }
  }
});

module.exports = ListRow;



},{"../../components/td.jsx":7,"../../components/tr.jsx":9,"./case_model":19,"./heading_model":25,"./transformers.jsx":35,"backbone":"backbone","react":"react","underscore":"underscore"}],30:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var CasesList;
var React   = require('react');
var Thead   = require('./thead_wrapper.jsx');
var Tbody   = require('./tbody_wrapper.jsx');
var Filter  = require('./list_filter.jsx');

CasesList = React.createClass({displayName: "CasesList",
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

module.exports = CasesList;



},{"./list_filter.jsx":28,"./tbody_wrapper.jsx":32,"./thead_wrapper.jsx":34,"react":"react"}],31:[function(require,module,exports){
"use strict";

var store;
var Backbone          = require('backbone');
var HeadingCollection = require('./heading_collection');
var CaseCollection    = require('./case_collection');

store = new Backbone.Model({
  cases:    new CaseCollection(),
  first:    null,
  headings: new HeadingCollection(),
  selected: null
});

module.exports = store;



},{"./case_collection":16,"./heading_collection":24,"backbone":"backbone"}],32:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var TbodyWrapper;
var React             = require('react');
var Backbone          = require('backbone');
var Scroller          = require('../../utils/scroller_coaster');
var RowDetails        = require('./active_row_details.jsx');
var CaseHistoryView   = require('./case_history.jsx');
var HistoryCollection = require('./case_history_collection');
var ListRow           = require('./list_row.jsx');
var classNames        = require('classnames');

TbodyWrapper = React.createClass({displayName: "TbodyWrapper",
  propTypes: {
    store: React.PropTypes.instanceOf(Backbone.Model).isRequired
  },
  mixins: [React.addons.PureRenderMixin],
  getInitialState: function () {
    return {
      activeCase: null,
      minimized:  false,
      previous:   null,
      increment:  false
    };
  },
  componentDidUpdate: function () {
    var elements;
    var active = this.state.activeCase;

    if (! active) {
      return false;
    }

    elements = [
      this.refs[active].getDOMNode(),
      this.refs.activeCase.getDOMNode()
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
    var cases   = store.get('cases');
    var heading = store.get('first');
    var prev    = null;
    var next    = null;

    cases.each(function (model, index) {
      var activeProps;
      var rowProps;
      var selected_row;
      var class_names;
      var active  = this.state.activeCase === model.cid;
      var odd     = index % 2 ? 'odd' : null;

      next = cases.at(index + 1);

      class_names = classNames({
        odd: odd,
        active: active
      });

      rowProps = {
        className:    class_names,
        ref:          model.cid,
        key:          model.cid,
        onClick:      this._handleCaseSelection.bind(this, model.cid),
        managed_case: model,
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
          switcher:   this._handleCaseSelection,
          sizeToggle: this._toggleMinimize,
          key:        model.cid + '-active',
          ref:        'activeCase',
          minimized:  this.state.minimized
        };

        data.push(
          React.createElement(RowDetails, React.__spread({},  activeProps), 
            React.createElement(CaseHistoryView, {collection: new HistoryCollection()})
          )
        );
      }

      prev = model;
    }, this);

    return data;
  },
  _handleCaseSelection: function (cid, increment) {
    var current = this.state.activeCase;

    if (current === cid) {
      cid = null;
    }

    this.setState({
      activeCase: cid,
      increment:  increment === true,
      previous:   cid ? current : null
    });
  },
});

module.exports = TbodyWrapper;



},{"../../utils/scroller_coaster":37,"./active_row_details.jsx":13,"./case_history.jsx":17,"./case_history_collection":18,"./list_row.jsx":29,"backbone":"backbone","classnames":2,"react":"react"}],33:[function(require,module,exports){
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
      data.className    = current.get('type') === 'case_actions' ? 'actions-col' : '';

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
  case_details: function (model) {
    var type    = model.get('type');
    var asset   = model.get('device');
    var subtype = model.get('subtype');
    var title   = type + ': ' + asset + ' (' + subtype + ')';
    var updated = moment(model.get('updated_date')).format(constants.DATE_FORMAT);

    return (
      React.createElement("div", null, 
        React.createElement("div", null, title), 
        React.createElement("span", {className: "muted small"}, "Last update: ", updated), 
        React.createElement("a", {className: "feaux-button small"}, "Details")
      )
    )
  },
  status: function (model) {
    var status  = model.get('status');
    var props   = {
      type:       status,
      className:  status === 'closed' ? 'muted' : ''
    };

    return (React.createElement(Icon, React.__spread({},  props)));
  },
  case_reported: function (model) {
    var reporter  = model.get('reporter');
    var created   = moment(model.get('created_date')).format(constants.DATE_FORMAT);

    return (
      React.createElement("div", null, 
        React.createElement("div", null, reporter), 
        React.createElement("span", {className: "muted small"}, created)
      )
    )
  },
  case_assignment: function (model) {
    var assignments = (React.createElement("span", {className: "nodata"}, "No assignment"));
    var group       = model.get('assigned_group');
    var person      = model.get('assigned_person');

    if (group || person) {
      assignments = [
        React.createElement("div", {key: "group"}, group),
        React.createElement("div", {key: "person"}, person)
      ];
    }

    return (
      React.createElement("div", null, 
        assignments
      )
    );
  },
  priority: function (model) {
    var priority    = model.get('priority');
    var class_names = ['priority', 'priority-' + priority];

    return (
      React.createElement("span", {className: class_names.join(' ')}, 
        priority
      )
    );
  },
  case_actions: function (model) {
    var button = (React.createElement("span", {className: "nodata"}, "None available"));

    if (model.get('reporter') !== 'Brian') {
      return button;
    }

    if (model.get('status') === 'closed') {
      return button;
    }

    button = (
      React.createElement(Button, {icon: "plus", text: "Close case", onClick: this._closeCase})
    );

    return button;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9jYXNlcy5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc25hbWVzL2luZGV4LmpzIiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvY29tcG9uZW50cy9idXR0b24uanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvY29tcG9uZW50cy9pY29uLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2NvbXBvbmVudHMvc29ydF9pbmRpY2F0b3IuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvY29tcG9uZW50cy90YWJzLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2NvbXBvbmVudHMvdGQuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvY29tcG9uZW50cy90aC5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9jb21wb25lbnRzL3RyLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2NvbnN0YW50cy5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2RhdGEvY2FzZXNfbGlzdF9ib2R5LmpzIiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvZGF0YS9jYXNlc19saXN0X2hlYWRpbmdzLmpzIiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy9hY3RpdmVfcm93X2RldGFpbHMuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy9hbmRfb3Jfc2VsZWN0b3IuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy9hdXRvY29tcGxldGUuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy9jYXNlX2NvbGxlY3Rpb24uanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL2Nhc2VzL2Nhc2VfaGlzdG9yeS5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL2Nhc2VzL2Nhc2VfaGlzdG9yeV9jb2xsZWN0aW9uLmpzIiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy9jYXNlX21vZGVsLmpzIiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy9kaXNwYXRjaGVyLmpzIiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy9kcm9wZG93bi5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL2Nhc2VzL2ZpbHRlcl9ib3guanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy9maWx0ZXJfYm94X2RlZmluaXRpb24uanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL2Nhc2VzL2hlYWRpbmdfY29sbGVjdGlvbi5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvY2FzZXMvaGVhZGluZ19tb2RlbC5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvY2FzZXMvaWNvbl93cmFwcGVyLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvY2FzZXMvaW5kZXguanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL2Nhc2VzL2xpc3RfZmlsdGVyLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvY2FzZXMvbGlzdF9yb3cuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy9saXN0X3ZpZXcuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy9saXN0X3ZpZXdfc3RvcmUuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL2Nhc2VzL3Rib2R5X3dyYXBwZXIuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy90aF93cmFwcGVyLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvY2FzZXMvdGhlYWRfd3JhcHBlci5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL2Nhc2VzL3RyYW5zZm9ybWVycy5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy91dGlscy9lc2NhcGVfcmVnZXguanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy91dGlscy9zY3JvbGxlcl9jb2FzdGVyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEs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QUN0QyxRQUFRLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDdkMsRUFBRSxPQUFPLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFbkQsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDOztFQUVsRCxJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUU7SUFDZixxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQzdDO0FBQ0gsQ0FBQyxDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsZUFBZSxDQUFDOztBQUVqQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgUmVhY3QgICAgICAgICAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUGVyZiAgICAgICAgICAgICAgICA9IFJlYWN0LmFkZG9ucy5QZXJmO1xudmFyIERpc3BhdGNoZXIgICAgICAgICAgPSByZXF1aXJlKCdmbHV4JykuRGlzcGF0Y2hlcjtcbnZhciBjYXNlc19tb2R1bGUgICAgICAgID0gcmVxdWlyZSgnLi9tb2R1bGVzL2Nhc2VzJyk7XG52YXIgTGlzdFZpZXcgICAgICAgICAgICA9IGNhc2VzX21vZHVsZS5MaXN0VmlldztcbnZhciBsaXN0X3ZpZXdfc3RvcmUgICAgID0gY2FzZXNfbW9kdWxlLmxpc3Rfdmlld19zdG9yZTtcbnZhciBfZGF0YV9saXN0X2hlYWRpbmdzID0gcmVxdWlyZSgnLi9kYXRhL2Nhc2VzX2xpc3RfaGVhZGluZ3MnKTtcbnZhciBfZGF0YV9saXN0X2JvZHkgICAgID0gcmVxdWlyZSgnLi9kYXRhL2Nhc2VzX2xpc3RfYm9keScpKDE1KTtcbnZhciBsaXN0X2hlYWRpbmdzICAgICAgID0gbGlzdF92aWV3X3N0b3JlLmdldCgnaGVhZGluZ3MnKTtcbnZhciBjYXNlX2xpc3QgICAgICAgICAgID0gbGlzdF92aWV3X3N0b3JlLmdldCgnY2FzZXMnKTtcblxubGlzdF9oZWFkaW5ncy5zZXQoX2RhdGFfbGlzdF9oZWFkaW5ncyk7XG5saXN0X3ZpZXdfc3RvcmUuc2V0KCdmaXJzdCcsIGxpc3RfaGVhZGluZ3MuYXQoMCkpO1xubGlzdF9oZWFkaW5ncy5saW5rU2libGluZ3MoKTtcblxuY2FzZV9saXN0LnNldChfZGF0YV9saXN0X2JvZHkpO1xuXG5mdW5jdGlvbiByZW5kZXIgKGlkKSB7XG4gIFJlYWN0LnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpc3RWaWV3LCB7XG4gICAgICBoZWFkaW5nczogbGlzdF9oZWFkaW5ncyxcbiAgICAgIHN0b3JlOiAgICBsaXN0X3ZpZXdfc3RvcmVcbiAgICB9KSxcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcbiAgKTtcbn07XG5cbnJlbmRlcignY2FzZXMtbGlzdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbmRlcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyTmhjMlZ6TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRWxCUVVrc1MwRkJTeXhwUWtGQmFVSXNUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8wRkJRek5ETEVsQlFVa3NTVUZCU1N4clFrRkJhMElzUzBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNN1FVRkROVU1zU1VGQlNTeFZRVUZWTEZsQlFWa3NUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRExGVkJRVlVzUTBGQlF6dEJRVU55UkN4SlFVRkpMRmxCUVZrc1ZVRkJWU3hQUVVGUExFTkJRVU1zYVVKQlFXbENMRU5CUVVNc1EwRkJRenRCUVVOeVJDeEpRVUZKTEZGQlFWRXNZMEZCWXl4WlFVRlpMRU5CUVVNc1VVRkJVU3hEUVVGRE8wRkJRMmhFTEVsQlFVa3NaVUZCWlN4UFFVRlBMRmxCUVZrc1EwRkJReXhsUVVGbExFTkJRVU03UVVGRGRrUXNTVUZCU1N4dFFrRkJiVUlzUjBGQlJ5eFBRVUZQTEVOQlFVTXNORUpCUVRSQ0xFTkJRVU1zUTBGQlF6dEJRVU5vUlN4SlFVRkpMR1ZCUVdVc1QwRkJUeXhQUVVGUExFTkJRVU1zZDBKQlFYZENMRU5CUVVNc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF6dEJRVU5vUlN4SlFVRkpMR0ZCUVdFc1UwRkJVeXhsUVVGbExFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPMEZCUXpGRUxFbEJRVWtzVTBGQlV5eGhRVUZoTEdWQlFXVXNRMEZCUXl4SFFVRkhMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03TzBGQlJYWkVMR0ZCUVdFc1EwRkJReXhIUVVGSExFTkJRVU1zYlVKQlFXMUNMRU5CUVVNc1EwRkJRenRCUVVOMlF5eGxRVUZsTEVOQlFVTXNSMEZCUnl4RFFVRkRMRTlCUVU4c1JVRkJSU3hoUVVGaExFTkJRVU1zUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRiRVFzWVVGQllTeERRVUZETEZsQlFWa3NSVUZCUlN4RFFVRkRPenRCUVVVM1FpeFRRVUZUTEVOQlFVTXNSMEZCUnl4RFFVRkRMR1ZCUVdVc1EwRkJReXhEUVVGRE96dEJRVVV2UWl4VFFVRlRMRTFCUVUwc1JVRkJSU3hGUVVGRkxFVkJRVVU3UlVGRGJrSXNTMEZCU3l4RFFVRkRMRTFCUVUwN1NVRkRWaXhMUVVGTExFTkJRVU1zWVVGQllTeERRVUZETEZGQlFWRXNSVUZCUlR0TlFVTTFRaXhSUVVGUkxFVkJRVVVzWVVGQllUdE5RVU4yUWl4TFFVRkxMRXRCUVVzc1pVRkJaVHRMUVVNeFFpeERRVUZETzBsQlEwWXNVVUZCVVN4RFFVRkRMR05CUVdNc1EwRkJReXhGUVVGRkxFTkJRVU03UjBGRE5VSXNRMEZCUXp0QlFVTktMRU5CUVVNc1EwRkJRenM3UVVGRlJpeE5RVUZOTEVOQlFVTXNXVUZCV1N4RFFVRkRMRU5CUVVNN08wRkJSWEpDTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1RVRkJUU3hEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lkbUZ5SUZKbFlXTjBJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDZHlaV0ZqZENjcE8xeHVkbUZ5SUZCbGNtWWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BTQlNaV0ZqZEM1aFpHUnZibk11VUdWeVpqdGNiblpoY2lCRWFYTndZWFJqYUdWeUlDQWdJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25abXgxZUNjcExrUnBjM0JoZEdOb1pYSTdYRzUyWVhJZ1kyRnpaWE5mYlc5a2RXeGxJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR2Ylc5a2RXeGxjeTlqWVhObGN5Y3BPMXh1ZG1GeUlFeHBjM1JXYVdWM0lDQWdJQ0FnSUNBZ0lDQWdQU0JqWVhObGMxOXRiMlIxYkdVdVRHbHpkRlpwWlhjN1hHNTJZWElnYkdsemRGOTJhV1YzWDNOMGIzSmxJQ0FnSUNBOUlHTmhjMlZ6WDIxdlpIVnNaUzVzYVhOMFgzWnBaWGRmYzNSdmNtVTdYRzUyWVhJZ1gyUmhkR0ZmYkdsemRGOW9aV0ZrYVc1bmN5QTlJSEpsY1hWcGNtVW9KeTR2WkdGMFlTOWpZWE5sYzE5c2FYTjBYMmhsWVdScGJtZHpKeWs3WEc1MllYSWdYMlJoZEdGZmJHbHpkRjlpYjJSNUlDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dlpHRjBZUzlqWVhObGMxOXNhWE4wWDJKdlpIa25LU2d4TlNrN1hHNTJZWElnYkdsemRGOW9aV0ZrYVc1bmN5QWdJQ0FnSUNBOUlHeHBjM1JmZG1sbGQxOXpkRzl5WlM1blpYUW9KMmhsWVdScGJtZHpKeWs3WEc1MllYSWdZMkZ6WlY5c2FYTjBJQ0FnSUNBZ0lDQWdJQ0E5SUd4cGMzUmZkbWxsZDE5emRHOXlaUzVuWlhRb0oyTmhjMlZ6SnlrN1hHNWNibXhwYzNSZmFHVmhaR2x1WjNNdWMyVjBLRjlrWVhSaFgyeHBjM1JmYUdWaFpHbHVaM01wTzF4dWJHbHpkRjkyYVdWM1gzTjBiM0psTG5ObGRDZ25abWx5YzNRbkxDQnNhWE4wWDJobFlXUnBibWR6TG1GMEtEQXBLVHRjYm14cGMzUmZhR1ZoWkdsdVozTXViR2x1YTFOcFlteHBibWR6S0NrN1hHNWNibU5oYzJWZmJHbHpkQzV6WlhRb1gyUmhkR0ZmYkdsemRGOWliMlI1S1R0Y2JseHVablZ1WTNScGIyNGdjbVZ1WkdWeUlDaHBaQ2tnZTF4dUlDQlNaV0ZqZEM1eVpXNWtaWElvWEc0Z0lDQWdVbVZoWTNRdVkzSmxZWFJsUld4bGJXVnVkQ2hNYVhOMFZtbGxkeXdnZTF4dUlDQWdJQ0FnYUdWaFpHbHVaM002SUd4cGMzUmZhR1ZoWkdsdVozTXNYRzRnSUNBZ0lDQnpkRzl5WlRvZ0lDQWdiR2x6ZEY5MmFXVjNYM04wYjNKbFhHNGdJQ0FnZlNrc1hHNGdJQ0FnWkc5amRXMWxiblF1WjJWMFJXeGxiV1Z1ZEVKNVNXUW9hV1FwWEc0Z0lDazdYRzU5TzF4dVhHNXlaVzVrWlhJb0oyTmhjMlZ6TFd4cGMzUW5LVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCeVpXNWtaWEk3WEc0aVhYMD0iLCJmdW5jdGlvbiBjbGFzc05hbWVzKCkge1xuXHR2YXIgY2xhc3NlcyA9ICcnO1xuXHR2YXIgYXJnO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0YXJnID0gYXJndW1lbnRzW2ldO1xuXHRcdGlmICghYXJnKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBhcmcgfHwgJ251bWJlcicgPT09IHR5cGVvZiBhcmcpIHtcblx0XHRcdGNsYXNzZXMgKz0gJyAnICsgYXJnO1xuXHRcdH0gZWxzZSBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZykgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcblx0XHRcdGNsYXNzZXMgKz0gJyAnICsgY2xhc3NOYW1lcy5hcHBseShudWxsLCBhcmcpO1xuXHRcdH0gZWxzZSBpZiAoJ29iamVjdCcgPT09IHR5cGVvZiBhcmcpIHtcblx0XHRcdGZvciAodmFyIGtleSBpbiBhcmcpIHtcblx0XHRcdFx0aWYgKCFhcmcuaGFzT3duUHJvcGVydHkoa2V5KSB8fCAhYXJnW2tleV0pIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGtleTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIGNsYXNzZXMuc3Vic3RyKDEpO1xufVxuXG4vLyBzYWZlbHkgZXhwb3J0IGNsYXNzTmFtZXMgaW4gY2FzZSB0aGUgc2NyaXB0IGlzIGluY2x1ZGVkIGRpcmVjdGx5IG9uIGEgcGFnZVxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gY2xhc3NOYW1lcztcbn1cbiIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgQnV0dG9uO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBJY29uICA9IHJlcXVpcmUoJy4vaWNvbi5qc3gnKTtcblxuQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkJ1dHRvblwiLFxuICBtaXhpbnM6IFtSZWFjdC5hZGRvbnMuUHVyZVJlbmRlck1peGluXSxcbiAgcHJvcFR5cGVzOiB7XG4gICAgaWNvbjogICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgb25DbGljazogIFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIGhyZWY6ICAgICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBpY29uICAgICAgPSB0aGlzLnByb3BzLmljb24gPyBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiB0aGlzLnByb3BzLmljb24sIHJlZjogXCJpY29uXCJ9KSA6IG51bGw7XG4gICAgdmFyIGNsYXNzZXMgICA9IFsnYnV0dG9uJ107XG4gICAgdmFyIGFmdGVySWNvbiA9IHRoaXMucHJvcHMuYWZ0ZXJJY29uID8gUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogdGhpcy5wcm9wcy5hZnRlckljb24sIHJlZjogXCJhZnRlci1pY29uXCJ9KSA6IG51bGw7XG4gICAgdmFyIHRleHQgICAgICA9IHRoaXMucHJvcHMudGV4dCA/IChSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcInRleHRcIn0sIHRoaXMucHJvcHMudGV4dCkpIDogbnVsbDtcbiAgICB2YXIgcHJvcHM7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jbGFzc05hbWUpIHtcbiAgICAgIGNsYXNzZXMucHVzaCh0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG4gICAgfVxuXG4gICAgcHJvcHMgPSB7XG4gICAgICBocmVmOiAgICAgICB0aGlzLnByb3BzLmhyZWYsXG4gICAgICBhY3Rpb246ICAgICB0aGlzLnByb3BzLmFjdGlvbixcbiAgICAgIG9uQ2xpY2s6ICAgIHRoaXMuX2hhbmRsZUNsaWNrLFxuICAgICAgY2xhc3NOYW1lOiAgY2xhc3Nlcy5qb2luKCcgJylcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgcHJvcHMpLCBcbiAgICAgICAgaWNvbiwgXG4gICAgICAgIHRleHQsIFxuICAgICAgICBhZnRlckljb25cbiAgICAgIClcbiAgICApO1xuICB9LFxuICBfaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICB0aGlzLnByb3BzLm9uQ2xpY2sgJiYgdGhpcy5wcm9wcy5vbkNsaWNrKGUpO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBCdXR0b247XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMk52YlhCdmJtVnVkSE12WW5WMGRHOXVMbXB6ZUNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFUczdRVUZGUVN4SFFVRkhPenRCUVVWSUxFbEJRVWtzVFVGQlRTeERRVUZETzBGQlExZ3NTVUZCU1N4TFFVRkxMRWRCUVVjc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzBGQlF6ZENMRWxCUVVrc1NVRkJTU3hKUVVGSkxFOUJRVThzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXpzN1FVRkZiRU1zTkVKQlFUUkNMSE5DUVVGQk8wVkJRekZDTEUxQlFVMHNSVUZCUlN4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zWlVGQlpTeERRVUZETzBWQlEzUkRMRk5CUVZNc1JVRkJSVHRKUVVOVUxFbEJRVWtzVFVGQlRTeExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwN1NVRkRhRU1zVDBGQlR5eEhRVUZITEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTVHRKUVVNNVFpeEpRVUZKTEUxQlFVMHNTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhOUVVGTk8wZEJRMnBETzBWQlEwUXNUVUZCVFN4RlFVRkZMRmxCUVZrN1NVRkRiRUlzU1VGQlNTeEpRVUZKTEZGQlFWRXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFZEJRVWNzYjBKQlFVTXNTVUZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhKUVVGQkxFVkJRVWtzUTBGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1JVRkJReXhEUVVGRExFZEJRVUVzUlVGQlJ5eERRVUZETEUxQlFVMHNRMEZCUVN4RFFVRkhMRU5CUVVFc1IwRkJSeXhKUVVGSkxFTkJRVU03U1VGRGNFWXNTVUZCU1N4UFFVRlBMRXRCUVVzc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEpRVU16UWl4SlFVRkpMRk5CUVZNc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWTXNSMEZCUnl4dlFrRkJReXhKUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEVsQlFVRXNSVUZCU1N4RFFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVTBGQlV5eEZRVUZETEVOQlFVTXNSMEZCUVN4RlFVRkhMRU5CUVVNc1dVRkJXU3hEUVVGQkxFTkJRVWNzUTBGQlFTeEhRVUZITEVsQlFVa3NRMEZCUXp0SlFVTndSeXhKUVVGSkxFbEJRVWtzVVVGQlVTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1NVRkJTU3h2UWtGQlFTeE5RVUZMTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExFMUJRVThzUTBGQlFTeEZRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJXU3hEUVVGQkxFbEJRVWtzU1VGQlNTeERRVUZETzBGQlF5OUdMRWxCUVVrc1NVRkJTU3hMUVVGTExFTkJRVU03TzBsQlJWWXNTVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUlVGQlJUdE5RVU40UWl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1FVRkRla01zUzBGQlN6czdTVUZGUkN4TFFVRkxMRWRCUVVjN1RVRkRUaXhKUVVGSkxGRkJRVkVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpPMDFCUXpOQ0xFMUJRVTBzVFVGQlRTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwN1RVRkROMElzVDBGQlR5eExRVUZMTEVsQlFVa3NRMEZCUXl4WlFVRlpPMDFCUXpkQ0xGTkJRVk1zUjBGQlJ5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJRenRCUVVOdVF5eExRVUZMTEVOQlFVTTdPMGxCUlVZN1RVRkRSU3h2UWtGQlFTeEhRVUZGTEVWQlFVRXNaMEpCUVVFc1IwRkJRU3hEUVVGRkxFZEJRVWNzUzBGQlR5eERRVUZCTEVWQlFVRTdVVUZEV0N4SlFVRkpMRVZCUVVNN1VVRkRUQ3hKUVVGSkxFVkJRVU03VVVGRFRDeFRRVUZWTzAxQlExUXNRMEZCUVR0TlFVTktPMGRCUTBnN1JVRkRSQ3haUVVGWkxFVkJRVVVzVlVGQlZTeERRVUZETEVWQlFVVTdTVUZEZWtJc1EwRkJReXhEUVVGRExHTkJRV01zUlVGQlJTeERRVUZETzBGQlEzWkNMRWxCUVVrc1EwRkJReXhEUVVGRExHVkJRV1VzUlVGQlJTeERRVUZET3p0SlFVVndRaXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNTVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0SFFVTTNRenRCUVVOSUxFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVklMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzVFVGQlRTeERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5b3FYRzRnS2lCQWFuTjRJRkpsWVdOMExrUlBUVnh1SUNvdlhHNWNiblpoY2lCQ2RYUjBiMjQ3WEc1MllYSWdVbVZoWTNRZ1BTQnlaWEYxYVhKbEtDZHlaV0ZqZENjcE8xeHVkbUZ5SUVsamIyNGdJRDBnY21WeGRXbHlaU2duTGk5cFkyOXVMbXB6ZUNjcE8xeHVYRzVDZFhSMGIyNGdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lHMXBlR2x1Y3pvZ1cxSmxZV04wTG1Ga1pHOXVjeTVRZFhKbFVtVnVaR1Z5VFdsNGFXNWRMRnh1SUNCd2NtOXdWSGx3WlhNNklIdGNiaUFnSUNCcFkyOXVPaUFnSUNBZ1VtVmhZM1F1VUhKdmNGUjVjR1Z6TG5OMGNtbHVaeXhjYmlBZ0lDQnZia05zYVdOck9pQWdVbVZoWTNRdVVISnZjRlI1Y0dWekxtWjFibU1zWEc0Z0lDQWdhSEpsWmpvZ0lDQWdJRkpsWVdOMExsQnliM0JVZVhCbGN5NXpkSEpwYm1kY2JpQWdmU3hjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2RtRnlJR2xqYjI0Z0lDQWdJQ0E5SUhSb2FYTXVjSEp2Y0hNdWFXTnZiaUEvSUR4SlkyOXVJSFI1Y0dVOWUzUm9hWE11Y0hKdmNITXVhV052Ym4wZ2NtVm1QVndpYVdOdmJsd2lJQzgrSURvZ2JuVnNiRHRjYmlBZ0lDQjJZWElnWTJ4aGMzTmxjeUFnSUQwZ1d5ZGlkWFIwYjI0blhUdGNiaUFnSUNCMllYSWdZV1owWlhKSlkyOXVJRDBnZEdocGN5NXdjbTl3Y3k1aFpuUmxja2xqYjI0Z1B5QThTV052YmlCMGVYQmxQWHQwYUdsekxuQnliM0J6TG1GbWRHVnlTV052Ym4wZ2NtVm1QVndpWVdaMFpYSXRhV052Ymx3aUlDOCtJRG9nYm5Wc2JEdGNiaUFnSUNCMllYSWdkR1Y0ZENBZ0lDQWdJRDBnZEdocGN5NXdjbTl3Y3k1MFpYaDBJRDhnS0R4emNHRnVJR05zWVhOelRtRnRaVDFjSW5SbGVIUmNJajU3ZEdocGN5NXdjbTl3Y3k1MFpYaDBmVHd2YzNCaGJqNHBJRG9nYm5Wc2JEdGNiaUFnSUNCMllYSWdjSEp2Y0hNN1hHNWNiaUFnSUNCcFppQW9kR2hwY3k1d2NtOXdjeTVqYkdGemMwNWhiV1VwSUh0Y2JpQWdJQ0FnSUdOc1lYTnpaWE11Y0hWemFDaDBhR2x6TG5CeWIzQnpMbU5zWVhOelRtRnRaU2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdjSEp2Y0hNZ1BTQjdYRzRnSUNBZ0lDQm9jbVZtT2lBZ0lDQWdJQ0IwYUdsekxuQnliM0J6TG1oeVpXWXNYRzRnSUNBZ0lDQmhZM1JwYjI0NklDQWdJQ0IwYUdsekxuQnliM0J6TG1GamRHbHZiaXhjYmlBZ0lDQWdJRzl1UTJ4cFkyczZJQ0FnSUhSb2FYTXVYMmhoYm1Sc1pVTnNhV05yTEZ4dUlDQWdJQ0FnWTJ4aGMzTk9ZVzFsT2lBZ1kyeGhjM05sY3k1cWIybHVLQ2NnSnlsY2JpQWdJQ0I5TzF4dVhHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHhoSUhzdUxpNXdjbTl3YzMwK1hHNGdJQ0FnSUNBZ0lIdHBZMjl1ZlZ4dUlDQWdJQ0FnSUNCN2RHVjRkSDFjYmlBZ0lDQWdJQ0FnZTJGbWRHVnlTV052Ym4xY2JpQWdJQ0FnSUR3dllUNWNiaUFnSUNBcE8xeHVJQ0I5TEZ4dUlDQmZhR0Z1Wkd4bFEyeHBZMnM2SUdaMWJtTjBhVzl1SUNobEtTQjdYRzRnSUNBZ1pTNXdjbVYyWlc1MFJHVm1ZWFZzZENncE8xeHVJQ0FnSUdVdWMzUnZjRkJ5YjNCaFoyRjBhVzl1S0NrN1hHNWNiaUFnSUNCMGFHbHpMbkJ5YjNCekxtOXVRMnhwWTJzZ0ppWWdkR2hwY3k1d2NtOXdjeTV2YmtOc2FXTnJLR1VwTzF4dUlDQjlYRzU5S1R0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQkNkWFIwYjI0N1hHNGlYWDA9IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBJY29uO1xudmFyIF8gICAgID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGljb24sIGN1cnJlbnRseSB1c2luZyB0aGUgZm9udCBhd2Vzb21lIGljb24gbGlicmFyeVxuICpcbiAqIEBleGFtcGxlc1xuICogPEljb24gdHlwZT1cImNoZWNrXCIgLz5cbiAqIDxJY29uIHR5cGU9XCJ1c2VyXCIgY2xhc3NOYW1lPVwibXV0ZWRcIiAvPlxuICogPEljb24gdHlwZT1cImJhblwiIHN0YWNrPVwiMnhcIiAvPlxuICovXG5JY29uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkljb25cIixcbiAgcHJvcFR5cGVzOiB7XG4gICAgc3RhY2s6ICAgICAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICB0eXBlOiAgICAgICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2xhc3NOYW1lOiAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuICBtaXhpbnM6IFtSZWFjdC5hZGRvbnMuUHVyZVJlbmRlck1peGluXSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNsYXNzZXMgPSBbJ2ZhIGZhLWljb24nXTtcbiAgICB2YXIgcHJvcHMgICA9IF8ub21pdCh0aGlzLnByb3BzLCBbJ3N0YWNrJywgJ3R5cGUnLCAnY2xhc3NOYW1lJ10pO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuc3RhY2spIHtcbiAgICAgIGNsYXNzZXMucHVzaCgnZmEtc3RhY2stJyArIHRoaXMucHJvcHMuc3RhY2spO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnNwaW4pIHtcbiAgICAgIGNsYXNzZXMucHVzaCgnZmEtc3BpbicpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnR5cGUpIHtcbiAgICAgIGNsYXNzZXMucHVzaCgnZmEtJyArIHRoaXMucHJvcHMudHlwZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY2xhc3NOYW1lKSB7XG4gICAgICBjbGFzc2VzLnB1c2godGhpcy5wcm9wcy5jbGFzc05hbWUpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuc2l6ZSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdmYS0nICsgdGhpcy5wcm9wcy5zaXplKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlcIiwgUmVhY3QuX19zcHJlYWQoe30sICBwcm9wcywge2NsYXNzTmFtZTogY2xhc3Nlcy5qb2luKCcgJyl9KSlcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBJY29uO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDJOdmJYQnZibVZ1ZEhNdmFXTnZiaTVxYzNnaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRTdPMEZCUlVFc1IwRkJSenM3UVVGRlNDeEpRVUZKTEVsQlFVa3NRMEZCUXp0QlFVTlVMRWxCUVVrc1EwRkJReXhQUVVGUExFOUJRVThzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXp0QlFVTnNReXhKUVVGSkxFdEJRVXNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN08wRkJSVGRDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UjBGRlJ6dEJRVU5JTERCQ1FVRXdRaXh2UWtGQlFUdEZRVU40UWl4VFFVRlRMRVZCUVVVN1NVRkRWQ3hMUVVGTExFOUJRVThzUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4TlFVRk5PMGxCUTJ4RExFbEJRVWtzVVVGQlVTeExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwc1EwRkJReXhWUVVGVk8wbEJRemRETEZOQlFWTXNSMEZCUnl4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFMUJRVTA3UjBGRGJrTTdSVUZEUkN4TlFVRk5MRVZCUVVVc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETEdWQlFXVXNRMEZCUXp0RlFVTjBReXhOUVVGTkxFVkJRVVVzV1VGQldUdEpRVU5zUWl4SlFVRkpMRTlCUVU4c1IwRkJSeXhEUVVGRExGbEJRVmtzUTBGQlF5eERRVUZETzBGQlEycERMRWxCUVVrc1NVRkJTU3hMUVVGTExFdEJRVXNzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhGUVVGRkxFTkJRVU1zVDBGQlR5eEZRVUZGTEUxQlFVMHNSVUZCUlN4WFFVRlhMRU5CUVVNc1EwRkJReXhEUVVGRE96dEpRVVZxUlN4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN5eEZRVUZGTzAxQlEzQkNMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03UVVGRGJrUXNTMEZCU3pzN1NVRkZSQ3hKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RlFVRkZPMDFCUTI1Q0xFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1FVRkRPVUlzUzBGQlN6czdTVUZGUkN4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeEZRVUZGTzAxQlEyNUNMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRE5VTXNTMEZCU3pzN1NVRkZSQ3hKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4RlFVRkZPMDFCUTNoQ0xFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU03UVVGRGVFTXNTMEZCU3pzN1NVRkZSQ3hKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RlFVRkZPMDFCUTI1Q0xFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdRVUZETlVNc1MwRkJTenM3U1VGRlJEdE5RVU5GTEc5Q1FVRkJMRWRCUVVVc1JVRkJRU3huUWtGQlFTeEhRVUZCTEVOQlFVVXNSMEZCUnl4TFFVRkxMRVZCUVVNc1EwRkJReXhEUVVGQkxGTkJRVUVzUlVGQlV5eERRVUZGTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGSExFTkJRVUVzUTBGQlNTeERRVUZCTzAxQlEyaEVPMGRCUTBnN1FVRkRTQ3hEUVVGRExFTkJRVU1zUTBGQlF6czdRVUZGU0N4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExFbEJRVWtzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dRR3B6ZUNCU1pXRmpkQzVFVDAxY2JpQXFMMXh1WEc1MllYSWdTV052Ymp0Y2JuWmhjaUJmSUNBZ0lDQTlJSEpsY1hWcGNtVW9KM1Z1WkdWeWMyTnZjbVVuS1R0Y2JuWmhjaUJTWldGamRDQTlJSEpsY1hWcGNtVW9KM0psWVdOMEp5azdYRzVjYmk4cUtseHVJQ29nUTNKbFlYUmxjeUJoYmlCcFkyOXVMQ0JqZFhKeVpXNTBiSGtnZFhOcGJtY2dkR2hsSUdadmJuUWdZWGRsYzI5dFpTQnBZMjl1SUd4cFluSmhjbmxjYmlBcVhHNGdLaUJBWlhoaGJYQnNaWE5jYmlBcUlEeEpZMjl1SUhSNWNHVTlYQ0pqYUdWamExd2lJQzgrWEc0Z0tpQThTV052YmlCMGVYQmxQVndpZFhObGNsd2lJR05zWVhOelRtRnRaVDFjSW0xMWRHVmtYQ0lnTHo1Y2JpQXFJRHhKWTI5dUlIUjVjR1U5WENKaVlXNWNJaUJ6ZEdGamF6MWNJako0WENJZ0x6NWNiaUFxTDF4dVNXTnZiaUE5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JpQWdjSEp2Y0ZSNWNHVnpPaUI3WEc0Z0lDQWdjM1JoWTJzNklDQWdJQ0FnVW1WaFkzUXVVSEp2Y0ZSNWNHVnpMbk4wY21sdVp5eGNiaUFnSUNCMGVYQmxPaUFnSUNBZ0lDQlNaV0ZqZEM1UWNtOXdWSGx3WlhNdWMzUnlhVzVuTG1selVtVnhkV2x5WldRc1hHNGdJQ0FnWTJ4aGMzTk9ZVzFsT2lBZ1VtVmhZM1F1VUhKdmNGUjVjR1Z6TG5OMGNtbHVaMXh1SUNCOUxGeHVJQ0J0YVhocGJuTTZJRnRTWldGamRDNWhaR1J2Ym5NdVVIVnlaVkpsYm1SbGNrMXBlR2x1WFN4Y2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkbUZ5SUdOc1lYTnpaWE1nUFNCYkoyWmhJR1poTFdsamIyNG5YVHRjYmlBZ0lDQjJZWElnY0hKdmNITWdJQ0E5SUY4dWIyMXBkQ2gwYUdsekxuQnliM0J6TENCYkozTjBZV05ySnl3Z0ozUjVjR1VuTENBblkyeGhjM05PWVcxbEoxMHBPMXh1WEc0Z0lDQWdhV1lnS0hSb2FYTXVjSEp2Y0hNdWMzUmhZMnNwSUh0Y2JpQWdJQ0FnSUdOc1lYTnpaWE11Y0hWemFDZ25abUV0YzNSaFkyc3RKeUFySUhSb2FYTXVjSEp2Y0hNdWMzUmhZMnNwTzF4dUlDQWdJSDFjYmx4dUlDQWdJR2xtSUNoMGFHbHpMbkJ5YjNCekxuTndhVzRwSUh0Y2JpQWdJQ0FnSUdOc1lYTnpaWE11Y0hWemFDZ25abUV0YzNCcGJpY3BPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2gwYUdsekxuQnliM0J6TG5SNWNHVXBJSHRjYmlBZ0lDQWdJR05zWVhOelpYTXVjSFZ6YUNnblptRXRKeUFySUhSb2FYTXVjSEp2Y0hNdWRIbHdaU2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdhV1lnS0hSb2FYTXVjSEp2Y0hNdVkyeGhjM05PWVcxbEtTQjdYRzRnSUNBZ0lDQmpiR0Z6YzJWekxuQjFjMmdvZEdocGN5NXdjbTl3Y3k1amJHRnpjMDVoYldVcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tIUm9hWE11Y0hKdmNITXVjMmw2WlNrZ2UxeHVJQ0FnSUNBZ1kyeGhjM05sY3k1d2RYTm9LQ2RtWVMwbklDc2dkR2hwY3k1d2NtOXdjeTV6YVhwbEtUdGNiaUFnSUNCOVhHNWNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEdrZ2V5NHVMbkJ5YjNCemZTQmpiR0Z6YzA1aGJXVTllMk5zWVhOelpYTXVhbTlwYmlnbklDY3BmVDQ4TDJrK1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdTV052Ymp0Y2JpSmRmUT09IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBTb3J0SW5kaWNhdG9yO1xudmFyIGNsYXNzX21hcDtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgSWNvbiA9IHJlcXVpcmUoJy4vaWNvbi5qc3gnKTtcblxuY2xhc3NfbWFwID0ge1xuICBhc2M6ICAnc29ydC11cCcsXG4gIGRlc2M6ICdzb3J0LWRvd24nXG59O1xuXG5Tb3J0SW5kaWNhdG9yID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlNvcnRJbmRpY2F0b3JcIixcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGljb24gICAgICA9IG51bGw7XG4gICAgdmFyIGRpcmVjdGlvbiA9IGNsYXNzX21hcFt0aGlzLnByb3BzLmRpcmVjdGlvbl07XG5cbiAgICBpZiAoZGlyZWN0aW9uKSB7XG4gICAgICBpY29uID0gUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogZGlyZWN0aW9uLCBzdGFjazogXCIxeFwifSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwiZmEtc3RhY2sgc29ydGVyXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogXCJzb3J0XCIsIHN0YWNrOiBcIjF4XCJ9KSwgXG4gICAgICAgIGljb25cbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb3J0SW5kaWNhdG9yO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDJOdmJYQnZibVZ1ZEhNdmMyOXlkRjlwYm1ScFkyRjBiM0l1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPenRCUVVWQkxFZEJRVWM3TzBGQlJVZ3NTVUZCU1N4aFFVRmhMRU5CUVVNN1FVRkRiRUlzU1VGQlNTeFRRVUZUTEVOQlFVTTdRVUZEWkN4SlFVRkpMRXRCUVVzc1IwRkJSeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdRVUZETjBJc1NVRkJTU3hKUVVGSkxFZEJRVWNzVDBGQlR5eERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPenRCUVVWcVF5eFRRVUZUTEVkQlFVYzdSVUZEVml4SFFVRkhMRWRCUVVjc1UwRkJVenRGUVVObUxFbEJRVWtzUlVGQlJTeFhRVUZYTzBGQlEyNUNMRU5CUVVNc1EwRkJRenM3UVVGRlJpeHRRMEZCYlVNc05rSkJRVUU3UlVGRGFrTXNUVUZCVFN4RlFVRkZMRmxCUVZrN1NVRkRiRUlzU1VGQlNTeEpRVUZKTEZGQlFWRXNTVUZCU1N4RFFVRkRPMEZCUTNwQ0xFbEJRVWtzU1VGQlNTeFRRVUZUTEVkQlFVY3NVMEZCVXl4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdPMGxCUldoRUxFbEJRVWtzVTBGQlV5eEZRVUZGTzAxQlEySXNTVUZCU1N4SFFVRkhMRzlDUVVGRExFbEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNTVUZCUVN4RlFVRkpMRU5CUVVVc1UwRkJVeXhGUVVGRExFTkJRVU1zUzBGQlFTeEZRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkJMRU5CUVVjc1EwRkJRU3hEUVVGRE8wRkJRMnhFTEV0QlFVczdPMGxCUlVRN1RVRkRSU3h2UWtGQlFTeE5RVUZMTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExHbENRVUZyUWl4RFFVRkJMRVZCUVVFN1VVRkRhRU1zYjBKQlFVTXNTVUZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhKUVVGQkxFVkJRVWtzUTBGQlF5eE5RVUZCTEVWQlFVMHNRMEZCUXl4TFFVRkJMRVZCUVVzc1EwRkJReXhKUVVGSkxFTkJRVUVzUTBGQlJ5eERRVUZCTEVWQlFVRTdVVUZET1VJc1NVRkJTenROUVVORUxFTkJRVUU3VFVGRFVEdEhRVU5JTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4aFFVRmhMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlFQnFjM2dnVW1WaFkzUXVSRTlOWEc0Z0tpOWNibHh1ZG1GeUlGTnZjblJKYm1ScFkyRjBiM0k3WEc1MllYSWdZMnhoYzNOZmJXRndPMXh1ZG1GeUlGSmxZV04wSUQwZ2NtVnhkV2x5WlNnbmNtVmhZM1FuS1R0Y2JuWmhjaUJKWTI5dUlEMGdjbVZ4ZFdseVpTZ25MaTlwWTI5dUxtcHplQ2NwTzF4dVhHNWpiR0Z6YzE5dFlYQWdQU0I3WEc0Z0lHRnpZem9nSUNkemIzSjBMWFZ3Snl4Y2JpQWdaR1Z6WXpvZ0ozTnZjblF0Wkc5M2JpZGNibjA3WEc1Y2JsTnZjblJKYm1ScFkyRjBiM0lnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCcFkyOXVJQ0FnSUNBZ1BTQnVkV3hzTzF4dUlDQWdJSFpoY2lCa2FYSmxZM1JwYjI0Z1BTQmpiR0Z6YzE5dFlYQmJkR2hwY3k1d2NtOXdjeTVrYVhKbFkzUnBiMjVkTzF4dVhHNGdJQ0FnYVdZZ0tHUnBjbVZqZEdsdmJpa2dlMXh1SUNBZ0lDQWdhV052YmlBOUlEeEpZMjl1SUhSNWNHVTllMlJwY21WamRHbHZibjBnYzNSaFkyczlYQ0l4ZUZ3aUlDOCtPMXh1SUNBZ0lIMWNibHh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOGMzQmhiaUJqYkdGemMwNWhiV1U5WENKbVlTMXpkR0ZqYXlCemIzSjBaWEpjSWo1Y2JpQWdJQ0FnSUNBZ1BFbGpiMjRnZEhsd1pUMWNJbk52Y25SY0lpQnpkR0ZqYXoxY0lqRjRYQ0lnTHo1Y2JpQWdJQ0FnSUNBZ2UybGpiMjU5WEc0Z0lDQWdJQ0E4TDNOd1lXNCtYRzRnSUNBZ0tUdGNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVTI5eWRFbHVaR2xqWVhSdmNqdGNiaUpkZlE9PSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgVGFicztcbnZhciBSZWFjdCAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBCdXR0b24gID0gcmVxdWlyZSgnLi9idXR0b24uanN4Jyk7XG5cblRhYnMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGFic1wiLFxuICBwcm9wVHlwZXM6IHtcbiAgICBhY3Rpb246IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIHRhYnM6ICAgUmVhY3QuUHJvcFR5cGVzLmFycmF5XG4gIH0sXG4gIG1peGluczogW1JlYWN0LmFkZG9ucy5QdXJlUmVuZGVyTWl4aW5dLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIHtjbGFzc05hbWU6IFwidGFic1wifSwgXG4gICAgICAgIHRoaXMuX2J1aWxkVGFicygpXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgX2J1aWxkVGFiczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnRhYnMubWFwKGZ1bmN0aW9uICh0YWIsIGluZGV4KSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwge2tleTogaW5kZXh9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwge29uQ2xpY2s6IHRhYi5hY3Rpb24sIGljb246IHRhYi5pY29uLCB0ZXh0OiB0YWIudGV4dH0pXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSwgdGhpcyk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYnM7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMk52YlhCdmJtVnVkSE12ZEdGaWN5NXFjM2dpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN08wRkJSVUVzUjBGQlJ6czdRVUZGU0N4SlFVRkpMRWxCUVVrc1EwRkJRenRCUVVOVUxFbEJRVWtzUzBGQlN5eExRVUZMTEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVNdlFpeEpRVUZKTEUxQlFVMHNTVUZCU1N4UFFVRlBMRU5CUVVNc1kwRkJZeXhEUVVGRExFTkJRVU03TzBGQlJYUkRMREJDUVVFd1FpeHZRa0ZCUVR0RlFVTjRRaXhUUVVGVExFVkJRVVU3U1VGRFZDeE5RVUZOTEVWQlFVVXNTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhKUVVGSk8wbEJRelZDTEVsQlFVa3NTVUZCU1N4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFdEJRVXM3UjBGRE9VSTdSVUZEUkN4TlFVRk5MRVZCUVVVc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETEdWQlFXVXNRMEZCUXp0RlFVTjBReXhOUVVGTkxFVkJRVVVzV1VGQldUdEpRVU5zUWp0TlFVTkZMRzlDUVVGQkxFbEJRVWNzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc1RVRkJUeXhEUVVGQkxFVkJRVUU3VVVGRGJFSXNTVUZCU1N4RFFVRkRMRlZCUVZVc1JVRkJSenROUVVOb1FpeERRVUZCTzAxQlEwdzdSMEZEU0R0RlFVTkVMRlZCUVZVc1JVRkJSU3haUVVGWk8wbEJRM1JDTEU5QlFVOHNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFWVXNSMEZCUnl4RlFVRkZMRXRCUVVzc1JVRkJSVHROUVVNdlF6dFJRVU5GTEc5Q1FVRkJMRWxCUVVjc1JVRkJRU3hEUVVGQkxFTkJRVU1zUjBGQlFTeEZRVUZITEVOQlFVVXNTMEZCVHl4RFFVRkJMRVZCUVVFN1ZVRkRaQ3h2UWtGQlF5eE5RVUZOTEVWQlFVRXNRMEZCUVN4RFFVRkRMRTlCUVVFc1JVRkJUeXhEUVVGRkxFZEJRVWNzUTBGQlF5eE5RVUZOTEVWQlFVTXNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJSU3hIUVVGSExFTkJRVU1zU1VGQlNTeEZRVUZETEVOQlFVTXNTVUZCUVN4RlFVRkpMRU5CUVVVc1IwRkJSeXhEUVVGRExFbEJRVXNzUTBGQlFTeERRVUZITEVOQlFVRTdVVUZETlVRc1EwRkJRVHRSUVVOTU8wdEJRMGdzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0SFFVTldPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhKUVVGSkxFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUZSaFluTTdYRzUyWVhJZ1VtVmhZM1FnSUNBOUlISmxjWFZwY21Vb0ozSmxZV04wSnlrN1hHNTJZWElnUW5WMGRHOXVJQ0E5SUhKbGNYVnBjbVVvSnk0dlluVjBkRzl1TG1wemVDY3BPMXh1WEc1VVlXSnpJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dUlDQndjbTl3Vkhsd1pYTTZJSHRjYmlBZ0lDQmhZM1JwYjI0NklGSmxZV04wTGxCeWIzQlVlWEJsY3k1bWRXNWpMRnh1SUNBZ0lIUmhZbk02SUNBZ1VtVmhZM1F1VUhKdmNGUjVjR1Z6TG1GeWNtRjVYRzRnSUgwc1hHNGdJRzFwZUdsdWN6b2dXMUpsWVdOMExtRmtaRzl1Y3k1UWRYSmxVbVZ1WkdWeVRXbDRhVzVkTEZ4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BIVnNJR05zWVhOelRtRnRaVDFjSW5SaFluTmNJajVjYmlBZ0lDQWdJQ0FnZTNSb2FYTXVYMkoxYVd4a1ZHRmljeWdwZlZ4dUlDQWdJQ0FnUEM5MWJENWNiaUFnSUNBcE8xeHVJQ0I5TEZ4dUlDQmZZblZwYkdSVVlXSnpPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNdWNISnZjSE11ZEdGaWN5NXRZWEFvWm5WdVkzUnBiMjRnS0hSaFlpd2dhVzVrWlhncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBZ0lEeHNhU0JyWlhrOWUybHVaR1Y0ZlQ1Y2JpQWdJQ0FnSUNBZ0lDQThRblYwZEc5dUlHOXVRMnhwWTJzOWUzUmhZaTVoWTNScGIyNTlJR2xqYjI0OWUzUmhZaTVwWTI5dWZTQjBaWGgwUFh0MFlXSXVkR1Y0ZEgwZ0x6NWNiaUFnSUNBZ0lDQWdQQzlzYVQ1Y2JpQWdJQ0FnSUNrN1hHNGdJQ0FnZlN3Z2RHaHBjeWs3WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlGUmhZbk03WEc0aVhYMD0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFRkO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuVGQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGRcIixcbiAgbWl4aW5zOiBbUmVhY3QuYWRkb25zLlB1cmVSZW5kZXJNaXhpbl0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBSZWFjdC5fX3NwcmVhZCh7fSwgIHRoaXMucHJvcHMpLCBcbiAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlblxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRkO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDJOdmJYQnZibVZ1ZEhNdmRHUXVhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRVVZCTEVkQlFVYzdPMEZCUlVnc1NVRkJTU3hGUVVGRkxFTkJRVU03UVVGRFVDeEpRVUZKTEV0QlFVc3NSMEZCUnl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03TzBGQlJUZENMSGRDUVVGM1FpeHJRa0ZCUVR0RlFVTjBRaXhOUVVGTkxFVkJRVVVzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4RFFVRkRMR1ZCUVdVc1EwRkJRenRCUVVONFF5eEZRVUZGTEUxQlFVMHNSVUZCUlN4WlFVRlpPenRKUVVWc1FqdE5RVU5GTEc5Q1FVRkJMRWxCUVVjc1JVRkJRU3huUWtGQlFTeEhRVUZCTEVOQlFVVXNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJUeXhEUVVGQkxFVkJRVUU3VVVGRGFrSXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGVE8wMUJRMnhDTEVOQlFVRTdUVUZEVER0SFFVTklPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhGUVVGRkxFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUZSa08xeHVkbUZ5SUZKbFlXTjBJRDBnY21WeGRXbHlaU2duY21WaFkzUW5LVHRjYmx4dVZHUWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lHMXBlR2x1Y3pvZ1cxSmxZV04wTG1Ga1pHOXVjeTVRZFhKbFVtVnVaR1Z5VFdsNGFXNWRMRnh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1SUNncElIdGNibHh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOGRHUWdleTR1TG5Sb2FYTXVjSEp2Y0hOOVBseHVJQ0FnSUNBZ0lDQjdkR2hwY3k1d2NtOXdjeTVqYUdsc1pISmxibjFjYmlBZ0lDQWdJRHd2ZEdRK1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdWR1E3WEc0aVhYMD0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFRoO1xudmFyIFJlYWN0ICAgICAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgQmFja2JvbmUgICAgICAgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBTb3J0SW5kaWNhdG9yICAgPSByZXF1aXJlKCcuL3NvcnRfaW5kaWNhdG9yLmpzeCcpO1xuXG5UaCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUaFwiLFxuICBwcm9wVHlwZXM6IHtcbiAgICB0cmlnZ2VyU29ydDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2xhc3NlcyA9IFt0aGlzLnByb3BzLmNsYXNzTmFtZSB8fCAnJ107XG4gICAgdmFyIHNvcnRfaW5kaWNhdG9yID0gbnVsbDtcbiAgICB2YXIgbmV3X3Byb3BzID0ge3N0eWxlOnt9fTtcblxuICAgIGlmICh0aGlzLnByb3BzLnRyaWdnZXJTb3J0IHx8IHRoaXMucHJvcHMuc29ydERpcmVjdGlvbikge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdzb3J0YWJsZScpO1xuXG4gICAgICBzb3J0X2luZGljYXRvciA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoU29ydEluZGljYXRvciwge2RpcmVjdGlvbjogdGhpcy5wcm9wcy5zb3J0RGlyZWN0aW9ufSlcbiAgICB9XG5cbiAgICBbJ21pbmltYWwnLCAnbG9ja2VkJywgJ3Jlc2l6YWJsZSddLmZvckVhY2goZnVuY3Rpb24gKHZhbCkge1xuICAgICAgaWYgKHRoaXMucHJvcHNbdmFsXSkge1xuICAgICAgICBjbGFzc2VzLnB1c2godmFsKTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcblxuICAgIGlmICh0aGlzLnByb3BzLndpZHRoKSB7XG4gICAgICBuZXdfcHJvcHMuc3R5bGUud2lkdGggPSB0aGlzLnByb3BzLndpZHRoO1xuICAgIH1cblxuICAgIG5ld19wcm9wcy5jbGFzc05hbWUgPSBjbGFzc2VzLmxlbmd0aCA+IDEgPyBjbGFzc2VzLmpvaW4oJyAnKSA6IGNsYXNzZXNbMF07XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgbmV3X3Byb3BzLCB7b25DbGljazogdGhpcy5faGFuZGxlQ2xpY2t9KSwgXG4gICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW4sIFxuICAgICAgICBzb3J0X2luZGljYXRvclxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIF9oYW5kbGVDbGljazogZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5oYW5kbGVDbGljaykge1xuICAgICAgdGhpcy5wcm9wcy5oYW5kbGVDbGljayhlKTtcbiAgICB9XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRoO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDJOdmJYQnZibVZ1ZEhNdmRHZ3Vhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRVVZCTEVkQlFVYzdPMEZCUlVnc1NVRkJTU3hGUVVGRkxFTkJRVU03UVVGRFVDeEpRVUZKTEV0QlFVc3NZVUZCWVN4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRGRrTXNTVUZCU1N4UlFVRlJMRlZCUVZVc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETzBGQlF6RkRMRWxCUVVrc1lVRkJZU3hMUVVGTExFOUJRVThzUTBGQlF5eHpRa0ZCYzBJc1EwRkJReXhEUVVGRE96dEJRVVYwUkN4M1FrRkJkMElzYTBKQlFVRTdSVUZEZEVJc1UwRkJVeXhGUVVGRk8wbEJRMVFzVjBGQlZ5eEZRVUZGTEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1RVRkJUVHRIUVVOd1F6dEZRVU5FTEUxQlFVMHNSVUZCUlN4WlFVRlpPMGxCUTJ4Q0xFbEJRVWtzVDBGQlR5eEhRVUZITEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhUUVVGVExFbEJRVWtzUlVGQlJTeERRVUZETEVOQlFVTTdTVUZETTBNc1NVRkJTU3hqUVVGakxFZEJRVWNzU1VGQlNTeERRVUZETzBGQlF6bENMRWxCUVVrc1NVRkJTU3hUUVVGVExFZEJRVWNzUTBGQlF5eExRVUZMTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNN08wbEJSVE5DTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhYUVVGWExFbEJRVWtzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4aFFVRmhMRVZCUVVVN1FVRkROVVFzVFVGQlRTeFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRE96dE5RVVY2UWl4alFVRmpMRWRCUVVjc2IwSkJRVU1zWVVGQllTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEdGQlFXTXNRMEZCUVN4RFFVRkhMRU5CUVVFN1FVRkROMFVzUzBGQlN6czdTVUZGUkN4RFFVRkRMRk5CUVZNc1JVRkJSU3hSUVVGUkxFVkJRVVVzVjBGQlZ5eERRVUZETEVOQlFVTXNUMEZCVHl4RFFVRkRMRlZCUVZVc1IwRkJSeXhGUVVGRk8wMUJRM2hFTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJUdFJRVU51UWl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzA5QlEyNUNPMEZCUTFBc1MwRkJTeXhGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZET3p0SlFVVlVMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTEVWQlFVVTdUVUZEY0VJc1UwRkJVeXhEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU03UVVGREwwTXNTMEZCU3pzN1FVRkZUQ3hKUVVGSkxGTkJRVk1zUTBGQlF5eFRRVUZUTEVkQlFVY3NUMEZCVHl4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFZEJRVWNzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1IwRkJSeXhQUVVGUExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdPMGxCUlRGRk8wMUJRMFVzYjBKQlFVRXNTVUZCUnl4RlFVRkJMR2RDUVVGQkxFZEJRVUVzUTBGQlJTeEhRVUZITEZOQlFWTXNSVUZCUXl4RFFVRkRMRU5CUVVFc1QwRkJRU3hGUVVGUExFTkJRVVVzU1VGQlNTeERRVUZETEZsQlFXTXNRMEZCUVN4RFFVRkJMRVZCUVVFN1VVRkROVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UlFVRlJMRVZCUVVNN1VVRkRjRUlzWTBGQlpUdE5RVU5pTEVOQlFVRTdUVUZEVER0SFFVTklPMFZCUTBRc1dVRkJXU3hGUVVGRkxGVkJRVlVzUTBGQlF5eEZRVUZGTzBsQlEzcENMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFhRVUZYTEVWQlFVVTdUVUZETVVJc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1MwRkRNMEk3UjBGRFJqdEJRVU5JTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NSVUZCUlN4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlvcVhHNGdLaUJBYW5ONElGSmxZV04wTGtSUFRWeHVJQ292WEc1Y2JuWmhjaUJVYUR0Y2JuWmhjaUJTWldGamRDQWdJQ0FnSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDY3BPMXh1ZG1GeUlFSmhZMnRpYjI1bElDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0oySmhZMnRpYjI1bEp5azdYRzUyWVhJZ1UyOXlkRWx1WkdsallYUnZjaUFnSUQwZ2NtVnhkV2x5WlNnbkxpOXpiM0owWDJsdVpHbGpZWFJ2Y2k1cWMzZ25LVHRjYmx4dVZHZ2dQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lIQnliM0JVZVhCbGN6b2dlMXh1SUNBZ0lIUnlhV2RuWlhKVGIzSjBPaUJTWldGamRDNVFjbTl3Vkhsd1pYTXVjM1J5YVc1blhHNGdJSDBzWEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJqYkdGemMyVnpJRDBnVzNSb2FYTXVjSEp2Y0hNdVkyeGhjM05PWVcxbElIeDhJQ2NuWFR0Y2JpQWdJQ0IyWVhJZ2MyOXlkRjlwYm1ScFkyRjBiM0lnUFNCdWRXeHNPMXh1SUNBZ0lIWmhjaUJ1WlhkZmNISnZjSE1nUFNCN2MzUjViR1U2ZTMxOU8xeHVYRzRnSUNBZ2FXWWdLSFJvYVhNdWNISnZjSE11ZEhKcFoyZGxjbE52Y25RZ2ZId2dkR2hwY3k1d2NtOXdjeTV6YjNKMFJHbHlaV04wYVc5dUtTQjdYRzRnSUNBZ0lDQmpiR0Z6YzJWekxuQjFjMmdvSjNOdmNuUmhZbXhsSnlrN1hHNWNiaUFnSUNBZ0lITnZjblJmYVc1a2FXTmhkRzl5SUQwZ1BGTnZjblJKYm1ScFkyRjBiM0lnWkdseVpXTjBhVzl1UFh0MGFHbHpMbkJ5YjNCekxuTnZjblJFYVhKbFkzUnBiMjU5SUM4K1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnV3lkdGFXNXBiV0ZzSnl3Z0oyeHZZMnRsWkNjc0lDZHlaWE5wZW1GaWJHVW5YUzVtYjNKRllXTm9LR1oxYm1OMGFXOXVJQ2gyWVd3cElIdGNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxuQnliM0J6VzNaaGJGMHBJSHRjYmlBZ0lDQWdJQ0FnWTJ4aGMzTmxjeTV3ZFhOb0tIWmhiQ2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmU3dnZEdocGN5azdYRzVjYmlBZ0lDQnBaaUFvZEdocGN5NXdjbTl3Y3k1M2FXUjBhQ2tnZTF4dUlDQWdJQ0FnYm1WM1gzQnliM0J6TG5OMGVXeGxMbmRwWkhSb0lEMGdkR2hwY3k1d2NtOXdjeTUzYVdSMGFEdGNiaUFnSUNCOVhHNWNiaUFnSUNCdVpYZGZjSEp2Y0hNdVkyeGhjM05PWVcxbElEMGdZMnhoYzNObGN5NXNaVzVuZEdnZ1BpQXhJRDhnWTJ4aGMzTmxjeTVxYjJsdUtDY2dKeWtnT2lCamJHRnpjMlZ6V3pCZE8xeHVYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4MGFDQjdMaTR1Ym1WM1gzQnliM0J6ZlNCdmJrTnNhV05yUFh0MGFHbHpMbDlvWVc1a2JHVkRiR2xqYTMwK1hHNGdJQ0FnSUNBZ0lIdDBhR2x6TG5CeWIzQnpMbU5vYVd4a2NtVnVmVnh1SUNBZ0lDQWdJQ0I3YzI5eWRGOXBibVJwWTJGMGIzSjlYRzRnSUNBZ0lDQThMM1JvUGx4dUlDQWdJQ2s3WEc0Z0lIMHNYRzRnSUY5b1lXNWtiR1ZEYkdsamF6b2dablZ1WTNScGIyNGdLR1VwSUh0Y2JpQWdJQ0JwWmlBb2RHaHBjeTV3Y205d2N5NW9ZVzVrYkdWRGJHbGpheWtnZTF4dUlDQWdJQ0FnZEdocGN5NXdjbTl3Y3k1b1lXNWtiR1ZEYkdsamF5aGxLVHRjYmlBZ0lDQjlYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUZSb08xeHVJbDE5IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBUcjtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cblRyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRyXCIsXG4gIG1peGluczogW1JlYWN0LmFkZG9ucy5QdXJlUmVuZGVyTWl4aW5dLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgdGhpcy5wcm9wcyksIFxuICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVHI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMk52YlhCdmJtVnVkSE12ZEhJdWFuTjRJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCT3p0QlFVVkJMRWRCUVVjN08wRkJSVWdzU1VGQlNTeEZRVUZGTEVOQlFVTTdRVUZEVUN4SlFVRkpMRXRCUVVzc1IwRkJSeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdPMEZCUlRkQ0xIZENRVUYzUWl4clFrRkJRVHRGUVVOMFFpeE5RVUZOTEVWQlFVVXNRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExHVkJRV1VzUTBGQlF6dEZRVU4wUXl4TlFVRk5MRVZCUVVVc1dVRkJXVHRKUVVOc1FqdE5RVU5GTEc5Q1FVRkJMRWxCUVVjc1JVRkJRU3huUWtGQlFTeEhRVUZCTEVOQlFVVXNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJUeXhEUVVGQkxFVkJRVUU3VVVGRGFrSXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGVE8wMUJRMnhDTEVOQlFVRTdUVUZEVER0SFFVTklPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhGUVVGRkxFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUZSeU8xeHVkbUZ5SUZKbFlXTjBJRDBnY21WeGRXbHlaU2duY21WaFkzUW5LVHRjYmx4dVZISWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lHMXBlR2x1Y3pvZ1cxSmxZV04wTG1Ga1pHOXVjeTVRZFhKbFVtVnVaR1Z5VFdsNGFXNWRMRnh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEhSeUlIc3VMaTUwYUdsekxuQnliM0J6ZlQ1Y2JpQWdJQ0FnSUNBZ2UzUm9hWE11Y0hKdmNITXVZMmhwYkdSeVpXNTlYRzRnSUNBZ0lDQThMM1J5UGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlGUnlPMXh1SWwxOSIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgREFURV9GT1JNQVQ6ICdNTU0gRCwgWVlZWSBoOm1tOnNzIGEnXG59O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDJOdmJuTjBZVzUwY3k1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3haUVVGWkxFTkJRVU03TzBGQlJXSXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSenRGUVVObUxGZEJRVmNzUlVGQlJTeDFRa0ZCZFVJN1EwRkRja01zUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbHdpZFhObElITjBjbWxqZEZ3aU8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJSHRjYmlBZ1JFRlVSVjlHVDFKTlFWUTZJQ2ROVFUwZ1JDd2dXVmxaV1NCb09tMXRPbk56SUdFblhHNTlPMXh1SWwxOSIsInZhciBwZW9wbGUgICAgID0gW251bGwsICdIYW5rIEpvbmVzJywgJ1JvYmVydCBTYWxmb3JkJ107XG52YXIgZ3JvdXBzICAgICA9IFtudWxsLCAnQE8mRyBMMiddO1xudmFyIHN1YnR5cGVzICAgPSBbJ2FsYXJtIGlzc3VlJywgJ3Byb2R1Y3Rpb24gaXNzdWUnLCAnY29tbSBpc3N1ZSddO1xudmFyIGRldmljZXMgICAgPSBbJ0x1ZmtvIFdhbHJ1cycsICdNYW5jaGlsZCBGcml0eicsICdBZGVwdCBOb2RlJ107XG52YXIgdHlwZXMgICAgICA9IFsnV2VsbCBzdXBwb3J0J107XG52YXIgcmVwb3J0ZXJzICA9IFsnQnJpYW4nLCAnU2hhaGlkJywgJ1JhamVzaCddO1xudmFyIHN0YXR1c2VzICAgPSBbJ2Nsb3NlZCcsICdyZXNvbHZlZCcsICdvcGVuJywgJ2FjdGl2ZSddO1xudmFyIHByaW9yaXRpZXMgPSBbMSwyLDMsNCw1XTtcblxuZnVuY3Rpb24gcmFuZG9taXplIChhcnIpIHtcbiAgcmV0dXJuIGFycltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnIubGVuZ3RoKV07XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlIChudW0pIHtcbiAgdmFyIGk7XG4gIHZhciB2YWx1ZXMgPSBbXTtcblxuICBmb3IgKGkgPSAwOyBpIDwgbnVtOyBpKyspIHtcbiAgICB2YWx1ZXMucHVzaCh7XG4gICAgICBzdGF0dXM6ICAgICAgICAgICAgICAgICAgIHJhbmRvbWl6ZShzdGF0dXNlcyksXG4gICAgICBwcmlvcml0eTogICAgICAgICAgICAgICAgIHJhbmRvbWl6ZShwcmlvcml0aWVzKSxcbiAgICAgIGNyZWF0ZWRfZGF0ZTogICAgICAgICAgICAgbmV3IERhdGUoKSxcbiAgICAgIHVwZGF0ZWRfZGF0ZTogICAgICAgICAgICAgbmV3IERhdGUoKSxcbiAgICAgIHJlcG9ydGVyOiAgICAgICAgICAgICAgICAgcmFuZG9taXplKHJlcG9ydGVycyksXG4gICAgICBzdWJ0eXBlOiAgICAgICAgICAgICAgICAgIHJhbmRvbWl6ZShzdWJ0eXBlcyksXG4gICAgICBhc3NpZ25lZF9ncm91cDogICAgICAgICAgIHJhbmRvbWl6ZShncm91cHMpLFxuICAgICAgYXNzaWduZWRfcGVyc29uOiAgICAgICAgICByYW5kb21pemUocGVvcGxlKSxcbiAgICAgIHR5cGU6ICAgICAgICAgICAgICAgICAgICAgcmFuZG9taXplKHR5cGVzKSxcbiAgICAgIGRldmljZTogICAgICAgICAgICAgICAgICAgcmFuZG9taXplKGRldmljZXMpXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gdmFsdWVzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdlbmVyYXRlO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDJSaGRHRXZZMkZ6WlhOZmJHbHpkRjlpYjJSNUxtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVa3NUVUZCVFN4UFFVRlBMRU5CUVVNc1NVRkJTU3hGUVVGRkxGbEJRVmtzUlVGQlJTeG5Ra0ZCWjBJc1EwRkJReXhEUVVGRE8wRkJRM2hFTEVsQlFVa3NUVUZCVFN4UFFVRlBMRU5CUVVNc1NVRkJTU3hGUVVGRkxGTkJRVk1zUTBGQlF5eERRVUZETzBGQlEyNURMRWxCUVVrc1VVRkJVU3hMUVVGTExFTkJRVU1zWVVGQllTeEZRVUZGTEd0Q1FVRnJRaXhGUVVGRkxGbEJRVmtzUTBGQlF5eERRVUZETzBGQlEyNUZMRWxCUVVrc1QwRkJUeXhOUVVGTkxFTkJRVU1zWTBGQll5eEZRVUZGTEdkQ1FVRm5RaXhGUVVGRkxGbEJRVmtzUTBGQlF5eERRVUZETzBGQlEyeEZMRWxCUVVrc1MwRkJTeXhSUVVGUkxFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTTdRVUZEYkVNc1NVRkJTU3hUUVVGVExFbEJRVWtzUTBGQlF5eFBRVUZQTEVWQlFVVXNVVUZCVVN4RlFVRkZMRkZCUVZFc1EwRkJReXhEUVVGRE8wRkJReTlETEVsQlFVa3NVVUZCVVN4TFFVRkxMRU5CUVVNc1VVRkJVU3hGUVVGRkxGVkJRVlVzUlVGQlJTeE5RVUZOTEVWQlFVVXNVVUZCVVN4RFFVRkRMRU5CUVVNN1FVRkRNVVFzU1VGQlNTeFZRVUZWTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVGRDTEZOQlFWTXNVMEZCVXl4RlFVRkZMRWRCUVVjc1JVRkJSVHRGUVVOMlFpeFBRVUZQTEVkQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVWQlFVVXNSMEZCUnl4SFFVRkhMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU55UkN4RFFVRkRPenRCUVVWRUxGTkJRVk1zVVVGQlVTeEZRVUZGTEVkQlFVY3NSVUZCUlR0RlFVTjBRaXhKUVVGSkxFTkJRVU1zUTBGQlF6dEJRVU5TTEVWQlFVVXNTVUZCU1N4TlFVRk5MRWRCUVVjc1JVRkJSU3hEUVVGRE96dEZRVVZvUWl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVVzUTBGQlF5eEhRVUZITEVkQlFVY3NSVUZCUlN4RFFVRkRMRVZCUVVVc1JVRkJSVHRKUVVONFFpeE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRPMDFCUTFZc1RVRkJUU3h2UWtGQmIwSXNVMEZCVXl4RFFVRkRMRkZCUVZFc1EwRkJRenROUVVNM1F5eFJRVUZSTEd0Q1FVRnJRaXhUUVVGVExFTkJRVU1zVlVGQlZTeERRVUZETzAxQlF5OURMRmxCUVZrc1kwRkJZeXhKUVVGSkxFbEJRVWtzUlVGQlJUdE5RVU53UXl4WlFVRlpMR05CUVdNc1NVRkJTU3hKUVVGSkxFVkJRVVU3VFVGRGNFTXNVVUZCVVN4clFrRkJhMElzVTBGQlV5eERRVUZETEZOQlFWTXNRMEZCUXp0TlFVTTVReXhQUVVGUExHMUNRVUZ0UWl4VFFVRlRMRU5CUVVNc1VVRkJVU3hEUVVGRE8wMUJRemRETEdOQlFXTXNXVUZCV1N4VFFVRlRMRU5CUVVNc1RVRkJUU3hEUVVGRE8wMUJRek5ETEdWQlFXVXNWMEZCVnl4VFFVRlRMRU5CUVVNc1RVRkJUU3hEUVVGRE8wMUJRek5ETEVsQlFVa3NjMEpCUVhOQ0xGTkJRVk1zUTBGQlF5eExRVUZMTEVOQlFVTTdUVUZETVVNc1RVRkJUU3h2UWtGQmIwSXNVMEZCVXl4RFFVRkRMRTlCUVU4c1EwRkJRenRMUVVNM1F5eERRVUZETEVOQlFVTTdRVUZEVUN4SFFVRkhPenRGUVVWRUxFOUJRVThzVFVGQlRTeERRVUZETzBGQlEyaENMRU5CUVVNN08wRkJSVVFzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4UlFVRlJMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SjJZWElnY0dWdmNHeGxJQ0FnSUNBOUlGdHVkV3hzTENBblNHRnVheUJLYjI1bGN5Y3NJQ2RTYjJKbGNuUWdVMkZzWm05eVpDZGRPMXh1ZG1GeUlHZHliM1Z3Y3lBZ0lDQWdQU0JiYm5Wc2JDd2dKMEJQSmtjZ1RESW5YVHRjYm5aaGNpQnpkV0owZVhCbGN5QWdJRDBnV3lkaGJHRnliU0JwYzNOMVpTY3NJQ2R3Y205a2RXTjBhVzl1SUdsemMzVmxKeXdnSjJOdmJXMGdhWE56ZFdVblhUdGNiblpoY2lCa1pYWnBZMlZ6SUNBZ0lEMGdXeWRNZFdacmJ5QlhZV3h5ZFhNbkxDQW5UV0Z1WTJocGJHUWdSbkpwZEhvbkxDQW5RV1JsY0hRZ1RtOWtaU2RkTzF4dWRtRnlJSFI1Y0dWeklDQWdJQ0FnUFNCYkoxZGxiR3dnYzNWd2NHOXlkQ2RkTzF4dWRtRnlJSEpsY0c5eWRHVnljeUFnUFNCYkowSnlhV0Z1Snl3Z0oxTm9ZV2hwWkNjc0lDZFNZV3BsYzJnblhUdGNiblpoY2lCemRHRjBkWE5sY3lBZ0lEMGdXeWRqYkc5elpXUW5MQ0FuY21WemIyeDJaV1FuTENBbmIzQmxiaWNzSUNkaFkzUnBkbVVuWFR0Y2JuWmhjaUJ3Y21sdmNtbDBhV1Z6SUQwZ1d6RXNNaXd6TERRc05WMDdYRzVjYm1aMWJtTjBhVzl1SUhKaGJtUnZiV2w2WlNBb1lYSnlLU0I3WEc0Z0lISmxkSFZ5YmlCaGNuSmJUV0YwYUM1bWJHOXZjaWhOWVhSb0xuSmhibVJ2YlNncElDb2dZWEp5TG14bGJtZDBhQ2xkTzF4dWZWeHVYRzVtZFc1amRHbHZiaUJuWlc1bGNtRjBaU0FvYm5WdEtTQjdYRzRnSUhaaGNpQnBPMXh1SUNCMllYSWdkbUZzZFdWeklEMGdXMTA3WEc1Y2JpQWdabTl5SUNocElEMGdNRHNnYVNBOElHNTFiVHNnYVNzcktTQjdYRzRnSUNBZ2RtRnNkV1Z6TG5CMWMyZ29lMXh1SUNBZ0lDQWdjM1JoZEhWek9pQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnlZVzVrYjIxcGVtVW9jM1JoZEhWelpYTXBMRnh1SUNBZ0lDQWdjSEpwYjNKcGRIazZJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnlZVzVrYjIxcGVtVW9jSEpwYjNKcGRHbGxjeWtzWEc0Z0lDQWdJQ0JqY21WaGRHVmtYMlJoZEdVNklDQWdJQ0FnSUNBZ0lDQWdJRzVsZHlCRVlYUmxLQ2tzWEc0Z0lDQWdJQ0IxY0dSaGRHVmtYMlJoZEdVNklDQWdJQ0FnSUNBZ0lDQWdJRzVsZHlCRVlYUmxLQ2tzWEc0Z0lDQWdJQ0J5WlhCdmNuUmxjam9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEpoYm1SdmJXbDZaU2h5WlhCdmNuUmxjbk1wTEZ4dUlDQWdJQ0FnYzNWaWRIbHdaVG9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J5WVc1a2IyMXBlbVVvYzNWaWRIbHdaWE1wTEZ4dUlDQWdJQ0FnWVhOemFXZHVaV1JmWjNKdmRYQTZJQ0FnSUNBZ0lDQWdJQ0J5WVc1a2IyMXBlbVVvWjNKdmRYQnpLU3hjYmlBZ0lDQWdJR0Z6YzJsbmJtVmtYM0JsY25OdmJqb2dJQ0FnSUNBZ0lDQWdjbUZ1Wkc5dGFYcGxLSEJsYjNCc1pTa3NYRzRnSUNBZ0lDQjBlWEJsT2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lISmhibVJ2YldsNlpTaDBlWEJsY3lrc1hHNGdJQ0FnSUNCa1pYWnBZMlU2SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKaGJtUnZiV2w2WlNoa1pYWnBZMlZ6S1Z4dUlDQWdJSDBwTzF4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUhaaGJIVmxjenRjYm4xY2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQm5aVzVsY21GMFpUdGNiaUpkZlE9PSIsInZhciB2YWx1ZXMgPSBbXTtcblxudmFsdWVzID0gW1xuICB7XG4gICAgbWluaW1hbDogICAgdHJ1ZSxcbiAgICBuYW1lOiAgICAgICAnc3RhdHVzJyxcbiAgICB0eXBlOiAgICAgICAnc3RhdHVzJ1xuICB9LFxuICB7XG4gICAgbWluaW1hbDogICAgdHJ1ZSxcbiAgICBuYW1lOiAgICAgICAncHJpb3JpdHknLFxuICAgIHRpdGxlOiAgICAgICdQJyxcbiAgICB0eXBlOiAgICAgICAncHJpb3JpdHknXG4gIH0sXG4gIHtcbiAgICBuYW1lOiAgICAgICAnZGV0YWlscycsXG4gICAgdGl0bGU6ICAgICAgJ0Nhc2UnLFxuICAgIHR5cGU6ICAgICAgICdjYXNlX2RldGFpbHMnXG4gIH0sXG4gIHtcbiAgICBuYW1lOiAgICAgICAncmVwb3J0ZWQnLFxuICAgIHRpdGxlOiAgICAgICdSZXBvcnRlZCBieScsXG4gICAgdHlwZTogICAgICAgJ2Nhc2VfcmVwb3J0ZWQnXG4gIH0sXG4gIHtcbiAgICBuYW1lOiAgICAgICAnYXNzaWdubWVudCcsXG4gICAgdGl0bGU6ICAgICAgJ0Fzc2lnbm1lbnQnLFxuICAgIHR5cGU6ICAgICAgICdjYXNlX2Fzc2lnbm1lbnQnXG4gIH0sXG4gIHtcbiAgICBuYW1lOiAgICAgICAnYWN0aW9ucycsXG4gICAgdGl0bGU6ICAgICAgJ0FjdGlvbicsXG4gICAgdHlwZTogICAgICAgJ2Nhc2VfYWN0aW9ucydcbiAgfVxuXTtcblxubW9kdWxlLmV4cG9ydHMgPSB2YWx1ZXM7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMlJoZEdFdlkyRnpaWE5mYkdsemRGOW9aV0ZrYVc1bmN5NXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4SlFVRkpMRTFCUVUwc1IwRkJSeXhGUVVGRkxFTkJRVU03TzBGQlJXaENMRTFCUVUwc1IwRkJSenRGUVVOUU8wbEJRMFVzVDBGQlR5eExRVUZMTEVsQlFVazdTVUZEYUVJc1NVRkJTU3hSUVVGUkxGRkJRVkU3U1VGRGNFSXNTVUZCU1N4UlFVRlJMRkZCUVZFN1IwRkRja0k3UlVGRFJEdEpRVU5GTEU5QlFVOHNTMEZCU3l4SlFVRkpPMGxCUTJoQ0xFbEJRVWtzVVVGQlVTeFZRVUZWTzBsQlEzUkNMRXRCUVVzc1QwRkJUeXhIUVVGSE8wbEJRMllzU1VGQlNTeFJRVUZSTEZWQlFWVTdSMEZEZGtJN1JVRkRSRHRKUVVORkxFbEJRVWtzVVVGQlVTeFRRVUZUTzBsQlEzSkNMRXRCUVVzc1QwRkJUeXhOUVVGTk8wbEJRMnhDTEVsQlFVa3NVVUZCVVN4alFVRmpPMGRCUXpOQ08wVkJRMFE3U1VGRFJTeEpRVUZKTEZGQlFWRXNWVUZCVlR0SlFVTjBRaXhMUVVGTExFOUJRVThzWVVGQllUdEpRVU42UWl4SlFVRkpMRkZCUVZFc1pVRkJaVHRIUVVNMVFqdEZRVU5FTzBsQlEwVXNTVUZCU1N4UlFVRlJMRmxCUVZrN1NVRkRlRUlzUzBGQlN5eFBRVUZQTEZsQlFWazdTVUZEZUVJc1NVRkJTU3hSUVVGUkxHbENRVUZwUWp0SFFVTTVRanRGUVVORU8wbEJRMFVzU1VGQlNTeFJRVUZSTEZOQlFWTTdTVUZEY2tJc1MwRkJTeXhQUVVGUExGRkJRVkU3U1VGRGNFSXNTVUZCU1N4UlFVRlJMR05CUVdNN1IwRkRNMEk3UVVGRFNDeERRVUZETEVOQlFVTTdPMEZCUlVZc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eE5RVUZOTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUoyWVhJZ2RtRnNkV1Z6SUQwZ1cxMDdYRzVjYm5aaGJIVmxjeUE5SUZ0Y2JpQWdlMXh1SUNBZ0lHMXBibWx0WVd3NklDQWdJSFJ5ZFdVc1hHNGdJQ0FnYm1GdFpUb2dJQ0FnSUNBZ0ozTjBZWFIxY3ljc1hHNGdJQ0FnZEhsd1pUb2dJQ0FnSUNBZ0ozTjBZWFIxY3lkY2JpQWdmU3hjYmlBZ2UxeHVJQ0FnSUcxcGJtbHRZV3c2SUNBZ0lIUnlkV1VzWEc0Z0lDQWdibUZ0WlRvZ0lDQWdJQ0FnSjNCeWFXOXlhWFI1Snl4Y2JpQWdJQ0IwYVhSc1pUb2dJQ0FnSUNBblVDY3NYRzRnSUNBZ2RIbHdaVG9nSUNBZ0lDQWdKM0J5YVc5eWFYUjVKMXh1SUNCOUxGeHVJQ0I3WEc0Z0lDQWdibUZ0WlRvZ0lDQWdJQ0FnSjJSbGRHRnBiSE1uTEZ4dUlDQWdJSFJwZEd4bE9pQWdJQ0FnSUNkRFlYTmxKeXhjYmlBZ0lDQjBlWEJsT2lBZ0lDQWdJQ0FuWTJGelpWOWtaWFJoYVd4ekoxeHVJQ0I5TEZ4dUlDQjdYRzRnSUNBZ2JtRnRaVG9nSUNBZ0lDQWdKM0psY0c5eWRHVmtKeXhjYmlBZ0lDQjBhWFJzWlRvZ0lDQWdJQ0FuVW1Wd2IzSjBaV1FnWW5rbkxGeHVJQ0FnSUhSNWNHVTZJQ0FnSUNBZ0lDZGpZWE5sWDNKbGNHOXlkR1ZrSjF4dUlDQjlMRnh1SUNCN1hHNGdJQ0FnYm1GdFpUb2dJQ0FnSUNBZ0oyRnpjMmxuYm0xbGJuUW5MRnh1SUNBZ0lIUnBkR3hsT2lBZ0lDQWdJQ2RCYzNOcFoyNXRaVzUwSnl4Y2JpQWdJQ0IwZVhCbE9pQWdJQ0FnSUNBblkyRnpaVjloYzNOcFoyNXRaVzUwSjF4dUlDQjlMRnh1SUNCN1hHNGdJQ0FnYm1GdFpUb2dJQ0FnSUNBZ0oyRmpkR2x2Ym5NbkxGeHVJQ0FnSUhScGRHeGxPaUFnSUNBZ0lDZEJZM1JwYjI0bkxGeHVJQ0FnSUhSNWNHVTZJQ0FnSUNBZ0lDZGpZWE5sWDJGamRHbHZibk1uWEc0Z0lIMWNibDA3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2RtRnNkV1Z6TzF4dUlsMTkiLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIEFjdGl2ZVJvd0RldGFpbHM7XG52YXIgJCAgICAgICAgICAgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBSZWFjdCAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgQmFja2JvbmUgICAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyIFRyICAgICAgICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy90ci5qc3gnKTtcbnZhciBUZCAgICAgICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvdGQuanN4Jyk7XG52YXIgVGFicyAgICAgICAgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL3RhYnMuanN4Jyk7XG52YXIgSWNvbiAgICAgICAgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL2ljb24uanN4Jyk7XG52YXIgc3RvcmUgICAgICAgPSByZXF1aXJlKCcuL2xpc3Rfdmlld19zdG9yZScpO1xudmFyIGRpc3BhdGNoZXIgID0gcmVxdWlyZSgnLi9kaXNwYXRjaGVyJyk7XG52YXIgbW9tZW50ICAgICAgPSByZXF1aXJlKCdtb21lbnQnKTtcblxuQWN0aXZlUm93RGV0YWlscyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJBY3RpdmVSb3dEZXRhaWxzXCIsXG4gIHByb3BUeXBlczoge1xuICAgIG1vZGVsOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihCYWNrYm9uZS5Nb2RlbCkuaXNSZXF1aXJlZFxuICB9LFxuICBtaXhpbnM6IFtSZWFjdC5hZGRvbnMuUHVyZVJlbmRlck1peGluXSxcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMubW9kZWwudG9KU09OKCk7XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGtleV9tYXAgPSB7Mzk6ICdfbW92ZUJhY2t3YXJkJywgMzc6ICdfbW92ZUZvcndhcmQnfTtcbiAgICAkKGRvY3VtZW50KS5vbigna2V5ZG93bi4nICsgdGhpcy5wcm9wcy5tb2RlbC5jaWQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgd2hlcmUgPSBrZXlfbWFwW2Uud2hpY2hdO1xuXG4gICAgICBpZiAoISB3aGVyZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB0aGlzW3doZXJlXSgpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgJChkb2N1bWVudCkub2ZmKCcuJyArIHRoaXMucHJvcHMubW9kZWwuY2lkKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNsYXNzX25hbWVzID0gWydhY3RpdmUnXTtcbiAgICB2YXIgbW9kZWwgICAgICAgPSB0aGlzLnByb3BzLm1vZGVsO1xuICAgIHZhciBzaXplX3RvZ2dsZSA9IHRoaXMucHJvcHMubWluaW1pemVkID8gJ2V4cGFuZCcgOiAnY29tcHJlc3MnO1xuICAgIHZhciB0YWJzICAgICAgICA9IHRoaXMuX2dldFRhYnMoKTtcblxuICAgIGNsYXNzX25hbWVzLnB1c2godGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHIsIHtjbGFzc05hbWU6IGNsYXNzX25hbWVzLmpvaW4oJyAnKX0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRkLCB7Y29sU3Bhbjogc3RvcmUuZ2V0KCdoZWFkaW5ncycpLmxlbmd0aH0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJmaWVsZHNldFwiLCB7Y2xhc3NOYW1lOiBcInNlcGFyYXRvclwifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGVnZW5kXCIsIHthbGlnbjogXCJjZW50ZXJcIn0sIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYnMsIHt0YWJzOiB0YWJzfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICApLCBcbiAgICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBfZ2V0VGFiczogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0YWJzID0gW1xuICAgICAge2ljb246ICdhcnJvdy11cCcsICAgIGFjdGlvbjogdGhpcy5fc2VsZWN0UHJldn0sXG4gICAgICB7aWNvbjogJ2Fycm93LWRvd24nLCAgYWN0aW9uOiB0aGlzLl9zZWxlY3ROZXh0fSxcbiAgICAgIHtpY29uOiAnY2xvc2UnLCAgICAgICBhY3Rpb246IHRoaXMuX2Nsb3NlfVxuICAgIF07XG5cbiAgICBpZiAoISB0aGlzLnByb3BzLnByZXYpIHtcbiAgICAgIGRlbGV0ZSB0YWJzWzBdO1xuICAgIH1cblxuICAgIGlmICghIHRoaXMucHJvcHMubmV4dCkge1xuICAgICAgZGVsZXRlIHRhYnNbMV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhYnM7XG4gIH0sXG4gIF9zZWxlY3RQcmV2OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMucHJldikge1xuICAgICAgdGhpcy5fc3dpdGNoKHRoaXMucHJvcHMucHJldik7XG4gICAgfVxuICB9LFxuICBfc2VsZWN0TmV4dDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLm5leHQpIHtcbiAgICAgIHRoaXMuX3N3aXRjaCh0aGlzLnByb3BzLm5leHQpO1xuICAgIH1cbiAgfSxcbiAgX2Nsb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fc3dpdGNoKCk7XG4gIH0sXG4gIF9zd2l0Y2g6IGZ1bmN0aW9uIChjaWQpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5zd2l0Y2hlcikge1xuICAgICAgdGhpcy5wcm9wcy5zd2l0Y2hlcihjaWQsIHRydWUpO1xuICAgIH1cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQWN0aXZlUm93RGV0YWlscztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdlkyRnpaWE12WVdOMGFYWmxYM0p2ZDE5a1pYUmhhV3h6TG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHM3UVVGRlFTeEhRVUZIT3p0QlFVVklMRWxCUVVrc1owSkJRV2RDTEVOQlFVTTdRVUZEY2tJc1NVRkJTU3hEUVVGRExHRkJRV0VzVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMEZCUTNCRExFbEJRVWtzUzBGQlN5eFRRVUZUTEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVOdVF5eEpRVUZKTEZGQlFWRXNUVUZCVFN4UFFVRlBMRU5CUVVNc1ZVRkJWU3hEUVVGRExFTkJRVU03UVVGRGRFTXNTVUZCU1N4RlFVRkZMRmxCUVZrc1QwRkJUeXhEUVVGRExIbENRVUY1UWl4RFFVRkRMRU5CUVVNN1FVRkRja1FzU1VGQlNTeEZRVUZGTEZsQlFWa3NUMEZCVHl4RFFVRkRMSGxDUVVGNVFpeERRVUZETEVOQlFVTTdRVUZEY2tRc1NVRkJTU3hKUVVGSkxGVkJRVlVzVDBGQlR5eERRVUZETERKQ1FVRXlRaXhEUVVGRExFTkJRVU03UVVGRGRrUXNTVUZCU1N4SlFVRkpMRlZCUVZVc1QwRkJUeXhEUVVGRExESkNRVUV5UWl4RFFVRkRMRU5CUVVNN1FVRkRka1FzU1VGQlNTeExRVUZMTEZOQlFWTXNUMEZCVHl4RFFVRkRMRzFDUVVGdFFpeERRVUZETEVOQlFVTTdRVUZETDBNc1NVRkJTU3hWUVVGVkxFbEJRVWtzVDBGQlR5eERRVUZETEdOQlFXTXNRMEZCUXl4RFFVRkRPMEZCUXpGRExFbEJRVWtzVFVGQlRTeFJRVUZSTEU5QlFVOHNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenM3UVVGRmNFTXNjME5CUVhORExHZERRVUZCTzBWQlEzQkRMRk5CUVZNc1JVRkJSVHRKUVVOVUxFdEJRVXNzUlVGQlJTeExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRlZCUVZVc1EwRkJReXhSUVVGUkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNWVUZCVlR0SFFVTTNSRHRGUVVORUxFMUJRVTBzUlVGQlJTeERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1pVRkJaU3hEUVVGRE8wVkJRM1JETEdWQlFXVXNSVUZCUlN4WlFVRlpPMGxCUXpOQ0xFOUJRVThzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU03UjBGRGJFTTdSVUZEUkN4cFFrRkJhVUlzUlVGQlJTeFpRVUZaTzBsQlF6ZENMRWxCUVVrc1QwRkJUeXhIUVVGSExFTkJRVU1zUlVGQlJTeEZRVUZGTEdWQlFXVXNSVUZCUlN4RlFVRkZMRVZCUVVVc1kwRkJZeXhEUVVGRExFTkJRVU03U1VGRGVFUXNRMEZCUXl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExFVkJRVVVzUTBGQlF5eFZRVUZWTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eEZRVUZGTEZWQlFWVXNRMEZCUXl4RlFVRkZPMEZCUTI1RkxFMUJRVTBzU1VGQlNTeExRVUZMTEVkQlFVY3NUMEZCVHl4RFFVRkRMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6czdUVUZGTjBJc1NVRkJTU3hGUVVGRkxFdEJRVXNzUlVGQlJUdFJRVU5ZTEU5QlFVOHNTVUZCU1N4RFFVRkRPMEZCUTNCQ0xFOUJRVTg3TzBGQlJWQXNUVUZCVFN4RFFVRkRMRU5CUVVNc1kwRkJZeXhGUVVGRkxFTkJRVU03TzAxQlJXNUNMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUlVGQlJTeERRVUZETzB0QlEyWXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF6dEhRVU5tTzBWQlEwUXNiMEpCUVc5Q0xFVkJRVVVzV1VGQldUdEpRVU5vUXl4RFFVRkRMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUjBGQlJ5eERRVUZETEVkQlFVY3NSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0SFFVTTNRenRGUVVORUxFMUJRVTBzUlVGQlJTeFpRVUZaTzBsQlEyeENMRWxCUVVrc1YwRkJWeXhIUVVGSExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdTVUZETjBJc1NVRkJTU3hMUVVGTExGTkJRVk1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNN1NVRkRia01zU1VGQlNTeFhRVUZYTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhUUVVGVExFZEJRVWNzVVVGQlVTeEhRVUZITEZWQlFWVXNRMEZCUXp0QlFVTnVSU3hKUVVGSkxFbEJRVWtzU1VGQlNTeFZRVUZWTEVsQlFVa3NRMEZCUXl4UlFVRlJMRVZCUVVVc1EwRkJRenM3UVVGRmRFTXNTVUZCU1N4WFFVRlhMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN08wbEJSWFpETzAxQlEwVXNiMEpCUVVNc1JVRkJSU3hGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUlN4WFFVRlhMRU5CUVVNc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlJ5eERRVUZCTEVWQlFVRTdVVUZEY0VNc2IwSkJRVU1zUlVGQlJTeEZRVUZCTEVOQlFVRXNRMEZCUXl4UFFVRkJMRVZCUVU4c1EwRkJSU3hMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRMRTFCUVZFc1EwRkJRU3hGUVVGQk8xVkJRM3BETEc5Q1FVRkJMRlZCUVZNc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNWMEZCV1N4RFFVRkJMRVZCUVVFN1dVRkRPVUlzYjBKQlFVRXNVVUZCVHl4RlFVRkJMRU5CUVVFc1EwRkJReXhMUVVGQkxFVkJRVXNzUTBGQlF5eFJRVUZUTEVOQlFVRXNSVUZCUVR0alFVTnlRaXh2UWtGQlF5eEpRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRWxCUVVFc1JVRkJTU3hEUVVGRkxFbEJRVXNzUTBGQlFTeERRVUZITEVOQlFVRTdXVUZEWWl4RFFVRkJPMVZCUTBFc1EwRkJRU3hGUVVGQk8xVkJRMVlzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UlFVRlRPMUZCUTJ4Q0xFTkJRVUU3VFVGRFJpeERRVUZCTzAxQlEwdzdSMEZEU0R0RlFVTkVMRkZCUVZFc1JVRkJSU3haUVVGWk8wbEJRM0JDTEVsQlFVa3NTVUZCU1N4SFFVRkhPMDFCUTFRc1EwRkJReXhKUVVGSkxFVkJRVVVzVlVGQlZTeExRVUZMTEUxQlFVMHNSVUZCUlN4SlFVRkpMRU5CUVVNc1YwRkJWeXhEUVVGRE8wMUJReTlETEVOQlFVTXNTVUZCU1N4RlFVRkZMRmxCUVZrc1IwRkJSeXhOUVVGTkxFVkJRVVVzU1VGQlNTeERRVUZETEZkQlFWY3NRMEZCUXp0TlFVTXZReXhEUVVGRExFbEJRVWtzUlVGQlJTeFBRVUZQTEZGQlFWRXNUVUZCVFN4RlFVRkZMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU03UVVGRGFFUXNTMEZCU3l4RFFVRkRPenRKUVVWR0xFbEJRVWtzUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1JVRkJSVHROUVVOeVFpeFBRVUZQTEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVOeVFpeExRVUZMT3p0SlFVVkVMRWxCUVVrc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NSVUZCUlR0TlFVTnlRaXhQUVVGUExFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTnlRaXhMUVVGTE96dEpRVVZFTEU5QlFVOHNTVUZCU1N4RFFVRkRPMGRCUTJJN1JVRkRSQ3hYUVVGWExFVkJRVVVzV1VGQldUdEpRVU4yUWl4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeEZRVUZGTzAxQlEyNUNMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRMUVVNdlFqdEhRVU5HTzBWQlEwUXNWMEZCVnl4RlFVRkZMRmxCUVZrN1NVRkRka0lzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1JVRkJSVHROUVVOdVFpeEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdTMEZETDBJN1IwRkRSanRGUVVORUxFMUJRVTBzUlVGQlJTeFpRVUZaTzBsQlEyeENMRWxCUVVrc1EwRkJReXhQUVVGUExFVkJRVVVzUTBGQlF6dEhRVU5vUWp0RlFVTkVMRTlCUVU4c1JVRkJSU3hWUVVGVkxFZEJRVWNzUlVGQlJUdEpRVU4wUWl4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVVVGQlVTeEZRVUZGTzAxQlEzWkNMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenRMUVVOb1F6dEhRVU5HTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4blFrRkJaMElzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dRR3B6ZUNCU1pXRmpkQzVFVDAxY2JpQXFMMXh1WEc1MllYSWdRV04wYVhabFVtOTNSR1YwWVdsc2N6dGNiblpoY2lBa0lDQWdJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KMnB4ZFdWeWVTY3BPMXh1ZG1GeUlGSmxZV04wSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duY21WaFkzUW5LVHRjYm5aaGNpQkNZV05yWW05dVpTQWdJQ0E5SUhKbGNYVnBjbVVvSjJKaFkydGliMjVsSnlrN1hHNTJZWElnVkhJZ0lDQWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDY3VMaTh1TGk5amIyMXdiMjVsYm5SekwzUnlMbXB6ZUNjcE8xeHVkbUZ5SUZSa0lDQWdJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTR2TGk0dlkyOXRjRzl1Wlc1MGN5OTBaQzVxYzNnbktUdGNiblpoY2lCVVlXSnpJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR1THk0dUwyTnZiWEJ2Ym1WdWRITXZkR0ZpY3k1cWMzZ25LVHRjYm5aaGNpQkpZMjl1SUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dUx5NHVMMk52YlhCdmJtVnVkSE12YVdOdmJpNXFjM2duS1R0Y2JuWmhjaUJ6ZEc5eVpTQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHZiR2x6ZEY5MmFXVjNYM04wYjNKbEp5azdYRzUyWVhJZ1pHbHpjR0YwWTJobGNpQWdQU0J5WlhGMWFYSmxLQ2N1TDJScGMzQmhkR05vWlhJbktUdGNiblpoY2lCdGIyMWxiblFnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KMjF2YldWdWRDY3BPMXh1WEc1QlkzUnBkbVZTYjNkRVpYUmhhV3h6SUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVJQ0J3Y205d1ZIbHdaWE02SUh0Y2JpQWdJQ0J0YjJSbGJEb2dVbVZoWTNRdVVISnZjRlI1Y0dWekxtbHVjM1JoYm1ObFQyWW9RbUZqYTJKdmJtVXVUVzlrWld3cExtbHpVbVZ4ZFdseVpXUmNiaUFnZlN4Y2JpQWdiV2w0YVc1ek9pQmJVbVZoWTNRdVlXUmtiMjV6TGxCMWNtVlNaVzVrWlhKTmFYaHBibDBzWEc0Z0lHZGxkRWx1YVhScFlXeFRkR0YwWlRvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbkJ5YjNCekxtMXZaR1ZzTG5SdlNsTlBUaWdwTzF4dUlDQjlMRnh1SUNCamIyMXdiMjVsYm5SRWFXUk5iM1Z1ZERvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJyWlhsZmJXRndJRDBnZXpNNU9pQW5YMjF2ZG1WQ1lXTnJkMkZ5WkNjc0lETTNPaUFuWDIxdmRtVkdiM0ozWVhKa0ozMDdYRzRnSUNBZ0pDaGtiMk4xYldWdWRDa3ViMjRvSjJ0bGVXUnZkMjR1SnlBcklIUm9hWE11Y0hKdmNITXViVzlrWld3dVkybGtMQ0JtZFc1amRHbHZiaUFvWlNrZ2UxeHVJQ0FnSUNBZ2RtRnlJSGRvWlhKbElEMGdhMlY1WDIxaGNGdGxMbmRvYVdOb1hUdGNibHh1SUNBZ0lDQWdhV1lnS0NFZ2QyaGxjbVVwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVTdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR1V1Y0hKbGRtVnVkRVJsWm1GMWJIUW9LVHRjYmx4dUlDQWdJQ0FnZEdocGMxdDNhR1Z5WlYwb0tUdGNiaUFnSUNCOUxtSnBibVFvZEdocGN5a3BPMXh1SUNCOUxGeHVJQ0JqYjIxd2IyNWxiblJYYVd4c1ZXNXRiM1Z1ZERvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDUW9aRzlqZFcxbGJuUXBMbTltWmlnbkxpY2dLeUIwYUdsekxuQnliM0J6TG0xdlpHVnNMbU5wWkNrN1hHNGdJSDBzWEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJqYkdGemMxOXVZVzFsY3lBOUlGc25ZV04wYVhabEoxMDdYRzRnSUNBZ2RtRnlJRzF2WkdWc0lDQWdJQ0FnSUQwZ2RHaHBjeTV3Y205d2N5NXRiMlJsYkR0Y2JpQWdJQ0IyWVhJZ2MybDZaVjkwYjJkbmJHVWdQU0IwYUdsekxuQnliM0J6TG0xcGJtbHRhWHBsWkNBL0lDZGxlSEJoYm1RbklEb2dKMk52YlhCeVpYTnpKenRjYmlBZ0lDQjJZWElnZEdGaWN5QWdJQ0FnSUNBZ1BTQjBhR2x6TGw5blpYUlVZV0p6S0NrN1hHNWNiaUFnSUNCamJHRnpjMTl1WVcxbGN5NXdkWE5vS0hSb2FYTXVjSEp2Y0hNdVkyeGhjM05PWVcxbEtUdGNibHh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOFZISWdZMnhoYzNOT1lXMWxQWHRqYkdGemMxOXVZVzFsY3k1cWIybHVLQ2NnSnlsOVBseHVJQ0FnSUNBZ0lDQThWR1FnWTI5c1UzQmhiajE3YzNSdmNtVXVaMlYwS0Nkb1pXRmthVzVuY3ljcExteGxibWQwYUgwK1hHNGdJQ0FnSUNBZ0lDQWdQR1pwWld4a2MyVjBJR05zWVhOelRtRnRaVDFjSW5ObGNHRnlZWFJ2Y2x3aVBseHVJQ0FnSUNBZ0lDQWdJQ0FnUEd4bFoyVnVaQ0JoYkdsbmJqMWNJbU5sYm5SbGNsd2lQbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQThWR0ZpY3lCMFlXSnpQWHQwWVdKemZTQXZQbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BDOXNaV2RsYm1RK1hHNGdJQ0FnSUNBZ0lDQWdQQzltYVdWc1pITmxkRDVjYmlBZ0lDQWdJQ0FnSUNCN2RHaHBjeTV3Y205d2N5NWphR2xzWkhKbGJuMWNiaUFnSUNBZ0lDQWdQQzlVWkQ1Y2JpQWdJQ0FnSUR3dlZISStYRzRnSUNBZ0tUdGNiaUFnZlN4Y2JpQWdYMmRsZEZSaFluTTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ2RHRmljeUE5SUZ0Y2JpQWdJQ0FnSUh0cFkyOXVPaUFuWVhKeWIzY3RkWEFuTENBZ0lDQmhZM1JwYjI0NklIUm9hWE11WDNObGJHVmpkRkJ5WlhaOUxGeHVJQ0FnSUNBZ2UybGpiMjQ2SUNkaGNuSnZkeTFrYjNkdUp5d2dJR0ZqZEdsdmJqb2dkR2hwY3k1ZmMyVnNaV04wVG1WNGRIMHNYRzRnSUNBZ0lDQjdhV052YmpvZ0oyTnNiM05sSnl3Z0lDQWdJQ0FnWVdOMGFXOXVPaUIwYUdsekxsOWpiRzl6WlgxY2JpQWdJQ0JkTzF4dVhHNGdJQ0FnYVdZZ0tDRWdkR2hwY3k1d2NtOXdjeTV3Y21WMktTQjdYRzRnSUNBZ0lDQmtaV3hsZEdVZ2RHRmljMXN3WFR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb0lTQjBhR2x6TG5CeWIzQnpMbTVsZUhRcElIdGNiaUFnSUNBZ0lHUmxiR1YwWlNCMFlXSnpXekZkTzF4dUlDQWdJSDFjYmx4dUlDQWdJSEpsZEhWeWJpQjBZV0p6TzF4dUlDQjlMRnh1SUNCZmMyVnNaV04wVUhKbGRqb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJR2xtSUNoMGFHbHpMbkJ5YjNCekxuQnlaWFlwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVYM04zYVhSamFDaDBhR2x6TG5CeWIzQnpMbkJ5WlhZcE8xeHVJQ0FnSUgxY2JpQWdmU3hjYmlBZ1gzTmxiR1ZqZEU1bGVIUTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0JwWmlBb2RHaHBjeTV3Y205d2N5NXVaWGgwS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbDl6ZDJsMFkyZ29kR2hwY3k1d2NtOXdjeTV1WlhoMEtUdGNiaUFnSUNCOVhHNGdJSDBzWEc0Z0lGOWpiRzl6WlRvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIUm9hWE11WDNOM2FYUmphQ2dwTzF4dUlDQjlMRnh1SUNCZmMzZHBkR05vT2lCbWRXNWpkR2x2YmlBb1kybGtLU0I3WEc0Z0lDQWdhV1lnS0hSb2FYTXVjSEp2Y0hNdWMzZHBkR05vWlhJcElIdGNiaUFnSUNBZ0lIUm9hWE11Y0hKdmNITXVjM2RwZEdOb1pYSW9ZMmxrTENCMGNuVmxLVHRjYmlBZ0lDQjlYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUVGamRHbDJaVkp2ZDBSbGRHRnBiSE03WEc0aVhYMD0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIEFuZE9yU2VsZWN0b3I7XG52YXIgdHlwZXNfbWFwID0ge307XG52YXIgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBJY29uICAgICAgPSByZXF1aXJlKCcuL2ljb25fd3JhcHBlci5qc3gnKTtcbnZhciBEcm9wZG93biAgPSByZXF1aXJlKCcuL2Ryb3Bkb3duLmpzeCcpO1xudmFyIEFORF9WQUxVRSA9ICdhbmQnO1xudmFyIE9SX1ZBTFVFICA9ICdvcidcblxudHlwZXNfbWFwW0FORF9WQUxVRV0gPSAnYWxsJztcbnR5cGVzX21hcFtPUl9WQUxVRV0gID0gJ2FueSc7XG5cbkFuZE9yU2VsZWN0b3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQW5kT3JTZWxlY3RvclwiLFxuICBzdGF0aWNzOiB7XG4gICAgQU5EOiAgQU5EX1ZBTFVFLFxuICAgIE9SOiAgIE9SX1ZBTFVFXG4gIH0sXG4gIG1peGluczogW1JlYWN0LmFkZG9ucy5QdXJlUmVuZGVyTWl4aW5dLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZWRpdGluZzogZmFsc2VcbiAgICB9O1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogQU5EX1ZBTFVFXG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGN1cnJlbnQgICA9IHR5cGVzX21hcFt0aGlzLnByb3BzLnR5cGVdO1xuICAgIHZhciBjb250ZW50cyAgPSB0aGlzLnN0YXRlLmVkaXRpbmcgPyB0aGlzLl9idWlsZEVkaXRvcigpIDogKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIG51bGwsIGN1cnJlbnQpLCBcIjpcIikpO1xuICAgIHZhciBwcm9wcztcblxuICAgIHByb3BzID0ge1xuICAgICAgY2xhc3NOYW1lOiAgICAnY2hhaW4gYW5kLW9yJyxcbiAgICAgIG9uTW91c2VMZWF2ZTogdGhpcy5faGFuZGxlTW91c2VMZWF2ZSxcbiAgICAgIG9uQ2xpY2s6ICAgICAgdGhpcy5fdG9nZ2xlRWRpdGluZ1xuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgUmVhY3QuX19zcHJlYWQoe30sICBwcm9wcyksIFxuICAgICAgICBjb250ZW50c1xuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIF9idWlsZEVkaXRvcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9wcztcbiAgICB2YXIgY2hvaWNlcyA9IFtcbiAgICAgIHt0ZXh0OiB0eXBlc19tYXBbQU5EX1ZBTFVFXSwgdmFsdWU6IEFORF9WQUxVRX0sXG4gICAgICB7dGV4dDogdHlwZXNfbWFwW09SX1ZBTFVFXSwgdmFsdWU6IE9SX1ZBTFVFfVxuICAgIF07XG5cbiAgICBwcm9wcyA9IHtcbiAgICAgIHJlZjogICAgICAnZHJvcGRvd24nLFxuICAgICAgdGhlbWU6ICAgICdsaWdodCcsXG4gICAgICBzZWxlY3RlZDogdHlwZXNfbWFwW3RoaXMucHJvcHMudHlwZV0sXG4gICAgICBjaG9pY2VzOiAgY2hvaWNlcyxcbiAgICAgIG9uQ2hvaWNlOiB0aGlzLl9oYW5kbGVTZWxlY3Rpb24sXG4gICAgICBvcGVuOiAgICAgdHJ1ZVxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChEcm9wZG93biwgUmVhY3QuX19zcHJlYWQoe30sICBwcm9wcykpXG4gICAgKTtcbiAgfSxcbiAgX2VuZEVkaXRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtlZGl0aW5nOiBmYWxzZX0pO1xuICB9LFxuICBfaGFuZGxlTW91c2VMZWF2ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX2VuZEVkaXRpbmcoKTtcbiAgfSxcbiAgX3RvZ2dsZUVkaXRpbmc6IGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtlZGl0aW5nOiAhIHRoaXMuc3RhdGUuZWRpdGluZ30pO1xuICB9LFxuICBfaGFuZGxlT3JTZWxlY3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9oYW5kbGVTZWxlY3Rpb24oT1JfVkFMVUUpO1xuICB9LFxuICBfaGFuZGxlQW5kU2VsZWN0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5faGFuZGxlU2VsZWN0aW9uKEFORF9WQUxVRSk7XG4gIH0sXG4gIF9oYW5kbGVTZWxlY3Rpb246IGZ1bmN0aW9uIChjaG9pY2UpIHtcbiAgICB0aGlzLl9lbmRFZGl0aW5nKCk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5vbkNoYW5nZSkge1xuICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShjaG9pY2UpO1xuICAgIH1cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQW5kT3JTZWxlY3RvcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdlkyRnpaWE12WVc1a1gyOXlYM05sYkdWamRHOXlMbXB6ZUNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFUczdRVUZGUVN4SFFVRkhPenRCUVVWSUxFbEJRVWtzWVVGQllTeERRVUZETzBGQlEyeENMRWxCUVVrc1UwRkJVeXhIUVVGSExFVkJRVVVzUTBGQlF6dEJRVU51UWl4SlFVRkpMRXRCUVVzc1QwRkJUeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdRVUZEYWtNc1NVRkJTU3hKUVVGSkxGRkJRVkVzVDBGQlR5eERRVUZETEc5Q1FVRnZRaXhEUVVGRExFTkJRVU03UVVGRE9VTXNTVUZCU1N4UlFVRlJMRWxCUVVrc1QwRkJUeXhEUVVGRExHZENRVUZuUWl4RFFVRkRMRU5CUVVNN1FVRkRNVU1zU1VGQlNTeFRRVUZUTEVkQlFVY3NTMEZCU3l4RFFVRkRPMEZCUTNSQ0xFbEJRVWtzVVVGQlVTeEpRVUZKTEVsQlFVazdPMEZCUlhCQ0xGTkJRVk1zUTBGQlF5eFRRVUZUTEVOQlFVTXNSMEZCUnl4TFFVRkxMRU5CUVVNN1FVRkROMElzVTBGQlV5eERRVUZETEZGQlFWRXNRMEZCUXl4SlFVRkpMRXRCUVVzc1EwRkJRenM3UVVGRk4wSXNiVU5CUVcxRExEWkNRVUZCTzBWQlEycERMRTlCUVU4c1JVRkJSVHRKUVVOUUxFZEJRVWNzUjBGQlJ5eFRRVUZUTzBsQlEyWXNSVUZCUlN4SlFVRkpMRkZCUVZFN1IwRkRaanRGUVVORUxFMUJRVTBzUlVGQlJTeERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1pVRkJaU3hEUVVGRE8wVkJRM1JETEdWQlFXVXNSVUZCUlN4WlFVRlpPMGxCUXpOQ0xFOUJRVTg3VFVGRFRDeFBRVUZQTEVWQlFVVXNTMEZCU3p0TFFVTm1MRU5CUVVNN1IwRkRTRHRGUVVORUxHVkJRV1VzUlVGQlJTeFpRVUZaTzBsQlF6TkNMRTlCUVU4N1RVRkRUQ3hKUVVGSkxFVkJRVVVzVTBGQlV6dExRVU5vUWl4RFFVRkRPMGRCUTBnN1JVRkRSQ3hOUVVGTkxFVkJRVVVzV1VGQldUdEpRVU5zUWl4SlFVRkpMRTlCUVU4c1MwRkJTeXhUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRKUVVNelF5eEpRVUZKTEZGQlFWRXNTVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RlFVRkZMRWxCUVVrc2IwSkJRVUVzVFVGQlN5eEZRVUZCTEVsQlFVTXNSVUZCUVN4dlFrRkJRU3hIUVVGRkxFVkJRVUVzU1VGQlF5eEZRVUZETEU5QlFWa3NRMEZCUVN4RlFVRkJMRWRCUVZFc1EwRkJRU3hEUVVGRExFTkJRVU03UVVGRGFFY3NTVUZCU1N4SlFVRkpMRXRCUVVzc1EwRkJRenM3U1VGRlZpeExRVUZMTEVkQlFVYzdUVUZEVGl4VFFVRlRMRXRCUVVzc1kwRkJZenROUVVNMVFpeFpRVUZaTEVWQlFVVXNTVUZCU1N4RFFVRkRMR2xDUVVGcFFqdE5RVU53UXl4UFFVRlBMRTlCUVU4c1NVRkJTU3hEUVVGRExHTkJRV003UVVGRGRrTXNTMEZCU3l4RFFVRkRPenRKUVVWR08wMUJRMFVzYjBKQlFVRXNUVUZCU3l4RlFVRkJMR2RDUVVGQkxFZEJRVUVzUTBGQlJTeEhRVUZITEV0QlFVOHNRMEZCUVN4RlFVRkJPMUZCUTJRc1VVRkJVenROUVVOTUxFTkJRVUU3VFVGRFVEdEhRVU5JTzBWQlEwUXNXVUZCV1N4RlFVRkZMRmxCUVZrN1NVRkRlRUlzU1VGQlNTeExRVUZMTEVOQlFVTTdTVUZEVml4SlFVRkpMRTlCUVU4c1IwRkJSenROUVVOYUxFTkJRVU1zU1VGQlNTeEZRVUZGTEZOQlFWTXNRMEZCUXl4VFFVRlRMRU5CUVVNc1JVRkJSU3hMUVVGTExFVkJRVVVzVTBGQlV5eERRVUZETzAxQlF6bERMRU5CUVVNc1NVRkJTU3hGUVVGRkxGTkJRVk1zUTBGQlF5eFJRVUZSTEVOQlFVTXNSVUZCUlN4TFFVRkxMRVZCUVVVc1VVRkJVU3hEUVVGRE8wRkJRMnhFTEV0QlFVc3NRMEZCUXpzN1NVRkZSaXhMUVVGTExFZEJRVWM3VFVGRFRpeEhRVUZITEU5QlFVOHNWVUZCVlR0TlFVTndRaXhMUVVGTExFdEJRVXNzVDBGQlR6dE5RVU5xUWl4UlFVRlJMRVZCUVVVc1UwRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRPMDFCUTNCRExFOUJRVThzUjBGQlJ5eFBRVUZQTzAxQlEycENMRkZCUVZFc1JVRkJSU3hKUVVGSkxFTkJRVU1zWjBKQlFXZENPMDFCUXk5Q0xFbEJRVWtzVFVGQlRTeEpRVUZKTzBGQlEzQkNMRXRCUVVzc1EwRkJRenM3U1VGRlJqdE5RVU5GTEc5Q1FVRkRMRkZCUVZFc1JVRkJRU3huUWtGQlFTeEhRVUZCTEVOQlFVVXNSMEZCUnl4TFFVRk5MRU5CUVVFc1EwRkJSeXhEUVVGQk8wMUJRM1pDTzBkQlEwZzdSVUZEUkN4WFFVRlhMRVZCUVVVc1dVRkJXVHRKUVVOMlFpeEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNc1QwRkJUeXhGUVVGRkxFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTTdSMEZEYWtNN1JVRkRSQ3hwUWtGQmFVSXNSVUZCUlN4WlFVRlpPMGxCUXpkQ0xFbEJRVWtzUTBGQlF5eFhRVUZYTEVWQlFVVXNRMEZCUXp0SFFVTndRanRGUVVORUxHTkJRV01zUlVGQlJTeFZRVUZWTEVOQlFVTXNSVUZCUlR0SlFVTXpRaXhEUVVGRExFTkJRVU1zWTBGQll5eEZRVUZGTEVOQlFVTTdRVUZEZGtJc1NVRkJTU3hEUVVGRExFTkJRVU1zWlVGQlpTeEZRVUZGTEVOQlFVTTdPMGxCUlhCQ0xFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4UFFVRlBMRVZCUVVVc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRMRU5CUVVNN1IwRkRhRVE3UlVGRFJDeHJRa0ZCYTBJc1JVRkJSU3haUVVGWk8wbEJRemxDTEVsQlFVa3NRMEZCUXl4blFrRkJaMElzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0SFFVTnFRenRGUVVORUxHMUNRVUZ0UWl4RlFVRkZMRmxCUVZrN1NVRkRMMElzU1VGQlNTeERRVUZETEdkQ1FVRm5RaXhEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzBkQlEyeERPMFZCUTBRc1owSkJRV2RDTEVWQlFVVXNWVUZCVlN4TlFVRk5MRVZCUVVVN1FVRkRkRU1zU1VGQlNTeEpRVUZKTEVOQlFVTXNWMEZCVnl4RlFVRkZMRU5CUVVNN08wbEJSVzVDTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGUkxFVkJRVVU3VFVGRGRrSXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGUkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdTMEZETjBJN1IwRkRSanRCUVVOSUxFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVklMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzWVVGQllTeERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5b3FYRzRnS2lCQWFuTjRJRkpsWVdOMExrUlBUVnh1SUNvdlhHNWNiblpoY2lCQmJtUlBjbE5sYkdWamRHOXlPMXh1ZG1GeUlIUjVjR1Z6WDIxaGNDQTlJSHQ5TzF4dWRtRnlJRkpsWVdOMElDQWdJQ0E5SUhKbGNYVnBjbVVvSjNKbFlXTjBKeWs3WEc1MllYSWdTV052YmlBZ0lDQWdJRDBnY21WeGRXbHlaU2duTGk5cFkyOXVYM2R5WVhCd1pYSXVhbk40SnlrN1hHNTJZWElnUkhKdmNHUnZkMjRnSUQwZ2NtVnhkV2x5WlNnbkxpOWtjbTl3Wkc5M2JpNXFjM2duS1R0Y2JuWmhjaUJCVGtSZlZrRk1WVVVnUFNBbllXNWtKenRjYm5aaGNpQlBVbDlXUVV4VlJTQWdQU0FuYjNJblhHNWNiblI1Y0dWelgyMWhjRnRCVGtSZlZrRk1WVVZkSUQwZ0oyRnNiQ2M3WEc1MGVYQmxjMTl0WVhCYlQxSmZWa0ZNVlVWZElDQTlJQ2RoYm5rbk8xeHVYRzVCYm1SUGNsTmxiR1ZqZEc5eUlEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1SUNCemRHRjBhV056T2lCN1hHNGdJQ0FnUVU1RU9pQWdRVTVFWDFaQlRGVkZMRnh1SUNBZ0lFOVNPaUFnSUU5U1gxWkJURlZGWEc0Z0lIMHNYRzRnSUcxcGVHbHVjem9nVzFKbFlXTjBMbUZrWkc5dWN5NVFkWEpsVW1WdVpHVnlUV2w0YVc1ZExGeHVJQ0JuWlhSSmJtbDBhV0ZzVTNSaGRHVTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdlMXh1SUNBZ0lDQWdaV1JwZEdsdVp6b2dabUZzYzJWY2JpQWdJQ0I5TzF4dUlDQjlMRnh1SUNCblpYUkVaV1poZFd4MFVISnZjSE02SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCeVpYUjFjbTRnZTF4dUlDQWdJQ0FnZEhsd1pUb2dRVTVFWDFaQlRGVkZYRzRnSUNBZ2ZUdGNiaUFnZlN4Y2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkbUZ5SUdOMWNuSmxiblFnSUNBOUlIUjVjR1Z6WDIxaGNGdDBhR2x6TG5CeWIzQnpMblI1Y0dWZE8xeHVJQ0FnSUhaaGNpQmpiMjUwWlc1MGN5QWdQU0IwYUdsekxuTjBZWFJsTG1Wa2FYUnBibWNnUHlCMGFHbHpMbDlpZFdsc1pFVmthWFJ2Y2lncElEb2dLRHh6Y0dGdVBqeGhQbnRqZFhKeVpXNTBmVHd2WVQ0NlBDOXpjR0Z1UGlrN1hHNGdJQ0FnZG1GeUlIQnliM0J6TzF4dVhHNGdJQ0FnY0hKdmNITWdQU0I3WEc0Z0lDQWdJQ0JqYkdGemMwNWhiV1U2SUNBZ0lDZGphR0ZwYmlCaGJtUXRiM0luTEZ4dUlDQWdJQ0FnYjI1TmIzVnpaVXhsWVhabE9pQjBhR2x6TGw5b1lXNWtiR1ZOYjNWelpVeGxZWFpsTEZ4dUlDQWdJQ0FnYjI1RGJHbGphem9nSUNBZ0lDQjBhR2x6TGw5MGIyZG5iR1ZGWkdsMGFXNW5YRzRnSUNBZ2ZUdGNibHh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOGMzQmhiaUI3TGk0dWNISnZjSE45UGx4dUlDQWdJQ0FnSUNCN1kyOXVkR1Z1ZEhOOVhHNGdJQ0FnSUNBOEwzTndZVzQrWEc0Z0lDQWdLVHRjYmlBZ2ZTeGNiaUFnWDJKMWFXeGtSV1JwZEc5eU9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkbUZ5SUhCeWIzQnpPMXh1SUNBZ0lIWmhjaUJqYUc5cFkyVnpJRDBnVzF4dUlDQWdJQ0FnZTNSbGVIUTZJSFI1Y0dWelgyMWhjRnRCVGtSZlZrRk1WVVZkTENCMllXeDFaVG9nUVU1RVgxWkJURlZGZlN4Y2JpQWdJQ0FnSUh0MFpYaDBPaUIwZVhCbGMxOXRZWEJiVDFKZlZrRk1WVVZkTENCMllXeDFaVG9nVDFKZlZrRk1WVVY5WEc0Z0lDQWdYVHRjYmx4dUlDQWdJSEJ5YjNCeklEMGdlMXh1SUNBZ0lDQWdjbVZtT2lBZ0lDQWdJQ2RrY205d1pHOTNiaWNzWEc0Z0lDQWdJQ0IwYUdWdFpUb2dJQ0FnSjJ4cFoyaDBKeXhjYmlBZ0lDQWdJSE5sYkdWamRHVmtPaUIwZVhCbGMxOXRZWEJiZEdocGN5NXdjbTl3Y3k1MGVYQmxYU3hjYmlBZ0lDQWdJR05vYjJsalpYTTZJQ0JqYUc5cFkyVnpMRnh1SUNBZ0lDQWdiMjVEYUc5cFkyVTZJSFJvYVhNdVgyaGhibVJzWlZObGJHVmpkR2x2Yml4Y2JpQWdJQ0FnSUc5d1pXNDZJQ0FnSUNCMGNuVmxYRzRnSUNBZ2ZUdGNibHh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOFJISnZjR1J2ZDI0Z2V5NHVMbkJ5YjNCemZTQXZQbHh1SUNBZ0lDazdYRzRnSUgwc1hHNGdJRjlsYm1SRlpHbDBhVzVuT2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2RHaHBjeTV6WlhSVGRHRjBaU2g3WldScGRHbHVaem9nWm1Gc2MyVjlLVHRjYmlBZ2ZTeGNiaUFnWDJoaGJtUnNaVTF2ZFhObFRHVmhkbVU2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMGFHbHpMbDlsYm1SRlpHbDBhVzVuS0NrN1hHNGdJSDBzWEc0Z0lGOTBiMmRuYkdWRlpHbDBhVzVuT2lCbWRXNWpkR2x2YmlBb1pTa2dlMXh1SUNBZ0lHVXVjSEpsZG1WdWRFUmxabUYxYkhRb0tUdGNiaUFnSUNCbExuTjBiM0JRY205d1lXZGhkR2x2YmlncE8xeHVYRzRnSUNBZ2RHaHBjeTV6WlhSVGRHRjBaU2g3WldScGRHbHVaem9nSVNCMGFHbHpMbk4wWVhSbExtVmthWFJwYm1kOUtUdGNiaUFnZlN4Y2JpQWdYMmhoYm1Sc1pVOXlVMlZzWldOMGFXOXVPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZEdocGN5NWZhR0Z1Wkd4bFUyVnNaV04wYVc5dUtFOVNYMVpCVEZWRktUdGNiaUFnZlN4Y2JpQWdYMmhoYm1Sc1pVRnVaRk5sYkdWamRHbHZiam9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhSb2FYTXVYMmhoYm1Sc1pWTmxiR1ZqZEdsdmJpaEJUa1JmVmtGTVZVVXBPMXh1SUNCOUxGeHVJQ0JmYUdGdVpHeGxVMlZzWldOMGFXOXVPaUJtZFc1amRHbHZiaUFvWTJodmFXTmxLU0I3WEc0Z0lDQWdkR2hwY3k1ZlpXNWtSV1JwZEdsdVp5Z3BPMXh1WEc0Z0lDQWdhV1lnS0hSb2FYTXVjSEp2Y0hNdWIyNURhR0Z1WjJVcElIdGNiaUFnSUNBZ0lIUm9hWE11Y0hKdmNITXViMjVEYUdGdVoyVW9ZMmh2YVdObEtUdGNiaUFnSUNCOVhHNGdJSDFjYm4wcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRUZ1WkU5eVUyVnNaV04wYjNJN1hHNGlYWDA9IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBBdXRvY29tcGxldGU7XG52YXIga2V5TWFwO1xudmFyICQgICAgICAgICAgID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgUmVhY3QgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEJhY2tib25lICAgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBCdXR0b24gICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvYnV0dG9uLmpzeCcpO1xudmFyIERyb3Bkb3duICAgID0gcmVxdWlyZSgnLi9kcm9wZG93bi5qc3gnKTtcbnZhciBfICAgICAgICAgICA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciBIb3RrZXlzICAgICA9IHJlcXVpcmUoJ3JlYWN0LWhvdGtleXMnKS5Ib3RLZXlzO1xuXG5rZXlNYXAgPSB7XG4gICdtb3ZlVXAnOiAgICd1cCcsXG4gICdtb3ZlRG93bic6ICdkb3duJyxcbiAgJ3NlbGVjdCc6ICAgJ2VudGVyJ1xufTtcblxuZnVuY3Rpb24gZGV0ZXJtaW5lVmFsdWUgKHZhbHVlLCBtdWx0aSkge1xuICBpZiAobXVsdGkpIHtcbiAgICByZXR1cm4gZGV0ZXJtaW5lTXVsdGlWYWx1ZXModmFsdWUpO1xuICB9XG5cbiAgcmV0dXJuIGRldGVybWluZVNpbmdsZVZhbHVlKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gZGV0ZXJtaW5lTXVsdGlWYWx1ZXMgKHZhbHVlcykge1xuICBpZiAoISBBcnJheS5pc0FycmF5KHZhbHVlcykpIHtcbiAgICB2YWx1ZXMgPSBbdmFsdWVzXTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZXM7XG59XG5cbmZ1bmN0aW9uIGRldGVybWluZVNpbmdsZVZhbHVlICh2YWx1ZSkge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICB0aHJvdyAnRXhwZWN0ZWQgJyArIHZhbHVlICsgJyB0byBub3QgYmUgYW4gQXJyYXknO1xuICB9XG5cbiAgaWYgKF8uaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFsdWUgPSB7dGV4dDogdmFsdWV9O1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5BdXRvY29tcGxldGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQXV0b2NvbXBsZXRlXCIsXG4gIHN0YXRpY3M6IHtcbiAgICBkZXRlcm1pbmVWYWx1ZTogZGV0ZXJtaW5lVmFsdWVcbiAgfSxcbiAgcHJvcFR5cGVzOiB7XG4gICAgZWRpdGluZzogICAgUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgbXVsdGk6ICAgICAgUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgb3B0aW9uczogICAgUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuICAgIGdlbmVyYXRvcjogIFJlYWN0LlByb3BUeXBlcy5mdW5jXG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZSA9IEF1dG9jb21wbGV0ZS5kZXRlcm1pbmVWYWx1ZSh0aGlzLnByb3BzLnZhbHVlLCB0aGlzLnByb3BzLm11bHRpKTtcblxuICAgIHJldHVybiB7XG4gICAgICBlZGl0aW5nOiAgICB0aGlzLnByb3BzLmVkaXRpbmcsXG4gICAgICB2YWx1ZTogICAgICB2YWx1ZSxcbiAgICAgIHRleHRWYWx1ZTogICh2YWx1ZSAmJiB2YWx1ZS50ZXh0KSB8fCAnJyxcbiAgICAgIGFjdGl2ZTogICAgIG51bGwsXG4gICAgICBvcHRpb25zOiAgICB0aGlzLnByb3BzLm9wdGlvbnNcbiAgICB9O1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZWRpdGluZzogICAgZmFsc2UsXG4gICAgICBtdWx0aTogICAgICBmYWxzZSxcbiAgICAgIG9wdGlvbnM6ICAgIFtdLFxuICAgICAgZ2VuZXJhdG9yOiAgbnVsbFxuICAgIH07XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mb2N1c1NlYXJjaCgpO1xuICB9LFxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZvY3VzU2VhcmNoKCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zO1xuICAgIHZhciBoYW5kbGVycyA9IHtcbiAgICAgIG1vdmVVcDogICB0aGlzLm1vdmVVcCxcbiAgICAgIG1vdmVEb3duOiB0aGlzLm1vdmVEb3duLFxuICAgICAgc2VsZWN0OiAgIHRoaXMuc2VsZWN0SXRlbVxuICAgIH07XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5lZGl0aW5nKSB7XG4gICAgICBvcHRpb25zID0gdGhpcy5idWlsZE9wdGlvbnMoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChIb3RrZXlzLCB7a2V5TWFwOiBrZXlNYXAsIGhhbmRsZXJzOiBoYW5kbGVyc30sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZnYtYXV0b2NvbXBsZXRlXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3JlZjogXCJpbnB1dFwiLCBjbGFzc05hbWU6IFwiaW5wdXRhYmxlXCIsIHR5cGU6IFwidGV4dFwiLCBwbGFjZWhvbGRlcjogXCJzZWFyY2ggY3JpdGVyaWFcIiwgcmVmOiBcImlucHV0XCIsIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZUNoYW5nZSwgZGVmYXVsdFZhbHVlOiB0aGlzLnN0YXRlLnRleHRWYWx1ZX0pLCBcbiAgICAgICAgICBvcHRpb25zXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBidWlsZE9wdGlvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMuc3RhdGUub3B0aW9ucztcbiAgICB2YXIgdGV4dCAgICA9IHRoaXMuc3RhdGUudGV4dFZhbHVlO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuZ2VuZXJhdG9yKSB7XG4gICAgICBvcHRpb25zID0gdGhpcy5wcm9wcy5nZW5lcmF0b3IodGhpcy5zdGF0ZS50ZXh0VmFsdWUpO1xuICAgIH1cblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IFtdO1xuICAgIG9wdGlvbnMgPSBvcHRpb25zLm1hcChmdW5jdGlvbiAob3B0aW9uLCBpbmRleCkge1xuICAgICAgdmFyIGNsYXNzZXMgPSBbJ29wdGlvbicsICdzZWxlY3RhYmxlJ107XG5cbiAgICAgIGNsYXNzZXMucHVzaCgnYWN0aXZlLScgKyAoaW5kZXggPT09IHRoaXMuc3RhdGUuYWN0aXZlKSk7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7a2V5OiBpbmRleCwgY2xhc3NOYW1lOiBjbGFzc2VzLmpvaW4oJyAnKSwgb25DbGljazogdGhpcy5oYW5kbGVTZWxlY3QuYmluZCh0aGlzLCBvcHRpb24pfSwgb3B0aW9uLmxhYmVsKVxuICAgICAgKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIGlmIChvcHRpb25zLmxlbmd0aCA8IDEpIHtcbiAgICAgIG9wdGlvbnMgPSAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7Y2xhc3NOYW1lOiBcIm11dGVkIG9wdGlvbiB1bnNlbGVjdGFibGVcIn0sIFwiTm8gbWF0Y2hlcyBmb3VuZFwiKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm9wdGlvbnNcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwge3JlZjogXCJvcHRpb25zXCJ9LCBcbiAgICAgICAgICBvcHRpb25zXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBoYW5kbGVTZWxlY3Q6IGZ1bmN0aW9uIChvcHRpb24sIGUpIHtcbiAgICB2YXIgY3VycmVudF92YWx1ZSA9IHRoaXMuc3RhdGUudmFsdWU7XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIGlmICh0aGlzLnByb3BzLm11bHRpKSB7XG4gICAgICBjdXJyZW50X3ZhbHVlID0gdGhpcy5zdGF0ZS52YWx1ZS5zbGljZSgpO1xuICAgICAgY3VycmVudF92YWx1ZS5wdXNoKG9wdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2YWx1ZTogICAgICBjdXJyZW50X3ZhbHVlLFxuICAgICAgdGV4dFZhbHVlOiAgJydcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLnByb3BzLm9uU2VsZWN0KSB7XG4gICAgICB0aGlzLnByb3BzLm9uU2VsZWN0KG9wdGlvbiwgY3VycmVudF92YWx1ZSk7XG4gICAgfVxuICB9LFxuICBoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLnN0YXRlLm9wdGlvbnM7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5nZW5lcmF0b3IpIHtcbiAgICAgIG9wdGlvbnMgPSB0aGlzLnByb3BzLmdlbmVyYXRvcihlLnRhcmdldC52YWx1ZSlcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHRleHRWYWx1ZTogIGUudGFyZ2V0LnZhbHVlLFxuICAgICAgYWN0aXZlOiAgICAgZS50YXJnZXQudmFsdWUgPyAwIDogbnVsbCxcbiAgICAgIG9wdGlvbnM6ICAgIG9wdGlvbnNcbiAgICB9KTtcbiAgfSxcbiAgbW92ZURvd246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3VycmVudCA9IHRoaXMuc3RhdGUuYWN0aXZlO1xuXG5cbiAgICBpZiAoY3VycmVudCA9PT0gbnVsbCkge1xuICAgICAgY3VycmVudCA9IC0xO1xuICAgIH1cblxuICAgIGN1cnJlbnQrKztcblxuICAgIHRoaXMuc2V0U3RhdGUoe2FjdGl2ZTogY3VycmVudH0pO1xuICB9LFxuICBtb3ZlVXA6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3VycmVudCA9IHRoaXMuc3RhdGUuYWN0aXZlO1xuXG4gICAgaWYgKGN1cnJlbnQgPT09IG51bGwpIHtcbiAgICAgIGN1cnJlbnQgPSAxO1xuICAgIH1cblxuICAgIGN1cnJlbnQtLTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe2FjdGl2ZTogY3VycmVudH0pO1xuICB9LFxuICBmb2N1c1NlYXJjaDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghIHRoaXMuc3RhdGUuZWRpdGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBub2RlID0gUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmlucHV0KTtcblxuICAgIG5vZGUuZm9jdXMoKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0b2NvbXBsZXRlO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WTJGelpYTXZZWFYwYjJOdmJYQnNaWFJsTG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHM3UVVGRlFTeEhRVUZIT3p0QlFVVklMRWxCUVVrc1dVRkJXU3hEUVVGRE8wRkJRMnBDTEVsQlFVa3NUVUZCVFN4RFFVRkRPMEZCUTFnc1NVRkJTU3hEUVVGRExHRkJRV0VzVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMEZCUTNCRExFbEJRVWtzUzBGQlN5eFRRVUZUTEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVOdVF5eEpRVUZKTEZGQlFWRXNUVUZCVFN4UFFVRlBMRU5CUVVNc1ZVRkJWU3hEUVVGRExFTkJRVU03UVVGRGRFTXNTVUZCU1N4TlFVRk5MRkZCUVZFc1QwRkJUeXhEUVVGRExEWkNRVUUyUWl4RFFVRkRMRU5CUVVNN1FVRkRla1FzU1VGQlNTeFJRVUZSTEUxQlFVMHNUMEZCVHl4RFFVRkRMR2RDUVVGblFpeERRVUZETEVOQlFVTTdRVUZETlVNc1NVRkJTU3hEUVVGRExHRkJRV0VzVDBGQlR5eERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPMEZCUTNoRExFbEJRVWtzVDBGQlR5eFBRVUZQTEU5QlFVOHNRMEZCUXl4bFFVRmxMRU5CUVVNc1EwRkJReXhQUVVGUExFTkJRVU03TzBGQlJXNUVMRTFCUVUwc1IwRkJSenRGUVVOUUxGRkJRVkVzU1VGQlNTeEpRVUZKTzBWQlEyaENMRlZCUVZVc1JVRkJSU3hOUVVGTk8wVkJRMnhDTEZGQlFWRXNTVUZCU1N4UFFVRlBPMEZCUTNKQ0xFTkJRVU1zUTBGQlF6czdRVUZGUml4VFFVRlRMR05CUVdNc1JVRkJSU3hMUVVGTExFVkJRVVVzUzBGQlN5eEZRVUZGTzBWQlEzSkRMRWxCUVVrc1MwRkJTeXhGUVVGRk8wbEJRMVFzVDBGQlR5eHZRa0ZCYjBJc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dEJRVU4yUXl4SFFVRkhPenRGUVVWRUxFOUJRVThzYjBKQlFXOUNMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03UVVGRGNrTXNRMEZCUXpzN1FVRkZSQ3hUUVVGVExHOUNRVUZ2UWl4RlFVRkZMRTFCUVUwc1JVRkJSVHRGUVVOeVF5eEpRVUZKTEVWQlFVVXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zUlVGQlJUdEpRVU16UWl4TlFVRk5MRWRCUVVjc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dEJRVU4wUWl4SFFVRkhPenRGUVVWRUxFOUJRVThzVFVGQlRTeERRVUZETzBGQlEyaENMRU5CUVVNN08wRkJSVVFzVTBGQlV5eHZRa0ZCYjBJc1JVRkJSU3hMUVVGTExFVkJRVVU3UlVGRGNFTXNTVUZCU1N4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExFdEJRVXNzUTBGQlF5eEZRVUZGTzBsQlEzaENMRTFCUVUwc1YwRkJWeXhIUVVGSExFdEJRVXNzUjBGQlJ5eHhRa0ZCY1VJc1EwRkJRenRCUVVOMFJDeEhRVUZIT3p0RlFVVkVMRWxCUVVrc1EwRkJReXhEUVVGRExGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNSVUZCUlR0SlFVTnlRaXhMUVVGTExFZEJRVWNzUTBGQlF5eEpRVUZKTEVWQlFVVXNTMEZCU3l4RFFVRkRMRU5CUVVNN1FVRkRNVUlzUjBGQlJ6czdSVUZGUkN4UFFVRlBMRXRCUVVzc1EwRkJRenRCUVVObUxFTkJRVU03TzBGQlJVUXNhME5CUVd0RExEUkNRVUZCTzBWQlEyaERMRTlCUVU4c1JVRkJSVHRKUVVOUUxHTkJRV01zUlVGQlJTeGpRVUZqTzBkQlF5OUNPMFZCUTBRc1UwRkJVeXhGUVVGRk8wbEJRMVFzVDBGQlR5eExRVUZMTEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTVHRKUVVOb1F5eExRVUZMTEU5QlFVOHNTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhKUVVGSk8wbEJRMmhETEU5QlFVOHNTMEZCU3l4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFdEJRVXM3U1VGRGFrTXNVMEZCVXl4SFFVRkhMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNUdEhRVU5xUXp0RlFVTkVMR1ZCUVdVc1JVRkJSU3haUVVGWk8wRkJReTlDTEVsQlFVa3NTVUZCU1N4TFFVRkxMRWRCUVVjc1dVRkJXU3hEUVVGRExHTkJRV01zUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPenRKUVVVMVJTeFBRVUZQTzAxQlEwd3NUMEZCVHl4TFFVRkxMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR6dE5RVU01UWl4TFFVRkxMRTlCUVU4c1MwRkJTenROUVVOcVFpeFRRVUZUTEVkQlFVY3NRMEZCUXl4TFFVRkxMRWxCUVVrc1MwRkJTeXhEUVVGRExFbEJRVWtzUzBGQlN5eEZRVUZGTzAxQlEzWkRMRTFCUVUwc1RVRkJUU3hKUVVGSk8wMUJRMmhDTEU5QlFVOHNTMEZCU3l4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVTg3UzBGREwwSXNRMEZCUXp0SFFVTklPMFZCUTBRc1pVRkJaU3hGUVVGRkxGbEJRVms3U1VGRE0wSXNUMEZCVHp0TlFVTk1MRTlCUVU4c1MwRkJTeXhMUVVGTE8wMUJRMnBDTEV0QlFVc3NUMEZCVHl4TFFVRkxPMDFCUTJwQ0xFOUJRVThzUzBGQlN5eEZRVUZGTzAxQlEyUXNVMEZCVXl4SFFVRkhMRWxCUVVrN1MwRkRha0lzUTBGQlF6dEhRVU5JTzBWQlEwUXNhVUpCUVdsQ0xFVkJRVVVzV1VGQldUdEpRVU0zUWl4SlFVRkpMRU5CUVVNc1YwRkJWeXhGUVVGRkxFTkJRVU03UjBGRGNFSTdSVUZEUkN4clFrRkJhMElzUlVGQlJTeFpRVUZaTzBsQlF6bENMRWxCUVVrc1EwRkJReXhYUVVGWExFVkJRVVVzUTBGQlF6dEhRVU53UWp0RlFVTkVMRTFCUVUwc1JVRkJSU3haUVVGWk8wbEJRMnhDTEVsQlFVa3NUMEZCVHl4RFFVRkRPMGxCUTFvc1NVRkJTU3hSUVVGUkxFZEJRVWM3VFVGRFlpeE5RVUZOTEVsQlFVa3NTVUZCU1N4RFFVRkRMRTFCUVUwN1RVRkRja0lzVVVGQlVTeEZRVUZGTEVsQlFVa3NRMEZCUXl4UlFVRlJPMDFCUTNaQ0xFMUJRVTBzU1VGQlNTeEpRVUZKTEVOQlFVTXNWVUZCVlR0QlFVTXZRaXhMUVVGTExFTkJRVU03TzBsQlJVWXNTVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUlVGQlJUdE5RVU4wUWl4UFFVRlBMRWRCUVVjc1NVRkJTU3hEUVVGRExGbEJRVmtzUlVGQlJTeERRVUZETzBGQlEzQkRMRXRCUVVzN08wbEJSVVE3VFVGRFJTeHZRa0ZCUXl4UFFVRlBMRVZCUVVFc1EwRkJRU3hEUVVGRExFMUJRVUVzUlVGQlRTeERRVUZGTEUxQlFVMHNSVUZCUXl4RFFVRkRMRkZCUVVFc1JVRkJVU3hEUVVGRkxGRkJRVlVzUTBGQlFTeEZRVUZCTzFGQlF6TkRMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc2FVSkJRV3RDTEVOQlFVRXNSVUZCUVR0VlFVTXZRaXh2UWtGQlFTeFBRVUZOTEVWQlFVRXNRMEZCUVN4RFFVRkRMRWRCUVVFc1JVRkJSeXhEUVVGRExFOUJRVUVzUlVGQlR5eERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRmRCUVVFc1JVRkJWeXhEUVVGRExFbEJRVUVzUlVGQlNTeERRVUZETEUxQlFVRXNSVUZCVFN4RFFVRkRMRmRCUVVFc1JVRkJWeXhEUVVGRExHbENRVUZCTEVWQlFXbENMRU5CUVVNc1IwRkJRU3hGUVVGSExFTkJRVU1zVDBGQlFTeEZRVUZQTEVOQlFVTXNVVUZCUVN4RlFVRlJMRU5CUVVVc1NVRkJTU3hEUVVGRExGbEJRVmtzUlVGQlF5eERRVUZETEZsQlFVRXNSVUZCV1N4RFFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVTBGQlZTeERRVUZCTEVOQlFVY3NRMEZCUVN4RlFVRkJPMVZCUTJwTExFOUJRVkU3VVVGRFRDeERRVUZCTzAxQlEwVXNRMEZCUVR0TlFVTldPMGRCUTBnN1JVRkRSQ3haUVVGWkxFVkJRVVVzV1VGQldUdEpRVU40UWl4SlFVRkpMRTlCUVU4c1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRMEZCUXp0QlFVTnlReXhKUVVGSkxFbEJRVWtzU1VGQlNTeE5RVUZOTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRE96dEpRVVZ1UXl4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVTBGQlV5eEZRVUZGTzAxQlEzaENMRTlCUVU4c1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzBGQlF6TkVMRXRCUVVzN08wbEJSVVFzVDBGQlR5eEhRVUZITEU5QlFVOHNTVUZCU1N4RlFVRkZMRU5CUVVNN1NVRkRlRUlzVDBGQlR5eEhRVUZITEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJWU3hOUVVGTkxFVkJRVVVzUzBGQlN5eEZRVUZGTzBGQlEyNUVMRTFCUVUwc1NVRkJTU3hQUVVGUExFZEJRVWNzUTBGQlF5eFJRVUZSTEVWQlFVVXNXVUZCV1N4RFFVRkRMRU5CUVVNN08wRkJSVGRETEUxQlFVMHNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFbEJRVWtzUzBGQlN5eExRVUZMTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU1zUTBGQlF6czdUVUZGZUVRN1VVRkRSU3h2UWtGQlFTeEpRVUZITEVWQlFVRXNRMEZCUVN4RFFVRkRMRWRCUVVFc1JVRkJSeXhEUVVGRkxFdEJRVXNzUlVGQlF5eERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkZMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVTXNRMEZCUXl4UFFVRkJMRVZCUVU4c1EwRkJSU3hKUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRVZCUVVVc1RVRkJUU3hEUVVGSExFTkJRVUVzUlVGQlF5eE5RVUZOTEVOQlFVTXNTMEZCVnl4RFFVRkJPMUZCUTJoSU8wRkJRMUlzUzBGQlN5eEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPenRKUVVWVUxFbEJRVWtzVDBGQlR5eERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRVZCUVVVN1RVRkRkRUlzVDBGQlR6dFJRVU5NTEc5Q1FVRkJMRWxCUVVjc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNNa0pCUVRSQ0xFTkJRVUVzUlVGQlFTeHJRa0ZCY1VJc1EwRkJRVHRQUVVOb1JTeERRVUZETzBGQlExSXNTMEZCU3pzN1NVRkZSRHROUVVORkxHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zVTBGQlZTeERRVUZCTEVWQlFVRTdVVUZEZGtJc2IwSkJRVUVzU1VGQlJ5eEZRVUZCTEVOQlFVRXNRMEZCUXl4SFFVRkJMRVZCUVVjc1EwRkJReXhUUVVGVkxFTkJRVUVzUlVGQlFUdFZRVU5tTEU5QlFWRTdVVUZEVGl4RFFVRkJPMDFCUTBRc1EwRkJRVHROUVVOT08wZEJRMGc3UlVGRFJDeFpRVUZaTEVWQlFVVXNWVUZCVlN4TlFVRk5MRVZCUVVVc1EwRkJReXhGUVVGRk8wRkJRM0pETEVsQlFVa3NTVUZCU1N4aFFVRmhMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTTdPMGxCUlhKRExFTkJRVU1zUTBGQlF5eGpRVUZqTEVWQlFVVXNRMEZCUXp0QlFVTjJRaXhKUVVGSkxFTkJRVU1zUTBGQlF5eGxRVUZsTEVWQlFVVXNRMEZCUXpzN1NVRkZjRUlzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1JVRkJSVHROUVVOd1FpeGhRVUZoTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN5eEZRVUZGTEVOQlFVTTdUVUZEZWtNc1lVRkJZU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVTnFReXhMUVVGTE96dEpRVVZFTEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNN1RVRkRXaXhMUVVGTExFOUJRVThzWVVGQllUdE5RVU42UWl4VFFVRlRMRWRCUVVjc1JVRkJSVHRCUVVOd1FpeExRVUZMTEVOQlFVTXNRMEZCUXpzN1NVRkZTQ3hKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVVUZCVVN4RlFVRkZPMDFCUTNaQ0xFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVVUZCVVN4RFFVRkRMRTFCUVUwc1JVRkJSU3hoUVVGaExFTkJRVU1zUTBGQlF6dExRVU0xUXp0SFFVTkdPMFZCUTBRc1dVRkJXU3hGUVVGRkxGVkJRVlVzUTBGQlF5eEZRVUZGTzBGQlF6ZENMRWxCUVVrc1NVRkJTU3hQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNN08wbEJSV3BETEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhUUVVGVExFVkJRVVU3VFVGRGVFSXNUMEZCVHl4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRE8wRkJRM0JFTEV0QlFVczdPMGxCUlVRc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF6dE5RVU5hTEZOQlFWTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXM3VFVGRE1VSXNUVUZCVFN4TlFVRk5MRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eEhRVUZITEVOQlFVTXNSMEZCUnl4SlFVRkpPMDFCUTNKRExFOUJRVThzUzBGQlN5eFBRVUZQTzB0QlEzQkNMRU5CUVVNc1EwRkJRenRIUVVOS08wVkJRMFFzVVVGQlVTeEZRVUZGTEZsQlFWazdRVUZEZUVJc1NVRkJTU3hKUVVGSkxFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkJRenRCUVVOd1F6czdTVUZGU1N4SlFVRkpMRTlCUVU4c1MwRkJTeXhKUVVGSkxFVkJRVVU3VFVGRGNFSXNUMEZCVHl4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRMjVDTEV0QlFVczdPMEZCUlV3c1NVRkJTU3hQUVVGUExFVkJRVVVzUTBGQlF6czdTVUZGVml4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zVFVGQlRTeEZRVUZGTEU5QlFVOHNRMEZCUXl4RFFVRkRMRU5CUVVNN1IwRkRiRU03UlVGRFJDeE5RVUZOTEVWQlFVVXNXVUZCV1R0QlFVTjBRaXhKUVVGSkxFbEJRVWtzVDBGQlR5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRE96dEpRVVZvUXl4SlFVRkpMRTlCUVU4c1MwRkJTeXhKUVVGSkxFVkJRVVU3VFVGRGNFSXNUMEZCVHl4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVOc1FpeExRVUZMT3p0QlFVVk1MRWxCUVVrc1QwRkJUeXhGUVVGRkxFTkJRVU03TzBsQlJWWXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExFMUJRVTBzUlVGQlJTeFBRVUZQTEVOQlFVTXNRMEZCUXl4RFFVRkRPMGRCUTJ4RE8wVkJRMFFzVjBGQlZ5eEZRVUZGTEZsQlFWazdTVUZEZGtJc1NVRkJTU3hGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RlFVRkZPMDFCUTNoQ0xFOUJRVTg3UVVGRFlpeExRVUZMT3p0QlFVVk1MRWxCUVVrc1NVRkJTU3hKUVVGSkxFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZET3p0SlFVVTVReXhKUVVGSkxFTkJRVU1zUzBGQlN5eEZRVUZGTEVOQlFVTTdSMEZEWkR0QlFVTklMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZJTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1dVRkJXU3hEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeW9xWEc0Z0tpQkFhbk40SUZKbFlXTjBMa1JQVFZ4dUlDb3ZYRzVjYm5aaGNpQkJkWFJ2WTI5dGNHeGxkR1U3WEc1MllYSWdhMlY1VFdGd08xeHVkbUZ5SUNRZ0lDQWdJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25hbkYxWlhKNUp5azdYRzUyWVhJZ1VtVmhZM1FnSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDY3BPMXh1ZG1GeUlFSmhZMnRpYjI1bElDQWdJRDBnY21WeGRXbHlaU2duWW1GamEySnZibVVuS1R0Y2JuWmhjaUJDZFhSMGIyNGdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHVMeTR1TDJOdmJYQnZibVZ1ZEhNdlluVjBkRzl1TG1wemVDY3BPMXh1ZG1GeUlFUnliM0JrYjNkdUlDQWdJRDBnY21WeGRXbHlaU2duTGk5a2NtOXdaRzkzYmk1cWMzZ25LVHRjYm5aaGNpQmZJQ0FnSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSjNWdVpHVnljMk52Y21VbktUdGNiblpoY2lCSWIzUnJaWGx6SUNBZ0lDQTlJSEpsY1hWcGNtVW9KM0psWVdOMExXaHZkR3RsZVhNbktTNUliM1JMWlhsek8xeHVYRzVyWlhsTllYQWdQU0I3WEc0Z0lDZHRiM1psVlhBbk9pQWdJQ2QxY0Njc1hHNGdJQ2R0YjNabFJHOTNiaWM2SUNka2IzZHVKeXhjYmlBZ0ozTmxiR1ZqZENjNklDQWdKMlZ1ZEdWeUoxeHVmVHRjYmx4dVpuVnVZM1JwYjI0Z1pHVjBaWEp0YVc1bFZtRnNkV1VnS0haaGJIVmxMQ0J0ZFd4MGFTa2dlMXh1SUNCcFppQW9iWFZzZEdrcElIdGNiaUFnSUNCeVpYUjFjbTRnWkdWMFpYSnRhVzVsVFhWc2RHbFdZV3gxWlhNb2RtRnNkV1VwTzF4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUdSbGRHVnliV2x1WlZOcGJtZHNaVlpoYkhWbEtIWmhiSFZsS1R0Y2JuMWNibHh1Wm5WdVkzUnBiMjRnWkdWMFpYSnRhVzVsVFhWc2RHbFdZV3gxWlhNZ0tIWmhiSFZsY3lrZ2UxeHVJQ0JwWmlBb0lTQkJjbkpoZVM1cGMwRnljbUY1S0haaGJIVmxjeWtwSUh0Y2JpQWdJQ0IyWVd4MVpYTWdQU0JiZG1Gc2RXVnpYVHRjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUIyWVd4MVpYTTdYRzU5WEc1Y2JtWjFibU4wYVc5dUlHUmxkR1Z5YldsdVpWTnBibWRzWlZaaGJIVmxJQ2gyWVd4MVpTa2dlMXh1SUNCcFppQW9RWEp5WVhrdWFYTkJjbkpoZVNoMllXeDFaU2twSUh0Y2JpQWdJQ0IwYUhKdmR5QW5SWGh3WldOMFpXUWdKeUFySUhaaGJIVmxJQ3NnSnlCMGJ5QnViM1FnWW1VZ1lXNGdRWEp5WVhrbk8xeHVJQ0I5WEc1Y2JpQWdhV1lnS0Y4dWFYTlRkSEpwYm1jb2RtRnNkV1VwS1NCN1hHNGdJQ0FnZG1Gc2RXVWdQU0I3ZEdWNGREb2dkbUZzZFdWOU8xeHVJQ0I5WEc1Y2JpQWdjbVYwZFhKdUlIWmhiSFZsTzF4dWZWeHVYRzVCZFhSdlkyOXRjR3hsZEdVZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUhOMFlYUnBZM002SUh0Y2JpQWdJQ0JrWlhSbGNtMXBibVZXWVd4MVpUb2daR1YwWlhKdGFXNWxWbUZzZFdWY2JpQWdmU3hjYmlBZ2NISnZjRlI1Y0dWek9pQjdYRzRnSUNBZ1pXUnBkR2x1WnpvZ0lDQWdVbVZoWTNRdVVISnZjRlI1Y0dWekxtSnZiMndzWEc0Z0lDQWdiWFZzZEdrNklDQWdJQ0FnVW1WaFkzUXVVSEp2Y0ZSNWNHVnpMbUp2YjJ3c1hHNGdJQ0FnYjNCMGFXOXVjem9nSUNBZ1VtVmhZM1F1VUhKdmNGUjVjR1Z6TG1GeWNtRjVMRnh1SUNBZ0lHZGxibVZ5WVhSdmNqb2dJRkpsWVdOMExsQnliM0JVZVhCbGN5NW1kVzVqWEc0Z0lIMHNYRzRnSUdkbGRFbHVhWFJwWVd4VGRHRjBaVG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQjJZV3gxWlNBOUlFRjFkRzlqYjIxd2JHVjBaUzVrWlhSbGNtMXBibVZXWVd4MVpTaDBhR2x6TG5CeWIzQnpMblpoYkhWbExDQjBhR2x6TG5CeWIzQnpMbTExYkhScEtUdGNibHh1SUNBZ0lISmxkSFZ5YmlCN1hHNGdJQ0FnSUNCbFpHbDBhVzVuT2lBZ0lDQjBhR2x6TG5CeWIzQnpMbVZrYVhScGJtY3NYRzRnSUNBZ0lDQjJZV3gxWlRvZ0lDQWdJQ0IyWVd4MVpTeGNiaUFnSUNBZ0lIUmxlSFJXWVd4MVpUb2dJQ2gyWVd4MVpTQW1KaUIyWVd4MVpTNTBaWGgwS1NCOGZDQW5KeXhjYmlBZ0lDQWdJR0ZqZEdsMlpUb2dJQ0FnSUc1MWJHd3NYRzRnSUNBZ0lDQnZjSFJwYjI1ek9pQWdJQ0IwYUdsekxuQnliM0J6TG05d2RHbHZibk5jYmlBZ0lDQjlPMXh1SUNCOUxGeHVJQ0JuWlhSRVpXWmhkV3gwVUhKdmNITTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdlMXh1SUNBZ0lDQWdaV1JwZEdsdVp6b2dJQ0FnWm1Gc2MyVXNYRzRnSUNBZ0lDQnRkV3gwYVRvZ0lDQWdJQ0JtWVd4elpTeGNiaUFnSUNBZ0lHOXdkR2x2Ym5NNklDQWdJRnRkTEZ4dUlDQWdJQ0FnWjJWdVpYSmhkRzl5T2lBZ2JuVnNiRnh1SUNBZ0lIMDdYRzRnSUgwc1hHNGdJR052YlhCdmJtVnVkRVJwWkUxdmRXNTBPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZEdocGN5NW1iMk4xYzFObFlYSmphQ2dwTzF4dUlDQjlMRnh1SUNCamIyMXdiMjVsYm5SRWFXUlZjR1JoZEdVNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjBhR2x6TG1adlkzVnpVMlZoY21Ob0tDazdYRzRnSUgwc1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCdmNIUnBiMjV6TzF4dUlDQWdJSFpoY2lCb1lXNWtiR1Z5Y3lBOUlIdGNiaUFnSUNBZ0lHMXZkbVZWY0RvZ0lDQjBhR2x6TG0xdmRtVlZjQ3hjYmlBZ0lDQWdJRzF2ZG1WRWIzZHVPaUIwYUdsekxtMXZkbVZFYjNkdUxGeHVJQ0FnSUNBZ2MyVnNaV04wT2lBZ0lIUm9hWE11YzJWc1pXTjBTWFJsYlZ4dUlDQWdJSDA3WEc1Y2JpQWdJQ0JwWmlBb2RHaHBjeTV6ZEdGMFpTNWxaR2wwYVc1bktTQjdYRzRnSUNBZ0lDQnZjSFJwYjI1eklEMGdkR2hwY3k1aWRXbHNaRTl3ZEdsdmJuTW9LVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BFaHZkR3RsZVhNZ2EyVjVUV0Z3UFh0clpYbE5ZWEI5SUdoaGJtUnNaWEp6UFh0b1lXNWtiR1Z5YzMwK1hHNGdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aVpuWXRZWFYwYjJOdmJYQnNaWFJsWENJK1hHNGdJQ0FnSUNBZ0lDQWdQR2x1Y0hWMElISmxaajFjSW1sdWNIVjBYQ0lnWTJ4aGMzTk9ZVzFsUFZ3aWFXNXdkWFJoWW14bFhDSWdkSGx3WlQxY0luUmxlSFJjSWlCd2JHRmpaV2h2YkdSbGNqMWNJbk5sWVhKamFDQmpjbWwwWlhKcFlWd2lJSEpsWmoxY0ltbHVjSFYwWENJZ2IyNURhR0Z1WjJVOWUzUm9hWE11YUdGdVpHeGxRMmhoYm1kbGZTQmtaV1poZFd4MFZtRnNkV1U5ZTNSb2FYTXVjM1JoZEdVdWRHVjRkRlpoYkhWbGZTQXZQbHh1SUNBZ0lDQWdJQ0FnSUh0dmNIUnBiMjV6ZlZ4dUlDQWdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQWdJRHd2U0c5MGEyVjVjejVjYmlBZ0lDQXBPMXh1SUNCOUxGeHVJQ0JpZFdsc1pFOXdkR2x2Ym5NNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnYjNCMGFXOXVjeUE5SUhSb2FYTXVjM1JoZEdVdWIzQjBhVzl1Y3p0Y2JpQWdJQ0IyWVhJZ2RHVjRkQ0FnSUNBOUlIUm9hWE11YzNSaGRHVXVkR1Y0ZEZaaGJIVmxPMXh1WEc0Z0lDQWdhV1lnS0hSb2FYTXVjSEp2Y0hNdVoyVnVaWEpoZEc5eUtTQjdYRzRnSUNBZ0lDQnZjSFJwYjI1eklEMGdkR2hwY3k1d2NtOXdjeTVuWlc1bGNtRjBiM0lvZEdocGN5NXpkR0YwWlM1MFpYaDBWbUZzZFdVcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUc5d2RHbHZibk1nUFNCdmNIUnBiMjV6SUh4OElGdGRPMXh1SUNBZ0lHOXdkR2x2Ym5NZ1BTQnZjSFJwYjI1ekxtMWhjQ2htZFc1amRHbHZiaUFvYjNCMGFXOXVMQ0JwYm1SbGVDa2dlMXh1SUNBZ0lDQWdkbUZ5SUdOc1lYTnpaWE1nUFNCYkoyOXdkR2x2Ymljc0lDZHpaV3hsWTNSaFlteGxKMTA3WEc1Y2JpQWdJQ0FnSUdOc1lYTnpaWE11Y0hWemFDZ25ZV04wYVhabExTY2dLeUFvYVc1a1pYZ2dQVDA5SUhSb2FYTXVjM1JoZEdVdVlXTjBhWFpsS1NrN1hHNWNiaUFnSUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBZ0lEeHNhU0JyWlhrOWUybHVaR1Y0ZlNCamJHRnpjMDVoYldVOWUyTnNZWE56WlhNdWFtOXBiaWduSUNjcGZTQnZia05zYVdOclBYdDBhR2x6TG1oaGJtUnNaVk5sYkdWamRDNWlhVzVrS0hSb2FYTXNJRzl3ZEdsdmJpbDlQbnR2Y0hScGIyNHViR0ZpWld4OVBDOXNhVDVjYmlBZ0lDQWdJQ2s3WEc0Z0lDQWdmU3dnZEdocGN5azdYRzVjYmlBZ0lDQnBaaUFvYjNCMGFXOXVjeTVzWlc1bmRHZ2dQQ0F4S1NCN1hHNGdJQ0FnSUNCdmNIUnBiMjV6SUQwZ0tGeHVJQ0FnSUNBZ0lDQThiR2tnWTJ4aGMzTk9ZVzFsUFZ3aWJYVjBaV1FnYjNCMGFXOXVJSFZ1YzJWc1pXTjBZV0pzWlZ3aVBrNXZJRzFoZEdOb1pYTWdabTkxYm1ROEwyeHBQbHh1SUNBZ0lDQWdLVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKdmNIUnBiMjV6WENJK1hHNGdJQ0FnSUNBZ0lEeDFiQ0J5WldZOVhDSnZjSFJwYjI1elhDSStYRzRnSUNBZ0lDQWdJQ0FnZTI5d2RHbHZibk45WEc0Z0lDQWdJQ0FnSUR3dmRXdytYRzRnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FwTzF4dUlDQjlMRnh1SUNCb1lXNWtiR1ZUWld4bFkzUTZJR1oxYm1OMGFXOXVJQ2h2Y0hScGIyNHNJR1VwSUh0Y2JpQWdJQ0IyWVhJZ1kzVnljbVZ1ZEY5MllXeDFaU0E5SUhSb2FYTXVjM1JoZEdVdWRtRnNkV1U3WEc1Y2JpQWdJQ0JsTG5CeVpYWmxiblJFWldaaGRXeDBLQ2s3WEc0Z0lDQWdaUzV6ZEc5d1VISnZjR0ZuWVhScGIyNG9LVHRjYmx4dUlDQWdJR2xtSUNoMGFHbHpMbkJ5YjNCekxtMTFiSFJwS1NCN1hHNGdJQ0FnSUNCamRYSnlaVzUwWDNaaGJIVmxJRDBnZEdocGN5NXpkR0YwWlM1MllXeDFaUzV6YkdsalpTZ3BPMXh1SUNBZ0lDQWdZM1Z5Y21WdWRGOTJZV3gxWlM1d2RYTm9LRzl3ZEdsdmJpazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2RHaHBjeTV6WlhSVGRHRjBaU2g3WEc0Z0lDQWdJQ0IyWVd4MVpUb2dJQ0FnSUNCamRYSnlaVzUwWDNaaGJIVmxMRnh1SUNBZ0lDQWdkR1Y0ZEZaaGJIVmxPaUFnSnlkY2JpQWdJQ0I5S1R0Y2JseHVJQ0FnSUdsbUlDaDBhR2x6TG5CeWIzQnpMbTl1VTJWc1pXTjBLU0I3WEc0Z0lDQWdJQ0IwYUdsekxuQnliM0J6TG05dVUyVnNaV04wS0c5d2RHbHZiaXdnWTNWeWNtVnVkRjkyWVd4MVpTazdYRzRnSUNBZ2ZWeHVJQ0I5TEZ4dUlDQm9ZVzVrYkdWRGFHRnVaMlU2SUdaMWJtTjBhVzl1SUNobEtTQjdYRzRnSUNBZ2RtRnlJRzl3ZEdsdmJuTWdQU0IwYUdsekxuTjBZWFJsTG05d2RHbHZibk03WEc1Y2JpQWdJQ0JwWmlBb2RHaHBjeTV3Y205d2N5NW5aVzVsY21GMGIzSXBJSHRjYmlBZ0lDQWdJRzl3ZEdsdmJuTWdQU0IwYUdsekxuQnliM0J6TG1kbGJtVnlZWFJ2Y2lobExuUmhjbWRsZEM1MllXeDFaU2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0Y2JpQWdJQ0FnSUhSbGVIUldZV3gxWlRvZ0lHVXVkR0Z5WjJWMExuWmhiSFZsTEZ4dUlDQWdJQ0FnWVdOMGFYWmxPaUFnSUNBZ1pTNTBZWEpuWlhRdWRtRnNkV1VnUHlBd0lEb2diblZzYkN4Y2JpQWdJQ0FnSUc5d2RHbHZibk02SUNBZ0lHOXdkR2x2Ym5OY2JpQWdJQ0I5S1R0Y2JpQWdmU3hjYmlBZ2JXOTJaVVJ2ZDI0NklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnWTNWeWNtVnVkQ0E5SUhSb2FYTXVjM1JoZEdVdVlXTjBhWFpsTzF4dVhHNWNiaUFnSUNCcFppQW9ZM1Z5Y21WdWRDQTlQVDBnYm5Wc2JDa2dlMXh1SUNBZ0lDQWdZM1Z5Y21WdWRDQTlJQzB4TzF4dUlDQWdJSDFjYmx4dUlDQWdJR04xY25KbGJuUXJLenRjYmx4dUlDQWdJSFJvYVhNdWMyVjBVM1JoZEdVb2UyRmpkR2wyWlRvZ1kzVnljbVZ1ZEgwcE8xeHVJQ0I5TEZ4dUlDQnRiM1psVlhBNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnWTNWeWNtVnVkQ0E5SUhSb2FYTXVjM1JoZEdVdVlXTjBhWFpsTzF4dVhHNGdJQ0FnYVdZZ0tHTjFjbkpsYm5RZ1BUMDlJRzUxYkd3cElIdGNiaUFnSUNBZ0lHTjFjbkpsYm5RZ1BTQXhPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHTjFjbkpsYm5RdExUdGNibHh1SUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTJGamRHbDJaVG9nWTNWeWNtVnVkSDBwTzF4dUlDQjlMRnh1SUNCbWIyTjFjMU5sWVhKamFEb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJR2xtSUNnaElIUm9hWE11YzNSaGRHVXVaV1JwZEdsdVp5a2dlMXh1SUNBZ0lDQWdjbVYwZFhKdU8xeHVJQ0FnSUgxY2JseHVJQ0FnSUhaaGNpQnViMlJsSUQwZ1VtVmhZM1F1Wm1sdVpFUlBUVTV2WkdVb2RHaHBjeTV5WldaekxtbHVjSFYwS1R0Y2JseHVJQ0FnSUc1dlpHVXVabTlqZFhNb0tUdGNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnUVhWMGIyTnZiWEJzWlhSbE8xeHVJbDE5IiwidmFyIENhc2VDb2xsZWN0aW9uO1xudmFyIEJhY2tib25lICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgQ2FzZU1vZGVsID0gcmVxdWlyZSgnLi9jYXNlX21vZGVsJyk7XG5cbkNhc2VDb2xsZWN0aW9uID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuICBtb2RlbDogQ2FzZU1vZGVsLFxuICBsaW5rU2libGluZ3M6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVhY2goZnVuY3Rpb24gKGhlYWRlciwgaW5kZXgpIHtcbiAgICAgIGhlYWRlci5wcmV2ID0gdGhpcy5hdChpbmRleCAtIDEpO1xuICAgICAgaGVhZGVyLm5leHQgPSB0aGlzLmF0KGluZGV4ICsgMSk7XG4gICAgfSwgdGhpcyk7XG4gIH0sXG4gIGNvbXBhcmF0b3I6IGZ1bmN0aW9uIChmaXJzdCwgc2Vjb25kKSB7XG4gICAgcmV0dXJuIGZpcnN0LmdldCgncHJpb3JpdHknKSAtIHNlY29uZC5nZXQoJ3ByaW9yaXR5Jyk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhc2VDb2xsZWN0aW9uO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WTJGelpYTXZZMkZ6WlY5amIyeHNaV04wYVc5dUxtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVa3NZMEZCWXl4RFFVRkRPMEZCUTI1Q0xFbEJRVWtzVVVGQlVTeEpRVUZKTEU5QlFVOHNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJRenRCUVVOd1F5eEpRVUZKTEZOQlFWTXNSMEZCUnl4UFFVRlBMRU5CUVVNc1kwRkJZeXhEUVVGRExFTkJRVU03TzBGQlJYaERMR05CUVdNc1IwRkJSeXhSUVVGUkxFTkJRVU1zVlVGQlZTeERRVUZETEUxQlFVMHNRMEZCUXp0RlFVTXhReXhMUVVGTExFVkJRVVVzVTBGQlV6dEZRVU5vUWl4WlFVRlpMRVZCUVVVc1dVRkJXVHRKUVVONFFpeEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1RVRkJUU3hGUVVGRkxFdEJRVXNzUlVGQlJUdE5RVU5xUXl4TlFVRk5MRU5CUVVNc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eEZRVUZGTEVOQlFVTXNTMEZCU3l4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRE8wMUJRMnBETEUxQlFVMHNRMEZCUXl4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRExFVkJRVVVzUTBGQlF5eExRVUZMTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNN1MwRkRiRU1zUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0SFFVTldPMFZCUTBRc1ZVRkJWU3hGUVVGRkxGVkJRVlVzUzBGQlN5eEZRVUZGTEUxQlFVMHNSVUZCUlR0SlFVTnVReXhQUVVGUExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCVlN4RFFVRkRMRWRCUVVjc1RVRkJUU3hEUVVGRExFZEJRVWNzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXp0SFFVTjJSRHRCUVVOSUxFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVklMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzWTBGQll5eERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWRtRnlJRU5oYzJWRGIyeHNaV04wYVc5dU8xeHVkbUZ5SUVKaFkydGliMjVsSUNBOUlISmxjWFZwY21Vb0oySmhZMnRpYjI1bEp5azdYRzUyWVhJZ1EyRnpaVTF2WkdWc0lEMGdjbVZ4ZFdseVpTZ25MaTlqWVhObFgyMXZaR1ZzSnlrN1hHNWNia05oYzJWRGIyeHNaV04wYVc5dUlEMGdRbUZqYTJKdmJtVXVRMjlzYkdWamRHbHZiaTVsZUhSbGJtUW9lMXh1SUNCdGIyUmxiRG9nUTJGelpVMXZaR1ZzTEZ4dUlDQnNhVzVyVTJsaWJHbHVaM002SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMGFHbHpMbVZoWTJnb1puVnVZM1JwYjI0Z0tHaGxZV1JsY2l3Z2FXNWtaWGdwSUh0Y2JpQWdJQ0FnSUdobFlXUmxjaTV3Y21WMklEMGdkR2hwY3k1aGRDaHBibVJsZUNBdElERXBPMXh1SUNBZ0lDQWdhR1ZoWkdWeUxtNWxlSFFnUFNCMGFHbHpMbUYwS0dsdVpHVjRJQ3NnTVNrN1hHNGdJQ0FnZlN3Z2RHaHBjeWs3WEc0Z0lIMHNYRzRnSUdOdmJYQmhjbUYwYjNJNklHWjFibU4wYVc5dUlDaG1hWEp6ZEN3Z2MyVmpiMjVrS1NCN1hHNGdJQ0FnY21WMGRYSnVJR1pwY25OMExtZGxkQ2duY0hKcGIzSnBkSGtuS1NBdElITmxZMjl1WkM1blpYUW9KM0J5YVc5eWFYUjVKeWs3WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFTmhjMlZEYjJ4c1pXTjBhVzl1TzF4dUlsMTkiLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIENhc2VIaXN0b3J5O1xudmFyIFJlYWN0ICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciAkICAgICAgICAgICA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIEJhY2tib25lICAgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBjb25zdGFudHMgICA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cycpO1xudmFyIFRyICAgICAgICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy90ci5qc3gnKTtcbnZhciBUZCAgICAgICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvdGQuanN4Jyk7XG52YXIgVGFicyAgICAgICAgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL3RhYnMuanN4Jyk7XG52YXIgSWNvbiAgICAgICAgPSByZXF1aXJlKCcuL2ljb25fd3JhcHBlci5qc3gnKTtcbnZhciBtb21lbnQgICAgICA9IHJlcXVpcmUoJ21vbWVudCcpO1xuXG5DYXNlSGlzdG9yeSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJDYXNlSGlzdG9yeVwiLFxuICBwcm9wVHlwZXM6IHtcbiAgICBjb2xsZWN0aW9uOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihCYWNrYm9uZS5Db2xsZWN0aW9uKS5pc1JlcXVpcmVkXG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLnByb3BzLmNvbGxlY3Rpb24sXG4gICAgICBmZXRjaGluZzogICBmYWxzZVxuICAgIH07XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zdGF0ZS5jb2xsZWN0aW9uLm9uKCdyZXF1ZXN0JywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCEgdGhpcy5pc01vdW50ZWQoKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe2ZldGNoaW5nOiB0cnVlfSk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICB0aGlzLnN0YXRlLmNvbGxlY3Rpb24ub24oJ3N5bmMnLCBmdW5jdGlvbiAoY29sbGVjdGlvbikge1xuICAgICAgaWYgKCEgdGhpcy5pc01vdW50ZWQoKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZmV0Y2hlciA9IGZhbHNlO1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgY29sbGVjdGlvbjogY29sbGVjdGlvbixcbiAgICAgICAgZmV0Y2hpbmc6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHRoaXMuZmV0Y2hlciA9IHRoaXMuc3RhdGUuY29sbGVjdGlvbi5mZXRjaCgpO1xuICB9LFxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc3RhdGUuY29sbGVjdGlvbi5vZmYobnVsbCwgbnVsbCwgdGhpcyk7XG5cbiAgICBpZiAodGhpcy5mZXRjaGVyKSB7XG4gICAgICB0aGlzLmZldGNoZXIuYWJvcnQoKTtcbiAgICB9XG4gIH0sXG4gIF9idWlsZFRhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZmV0Y2hpbmcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBudWxsLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwge2NvbFNwYW46IFwiM1wifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiBcImNpcmNsZS1vLW5vdGNoXCIsIHNwaW46IHRydWV9KSwgXCIgTG9hZGluZyBkYXRhIGZyb20gc2VydmVyLi4uXCJcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuY29sbGVjdGlvbi5tYXAoZnVuY3Rpb24gKG1vZGVsLCBpbmRleCkge1xuICAgICAgdmFyIG9kZCAgICAgPSBpbmRleCAlIDIgPyAnb2RkJyA6ICcnO1xuICAgICAgdmFyIGRhdGUgICAgPSBtb21lbnQobW9kZWwuZ2V0KCdkYXRlJykpLmZvcm1hdChjb25zdGFudHMuREFURV9GT1JNQVQpO1xuICAgICAgdmFyIHRpdGxlICAgPSBtb2RlbC5nZXQoJ3RpdGxlJyk7XG4gICAgICB2YXIgY29tbWVudCA9IG1vZGVsLmdldCgnY29tbWVudCcpO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwge2tleTogbW9kZWwuY2lkLCBjbGFzc05hbWU6IG9kZH0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCB7Y2xhc3NOYW1lOiBcImRhdGVmaWVsZFwifSwgZGF0ZSksIFwiLFwiLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgdGl0bGUpLCBcIixcIiwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIGNvbW1lbnQpXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSwgdGhpcyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBpdGVtcyA9IHRoaXMuX2J1aWxkVGFibGUoKTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge2NsYXNzTmFtZTogXCJmdWxsXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhlYWRcIiwgbnVsbCwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgbnVsbCwgXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7Y2xhc3NOYW1lOiBcImRhdGVmaWVsZFwifSwgXCJEYXRlXCIpLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgbnVsbCwgXCJBY3Rpb25cIiksIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIkNvbW1lbnRzXCIpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRib2R5XCIsIG51bGwsIFxuICAgICAgICAgICAgaXRlbXNcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYXNlSGlzdG9yeTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdlkyRnpaWE12WTJGelpWOW9hWE4wYjNKNUxtcHplQ0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVRzN1FVRkZRU3hIUVVGSE96dEJRVVZJTEVsQlFVa3NWMEZCVnl4RFFVRkRPMEZCUTJoQ0xFbEJRVWtzUzBGQlN5eFRRVUZUTEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVOdVF5eEpRVUZKTEVOQlFVTXNZVUZCWVN4UFFVRlBMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03UVVGRGNFTXNTVUZCU1N4UlFVRlJMRTFCUVUwc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETzBGQlEzUkRMRWxCUVVrc1UwRkJVeXhMUVVGTExFOUJRVThzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhEUVVGRE8wRkJRemRETEVsQlFVa3NSVUZCUlN4WlFVRlpMRTlCUVU4c1EwRkJReXg1UWtGQmVVSXNRMEZCUXl4RFFVRkRPMEZCUTNKRUxFbEJRVWtzUlVGQlJTeFpRVUZaTEU5QlFVOHNRMEZCUXl4NVFrRkJlVUlzUTBGQlF5eERRVUZETzBGQlEzSkVMRWxCUVVrc1NVRkJTU3hWUVVGVkxFOUJRVThzUTBGQlF5d3lRa0ZCTWtJc1EwRkJReXhEUVVGRE8wRkJRM1pFTEVsQlFVa3NTVUZCU1N4VlFVRlZMRTlCUVU4c1EwRkJReXh2UWtGQmIwSXNRMEZCUXl4RFFVRkRPMEZCUTJoRUxFbEJRVWtzVFVGQlRTeFJRVUZSTEU5QlFVOHNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenM3UVVGRmNFTXNhVU5CUVdsRExESkNRVUZCTzBWQlF5OUNMRk5CUVZNc1JVRkJSVHRKUVVOVUxGVkJRVlVzUlVGQlJTeExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRlZCUVZVc1EwRkJReXhSUVVGUkxFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNWVUZCVlR0SFFVTjJSVHRGUVVORUxHVkJRV1VzUlVGQlJTeFpRVUZaTzBsQlF6TkNMRTlCUVU4N1RVRkRUQ3hWUVVGVkxFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4VlFVRlZPMDFCUTJwRExGRkJRVkVzU1VGQlNTeExRVUZMTzB0QlEyeENMRU5CUVVNN1IwRkRTRHRGUVVORUxHbENRVUZwUWl4RlFVRkZMRmxCUVZrN1NVRkROMElzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4VlFVRlZMRU5CUVVNc1JVRkJSU3hEUVVGRExGTkJRVk1zUlVGQlJTeFpRVUZaTzAxQlF6bERMRWxCUVVrc1JVRkJSU3hKUVVGSkxFTkJRVU1zVTBGQlV5eEZRVUZGTEVWQlFVVTdVVUZEZEVJc1QwRkJUeXhMUVVGTExFTkJRVU03UVVGRGNrSXNUMEZCVHpzN1RVRkZSQ3hKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNVVUZCVVN4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRGRFTXNTMEZCU3l4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE96dEpRVVZVTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1ZVRkJWU3hEUVVGRExFVkJRVVVzUTBGQlF5eE5RVUZOTEVWQlFVVXNWVUZCVlN4VlFVRlZMRVZCUVVVN1RVRkRja1FzU1VGQlNTeEZRVUZGTEVsQlFVa3NRMEZCUXl4VFFVRlRMRVZCUVVVc1JVRkJSVHRSUVVOMFFpeFBRVUZQTEV0QlFVc3NRMEZCUXp0QlFVTnlRaXhQUVVGUE96dEJRVVZRTEUxQlFVMHNTVUZCU1N4RFFVRkRMRTlCUVU4c1IwRkJSeXhMUVVGTExFTkJRVU03TzAxQlJYSkNMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU03VVVGRFdpeFZRVUZWTEVWQlFVVXNWVUZCVlR0UlFVTjBRaXhSUVVGUkxFVkJRVVVzUzBGQlN6dFBRVU5vUWl4RFFVRkRMRU5CUVVNN1FVRkRWQ3hMUVVGTExFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVTTdPMGxCUlZRc1NVRkJTU3hEUVVGRExFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRlZCUVZVc1EwRkJReXhMUVVGTExFVkJRVVVzUTBGQlF6dEhRVU01UXp0RlFVTkVMRzlDUVVGdlFpeEZRVUZGTEZsQlFWazdRVUZEY0VNc1NVRkJTU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZWQlFWVXNRMEZCUXl4SFFVRkhMRU5CUVVNc1NVRkJTU3hGUVVGRkxFbEJRVWtzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXpzN1NVRkZOVU1zU1VGQlNTeEpRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRkZPMDFCUTJoQ0xFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVNN1MwRkRkRUk3UjBGRFJqdEZRVU5FTEZkQlFWY3NSVUZCUlN4WlFVRlpPMGxCUTNaQ0xFbEJRVWtzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UlFVRlJMRVZCUVVVN1RVRkRka0k3VVVGRFJTeHZRa0ZCUVN4SlFVRkhMRVZCUVVFc1NVRkJReXhGUVVGQk8xVkJRMFlzYjBKQlFVRXNTVUZCUnl4RlFVRkJMRU5CUVVFc1EwRkJReXhQUVVGQkxFVkJRVThzUTBGQlF5eEhRVUZKTEVOQlFVRXNSVUZCUVR0WlFVTmtMRzlDUVVGRExFbEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNTVUZCUVN4RlFVRkpMRU5CUVVNc1owSkJRVUVzUlVGQlowSXNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJSU3hKUVVGTExFTkJRVUVzUTBGQlJ5eERRVUZCTEVWQlFVRXNPRUpCUVVFN1FVRkJRU3hWUVVOMlF5eERRVUZCTzFGQlEwWXNRMEZCUVR0UlFVTk1PMEZCUTFJc1MwRkJTenM3U1VGRlJDeFBRVUZQTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1ZVRkJWU3hEUVVGRExFZEJRVWNzUTBGQlF5eFZRVUZWTEV0QlFVc3NSVUZCUlN4TFFVRkxMRVZCUVVVN1RVRkRka1FzU1VGQlNTeEhRVUZITEU5QlFVOHNTMEZCU3l4SFFVRkhMRU5CUVVNc1IwRkJSeXhMUVVGTExFZEJRVWNzUlVGQlJTeERRVUZETzAxQlEzSkRMRWxCUVVrc1NVRkJTU3hOUVVGTkxFMUJRVTBzUTBGQlF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEZOQlFWTXNRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJRenROUVVOMFJTeEpRVUZKTEV0QlFVc3NTMEZCU3l4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzBGQlEzWkRMRTFCUVUwc1NVRkJTU3hQUVVGUExFZEJRVWNzUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenM3VFVGRmJrTTdVVUZEUlN4dlFrRkJRU3hKUVVGSExFVkJRVUVzUTBGQlFTeERRVUZETEVkQlFVRXNSVUZCUnl4RFFVRkZMRXRCUVVzc1EwRkJReXhIUVVGSExFVkJRVU1zUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUlN4SFFVRkxMRU5CUVVFc1JVRkJRVHRWUVVOc1F5eHZRa0ZCUVN4SlFVRkhMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEZkQlFWa3NRMEZCUVN4RlFVRkRMRWxCUVZVc1EwRkJRU3hGUVVGQkxFZEJRVUVzUlVGQlFUdEJRVUZCTEZWQlEzSkRMRzlDUVVGQkxFbEJRVWNzUlVGQlFTeEpRVUZETEVWQlFVTXNTMEZCVnl4RFFVRkJMRVZCUVVFc1IwRkJRU3hGUVVGQk8wRkJRVUVzVlVGRGFFSXNiMEpCUVVFc1NVRkJSeXhGUVVGQkxFbEJRVU1zUlVGQlF5eFBRVUZoTEVOQlFVRTdVVUZEWml4RFFVRkJPMUZCUTB3N1MwRkRTQ3hGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETzBkQlExWTdSVUZEUkN4TlFVRk5MRVZCUVVVc1dVRkJXVHRCUVVOMFFpeEpRVUZKTEVsQlFVa3NTMEZCU3l4SFFVRkhMRWxCUVVrc1EwRkJReXhYUVVGWExFVkJRVVVzUTBGQlF6czdTVUZGTDBJN1RVRkRSU3h2UWtGQlFTeExRVUZKTEVWQlFVRXNTVUZCUXl4RlFVRkJPMUZCUTBnc2IwSkJRVUVzVDBGQlRTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhOUVVGUExFTkJRVUVzUlVGQlFUdFZRVU4wUWl4dlFrRkJRU3hQUVVGTkxFVkJRVUVzU1VGQlF5eEZRVUZCTzFsQlEwd3NiMEpCUVVFc1NVRkJSeXhGUVVGQkxFbEJRVU1zUlVGQlFUdGpRVU5HTEc5Q1FVRkJMRWxCUVVjc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNWMEZCV1N4RFFVRkJMRVZCUVVFc1RVRkJVeXhEUVVGQkxFVkJRVUVzYjBKQlFVRXNTVUZCUnl4RlFVRkJMRWxCUVVNc1JVRkJRU3hSUVVGWExFTkJRVUVzUlVGQlFTeHZRa0ZCUVN4SlFVRkhMRVZCUVVFc1NVRkJReXhGUVVGQkxGVkJRV0VzUTBGQlFUdFpRVU5vUlN4RFFVRkJPMVZCUTBNc1EwRkJRU3hGUVVGQk8xVkJRMUlzYjBKQlFVRXNUMEZCVFN4RlFVRkJMRWxCUVVNc1JVRkJRVHRaUVVOS0xFdEJRVTA3VlVGRFJDeERRVUZCTzFGQlEwWXNRMEZCUVR0TlFVTktMRU5CUVVFN1RVRkRUanRIUVVOSU8wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFhRVUZYTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRU5oYzJWSWFYTjBiM0o1TzF4dWRtRnlJRkpsWVdOMElDQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbmNtVmhZM1FuS1R0Y2JuWmhjaUFrSUNBZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0oycHhkV1Z5ZVNjcE8xeHVkbUZ5SUVKaFkydGliMjVsSUNBZ0lEMGdjbVZ4ZFdseVpTZ25ZbUZqYTJKdmJtVW5LVHRjYm5aaGNpQmpiMjV6ZEdGdWRITWdJQ0E5SUhKbGNYVnBjbVVvSnk0dUx5NHVMMk52Ym5OMFlXNTBjeWNwTzF4dWRtRnlJRlJ5SUNBZ0lDQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpNHZMaTR2WTI5dGNHOXVaVzUwY3k5MGNpNXFjM2duS1R0Y2JuWmhjaUJVWkNBZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHVMeTR1TDJOdmJYQnZibVZ1ZEhNdmRHUXVhbk40SnlrN1hHNTJZWElnVkdGaWN5QWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDY3VMaTh1TGk5amIyMXdiMjVsYm5SekwzUmhZbk11YW5ONEp5azdYRzUyWVhJZ1NXTnZiaUFnSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2N1TDJsamIyNWZkM0poY0hCbGNpNXFjM2duS1R0Y2JuWmhjaUJ0YjIxbGJuUWdJQ0FnSUNBOUlISmxjWFZwY21Vb0oyMXZiV1Z1ZENjcE8xeHVYRzVEWVhObFNHbHpkRzl5ZVNBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNiaUFnY0hKdmNGUjVjR1Z6T2lCN1hHNGdJQ0FnWTI5c2JHVmpkR2x2YmpvZ1VtVmhZM1F1VUhKdmNGUjVjR1Z6TG1sdWMzUmhibU5sVDJZb1FtRmphMkp2Ym1VdVEyOXNiR1ZqZEdsdmJpa3VhWE5TWlhGMWFYSmxaRnh1SUNCOUxGeHVJQ0JuWlhSSmJtbDBhV0ZzVTNSaGRHVTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdlMXh1SUNBZ0lDQWdZMjlzYkdWamRHbHZiam9nZEdocGN5NXdjbTl3Y3k1amIyeHNaV04wYVc5dUxGeHVJQ0FnSUNBZ1ptVjBZMmhwYm1jNklDQWdabUZzYzJWY2JpQWdJQ0I5TzF4dUlDQjlMRnh1SUNCamIyMXdiMjVsYm5SRWFXUk5iM1Z1ZERvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIUm9hWE11YzNSaGRHVXVZMjlzYkdWamRHbHZiaTV2YmlnbmNtVnhkV1Z6ZENjc0lHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQWdJR2xtSUNnaElIUm9hWE11YVhOTmIzVnVkR1ZrS0NrcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sTzF4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHRtWlhSamFHbHVaem9nZEhKMVpYMHBPMXh1SUNBZ0lIMHNJSFJvYVhNcE8xeHVYRzRnSUNBZ2RHaHBjeTV6ZEdGMFpTNWpiMnhzWldOMGFXOXVMbTl1S0NkemVXNWpKeXdnWm5WdVkzUnBiMjRnS0dOdmJHeGxZM1JwYjI0cElIdGNiaUFnSUNBZ0lHbG1JQ2doSUhSb2FYTXVhWE5OYjNWdWRHVmtLQ2twSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxtWmxkR05vWlhJZ1BTQm1ZV3h6WlR0Y2JseHVJQ0FnSUNBZ2RHaHBjeTV6WlhSVGRHRjBaU2g3WEc0Z0lDQWdJQ0FnSUdOdmJHeGxZM1JwYjI0NklHTnZiR3hsWTNScGIyNHNYRzRnSUNBZ0lDQWdJR1psZEdOb2FXNW5PaUJtWVd4elpWeHVJQ0FnSUNBZ2ZTazdYRzRnSUNBZ2ZTd2dkR2hwY3lrN1hHNWNiaUFnSUNCMGFHbHpMbVpsZEdOb1pYSWdQU0IwYUdsekxuTjBZWFJsTG1OdmJHeGxZM1JwYjI0dVptVjBZMmdvS1R0Y2JpQWdmU3hjYmlBZ1kyOXRjRzl1Wlc1MFYybHNiRlZ1Ylc5MWJuUTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IwYUdsekxuTjBZWFJsTG1OdmJHeGxZM1JwYjI0dWIyWm1LRzUxYkd3c0lHNTFiR3dzSUhSb2FYTXBPMXh1WEc0Z0lDQWdhV1lnS0hSb2FYTXVabVYwWTJobGNpa2dlMXh1SUNBZ0lDQWdkR2hwY3k1bVpYUmphR1Z5TG1GaWIzSjBLQ2s3WEc0Z0lDQWdmVnh1SUNCOUxGeHVJQ0JmWW5WcGJHUlVZV0pzWlRvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lHbG1JQ2gwYUdsekxuTjBZWFJsTG1abGRHTm9hVzVuS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnSUNBOGRISStYRzRnSUNBZ0lDQWdJQ0FnUEhSa0lHTnZiRk53WVc0OVhDSXpYQ0krWEc0Z0lDQWdJQ0FnSUNBZ0lDQThTV052YmlCMGVYQmxQVndpWTJseVkyeGxMVzh0Ym05MFkyaGNJaUJ6Y0dsdVBYdDBjblZsZlNBdlBpQk1iMkZrYVc1bklHUmhkR0VnWm5KdmJTQnpaWEoyWlhJdUxpNWNiaUFnSUNBZ0lDQWdJQ0E4TDNSa1BseHVJQ0FnSUNBZ0lDQThMM1J5UGx4dUlDQWdJQ0FnS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1emRHRjBaUzVqYjJ4c1pXTjBhVzl1TG0xaGNDaG1kVzVqZEdsdmJpQW9iVzlrWld3c0lHbHVaR1Y0S1NCN1hHNGdJQ0FnSUNCMllYSWdiMlJrSUNBZ0lDQTlJR2x1WkdWNElDVWdNaUEvSUNkdlpHUW5JRG9nSnljN1hHNGdJQ0FnSUNCMllYSWdaR0YwWlNBZ0lDQTlJRzF2YldWdWRDaHRiMlJsYkM1blpYUW9KMlJoZEdVbktTa3VabTl5YldGMEtHTnZibk4wWVc1MGN5NUVRVlJGWDBaUFVrMUJWQ2s3WEc0Z0lDQWdJQ0IyWVhJZ2RHbDBiR1VnSUNBOUlHMXZaR1ZzTG1kbGRDZ25kR2wwYkdVbktUdGNiaUFnSUNBZ0lIWmhjaUJqYjIxdFpXNTBJRDBnYlc5a1pXd3VaMlYwS0NkamIyMXRaVzUwSnlrN1hHNWNiaUFnSUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBZ0lEeDBjaUJyWlhrOWUyMXZaR1ZzTG1OcFpIMGdZMnhoYzNOT1lXMWxQWHR2WkdSOVBseHVJQ0FnSUNBZ0lDQWdJRHgwWkNCamJHRnpjMDVoYldVOVhDSmtZWFJsWm1sbGJHUmNJajU3WkdGMFpYMDhMM1JrUGl4Y2JpQWdJQ0FnSUNBZ0lDQThkR1ErZTNScGRHeGxmVHd2ZEdRK0xGeHVJQ0FnSUNBZ0lDQWdJRHgwWkQ1N1kyOXRiV1Z1ZEgwOEwzUmtQbHh1SUNBZ0lDQWdJQ0E4TDNSeVBseHVJQ0FnSUNBZ0tUdGNiaUFnSUNCOUxDQjBhR2x6S1R0Y2JpQWdmU3hjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2RtRnlJR2wwWlcxeklEMGdkR2hwY3k1ZlluVnBiR1JVWVdKc1pTZ3BPMXh1WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeGthWFkrWEc0Z0lDQWdJQ0FnSUR4MFlXSnNaU0JqYkdGemMwNWhiV1U5WENKbWRXeHNYQ0krWEc0Z0lDQWdJQ0FnSUNBZ1BIUm9aV0ZrUGx4dUlDQWdJQ0FnSUNBZ0lDQWdQSFJ5UGx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0E4ZEdnZ1kyeGhjM05PWVcxbFBWd2laR0YwWldacFpXeGtYQ0krUkdGMFpUd3ZkR2crUEhSb1BrRmpkR2x2Ymp3dmRHZytQSFJvUGtOdmJXMWxiblJ6UEM5MGFENWNiaUFnSUNBZ0lDQWdJQ0FnSUR3dmRISStYRzRnSUNBZ0lDQWdJQ0FnUEM5MGFHVmhaRDVjYmlBZ0lDQWdJQ0FnSUNBOGRHSnZaSGsrWEc0Z0lDQWdJQ0FnSUNBZ0lDQjdhWFJsYlhOOVhHNGdJQ0FnSUNBZ0lDQWdQQzkwWW05a2VUNWNiaUFnSUNBZ0lDQWdQQzkwWVdKc1pUNWNiaUFnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFTmhjMlZJYVhOMGIzSjVPMXh1SWwxOSIsInZhciBDYXNlSGlzdG9yeUNvbGxlY3Rpb247XG52YXIgQmFja2JvbmUgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcblxuQ2FzZUhpc3RvcnlDb2xsZWN0aW9uID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuICBmZXRjaDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0KFtcbiAgICAgIHtcbiAgICAgICAgZGF0ZTogICAgIG5ldyBEYXRlKCksXG4gICAgICAgIHRpdGxlOiAgICAnSm9lIFNtaXRoIGV4ZWN1dGVkIGEgY2FsbCcsXG4gICAgICAgIGNvbW1lbnQ6ICAnVGhpcyBpcyBqdXN0IGEgY29tbWVudCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGRhdGU6ICAgICBuZXcgRGF0ZSgpLFxuICAgICAgICB0aXRsZTogICAgJ0Nhc2UgY3JlYXRlZCBieSB1c2VyJyxcbiAgICAgICAgY29tbWVudDogICcnXG4gICAgICB9XG4gICAgXSk7XG5cbiAgICB0aGlzLnRyaWdnZXIoJ3JlcXVlc3QnKTtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy50cmlnZ2VyKCdzeW5jJywgdGhpcyk7XG4gICAgfS5iaW5kKHRoaXMpLCAxMDAwKTtcbiAgfSxcbiAgdXJsOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYXNlSGlzdG9yeUNvbGxlY3Rpb247XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZZMkZ6WlhNdlkyRnpaVjlvYVhOMGIzSjVYMk52Ykd4bFkzUnBiMjR1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNTVUZCU1N4eFFrRkJjVUlzUTBGQlF6dEJRVU14UWl4SlFVRkpMRkZCUVZFc1NVRkJTU3hQUVVGUExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTTdPMEZCUlhCRExIRkNRVUZ4UWl4SFFVRkhMRkZCUVZFc1EwRkJReXhWUVVGVkxFTkJRVU1zVFVGQlRTeERRVUZETzBWQlEycEVMRXRCUVVzc1JVRkJSU3haUVVGWk8wbEJRMnBDTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNN1RVRkRVRHRSUVVORkxFbEJRVWtzVFVGQlRTeEpRVUZKTEVsQlFVa3NSVUZCUlR0UlFVTndRaXhMUVVGTExFdEJRVXNzTWtKQlFUSkNPMUZCUTNKRExFOUJRVThzUjBGQlJ5eDNRa0ZCZDBJN1QwRkRia003VFVGRFJEdFJRVU5GTEVsQlFVa3NUVUZCVFN4SlFVRkpMRWxCUVVrc1JVRkJSVHRSUVVOd1FpeExRVUZMTEV0QlFVc3NjMEpCUVhOQ08xRkJRMmhETEU5QlFVOHNSMEZCUnl4RlFVRkZPMDlCUTJJN1FVRkRVQ3hMUVVGTExFTkJRVU1zUTBGQlF6czdRVUZGVUN4SlFVRkpMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdPMGxCUlhoQ0xGVkJRVlVzUTBGQlF5eFpRVUZaTzAxQlEzSkNMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zVFVGQlRTeEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPMHRCUXpWQ0xFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE8wZEJRM0pDTzBWQlEwUXNSMEZCUnl4RlFVRkZMRmxCUVZrN1NVRkRaaXhQUVVGUExFVkJRVVVzUTBGQlF6dEhRVU5ZTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4eFFrRkJjVUlzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJblpoY2lCRFlYTmxTR2x6ZEc5eWVVTnZiR3hsWTNScGIyNDdYRzUyWVhJZ1FtRmphMkp2Ym1VZ0lEMGdjbVZ4ZFdseVpTZ25ZbUZqYTJKdmJtVW5LVHRjYmx4dVEyRnpaVWhwYzNSdmNubERiMnhzWldOMGFXOXVJRDBnUW1GamEySnZibVV1UTI5c2JHVmpkR2x2Ymk1bGVIUmxibVFvZTF4dUlDQm1aWFJqYURvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIUm9hWE11YzJWMEtGdGNiaUFnSUNBZ0lIdGNiaUFnSUNBZ0lDQWdaR0YwWlRvZ0lDQWdJRzVsZHlCRVlYUmxLQ2tzWEc0Z0lDQWdJQ0FnSUhScGRHeGxPaUFnSUNBblNtOWxJRk50YVhSb0lHVjRaV04xZEdWa0lHRWdZMkZzYkNjc1hHNGdJQ0FnSUNBZ0lHTnZiVzFsYm5RNklDQW5WR2hwY3lCcGN5QnFkWE4wSUdFZ1kyOXRiV1Z1ZENkY2JpQWdJQ0FnSUgwc1hHNGdJQ0FnSUNCN1hHNGdJQ0FnSUNBZ0lHUmhkR1U2SUNBZ0lDQnVaWGNnUkdGMFpTZ3BMRnh1SUNBZ0lDQWdJQ0IwYVhSc1pUb2dJQ0FnSjBOaGMyVWdZM0psWVhSbFpDQmllU0IxYzJWeUp5eGNiaUFnSUNBZ0lDQWdZMjl0YldWdWREb2dJQ2NuWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdYU2s3WEc1Y2JpQWdJQ0IwYUdsekxuUnlhV2RuWlhJb0ozSmxjWFZsYzNRbktUdGNibHh1SUNBZ0lITmxkRlJwYldWdmRYUW9ablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJQ0FnZEdocGN5NTBjbWxuWjJWeUtDZHplVzVqSnl3Z2RHaHBjeWs3WEc0Z0lDQWdmUzVpYVc1a0tIUm9hWE1wTENBeE1EQXdLVHRjYmlBZ2ZTeGNiaUFnZFhKc09pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlDY25PMXh1SUNCOVhHNTlLVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCRFlYTmxTR2x6ZEc5eWVVTnZiR3hsWTNScGIyNDdYRzRpWFgwPSIsInZhciBDYXNlTW9kZWw7XG52YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xuXG5DYXNlTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe30pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhc2VNb2RlbDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdlkyRnpaWE12WTJGelpWOXRiMlJsYkM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hKUVVGSkxGTkJRVk1zUTBGQlF6dEJRVU5rTEVsQlFVa3NVVUZCVVN4SFFVRkhMRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6czdRVUZGYmtNc1UwRkJVeXhIUVVGSExGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRE96dEJRVVYwUXl4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExGTkJRVk1zUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJblpoY2lCRFlYTmxUVzlrWld3N1hHNTJZWElnUW1GamEySnZibVVnUFNCeVpYRjFhWEpsS0NkaVlXTnJZbTl1WlNjcE8xeHVYRzVEWVhObFRXOWtaV3dnUFNCQ1lXTnJZbTl1WlM1TmIyUmxiQzVsZUhSbGJtUW9lMzBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFTmhjMlZOYjJSbGJEdGNiaUpkZlE9PSIsInZhciBEaXNwYXRjaGVyID0gcmVxdWlyZSgnZmx1eCcpLkRpc3BhdGNoZXI7XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IERpc3BhdGNoZXIoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdlkyRnpaWE12WkdsemNHRjBZMmhsY2k1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hKUVVGSkxGVkJRVlVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNc1ZVRkJWU3hEUVVGRE96dEJRVVUxUXl4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExFbEJRVWtzVlVGQlZTeEZRVUZGTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUoyWVhJZ1JHbHpjR0YwWTJobGNpQTlJSEpsY1hWcGNtVW9KMlpzZFhnbktTNUVhWE53WVhSamFHVnlPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUc1bGR5QkVhWE53WVhSamFHVnlLQ2s3WEc0aVhYMD0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIERyb3Bkb3duO1xudmFyIERyb3Bkb3duQ2hvaWNlO1xudmFyIG9mZnNjcmVlbl9oYW5kbGVycztcbnZhciAkICAgICAgICAgICA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIFJlYWN0ICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBCdXR0b24gICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvYnV0dG9uLmpzeCcpO1xudmFyICR3aW5kb3cgICAgID0gJCh3aW5kb3cpO1xuXG5vZmZzY3JlZW5faGFuZGxlcnMgPSB7XG4gIGxlZnQ6IGZ1bmN0aW9uICgkZWwsIG5ld1N0YXRlKSB7XG4gICAgaWYgKCRlbC5pcygnOm9mZnNjcmVlbi1yaWdodCcpKSB7XG4gICAgICBuZXdTdGF0ZS5hbGlnbiA9ICdyaWdodCc7XG4gICAgfVxuICB9LFxuICByaWdodDogZnVuY3Rpb24gKCRlbCwgbmV3U3RhdGUpIHtcbiAgICBpZiAoJGVsLmlzKCc6b2Zmc2NyZWVuLWxlZnQnKSkge1xuICAgICAgbmV3U3RhdGUuYWxpZ24gPSAnbGVmdCc7XG4gICAgfVxuICB9XG59O1xuXG5Ecm9wZG93bkNob2ljZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJEcm9wZG93bkNob2ljZVwiLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYnV0dG9uUHJvcHMgPSB7XG4gICAgICB0ZXh0OiAgICAgICB0aGlzLnByb3BzLnRleHQsXG4gICAgICBvbkNsaWNrOiAgICB0aGlzLl9jbGlja0hhbmRsZXIsXG4gICAgICBjbGFzc05hbWU6ICB0aGlzLnByb3BzLnRoZW1lXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwge2NsYXNzTmFtZTogXCJjaG9pY2VcIn0sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCBSZWFjdC5fX3NwcmVhZCh7fSwgIGJ1dHRvblByb3BzKSkpXG4gICAgKTtcbiAgfSxcbiAgX2NsaWNrSGFuZGxlcjogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLm9uQ2hvaWNlKSB7XG4gICAgICB0aGlzLnByb3BzLm9uQ2hvaWNlKHRoaXMucHJvcHMudmFsdWUpO1xuICAgIH1cbiAgfVxufSk7XG5cbkRyb3Bkb3duID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkRyb3Bkb3duXCIsXG4gIHByb3BUeXBlczoge1xuICAgIHNlbGVjdGVkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2hvaWNlczogIFJlYWN0LlByb3BUeXBlcy5hcnJheVxuICB9LFxuICBtaXhpbnM6IFtSZWFjdC5hZGRvbnMuUHVyZVJlbmRlck1peGluXSxcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9wZW46ICAgISEgdGhpcy5wcm9wcy5vcGVuLFxuICAgICAgYWxpZ246ICB0aGlzLnByb3BzLmFsaWduIHx8ICdsZWZ0J1xuICAgIH07XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uIChuZXh0UHJvcHMpIHtcbiAgICBpZiAobmV4dFByb3BzLmFsaWduKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHthbGlnbjogbmV4dFByb3BzLmFsaWdufSk7XG4gICAgfVxuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX2Vuc3VyZURyb3Bkb3duVmlzaWJpbGl0eSgpO1xuICB9LFxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9lbnN1cmVEcm9wZG93blZpc2liaWxpdHkoKTtcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNob2ljZXM6IFtdXG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNob2ljZXMgPSB0aGlzLnN0YXRlLm9wZW4gJiYgdGhpcy5fYnVpbGRDaG9pY2VzKCk7XG4gICAgdmFyIGNsYXNzZXMgPSBbJ2Ryb3Bkb3duJywgJ2FsaWduLScgKyB0aGlzLnN0YXRlLmFsaWduXTtcbiAgICB2YXIgYnV0dG9uUHJvcHM7XG5cbiAgICBidXR0b25Qcm9wcyA9IHtcbiAgICAgIHRleHQ6ICAgICAgIHRoaXMucHJvcHMuc2VsZWN0ZWQsXG4gICAgICBhZnRlckljb246ICAnY2FyZXQtZG93bicsXG4gICAgICBvbkNsaWNrOiAgICB0aGlzLl90b2dnbGVPcGVuXG4gICAgfTtcblxuICAgIHRoaXMucHJvcHMuY2xhc3NOYW1lICYmIGNsYXNzZXMucHVzaCh0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy50aGVtZSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKHRoaXMucHJvcHMudGhlbWUpO1xuICAgICAgYnV0dG9uUHJvcHMuY2xhc3NOYW1lID0gdGhpcy5wcm9wcy50aGVtZTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBjbGFzc2VzLmpvaW4oJyAnKSwgb25Nb3VzZUxlYXZlOiB0aGlzLl9oYW5kbGVMZWF2ZX0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic2VsZWN0ZWRcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCBSZWFjdC5fX3NwcmVhZCh7fSwgIGJ1dHRvblByb3BzKSlcbiAgICAgICAgKSwgXG4gICAgICAgIGNob2ljZXNcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBfaGFuZGxlTGVhdmU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtvcGVuOiBmYWxzZX0pO1xuICB9LFxuICBfdG9nZ2xlT3BlbjogZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5vbkNsaWNrKSB7XG4gICAgICB0aGlzLnByb3BzLm9uQ2xpY2soZSk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBvcGVuOiAhIHRoaXMuc3RhdGUub3BlblxuICAgIH0pO1xuICB9LFxuICBfYnVpbGRDaG9pY2VzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNob2ljZXMgPSBbXTtcblxuICAgIGNob2ljZXMgPSB0aGlzLnByb3BzLmNob2ljZXMubWFwKGZ1bmN0aW9uIChjaG9pY2UsIGluZGV4KSB7XG4gICAgICBpZiAoY2hvaWNlLnNlcGFyYXRvcikge1xuICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7Y2xhc3NOYW1lOiBcInNlcGFyYXRvclwiLCBrZXk6IGluZGV4fSkpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcHJvcHMgPSB7XG4gICAgICAgIGtleTogICAgICBpbmRleCxcbiAgICAgICAgdGV4dDogICAgIGNob2ljZS50ZXh0LFxuICAgICAgICBvbkNob2ljZTogdGhpcy5faGFuZGxlQ2hvaWNlLFxuICAgICAgICB0aGVtZTogICAgdGhpcy5wcm9wcy50aGVtZSxcbiAgICAgICAgdmFsdWU6ICAgIGNob2ljZS52YWx1ZVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChEcm9wZG93bkNob2ljZSwgUmVhY3QuX19zcHJlYWQoe30sICBwcm9wcykpXG4gICAgICApO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwge3JlZjogXCJkcm9wZG93blwifSwgY2hvaWNlcykpO1xuICB9LFxuICBfaGFuZGxlQ2hvaWNlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5vbkNob2ljZSkge1xuICAgICAgdGhpcy5wcm9wcy5vbkNob2ljZSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7b3BlbjogZmFsc2V9KTtcbiAgfSxcbiAgX2Vuc3VyZURyb3Bkb3duVmlzaWJpbGl0eTogZnVuY3Rpb24gKCkge1xuICAgIGlmICghIHRoaXMuc3RhdGUub3Blbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIGRyb3Bkb3duICA9IHRoaXMucmVmcy5kcm9wZG93bjtcbiAgICB2YXIgJGVsICAgICAgID0gJChkcm9wZG93bi5nZXRET01Ob2RlKCkpO1xuICAgIHZhciBuZXdTdGF0ZSAgPSB7fTtcbiAgICB2YXIgaGFuZGxlciAgID0gb2Zmc2NyZWVuX2hhbmRsZXJzW3RoaXMuc3RhdGUuYWxpZ25dO1xuXG4gICAgaGFuZGxlciAmJiBoYW5kbGVyKCRlbCwgbmV3U3RhdGUpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XG4gIH0sXG4gIF9leGl0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7b3BlbjogZmFsc2V9KTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRHJvcGRvd247XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZZMkZ6WlhNdlpISnZjR1J2ZDI0dWFuTjRJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCT3p0QlFVVkJMRWRCUVVjN08wRkJSVWdzU1VGQlNTeFJRVUZSTEVOQlFVTTdRVUZEWWl4SlFVRkpMR05CUVdNc1EwRkJRenRCUVVOdVFpeEpRVUZKTEd0Q1FVRnJRaXhEUVVGRE8wRkJRM1pDTEVsQlFVa3NRMEZCUXl4aFFVRmhMRTlCUVU4c1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEJRVU53UXl4SlFVRkpMRXRCUVVzc1UwRkJVeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdRVUZEYmtNc1NVRkJTU3hOUVVGTkxGRkJRVkVzVDBGQlR5eERRVUZETERaQ1FVRTJRaXhEUVVGRExFTkJRVU03UVVGRGVrUXNTVUZCU1N4UFFVRlBMRTlCUVU4c1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZET3p0QlFVVTFRaXhyUWtGQmEwSXNSMEZCUnp0RlFVTnVRaXhKUVVGSkxFVkJRVVVzVlVGQlZTeEhRVUZITEVWQlFVVXNVVUZCVVN4RlFVRkZPMGxCUXpkQ0xFbEJRVWtzUjBGQlJ5eERRVUZETEVWQlFVVXNRMEZCUXl4clFrRkJhMElzUTBGQlF5eEZRVUZGTzAxQlF6bENMRkZCUVZFc1EwRkJReXhMUVVGTExFZEJRVWNzVDBGQlR5eERRVUZETzB0QlF6RkNPMGRCUTBZN1JVRkRSQ3hMUVVGTExFVkJRVVVzVlVGQlZTeEhRVUZITEVWQlFVVXNVVUZCVVN4RlFVRkZPMGxCUXpsQ0xFbEJRVWtzUjBGQlJ5eERRVUZETEVWQlFVVXNRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eEZRVUZGTzAxQlF6ZENMRkZCUVZFc1EwRkJReXhMUVVGTExFZEJRVWNzVFVGQlRTeERRVUZETzB0QlEzcENPMGRCUTBZN1FVRkRTQ3hEUVVGRExFTkJRVU03TzBGQlJVWXNiME5CUVc5RExEaENRVUZCTzBWQlEyeERMRTFCUVUwc1JVRkJSU3haUVVGWk8wbEJRMnhDTEVsQlFVa3NWMEZCVnl4SFFVRkhPMDFCUTJoQ0xFbEJRVWtzVVVGQlVTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrN1RVRkRNMElzVDBGQlR5eExRVUZMTEVsQlFVa3NRMEZCUXl4aFFVRmhPMDFCUXpsQ0xGTkJRVk1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzN1FVRkRiRU1zUzBGQlN5eERRVUZET3p0SlFVVkdPMDFCUTBVc2IwSkJRVUVzU1VGQlJ5eEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhSUVVGVExFTkJRVUVzUlVGQlFTeHZRa0ZCUXl4TlFVRk5MRVZCUVVFc1owSkJRVUVzUjBGQlFTeERRVUZGTEVkQlFVY3NWMEZCV1N4RFFVRkJMRU5CUVVjc1EwRkJTeXhEUVVGQk8wMUJRM1pFTzBkQlEwZzdSVUZEUkN4aFFVRmhMRVZCUVVVc1dVRkJXVHRKUVVONlFpeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1VVRkJVU3hGUVVGRk8wMUJRM1pDTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1MwRkRka003UjBGRFJqdEJRVU5JTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWSUxEaENRVUU0UWl4M1FrRkJRVHRGUVVNMVFpeFRRVUZUTEVWQlFVVTdTVUZEVkN4UlFVRlJMRVZCUVVVc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTEVOQlFVTXNWVUZCVlR0SlFVTXpReXhQUVVGUExFZEJRVWNzUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4TFFVRkxPMGRCUTJoRE8wVkJRMFFzVFVGQlRTeEZRVUZGTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkJReXhsUVVGbExFTkJRVU03UlVGRGRFTXNaVUZCWlN4RlFVRkZMRmxCUVZrN1NVRkRNMElzVDBGQlR6dE5RVU5NTEVsQlFVa3NTVUZCU1N4RFFVRkRMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTzAxQlF6RkNMRXRCUVVzc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVc3NTVUZCU1N4TlFVRk5PMHRCUTI1RExFTkJRVU03UjBGRFNEdEZRVU5FTEhsQ1FVRjVRaXhGUVVGRkxGVkJRVlVzVTBGQlV5eEZRVUZGTzBsQlF6bERMRWxCUVVrc1UwRkJVeXhEUVVGRExFdEJRVXNzUlVGQlJUdE5RVU51UWl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUzBGQlN5eEZRVUZGTEZOQlFWTXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRE8wdEJRM3BETzBkQlEwWTdSVUZEUkN4cFFrRkJhVUlzUlVGQlJTeFpRVUZaTzBsQlF6ZENMRWxCUVVrc1EwRkJReXg1UWtGQmVVSXNSVUZCUlN4RFFVRkRPMGRCUTJ4RE8wVkJRMFFzYTBKQlFXdENMRVZCUVVVc1dVRkJXVHRKUVVNNVFpeEpRVUZKTEVOQlFVTXNlVUpCUVhsQ0xFVkJRVVVzUTBGQlF6dEhRVU5zUXp0RlFVTkVMR1ZCUVdVc1JVRkJSU3haUVVGWk8wbEJRek5DTEU5QlFVODdUVUZEVEN4UFFVRlBMRVZCUVVVc1JVRkJSVHRMUVVOYUxFTkJRVU03UjBGRFNEdEZRVU5FTEUxQlFVMHNSVUZCUlN4WlFVRlpPMGxCUTJ4Q0xFbEJRVWtzVDBGQlR5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hKUVVGSkxFbEJRVWtzUTBGQlF5eGhRVUZoTEVWQlFVVXNRMEZCUXp0SlFVTjBSQ3hKUVVGSkxFOUJRVThzUjBGQlJ5eERRVUZETEZWQlFWVXNSVUZCUlN4UlFVRlJMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0QlFVTTFSQ3hKUVVGSkxFbEJRVWtzVjBGQlZ5eERRVUZET3p0SlFVVm9RaXhYUVVGWExFZEJRVWM3VFVGRFdpeEpRVUZKTEZGQlFWRXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGUk8wMUJReTlDTEZOQlFWTXNSMEZCUnl4WlFVRlpPMDFCUTNoQ0xFOUJRVThzUzBGQlN5eEpRVUZKTEVOQlFVTXNWMEZCVnp0QlFVTnNReXhMUVVGTExFTkJRVU03TzBGQlJVNHNTVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zU1VGQlNTeFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdPMGxCUlRORUxFbEJRVWtzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRVZCUVVVN1RVRkRjRUlzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzAxQlF5OUNMRmRCUVZjc1EwRkJReXhUUVVGVExFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNN1FVRkRMME1zUzBGQlN6czdTVUZGUkR0TlFVTkZMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVVc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUXl4RFFVRkRMRmxCUVVFc1JVRkJXU3hEUVVGRkxFbEJRVWtzUTBGQlF5eFpRVUZqTEVOQlFVRXNSVUZCUVR0UlFVTnNSU3h2UWtGQlFTeExRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExGVkJRVmNzUTBGQlFTeEZRVUZCTzFWQlEzaENMRzlDUVVGRExFMUJRVTBzUlVGQlFTeG5Ra0ZCUVN4SFFVRkJMRU5CUVVVc1IwRkJSeXhYUVVGWkxFTkJRVUVzUTBGQlJ5eERRVUZCTzFGQlEzWkNMRU5CUVVFc1JVRkJRVHRSUVVOTUxFOUJRVkU3VFVGRFRDeERRVUZCTzAxQlEwNDdSMEZEU0R0RlFVTkVMRmxCUVZrc1JVRkJSU3haUVVGWk8wbEJRM2hDTEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhKUVVGSkxFVkJRVVVzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXp0SFFVTTVRanRGUVVORUxGZEJRVmNzUlVGQlJTeFZRVUZWTEVOQlFVTXNSVUZCUlR0SlFVTjRRaXhKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RlFVRkZPMDFCUTNSQ0xFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRelZDTEV0QlFVczdPMGxCUlVRc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF6dE5RVU5hTEVsQlFVa3NSVUZCUlN4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNUdExRVU40UWl4RFFVRkRMRU5CUVVNN1IwRkRTanRGUVVORUxHRkJRV0VzUlVGQlJTeFpRVUZaTzBGQlF6ZENMRWxCUVVrc1NVRkJTU3hQUVVGUExFZEJRVWNzUlVGQlJTeERRVUZET3p0SlFVVnFRaXhQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVlVzVFVGQlRTeEZRVUZGTEV0QlFVc3NSVUZCUlR0TlFVTjRSQ3hKUVVGSkxFMUJRVTBzUTBGQlF5eFRRVUZUTEVWQlFVVTdVVUZEY0VJc1VVRkJVU3h2UWtGQlFTeEpRVUZITEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExGZEJRVUVzUlVGQlZ5eERRVUZETEVkQlFVRXNSVUZCUnl4RFFVRkZMRXRCUVUwc1EwRkJRU3hEUVVGSExFTkJRVUVzUlVGQlJUdEJRVU14UkN4UFFVRlBPenROUVVWRUxFbEJRVWtzUzBGQlN5eEhRVUZITzFGQlExWXNSMEZCUnl4UFFVRlBMRXRCUVVzN1VVRkRaaXhKUVVGSkxFMUJRVTBzVFVGQlRTeERRVUZETEVsQlFVazdVVUZEY2tJc1VVRkJVU3hGUVVGRkxFbEJRVWtzUTBGQlF5eGhRVUZoTzFGQlF6VkNMRXRCUVVzc1MwRkJTeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVczdVVUZETVVJc1MwRkJTeXhMUVVGTExFMUJRVTBzUTBGQlF5eExRVUZMTzBGQlF6bENMRTlCUVU4c1EwRkJRenM3VFVGRlJqdFJRVU5GTEc5Q1FVRkRMR05CUVdNc1JVRkJRU3huUWtGQlFTeEhRVUZCTEVOQlFVVXNSMEZCUnl4TFFVRk5MRU5CUVVFc1EwRkJSeXhEUVVGQk8xRkJRemRDTzBGQlExSXNTMEZCU3l4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE96dEpRVVZVTEZGQlFWRXNiMEpCUVVFc1NVRkJSeXhGUVVGQkxFTkJRVUVzUTBGQlF5eEhRVUZCTEVWQlFVY3NRMEZCUXl4VlFVRlhMRU5CUVVFc1JVRkJReXhQUVVGaExFTkJRVUVzUlVGQlJUdEhRVU0xUXp0RlFVTkVMR0ZCUVdFc1JVRkJSU3hWUVVGVkxFdEJRVXNzUlVGQlJUdEpRVU01UWl4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVVVGQlVTeEZRVUZGTzAxQlEzWkNMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVVVGQlVTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMEZCUTJwRExFdEJRVXM3TzBsQlJVUXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExFbEJRVWtzUlVGQlJTeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRPMGRCUXpsQ08wVkJRMFFzZVVKQlFYbENMRVZCUVVVc1dVRkJXVHRKUVVOeVF5eEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFVkJRVVU3VFVGRGNrSXNUMEZCVHl4SlFVRkpMRU5CUVVNN1FVRkRiRUlzUzBGQlN6czdTVUZGUkN4SlFVRkpMRkZCUVZFc1NVRkJTU3hKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXp0SlFVTnVReXhKUVVGSkxFZEJRVWNzVTBGQlV5eERRVUZETEVOQlFVTXNVVUZCVVN4RFFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRExFTkJRVU03U1VGRGVrTXNTVUZCU1N4UlFVRlJMRWxCUVVrc1JVRkJSU3hEUVVGRE8wRkJRM1pDTEVsQlFVa3NTVUZCU1N4UFFVRlBMRXRCUVVzc2EwSkJRV3RDTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6czdRVUZGZWtRc1NVRkJTU3hQUVVGUExFbEJRVWtzVDBGQlR5eERRVUZETEVkQlFVY3NSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenM3U1VGRmJFTXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEhRVU42UWp0RlFVTkVMRXRCUVVzc1JVRkJSU3haUVVGWk8wbEJRMnBDTEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhKUVVGSkxFVkJRVVVzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXp0SFFVTTVRanRCUVVOSUxFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVklMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzVVVGQlVTeERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5b3FYRzRnS2lCQWFuTjRJRkpsWVdOMExrUlBUVnh1SUNvdlhHNWNiblpoY2lCRWNtOXdaRzkzYmp0Y2JuWmhjaUJFY205d1pHOTNia05vYjJsalpUdGNiblpoY2lCdlptWnpZM0psWlc1ZmFHRnVaR3hsY25NN1hHNTJZWElnSkNBZ0lDQWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDZHFjWFZsY25rbktUdGNiblpoY2lCU1pXRmpkQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KM0psWVdOMEp5azdYRzUyWVhJZ1FuVjBkRzl1SUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2N1TGk4dUxpOWpiMjF3YjI1bGJuUnpMMkoxZEhSdmJpNXFjM2duS1R0Y2JuWmhjaUFrZDJsdVpHOTNJQ0FnSUNBOUlDUW9kMmx1Wkc5M0tUdGNibHh1YjJabWMyTnlaV1Z1WDJoaGJtUnNaWEp6SUQwZ2UxeHVJQ0JzWldaME9pQm1kVzVqZEdsdmJpQW9KR1ZzTENCdVpYZFRkR0YwWlNrZ2UxeHVJQ0FnSUdsbUlDZ2taV3d1YVhNb0p6cHZabVp6WTNKbFpXNHRjbWxuYUhRbktTa2dlMXh1SUNBZ0lDQWdibVYzVTNSaGRHVXVZV3hwWjI0Z1BTQW5jbWxuYUhRbk8xeHVJQ0FnSUgxY2JpQWdmU3hjYmlBZ2NtbG5hSFE2SUdaMWJtTjBhVzl1SUNna1pXd3NJRzVsZDFOMFlYUmxLU0I3WEc0Z0lDQWdhV1lnS0NSbGJDNXBjeWduT205bVpuTmpjbVZsYmkxc1pXWjBKeWtwSUh0Y2JpQWdJQ0FnSUc1bGQxTjBZWFJsTG1Gc2FXZHVJRDBnSjJ4bFpuUW5PMXh1SUNBZ0lIMWNiaUFnZlZ4dWZUdGNibHh1UkhKdmNHUnZkMjVEYUc5cFkyVWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJpZFhSMGIyNVFjbTl3Y3lBOUlIdGNiaUFnSUNBZ0lIUmxlSFE2SUNBZ0lDQWdJSFJvYVhNdWNISnZjSE11ZEdWNGRDeGNiaUFnSUNBZ0lHOXVRMnhwWTJzNklDQWdJSFJvYVhNdVgyTnNhV05yU0dGdVpHeGxjaXhjYmlBZ0lDQWdJR05zWVhOelRtRnRaVG9nSUhSb2FYTXVjSEp2Y0hNdWRHaGxiV1ZjYmlBZ0lDQjlPMXh1WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeHNhU0JqYkdGemMwNWhiV1U5WENKamFHOXBZMlZjSWo0OFFuVjBkRzl1SUhzdUxpNWlkWFIwYjI1UWNtOXdjMzBnTHo0OEwyeHBQbHh1SUNBZ0lDazdYRzRnSUgwc1hHNGdJRjlqYkdsamEwaGhibVJzWlhJNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnBaaUFvZEdocGN5NXdjbTl3Y3k1dmJrTm9iMmxqWlNrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTV3Y205d2N5NXZia05vYjJsalpTaDBhR2x6TG5CeWIzQnpMblpoYkhWbEtUdGNiaUFnSUNCOVhHNGdJSDFjYm4wcE8xeHVYRzVFY205d1pHOTNiaUE5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JpQWdjSEp2Y0ZSNWNHVnpPaUI3WEc0Z0lDQWdjMlZzWldOMFpXUTZJRkpsWVdOMExsQnliM0JVZVhCbGN5NXpkSEpwYm1jdWFYTlNaWEYxYVhKbFpDeGNiaUFnSUNCamFHOXBZMlZ6T2lBZ1VtVmhZM1F1VUhKdmNGUjVjR1Z6TG1GeWNtRjVYRzRnSUgwc1hHNGdJRzFwZUdsdWN6b2dXMUpsWVdOMExtRmtaRzl1Y3k1UWRYSmxVbVZ1WkdWeVRXbDRhVzVkTEZ4dUlDQm5aWFJKYm1sMGFXRnNVM1JoZEdVNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2UxeHVJQ0FnSUNBZ2IzQmxiam9nSUNBaElTQjBhR2x6TG5CeWIzQnpMbTl3Wlc0c1hHNGdJQ0FnSUNCaGJHbG5iam9nSUhSb2FYTXVjSEp2Y0hNdVlXeHBaMjRnZkh3Z0oyeGxablFuWEc0Z0lDQWdmVHRjYmlBZ2ZTeGNiaUFnWTI5dGNHOXVaVzUwVjJsc2JGSmxZMlZwZG1WUWNtOXdjem9nWm5WdVkzUnBiMjRnS0c1bGVIUlFjbTl3Y3lrZ2UxeHVJQ0FnSUdsbUlDaHVaWGgwVUhKdmNITXVZV3hwWjI0cElIdGNiaUFnSUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTJGc2FXZHVPaUJ1WlhoMFVISnZjSE11WVd4cFoyNTlLVHRjYmlBZ0lDQjlYRzRnSUgwc1hHNGdJR052YlhCdmJtVnVkRVJwWkUxdmRXNTBPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZEdocGN5NWZaVzV6ZFhKbFJISnZjR1J2ZDI1V2FYTnBZbWxzYVhSNUtDazdYRzRnSUgwc1hHNGdJR052YlhCdmJtVnVkRVJwWkZWd1pHRjBaVG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhSb2FYTXVYMlZ1YzNWeVpVUnliM0JrYjNkdVZtbHphV0pwYkdsMGVTZ3BPMXh1SUNCOUxGeHVJQ0JuWlhSRVpXWmhkV3gwVUhKdmNITTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdlMXh1SUNBZ0lDQWdZMmh2YVdObGN6b2dXMTFjYmlBZ0lDQjlPMXh1SUNCOUxGeHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ1kyaHZhV05sY3lBOUlIUm9hWE11YzNSaGRHVXViM0JsYmlBbUppQjBhR2x6TGw5aWRXbHNaRU5vYjJsalpYTW9LVHRjYmlBZ0lDQjJZWElnWTJ4aGMzTmxjeUE5SUZzblpISnZjR1J2ZDI0bkxDQW5ZV3hwWjI0dEp5QXJJSFJvYVhNdWMzUmhkR1V1WVd4cFoyNWRPMXh1SUNBZ0lIWmhjaUJpZFhSMGIyNVFjbTl3Y3p0Y2JseHVJQ0FnSUdKMWRIUnZibEJ5YjNCeklEMGdlMXh1SUNBZ0lDQWdkR1Y0ZERvZ0lDQWdJQ0FnZEdocGN5NXdjbTl3Y3k1elpXeGxZM1JsWkN4Y2JpQWdJQ0FnSUdGbWRHVnlTV052YmpvZ0lDZGpZWEpsZEMxa2IzZHVKeXhjYmlBZ0lDQWdJRzl1UTJ4cFkyczZJQ0FnSUhSb2FYTXVYM1J2WjJkc1pVOXdaVzVjYmlBZ0lDQjlPMXh1WEc0Z0lDQWdkR2hwY3k1d2NtOXdjeTVqYkdGemMwNWhiV1VnSmlZZ1kyeGhjM05sY3k1d2RYTm9LSFJvYVhNdWNISnZjSE11WTJ4aGMzTk9ZVzFsS1R0Y2JseHVJQ0FnSUdsbUlDaDBhR2x6TG5CeWIzQnpMblJvWlcxbEtTQjdYRzRnSUNBZ0lDQmpiR0Z6YzJWekxuQjFjMmdvZEdocGN5NXdjbTl3Y3k1MGFHVnRaU2s3WEc0Z0lDQWdJQ0JpZFhSMGIyNVFjbTl3Y3k1amJHRnpjMDVoYldVZ1BTQjBhR2x6TG5CeWIzQnpMblJvWlcxbE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMTdZMnhoYzNObGN5NXFiMmx1S0NjZ0p5bDlJRzl1VFc5MWMyVk1aV0YyWlQxN2RHaHBjeTVmYUdGdVpHeGxUR1ZoZG1WOVBseHVJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0luTmxiR1ZqZEdWa1hDSStYRzRnSUNBZ0lDQWdJQ0FnUEVKMWRIUnZiaUI3TGk0dVluVjBkRzl1VUhKdmNITjlJQzgrWEc0Z0lDQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDQWdJQ0I3WTJodmFXTmxjMzFjYmlBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNrN1hHNGdJSDBzWEc0Z0lGOW9ZVzVrYkdWTVpXRjJaVG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhSb2FYTXVjMlYwVTNSaGRHVW9lMjl3Wlc0NklHWmhiSE5sZlNrN1hHNGdJSDBzWEc0Z0lGOTBiMmRuYkdWUGNHVnVPaUJtZFc1amRHbHZiaUFvWlNrZ2UxeHVJQ0FnSUdsbUlDaDBhR2x6TG5CeWIzQnpMbTl1UTJ4cFkyc3BJSHRjYmlBZ0lDQWdJSFJvYVhNdWNISnZjSE11YjI1RGJHbGpheWhsS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdGNiaUFnSUNBZ0lHOXdaVzQ2SUNFZ2RHaHBjeTV6ZEdGMFpTNXZjR1Z1WEc0Z0lDQWdmU2s3WEc0Z0lIMHNYRzRnSUY5aWRXbHNaRU5vYjJsalpYTTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ1kyaHZhV05sY3lBOUlGdGRPMXh1WEc0Z0lDQWdZMmh2YVdObGN5QTlJSFJvYVhNdWNISnZjSE11WTJodmFXTmxjeTV0WVhBb1puVnVZM1JwYjI0Z0tHTm9iMmxqWlN3Z2FXNWtaWGdwSUh0Y2JpQWdJQ0FnSUdsbUlDaGphRzlwWTJVdWMyVndZWEpoZEc5eUtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQW9QR3hwSUdOc1lYTnpUbUZ0WlQxY0luTmxjR0Z5WVhSdmNsd2lJR3RsZVQxN2FXNWtaWGg5SUM4K0tUdGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkbUZ5SUhCeWIzQnpJRDBnZTF4dUlDQWdJQ0FnSUNCclpYazZJQ0FnSUNBZ2FXNWtaWGdzWEc0Z0lDQWdJQ0FnSUhSbGVIUTZJQ0FnSUNCamFHOXBZMlV1ZEdWNGRDeGNiaUFnSUNBZ0lDQWdiMjVEYUc5cFkyVTZJSFJvYVhNdVgyaGhibVJzWlVOb2IybGpaU3hjYmlBZ0lDQWdJQ0FnZEdobGJXVTZJQ0FnSUhSb2FYTXVjSEp2Y0hNdWRHaGxiV1VzWEc0Z0lDQWdJQ0FnSUhaaGJIVmxPaUFnSUNCamFHOXBZMlV1ZG1Gc2RXVmNiaUFnSUNBZ0lIMDdYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQWdJRHhFY205d1pHOTNia05vYjJsalpTQjdMaTR1Y0hKdmNITjlJQzgrWEc0Z0lDQWdJQ0FwTzF4dUlDQWdJSDBzSUhSb2FYTXBPMXh1WEc0Z0lDQWdjbVYwZFhKdUlDZzhkV3dnY21WbVBWd2laSEp2Y0dSdmQyNWNJajU3WTJodmFXTmxjMzA4TDNWc1BpazdYRzRnSUgwc1hHNGdJRjlvWVc1a2JHVkRhRzlwWTJVNklHWjFibU4wYVc5dUlDaDJZV3gxWlNrZ2UxeHVJQ0FnSUdsbUlDaDBhR2x6TG5CeWIzQnpMbTl1UTJodmFXTmxLU0I3WEc0Z0lDQWdJQ0IwYUdsekxuQnliM0J6TG05dVEyaHZhV05sS0haaGJIVmxLVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0dmNHVnVPaUJtWVd4elpYMHBPMXh1SUNCOUxGeHVJQ0JmWlc1emRYSmxSSEp2Y0dSdmQyNVdhWE5wWW1sc2FYUjVPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnYVdZZ0tDRWdkR2hwY3k1emRHRjBaUzV2Y0dWdUtTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2JuVnNiRHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQjJZWElnWkhKdmNHUnZkMjRnSUQwZ2RHaHBjeTV5WldaekxtUnliM0JrYjNkdU8xeHVJQ0FnSUhaaGNpQWtaV3dnSUNBZ0lDQWdQU0FrS0dSeWIzQmtiM2R1TG1kbGRFUlBUVTV2WkdVb0tTazdYRzRnSUNBZ2RtRnlJRzVsZDFOMFlYUmxJQ0E5SUh0OU8xeHVJQ0FnSUhaaGNpQm9ZVzVrYkdWeUlDQWdQU0J2Wm1aelkzSmxaVzVmYUdGdVpHeGxjbk5iZEdocGN5NXpkR0YwWlM1aGJHbG5ibDA3WEc1Y2JpQWdJQ0JvWVc1a2JHVnlJQ1ltSUdoaGJtUnNaWElvSkdWc0xDQnVaWGRUZEdGMFpTazdYRzVjYmlBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0c1bGQxTjBZWFJsS1R0Y2JpQWdmU3hjYmlBZ1gyVjRhWFE2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHR2Y0dWdU9pQm1ZV3h6WlgwcE8xeHVJQ0I5WEc1OUtUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JFY205d1pHOTNianRjYmlKZGZRPT0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIEZpbHRlckJveDtcbnZhciBSZWFjdCAgICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBCYWNrYm9uZSAgICAgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBBdXRvY29tcGxldGUgID0gcmVxdWlyZSgnLi9hdXRvY29tcGxldGUuanN4Jyk7XG52YXIgQnV0dG9uICAgICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvYnV0dG9uLmpzeCcpO1xudmFyIERyb3Bkb3duICAgICAgPSByZXF1aXJlKCcuL2Ryb3Bkb3duLmpzeCcpO1xudmFyIEFuZE9yICAgICAgICAgPSByZXF1aXJlKCcuL2FuZF9vcl9zZWxlY3Rvci5qc3gnKTtcbnZhciBjcml0ZXJpYSAgICAgID0gcmVxdWlyZSgnLi9maWx0ZXJfYm94X2RlZmluaXRpb24nKTtcblxuRmlsdGVyQm94ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkZpbHRlckJveFwiLFxuICBwcm9wVHlwZXM6IHtcbiAgICBmaWx0ZXJUeXBlOiBSZWFjdC5Qcm9wVHlwZXMub25lT2YoW0FuZE9yLkFORCwgQW5kT3IuT1JdKSxcbiAgICBsb2NrVHlwZTogICBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgICBjcml0ZXJpYTogICBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZvY3VzU2VhcmNoKCk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlRG9jdW1lbnRDbGljayk7XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZURvY3VtZW50Q2xpY2spO1xuICB9LFxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZvY3VzU2VhcmNoKCk7XG4gIH0sXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBmaWx0ZXJUeXBlOiBBbmRPci5BTkQsXG4gICAgICBsb2NrVHlwZTogICBmYWxzZSxcbiAgICAgIGVkaXRpbmc6ICAgIGZhbHNlXG4gICAgfVxuICB9LFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZmlsdGVyVHlwZTogdGhpcy5wcm9wcy5maWx0ZXJUeXBlLFxuICAgICAgZWRpdGluZzogICAgdGhpcy5wcm9wcy5lZGl0aW5nXG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGdyb3VwcyA9IHRoaXMuYnVpbGRHcm91cHMoKTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZmlsdGVyLWJveFwiLCBvbkNsaWNrOiB0aGlzLmhhbmRsZUNsaWNrfSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7Y2xhc3NOYW1lOiBcInNlYXJjaC1hY3Rpb24gcHVsbC1yaWdodCBmZWF1eC1idXR0b25cIiwgaWNvbjogXCJzZWFyY2hcIiwgb25DbGljazogdGhpcy5pbml0aWF0ZVNlYXJjaH0pLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY2hhaW4tZ3JvdXBcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwiY2hhaW5cIn0sIFxuICAgICAgICAgICAgXCJGaW5kIGNhc2VzIG1hdGNoaW5nXCJcbiAgICAgICAgICApLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQW5kT3IsIHtvbkNoYW5nZTogdGhpcy5oYW5kbGVGaWx0ZXJUeXBlQ2hhbmdlLCB0eXBlOiB0aGlzLnN0YXRlLmZpbHRlclR5cGV9KVxuICAgICAgICApLCBcblxuICAgICAgICBncm91cHNcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBoYW5kbGVEb2N1bWVudENsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbmRFZGl0aW5nKCk7XG4gIH0sXG4gIGJ1aWxkR3JvdXBzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlucHV0X3Byb3BzO1xuICAgIHZhciBncm91cHMgICAgPSBbXTtcbiAgICB2YXIgZ2VuZXJhdG9yID0gdGhpcy5wcm9wcy5jcml0ZXJpYS50b09wdGlvbnMuYmluZCh0aGlzLnByb3BzLmNyaXRlcmlhKTtcblxuICAgIGlucHV0X3Byb3BzID0ge1xuICAgICAgdHlwZTogICAgICAgICAndGV4dCcsXG4gICAgICBjbGFzc05hbWU6ICAgICdjaGFpbiBpbnB1dGFibGUnLFxuICAgICAgcGxhY2Vob2xkZXI6ICAnc2VhcmNoIGNyaXRlcmlhJyxcbiAgICAgIHJlZjogICAgICAgICAgJ3NlYXJjaENyaXRlcmlhJyxcbiAgICAgIG9uQ2hhbmdlOiAgICAgdGhpcy5oYW5kbGVTZWFyY2hDcml0ZXJpYVxuICAgIH07XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5lZGl0aW5nKSB7XG4gICAgICBncm91cHMucHVzaChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNoYWluLWdyb3VwXCIsIGtleTogXCJzZWFyY2hDcml0ZXJpYVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChBdXRvY29tcGxldGUsIHtyZWY6IFwic2VhcmNoQ3JpdGVyaWFcIiwgbmFtZTogXCJzb21ldGhpbmdcIiwgb25TZWxlY3Q6IHRoaXMuaGFuZGxlU2VsZWN0LCBnZW5lcmF0b3I6IGdlbmVyYXRvciwgZWRpdGluZzogdHJ1ZX0pXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdyb3VwcztcbiAgfSxcbiAgaGFuZGxlU2VsZWN0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLnByb3BzLmNyaXRlcmlhLnVzZSh2YWx1ZS52YWx1ZSk7XG4gICAgdGhpcy5lbmRFZGl0aW5nKCk7XG4gIH0sXG4gIGhhbmRsZUZpbHRlclR5cGVDaGFuZ2U6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICghIHRoaXMucHJvcHMubG9ja1R5cGUpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2ZpbHRlclR5cGU6IHZhbHVlfSk7XG4gICAgfVxuICB9LFxuICBpbml0aWF0ZVNlYXJjaDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZW5kRWRpdGluZygpO1xuICB9LFxuICBoYW5kbGVDbGljazogZnVuY3Rpb24gKGUpIHtcbiAgICAvLyBJbiB0aGUgdGVzdCBlbnYsIHdlIGRvIG5vdCBoYXZlIHN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiwgc28gb3VyXG4gICAgLy8gdGVzdHMgd2lsbCBicmVhayBpZiB3ZSBkb24ndCB1c2UgYW4gYGlmYCBzdGF0ZW1lbnQgaGVyZVxuICAgIGlmIChlLm5hdGl2ZUV2ZW50ICYmIGUubmF0aXZlRXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKSB7XG4gICAgICBlLm5hdGl2ZUV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgIH1cblxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdGhpcy5lbmFibGVFZGl0aW5nKCk7XG4gIH0sXG4gIGVuYWJsZUVkaXRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoISB0aGlzLnN0YXRlLmVkaXRpbmcpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2VkaXRpbmc6IHRydWV9KTtcbiAgICB9XG4gIH0sXG4gIGVuZEVkaXRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5lZGl0aW5nKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtlZGl0aW5nOiBmYWxzZX0pO1xuICAgIH1cbiAgfSxcbiAgZm9jdXNTZWFyY2g6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoISB0aGlzLnN0YXRlLmVkaXRpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKnZhciBub2RlID0gUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLnNlYXJjaENyaXRlcmlhKTtcblxuICAgIG5vZGUuZm9jdXMoKTsqL1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaWx0ZXJCb3g7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZZMkZ6WlhNdlptbHNkR1Z5WDJKdmVDNXFjM2dpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN08wRkJSVUVzUjBGQlJ6czdRVUZGU0N4SlFVRkpMRk5CUVZNc1EwRkJRenRCUVVOa0xFbEJRVWtzUzBGQlN5eFhRVUZYTEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVOeVF5eEpRVUZKTEZGQlFWRXNVVUZCVVN4UFFVRlBMRU5CUVVNc1ZVRkJWU3hEUVVGRExFTkJRVU03UVVGRGVFTXNTVUZCU1N4WlFVRlpMRWxCUVVrc1QwRkJUeXhEUVVGRExHOUNRVUZ2UWl4RFFVRkRMRU5CUVVNN1FVRkRiRVFzU1VGQlNTeE5RVUZOTEZWQlFWVXNUMEZCVHl4RFFVRkRMRFpDUVVFMlFpeERRVUZETEVOQlFVTTdRVUZETTBRc1NVRkJTU3hSUVVGUkxGRkJRVkVzVDBGQlR5eERRVUZETEdkQ1FVRm5RaXhEUVVGRExFTkJRVU03UVVGRE9VTXNTVUZCU1N4TFFVRkxMRmRCUVZjc1QwRkJUeXhEUVVGRExIVkNRVUYxUWl4RFFVRkRMRU5CUVVNN1FVRkRja1FzU1VGQlNTeFJRVUZSTEZGQlFWRXNUMEZCVHl4RFFVRkRMSGxDUVVGNVFpeERRVUZETEVOQlFVTTdPMEZCUlhaRUxDdENRVUVyUWl4NVFrRkJRVHRGUVVNM1FpeFRRVUZUTEVWQlFVVTdTVUZEVkN4VlFVRlZMRVZCUVVVc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhGUVVGRkxFdEJRVXNzUTBGQlF5eEZRVUZGTEVOQlFVTXNRMEZCUXp0SlFVTjRSQ3hSUVVGUkxFbEJRVWtzUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4SlFVRkpPMGxCUTJoRExGRkJRVkVzU1VGQlNTeExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwc1EwRkJReXhWUVVGVk8wZEJRemxETzBWQlEwUXNhVUpCUVdsQ0xFVkJRVVVzV1VGQldUdEJRVU5xUXl4SlFVRkpMRWxCUVVrc1EwRkJReXhYUVVGWExFVkJRVVVzUTBGQlF6czdTVUZGYmtJc1VVRkJVU3hEUVVGRExHZENRVUZuUWl4RFFVRkRMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zYlVKQlFXMUNMRU5CUVVNc1EwRkJRenRIUVVNNVJEdEZRVU5FTEc5Q1FVRnZRaXhGUVVGRkxGbEJRVms3U1VGRGFFTXNVVUZCVVN4RFFVRkRMRzFDUVVGdFFpeERRVUZETEU5QlFVOHNSVUZCUlN4SlFVRkpMRU5CUVVNc2JVSkJRVzFDTEVOQlFVTXNRMEZCUXp0SFFVTnFSVHRGUVVORUxHdENRVUZyUWl4RlFVRkZMRmxCUVZrN1NVRkRPVUlzU1VGQlNTeERRVUZETEZkQlFWY3NSVUZCUlN4RFFVRkRPMGRCUTNCQ08wVkJRMFFzWlVGQlpTeEZRVUZGTEZsQlFWazdTVUZETTBJc1QwRkJUenROUVVOTUxGVkJRVlVzUlVGQlJTeExRVUZMTEVOQlFVTXNSMEZCUnp0TlFVTnlRaXhSUVVGUkxFbEJRVWtzUzBGQlN6dE5RVU5xUWl4UFFVRlBMRXRCUVVzc1MwRkJTenRMUVVOc1FqdEhRVU5HTzBWQlEwUXNaVUZCWlN4RlFVRkZMRmxCUVZrN1NVRkRNMElzVDBGQlR6dE5RVU5NTEZWQlFWVXNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGVkJRVlU3VFVGRGFrTXNUMEZCVHl4TFFVRkxMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR6dExRVU12UWl4RFFVRkRPMGRCUTBnN1JVRkRSQ3hOUVVGTkxFVkJRVVVzV1VGQldUdEJRVU4wUWl4SlFVRkpMRWxCUVVrc1RVRkJUU3hIUVVGSExFbEJRVWtzUTBGQlF5eFhRVUZYTEVWQlFVVXNRMEZCUXpzN1NVRkZhRU03VFVGRFJTeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEZsQlFVRXNSVUZCV1N4RFFVRkRMRTlCUVVFc1JVRkJUeXhEUVVGRkxFbEJRVWtzUTBGQlF5eFhRVUZoTEVOQlFVRXNSVUZCUVR0QlFVTTNSQ3hSUVVGUkxHOUNRVUZETEUxQlFVMHNSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zZFVOQlFVRXNSVUZCZFVNc1EwRkJReXhKUVVGQkxFVkJRVWtzUTBGQlF5eFJRVUZCTEVWQlFWRXNRMEZCUXl4UFFVRkJMRVZCUVU4c1EwRkJSU3hKUVVGSkxFTkJRVU1zWTBGQlpTeERRVUZCTEVOQlFVY3NRMEZCUVN4RlFVRkJPenRSUVVWNFJ5eHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEdGQlFXTXNRMEZCUVN4RlFVRkJPMVZCUXpOQ0xHOUNRVUZCTEUxQlFVc3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zVDBGQlVTeERRVUZCTEVWQlFVRTdRVUZCUVN4WlFVRkJMSEZDUVVGQk8wRkJRVUVzUVVGRmJFTXNWVUZCYVVJc1EwRkJRU3hGUVVGQk96dFZRVVZRTEc5Q1FVRkRMRXRCUVVzc1JVRkJRU3hEUVVGQkxFTkJRVU1zVVVGQlFTeEZRVUZSTEVOQlFVVXNTVUZCU1N4RFFVRkRMSE5DUVVGelFpeEZRVUZETEVOQlFVTXNTVUZCUVN4RlFVRkpMRU5CUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFZRVUZYTEVOQlFVRXNRMEZCUnl4RFFVRkJPMEZCUTNaR0xGRkJRV01zUTBGQlFTeEZRVUZCT3p0UlFVVk1MRTFCUVU4N1RVRkRTaXhEUVVGQk8wMUJRMDQ3UjBGRFNEdEZRVU5FTEcxQ1FVRnRRaXhGUVVGRkxGbEJRVms3U1VGREwwSXNTVUZCU1N4RFFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRE8wZEJRMjVDTzBWQlEwUXNWMEZCVnl4RlFVRkZMRmxCUVZrN1NVRkRka0lzU1VGQlNTeFhRVUZYTEVOQlFVTTdTVUZEYUVJc1NVRkJTU3hOUVVGTkxFMUJRVTBzUlVGQlJTeERRVUZETzBGQlEzWkNMRWxCUVVrc1NVRkJTU3hUUVVGVExFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UlFVRlJMRU5CUVVNc1UwRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE96dEpRVVY0UlN4WFFVRlhMRWRCUVVjN1RVRkRXaXhKUVVGSkxGVkJRVlVzVFVGQlRUdE5RVU53UWl4VFFVRlRMRXRCUVVzc2FVSkJRV2xDTzAxQlF5OUNMRmRCUVZjc1IwRkJSeXhwUWtGQmFVSTdUVUZETDBJc1IwRkJSeXhYUVVGWExHZENRVUZuUWp0TlFVTTVRaXhSUVVGUkxFMUJRVTBzU1VGQlNTeERRVUZETEc5Q1FVRnZRanRCUVVNM1F5eExRVUZMTEVOQlFVTTdPMGxCUlVZc1NVRkJTU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNSVUZCUlR0TlFVTjBRaXhOUVVGTkxFTkJRVU1zU1VGQlNUdFJRVU5VTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNZVUZCUVN4RlFVRmhMRU5CUVVNc1IwRkJRU3hGUVVGSExFTkJRVU1zWjBKQlFXbENMRU5CUVVFc1JVRkJRVHRWUVVOb1JDeHZRa0ZCUXl4WlFVRlpMRVZCUVVFc1EwRkJRU3hEUVVGRExFZEJRVUVzUlVGQlJ5eERRVUZETEdkQ1FVRkJMRVZCUVdkQ0xFTkJRVU1zU1VGQlFTeEZRVUZKTEVOQlFVTXNWMEZCUVN4RlFVRlhMRU5CUVVNc1VVRkJRU3hGUVVGUkxFTkJRVVVzU1VGQlNTeERRVUZETEZsQlFWa3NSVUZCUXl4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRkxGTkJRVk1zUlVGQlF5eERRVUZETEU5QlFVRXNSVUZCVHl4RFFVRkZMRWxCUVVzc1EwRkJRU3hEUVVGSExFTkJRVUU3VVVGRGNFZ3NRMEZCUVR0UFFVTlFMRU5CUVVNN1FVRkRVaXhMUVVGTE96dEpRVVZFTEU5QlFVOHNUVUZCVFN4RFFVRkRPMGRCUTJZN1JVRkRSQ3haUVVGWkxFVkJRVVVzVlVGQlZTeExRVUZMTEVWQlFVVTdTVUZETjBJc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFJRVUZSTEVOQlFVTXNSMEZCUnl4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dEpRVU55UXl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hGUVVGRkxFTkJRVU03UjBGRGJrSTdSVUZEUkN4elFrRkJjMElzUlVGQlJTeFZRVUZWTEV0QlFVc3NSVUZCUlR0SlFVTjJReXhKUVVGSkxFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UlFVRlJMRVZCUVVVN1RVRkRla0lzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRlZCUVZVc1JVRkJSU3hMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETzB0QlEzQkRPMGRCUTBZN1JVRkRSQ3hqUVVGakxFVkJRVVVzV1VGQldUdEpRVU14UWl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hGUVVGRkxFTkJRVU03UjBGRGJrSTdRVUZEU0N4RlFVRkZMRmRCUVZjc1JVRkJSU3hWUVVGVkxFTkJRVU1zUlVGQlJUdEJRVU0xUWpzN1NVRkZTU3hKUVVGSkxFTkJRVU1zUTBGQlF5eFhRVUZYTEVsQlFVa3NRMEZCUXl4RFFVRkRMRmRCUVZjc1EwRkJReXgzUWtGQmQwSXNSVUZCUlR0TlFVTXpSQ3hEUVVGRExFTkJRVU1zVjBGQlZ5eERRVUZETEhkQ1FVRjNRaXhGUVVGRkxFTkJRVU03UVVGREwwTXNTMEZCU3pzN1NVRkZSQ3hEUVVGRExFTkJRVU1zWlVGQlpTeEZRVUZGTEVOQlFVTTdRVUZEZUVJc1NVRkJTU3hEUVVGRExFTkJRVU1zWTBGQll5eEZRVUZGTEVOQlFVTTdPMGxCUlc1Q0xFbEJRVWtzUTBGQlF5eGhRVUZoTEVWQlFVVXNRMEZCUXp0SFFVTjBRanRGUVVORUxHRkJRV0VzUlVGQlJTeFpRVUZaTzBsQlEzcENMRWxCUVVrc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNSVUZCUlR0TlFVTjRRaXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNUMEZCVHl4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU03UzBGRGFFTTdSMEZEUmp0RlFVTkVMRlZCUVZVc1JVRkJSU3haUVVGWk8wbEJRM1JDTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFVkJRVVU3VFVGRGRFSXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExFOUJRVThzUlVGQlJTeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRPMHRCUTJwRE8wZEJRMFk3UlVGRFJDeFhRVUZYTEVWQlFVVXNXVUZCV1R0SlFVTjJRaXhKUVVGSkxFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRVZCUVVVN1RVRkRlRUlzVDBGQlR6dEJRVU5pTEV0QlFVczdRVUZEVER0QlFVTkJPMEZCUTBFN08wZEJSVWM3UVVGRFNDeERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEZOQlFWTXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFLbHh1SUNvZ1FHcHplQ0JTWldGamRDNUVUMDFjYmlBcUwxeHVYRzUyWVhJZ1JtbHNkR1Z5UW05NE8xeHVkbUZ5SUZKbFlXTjBJQ0FnSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDY3BPMXh1ZG1GeUlFSmhZMnRpYjI1bElDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkaVlXTnJZbTl1WlNjcE8xeHVkbUZ5SUVGMWRHOWpiMjF3YkdWMFpTQWdQU0J5WlhGMWFYSmxLQ2N1TDJGMWRHOWpiMjF3YkdWMFpTNXFjM2duS1R0Y2JuWmhjaUJDZFhSMGIyNGdJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTR2TGk0dlkyOXRjRzl1Wlc1MGN5OWlkWFIwYjI0dWFuTjRKeWs3WEc1MllYSWdSSEp2Y0dSdmQyNGdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHZaSEp2Y0dSdmQyNHVhbk40SnlrN1hHNTJZWElnUVc1a1QzSWdJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR2WVc1a1gyOXlYM05sYkdWamRHOXlMbXB6ZUNjcE8xeHVkbUZ5SUdOeWFYUmxjbWxoSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2N1TDJacGJIUmxjbDlpYjNoZlpHVm1hVzVwZEdsdmJpY3BPMXh1WEc1R2FXeDBaWEpDYjNnZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUhCeWIzQlVlWEJsY3pvZ2UxeHVJQ0FnSUdacGJIUmxjbFI1Y0dVNklGSmxZV04wTGxCeWIzQlVlWEJsY3k1dmJtVlBaaWhiUVc1a1QzSXVRVTVFTENCQmJtUlBjaTVQVWwwcExGeHVJQ0FnSUd4dlkydFVlWEJsT2lBZ0lGSmxZV04wTGxCeWIzQlVlWEJsY3k1aWIyOXNMRnh1SUNBZ0lHTnlhWFJsY21saE9pQWdJRkpsWVdOMExsQnliM0JVZVhCbGN5NXZZbXBsWTNRdWFYTlNaWEYxYVhKbFpGeHVJQ0I5TEZ4dUlDQmpiMjF3YjI1bGJuUkVhV1JOYjNWdWREb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFJvYVhNdVptOWpkWE5UWldGeVkyZ29LVHRjYmx4dUlDQWdJR1J2WTNWdFpXNTBMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9KMk5zYVdOckp5d2dkR2hwY3k1b1lXNWtiR1ZFYjJOMWJXVnVkRU5zYVdOcktUdGNiaUFnZlN4Y2JpQWdZMjl0Y0c5dVpXNTBWMmxzYkZWdWJXOTFiblE2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCa2IyTjFiV1Z1ZEM1eVpXMXZkbVZGZG1WdWRFeHBjM1JsYm1WeUtDZGpiR2xqYXljc0lIUm9hWE11YUdGdVpHeGxSRzlqZFcxbGJuUkRiR2xqYXlrN1hHNGdJSDBzWEc0Z0lHTnZiWEJ2Ym1WdWRFUnBaRlZ3WkdGMFpUb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFJvYVhNdVptOWpkWE5UWldGeVkyZ29LVHRjYmlBZ2ZTeGNiaUFnWjJWMFJHVm1ZWFZzZEZCeWIzQnpPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSHRjYmlBZ0lDQWdJR1pwYkhSbGNsUjVjR1U2SUVGdVpFOXlMa0ZPUkN4Y2JpQWdJQ0FnSUd4dlkydFVlWEJsT2lBZ0lHWmhiSE5sTEZ4dUlDQWdJQ0FnWldScGRHbHVaem9nSUNBZ1ptRnNjMlZjYmlBZ0lDQjlYRzRnSUgwc1hHNGdJR2RsZEVsdWFYUnBZV3hUZEdGMFpUb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjdYRzRnSUNBZ0lDQm1hV3gwWlhKVWVYQmxPaUIwYUdsekxuQnliM0J6TG1acGJIUmxjbFI1Y0dVc1hHNGdJQ0FnSUNCbFpHbDBhVzVuT2lBZ0lDQjBhR2x6TG5CeWIzQnpMbVZrYVhScGJtZGNiaUFnSUNCOU8xeHVJQ0I5TEZ4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnWjNKdmRYQnpJRDBnZEdocGN5NWlkV2xzWkVkeWIzVndjeWdwTzF4dVhHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2labWxzZEdWeUxXSnZlRndpSUc5dVEyeHBZMnM5ZTNSb2FYTXVhR0Z1Wkd4bFEyeHBZMnQ5UGx4dUlDQWdJQ0FnSUNBOFFuVjBkRzl1SUdOc1lYTnpUbUZ0WlQxY0luTmxZWEpqYUMxaFkzUnBiMjRnY0hWc2JDMXlhV2RvZENCbVpXRjFlQzFpZFhSMGIyNWNJaUJwWTI5dVBWd2ljMlZoY21Ob1hDSWdiMjVEYkdsamF6MTdkR2hwY3k1cGJtbDBhV0YwWlZObFlYSmphSDBnTHo1Y2JseHVJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltTm9ZV2x1TFdkeWIzVndYQ0krWEc0Z0lDQWdJQ0FnSUNBZ1BITndZVzRnWTJ4aGMzTk9ZVzFsUFZ3aVkyaGhhVzVjSWo1Y2JpQWdJQ0FnSUNBZ0lDQWdJRVpwYm1RZ1kyRnpaWE1nYldGMFkyaHBibWRjYmlBZ0lDQWdJQ0FnSUNBOEwzTndZVzQrWEc1Y2JpQWdJQ0FnSUNBZ0lDQThRVzVrVDNJZ2IyNURhR0Z1WjJVOWUzUm9hWE11YUdGdVpHeGxSbWxzZEdWeVZIbHdaVU5vWVc1blpYMGdkSGx3WlQxN2RHaHBjeTV6ZEdGMFpTNW1hV3gwWlhKVWVYQmxmU0F2UGx4dUlDQWdJQ0FnSUNBOEwyUnBkajVjYmx4dUlDQWdJQ0FnSUNCN1ozSnZkWEJ6ZlZ4dUlDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0tUdGNiaUFnZlN4Y2JpQWdhR0Z1Wkd4bFJHOWpkVzFsYm5SRGJHbGphem9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhSb2FYTXVaVzVrUldScGRHbHVaeWdwTzF4dUlDQjlMRnh1SUNCaWRXbHNaRWR5YjNWd2N6b2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCcGJuQjFkRjl3Y205d2N6dGNiaUFnSUNCMllYSWdaM0p2ZFhCeklDQWdJRDBnVzEwN1hHNGdJQ0FnZG1GeUlHZGxibVZ5WVhSdmNpQTlJSFJvYVhNdWNISnZjSE11WTNKcGRHVnlhV0V1ZEc5UGNIUnBiMjV6TG1KcGJtUW9kR2hwY3k1d2NtOXdjeTVqY21sMFpYSnBZU2s3WEc1Y2JpQWdJQ0JwYm5CMWRGOXdjbTl3Y3lBOUlIdGNiaUFnSUNBZ0lIUjVjR1U2SUNBZ0lDQWdJQ0FnSjNSbGVIUW5MRnh1SUNBZ0lDQWdZMnhoYzNOT1lXMWxPaUFnSUNBblkyaGhhVzRnYVc1d2RYUmhZbXhsSnl4Y2JpQWdJQ0FnSUhCc1lXTmxhRzlzWkdWeU9pQWdKM05sWVhKamFDQmpjbWwwWlhKcFlTY3NYRzRnSUNBZ0lDQnlaV1k2SUNBZ0lDQWdJQ0FnSUNkelpXRnlZMmhEY21sMFpYSnBZU2NzWEc0Z0lDQWdJQ0J2YmtOb1lXNW5aVG9nSUNBZ0lIUm9hWE11YUdGdVpHeGxVMlZoY21Ob1EzSnBkR1Z5YVdGY2JpQWdJQ0I5TzF4dVhHNGdJQ0FnYVdZZ0tIUm9hWE11YzNSaGRHVXVaV1JwZEdsdVp5a2dlMXh1SUNBZ0lDQWdaM0p2ZFhCekxuQjFjMmdvWEc0Z0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpWTJoaGFXNHRaM0p2ZFhCY0lpQnJaWGs5WENKelpXRnlZMmhEY21sMFpYSnBZVndpUGx4dUlDQWdJQ0FnSUNBZ0lEeEJkWFJ2WTI5dGNHeGxkR1VnY21WbVBWd2ljMlZoY21Ob1EzSnBkR1Z5YVdGY0lpQnVZVzFsUFZ3aWMyOXRaWFJvYVc1blhDSWdiMjVUWld4bFkzUTllM1JvYVhNdWFHRnVaR3hsVTJWc1pXTjBmU0JuWlc1bGNtRjBiM0k5ZTJkbGJtVnlZWFJ2Y24wZ1pXUnBkR2x1WnoxN2RISjFaWDBnTHo1Y2JpQWdJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdJQ0FwTzF4dUlDQWdJSDFjYmx4dUlDQWdJSEpsZEhWeWJpQm5jbTkxY0hNN1hHNGdJSDBzWEc0Z0lHaGhibVJzWlZObGJHVmpkRG9nWm5WdVkzUnBiMjRnS0haaGJIVmxLU0I3WEc0Z0lDQWdkR2hwY3k1d2NtOXdjeTVqY21sMFpYSnBZUzUxYzJVb2RtRnNkV1V1ZG1Gc2RXVXBPMXh1SUNBZ0lIUm9hWE11Wlc1a1JXUnBkR2x1WnlncE8xeHVJQ0I5TEZ4dUlDQm9ZVzVrYkdWR2FXeDBaWEpVZVhCbFEyaGhibWRsT2lCbWRXNWpkR2x2YmlBb2RtRnNkV1VwSUh0Y2JpQWdJQ0JwWmlBb0lTQjBhR2x6TG5CeWIzQnpMbXh2WTJ0VWVYQmxLU0I3WEc0Z0lDQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdG1hV3gwWlhKVWVYQmxPaUIyWVd4MVpYMHBPMXh1SUNBZ0lIMWNiaUFnZlN4Y2JpQWdhVzVwZEdsaGRHVlRaV0Z5WTJnNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjBhR2x6TG1WdVpFVmthWFJwYm1jb0tUdGNiaUFnZlN4Y2JpQWdhR0Z1Wkd4bFEyeHBZMnM2SUdaMWJtTjBhVzl1SUNobEtTQjdYRzRnSUNBZ0x5OGdTVzRnZEdobElIUmxjM1FnWlc1MkxDQjNaU0JrYnlCdWIzUWdhR0YyWlNCemRHOXdTVzF0WldScFlYUmxVSEp2Y0dGbllYUnBiMjRzSUhOdklHOTFjbHh1SUNBZ0lDOHZJSFJsYzNSeklIZHBiR3dnWW5KbFlXc2dhV1lnZDJVZ1pHOXVKM1FnZFhObElHRnVJR0JwWm1BZ2MzUmhkR1Z0Wlc1MElHaGxjbVZjYmlBZ0lDQnBaaUFvWlM1dVlYUnBkbVZGZG1WdWRDQW1KaUJsTG01aGRHbDJaVVYyWlc1MExuTjBiM0JKYlcxbFpHbGhkR1ZRY205d1lXZGhkR2x2YmlrZ2UxeHVJQ0FnSUNBZ1pTNXVZWFJwZG1WRmRtVnVkQzV6ZEc5d1NXMXRaV1JwWVhSbFVISnZjR0ZuWVhScGIyNG9LVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQmxMbk4wYjNCUWNtOXdZV2RoZEdsdmJpZ3BPMXh1SUNBZ0lHVXVjSEpsZG1WdWRFUmxabUYxYkhRb0tUdGNibHh1SUNBZ0lIUm9hWE11Wlc1aFlteGxSV1JwZEdsdVp5Z3BPMXh1SUNCOUxGeHVJQ0JsYm1GaWJHVkZaR2wwYVc1bk9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdhV1lnS0NFZ2RHaHBjeTV6ZEdGMFpTNWxaR2wwYVc1bktTQjdYRzRnSUNBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0bFpHbDBhVzVuT2lCMGNuVmxmU2s3WEc0Z0lDQWdmVnh1SUNCOUxGeHVJQ0JsYm1SRlpHbDBhVzVuT2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2FXWWdLSFJvYVhNdWMzUmhkR1V1WldScGRHbHVaeWtnZTF4dUlDQWdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaDdaV1JwZEdsdVp6b2dabUZzYzJWOUtUdGNiaUFnSUNCOVhHNGdJSDBzWEc0Z0lHWnZZM1Z6VTJWaGNtTm9PaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnYVdZZ0tDRWdkR2hwY3k1emRHRjBaUzVsWkdsMGFXNW5LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNDdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5cDJZWElnYm05a1pTQTlJRkpsWVdOMExtWnBibVJFVDAxT2IyUmxLSFJvYVhNdWNtVm1jeTV6WldGeVkyaERjbWwwWlhKcFlTazdYRzVjYmlBZ0lDQnViMlJsTG1adlkzVnpLQ2s3S2k5Y2JpQWdmVnh1ZlNrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdSbWxzZEdWeVFtOTRPMXh1SWwxOSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgXyAgICAgICAgICAgICA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciBkYXRlX21hdGNoZXJzID0gWydkYXknLCAnZGF0ZSddO1xudmFyIGVzY2FwZVJlZ2V4ICAgPSByZXF1aXJlKCcuLi8uLi91dGlscy9lc2NhcGVfcmVnZXgnKTtcbnZhciBkZWZpbml0aW9uO1xuXG5kZWZpbml0aW9uID0ge1xuICBjcml0ZXJpYToge1xuICAgIHdlbGw6IHtcbiAgICAgIGRpc3BsYXk6ICAnV2VsbCBuYW1lJyxcbiAgICAgIGxvY2tlZDogICBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICBudWxsLFxuICAgICAgdHlwZTogICAgICdzdHJpbmcnLFxuICAgICAgbmVnYXRlOiAgIGZhbHNlXG4gICAgfSxcbiAgICByZXBvcnRlcjoge1xuICAgICAgZGlzcGxheTogICdSZXBvcnRlZCBieScsXG4gICAgICBsb2NrZWQ6ICAgZmFsc2UsXG4gICAgICB2YWx1ZTogICAgbnVsbCxcbiAgICAgIHR5cGU6ICAgICAnc3RyaW5nJyxcbiAgICAgIG5lZ2F0ZTogICBmYWxzZVxuICAgIH0sXG4gICAgcmVwb3J0ZWQ6IHtcbiAgICAgIGRpc3BsYXk6ICAnUmVwb3J0ZWQgb24nLFxuICAgICAgbWF0Y2hlcnM6IGRhdGVfbWF0Y2hlcnMsXG4gICAgICBsb2NrZWQ6ICAgZmFsc2UsXG4gICAgICB2YWx1ZTogICAgbnVsbCxcbiAgICAgIHR5cGU6ICAgICAnZGF5JyxcbiAgICAgIG5lZ2F0ZTogICBmYWxzZVxuICAgIH0sXG4gICAgcmVwb3J0ZWRfYmV0d2Vlbjoge1xuICAgICAgZGlzcGxheTogICdSZXBvcnRlZCBiZXR3ZWVuJyxcbiAgICAgIG1hdGNoZXJzOiBkYXRlX21hdGNoZXJzLFxuICAgICAgbG9ja2VkOiAgIGZhbHNlLFxuICAgICAgdmFsdWU6ICAgIFtdLFxuICAgICAgdHlwZTogICAgICdkYXRlcmFuZ2UnXG4gICAgfSxcbiAgICByZXBvcnRlZF9ndDoge1xuICAgICAgZGlzcGxheTogICdSZXBvcnRlZCBhZnRlcicsXG4gICAgICBtYXRjaGVyczogZGF0ZV9tYXRjaGVycyxcbiAgICAgIGxvY2tlZDogICBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICBudWxsLFxuICAgICAgdHlwZTogICAgICdkYXknXG4gICAgfSxcbiAgICByZXBvcnRlZF9sdDoge1xuICAgICAgZGlzcGxheTogICdSZXBvcnRlZCBiZWZvcmUnLFxuICAgICAgbWF0Y2hlcnM6IGRhdGVfbWF0Y2hlcnMsXG4gICAgICBsb2NrZWQ6ICAgZmFsc2UsXG4gICAgICB2YWx1ZTogICAgbnVsbCxcbiAgICAgIHR5cGU6ICAgICAnZGF5J1xuICAgIH0sXG4gICAgdXBkYXRlZDoge1xuICAgICAgZGlzcGxheTogICdVcGRhdGVkIG9uJyxcbiAgICAgIG1hdGNoZXJzOiBkYXRlX21hdGNoZXJzLFxuICAgICAgbG9ja2VkOiAgIGZhbHNlLFxuICAgICAgdmFsdWU6ICAgIG51bGwsXG4gICAgICB0eXBlOiAgICAgJ2RheScsXG4gICAgICBuZWdhdGU6ICAgZmFsc2VcbiAgICB9LFxuICAgIHVwZGF0ZWRfYmV0d2Vlbjoge1xuICAgICAgZGlzcGxheTogICdVcGRhdGVkIGJldHdlZW4nLFxuICAgICAgbWF0Y2hlcnM6IGRhdGVfbWF0Y2hlcnMsXG4gICAgICBsb2NrZWQ6ICAgZmFsc2UsXG4gICAgICB2YWx1ZTogICAgW10sXG4gICAgICB0eXBlOiAgICAgJ2RhdGVyYW5nZSdcbiAgICB9LFxuICAgIHVwZGF0ZWRfZ3Q6IHtcbiAgICAgIGRpc3BsYXk6ICAnVXBkYXRlZCBhZnRlcicsXG4gICAgICBtYXRjaGVyczogZGF0ZV9tYXRjaGVycyxcbiAgICAgIGxvY2tlZDogICBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICBudWxsLFxuICAgICAgdHlwZTogICAgICdkYXknXG4gICAgfSxcbiAgICB1cGRhdGVkX2x0OiB7XG4gICAgICBkaXNwbGF5OiAgJ1VwZGF0ZWQgYmVmb3JlJyxcbiAgICAgIG1hdGNoZXJzOiBkYXRlX21hdGNoZXJzLFxuICAgICAgbG9ja2VkOiAgIGZhbHNlLFxuICAgICAgdmFsdWU6ICAgIG51bGwsXG4gICAgICB0eXBlOiAgICAgJ2RheSdcbiAgICB9LFxuICAgIHRhZ3M6IHtcbiAgICAgIGRpc3BsYXk6ICAnVGFncycsXG4gICAgICBsb2NrZWQ6ICAgZmFsc2UsXG4gICAgICB0eXBlOiAgICAgJ3RhZycsXG4gICAgICBuZWdhdGU6ICAgZmFsc2UsXG4gICAgICBtdWx0aTogICAgdHJ1ZVxuICAgIH0sXG4gICAgcHJpb3JpdHk6IHtcbiAgICAgIGRpc3BsYXk6ICAnUHJpb3JpdHknLFxuICAgICAgbG9ja2VkOiAgIGZhbHNlLFxuICAgICAgdHlwZTogICAgICdudW1iZXInLFxuICAgICAgbmVnYXRlOiAgIGZhbHNlXG4gICAgfSxcbiAgICBwcmlvcml0eV9ndDoge1xuICAgICAgZGlzcGxheTogICdQcmlvcml0eSBhYm92ZScsXG4gICAgICBsb2NrZWQ6ICAgZmFsc2UsXG4gICAgICB0eXBlOiAgICAgJ251bWJlcidcbiAgICB9LFxuICAgIHByaW9yaXR5X2x0OiB7XG4gICAgICBkaXNwbGF5OiAgJ1ByaW9yaXR5IGJlbG93JyxcbiAgICAgIGxvY2tlZDogICBmYWxzZSxcbiAgICAgIHR5cGU6ICAgICAnbnVtYmVyJ1xuICAgIH0sXG4gICAgaXNzdWVfdHlwZToge1xuICAgICAgZGlzcGxheTogICdJc3N1ZSB0eXBlJyxcbiAgICAgIGxvY2tlZDogICBmYWxzZSxcbiAgICAgIHR5cGU6ICAgICAnc3RyaW5nJyxcbiAgICAgIG11bHRpOiAgICB0cnVlXG4gICAgfSxcbiAgICBpc3N1ZV9zdWJ0eXBlOiB7XG4gICAgICBkaXNwbGF5OiAgJ0lzc3VlIHN1YnR5cGUnLFxuICAgICAgbG9ja2VkOiAgIGZhbHNlLFxuICAgICAgdHlwZTogICAgICdzdHJpbmcnLFxuICAgICAgbXVsdGk6ICAgIHRydWVcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIEJ1aWxkZXIgKGNyaXRlcmlhKSB7XG4gIHRoaXMuY3JpdGVyaWEgICA9IF8uZXh0ZW5kKHt9LCBjcml0ZXJpYSk7XG4gIHRoaXMuZnJlZV90ZXh0ICA9IG51bGw7XG59XG5cbkJ1aWxkZXIucHJvdG90eXBlLm1hdGNoQ3JpdGVyaWEgPSBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gIGNvbnNvbGUudGltZSgnbWF0Y2hDcml0ZXJpYScpXG4gIHZhciByZXN1bHRzO1xuICB2YXIgcGF0dGVybiAgID0gLy4vO1xuICB2YXIgdmFsdWVzICAgID0gW107XG4gIHZhciBrZXlzICAgICAgPSBPYmplY3Qua2V5cyh0aGlzLmNyaXRlcmlhKTtcbiAgdmFyIHRydXRoVGVzdCA9IGZ1bmN0aW9uICgpIHtyZXR1cm4gdHJ1ZTt9O1xuXG4gIGlmIChzdHJpbmcgJiYgc3RyaW5nLmxlbmd0aCA+IDApIHtcbiAgICBwYXR0ZXJuICAgPSBuZXcgUmVnRXhwKGVzY2FwZVJlZ2V4KHN0cmluZyB8fCAnJyksICdpJyk7XG4gICAgdHJ1dGhUZXN0ID0gcGF0dGVybi50ZXN0LmJpbmQocGF0dGVybik7XG4gIH1cblxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBtYXRjaGVycztcbiAgICB2YXIgaTtcbiAgICB2YXIgbGVuO1xuICAgIHZhciBjcml0ZXJpYSA9IHRoaXMuY3JpdGVyaWFba2V5XTtcblxuICAgIGlmICghIHRoaXMuaXNBdmFpbGFibGUoa2V5KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0cnV0aFRlc3Qoa2V5KSkge1xuICAgICAgcmV0dXJuIHZhbHVlcy5wdXNoKGtleSk7XG4gICAgfVxuXG4gICAgaWYgKHRydXRoVGVzdCgnWycgKyBjcml0ZXJpYS5kaXNwbGF5ICsgJ10nKSkge1xuICAgICAgcmV0dXJuIHZhbHVlcy5wdXNoKGtleSk7XG4gICAgfVxuXG4gICAgbWF0Y2hlcnMgPSBjcml0ZXJpYS5tYXRjaGVycyB8fCBbXTtcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IG1hdGNoZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAocGF0dGVybi50ZXN0KG1hdGNoZXJzW2ldKSkge1xuICAgICAgICB2YWx1ZXMucHVzaChrZXkpO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfSwgdGhpcyk7XG5cbiAgcmVzdWx0cyA9IF8ucGljayh0aGlzLmNyaXRlcmlhLCB2YWx1ZXMpO1xuICBjb25zb2xlLnRpbWVFbmQoJ21hdGNoQ3JpdGVyaWEnKVxuXG4gIHJldHVybiByZXN1bHRzO1xufTtcblxuQnVpbGRlci5wcm90b3R5cGUudG9PcHRpb25zID0gZnVuY3Rpb24gKHN0cmluZykge1xuICB2YXIgcmVzdWx0cyA9IHRoaXMubWF0Y2hDcml0ZXJpYShzdHJpbmcpO1xuICB2YXIgb3B0aW9ucyA9IF8ubWFwKHJlc3VsdHMsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcbiAgICByZXR1cm4ge3ZhbHVlOiBrZXksIGxhYmVsOiBpdGVtLmRpc3BsYXl9O1xuICB9KTtcblxuICBpZiAoc3RyaW5nICYmICEgdGhpcy5mcmVlX3RleHQgJiYgISAvXlxcWy8udGVzdChzdHJpbmcpKSB7XG4gICAgb3B0aW9ucy51bnNoaWZ0KHtcbiAgICAgIGxhYmVsOiAgc3RyaW5nLFxuICAgICAgdmFsdWU6ICBzdHJpbmdcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBvcHRpb25zO1xufTtcblxuQnVpbGRlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGtleSwgcHJvcCwgdmFsdWUpIHtcbiAgaWYgKCEga2V5IHx8ICEgcHJvcCkge1xuICAgIHRocm93ICdrZXkgYW5kIHByb3AgYXJlIHJlcXVpcmVkJztcbiAgfVxuXG4gIGlmICh0aGlzLmNyaXRlcmlhLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICB0aGlzLmNyaXRlcmlhW2tleV1bcHJvcF0gPSB2YWx1ZTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG5CdWlsZGVyLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiB0aGlzLnNldChrZXksICd1c2VkJywgdHJ1ZSk7XG59O1xuXG5CdWlsZGVyLnByb3RvdHlwZS5yZWZ1bmQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiB0aGlzLnNldChrZXksICd1c2VkJyk7XG59O1xuXG5CdWlsZGVyLnByb3RvdHlwZS5sb2NrID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gdGhpcy5zZXQoa2V5LCAnbG9ja2VkJywgdHJ1ZSk7XG59O1xuXG5CdWlsZGVyLnByb3RvdHlwZS51bmxvY2sgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiB0aGlzLnNldChrZXksICdsb2NrZWQnLCBmYWxzZSk7XG59O1xuXG5CdWlsZGVyLnByb3RvdHlwZS5pc0F2YWlsYWJsZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgdmFyIGNyaXRlcmlhID0gdGhpcy5jcml0ZXJpYVtrZXldO1xuXG4gIGlmICghIGNyaXRlcmlhKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuICEgY3JpdGVyaWEubG9ja2VkICYmICEgY3JpdGVyaWEudXNlZDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBkZWZpbml0aW9uOiBkZWZpbml0aW9uLmNyaXRlcmlhLFxuICBCdWlsZGVyOiBCdWlsZGVyXG59O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WTJGelpYTXZabWxzZEdWeVgySnZlRjlrWldacGJtbDBhVzl1TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRmxCUVZrc1EwRkJRenM3UVVGRllpeEpRVUZKTEVOQlFVTXNaVUZCWlN4UFFVRlBMRU5CUVVNc1dVRkJXU3hEUVVGRExFTkJRVU03UVVGRE1VTXNTVUZCU1N4aFFVRmhMRWRCUVVjc1EwRkJReXhMUVVGTExFVkJRVVVzVFVGQlRTeERRVUZETEVOQlFVTTdRVUZEY0VNc1NVRkJTU3hYUVVGWExFdEJRVXNzVDBGQlR5eERRVUZETERCQ1FVRXdRaXhEUVVGRExFTkJRVU03UVVGRGVFUXNTVUZCU1N4VlFVRlZMRU5CUVVNN08wRkJSV1lzVlVGQlZTeEhRVUZITzBWQlExZ3NVVUZCVVN4RlFVRkZPMGxCUTFJc1NVRkJTU3hGUVVGRk8wMUJRMG9zVDBGQlR5eEhRVUZITEZkQlFWYzdUVUZEY2tJc1RVRkJUU3hKUVVGSkxFdEJRVXM3VFVGRFppeExRVUZMTEV0QlFVc3NTVUZCU1R0TlFVTmtMRWxCUVVrc1RVRkJUU3hSUVVGUk8wMUJRMnhDTEUxQlFVMHNTVUZCU1N4TFFVRkxPMHRCUTJoQ08wbEJRMFFzVVVGQlVTeEZRVUZGTzAxQlExSXNUMEZCVHl4SFFVRkhMR0ZCUVdFN1RVRkRka0lzVFVGQlRTeEpRVUZKTEV0QlFVczdUVUZEWml4TFFVRkxMRXRCUVVzc1NVRkJTVHROUVVOa0xFbEJRVWtzVFVGQlRTeFJRVUZSTzAxQlEyeENMRTFCUVUwc1NVRkJTU3hMUVVGTE8wdEJRMmhDTzBsQlEwUXNVVUZCVVN4RlFVRkZPMDFCUTFJc1QwRkJUeXhIUVVGSExHRkJRV0U3VFVGRGRrSXNVVUZCVVN4RlFVRkZMR0ZCUVdFN1RVRkRka0lzVFVGQlRTeEpRVUZKTEV0QlFVczdUVUZEWml4TFFVRkxMRXRCUVVzc1NVRkJTVHROUVVOa0xFbEJRVWtzVFVGQlRTeExRVUZMTzAxQlEyWXNUVUZCVFN4SlFVRkpMRXRCUVVzN1MwRkRhRUk3U1VGRFJDeG5Ra0ZCWjBJc1JVRkJSVHROUVVOb1FpeFBRVUZQTEVkQlFVY3NhMEpCUVd0Q08wMUJRelZDTEZGQlFWRXNSVUZCUlN4aFFVRmhPMDFCUTNaQ0xFMUJRVTBzU1VGQlNTeExRVUZMTzAxQlEyWXNTMEZCU3l4TFFVRkxMRVZCUVVVN1RVRkRXaXhKUVVGSkxFMUJRVTBzVjBGQlZ6dExRVU4wUWp0SlFVTkVMRmRCUVZjc1JVRkJSVHROUVVOWUxFOUJRVThzUjBGQlJ5eG5Ra0ZCWjBJN1RVRkRNVUlzVVVGQlVTeEZRVUZGTEdGQlFXRTdUVUZEZGtJc1RVRkJUU3hKUVVGSkxFdEJRVXM3VFVGRFppeExRVUZMTEV0QlFVc3NTVUZCU1R0TlFVTmtMRWxCUVVrc1RVRkJUU3hMUVVGTE8wdEJRMmhDTzBsQlEwUXNWMEZCVnl4RlFVRkZPMDFCUTFnc1QwRkJUeXhIUVVGSExHbENRVUZwUWp0TlFVTXpRaXhSUVVGUkxFVkJRVVVzWVVGQllUdE5RVU4yUWl4TlFVRk5MRWxCUVVrc1MwRkJTenROUVVObUxFdEJRVXNzUzBGQlN5eEpRVUZKTzAxQlEyUXNTVUZCU1N4TlFVRk5MRXRCUVVzN1MwRkRhRUk3U1VGRFJDeFBRVUZQTEVWQlFVVTdUVUZEVUN4UFFVRlBMRWRCUVVjc1dVRkJXVHROUVVOMFFpeFJRVUZSTEVWQlFVVXNZVUZCWVR0TlFVTjJRaXhOUVVGTkxFbEJRVWtzUzBGQlN6dE5RVU5tTEV0QlFVc3NTMEZCU3l4SlFVRkpPMDFCUTJRc1NVRkJTU3hOUVVGTkxFdEJRVXM3VFVGRFppeE5RVUZOTEVsQlFVa3NTMEZCU3p0TFFVTm9RanRKUVVORUxHVkJRV1VzUlVGQlJUdE5RVU5tTEU5QlFVOHNSMEZCUnl4cFFrRkJhVUk3VFVGRE0wSXNVVUZCVVN4RlFVRkZMR0ZCUVdFN1RVRkRka0lzVFVGQlRTeEpRVUZKTEV0QlFVczdUVUZEWml4TFFVRkxMRXRCUVVzc1JVRkJSVHROUVVOYUxFbEJRVWtzVFVGQlRTeFhRVUZYTzB0QlEzUkNPMGxCUTBRc1ZVRkJWU3hGUVVGRk8wMUJRMVlzVDBGQlR5eEhRVUZITEdWQlFXVTdUVUZEZWtJc1VVRkJVU3hGUVVGRkxHRkJRV0U3VFVGRGRrSXNUVUZCVFN4SlFVRkpMRXRCUVVzN1RVRkRaaXhMUVVGTExFdEJRVXNzU1VGQlNUdE5RVU5rTEVsQlFVa3NUVUZCVFN4TFFVRkxPMHRCUTJoQ08wbEJRMFFzVlVGQlZTeEZRVUZGTzAxQlExWXNUMEZCVHl4SFFVRkhMR2RDUVVGblFqdE5RVU14UWl4UlFVRlJMRVZCUVVVc1lVRkJZVHROUVVOMlFpeE5RVUZOTEVsQlFVa3NTMEZCU3p0TlFVTm1MRXRCUVVzc1MwRkJTeXhKUVVGSk8wMUJRMlFzU1VGQlNTeE5RVUZOTEV0QlFVczdTMEZEYUVJN1NVRkRSQ3hKUVVGSkxFVkJRVVU3VFVGRFNpeFBRVUZQTEVkQlFVY3NUVUZCVFR0TlFVTm9RaXhOUVVGTkxFbEJRVWtzUzBGQlN6dE5RVU5tTEVsQlFVa3NUVUZCVFN4TFFVRkxPMDFCUTJZc1RVRkJUU3hKUVVGSkxFdEJRVXM3VFVGRFppeExRVUZMTEV0QlFVc3NTVUZCU1R0TFFVTm1PMGxCUTBRc1VVRkJVU3hGUVVGRk8wMUJRMUlzVDBGQlR5eEhRVUZITEZWQlFWVTdUVUZEY0VJc1RVRkJUU3hKUVVGSkxFdEJRVXM3VFVGRFppeEpRVUZKTEUxQlFVMHNVVUZCVVR0TlFVTnNRaXhOUVVGTkxFbEJRVWtzUzBGQlN6dExRVU5vUWp0SlFVTkVMRmRCUVZjc1JVRkJSVHROUVVOWUxFOUJRVThzUjBGQlJ5eG5Ra0ZCWjBJN1RVRkRNVUlzVFVGQlRTeEpRVUZKTEV0QlFVczdUVUZEWml4SlFVRkpMRTFCUVUwc1VVRkJVVHRMUVVOdVFqdEpRVU5FTEZkQlFWY3NSVUZCUlR0TlFVTllMRTlCUVU4c1IwRkJSeXhuUWtGQlowSTdUVUZETVVJc1RVRkJUU3hKUVVGSkxFdEJRVXM3VFVGRFppeEpRVUZKTEUxQlFVMHNVVUZCVVR0TFFVTnVRanRKUVVORUxGVkJRVlVzUlVGQlJUdE5RVU5XTEU5QlFVOHNSMEZCUnl4WlFVRlpPMDFCUTNSQ0xFMUJRVTBzU1VGQlNTeExRVUZMTzAxQlEyWXNTVUZCU1N4TlFVRk5MRkZCUVZFN1RVRkRiRUlzUzBGQlN5eExRVUZMTEVsQlFVazdTMEZEWmp0SlFVTkVMR0ZCUVdFc1JVRkJSVHROUVVOaUxFOUJRVThzUjBGQlJ5eGxRVUZsTzAxQlEzcENMRTFCUVUwc1NVRkJTU3hMUVVGTE8wMUJRMllzU1VGQlNTeE5RVUZOTEZGQlFWRTdUVUZEYkVJc1MwRkJTeXhMUVVGTExFbEJRVWs3UzBGRFpqdEhRVU5HTzBGQlEwZ3NRMEZCUXl4RFFVRkRPenRCUVVWR0xGTkJRVk1zVDBGQlR5eEZRVUZGTEZGQlFWRXNSVUZCUlR0RlFVTXhRaXhKUVVGSkxFTkJRVU1zVVVGQlVTeExRVUZMTEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1JVRkJSU3hGUVVGRkxGRkJRVkVzUTBGQlF5eERRVUZETzBWQlEzcERMRWxCUVVrc1EwRkJReXhUUVVGVExFbEJRVWtzU1VGQlNTeERRVUZETzBGQlEzcENMRU5CUVVNN08wRkJSVVFzVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXl4aFFVRmhMRWRCUVVjc1ZVRkJWU3hOUVVGTkxFVkJRVVU3UlVGRGJFUXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhsUVVGbExFTkJRVU03UlVGRE4wSXNTVUZCU1N4UFFVRlBMRU5CUVVNN1JVRkRXaXhKUVVGSkxFOUJRVThzUzBGQlN5eEhRVUZITEVOQlFVTTdSVUZEY0VJc1NVRkJTU3hOUVVGTkxFMUJRVTBzUlVGQlJTeERRVUZETzBWQlEyNUNMRWxCUVVrc1NVRkJTU3hSUVVGUkxFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8wRkJRemRETEVWQlFVVXNTVUZCU1N4VFFVRlRMRWRCUVVjc1dVRkJXU3hEUVVGRExFOUJRVThzU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXpzN1JVRkZNME1zU1VGQlNTeE5RVUZOTEVsQlFVa3NUVUZCVFN4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFVkJRVVU3U1VGREwwSXNUMEZCVHl4TFFVRkxMRWxCUVVrc1RVRkJUU3hEUVVGRExGZEJRVmNzUTBGQlF5eE5RVUZOTEVsQlFVa3NSVUZCUlN4RFFVRkRMRVZCUVVVc1IwRkJSeXhEUVVGRExFTkJRVU03U1VGRGRrUXNVMEZCVXl4SFFVRkhMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUXpORExFZEJRVWM3TzBWQlJVUXNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhWUVVGVkxFZEJRVWNzUlVGQlJUdEpRVU14UWl4SlFVRkpMRkZCUVZFc1EwRkJRenRKUVVOaUxFbEJRVWtzUTBGQlF5eERRVUZETzBsQlEwNHNTVUZCU1N4SFFVRkhMRU5CUVVNN1FVRkRXaXhKUVVGSkxFbEJRVWtzVVVGQlVTeEhRVUZITEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU03TzBsQlJXeERMRWxCUVVrc1JVRkJSU3hKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZPMDFCUXpOQ0xFOUJRVThzUzBGQlN5eERRVUZETzBGQlEyNUNMRXRCUVVzN08wbEJSVVFzU1VGQlNTeFRRVUZUTEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVVN1RVRkRiRUlzVDBGQlR5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE8wRkJRemxDTEV0QlFVczdPMGxCUlVRc1NVRkJTU3hUUVVGVExFTkJRVU1zUjBGQlJ5eEhRVUZITEZGQlFWRXNRMEZCUXl4UFFVRlBMRWRCUVVjc1IwRkJSeXhEUVVGRExFVkJRVVU3VFVGRE0wTXNUMEZCVHl4TlFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzBGQlF6bENMRXRCUVVzN08wRkJSVXdzU1VGQlNTeFJRVUZSTEVkQlFVY3NVVUZCVVN4RFFVRkRMRkZCUVZFc1NVRkJTU3hGUVVGRkxFTkJRVU03TzBsQlJXNURMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJTeEhRVUZITEVkQlFVY3NVVUZCVVN4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFZEJRVWNzUjBGQlJ5eEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMDFCUXk5RExFbEJRVWtzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUlVGQlJUdEJRVU55UXl4UlFVRlJMRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdPMUZCUldwQ0xFOUJRVThzU1VGQlNTeERRVUZETzA5QlEySTdTMEZEUmp0QlFVTk1MRWRCUVVjc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6czdSVUZGVkN4UFFVRlBMRWRCUVVjc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNVVUZCVVN4RlFVRkZMRTFCUVUwc1EwRkJReXhEUVVGRE8wRkJRekZETEVWQlFVVXNUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhsUVVGbExFTkJRVU03TzBWQlJXaERMRTlCUVU4c1QwRkJUeXhEUVVGRE8wRkJRMnBDTEVOQlFVTXNRMEZCUXpzN1FVRkZSaXhQUVVGUExFTkJRVU1zVTBGQlV5eERRVUZETEZOQlFWTXNSMEZCUnl4VlFVRlZMRTFCUVUwc1JVRkJSVHRGUVVNNVF5eEpRVUZKTEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNc1lVRkJZU3hEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETzBWQlEzcERMRWxCUVVrc1QwRkJUeXhIUVVGSExFTkJRVU1zUTBGQlF5eEhRVUZITEVOQlFVTXNUMEZCVHl4RlFVRkZMRlZCUVZVc1NVRkJTU3hGUVVGRkxFZEJRVWNzUlVGQlJUdEpRVU5vUkN4UFFVRlBMRU5CUVVNc1MwRkJTeXhGUVVGRkxFZEJRVWNzUlVGQlJTeExRVUZMTEVWQlFVVXNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8wRkJRemRETEVkQlFVY3NRMEZCUXl4RFFVRkRPenRGUVVWSUxFbEJRVWtzVFVGQlRTeEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRk5CUVZNc1NVRkJTU3hGUVVGRkxFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRVZCUVVVN1NVRkRkRVFzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXp0TlFVTmtMRXRCUVVzc1IwRkJSeXhOUVVGTk8wMUJRMlFzUzBGQlN5eEhRVUZITEUxQlFVMDdTMEZEWml4RFFVRkRMRU5CUVVNN1FVRkRVQ3hIUVVGSE96dEZRVVZFTEU5QlFVOHNUMEZCVHl4RFFVRkRPMEZCUTJwQ0xFTkJRVU1zUTBGQlF6czdRVUZGUml4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRExFZEJRVWNzUjBGQlJ5eFZRVUZWTEVkQlFVY3NSVUZCUlN4SlFVRkpMRVZCUVVVc1MwRkJTeXhGUVVGRk8wVkJRMnhFTEVsQlFVa3NSVUZCUlN4SFFVRkhMRWxCUVVrc1JVRkJSU3hKUVVGSkxFVkJRVVU3U1VGRGJrSXNUVUZCVFN3eVFrRkJNa0lzUTBGQlF6dEJRVU4wUXl4SFFVRkhPenRGUVVWRUxFbEJRVWtzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4alFVRmpMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVU3UVVGRGVrTXNTVUZCU1N4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4SFFVRkhMRXRCUVVzc1EwRkJRenM3U1VGRmFrTXNUMEZCVHl4SlFVRkpMRU5CUVVNN1IwRkRZanRCUVVOSUxFTkJRVU1zUTBGQlF6czdRVUZGUml4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRExFZEJRVWNzUjBGQlJ5eFZRVUZWTEVkQlFVY3NSVUZCUlR0RlFVTnlReXhQUVVGUExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNSMEZCUnl4RlFVRkZMRTFCUVUwc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dEJRVU55UXl4RFFVRkRMRU5CUVVNN08wRkJSVVlzVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXl4TlFVRk5MRWRCUVVjc1ZVRkJWU3hIUVVGSExFVkJRVVU3UlVGRGVFTXNUMEZCVHl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFZEJRVWNzUlVGQlJTeE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVTXZRaXhEUVVGRExFTkJRVU03TzBGQlJVWXNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhKUVVGSkxFZEJRVWNzVlVGQlZTeEhRVUZITEVWQlFVVTdSVUZEZEVNc1QwRkJUeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVkQlFVY3NSVUZCUlN4UlFVRlJMRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRGRrTXNRMEZCUXl4RFFVRkRPenRCUVVWR0xFOUJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTXNUVUZCVFN4SFFVRkhMRlZCUVZVc1IwRkJSeXhGUVVGRk8wVkJRM2hETEU5QlFVOHNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhIUVVGSExFVkJRVVVzVVVGQlVTeEZRVUZGTEV0QlFVc3NRMEZCUXl4RFFVRkRPMEZCUTNoRExFTkJRVU1zUTBGQlF6czdRVUZGUml4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRExGZEJRVmNzUjBGQlJ5eFZRVUZWTEVkQlFVY3NSVUZCUlR0QlFVTXZReXhGUVVGRkxFbEJRVWtzVVVGQlVTeEhRVUZITEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU03TzBWQlJXeERMRWxCUVVrc1JVRkJSU3hSUVVGUkxFVkJRVVU3U1VGRFpDeFBRVUZQTEV0QlFVc3NRMEZCUXp0QlFVTnFRaXhIUVVGSE96dEZRVVZFTEU5QlFVOHNSVUZCUlN4UlFVRlJMRU5CUVVNc1RVRkJUU3hKUVVGSkxFVkJRVVVzVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXp0QlFVTTVReXhEUVVGRExFTkJRVU03TzBGQlJVWXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSenRGUVVObUxGVkJRVlVzUlVGQlJTeFZRVUZWTEVOQlFVTXNVVUZCVVR0RlFVTXZRaXhQUVVGUExFVkJRVVVzVDBGQlR6dERRVU5xUWl4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpWENKMWMyVWdjM1J5YVdOMFhDSTdYRzVjYm5aaGNpQmZJQ0FnSUNBZ0lDQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbmRXNWtaWEp6WTI5eVpTY3BPMXh1ZG1GeUlHUmhkR1ZmYldGMFkyaGxjbk1nUFNCYkoyUmhlU2NzSUNka1lYUmxKMTA3WEc1MllYSWdaWE5qWVhCbFVtVm5aWGdnSUNBOUlISmxjWFZwY21Vb0p5NHVMeTR1TDNWMGFXeHpMMlZ6WTJGd1pWOXlaV2RsZUNjcE8xeHVkbUZ5SUdSbFptbHVhWFJwYjI0N1hHNWNibVJsWm1sdWFYUnBiMjRnUFNCN1hHNGdJR055YVhSbGNtbGhPaUI3WEc0Z0lDQWdkMlZzYkRvZ2UxeHVJQ0FnSUNBZ1pHbHpjR3hoZVRvZ0lDZFhaV3hzSUc1aGJXVW5MRnh1SUNBZ0lDQWdiRzlqYTJWa09pQWdJR1poYkhObExGeHVJQ0FnSUNBZ2RtRnNkV1U2SUNBZ0lHNTFiR3dzWEc0Z0lDQWdJQ0IwZVhCbE9pQWdJQ0FnSjNOMGNtbHVaeWNzWEc0Z0lDQWdJQ0J1WldkaGRHVTZJQ0FnWm1Gc2MyVmNiaUFnSUNCOUxGeHVJQ0FnSUhKbGNHOXlkR1Z5T2lCN1hHNGdJQ0FnSUNCa2FYTndiR0Y1T2lBZ0oxSmxjRzl5ZEdWa0lHSjVKeXhjYmlBZ0lDQWdJR3h2WTJ0bFpEb2dJQ0JtWVd4elpTeGNiaUFnSUNBZ0lIWmhiSFZsT2lBZ0lDQnVkV3hzTEZ4dUlDQWdJQ0FnZEhsd1pUb2dJQ0FnSUNkemRISnBibWNuTEZ4dUlDQWdJQ0FnYm1WbllYUmxPaUFnSUdaaGJITmxYRzRnSUNBZ2ZTeGNiaUFnSUNCeVpYQnZjblJsWkRvZ2UxeHVJQ0FnSUNBZ1pHbHpjR3hoZVRvZ0lDZFNaWEJ2Y25SbFpDQnZiaWNzWEc0Z0lDQWdJQ0J0WVhSamFHVnljem9nWkdGMFpWOXRZWFJqYUdWeWN5eGNiaUFnSUNBZ0lHeHZZMnRsWkRvZ0lDQm1ZV3h6WlN4Y2JpQWdJQ0FnSUhaaGJIVmxPaUFnSUNCdWRXeHNMRnh1SUNBZ0lDQWdkSGx3WlRvZ0lDQWdJQ2RrWVhrbkxGeHVJQ0FnSUNBZ2JtVm5ZWFJsT2lBZ0lHWmhiSE5sWEc0Z0lDQWdmU3hjYmlBZ0lDQnlaWEJ2Y25SbFpGOWlaWFIzWldWdU9pQjdYRzRnSUNBZ0lDQmthWE53YkdGNU9pQWdKMUpsY0c5eWRHVmtJR0psZEhkbFpXNG5MRnh1SUNBZ0lDQWdiV0YwWTJobGNuTTZJR1JoZEdWZmJXRjBZMmhsY25Nc1hHNGdJQ0FnSUNCc2IyTnJaV1E2SUNBZ1ptRnNjMlVzWEc0Z0lDQWdJQ0IyWVd4MVpUb2dJQ0FnVzEwc1hHNGdJQ0FnSUNCMGVYQmxPaUFnSUNBZ0oyUmhkR1Z5WVc1blpTZGNiaUFnSUNCOUxGeHVJQ0FnSUhKbGNHOXlkR1ZrWDJkME9pQjdYRzRnSUNBZ0lDQmthWE53YkdGNU9pQWdKMUpsY0c5eWRHVmtJR0ZtZEdWeUp5eGNiaUFnSUNBZ0lHMWhkR05vWlhKek9pQmtZWFJsWDIxaGRHTm9aWEp6TEZ4dUlDQWdJQ0FnYkc5amEyVmtPaUFnSUdaaGJITmxMRnh1SUNBZ0lDQWdkbUZzZFdVNklDQWdJRzUxYkd3c1hHNGdJQ0FnSUNCMGVYQmxPaUFnSUNBZ0oyUmhlU2RjYmlBZ0lDQjlMRnh1SUNBZ0lISmxjRzl5ZEdWa1gyeDBPaUI3WEc0Z0lDQWdJQ0JrYVhOd2JHRjVPaUFnSjFKbGNHOXlkR1ZrSUdKbFptOXlaU2NzWEc0Z0lDQWdJQ0J0WVhSamFHVnljem9nWkdGMFpWOXRZWFJqYUdWeWN5eGNiaUFnSUNBZ0lHeHZZMnRsWkRvZ0lDQm1ZV3h6WlN4Y2JpQWdJQ0FnSUhaaGJIVmxPaUFnSUNCdWRXeHNMRnh1SUNBZ0lDQWdkSGx3WlRvZ0lDQWdJQ2RrWVhrblhHNGdJQ0FnZlN4Y2JpQWdJQ0IxY0dSaGRHVmtPaUI3WEc0Z0lDQWdJQ0JrYVhOd2JHRjVPaUFnSjFWd1pHRjBaV1FnYjI0bkxGeHVJQ0FnSUNBZ2JXRjBZMmhsY25NNklHUmhkR1ZmYldGMFkyaGxjbk1zWEc0Z0lDQWdJQ0JzYjJOclpXUTZJQ0FnWm1Gc2MyVXNYRzRnSUNBZ0lDQjJZV3gxWlRvZ0lDQWdiblZzYkN4Y2JpQWdJQ0FnSUhSNWNHVTZJQ0FnSUNBblpHRjVKeXhjYmlBZ0lDQWdJRzVsWjJGMFpUb2dJQ0JtWVd4elpWeHVJQ0FnSUgwc1hHNGdJQ0FnZFhCa1lYUmxaRjlpWlhSM1pXVnVPaUI3WEc0Z0lDQWdJQ0JrYVhOd2JHRjVPaUFnSjFWd1pHRjBaV1FnWW1WMGQyVmxiaWNzWEc0Z0lDQWdJQ0J0WVhSamFHVnljem9nWkdGMFpWOXRZWFJqYUdWeWN5eGNiaUFnSUNBZ0lHeHZZMnRsWkRvZ0lDQm1ZV3h6WlN4Y2JpQWdJQ0FnSUhaaGJIVmxPaUFnSUNCYlhTeGNiaUFnSUNBZ0lIUjVjR1U2SUNBZ0lDQW5aR0YwWlhKaGJtZGxKMXh1SUNBZ0lIMHNYRzRnSUNBZ2RYQmtZWFJsWkY5bmREb2dlMXh1SUNBZ0lDQWdaR2x6Y0d4aGVUb2dJQ2RWY0dSaGRHVmtJR0ZtZEdWeUp5eGNiaUFnSUNBZ0lHMWhkR05vWlhKek9pQmtZWFJsWDIxaGRHTm9aWEp6TEZ4dUlDQWdJQ0FnYkc5amEyVmtPaUFnSUdaaGJITmxMRnh1SUNBZ0lDQWdkbUZzZFdVNklDQWdJRzUxYkd3c1hHNGdJQ0FnSUNCMGVYQmxPaUFnSUNBZ0oyUmhlU2RjYmlBZ0lDQjlMRnh1SUNBZ0lIVndaR0YwWldSZmJIUTZJSHRjYmlBZ0lDQWdJR1JwYzNCc1lYazZJQ0FuVlhCa1lYUmxaQ0JpWldadmNtVW5MRnh1SUNBZ0lDQWdiV0YwWTJobGNuTTZJR1JoZEdWZmJXRjBZMmhsY25Nc1hHNGdJQ0FnSUNCc2IyTnJaV1E2SUNBZ1ptRnNjMlVzWEc0Z0lDQWdJQ0IyWVd4MVpUb2dJQ0FnYm5Wc2JDeGNiaUFnSUNBZ0lIUjVjR1U2SUNBZ0lDQW5aR0Y1SjF4dUlDQWdJSDBzWEc0Z0lDQWdkR0ZuY3pvZ2UxeHVJQ0FnSUNBZ1pHbHpjR3hoZVRvZ0lDZFVZV2R6Snl4Y2JpQWdJQ0FnSUd4dlkydGxaRG9nSUNCbVlXeHpaU3hjYmlBZ0lDQWdJSFI1Y0dVNklDQWdJQ0FuZEdGbkp5eGNiaUFnSUNBZ0lHNWxaMkYwWlRvZ0lDQm1ZV3h6WlN4Y2JpQWdJQ0FnSUcxMWJIUnBPaUFnSUNCMGNuVmxYRzRnSUNBZ2ZTeGNiaUFnSUNCd2NtbHZjbWwwZVRvZ2UxeHVJQ0FnSUNBZ1pHbHpjR3hoZVRvZ0lDZFFjbWx2Y21sMGVTY3NYRzRnSUNBZ0lDQnNiMk5yWldRNklDQWdabUZzYzJVc1hHNGdJQ0FnSUNCMGVYQmxPaUFnSUNBZ0oyNTFiV0psY2ljc1hHNGdJQ0FnSUNCdVpXZGhkR1U2SUNBZ1ptRnNjMlZjYmlBZ0lDQjlMRnh1SUNBZ0lIQnlhVzl5YVhSNVgyZDBPaUI3WEc0Z0lDQWdJQ0JrYVhOd2JHRjVPaUFnSjFCeWFXOXlhWFI1SUdGaWIzWmxKeXhjYmlBZ0lDQWdJR3h2WTJ0bFpEb2dJQ0JtWVd4elpTeGNiaUFnSUNBZ0lIUjVjR1U2SUNBZ0lDQW5iblZ0WW1WeUoxeHVJQ0FnSUgwc1hHNGdJQ0FnY0hKcGIzSnBkSGxmYkhRNklIdGNiaUFnSUNBZ0lHUnBjM0JzWVhrNklDQW5VSEpwYjNKcGRIa2dZbVZzYjNjbkxGeHVJQ0FnSUNBZ2JHOWphMlZrT2lBZ0lHWmhiSE5sTEZ4dUlDQWdJQ0FnZEhsd1pUb2dJQ0FnSUNkdWRXMWlaWEluWEc0Z0lDQWdmU3hjYmlBZ0lDQnBjM04xWlY5MGVYQmxPaUI3WEc0Z0lDQWdJQ0JrYVhOd2JHRjVPaUFnSjBsemMzVmxJSFI1Y0dVbkxGeHVJQ0FnSUNBZ2JHOWphMlZrT2lBZ0lHWmhiSE5sTEZ4dUlDQWdJQ0FnZEhsd1pUb2dJQ0FnSUNkemRISnBibWNuTEZ4dUlDQWdJQ0FnYlhWc2RHazZJQ0FnSUhSeWRXVmNiaUFnSUNCOUxGeHVJQ0FnSUdsemMzVmxYM04xWW5SNWNHVTZJSHRjYmlBZ0lDQWdJR1JwYzNCc1lYazZJQ0FuU1hOemRXVWdjM1ZpZEhsd1pTY3NYRzRnSUNBZ0lDQnNiMk5yWldRNklDQWdabUZzYzJVc1hHNGdJQ0FnSUNCMGVYQmxPaUFnSUNBZ0ozTjBjbWx1Wnljc1hHNGdJQ0FnSUNCdGRXeDBhVG9nSUNBZ2RISjFaVnh1SUNBZ0lIMWNiaUFnZlZ4dWZUdGNibHh1Wm5WdVkzUnBiMjRnUW5WcGJHUmxjaUFvWTNKcGRHVnlhV0VwSUh0Y2JpQWdkR2hwY3k1amNtbDBaWEpwWVNBZ0lEMGdYeTVsZUhSbGJtUW9lMzBzSUdOeWFYUmxjbWxoS1R0Y2JpQWdkR2hwY3k1bWNtVmxYM1JsZUhRZ0lEMGdiblZzYkR0Y2JuMWNibHh1UW5WcGJHUmxjaTV3Y205MGIzUjVjR1V1YldGMFkyaERjbWwwWlhKcFlTQTlJR1oxYm1OMGFXOXVJQ2h6ZEhKcGJtY3BJSHRjYmlBZ1kyOXVjMjlzWlM1MGFXMWxLQ2R0WVhSamFFTnlhWFJsY21saEp5bGNiaUFnZG1GeUlISmxjM1ZzZEhNN1hHNGdJSFpoY2lCd1lYUjBaWEp1SUNBZ1BTQXZMaTg3WEc0Z0lIWmhjaUIyWVd4MVpYTWdJQ0FnUFNCYlhUdGNiaUFnZG1GeUlHdGxlWE1nSUNBZ0lDQTlJRTlpYW1WamRDNXJaWGx6S0hSb2FYTXVZM0pwZEdWeWFXRXBPMXh1SUNCMllYSWdkSEoxZEdoVVpYTjBJRDBnWm5WdVkzUnBiMjRnS0NrZ2UzSmxkSFZ5YmlCMGNuVmxPMzA3WEc1Y2JpQWdhV1lnS0hOMGNtbHVaeUFtSmlCemRISnBibWN1YkdWdVozUm9JRDRnTUNrZ2UxeHVJQ0FnSUhCaGRIUmxjbTRnSUNBOUlHNWxkeUJTWldkRmVIQW9aWE5qWVhCbFVtVm5aWGdvYzNSeWFXNW5JSHg4SUNjbktTd2dKMmtuS1R0Y2JpQWdJQ0IwY25WMGFGUmxjM1FnUFNCd1lYUjBaWEp1TG5SbGMzUXVZbWx1WkNod1lYUjBaWEp1S1R0Y2JpQWdmVnh1WEc0Z0lHdGxlWE11Wm05eVJXRmphQ2htZFc1amRHbHZiaUFvYTJWNUtTQjdYRzRnSUNBZ2RtRnlJRzFoZEdOb1pYSnpPMXh1SUNBZ0lIWmhjaUJwTzF4dUlDQWdJSFpoY2lCc1pXNDdYRzRnSUNBZ2RtRnlJR055YVhSbGNtbGhJRDBnZEdocGN5NWpjbWwwWlhKcFlWdHJaWGxkTzF4dVhHNGdJQ0FnYVdZZ0tDRWdkR2hwY3k1cGMwRjJZV2xzWVdKc1pTaHJaWGtwS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVTdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLSFJ5ZFhSb1ZHVnpkQ2hyWlhrcEtTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2RtRnNkV1Z6TG5CMWMyZ29hMlY1S1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb2RISjFkR2hVWlhOMEtDZGJKeUFySUdOeWFYUmxjbWxoTG1ScGMzQnNZWGtnS3lBblhTY3BLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkbUZzZFdWekxuQjFjMmdvYTJWNUtUdGNiaUFnSUNCOVhHNWNiaUFnSUNCdFlYUmphR1Z5Y3lBOUlHTnlhWFJsY21saExtMWhkR05vWlhKeklIeDhJRnRkTzF4dVhHNGdJQ0FnWm05eUlDaHBJRDBnTUN3Z2JHVnVJRDBnYldGMFkyaGxjbk11YkdWdVozUm9PeUJwSUR3Z2JHVnVPeUJwS3lzcElIdGNiaUFnSUNBZ0lHbG1JQ2h3WVhSMFpYSnVMblJsYzNRb2JXRjBZMmhsY25OYmFWMHBLU0I3WEc0Z0lDQWdJQ0FnSUhaaGJIVmxjeTV3ZFhOb0tHdGxlU2s3WEc1Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVTdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVJQ0I5TENCMGFHbHpLVHRjYmx4dUlDQnlaWE4xYkhSeklEMGdYeTV3YVdOcktIUm9hWE11WTNKcGRHVnlhV0VzSUhaaGJIVmxjeWs3WEc0Z0lHTnZibk52YkdVdWRHbHRaVVZ1WkNnbmJXRjBZMmhEY21sMFpYSnBZU2NwWEc1Y2JpQWdjbVYwZFhKdUlISmxjM1ZzZEhNN1hHNTlPMXh1WEc1Q2RXbHNaR1Z5TG5CeWIzUnZkSGx3WlM1MGIwOXdkR2x2Ym5NZ1BTQm1kVzVqZEdsdmJpQW9jM1J5YVc1bktTQjdYRzRnSUhaaGNpQnlaWE4xYkhSeklEMGdkR2hwY3k1dFlYUmphRU55YVhSbGNtbGhLSE4wY21sdVp5azdYRzRnSUhaaGNpQnZjSFJwYjI1eklEMGdYeTV0WVhBb2NtVnpkV3gwY3l3Z1puVnVZM1JwYjI0Z0tHbDBaVzBzSUd0bGVTa2dlMXh1SUNBZ0lISmxkSFZ5YmlCN2RtRnNkV1U2SUd0bGVTd2diR0ZpWld3NklHbDBaVzB1WkdsemNHeGhlWDA3WEc0Z0lIMHBPMXh1WEc0Z0lHbG1JQ2h6ZEhKcGJtY2dKaVlnSVNCMGFHbHpMbVp5WldWZmRHVjRkQ0FtSmlBaElDOWVYRnhiTHk1MFpYTjBLSE4wY21sdVp5a3BJSHRjYmlBZ0lDQnZjSFJwYjI1ekxuVnVjMmhwWm5Rb2UxeHVJQ0FnSUNBZ2JHRmlaV3c2SUNCemRISnBibWNzWEc0Z0lDQWdJQ0IyWVd4MVpUb2dJSE4wY21sdVoxeHVJQ0FnSUgwcE8xeHVJQ0I5WEc1Y2JpQWdjbVYwZFhKdUlHOXdkR2x2Ym5NN1hHNTlPMXh1WEc1Q2RXbHNaR1Z5TG5CeWIzUnZkSGx3WlM1elpYUWdQU0JtZFc1amRHbHZiaUFvYTJWNUxDQndjbTl3TENCMllXeDFaU2tnZTF4dUlDQnBaaUFvSVNCclpYa2dmSHdnSVNCd2NtOXdLU0I3WEc0Z0lDQWdkR2h5YjNjZ0oydGxlU0JoYm1RZ2NISnZjQ0JoY21VZ2NtVnhkV2x5WldRbk8xeHVJQ0I5WEc1Y2JpQWdhV1lnS0hSb2FYTXVZM0pwZEdWeWFXRXVhR0Z6VDNkdVVISnZjR1Z5ZEhrb2EyVjVLU2tnZTF4dUlDQWdJSFJvYVhNdVkzSnBkR1Z5YVdGYmEyVjVYVnR3Y205d1hTQTlJSFpoYkhWbE8xeHVYRzRnSUNBZ2NtVjBkWEp1SUhSeWRXVTdYRzRnSUgxY2JuMDdYRzVjYmtKMWFXeGtaWEl1Y0hKdmRHOTBlWEJsTG5WelpTQTlJR1oxYm1OMGFXOXVJQ2hyWlhrcElIdGNiaUFnY21WMGRYSnVJSFJvYVhNdWMyVjBLR3RsZVN3Z0ozVnpaV1FuTENCMGNuVmxLVHRjYm4wN1hHNWNia0oxYVd4a1pYSXVjSEp2ZEc5MGVYQmxMbkpsWm5WdVpDQTlJR1oxYm1OMGFXOXVJQ2hyWlhrcElIdGNiaUFnY21WMGRYSnVJSFJvYVhNdWMyVjBLR3RsZVN3Z0ozVnpaV1FuS1R0Y2JuMDdYRzVjYmtKMWFXeGtaWEl1Y0hKdmRHOTBlWEJsTG14dlkyc2dQU0JtZFc1amRHbHZiaUFvYTJWNUtTQjdYRzRnSUhKbGRIVnliaUIwYUdsekxuTmxkQ2hyWlhrc0lDZHNiMk5yWldRbkxDQjBjblZsS1R0Y2JuMDdYRzVjYmtKMWFXeGtaWEl1Y0hKdmRHOTBlWEJsTG5WdWJHOWpheUE5SUdaMWJtTjBhVzl1SUNoclpYa3BJSHRjYmlBZ2NtVjBkWEp1SUhSb2FYTXVjMlYwS0d0bGVTd2dKMnh2WTJ0bFpDY3NJR1poYkhObEtUdGNibjA3WEc1Y2JrSjFhV3hrWlhJdWNISnZkRzkwZVhCbExtbHpRWFpoYVd4aFlteGxJRDBnWm5WdVkzUnBiMjRnS0d0bGVTa2dlMXh1SUNCMllYSWdZM0pwZEdWeWFXRWdQU0IwYUdsekxtTnlhWFJsY21saFcydGxlVjA3WEc1Y2JpQWdhV1lnS0NFZ1kzSnBkR1Z5YVdFcElIdGNiaUFnSUNCeVpYUjFjbTRnWm1Gc2MyVTdYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdJU0JqY21sMFpYSnBZUzVzYjJOclpXUWdKaVlnSVNCamNtbDBaWEpwWVM1MWMyVmtPMXh1ZlR0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQjdYRzRnSUdSbFptbHVhWFJwYjI0NklHUmxabWx1YVhScGIyNHVZM0pwZEdWeWFXRXNYRzRnSUVKMWFXeGtaWEk2SUVKMWFXeGtaWEpjYm4wN1hHNGlYWDA9IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBCYWNrYm9uZSAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyIE1vZGVsICAgICA9IHJlcXVpcmUoJy4vaGVhZGluZ19tb2RlbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgbW9kZWw6IE1vZGVsLFxuICBsaW5rU2libGluZ3M6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVhY2goZnVuY3Rpb24gKGhlYWRlciwgaW5kZXgpIHtcbiAgICAgIGhlYWRlci5wcmV2ID0gdGhpcy5hdChpbmRleCAtIDEpO1xuICAgICAgaGVhZGVyLm5leHQgPSB0aGlzLmF0KGluZGV4ICsgMSk7XG4gICAgfSwgdGhpcyk7XG4gIH0sXG4gIHJlZ2lzdGVyV2l0aERpc3BhdGNoZXI6IGZ1bmN0aW9uIChkaXNwYXRjaGVyKSB7XG4gICAgdGhpcy5kaXNwYXRjaF90b2tlbiA9IGRpc3BhdGhlci5yZWdpc3RlcihmdW5jdGlvbiAocGF5bG9hZCkge1xuICAgICAgY29uc29sZS5sb2cocGF5bG9hZCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfVxufSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZZMkZ6WlhNdmFHVmhaR2x1WjE5amIyeHNaV04wYVc5dUxtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEZsQlFWa3NRMEZCUXpzN1FVRkZZaXhKUVVGSkxGRkJRVkVzU1VGQlNTeFBRVUZQTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNN1FVRkRjRU1zU1VGQlNTeExRVUZMTEU5QlFVOHNUMEZCVHl4RFFVRkRMR2xDUVVGcFFpeERRVUZETEVOQlFVTTdPMEZCUlRORExFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NVVUZCVVN4RFFVRkRMRlZCUVZVc1EwRkJReXhOUVVGTkxFTkJRVU03UlVGRE1VTXNTMEZCU3l4RlFVRkZMRXRCUVVzN1JVRkRXaXhaUVVGWkxFVkJRVVVzV1VGQldUdEpRVU40UWl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExGVkJRVlVzVFVGQlRTeEZRVUZGTEV0QlFVc3NSVUZCUlR0TlFVTnFReXhOUVVGTkxFTkJRVU1zU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXl4RlFVRkZMRU5CUVVNc1MwRkJTeXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETzAxQlEycERMRTFCUVUwc1EwRkJReXhKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETEVWQlFVVXNRMEZCUXl4TFFVRkxMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU03UzBGRGJFTXNSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenRIUVVOV08wVkJRMFFzYzBKQlFYTkNMRVZCUVVVc1ZVRkJWU3hWUVVGVkxFVkJRVVU3U1VGRE5VTXNTVUZCU1N4RFFVRkRMR05CUVdNc1IwRkJSeXhUUVVGVExFTkJRVU1zVVVGQlVTeERRVUZETEZWQlFWVXNUMEZCVHl4RlFVRkZPMDFCUXpGRUxFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1MwRkRkRUlzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRenRIUVVObU8wTkJRMFlzUTBGQlF5eERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaVhDSjFjMlVnYzNSeWFXTjBYQ0k3WEc1Y2JuWmhjaUJDWVdOclltOXVaU0FnUFNCeVpYRjFhWEpsS0NkaVlXTnJZbTl1WlNjcE8xeHVkbUZ5SUUxdlpHVnNJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHZhR1ZoWkdsdVoxOXRiMlJsYkNjcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRUpoWTJ0aWIyNWxMa052Ykd4bFkzUnBiMjR1WlhoMFpXNWtLSHRjYmlBZ2JXOWtaV3c2SUUxdlpHVnNMRnh1SUNCc2FXNXJVMmxpYkdsdVozTTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IwYUdsekxtVmhZMmdvWm5WdVkzUnBiMjRnS0dobFlXUmxjaXdnYVc1a1pYZ3BJSHRjYmlBZ0lDQWdJR2hsWVdSbGNpNXdjbVYySUQwZ2RHaHBjeTVoZENocGJtUmxlQ0F0SURFcE8xeHVJQ0FnSUNBZ2FHVmhaR1Z5TG01bGVIUWdQU0IwYUdsekxtRjBLR2x1WkdWNElDc2dNU2s3WEc0Z0lDQWdmU3dnZEdocGN5azdYRzRnSUgwc1hHNGdJSEpsWjJsemRHVnlWMmwwYUVScGMzQmhkR05vWlhJNklHWjFibU4wYVc5dUlDaGthWE53WVhSamFHVnlLU0I3WEc0Z0lDQWdkR2hwY3k1a2FYTndZWFJqYUY5MGIydGxiaUE5SUdScGMzQmhkR2hsY2k1eVpXZHBjM1JsY2lobWRXNWpkR2x2YmlBb2NHRjViRzloWkNrZ2UxeHVJQ0FnSUNBZ1kyOXVjMjlzWlM1c2IyY29jR0Y1Ykc5aFpDazdYRzRnSUNBZ2ZTNWlhVzVrS0hSb2FYTXBLVHRjYmlBZ2ZWeHVmU2s3WEc0aVhYMD0iLCJ2YXIgTW9kZWw7XG52YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xuXG5Nb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gIGRlZmF1bHRzOiB7XG4gICAgZGlyZWN0aW9uOiAgbnVsbCxcbiAgICBsb2NrZWQ6ICAgICBmYWxzZSxcbiAgICBtaW5pbWFsOiAgICBmYWxzZSxcbiAgICBuYW1lOiAgICAgICBudWxsLFxuICAgIHJlc2l6YWJsZTogIGZhbHNlLFxuICAgIHNvcnRhYmxlOiAgIGZhbHNlLFxuICAgIHRpdGxlOiAgICAgIG51bGwsXG4gICAgd2lkdGg6ICAgICAgbnVsbFxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdlkyRnpaWE12YUdWaFpHbHVaMTl0YjJSbGJDNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4SlFVRkpMRXRCUVVzc1EwRkJRenRCUVVOV0xFbEJRVWtzVVVGQlVTeEhRVUZITEU5QlFVOHNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJRenM3UVVGRmJrTXNTMEZCU3l4SFFVRkhMRkZCUVZFc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETzBWQlF6VkNMRkZCUVZFc1JVRkJSVHRKUVVOU0xGTkJRVk1zUjBGQlJ5eEpRVUZKTzBsQlEyaENMRTFCUVUwc1RVRkJUU3hMUVVGTE8wbEJRMnBDTEU5QlFVOHNTMEZCU3l4TFFVRkxPMGxCUTJwQ0xFbEJRVWtzVVVGQlVTeEpRVUZKTzBsQlEyaENMRk5CUVZNc1IwRkJSeXhMUVVGTE8wbEJRMnBDTEZGQlFWRXNTVUZCU1N4TFFVRkxPMGxCUTJwQ0xFdEJRVXNzVDBGQlR5eEpRVUZKTzBsQlEyaENMRXRCUVVzc1QwRkJUeXhKUVVGSk8wZEJRMnBDTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4TFFVRkxMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SjJZWElnVFc5a1pXdzdYRzUyWVhJZ1FtRmphMkp2Ym1VZ1BTQnlaWEYxYVhKbEtDZGlZV05yWW05dVpTY3BPMXh1WEc1TmIyUmxiQ0E5SUVKaFkydGliMjVsTGsxdlpHVnNMbVY0ZEdWdVpDaDdYRzRnSUdSbFptRjFiSFJ6T2lCN1hHNGdJQ0FnWkdseVpXTjBhVzl1T2lBZ2JuVnNiQ3hjYmlBZ0lDQnNiMk5yWldRNklDQWdJQ0JtWVd4elpTeGNiaUFnSUNCdGFXNXBiV0ZzT2lBZ0lDQm1ZV3h6WlN4Y2JpQWdJQ0J1WVcxbE9pQWdJQ0FnSUNCdWRXeHNMRnh1SUNBZ0lISmxjMmw2WVdKc1pUb2dJR1poYkhObExGeHVJQ0FnSUhOdmNuUmhZbXhsT2lBZ0lHWmhiSE5sTEZ4dUlDQWdJSFJwZEd4bE9pQWdJQ0FnSUc1MWJHd3NYRzRnSUNBZ2QybGtkR2c2SUNBZ0lDQWdiblZzYkZ4dUlDQjlYRzU5S1R0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQk5iMlJsYkR0Y2JpSmRmUT09IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBJY29uV3JhcHBlcjtcbnZhciBtYXBwaW5ncztcbnZhciBfICAgICA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciBJY29uICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvaWNvbi5qc3gnKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbi8qKlxuICogQWxsb3dzIG1hcHBpbmcgYSBjYXNlIHN0YXR1cyB0byBhIHBhcnRpY3VsYXIgaWNvbiB0eXBlXG4gKi9cbm1hcHBpbmdzID0ge1xuICBhY3RpdmU6ICAgJ3BsYXktY2lyY2xlJyxcbiAgY2xvc2VkOiAgICd0aW1lcy1jaXJjbGUnLFxuICBvcGVuOiAgICAgJ2NpcmNsZS1vJyxcbiAgcmVzb2x2ZWQ6ICdjaGVjay1jaXJjbGUnXG59O1xuXG4vKipcbiAqIFdyYXBzIHRoZSBJY29uIGNvbXBvbmVudCwgc2VlIHRoYXQgY29tcG9uZW50IGZvciB1c2FnZSBleGFtcGxlc1xuICovXG5JY29uV3JhcHBlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJJY29uV3JhcHBlclwiLFxuICBtaXhpbnM6IFtSZWFjdC5hZGRvbnMuUHVyZVJlbmRlck1peGluXSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5ld1Byb3BzID0gXy5leHRlbmQoe30sIHRoaXMucHJvcHMpO1xuXG4gICAgbmV3UHJvcHMudHlwZSA9IG1hcHBpbmdzW25ld1Byb3BzLnR5cGVdIHx8IG5ld1Byb3BzLnR5cGU7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCBSZWFjdC5fX3NwcmVhZCh7fSwgIG5ld1Byb3BzKSlcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBJY29uV3JhcHBlcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdlkyRnpaWE12YVdOdmJsOTNjbUZ3Y0dWeUxtcHplQ0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVRzN1FVRkZRU3hIUVVGSE96dEJRVVZJTEVsQlFVa3NWMEZCVnl4RFFVRkRPMEZCUTJoQ0xFbEJRVWtzVVVGQlVTeERRVUZETzBGQlEySXNTVUZCU1N4RFFVRkRMRTlCUVU4c1QwRkJUeXhEUVVGRExGbEJRVmtzUTBGQlF5eERRVUZETzBGQlEyeERMRWxCUVVrc1NVRkJTU3hKUVVGSkxFOUJRVThzUTBGQlF5d3lRa0ZCTWtJc1EwRkJReXhEUVVGRE8wRkJRMnBFTEVsQlFVa3NTMEZCU3l4SFFVRkhMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6czdRVUZGTjBJN08wZEJSVWM3UVVGRFNDeFJRVUZSTEVkQlFVYzdSVUZEVkN4TlFVRk5MRWxCUVVrc1lVRkJZVHRGUVVOMlFpeE5RVUZOTEVsQlFVa3NZMEZCWXp0RlFVTjRRaXhKUVVGSkxFMUJRVTBzVlVGQlZUdEZRVU53UWl4UlFVRlJMRVZCUVVVc1kwRkJZenRCUVVNeFFpeERRVUZETEVOQlFVTTdPMEZCUlVZN08wZEJSVWM3UVVGRFNDeHBRMEZCYVVNc01rSkJRVUU3UlVGREwwSXNUVUZCVFN4RlFVRkZMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF5eGxRVUZsTEVOQlFVTTdSVUZEZEVNc1RVRkJUU3hGUVVGRkxGbEJRVms3UVVGRGRFSXNTVUZCU1N4SlFVRkpMRkZCUVZFc1IwRkJSeXhEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEVWQlFVVXNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03TzBGQlJUVkRMRWxCUVVrc1VVRkJVU3hEUVVGRExFbEJRVWtzUjBGQlJ5eFJRVUZSTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxGRkJRVkVzUTBGQlF5eEpRVUZKTEVOQlFVTTdPMGxCUlhwRU8wMUJRMFVzYjBKQlFVTXNTVUZCU1N4RlFVRkJMR2RDUVVGQkxFZEJRVUVzUTBGQlJTeEhRVUZITEZGQlFWTXNRMEZCUVN4RFFVRkhMRU5CUVVFN1RVRkRkRUk3UjBGRFNEdEJRVU5JTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NWMEZCVnl4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlvcVhHNGdLaUJBYW5ONElGSmxZV04wTGtSUFRWeHVJQ292WEc1Y2JuWmhjaUJKWTI5dVYzSmhjSEJsY2p0Y2JuWmhjaUJ0WVhCd2FXNW5jenRjYm5aaGNpQmZJQ0FnSUNBOUlISmxjWFZwY21Vb0ozVnVaR1Z5YzJOdmNtVW5LVHRjYm5aaGNpQkpZMjl1SUNBOUlISmxjWFZwY21Vb0p5NHVMeTR1TDJOdmJYQnZibVZ1ZEhNdmFXTnZiaTVxYzNnbktUdGNiblpoY2lCU1pXRmpkQ0E5SUhKbGNYVnBjbVVvSjNKbFlXTjBKeWs3WEc1Y2JpOHFLbHh1SUNvZ1FXeHNiM2R6SUcxaGNIQnBibWNnWVNCallYTmxJSE4wWVhSMWN5QjBieUJoSUhCaGNuUnBZM1ZzWVhJZ2FXTnZiaUIwZVhCbFhHNGdLaTljYm0xaGNIQnBibWR6SUQwZ2UxeHVJQ0JoWTNScGRtVTZJQ0FnSjNCc1lYa3RZMmx5WTJ4bEp5eGNiaUFnWTJ4dmMyVmtPaUFnSUNkMGFXMWxjeTFqYVhKamJHVW5MRnh1SUNCdmNHVnVPaUFnSUNBZ0oyTnBjbU5zWlMxdkp5eGNiaUFnY21WemIyeDJaV1E2SUNkamFHVmpheTFqYVhKamJHVW5YRzU5TzF4dVhHNHZLaXBjYmlBcUlGZHlZWEJ6SUhSb1pTQkpZMjl1SUdOdmJYQnZibVZ1ZEN3Z2MyVmxJSFJvWVhRZ1kyOXRjRzl1Wlc1MElHWnZjaUIxYzJGblpTQmxlR0Z0Y0d4bGMxeHVJQ292WEc1SlkyOXVWM0poY0hCbGNpQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ2JXbDRhVzV6T2lCYlVtVmhZM1F1WVdSa2IyNXpMbEIxY21WU1pXNWtaWEpOYVhocGJsMHNYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQnVaWGRRY205d2N5QTlJRjh1WlhoMFpXNWtLSHQ5TENCMGFHbHpMbkJ5YjNCektUdGNibHh1SUNBZ0lHNWxkMUJ5YjNCekxuUjVjR1VnUFNCdFlYQndhVzVuYzF0dVpYZFFjbTl3Y3k1MGVYQmxYU0I4ZkNCdVpYZFFjbTl3Y3k1MGVYQmxPMXh1WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeEpZMjl1SUhzdUxpNXVaWGRRY205d2MzMGdMejVjYmlBZ0lDQXBPMXh1SUNCOVhHNTlLVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCSlkyOXVWM0poY0hCbGNqdGNiaUpkZlE9PSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBkaXNwYXRjaGVyOiAgICAgICByZXF1aXJlKCcuL2Rpc3BhdGNoZXInKSxcbiAgQ2FzZU1vZGVsOiAgICAgICAgcmVxdWlyZSgnLi9jYXNlX21vZGVsJyksXG4gIENhc2VDb2xsZWN0aW9uOiAgIHJlcXVpcmUoJy4vY2FzZV9jb2xsZWN0aW9uJyksXG4gIExpc3RWaWV3OiAgICAgICAgIHJlcXVpcmUoJy4vbGlzdF92aWV3LmpzeCcpLFxuICBsaXN0X3ZpZXdfc3RvcmU6ICByZXF1aXJlKCcuL2xpc3Rfdmlld19zdG9yZScpXG59O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WTJGelpYTXZhVzVrWlhndWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnp0RlFVTm1MRlZCUVZVc1VVRkJVU3hQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETzBWQlEzcERMRk5CUVZNc1UwRkJVeXhQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETzBWQlEzcERMR05CUVdNc1NVRkJTU3hQUVVGUExFTkJRVU1zYlVKQlFXMUNMRU5CUVVNN1JVRkRPVU1zVVVGQlVTeFZRVUZWTEU5QlFVOHNRMEZCUXl4cFFrRkJhVUlzUTBGQlF6dEZRVU0xUXl4bFFVRmxMRWRCUVVjc1QwRkJUeXhEUVVGRExHMUNRVUZ0UWl4RFFVRkRPME5CUXk5RExFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKdGIyUjFiR1V1Wlhod2IzSjBjeUE5SUh0Y2JpQWdaR2x6Y0dGMFkyaGxjam9nSUNBZ0lDQWdjbVZ4ZFdseVpTZ25MaTlrYVhOd1lYUmphR1Z5Snlrc1hHNGdJRU5oYzJWTmIyUmxiRG9nSUNBZ0lDQWdJSEpsY1hWcGNtVW9KeTR2WTJGelpWOXRiMlJsYkNjcExGeHVJQ0JEWVhObFEyOXNiR1ZqZEdsdmJqb2dJQ0J5WlhGMWFYSmxLQ2N1TDJOaGMyVmZZMjlzYkdWamRHbHZiaWNwTEZ4dUlDQk1hWE4wVm1sbGR6b2dJQ0FnSUNBZ0lDQnlaWEYxYVhKbEtDY3VMMnhwYzNSZmRtbGxkeTVxYzNnbktTeGNiaUFnYkdsemRGOTJhV1YzWDNOMGIzSmxPaUFnY21WeGRXbHlaU2duTGk5c2FYTjBYM1pwWlhkZmMzUnZjbVVuS1Z4dWZUdGNiaUpkZlE9PSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgTGlzdEZpbHRlcjtcbnZhciBSZWFjdCAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgQmFja2JvbmUgICAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyIEljb24gICAgICAgID0gcmVxdWlyZSgnLi9pY29uX3dyYXBwZXIuanN4Jyk7XG52YXIgRHJvcGRvd24gICAgPSByZXF1aXJlKCcuL2Ryb3Bkb3duLmpzeCcpO1xudmFyIEZpbHRlckJveCAgID0gcmVxdWlyZSgnLi9maWx0ZXJfYm94LmpzeCcpO1xudmFyIGNyaXRlcmlhICAgID0gcmVxdWlyZSgnLi9maWx0ZXJfYm94X2RlZmluaXRpb24nKTtcblxuTGlzdEZpbHRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJMaXN0RmlsdGVyXCIsXG4gIHByb3BUeXBlczoge1xuICAgIHN0b3JlOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihCYWNrYm9uZS5Nb2RlbCkuaXNSZXF1aXJlZFxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2hvaWNlcztcbiAgICB2YXIgYnVpbGRlciA9IG5ldyBjcml0ZXJpYS5CdWlsZGVyKGNyaXRlcmlhLmRlZmluaXRpb24pO1xuXG4gICAgY2hvaWNlcyA9IFtcbiAgICAgIHt0ZXh0OiAnTmV3IGZyb20gY3VycmVudC4uLid9LFxuICAgICAge3RleHQ6ICdOZXcgZnJvbSBibGFuay4uLid9LFxuICAgICAge3NlcGFyYXRvcjogdHJ1ZX0sXG4gICAgICB7dGV4dDogJ05ld2VzdCBjYXNlcyd9LFxuICAgICAge3RleHQ6ICdDYXNlcyBvcGVuZWQgYnkgbWUnfSxcbiAgICAgIHt0ZXh0OiAnQ2xvc2VkIGNhc2VzJ31cbiAgICBdO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJjYXB0aW9uXCIsIHtjbGFzc05hbWU6IFwibGlzdC1maWx0ZXJcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZmlsdGVyLXNlbGVjdGlvblwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIHtjbGFzc05hbWU6IFwicHVsbC1yaWdodCBpbmxpbmVcIn0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIFwiUXVpY2sgZmlsdGVyczpcIiksIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERyb3Bkb3duLCB7c2VsZWN0ZWQ6IFwiQWN0aXZlIGNhc2VzXCIsIGFsaWduOiBcInJpZ2h0XCIsIGNob2ljZXM6IGNob2ljZXN9KVxuICAgICAgICAgICAgKSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwge2NsYXNzTmFtZTogXCJpY29uLWdyb3VwXCJ9LCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge29uQ2xpY2s6IHRoaXMuX3NhdmVGaWx0ZXJ9LCBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiBcInNhdmVcIiwgc2l6ZTogXCJsZ1wifSkpLCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge29uQ2xpY2s6IHRoaXMuX2RlbGV0ZUZpbHRlcn0sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IFwidHJhc2gtb1wiLCBzaXplOiBcImxnXCJ9KSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRmlsdGVyQm94LCB7Y3JpdGVyaWE6IGJ1aWxkZXJ9KVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3RGaWx0ZXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZZMkZ6WlhNdmJHbHpkRjltYVd4MFpYSXVhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRVVZCTEVkQlFVYzdPMEZCUlVnc1NVRkJTU3hWUVVGVkxFTkJRVU03UVVGRFppeEpRVUZKTEV0QlFVc3NVMEZCVXl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRGJrTXNTVUZCU1N4UlFVRlJMRTFCUVUwc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETzBGQlEzUkRMRWxCUVVrc1NVRkJTU3hWUVVGVkxFOUJRVThzUTBGQlF5eHZRa0ZCYjBJc1EwRkJReXhEUVVGRE8wRkJRMmhFTEVsQlFVa3NVVUZCVVN4TlFVRk5MRTlCUVU4c1EwRkJReXhuUWtGQlowSXNRMEZCUXl4RFFVRkRPMEZCUXpWRExFbEJRVWtzVTBGQlV5eExRVUZMTEU5QlFVOHNRMEZCUXl4clFrRkJhMElzUTBGQlF5eERRVUZETzBGQlF6bERMRWxCUVVrc1VVRkJVU3hOUVVGTkxFOUJRVThzUTBGQlF5eDVRa0ZCZVVJc1EwRkJReXhEUVVGRE96dEJRVVZ5UkN4blEwRkJaME1zTUVKQlFVRTdSVUZET1VJc1UwRkJVeXhGUVVGRk8wbEJRMVFzUzBGQlN5eEZRVUZGTEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1ZVRkJWU3hEUVVGRExGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4VlFVRlZPMGRCUXpkRU8wVkJRMFFzVFVGQlRTeEZRVUZGTEZsQlFWazdTVUZEYkVJc1NVRkJTU3hQUVVGUExFTkJRVU03UVVGRGFFSXNTVUZCU1N4SlFVRkpMRTlCUVU4c1IwRkJSeXhKUVVGSkxGRkJRVkVzUTBGQlF5eFBRVUZQTEVOQlFVTXNVVUZCVVN4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRE96dEpRVVY0UkN4UFFVRlBMRWRCUVVjN1RVRkRVaXhEUVVGRExFbEJRVWtzUlVGQlJTeHhRa0ZCY1VJc1EwRkJRenROUVVNM1FpeERRVUZETEVsQlFVa3NSVUZCUlN4dFFrRkJiVUlzUTBGQlF6dE5RVU16UWl4RFFVRkRMRk5CUVZNc1JVRkJSU3hKUVVGSkxFTkJRVU03VFVGRGFrSXNRMEZCUXl4SlFVRkpMRVZCUVVVc1kwRkJZeXhEUVVGRE8wMUJRM1JDTEVOQlFVTXNTVUZCU1N4RlFVRkZMRzlDUVVGdlFpeERRVUZETzAxQlF6VkNMRU5CUVVNc1NVRkJTU3hGUVVGRkxHTkJRV01zUTBGQlF6dEJRVU0xUWl4TFFVRkxMRU5CUVVNN08wbEJSVVk3VFVGRFJTeHZRa0ZCUVN4VFFVRlJMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEdGQlFXTXNRMEZCUVN4RlFVRkJPMUZCUXk5Q0xHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zYTBKQlFXMUNMRU5CUVVFc1JVRkJRVHRWUVVOb1F5eHZRa0ZCUVN4SlFVRkhMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEcxQ1FVRnZRaXhEUVVGQkxFVkJRVUU3V1VGRGFFTXNiMEpCUVVFc1NVRkJSeXhGUVVGQkxFbEJRVU1zUlVGQlFTeG5Ra0ZCYlVJc1EwRkJRU3hGUVVGQk8xbEJRM1pDTEc5Q1FVRkJMRWxCUVVjc1JVRkJRU3hKUVVGRExFVkJRVUU3WTBGRFJpeHZRa0ZCUXl4UlFVRlJMRVZCUVVFc1EwRkJRU3hEUVVGRExGRkJRVUVzUlVGQlVTeERRVUZETEdOQlFVRXNSVUZCWXl4RFFVRkRMRXRCUVVFc1JVRkJTeXhEUVVGRExFOUJRVUVzUlVGQlR5eERRVUZETEU5QlFVRXNSVUZCVHl4RFFVRkZMRTlCUVZFc1EwRkJRU3hEUVVGSExFTkJRVUU3V1VGRGFrVXNRMEZCUVN4RlFVRkJPMWxCUTB3c2IwSkJRVUVzU1VGQlJ5eEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhaUVVGaExFTkJRVUVzUlVGQlFUdGpRVU42UWl4dlFrRkJRU3hIUVVGRkxFVkJRVUVzUTBGQlFTeERRVUZETEU5QlFVRXNSVUZCVHl4RFFVRkZMRWxCUVVrc1EwRkJReXhYUVVGaExFTkJRVUVzUlVGQlFTeHZRa0ZCUXl4SlFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExFbEJRVUVzUlVGQlNTeERRVUZETEUxQlFVRXNSVUZCVFN4RFFVRkRMRWxCUVVFc1JVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlFTeERRVUZITEVOQlFVa3NRMEZCUVN4RlFVRkJPMk5CUTJoRkxHOUNRVUZCTEVkQlFVVXNSVUZCUVN4RFFVRkJMRU5CUVVNc1QwRkJRU3hGUVVGUExFTkJRVVVzU1VGQlNTeERRVUZETEdGQlFXVXNRMEZCUVN4RlFVRkJMRzlDUVVGRExFbEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNTVUZCUVN4RlFVRkpMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zU1VGQlFTeEZRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkJMRU5CUVVjc1EwRkJTU3hEUVVGQk8xbEJRMnhGTEVOQlFVRTdWVUZEUml4RFFVRkJPMEZCUTJZc1VVRkJZeXhEUVVGQkxFVkJRVUU3TzFGQlJVNHNiMEpCUVVNc1UwRkJVeXhGUVVGQkxFTkJRVUVzUTBGQlF5eFJRVUZCTEVWQlFWRXNRMEZCUlN4UFFVRlJMRU5CUVVFc1EwRkJSeXhEUVVGQk8wMUJRM2hDTEVOQlFVRTdUVUZEVmp0SFFVTklPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhWUVVGVkxFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUV4cGMzUkdhV3gwWlhJN1hHNTJZWElnVW1WaFkzUWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDZHlaV0ZqZENjcE8xeHVkbUZ5SUVKaFkydGliMjVsSUNBZ0lEMGdjbVZ4ZFdseVpTZ25ZbUZqYTJKdmJtVW5LVHRjYm5aaGNpQkpZMjl1SUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dmFXTnZibDkzY21Gd2NHVnlMbXB6ZUNjcE8xeHVkbUZ5SUVSeWIzQmtiM2R1SUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTlrY205d1pHOTNiaTVxYzNnbktUdGNiblpoY2lCR2FXeDBaWEpDYjNnZ0lDQTlJSEpsY1hWcGNtVW9KeTR2Wm1sc2RHVnlYMkp2ZUM1cWMzZ25LVHRjYm5aaGNpQmpjbWwwWlhKcFlTQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dlptbHNkR1Z5WDJKdmVGOWtaV1pwYm1sMGFXOXVKeWs3WEc1Y2JreHBjM1JHYVd4MFpYSWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lIQnliM0JVZVhCbGN6b2dlMXh1SUNBZ0lITjBiM0psT2lCU1pXRmpkQzVRY205d1ZIbHdaWE11YVc1emRHRnVZMlZQWmloQ1lXTnJZbTl1WlM1TmIyUmxiQ2t1YVhOU1pYRjFhWEpsWkZ4dUlDQjlMRnh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMllYSWdZMmh2YVdObGN6dGNiaUFnSUNCMllYSWdZblZwYkdSbGNpQTlJRzVsZHlCamNtbDBaWEpwWVM1Q2RXbHNaR1Z5S0dOeWFYUmxjbWxoTG1SbFptbHVhWFJwYjI0cE8xeHVYRzRnSUNBZ1kyaHZhV05sY3lBOUlGdGNiaUFnSUNBZ0lIdDBaWGgwT2lBblRtVjNJR1p5YjIwZ1kzVnljbVZ1ZEM0dUxpZDlMRnh1SUNBZ0lDQWdlM1JsZUhRNklDZE9aWGNnWm5KdmJTQmliR0Z1YXk0dUxpZDlMRnh1SUNBZ0lDQWdlM05sY0dGeVlYUnZjam9nZEhKMVpYMHNYRzRnSUNBZ0lDQjdkR1Y0ZERvZ0owNWxkMlZ6ZENCallYTmxjeWQ5TEZ4dUlDQWdJQ0FnZTNSbGVIUTZJQ2REWVhObGN5QnZjR1Z1WldRZ1lua2diV1VuZlN4Y2JpQWdJQ0FnSUh0MFpYaDBPaUFuUTJ4dmMyVmtJR05oYzJWekozMWNiaUFnSUNCZE8xeHVYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4allYQjBhVzl1SUdOc1lYTnpUbUZ0WlQxY0lteHBjM1F0Wm1sc2RHVnlYQ0krWEc0Z0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpWm1sc2RHVnlMWE5sYkdWamRHbHZibHdpUGx4dUlDQWdJQ0FnSUNBZ0lEeDFiQ0JqYkdGemMwNWhiV1U5WENKd2RXeHNMWEpwWjJoMElHbHViR2x1WlZ3aVBseHVJQ0FnSUNBZ0lDQWdJQ0FnUEd4cFBsRjFhV05ySUdacGJIUmxjbk02UEM5c2FUNWNiaUFnSUNBZ0lDQWdJQ0FnSUR4c2FUNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1BFUnliM0JrYjNkdUlITmxiR1ZqZEdWa1BWd2lRV04wYVhabElHTmhjMlZ6WENJZ1lXeHBaMjQ5WENKeWFXZG9kRndpSUdOb2IybGpaWE05ZTJOb2IybGpaWE45SUM4K1hHNGdJQ0FnSUNBZ0lDQWdJQ0E4TDJ4cFBseHVJQ0FnSUNBZ0lDQWdJQ0FnUEd4cElHTnNZWE56VG1GdFpUMWNJbWxqYjI0dFozSnZkWEJjSWo1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdFZ2IyNURiR2xqYXoxN2RHaHBjeTVmYzJGMlpVWnBiSFJsY24wK1BFbGpiMjRnZEhsd1pUMWNJbk5oZG1WY0lpQnphWHBsUFZ3aWJHZGNJaUF2UGp3dllUNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1BHRWdiMjVEYkdsamF6MTdkR2hwY3k1ZlpHVnNaWFJsUm1sc2RHVnlmVDQ4U1dOdmJpQjBlWEJsUFZ3aWRISmhjMmd0YjF3aUlITnBlbVU5WENKc1oxd2lJQzgrUEM5aFBseHVJQ0FnSUNBZ0lDQWdJQ0FnUEM5c2FUNWNiaUFnSUNBZ0lDQWdJQ0E4TDNWc1BseHVJQ0FnSUNBZ0lDQThMMlJwZGo1Y2JseHVJQ0FnSUNBZ0lDQThSbWxzZEdWeVFtOTRJR055YVhSbGNtbGhQWHRpZFdsc1pHVnlmU0F2UGx4dUlDQWdJQ0FnUEM5allYQjBhVzl1UGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFeHBjM1JHYVd4MFpYSTdYRzRpWFgwPSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgTGlzdFJvdztcbnZhciBfICAgICAgICAgICAgID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyIFJlYWN0ICAgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEJhY2tib25lICAgICAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyIEhlYWRpbmdNb2RlbCAgPSByZXF1aXJlKCcuL2hlYWRpbmdfbW9kZWwnKTtcbnZhciBDYXNlTW9kZWwgICAgID0gcmVxdWlyZSgnLi9jYXNlX21vZGVsJyk7XG52YXIgVHIgICAgICAgICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvdHIuanN4Jyk7XG52YXIgVGQgICAgICAgICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvdGQuanN4Jyk7XG52YXIgdHJhbnNmb3JtZXJzICA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtZXJzLmpzeCcpXG5cbkxpc3RSb3cgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiTGlzdFJvd1wiLFxuICBwcm9wVHlwZXM6IHtcbiAgICBoZWFkaW5nOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihIZWFkaW5nTW9kZWwpLmlzUmVxdWlyZWQsXG4gICAgbWFuYWdlZF9jYXNlOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihDYXNlTW9kZWwpLmlzUmVxdWlyZWRcbiAgfSxcbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBmdW5jdGlvbiAobmV3UHJvcHMsIG5ld1N0YXRlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gICAgdmFyIG5ld19jYXNlICA9IG5ld1Byb3BzLm1hbmFnZWRfY2FzZSA/IG5ld1Byb3BzLm1hbmFnZWRfY2FzZS50b0pTT04oKSA6IHt9O1xuICAgIHZhciBvbGRfY2FzZSAgPSB0aGlzLnByb3BzLm1hbmFnZWRfY2FzZS50b0pTT04oKTtcblxuICAgIGlmICh0aGlzLnByb3BzLmNsYXNzTmFtZSAhPT0gbmV3UHJvcHMuY2xhc3NOYW1lKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoISBfLmlzRXF1YWwob2xkX2Nhc2UsIG5ld19jYXNlKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29scyA9IHRoaXMuX2J1aWxkQ29scygpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHIsIHtjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lLCBvbkNsaWNrOiB0aGlzLl9oYW5kbGVDbGlja30sIFxuICAgICAgICBjb2xzXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgX2hhbmRsZUNsaWNrOiBmdW5jdGlvbiAoZSkge1xuICAgIGlmICh0aGlzLnByb3BzLm9uQ2xpY2spIHtcbiAgICAgIHRoaXMucHJvcHMub25DbGljayhlKTtcbiAgICB9XG4gIH0sXG4gIF9idWlsZENvbHM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbmFtZTtcbiAgICB2YXIgdmFsdWU7XG4gICAgdmFyIG1hbmFnZWRfY2FzZSAgPSB0aGlzLnByb3BzLm1hbmFnZWRfY2FzZTtcbiAgICB2YXIgaGVhZGluZyAgICAgICA9IHRoaXMucHJvcHMuaGVhZGluZztcbiAgICB2YXIgZmllbGRzICAgICAgICA9IFtdO1xuXG4gICAgd2hpbGUgKGhlYWRpbmcpIHtcbiAgICAgIG5hbWUgID0gaGVhZGluZy5nZXQoJ25hbWUnKTtcbiAgICAgIHR5cGUgID0gaGVhZGluZy5nZXQoJ3R5cGUnKTtcbiAgICAgIHZhbHVlID0gdHJhbnNmb3JtZXJzW3R5cGVdICYmIHRyYW5zZm9ybWVyc1t0eXBlXS5jYWxsKHRoaXMsIG1hbmFnZWRfY2FzZSwgbmFtZSk7XG5cbiAgICAgIGZpZWxkcy5wdXNoKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRkLCB7c3RvcmU6IG1hbmFnZWRfY2FzZSwga2V5OiBoZWFkaW5nLmNpZH0sIFxuICAgICAgICAgIHZhbHVlXG4gICAgICAgIClcbiAgICAgICk7XG5cbiAgICAgIGhlYWRpbmcgPSBoZWFkaW5nLm5leHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpZWxkcztcbiAgfSxcbiAgX2Nsb3NlQ2FzZTogZnVuY3Rpb24gKCkge1xuICAgIGlmIChjb25maXJtKCdUaGlzIHdpbGwgcGVybWFuZW50bHkgY2xvc2UgdGhpcyBjYXNlLiBBcmUgeW91IHN1cmU/JykpIHtcbiAgICAgIHRoaXMucHJvcHMubWFuYWdlZF9jYXNlLnNldCgnc3RhdHVzJywgJ2Nsb3NlZCcpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7fSk7XG4gICAgfVxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaXN0Um93O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WTJGelpYTXZiR2x6ZEY5eWIzY3Vhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRVVZCTEVkQlFVYzdPMEZCUlVnc1NVRkJTU3hQUVVGUExFTkJRVU03UVVGRFdpeEpRVUZKTEVOQlFVTXNaVUZCWlN4UFFVRlBMRU5CUVVNc1dVRkJXU3hEUVVGRExFTkJRVU03UVVGRE1VTXNTVUZCU1N4TFFVRkxMRmRCUVZjc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzBGQlEzSkRMRWxCUVVrc1VVRkJVU3hSUVVGUkxFOUJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXp0QlFVTjRReXhKUVVGSkxGbEJRVmtzU1VGQlNTeFBRVUZQTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zUTBGQlF6dEJRVU12UXl4SlFVRkpMRk5CUVZNc1QwRkJUeXhQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTTdRVUZETlVNc1NVRkJTU3hGUVVGRkxHTkJRV01zVDBGQlR5eERRVUZETEhsQ1FVRjVRaXhEUVVGRExFTkJRVU03UVVGRGRrUXNTVUZCU1N4RlFVRkZMR05CUVdNc1QwRkJUeXhEUVVGRExIbENRVUY1UWl4RFFVRkRMRU5CUVVNN1FVRkRka1FzU1VGQlNTeFpRVUZaTEVsQlFVa3NUMEZCVHl4RFFVRkRMRzlDUVVGdlFpeERRVUZET3p0QlFVVnFSQ3cyUWtGQk5rSXNkVUpCUVVFN1JVRkRNMElzVTBGQlV5eEZRVUZGTzBsQlExUXNUMEZCVHl4RlFVRkZMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zVlVGQlZTeERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRMRlZCUVZVN1NVRkROVVFzV1VGQldTeEZRVUZGTEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1ZVRkJWU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETEZWQlFWVTdSMEZETDBRN1JVRkRSQ3h4UWtGQmNVSXNSVUZCUlN4VlFVRlZMRkZCUVZFc1JVRkJSU3hSUVVGUkxFVkJRVVU3U1VGRGJrUXNUMEZCVHl4SlFVRkpMRU5CUVVNN1NVRkRXaXhKUVVGSkxGRkJRVkVzU1VGQlNTeFJRVUZSTEVOQlFVTXNXVUZCV1N4SFFVRkhMRkZCUVZFc1EwRkJReXhaUVVGWkxFTkJRVU1zVFVGQlRTeEZRVUZGTEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUTJoR0xFbEJRVWtzU1VGQlNTeFJRVUZSTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhaUVVGWkxFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTTdPMGxCUldwRUxFbEJRVWtzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4VFFVRlRMRXRCUVVzc1VVRkJVU3hEUVVGRExGTkJRVk1zUlVGQlJUdE5RVU12UXl4UFFVRlBMRWxCUVVrc1EwRkJRenRCUVVOc1FpeExRVUZMT3p0SlFVVkVMRWxCUVVrc1JVRkJSU3hEUVVGRExFTkJRVU1zVDBGQlR5eERRVUZETEZGQlFWRXNSVUZCUlN4UlFVRlJMRU5CUVVNc1JVRkJSVHROUVVOdVF5eFBRVUZQTEVsQlFVa3NRMEZCUXp0QlFVTnNRaXhMUVVGTE96dEpRVVZFTEU5QlFVOHNTMEZCU3l4RFFVRkRPMGRCUTJRN1JVRkRSQ3hOUVVGTkxFVkJRVVVzV1VGQldUdEJRVU4wUWl4SlFVRkpMRWxCUVVrc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eFZRVUZWTEVWQlFVVXNRMEZCUXpzN1NVRkZOMEk3VFVGRFJTeHZRa0ZCUXl4RlFVRkZMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhGUVVGRExFTkJRVU1zVDBGQlFTeEZRVUZQTEVOQlFVVXNTVUZCU1N4RFFVRkRMRmxCUVdNc1EwRkJRU3hGUVVGQk8xRkJRemxFTEVsQlFVczdUVUZEU0N4RFFVRkJPMDFCUTB3N1IwRkRTRHRGUVVORUxGbEJRVmtzUlVGQlJTeFZRVUZWTEVOQlFVTXNSVUZCUlR0SlFVTjZRaXhKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RlFVRkZPMDFCUTNSQ0xFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wdEJRM1pDTzBkQlEwWTdSVUZEUkN4VlFVRlZMRVZCUVVVc1dVRkJXVHRKUVVOMFFpeEpRVUZKTEVsQlFVa3NRMEZCUXp0SlFVTlVMRWxCUVVrc1MwRkJTeXhEUVVGRE8wbEJRMVlzU1VGQlNTeFpRVUZaTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhaUVVGWkxFTkJRVU03U1VGRE5VTXNTVUZCU1N4UFFVRlBMRk5CUVZNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTTdRVUZETTBNc1NVRkJTU3hKUVVGSkxFMUJRVTBzVlVGQlZTeEZRVUZGTEVOQlFVTTdPMGxCUlhaQ0xFOUJRVThzVDBGQlR5eEZRVUZGTzAxQlEyUXNTVUZCU1N4SlFVRkpMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdUVUZETlVJc1NVRkJTU3hKUVVGSkxFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1FVRkRiRU1zVFVGQlRTeExRVUZMTEVkQlFVY3NXVUZCV1N4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxGbEJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxGbEJRVmtzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXpzN1RVRkZhRVlzVFVGQlRTeERRVUZETEVsQlFVazdVVUZEVkN4dlFrRkJReXhGUVVGRkxFVkJRVUVzUTBGQlFTeERRVUZETEV0QlFVRXNSVUZCU3l4RFFVRkZMRmxCUVZrc1JVRkJReXhEUVVGRExFZEJRVUVzUlVGQlJ5eERRVUZGTEU5QlFVOHNRMEZCUXl4SFFVRkxMRU5CUVVFc1JVRkJRVHRWUVVONFF5eExRVUZOTzFGQlEwb3NRMEZCUVR0QlFVTmlMRTlCUVU4c1EwRkJRenM3VFVGRlJpeFBRVUZQTEVkQlFVY3NUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJRenRCUVVNM1FpeExRVUZMT3p0SlFVVkVMRTlCUVU4c1RVRkJUU3hEUVVGRE8wZEJRMlk3UlVGRFJDeFZRVUZWTEVWQlFVVXNXVUZCV1R0SlFVTjBRaXhKUVVGSkxFOUJRVThzUTBGQlF5eHpSRUZCYzBRc1EwRkJReXhGUVVGRk8wMUJRMjVGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1dVRkJXU3hEUVVGRExFZEJRVWNzUTBGQlF5eFJRVUZSTEVWQlFVVXNVVUZCVVN4RFFVRkRMRU5CUVVNN1RVRkRhRVFzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJRenRMUVVOdVFqdEhRVU5HTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4UFFVRlBMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlFQnFjM2dnVW1WaFkzUXVSRTlOWEc0Z0tpOWNibHh1ZG1GeUlFeHBjM1JTYjNjN1hHNTJZWElnWHlBZ0lDQWdJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KM1Z1WkdWeWMyTnZjbVVuS1R0Y2JuWmhjaUJTWldGamRDQWdJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRbktUdGNiblpoY2lCQ1lXTnJZbTl1WlNBZ0lDQWdJRDBnY21WeGRXbHlaU2duWW1GamEySnZibVVuS1R0Y2JuWmhjaUJJWldGa2FXNW5UVzlrWld3Z0lEMGdjbVZ4ZFdseVpTZ25MaTlvWldGa2FXNW5YMjF2WkdWc0p5azdYRzUyWVhJZ1EyRnpaVTF2WkdWc0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dlkyRnpaVjl0YjJSbGJDY3BPMXh1ZG1GeUlGUnlJQ0FnSUNBZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NjdUxpOHVMaTlqYjIxd2IyNWxiblJ6TDNSeUxtcHplQ2NwTzF4dWRtRnlJRlJrSUNBZ0lDQWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDY3VMaTh1TGk5amIyMXdiMjVsYm5SekwzUmtMbXB6ZUNjcE8xeHVkbUZ5SUhSeVlXNXpabTl5YldWeWN5QWdQU0J5WlhGMWFYSmxLQ2N1TDNSeVlXNXpabTl5YldWeWN5NXFjM2duS1Z4dVhHNU1hWE4wVW05M0lEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1SUNCd2NtOXdWSGx3WlhNNklIdGNiaUFnSUNCb1pXRmthVzVuT2lCU1pXRmpkQzVRY205d1ZIbHdaWE11YVc1emRHRnVZMlZQWmloSVpXRmthVzVuVFc5a1pXd3BMbWx6VW1WeGRXbHlaV1FzWEc0Z0lDQWdiV0Z1WVdkbFpGOWpZWE5sT2lCU1pXRmpkQzVRY205d1ZIbHdaWE11YVc1emRHRnVZMlZQWmloRFlYTmxUVzlrWld3cExtbHpVbVZ4ZFdseVpXUmNiaUFnZlN4Y2JpQWdjMmh2ZFd4a1EyOXRjRzl1Wlc1MFZYQmtZWFJsT2lCbWRXNWpkR2x2YmlBb2JtVjNVSEp2Y0hNc0lHNWxkMU4wWVhSbEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUhSeWRXVTdYRzRnSUNBZ2RtRnlJRzVsZDE5allYTmxJQ0E5SUc1bGQxQnliM0J6TG0xaGJtRm5aV1JmWTJGelpTQS9JRzVsZDFCeWIzQnpMbTFoYm1GblpXUmZZMkZ6WlM1MGIwcFRUMDRvS1NBNklIdDlPMXh1SUNBZ0lIWmhjaUJ2YkdSZlkyRnpaU0FnUFNCMGFHbHpMbkJ5YjNCekxtMWhibUZuWldSZlkyRnpaUzUwYjBwVFQwNG9LVHRjYmx4dUlDQWdJR2xtSUNoMGFHbHpMbkJ5YjNCekxtTnNZWE56VG1GdFpTQWhQVDBnYm1WM1VISnZjSE11WTJ4aGMzTk9ZVzFsS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnZEhKMVpUdGNiaUFnSUNCOVhHNWNiaUFnSUNCcFppQW9JU0JmTG1selJYRjFZV3dvYjJ4a1gyTmhjMlVzSUc1bGQxOWpZWE5sS1NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVTdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh1SUNCOUxGeHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ1kyOXNjeUE5SUhSb2FYTXVYMkoxYVd4a1EyOXNjeWdwTzF4dVhHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHhVY2lCamJHRnpjMDVoYldVOWUzUm9hWE11Y0hKdmNITXVZMnhoYzNOT1lXMWxmU0J2YmtOc2FXTnJQWHQwYUdsekxsOW9ZVzVrYkdWRGJHbGphMzArWEc0Z0lDQWdJQ0FnSUh0amIyeHpmVnh1SUNBZ0lDQWdQQzlVY2o1Y2JpQWdJQ0FwTzF4dUlDQjlMRnh1SUNCZmFHRnVaR3hsUTJ4cFkyczZJR1oxYm1OMGFXOXVJQ2hsS1NCN1hHNGdJQ0FnYVdZZ0tIUm9hWE11Y0hKdmNITXViMjVEYkdsamF5a2dlMXh1SUNBZ0lDQWdkR2hwY3k1d2NtOXdjeTV2YmtOc2FXTnJLR1VwTzF4dUlDQWdJSDFjYmlBZ2ZTeGNiaUFnWDJKMWFXeGtRMjlzY3pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJ1WVcxbE8xeHVJQ0FnSUhaaGNpQjJZV3gxWlR0Y2JpQWdJQ0IyWVhJZ2JXRnVZV2RsWkY5allYTmxJQ0E5SUhSb2FYTXVjSEp2Y0hNdWJXRnVZV2RsWkY5allYTmxPMXh1SUNBZ0lIWmhjaUJvWldGa2FXNW5JQ0FnSUNBZ0lEMGdkR2hwY3k1d2NtOXdjeTVvWldGa2FXNW5PMXh1SUNBZ0lIWmhjaUJtYVdWc1pITWdJQ0FnSUNBZ0lEMGdXMTA3WEc1Y2JpQWdJQ0IzYUdsc1pTQW9hR1ZoWkdsdVp5a2dlMXh1SUNBZ0lDQWdibUZ0WlNBZ1BTQm9aV0ZrYVc1bkxtZGxkQ2duYm1GdFpTY3BPMXh1SUNBZ0lDQWdkSGx3WlNBZ1BTQm9aV0ZrYVc1bkxtZGxkQ2duZEhsd1pTY3BPMXh1SUNBZ0lDQWdkbUZzZFdVZ1BTQjBjbUZ1YzJadmNtMWxjbk5iZEhsd1pWMGdKaVlnZEhKaGJuTm1iM0p0WlhKelczUjVjR1ZkTG1OaGJHd29kR2hwY3l3Z2JXRnVZV2RsWkY5allYTmxMQ0J1WVcxbEtUdGNibHh1SUNBZ0lDQWdabWxsYkdSekxuQjFjMmdvWEc0Z0lDQWdJQ0FnSUR4VVpDQnpkRzl5WlQxN2JXRnVZV2RsWkY5allYTmxmU0JyWlhrOWUyaGxZV1JwYm1jdVkybGtmVDVjYmlBZ0lDQWdJQ0FnSUNCN2RtRnNkV1Y5WEc0Z0lDQWdJQ0FnSUR3dlZHUStYRzRnSUNBZ0lDQXBPMXh1WEc0Z0lDQWdJQ0JvWldGa2FXNW5JRDBnYUdWaFpHbHVaeTV1WlhoME8xeHVJQ0FnSUgxY2JseHVJQ0FnSUhKbGRIVnliaUJtYVdWc1pITTdYRzRnSUgwc1hHNGdJRjlqYkc5elpVTmhjMlU2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCcFppQW9ZMjl1Wm1seWJTZ25WR2hwY3lCM2FXeHNJSEJsY20xaGJtVnVkR3g1SUdOc2IzTmxJSFJvYVhNZ1kyRnpaUzRnUVhKbElIbHZkU0J6ZFhKbFB5Y3BLU0I3WEc0Z0lDQWdJQ0IwYUdsekxuQnliM0J6TG0xaGJtRm5aV1JmWTJGelpTNXpaWFFvSjNOMFlYUjFjeWNzSUNkamJHOXpaV1FuS1R0Y2JpQWdJQ0FnSUhSb2FYTXVjMlYwVTNSaGRHVW9lMzBwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1RHbHpkRkp2ZHp0Y2JpSmRmUT09IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBDYXNlc0xpc3Q7XG52YXIgUmVhY3QgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgVGhlYWQgICA9IHJlcXVpcmUoJy4vdGhlYWRfd3JhcHBlci5qc3gnKTtcbnZhciBUYm9keSAgID0gcmVxdWlyZSgnLi90Ym9keV93cmFwcGVyLmpzeCcpO1xudmFyIEZpbHRlciAgPSByZXF1aXJlKCcuL2xpc3RfZmlsdGVyLmpzeCcpO1xuXG5DYXNlc0xpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQ2FzZXNMaXN0XCIsXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9wcyA9IHtzdG9yZTogdGhpcy5wcm9wcy5zdG9yZX07XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRhYmxlXCIsIHtjbGFzc05hbWU6IFwiZnVsbCBpbmxpbmUtZGV0YWlsc1wifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGaWx0ZXIsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgcHJvcHMpKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUaGVhZCwgUmVhY3QuX19zcHJlYWQoe30sICBwcm9wcykpLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRib2R5LCBSZWFjdC5fX3NwcmVhZCh7fSwgIHByb3BzKSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhc2VzTGlzdDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdlkyRnpaWE12YkdsemRGOTJhV1YzTG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHM3UVVGRlFTeEhRVUZIT3p0QlFVVklMRWxCUVVrc1UwRkJVeXhEUVVGRE8wRkJRMlFzU1VGQlNTeExRVUZMTEV0QlFVc3NUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8wRkJReTlDTEVsQlFVa3NTMEZCU3l4TFFVRkxMRTlCUVU4c1EwRkJReXh4UWtGQmNVSXNRMEZCUXl4RFFVRkRPMEZCUXpkRExFbEJRVWtzUzBGQlN5eExRVUZMTEU5QlFVOHNRMEZCUXl4eFFrRkJjVUlzUTBGQlF5eERRVUZETzBGQlF6ZERMRWxCUVVrc1RVRkJUU3hKUVVGSkxFOUJRVThzUTBGQlF5eHRRa0ZCYlVJc1EwRkJReXhEUVVGRE96dEJRVVV6UXl3clFrRkJLMElzZVVKQlFVRTdSVUZETjBJc1RVRkJUU3hGUVVGRkxGbEJRVms3UVVGRGRFSXNTVUZCU1N4SlFVRkpMRXRCUVVzc1IwRkJSeXhEUVVGRExFdEJRVXNzUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE96dEpRVVYwUXp0TlFVTkZMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeEpRVUZETEVWQlFVRTdVVUZEU0N4dlFrRkJRU3hQUVVGTkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMSEZDUVVGelFpeERRVUZCTEVWQlFVRTdWVUZEY2tNc2IwSkJRVU1zVFVGQlRTeEZRVUZCTEdkQ1FVRkJMRWRCUVVFc1EwRkJSU3hIUVVGSExFdEJRVTBzUTBGQlFTeERRVUZITEVOQlFVRXNSVUZCUVR0VlFVTnlRaXh2UWtGQlF5eExRVUZMTEVWQlFVRXNaMEpCUVVFc1IwRkJRU3hEUVVGRkxFZEJRVWNzUzBGQlRTeERRVUZCTEVOQlFVY3NRMEZCUVN4RlFVRkJPMVZCUTNCQ0xHOUNRVUZETEV0QlFVc3NSVUZCUVN4blFrRkJRU3hIUVVGQkxFTkJRVVVzUjBGQlJ5eExRVUZOTEVOQlFVRXNRMEZCUnl4RFFVRkJPMUZCUTJRc1EwRkJRVHROUVVOS0xFTkJRVUU3VFVGRFRqdEhRVU5JTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4VFFVRlRMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlFQnFjM2dnVW1WaFkzUXVSRTlOWEc0Z0tpOWNibHh1ZG1GeUlFTmhjMlZ6VEdsemREdGNiblpoY2lCU1pXRmpkQ0FnSUQwZ2NtVnhkV2x5WlNnbmNtVmhZM1FuS1R0Y2JuWmhjaUJVYUdWaFpDQWdJRDBnY21WeGRXbHlaU2duTGk5MGFHVmhaRjkzY21Gd2NHVnlMbXB6ZUNjcE8xeHVkbUZ5SUZSaWIyUjVJQ0FnUFNCeVpYRjFhWEpsS0NjdUwzUmliMlI1WDNkeVlYQndaWEl1YW5ONEp5azdYRzUyWVhJZ1JtbHNkR1Z5SUNBOUlISmxjWFZwY21Vb0p5NHZiR2x6ZEY5bWFXeDBaWEl1YW5ONEp5azdYRzVjYmtOaGMyVnpUR2x6ZENBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZG1GeUlIQnliM0J6SUQwZ2UzTjBiM0psT2lCMGFHbHpMbkJ5YjNCekxuTjBiM0psZlR0Y2JseHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4WkdsMlBseHVJQ0FnSUNBZ0lDQThkR0ZpYkdVZ1kyeGhjM05PWVcxbFBWd2lablZzYkNCcGJteHBibVV0WkdWMFlXbHNjMXdpUGx4dUlDQWdJQ0FnSUNBZ0lEeEdhV3gwWlhJZ2V5NHVMbkJ5YjNCemZTQXZQbHh1SUNBZ0lDQWdJQ0FnSUR4VWFHVmhaQ0I3TGk0dWNISnZjSE45SUM4K1hHNGdJQ0FnSUNBZ0lDQWdQRlJpYjJSNUlIc3VMaTV3Y205d2MzMGdMejVjYmlBZ0lDQWdJQ0FnUEM5MFlXSnNaVDVjYmlBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNrN1hHNGdJSDFjYm4wcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRU5oYzJWelRHbHpkRHRjYmlKZGZRPT0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0b3JlO1xudmFyIEJhY2tib25lICAgICAgICAgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBIZWFkaW5nQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vaGVhZGluZ19jb2xsZWN0aW9uJyk7XG52YXIgQ2FzZUNvbGxlY3Rpb24gICAgPSByZXF1aXJlKCcuL2Nhc2VfY29sbGVjdGlvbicpO1xuXG5zdG9yZSA9IG5ldyBCYWNrYm9uZS5Nb2RlbCh7XG4gIGNhc2VzOiAgICBuZXcgQ2FzZUNvbGxlY3Rpb24oKSxcbiAgZmlyc3Q6ICAgIG51bGwsXG4gIGhlYWRpbmdzOiBuZXcgSGVhZGluZ0NvbGxlY3Rpb24oKSxcbiAgc2VsZWN0ZWQ6IG51bGxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JlO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WTJGelpYTXZiR2x6ZEY5MmFXVjNYM04wYjNKbExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEZsQlFWa3NRMEZCUXpzN1FVRkZZaXhKUVVGSkxFdEJRVXNzUTBGQlF6dEJRVU5XTEVsQlFVa3NVVUZCVVN4WlFVRlpMRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6dEJRVU0xUXl4SlFVRkpMR2xDUVVGcFFpeEhRVUZITEU5QlFVOHNRMEZCUXl4elFrRkJjMElzUTBGQlF5eERRVUZETzBGQlEzaEVMRWxCUVVrc1kwRkJZeXhOUVVGTkxFOUJRVThzUTBGQlF5eHRRa0ZCYlVJc1EwRkJReXhEUVVGRE96dEJRVVZ5UkN4TFFVRkxMRWRCUVVjc1NVRkJTU3hSUVVGUkxFTkJRVU1zUzBGQlN5eERRVUZETzBWQlEzcENMRXRCUVVzc1MwRkJTeXhKUVVGSkxHTkJRV01zUlVGQlJUdEZRVU01UWl4TFFVRkxMRXRCUVVzc1NVRkJTVHRGUVVOa0xGRkJRVkVzUlVGQlJTeEpRVUZKTEdsQ1FVRnBRaXhGUVVGRk8wVkJRMnBETEZGQlFWRXNSVUZCUlN4SlFVRkpPMEZCUTJoQ0xFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVklMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzUzBGQlN5eERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaVhDSjFjMlVnYzNSeWFXTjBYQ0k3WEc1Y2JuWmhjaUJ6ZEc5eVpUdGNiblpoY2lCQ1lXTnJZbTl1WlNBZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0oySmhZMnRpYjI1bEp5azdYRzUyWVhJZ1NHVmhaR2x1WjBOdmJHeGxZM1JwYjI0Z1BTQnlaWEYxYVhKbEtDY3VMMmhsWVdScGJtZGZZMjlzYkdWamRHbHZiaWNwTzF4dWRtRnlJRU5oYzJWRGIyeHNaV04wYVc5dUlDQWdJRDBnY21WeGRXbHlaU2duTGk5allYTmxYMk52Ykd4bFkzUnBiMjRuS1R0Y2JseHVjM1J2Y21VZ1BTQnVaWGNnUW1GamEySnZibVV1VFc5a1pXd29lMXh1SUNCallYTmxjem9nSUNBZ2JtVjNJRU5oYzJWRGIyeHNaV04wYVc5dUtDa3NYRzRnSUdacGNuTjBPaUFnSUNCdWRXeHNMRnh1SUNCb1pXRmthVzVuY3pvZ2JtVjNJRWhsWVdScGJtZERiMnhzWldOMGFXOXVLQ2tzWEc0Z0lITmxiR1ZqZEdWa09pQnVkV3hzWEc1OUtUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0J6ZEc5eVpUdGNiaUpkZlE9PSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgVGJvZHlXcmFwcGVyO1xudmFyIFJlYWN0ICAgICAgICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBCYWNrYm9uZSAgICAgICAgICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgU2Nyb2xsZXIgICAgICAgICAgPSByZXF1aXJlKCcuLi8uLi91dGlscy9zY3JvbGxlcl9jb2FzdGVyJyk7XG52YXIgUm93RGV0YWlscyAgICAgICAgPSByZXF1aXJlKCcuL2FjdGl2ZV9yb3dfZGV0YWlscy5qc3gnKTtcbnZhciBDYXNlSGlzdG9yeVZpZXcgICA9IHJlcXVpcmUoJy4vY2FzZV9oaXN0b3J5LmpzeCcpO1xudmFyIEhpc3RvcnlDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9jYXNlX2hpc3RvcnlfY29sbGVjdGlvbicpO1xudmFyIExpc3RSb3cgICAgICAgICAgID0gcmVxdWlyZSgnLi9saXN0X3Jvdy5qc3gnKTtcbnZhciBjbGFzc05hbWVzICAgICAgICA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxuVGJvZHlXcmFwcGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRib2R5V3JhcHBlclwiLFxuICBwcm9wVHlwZXM6IHtcbiAgICBzdG9yZTogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoQmFja2JvbmUuTW9kZWwpLmlzUmVxdWlyZWRcbiAgfSxcbiAgbWl4aW5zOiBbUmVhY3QuYWRkb25zLlB1cmVSZW5kZXJNaXhpbl0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY3RpdmVDYXNlOiBudWxsLFxuICAgICAgbWluaW1pemVkOiAgZmFsc2UsXG4gICAgICBwcmV2aW91czogICBudWxsLFxuICAgICAgaW5jcmVtZW50OiAgZmFsc2VcbiAgICB9O1xuICB9LFxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWxlbWVudHM7XG4gICAgdmFyIGFjdGl2ZSA9IHRoaXMuc3RhdGUuYWN0aXZlQ2FzZTtcblxuICAgIGlmICghIGFjdGl2ZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGVsZW1lbnRzID0gW1xuICAgICAgdGhpcy5yZWZzW2FjdGl2ZV0uZ2V0RE9NTm9kZSgpLFxuICAgICAgdGhpcy5yZWZzLmFjdGl2ZUNhc2UuZ2V0RE9NTm9kZSgpXG4gICAgXTtcblxuICAgIFNjcm9sbGVyKGVsZW1lbnRzLCB7c3RlcHM6IDI1MH0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcm93cyA9IHRoaXMuX2J1aWxkUm93cygpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiLCB7Y2xhc3NOYW1lOiB0aGlzLnByb3BzLmNsYXNzTmFtZX0sIFxuICAgICAgICByb3dzXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgX2J1aWxkUm93czogZnVuY3Rpb24gKCkge1xuICAgIHZhciBkYXRhICAgID0gW107XG4gICAgdmFyIHN0b3JlICAgPSB0aGlzLnByb3BzLnN0b3JlO1xuICAgIHZhciBjYXNlcyAgID0gc3RvcmUuZ2V0KCdjYXNlcycpO1xuICAgIHZhciBoZWFkaW5nID0gc3RvcmUuZ2V0KCdmaXJzdCcpO1xuICAgIHZhciBwcmV2ICAgID0gbnVsbDtcbiAgICB2YXIgbmV4dCAgICA9IG51bGw7XG5cbiAgICBjYXNlcy5lYWNoKGZ1bmN0aW9uIChtb2RlbCwgaW5kZXgpIHtcbiAgICAgIHZhciBhY3RpdmVQcm9wcztcbiAgICAgIHZhciByb3dQcm9wcztcbiAgICAgIHZhciBzZWxlY3RlZF9yb3c7XG4gICAgICB2YXIgY2xhc3NfbmFtZXM7XG4gICAgICB2YXIgYWN0aXZlICA9IHRoaXMuc3RhdGUuYWN0aXZlQ2FzZSA9PT0gbW9kZWwuY2lkO1xuICAgICAgdmFyIG9kZCAgICAgPSBpbmRleCAlIDIgPyAnb2RkJyA6IG51bGw7XG5cbiAgICAgIG5leHQgPSBjYXNlcy5hdChpbmRleCArIDEpO1xuXG4gICAgICBjbGFzc19uYW1lcyA9IGNsYXNzTmFtZXMoe1xuICAgICAgICBvZGQ6IG9kZCxcbiAgICAgICAgYWN0aXZlOiBhY3RpdmVcbiAgICAgIH0pO1xuXG4gICAgICByb3dQcm9wcyA9IHtcbiAgICAgICAgY2xhc3NOYW1lOiAgICBjbGFzc19uYW1lcyxcbiAgICAgICAgcmVmOiAgICAgICAgICBtb2RlbC5jaWQsXG4gICAgICAgIGtleTogICAgICAgICAgbW9kZWwuY2lkLFxuICAgICAgICBvbkNsaWNrOiAgICAgIHRoaXMuX2hhbmRsZUNhc2VTZWxlY3Rpb24uYmluZCh0aGlzLCBtb2RlbC5jaWQpLFxuICAgICAgICBtYW5hZ2VkX2Nhc2U6IG1vZGVsLFxuICAgICAgICBoZWFkaW5nOiAgICAgIGhlYWRpbmdcbiAgICAgIH07XG5cbiAgICAgIGRhdGEucHVzaChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMaXN0Um93LCBSZWFjdC5fX3NwcmVhZCh7fSwgIHJvd1Byb3BzKSlcbiAgICAgICk7XG5cbiAgICAgIGlmIChhY3RpdmUpIHtcbiAgICAgICAgYWN0aXZlUHJvcHMgPSB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAgb2RkLFxuICAgICAgICAgIG1vZGVsOiAgICAgIG1vZGVsLFxuICAgICAgICAgIHByZXY6ICAgICAgIHByZXYgJiYgcHJldi5jaWQsXG4gICAgICAgICAgbmV4dDogICAgICAgbmV4dCAmJiBuZXh0LmNpZCxcbiAgICAgICAgICBzd2l0Y2hlcjogICB0aGlzLl9oYW5kbGVDYXNlU2VsZWN0aW9uLFxuICAgICAgICAgIHNpemVUb2dnbGU6IHRoaXMuX3RvZ2dsZU1pbmltaXplLFxuICAgICAgICAgIGtleTogICAgICAgIG1vZGVsLmNpZCArICctYWN0aXZlJyxcbiAgICAgICAgICByZWY6ICAgICAgICAnYWN0aXZlQ2FzZScsXG4gICAgICAgICAgbWluaW1pemVkOiAgdGhpcy5zdGF0ZS5taW5pbWl6ZWRcbiAgICAgICAgfTtcblxuICAgICAgICBkYXRhLnB1c2goXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3dEZXRhaWxzLCBSZWFjdC5fX3NwcmVhZCh7fSwgIGFjdGl2ZVByb3BzKSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENhc2VIaXN0b3J5Vmlldywge2NvbGxlY3Rpb246IG5ldyBIaXN0b3J5Q29sbGVjdGlvbigpfSlcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHByZXYgPSBtb2RlbDtcbiAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiBkYXRhO1xuICB9LFxuICBfaGFuZGxlQ2FzZVNlbGVjdGlvbjogZnVuY3Rpb24gKGNpZCwgaW5jcmVtZW50KSB7XG4gICAgdmFyIGN1cnJlbnQgPSB0aGlzLnN0YXRlLmFjdGl2ZUNhc2U7XG5cbiAgICBpZiAoY3VycmVudCA9PT0gY2lkKSB7XG4gICAgICBjaWQgPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgYWN0aXZlQ2FzZTogY2lkLFxuICAgICAgaW5jcmVtZW50OiAgaW5jcmVtZW50ID09PSB0cnVlLFxuICAgICAgcHJldmlvdXM6ICAgY2lkID8gY3VycmVudCA6IG51bGxcbiAgICB9KTtcbiAgfSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRib2R5V3JhcHBlcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdlkyRnpaWE12ZEdKdlpIbGZkM0poY0hCbGNpNXFjM2dpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN08wRkJSVUVzUjBGQlJ6czdRVUZGU0N4SlFVRkpMRmxCUVZrc1EwRkJRenRCUVVOcVFpeEpRVUZKTEV0QlFVc3NaVUZCWlN4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRGVrTXNTVUZCU1N4UlFVRlJMRmxCUVZrc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETzBGQlF6VkRMRWxCUVVrc1VVRkJVU3haUVVGWkxFOUJRVThzUTBGQlF5dzRRa0ZCT0VJc1EwRkJReXhEUVVGRE8wRkJRMmhGTEVsQlFVa3NWVUZCVlN4VlFVRlZMRTlCUVU4c1EwRkJReXd3UWtGQk1FSXNRMEZCUXl4RFFVRkRPMEZCUXpWRUxFbEJRVWtzWlVGQlpTeExRVUZMTEU5QlFVOHNRMEZCUXl4dlFrRkJiMElzUTBGQlF5eERRVUZETzBGQlEzUkVMRWxCUVVrc2FVSkJRV2xDTEVkQlFVY3NUMEZCVHl4RFFVRkRMREpDUVVFeVFpeERRVUZETEVOQlFVTTdRVUZETjBRc1NVRkJTU3hQUVVGUExHRkJRV0VzVDBGQlR5eERRVUZETEdkQ1FVRm5RaXhEUVVGRExFTkJRVU03UVVGRGJFUXNTVUZCU1N4VlFVRlZMRlZCUVZVc1QwRkJUeXhEUVVGRExGbEJRVmtzUTBGQlF5eERRVUZET3p0QlFVVTVReXhyUTBGQmEwTXNORUpCUVVFN1JVRkRhRU1zVTBGQlV5eEZRVUZGTzBsQlExUXNTMEZCU3l4RlFVRkZMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zVlVGQlZTeERRVUZETEZGQlFWRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhWUVVGVk8wZEJRemRFTzBWQlEwUXNUVUZCVFN4RlFVRkZMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF5eGxRVUZsTEVOQlFVTTdSVUZEZEVNc1pVRkJaU3hGUVVGRkxGbEJRVms3U1VGRE0wSXNUMEZCVHp0TlFVTk1MRlZCUVZVc1JVRkJSU3hKUVVGSk8wMUJRMmhDTEZOQlFWTXNSMEZCUnl4TFFVRkxPMDFCUTJwQ0xGRkJRVkVzU1VGQlNTeEpRVUZKTzAxQlEyaENMRk5CUVZNc1IwRkJSeXhMUVVGTE8wdEJRMnhDTEVOQlFVTTdSMEZEU0R0RlFVTkVMR3RDUVVGclFpeEZRVUZGTEZsQlFWazdTVUZET1VJc1NVRkJTU3hSUVVGUkxFTkJRVU03UVVGRGFrSXNTVUZCU1N4SlFVRkpMRTFCUVUwc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZWQlFWVXNRMEZCUXpzN1NVRkZia01zU1VGQlNTeEZRVUZGTEUxQlFVMHNSVUZCUlR0TlFVTmFMRTlCUVU4c1MwRkJTeXhEUVVGRE8wRkJRMjVDTEV0QlFVczdPMGxCUlVRc1VVRkJVU3hIUVVGSE8wMUJRMVFzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJReXhWUVVGVkxFVkJRVVU3VFVGRE9VSXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zVlVGQlZTeEZRVUZGTzBGQlEzWkRMRXRCUVVzc1EwRkJRenM3U1VGRlJpeFJRVUZSTEVOQlFVTXNVVUZCVVN4RlFVRkZMRU5CUVVNc1MwRkJTeXhGUVVGRkxFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdSMEZEYkVNN1JVRkRSQ3hOUVVGTkxFVkJRVVVzV1VGQldUdEJRVU4wUWl4SlFVRkpMRWxCUVVrc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eFZRVUZWTEVWQlFVVXNRMEZCUXpzN1NVRkZOMEk3VFVGRFJTeHZRa0ZCUVN4UFFVRk5MRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJWeXhEUVVGQkxFVkJRVUU3VVVGRGNrTXNTVUZCU3p0TlFVTkJMRU5CUVVFN1RVRkRVanRIUVVOSU8wVkJRMFFzVlVGQlZTeEZRVUZGTEZsQlFWazdTVUZEZEVJc1NVRkJTU3hKUVVGSkxFMUJRVTBzUlVGQlJTeERRVUZETzBsQlEycENMRWxCUVVrc1MwRkJTeXhMUVVGTExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRPMGxCUXk5Q0xFbEJRVWtzUzBGQlN5eExRVUZMTEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03U1VGRGFrTXNTVUZCU1N4UFFVRlBMRWRCUVVjc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0SlFVTnFReXhKUVVGSkxFbEJRVWtzVFVGQlRTeEpRVUZKTEVOQlFVTTdRVUZEZGtJc1NVRkJTU3hKUVVGSkxFbEJRVWtzVFVGQlRTeEpRVUZKTEVOQlFVTTdPMGxCUlc1Q0xFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNWVUZCVlN4TFFVRkxMRVZCUVVVc1MwRkJTeXhGUVVGRk8wMUJRMnBETEVsQlFVa3NWMEZCVnl4RFFVRkRPMDFCUTJoQ0xFbEJRVWtzVVVGQlVTeERRVUZETzAxQlEySXNTVUZCU1N4WlFVRlpMRU5CUVVNN1RVRkRha0lzU1VGQlNTeFhRVUZYTEVOQlFVTTdUVUZEYUVJc1NVRkJTU3hOUVVGTkxFbEJRVWtzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4VlFVRlZMRXRCUVVzc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF6dEJRVU40UkN4TlFVRk5MRWxCUVVrc1IwRkJSeXhQUVVGUExFdEJRVXNzUjBGQlJ5eERRVUZETEVkQlFVY3NTMEZCU3l4SFFVRkhMRWxCUVVrc1EwRkJRenM3UVVGRk4wTXNUVUZCVFN4SlFVRkpMRWRCUVVjc1MwRkJTeXhEUVVGRExFVkJRVVVzUTBGQlF5eExRVUZMTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wMUJSVE5DTEZkQlFWY3NSMEZCUnl4VlFVRlZMRU5CUVVNN1VVRkRka0lzUjBGQlJ5eEZRVUZGTEVkQlFVYzdVVUZEVWl4TlFVRk5MRVZCUVVVc1RVRkJUVHRCUVVOMFFpeFBRVUZQTEVOQlFVTXNRMEZCUXpzN1RVRkZTQ3hSUVVGUkxFZEJRVWM3VVVGRFZDeFRRVUZUTEV0QlFVc3NWMEZCVnp0UlFVTjZRaXhIUVVGSExGZEJRVmNzUzBGQlN5eERRVUZETEVkQlFVYzdVVUZEZGtJc1IwRkJSeXhYUVVGWExFdEJRVXNzUTBGQlF5eEhRVUZITzFGQlEzWkNMRTlCUVU4c1QwRkJUeXhKUVVGSkxFTkJRVU1zYjBKQlFXOUNMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUlVGQlJTeExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRPMUZCUXpkRUxGbEJRVmtzUlVGQlJTeExRVUZMTzFGQlEyNUNMRTlCUVU4c1QwRkJUeXhQUVVGUE8wRkJRemRDTEU5QlFVOHNRMEZCUXpzN1RVRkZSaXhKUVVGSkxFTkJRVU1zU1VGQlNUdFJRVU5RTEc5Q1FVRkRMRTlCUVU4c1JVRkJRU3huUWtGQlFTeEhRVUZCTEVOQlFVVXNSMEZCUnl4UlFVRlRMRU5CUVVFc1EwRkJSeXhEUVVGQk8wRkJRMnBETEU5QlFVOHNRMEZCUXpzN1RVRkZSaXhKUVVGSkxFMUJRVTBzUlVGQlJUdFJRVU5XTEZkQlFWY3NSMEZCUnp0VlFVTmFMRk5CUVZNc1IwRkJSeXhIUVVGSE8xVkJRMllzUzBGQlN5eFBRVUZQTEV0QlFVczdWVUZEYWtJc1NVRkJTU3hSUVVGUkxFbEJRVWtzU1VGQlNTeEpRVUZKTEVOQlFVTXNSMEZCUnp0VlFVTTFRaXhKUVVGSkxGRkJRVkVzU1VGQlNTeEpRVUZKTEVsQlFVa3NRMEZCUXl4SFFVRkhPMVZCUXpWQ0xGRkJRVkVzU1VGQlNTeEpRVUZKTEVOQlFVTXNiMEpCUVc5Q08xVkJRM0pETEZWQlFWVXNSVUZCUlN4SlFVRkpMRU5CUVVNc1pVRkJaVHRWUVVOb1F5eEhRVUZITEZOQlFWTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1IwRkJSeXhUUVVGVE8xVkJRMnBETEVkQlFVY3NVMEZCVXl4WlFVRlpPMVZCUTNoQ0xGTkJRVk1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRk5CUVZNN1FVRkRNVU1zVTBGQlV5eERRVUZET3p0UlFVVkdMRWxCUVVrc1EwRkJReXhKUVVGSk8xVkJRMUFzYjBKQlFVTXNWVUZCVlN4RlFVRkJMR2RDUVVGQkxFZEJRVUVzUTBGQlJTeEhRVUZITEZkQlFXRXNRMEZCUVN4RlFVRkJPMWxCUXpOQ0xHOUNRVUZETEdWQlFXVXNSVUZCUVN4RFFVRkJMRU5CUVVNc1ZVRkJRU3hGUVVGVkxFTkJRVVVzU1VGQlNTeHBRa0ZCYVVJc1JVRkJSeXhEUVVGQkxFTkJRVWNzUTBGQlFUdFZRVU0zUXl4RFFVRkJPMU5CUTJRc1EwRkJRenRCUVVOV0xFOUJRVTg3TzAxQlJVUXNTVUZCU1N4SFFVRkhMRXRCUVVzc1EwRkJRenRCUVVOdVFpeExRVUZMTEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN08wbEJSVlFzVDBGQlR5eEpRVUZKTEVOQlFVTTdSMEZEWWp0RlFVTkVMRzlDUVVGdlFpeEZRVUZGTEZWQlFWVXNSMEZCUnl4RlFVRkZMRk5CUVZNc1JVRkJSVHRCUVVOc1JDeEpRVUZKTEVsQlFVa3NUMEZCVHl4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVlVGQlZTeERRVUZET3p0SlFVVndReXhKUVVGSkxFOUJRVThzUzBGQlN5eEhRVUZITEVWQlFVVTdUVUZEYmtJc1IwRkJSeXhIUVVGSExFbEJRVWtzUTBGQlF6dEJRVU5xUWl4TFFVRkxPenRKUVVWRUxFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTTdUVUZEV2l4VlFVRlZMRVZCUVVVc1IwRkJSenROUVVObUxGTkJRVk1zUjBGQlJ5eFRRVUZUTEV0QlFVc3NTVUZCU1R0TlFVTTVRaXhSUVVGUkxFbEJRVWtzUjBGQlJ5eEhRVUZITEU5QlFVOHNSMEZCUnl4SlFVRkpPMHRCUTJwRExFTkJRVU1zUTBGQlF6dEhRVU5LTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4WlFVRlpMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlFQnFjM2dnVW1WaFkzUXVSRTlOWEc0Z0tpOWNibHh1ZG1GeUlGUmliMlI1VjNKaGNIQmxjanRjYm5aaGNpQlNaV0ZqZENBZ0lDQWdJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KM0psWVdOMEp5azdYRzUyWVhJZ1FtRmphMkp2Ym1VZ0lDQWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDZGlZV05yWW05dVpTY3BPMXh1ZG1GeUlGTmpjbTlzYkdWeUlDQWdJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTR2TGk0dmRYUnBiSE12YzJOeWIyeHNaWEpmWTI5aGMzUmxjaWNwTzF4dWRtRnlJRkp2ZDBSbGRHRnBiSE1nSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duTGk5aFkzUnBkbVZmY205M1gyUmxkR0ZwYkhNdWFuTjRKeWs3WEc1MllYSWdRMkZ6WlVocGMzUnZjbmxXYVdWM0lDQWdQU0J5WlhGMWFYSmxLQ2N1TDJOaGMyVmZhR2x6ZEc5eWVTNXFjM2duS1R0Y2JuWmhjaUJJYVhOMGIzSjVRMjlzYkdWamRHbHZiaUE5SUhKbGNYVnBjbVVvSnk0dlkyRnpaVjlvYVhOMGIzSjVYMk52Ykd4bFkzUnBiMjRuS1R0Y2JuWmhjaUJNYVhOMFVtOTNJQ0FnSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dmJHbHpkRjl5YjNjdWFuTjRKeWs3WEc1MllYSWdZMnhoYzNOT1lXMWxjeUFnSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2RqYkdGemMyNWhiV1Z6SnlrN1hHNWNibFJpYjJSNVYzSmhjSEJsY2lBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNiaUFnY0hKdmNGUjVjR1Z6T2lCN1hHNGdJQ0FnYzNSdmNtVTZJRkpsWVdOMExsQnliM0JVZVhCbGN5NXBibk4wWVc1alpVOW1LRUpoWTJ0aWIyNWxMazF2WkdWc0tTNXBjMUpsY1hWcGNtVmtYRzRnSUgwc1hHNGdJRzFwZUdsdWN6b2dXMUpsWVdOMExtRmtaRzl1Y3k1UWRYSmxVbVZ1WkdWeVRXbDRhVzVkTEZ4dUlDQm5aWFJKYm1sMGFXRnNVM1JoZEdVNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2UxeHVJQ0FnSUNBZ1lXTjBhWFpsUTJGelpUb2diblZzYkN4Y2JpQWdJQ0FnSUcxcGJtbHRhWHBsWkRvZ0lHWmhiSE5sTEZ4dUlDQWdJQ0FnY0hKbGRtbHZkWE02SUNBZ2JuVnNiQ3hjYmlBZ0lDQWdJR2x1WTNKbGJXVnVkRG9nSUdaaGJITmxYRzRnSUNBZ2ZUdGNiaUFnZlN4Y2JpQWdZMjl0Y0c5dVpXNTBSR2xrVlhCa1lYUmxPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZG1GeUlHVnNaVzFsYm5Sek8xeHVJQ0FnSUhaaGNpQmhZM1JwZG1VZ1BTQjBhR2x6TG5OMFlYUmxMbUZqZEdsMlpVTmhjMlU3WEc1Y2JpQWdJQ0JwWmlBb0lTQmhZM1JwZG1VcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQmxiR1Z0Wlc1MGN5QTlJRnRjYmlBZ0lDQWdJSFJvYVhNdWNtVm1jMXRoWTNScGRtVmRMbWRsZEVSUFRVNXZaR1VvS1N4Y2JpQWdJQ0FnSUhSb2FYTXVjbVZtY3k1aFkzUnBkbVZEWVhObExtZGxkRVJQVFU1dlpHVW9LVnh1SUNBZ0lGMDdYRzVjYmlBZ0lDQlRZM0p2Ykd4bGNpaGxiR1Z0Wlc1MGN5d2dlM04wWlhCek9pQXlOVEI5S1R0Y2JpQWdmU3hjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2RtRnlJSEp2ZDNNZ1BTQjBhR2x6TGw5aWRXbHNaRkp2ZDNNb0tUdGNibHh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOGRHSnZaSGtnWTJ4aGMzTk9ZVzFsUFh0MGFHbHpMbkJ5YjNCekxtTnNZWE56VG1GdFpYMCtYRzRnSUNBZ0lDQWdJSHR5YjNkemZWeHVJQ0FnSUNBZ1BDOTBZbTlrZVQ1Y2JpQWdJQ0FwTzF4dUlDQjlMRnh1SUNCZlluVnBiR1JTYjNkek9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkbUZ5SUdSaGRHRWdJQ0FnUFNCYlhUdGNiaUFnSUNCMllYSWdjM1J2Y21VZ0lDQTlJSFJvYVhNdWNISnZjSE11YzNSdmNtVTdYRzRnSUNBZ2RtRnlJR05oYzJWeklDQWdQU0J6ZEc5eVpTNW5aWFFvSjJOaGMyVnpKeWs3WEc0Z0lDQWdkbUZ5SUdobFlXUnBibWNnUFNCemRHOXlaUzVuWlhRb0oyWnBjbk4wSnlrN1hHNGdJQ0FnZG1GeUlIQnlaWFlnSUNBZ1BTQnVkV3hzTzF4dUlDQWdJSFpoY2lCdVpYaDBJQ0FnSUQwZ2JuVnNiRHRjYmx4dUlDQWdJR05oYzJWekxtVmhZMmdvWm5WdVkzUnBiMjRnS0cxdlpHVnNMQ0JwYm1SbGVDa2dlMXh1SUNBZ0lDQWdkbUZ5SUdGamRHbDJaVkJ5YjNCek8xeHVJQ0FnSUNBZ2RtRnlJSEp2ZDFCeWIzQnpPMXh1SUNBZ0lDQWdkbUZ5SUhObGJHVmpkR1ZrWDNKdmR6dGNiaUFnSUNBZ0lIWmhjaUJqYkdGemMxOXVZVzFsY3p0Y2JpQWdJQ0FnSUhaaGNpQmhZM1JwZG1VZ0lEMGdkR2hwY3k1emRHRjBaUzVoWTNScGRtVkRZWE5sSUQwOVBTQnRiMlJsYkM1amFXUTdYRzRnSUNBZ0lDQjJZWElnYjJSa0lDQWdJQ0E5SUdsdVpHVjRJQ1VnTWlBL0lDZHZaR1FuSURvZ2JuVnNiRHRjYmx4dUlDQWdJQ0FnYm1WNGRDQTlJR05oYzJWekxtRjBLR2x1WkdWNElDc2dNU2s3WEc1Y2JpQWdJQ0FnSUdOc1lYTnpYMjVoYldWeklEMGdZMnhoYzNOT1lXMWxjeWg3WEc0Z0lDQWdJQ0FnSUc5a1pEb2diMlJrTEZ4dUlDQWdJQ0FnSUNCaFkzUnBkbVU2SUdGamRHbDJaVnh1SUNBZ0lDQWdmU2s3WEc1Y2JpQWdJQ0FnSUhKdmQxQnliM0J6SUQwZ2UxeHVJQ0FnSUNBZ0lDQmpiR0Z6YzA1aGJXVTZJQ0FnSUdOc1lYTnpYMjVoYldWekxGeHVJQ0FnSUNBZ0lDQnlaV1k2SUNBZ0lDQWdJQ0FnSUcxdlpHVnNMbU5wWkN4Y2JpQWdJQ0FnSUNBZ2EyVjVPaUFnSUNBZ0lDQWdJQ0J0YjJSbGJDNWphV1FzWEc0Z0lDQWdJQ0FnSUc5dVEyeHBZMnM2SUNBZ0lDQWdkR2hwY3k1ZmFHRnVaR3hsUTJGelpWTmxiR1ZqZEdsdmJpNWlhVzVrS0hSb2FYTXNJRzF2WkdWc0xtTnBaQ2tzWEc0Z0lDQWdJQ0FnSUcxaGJtRm5aV1JmWTJGelpUb2diVzlrWld3c1hHNGdJQ0FnSUNBZ0lHaGxZV1JwYm1jNklDQWdJQ0FnYUdWaFpHbHVaMXh1SUNBZ0lDQWdmVHRjYmx4dUlDQWdJQ0FnWkdGMFlTNXdkWE5vS0Z4dUlDQWdJQ0FnSUNBOFRHbHpkRkp2ZHlCN0xpNHVjbTkzVUhKdmNITjlJQzgrWEc0Z0lDQWdJQ0FwTzF4dVhHNGdJQ0FnSUNCcFppQW9ZV04wYVhabEtTQjdYRzRnSUNBZ0lDQWdJR0ZqZEdsMlpWQnliM0J6SUQwZ2UxeHVJQ0FnSUNBZ0lDQWdJR05zWVhOelRtRnRaVG9nSUc5a1pDeGNiaUFnSUNBZ0lDQWdJQ0J0YjJSbGJEb2dJQ0FnSUNCdGIyUmxiQ3hjYmlBZ0lDQWdJQ0FnSUNCd2NtVjJPaUFnSUNBZ0lDQndjbVYySUNZbUlIQnlaWFl1WTJsa0xGeHVJQ0FnSUNBZ0lDQWdJRzVsZUhRNklDQWdJQ0FnSUc1bGVIUWdKaVlnYm1WNGRDNWphV1FzWEc0Z0lDQWdJQ0FnSUNBZ2MzZHBkR05vWlhJNklDQWdkR2hwY3k1ZmFHRnVaR3hsUTJGelpWTmxiR1ZqZEdsdmJpeGNiaUFnSUNBZ0lDQWdJQ0J6YVhwbFZHOW5aMnhsT2lCMGFHbHpMbDkwYjJkbmJHVk5hVzVwYldsNlpTeGNiaUFnSUNBZ0lDQWdJQ0JyWlhrNklDQWdJQ0FnSUNCdGIyUmxiQzVqYVdRZ0t5QW5MV0ZqZEdsMlpTY3NYRzRnSUNBZ0lDQWdJQ0FnY21WbU9pQWdJQ0FnSUNBZ0oyRmpkR2wyWlVOaGMyVW5MRnh1SUNBZ0lDQWdJQ0FnSUcxcGJtbHRhWHBsWkRvZ0lIUm9hWE11YzNSaGRHVXViV2x1YVcxcGVtVmtYRzRnSUNBZ0lDQWdJSDA3WEc1Y2JpQWdJQ0FnSUNBZ1pHRjBZUzV3ZFhOb0tGeHVJQ0FnSUNBZ0lDQWdJRHhTYjNkRVpYUmhhV3h6SUhzdUxpNWhZM1JwZG1WUWNtOXdjMzArWEc0Z0lDQWdJQ0FnSUNBZ0lDQThRMkZ6WlVocGMzUnZjbmxXYVdWM0lHTnZiR3hsWTNScGIyNDllMjVsZHlCSWFYTjBiM0o1UTI5c2JHVmpkR2x2YmlncGZTQXZQbHh1SUNBZ0lDQWdJQ0FnSUR3dlVtOTNSR1YwWVdsc2N6NWNiaUFnSUNBZ0lDQWdLVHRjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnY0hKbGRpQTlJRzF2WkdWc08xeHVJQ0FnSUgwc0lIUm9hWE1wTzF4dVhHNGdJQ0FnY21WMGRYSnVJR1JoZEdFN1hHNGdJSDBzWEc0Z0lGOW9ZVzVrYkdWRFlYTmxVMlZzWldOMGFXOXVPaUJtZFc1amRHbHZiaUFvWTJsa0xDQnBibU55WlcxbGJuUXBJSHRjYmlBZ0lDQjJZWElnWTNWeWNtVnVkQ0E5SUhSb2FYTXVjM1JoZEdVdVlXTjBhWFpsUTJGelpUdGNibHh1SUNBZ0lHbG1JQ2hqZFhKeVpXNTBJRDA5UFNCamFXUXBJSHRjYmlBZ0lDQWdJR05wWkNBOUlHNTFiR3c3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdkR2hwY3k1elpYUlRkR0YwWlNoN1hHNGdJQ0FnSUNCaFkzUnBkbVZEWVhObE9pQmphV1FzWEc0Z0lDQWdJQ0JwYm1OeVpXMWxiblE2SUNCcGJtTnlaVzFsYm5RZ1BUMDlJSFJ5ZFdVc1hHNGdJQ0FnSUNCd2NtVjJhVzkxY3pvZ0lDQmphV1FnUHlCamRYSnlaVzUwSURvZ2JuVnNiRnh1SUNBZ0lIMHBPMXh1SUNCOUxGeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1ZHSnZaSGxYY21Gd2NHVnlPMXh1SWwxOSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgVGhXcmFwcGVyO1xudmFyIFRoICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvdGguanN4Jyk7XG52YXIgUmVhY3QgICAgICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBCYWNrYm9uZSAgICAgICAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xuXG5UaFdyYXBwZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGhXcmFwcGVyXCIsXG4gIHByb3BUeXBlczoge1xuICAgIHN0b3JlOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihCYWNrYm9uZS5Nb2RlbCkuaXNSZXF1aXJlZFxuICB9LFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5zdG9yZS50b0pTT04oKTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnByb3BzLnN0b3JlLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoc3RvcmUpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoc3RvcmUudG9KU09OKCkpO1xuICAgIH0sIHRoaXMpO1xuICB9LFxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHN0b3JlLm9mZignY2hhbmdlJywgbnVsbCwgdGhpcyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBuZXdfcHJvcHM7XG4gICAgdmFyIGRhdGEgICAgICA9IHRoaXMuc3RhdGU7XG5cbiAgICBuZXdfcHJvcHMgPSB7XG4gICAgICB0cmlnZ2VyU29ydDogICAgZGF0YS5zb3J0YWJsZSAmJiBkYXRhLm5hbWUgPyBkYXRhLm5hbWUgOiBudWxsLFxuICAgICAgc29ydERpcmVjdGlvbjogIGRhdGEuZGlyZWN0aW9uLFxuICAgICAgbWluaW1hbDogICAgICAgIGRhdGEubWluaW1hbCxcbiAgICAgIGxvY2tlZDogICAgICAgICBkYXRhLmxvY2tlZCxcbiAgICAgIHJlc2l6YWJsZTogICAgICBkYXRhLnJlc2l6YWJsZSxcbiAgICAgIHdpZHRoOiAgICAgICAgICBkYXRhLndpZHRoXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRoLCBSZWFjdC5fX3NwcmVhZCh7fSwgIHRoaXMucHJvcHMsICBuZXdfcHJvcHMpLCBcbiAgICAgICAgZGF0YS50aXRsZVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRoV3JhcHBlcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdlkyRnpaWE12ZEdoZmQzSmhjSEJsY2k1cWMzZ2lYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3TzBGQlJVRXNSMEZCUnpzN1FVRkZTQ3hKUVVGSkxGTkJRVk1zUTBGQlF6dEJRVU5rTEVsQlFVa3NSVUZCUlN4blFrRkJaMElzVDBGQlR5eERRVUZETEhsQ1FVRjVRaXhEUVVGRExFTkJRVU03UVVGRGVrUXNTVUZCU1N4TFFVRkxMR0ZCUVdFc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzBGQlEzWkRMRWxCUVVrc1VVRkJVU3hWUVVGVkxFOUJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXpzN1FVRkZNVU1zSzBKQlFTdENMSGxDUVVGQk8wVkJRemRDTEZOQlFWTXNSVUZCUlR0SlFVTlVMRXRCUVVzc1JVRkJSU3hMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEZWQlFWVXNRMEZCUXl4UlFVRlJMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zVlVGQlZUdEhRVU0zUkR0RlFVTkVMR1ZCUVdVc1JVRkJSU3haUVVGWk8wbEJRek5DTEU5QlFVOHNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTTdSMEZEYkVNN1JVRkRSQ3hwUWtGQmFVSXNSVUZCUlN4WlFVRlpPMGxCUXpkQ0xFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRMRVZCUVVVc1EwRkJReXhSUVVGUkxFVkJRVVVzVlVGQlZTeExRVUZMTEVWQlFVVTdUVUZETjBNc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1EwRkJRenRMUVVNdlFpeEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPMGRCUTFZN1JVRkRSQ3h2UWtGQmIwSXNSVUZCUlN4WlFVRlpPMGxCUTJoRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNVVUZCVVN4RlFVRkZMRWxCUVVrc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dEhRVU5xUXp0RlFVTkVMRTFCUVUwc1JVRkJSU3haUVVGWk8wbEJRMnhDTEVsQlFVa3NVMEZCVXl4RFFVRkRPMEZCUTJ4Q0xFbEJRVWtzU1VGQlNTeEpRVUZKTEZGQlFWRXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJRenM3U1VGRk0wSXNVMEZCVXl4SFFVRkhPMDFCUTFZc1YwRkJWeXhMUVVGTExFbEJRVWtzUTBGQlF5eFJRVUZSTEVsQlFVa3NTVUZCU1N4RFFVRkRMRWxCUVVrc1IwRkJSeXhKUVVGSkxFTkJRVU1zU1VGQlNTeEhRVUZITEVsQlFVazdUVUZETjBRc1lVRkJZU3hIUVVGSExFbEJRVWtzUTBGQlF5eFRRVUZUTzAxQlF6bENMRTlCUVU4c1UwRkJVeXhKUVVGSkxFTkJRVU1zVDBGQlR6dE5RVU0xUWl4TlFVRk5MRlZCUVZVc1NVRkJTU3hEUVVGRExFMUJRVTA3VFVGRE0wSXNVMEZCVXl4UFFVRlBMRWxCUVVrc1EwRkJReXhUUVVGVE8wMUJRemxDTEV0QlFVc3NWMEZCVnl4SlFVRkpMRU5CUVVNc1MwRkJTenRCUVVOb1F5eExRVUZMTEVOQlFVTTdPMGxCUlVZN1RVRkRSU3h2UWtGQlF5eEZRVUZGTEVWQlFVRXNaMEpCUVVFc1IwRkJRU3hEUVVGRkxFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NSVUZCUXl4RFFVRkZMRWRCUVVjc1UwRkJWeXhEUVVGQkxFVkJRVUU3VVVGRGFFTXNTVUZCU1N4RFFVRkRMRXRCUVUwN1RVRkRWQ3hEUVVGQk8wMUJRMHc3UjBGRFNEdEJRVU5JTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NVMEZCVXl4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlvcVhHNGdLaUJBYW5ONElGSmxZV04wTGtSUFRWeHVJQ292WEc1Y2JuWmhjaUJVYUZkeVlYQndaWEk3WEc1MllYSWdWR2dnSUNBZ0lDQWdJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTR2TGk0dlkyOXRjRzl1Wlc1MGN5OTBhQzVxYzNnbktUdGNiblpoY2lCU1pXRmpkQ0FnSUNBZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQ2NwTzF4dWRtRnlJRUpoWTJ0aWIyNWxJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KMkpoWTJ0aWIyNWxKeWs3WEc1Y2JsUm9WM0poY0hCbGNpQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ2NISnZjRlI1Y0dWek9pQjdYRzRnSUNBZ2MzUnZjbVU2SUZKbFlXTjBMbEJ5YjNCVWVYQmxjeTVwYm5OMFlXNWpaVTltS0VKaFkydGliMjVsTGsxdlpHVnNLUzVwYzFKbGNYVnBjbVZrWEc0Z0lIMHNYRzRnSUdkbGRFbHVhWFJwWVd4VGRHRjBaVG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxuQnliM0J6TG5OMGIzSmxMblJ2U2xOUFRpZ3BPMXh1SUNCOUxGeHVJQ0JqYjIxd2IyNWxiblJFYVdSTmIzVnVkRG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhSb2FYTXVjSEp2Y0hNdWMzUnZjbVV1YjI0b0oyTm9ZVzVuWlNjc0lHWjFibU4wYVc5dUlDaHpkRzl5WlNrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTV6WlhSVGRHRjBaU2h6ZEc5eVpTNTBiMHBUVDA0b0tTazdYRzRnSUNBZ2ZTd2dkR2hwY3lrN1hHNGdJSDBzWEc0Z0lHTnZiWEJ2Ym1WdWRGZHBiR3hWYm0xdmRXNTBPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnYzNSdmNtVXViMlptS0NkamFHRnVaMlVuTENCdWRXeHNMQ0IwYUdsektUdGNiaUFnZlN4Y2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkbUZ5SUc1bGQxOXdjbTl3Y3p0Y2JpQWdJQ0IyWVhJZ1pHRjBZU0FnSUNBZ0lEMGdkR2hwY3k1emRHRjBaVHRjYmx4dUlDQWdJRzVsZDE5d2NtOXdjeUE5SUh0Y2JpQWdJQ0FnSUhSeWFXZG5aWEpUYjNKME9pQWdJQ0JrWVhSaExuTnZjblJoWW14bElDWW1JR1JoZEdFdWJtRnRaU0EvSUdSaGRHRXVibUZ0WlNBNklHNTFiR3dzWEc0Z0lDQWdJQ0J6YjNKMFJHbHlaV04wYVc5dU9pQWdaR0YwWVM1a2FYSmxZM1JwYjI0c1hHNGdJQ0FnSUNCdGFXNXBiV0ZzT2lBZ0lDQWdJQ0FnWkdGMFlTNXRhVzVwYldGc0xGeHVJQ0FnSUNBZ2JHOWphMlZrT2lBZ0lDQWdJQ0FnSUdSaGRHRXViRzlqYTJWa0xGeHVJQ0FnSUNBZ2NtVnphWHBoWW14bE9pQWdJQ0FnSUdSaGRHRXVjbVZ6YVhwaFlteGxMRnh1SUNBZ0lDQWdkMmxrZEdnNklDQWdJQ0FnSUNBZ0lHUmhkR0V1ZDJsa2RHaGNiaUFnSUNCOU8xeHVYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4VWFDQjdMaTR1ZEdocGN5NXdjbTl3YzMwZ2V5NHVMbTVsZDE5d2NtOXdjMzArWEc0Z0lDQWdJQ0FnSUh0a1lYUmhMblJwZEd4bGZWeHVJQ0FnSUNBZ1BDOVVhRDVjYmlBZ0lDQXBPMXh1SUNCOVhHNTlLVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCVWFGZHlZWEJ3WlhJN1hHNGlYWDA9IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBUaGVhZDtcbnZhciBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEJhY2tib25lICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgVGggICAgICAgID0gcmVxdWlyZSgnLi90aF93cmFwcGVyLmpzeCcpO1xuXG5UaGVhZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUaGVhZFwiLFxuICBwcm9wVHlwZXM6IHtcbiAgICBzdG9yZTogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoQmFja2JvbmUuTW9kZWwpLmlzUmVxdWlyZWRcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbHMgPSB0aGlzLl9idWlsZENvbHVtbnMoKTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhlYWRcIiwge2NsYXNzTmFtZTogdGhpcy5wcm9wcy5jbGFzc05hbWV9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsIFxuICAgICAgICAgIGNvbHNcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIF9idWlsZENvbHVtbnM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGF0YTtcbiAgICB2YXIgY29sdW1ucyA9IFtdO1xuICAgIHZhciBzdG9yZSA9IHRoaXMucHJvcHMuc3RvcmU7XG4gICAgdmFyIGN1cnJlbnQgPSBzdG9yZS5nZXQoJ2ZpcnN0Jyk7XG5cbiAgICB3aGlsZSAoY3VycmVudCkge1xuICAgICAgZGF0YSAgICAgICAgICAgICAgPSB7fTtcbiAgICAgIGRhdGEuaGFuZGxlQ2xpY2sgID0gY3VycmVudC5nZXQoJ3NvcnRhYmxlJykgPyB0aGlzLl9zb3J0SGFuZGxlci5iaW5kKHRoaXMsIGN1cnJlbnQpIDogbnVsbDtcbiAgICAgIGRhdGEuc3RvcmUgICAgICAgID0gY3VycmVudDtcbiAgICAgIGRhdGEuY2xhc3NOYW1lICAgID0gY3VycmVudC5nZXQoJ3R5cGUnKSA9PT0gJ2Nhc2VfYWN0aW9ucycgPyAnYWN0aW9ucy1jb2wnIDogJyc7XG5cbiAgICAgIGNvbHVtbnMucHVzaChSZWFjdC5jcmVhdGVFbGVtZW50KFRoLCBSZWFjdC5fX3NwcmVhZCh7fSwgIGRhdGEsIHtrZXk6IGN1cnJlbnQuY2lkfSkpKTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbHVtbnM7XG4gIH0sXG4gIF9zb3J0SGFuZGxlcjogZnVuY3Rpb24gKHNvcnRlZSkge1xuICAgIHZhciBzdG9yZSAgID0gdGhpcy5wcm9wcy5zdG9yZTtcbiAgICB2YXIgY3VycmVudCA9IHN0b3JlLmdldCgnc29ydGVlJyk7XG5cbiAgICBpZiAoY3VycmVudC5jaWQgIT09IHNvcnRlZS5jaWQpIHtcbiAgICAgIGN1cnJlbnQuZW5kU29ydGluZygpO1xuICAgIH1cblxuICAgIHN0b3JlLnNldCgnc29ydGVlJywgc29ydGVlKTtcbiAgICBzb3J0ZWUudG9nZ2xlU29ydERpcmVjdGlvbigpO1xuXG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRoZWFkO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WTJGelpYTXZkR2hsWVdSZmQzSmhjSEJsY2k1cWMzZ2lYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3TzBGQlJVRXNSMEZCUnpzN1FVRkZTQ3hKUVVGSkxFdEJRVXNzUTBGQlF6dEJRVU5XTEVsQlFVa3NTMEZCU3l4UFFVRlBMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU5xUXl4SlFVRkpMRkZCUVZFc1NVRkJTU3hQUVVGUExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTTdRVUZEY0VNc1NVRkJTU3hGUVVGRkxGVkJRVlVzVDBGQlR5eERRVUZETEd0Q1FVRnJRaXhEUVVGRExFTkJRVU03TzBGQlJUVkRMREpDUVVFeVFpeHhRa0ZCUVR0RlFVTjZRaXhUUVVGVExFVkJRVVU3U1VGRFZDeExRVUZMTEVWQlFVVXNTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhWUVVGVkxFTkJRVU1zVVVGQlVTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRlZCUVZVN1IwRkROMFE3UlVGRFJDeE5RVUZOTEVWQlFVVXNXVUZCV1R0QlFVTjBRaXhKUVVGSkxFbEJRVWtzU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXl4aFFVRmhMRVZCUVVVc1EwRkJRenM3U1VGRmFFTTdUVUZEUlN4dlFrRkJRU3hQUVVGTkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVTBGQlZ5eERRVUZCTEVWQlFVRTdVVUZEZEVNc2IwSkJRVUVzU1VGQlJ5eEZRVUZCTEVsQlFVTXNSVUZCUVR0VlFVTkVMRWxCUVVzN1VVRkRTQ3hEUVVGQk8wMUJRME1zUTBGQlFUdE5RVU5TTzBkQlEwZzdSVUZEUkN4aFFVRmhMRVZCUVVVc1dVRkJXVHRKUVVONlFpeEpRVUZKTEVsQlFVa3NRMEZCUXp0SlFVTlVMRWxCUVVrc1QwRkJUeXhIUVVGSExFVkJRVVVzUTBGQlF6dEpRVU5xUWl4SlFVRkpMRXRCUVVzc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXp0QlFVTnFReXhKUVVGSkxFbEJRVWtzVDBGQlR5eEhRVUZITEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03TzBsQlJXcERMRTlCUVU4c1QwRkJUeXhGUVVGRk8wMUJRMlFzU1VGQlNTeG5Ra0ZCWjBJc1JVRkJSU3hEUVVGRE8wMUJRM1pDTEVsQlFVa3NRMEZCUXl4WFFVRlhMRWxCUVVrc1QwRkJUeXhEUVVGRExFZEJRVWNzUTBGQlF5eFZRVUZWTEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVWQlFVVXNUMEZCVHl4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRE8wMUJRek5HTEVsQlFVa3NRMEZCUXl4TFFVRkxMRlZCUVZVc1QwRkJUeXhEUVVGRE8wRkJRMnhETEUxQlFVMHNTVUZCU1N4RFFVRkRMRk5CUVZNc1RVRkJUU3hQUVVGUExFTkJRVU1zUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4TFFVRkxMR05CUVdNc1IwRkJSeXhoUVVGaExFZEJRVWNzUlVGQlJTeERRVUZET3p0TlFVVm9SaXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEc5Q1FVRkRMRVZCUVVVc1JVRkJRU3huUWtGQlFTeEhRVUZCTEVOQlFVVXNSMEZCUnl4SlFVRkpMRVZCUVVNc1EwRkJReXhEUVVGQkxFZEJRVUVzUlVGQlJ5eERRVUZGTEU5QlFVOHNRMEZCUXl4SFFVRkpMRU5CUVVFc1EwRkJRU3hEUVVGSExFTkJRVUVzUTBGQlF5eERRVUZETzAxQlEycEVMRTlCUVU4c1IwRkJSeXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETzBGQlF6ZENMRXRCUVVzN08wbEJSVVFzVDBGQlR5eFBRVUZQTEVOQlFVTTdSMEZEYUVJN1JVRkRSQ3haUVVGWkxFVkJRVVVzVlVGQlZTeE5RVUZOTEVWQlFVVTdTVUZET1VJc1NVRkJTU3hMUVVGTExFdEJRVXNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNN1FVRkRia01zU1VGQlNTeEpRVUZKTEU5QlFVOHNSMEZCUnl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZET3p0SlFVVnNReXhKUVVGSkxFOUJRVThzUTBGQlF5eEhRVUZITEV0QlFVc3NUVUZCVFN4RFFVRkRMRWRCUVVjc1JVRkJSVHROUVVNNVFpeFBRVUZQTEVOQlFVTXNWVUZCVlN4RlFVRkZMRU5CUVVNN1FVRkRNMElzUzBGQlN6czdTVUZGUkN4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExGRkJRVkVzUlVGQlJTeE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVTm9ReXhKUVVGSkxFMUJRVTBzUTBGQlF5eHRRa0ZCYlVJc1JVRkJSU3hEUVVGRE96dEhRVVU1UWp0QlFVTklMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZJTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1MwRkJTeXhEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeW9xWEc0Z0tpQkFhbk40SUZKbFlXTjBMa1JQVFZ4dUlDb3ZYRzVjYm5aaGNpQlVhR1ZoWkR0Y2JuWmhjaUJTWldGamRDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQ2NwTzF4dWRtRnlJRUpoWTJ0aWIyNWxJQ0E5SUhKbGNYVnBjbVVvSjJKaFkydGliMjVsSnlrN1hHNTJZWElnVkdnZ0lDQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpOTBhRjkzY21Gd2NHVnlMbXB6ZUNjcE8xeHVYRzVVYUdWaFpDQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ2NISnZjRlI1Y0dWek9pQjdYRzRnSUNBZ2MzUnZjbVU2SUZKbFlXTjBMbEJ5YjNCVWVYQmxjeTVwYm5OMFlXNWpaVTltS0VKaFkydGliMjVsTGsxdlpHVnNLUzVwYzFKbGNYVnBjbVZrWEc0Z0lIMHNYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQmpiMnh6SUQwZ2RHaHBjeTVmWW5WcGJHUkRiMngxYlc1ektDazdYRzVjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BIUm9aV0ZrSUdOc1lYTnpUbUZ0WlQxN2RHaHBjeTV3Y205d2N5NWpiR0Z6YzA1aGJXVjlQbHh1SUNBZ0lDQWdJQ0E4ZEhJK1hHNGdJQ0FnSUNBZ0lDQWdlMk52YkhOOVhHNGdJQ0FnSUNBZ0lEd3ZkSEkrWEc0Z0lDQWdJQ0E4TDNSb1pXRmtQbHh1SUNBZ0lDazdYRzRnSUgwc1hHNGdJRjlpZFdsc1pFTnZiSFZ0Ym5NNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnWkdGMFlUdGNiaUFnSUNCMllYSWdZMjlzZFcxdWN5QTlJRnRkTzF4dUlDQWdJSFpoY2lCemRHOXlaU0E5SUhSb2FYTXVjSEp2Y0hNdWMzUnZjbVU3WEc0Z0lDQWdkbUZ5SUdOMWNuSmxiblFnUFNCemRHOXlaUzVuWlhRb0oyWnBjbk4wSnlrN1hHNWNiaUFnSUNCM2FHbHNaU0FvWTNWeWNtVnVkQ2tnZTF4dUlDQWdJQ0FnWkdGMFlTQWdJQ0FnSUNBZ0lDQWdJQ0FnUFNCN2ZUdGNiaUFnSUNBZ0lHUmhkR0V1YUdGdVpHeGxRMnhwWTJzZ0lEMGdZM1Z5Y21WdWRDNW5aWFFvSjNOdmNuUmhZbXhsSnlrZ1B5QjBhR2x6TGw5emIzSjBTR0Z1Wkd4bGNpNWlhVzVrS0hSb2FYTXNJR04xY25KbGJuUXBJRG9nYm5Wc2JEdGNiaUFnSUNBZ0lHUmhkR0V1YzNSdmNtVWdJQ0FnSUNBZ0lEMGdZM1Z5Y21WdWREdGNiaUFnSUNBZ0lHUmhkR0V1WTJ4aGMzTk9ZVzFsSUNBZ0lEMGdZM1Z5Y21WdWRDNW5aWFFvSjNSNWNHVW5LU0E5UFQwZ0oyTmhjMlZmWVdOMGFXOXVjeWNnUHlBbllXTjBhVzl1Y3kxamIyd25JRG9nSnljN1hHNWNiaUFnSUNBZ0lHTnZiSFZ0Ym5NdWNIVnphQ2c4VkdnZ2V5NHVMbVJoZEdGOUlHdGxlVDE3WTNWeWNtVnVkQzVqYVdSOUlDOCtLVHRjYmlBZ0lDQWdJR04xY25KbGJuUWdQU0JqZFhKeVpXNTBMbTVsZUhRN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnY21WMGRYSnVJR052YkhWdGJuTTdYRzRnSUgwc1hHNGdJRjl6YjNKMFNHRnVaR3hsY2pvZ1puVnVZM1JwYjI0Z0tITnZjblJsWlNrZ2UxeHVJQ0FnSUhaaGNpQnpkRzl5WlNBZ0lEMGdkR2hwY3k1d2NtOXdjeTV6ZEc5eVpUdGNiaUFnSUNCMllYSWdZM1Z5Y21WdWRDQTlJSE4wYjNKbExtZGxkQ2duYzI5eWRHVmxKeWs3WEc1Y2JpQWdJQ0JwWmlBb1kzVnljbVZ1ZEM1amFXUWdJVDA5SUhOdmNuUmxaUzVqYVdRcElIdGNiaUFnSUNBZ0lHTjFjbkpsYm5RdVpXNWtVMjl5ZEdsdVp5Z3BPMXh1SUNBZ0lIMWNibHh1SUNBZ0lITjBiM0psTG5ObGRDZ25jMjl5ZEdWbEp5d2djMjl5ZEdWbEtUdGNiaUFnSUNCemIzSjBaV1V1ZEc5bloyeGxVMjl5ZEVScGNtVmpkR2x2YmlncE8xeHVYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUZSb1pXRmtPMXh1SWwxOSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgQnV0dG9uICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9idXR0b24uanN4Jyk7XG52YXIgSWNvbiAgICAgID0gcmVxdWlyZSgnLi9pY29uX3dyYXBwZXIuanN4Jyk7XG52YXIgbW9tZW50ICAgID0gcmVxdWlyZSgnbW9tZW50Jyk7XG52YXIgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMnKTtcblxuLyoqXG4gKiBFYWNoIHRyYW5zZm9ybWVyIHNob3VsZCB0YWtlIGNhc2UgYW5kIGF0dHJfbmFtZSBwYXJhbXNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNhc2VfZGV0YWlsczogZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgdmFyIHR5cGUgICAgPSBtb2RlbC5nZXQoJ3R5cGUnKTtcbiAgICB2YXIgYXNzZXQgICA9IG1vZGVsLmdldCgnZGV2aWNlJyk7XG4gICAgdmFyIHN1YnR5cGUgPSBtb2RlbC5nZXQoJ3N1YnR5cGUnKTtcbiAgICB2YXIgdGl0bGUgICA9IHR5cGUgKyAnOiAnICsgYXNzZXQgKyAnICgnICsgc3VidHlwZSArICcpJztcbiAgICB2YXIgdXBkYXRlZCA9IG1vbWVudChtb2RlbC5nZXQoJ3VwZGF0ZWRfZGF0ZScpKS5mb3JtYXQoY29uc3RhbnRzLkRBVEVfRk9STUFUKTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIHRpdGxlKSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwibXV0ZWQgc21hbGxcIn0sIFwiTGFzdCB1cGRhdGU6IFwiLCB1cGRhdGVkKSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtjbGFzc05hbWU6IFwiZmVhdXgtYnV0dG9uIHNtYWxsXCJ9LCBcIkRldGFpbHNcIilcbiAgICAgIClcbiAgICApXG4gIH0sXG4gIHN0YXR1czogZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgdmFyIHN0YXR1cyAgPSBtb2RlbC5nZXQoJ3N0YXR1cycpO1xuICAgIHZhciBwcm9wcyAgID0ge1xuICAgICAgdHlwZTogICAgICAgc3RhdHVzLFxuICAgICAgY2xhc3NOYW1lOiAgc3RhdHVzID09PSAnY2xvc2VkJyA/ICdtdXRlZCcgOiAnJ1xuICAgIH07XG5cbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwgUmVhY3QuX19zcHJlYWQoe30sICBwcm9wcykpKTtcbiAgfSxcbiAgY2FzZV9yZXBvcnRlZDogZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgdmFyIHJlcG9ydGVyICA9IG1vZGVsLmdldCgncmVwb3J0ZXInKTtcbiAgICB2YXIgY3JlYXRlZCAgID0gbW9tZW50KG1vZGVsLmdldCgnY3JlYXRlZF9kYXRlJykpLmZvcm1hdChjb25zdGFudHMuREFURV9GT1JNQVQpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgcmVwb3J0ZXIpLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJtdXRlZCBzbWFsbFwifSwgY3JlYXRlZClcbiAgICAgIClcbiAgICApXG4gIH0sXG4gIGNhc2VfYXNzaWdubWVudDogZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgdmFyIGFzc2lnbm1lbnRzID0gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwibm9kYXRhXCJ9LCBcIk5vIGFzc2lnbm1lbnRcIikpO1xuICAgIHZhciBncm91cCAgICAgICA9IG1vZGVsLmdldCgnYXNzaWduZWRfZ3JvdXAnKTtcbiAgICB2YXIgcGVyc29uICAgICAgPSBtb2RlbC5nZXQoJ2Fzc2lnbmVkX3BlcnNvbicpO1xuXG4gICAgaWYgKGdyb3VwIHx8IHBlcnNvbikge1xuICAgICAgYXNzaWdubWVudHMgPSBbXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2tleTogXCJncm91cFwifSwgZ3JvdXApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtrZXk6IFwicGVyc29uXCJ9LCBwZXJzb24pXG4gICAgICBdO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgICAgICBhc3NpZ25tZW50c1xuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIHByaW9yaXR5OiBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICB2YXIgcHJpb3JpdHkgICAgPSBtb2RlbC5nZXQoJ3ByaW9yaXR5Jyk7XG4gICAgdmFyIGNsYXNzX25hbWVzID0gWydwcmlvcml0eScsICdwcmlvcml0eS0nICsgcHJpb3JpdHldO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IGNsYXNzX25hbWVzLmpvaW4oJyAnKX0sIFxuICAgICAgICBwcmlvcml0eVxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIGNhc2VfYWN0aW9uczogZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgdmFyIGJ1dHRvbiA9IChSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcIm5vZGF0YVwifSwgXCJOb25lIGF2YWlsYWJsZVwiKSk7XG5cbiAgICBpZiAobW9kZWwuZ2V0KCdyZXBvcnRlcicpICE9PSAnQnJpYW4nKSB7XG4gICAgICByZXR1cm4gYnV0dG9uO1xuICAgIH1cblxuICAgIGlmIChtb2RlbC5nZXQoJ3N0YXR1cycpID09PSAnY2xvc2VkJykge1xuICAgICAgcmV0dXJuIGJ1dHRvbjtcbiAgICB9XG5cbiAgICBidXR0b24gPSAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwge2ljb246IFwicGx1c1wiLCB0ZXh0OiBcIkNsb3NlIGNhc2VcIiwgb25DbGljazogdGhpcy5fY2xvc2VDYXNlfSlcbiAgICApO1xuXG4gICAgcmV0dXJuIGJ1dHRvbjtcbiAgfVxufTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdlkyRnpaWE12ZEhKaGJuTm1iM0p0WlhKekxtcHplQ0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVRzN1FVRkZRU3hIUVVGSE96dEJRVVZJTEVsQlFVa3NUVUZCVFN4TlFVRk5MRTlCUVU4c1EwRkJReXcyUWtGQk5rSXNRMEZCUXl4RFFVRkRPMEZCUTNaRUxFbEJRVWtzU1VGQlNTeFJRVUZSTEU5QlFVOHNRMEZCUXl4dlFrRkJiMElzUTBGQlF5eERRVUZETzBGQlF6bERMRWxCUVVrc1RVRkJUU3hOUVVGTkxFOUJRVThzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0QlFVTnNReXhKUVVGSkxFdEJRVXNzVDBGQlR5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1FVRkRha01zU1VGQlNTeFRRVUZUTEVkQlFVY3NUMEZCVHl4RFFVRkRMR2xDUVVGcFFpeERRVUZETEVOQlFVTTdPMEZCUlRORE96dEhRVVZITzBGQlEwZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSenRGUVVObUxGbEJRVmtzUlVGQlJTeFZRVUZWTEV0QlFVc3NSVUZCUlR0SlFVTTNRaXhKUVVGSkxFbEJRVWtzVFVGQlRTeExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRE8wbEJRMmhETEVsQlFVa3NTMEZCU3l4TFFVRkxMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdTVUZEYkVNc1NVRkJTU3hQUVVGUExFZEJRVWNzUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRKUVVOdVF5eEpRVUZKTEV0QlFVc3NTMEZCU3l4SlFVRkpMRWRCUVVjc1NVRkJTU3hIUVVGSExFdEJRVXNzUjBGQlJ5eEpRVUZKTEVkQlFVY3NUMEZCVHl4SFFVRkhMRWRCUVVjc1EwRkJRenRCUVVNM1JDeEpRVUZKTEVsQlFVa3NUMEZCVHl4SFFVRkhMRTFCUVUwc1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEdOQlFXTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1RVRkJUU3hEUVVGRExGTkJRVk1zUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUXpzN1NVRkZPVVU3VFVGRFJTeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1NVRkJReXhGUVVGQk8xRkJRMGdzYjBKQlFVRXNTMEZCU1N4RlFVRkJMRWxCUVVNc1JVRkJReXhMUVVGWkxFTkJRVUVzUlVGQlFUdFJRVU5zUWl4dlFrRkJRU3hOUVVGTExFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMR0ZCUVdNc1EwRkJRU3hGUVVGQkxHVkJRVUVzUlVGQll5eFBRVUZsTEVOQlFVRXNSVUZCUVR0UlFVTXpSQ3h2UWtGQlFTeEhRVUZGTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExHOUNRVUZ4UWl4RFFVRkJMRVZCUVVFc1UwRkJWeXhEUVVGQk8wMUJRM3BETEVOQlFVRTdTMEZEVUR0SFFVTkdPMFZCUTBRc1RVRkJUU3hGUVVGRkxGVkJRVlVzUzBGQlN5eEZRVUZGTzBsQlEzWkNMRWxCUVVrc1RVRkJUU3hKUVVGSkxFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1NVRkRiRU1zU1VGQlNTeExRVUZMTEV0QlFVczdUVUZEV2l4SlFVRkpMRkZCUVZFc1RVRkJUVHROUVVOc1FpeFRRVUZUTEVkQlFVY3NUVUZCVFN4TFFVRkxMRkZCUVZFc1IwRkJSeXhQUVVGUExFZEJRVWNzUlVGQlJUdEJRVU53UkN4TFFVRkxMRU5CUVVNN08wbEJSVVlzVVVGQlVTeHZRa0ZCUXl4SlFVRkpMRVZCUVVFc1owSkJRVUVzUjBGQlFTeERRVUZGTEVkQlFVY3NTMEZCVFN4RFFVRkJMRU5CUVVjc1EwRkJRU3hGUVVGRk8wZEJRemxDTzBWQlEwUXNZVUZCWVN4RlFVRkZMRlZCUVZVc1MwRkJTeXhGUVVGRk8wbEJRemxDTEVsQlFVa3NVVUZCVVN4SlFVRkpMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTTdRVUZETVVNc1NVRkJTU3hKUVVGSkxFOUJRVThzUzBGQlN5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhqUVVGakxFTkJRVU1zUTBGQlF5eERRVUZETEUxQlFVMHNRMEZCUXl4VFFVRlRMRU5CUVVNc1YwRkJWeXhEUVVGRExFTkJRVU03TzBsQlJXaEdPMDFCUTBVc2IwSkJRVUVzUzBGQlNTeEZRVUZCTEVsQlFVTXNSVUZCUVR0UlFVTklMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeEpRVUZETEVWQlFVTXNVVUZCWlN4RFFVRkJMRVZCUVVFN1VVRkRja0lzYjBKQlFVRXNUVUZCU3l4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eGhRVUZqTEVOQlFVRXNSVUZCUXl4UFFVRmxMRU5CUVVFN1RVRkRNVU1zUTBGQlFUdExRVU5RTzBkQlEwWTdSVUZEUkN4bFFVRmxMRVZCUVVVc1ZVRkJWU3hMUVVGTExFVkJRVVU3U1VGRGFFTXNTVUZCU1N4WFFVRlhMRWxCUVVrc2IwSkJRVUVzVFVGQlN5eEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhSUVVGVExFTkJRVUVzUlVGQlFTeGxRVUZ2UWl4RFFVRkJMRU5CUVVNc1EwRkJRenRKUVVOc1JTeEpRVUZKTEV0QlFVc3NVMEZCVXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExHZENRVUZuUWl4RFFVRkRMRU5CUVVNN1FVRkRiRVFzU1VGQlNTeEpRVUZKTEUxQlFVMHNVVUZCVVN4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExHbENRVUZwUWl4RFFVRkRMRU5CUVVNN08wbEJSUzlETEVsQlFVa3NTMEZCU3l4SlFVRkpMRTFCUVUwc1JVRkJSVHROUVVOdVFpeFhRVUZYTEVkQlFVYzdVVUZEV2l4dlFrRkJRU3hMUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEVkQlFVRXNSVUZCUnl4RFFVRkRMRTlCUVZFc1EwRkJRU3hGUVVGRExFdEJRVmtzUTBGQlFUdFJRVU01UWl4dlFrRkJRU3hMUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEVkQlFVRXNSVUZCUnl4RFFVRkRMRkZCUVZNc1EwRkJRU3hGUVVGRExFMUJRV0VzUTBGQlFUdFBRVU5xUXl4RFFVRkRPMEZCUTFJc1MwRkJTenM3U1VGRlJEdE5RVU5GTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hKUVVGRExFVkJRVUU3VVVGRFJpeFhRVUZaTzAxQlExUXNRMEZCUVR0TlFVTk9PMGRCUTBnN1JVRkRSQ3hSUVVGUkxFVkJRVVVzVlVGQlZTeExRVUZMTEVWQlFVVTdTVUZEZWtJc1NVRkJTU3hSUVVGUkxFMUJRVTBzUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJRenRCUVVNMVF5eEpRVUZKTEVsQlFVa3NWMEZCVnl4SFFVRkhMRU5CUVVNc1ZVRkJWU3hGUVVGRkxGZEJRVmNzUjBGQlJ5eFJRVUZSTEVOQlFVTXNRMEZCUXpzN1NVRkZka1E3VFVGRFJTeHZRa0ZCUVN4TlFVRkxMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZGTEZkQlFWY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGSExFTkJRVUVzUlVGQlFUdFJRVU55UXl4UlFVRlRPMDFCUTB3c1EwRkJRVHROUVVOUU8wZEJRMGc3UlVGRFJDeFpRVUZaTEVWQlFVVXNWVUZCVlN4TFFVRkxMRVZCUVVVN1FVRkRha01zU1VGQlNTeEpRVUZKTEUxQlFVMHNTVUZCU1N4dlFrRkJRU3hOUVVGTExFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRkZCUVZNc1EwRkJRU3hGUVVGQkxHZENRVUZ4UWl4RFFVRkJMRU5CUVVNc1EwRkJRenM3U1VGRk9VUXNTVUZCU1N4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVlVzUTBGQlF5eExRVUZMTEU5QlFVOHNSVUZCUlR0TlFVTnlReXhQUVVGUExFMUJRVTBzUTBGQlF6dEJRVU53UWl4TFFVRkxPenRKUVVWRUxFbEJRVWtzUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4UlFVRlJMRU5CUVVNc1MwRkJTeXhSUVVGUkxFVkJRVVU3VFVGRGNFTXNUMEZCVHl4TlFVRk5MRU5CUVVNN1FVRkRjRUlzUzBGQlN6czdTVUZGUkN4TlFVRk5PMDFCUTBvc2IwSkJRVU1zVFVGQlRTeEZRVUZCTEVOQlFVRXNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJReXhOUVVGQkxFVkJRVTBzUTBGQlF5eEpRVUZCTEVWQlFVa3NRMEZCUXl4WlFVRkJMRVZCUVZrc1EwRkJReXhQUVVGQkxFVkJRVThzUTBGQlJTeEpRVUZKTEVOQlFVTXNWVUZCVnl4RFFVRkJMRU5CUVVjc1EwRkJRVHRCUVVONFJTeExRVUZMTEVOQlFVTTdPMGxCUlVZc1QwRkJUeXhOUVVGTkxFTkJRVU03UjBGRFpqdERRVU5HTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRUoxZEhSdmJpQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dUx5NHVMMk52YlhCdmJtVnVkSE12WW5WMGRHOXVMbXB6ZUNjcE8xeHVkbUZ5SUVsamIyNGdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHZhV052Ymw5M2NtRndjR1Z5TG1wemVDY3BPMXh1ZG1GeUlHMXZiV1Z1ZENBZ0lDQTlJSEpsY1hWcGNtVW9KMjF2YldWdWRDY3BPMXh1ZG1GeUlGSmxZV04wSUNBZ0lDQTlJSEpsY1hWcGNtVW9KM0psWVdOMEp5azdYRzUyWVhJZ1kyOXVjM1JoYm5SeklEMGdjbVZ4ZFdseVpTZ25MaTR2TGk0dlkyOXVjM1JoYm5Sekp5azdYRzVjYmk4cUtseHVJQ29nUldGamFDQjBjbUZ1YzJadmNtMWxjaUJ6YUc5MWJHUWdkR0ZyWlNCallYTmxJR0Z1WkNCaGRIUnlYMjVoYldVZ2NHRnlZVzF6WEc0Z0tpOWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdlMXh1SUNCallYTmxYMlJsZEdGcGJITTZJR1oxYm1OMGFXOXVJQ2h0YjJSbGJDa2dlMXh1SUNBZ0lIWmhjaUIwZVhCbElDQWdJRDBnYlc5a1pXd3VaMlYwS0NkMGVYQmxKeWs3WEc0Z0lDQWdkbUZ5SUdGemMyVjBJQ0FnUFNCdGIyUmxiQzVuWlhRb0oyUmxkbWxqWlNjcE8xeHVJQ0FnSUhaaGNpQnpkV0owZVhCbElEMGdiVzlrWld3dVoyVjBLQ2R6ZFdKMGVYQmxKeWs3WEc0Z0lDQWdkbUZ5SUhScGRHeGxJQ0FnUFNCMGVYQmxJQ3NnSnpvZ0p5QXJJR0Z6YzJWMElDc2dKeUFvSnlBcklITjFZblI1Y0dVZ0t5QW5LU2M3WEc0Z0lDQWdkbUZ5SUhWd1pHRjBaV1FnUFNCdGIyMWxiblFvYlc5a1pXd3VaMlYwS0NkMWNHUmhkR1ZrWDJSaGRHVW5LU2t1Wm05eWJXRjBLR052Ym5OMFlXNTBjeTVFUVZSRlgwWlBVazFCVkNrN1hHNWNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEdScGRqNWNiaUFnSUNBZ0lDQWdQR1JwZGo1N2RHbDBiR1Y5UEM5a2FYWStYRzRnSUNBZ0lDQWdJRHh6Y0dGdUlHTnNZWE56VG1GdFpUMWNJbTExZEdWa0lITnRZV3hzWENJK1RHRnpkQ0IxY0dSaGRHVTZJSHQxY0dSaGRHVmtmVHd2YzNCaGJqNWNiaUFnSUNBZ0lDQWdQR0VnWTJ4aGMzTk9ZVzFsUFZ3aVptVmhkWGd0WW5WMGRHOXVJSE50WVd4c1hDSStSR1YwWVdsc2N6d3ZZVDVjYmlBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNsY2JpQWdmU3hjYmlBZ2MzUmhkSFZ6T2lCbWRXNWpkR2x2YmlBb2JXOWtaV3dwSUh0Y2JpQWdJQ0IyWVhJZ2MzUmhkSFZ6SUNBOUlHMXZaR1ZzTG1kbGRDZ25jM1JoZEhWekp5azdYRzRnSUNBZ2RtRnlJSEJ5YjNCeklDQWdQU0I3WEc0Z0lDQWdJQ0IwZVhCbE9pQWdJQ0FnSUNCemRHRjBkWE1zWEc0Z0lDQWdJQ0JqYkdGemMwNWhiV1U2SUNCemRHRjBkWE1nUFQwOUlDZGpiRzl6WldRbklEOGdKMjExZEdWa0p5QTZJQ2NuWEc0Z0lDQWdmVHRjYmx4dUlDQWdJSEpsZEhWeWJpQW9QRWxqYjI0Z2V5NHVMbkJ5YjNCemZTQXZQaWs3WEc0Z0lIMHNYRzRnSUdOaGMyVmZjbVZ3YjNKMFpXUTZJR1oxYm1OMGFXOXVJQ2h0YjJSbGJDa2dlMXh1SUNBZ0lIWmhjaUJ5WlhCdmNuUmxjaUFnUFNCdGIyUmxiQzVuWlhRb0ozSmxjRzl5ZEdWeUp5azdYRzRnSUNBZ2RtRnlJR055WldGMFpXUWdJQ0E5SUcxdmJXVnVkQ2h0YjJSbGJDNW5aWFFvSjJOeVpXRjBaV1JmWkdGMFpTY3BLUzVtYjNKdFlYUW9ZMjl1YzNSaGJuUnpMa1JCVkVWZlJrOVNUVUZVS1R0Y2JseHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4WkdsMlBseHVJQ0FnSUNBZ0lDQThaR2wyUG50eVpYQnZjblJsY24wOEwyUnBkajVjYmlBZ0lDQWdJQ0FnUEhOd1lXNGdZMnhoYzNOT1lXMWxQVndpYlhWMFpXUWdjMjFoYkd4Y0lqNTdZM0psWVhSbFpIMDhMM053WVc0K1hHNGdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQXBYRzRnSUgwc1hHNGdJR05oYzJWZllYTnphV2R1YldWdWREb2dablZ1WTNScGIyNGdLRzF2WkdWc0tTQjdYRzRnSUNBZ2RtRnlJR0Z6YzJsbmJtMWxiblJ6SUQwZ0tEeHpjR0Z1SUdOc1lYTnpUbUZ0WlQxY0ltNXZaR0YwWVZ3aVBrNXZJR0Z6YzJsbmJtMWxiblE4TDNOd1lXNCtLVHRjYmlBZ0lDQjJZWElnWjNKdmRYQWdJQ0FnSUNBZ1BTQnRiMlJsYkM1blpYUW9KMkZ6YzJsbmJtVmtYMmR5YjNWd0p5azdYRzRnSUNBZ2RtRnlJSEJsY25OdmJpQWdJQ0FnSUQwZ2JXOWtaV3d1WjJWMEtDZGhjM05wWjI1bFpGOXdaWEp6YjI0bktUdGNibHh1SUNBZ0lHbG1JQ2huY205MWNDQjhmQ0J3WlhKemIyNHBJSHRjYmlBZ0lDQWdJR0Z6YzJsbmJtMWxiblJ6SUQwZ1cxeHVJQ0FnSUNBZ0lDQThaR2wySUd0bGVUMG5aM0p2ZFhBblBudG5jbTkxY0gwOEwyUnBkajRzWEc0Z0lDQWdJQ0FnSUR4a2FYWWdhMlY1UFNkd1pYSnpiMjRuUG50d1pYSnpiMjU5UEM5a2FYWStYRzRnSUNBZ0lDQmRPMXh1SUNBZ0lIMWNibHh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOFpHbDJQbHh1SUNBZ0lDQWdJQ0I3WVhOemFXZHViV1Z1ZEhOOVhHNGdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQXBPMXh1SUNCOUxGeHVJQ0J3Y21sdmNtbDBlVG9nWm5WdVkzUnBiMjRnS0cxdlpHVnNLU0I3WEc0Z0lDQWdkbUZ5SUhCeWFXOXlhWFI1SUNBZ0lEMGdiVzlrWld3dVoyVjBLQ2R3Y21sdmNtbDBlU2NwTzF4dUlDQWdJSFpoY2lCamJHRnpjMTl1WVcxbGN5QTlJRnNuY0hKcGIzSnBkSGtuTENBbmNISnBiM0pwZEhrdEp5QXJJSEJ5YVc5eWFYUjVYVHRjYmx4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThjM0JoYmlCamJHRnpjMDVoYldVOWUyTnNZWE56WDI1aGJXVnpMbXB2YVc0b0p5QW5LWDArWEc0Z0lDQWdJQ0FnSUh0d2NtbHZjbWwwZVgxY2JpQWdJQ0FnSUR3dmMzQmhiajVjYmlBZ0lDQXBPMXh1SUNCOUxGeHVJQ0JqWVhObFgyRmpkR2x2Ym5NNklHWjFibU4wYVc5dUlDaHRiMlJsYkNrZ2UxeHVJQ0FnSUhaaGNpQmlkWFIwYjI0Z1BTQW9QSE53WVc0Z1kyeGhjM05PWVcxbFBWd2libTlrWVhSaFhDSStUbTl1WlNCaGRtRnBiR0ZpYkdVOEwzTndZVzQrS1R0Y2JseHVJQ0FnSUdsbUlDaHRiMlJsYkM1blpYUW9KM0psY0c5eWRHVnlKeWtnSVQwOUlDZENjbWxoYmljcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCaWRYUjBiMjQ3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdhV1lnS0cxdlpHVnNMbWRsZENnbmMzUmhkSFZ6SnlrZ1BUMDlJQ2RqYkc5elpXUW5LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdZblYwZEc5dU8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdKMWRIUnZiaUE5SUNoY2JpQWdJQ0FnSUR4Q2RYUjBiMjRnYVdOdmJqMWNJbkJzZFhOY0lpQjBaWGgwUFZ3aVEyeHZjMlVnWTJGelpWd2lJRzl1UTJ4cFkyczllM1JvYVhNdVgyTnNiM05sUTJGelpYMGdMejVjYmlBZ0lDQXBPMXh1WEc0Z0lDQWdjbVYwZFhKdUlHSjFkSFJ2Ymp0Y2JpQWdmVnh1ZlR0Y2JpSmRmUT09IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIFNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM0NDYxNzAvZXNjYXBlLXN0cmluZy1mb3ItdXNlLWluLWphdmFzY3JpcHQtcmVnZXhcblxudmFyIHNwZWNpYWxzO1xudmFyIHJlZ2V4O1xuXG5zcGVjaWFscyA9IFtcbiAgLy8gb3JkZXIgbWF0dGVycyBmb3IgdGhlc2VcbiAgICAnLSdcbiAgLCAnWydcbiAgLCAnXSdcbiAgLy8gb3JkZXIgZG9lc24ndCBtYXR0ZXIgZm9yIGFueSBvZiB0aGVzZVxuICAsICcvJ1xuICAsICd7J1xuICAsICd9J1xuICAsICcoJ1xuICAsICcpJ1xuICAsICcqJ1xuICAsICcrJ1xuICAsICc/J1xuICAsICcuJ1xuICAsICdcXFxcJ1xuICAsICdeJ1xuICAsICckJ1xuICAsICd8J1xuXTtcblxucmVnZXggPSBuZXcgUmVnRXhwKCdbJyArIHNwZWNpYWxzLmpvaW4oJ1xcXFwnKSArICddJywgJ2cnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShyZWdleCwgJ1xcXFwkJicpO1xufTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwzVjBhV3h6TDJWelkyRndaVjl5WldkbGVDNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4WlFVRlpMRU5CUVVNN08wRkJSV0lzTWtaQlFUSkdPenRCUVVVelJpeEpRVUZKTEZGQlFWRXNRMEZCUXp0QlFVTmlMRWxCUVVrc1MwRkJTeXhEUVVGRE96dEJRVVZXTEZGQlFWRXNSMEZCUnpzN1NVRkZVQ3hIUVVGSE8wbEJRMGdzUjBGQlJ6dEJRVU5RTEVsQlFVa3NSMEZCUnpzN1NVRkZTQ3hIUVVGSE8wbEJRMGdzUjBGQlJ6dEpRVU5JTEVkQlFVYzdTVUZEU0N4SFFVRkhPMGxCUTBnc1IwRkJSenRKUVVOSUxFZEJRVWM3U1VGRFNDeEhRVUZITzBsQlEwZ3NSMEZCUnp0SlFVTklMRWRCUVVjN1NVRkRTQ3hKUVVGSk8wbEJRMG9zUjBGQlJ6dEpRVU5JTEVkQlFVYzdTVUZEU0N4SFFVRkhPMEZCUTFBc1EwRkJReXhEUVVGRE96dEJRVVZHTEV0QlFVc3NSMEZCUnl4SlFVRkpMRTFCUVUwc1EwRkJReXhIUVVGSExFZEJRVWNzVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhIUVVGSExFVkJRVVVzUjBGQlJ5eERRVUZETEVOQlFVTTdPMEZCUlhwRUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NWVUZCVlN4TlFVRk5MRVZCUVVVN1JVRkRha01zVDBGQlR5eE5RVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRMRXRCUVVzc1JVRkJSU3hOUVVGTkxFTkJRVU1zUTBGQlF6dERRVU4wUXl4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpWENKMWMyVWdjM1J5YVdOMFhDSTdYRzVjYmk4dklGTmxaU0JvZEhSd09pOHZjM1JoWTJ0dmRtVnlabXh2ZHk1amIyMHZjWFZsYzNScGIyNXpMek0wTkRZeE56QXZaWE5qWVhCbExYTjBjbWx1WnkxbWIzSXRkWE5sTFdsdUxXcGhkbUZ6WTNKcGNIUXRjbVZuWlhoY2JseHVkbUZ5SUhOd1pXTnBZV3h6TzF4dWRtRnlJSEpsWjJWNE8xeHVYRzV6Y0dWamFXRnNjeUE5SUZ0Y2JpQWdMeThnYjNKa1pYSWdiV0YwZEdWeWN5Qm1iM0lnZEdobGMyVmNiaUFnSUNBbkxTZGNiaUFnTENBbld5ZGNiaUFnTENBblhTZGNiaUFnTHk4Z2IzSmtaWElnWkc5bGMyNG5kQ0J0WVhSMFpYSWdabTl5SUdGdWVTQnZaaUIwYUdWelpWeHVJQ0FzSUNjdkoxeHVJQ0FzSUNkN0oxeHVJQ0FzSUNkOUoxeHVJQ0FzSUNjb0oxeHVJQ0FzSUNjcEoxeHVJQ0FzSUNjcUoxeHVJQ0FzSUNjckoxeHVJQ0FzSUNjL0oxeHVJQ0FzSUNjdUoxeHVJQ0FzSUNkY1hGeGNKMXh1SUNBc0lDZGVKMXh1SUNBc0lDY2tKMXh1SUNBc0lDZDhKMXh1WFR0Y2JseHVjbVZuWlhnZ1BTQnVaWGNnVW1WblJYaHdLQ2RiSnlBcklITndaV05wWVd4ekxtcHZhVzRvSjF4Y1hGd25LU0FySUNkZEp5d2dKMmNuS1R0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQm1kVzVqZEdsdmJpQW9jM1J5YVc1bktTQjdYRzRnSUhKbGRIVnliaUJ6ZEhKcGJtY3VjbVZ3YkdGalpTaHlaV2RsZUN3Z0oxeGNYRndrSmljcE8xeHVmVHRjYmlKZGZRPT0iLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG5mdW5jdGlvbiBTY3JvbGxlckNvYXN0ZXIgKGVsZW1lbnRzLCBvcHRpb25zKSB7XG4gIGlmICghICh0aGlzIGluc3RhbmNlb2YgU2Nyb2xsZXJDb2FzdGVyKSkge1xuICAgIHJldHVybiBuZXcgU2Nyb2xsZXJDb2FzdGVyKGVsZW1lbnRzLCBvcHRpb25zKTtcbiAgfVxuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHRoaXMuZWxlbWVudHMgICAgID0gQXJyYXkuaXNBcnJheShlbGVtZW50cykgPyBlbGVtZW50cyA6IFtlbGVtZW50c107XG4gIHRoaXMuY3VycmVudCAgICAgID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICB0aGlzLnN0YXJ0ICAgICAgICA9IDA7XG4gIHRoaXMuc3RlcHMgICAgICAgID0gb3B0aW9ucy5zdGVwcyB8fCAxNTA7XG5cbiAgdGhpcy5jYWxjdWxhdGVTY3JvbGxQb3NpdGlvbigpLnN0ZXAoMCk7XG59XG5cblNjcm9sbGVyQ29hc3Rlci5wcm90b3R5cGUuZ2V0VG9wID0gZnVuY3Rpb24gZ2V0VG9wICgpIHtcbiAgcmV0dXJuICQodGhpcy5lbGVtZW50c1swXSkub2Zmc2V0KCkudG9wIHx8IDA7XG59O1xuXG5TY3JvbGxlckNvYXN0ZXIucHJvdG90eXBlLmdldFRvdGFsSGVpZ2h0ID0gZnVuY3Rpb24gZ2V0VG90YWxIZWlnaHQgKCkge1xuICB2YXIgaGVpZ2h0ID0gMDtcblxuICB0aGlzLmVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgaGVpZ2h0ICs9ICQoZWwpLm91dGVySGVpZ2h0KCk7XG4gIH0pO1xuXG4gIHJldHVybiBoZWlnaHQ7XG59O1xuXG5TY3JvbGxlckNvYXN0ZXIucHJvdG90eXBlLmNhbGN1bGF0ZVNjcm9sbFBvc2l0aW9uID0gZnVuY3Rpb24gY2FsY3VsYXRlU2Nyb2xsUG9zaXRpb24gKCkge1xuICB2YXIgd2luZG93X2hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcbiAgdmFyIG1pZCAgICAgICAgICAgPSB3aW5kb3dfaGVpZ2h0IC8gMjtcbiAgdmFyIHRvcCAgICAgICAgICAgPSB0aGlzLmdldFRvcCgpO1xuICB2YXIgaGVpZ2h0ICAgICAgICA9IHRoaXMuZ2V0VG90YWxIZWlnaHQoKTtcbiAgdmFyIGRlc3RpbmF0aW9uICAgPSBoZWlnaHQgPiB3aW5kb3dfaGVpZ2h0ID8gdG9wIDogdG9wIC0gbWlkICsgaGVpZ2h0IC0gKGhlaWdodCAvIDIpXG5cbiAgdGhpcy5kaWZmID0gZGVzdGluYXRpb24gLSB0aGlzLmN1cnJlbnQ7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5TY3JvbGxlckNvYXN0ZXIucHJvdG90eXBlLnN0ZXAgPSBmdW5jdGlvbiBzdGVwICh0aW1lc3RhbXApIHtcbiAgdmFyIHByb2dyZXNzO1xuICB2YXIgcGVyY2VudDtcblxuICB0aGlzLnN0YXJ0ICA9IHRoaXMuc3RhcnQgfHwgdGltZXN0YW1wO1xuICBwcm9ncmVzcyAgICA9IHRpbWVzdGFtcCAtIHRoaXMuc3RhcnQ7XG4gIHBlcmNlbnQgICAgID0gTWF0aC5taW4ocHJvZ3Jlc3MgLyB0aGlzLnN0ZXBzLCAxKTtcblxuICBzY3JvbGxUbygwLCB0aGlzLmN1cnJlbnQgKyAodGhpcy5kaWZmICogcGVyY2VudCkpO1xuXG4gIGlmIChwZXJjZW50IDwgMSkge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnN0ZXAuYmluZCh0aGlzKSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2Nyb2xsZXJDb2FzdGVyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDNWMGFXeHpMM05qY205c2JHVnlYMk52WVhOMFpYSXZhVzVrWlhndWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzU1VGQlNTeERRVUZETEVkQlFVY3NUMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE96dEJRVVV4UWl4VFFVRlRMR1ZCUVdVc1JVRkJSU3hSUVVGUkxFVkJRVVVzVDBGQlR5eEZRVUZGTzBWQlF6TkRMRWxCUVVrc1IwRkJSeXhKUVVGSkxGbEJRVmtzWlVGQlpTeERRVUZETEVWQlFVVTdTVUZEZGtNc1QwRkJUeXhKUVVGSkxHVkJRV1VzUTBGQlF5eFJRVUZSTEVWQlFVVXNUMEZCVHl4RFFVRkRMRU5CUVVNN1FVRkRiRVFzUjBGQlJ6czdRVUZGU0N4RlFVRkZMRTlCUVU4c1IwRkJSeXhQUVVGUExFbEJRVWtzUlVGQlJTeERRVUZET3p0RlFVVjRRaXhKUVVGSkxFTkJRVU1zVVVGQlVTeFBRVUZQTEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1VVRkJVU3hEUVVGRExFZEJRVWNzVVVGQlVTeEhRVUZITEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1JVRkRjRVVzU1VGQlNTeERRVUZETEU5QlFVOHNVVUZCVVN4RFFVRkRMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU1zVTBGQlV5eEZRVUZGTEVOQlFVTTdSVUZETVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzVlVGQlZTeERRVUZETEVOQlFVTTdRVUZEZUVJc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eFZRVUZWTEU5QlFVOHNRMEZCUXl4TFFVRkxMRWxCUVVrc1IwRkJSeXhEUVVGRE96dEZRVVY2UXl4SlFVRkpMRU5CUVVNc2RVSkJRWFZDTEVWQlFVVXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRGVrTXNRMEZCUXpzN1FVRkZSQ3hsUVVGbExFTkJRVU1zVTBGQlV5eERRVUZETEUxQlFVMHNSMEZCUnl4VFFVRlRMRTFCUVUwc1NVRkJTVHRGUVVOd1JDeFBRVUZQTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1IwRkJSeXhKUVVGSkxFTkJRVU1zUTBGQlF6dEJRVU12UXl4RFFVRkRMRU5CUVVNN08wRkJSVVlzWlVGQlpTeERRVUZETEZOQlFWTXNRMEZCUXl4alFVRmpMRWRCUVVjc1UwRkJVeXhqUVVGakxFbEJRVWs3UVVGRGRFVXNSVUZCUlN4SlFVRkpMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU03TzBWQlJXWXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhQUVVGUExFTkJRVU1zVlVGQlZTeEZRVUZGTEVWQlFVVTdTVUZEYkVNc1RVRkJUU3hKUVVGSkxFTkJRVU1zUTBGQlF5eEZRVUZGTEVOQlFVTXNRMEZCUXl4WFFVRlhMRVZCUVVVc1EwRkJRenRCUVVOc1F5eEhRVUZITEVOQlFVTXNRMEZCUXpzN1JVRkZTQ3hQUVVGUExFMUJRVTBzUTBGQlF6dEJRVU5vUWl4RFFVRkRMRU5CUVVNN08wRkJSVVlzWlVGQlpTeERRVUZETEZOQlFWTXNRMEZCUXl4MVFrRkJkVUlzUjBGQlJ5eFRRVUZUTEhWQ1FVRjFRaXhKUVVGSk8wVkJRM1JHTEVsQlFVa3NZVUZCWVN4SFFVRkhMRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF5eE5RVUZOTEVWQlFVVXNRMEZCUXp0RlFVTjJReXhKUVVGSkxFZEJRVWNzWVVGQllTeGhRVUZoTEVkQlFVY3NRMEZCUXl4RFFVRkRPMFZCUTNSRExFbEJRVWtzUjBGQlJ5eGhRVUZoTEVsQlFVa3NRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJRenRGUVVOc1F5eEpRVUZKTEUxQlFVMHNWVUZCVlN4SlFVRkpMRU5CUVVNc1kwRkJZeXhGUVVGRkxFTkJRVU03UVVGRE5VTXNSVUZCUlN4SlFVRkpMRmRCUVZjc1MwRkJTeXhOUVVGTkxFZEJRVWNzWVVGQllTeEhRVUZITEVkQlFVY3NSMEZCUnl4SFFVRkhMRWRCUVVjc1IwRkJSeXhIUVVGSExFMUJRVTBzU1VGQlNTeE5RVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRPenRCUVVWMFJpeEZRVUZGTEVsQlFVa3NRMEZCUXl4SlFVRkpMRWRCUVVjc1YwRkJWeXhIUVVGSExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTTdPMFZCUlhaRExFOUJRVThzU1VGQlNTeERRVUZETzBGQlEyUXNRMEZCUXl4RFFVRkRPenRCUVVWR0xHVkJRV1VzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4SFFVRkhMRk5CUVZNc1NVRkJTU3hGUVVGRkxGTkJRVk1zUlVGQlJUdEZRVU42UkN4SlFVRkpMRkZCUVZFc1EwRkJRenRCUVVObUxFVkJRVVVzU1VGQlNTeFBRVUZQTEVOQlFVTTdPMFZCUlZvc1NVRkJTU3hEUVVGRExFdEJRVXNzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4SlFVRkpMRk5CUVZNc1EwRkJRenRGUVVOMFF5eFJRVUZSTEUxQlFVMHNVMEZCVXl4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU03UVVGRGRrTXNSVUZCUlN4UFFVRlBMRTlCUVU4c1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eFJRVUZSTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF6czdRVUZGYmtRc1JVRkJSU3hSUVVGUkxFTkJRVU1zUTBGQlF5eEZRVUZGTEVsQlFVa3NRMEZCUXl4UFFVRlBMRWxCUVVrc1NVRkJTU3hEUVVGRExFbEJRVWtzUjBGQlJ5eFBRVUZQTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRGUVVWc1JDeEpRVUZKTEU5QlFVOHNSMEZCUnl4RFFVRkRMRVZCUVVVN1NVRkRaaXh4UWtGQmNVSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RFFVRkRPMGRCUXpkRE8wRkJRMGdzUTBGQlF5eERRVUZET3p0QlFVVkdMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzWlVGQlpTeERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWRtRnlJQ1FnUFNCeVpYRjFhWEpsS0NkcWNYVmxjbmtuS1R0Y2JseHVablZ1WTNScGIyNGdVMk55YjJ4c1pYSkRiMkZ6ZEdWeUlDaGxiR1Z0Wlc1MGN5d2diM0IwYVc5dWN5a2dlMXh1SUNCcFppQW9JU0FvZEdocGN5QnBibk4wWVc1alpXOW1JRk5qY205c2JHVnlRMjloYzNSbGNpa3BJSHRjYmlBZ0lDQnlaWFIxY200Z2JtVjNJRk5qY205c2JHVnlRMjloYzNSbGNpaGxiR1Z0Wlc1MGN5d2diM0IwYVc5dWN5azdYRzRnSUgxY2JseHVJQ0J2Y0hScGIyNXpJRDBnYjNCMGFXOXVjeUI4ZkNCN2ZUdGNibHh1SUNCMGFHbHpMbVZzWlcxbGJuUnpJQ0FnSUNBOUlFRnljbUY1TG1selFYSnlZWGtvWld4bGJXVnVkSE1wSUQ4Z1pXeGxiV1Z1ZEhNZ09pQmJaV3hsYldWdWRITmRPMXh1SUNCMGFHbHpMbU4xY25KbGJuUWdJQ0FnSUNBOUlDUW9kMmx1Wkc5M0tTNXpZM0p2Ykd4VWIzQW9LVHRjYmlBZ2RHaHBjeTV6ZEdGeWRDQWdJQ0FnSUNBZ1BTQXdPMXh1SUNCMGFHbHpMbk4wWlhCeklDQWdJQ0FnSUNBOUlHOXdkR2x2Ym5NdWMzUmxjSE1nZkh3Z01UVXdPMXh1WEc0Z0lIUm9hWE11WTJGc1kzVnNZWFJsVTJOeWIyeHNVRzl6YVhScGIyNG9LUzV6ZEdWd0tEQXBPMXh1ZlZ4dVhHNVRZM0p2Ykd4bGNrTnZZWE4wWlhJdWNISnZkRzkwZVhCbExtZGxkRlJ2Y0NBOUlHWjFibU4wYVc5dUlHZGxkRlJ2Y0NBb0tTQjdYRzRnSUhKbGRIVnliaUFrS0hSb2FYTXVaV3hsYldWdWRITmJNRjBwTG05bVpuTmxkQ2dwTG5SdmNDQjhmQ0F3TzF4dWZUdGNibHh1VTJOeWIyeHNaWEpEYjJGemRHVnlMbkJ5YjNSdmRIbHdaUzVuWlhSVWIzUmhiRWhsYVdkb2RDQTlJR1oxYm1OMGFXOXVJR2RsZEZSdmRHRnNTR1ZwWjJoMElDZ3BJSHRjYmlBZ2RtRnlJR2hsYVdkb2RDQTlJREE3WEc1Y2JpQWdkR2hwY3k1bGJHVnRaVzUwY3k1bWIzSkZZV05vS0daMWJtTjBhVzl1SUNobGJDa2dlMXh1SUNBZ0lHaGxhV2RvZENBclBTQWtLR1ZzS1M1dmRYUmxja2hsYVdkb2RDZ3BPMXh1SUNCOUtUdGNibHh1SUNCeVpYUjFjbTRnYUdWcFoyaDBPMXh1ZlR0Y2JseHVVMk55YjJ4c1pYSkRiMkZ6ZEdWeUxuQnliM1J2ZEhsd1pTNWpZV3hqZFd4aGRHVlRZM0p2Ykd4UWIzTnBkR2x2YmlBOUlHWjFibU4wYVc5dUlHTmhiR04xYkdGMFpWTmpjbTlzYkZCdmMybDBhVzl1SUNncElIdGNiaUFnZG1GeUlIZHBibVJ2ZDE5b1pXbG5hSFFnUFNBa0tIZHBibVJ2ZHlrdWFHVnBaMmgwS0NrN1hHNGdJSFpoY2lCdGFXUWdJQ0FnSUNBZ0lDQWdJRDBnZDJsdVpHOTNYMmhsYVdkb2RDQXZJREk3WEc0Z0lIWmhjaUIwYjNBZ0lDQWdJQ0FnSUNBZ0lEMGdkR2hwY3k1blpYUlViM0FvS1R0Y2JpQWdkbUZ5SUdobGFXZG9kQ0FnSUNBZ0lDQWdQU0IwYUdsekxtZGxkRlJ2ZEdGc1NHVnBaMmgwS0NrN1hHNGdJSFpoY2lCa1pYTjBhVzVoZEdsdmJpQWdJRDBnYUdWcFoyaDBJRDRnZDJsdVpHOTNYMmhsYVdkb2RDQS9JSFJ2Y0NBNklIUnZjQ0F0SUcxcFpDQXJJR2hsYVdkb2RDQXRJQ2hvWldsbmFIUWdMeUF5S1Z4dVhHNGdJSFJvYVhNdVpHbG1aaUE5SUdSbGMzUnBibUYwYVc5dUlDMGdkR2hwY3k1amRYSnlaVzUwTzF4dVhHNGdJSEpsZEhWeWJpQjBhR2x6TzF4dWZUdGNibHh1VTJOeWIyeHNaWEpEYjJGemRHVnlMbkJ5YjNSdmRIbHdaUzV6ZEdWd0lEMGdablZ1WTNScGIyNGdjM1JsY0NBb2RHbHRaWE4wWVcxd0tTQjdYRzRnSUhaaGNpQndjbTluY21WemN6dGNiaUFnZG1GeUlIQmxjbU5sYm5RN1hHNWNiaUFnZEdocGN5NXpkR0Z5ZENBZ1BTQjBhR2x6TG5OMFlYSjBJSHg4SUhScGJXVnpkR0Z0Y0R0Y2JpQWdjSEp2WjNKbGMzTWdJQ0FnUFNCMGFXMWxjM1JoYlhBZ0xTQjBhR2x6TG5OMFlYSjBPMXh1SUNCd1pYSmpaVzUwSUNBZ0lDQTlJRTFoZEdndWJXbHVLSEJ5YjJkeVpYTnpJQzhnZEdocGN5NXpkR1Z3Y3l3Z01TazdYRzVjYmlBZ2MyTnliMnhzVkc4b01Dd2dkR2hwY3k1amRYSnlaVzUwSUNzZ0tIUm9hWE11WkdsbVppQXFJSEJsY21ObGJuUXBLVHRjYmx4dUlDQnBaaUFvY0dWeVkyVnVkQ0E4SURFcElIdGNiaUFnSUNCeVpYRjFaWE4wUVc1cGJXRjBhVzl1Um5KaGJXVW9kR2hwY3k1emRHVndMbUpwYm1Rb2RHaHBjeWtwTzF4dUlDQjlYRzU5TzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlGTmpjbTlzYkdWeVEyOWhjM1JsY2p0Y2JpSmRmUT09Il19
