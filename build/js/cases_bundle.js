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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9jYXNlcy5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc25hbWVzL2luZGV4LmpzIiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvY29tcG9uZW50cy9idXR0b24uanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvY29tcG9uZW50cy9pY29uLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2NvbXBvbmVudHMvc29ydF9pbmRpY2F0b3IuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvY29tcG9uZW50cy90YWJzLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2NvbXBvbmVudHMvdGQuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvY29tcG9uZW50cy90aC5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9jb21wb25lbnRzL3RyLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2NvbnN0YW50cy5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2RhdGEvY2FzZXNfbGlzdF9ib2R5LmpzIiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvZGF0YS9jYXNlc19saXN0X2hlYWRpbmdzLmpzIiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy9hY3RpdmVfcm93X2RldGFpbHMuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy9hbmRfb3Jfc2VsZWN0b3IuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy9hdXRvY29tcGxldGUuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy9jYXNlX2NvbGxlY3Rpb24uanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL2Nhc2VzL2Nhc2VfaGlzdG9yeS5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL2Nhc2VzL2Nhc2VfaGlzdG9yeV9jb2xsZWN0aW9uLmpzIiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy9jYXNlX21vZGVsLmpzIiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy9kaXNwYXRjaGVyLmpzIiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy9kcm9wZG93bi5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL2Nhc2VzL2ZpbHRlcl9ib3guanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy9maWx0ZXJfYm94X2RlZmluaXRpb24uanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL2Nhc2VzL2hlYWRpbmdfY29sbGVjdGlvbi5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvY2FzZXMvaGVhZGluZ19tb2RlbC5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvY2FzZXMvaWNvbl93cmFwcGVyLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvY2FzZXMvaW5kZXguanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL2Nhc2VzL2xpc3RfZmlsdGVyLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvY2FzZXMvbGlzdF9yb3cuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy9saXN0X3ZpZXcuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy9saXN0X3ZpZXdfc3RvcmUuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL2Nhc2VzL3Rib2R5X3dyYXBwZXIuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvbW9kdWxlcy9jYXNlcy90aF93cmFwcGVyLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL21vZHVsZXMvY2FzZXMvdGhlYWRfd3JhcHBlci5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9tb2R1bGVzL2Nhc2VzL3RyYW5zZm9ybWVycy5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy91dGlscy9lc2NhcGVfcmVnZXguanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy91dGlscy9zY3JvbGxlcl9jb2FzdGVyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEs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LENBQUM7QUFDZixFQUFFLElBQUksT0FBTyxDQUFDOztFQUVaLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUM7RUFDdEMsUUFBUSxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3ZDLEVBQUUsT0FBTyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRW5ELEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQzs7RUFFbEQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO0lBQ2YscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUM3QztBQUNILENBQUMsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQzs7QUFFakMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJlYWN0ICAgICAgICAgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFBlcmYgICAgICAgICAgICAgICAgPSBSZWFjdC5hZGRvbnMuUGVyZjtcbnZhciBEaXNwYXRjaGVyICAgICAgICAgID0gcmVxdWlyZSgnZmx1eCcpLkRpc3BhdGNoZXI7XG52YXIgY2FzZXNfbW9kdWxlICAgICAgICA9IHJlcXVpcmUoJy4vbW9kdWxlcy9jYXNlcycpO1xudmFyIExpc3RWaWV3ICAgICAgICAgICAgPSBjYXNlc19tb2R1bGUuTGlzdFZpZXc7XG52YXIgbGlzdF92aWV3X3N0b3JlICAgICA9IGNhc2VzX21vZHVsZS5saXN0X3ZpZXdfc3RvcmU7XG52YXIgX2RhdGFfbGlzdF9oZWFkaW5ncyA9IHJlcXVpcmUoJy4vZGF0YS9jYXNlc19saXN0X2hlYWRpbmdzJyk7XG52YXIgX2RhdGFfbGlzdF9ib2R5ICAgICA9IHJlcXVpcmUoJy4vZGF0YS9jYXNlc19saXN0X2JvZHknKSgxNSk7XG52YXIgbGlzdF9oZWFkaW5ncyAgICAgICA9IGxpc3Rfdmlld19zdG9yZS5nZXQoJ2hlYWRpbmdzJyk7XG52YXIgY2FzZV9saXN0ICAgICAgICAgICA9IGxpc3Rfdmlld19zdG9yZS5nZXQoJ2Nhc2VzJyk7XG5cbmxpc3RfaGVhZGluZ3Muc2V0KF9kYXRhX2xpc3RfaGVhZGluZ3MpO1xubGlzdF92aWV3X3N0b3JlLnNldCgnZmlyc3QnLCBsaXN0X2hlYWRpbmdzLmF0KDApKTtcbmxpc3RfaGVhZGluZ3MubGlua1NpYmxpbmdzKCk7XG5cbmNhc2VfbGlzdC5zZXQoX2RhdGFfbGlzdF9ib2R5KTtcblxuZnVuY3Rpb24gcmVuZGVyIChpZCkge1xuICBSZWFjdC5yZW5kZXIoXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChMaXN0Vmlldywge1xuICAgICAgaGVhZGluZ3M6IGxpc3RfaGVhZGluZ3MsXG4gICAgICBzdG9yZTogICAgbGlzdF92aWV3X3N0b3JlXG4gICAgfSksXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXG4gICk7XG59O1xuXG5yZW5kZXIoJ2Nhc2VzLWxpc3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZW5kZXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMk5oYzJWekxtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVa3NTMEZCU3l4cFFrRkJhVUlzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUXpORExFbEJRVWtzU1VGQlNTeHJRa0ZCYTBJc1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTTdRVUZETlVNc1NVRkJTU3hWUVVGVkxGbEJRVmtzVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRMRlZCUVZVc1EwRkJRenRCUVVOeVJDeEpRVUZKTEZsQlFWa3NWVUZCVlN4UFFVRlBMRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNRMEZCUXp0QlFVTnlSQ3hKUVVGSkxGRkJRVkVzWTBGQll5eFpRVUZaTEVOQlFVTXNVVUZCVVN4RFFVRkRPMEZCUTJoRUxFbEJRVWtzWlVGQlpTeFBRVUZQTEZsQlFWa3NRMEZCUXl4bFFVRmxMRU5CUVVNN1FVRkRka1FzU1VGQlNTeHRRa0ZCYlVJc1IwRkJSeXhQUVVGUExFTkJRVU1zTkVKQlFUUkNMRU5CUVVNc1EwRkJRenRCUVVOb1JTeEpRVUZKTEdWQlFXVXNUMEZCVHl4UFFVRlBMRU5CUVVNc2QwSkJRWGRDTEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJRenRCUVVOb1JTeEpRVUZKTEdGQlFXRXNVMEZCVXl4bFFVRmxMRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETzBGQlF6RkVMRWxCUVVrc1UwRkJVeXhoUVVGaExHVkJRV1VzUTBGQlF5eEhRVUZITEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN08wRkJSWFpFTEdGQlFXRXNRMEZCUXl4SFFVRkhMRU5CUVVNc2JVSkJRVzFDTEVOQlFVTXNRMEZCUXp0QlFVTjJReXhsUVVGbExFTkJRVU1zUjBGQlJ5eERRVUZETEU5QlFVOHNSVUZCUlN4aFFVRmhMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEYkVRc1lVRkJZU3hEUVVGRExGbEJRVmtzUlVGQlJTeERRVUZET3p0QlFVVTNRaXhUUVVGVExFTkJRVU1zUjBGQlJ5eERRVUZETEdWQlFXVXNRMEZCUXl4RFFVRkRPenRCUVVVdlFpeFRRVUZUTEUxQlFVMHNSVUZCUlN4RlFVRkZMRVZCUVVVN1JVRkRia0lzUzBGQlN5eERRVUZETEUxQlFVMDdTVUZEVml4TFFVRkxMRU5CUVVNc1lVRkJZU3hEUVVGRExGRkJRVkVzUlVGQlJUdE5RVU0xUWl4UlFVRlJMRVZCUVVVc1lVRkJZVHROUVVOMlFpeExRVUZMTEV0QlFVc3NaVUZCWlR0TFFVTXhRaXhEUVVGRE8wbEJRMFlzVVVGQlVTeERRVUZETEdOQlFXTXNRMEZCUXl4RlFVRkZMRU5CUVVNN1IwRkROVUlzUTBGQlF6dEJRVU5LTEVOQlFVTXNRMEZCUXpzN1FVRkZSaXhOUVVGTkxFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTTdPMEZCUlhKQ0xFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NUVUZCVFN4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpZG1GeUlGSmxZV04wSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDY3BPMXh1ZG1GeUlGQmxjbVlnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQU0JTWldGamRDNWhaR1J2Ym5NdVVHVnlaanRjYm5aaGNpQkVhWE53WVhSamFHVnlJQ0FnSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duWm14MWVDY3BMa1JwYzNCaGRHTm9aWEk3WEc1MllYSWdZMkZ6WlhOZmJXOWtkV3hsSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dmJXOWtkV3hsY3k5allYTmxjeWNwTzF4dWRtRnlJRXhwYzNSV2FXVjNJQ0FnSUNBZ0lDQWdJQ0FnUFNCallYTmxjMTl0YjJSMWJHVXVUR2x6ZEZacFpYYzdYRzUyWVhJZ2JHbHpkRjkyYVdWM1gzTjBiM0psSUNBZ0lDQTlJR05oYzJWelgyMXZaSFZzWlM1c2FYTjBYM1pwWlhkZmMzUnZjbVU3WEc1MllYSWdYMlJoZEdGZmJHbHpkRjlvWldGa2FXNW5jeUE5SUhKbGNYVnBjbVVvSnk0dlpHRjBZUzlqWVhObGMxOXNhWE4wWDJobFlXUnBibWR6SnlrN1hHNTJZWElnWDJSaGRHRmZiR2x6ZEY5aWIyUjVJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHZaR0YwWVM5allYTmxjMTlzYVhOMFgySnZaSGtuS1NneE5TazdYRzUyWVhJZ2JHbHpkRjlvWldGa2FXNW5jeUFnSUNBZ0lDQTlJR3hwYzNSZmRtbGxkMTl6ZEc5eVpTNW5aWFFvSjJobFlXUnBibWR6SnlrN1hHNTJZWElnWTJGelpWOXNhWE4wSUNBZ0lDQWdJQ0FnSUNBOUlHeHBjM1JmZG1sbGQxOXpkRzl5WlM1blpYUW9KMk5oYzJWekp5azdYRzVjYm14cGMzUmZhR1ZoWkdsdVozTXVjMlYwS0Y5a1lYUmhYMnhwYzNSZmFHVmhaR2x1WjNNcE8xeHViR2x6ZEY5MmFXVjNYM04wYjNKbExuTmxkQ2duWm1seWMzUW5MQ0JzYVhOMFgyaGxZV1JwYm1kekxtRjBLREFwS1R0Y2JteHBjM1JmYUdWaFpHbHVaM011YkdsdWExTnBZbXhwYm1kektDazdYRzVjYm1OaGMyVmZiR2x6ZEM1elpYUW9YMlJoZEdGZmJHbHpkRjlpYjJSNUtUdGNibHh1Wm5WdVkzUnBiMjRnY21WdVpHVnlJQ2hwWkNrZ2UxeHVJQ0JTWldGamRDNXlaVzVrWlhJb1hHNGdJQ0FnVW1WaFkzUXVZM0psWVhSbFJXeGxiV1Z1ZENoTWFYTjBWbWxsZHl3Z2UxeHVJQ0FnSUNBZ2FHVmhaR2x1WjNNNklHeHBjM1JmYUdWaFpHbHVaM01zWEc0Z0lDQWdJQ0J6ZEc5eVpUb2dJQ0FnYkdsemRGOTJhV1YzWDNOMGIzSmxYRzRnSUNBZ2ZTa3NYRzRnSUNBZ1pHOWpkVzFsYm5RdVoyVjBSV3hsYldWdWRFSjVTV1FvYVdRcFhHNGdJQ2s3WEc1OU8xeHVYRzV5Wlc1a1pYSW9KMk5oYzJWekxXeHBjM1FuS1R0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQnlaVzVrWlhJN1hHNGlYWDA9IiwiZnVuY3Rpb24gY2xhc3NOYW1lcygpIHtcblx0dmFyIGNsYXNzZXMgPSAnJztcblx0dmFyIGFyZztcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdGFyZyA9IGFyZ3VtZW50c1tpXTtcblx0XHRpZiAoIWFyZykge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0aWYgKCdzdHJpbmcnID09PSB0eXBlb2YgYXJnIHx8ICdudW1iZXInID09PSB0eXBlb2YgYXJnKSB7XG5cdFx0XHRjbGFzc2VzICs9ICcgJyArIGFyZztcblx0XHR9IGVsc2UgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmcpID09PSAnW29iamVjdCBBcnJheV0nKSB7XG5cdFx0XHRjbGFzc2VzICs9ICcgJyArIGNsYXNzTmFtZXMuYXBwbHkobnVsbCwgYXJnKTtcblx0XHR9IGVsc2UgaWYgKCdvYmplY3QnID09PSB0eXBlb2YgYXJnKSB7XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJnKSB7XG5cdFx0XHRcdGlmICghYXJnLmhhc093blByb3BlcnR5KGtleSkgfHwgIWFyZ1trZXldKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBrZXk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBjbGFzc2VzLnN1YnN0cigxKTtcbn1cblxuLy8gc2FmZWx5IGV4cG9ydCBjbGFzc05hbWVzIGluIGNhc2UgdGhlIHNjcmlwdCBpcyBpbmNsdWRlZCBkaXJlY3RseSBvbiBhIHBhZ2VcbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRtb2R1bGUuZXhwb3J0cyA9IGNsYXNzTmFtZXM7XG59XG4iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIEJ1dHRvbjtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgSWNvbiAgPSByZXF1aXJlKCcuL2ljb24uanN4Jyk7XG5cbkJ1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJCdXR0b25cIixcbiAgbWl4aW5zOiBbUmVhY3QuYWRkb25zLlB1cmVSZW5kZXJNaXhpbl0sXG4gIHByb3BUeXBlczoge1xuICAgIGljb246ICAgICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIG9uQ2xpY2s6ICBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICBocmVmOiAgICAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaWNvbiAgICAgID0gdGhpcy5wcm9wcy5pY29uID8gUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogdGhpcy5wcm9wcy5pY29uLCByZWY6IFwiaWNvblwifSkgOiBudWxsO1xuICAgIHZhciBjbGFzc2VzICAgPSBbJ2J1dHRvbiddO1xuICAgIHZhciBhZnRlckljb24gPSB0aGlzLnByb3BzLmFmdGVySWNvbiA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IHRoaXMucHJvcHMuYWZ0ZXJJY29uLCByZWY6IFwiYWZ0ZXItaWNvblwifSkgOiBudWxsO1xuICAgIHZhciB0ZXh0ICAgICAgPSB0aGlzLnByb3BzLnRleHQgPyAoUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJ0ZXh0XCJ9LCB0aGlzLnByb3BzLnRleHQpKSA6IG51bGw7XG4gICAgdmFyIHByb3BzO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuZmVhdXgpIHtcbiAgICAgIGNsYXNzZXMgPSBbJ2ZlYXV4LWJ1dHRvbiddO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmNsYXNzTmFtZSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcbiAgICB9XG5cbiAgICBwcm9wcyA9IHtcbiAgICAgIGhyZWY6ICAgICAgIHRoaXMucHJvcHMuaHJlZixcbiAgICAgIGFjdGlvbjogICAgIHRoaXMucHJvcHMuYWN0aW9uLFxuICAgICAgb25DbGljazogICAgdGhpcy5faGFuZGxlQ2xpY2ssXG4gICAgICBjbGFzc05hbWU6ICBjbGFzc2VzLmpvaW4oJyAnKVxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwgUmVhY3QuX19zcHJlYWQoe30sICBwcm9wcyksIFxuICAgICAgICBpY29uLCBcbiAgICAgICAgdGV4dCwgXG4gICAgICAgIGFmdGVySWNvblxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIF9oYW5kbGVDbGljazogZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIHRoaXMucHJvcHMub25DbGljayAmJiB0aGlzLnByb3BzLm9uQ2xpY2soZSk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1dHRvbjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyTnZiWEJ2Ym1WdWRITXZZblYwZEc5dUxtcHplQ0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVRzN1FVRkZRU3hIUVVGSE96dEJRVVZJTEVsQlFVa3NUVUZCVFN4RFFVRkRPMEZCUTFnc1NVRkJTU3hMUVVGTExFZEJRVWNzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUXpkQ0xFbEJRVWtzU1VGQlNTeEpRVUZKTEU5QlFVOHNRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJRenM3UVVGRmJFTXNORUpCUVRSQ0xITkNRVUZCTzBWQlF6RkNMRTFCUVUwc1JVRkJSU3hEUVVGRExFdEJRVXNzUTBGQlF5eE5RVUZOTEVOQlFVTXNaVUZCWlN4RFFVRkRPMFZCUTNSRExGTkJRVk1zUlVGQlJUdEpRVU5VTEVsQlFVa3NUVUZCVFN4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFMUJRVTA3U1VGRGFFTXNUMEZCVHl4SFFVRkhMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNUdEpRVU01UWl4SlFVRkpMRTFCUVUwc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTzBkQlEycERPMFZCUTBRc1RVRkJUU3hGUVVGRkxGbEJRVms3U1VGRGJFSXNTVUZCU1N4SlFVRkpMRkZCUVZFc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVkQlFVY3NiMEpCUVVNc1NVRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eEpRVUZCTEVWQlFVa3NRMEZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUlVGQlF5eERRVUZETEVkQlFVRXNSVUZCUnl4RFFVRkRMRTFCUVUwc1EwRkJRU3hEUVVGSExFTkJRVUVzUjBGQlJ5eEpRVUZKTEVOQlFVTTdTVUZEY0VZc1NVRkJTU3hQUVVGUExFdEJRVXNzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0SlFVTXpRaXhKUVVGSkxGTkJRVk1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRk5CUVZNc1IwRkJSeXh2UWtGQlF5eEpRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRWxCUVVFc1JVRkJTU3hEUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4RlFVRkRMRU5CUVVNc1IwRkJRU3hGUVVGSExFTkJRVU1zV1VGQldTeERRVUZCTEVOQlFVY3NRMEZCUVN4SFFVRkhMRWxCUVVrc1EwRkJRenRKUVVOd1J5eEpRVUZKTEVsQlFVa3NVVUZCVVN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzU1VGQlNTeHZRa0ZCUVN4TlFVRkxMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEUxQlFVOHNRMEZCUVN4RlFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQldTeERRVUZCTEVsQlFVa3NTVUZCU1N4RFFVRkRPMEZCUXk5R0xFbEJRVWtzU1VGQlNTeExRVUZMTEVOQlFVTTdPMGxCUlZZc1NVRkJTU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVc3NSVUZCUlR0TlFVTndRaXhQUVVGUExFZEJRVWNzUTBGQlF5eGpRVUZqTEVOQlFVTXNRMEZCUXp0QlFVTnFReXhMUVVGTE96dEpRVVZFTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhUUVVGVExFVkJRVVU3VFVGRGVFSXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMEZCUTNwRExFdEJRVXM3TzBsQlJVUXNTMEZCU3l4SFFVRkhPMDFCUTA0c1NVRkJTU3hSUVVGUkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1R0TlFVTXpRaXhOUVVGTkxFMUJRVTBzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5PMDFCUXpkQ0xFOUJRVThzUzBGQlN5eEpRVUZKTEVOQlFVTXNXVUZCV1R0TlFVTTNRaXhUUVVGVExFZEJRVWNzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNN1FVRkRia01zUzBGQlN5eERRVUZET3p0SlFVVkdPMDFCUTBVc2IwSkJRVUVzUjBGQlJTeEZRVUZCTEdkQ1FVRkJMRWRCUVVFc1EwRkJSU3hIUVVGSExFdEJRVThzUTBGQlFTeEZRVUZCTzFGQlExZ3NTVUZCU1N4RlFVRkRPMUZCUTB3c1NVRkJTU3hGUVVGRE8xRkJRMHdzVTBGQlZUdE5RVU5VTEVOQlFVRTdUVUZEU2p0SFFVTklPMFZCUTBRc1dVRkJXU3hGUVVGRkxGVkJRVlVzUTBGQlF5eEZRVUZGTzBsQlEzcENMRU5CUVVNc1EwRkJReXhqUVVGakxFVkJRVVVzUTBGQlF6dEJRVU4yUWl4SlFVRkpMRU5CUVVNc1EwRkJReXhsUVVGbExFVkJRVVVzUTBGQlF6czdTVUZGY0VJc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdSMEZETjBNN1FVRkRTQ3hEUVVGRExFTkJRVU1zUTBGQlF6czdRVUZGU0N4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExFMUJRVTBzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dRR3B6ZUNCU1pXRmpkQzVFVDAxY2JpQXFMMXh1WEc1MllYSWdRblYwZEc5dU8xeHVkbUZ5SUZKbFlXTjBJRDBnY21WeGRXbHlaU2duY21WaFkzUW5LVHRjYm5aaGNpQkpZMjl1SUNBOUlISmxjWFZwY21Vb0p5NHZhV052Ymk1cWMzZ25LVHRjYmx4dVFuVjBkRzl1SUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVJQ0J0YVhocGJuTTZJRnRTWldGamRDNWhaR1J2Ym5NdVVIVnlaVkpsYm1SbGNrMXBlR2x1WFN4Y2JpQWdjSEp2Y0ZSNWNHVnpPaUI3WEc0Z0lDQWdhV052YmpvZ0lDQWdJRkpsWVdOMExsQnliM0JVZVhCbGN5NXpkSEpwYm1jc1hHNGdJQ0FnYjI1RGJHbGphem9nSUZKbFlXTjBMbEJ5YjNCVWVYQmxjeTVtZFc1akxGeHVJQ0FnSUdoeVpXWTZJQ0FnSUNCU1pXRmpkQzVRY205d1ZIbHdaWE11YzNSeWFXNW5YRzRnSUgwc1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCcFkyOXVJQ0FnSUNBZ1BTQjBhR2x6TG5CeWIzQnpMbWxqYjI0Z1B5QThTV052YmlCMGVYQmxQWHQwYUdsekxuQnliM0J6TG1samIyNTlJSEpsWmoxY0ltbGpiMjVjSWlBdlBpQTZJRzUxYkd3N1hHNGdJQ0FnZG1GeUlHTnNZWE56WlhNZ0lDQTlJRnNuWW5WMGRHOXVKMTA3WEc0Z0lDQWdkbUZ5SUdGbWRHVnlTV052YmlBOUlIUm9hWE11Y0hKdmNITXVZV1owWlhKSlkyOXVJRDhnUEVsamIyNGdkSGx3WlQxN2RHaHBjeTV3Y205d2N5NWhablJsY2tsamIyNTlJSEpsWmoxY0ltRm1kR1Z5TFdsamIyNWNJaUF2UGlBNklHNTFiR3c3WEc0Z0lDQWdkbUZ5SUhSbGVIUWdJQ0FnSUNBOUlIUm9hWE11Y0hKdmNITXVkR1Y0ZENBL0lDZzhjM0JoYmlCamJHRnpjMDVoYldVOVhDSjBaWGgwWENJK2UzUm9hWE11Y0hKdmNITXVkR1Y0ZEgwOEwzTndZVzQrS1NBNklHNTFiR3c3WEc0Z0lDQWdkbUZ5SUhCeWIzQnpPMXh1WEc0Z0lDQWdhV1lnS0hSb2FYTXVjSEp2Y0hNdVptVmhkWGdwSUh0Y2JpQWdJQ0FnSUdOc1lYTnpaWE1nUFNCYkoyWmxZWFY0TFdKMWRIUnZiaWRkTzF4dUlDQWdJSDFjYmx4dUlDQWdJR2xtSUNoMGFHbHpMbkJ5YjNCekxtTnNZWE56VG1GdFpTa2dlMXh1SUNBZ0lDQWdZMnhoYzNObGN5NXdkWE5vS0hSb2FYTXVjSEp2Y0hNdVkyeGhjM05PWVcxbEtUdGNiaUFnSUNCOVhHNWNiaUFnSUNCd2NtOXdjeUE5SUh0Y2JpQWdJQ0FnSUdoeVpXWTZJQ0FnSUNBZ0lIUm9hWE11Y0hKdmNITXVhSEpsWml4Y2JpQWdJQ0FnSUdGamRHbHZiam9nSUNBZ0lIUm9hWE11Y0hKdmNITXVZV04wYVc5dUxGeHVJQ0FnSUNBZ2IyNURiR2xqYXpvZ0lDQWdkR2hwY3k1ZmFHRnVaR3hsUTJ4cFkyc3NYRzRnSUNBZ0lDQmpiR0Z6YzA1aGJXVTZJQ0JqYkdGemMyVnpMbXB2YVc0b0p5QW5LVnh1SUNBZ0lIMDdYRzVjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BHRWdleTR1TG5CeWIzQnpmVDVjYmlBZ0lDQWdJQ0FnZTJsamIyNTlYRzRnSUNBZ0lDQWdJSHQwWlhoMGZWeHVJQ0FnSUNBZ0lDQjdZV1owWlhKSlkyOXVmVnh1SUNBZ0lDQWdQQzloUGx4dUlDQWdJQ2s3WEc0Z0lIMHNYRzRnSUY5b1lXNWtiR1ZEYkdsamF6b2dablZ1WTNScGIyNGdLR1VwSUh0Y2JpQWdJQ0JsTG5CeVpYWmxiblJFWldaaGRXeDBLQ2s3WEc0Z0lDQWdaUzV6ZEc5d1VISnZjR0ZuWVhScGIyNG9LVHRjYmx4dUlDQWdJSFJvYVhNdWNISnZjSE11YjI1RGJHbGpheUFtSmlCMGFHbHpMbkJ5YjNCekxtOXVRMnhwWTJzb1pTazdYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUVKMWRIUnZianRjYmlKZGZRPT0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIEljb247XG52YXIgXyAgICAgPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gaWNvbiwgY3VycmVudGx5IHVzaW5nIHRoZSBmb250IGF3ZXNvbWUgaWNvbiBsaWJyYXJ5XG4gKlxuICogQGV4YW1wbGVzXG4gKiA8SWNvbiB0eXBlPVwiY2hlY2tcIiAvPlxuICogPEljb24gdHlwZT1cInVzZXJcIiBjbGFzc05hbWU9XCJtdXRlZFwiIC8+XG4gKiA8SWNvbiB0eXBlPVwiYmFuXCIgc3RhY2s9XCIyeFwiIC8+XG4gKi9cbkljb24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiSWNvblwiLFxuICBwcm9wVHlwZXM6IHtcbiAgICBzdGFjazogICAgICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIHR5cGU6ICAgICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBjbGFzc05hbWU6ICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIG1peGluczogW1JlYWN0LmFkZG9ucy5QdXJlUmVuZGVyTWl4aW5dLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2xhc3NlcyA9IFsnZmEgZmEtaWNvbiddO1xuICAgIHZhciBwcm9wcyAgID0gXy5vbWl0KHRoaXMucHJvcHMsIFsnc3RhY2snLCAndHlwZScsICdjbGFzc05hbWUnXSk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5zdGFjaykge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdmYS1zdGFjay0nICsgdGhpcy5wcm9wcy5zdGFjayk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuc3Bpbikge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdmYS1zcGluJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMudHlwZSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdmYS0nICsgdGhpcy5wcm9wcy50eXBlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jbGFzc05hbWUpIHtcbiAgICAgIGNsYXNzZXMucHVzaCh0aGlzLnByb3BzLmNsYXNzTmFtZSlcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5zaXplKSB7XG4gICAgICBjbGFzc2VzLnB1c2goJ2ZhLScgKyB0aGlzLnByb3BzLnNpemUpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaVwiLCBSZWFjdC5fX3NwcmVhZCh7fSwgIHByb3BzLCB7Y2xhc3NOYW1lOiBjbGFzc2VzLmpvaW4oJyAnKX0pKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEljb247XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMk52YlhCdmJtVnVkSE12YVdOdmJpNXFjM2dpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN08wRkJSVUVzUjBGQlJ6czdRVUZGU0N4SlFVRkpMRWxCUVVrc1EwRkJRenRCUVVOVUxFbEJRVWtzUTBGQlF5eFBRVUZQTEU5QlFVOHNRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJRenRCUVVOc1F5eEpRVUZKTEV0QlFVc3NSMEZCUnl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03TzBGQlJUZENPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdSMEZGUnp0QlFVTklMREJDUVVFd1FpeHZRa0ZCUVR0RlFVTjRRaXhUUVVGVExFVkJRVVU3U1VGRFZDeExRVUZMTEU5QlFVOHNTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhOUVVGTk8wbEJRMnhETEVsQlFVa3NVVUZCVVN4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFMUJRVTBzUTBGQlF5eFZRVUZWTzBsQlF6ZERMRk5CUVZNc1IwRkJSeXhMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEUxQlFVMDdSMEZEYmtNN1JVRkRSQ3hOUVVGTkxFVkJRVVVzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4RFFVRkRMR1ZCUVdVc1EwRkJRenRGUVVOMFF5eE5RVUZOTEVWQlFVVXNXVUZCV1R0SlFVTnNRaXhKUVVGSkxFOUJRVThzUjBGQlJ5eERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPMEZCUTJwRExFbEJRVWtzU1VGQlNTeExRVUZMTEV0QlFVc3NRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eEZRVUZGTEVOQlFVTXNUMEZCVHl4RlFVRkZMRTFCUVUwc1JVRkJSU3hYUVVGWExFTkJRVU1zUTBGQlF5eERRVUZET3p0SlFVVnFSU3hKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4RlFVRkZPMDFCUTNCQ0xFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNWMEZCVnl4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdRVUZEYmtRc1MwRkJTenM3U1VGRlJDeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hGUVVGRk8wMUJRMjVDTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRE9VSXNTMEZCU3pzN1NVRkZSQ3hKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RlFVRkZPMDFCUTI1Q0xFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdRVUZETlVNc1MwRkJTenM3U1VGRlJDeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhGUVVGRk8wMUJRM2hDTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTTdRVUZEZUVNc1MwRkJTenM3U1VGRlJDeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hGUVVGRk8wMUJRMjVDTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkROVU1zUzBGQlN6czdTVUZGUkR0TlFVTkZMRzlDUVVGQkxFZEJRVVVzUlVGQlFTeG5Ra0ZCUVN4SFFVRkJMRU5CUVVVc1IwRkJSeXhMUVVGTExFVkJRVU1zUTBGQlF5eERRVUZCTEZOQlFVRXNSVUZCVXl4RFFVRkZMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZITEVOQlFVRXNRMEZCU1N4RFFVRkJPMDFCUTJoRU8wZEJRMGc3UVVGRFNDeERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEVsQlFVa3NRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFLbHh1SUNvZ1FHcHplQ0JTWldGamRDNUVUMDFjYmlBcUwxeHVYRzUyWVhJZ1NXTnZianRjYm5aaGNpQmZJQ0FnSUNBOUlISmxjWFZwY21Vb0ozVnVaR1Z5YzJOdmNtVW5LVHRjYm5aaGNpQlNaV0ZqZENBOUlISmxjWFZwY21Vb0ozSmxZV04wSnlrN1hHNWNiaThxS2x4dUlDb2dRM0psWVhSbGN5QmhiaUJwWTI5dUxDQmpkWEp5Wlc1MGJIa2dkWE5wYm1jZ2RHaGxJR1p2Ym5RZ1lYZGxjMjl0WlNCcFkyOXVJR3hwWW5KaGNubGNiaUFxWEc0Z0tpQkFaWGhoYlhCc1pYTmNiaUFxSUR4SlkyOXVJSFI1Y0dVOVhDSmphR1ZqYTF3aUlDOCtYRzRnS2lBOFNXTnZiaUIwZVhCbFBWd2lkWE5sY2x3aUlHTnNZWE56VG1GdFpUMWNJbTExZEdWa1hDSWdMejVjYmlBcUlEeEpZMjl1SUhSNWNHVTlYQ0ppWVc1Y0lpQnpkR0ZqYXoxY0lqSjRYQ0lnTHo1Y2JpQXFMMXh1U1dOdmJpQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ2NISnZjRlI1Y0dWek9pQjdYRzRnSUNBZ2MzUmhZMnM2SUNBZ0lDQWdVbVZoWTNRdVVISnZjRlI1Y0dWekxuTjBjbWx1Wnl4Y2JpQWdJQ0IwZVhCbE9pQWdJQ0FnSUNCU1pXRmpkQzVRY205d1ZIbHdaWE11YzNSeWFXNW5MbWx6VW1WeGRXbHlaV1FzWEc0Z0lDQWdZMnhoYzNOT1lXMWxPaUFnVW1WaFkzUXVVSEp2Y0ZSNWNHVnpMbk4wY21sdVoxeHVJQ0I5TEZ4dUlDQnRhWGhwYm5NNklGdFNaV0ZqZEM1aFpHUnZibk11VUhWeVpWSmxibVJsY2sxcGVHbHVYU3hjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2RtRnlJR05zWVhOelpYTWdQU0JiSjJaaElHWmhMV2xqYjI0blhUdGNiaUFnSUNCMllYSWdjSEp2Y0hNZ0lDQTlJRjh1YjIxcGRDaDBhR2x6TG5CeWIzQnpMQ0JiSjNOMFlXTnJKeXdnSjNSNWNHVW5MQ0FuWTJ4aGMzTk9ZVzFsSjEwcE8xeHVYRzRnSUNBZ2FXWWdLSFJvYVhNdWNISnZjSE11YzNSaFkyc3BJSHRjYmlBZ0lDQWdJR05zWVhOelpYTXVjSFZ6YUNnblptRXRjM1JoWTJzdEp5QXJJSFJvYVhNdWNISnZjSE11YzNSaFkyc3BPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2gwYUdsekxuQnliM0J6TG5Od2FXNHBJSHRjYmlBZ0lDQWdJR05zWVhOelpYTXVjSFZ6YUNnblptRXRjM0JwYmljcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdsbUlDaDBhR2x6TG5CeWIzQnpMblI1Y0dVcElIdGNiaUFnSUNBZ0lHTnNZWE56WlhNdWNIVnphQ2duWm1FdEp5QXJJSFJvYVhNdWNISnZjSE11ZEhsd1pTazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLSFJvYVhNdWNISnZjSE11WTJ4aGMzTk9ZVzFsS1NCN1hHNGdJQ0FnSUNCamJHRnpjMlZ6TG5CMWMyZ29kR2hwY3k1d2NtOXdjeTVqYkdGemMwNWhiV1VwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdhV1lnS0hSb2FYTXVjSEp2Y0hNdWMybDZaU2tnZTF4dUlDQWdJQ0FnWTJ4aGMzTmxjeTV3ZFhOb0tDZG1ZUzBuSUNzZ2RHaHBjeTV3Y205d2N5NXphWHBsS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQR2tnZXk0dUxuQnliM0J6ZlNCamJHRnpjMDVoYldVOWUyTnNZWE56WlhNdWFtOXBiaWduSUNjcGZUNDhMMmsrWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1NXTnZianRjYmlKZGZRPT0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFNvcnRJbmRpY2F0b3I7XG52YXIgY2xhc3NfbWFwO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBJY29uID0gcmVxdWlyZSgnLi9pY29uLmpzeCcpO1xuXG5jbGFzc19tYXAgPSB7XG4gIGFzYzogICdzb3J0LXVwJyxcbiAgZGVzYzogJ3NvcnQtZG93bidcbn07XG5cblNvcnRJbmRpY2F0b3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiU29ydEluZGljYXRvclwiLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaWNvbiAgICAgID0gbnVsbDtcbiAgICB2YXIgZGlyZWN0aW9uID0gY2xhc3NfbWFwW3RoaXMucHJvcHMuZGlyZWN0aW9uXTtcblxuICAgIGlmIChkaXJlY3Rpb24pIHtcbiAgICAgIGljb24gPSBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiBkaXJlY3Rpb24sIHN0YWNrOiBcIjF4XCJ9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJmYS1zdGFjayBzb3J0ZXJcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiBcInNvcnRcIiwgc3RhY2s6IFwiMXhcIn0pLCBcbiAgICAgICAgaWNvblxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNvcnRJbmRpY2F0b3I7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMk52YlhCdmJtVnVkSE12YzI5eWRGOXBibVJwWTJGMGIzSXVhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRVVZCTEVkQlFVYzdPMEZCUlVnc1NVRkJTU3hoUVVGaExFTkJRVU03UVVGRGJFSXNTVUZCU1N4VFFVRlRMRU5CUVVNN1FVRkRaQ3hKUVVGSkxFdEJRVXNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1FVRkROMElzU1VGQlNTeEpRVUZKTEVkQlFVY3NUMEZCVHl4RFFVRkRMRmxCUVZrc1EwRkJReXhEUVVGRE96dEJRVVZxUXl4VFFVRlRMRWRCUVVjN1JVRkRWaXhIUVVGSExFZEJRVWNzVTBGQlV6dEZRVU5tTEVsQlFVa3NSVUZCUlN4WFFVRlhPMEZCUTI1Q0xFTkJRVU1zUTBGQlF6czdRVUZGUml4dFEwRkJiVU1zTmtKQlFVRTdSVUZEYWtNc1RVRkJUU3hGUVVGRkxGbEJRVms3U1VGRGJFSXNTVUZCU1N4SlFVRkpMRkZCUVZFc1NVRkJTU3hEUVVGRE8wRkJRM3BDTEVsQlFVa3NTVUZCU1N4VFFVRlRMRWRCUVVjc1UwRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN08wbEJSV2hFTEVsQlFVa3NVMEZCVXl4RlFVRkZPMDFCUTJJc1NVRkJTU3hIUVVGSExHOUNRVUZETEVsQlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1NVRkJRU3hGUVVGSkxFTkJRVVVzVTBGQlV5eEZRVUZETEVOQlFVTXNTMEZCUVN4RlFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGQkxFTkJRVWNzUTBGQlFTeERRVUZETzBGQlEyeEVMRXRCUVVzN08wbEJSVVE3VFVGRFJTeHZRa0ZCUVN4TlFVRkxMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEdsQ1FVRnJRaXhEUVVGQkxFVkJRVUU3VVVGRGFFTXNiMEpCUVVNc1NVRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eEpRVUZCTEVWQlFVa3NRMEZCUXl4TlFVRkJMRVZCUVUwc1EwRkJReXhMUVVGQkxFVkJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVRXNRMEZCUnl4RFFVRkJMRVZCUVVFN1VVRkRPVUlzU1VGQlN6dE5RVU5FTEVOQlFVRTdUVUZEVUR0SFFVTklPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhoUVVGaExFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUZOdmNuUkpibVJwWTJGMGIzSTdYRzUyWVhJZ1kyeGhjM05mYldGd08xeHVkbUZ5SUZKbFlXTjBJRDBnY21WeGRXbHlaU2duY21WaFkzUW5LVHRjYm5aaGNpQkpZMjl1SUQwZ2NtVnhkV2x5WlNnbkxpOXBZMjl1TG1wemVDY3BPMXh1WEc1amJHRnpjMTl0WVhBZ1BTQjdYRzRnSUdGell6b2dJQ2R6YjNKMExYVndKeXhjYmlBZ1pHVnpZem9nSjNOdmNuUXRaRzkzYmlkY2JuMDdYRzVjYmxOdmNuUkpibVJwWTJGMGIzSWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJwWTI5dUlDQWdJQ0FnUFNCdWRXeHNPMXh1SUNBZ0lIWmhjaUJrYVhKbFkzUnBiMjRnUFNCamJHRnpjMTl0WVhCYmRHaHBjeTV3Y205d2N5NWthWEpsWTNScGIyNWRPMXh1WEc0Z0lDQWdhV1lnS0dScGNtVmpkR2x2YmlrZ2UxeHVJQ0FnSUNBZ2FXTnZiaUE5SUR4SlkyOXVJSFI1Y0dVOWUyUnBjbVZqZEdsdmJuMGdjM1JoWTJzOVhDSXhlRndpSUM4K08xeHVJQ0FnSUgxY2JseHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4YzNCaGJpQmpiR0Z6YzA1aGJXVTlYQ0ptWVMxemRHRmpheUJ6YjNKMFpYSmNJajVjYmlBZ0lDQWdJQ0FnUEVsamIyNGdkSGx3WlQxY0luTnZjblJjSWlCemRHRmphejFjSWpGNFhDSWdMejVjYmlBZ0lDQWdJQ0FnZTJsamIyNTlYRzRnSUNBZ0lDQThMM053WVc0K1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdVMjl5ZEVsdVpHbGpZWFJ2Y2p0Y2JpSmRmUT09IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBUYWJzO1xudmFyIFJlYWN0ICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEJ1dHRvbiAgPSByZXF1aXJlKCcuL2J1dHRvbi5qc3gnKTtcblxuVGFicyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUYWJzXCIsXG4gIHByb3BUeXBlczoge1xuICAgIGFjdGlvbjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgdGFiczogICBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlcbiAgfSxcbiAgbWl4aW5zOiBbUmVhY3QuYWRkb25zLlB1cmVSZW5kZXJNaXhpbl0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwge2NsYXNzTmFtZTogXCJ0YWJzXCJ9LCBcbiAgICAgICAgdGhpcy5fYnVpbGRUYWJzKClcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBfYnVpbGRUYWJzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMudGFicy5tYXAoZnVuY3Rpb24gKHRhYiwgaW5kZXgpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7a2V5OiBpbmRleH0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7b25DbGljazogdGFiLmFjdGlvbiwgaWNvbjogdGFiLmljb24sIHRleHQ6IHRhYi50ZXh0fSlcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9LCB0aGlzKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGFicztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyTnZiWEJ2Ym1WdWRITXZkR0ZpY3k1cWMzZ2lYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3TzBGQlJVRXNSMEZCUnpzN1FVRkZTQ3hKUVVGSkxFbEJRVWtzUTBGQlF6dEJRVU5VTEVsQlFVa3NTMEZCU3l4TFFVRkxMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU12UWl4SlFVRkpMRTFCUVUwc1NVRkJTU3hQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTTdPMEZCUlhSRExEQkNRVUV3UWl4dlFrRkJRVHRGUVVONFFpeFRRVUZUTEVWQlFVVTdTVUZEVkN4TlFVRk5MRVZCUVVVc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTzBsQlF6VkNMRWxCUVVrc1NVRkJTU3hMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEV0QlFVczdSMEZET1VJN1JVRkRSQ3hOUVVGTkxFVkJRVVVzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4RFFVRkRMR1ZCUVdVc1EwRkJRenRGUVVOMFF5eE5RVUZOTEVWQlFVVXNXVUZCV1R0SlFVTnNRanROUVVORkxHOUNRVUZCTEVsQlFVY3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zVFVGQlR5eERRVUZCTEVWQlFVRTdVVUZEYkVJc1NVRkJTU3hEUVVGRExGVkJRVlVzUlVGQlJ6dE5RVU5vUWl4RFFVRkJPMDFCUTB3N1IwRkRTRHRGUVVORUxGVkJRVlVzUlVGQlJTeFpRVUZaTzBsQlEzUkNMRTlCUVU4c1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVZVc1IwRkJSeXhGUVVGRkxFdEJRVXNzUlVGQlJUdE5RVU12UXp0UlFVTkZMRzlDUVVGQkxFbEJRVWNzUlVGQlFTeERRVUZCTEVOQlFVTXNSMEZCUVN4RlFVRkhMRU5CUVVVc1MwRkJUeXhEUVVGQkxFVkJRVUU3VlVGRFpDeHZRa0ZCUXl4TlFVRk5MRVZCUVVFc1EwRkJRU3hEUVVGRExFOUJRVUVzUlVGQlR5eERRVUZGTEVkQlFVY3NRMEZCUXl4TlFVRk5MRVZCUVVNc1EwRkJReXhKUVVGQkxFVkJRVWtzUTBGQlJTeEhRVUZITEVOQlFVTXNTVUZCU1N4RlFVRkRMRU5CUVVNc1NVRkJRU3hGUVVGSkxFTkJRVVVzUjBGQlJ5eERRVUZETEVsQlFVc3NRMEZCUVN4RFFVRkhMRU5CUVVFN1VVRkROVVFzUTBGQlFUdFJRVU5NTzB0QlEwZ3NSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenRIUVVOV08wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRlJoWW5NN1hHNTJZWElnVW1WaFkzUWdJQ0E5SUhKbGNYVnBjbVVvSjNKbFlXTjBKeWs3WEc1MllYSWdRblYwZEc5dUlDQTlJSEpsY1hWcGNtVW9KeTR2WW5WMGRHOXVMbXB6ZUNjcE8xeHVYRzVVWVdKeklEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1SUNCd2NtOXdWSGx3WlhNNklIdGNiaUFnSUNCaFkzUnBiMjQ2SUZKbFlXTjBMbEJ5YjNCVWVYQmxjeTVtZFc1akxGeHVJQ0FnSUhSaFluTTZJQ0FnVW1WaFkzUXVVSEp2Y0ZSNWNHVnpMbUZ5Y21GNVhHNGdJSDBzWEc0Z0lHMXBlR2x1Y3pvZ1cxSmxZV04wTG1Ga1pHOXVjeTVRZFhKbFVtVnVaR1Z5VFdsNGFXNWRMRnh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEhWc0lHTnNZWE56VG1GdFpUMWNJblJoWW5OY0lqNWNiaUFnSUNBZ0lDQWdlM1JvYVhNdVgySjFhV3hrVkdGaWN5Z3BmVnh1SUNBZ0lDQWdQQzkxYkQ1Y2JpQWdJQ0FwTzF4dUlDQjlMRnh1SUNCZlluVnBiR1JVWVdKek9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11Y0hKdmNITXVkR0ZpY3k1dFlYQW9ablZ1WTNScGIyNGdLSFJoWWl3Z2FXNWtaWGdwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0FnSUR4c2FTQnJaWGs5ZTJsdVpHVjRmVDVjYmlBZ0lDQWdJQ0FnSUNBOFFuVjBkRzl1SUc5dVEyeHBZMnM5ZTNSaFlpNWhZM1JwYjI1OUlHbGpiMjQ5ZTNSaFlpNXBZMjl1ZlNCMFpYaDBQWHQwWVdJdWRHVjRkSDBnTHo1Y2JpQWdJQ0FnSUNBZ1BDOXNhVDVjYmlBZ0lDQWdJQ2s3WEc0Z0lDQWdmU3dnZEdocGN5azdYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUZSaFluTTdYRzRpWFgwPSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgVGQ7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG5UZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZFwiLFxuICBtaXhpbnM6IFtSZWFjdC5hZGRvbnMuUHVyZVJlbmRlck1peGluXSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgdGhpcy5wcm9wcyksIFxuICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMk52YlhCdmJtVnVkSE12ZEdRdWFuTjRJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCT3p0QlFVVkJMRWRCUVVjN08wRkJSVWdzU1VGQlNTeEZRVUZGTEVOQlFVTTdRVUZEVUN4SlFVRkpMRXRCUVVzc1IwRkJSeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdPMEZCUlRkQ0xIZENRVUYzUWl4clFrRkJRVHRGUVVOMFFpeE5RVUZOTEVWQlFVVXNRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExHVkJRV1VzUTBGQlF6dEJRVU40UXl4RlFVRkZMRTFCUVUwc1JVRkJSU3haUVVGWk96dEpRVVZzUWp0TlFVTkZMRzlDUVVGQkxFbEJRVWNzUlVGQlFTeG5Ra0ZCUVN4SFFVRkJMRU5CUVVVc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlR5eERRVUZCTEVWQlFVRTdVVUZEYWtJc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFJRVUZUTzAxQlEyeENMRU5CUVVFN1RVRkRURHRIUVVOSU8wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eEZRVUZGTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRlJrTzF4dWRtRnlJRkpsWVdOMElEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRbktUdGNibHh1VkdRZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUcxcGVHbHVjem9nVzFKbFlXTjBMbUZrWkc5dWN5NVFkWEpsVW1WdVpHVnlUV2w0YVc1ZExGeHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JseHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4ZEdRZ2V5NHVMblJvYVhNdWNISnZjSE45UGx4dUlDQWdJQ0FnSUNCN2RHaHBjeTV3Y205d2N5NWphR2xzWkhKbGJuMWNiaUFnSUNBZ0lEd3ZkR1ErWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1ZHUTdYRzRpWFgwPSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgVGg7XG52YXIgUmVhY3QgICAgICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBCYWNrYm9uZSAgICAgICAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyIFNvcnRJbmRpY2F0b3IgICA9IHJlcXVpcmUoJy4vc29ydF9pbmRpY2F0b3IuanN4Jyk7XG5cblRoID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRoXCIsXG4gIHByb3BUeXBlczoge1xuICAgIHRyaWdnZXJTb3J0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjbGFzc2VzID0gW3RoaXMucHJvcHMuY2xhc3NOYW1lIHx8ICcnXTtcbiAgICB2YXIgc29ydF9pbmRpY2F0b3IgPSBudWxsO1xuICAgIHZhciBuZXdfcHJvcHMgPSB7c3R5bGU6e319O1xuXG4gICAgaWYgKHRoaXMucHJvcHMudHJpZ2dlclNvcnQgfHwgdGhpcy5wcm9wcy5zb3J0RGlyZWN0aW9uKSB7XG4gICAgICBjbGFzc2VzLnB1c2goJ3NvcnRhYmxlJyk7XG5cbiAgICAgIHNvcnRfaW5kaWNhdG9yID0gUmVhY3QuY3JlYXRlRWxlbWVudChTb3J0SW5kaWNhdG9yLCB7ZGlyZWN0aW9uOiB0aGlzLnByb3BzLnNvcnREaXJlY3Rpb259KVxuICAgIH1cblxuICAgIFsnbWluaW1hbCcsICdsb2NrZWQnLCAncmVzaXphYmxlJ10uZm9yRWFjaChmdW5jdGlvbiAodmFsKSB7XG4gICAgICBpZiAodGhpcy5wcm9wc1t2YWxdKSB7XG4gICAgICAgIGNsYXNzZXMucHVzaCh2YWwpO1xuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMud2lkdGgpIHtcbiAgICAgIG5ld19wcm9wcy5zdHlsZS53aWR0aCA9IHRoaXMucHJvcHMud2lkdGg7XG4gICAgfVxuXG4gICAgbmV3X3Byb3BzLmNsYXNzTmFtZSA9IGNsYXNzZXMubGVuZ3RoID4gMSA/IGNsYXNzZXMuam9pbignICcpIDogY2xhc3Nlc1swXTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhcIiwgUmVhY3QuX19zcHJlYWQoe30sICBuZXdfcHJvcHMsIHtvbkNsaWNrOiB0aGlzLl9oYW5kbGVDbGlja30pLCBcbiAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlbiwgXG4gICAgICAgIHNvcnRfaW5kaWNhdG9yXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgX2hhbmRsZUNsaWNrOiBmdW5jdGlvbiAoZSkge1xuICAgIGlmICh0aGlzLnByb3BzLmhhbmRsZUNsaWNrKSB7XG4gICAgICB0aGlzLnByb3BzLmhhbmRsZUNsaWNrKGUpO1xuICAgIH1cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGg7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMk52YlhCdmJtVnVkSE12ZEdndWFuTjRJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCT3p0QlFVVkJMRWRCUVVjN08wRkJSVWdzU1VGQlNTeEZRVUZGTEVOQlFVTTdRVUZEVUN4SlFVRkpMRXRCUVVzc1lVRkJZU3hQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdRVUZEZGtNc1NVRkJTU3hSUVVGUkxGVkJRVlVzVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPMEZCUXpGRExFbEJRVWtzWVVGQllTeExRVUZMTEU5QlFVOHNRMEZCUXl4elFrRkJjMElzUTBGQlF5eERRVUZET3p0QlFVVjBSQ3gzUWtGQmQwSXNhMEpCUVVFN1JVRkRkRUlzVTBGQlV5eEZRVUZGTzBsQlExUXNWMEZCVnl4RlFVRkZMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zVFVGQlRUdEhRVU53UXp0RlFVTkVMRTFCUVUwc1JVRkJSU3haUVVGWk8wbEJRMnhDTEVsQlFVa3NUMEZCVHl4SFFVRkhMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVsQlFVa3NSVUZCUlN4RFFVRkRMRU5CUVVNN1NVRkRNME1zU1VGQlNTeGpRVUZqTEVkQlFVY3NTVUZCU1N4RFFVRkRPMEZCUXpsQ0xFbEJRVWtzU1VGQlNTeFRRVUZUTEVkQlFVY3NRMEZCUXl4TFFVRkxMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU03TzBsQlJUTkNMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFhRVUZYTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhoUVVGaExFVkJRVVU3UVVGRE5VUXNUVUZCVFN4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZET3p0TlFVVjZRaXhqUVVGakxFZEJRVWNzYjBKQlFVTXNZVUZCWVN4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMR0ZCUVdNc1EwRkJRU3hEUVVGSExFTkJRVUU3UVVGRE4wVXNTMEZCU3pzN1NVRkZSQ3hEUVVGRExGTkJRVk1zUlVGQlJTeFJRVUZSTEVWQlFVVXNWMEZCVnl4RFFVRkRMRU5CUVVNc1QwRkJUeXhEUVVGRExGVkJRVlVzUjBGQlJ5eEZRVUZGTzAxQlEzaEVMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlR0UlFVTnVRaXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPMDlCUTI1Q08wRkJRMUFzUzBGQlN5eEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPenRKUVVWVUxFbEJRVWtzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRVZCUVVVN1RVRkRjRUlzVTBGQlV5eERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTTdRVUZETDBNc1MwRkJTenM3UVVGRlRDeEpRVUZKTEZOQlFWTXNRMEZCUXl4VFFVRlRMRWRCUVVjc1QwRkJUeXhEUVVGRExFMUJRVTBzUjBGQlJ5eERRVUZETEVkQlFVY3NUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUjBGQlJ5eFBRVUZQTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN08wbEJSVEZGTzAxQlEwVXNiMEpCUVVFc1NVRkJSeXhGUVVGQkxHZENRVUZCTEVkQlFVRXNRMEZCUlN4SFFVRkhMRk5CUVZNc1JVRkJReXhEUVVGRExFTkJRVUVzVDBGQlFTeEZRVUZQTEVOQlFVVXNTVUZCU1N4RFFVRkRMRmxCUVdNc1EwRkJRU3hEUVVGQkxFVkJRVUU3VVVGRE5VTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGUkxFVkJRVU03VVVGRGNFSXNZMEZCWlR0TlFVTmlMRU5CUVVFN1RVRkRURHRIUVVOSU8wVkJRMFFzV1VGQldTeEZRVUZGTEZWQlFWVXNRMEZCUXl4RlFVRkZPMGxCUTNwQ0xFbEJRVWtzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4WFFVRlhMRVZCUVVVN1RVRkRNVUlzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UzBGRE0wSTdSMEZEUmp0QlFVTklMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZJTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1JVRkJSU3hEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeW9xWEc0Z0tpQkFhbk40SUZKbFlXTjBMa1JQVFZ4dUlDb3ZYRzVjYm5aaGNpQlVhRHRjYm5aaGNpQlNaV0ZqZENBZ0lDQWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDZHlaV0ZqZENjcE8xeHVkbUZ5SUVKaFkydGliMjVsSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSjJKaFkydGliMjVsSnlrN1hHNTJZWElnVTI5eWRFbHVaR2xqWVhSdmNpQWdJRDBnY21WeGRXbHlaU2duTGk5emIzSjBYMmx1WkdsallYUnZjaTVxYzNnbktUdGNibHh1VkdnZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUhCeWIzQlVlWEJsY3pvZ2UxeHVJQ0FnSUhSeWFXZG5aWEpUYjNKME9pQlNaV0ZqZEM1UWNtOXdWSGx3WlhNdWMzUnlhVzVuWEc0Z0lIMHNYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQmpiR0Z6YzJWeklEMGdXM1JvYVhNdWNISnZjSE11WTJ4aGMzTk9ZVzFsSUh4OElDY25YVHRjYmlBZ0lDQjJZWElnYzI5eWRGOXBibVJwWTJGMGIzSWdQU0J1ZFd4c08xeHVJQ0FnSUhaaGNpQnVaWGRmY0hKdmNITWdQU0I3YzNSNWJHVTZlMzE5TzF4dVhHNGdJQ0FnYVdZZ0tIUm9hWE11Y0hKdmNITXVkSEpwWjJkbGNsTnZjblFnZkh3Z2RHaHBjeTV3Y205d2N5NXpiM0owUkdseVpXTjBhVzl1S1NCN1hHNGdJQ0FnSUNCamJHRnpjMlZ6TG5CMWMyZ29KM052Y25SaFlteGxKeWs3WEc1Y2JpQWdJQ0FnSUhOdmNuUmZhVzVrYVdOaGRHOXlJRDBnUEZOdmNuUkpibVJwWTJGMGIzSWdaR2x5WldOMGFXOXVQWHQwYUdsekxuQnliM0J6TG5OdmNuUkVhWEpsWTNScGIyNTlJQzgrWEc0Z0lDQWdmVnh1WEc0Z0lDQWdXeWR0YVc1cGJXRnNKeXdnSjJ4dlkydGxaQ2NzSUNkeVpYTnBlbUZpYkdVblhTNW1iM0pGWVdOb0tHWjFibU4wYVc5dUlDaDJZV3dwSUh0Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG5CeWIzQnpXM1poYkYwcElIdGNiaUFnSUNBZ0lDQWdZMnhoYzNObGN5NXdkWE5vS0haaGJDazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTd2dkR2hwY3lrN1hHNWNiaUFnSUNCcFppQW9kR2hwY3k1d2NtOXdjeTUzYVdSMGFDa2dlMXh1SUNBZ0lDQWdibVYzWDNCeWIzQnpMbk4wZVd4bExuZHBaSFJvSUQwZ2RHaHBjeTV3Y205d2N5NTNhV1IwYUR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0J1WlhkZmNISnZjSE11WTJ4aGMzTk9ZVzFsSUQwZ1kyeGhjM05sY3k1c1pXNW5kR2dnUGlBeElEOGdZMnhoYzNObGN5NXFiMmx1S0NjZ0p5a2dPaUJqYkdGemMyVnpXekJkTzF4dVhHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHgwYUNCN0xpNHVibVYzWDNCeWIzQnpmU0J2YmtOc2FXTnJQWHQwYUdsekxsOW9ZVzVrYkdWRGJHbGphMzArWEc0Z0lDQWdJQ0FnSUh0MGFHbHpMbkJ5YjNCekxtTm9hV3hrY21WdWZWeHVJQ0FnSUNBZ0lDQjdjMjl5ZEY5cGJtUnBZMkYwYjNKOVhHNGdJQ0FnSUNBOEwzUm9QbHh1SUNBZ0lDazdYRzRnSUgwc1hHNGdJRjlvWVc1a2JHVkRiR2xqYXpvZ1puVnVZM1JwYjI0Z0tHVXBJSHRjYmlBZ0lDQnBaaUFvZEdocGN5NXdjbTl3Y3k1b1lXNWtiR1ZEYkdsamF5a2dlMXh1SUNBZ0lDQWdkR2hwY3k1d2NtOXdjeTVvWVc1a2JHVkRiR2xqYXlobEtUdGNiaUFnSUNCOVhHNGdJSDFjYm4wcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRlJvTzF4dUlsMTkiLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFRyO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuVHIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVHJcIixcbiAgbWl4aW5zOiBbUmVhY3QuYWRkb25zLlB1cmVSZW5kZXJNaXhpbl0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgUmVhY3QuX19zcHJlYWQoe30sICB0aGlzLnByb3BzKSwgXG4gICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW5cbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyTnZiWEJ2Ym1WdWRITXZkSEl1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPenRCUVVWQkxFZEJRVWM3TzBGQlJVZ3NTVUZCU1N4RlFVRkZMRU5CUVVNN1FVRkRVQ3hKUVVGSkxFdEJRVXNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN08wRkJSVGRDTEhkQ1FVRjNRaXhyUWtGQlFUdEZRVU4wUWl4TlFVRk5MRVZCUVVVc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETEdWQlFXVXNRMEZCUXp0RlFVTjBReXhOUVVGTkxFVkJRVVVzV1VGQldUdEpRVU5zUWp0TlFVTkZMRzlDUVVGQkxFbEJRVWNzUlVGQlFTeG5Ra0ZCUVN4SFFVRkJMRU5CUVVVc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlR5eERRVUZCTEVWQlFVRTdVVUZEYWtJc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFJRVUZUTzAxQlEyeENMRU5CUVVFN1RVRkRURHRIUVVOSU8wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eEZRVUZGTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRlJ5TzF4dWRtRnlJRkpsWVdOMElEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRbktUdGNibHh1VkhJZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUcxcGVHbHVjem9nVzFKbFlXTjBMbUZrWkc5dWN5NVFkWEpsVW1WdVpHVnlUV2w0YVc1ZExGeHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQSFJ5SUhzdUxpNTBhR2x6TG5CeWIzQnpmVDVjYmlBZ0lDQWdJQ0FnZTNSb2FYTXVjSEp2Y0hNdVkyaHBiR1J5Wlc1OVhHNGdJQ0FnSUNBOEwzUnlQbHh1SUNBZ0lDazdYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUZSeU8xeHVJbDE5IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBEQVRFX0ZPUk1BVDogJ01NTSBELCBZWVlZIGg6bW06c3MgYSdcbn07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMk52Ym5OMFlXNTBjeTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeFpRVUZaTEVOQlFVTTdPMEZCUldJc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ6dEZRVU5tTEZkQlFWY3NSVUZCUlN4MVFrRkJkVUk3UTBGRGNrTXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklsd2lkWE5sSUhOMGNtbGpkRndpTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlIdGNiaUFnUkVGVVJWOUdUMUpOUVZRNklDZE5UVTBnUkN3Z1dWbFpXU0JvT20xdE9uTnpJR0VuWEc1OU8xeHVJbDE5IiwidmFyIHBlb3BsZSAgICAgPSBbbnVsbCwgJ0hhbmsgSm9uZXMnLCAnUm9iZXJ0IFNhbGZvcmQnXTtcbnZhciBncm91cHMgICAgID0gW251bGwsICdATyZHIEwyJ107XG52YXIgc3VidHlwZXMgICA9IFsnYWxhcm0gaXNzdWUnLCAncHJvZHVjdGlvbiBpc3N1ZScsICdjb21tIGlzc3VlJ107XG52YXIgZGV2aWNlcyAgICA9IFsnTHVma28gV2FscnVzJywgJ01hbmNoaWxkIEZyaXR6JywgJ0FkZXB0IE5vZGUnXTtcbnZhciB0eXBlcyAgICAgID0gWydXZWxsIHN1cHBvcnQnXTtcbnZhciByZXBvcnRlcnMgID0gWydCcmlhbicsICdTaGFoaWQnLCAnUmFqZXNoJ107XG52YXIgc3RhdHVzZXMgICA9IFsnY2xvc2VkJywgJ3Jlc29sdmVkJywgJ29wZW4nLCAnYWN0aXZlJ107XG52YXIgcHJpb3JpdGllcyA9IFsxLDIsMyw0LDVdO1xuXG5mdW5jdGlvbiByYW5kb21pemUgKGFycikge1xuICByZXR1cm4gYXJyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpXTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGUgKG51bSkge1xuICB2YXIgaTtcbiAgdmFyIHZhbHVlcyA9IFtdO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBudW07IGkrKykge1xuICAgIHZhbHVlcy5wdXNoKHtcbiAgICAgIHN0YXR1czogICAgICAgICAgICAgICAgICAgcmFuZG9taXplKHN0YXR1c2VzKSxcbiAgICAgIHByaW9yaXR5OiAgICAgICAgICAgICAgICAgcmFuZG9taXplKHByaW9yaXRpZXMpLFxuICAgICAgY3JlYXRlZF9kYXRlOiAgICAgICAgICAgICBuZXcgRGF0ZSgpLFxuICAgICAgdXBkYXRlZF9kYXRlOiAgICAgICAgICAgICBuZXcgRGF0ZSgpLFxuICAgICAgcmVwb3J0ZXI6ICAgICAgICAgICAgICAgICByYW5kb21pemUocmVwb3J0ZXJzKSxcbiAgICAgIHN1YnR5cGU6ICAgICAgICAgICAgICAgICAgcmFuZG9taXplKHN1YnR5cGVzKSxcbiAgICAgIGFzc2lnbmVkX2dyb3VwOiAgICAgICAgICAgcmFuZG9taXplKGdyb3VwcyksXG4gICAgICBhc3NpZ25lZF9wZXJzb246ICAgICAgICAgIHJhbmRvbWl6ZShwZW9wbGUpLFxuICAgICAgdHlwZTogICAgICAgICAgICAgICAgICAgICByYW5kb21pemUodHlwZXMpLFxuICAgICAgZGV2aWNlOiAgICAgICAgICAgICAgICAgICByYW5kb21pemUoZGV2aWNlcylcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2VuZXJhdGU7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMlJoZEdFdlkyRnpaWE5mYkdsemRGOWliMlI1TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRWxCUVVrc1RVRkJUU3hQUVVGUExFTkJRVU1zU1VGQlNTeEZRVUZGTEZsQlFWa3NSVUZCUlN4blFrRkJaMElzUTBGQlF5eERRVUZETzBGQlEzaEVMRWxCUVVrc1RVRkJUU3hQUVVGUExFTkJRVU1zU1VGQlNTeEZRVUZGTEZOQlFWTXNRMEZCUXl4RFFVRkRPMEZCUTI1RExFbEJRVWtzVVVGQlVTeExRVUZMTEVOQlFVTXNZVUZCWVN4RlFVRkZMR3RDUVVGclFpeEZRVUZGTEZsQlFWa3NRMEZCUXl4RFFVRkRPMEZCUTI1RkxFbEJRVWtzVDBGQlR5eE5RVUZOTEVOQlFVTXNZMEZCWXl4RlFVRkZMR2RDUVVGblFpeEZRVUZGTEZsQlFWa3NRMEZCUXl4RFFVRkRPMEZCUTJ4RkxFbEJRVWtzUzBGQlN5eFJRVUZSTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNN1FVRkRiRU1zU1VGQlNTeFRRVUZUTEVsQlFVa3NRMEZCUXl4UFFVRlBMRVZCUVVVc1VVRkJVU3hGUVVGRkxGRkJRVkVzUTBGQlF5eERRVUZETzBGQlF5OURMRWxCUVVrc1VVRkJVU3hMUVVGTExFTkJRVU1zVVVGQlVTeEZRVUZGTEZWQlFWVXNSVUZCUlN4TlFVRk5MRVZCUVVVc1VVRkJVU3hEUVVGRExFTkJRVU03UVVGRE1VUXNTVUZCU1N4VlFVRlZMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJUZENMRk5CUVZNc1UwRkJVeXhGUVVGRkxFZEJRVWNzUlVGQlJUdEZRVU4yUWl4UFFVRlBMRWRCUVVjc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4TlFVRk5MRVZCUVVVc1IwRkJSeXhIUVVGSExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTnlSQ3hEUVVGRE96dEJRVVZFTEZOQlFWTXNVVUZCVVN4RlFVRkZMRWRCUVVjc1JVRkJSVHRGUVVOMFFpeEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTlNMRVZCUVVVc1NVRkJTU3hOUVVGTkxFZEJRVWNzUlVGQlJTeERRVUZET3p0RlFVVm9RaXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVXNRMEZCUXl4SFFVRkhMRWRCUVVjc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJUdEpRVU40UWl4TlFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRE8wMUJRMVlzVFVGQlRTeHZRa0ZCYjBJc1UwRkJVeXhEUVVGRExGRkJRVkVzUTBGQlF6dE5RVU0zUXl4UlFVRlJMR3RDUVVGclFpeFRRVUZUTEVOQlFVTXNWVUZCVlN4RFFVRkRPMDFCUXk5RExGbEJRVmtzWTBGQll5eEpRVUZKTEVsQlFVa3NSVUZCUlR0TlFVTndReXhaUVVGWkxHTkJRV01zU1VGQlNTeEpRVUZKTEVWQlFVVTdUVUZEY0VNc1VVRkJVU3hyUWtGQmEwSXNVMEZCVXl4RFFVRkRMRk5CUVZNc1EwRkJRenROUVVNNVF5eFBRVUZQTEcxQ1FVRnRRaXhUUVVGVExFTkJRVU1zVVVGQlVTeERRVUZETzAxQlF6ZERMR05CUVdNc1dVRkJXU3hUUVVGVExFTkJRVU1zVFVGQlRTeERRVUZETzAxQlF6TkRMR1ZCUVdVc1YwRkJWeXhUUVVGVExFTkJRVU1zVFVGQlRTeERRVUZETzAxQlF6TkRMRWxCUVVrc2MwSkJRWE5DTEZOQlFWTXNRMEZCUXl4TFFVRkxMRU5CUVVNN1RVRkRNVU1zVFVGQlRTeHZRa0ZCYjBJc1UwRkJVeXhEUVVGRExFOUJRVThzUTBGQlF6dExRVU0zUXl4RFFVRkRMRU5CUVVNN1FVRkRVQ3hIUVVGSE96dEZRVVZFTEU5QlFVOHNUVUZCVFN4RFFVRkRPMEZCUTJoQ0xFTkJRVU03TzBGQlJVUXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhSUVVGUkxFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKMllYSWdjR1Z2Y0d4bElDQWdJQ0E5SUZ0dWRXeHNMQ0FuU0dGdWF5QktiMjVsY3ljc0lDZFNiMkpsY25RZ1UyRnNabTl5WkNkZE8xeHVkbUZ5SUdkeWIzVndjeUFnSUNBZ1BTQmJiblZzYkN3Z0owQlBKa2NnVERJblhUdGNiblpoY2lCemRXSjBlWEJsY3lBZ0lEMGdXeWRoYkdGeWJTQnBjM04xWlNjc0lDZHdjbTlrZFdOMGFXOXVJR2x6YzNWbEp5d2dKMk52YlcwZ2FYTnpkV1VuWFR0Y2JuWmhjaUJrWlhacFkyVnpJQ0FnSUQwZ1d5ZE1kV1pyYnlCWFlXeHlkWE1uTENBblRXRnVZMmhwYkdRZ1JuSnBkSG9uTENBblFXUmxjSFFnVG05a1pTZGRPMXh1ZG1GeUlIUjVjR1Z6SUNBZ0lDQWdQU0JiSjFkbGJHd2djM1Z3Y0c5eWRDZGRPMXh1ZG1GeUlISmxjRzl5ZEdWeWN5QWdQU0JiSjBKeWFXRnVKeXdnSjFOb1lXaHBaQ2NzSUNkU1lXcGxjMmduWFR0Y2JuWmhjaUJ6ZEdGMGRYTmxjeUFnSUQwZ1d5ZGpiRzl6WldRbkxDQW5jbVZ6YjJ4MlpXUW5MQ0FuYjNCbGJpY3NJQ2RoWTNScGRtVW5YVHRjYm5aaGNpQndjbWx2Y21sMGFXVnpJRDBnV3pFc01pd3pMRFFzTlYwN1hHNWNibVoxYm1OMGFXOXVJSEpoYm1SdmJXbDZaU0FvWVhKeUtTQjdYRzRnSUhKbGRIVnliaUJoY25KYlRXRjBhQzVtYkc5dmNpaE5ZWFJvTG5KaGJtUnZiU2dwSUNvZ1lYSnlMbXhsYm1kMGFDbGRPMXh1ZlZ4dVhHNW1kVzVqZEdsdmJpQm5aVzVsY21GMFpTQW9iblZ0S1NCN1hHNGdJSFpoY2lCcE8xeHVJQ0IyWVhJZ2RtRnNkV1Z6SUQwZ1cxMDdYRzVjYmlBZ1ptOXlJQ2hwSUQwZ01Ec2dhU0E4SUc1MWJUc2dhU3NyS1NCN1hHNGdJQ0FnZG1Gc2RXVnpMbkIxYzJnb2UxeHVJQ0FnSUNBZ2MzUmhkSFZ6T2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCeVlXNWtiMjFwZW1Vb2MzUmhkSFZ6WlhNcExGeHVJQ0FnSUNBZ2NISnBiM0pwZEhrNklDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCeVlXNWtiMjFwZW1Vb2NISnBiM0pwZEdsbGN5a3NYRzRnSUNBZ0lDQmpjbVZoZEdWa1gyUmhkR1U2SUNBZ0lDQWdJQ0FnSUNBZ0lHNWxkeUJFWVhSbEtDa3NYRzRnSUNBZ0lDQjFjR1JoZEdWa1gyUmhkR1U2SUNBZ0lDQWdJQ0FnSUNBZ0lHNWxkeUJFWVhSbEtDa3NYRzRnSUNBZ0lDQnlaWEJ2Y25SbGNqb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lISmhibVJ2YldsNlpTaHlaWEJ2Y25SbGNuTXBMRnh1SUNBZ0lDQWdjM1ZpZEhsd1pUb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnlZVzVrYjIxcGVtVW9jM1ZpZEhsd1pYTXBMRnh1SUNBZ0lDQWdZWE56YVdkdVpXUmZaM0p2ZFhBNklDQWdJQ0FnSUNBZ0lDQnlZVzVrYjIxcGVtVW9aM0p2ZFhCektTeGNiaUFnSUNBZ0lHRnpjMmxuYm1Wa1gzQmxjbk52YmpvZ0lDQWdJQ0FnSUNBZ2NtRnVaRzl0YVhwbEtIQmxiM0JzWlNrc1hHNGdJQ0FnSUNCMGVYQmxPaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKaGJtUnZiV2w2WlNoMGVYQmxjeWtzWEc0Z0lDQWdJQ0JrWlhacFkyVTZJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEpoYm1SdmJXbDZaU2hrWlhacFkyVnpLVnh1SUNBZ0lIMHBPMXh1SUNCOVhHNWNiaUFnY21WMGRYSnVJSFpoYkhWbGN6dGNibjFjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCblpXNWxjbUYwWlR0Y2JpSmRmUT09IiwidmFyIHZhbHVlcyA9IFtdO1xuXG52YWx1ZXMgPSBbXG4gIHtcbiAgICBtaW5pbWFsOiAgICB0cnVlLFxuICAgIG5hbWU6ICAgICAgICdzdGF0dXMnLFxuICAgIHR5cGU6ICAgICAgICdzdGF0dXMnXG4gIH0sXG4gIHtcbiAgICBtaW5pbWFsOiAgICB0cnVlLFxuICAgIG5hbWU6ICAgICAgICdwcmlvcml0eScsXG4gICAgdGl0bGU6ICAgICAgJ1AnLFxuICAgIHR5cGU6ICAgICAgICdwcmlvcml0eSdcbiAgfSxcbiAge1xuICAgIG5hbWU6ICAgICAgICdkZXRhaWxzJyxcbiAgICB0aXRsZTogICAgICAnQ2FzZScsXG4gICAgdHlwZTogICAgICAgJ2Nhc2VfZGV0YWlscydcbiAgfSxcbiAge1xuICAgIG5hbWU6ICAgICAgICdyZXBvcnRlZCcsXG4gICAgdGl0bGU6ICAgICAgJ1JlcG9ydGVkIGJ5JyxcbiAgICB0eXBlOiAgICAgICAnY2FzZV9yZXBvcnRlZCdcbiAgfSxcbiAge1xuICAgIG5hbWU6ICAgICAgICdhc3NpZ25tZW50JyxcbiAgICB0aXRsZTogICAgICAnQXNzaWdubWVudCcsXG4gICAgdHlwZTogICAgICAgJ2Nhc2VfYXNzaWdubWVudCdcbiAgfSxcbiAge1xuICAgIG5hbWU6ICAgICAgICdhY3Rpb25zJyxcbiAgICB0aXRsZTogICAgICAnQWN0aW9uJyxcbiAgICB0eXBlOiAgICAgICAnY2FzZV9hY3Rpb25zJ1xuICB9XG5dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZhbHVlcztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyUmhkR0V2WTJGelpYTmZiR2x6ZEY5b1pXRmthVzVuY3k1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hKUVVGSkxFMUJRVTBzUjBGQlJ5eEZRVUZGTEVOQlFVTTdPMEZCUldoQ0xFMUJRVTBzUjBGQlJ6dEZRVU5RTzBsQlEwVXNUMEZCVHl4TFFVRkxMRWxCUVVrN1NVRkRhRUlzU1VGQlNTeFJRVUZSTEZGQlFWRTdTVUZEY0VJc1NVRkJTU3hSUVVGUkxGRkJRVkU3UjBGRGNrSTdSVUZEUkR0SlFVTkZMRTlCUVU4c1MwRkJTeXhKUVVGSk8wbEJRMmhDTEVsQlFVa3NVVUZCVVN4VlFVRlZPMGxCUTNSQ0xFdEJRVXNzVDBGQlR5eEhRVUZITzBsQlEyWXNTVUZCU1N4UlFVRlJMRlZCUVZVN1IwRkRka0k3UlVGRFJEdEpRVU5GTEVsQlFVa3NVVUZCVVN4VFFVRlRPMGxCUTNKQ0xFdEJRVXNzVDBGQlR5eE5RVUZOTzBsQlEyeENMRWxCUVVrc1VVRkJVU3hqUVVGak8wZEJRek5DTzBWQlEwUTdTVUZEUlN4SlFVRkpMRkZCUVZFc1ZVRkJWVHRKUVVOMFFpeExRVUZMTEU5QlFVOHNZVUZCWVR0SlFVTjZRaXhKUVVGSkxGRkJRVkVzWlVGQlpUdEhRVU0xUWp0RlFVTkVPMGxCUTBVc1NVRkJTU3hSUVVGUkxGbEJRVms3U1VGRGVFSXNTMEZCU3l4UFFVRlBMRmxCUVZrN1NVRkRlRUlzU1VGQlNTeFJRVUZSTEdsQ1FVRnBRanRIUVVNNVFqdEZRVU5FTzBsQlEwVXNTVUZCU1N4UlFVRlJMRk5CUVZNN1NVRkRja0lzUzBGQlN5eFBRVUZQTEZGQlFWRTdTVUZEY0VJc1NVRkJTU3hSUVVGUkxHTkJRV003UjBGRE0wSTdRVUZEU0N4RFFVRkRMRU5CUVVNN08wRkJSVVlzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4TlFVRk5MRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SjJZWElnZG1Gc2RXVnpJRDBnVzEwN1hHNWNiblpoYkhWbGN5QTlJRnRjYmlBZ2UxeHVJQ0FnSUcxcGJtbHRZV3c2SUNBZ0lIUnlkV1VzWEc0Z0lDQWdibUZ0WlRvZ0lDQWdJQ0FnSjNOMFlYUjFjeWNzWEc0Z0lDQWdkSGx3WlRvZ0lDQWdJQ0FnSjNOMFlYUjFjeWRjYmlBZ2ZTeGNiaUFnZTF4dUlDQWdJRzFwYm1sdFlXdzZJQ0FnSUhSeWRXVXNYRzRnSUNBZ2JtRnRaVG9nSUNBZ0lDQWdKM0J5YVc5eWFYUjVKeXhjYmlBZ0lDQjBhWFJzWlRvZ0lDQWdJQ0FuVUNjc1hHNGdJQ0FnZEhsd1pUb2dJQ0FnSUNBZ0ozQnlhVzl5YVhSNUoxeHVJQ0I5TEZ4dUlDQjdYRzRnSUNBZ2JtRnRaVG9nSUNBZ0lDQWdKMlJsZEdGcGJITW5MRnh1SUNBZ0lIUnBkR3hsT2lBZ0lDQWdJQ2REWVhObEp5eGNiaUFnSUNCMGVYQmxPaUFnSUNBZ0lDQW5ZMkZ6WlY5a1pYUmhhV3h6SjF4dUlDQjlMRnh1SUNCN1hHNGdJQ0FnYm1GdFpUb2dJQ0FnSUNBZ0ozSmxjRzl5ZEdWa0p5eGNiaUFnSUNCMGFYUnNaVG9nSUNBZ0lDQW5VbVZ3YjNKMFpXUWdZbmtuTEZ4dUlDQWdJSFI1Y0dVNklDQWdJQ0FnSUNkallYTmxYM0psY0c5eWRHVmtKMXh1SUNCOUxGeHVJQ0I3WEc0Z0lDQWdibUZ0WlRvZ0lDQWdJQ0FnSjJGemMybG5ibTFsYm5RbkxGeHVJQ0FnSUhScGRHeGxPaUFnSUNBZ0lDZEJjM05wWjI1dFpXNTBKeXhjYmlBZ0lDQjBlWEJsT2lBZ0lDQWdJQ0FuWTJGelpWOWhjM05wWjI1dFpXNTBKMXh1SUNCOUxGeHVJQ0I3WEc0Z0lDQWdibUZ0WlRvZ0lDQWdJQ0FnSjJGamRHbHZibk1uTEZ4dUlDQWdJSFJwZEd4bE9pQWdJQ0FnSUNkQlkzUnBiMjRuTEZ4dUlDQWdJSFI1Y0dVNklDQWdJQ0FnSUNkallYTmxYMkZqZEdsdmJuTW5YRzRnSUgxY2JsMDdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnZG1Gc2RXVnpPMXh1SWwxOSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgQWN0aXZlUm93RGV0YWlscztcbnZhciAkICAgICAgICAgICA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIFJlYWN0ICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBCYWNrYm9uZSAgICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgVHIgICAgICAgICAgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL3RyLmpzeCcpO1xudmFyIFRkICAgICAgICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy90ZC5qc3gnKTtcbnZhciBUYWJzICAgICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvdGFicy5qc3gnKTtcbnZhciBJY29uICAgICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvaWNvbi5qc3gnKTtcbnZhciBzdG9yZSAgICAgICA9IHJlcXVpcmUoJy4vbGlzdF92aWV3X3N0b3JlJyk7XG52YXIgZGlzcGF0Y2hlciAgPSByZXF1aXJlKCcuL2Rpc3BhdGNoZXInKTtcbnZhciBtb21lbnQgICAgICA9IHJlcXVpcmUoJ21vbWVudCcpO1xuXG5BY3RpdmVSb3dEZXRhaWxzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkFjdGl2ZVJvd0RldGFpbHNcIixcbiAgcHJvcFR5cGVzOiB7XG4gICAgbW9kZWw6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEJhY2tib25lLk1vZGVsKS5pc1JlcXVpcmVkXG4gIH0sXG4gIG1peGluczogW1JlYWN0LmFkZG9ucy5QdXJlUmVuZGVyTWl4aW5dLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5tb2RlbC50b0pTT04oKTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIga2V5X21hcCA9IHszOTogJ19tb3ZlQmFja3dhcmQnLCAzNzogJ19tb3ZlRm9yd2FyZCd9O1xuICAgICQoZG9jdW1lbnQpLm9uKCdrZXlkb3duLicgKyB0aGlzLnByb3BzLm1vZGVsLmNpZCwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciB3aGVyZSA9IGtleV9tYXBbZS53aGljaF07XG5cbiAgICAgIGlmICghIHdoZXJlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHRoaXNbd2hlcmVdKCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAkKGRvY3VtZW50KS5vZmYoJy4nICsgdGhpcy5wcm9wcy5tb2RlbC5jaWQpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2xhc3NfbmFtZXMgPSBbJ2FjdGl2ZSddO1xuICAgIHZhciBtb2RlbCAgICAgICA9IHRoaXMucHJvcHMubW9kZWw7XG4gICAgdmFyIHNpemVfdG9nZ2xlID0gdGhpcy5wcm9wcy5taW5pbWl6ZWQgPyAnZXhwYW5kJyA6ICdjb21wcmVzcyc7XG4gICAgdmFyIHRhYnMgICAgICAgID0gdGhpcy5fZ2V0VGFicygpO1xuXG4gICAgY2xhc3NfbmFtZXMucHVzaCh0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUciwge2NsYXNzTmFtZTogY2xhc3NfbmFtZXMuam9pbignICcpfSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGQsIHtjb2xTcGFuOiBzdG9yZS5nZXQoJ2hlYWRpbmdzJykubGVuZ3RofSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIsIHtjbGFzc05hbWU6IFwic2VwYXJhdG9yXCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsZWdlbmRcIiwge2FsaWduOiBcImNlbnRlclwifSwgXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFicywge3RhYnM6IHRhYnN9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICksIFxuICAgICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW5cbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIF9nZXRUYWJzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRhYnMgPSBbXG4gICAgICB7aWNvbjogJ2Fycm93LXVwJywgICAgYWN0aW9uOiB0aGlzLl9zZWxlY3RQcmV2fSxcbiAgICAgIHtpY29uOiAnYXJyb3ctZG93bicsICBhY3Rpb246IHRoaXMuX3NlbGVjdE5leHR9LFxuICAgICAge2ljb246ICdjbG9zZScsICAgICAgIGFjdGlvbjogdGhpcy5fY2xvc2V9XG4gICAgXTtcblxuICAgIGlmICghIHRoaXMucHJvcHMucHJldikge1xuICAgICAgZGVsZXRlIHRhYnNbMF07XG4gICAgfVxuXG4gICAgaWYgKCEgdGhpcy5wcm9wcy5uZXh0KSB7XG4gICAgICBkZWxldGUgdGFic1sxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGFicztcbiAgfSxcbiAgX3NlbGVjdFByZXY6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5wcmV2KSB7XG4gICAgICB0aGlzLl9zd2l0Y2godGhpcy5wcm9wcy5wcmV2KTtcbiAgICB9XG4gIH0sXG4gIF9zZWxlY3ROZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMubmV4dCkge1xuICAgICAgdGhpcy5fc3dpdGNoKHRoaXMucHJvcHMubmV4dCk7XG4gICAgfVxuICB9LFxuICBfY2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9zd2l0Y2goKTtcbiAgfSxcbiAgX3N3aXRjaDogZnVuY3Rpb24gKGNpZCkge1xuICAgIGlmICh0aGlzLnByb3BzLnN3aXRjaGVyKSB7XG4gICAgICB0aGlzLnByb3BzLnN3aXRjaGVyKGNpZCwgdHJ1ZSk7XG4gICAgfVxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBY3RpdmVSb3dEZXRhaWxzO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WTJGelpYTXZZV04wYVhabFgzSnZkMTlrWlhSaGFXeHpMbXB6ZUNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFUczdRVUZGUVN4SFFVRkhPenRCUVVWSUxFbEJRVWtzWjBKQlFXZENMRU5CUVVNN1FVRkRja0lzU1VGQlNTeERRVUZETEdGQlFXRXNUMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8wRkJRM0JETEVsQlFVa3NTMEZCU3l4VFFVRlRMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU51UXl4SlFVRkpMRkZCUVZFc1RVRkJUU3hQUVVGUExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTTdRVUZEZEVNc1NVRkJTU3hGUVVGRkxGbEJRVmtzVDBGQlR5eERRVUZETEhsQ1FVRjVRaXhEUVVGRExFTkJRVU03UVVGRGNrUXNTVUZCU1N4RlFVRkZMRmxCUVZrc1QwRkJUeXhEUVVGRExIbENRVUY1UWl4RFFVRkRMRU5CUVVNN1FVRkRja1FzU1VGQlNTeEpRVUZKTEZWQlFWVXNUMEZCVHl4RFFVRkRMREpDUVVFeVFpeERRVUZETEVOQlFVTTdRVUZEZGtRc1NVRkJTU3hKUVVGSkxGVkJRVlVzVDBGQlR5eERRVUZETERKQ1FVRXlRaXhEUVVGRExFTkJRVU03UVVGRGRrUXNTVUZCU1N4TFFVRkxMRk5CUVZNc1QwRkJUeXhEUVVGRExHMUNRVUZ0UWl4RFFVRkRMRU5CUVVNN1FVRkRMME1zU1VGQlNTeFZRVUZWTEVsQlFVa3NUMEZCVHl4RFFVRkRMR05CUVdNc1EwRkJReXhEUVVGRE8wRkJRekZETEVsQlFVa3NUVUZCVFN4UlFVRlJMRTlCUVU4c1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6czdRVUZGY0VNc2MwTkJRWE5ETEdkRFFVRkJPMFZCUTNCRExGTkJRVk1zUlVGQlJUdEpRVU5VTEV0QlFVc3NSVUZCUlN4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExGVkJRVlVzUTBGQlF5eFJRVUZSTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1ZVRkJWVHRIUVVNM1JEdEZRVU5FTEUxQlFVMHNSVUZCUlN4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zWlVGQlpTeERRVUZETzBWQlEzUkRMR1ZCUVdVc1JVRkJSU3haUVVGWk8wbEJRek5DTEU5QlFVOHNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTTdSMEZEYkVNN1JVRkRSQ3hwUWtGQmFVSXNSVUZCUlN4WlFVRlpPMGxCUXpkQ0xFbEJRVWtzVDBGQlR5eEhRVUZITEVOQlFVTXNSVUZCUlN4RlFVRkZMR1ZCUVdVc1JVRkJSU3hGUVVGRkxFVkJRVVVzWTBGQll5eERRVUZETEVOQlFVTTdTVUZEZUVRc1EwRkJReXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEVWQlFVVXNRMEZCUXl4VlFVRlZMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RlFVRkZMRlZCUVZVc1EwRkJReXhGUVVGRk8wRkJRMjVGTEUxQlFVMHNTVUZCU1N4TFFVRkxMRWRCUVVjc1QwRkJUeXhEUVVGRExFTkJRVU1zUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXpzN1RVRkZOMElzU1VGQlNTeEZRVUZGTEV0QlFVc3NSVUZCUlR0UlFVTllMRTlCUVU4c1NVRkJTU3hEUVVGRE8wRkJRM0JDTEU5QlFVODdPMEZCUlZBc1RVRkJUU3hEUVVGRExFTkJRVU1zWTBGQll5eEZRVUZGTEVOQlFVTTdPMDFCUlc1Q0xFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNSVUZCUlN4RFFVRkRPMHRCUTJZc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXp0SFFVTm1PMFZCUTBRc2IwSkJRVzlDTEVWQlFVVXNXVUZCV1R0SlFVTm9ReXhEUVVGRExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNSMEZCUnl4RFFVRkRMRWRCUVVjc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJRenRIUVVNM1F6dEZRVU5FTEUxQlFVMHNSVUZCUlN4WlFVRlpPMGxCUTJ4Q0xFbEJRVWtzVjBGQlZ5eEhRVUZITEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1NVRkROMElzU1VGQlNTeExRVUZMTEZOQlFWTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU03U1VGRGJrTXNTVUZCU1N4WFFVRlhMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVkQlFVY3NVVUZCVVN4SFFVRkhMRlZCUVZVc1EwRkJRenRCUVVOdVJTeEpRVUZKTEVsQlFVa3NTVUZCU1N4VlFVRlZMRWxCUVVrc1EwRkJReXhSUVVGUkxFVkJRVVVzUTBGQlF6czdRVUZGZEVNc1NVRkJTU3hYUVVGWExFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03TzBsQlJYWkRPMDFCUTBVc2IwSkJRVU1zUlVGQlJTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJSU3hYUVVGWExFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUnl4RFFVRkJMRVZCUVVFN1VVRkRjRU1zYjBKQlFVTXNSVUZCUlN4RlFVRkJMRU5CUVVFc1EwRkJReXhQUVVGQkxFVkJRVThzUTBGQlJTeExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRExFMUJRVkVzUTBGQlFTeEZRVUZCTzFWQlEzcERMRzlDUVVGQkxGVkJRVk1zUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc1YwRkJXU3hEUVVGQkxFVkJRVUU3V1VGRE9VSXNiMEpCUVVFc1VVRkJUeXhGUVVGQkxFTkJRVUVzUTBGQlF5eExRVUZCTEVWQlFVc3NRMEZCUXl4UlFVRlRMRU5CUVVFc1JVRkJRVHRqUVVOeVFpeHZRa0ZCUXl4SlFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExFbEJRVUVzUlVGQlNTeERRVUZGTEVsQlFVc3NRMEZCUVN4RFFVRkhMRU5CUVVFN1dVRkRZaXhEUVVGQk8xVkJRMEVzUTBGQlFTeEZRVUZCTzFWQlExWXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGVE8xRkJRMnhDTEVOQlFVRTdUVUZEUml4RFFVRkJPMDFCUTB3N1IwRkRTRHRGUVVORUxGRkJRVkVzUlVGQlJTeFpRVUZaTzBsQlEzQkNMRWxCUVVrc1NVRkJTU3hIUVVGSE8wMUJRMVFzUTBGQlF5eEpRVUZKTEVWQlFVVXNWVUZCVlN4TFFVRkxMRTFCUVUwc1JVRkJSU3hKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETzAxQlF5OURMRU5CUVVNc1NVRkJTU3hGUVVGRkxGbEJRVmtzUjBGQlJ5eE5RVUZOTEVWQlFVVXNTVUZCU1N4RFFVRkRMRmRCUVZjc1EwRkJRenROUVVNdlF5eERRVUZETEVsQlFVa3NSVUZCUlN4UFFVRlBMRkZCUVZFc1RVRkJUU3hGUVVGRkxFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTTdRVUZEYUVRc1MwRkJTeXhEUVVGRE96dEpRVVZHTEVsQlFVa3NSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUlVGQlJUdE5RVU55UWl4UFFVRlBMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU55UWl4TFFVRkxPenRKUVVWRUxFbEJRVWtzUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1JVRkJSVHROUVVOeVFpeFBRVUZQTEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVOeVFpeExRVUZMT3p0SlFVVkVMRTlCUVU4c1NVRkJTU3hEUVVGRE8wZEJRMkk3UlVGRFJDeFhRVUZYTEVWQlFVVXNXVUZCV1R0SlFVTjJRaXhKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RlFVRkZPMDFCUTI1Q0xFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dExRVU12UWp0SFFVTkdPMFZCUTBRc1YwRkJWeXhGUVVGRkxGbEJRVms3U1VGRGRrSXNTVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUlVGQlJUdE5RVU51UWl4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1MwRkRMMEk3UjBGRFJqdEZRVU5FTEUxQlFVMHNSVUZCUlN4WlFVRlpPMGxCUTJ4Q0xFbEJRVWtzUTBGQlF5eFBRVUZQTEVWQlFVVXNRMEZCUXp0SFFVTm9RanRGUVVORUxFOUJRVThzUlVGQlJTeFZRVUZWTEVkQlFVY3NSVUZCUlR0SlFVTjBRaXhKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVVUZCVVN4RlFVRkZPMDFCUTNaQ0xFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWRCUVVjc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dExRVU5vUXp0SFFVTkdPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhuUWtGQlowSXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFLbHh1SUNvZ1FHcHplQ0JTWldGamRDNUVUMDFjYmlBcUwxeHVYRzUyWVhJZ1FXTjBhWFpsVW05M1JHVjBZV2xzY3p0Y2JuWmhjaUFrSUNBZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0oycHhkV1Z5ZVNjcE8xeHVkbUZ5SUZKbFlXTjBJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRbktUdGNiblpoY2lCQ1lXTnJZbTl1WlNBZ0lDQTlJSEpsY1hWcGNtVW9KMkpoWTJ0aWIyNWxKeWs3WEc1MllYSWdWSElnSUNBZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NjdUxpOHVMaTlqYjIxd2IyNWxiblJ6TDNSeUxtcHplQ2NwTzF4dWRtRnlJRlJrSUNBZ0lDQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpNHZMaTR2WTI5dGNHOXVaVzUwY3k5MFpDNXFjM2duS1R0Y2JuWmhjaUJVWVdKeklDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHVMeTR1TDJOdmJYQnZibVZ1ZEhNdmRHRmljeTVxYzNnbktUdGNiblpoY2lCSlkyOXVJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR1THk0dUwyTnZiWEJ2Ym1WdWRITXZhV052Ymk1cWMzZ25LVHRjYm5aaGNpQnpkRzl5WlNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dmJHbHpkRjkyYVdWM1gzTjBiM0psSnlrN1hHNTJZWElnWkdsemNHRjBZMmhsY2lBZ1BTQnlaWEYxYVhKbEtDY3VMMlJwYzNCaGRHTm9aWEluS1R0Y2JuWmhjaUJ0YjIxbGJuUWdJQ0FnSUNBOUlISmxjWFZwY21Vb0oyMXZiV1Z1ZENjcE8xeHVYRzVCWTNScGRtVlNiM2RFWlhSaGFXeHpJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dUlDQndjbTl3Vkhsd1pYTTZJSHRjYmlBZ0lDQnRiMlJsYkRvZ1VtVmhZM1F1VUhKdmNGUjVjR1Z6TG1sdWMzUmhibU5sVDJZb1FtRmphMkp2Ym1VdVRXOWtaV3dwTG1selVtVnhkV2x5WldSY2JpQWdmU3hjYmlBZ2JXbDRhVzV6T2lCYlVtVmhZM1F1WVdSa2IyNXpMbEIxY21WU1pXNWtaWEpOYVhocGJsMHNYRzRnSUdkbGRFbHVhWFJwWVd4VGRHRjBaVG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxuQnliM0J6TG0xdlpHVnNMblJ2U2xOUFRpZ3BPMXh1SUNCOUxGeHVJQ0JqYjIxd2IyNWxiblJFYVdSTmIzVnVkRG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQnJaWGxmYldGd0lEMGdlek01T2lBblgyMXZkbVZDWVdOcmQyRnlaQ2NzSURNM09pQW5YMjF2ZG1WR2IzSjNZWEprSjMwN1hHNGdJQ0FnSkNoa2IyTjFiV1Z1ZENrdWIyNG9KMnRsZVdSdmQyNHVKeUFySUhSb2FYTXVjSEp2Y0hNdWJXOWtaV3d1WTJsa0xDQm1kVzVqZEdsdmJpQW9aU2tnZTF4dUlDQWdJQ0FnZG1GeUlIZG9aWEpsSUQwZ2EyVjVYMjFoY0Z0bExuZG9hV05vWFR0Y2JseHVJQ0FnSUNBZ2FXWWdLQ0VnZDJobGNtVXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSFJ5ZFdVN1hHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHVXVjSEpsZG1WdWRFUmxabUYxYkhRb0tUdGNibHh1SUNBZ0lDQWdkR2hwYzF0M2FHVnlaVjBvS1R0Y2JpQWdJQ0I5TG1KcGJtUW9kR2hwY3lrcE8xeHVJQ0I5TEZ4dUlDQmpiMjF3YjI1bGJuUlhhV3hzVlc1dGIzVnVkRG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUNRb1pHOWpkVzFsYm5RcExtOW1aaWduTGljZ0t5QjBhR2x6TG5CeWIzQnpMbTF2WkdWc0xtTnBaQ2s3WEc0Z0lIMHNYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQmpiR0Z6YzE5dVlXMWxjeUE5SUZzbllXTjBhWFpsSjEwN1hHNGdJQ0FnZG1GeUlHMXZaR1ZzSUNBZ0lDQWdJRDBnZEdocGN5NXdjbTl3Y3k1dGIyUmxiRHRjYmlBZ0lDQjJZWElnYzJsNlpWOTBiMmRuYkdVZ1BTQjBhR2x6TG5CeWIzQnpMbTFwYm1sdGFYcGxaQ0EvSUNkbGVIQmhibVFuSURvZ0oyTnZiWEJ5WlhOekp6dGNiaUFnSUNCMllYSWdkR0ZpY3lBZ0lDQWdJQ0FnUFNCMGFHbHpMbDluWlhSVVlXSnpLQ2s3WEc1Y2JpQWdJQ0JqYkdGemMxOXVZVzFsY3k1d2RYTm9LSFJvYVhNdWNISnZjSE11WTJ4aGMzTk9ZVzFsS1R0Y2JseHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4VkhJZ1kyeGhjM05PWVcxbFBYdGpiR0Z6YzE5dVlXMWxjeTVxYjJsdUtDY2dKeWw5UGx4dUlDQWdJQ0FnSUNBOFZHUWdZMjlzVTNCaGJqMTdjM1J2Y21VdVoyVjBLQ2RvWldGa2FXNW5jeWNwTG14bGJtZDBhSDArWEc0Z0lDQWdJQ0FnSUNBZ1BHWnBaV3hrYzJWMElHTnNZWE56VG1GdFpUMWNJbk5sY0dGeVlYUnZjbHdpUGx4dUlDQWdJQ0FnSUNBZ0lDQWdQR3hsWjJWdVpDQmhiR2xuYmoxY0ltTmxiblJsY2x3aVBseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFZHRmljeUIwWVdKelBYdDBZV0p6ZlNBdlBseHVJQ0FnSUNBZ0lDQWdJQ0FnUEM5c1pXZGxibVErWEc0Z0lDQWdJQ0FnSUNBZ1BDOW1hV1ZzWkhObGRENWNiaUFnSUNBZ0lDQWdJQ0I3ZEdocGN5NXdjbTl3Y3k1amFHbHNaSEpsYm4xY2JpQWdJQ0FnSUNBZ1BDOVVaRDVjYmlBZ0lDQWdJRHd2VkhJK1hHNGdJQ0FnS1R0Y2JpQWdmU3hjYmlBZ1gyZGxkRlJoWW5NNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnZEdGaWN5QTlJRnRjYmlBZ0lDQWdJSHRwWTI5dU9pQW5ZWEp5YjNjdGRYQW5MQ0FnSUNCaFkzUnBiMjQ2SUhSb2FYTXVYM05sYkdWamRGQnlaWFo5TEZ4dUlDQWdJQ0FnZTJsamIyNDZJQ2RoY25KdmR5MWtiM2R1Snl3Z0lHRmpkR2x2YmpvZ2RHaHBjeTVmYzJWc1pXTjBUbVY0ZEgwc1hHNGdJQ0FnSUNCN2FXTnZiam9nSjJOc2IzTmxKeXdnSUNBZ0lDQWdZV04wYVc5dU9pQjBhR2x6TGw5amJHOXpaWDFjYmlBZ0lDQmRPMXh1WEc0Z0lDQWdhV1lnS0NFZ2RHaHBjeTV3Y205d2N5NXdjbVYyS1NCN1hHNGdJQ0FnSUNCa1pXeGxkR1VnZEdGaWMxc3dYVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnBaaUFvSVNCMGFHbHpMbkJ5YjNCekxtNWxlSFFwSUh0Y2JpQWdJQ0FnSUdSbGJHVjBaU0IwWVdKeld6RmRPMXh1SUNBZ0lIMWNibHh1SUNBZ0lISmxkSFZ5YmlCMFlXSnpPMXh1SUNCOUxGeHVJQ0JmYzJWc1pXTjBVSEpsZGpvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lHbG1JQ2gwYUdsekxuQnliM0J6TG5CeVpYWXBJSHRjYmlBZ0lDQWdJSFJvYVhNdVgzTjNhWFJqYUNoMGFHbHpMbkJ5YjNCekxuQnlaWFlwTzF4dUlDQWdJSDFjYmlBZ2ZTeGNiaUFnWDNObGJHVmpkRTVsZUhRNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnBaaUFvZEdocGN5NXdjbTl3Y3k1dVpYaDBLU0I3WEc0Z0lDQWdJQ0IwYUdsekxsOXpkMmwwWTJnb2RHaHBjeTV3Y205d2N5NXVaWGgwS1R0Y2JpQWdJQ0I5WEc0Z0lIMHNYRzRnSUY5amJHOXpaVG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhSb2FYTXVYM04zYVhSamFDZ3BPMXh1SUNCOUxGeHVJQ0JmYzNkcGRHTm9PaUJtZFc1amRHbHZiaUFvWTJsa0tTQjdYRzRnSUNBZ2FXWWdLSFJvYVhNdWNISnZjSE11YzNkcGRHTm9aWElwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVjSEp2Y0hNdWMzZHBkR05vWlhJb1kybGtMQ0IwY25WbEtUdGNiaUFnSUNCOVhHNGdJSDFjYm4wcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRUZqZEdsMlpWSnZkMFJsZEdGcGJITTdYRzRpWFgwPSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgQW5kT3JTZWxlY3RvcjtcbnZhciB0eXBlc19tYXAgPSB7fTtcbnZhciBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEljb24gICAgICA9IHJlcXVpcmUoJy4vaWNvbl93cmFwcGVyLmpzeCcpO1xudmFyIERyb3Bkb3duICA9IHJlcXVpcmUoJy4vZHJvcGRvd24uanN4Jyk7XG52YXIgQU5EX1ZBTFVFID0gJ2FuZCc7XG52YXIgT1JfVkFMVUUgID0gJ29yJ1xuXG50eXBlc19tYXBbQU5EX1ZBTFVFXSA9ICdhbGwnO1xudHlwZXNfbWFwW09SX1ZBTFVFXSAgPSAnYW55JztcblxuQW5kT3JTZWxlY3RvciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJBbmRPclNlbGVjdG9yXCIsXG4gIHN0YXRpY3M6IHtcbiAgICBBTkQ6ICBBTkRfVkFMVUUsXG4gICAgT1I6ICAgT1JfVkFMVUVcbiAgfSxcbiAgbWl4aW5zOiBbUmVhY3QuYWRkb25zLlB1cmVSZW5kZXJNaXhpbl0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBlZGl0aW5nOiBmYWxzZVxuICAgIH07XG4gIH0sXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBBTkRfVkFMVUVcbiAgICB9O1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3VycmVudCAgID0gdHlwZXNfbWFwW3RoaXMucHJvcHMudHlwZV07XG4gICAgdmFyIGNvbnRlbnRzICA9IHRoaXMuc3RhdGUuZWRpdGluZyA/IHRoaXMuX2J1aWxkRWRpdG9yKCkgOiAoUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwgbnVsbCwgY3VycmVudCksIFwiOlwiKSk7XG4gICAgdmFyIHByb3BzO1xuXG4gICAgcHJvcHMgPSB7XG4gICAgICBjbGFzc05hbWU6ICAgICdjaGFpbiBhbmQtb3InLFxuICAgICAgb25Nb3VzZUxlYXZlOiB0aGlzLl9oYW5kbGVNb3VzZUxlYXZlLFxuICAgICAgb25DbGljazogICAgICB0aGlzLl90b2dnbGVFZGl0aW5nXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBSZWFjdC5fX3NwcmVhZCh7fSwgIHByb3BzKSwgXG4gICAgICAgIGNvbnRlbnRzXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgX2J1aWxkRWRpdG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb3BzO1xuICAgIHZhciBjaG9pY2VzID0gW1xuICAgICAge3RleHQ6IHR5cGVzX21hcFtBTkRfVkFMVUVdLCB2YWx1ZTogQU5EX1ZBTFVFfSxcbiAgICAgIHt0ZXh0OiB0eXBlc19tYXBbT1JfVkFMVUVdLCB2YWx1ZTogT1JfVkFMVUV9XG4gICAgXTtcblxuICAgIHByb3BzID0ge1xuICAgICAgcmVmOiAgICAgICdkcm9wZG93bicsXG4gICAgICB0aGVtZTogICAgJ2xpZ2h0JyxcbiAgICAgIHNlbGVjdGVkOiB0eXBlc19tYXBbdGhpcy5wcm9wcy50eXBlXSxcbiAgICAgIGNob2ljZXM6ICBjaG9pY2VzLFxuICAgICAgb25DaG9pY2U6IHRoaXMuX2hhbmRsZVNlbGVjdGlvbixcbiAgICAgIG9wZW46ICAgICB0cnVlXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERyb3Bkb3duLCBSZWFjdC5fX3NwcmVhZCh7fSwgIHByb3BzKSlcbiAgICApO1xuICB9LFxuICBfZW5kRWRpdGluZzogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2VkaXRpbmc6IGZhbHNlfSk7XG4gIH0sXG4gIF9oYW5kbGVNb3VzZUxlYXZlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fZW5kRWRpdGluZygpO1xuICB9LFxuICBfdG9nZ2xlRWRpdGluZzogZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe2VkaXRpbmc6ICEgdGhpcy5zdGF0ZS5lZGl0aW5nfSk7XG4gIH0sXG4gIF9oYW5kbGVPclNlbGVjdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX2hhbmRsZVNlbGVjdGlvbihPUl9WQUxVRSk7XG4gIH0sXG4gIF9oYW5kbGVBbmRTZWxlY3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9oYW5kbGVTZWxlY3Rpb24oQU5EX1ZBTFVFKTtcbiAgfSxcbiAgX2hhbmRsZVNlbGVjdGlvbjogZnVuY3Rpb24gKGNob2ljZSkge1xuICAgIHRoaXMuX2VuZEVkaXRpbmcoKTtcblxuICAgIGlmICh0aGlzLnByb3BzLm9uQ2hhbmdlKSB7XG4gICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGNob2ljZSk7XG4gICAgfVxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBbmRPclNlbGVjdG9yO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WTJGelpYTXZZVzVrWDI5eVgzTmxiR1ZqZEc5eUxtcHplQ0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVRzN1FVRkZRU3hIUVVGSE96dEJRVVZJTEVsQlFVa3NZVUZCWVN4RFFVRkRPMEZCUTJ4Q0xFbEJRVWtzVTBGQlV5eEhRVUZITEVWQlFVVXNRMEZCUXp0QlFVTnVRaXhKUVVGSkxFdEJRVXNzVDBGQlR5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1FVRkRha01zU1VGQlNTeEpRVUZKTEZGQlFWRXNUMEZCVHl4RFFVRkRMRzlDUVVGdlFpeERRVUZETEVOQlFVTTdRVUZET1VNc1NVRkJTU3hSUVVGUkxFbEJRVWtzVDBGQlR5eERRVUZETEdkQ1FVRm5RaXhEUVVGRExFTkJRVU03UVVGRE1VTXNTVUZCU1N4VFFVRlRMRWRCUVVjc1MwRkJTeXhEUVVGRE8wRkJRM1JDTEVsQlFVa3NVVUZCVVN4SlFVRkpMRWxCUVVrN08wRkJSWEJDTEZOQlFWTXNRMEZCUXl4VFFVRlRMRU5CUVVNc1IwRkJSeXhMUVVGTExFTkJRVU03UVVGRE4wSXNVMEZCVXl4RFFVRkRMRkZCUVZFc1EwRkJReXhKUVVGSkxFdEJRVXNzUTBGQlF6czdRVUZGTjBJc2JVTkJRVzFETERaQ1FVRkJPMFZCUTJwRExFOUJRVThzUlVGQlJUdEpRVU5RTEVkQlFVY3NSMEZCUnl4VFFVRlRPMGxCUTJZc1JVRkJSU3hKUVVGSkxGRkJRVkU3UjBGRFpqdEZRVU5FTEUxQlFVMHNSVUZCUlN4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zWlVGQlpTeERRVUZETzBWQlEzUkRMR1ZCUVdVc1JVRkJSU3haUVVGWk8wbEJRek5DTEU5QlFVODdUVUZEVEN4UFFVRlBMRVZCUVVVc1MwRkJTenRMUVVObUxFTkJRVU03UjBGRFNEdEZRVU5FTEdWQlFXVXNSVUZCUlN4WlFVRlpPMGxCUXpOQ0xFOUJRVTg3VFVGRFRDeEpRVUZKTEVWQlFVVXNVMEZCVXp0TFFVTm9RaXhEUVVGRE8wZEJRMGc3UlVGRFJDeE5RVUZOTEVWQlFVVXNXVUZCV1R0SlFVTnNRaXhKUVVGSkxFOUJRVThzUzBGQlN5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dEpRVU16UXl4SlFVRkpMRkZCUVZFc1NVRkJTU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNc1dVRkJXU3hGUVVGRkxFbEJRVWtzYjBKQlFVRXNUVUZCU3l4RlFVRkJMRWxCUVVNc1JVRkJRU3h2UWtGQlFTeEhRVUZGTEVWQlFVRXNTVUZCUXl4RlFVRkRMRTlCUVZrc1EwRkJRU3hGUVVGQkxFZEJRVkVzUTBGQlFTeERRVUZETEVOQlFVTTdRVUZEYUVjc1NVRkJTU3hKUVVGSkxFdEJRVXNzUTBGQlF6czdTVUZGVml4TFFVRkxMRWRCUVVjN1RVRkRUaXhUUVVGVExFdEJRVXNzWTBGQll6dE5RVU0xUWl4WlFVRlpMRVZCUVVVc1NVRkJTU3hEUVVGRExHbENRVUZwUWp0TlFVTndReXhQUVVGUExFOUJRVThzU1VGQlNTeERRVUZETEdOQlFXTTdRVUZEZGtNc1MwRkJTeXhEUVVGRE96dEpRVVZHTzAxQlEwVXNiMEpCUVVFc1RVRkJTeXhGUVVGQkxHZENRVUZCTEVkQlFVRXNRMEZCUlN4SFFVRkhMRXRCUVU4c1EwRkJRU3hGUVVGQk8xRkJRMlFzVVVGQlV6dE5RVU5NTEVOQlFVRTdUVUZEVUR0SFFVTklPMFZCUTBRc1dVRkJXU3hGUVVGRkxGbEJRVms3U1VGRGVFSXNTVUZCU1N4TFFVRkxMRU5CUVVNN1NVRkRWaXhKUVVGSkxFOUJRVThzUjBGQlJ6dE5RVU5hTEVOQlFVTXNTVUZCU1N4RlFVRkZMRk5CUVZNc1EwRkJReXhUUVVGVExFTkJRVU1zUlVGQlJTeExRVUZMTEVWQlFVVXNVMEZCVXl4RFFVRkRPMDFCUXpsRExFTkJRVU1zU1VGQlNTeEZRVUZGTEZOQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1JVRkJSU3hMUVVGTExFVkJRVVVzVVVGQlVTeERRVUZETzBGQlEyeEVMRXRCUVVzc1EwRkJRenM3U1VGRlJpeExRVUZMTEVkQlFVYzdUVUZEVGl4SFFVRkhMRTlCUVU4c1ZVRkJWVHROUVVOd1FpeExRVUZMTEV0QlFVc3NUMEZCVHp0TlFVTnFRaXhSUVVGUkxFVkJRVVVzVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRE8wMUJRM0JETEU5QlFVOHNSMEZCUnl4UFFVRlBPMDFCUTJwQ0xGRkJRVkVzUlVGQlJTeEpRVUZKTEVOQlFVTXNaMEpCUVdkQ08wMUJReTlDTEVsQlFVa3NUVUZCVFN4SlFVRkpPMEZCUTNCQ0xFdEJRVXNzUTBGQlF6czdTVUZGUmp0TlFVTkZMRzlDUVVGRExGRkJRVkVzUlVGQlFTeG5Ra0ZCUVN4SFFVRkJMRU5CUVVVc1IwRkJSeXhMUVVGTkxFTkJRVUVzUTBGQlJ5eERRVUZCTzAxQlEzWkNPMGRCUTBnN1JVRkRSQ3hYUVVGWExFVkJRVVVzV1VGQldUdEpRVU4yUWl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zVDBGQlR5eEZRVUZGTEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNN1IwRkRha003UlVGRFJDeHBRa0ZCYVVJc1JVRkJSU3haUVVGWk8wbEJRemRDTEVsQlFVa3NRMEZCUXl4WFFVRlhMRVZCUVVVc1EwRkJRenRIUVVOd1FqdEZRVU5FTEdOQlFXTXNSVUZCUlN4VlFVRlZMRU5CUVVNc1JVRkJSVHRKUVVNelFpeERRVUZETEVOQlFVTXNZMEZCWXl4RlFVRkZMRU5CUVVNN1FVRkRka0lzU1VGQlNTeERRVUZETEVOQlFVTXNaVUZCWlN4RlFVRkZMRU5CUVVNN08wbEJSWEJDTEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhQUVVGUExFVkJRVVVzUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRExFTkJRVU03UjBGRGFFUTdSVUZEUkN4clFrRkJhMElzUlVGQlJTeFpRVUZaTzBsQlF6bENMRWxCUVVrc1EwRkJReXhuUWtGQlowSXNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRIUVVOcVF6dEZRVU5FTEcxQ1FVRnRRaXhGUVVGRkxGbEJRVms3U1VGREwwSXNTVUZCU1N4RFFVRkRMR2RDUVVGblFpeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMGRCUTJ4RE8wVkJRMFFzWjBKQlFXZENMRVZCUVVVc1ZVRkJWU3hOUVVGTkxFVkJRVVU3UVVGRGRFTXNTVUZCU1N4SlFVRkpMRU5CUVVNc1YwRkJWeXhGUVVGRkxFTkJRVU03TzBsQlJXNUNMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFJRVUZSTEVWQlFVVTdUVUZEZGtJc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFJRVUZSTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1MwRkROMEk3UjBGRFJqdEJRVU5JTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NZVUZCWVN4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlvcVhHNGdLaUJBYW5ONElGSmxZV04wTGtSUFRWeHVJQ292WEc1Y2JuWmhjaUJCYm1SUGNsTmxiR1ZqZEc5eU8xeHVkbUZ5SUhSNWNHVnpYMjFoY0NBOUlIdDlPMXh1ZG1GeUlGSmxZV04wSUNBZ0lDQTlJSEpsY1hWcGNtVW9KM0psWVdOMEp5azdYRzUyWVhJZ1NXTnZiaUFnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTlwWTI5dVgzZHlZWEJ3WlhJdWFuTjRKeWs3WEc1MllYSWdSSEp2Y0dSdmQyNGdJRDBnY21WeGRXbHlaU2duTGk5a2NtOXdaRzkzYmk1cWMzZ25LVHRjYm5aaGNpQkJUa1JmVmtGTVZVVWdQU0FuWVc1a0p6dGNiblpoY2lCUFVsOVdRVXhWUlNBZ1BTQW5iM0luWEc1Y2JuUjVjR1Z6WDIxaGNGdEJUa1JmVmtGTVZVVmRJRDBnSjJGc2JDYzdYRzUwZVhCbGMxOXRZWEJiVDFKZlZrRk1WVVZkSUNBOUlDZGhibmtuTzF4dVhHNUJibVJQY2xObGJHVmpkRzl5SUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVJQ0J6ZEdGMGFXTnpPaUI3WEc0Z0lDQWdRVTVFT2lBZ1FVNUVYMVpCVEZWRkxGeHVJQ0FnSUU5U09pQWdJRTlTWDFaQlRGVkZYRzRnSUgwc1hHNGdJRzFwZUdsdWN6b2dXMUpsWVdOMExtRmtaRzl1Y3k1UWRYSmxVbVZ1WkdWeVRXbDRhVzVkTEZ4dUlDQm5aWFJKYm1sMGFXRnNVM1JoZEdVNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2UxeHVJQ0FnSUNBZ1pXUnBkR2x1WnpvZ1ptRnNjMlZjYmlBZ0lDQjlPMXh1SUNCOUxGeHVJQ0JuWlhSRVpXWmhkV3gwVUhKdmNITTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdlMXh1SUNBZ0lDQWdkSGx3WlRvZ1FVNUVYMVpCVEZWRlhHNGdJQ0FnZlR0Y2JpQWdmU3hjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2RtRnlJR04xY25KbGJuUWdJQ0E5SUhSNWNHVnpYMjFoY0Z0MGFHbHpMbkJ5YjNCekxuUjVjR1ZkTzF4dUlDQWdJSFpoY2lCamIyNTBaVzUwY3lBZ1BTQjBhR2x6TG5OMFlYUmxMbVZrYVhScGJtY2dQeUIwYUdsekxsOWlkV2xzWkVWa2FYUnZjaWdwSURvZ0tEeHpjR0Z1UGp4aFBudGpkWEp5Wlc1MGZUd3ZZVDQ2UEM5emNHRnVQaWs3WEc0Z0lDQWdkbUZ5SUhCeWIzQnpPMXh1WEc0Z0lDQWdjSEp2Y0hNZ1BTQjdYRzRnSUNBZ0lDQmpiR0Z6YzA1aGJXVTZJQ0FnSUNkamFHRnBiaUJoYm1RdGIzSW5MRnh1SUNBZ0lDQWdiMjVOYjNWelpVeGxZWFpsT2lCMGFHbHpMbDlvWVc1a2JHVk5iM1Z6WlV4bFlYWmxMRnh1SUNBZ0lDQWdiMjVEYkdsamF6b2dJQ0FnSUNCMGFHbHpMbDkwYjJkbmJHVkZaR2wwYVc1blhHNGdJQ0FnZlR0Y2JseHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4YzNCaGJpQjdMaTR1Y0hKdmNITjlQbHh1SUNBZ0lDQWdJQ0I3WTI5dWRHVnVkSE45WEc0Z0lDQWdJQ0E4TDNOd1lXNCtYRzRnSUNBZ0tUdGNiaUFnZlN4Y2JpQWdYMkoxYVd4a1JXUnBkRzl5T2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2RtRnlJSEJ5YjNCek8xeHVJQ0FnSUhaaGNpQmphRzlwWTJWeklEMGdXMXh1SUNBZ0lDQWdlM1JsZUhRNklIUjVjR1Z6WDIxaGNGdEJUa1JmVmtGTVZVVmRMQ0IyWVd4MVpUb2dRVTVFWDFaQlRGVkZmU3hjYmlBZ0lDQWdJSHQwWlhoME9pQjBlWEJsYzE5dFlYQmJUMUpmVmtGTVZVVmRMQ0IyWVd4MVpUb2dUMUpmVmtGTVZVVjlYRzRnSUNBZ1hUdGNibHh1SUNBZ0lIQnliM0J6SUQwZ2UxeHVJQ0FnSUNBZ2NtVm1PaUFnSUNBZ0lDZGtjbTl3Wkc5M2JpY3NYRzRnSUNBZ0lDQjBhR1Z0WlRvZ0lDQWdKMnhwWjJoMEp5eGNiaUFnSUNBZ0lITmxiR1ZqZEdWa09pQjBlWEJsYzE5dFlYQmJkR2hwY3k1d2NtOXdjeTUwZVhCbFhTeGNiaUFnSUNBZ0lHTm9iMmxqWlhNNklDQmphRzlwWTJWekxGeHVJQ0FnSUNBZ2IyNURhRzlwWTJVNklIUm9hWE11WDJoaGJtUnNaVk5sYkdWamRHbHZiaXhjYmlBZ0lDQWdJRzl3Wlc0NklDQWdJQ0IwY25WbFhHNGdJQ0FnZlR0Y2JseHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4UkhKdmNHUnZkMjRnZXk0dUxuQnliM0J6ZlNBdlBseHVJQ0FnSUNrN1hHNGdJSDBzWEc0Z0lGOWxibVJGWkdsMGFXNW5PaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaDdaV1JwZEdsdVp6b2dabUZzYzJWOUtUdGNiaUFnZlN4Y2JpQWdYMmhoYm1Sc1pVMXZkWE5sVEdWaGRtVTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IwYUdsekxsOWxibVJGWkdsMGFXNW5LQ2s3WEc0Z0lIMHNYRzRnSUY5MGIyZG5iR1ZGWkdsMGFXNW5PaUJtZFc1amRHbHZiaUFvWlNrZ2UxeHVJQ0FnSUdVdWNISmxkbVZ1ZEVSbFptRjFiSFFvS1R0Y2JpQWdJQ0JsTG5OMGIzQlFjbTl3WVdkaGRHbHZiaWdwTzF4dVhHNGdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaDdaV1JwZEdsdVp6b2dJU0IwYUdsekxuTjBZWFJsTG1Wa2FYUnBibWQ5S1R0Y2JpQWdmU3hjYmlBZ1gyaGhibVJzWlU5eVUyVnNaV04wYVc5dU9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkR2hwY3k1ZmFHRnVaR3hsVTJWc1pXTjBhVzl1S0U5U1gxWkJURlZGS1R0Y2JpQWdmU3hjYmlBZ1gyaGhibVJzWlVGdVpGTmxiR1ZqZEdsdmJqb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFJvYVhNdVgyaGhibVJzWlZObGJHVmpkR2x2YmloQlRrUmZWa0ZNVlVVcE8xeHVJQ0I5TEZ4dUlDQmZhR0Z1Wkd4bFUyVnNaV04wYVc5dU9pQm1kVzVqZEdsdmJpQW9ZMmh2YVdObEtTQjdYRzRnSUNBZ2RHaHBjeTVmWlc1a1JXUnBkR2x1WnlncE8xeHVYRzRnSUNBZ2FXWWdLSFJvYVhNdWNISnZjSE11YjI1RGFHRnVaMlVwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVjSEp2Y0hNdWIyNURhR0Z1WjJVb1kyaHZhV05sS1R0Y2JpQWdJQ0I5WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFRnVaRTl5VTJWc1pXTjBiM0k3WEc0aVhYMD0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIEF1dG9jb21wbGV0ZTtcbnZhciBrZXlNYXA7XG52YXIgJCAgICAgICAgICAgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBSZWFjdCAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgQmFja2JvbmUgICAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyIEJ1dHRvbiAgICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9idXR0b24uanN4Jyk7XG52YXIgRHJvcGRvd24gICAgPSByZXF1aXJlKCcuL2Ryb3Bkb3duLmpzeCcpO1xudmFyIF8gICAgICAgICAgID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyIEhvdGtleXMgICAgID0gcmVxdWlyZSgncmVhY3QtaG90a2V5cycpLkhvdEtleXM7XG5cbmtleU1hcCA9IHtcbiAgJ21vdmVVcCc6ICAgJ3VwJyxcbiAgJ21vdmVEb3duJzogJ2Rvd24nLFxuICAnc2VsZWN0JzogICAnZW50ZXInXG59O1xuXG5mdW5jdGlvbiBkZXRlcm1pbmVWYWx1ZSAodmFsdWUsIG11bHRpKSB7XG4gIGlmIChtdWx0aSkge1xuICAgIHJldHVybiBkZXRlcm1pbmVNdWx0aVZhbHVlcyh2YWx1ZSk7XG4gIH1cblxuICByZXR1cm4gZGV0ZXJtaW5lU2luZ2xlVmFsdWUodmFsdWUpO1xufVxuXG5mdW5jdGlvbiBkZXRlcm1pbmVNdWx0aVZhbHVlcyAodmFsdWVzKSB7XG4gIGlmICghIEFycmF5LmlzQXJyYXkodmFsdWVzKSkge1xuICAgIHZhbHVlcyA9IFt2YWx1ZXNdO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlcztcbn1cblxuZnVuY3Rpb24gZGV0ZXJtaW5lU2luZ2xlVmFsdWUgKHZhbHVlKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIHRocm93ICdFeHBlY3RlZCAnICsgdmFsdWUgKyAnIHRvIG5vdCBiZSBhbiBBcnJheSc7XG4gIH1cblxuICBpZiAoXy5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YWx1ZSA9IHt0ZXh0OiB2YWx1ZX07XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59XG5cbkF1dG9jb21wbGV0ZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJBdXRvY29tcGxldGVcIixcbiAgc3RhdGljczoge1xuICAgIGRldGVybWluZVZhbHVlOiBkZXRlcm1pbmVWYWx1ZVxuICB9LFxuICBwcm9wVHlwZXM6IHtcbiAgICBlZGl0aW5nOiAgICBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgICBtdWx0aTogICAgICBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgICBvcHRpb25zOiAgICBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG4gICAgZ2VuZXJhdG9yOiAgUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbiAgfSxcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZhbHVlID0gQXV0b2NvbXBsZXRlLmRldGVybWluZVZhbHVlKHRoaXMucHJvcHMudmFsdWUsIHRoaXMucHJvcHMubXVsdGkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGVkaXRpbmc6ICAgIHRoaXMucHJvcHMuZWRpdGluZyxcbiAgICAgIHZhbHVlOiAgICAgIHZhbHVlLFxuICAgICAgdGV4dFZhbHVlOiAgKHZhbHVlICYmIHZhbHVlLnRleHQpIHx8ICcnLFxuICAgICAgYWN0aXZlOiAgICAgbnVsbCxcbiAgICAgIG9wdGlvbnM6ICAgIHRoaXMucHJvcHMub3B0aW9uc1xuICAgIH07XG4gIH0sXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBlZGl0aW5nOiAgICBmYWxzZSxcbiAgICAgIG11bHRpOiAgICAgIGZhbHNlLFxuICAgICAgb3B0aW9uczogICAgW10sXG4gICAgICBnZW5lcmF0b3I6ICBudWxsXG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZvY3VzU2VhcmNoKCk7XG4gIH0sXG4gIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZm9jdXNTZWFyY2goKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnM7XG4gICAgdmFyIGhhbmRsZXJzID0ge1xuICAgICAgbW92ZVVwOiAgIHRoaXMubW92ZVVwLFxuICAgICAgbW92ZURvd246IHRoaXMubW92ZURvd24sXG4gICAgICBzZWxlY3Q6ICAgdGhpcy5zZWxlY3RJdGVtXG4gICAgfTtcblxuICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmcpIHtcbiAgICAgIG9wdGlvbnMgPSB0aGlzLmJ1aWxkT3B0aW9ucygpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEhvdGtleXMsIHtrZXlNYXA6IGtleU1hcCwgaGFuZGxlcnM6IGhhbmRsZXJzfSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJmdi1hdXRvY29tcGxldGVcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7cmVmOiBcImlucHV0XCIsIGNsYXNzTmFtZTogXCJpbnB1dGFibGVcIiwgdHlwZTogXCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOiBcInNlYXJjaCBjcml0ZXJpYVwiLCByZWY6IFwiaW5wdXRcIiwgb25DaGFuZ2U6IHRoaXMuaGFuZGxlQ2hhbmdlLCBkZWZhdWx0VmFsdWU6IHRoaXMuc3RhdGUudGV4dFZhbHVlfSksIFxuICAgICAgICAgIG9wdGlvbnNcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIGJ1aWxkT3B0aW9uczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5zdGF0ZS5vcHRpb25zO1xuICAgIHZhciB0ZXh0ICAgID0gdGhpcy5zdGF0ZS50ZXh0VmFsdWU7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5nZW5lcmF0b3IpIHtcbiAgICAgIG9wdGlvbnMgPSB0aGlzLnByb3BzLmdlbmVyYXRvcih0aGlzLnN0YXRlLnRleHRWYWx1ZSk7XG4gICAgfVxuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwgW107XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMubWFwKGZ1bmN0aW9uIChvcHRpb24sIGluZGV4KSB7XG4gICAgICB2YXIgY2xhc3NlcyA9IFsnb3B0aW9uJywgJ3NlbGVjdGFibGUnXTtcblxuICAgICAgY2xhc3Nlcy5wdXNoKCdhY3RpdmUtJyArIChpbmRleCA9PT0gdGhpcy5zdGF0ZS5hY3RpdmUpKTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtrZXk6IGluZGV4LCBjbGFzc05hbWU6IGNsYXNzZXMuam9pbignICcpLCBvbkNsaWNrOiB0aGlzLmhhbmRsZVNlbGVjdC5iaW5kKHRoaXMsIG9wdGlvbil9LCBvcHRpb24ubGFiZWwpXG4gICAgICApO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgaWYgKG9wdGlvbnMubGVuZ3RoIDwgMSkge1xuICAgICAgb3B0aW9ucyA9IChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtjbGFzc05hbWU6IFwibXV0ZWQgb3B0aW9uIHVuc2VsZWN0YWJsZVwifSwgXCJObyBtYXRjaGVzIGZvdW5kXCIpXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwib3B0aW9uc1wifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCB7cmVmOiBcIm9wdGlvbnNcIn0sIFxuICAgICAgICAgIG9wdGlvbnNcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIGhhbmRsZVNlbGVjdDogZnVuY3Rpb24gKG9wdGlvbiwgZSkge1xuICAgIHZhciBjdXJyZW50X3ZhbHVlID0gdGhpcy5zdGF0ZS52YWx1ZTtcblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMubXVsdGkpIHtcbiAgICAgIGN1cnJlbnRfdmFsdWUgPSB0aGlzLnN0YXRlLnZhbHVlLnNsaWNlKCk7XG4gICAgICBjdXJyZW50X3ZhbHVlLnB1c2gob3B0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZhbHVlOiAgICAgIGN1cnJlbnRfdmFsdWUsXG4gICAgICB0ZXh0VmFsdWU6ICAnJ1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMucHJvcHMub25TZWxlY3QpIHtcbiAgICAgIHRoaXMucHJvcHMub25TZWxlY3Qob3B0aW9uLCBjdXJyZW50X3ZhbHVlKTtcbiAgICB9XG4gIH0sXG4gIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMuc3RhdGUub3B0aW9ucztcblxuICAgIGlmICh0aGlzLnByb3BzLmdlbmVyYXRvcikge1xuICAgICAgb3B0aW9ucyA9IHRoaXMucHJvcHMuZ2VuZXJhdG9yKGUudGFyZ2V0LnZhbHVlKVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdGV4dFZhbHVlOiAgZS50YXJnZXQudmFsdWUsXG4gICAgICBhY3RpdmU6ICAgICBlLnRhcmdldC52YWx1ZSA/IDAgOiBudWxsLFxuICAgICAgb3B0aW9uczogICAgb3B0aW9uc1xuICAgIH0pO1xuICB9LFxuICBtb3ZlRG93bjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdXJyZW50ID0gdGhpcy5zdGF0ZS5hY3RpdmU7XG5cblxuICAgIGlmIChjdXJyZW50ID09PSBudWxsKSB7XG4gICAgICBjdXJyZW50ID0gLTE7XG4gICAgfVxuXG4gICAgY3VycmVudCsrO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlOiBjdXJyZW50fSk7XG4gIH0sXG4gIG1vdmVVcDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdXJyZW50ID0gdGhpcy5zdGF0ZS5hY3RpdmU7XG5cbiAgICBpZiAoY3VycmVudCA9PT0gbnVsbCkge1xuICAgICAgY3VycmVudCA9IDE7XG4gICAgfVxuXG4gICAgY3VycmVudC0tO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlOiBjdXJyZW50fSk7XG4gIH0sXG4gIGZvY3VzU2VhcmNoOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCEgdGhpcy5zdGF0ZS5lZGl0aW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG5vZGUgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuaW5wdXQpO1xuXG4gICAgbm9kZS5mb2N1cygpO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBdXRvY29tcGxldGU7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZZMkZ6WlhNdllYVjBiMk52YlhCc1pYUmxMbXB6ZUNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFUczdRVUZGUVN4SFFVRkhPenRCUVVWSUxFbEJRVWtzV1VGQldTeERRVUZETzBGQlEycENMRWxCUVVrc1RVRkJUU3hEUVVGRE8wRkJRMWdzU1VGQlNTeERRVUZETEdGQlFXRXNUMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8wRkJRM0JETEVsQlFVa3NTMEZCU3l4VFFVRlRMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU51UXl4SlFVRkpMRkZCUVZFc1RVRkJUU3hQUVVGUExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTTdRVUZEZEVNc1NVRkJTU3hOUVVGTkxGRkJRVkVzVDBGQlR5eERRVUZETERaQ1FVRTJRaXhEUVVGRExFTkJRVU03UVVGRGVrUXNTVUZCU1N4UlFVRlJMRTFCUVUwc1QwRkJUeXhEUVVGRExHZENRVUZuUWl4RFFVRkRMRU5CUVVNN1FVRkROVU1zU1VGQlNTeERRVUZETEdGQlFXRXNUMEZCVHl4RFFVRkRMRmxCUVZrc1EwRkJReXhEUVVGRE8wRkJRM2hETEVsQlFVa3NUMEZCVHl4UFFVRlBMRTlCUVU4c1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF5eFBRVUZQTEVOQlFVTTdPMEZCUlc1RUxFMUJRVTBzUjBGQlJ6dEZRVU5RTEZGQlFWRXNTVUZCU1N4SlFVRkpPMFZCUTJoQ0xGVkJRVlVzUlVGQlJTeE5RVUZOTzBWQlEyeENMRkZCUVZFc1NVRkJTU3hQUVVGUE8wRkJRM0pDTEVOQlFVTXNRMEZCUXpzN1FVRkZSaXhUUVVGVExHTkJRV01zUlVGQlJTeExRVUZMTEVWQlFVVXNTMEZCU3l4RlFVRkZPMFZCUTNKRExFbEJRVWtzUzBGQlN5eEZRVUZGTzBsQlExUXNUMEZCVHl4dlFrRkJiMElzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0QlFVTjJReXhIUVVGSE96dEZRVVZFTEU5QlFVOHNiMEpCUVc5Q0xFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdRVUZEY2tNc1EwRkJRenM3UVVGRlJDeFRRVUZUTEc5Q1FVRnZRaXhGUVVGRkxFMUJRVTBzUlVGQlJUdEZRVU55UXl4SlFVRkpMRVZCUVVVc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNSVUZCUlR0SlFVTXpRaXhOUVVGTkxFZEJRVWNzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVTjBRaXhIUVVGSE96dEZRVVZFTEU5QlFVOHNUVUZCVFN4RFFVRkRPMEZCUTJoQ0xFTkJRVU03TzBGQlJVUXNVMEZCVXl4dlFrRkJiMElzUlVGQlJTeExRVUZMTEVWQlFVVTdSVUZEY0VNc1NVRkJTU3hMUVVGTExFTkJRVU1zVDBGQlR5eERRVUZETEV0QlFVc3NRMEZCUXl4RlFVRkZPMGxCUTNoQ0xFMUJRVTBzVjBGQlZ5eEhRVUZITEV0QlFVc3NSMEZCUnl4eFFrRkJjVUlzUTBGQlF6dEJRVU4wUkN4SFFVRkhPenRGUVVWRUxFbEJRVWtzUTBGQlF5eERRVUZETEZGQlFWRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1JVRkJSVHRKUVVOeVFpeExRVUZMTEVkQlFVY3NRMEZCUXl4SlFVRkpMRVZCUVVVc1MwRkJTeXhEUVVGRExFTkJRVU03UVVGRE1VSXNSMEZCUnpzN1JVRkZSQ3hQUVVGUExFdEJRVXNzUTBGQlF6dEJRVU5tTEVOQlFVTTdPMEZCUlVRc2EwTkJRV3RETERSQ1FVRkJPMFZCUTJoRExFOUJRVThzUlVGQlJUdEpRVU5RTEdOQlFXTXNSVUZCUlN4alFVRmpPMGRCUXk5Q08wVkJRMFFzVTBGQlV5eEZRVUZGTzBsQlExUXNUMEZCVHl4TFFVRkxMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNUdEpRVU5vUXl4TFFVRkxMRTlCUVU4c1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTzBsQlEyaERMRTlCUVU4c1MwRkJTeXhMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEV0QlFVczdTVUZEYWtNc1UwRkJVeXhIUVVGSExFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1R0SFFVTnFRenRGUVVORUxHVkJRV1VzUlVGQlJTeFpRVUZaTzBGQlF5OUNMRWxCUVVrc1NVRkJTU3hMUVVGTExFZEJRVWNzV1VGQldTeERRVUZETEdOQlFXTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE96dEpRVVUxUlN4UFFVRlBPMDFCUTB3c1QwRkJUeXhMUVVGTExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHp0TlFVTTVRaXhMUVVGTExFOUJRVThzUzBGQlN6dE5RVU5xUWl4VFFVRlRMRWRCUVVjc1EwRkJReXhMUVVGTExFbEJRVWtzUzBGQlN5eERRVUZETEVsQlFVa3NTMEZCU3l4RlFVRkZPMDFCUTNaRExFMUJRVTBzVFVGQlRTeEpRVUZKTzAxQlEyaENMRTlCUVU4c1MwRkJTeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVODdTMEZETDBJc1EwRkJRenRIUVVOSU8wVkJRMFFzWlVGQlpTeEZRVUZGTEZsQlFWazdTVUZETTBJc1QwRkJUenROUVVOTUxFOUJRVThzUzBGQlN5eExRVUZMTzAxQlEycENMRXRCUVVzc1QwRkJUeXhMUVVGTE8wMUJRMnBDTEU5QlFVOHNTMEZCU3l4RlFVRkZPMDFCUTJRc1UwRkJVeXhIUVVGSExFbEJRVWs3UzBGRGFrSXNRMEZCUXp0SFFVTklPMFZCUTBRc2FVSkJRV2xDTEVWQlFVVXNXVUZCV1R0SlFVTTNRaXhKUVVGSkxFTkJRVU1zVjBGQlZ5eEZRVUZGTEVOQlFVTTdSMEZEY0VJN1JVRkRSQ3hyUWtGQmEwSXNSVUZCUlN4WlFVRlpPMGxCUXpsQ0xFbEJRVWtzUTBGQlF5eFhRVUZYTEVWQlFVVXNRMEZCUXp0SFFVTndRanRGUVVORUxFMUJRVTBzUlVGQlJTeFpRVUZaTzBsQlEyeENMRWxCUVVrc1QwRkJUeXhEUVVGRE8wbEJRMW9zU1VGQlNTeFJRVUZSTEVkQlFVYzdUVUZEWWl4TlFVRk5MRWxCUVVrc1NVRkJTU3hEUVVGRExFMUJRVTA3VFVGRGNrSXNVVUZCVVN4RlFVRkZMRWxCUVVrc1EwRkJReXhSUVVGUk8wMUJRM1pDTEUxQlFVMHNTVUZCU1N4SlFVRkpMRU5CUVVNc1ZVRkJWVHRCUVVNdlFpeExRVUZMTEVOQlFVTTdPMGxCUlVZc1NVRkJTU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNSVUZCUlR0TlFVTjBRaXhQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETEZsQlFWa3NSVUZCUlN4RFFVRkRPMEZCUTNCRExFdEJRVXM3TzBsQlJVUTdUVUZEUlN4dlFrRkJReXhQUVVGUExFVkJRVUVzUTBGQlFTeERRVUZETEUxQlFVRXNSVUZCVFN4RFFVRkZMRTFCUVUwc1JVRkJReXhEUVVGRExGRkJRVUVzUlVGQlVTeERRVUZGTEZGQlFWVXNRMEZCUVN4RlFVRkJPMUZCUXpORExHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zYVVKQlFXdENMRU5CUVVFc1JVRkJRVHRWUVVNdlFpeHZRa0ZCUVN4UFFVRk5MRVZCUVVFc1EwRkJRU3hEUVVGRExFZEJRVUVzUlVGQlJ5eERRVUZETEU5QlFVRXNSVUZCVHl4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExGZEJRVUVzUlVGQlZ5eERRVUZETEVsQlFVRXNSVUZCU1N4RFFVRkRMRTFCUVVFc1JVRkJUU3hEUVVGRExGZEJRVUVzUlVGQlZ5eERRVUZETEdsQ1FVRkJMRVZCUVdsQ0xFTkJRVU1zUjBGQlFTeEZRVUZITEVOQlFVTXNUMEZCUVN4RlFVRlBMRU5CUVVNc1VVRkJRU3hGUVVGUkxFTkJRVVVzU1VGQlNTeERRVUZETEZsQlFWa3NSVUZCUXl4RFFVRkRMRmxCUVVFc1JVRkJXU3hEUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVlN4RFFVRkJMRU5CUVVjc1EwRkJRU3hGUVVGQk8xVkJRMnBMTEU5QlFWRTdVVUZEVEN4RFFVRkJPMDFCUTBVc1EwRkJRVHROUVVOV08wZEJRMGc3UlVGRFJDeFpRVUZaTEVWQlFVVXNXVUZCV1R0SlFVTjRRaXhKUVVGSkxFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJRenRCUVVOeVF5eEpRVUZKTEVsQlFVa3NTVUZCU1N4TlFVRk5MRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZET3p0SlFVVnVReXhKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4RlFVRkZPMDFCUTNoQ0xFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMEZCUXpORUxFdEJRVXM3TzBsQlJVUXNUMEZCVHl4SFFVRkhMRTlCUVU4c1NVRkJTU3hGUVVGRkxFTkJRVU03U1VGRGVFSXNUMEZCVHl4SFFVRkhMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlZTeE5RVUZOTEVWQlFVVXNTMEZCU3l4RlFVRkZPMEZCUTI1RUxFMUJRVTBzU1VGQlNTeFBRVUZQTEVkQlFVY3NRMEZCUXl4UlFVRlJMRVZCUVVVc1dVRkJXU3hEUVVGRExFTkJRVU03TzBGQlJUZERMRTFCUVUwc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVsQlFVa3NTMEZCU3l4TFFVRkxMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNRMEZCUXpzN1RVRkZlRVE3VVVGRFJTeHZRa0ZCUVN4SlFVRkhMRVZCUVVFc1EwRkJRU3hEUVVGRExFZEJRVUVzUlVGQlJ5eERRVUZGTEV0QlFVc3NSVUZCUXl4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRkxFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVNc1EwRkJReXhQUVVGQkxFVkJRVThzUTBGQlJTeEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFVkJRVVVzVFVGQlRTeERRVUZITEVOQlFVRXNSVUZCUXl4TlFVRk5MRU5CUVVNc1MwRkJWeXhEUVVGQk8xRkJRMmhJTzBGQlExSXNTMEZCU3l4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE96dEpRVVZVTEVsQlFVa3NUMEZCVHl4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFVkJRVVU3VFVGRGRFSXNUMEZCVHp0UlFVTk1MRzlDUVVGQkxFbEJRVWNzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc01rSkJRVFJDTEVOQlFVRXNSVUZCUVN4clFrRkJjVUlzUTBGQlFUdFBRVU5vUlN4RFFVRkRPMEZCUTFJc1MwRkJTenM3U1VGRlJEdE5RVU5GTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNVMEZCVlN4RFFVRkJMRVZCUVVFN1VVRkRka0lzYjBKQlFVRXNTVUZCUnl4RlFVRkJMRU5CUVVFc1EwRkJReXhIUVVGQkxFVkJRVWNzUTBGQlF5eFRRVUZWTEVOQlFVRXNSVUZCUVR0VlFVTm1MRTlCUVZFN1VVRkRUaXhEUVVGQk8wMUJRMFFzUTBGQlFUdE5RVU5PTzBkQlEwZzdSVUZEUkN4WlFVRlpMRVZCUVVVc1ZVRkJWU3hOUVVGTkxFVkJRVVVzUTBGQlF5eEZRVUZGTzBGQlEzSkRMRWxCUVVrc1NVRkJTU3hoUVVGaExFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNN08wbEJSWEpETEVOQlFVTXNRMEZCUXl4alFVRmpMRVZCUVVVc1EwRkJRenRCUVVOMlFpeEpRVUZKTEVOQlFVTXNRMEZCUXl4bFFVRmxMRVZCUVVVc1EwRkJRenM3U1VGRmNFSXNTVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzUlVGQlJUdE5RVU53UWl4aFFVRmhMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVNN1RVRkRla01zWVVGQllTeERRVUZETEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenRCUVVOcVF5eExRVUZMT3p0SlFVVkVMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU03VFVGRFdpeExRVUZMTEU5QlFVOHNZVUZCWVR0TlFVTjZRaXhUUVVGVExFZEJRVWNzUlVGQlJUdEJRVU53UWl4TFFVRkxMRU5CUVVNc1EwRkJRenM3U1VGRlNDeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1VVRkJVU3hGUVVGRk8wMUJRM1pDTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1VVRkJVU3hEUVVGRExFMUJRVTBzUlVGQlJTeGhRVUZoTEVOQlFVTXNRMEZCUXp0TFFVTTFRenRIUVVOR08wVkJRMFFzV1VGQldTeEZRVUZGTEZWQlFWVXNRMEZCUXl4RlFVRkZPMEZCUXpkQ0xFbEJRVWtzU1VGQlNTeFBRVUZQTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU03TzBsQlJXcERMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVWQlFVVTdUVUZEZUVJc1QwRkJUeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETzBGQlEzQkVMRXRCUVVzN08wbEJSVVFzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXp0TlFVTmFMRk5CUVZNc1IwRkJSeXhEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEV0QlFVczdUVUZETVVJc1RVRkJUU3hOUVVGTkxFTkJRVU1zUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4SFFVRkhMRU5CUVVNc1IwRkJSeXhKUVVGSk8wMUJRM0pETEU5QlFVOHNTMEZCU3l4UFFVRlBPMHRCUTNCQ0xFTkJRVU1zUTBGQlF6dEhRVU5LTzBWQlEwUXNVVUZCVVN4RlFVRkZMRmxCUVZrN1FVRkRlRUlzU1VGQlNTeEpRVUZKTEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF6dEJRVU53UXpzN1NVRkZTU3hKUVVGSkxFOUJRVThzUzBGQlN5eEpRVUZKTEVWQlFVVTdUVUZEY0VJc1QwRkJUeXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEyNUNMRXRCUVVzN08wRkJSVXdzU1VGQlNTeFBRVUZQTEVWQlFVVXNRMEZCUXpzN1NVRkZWaXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNUVUZCVFN4RlFVRkZMRTlCUVU4c1EwRkJReXhEUVVGRExFTkJRVU03UjBGRGJFTTdSVUZEUkN4TlFVRk5MRVZCUVVVc1dVRkJXVHRCUVVOMFFpeEpRVUZKTEVsQlFVa3NUMEZCVHl4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeERRVUZET3p0SlFVVm9ReXhKUVVGSkxFOUJRVThzUzBGQlN5eEpRVUZKTEVWQlFVVTdUVUZEY0VJc1QwRkJUeXhIUVVGSExFTkJRVU1zUTBGQlF6dEJRVU5zUWl4TFFVRkxPenRCUVVWTUxFbEJRVWtzVDBGQlR5eEZRVUZGTEVOQlFVTTdPMGxCUlZZc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEUxQlFVMHNSVUZCUlN4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVGRE8wZEJRMnhETzBWQlEwUXNWMEZCVnl4RlFVRkZMRmxCUVZrN1NVRkRka0lzU1VGQlNTeEZRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhGUVVGRk8wMUJRM2hDTEU5QlFVODdRVUZEWWl4TFFVRkxPenRCUVVWTUxFbEJRVWtzU1VGQlNTeEpRVUZKTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPenRKUVVVNVF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVNN1IwRkRaRHRCUVVOSUxFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVklMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzV1VGQldTeERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5b3FYRzRnS2lCQWFuTjRJRkpsWVdOMExrUlBUVnh1SUNvdlhHNWNiblpoY2lCQmRYUnZZMjl0Y0d4bGRHVTdYRzUyWVhJZ2EyVjVUV0Z3TzF4dWRtRnlJQ1FnSUNBZ0lDQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbmFuRjFaWEo1SnlrN1hHNTJZWElnVW1WaFkzUWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDZHlaV0ZqZENjcE8xeHVkbUZ5SUVKaFkydGliMjVsSUNBZ0lEMGdjbVZ4ZFdseVpTZ25ZbUZqYTJKdmJtVW5LVHRjYm5aaGNpQkNkWFIwYjI0Z0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dUx5NHVMMk52YlhCdmJtVnVkSE12WW5WMGRHOXVMbXB6ZUNjcE8xeHVkbUZ5SUVSeWIzQmtiM2R1SUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTlrY205d1pHOTNiaTVxYzNnbktUdGNiblpoY2lCZklDQWdJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KM1Z1WkdWeWMyTnZjbVVuS1R0Y2JuWmhjaUJJYjNSclpYbHpJQ0FnSUNBOUlISmxjWFZwY21Vb0ozSmxZV04wTFdodmRHdGxlWE1uS1M1SWIzUkxaWGx6TzF4dVhHNXJaWGxOWVhBZ1BTQjdYRzRnSUNkdGIzWmxWWEFuT2lBZ0lDZDFjQ2NzWEc0Z0lDZHRiM1psUkc5M2JpYzZJQ2RrYjNkdUp5eGNiaUFnSjNObGJHVmpkQ2M2SUNBZ0oyVnVkR1Z5SjF4dWZUdGNibHh1Wm5WdVkzUnBiMjRnWkdWMFpYSnRhVzVsVm1Gc2RXVWdLSFpoYkhWbExDQnRkV3gwYVNrZ2UxeHVJQ0JwWmlBb2JYVnNkR2twSUh0Y2JpQWdJQ0J5WlhSMWNtNGdaR1YwWlhKdGFXNWxUWFZzZEdsV1lXeDFaWE1vZG1Gc2RXVXBPMXh1SUNCOVhHNWNiaUFnY21WMGRYSnVJR1JsZEdWeWJXbHVaVk5wYm1kc1pWWmhiSFZsS0haaGJIVmxLVHRjYm4xY2JseHVablZ1WTNScGIyNGdaR1YwWlhKdGFXNWxUWFZzZEdsV1lXeDFaWE1nS0haaGJIVmxjeWtnZTF4dUlDQnBaaUFvSVNCQmNuSmhlUzVwYzBGeWNtRjVLSFpoYkhWbGN5a3BJSHRjYmlBZ0lDQjJZV3gxWlhNZ1BTQmJkbUZzZFdWelhUdGNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQjJZV3gxWlhNN1hHNTlYRzVjYm1aMWJtTjBhVzl1SUdSbGRHVnliV2x1WlZOcGJtZHNaVlpoYkhWbElDaDJZV3gxWlNrZ2UxeHVJQ0JwWmlBb1FYSnlZWGt1YVhOQmNuSmhlU2gyWVd4MVpTa3BJSHRjYmlBZ0lDQjBhSEp2ZHlBblJYaHdaV04wWldRZ0p5QXJJSFpoYkhWbElDc2dKeUIwYnlCdWIzUWdZbVVnWVc0Z1FYSnlZWGtuTzF4dUlDQjlYRzVjYmlBZ2FXWWdLRjh1YVhOVGRISnBibWNvZG1Gc2RXVXBLU0I3WEc0Z0lDQWdkbUZzZFdVZ1BTQjdkR1Y0ZERvZ2RtRnNkV1Y5TzF4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUhaaGJIVmxPMXh1ZlZ4dVhHNUJkWFJ2WTI5dGNHeGxkR1VnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJSE4wWVhScFkzTTZJSHRjYmlBZ0lDQmtaWFJsY20xcGJtVldZV3gxWlRvZ1pHVjBaWEp0YVc1bFZtRnNkV1ZjYmlBZ2ZTeGNiaUFnY0hKdmNGUjVjR1Z6T2lCN1hHNGdJQ0FnWldScGRHbHVaem9nSUNBZ1VtVmhZM1F1VUhKdmNGUjVjR1Z6TG1KdmIyd3NYRzRnSUNBZ2JYVnNkR2s2SUNBZ0lDQWdVbVZoWTNRdVVISnZjRlI1Y0dWekxtSnZiMndzWEc0Z0lDQWdiM0IwYVc5dWN6b2dJQ0FnVW1WaFkzUXVVSEp2Y0ZSNWNHVnpMbUZ5Y21GNUxGeHVJQ0FnSUdkbGJtVnlZWFJ2Y2pvZ0lGSmxZV04wTGxCeWIzQlVlWEJsY3k1bWRXNWpYRzRnSUgwc1hHNGdJR2RsZEVsdWFYUnBZV3hUZEdGMFpUb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCMllXeDFaU0E5SUVGMWRHOWpiMjF3YkdWMFpTNWtaWFJsY20xcGJtVldZV3gxWlNoMGFHbHpMbkJ5YjNCekxuWmhiSFZsTENCMGFHbHpMbkJ5YjNCekxtMTFiSFJwS1R0Y2JseHVJQ0FnSUhKbGRIVnliaUI3WEc0Z0lDQWdJQ0JsWkdsMGFXNW5PaUFnSUNCMGFHbHpMbkJ5YjNCekxtVmthWFJwYm1jc1hHNGdJQ0FnSUNCMllXeDFaVG9nSUNBZ0lDQjJZV3gxWlN4Y2JpQWdJQ0FnSUhSbGVIUldZV3gxWlRvZ0lDaDJZV3gxWlNBbUppQjJZV3gxWlM1MFpYaDBLU0I4ZkNBbkp5eGNiaUFnSUNBZ0lHRmpkR2wyWlRvZ0lDQWdJRzUxYkd3c1hHNGdJQ0FnSUNCdmNIUnBiMjV6T2lBZ0lDQjBhR2x6TG5CeWIzQnpMbTl3ZEdsdmJuTmNiaUFnSUNCOU8xeHVJQ0I5TEZ4dUlDQm5aWFJFWldaaGRXeDBVSEp2Y0hNNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2UxeHVJQ0FnSUNBZ1pXUnBkR2x1WnpvZ0lDQWdabUZzYzJVc1hHNGdJQ0FnSUNCdGRXeDBhVG9nSUNBZ0lDQm1ZV3h6WlN4Y2JpQWdJQ0FnSUc5d2RHbHZibk02SUNBZ0lGdGRMRnh1SUNBZ0lDQWdaMlZ1WlhKaGRHOXlPaUFnYm5Wc2JGeHVJQ0FnSUgwN1hHNGdJSDBzWEc0Z0lHTnZiWEJ2Ym1WdWRFUnBaRTF2ZFc1ME9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkR2hwY3k1bWIyTjFjMU5sWVhKamFDZ3BPMXh1SUNCOUxGeHVJQ0JqYjIxd2IyNWxiblJFYVdSVmNHUmhkR1U2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMGFHbHpMbVp2WTNWelUyVmhjbU5vS0NrN1hHNGdJSDBzWEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJ2Y0hScGIyNXpPMXh1SUNBZ0lIWmhjaUJvWVc1a2JHVnljeUE5SUh0Y2JpQWdJQ0FnSUcxdmRtVlZjRG9nSUNCMGFHbHpMbTF2ZG1WVmNDeGNiaUFnSUNBZ0lHMXZkbVZFYjNkdU9pQjBhR2x6TG0xdmRtVkViM2R1TEZ4dUlDQWdJQ0FnYzJWc1pXTjBPaUFnSUhSb2FYTXVjMlZzWldOMFNYUmxiVnh1SUNBZ0lIMDdYRzVjYmlBZ0lDQnBaaUFvZEdocGN5NXpkR0YwWlM1bFpHbDBhVzVuS1NCN1hHNGdJQ0FnSUNCdmNIUnBiMjV6SUQwZ2RHaHBjeTVpZFdsc1pFOXdkR2x2Ym5Nb0tUdGNiaUFnSUNCOVhHNWNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEVodmRHdGxlWE1nYTJWNVRXRndQWHRyWlhsTllYQjlJR2hoYm1Sc1pYSnpQWHRvWVc1a2JHVnljMzArWEc0Z0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpWm5ZdFlYVjBiMk52YlhCc1pYUmxYQ0krWEc0Z0lDQWdJQ0FnSUNBZ1BHbHVjSFYwSUhKbFpqMWNJbWx1Y0hWMFhDSWdZMnhoYzNOT1lXMWxQVndpYVc1d2RYUmhZbXhsWENJZ2RIbHdaVDFjSW5SbGVIUmNJaUJ3YkdGalpXaHZiR1JsY2oxY0luTmxZWEpqYUNCamNtbDBaWEpwWVZ3aUlISmxaajFjSW1sdWNIVjBYQ0lnYjI1RGFHRnVaMlU5ZTNSb2FYTXVhR0Z1Wkd4bFEyaGhibWRsZlNCa1pXWmhkV3gwVm1Gc2RXVTllM1JvYVhNdWMzUmhkR1V1ZEdWNGRGWmhiSFZsZlNBdlBseHVJQ0FnSUNBZ0lDQWdJSHR2Y0hScGIyNXpmVnh1SUNBZ0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBZ0lEd3ZTRzkwYTJWNWN6NWNiaUFnSUNBcE8xeHVJQ0I5TEZ4dUlDQmlkV2xzWkU5d2RHbHZibk02SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMllYSWdiM0IwYVc5dWN5QTlJSFJvYVhNdWMzUmhkR1V1YjNCMGFXOXVjenRjYmlBZ0lDQjJZWElnZEdWNGRDQWdJQ0E5SUhSb2FYTXVjM1JoZEdVdWRHVjRkRlpoYkhWbE8xeHVYRzRnSUNBZ2FXWWdLSFJvYVhNdWNISnZjSE11WjJWdVpYSmhkRzl5S1NCN1hHNGdJQ0FnSUNCdmNIUnBiMjV6SUQwZ2RHaHBjeTV3Y205d2N5NW5aVzVsY21GMGIzSW9kR2hwY3k1emRHRjBaUzUwWlhoMFZtRnNkV1VwTzF4dUlDQWdJSDFjYmx4dUlDQWdJRzl3ZEdsdmJuTWdQU0J2Y0hScGIyNXpJSHg4SUZ0ZE8xeHVJQ0FnSUc5d2RHbHZibk1nUFNCdmNIUnBiMjV6TG0xaGNDaG1kVzVqZEdsdmJpQW9iM0IwYVc5dUxDQnBibVJsZUNrZ2UxeHVJQ0FnSUNBZ2RtRnlJR05zWVhOelpYTWdQU0JiSjI5d2RHbHZiaWNzSUNkelpXeGxZM1JoWW14bEoxMDdYRzVjYmlBZ0lDQWdJR05zWVhOelpYTXVjSFZ6YUNnbllXTjBhWFpsTFNjZ0t5QW9hVzVrWlhnZ1BUMDlJSFJvYVhNdWMzUmhkR1V1WVdOMGFYWmxLU2s3WEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0FnSUR4c2FTQnJaWGs5ZTJsdVpHVjRmU0JqYkdGemMwNWhiV1U5ZTJOc1lYTnpaWE11YW05cGJpZ25JQ2NwZlNCdmJrTnNhV05yUFh0MGFHbHpMbWhoYm1Sc1pWTmxiR1ZqZEM1aWFXNWtLSFJvYVhNc0lHOXdkR2x2YmlsOVBudHZjSFJwYjI0dWJHRmlaV3g5UEM5c2FUNWNiaUFnSUNBZ0lDazdYRzRnSUNBZ2ZTd2dkR2hwY3lrN1hHNWNiaUFnSUNCcFppQW9iM0IwYVc5dWN5NXNaVzVuZEdnZ1BDQXhLU0I3WEc0Z0lDQWdJQ0J2Y0hScGIyNXpJRDBnS0Z4dUlDQWdJQ0FnSUNBOGJHa2dZMnhoYzNOT1lXMWxQVndpYlhWMFpXUWdiM0IwYVc5dUlIVnVjMlZzWldOMFlXSnNaVndpUGs1dklHMWhkR05vWlhNZ1ptOTFibVE4TDJ4cFBseHVJQ0FnSUNBZ0tUdGNiaUFnSUNCOVhHNWNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0p2Y0hScGIyNXpYQ0krWEc0Z0lDQWdJQ0FnSUR4MWJDQnlaV1k5WENKdmNIUnBiMjV6WENJK1hHNGdJQ0FnSUNBZ0lDQWdlMjl3ZEdsdmJuTjlYRzRnSUNBZ0lDQWdJRHd2ZFd3K1hHNGdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQXBPMXh1SUNCOUxGeHVJQ0JvWVc1a2JHVlRaV3hsWTNRNklHWjFibU4wYVc5dUlDaHZjSFJwYjI0c0lHVXBJSHRjYmlBZ0lDQjJZWElnWTNWeWNtVnVkRjkyWVd4MVpTQTlJSFJvYVhNdWMzUmhkR1V1ZG1Gc2RXVTdYRzVjYmlBZ0lDQmxMbkJ5WlhabGJuUkVaV1poZFd4MEtDazdYRzRnSUNBZ1pTNXpkRzl3VUhKdmNHRm5ZWFJwYjI0b0tUdGNibHh1SUNBZ0lHbG1JQ2gwYUdsekxuQnliM0J6TG0xMWJIUnBLU0I3WEc0Z0lDQWdJQ0JqZFhKeVpXNTBYM1poYkhWbElEMGdkR2hwY3k1emRHRjBaUzUyWVd4MVpTNXpiR2xqWlNncE8xeHVJQ0FnSUNBZ1kzVnljbVZ1ZEY5MllXeDFaUzV3ZFhOb0tHOXdkR2x2YmlrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaDdYRzRnSUNBZ0lDQjJZV3gxWlRvZ0lDQWdJQ0JqZFhKeVpXNTBYM1poYkhWbExGeHVJQ0FnSUNBZ2RHVjRkRlpoYkhWbE9pQWdKeWRjYmlBZ0lDQjlLVHRjYmx4dUlDQWdJR2xtSUNoMGFHbHpMbkJ5YjNCekxtOXVVMlZzWldOMEtTQjdYRzRnSUNBZ0lDQjBhR2x6TG5CeWIzQnpMbTl1VTJWc1pXTjBLRzl3ZEdsdmJpd2dZM1Z5Y21WdWRGOTJZV3gxWlNrN1hHNGdJQ0FnZlZ4dUlDQjlMRnh1SUNCb1lXNWtiR1ZEYUdGdVoyVTZJR1oxYm1OMGFXOXVJQ2hsS1NCN1hHNGdJQ0FnZG1GeUlHOXdkR2x2Ym5NZ1BTQjBhR2x6TG5OMFlYUmxMbTl3ZEdsdmJuTTdYRzVjYmlBZ0lDQnBaaUFvZEdocGN5NXdjbTl3Y3k1blpXNWxjbUYwYjNJcElIdGNiaUFnSUNBZ0lHOXdkR2x2Ym5NZ1BTQjBhR2x6TG5CeWIzQnpMbWRsYm1WeVlYUnZjaWhsTG5SaGNtZGxkQzUyWVd4MVpTbGNiaUFnSUNCOVhHNWNiaUFnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHRjYmlBZ0lDQWdJSFJsZUhSV1lXeDFaVG9nSUdVdWRHRnlaMlYwTG5aaGJIVmxMRnh1SUNBZ0lDQWdZV04wYVhabE9pQWdJQ0FnWlM1MFlYSm5aWFF1ZG1Gc2RXVWdQeUF3SURvZ2JuVnNiQ3hjYmlBZ0lDQWdJRzl3ZEdsdmJuTTZJQ0FnSUc5d2RHbHZibk5jYmlBZ0lDQjlLVHRjYmlBZ2ZTeGNiaUFnYlc5MlpVUnZkMjQ2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMllYSWdZM1Z5Y21WdWRDQTlJSFJvYVhNdWMzUmhkR1V1WVdOMGFYWmxPMXh1WEc1Y2JpQWdJQ0JwWmlBb1kzVnljbVZ1ZENBOVBUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ1kzVnljbVZ1ZENBOUlDMHhPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHTjFjbkpsYm5Rckt6dGNibHh1SUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTJGamRHbDJaVG9nWTNWeWNtVnVkSDBwTzF4dUlDQjlMRnh1SUNCdGIzWmxWWEE2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMllYSWdZM1Z5Y21WdWRDQTlJSFJvYVhNdWMzUmhkR1V1WVdOMGFYWmxPMXh1WEc0Z0lDQWdhV1lnS0dOMWNuSmxiblFnUFQwOUlHNTFiR3dwSUh0Y2JpQWdJQ0FnSUdOMWNuSmxiblFnUFNBeE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdOMWNuSmxiblF0TFR0Y2JseHVJQ0FnSUhSb2FYTXVjMlYwVTNSaGRHVW9lMkZqZEdsMlpUb2dZM1Z5Y21WdWRIMHBPMXh1SUNCOUxGeHVJQ0JtYjJOMWMxTmxZWEpqYURvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lHbG1JQ2doSUhSb2FYTXVjM1JoZEdVdVpXUnBkR2x1WnlrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1TzF4dUlDQWdJSDFjYmx4dUlDQWdJSFpoY2lCdWIyUmxJRDBnVW1WaFkzUXVabWx1WkVSUFRVNXZaR1VvZEdocGN5NXlaV1p6TG1sdWNIVjBLVHRjYmx4dUlDQWdJRzV2WkdVdVptOWpkWE1vS1R0Y2JpQWdmVnh1ZlNrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdRWFYwYjJOdmJYQnNaWFJsTzF4dUlsMTkiLCJ2YXIgQ2FzZUNvbGxlY3Rpb247XG52YXIgQmFja2JvbmUgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBDYXNlTW9kZWwgPSByZXF1aXJlKCcuL2Nhc2VfbW9kZWwnKTtcblxuQ2FzZUNvbGxlY3Rpb24gPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gIG1vZGVsOiBDYXNlTW9kZWwsXG4gIGxpbmtTaWJsaW5nczogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoaGVhZGVyLCBpbmRleCkge1xuICAgICAgaGVhZGVyLnByZXYgPSB0aGlzLmF0KGluZGV4IC0gMSk7XG4gICAgICBoZWFkZXIubmV4dCA9IHRoaXMuYXQoaW5kZXggKyAxKTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcbiAgY29tcGFyYXRvcjogZnVuY3Rpb24gKGZpcnN0LCBzZWNvbmQpIHtcbiAgICByZXR1cm4gZmlyc3QuZ2V0KCdwcmlvcml0eScpIC0gc2Vjb25kLmdldCgncHJpb3JpdHknKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FzZUNvbGxlY3Rpb247XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZZMkZ6WlhNdlkyRnpaVjlqYjJ4c1pXTjBhVzl1TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRWxCUVVrc1kwRkJZeXhEUVVGRE8wRkJRMjVDTEVsQlFVa3NVVUZCVVN4SlFVRkpMRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6dEJRVU53UXl4SlFVRkpMRk5CUVZNc1IwRkJSeXhQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTTdPMEZCUlhoRExHTkJRV01zUjBGQlJ5eFJRVUZSTEVOQlFVTXNWVUZCVlN4RFFVRkRMRTFCUVUwc1EwRkJRenRGUVVNeFF5eExRVUZMTEVWQlFVVXNVMEZCVXp0RlFVTm9RaXhaUVVGWkxFVkJRVVVzV1VGQldUdEpRVU40UWl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExGVkJRVlVzVFVGQlRTeEZRVUZGTEV0QlFVc3NSVUZCUlR0TlFVTnFReXhOUVVGTkxFTkJRVU1zU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXl4RlFVRkZMRU5CUVVNc1MwRkJTeXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETzAxQlEycERMRTFCUVUwc1EwRkJReXhKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETEVWQlFVVXNRMEZCUXl4TFFVRkxMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU03UzBGRGJFTXNSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenRIUVVOV08wVkJRMFFzVlVGQlZTeEZRVUZGTEZWQlFWVXNTMEZCU3l4RlFVRkZMRTFCUVUwc1JVRkJSVHRKUVVOdVF5eFBRVUZQTEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJWU3hEUVVGRExFZEJRVWNzVFVGQlRTeERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJRenRIUVVOMlJEdEJRVU5JTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NZMEZCWXl4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpZG1GeUlFTmhjMlZEYjJ4c1pXTjBhVzl1TzF4dWRtRnlJRUpoWTJ0aWIyNWxJQ0E5SUhKbGNYVnBjbVVvSjJKaFkydGliMjVsSnlrN1hHNTJZWElnUTJGelpVMXZaR1ZzSUQwZ2NtVnhkV2x5WlNnbkxpOWpZWE5sWDIxdlpHVnNKeWs3WEc1Y2JrTmhjMlZEYjJ4c1pXTjBhVzl1SUQwZ1FtRmphMkp2Ym1VdVEyOXNiR1ZqZEdsdmJpNWxlSFJsYm1Rb2UxeHVJQ0J0YjJSbGJEb2dRMkZ6WlUxdlpHVnNMRnh1SUNCc2FXNXJVMmxpYkdsdVozTTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IwYUdsekxtVmhZMmdvWm5WdVkzUnBiMjRnS0dobFlXUmxjaXdnYVc1a1pYZ3BJSHRjYmlBZ0lDQWdJR2hsWVdSbGNpNXdjbVYySUQwZ2RHaHBjeTVoZENocGJtUmxlQ0F0SURFcE8xeHVJQ0FnSUNBZ2FHVmhaR1Z5TG01bGVIUWdQU0IwYUdsekxtRjBLR2x1WkdWNElDc2dNU2s3WEc0Z0lDQWdmU3dnZEdocGN5azdYRzRnSUgwc1hHNGdJR052YlhCaGNtRjBiM0k2SUdaMWJtTjBhVzl1SUNobWFYSnpkQ3dnYzJWamIyNWtLU0I3WEc0Z0lDQWdjbVYwZFhKdUlHWnBjbk4wTG1kbGRDZ25jSEpwYjNKcGRIa25LU0F0SUhObFkyOXVaQzVuWlhRb0ozQnlhVzl5YVhSNUp5azdYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUVOaGMyVkRiMnhzWldOMGFXOXVPMXh1SWwxOSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgQ2FzZUhpc3Rvcnk7XG52YXIgUmVhY3QgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyICQgICAgICAgICAgID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgQmFja2JvbmUgICAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyIGNvbnN0YW50cyAgID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzJyk7XG52YXIgVHIgICAgICAgICAgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL3RyLmpzeCcpO1xudmFyIFRkICAgICAgICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy90ZC5qc3gnKTtcbnZhciBUYWJzICAgICAgICA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvdGFicy5qc3gnKTtcbnZhciBJY29uICAgICAgICA9IHJlcXVpcmUoJy4vaWNvbl93cmFwcGVyLmpzeCcpO1xudmFyIG1vbWVudCAgICAgID0gcmVxdWlyZSgnbW9tZW50Jyk7XG5cbkNhc2VIaXN0b3J5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkNhc2VIaXN0b3J5XCIsXG4gIHByb3BUeXBlczoge1xuICAgIGNvbGxlY3Rpb246IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEJhY2tib25lLkNvbGxlY3Rpb24pLmlzUmVxdWlyZWRcbiAgfSxcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMucHJvcHMuY29sbGVjdGlvbixcbiAgICAgIGZldGNoaW5nOiAgIGZhbHNlXG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnN0YXRlLmNvbGxlY3Rpb24ub24oJ3JlcXVlc3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoISB0aGlzLmlzTW91bnRlZCgpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZmV0Y2hpbmc6IHRydWV9KTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHRoaXMuc3RhdGUuY29sbGVjdGlvbi5vbignc3luYycsIGZ1bmN0aW9uIChjb2xsZWN0aW9uKSB7XG4gICAgICBpZiAoISB0aGlzLmlzTW91bnRlZCgpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5mZXRjaGVyID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBjb2xsZWN0aW9uOiBjb2xsZWN0aW9uLFxuICAgICAgICBmZXRjaGluZzogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgdGhpcy5mZXRjaGVyID0gdGhpcy5zdGF0ZS5jb2xsZWN0aW9uLmZldGNoKCk7XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zdGF0ZS5jb2xsZWN0aW9uLm9mZihudWxsLCBudWxsLCB0aGlzKTtcblxuICAgIGlmICh0aGlzLmZldGNoZXIpIHtcbiAgICAgIHRoaXMuZmV0Y2hlci5hYm9ydCgpO1xuICAgIH1cbiAgfSxcbiAgX2J1aWxkVGFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5mZXRjaGluZykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCB7Y29sU3BhbjogXCIzXCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IFwiY2lyY2xlLW8tbm90Y2hcIiwgc3BpbjogdHJ1ZX0pLCBcIiBMb2FkaW5nIGRhdGEgZnJvbSBzZXJ2ZXIuLi5cIlxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5jb2xsZWN0aW9uLm1hcChmdW5jdGlvbiAobW9kZWwsIGluZGV4KSB7XG4gICAgICB2YXIgb2RkICAgICA9IGluZGV4ICUgMiA/ICdvZGQnIDogJyc7XG4gICAgICB2YXIgZGF0ZSAgICA9IG1vbWVudChtb2RlbC5nZXQoJ2RhdGUnKSkuZm9ybWF0KGNvbnN0YW50cy5EQVRFX0ZPUk1BVCk7XG4gICAgICB2YXIgdGl0bGUgICA9IG1vZGVsLmdldCgndGl0bGUnKTtcbiAgICAgIHZhciBjb21tZW50ID0gbW9kZWwuZ2V0KCdjb21tZW50Jyk7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCB7a2V5OiBtb2RlbC5jaWQsIGNsYXNzTmFtZTogb2RkfSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIHtjbGFzc05hbWU6IFwiZGF0ZWZpZWxkXCJ9LCBkYXRlKSwgXCIsXCIsIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiLCBudWxsLCB0aXRsZSksIFwiLFwiLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgY29tbWVudClcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGl0ZW1zID0gdGhpcy5fYnVpbGRUYWJsZSgpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0YWJsZVwiLCB7Y2xhc3NOYW1lOiBcImZ1bGxcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aGVhZFwiLCBudWxsLCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBudWxsLCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIHtjbGFzc05hbWU6IFwiZGF0ZWZpZWxkXCJ9LCBcIkRhdGVcIiksIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIkFjdGlvblwiKSwgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiQ29tbWVudHNcIilcbiAgICAgICAgICAgIClcbiAgICAgICAgICApLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGJvZHlcIiwgbnVsbCwgXG4gICAgICAgICAgICBpdGVtc1xuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhc2VIaXN0b3J5O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WTJGelpYTXZZMkZ6WlY5b2FYTjBiM0o1TG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHM3UVVGRlFTeEhRVUZIT3p0QlFVVklMRWxCUVVrc1YwRkJWeXhEUVVGRE8wRkJRMmhDTEVsQlFVa3NTMEZCU3l4VFFVRlRMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU51UXl4SlFVRkpMRU5CUVVNc1lVRkJZU3hQUVVGUExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdRVUZEY0VNc1NVRkJTU3hSUVVGUkxFMUJRVTBzVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPMEZCUTNSRExFbEJRVWtzVTBGQlV5eExRVUZMTEU5QlFVOHNRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eERRVUZETzBGQlF6ZERMRWxCUVVrc1JVRkJSU3haUVVGWkxFOUJRVThzUTBGQlF5eDVRa0ZCZVVJc1EwRkJReXhEUVVGRE8wRkJRM0pFTEVsQlFVa3NSVUZCUlN4WlFVRlpMRTlCUVU4c1EwRkJReXg1UWtGQmVVSXNRMEZCUXl4RFFVRkRPMEZCUTNKRUxFbEJRVWtzU1VGQlNTeFZRVUZWTEU5QlFVOHNRMEZCUXl3eVFrRkJNa0lzUTBGQlF5eERRVUZETzBGQlEzWkVMRWxCUVVrc1NVRkJTU3hWUVVGVkxFOUJRVThzUTBGQlF5eHZRa0ZCYjBJc1EwRkJReXhEUVVGRE8wRkJRMmhFTEVsQlFVa3NUVUZCVFN4UlFVRlJMRTlCUVU4c1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6czdRVUZGY0VNc2FVTkJRV2xETERKQ1FVRkJPMFZCUXk5Q0xGTkJRVk1zUlVGQlJUdEpRVU5VTEZWQlFWVXNSVUZCUlN4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExGVkJRVlVzUTBGQlF5eFJRVUZSTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNc1ZVRkJWVHRIUVVOMlJUdEZRVU5FTEdWQlFXVXNSVUZCUlN4WlFVRlpPMGxCUXpOQ0xFOUJRVTg3VFVGRFRDeFZRVUZWTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhWUVVGVk8wMUJRMnBETEZGQlFWRXNTVUZCU1N4TFFVRkxPMHRCUTJ4Q0xFTkJRVU03UjBGRFNEdEZRVU5FTEdsQ1FVRnBRaXhGUVVGRkxGbEJRVms3U1VGRE4wSXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhWUVVGVkxFTkJRVU1zUlVGQlJTeERRVUZETEZOQlFWTXNSVUZCUlN4WlFVRlpPMDFCUXpsRExFbEJRVWtzUlVGQlJTeEpRVUZKTEVOQlFVTXNVMEZCVXl4RlFVRkZMRVZCUVVVN1VVRkRkRUlzVDBGQlR5eExRVUZMTEVOQlFVTTdRVUZEY2tJc1QwRkJUenM3VFVGRlJDeEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNc1VVRkJVU3hGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEZEVNc1MwRkJTeXhGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZET3p0SlFVVlVMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVlVGQlZTeERRVUZETEVWQlFVVXNRMEZCUXl4TlFVRk5MRVZCUVVVc1ZVRkJWU3hWUVVGVkxFVkJRVVU3VFVGRGNrUXNTVUZCU1N4RlFVRkZMRWxCUVVrc1EwRkJReXhUUVVGVExFVkJRVVVzUlVGQlJUdFJRVU4wUWl4UFFVRlBMRXRCUVVzc1EwRkJRenRCUVVOeVFpeFBRVUZQT3p0QlFVVlFMRTFCUVUwc1NVRkJTU3hEUVVGRExFOUJRVThzUjBGQlJ5eExRVUZMTEVOQlFVTTdPMDFCUlhKQ0xFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTTdVVUZEV2l4VlFVRlZMRVZCUVVVc1ZVRkJWVHRSUVVOMFFpeFJRVUZSTEVWQlFVVXNTMEZCU3p0UFFVTm9RaXhEUVVGRExFTkJRVU03UVVGRFZDeExRVUZMTEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN08wbEJSVlFzU1VGQlNTeERRVUZETEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGVkJRVlVzUTBGQlF5eExRVUZMTEVWQlFVVXNRMEZCUXp0SFFVTTVRenRGUVVORUxHOUNRVUZ2UWl4RlFVRkZMRmxCUVZrN1FVRkRjRU1zU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRlZCUVZVc1EwRkJReXhIUVVGSExFTkJRVU1zU1VGQlNTeEZRVUZGTEVsQlFVa3NSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenM3U1VGRk5VTXNTVUZCU1N4SlFVRkpMRU5CUVVNc1QwRkJUeXhGUVVGRk8wMUJRMmhDTEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhGUVVGRkxFTkJRVU03UzBGRGRFSTdSMEZEUmp0RlFVTkVMRmRCUVZjc1JVRkJSU3haUVVGWk8wbEJRM1pDTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGUkxFVkJRVVU3VFVGRGRrSTdVVUZEUlN4dlFrRkJRU3hKUVVGSExFVkJRVUVzU1VGQlF5eEZRVUZCTzFWQlEwWXNiMEpCUVVFc1NVRkJSeXhGUVVGQkxFTkJRVUVzUTBGQlF5eFBRVUZCTEVWQlFVOHNRMEZCUXl4SFFVRkpMRU5CUVVFc1JVRkJRVHRaUVVOa0xHOUNRVUZETEVsQlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1NVRkJRU3hGUVVGSkxFTkJRVU1zWjBKQlFVRXNSVUZCWjBJc1EwRkJReXhKUVVGQkxFVkJRVWtzUTBGQlJTeEpRVUZMTEVOQlFVRXNRMEZCUnl4RFFVRkJMRVZCUVVFc09FSkJRVUU3UVVGQlFTeFZRVU4yUXl4RFFVRkJPMUZCUTBZc1EwRkJRVHRSUVVOTU8wRkJRMUlzUzBGQlN6czdTVUZGUkN4UFFVRlBMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVlVGQlZTeERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRlZMRXRCUVVzc1JVRkJSU3hMUVVGTExFVkJRVVU3VFVGRGRrUXNTVUZCU1N4SFFVRkhMRTlCUVU4c1MwRkJTeXhIUVVGSExFTkJRVU1zUjBGQlJ5eExRVUZMTEVkQlFVY3NSVUZCUlN4RFFVRkRPMDFCUTNKRExFbEJRVWtzU1VGQlNTeE5RVUZOTEUxQlFVMHNRMEZCUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETEVOQlFVTXNUVUZCVFN4RFFVRkRMRk5CUVZNc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlF6dE5RVU4wUlN4SlFVRkpMRXRCUVVzc1MwRkJTeXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUTNaRExFMUJRVTBzU1VGQlNTeFBRVUZQTEVkQlFVY3NTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6czdUVUZGYmtNN1VVRkRSU3h2UWtGQlFTeEpRVUZITEVWQlFVRXNRMEZCUVN4RFFVRkRMRWRCUVVFc1JVRkJSeXhEUVVGRkxFdEJRVXNzUTBGQlF5eEhRVUZITEVWQlFVTXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJSU3hIUVVGTExFTkJRVUVzUlVGQlFUdFZRVU5zUXl4dlFrRkJRU3hKUVVGSExFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRmRCUVZrc1EwRkJRU3hGUVVGRExFbEJRVlVzUTBGQlFTeEZRVUZCTEVkQlFVRXNSVUZCUVR0QlFVRkJMRlZCUTNKRExHOUNRVUZCTEVsQlFVY3NSVUZCUVN4SlFVRkRMRVZCUVVNc1MwRkJWeXhEUVVGQkxFVkJRVUVzUjBGQlFTeEZRVUZCTzBGQlFVRXNWVUZEYUVJc2IwSkJRVUVzU1VGQlJ5eEZRVUZCTEVsQlFVTXNSVUZCUXl4UFFVRmhMRU5CUVVFN1VVRkRaaXhEUVVGQk8xRkJRMHc3UzBGRFNDeEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPMGRCUTFZN1JVRkRSQ3hOUVVGTkxFVkJRVVVzV1VGQldUdEJRVU4wUWl4SlFVRkpMRWxCUVVrc1MwRkJTeXhIUVVGSExFbEJRVWtzUTBGQlF5eFhRVUZYTEVWQlFVVXNRMEZCUXpzN1NVRkZMMEk3VFVGRFJTeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1NVRkJReXhGUVVGQk8xRkJRMGdzYjBKQlFVRXNUMEZCVFN4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eE5RVUZQTEVOQlFVRXNSVUZCUVR0VlFVTjBRaXh2UWtGQlFTeFBRVUZOTEVWQlFVRXNTVUZCUXl4RlFVRkJPMWxCUTB3c2IwSkJRVUVzU1VGQlJ5eEZRVUZCTEVsQlFVTXNSVUZCUVR0alFVTkdMRzlDUVVGQkxFbEJRVWNzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc1YwRkJXU3hEUVVGQkxFVkJRVUVzVFVGQlV5eERRVUZCTEVWQlFVRXNiMEpCUVVFc1NVRkJSeXhGUVVGQkxFbEJRVU1zUlVGQlFTeFJRVUZYTEVOQlFVRXNSVUZCUVN4dlFrRkJRU3hKUVVGSExFVkJRVUVzU1VGQlF5eEZRVUZCTEZWQlFXRXNRMEZCUVR0WlFVTm9SU3hEUVVGQk8xVkJRME1zUTBGQlFTeEZRVUZCTzFWQlExSXNiMEpCUVVFc1QwRkJUU3hGUVVGQkxFbEJRVU1zUlVGQlFUdFpRVU5LTEV0QlFVMDdWVUZEUkN4RFFVRkJPMUZCUTBZc1EwRkJRVHROUVVOS0xFTkJRVUU3VFVGRFRqdEhRVU5JTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4WFFVRlhMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlFQnFjM2dnVW1WaFkzUXVSRTlOWEc0Z0tpOWNibHh1ZG1GeUlFTmhjMlZJYVhOMGIzSjVPMXh1ZG1GeUlGSmxZV04wSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duY21WaFkzUW5LVHRjYm5aaGNpQWtJQ0FnSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSjJweGRXVnllU2NwTzF4dWRtRnlJRUpoWTJ0aWIyNWxJQ0FnSUQwZ2NtVnhkV2x5WlNnblltRmphMkp2Ym1VbktUdGNiblpoY2lCamIyNXpkR0Z1ZEhNZ0lDQTlJSEpsY1hWcGNtVW9KeTR1THk0dUwyTnZibk4wWVc1MGN5Y3BPMXh1ZG1GeUlGUnlJQ0FnSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duTGk0dkxpNHZZMjl0Y0c5dVpXNTBjeTkwY2k1cWMzZ25LVHRjYm5aaGNpQlVaQ0FnSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dUx5NHVMMk52YlhCdmJtVnVkSE12ZEdRdWFuTjRKeWs3WEc1MllYSWdWR0ZpY3lBZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NjdUxpOHVMaTlqYjIxd2IyNWxiblJ6TDNSaFluTXVhbk40SnlrN1hHNTJZWElnU1dOdmJpQWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDY3VMMmxqYjI1ZmQzSmhjSEJsY2k1cWMzZ25LVHRjYm5aaGNpQnRiMjFsYm5RZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSjIxdmJXVnVkQ2NwTzF4dVhHNURZWE5sU0dsemRHOXllU0E5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JpQWdjSEp2Y0ZSNWNHVnpPaUI3WEc0Z0lDQWdZMjlzYkdWamRHbHZiam9nVW1WaFkzUXVVSEp2Y0ZSNWNHVnpMbWx1YzNSaGJtTmxUMllvUW1GamEySnZibVV1UTI5c2JHVmpkR2x2YmlrdWFYTlNaWEYxYVhKbFpGeHVJQ0I5TEZ4dUlDQm5aWFJKYm1sMGFXRnNVM1JoZEdVNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2UxeHVJQ0FnSUNBZ1kyOXNiR1ZqZEdsdmJqb2dkR2hwY3k1d2NtOXdjeTVqYjJ4c1pXTjBhVzl1TEZ4dUlDQWdJQ0FnWm1WMFkyaHBibWM2SUNBZ1ptRnNjMlZjYmlBZ0lDQjlPMXh1SUNCOUxGeHVJQ0JqYjIxd2IyNWxiblJFYVdSTmIzVnVkRG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhSb2FYTXVjM1JoZEdVdVkyOXNiR1ZqZEdsdmJpNXZiaWduY21WeGRXVnpkQ2NzSUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNBZ0lHbG1JQ2doSUhSb2FYTXVhWE5OYjNWdWRHVmtLQ2twSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdG1aWFJqYUdsdVp6b2dkSEoxWlgwcE8xeHVJQ0FnSUgwc0lIUm9hWE1wTzF4dVhHNGdJQ0FnZEdocGN5NXpkR0YwWlM1amIyeHNaV04wYVc5dUxtOXVLQ2R6ZVc1akp5d2dablZ1WTNScGIyNGdLR052Ykd4bFkzUnBiMjRwSUh0Y2JpQWdJQ0FnSUdsbUlDZ2hJSFJvYVhNdWFYTk5iM1Z1ZEdWa0tDa3BJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR1poYkhObE8xeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG1abGRHTm9aWElnUFNCbVlXeHpaVHRjYmx4dUlDQWdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaDdYRzRnSUNBZ0lDQWdJR052Ykd4bFkzUnBiMjQ2SUdOdmJHeGxZM1JwYjI0c1hHNGdJQ0FnSUNBZ0lHWmxkR05vYVc1bk9pQm1ZV3h6WlZ4dUlDQWdJQ0FnZlNrN1hHNGdJQ0FnZlN3Z2RHaHBjeWs3WEc1Y2JpQWdJQ0IwYUdsekxtWmxkR05vWlhJZ1BTQjBhR2x6TG5OMFlYUmxMbU52Ykd4bFkzUnBiMjR1Wm1WMFkyZ29LVHRjYmlBZ2ZTeGNiaUFnWTI5dGNHOXVaVzUwVjJsc2JGVnViVzkxYm5RNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjBhR2x6TG5OMFlYUmxMbU52Ykd4bFkzUnBiMjR1YjJabUtHNTFiR3dzSUc1MWJHd3NJSFJvYVhNcE8xeHVYRzRnSUNBZ2FXWWdLSFJvYVhNdVptVjBZMmhsY2lrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTVtWlhSamFHVnlMbUZpYjNKMEtDazdYRzRnSUNBZ2ZWeHVJQ0I5TEZ4dUlDQmZZblZwYkdSVVlXSnNaVG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUdsbUlDaDBhR2x6TG5OMFlYUmxMbVpsZEdOb2FXNW5LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdJQ0E4ZEhJK1hHNGdJQ0FnSUNBZ0lDQWdQSFJrSUdOdmJGTndZVzQ5WENJelhDSStYRzRnSUNBZ0lDQWdJQ0FnSUNBOFNXTnZiaUIwZVhCbFBWd2lZMmx5WTJ4bExXOHRibTkwWTJoY0lpQnpjR2x1UFh0MGNuVmxmU0F2UGlCTWIyRmthVzVuSUdSaGRHRWdabkp2YlNCelpYSjJaWEl1TGk1Y2JpQWdJQ0FnSUNBZ0lDQThMM1JrUGx4dUlDQWdJQ0FnSUNBOEwzUnlQbHh1SUNBZ0lDQWdLVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTV6ZEdGMFpTNWpiMnhzWldOMGFXOXVMbTFoY0NobWRXNWpkR2x2YmlBb2JXOWtaV3dzSUdsdVpHVjRLU0I3WEc0Z0lDQWdJQ0IyWVhJZ2IyUmtJQ0FnSUNBOUlHbHVaR1Y0SUNVZ01pQS9JQ2R2WkdRbklEb2dKeWM3WEc0Z0lDQWdJQ0IyWVhJZ1pHRjBaU0FnSUNBOUlHMXZiV1Z1ZENodGIyUmxiQzVuWlhRb0oyUmhkR1VuS1NrdVptOXliV0YwS0dOdmJuTjBZVzUwY3k1RVFWUkZYMFpQVWsxQlZDazdYRzRnSUNBZ0lDQjJZWElnZEdsMGJHVWdJQ0E5SUcxdlpHVnNMbWRsZENnbmRHbDBiR1VuS1R0Y2JpQWdJQ0FnSUhaaGNpQmpiMjF0Wlc1MElEMGdiVzlrWld3dVoyVjBLQ2RqYjIxdFpXNTBKeWs3WEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0FnSUR4MGNpQnJaWGs5ZTIxdlpHVnNMbU5wWkgwZ1kyeGhjM05PWVcxbFBYdHZaR1I5UGx4dUlDQWdJQ0FnSUNBZ0lEeDBaQ0JqYkdGemMwNWhiV1U5WENKa1lYUmxabWxsYkdSY0lqNTdaR0YwWlgwOEwzUmtQaXhjYmlBZ0lDQWdJQ0FnSUNBOGRHUStlM1JwZEd4bGZUd3ZkR1ErTEZ4dUlDQWdJQ0FnSUNBZ0lEeDBaRDU3WTI5dGJXVnVkSDA4TDNSa1BseHVJQ0FnSUNBZ0lDQThMM1J5UGx4dUlDQWdJQ0FnS1R0Y2JpQWdJQ0I5TENCMGFHbHpLVHRjYmlBZ2ZTeGNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZG1GeUlHbDBaVzF6SUQwZ2RHaHBjeTVmWW5WcGJHUlVZV0pzWlNncE8xeHVYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4a2FYWStYRzRnSUNBZ0lDQWdJRHgwWVdKc1pTQmpiR0Z6YzA1aGJXVTlYQ0ptZFd4c1hDSStYRzRnSUNBZ0lDQWdJQ0FnUEhSb1pXRmtQbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BIUnlQbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQThkR2dnWTJ4aGMzTk9ZVzFsUFZ3aVpHRjBaV1pwWld4a1hDSStSR0YwWlR3dmRHZytQSFJvUGtGamRHbHZiand2ZEdnK1BIUm9Qa052YlcxbGJuUnpQQzkwYUQ1Y2JpQWdJQ0FnSUNBZ0lDQWdJRHd2ZEhJK1hHNGdJQ0FnSUNBZ0lDQWdQQzkwYUdWaFpENWNiaUFnSUNBZ0lDQWdJQ0E4ZEdKdlpIaytYRzRnSUNBZ0lDQWdJQ0FnSUNCN2FYUmxiWE45WEc0Z0lDQWdJQ0FnSUNBZ1BDOTBZbTlrZVQ1Y2JpQWdJQ0FnSUNBZ1BDOTBZV0pzWlQ1Y2JpQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDazdYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUVOaGMyVklhWE4wYjNKNU8xeHVJbDE5IiwidmFyIENhc2VIaXN0b3J5Q29sbGVjdGlvbjtcbnZhciBCYWNrYm9uZSAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xuXG5DYXNlSGlzdG9yeUNvbGxlY3Rpb24gPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gIGZldGNoOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXQoW1xuICAgICAge1xuICAgICAgICBkYXRlOiAgICAgbmV3IERhdGUoKSxcbiAgICAgICAgdGl0bGU6ICAgICdKb2UgU21pdGggZXhlY3V0ZWQgYSBjYWxsJyxcbiAgICAgICAgY29tbWVudDogICdUaGlzIGlzIGp1c3QgYSBjb21tZW50J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZGF0ZTogICAgIG5ldyBEYXRlKCksXG4gICAgICAgIHRpdGxlOiAgICAnQ2FzZSBjcmVhdGVkIGJ5IHVzZXInLFxuICAgICAgICBjb21tZW50OiAgJydcbiAgICAgIH1cbiAgICBdKTtcblxuICAgIHRoaXMudHJpZ2dlcigncmVxdWVzdCcpO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnRyaWdnZXIoJ3N5bmMnLCB0aGlzKTtcbiAgICB9LmJpbmQodGhpcyksIDEwMDApO1xuICB9LFxuICB1cmw6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhc2VIaXN0b3J5Q29sbGVjdGlvbjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdlkyRnpaWE12WTJGelpWOW9hWE4wYjNKNVgyTnZiR3hsWTNScGIyNHVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1NVRkJTU3h4UWtGQmNVSXNRMEZCUXp0QlFVTXhRaXhKUVVGSkxGRkJRVkVzU1VGQlNTeFBRVUZQTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNN08wRkJSWEJETEhGQ1FVRnhRaXhIUVVGSExGRkJRVkVzUTBGQlF5eFZRVUZWTEVOQlFVTXNUVUZCVFN4RFFVRkRPMFZCUTJwRUxFdEJRVXNzUlVGQlJTeFpRVUZaTzBsQlEycENMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU03VFVGRFVEdFJRVU5GTEVsQlFVa3NUVUZCVFN4SlFVRkpMRWxCUVVrc1JVRkJSVHRSUVVOd1FpeExRVUZMTEV0QlFVc3NNa0pCUVRKQ08xRkJRM0pETEU5QlFVOHNSMEZCUnl4M1FrRkJkMEk3VDBGRGJrTTdUVUZEUkR0UlFVTkZMRWxCUVVrc1RVRkJUU3hKUVVGSkxFbEJRVWtzUlVGQlJUdFJRVU53UWl4TFFVRkxMRXRCUVVzc2MwSkJRWE5DTzFGQlEyaERMRTlCUVU4c1IwRkJSeXhGUVVGRk8wOUJRMkk3UVVGRFVDeExRVUZMTEVOQlFVTXNRMEZCUXpzN1FVRkZVQ3hKUVVGSkxFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN08wbEJSWGhDTEZWQlFWVXNRMEZCUXl4WlFVRlpPMDFCUTNKQ0xFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE8wdEJRelZDTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETzBkQlEzSkNPMFZCUTBRc1IwRkJSeXhGUVVGRkxGbEJRVms3U1VGRFppeFBRVUZQTEVWQlFVVXNRMEZCUXp0SFFVTllPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXh4UWtGQmNVSXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkluWmhjaUJEWVhObFNHbHpkRzl5ZVVOdmJHeGxZM1JwYjI0N1hHNTJZWElnUW1GamEySnZibVVnSUQwZ2NtVnhkV2x5WlNnblltRmphMkp2Ym1VbktUdGNibHh1UTJGelpVaHBjM1J2Y25sRGIyeHNaV04wYVc5dUlEMGdRbUZqYTJKdmJtVXVRMjlzYkdWamRHbHZiaTVsZUhSbGJtUW9lMXh1SUNCbVpYUmphRG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhSb2FYTXVjMlYwS0Z0Y2JpQWdJQ0FnSUh0Y2JpQWdJQ0FnSUNBZ1pHRjBaVG9nSUNBZ0lHNWxkeUJFWVhSbEtDa3NYRzRnSUNBZ0lDQWdJSFJwZEd4bE9pQWdJQ0FuU205bElGTnRhWFJvSUdWNFpXTjFkR1ZrSUdFZ1kyRnNiQ2NzWEc0Z0lDQWdJQ0FnSUdOdmJXMWxiblE2SUNBblZHaHBjeUJwY3lCcWRYTjBJR0VnWTI5dGJXVnVkQ2RjYmlBZ0lDQWdJSDBzWEc0Z0lDQWdJQ0I3WEc0Z0lDQWdJQ0FnSUdSaGRHVTZJQ0FnSUNCdVpYY2dSR0YwWlNncExGeHVJQ0FnSUNBZ0lDQjBhWFJzWlRvZ0lDQWdKME5oYzJVZ1kzSmxZWFJsWkNCaWVTQjFjMlZ5Snl4Y2JpQWdJQ0FnSUNBZ1kyOXRiV1Z1ZERvZ0lDY25YRzRnSUNBZ0lDQjlYRzRnSUNBZ1hTazdYRzVjYmlBZ0lDQjBhR2x6TG5SeWFXZG5aWElvSjNKbGNYVmxjM1FuS1R0Y2JseHVJQ0FnSUhObGRGUnBiV1Z2ZFhRb1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5S0NkemVXNWpKeXdnZEdocGN5azdYRzRnSUNBZ2ZTNWlhVzVrS0hSb2FYTXBMQ0F4TURBd0tUdGNiaUFnZlN4Y2JpQWdkWEpzT2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUNjbk8xeHVJQ0I5WEc1OUtUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JEWVhObFNHbHpkRzl5ZVVOdmJHeGxZM1JwYjI0N1hHNGlYWDA9IiwidmFyIENhc2VNb2RlbDtcbnZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG5cbkNhc2VNb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7fSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FzZU1vZGVsO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WTJGelpYTXZZMkZ6WlY5dGIyUmxiQzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeEpRVUZKTEZOQlFWTXNRMEZCUXp0QlFVTmtMRWxCUVVrc1VVRkJVU3hIUVVGSExFOUJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXpzN1FVRkZia01zVTBGQlV5eEhRVUZITEZGQlFWRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExFVkJRVVVzUTBGQlF5eERRVUZET3p0QlFVVjBReXhOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEZOQlFWTXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkluWmhjaUJEWVhObFRXOWtaV3c3WEc1MllYSWdRbUZqYTJKdmJtVWdQU0J5WlhGMWFYSmxLQ2RpWVdOclltOXVaU2NwTzF4dVhHNURZWE5sVFc5a1pXd2dQU0JDWVdOclltOXVaUzVOYjJSbGJDNWxlSFJsYm1Rb2UzMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUVOaGMyVk5iMlJsYkR0Y2JpSmRmUT09IiwidmFyIERpc3BhdGNoZXIgPSByZXF1aXJlKCdmbHV4JykuRGlzcGF0Y2hlcjtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGlzcGF0Y2hlcigpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WTJGelpYTXZaR2x6Y0dGMFkyaGxjaTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeEpRVUZKTEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU1zVlVGQlZTeERRVUZET3p0QlFVVTFReXhOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEVsQlFVa3NWVUZCVlN4RlFVRkZMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SjJZWElnUkdsemNHRjBZMmhsY2lBOUlISmxjWFZwY21Vb0oyWnNkWGduS1M1RWFYTndZWFJqYUdWeU8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRzVsZHlCRWFYTndZWFJqYUdWeUtDazdYRzRpWFgwPSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgRHJvcGRvd247XG52YXIgRHJvcGRvd25DaG9pY2U7XG52YXIgb2Zmc2NyZWVuX2hhbmRsZXJzO1xudmFyICQgICAgICAgICAgID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgUmVhY3QgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEJ1dHRvbiAgICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9idXR0b24uanN4Jyk7XG52YXIgJHdpbmRvdyAgICAgPSAkKHdpbmRvdyk7XG5cbm9mZnNjcmVlbl9oYW5kbGVycyA9IHtcbiAgbGVmdDogZnVuY3Rpb24gKCRlbCwgbmV3U3RhdGUpIHtcbiAgICBpZiAoJGVsLmlzKCc6b2Zmc2NyZWVuLXJpZ2h0JykpIHtcbiAgICAgIG5ld1N0YXRlLmFsaWduID0gJ3JpZ2h0JztcbiAgICB9XG4gIH0sXG4gIHJpZ2h0OiBmdW5jdGlvbiAoJGVsLCBuZXdTdGF0ZSkge1xuICAgIGlmICgkZWwuaXMoJzpvZmZzY3JlZW4tbGVmdCcpKSB7XG4gICAgICBuZXdTdGF0ZS5hbGlnbiA9ICdsZWZ0JztcbiAgICB9XG4gIH1cbn07XG5cbkRyb3Bkb3duQ2hvaWNlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkRyb3Bkb3duQ2hvaWNlXCIsXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBidXR0b25Qcm9wcyA9IHtcbiAgICAgIHRleHQ6ICAgICAgIHRoaXMucHJvcHMudGV4dCxcbiAgICAgIG9uQ2xpY2s6ICAgIHRoaXMuX2NsaWNrSGFuZGxlcixcbiAgICAgIGNsYXNzTmFtZTogIHRoaXMucHJvcHMudGhlbWVcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7Y2xhc3NOYW1lOiBcImNob2ljZVwifSwgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIFJlYWN0Ll9fc3ByZWFkKHt9LCAgYnV0dG9uUHJvcHMpKSlcbiAgICApO1xuICB9LFxuICBfY2xpY2tIYW5kbGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMub25DaG9pY2UpIHtcbiAgICAgIHRoaXMucHJvcHMub25DaG9pY2UodGhpcy5wcm9wcy52YWx1ZSk7XG4gICAgfVxuICB9XG59KTtcblxuRHJvcGRvd24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiRHJvcGRvd25cIixcbiAgcHJvcFR5cGVzOiB7XG4gICAgc2VsZWN0ZWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBjaG9pY2VzOiAgUmVhY3QuUHJvcFR5cGVzLmFycmF5XG4gIH0sXG4gIG1peGluczogW1JlYWN0LmFkZG9ucy5QdXJlUmVuZGVyTWl4aW5dLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3BlbjogICAhISB0aGlzLnByb3BzLm9wZW4sXG4gICAgICBhbGlnbjogIHRoaXMucHJvcHMuYWxpZ24gfHwgJ2xlZnQnXG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gKG5leHRQcm9wcykge1xuICAgIGlmIChuZXh0UHJvcHMuYWxpZ24pIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2FsaWduOiBuZXh0UHJvcHMuYWxpZ259KTtcbiAgICB9XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fZW5zdXJlRHJvcGRvd25WaXNpYmlsaXR5KCk7XG4gIH0sXG4gIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX2Vuc3VyZURyb3Bkb3duVmlzaWJpbGl0eSgpO1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2hvaWNlczogW11cbiAgICB9O1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2hvaWNlcyA9IHRoaXMuc3RhdGUub3BlbiAmJiB0aGlzLl9idWlsZENob2ljZXMoKTtcbiAgICB2YXIgY2xhc3NlcyA9IFsnZHJvcGRvd24nLCAnYWxpZ24tJyArIHRoaXMuc3RhdGUuYWxpZ25dO1xuICAgIHZhciBidXR0b25Qcm9wcztcblxuICAgIGJ1dHRvblByb3BzID0ge1xuICAgICAgdGV4dDogICAgICAgdGhpcy5wcm9wcy5zZWxlY3RlZCxcbiAgICAgIGFmdGVySWNvbjogICdjYXJldC1kb3duJyxcbiAgICAgIG9uQ2xpY2s6ICAgIHRoaXMuX3RvZ2dsZU9wZW5cbiAgICB9O1xuXG4gICAgdGhpcy5wcm9wcy5jbGFzc05hbWUgJiYgY2xhc3Nlcy5wdXNoKHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcblxuICAgIGlmICh0aGlzLnByb3BzLnRoZW1lKSB7XG4gICAgICBjbGFzc2VzLnB1c2godGhpcy5wcm9wcy50aGVtZSk7XG4gICAgICBidXR0b25Qcm9wcy5jbGFzc05hbWUgPSB0aGlzLnByb3BzLnRoZW1lO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IGNsYXNzZXMuam9pbignICcpLCBvbk1vdXNlTGVhdmU6IHRoaXMuX2hhbmRsZUxlYXZlfSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzZWxlY3RlZFwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIFJlYWN0Ll9fc3ByZWFkKHt9LCAgYnV0dG9uUHJvcHMpKVxuICAgICAgICApLCBcbiAgICAgICAgY2hvaWNlc1xuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIF9oYW5kbGVMZWF2ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe29wZW46IGZhbHNlfSk7XG4gIH0sXG4gIF90b2dnbGVPcGVuOiBmdW5jdGlvbiAoZSkge1xuICAgIGlmICh0aGlzLnByb3BzLm9uQ2xpY2spIHtcbiAgICAgIHRoaXMucHJvcHMub25DbGljayhlKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG9wZW46ICEgdGhpcy5zdGF0ZS5vcGVuXG4gICAgfSk7XG4gIH0sXG4gIF9idWlsZENob2ljZXM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2hvaWNlcyA9IFtdO1xuXG4gICAgY2hvaWNlcyA9IHRoaXMucHJvcHMuY2hvaWNlcy5tYXAoZnVuY3Rpb24gKGNob2ljZSwgaW5kZXgpIHtcbiAgICAgIGlmIChjaG9pY2Uuc2VwYXJhdG9yKSB7XG4gICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtjbGFzc05hbWU6IFwic2VwYXJhdG9yXCIsIGtleTogaW5kZXh9KSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBwcm9wcyA9IHtcbiAgICAgICAga2V5OiAgICAgIGluZGV4LFxuICAgICAgICB0ZXh0OiAgICAgY2hvaWNlLnRleHQsXG4gICAgICAgIG9uQ2hvaWNlOiB0aGlzLl9oYW5kbGVDaG9pY2UsXG4gICAgICAgIHRoZW1lOiAgICB0aGlzLnByb3BzLnRoZW1lLFxuICAgICAgICB2YWx1ZTogICAgY2hvaWNlLnZhbHVlXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERyb3Bkb3duQ2hvaWNlLCBSZWFjdC5fX3NwcmVhZCh7fSwgIHByb3BzKSlcbiAgICAgICk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCB7cmVmOiBcImRyb3Bkb3duXCJ9LCBjaG9pY2VzKSk7XG4gIH0sXG4gIF9oYW5kbGVDaG9pY2U6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh0aGlzLnByb3BzLm9uQ2hvaWNlKSB7XG4gICAgICB0aGlzLnByb3BzLm9uQ2hvaWNlKHZhbHVlKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtvcGVuOiBmYWxzZX0pO1xuICB9LFxuICBfZW5zdXJlRHJvcGRvd25WaXNpYmlsaXR5OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCEgdGhpcy5zdGF0ZS5vcGVuKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgZHJvcGRvd24gID0gdGhpcy5yZWZzLmRyb3Bkb3duO1xuICAgIHZhciAkZWwgICAgICAgPSAkKGRyb3Bkb3duLmdldERPTU5vZGUoKSk7XG4gICAgdmFyIG5ld1N0YXRlICA9IHt9O1xuICAgIHZhciBoYW5kbGVyICAgPSBvZmZzY3JlZW5faGFuZGxlcnNbdGhpcy5zdGF0ZS5hbGlnbl07XG5cbiAgICBoYW5kbGVyICYmIGhhbmRsZXIoJGVsLCBuZXdTdGF0ZSk7XG5cbiAgICB0aGlzLnNldFN0YXRlKG5ld1N0YXRlKTtcbiAgfSxcbiAgX2V4aXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtvcGVuOiBmYWxzZX0pO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBEcm9wZG93bjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdlkyRnpaWE12WkhKdmNHUnZkMjR1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPenRCUVVWQkxFZEJRVWM3TzBGQlJVZ3NTVUZCU1N4UlFVRlJMRU5CUVVNN1FVRkRZaXhKUVVGSkxHTkJRV01zUTBGQlF6dEJRVU51UWl4SlFVRkpMR3RDUVVGclFpeERRVUZETzBGQlEzWkNMRWxCUVVrc1EwRkJReXhoUVVGaExFOUJRVThzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0QlFVTndReXhKUVVGSkxFdEJRVXNzVTBGQlV5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1FVRkRia01zU1VGQlNTeE5RVUZOTEZGQlFWRXNUMEZCVHl4RFFVRkRMRFpDUVVFMlFpeERRVUZETEVOQlFVTTdRVUZEZWtRc1NVRkJTU3hQUVVGUExFOUJRVThzUTBGQlF5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPenRCUVVVMVFpeHJRa0ZCYTBJc1IwRkJSenRGUVVOdVFpeEpRVUZKTEVWQlFVVXNWVUZCVlN4SFFVRkhMRVZCUVVVc1VVRkJVU3hGUVVGRk8wbEJRemRDTEVsQlFVa3NSMEZCUnl4RFFVRkRMRVZCUVVVc1EwRkJReXhyUWtGQmEwSXNRMEZCUXl4RlFVRkZPMDFCUXpsQ0xGRkJRVkVzUTBGQlF5eExRVUZMTEVkQlFVY3NUMEZCVHl4RFFVRkRPMHRCUXpGQ08wZEJRMFk3UlVGRFJDeExRVUZMTEVWQlFVVXNWVUZCVlN4SFFVRkhMRVZCUVVVc1VVRkJVU3hGUVVGRk8wbEJRemxDTEVsQlFVa3NSMEZCUnl4RFFVRkRMRVZCUVVVc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4RlFVRkZPMDFCUXpkQ0xGRkJRVkVzUTBGQlF5eExRVUZMTEVkQlFVY3NUVUZCVFN4RFFVRkRPMHRCUTNwQ08wZEJRMFk3UVVGRFNDeERRVUZETEVOQlFVTTdPMEZCUlVZc2IwTkJRVzlETERoQ1FVRkJPMFZCUTJ4RExFMUJRVTBzUlVGQlJTeFpRVUZaTzBsQlEyeENMRWxCUVVrc1YwRkJWeXhIUVVGSE8wMUJRMmhDTEVsQlFVa3NVVUZCVVN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWs3VFVGRE0wSXNUMEZCVHl4TFFVRkxMRWxCUVVrc1EwRkJReXhoUVVGaE8wMUJRemxDTEZOQlFWTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXM3UVVGRGJFTXNTMEZCU3l4RFFVRkRPenRKUVVWR08wMUJRMFVzYjBKQlFVRXNTVUZCUnl4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eFJRVUZUTEVOQlFVRXNSVUZCUVN4dlFrRkJReXhOUVVGTkxFVkJRVUVzWjBKQlFVRXNSMEZCUVN4RFFVRkZMRWRCUVVjc1YwRkJXU3hEUVVGQkxFTkJRVWNzUTBGQlN5eERRVUZCTzAxQlEzWkVPMGRCUTBnN1JVRkRSQ3hoUVVGaExFVkJRVVVzV1VGQldUdEpRVU42UWl4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVVVGQlVTeEZRVUZGTzAxQlEzWkNMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03UzBGRGRrTTdSMEZEUmp0QlFVTklMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZJTERoQ1FVRTRRaXgzUWtGQlFUdEZRVU0xUWl4VFFVRlRMRVZCUVVVN1NVRkRWQ3hSUVVGUkxFVkJRVVVzUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1ZVRkJWVHRKUVVNelF5eFBRVUZQTEVkQlFVY3NTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhMUVVGTE8wZEJRMmhETzBWQlEwUXNUVUZCVFN4RlFVRkZMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF5eGxRVUZsTEVOQlFVTTdSVUZEZEVNc1pVRkJaU3hGUVVGRkxGbEJRVms3U1VGRE0wSXNUMEZCVHp0TlFVTk1MRWxCUVVrc1NVRkJTU3hEUVVGRExFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpPMDFCUXpGQ0xFdEJRVXNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1NVRkJTU3hOUVVGTk8wdEJRMjVETEVOQlFVTTdSMEZEU0R0RlFVTkVMSGxDUVVGNVFpeEZRVUZGTEZWQlFWVXNVMEZCVXl4RlFVRkZPMGxCUXpsRExFbEJRVWtzVTBGQlV5eERRVUZETEV0QlFVc3NSVUZCUlR0TlFVTnVRaXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNTMEZCU3l4RlFVRkZMRk5CUVZNc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETzB0QlEzcERPMGRCUTBZN1JVRkRSQ3hwUWtGQmFVSXNSVUZCUlN4WlFVRlpPMGxCUXpkQ0xFbEJRVWtzUTBGQlF5eDVRa0ZCZVVJc1JVRkJSU3hEUVVGRE8wZEJRMnhETzBWQlEwUXNhMEpCUVd0Q0xFVkJRVVVzV1VGQldUdEpRVU01UWl4SlFVRkpMRU5CUVVNc2VVSkJRWGxDTEVWQlFVVXNRMEZCUXp0SFFVTnNRenRGUVVORUxHVkJRV1VzUlVGQlJTeFpRVUZaTzBsQlF6TkNMRTlCUVU4N1RVRkRUQ3hQUVVGUExFVkJRVVVzUlVGQlJUdExRVU5hTEVOQlFVTTdSMEZEU0R0RlFVTkVMRTFCUVUwc1JVRkJSU3haUVVGWk8wbEJRMnhDTEVsQlFVa3NUMEZCVHl4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeEpRVUZKTEVsQlFVa3NRMEZCUXl4aFFVRmhMRVZCUVVVc1EwRkJRenRKUVVOMFJDeEpRVUZKTEU5QlFVOHNSMEZCUnl4RFFVRkRMRlZCUVZVc1JVRkJSU3hSUVVGUkxFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRCUVVNMVJDeEpRVUZKTEVsQlFVa3NWMEZCVnl4RFFVRkRPenRKUVVWb1FpeFhRVUZYTEVkQlFVYzdUVUZEV2l4SlFVRkpMRkZCUVZFc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFJRVUZSTzAxQlF5OUNMRk5CUVZNc1IwRkJSeXhaUVVGWk8wMUJRM2hDTEU5QlFVOHNTMEZCU3l4SlFVRkpMRU5CUVVNc1YwRkJWenRCUVVOc1F5eExRVUZMTEVOQlFVTTdPMEZCUlU0c1NVRkJTU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWTXNTVUZCU1N4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN08wbEJSVE5FTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFVkJRVVU3VFVGRGNFSXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMDFCUXk5Q0xGZEJRVmNzUTBGQlF5eFRRVUZUTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU03UVVGREwwTXNTMEZCU3pzN1NVRkZSRHROUVVORkxHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVVVzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJReXhEUVVGRExGbEJRVUVzUlVGQldTeERRVUZGTEVsQlFVa3NRMEZCUXl4WlFVRmpMRU5CUVVFc1JVRkJRVHRSUVVOc1JTeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEZWQlFWY3NRMEZCUVN4RlFVRkJPMVZCUTNoQ0xHOUNRVUZETEUxQlFVMHNSVUZCUVN4blFrRkJRU3hIUVVGQkxFTkJRVVVzUjBGQlJ5eFhRVUZaTEVOQlFVRXNRMEZCUnl4RFFVRkJPMUZCUTNaQ0xFTkJRVUVzUlVGQlFUdFJRVU5NTEU5QlFWRTdUVUZEVEN4RFFVRkJPMDFCUTA0N1IwRkRTRHRGUVVORUxGbEJRVmtzUlVGQlJTeFpRVUZaTzBsQlEzaENMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF5eEpRVUZKTEVWQlFVVXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJRenRIUVVNNVFqdEZRVU5FTEZkQlFWY3NSVUZCUlN4VlFVRlZMRU5CUVVNc1JVRkJSVHRKUVVONFFpeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhGUVVGRk8wMUJRM1JDTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlF6VkNMRXRCUVVzN08wbEJSVVFzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXp0TlFVTmFMRWxCUVVrc1JVRkJSU3hGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1R0TFFVTjRRaXhEUVVGRExFTkJRVU03UjBGRFNqdEZRVU5FTEdGQlFXRXNSVUZCUlN4WlFVRlpPMEZCUXpkQ0xFbEJRVWtzU1VGQlNTeFBRVUZQTEVkQlFVY3NSVUZCUlN4RFFVRkRPenRKUVVWcVFpeFBRVUZQTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFWVXNUVUZCVFN4RlFVRkZMRXRCUVVzc1JVRkJSVHROUVVONFJDeEpRVUZKTEUxQlFVMHNRMEZCUXl4VFFVRlRMRVZCUVVVN1VVRkRjRUlzVVVGQlVTeHZRa0ZCUVN4SlFVRkhMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEZkQlFVRXNSVUZCVnl4RFFVRkRMRWRCUVVFc1JVRkJSeXhEUVVGRkxFdEJRVTBzUTBGQlFTeERRVUZITEVOQlFVRXNSVUZCUlR0QlFVTXhSQ3hQUVVGUE96dE5RVVZFTEVsQlFVa3NTMEZCU3l4SFFVRkhPMUZCUTFZc1IwRkJSeXhQUVVGUExFdEJRVXM3VVVGRFppeEpRVUZKTEUxQlFVMHNUVUZCVFN4RFFVRkRMRWxCUVVrN1VVRkRja0lzVVVGQlVTeEZRVUZGTEVsQlFVa3NRMEZCUXl4aFFVRmhPMUZCUXpWQ0xFdEJRVXNzUzBGQlN5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzN1VVRkRNVUlzUzBGQlN5eExRVUZMTEUxQlFVMHNRMEZCUXl4TFFVRkxPMEZCUXpsQ0xFOUJRVThzUTBGQlF6czdUVUZGUmp0UlFVTkZMRzlDUVVGRExHTkJRV01zUlVGQlFTeG5Ra0ZCUVN4SFFVRkJMRU5CUVVVc1IwRkJSeXhMUVVGTkxFTkJRVUVzUTBGQlJ5eERRVUZCTzFGQlF6ZENPMEZCUTFJc1MwRkJTeXhGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZET3p0SlFVVlVMRkZCUVZFc2IwSkJRVUVzU1VGQlJ5eEZRVUZCTEVOQlFVRXNRMEZCUXl4SFFVRkJMRVZCUVVjc1EwRkJReXhWUVVGWExFTkJRVUVzUlVGQlF5eFBRVUZoTEVOQlFVRXNSVUZCUlR0SFFVTTFRenRGUVVORUxHRkJRV0VzUlVGQlJTeFZRVUZWTEV0QlFVc3NSVUZCUlR0SlFVTTVRaXhKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVVUZCVVN4RlFVRkZPMDFCUTNaQ0xFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVVUZCVVN4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE8wRkJRMnBETEV0QlFVczdPMGxCUlVRc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEVsQlFVa3NSVUZCUlN4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRE8wZEJRemxDTzBWQlEwUXNlVUpCUVhsQ0xFVkJRVVVzV1VGQldUdEpRVU55UXl4SlFVRkpMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVWQlFVVTdUVUZEY2tJc1QwRkJUeXhKUVVGSkxFTkJRVU03UVVGRGJFSXNTMEZCU3pzN1NVRkZSQ3hKUVVGSkxGRkJRVkVzU1VGQlNTeEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJRenRKUVVOdVF5eEpRVUZKTEVkQlFVY3NVMEZCVXl4RFFVRkRMRU5CUVVNc1VVRkJVU3hEUVVGRExGVkJRVlVzUlVGQlJTeERRVUZETEVOQlFVTTdTVUZEZWtNc1NVRkJTU3hSUVVGUkxFbEJRVWtzUlVGQlJTeERRVUZETzBGQlEzWkNMRWxCUVVrc1NVRkJTU3hQUVVGUExFdEJRVXNzYTBKQlFXdENMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXpzN1FVRkZla1FzU1VGQlNTeFBRVUZQTEVsQlFVa3NUMEZCVHl4RFFVRkRMRWRCUVVjc1JVRkJSU3hSUVVGUkxFTkJRVU1zUTBGQlF6czdTVUZGYkVNc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0SFFVTjZRanRGUVVORUxFdEJRVXNzUlVGQlJTeFpRVUZaTzBsQlEycENMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF5eEpRVUZKTEVWQlFVVXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJRenRIUVVNNVFqdEJRVU5JTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NVVUZCVVN4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlvcVhHNGdLaUJBYW5ONElGSmxZV04wTGtSUFRWeHVJQ292WEc1Y2JuWmhjaUJFY205d1pHOTNianRjYm5aaGNpQkVjbTl3Wkc5M2JrTm9iMmxqWlR0Y2JuWmhjaUJ2Wm1aelkzSmxaVzVmYUdGdVpHeGxjbk03WEc1MllYSWdKQ0FnSUNBZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkcWNYVmxjbmtuS1R0Y2JuWmhjaUJTWldGamRDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0ozSmxZV04wSnlrN1hHNTJZWElnUW5WMGRHOXVJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDY3VMaTh1TGk5amIyMXdiMjVsYm5SekwySjFkSFJ2Ymk1cWMzZ25LVHRjYm5aaGNpQWtkMmx1Wkc5M0lDQWdJQ0E5SUNRb2QybHVaRzkzS1R0Y2JseHViMlptYzJOeVpXVnVYMmhoYm1Sc1pYSnpJRDBnZTF4dUlDQnNaV1owT2lCbWRXNWpkR2x2YmlBb0pHVnNMQ0J1WlhkVGRHRjBaU2tnZTF4dUlDQWdJR2xtSUNna1pXd3VhWE1vSnpwdlptWnpZM0psWlc0dGNtbG5hSFFuS1NrZ2UxeHVJQ0FnSUNBZ2JtVjNVM1JoZEdVdVlXeHBaMjRnUFNBbmNtbG5hSFFuTzF4dUlDQWdJSDFjYmlBZ2ZTeGNiaUFnY21sbmFIUTZJR1oxYm1OMGFXOXVJQ2drWld3c0lHNWxkMU4wWVhSbEtTQjdYRzRnSUNBZ2FXWWdLQ1JsYkM1cGN5Z25PbTltWm5OamNtVmxiaTFzWldaMEp5a3BJSHRjYmlBZ0lDQWdJRzVsZDFOMFlYUmxMbUZzYVdkdUlEMGdKMnhsWm5Rbk8xeHVJQ0FnSUgxY2JpQWdmVnh1ZlR0Y2JseHVSSEp2Y0dSdmQyNURhRzlwWTJVZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQmlkWFIwYjI1UWNtOXdjeUE5SUh0Y2JpQWdJQ0FnSUhSbGVIUTZJQ0FnSUNBZ0lIUm9hWE11Y0hKdmNITXVkR1Y0ZEN4Y2JpQWdJQ0FnSUc5dVEyeHBZMnM2SUNBZ0lIUm9hWE11WDJOc2FXTnJTR0Z1Wkd4bGNpeGNiaUFnSUNBZ0lHTnNZWE56VG1GdFpUb2dJSFJvYVhNdWNISnZjSE11ZEdobGJXVmNiaUFnSUNCOU8xeHVYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4c2FTQmpiR0Z6YzA1aGJXVTlYQ0pqYUc5cFkyVmNJajQ4UW5WMGRHOXVJSHN1TGk1aWRYUjBiMjVRY205d2MzMGdMejQ4TDJ4cFBseHVJQ0FnSUNrN1hHNGdJSDBzWEc0Z0lGOWpiR2xqYTBoaGJtUnNaWEk2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCcFppQW9kR2hwY3k1d2NtOXdjeTV2YmtOb2IybGpaU2tnZTF4dUlDQWdJQ0FnZEdocGN5NXdjbTl3Y3k1dmJrTm9iMmxqWlNoMGFHbHpMbkJ5YjNCekxuWmhiSFZsS1R0Y2JpQWdJQ0I5WEc0Z0lIMWNibjBwTzF4dVhHNUVjbTl3Wkc5M2JpQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ2NISnZjRlI1Y0dWek9pQjdYRzRnSUNBZ2MyVnNaV04wWldRNklGSmxZV04wTGxCeWIzQlVlWEJsY3k1emRISnBibWN1YVhOU1pYRjFhWEpsWkN4Y2JpQWdJQ0JqYUc5cFkyVnpPaUFnVW1WaFkzUXVVSEp2Y0ZSNWNHVnpMbUZ5Y21GNVhHNGdJSDBzWEc0Z0lHMXBlR2x1Y3pvZ1cxSmxZV04wTG1Ga1pHOXVjeTVRZFhKbFVtVnVaR1Z5VFdsNGFXNWRMRnh1SUNCblpYUkpibWwwYVdGc1UzUmhkR1U2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCeVpYUjFjbTRnZTF4dUlDQWdJQ0FnYjNCbGJqb2dJQ0FoSVNCMGFHbHpMbkJ5YjNCekxtOXdaVzRzWEc0Z0lDQWdJQ0JoYkdsbmJqb2dJSFJvYVhNdWNISnZjSE11WVd4cFoyNGdmSHdnSjJ4bFpuUW5YRzRnSUNBZ2ZUdGNiaUFnZlN4Y2JpQWdZMjl0Y0c5dVpXNTBWMmxzYkZKbFkyVnBkbVZRY205d2N6b2dablZ1WTNScGIyNGdLRzVsZUhSUWNtOXdjeWtnZTF4dUlDQWdJR2xtSUNodVpYaDBVSEp2Y0hNdVlXeHBaMjRwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVjMlYwVTNSaGRHVW9lMkZzYVdkdU9pQnVaWGgwVUhKdmNITXVZV3hwWjI1OUtUdGNiaUFnSUNCOVhHNGdJSDBzWEc0Z0lHTnZiWEJ2Ym1WdWRFUnBaRTF2ZFc1ME9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkR2hwY3k1ZlpXNXpkWEpsUkhKdmNHUnZkMjVXYVhOcFltbHNhWFI1S0NrN1hHNGdJSDBzWEc0Z0lHTnZiWEJ2Ym1WdWRFUnBaRlZ3WkdGMFpUb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFJvYVhNdVgyVnVjM1Z5WlVSeWIzQmtiM2R1Vm1semFXSnBiR2wwZVNncE8xeHVJQ0I5TEZ4dUlDQm5aWFJFWldaaGRXeDBVSEp2Y0hNNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2UxeHVJQ0FnSUNBZ1kyaHZhV05sY3pvZ1cxMWNiaUFnSUNCOU8xeHVJQ0I5TEZ4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnWTJodmFXTmxjeUE5SUhSb2FYTXVjM1JoZEdVdWIzQmxiaUFtSmlCMGFHbHpMbDlpZFdsc1pFTm9iMmxqWlhNb0tUdGNiaUFnSUNCMllYSWdZMnhoYzNObGN5QTlJRnNuWkhKdmNHUnZkMjRuTENBbllXeHBaMjR0SnlBcklIUm9hWE11YzNSaGRHVXVZV3hwWjI1ZE8xeHVJQ0FnSUhaaGNpQmlkWFIwYjI1UWNtOXdjenRjYmx4dUlDQWdJR0oxZEhSdmJsQnliM0J6SUQwZ2UxeHVJQ0FnSUNBZ2RHVjRkRG9nSUNBZ0lDQWdkR2hwY3k1d2NtOXdjeTV6Wld4bFkzUmxaQ3hjYmlBZ0lDQWdJR0ZtZEdWeVNXTnZiam9nSUNkallYSmxkQzFrYjNkdUp5eGNiaUFnSUNBZ0lHOXVRMnhwWTJzNklDQWdJSFJvYVhNdVgzUnZaMmRzWlU5d1pXNWNiaUFnSUNCOU8xeHVYRzRnSUNBZ2RHaHBjeTV3Y205d2N5NWpiR0Z6YzA1aGJXVWdKaVlnWTJ4aGMzTmxjeTV3ZFhOb0tIUm9hWE11Y0hKdmNITXVZMnhoYzNOT1lXMWxLVHRjYmx4dUlDQWdJR2xtSUNoMGFHbHpMbkJ5YjNCekxuUm9aVzFsS1NCN1hHNGdJQ0FnSUNCamJHRnpjMlZ6TG5CMWMyZ29kR2hwY3k1d2NtOXdjeTUwYUdWdFpTazdYRzRnSUNBZ0lDQmlkWFIwYjI1UWNtOXdjeTVqYkdGemMwNWhiV1VnUFNCMGFHbHpMbkJ5YjNCekxuUm9aVzFsTzF4dUlDQWdJSDFjYmx4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxN1kyeGhjM05sY3k1cWIybHVLQ2NnSnlsOUlHOXVUVzkxYzJWTVpXRjJaVDE3ZEdocGN5NWZhR0Z1Wkd4bFRHVmhkbVY5UGx4dUlDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW5ObGJHVmpkR1ZrWENJK1hHNGdJQ0FnSUNBZ0lDQWdQRUoxZEhSdmJpQjdMaTR1WW5WMGRHOXVVSEp2Y0hOOUlDOCtYRzRnSUNBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNBZ0lDQjdZMmh2YVdObGMzMWNiaUFnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ2s3WEc0Z0lIMHNYRzRnSUY5b1lXNWtiR1ZNWldGMlpUb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFJvYVhNdWMyVjBVM1JoZEdVb2UyOXdaVzQ2SUdaaGJITmxmU2s3WEc0Z0lIMHNYRzRnSUY5MGIyZG5iR1ZQY0dWdU9pQm1kVzVqZEdsdmJpQW9aU2tnZTF4dUlDQWdJR2xtSUNoMGFHbHpMbkJ5YjNCekxtOXVRMnhwWTJzcElIdGNiaUFnSUNBZ0lIUm9hWE11Y0hKdmNITXViMjVEYkdsamF5aGxLVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0Y2JpQWdJQ0FnSUc5d1pXNDZJQ0VnZEdocGN5NXpkR0YwWlM1dmNHVnVYRzRnSUNBZ2ZTazdYRzRnSUgwc1hHNGdJRjlpZFdsc1pFTm9iMmxqWlhNNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnWTJodmFXTmxjeUE5SUZ0ZE8xeHVYRzRnSUNBZ1kyaHZhV05sY3lBOUlIUm9hWE11Y0hKdmNITXVZMmh2YVdObGN5NXRZWEFvWm5WdVkzUnBiMjRnS0dOb2IybGpaU3dnYVc1a1pYZ3BJSHRjYmlBZ0lDQWdJR2xtSUNoamFHOXBZMlV1YzJWd1lYSmhkRzl5S1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlBb1BHeHBJR05zWVhOelRtRnRaVDFjSW5ObGNHRnlZWFJ2Y2x3aUlHdGxlVDE3YVc1a1pYaDlJQzgrS1R0Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RtRnlJSEJ5YjNCeklEMGdlMXh1SUNBZ0lDQWdJQ0JyWlhrNklDQWdJQ0FnYVc1a1pYZ3NYRzRnSUNBZ0lDQWdJSFJsZUhRNklDQWdJQ0JqYUc5cFkyVXVkR1Y0ZEN4Y2JpQWdJQ0FnSUNBZ2IyNURhRzlwWTJVNklIUm9hWE11WDJoaGJtUnNaVU5vYjJsalpTeGNiaUFnSUNBZ0lDQWdkR2hsYldVNklDQWdJSFJvYVhNdWNISnZjSE11ZEdobGJXVXNYRzRnSUNBZ0lDQWdJSFpoYkhWbE9pQWdJQ0JqYUc5cFkyVXVkbUZzZFdWY2JpQWdJQ0FnSUgwN1hHNWNiaUFnSUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBZ0lEeEVjbTl3Wkc5M2JrTm9iMmxqWlNCN0xpNHVjSEp2Y0hOOUlDOCtYRzRnSUNBZ0lDQXBPMXh1SUNBZ0lIMHNJSFJvYVhNcE8xeHVYRzRnSUNBZ2NtVjBkWEp1SUNnOGRXd2djbVZtUFZ3aVpISnZjR1J2ZDI1Y0lqNTdZMmh2YVdObGMzMDhMM1ZzUGlrN1hHNGdJSDBzWEc0Z0lGOW9ZVzVrYkdWRGFHOXBZMlU2SUdaMWJtTjBhVzl1SUNoMllXeDFaU2tnZTF4dUlDQWdJR2xtSUNoMGFHbHpMbkJ5YjNCekxtOXVRMmh2YVdObEtTQjdYRzRnSUNBZ0lDQjBhR2x6TG5CeWIzQnpMbTl1UTJodmFXTmxLSFpoYkhWbEtUdGNiaUFnSUNCOVhHNWNiaUFnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHR2Y0dWdU9pQm1ZV3h6WlgwcE8xeHVJQ0I5TEZ4dUlDQmZaVzV6ZFhKbFJISnZjR1J2ZDI1V2FYTnBZbWxzYVhSNU9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdhV1lnS0NFZ2RHaHBjeTV6ZEdGMFpTNXZjR1Z1S1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYm5Wc2JEdGNiaUFnSUNCOVhHNWNiaUFnSUNCMllYSWdaSEp2Y0dSdmQyNGdJRDBnZEdocGN5NXlaV1p6TG1SeWIzQmtiM2R1TzF4dUlDQWdJSFpoY2lBa1pXd2dJQ0FnSUNBZ1BTQWtLR1J5YjNCa2IzZHVMbWRsZEVSUFRVNXZaR1VvS1NrN1hHNGdJQ0FnZG1GeUlHNWxkMU4wWVhSbElDQTlJSHQ5TzF4dUlDQWdJSFpoY2lCb1lXNWtiR1Z5SUNBZ1BTQnZabVp6WTNKbFpXNWZhR0Z1Wkd4bGNuTmJkR2hwY3k1emRHRjBaUzVoYkdsbmJsMDdYRzVjYmlBZ0lDQm9ZVzVrYkdWeUlDWW1JR2hoYm1Sc1pYSW9KR1ZzTENCdVpYZFRkR0YwWlNrN1hHNWNiaUFnSUNCMGFHbHpMbk5sZEZOMFlYUmxLRzVsZDFOMFlYUmxLVHRjYmlBZ2ZTeGNiaUFnWDJWNGFYUTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdHZjR1Z1T2lCbVlXeHpaWDBwTzF4dUlDQjlYRzU5S1R0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQkVjbTl3Wkc5M2JqdGNiaUpkZlE9PSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgRmlsdGVyQm94O1xudmFyIFJlYWN0ICAgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEJhY2tib25lICAgICAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyIEF1dG9jb21wbGV0ZSAgPSByZXF1aXJlKCcuL2F1dG9jb21wbGV0ZS5qc3gnKTtcbnZhciBCdXR0b24gICAgICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9idXR0b24uanN4Jyk7XG52YXIgRHJvcGRvd24gICAgICA9IHJlcXVpcmUoJy4vZHJvcGRvd24uanN4Jyk7XG52YXIgQW5kT3IgICAgICAgICA9IHJlcXVpcmUoJy4vYW5kX29yX3NlbGVjdG9yLmpzeCcpO1xudmFyIGNyaXRlcmlhICAgICAgPSByZXF1aXJlKCcuL2ZpbHRlcl9ib3hfZGVmaW5pdGlvbicpO1xuXG5GaWx0ZXJCb3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiRmlsdGVyQm94XCIsXG4gIHByb3BUeXBlczoge1xuICAgIGZpbHRlclR5cGU6IFJlYWN0LlByb3BUeXBlcy5vbmVPZihbQW5kT3IuQU5ELCBBbmRPci5PUl0pLFxuICAgIGxvY2tUeXBlOiAgIFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgIGNyaXRlcmlhOiAgIFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZm9jdXNTZWFyY2goKTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVEb2N1bWVudENsaWNrKTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlRG9jdW1lbnRDbGljayk7XG4gIH0sXG4gIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZm9jdXNTZWFyY2goKTtcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbHRlclR5cGU6IEFuZE9yLkFORCxcbiAgICAgIGxvY2tUeXBlOiAgIGZhbHNlLFxuICAgICAgZWRpdGluZzogICAgZmFsc2VcbiAgICB9XG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBmaWx0ZXJUeXBlOiB0aGlzLnByb3BzLmZpbHRlclR5cGUsXG4gICAgICBlZGl0aW5nOiAgICB0aGlzLnByb3BzLmVkaXRpbmdcbiAgICB9O1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZ3JvdXBzID0gdGhpcy5idWlsZEdyb3VwcygpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJmaWx0ZXItYm94XCIsIG9uQ2xpY2s6IHRoaXMuaGFuZGxlQ2xpY2t9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHtjbGFzc05hbWU6IFwic2VhcmNoLWFjdGlvbiBwdWxsLXJpZ2h0IGZlYXV4LWJ1dHRvblwiLCBpY29uOiBcInNlYXJjaFwiLCBvbkNsaWNrOiB0aGlzLmluaXRpYXRlU2VhcmNofSksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjaGFpbi1ncm91cFwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJjaGFpblwifSwgXG4gICAgICAgICAgICBcIkZpbmQgY2FzZXMgbWF0Y2hpbmdcIlxuICAgICAgICAgICksIFxuXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChBbmRPciwge29uQ2hhbmdlOiB0aGlzLmhhbmRsZUZpbHRlclR5cGVDaGFuZ2UsIHR5cGU6IHRoaXMuc3RhdGUuZmlsdGVyVHlwZX0pXG4gICAgICAgICksIFxuXG4gICAgICAgIGdyb3Vwc1xuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIGhhbmRsZURvY3VtZW50Q2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuZEVkaXRpbmcoKTtcbiAgfSxcbiAgYnVpbGRHcm91cHM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaW5wdXRfcHJvcHM7XG4gICAgdmFyIGdyb3VwcyAgICA9IFtdO1xuICAgIHZhciBnZW5lcmF0b3IgPSB0aGlzLnByb3BzLmNyaXRlcmlhLnRvT3B0aW9ucy5iaW5kKHRoaXMucHJvcHMuY3JpdGVyaWEpO1xuXG4gICAgaW5wdXRfcHJvcHMgPSB7XG4gICAgICB0eXBlOiAgICAgICAgICd0ZXh0JyxcbiAgICAgIGNsYXNzTmFtZTogICAgJ2NoYWluIGlucHV0YWJsZScsXG4gICAgICBwbGFjZWhvbGRlcjogICdzZWFyY2ggY3JpdGVyaWEnLFxuICAgICAgcmVmOiAgICAgICAgICAnc2VhcmNoQ3JpdGVyaWEnLFxuICAgICAgb25DaGFuZ2U6ICAgICB0aGlzLmhhbmRsZVNlYXJjaENyaXRlcmlhXG4gICAgfTtcblxuICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmcpIHtcbiAgICAgIGdyb3Vwcy5wdXNoKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY2hhaW4tZ3JvdXBcIiwga2V5OiBcInNlYXJjaENyaXRlcmlhXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEF1dG9jb21wbGV0ZSwge3JlZjogXCJzZWFyY2hDcml0ZXJpYVwiLCBuYW1lOiBcInNvbWV0aGluZ1wiLCBvblNlbGVjdDogdGhpcy5oYW5kbGVTZWxlY3QsIGdlbmVyYXRvcjogZ2VuZXJhdG9yLCBlZGl0aW5nOiB0cnVlfSlcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZ3JvdXBzO1xuICB9LFxuICBoYW5kbGVTZWxlY3Q6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRoaXMucHJvcHMuY3JpdGVyaWEudXNlKHZhbHVlLnZhbHVlKTtcbiAgICB0aGlzLmVuZEVkaXRpbmcoKTtcbiAgfSxcbiAgaGFuZGxlRmlsdGVyVHlwZUNoYW5nZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKCEgdGhpcy5wcm9wcy5sb2NrVHlwZSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZmlsdGVyVHlwZTogdmFsdWV9KTtcbiAgICB9XG4gIH0sXG4gIGluaXRpYXRlU2VhcmNoOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbmRFZGl0aW5nKCk7XG4gIH0sXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbiAoZSkge1xuICAgIC8vIEluIHRoZSB0ZXN0IGVudiwgd2UgZG8gbm90IGhhdmUgc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uLCBzbyBvdXJcbiAgICAvLyB0ZXN0cyB3aWxsIGJyZWFrIGlmIHdlIGRvbid0IHVzZSBhbiBgaWZgIHN0YXRlbWVudCBoZXJlXG4gICAgaWYgKGUubmF0aXZlRXZlbnQgJiYgZS5uYXRpdmVFdmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24pIHtcbiAgICAgIGUubmF0aXZlRXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB0aGlzLmVuYWJsZUVkaXRpbmcoKTtcbiAgfSxcbiAgZW5hYmxlRWRpdGluZzogZnVuY3Rpb24gKCkge1xuICAgIGlmICghIHRoaXMuc3RhdGUuZWRpdGluZykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZWRpdGluZzogdHJ1ZX0pO1xuICAgIH1cbiAgfSxcbiAgZW5kRWRpdGluZzogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmcpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2VkaXRpbmc6IGZhbHNlfSk7XG4gICAgfVxuICB9LFxuICBmb2N1c1NlYXJjaDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghIHRoaXMuc3RhdGUuZWRpdGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qdmFyIG5vZGUgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuc2VhcmNoQ3JpdGVyaWEpO1xuXG4gICAgbm9kZS5mb2N1cygpOyovXG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbHRlckJveDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdlkyRnpaWE12Wm1sc2RHVnlYMkp2ZUM1cWMzZ2lYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3TzBGQlJVRXNSMEZCUnpzN1FVRkZTQ3hKUVVGSkxGTkJRVk1zUTBGQlF6dEJRVU5rTEVsQlFVa3NTMEZCU3l4WFFVRlhMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU55UXl4SlFVRkpMRkZCUVZFc1VVRkJVU3hQUVVGUExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTTdRVUZEZUVNc1NVRkJTU3haUVVGWkxFbEJRVWtzVDBGQlR5eERRVUZETEc5Q1FVRnZRaXhEUVVGRExFTkJRVU03UVVGRGJFUXNTVUZCU1N4TlFVRk5MRlZCUVZVc1QwRkJUeXhEUVVGRExEWkNRVUUyUWl4RFFVRkRMRU5CUVVNN1FVRkRNMFFzU1VGQlNTeFJRVUZSTEZGQlFWRXNUMEZCVHl4RFFVRkRMR2RDUVVGblFpeERRVUZETEVOQlFVTTdRVUZET1VNc1NVRkJTU3hMUVVGTExGZEJRVmNzVDBGQlR5eERRVUZETEhWQ1FVRjFRaXhEUVVGRExFTkJRVU03UVVGRGNrUXNTVUZCU1N4UlFVRlJMRkZCUVZFc1QwRkJUeXhEUVVGRExIbENRVUY1UWl4RFFVRkRMRU5CUVVNN08wRkJSWFpFTEN0Q1FVRXJRaXg1UWtGQlFUdEZRVU0zUWl4VFFVRlRMRVZCUVVVN1NVRkRWQ3hWUVVGVkxFVkJRVVVzUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eEZRVUZGTEV0QlFVc3NRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJRenRKUVVONFJDeFJRVUZSTEVsQlFVa3NTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhKUVVGSk8wbEJRMmhETEZGQlFWRXNTVUZCU1N4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFMUJRVTBzUTBGQlF5eFZRVUZWTzBkQlF6bERPMFZCUTBRc2FVSkJRV2xDTEVWQlFVVXNXVUZCV1R0QlFVTnFReXhKUVVGSkxFbEJRVWtzUTBGQlF5eFhRVUZYTEVWQlFVVXNRMEZCUXpzN1NVRkZia0lzVVVGQlVTeERRVUZETEdkQ1FVRm5RaXhEUVVGRExFOUJRVThzUlVGQlJTeEpRVUZKTEVOQlFVTXNiVUpCUVcxQ0xFTkJRVU1zUTBGQlF6dEhRVU01UkR0RlFVTkVMRzlDUVVGdlFpeEZRVUZGTEZsQlFWazdTVUZEYUVNc1VVRkJVU3hEUVVGRExHMUNRVUZ0UWl4RFFVRkRMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zYlVKQlFXMUNMRU5CUVVNc1EwRkJRenRIUVVOcVJUdEZRVU5FTEd0Q1FVRnJRaXhGUVVGRkxGbEJRVms3U1VGRE9VSXNTVUZCU1N4RFFVRkRMRmRCUVZjc1JVRkJSU3hEUVVGRE8wZEJRM0JDTzBWQlEwUXNaVUZCWlN4RlFVRkZMRmxCUVZrN1NVRkRNMElzVDBGQlR6dE5RVU5NTEZWQlFWVXNSVUZCUlN4TFFVRkxMRU5CUVVNc1IwRkJSenROUVVOeVFpeFJRVUZSTEVsQlFVa3NTMEZCU3p0TlFVTnFRaXhQUVVGUExFdEJRVXNzUzBGQlN6dExRVU5zUWp0SFFVTkdPMFZCUTBRc1pVRkJaU3hGUVVGRkxGbEJRVms3U1VGRE0wSXNUMEZCVHp0TlFVTk1MRlZCUVZVc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZWQlFWVTdUVUZEYWtNc1QwRkJUeXhMUVVGTExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHp0TFFVTXZRaXhEUVVGRE8wZEJRMGc3UlVGRFJDeE5RVUZOTEVWQlFVVXNXVUZCV1R0QlFVTjBRaXhKUVVGSkxFbEJRVWtzVFVGQlRTeEhRVUZITEVsQlFVa3NRMEZCUXl4WFFVRlhMRVZCUVVVc1EwRkJRenM3U1VGRmFFTTdUVUZEUlN4dlFrRkJRU3hMUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRmxCUVVFc1JVRkJXU3hEUVVGRExFOUJRVUVzUlVGQlR5eERRVUZGTEVsQlFVa3NRMEZCUXl4WFFVRmhMRU5CUVVFc1JVRkJRVHRCUVVNM1JDeFJRVUZSTEc5Q1FVRkRMRTFCUVUwc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNkVU5CUVVFc1JVRkJkVU1zUTBGQlF5eEpRVUZCTEVWQlFVa3NRMEZCUXl4UlFVRkJMRVZCUVZFc1EwRkJReXhQUVVGQkxFVkJRVThzUTBGQlJTeEpRVUZKTEVOQlFVTXNZMEZCWlN4RFFVRkJMRU5CUVVjc1EwRkJRU3hGUVVGQk96dFJRVVY0Unl4dlFrRkJRU3hMUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMR0ZCUVdNc1EwRkJRU3hGUVVGQk8xVkJRek5DTEc5Q1FVRkJMRTFCUVVzc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNUMEZCVVN4RFFVRkJMRVZCUVVFN1FVRkJRU3haUVVGQkxIRkNRVUZCTzBGQlFVRXNRVUZGYkVNc1ZVRkJhVUlzUTBGQlFTeEZRVUZCT3p0VlFVVlFMRzlDUVVGRExFdEJRVXNzUlVGQlFTeERRVUZCTEVOQlFVTXNVVUZCUVN4RlFVRlJMRU5CUVVVc1NVRkJTU3hEUVVGRExITkNRVUZ6UWl4RlFVRkRMRU5CUVVNc1NVRkJRU3hGUVVGSkxFTkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4VlFVRlhMRU5CUVVFc1EwRkJSeXhEUVVGQk8wRkJRM1pHTEZGQlFXTXNRMEZCUVN4RlFVRkJPenRSUVVWTUxFMUJRVTg3VFVGRFNpeERRVUZCTzAxQlEwNDdSMEZEU0R0RlFVTkVMRzFDUVVGdFFpeEZRVUZGTEZsQlFWazdTVUZETDBJc1NVRkJTU3hEUVVGRExGVkJRVlVzUlVGQlJTeERRVUZETzBkQlEyNUNPMFZCUTBRc1YwRkJWeXhGUVVGRkxGbEJRVms3U1VGRGRrSXNTVUZCU1N4WFFVRlhMRU5CUVVNN1NVRkRhRUlzU1VGQlNTeE5RVUZOTEUxQlFVMHNSVUZCUlN4RFFVRkRPMEZCUTNaQ0xFbEJRVWtzU1VGQlNTeFRRVUZUTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGUkxFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZET3p0SlFVVjRSU3hYUVVGWExFZEJRVWM3VFVGRFdpeEpRVUZKTEZWQlFWVXNUVUZCVFR0TlFVTndRaXhUUVVGVExFdEJRVXNzYVVKQlFXbENPMDFCUXk5Q0xGZEJRVmNzUjBGQlJ5eHBRa0ZCYVVJN1RVRkRMMElzUjBGQlJ5eFhRVUZYTEdkQ1FVRm5RanROUVVNNVFpeFJRVUZSTEUxQlFVMHNTVUZCU1N4RFFVRkRMRzlDUVVGdlFqdEJRVU0zUXl4TFFVRkxMRU5CUVVNN08wbEJSVVlzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1JVRkJSVHROUVVOMFFpeE5RVUZOTEVOQlFVTXNTVUZCU1R0UlFVTlVMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc1lVRkJRU3hGUVVGaExFTkJRVU1zUjBGQlFTeEZRVUZITEVOQlFVTXNaMEpCUVdsQ0xFTkJRVUVzUlVGQlFUdFZRVU5vUkN4dlFrRkJReXhaUVVGWkxFVkJRVUVzUTBGQlFTeERRVUZETEVkQlFVRXNSVUZCUnl4RFFVRkRMR2RDUVVGQkxFVkJRV2RDTEVOQlFVTXNTVUZCUVN4RlFVRkpMRU5CUVVNc1YwRkJRU3hGUVVGWExFTkJRVU1zVVVGQlFTeEZRVUZSTEVOQlFVVXNTVUZCU1N4RFFVRkRMRmxCUVZrc1JVRkJReXhEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZGTEZOQlFWTXNSVUZCUXl4RFFVRkRMRTlCUVVFc1JVRkJUeXhEUVVGRkxFbEJRVXNzUTBGQlFTeERRVUZITEVOQlFVRTdVVUZEY0Vnc1EwRkJRVHRQUVVOUUxFTkJRVU03UVVGRFVpeExRVUZMT3p0SlFVVkVMRTlCUVU4c1RVRkJUU3hEUVVGRE8wZEJRMlk3UlVGRFJDeFpRVUZaTEVWQlFVVXNWVUZCVlN4TFFVRkxMRVZCUVVVN1NVRkROMElzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UlFVRlJMRU5CUVVNc1IwRkJSeXhEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0SlFVTnlReXhKUVVGSkxFTkJRVU1zVlVGQlZTeEZRVUZGTEVOQlFVTTdSMEZEYmtJN1JVRkRSQ3h6UWtGQmMwSXNSVUZCUlN4VlFVRlZMRXRCUVVzc1JVRkJSVHRKUVVOMlF5eEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGUkxFVkJRVVU3VFVGRGVrSXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExGVkJRVlVzUlVGQlJTeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRPMHRCUTNCRE8wZEJRMFk3UlVGRFJDeGpRVUZqTEVWQlFVVXNXVUZCV1R0SlFVTXhRaXhKUVVGSkxFTkJRVU1zVlVGQlZTeEZRVUZGTEVOQlFVTTdSMEZEYmtJN1FVRkRTQ3hGUVVGRkxGZEJRVmNzUlVGQlJTeFZRVUZWTEVOQlFVTXNSVUZCUlR0QlFVTTFRanM3U1VGRlNTeEpRVUZKTEVOQlFVTXNRMEZCUXl4WFFVRlhMRWxCUVVrc1EwRkJReXhEUVVGRExGZEJRVmNzUTBGQlF5eDNRa0ZCZDBJc1JVRkJSVHROUVVNelJDeERRVUZETEVOQlFVTXNWMEZCVnl4RFFVRkRMSGRDUVVGM1FpeEZRVUZGTEVOQlFVTTdRVUZETDBNc1MwRkJTenM3U1VGRlJDeERRVUZETEVOQlFVTXNaVUZCWlN4RlFVRkZMRU5CUVVNN1FVRkRlRUlzU1VGQlNTeERRVUZETEVOQlFVTXNZMEZCWXl4RlFVRkZMRU5CUVVNN08wbEJSVzVDTEVsQlFVa3NRMEZCUXl4aFFVRmhMRVZCUVVVc1EwRkJRenRIUVVOMFFqdEZRVU5FTEdGQlFXRXNSVUZCUlN4WlFVRlpPMGxCUTNwQ0xFbEJRVWtzUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1JVRkJSVHROUVVONFFpeEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNc1QwRkJUeXhGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTTdTMEZEYUVNN1IwRkRSanRGUVVORUxGVkJRVlVzUlVGQlJTeFpRVUZaTzBsQlEzUkNMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVWQlFVVTdUVUZEZEVJc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEU5QlFVOHNSVUZCUlN4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRE8wdEJRMnBETzBkQlEwWTdSVUZEUkN4WFFVRlhMRVZCUVVVc1dVRkJXVHRKUVVOMlFpeEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFVkJRVVU3VFVGRGVFSXNUMEZCVHp0QlFVTmlMRXRCUVVzN1FVRkRURHRCUVVOQk8wRkJRMEU3TzBkQlJVYzdRVUZEU0N4RFFVRkRMRU5CUVVNc1EwRkJRenM3UVVGRlNDeE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMRk5CUVZNc1EwRkJReUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4cUtseHVJQ29nUUdwemVDQlNaV0ZqZEM1RVQwMWNiaUFxTDF4dVhHNTJZWElnUm1sc2RHVnlRbTk0TzF4dWRtRnlJRkpsWVdOMElDQWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDZHlaV0ZqZENjcE8xeHVkbUZ5SUVKaFkydGliMjVsSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2RpWVdOclltOXVaU2NwTzF4dWRtRnlJRUYxZEc5amIyMXdiR1YwWlNBZ1BTQnlaWEYxYVhKbEtDY3VMMkYxZEc5amIyMXdiR1YwWlM1cWMzZ25LVHRjYm5aaGNpQkNkWFIwYjI0Z0lDQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpNHZMaTR2WTI5dGNHOXVaVzUwY3k5aWRYUjBiMjR1YW5ONEp5azdYRzUyWVhJZ1JISnZjR1J2ZDI0Z0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dlpISnZjR1J2ZDI0dWFuTjRKeWs3WEc1MllYSWdRVzVrVDNJZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHZZVzVrWDI5eVgzTmxiR1ZqZEc5eUxtcHplQ2NwTzF4dWRtRnlJR055YVhSbGNtbGhJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDY3VMMlpwYkhSbGNsOWliM2hmWkdWbWFXNXBkR2x2YmljcE8xeHVYRzVHYVd4MFpYSkNiM2dnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJSEJ5YjNCVWVYQmxjem9nZTF4dUlDQWdJR1pwYkhSbGNsUjVjR1U2SUZKbFlXTjBMbEJ5YjNCVWVYQmxjeTV2Ym1WUFppaGJRVzVrVDNJdVFVNUVMQ0JCYm1SUGNpNVBVbDBwTEZ4dUlDQWdJR3h2WTJ0VWVYQmxPaUFnSUZKbFlXTjBMbEJ5YjNCVWVYQmxjeTVpYjI5c0xGeHVJQ0FnSUdOeWFYUmxjbWxoT2lBZ0lGSmxZV04wTGxCeWIzQlVlWEJsY3k1dlltcGxZM1F1YVhOU1pYRjFhWEpsWkZ4dUlDQjlMRnh1SUNCamIyMXdiMjVsYm5SRWFXUk5iM1Z1ZERvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIUm9hWE11Wm05amRYTlRaV0Z5WTJnb0tUdGNibHh1SUNBZ0lHUnZZM1Z0Wlc1MExtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0oyTnNhV05ySnl3Z2RHaHBjeTVvWVc1a2JHVkViMk4xYldWdWRFTnNhV05yS1R0Y2JpQWdmU3hjYmlBZ1kyOXRjRzl1Wlc1MFYybHNiRlZ1Ylc5MWJuUTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0JrYjJOMWJXVnVkQzV5WlcxdmRtVkZkbVZ1ZEV4cGMzUmxibVZ5S0NkamJHbGpheWNzSUhSb2FYTXVhR0Z1Wkd4bFJHOWpkVzFsYm5SRGJHbGpheWs3WEc0Z0lIMHNYRzRnSUdOdmJYQnZibVZ1ZEVScFpGVndaR0YwWlRvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIUm9hWE11Wm05amRYTlRaV0Z5WTJnb0tUdGNiaUFnZlN4Y2JpQWdaMlYwUkdWbVlYVnNkRkJ5YjNCek9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIdGNiaUFnSUNBZ0lHWnBiSFJsY2xSNWNHVTZJRUZ1WkU5eUxrRk9SQ3hjYmlBZ0lDQWdJR3h2WTJ0VWVYQmxPaUFnSUdaaGJITmxMRnh1SUNBZ0lDQWdaV1JwZEdsdVp6b2dJQ0FnWm1Gc2MyVmNiaUFnSUNCOVhHNGdJSDBzWEc0Z0lHZGxkRWx1YVhScFlXeFRkR0YwWlRvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCN1hHNGdJQ0FnSUNCbWFXeDBaWEpVZVhCbE9pQjBhR2x6TG5CeWIzQnpMbVpwYkhSbGNsUjVjR1VzWEc0Z0lDQWdJQ0JsWkdsMGFXNW5PaUFnSUNCMGFHbHpMbkJ5YjNCekxtVmthWFJwYm1kY2JpQWdJQ0I5TzF4dUlDQjlMRnh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMllYSWdaM0p2ZFhCeklEMGdkR2hwY3k1aWRXbHNaRWR5YjNWd2N5Z3BPMXh1WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aVptbHNkR1Z5TFdKdmVGd2lJRzl1UTJ4cFkyczllM1JvYVhNdWFHRnVaR3hsUTJ4cFkydDlQbHh1SUNBZ0lDQWdJQ0E4UW5WMGRHOXVJR05zWVhOelRtRnRaVDFjSW5ObFlYSmphQzFoWTNScGIyNGdjSFZzYkMxeWFXZG9kQ0JtWldGMWVDMWlkWFIwYjI1Y0lpQnBZMjl1UFZ3aWMyVmhjbU5vWENJZ2IyNURiR2xqYXoxN2RHaHBjeTVwYm1sMGFXRjBaVk5sWVhKamFIMGdMejVjYmx4dUlDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW1Ob1lXbHVMV2R5YjNWd1hDSStYRzRnSUNBZ0lDQWdJQ0FnUEhOd1lXNGdZMnhoYzNOT1lXMWxQVndpWTJoaGFXNWNJajVjYmlBZ0lDQWdJQ0FnSUNBZ0lFWnBibVFnWTJGelpYTWdiV0YwWTJocGJtZGNiaUFnSUNBZ0lDQWdJQ0E4TDNOd1lXNCtYRzVjYmlBZ0lDQWdJQ0FnSUNBOFFXNWtUM0lnYjI1RGFHRnVaMlU5ZTNSb2FYTXVhR0Z1Wkd4bFJtbHNkR1Z5Vkhsd1pVTm9ZVzVuWlgwZ2RIbHdaVDE3ZEdocGN5NXpkR0YwWlM1bWFXeDBaWEpVZVhCbGZTQXZQbHh1SUNBZ0lDQWdJQ0E4TDJScGRqNWNibHh1SUNBZ0lDQWdJQ0I3WjNKdmRYQnpmVnh1SUNBZ0lDQWdQQzlrYVhZK1hHNGdJQ0FnS1R0Y2JpQWdmU3hjYmlBZ2FHRnVaR3hsUkc5amRXMWxiblJEYkdsamF6b2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFJvYVhNdVpXNWtSV1JwZEdsdVp5Z3BPMXh1SUNCOUxGeHVJQ0JpZFdsc1pFZHliM1Z3Y3pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJwYm5CMWRGOXdjbTl3Y3p0Y2JpQWdJQ0IyWVhJZ1ozSnZkWEJ6SUNBZ0lEMGdXMTA3WEc0Z0lDQWdkbUZ5SUdkbGJtVnlZWFJ2Y2lBOUlIUm9hWE11Y0hKdmNITXVZM0pwZEdWeWFXRXVkRzlQY0hScGIyNXpMbUpwYm1Rb2RHaHBjeTV3Y205d2N5NWpjbWwwWlhKcFlTazdYRzVjYmlBZ0lDQnBibkIxZEY5d2NtOXdjeUE5SUh0Y2JpQWdJQ0FnSUhSNWNHVTZJQ0FnSUNBZ0lDQWdKM1JsZUhRbkxGeHVJQ0FnSUNBZ1kyeGhjM05PWVcxbE9pQWdJQ0FuWTJoaGFXNGdhVzV3ZFhSaFlteGxKeXhjYmlBZ0lDQWdJSEJzWVdObGFHOXNaR1Z5T2lBZ0ozTmxZWEpqYUNCamNtbDBaWEpwWVNjc1hHNGdJQ0FnSUNCeVpXWTZJQ0FnSUNBZ0lDQWdJQ2R6WldGeVkyaERjbWwwWlhKcFlTY3NYRzRnSUNBZ0lDQnZia05vWVc1blpUb2dJQ0FnSUhSb2FYTXVhR0Z1Wkd4bFUyVmhjbU5vUTNKcGRHVnlhV0ZjYmlBZ0lDQjlPMXh1WEc0Z0lDQWdhV1lnS0hSb2FYTXVjM1JoZEdVdVpXUnBkR2x1WnlrZ2UxeHVJQ0FnSUNBZ1ozSnZkWEJ6TG5CMWMyZ29YRzRnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2lZMmhoYVc0dFozSnZkWEJjSWlCclpYazlYQ0p6WldGeVkyaERjbWwwWlhKcFlWd2lQbHh1SUNBZ0lDQWdJQ0FnSUR4QmRYUnZZMjl0Y0d4bGRHVWdjbVZtUFZ3aWMyVmhjbU5vUTNKcGRHVnlhV0ZjSWlCdVlXMWxQVndpYzI5dFpYUm9hVzVuWENJZ2IyNVRaV3hsWTNROWUzUm9hWE11YUdGdVpHeGxVMlZzWldOMGZTQm5aVzVsY21GMGIzSTllMmRsYm1WeVlYUnZjbjBnWldScGRHbHVaejE3ZEhKMVpYMGdMejVjYmlBZ0lDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0lDQXBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lISmxkSFZ5YmlCbmNtOTFjSE03WEc0Z0lIMHNYRzRnSUdoaGJtUnNaVk5sYkdWamREb2dablZ1WTNScGIyNGdLSFpoYkhWbEtTQjdYRzRnSUNBZ2RHaHBjeTV3Y205d2N5NWpjbWwwWlhKcFlTNTFjMlVvZG1Gc2RXVXVkbUZzZFdVcE8xeHVJQ0FnSUhSb2FYTXVaVzVrUldScGRHbHVaeWdwTzF4dUlDQjlMRnh1SUNCb1lXNWtiR1ZHYVd4MFpYSlVlWEJsUTJoaGJtZGxPaUJtZFc1amRHbHZiaUFvZG1Gc2RXVXBJSHRjYmlBZ0lDQnBaaUFvSVNCMGFHbHpMbkJ5YjNCekxteHZZMnRVZVhCbEtTQjdYRzRnSUNBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0bWFXeDBaWEpVZVhCbE9pQjJZV3gxWlgwcE8xeHVJQ0FnSUgxY2JpQWdmU3hjYmlBZ2FXNXBkR2xoZEdWVFpXRnlZMmc2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMGFHbHpMbVZ1WkVWa2FYUnBibWNvS1R0Y2JpQWdmU3hjYmlBZ2FHRnVaR3hsUTJ4cFkyczZJR1oxYm1OMGFXOXVJQ2hsS1NCN1hHNGdJQ0FnTHk4Z1NXNGdkR2hsSUhSbGMzUWdaVzUyTENCM1pTQmtieUJ1YjNRZ2FHRjJaU0J6ZEc5d1NXMXRaV1JwWVhSbFVISnZjR0ZuWVhScGIyNHNJSE52SUc5MWNseHVJQ0FnSUM4dklIUmxjM1J6SUhkcGJHd2dZbkpsWVdzZ2FXWWdkMlVnWkc5dUozUWdkWE5sSUdGdUlHQnBabUFnYzNSaGRHVnRaVzUwSUdobGNtVmNiaUFnSUNCcFppQW9aUzV1WVhScGRtVkZkbVZ1ZENBbUppQmxMbTVoZEdsMlpVVjJaVzUwTG5OMGIzQkpiVzFsWkdsaGRHVlFjbTl3WVdkaGRHbHZiaWtnZTF4dUlDQWdJQ0FnWlM1dVlYUnBkbVZGZG1WdWRDNXpkRzl3U1cxdFpXUnBZWFJsVUhKdmNHRm5ZWFJwYjI0b0tUdGNiaUFnSUNCOVhHNWNiaUFnSUNCbExuTjBiM0JRY205d1lXZGhkR2x2YmlncE8xeHVJQ0FnSUdVdWNISmxkbVZ1ZEVSbFptRjFiSFFvS1R0Y2JseHVJQ0FnSUhSb2FYTXVaVzVoWW14bFJXUnBkR2x1WnlncE8xeHVJQ0I5TEZ4dUlDQmxibUZpYkdWRlpHbDBhVzVuT2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2FXWWdLQ0VnZEdocGN5NXpkR0YwWlM1bFpHbDBhVzVuS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHRsWkdsMGFXNW5PaUIwY25WbGZTazdYRzRnSUNBZ2ZWeHVJQ0I5TEZ4dUlDQmxibVJGWkdsMGFXNW5PaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnYVdZZ0tIUm9hWE11YzNSaGRHVXVaV1JwZEdsdVp5a2dlMXh1SUNBZ0lDQWdkR2hwY3k1elpYUlRkR0YwWlNoN1pXUnBkR2x1WnpvZ1ptRnNjMlY5S1R0Y2JpQWdJQ0I5WEc0Z0lIMHNYRzRnSUdadlkzVnpVMlZoY21Ob09pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdhV1lnS0NFZ2RHaHBjeTV6ZEdGMFpTNWxaR2wwYVc1bktTQjdYRzRnSUNBZ0lDQnlaWFIxY200N1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHlwMllYSWdibTlrWlNBOUlGSmxZV04wTG1acGJtUkVUMDFPYjJSbEtIUm9hWE11Y21WbWN5NXpaV0Z5WTJoRGNtbDBaWEpwWVNrN1hHNWNiaUFnSUNCdWIyUmxMbVp2WTNWektDazdLaTljYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1JtbHNkR1Z5UW05NE8xeHVJbDE5IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfICAgICAgICAgICAgID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyIGRhdGVfbWF0Y2hlcnMgPSBbJ2RheScsICdkYXRlJ107XG52YXIgZXNjYXBlUmVnZXggICA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL2VzY2FwZV9yZWdleCcpO1xudmFyIGRlZmluaXRpb247XG5cbmRlZmluaXRpb24gPSB7XG4gIGNyaXRlcmlhOiB7XG4gICAgd2VsbDoge1xuICAgICAgZGlzcGxheTogICdXZWxsIG5hbWUnLFxuICAgICAgbG9ja2VkOiAgIGZhbHNlLFxuICAgICAgdmFsdWU6ICAgIG51bGwsXG4gICAgICB0eXBlOiAgICAgJ3N0cmluZycsXG4gICAgICBuZWdhdGU6ICAgZmFsc2VcbiAgICB9LFxuICAgIHJlcG9ydGVyOiB7XG4gICAgICBkaXNwbGF5OiAgJ1JlcG9ydGVkIGJ5JyxcbiAgICAgIGxvY2tlZDogICBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICBudWxsLFxuICAgICAgdHlwZTogICAgICdzdHJpbmcnLFxuICAgICAgbmVnYXRlOiAgIGZhbHNlXG4gICAgfSxcbiAgICByZXBvcnRlZDoge1xuICAgICAgZGlzcGxheTogICdSZXBvcnRlZCBvbicsXG4gICAgICBtYXRjaGVyczogZGF0ZV9tYXRjaGVycyxcbiAgICAgIGxvY2tlZDogICBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICBudWxsLFxuICAgICAgdHlwZTogICAgICdkYXknLFxuICAgICAgbmVnYXRlOiAgIGZhbHNlXG4gICAgfSxcbiAgICByZXBvcnRlZF9iZXR3ZWVuOiB7XG4gICAgICBkaXNwbGF5OiAgJ1JlcG9ydGVkIGJldHdlZW4nLFxuICAgICAgbWF0Y2hlcnM6IGRhdGVfbWF0Y2hlcnMsXG4gICAgICBsb2NrZWQ6ICAgZmFsc2UsXG4gICAgICB2YWx1ZTogICAgW10sXG4gICAgICB0eXBlOiAgICAgJ2RhdGVyYW5nZSdcbiAgICB9LFxuICAgIHJlcG9ydGVkX2d0OiB7XG4gICAgICBkaXNwbGF5OiAgJ1JlcG9ydGVkIGFmdGVyJyxcbiAgICAgIG1hdGNoZXJzOiBkYXRlX21hdGNoZXJzLFxuICAgICAgbG9ja2VkOiAgIGZhbHNlLFxuICAgICAgdmFsdWU6ICAgIG51bGwsXG4gICAgICB0eXBlOiAgICAgJ2RheSdcbiAgICB9LFxuICAgIHJlcG9ydGVkX2x0OiB7XG4gICAgICBkaXNwbGF5OiAgJ1JlcG9ydGVkIGJlZm9yZScsXG4gICAgICBtYXRjaGVyczogZGF0ZV9tYXRjaGVycyxcbiAgICAgIGxvY2tlZDogICBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICBudWxsLFxuICAgICAgdHlwZTogICAgICdkYXknXG4gICAgfSxcbiAgICB1cGRhdGVkOiB7XG4gICAgICBkaXNwbGF5OiAgJ1VwZGF0ZWQgb24nLFxuICAgICAgbWF0Y2hlcnM6IGRhdGVfbWF0Y2hlcnMsXG4gICAgICBsb2NrZWQ6ICAgZmFsc2UsXG4gICAgICB2YWx1ZTogICAgbnVsbCxcbiAgICAgIHR5cGU6ICAgICAnZGF5JyxcbiAgICAgIG5lZ2F0ZTogICBmYWxzZVxuICAgIH0sXG4gICAgdXBkYXRlZF9iZXR3ZWVuOiB7XG4gICAgICBkaXNwbGF5OiAgJ1VwZGF0ZWQgYmV0d2VlbicsXG4gICAgICBtYXRjaGVyczogZGF0ZV9tYXRjaGVycyxcbiAgICAgIGxvY2tlZDogICBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICBbXSxcbiAgICAgIHR5cGU6ICAgICAnZGF0ZXJhbmdlJ1xuICAgIH0sXG4gICAgdXBkYXRlZF9ndDoge1xuICAgICAgZGlzcGxheTogICdVcGRhdGVkIGFmdGVyJyxcbiAgICAgIG1hdGNoZXJzOiBkYXRlX21hdGNoZXJzLFxuICAgICAgbG9ja2VkOiAgIGZhbHNlLFxuICAgICAgdmFsdWU6ICAgIG51bGwsXG4gICAgICB0eXBlOiAgICAgJ2RheSdcbiAgICB9LFxuICAgIHVwZGF0ZWRfbHQ6IHtcbiAgICAgIGRpc3BsYXk6ICAnVXBkYXRlZCBiZWZvcmUnLFxuICAgICAgbWF0Y2hlcnM6IGRhdGVfbWF0Y2hlcnMsXG4gICAgICBsb2NrZWQ6ICAgZmFsc2UsXG4gICAgICB2YWx1ZTogICAgbnVsbCxcbiAgICAgIHR5cGU6ICAgICAnZGF5J1xuICAgIH0sXG4gICAgdGFnczoge1xuICAgICAgZGlzcGxheTogICdUYWdzJyxcbiAgICAgIGxvY2tlZDogICBmYWxzZSxcbiAgICAgIHR5cGU6ICAgICAndGFnJyxcbiAgICAgIG5lZ2F0ZTogICBmYWxzZSxcbiAgICAgIG11bHRpOiAgICB0cnVlXG4gICAgfSxcbiAgICBwcmlvcml0eToge1xuICAgICAgZGlzcGxheTogICdQcmlvcml0eScsXG4gICAgICBsb2NrZWQ6ICAgZmFsc2UsXG4gICAgICB0eXBlOiAgICAgJ251bWJlcicsXG4gICAgICBuZWdhdGU6ICAgZmFsc2VcbiAgICB9LFxuICAgIHByaW9yaXR5X2d0OiB7XG4gICAgICBkaXNwbGF5OiAgJ1ByaW9yaXR5IGFib3ZlJyxcbiAgICAgIGxvY2tlZDogICBmYWxzZSxcbiAgICAgIHR5cGU6ICAgICAnbnVtYmVyJ1xuICAgIH0sXG4gICAgcHJpb3JpdHlfbHQ6IHtcbiAgICAgIGRpc3BsYXk6ICAnUHJpb3JpdHkgYmVsb3cnLFxuICAgICAgbG9ja2VkOiAgIGZhbHNlLFxuICAgICAgdHlwZTogICAgICdudW1iZXInXG4gICAgfSxcbiAgICBpc3N1ZV90eXBlOiB7XG4gICAgICBkaXNwbGF5OiAgJ0lzc3VlIHR5cGUnLFxuICAgICAgbG9ja2VkOiAgIGZhbHNlLFxuICAgICAgdHlwZTogICAgICdzdHJpbmcnLFxuICAgICAgbXVsdGk6ICAgIHRydWVcbiAgICB9LFxuICAgIGlzc3VlX3N1YnR5cGU6IHtcbiAgICAgIGRpc3BsYXk6ICAnSXNzdWUgc3VidHlwZScsXG4gICAgICBsb2NrZWQ6ICAgZmFsc2UsXG4gICAgICB0eXBlOiAgICAgJ3N0cmluZycsXG4gICAgICBtdWx0aTogICAgdHJ1ZVxuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gQnVpbGRlciAoY3JpdGVyaWEpIHtcbiAgdGhpcy5jcml0ZXJpYSAgID0gXy5leHRlbmQoe30sIGNyaXRlcmlhKTtcbiAgdGhpcy5mcmVlX3RleHQgID0gbnVsbDtcbn1cblxuQnVpbGRlci5wcm90b3R5cGUubWF0Y2hDcml0ZXJpYSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgY29uc29sZS50aW1lKCdtYXRjaENyaXRlcmlhJylcbiAgdmFyIHJlc3VsdHM7XG4gIHZhciBwYXR0ZXJuICAgPSAvLi87XG4gIHZhciB2YWx1ZXMgICAgPSBbXTtcbiAgdmFyIGtleXMgICAgICA9IE9iamVjdC5rZXlzKHRoaXMuY3JpdGVyaWEpO1xuICB2YXIgdHJ1dGhUZXN0ID0gZnVuY3Rpb24gKCkge3JldHVybiB0cnVlO307XG5cbiAgaWYgKHN0cmluZyAmJiBzdHJpbmcubGVuZ3RoID4gMCkge1xuICAgIHBhdHRlcm4gICA9IG5ldyBSZWdFeHAoZXNjYXBlUmVnZXgoc3RyaW5nIHx8ICcnKSwgJ2knKTtcbiAgICB0cnV0aFRlc3QgPSBwYXR0ZXJuLnRlc3QuYmluZChwYXR0ZXJuKTtcbiAgfVxuXG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIG1hdGNoZXJzO1xuICAgIHZhciBpO1xuICAgIHZhciBsZW47XG4gICAgdmFyIGNyaXRlcmlhID0gdGhpcy5jcml0ZXJpYVtrZXldO1xuXG4gICAgaWYgKCEgdGhpcy5pc0F2YWlsYWJsZShrZXkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRydXRoVGVzdChrZXkpKSB7XG4gICAgICByZXR1cm4gdmFsdWVzLnB1c2goa2V5KTtcbiAgICB9XG5cbiAgICBpZiAodHJ1dGhUZXN0KCdbJyArIGNyaXRlcmlhLmRpc3BsYXkgKyAnXScpKSB7XG4gICAgICByZXR1cm4gdmFsdWVzLnB1c2goa2V5KTtcbiAgICB9XG5cbiAgICBtYXRjaGVycyA9IGNyaXRlcmlhLm1hdGNoZXJzIHx8IFtdO1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0gbWF0Y2hlcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmIChwYXR0ZXJuLnRlc3QobWF0Y2hlcnNbaV0pKSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKGtleSk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9LCB0aGlzKTtcblxuICByZXN1bHRzID0gXy5waWNrKHRoaXMuY3JpdGVyaWEsIHZhbHVlcyk7XG4gIGNvbnNvbGUudGltZUVuZCgnbWF0Y2hDcml0ZXJpYScpXG5cbiAgcmV0dXJuIHJlc3VsdHM7XG59O1xuXG5CdWlsZGVyLnByb3RvdHlwZS50b09wdGlvbnMgPSBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gIHZhciByZXN1bHRzID0gdGhpcy5tYXRjaENyaXRlcmlhKHN0cmluZyk7XG4gIHZhciBvcHRpb25zID0gXy5tYXAocmVzdWx0cywgZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuICAgIHJldHVybiB7dmFsdWU6IGtleSwgbGFiZWw6IGl0ZW0uZGlzcGxheX07XG4gIH0pO1xuXG4gIGlmIChzdHJpbmcgJiYgISB0aGlzLmZyZWVfdGV4dCAmJiAhIC9eXFxbLy50ZXN0KHN0cmluZykpIHtcbiAgICBvcHRpb25zLnVuc2hpZnQoe1xuICAgICAgbGFiZWw6ICBzdHJpbmcsXG4gICAgICB2YWx1ZTogIHN0cmluZ1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIG9wdGlvbnM7XG59O1xuXG5CdWlsZGVyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoa2V5LCBwcm9wLCB2YWx1ZSkge1xuICBpZiAoISBrZXkgfHwgISBwcm9wKSB7XG4gICAgdGhyb3cgJ2tleSBhbmQgcHJvcCBhcmUgcmVxdWlyZWQnO1xuICB9XG5cbiAgaWYgKHRoaXMuY3JpdGVyaWEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgIHRoaXMuY3JpdGVyaWFba2V5XVtwcm9wXSA9IHZhbHVlO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cbkJ1aWxkZXIucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIHRoaXMuc2V0KGtleSwgJ3VzZWQnLCB0cnVlKTtcbn07XG5cbkJ1aWxkZXIucHJvdG90eXBlLnJlZnVuZCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIHRoaXMuc2V0KGtleSwgJ3VzZWQnKTtcbn07XG5cbkJ1aWxkZXIucHJvdG90eXBlLmxvY2sgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiB0aGlzLnNldChrZXksICdsb2NrZWQnLCB0cnVlKTtcbn07XG5cbkJ1aWxkZXIucHJvdG90eXBlLnVubG9jayA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIHRoaXMuc2V0KGtleSwgJ2xvY2tlZCcsIGZhbHNlKTtcbn07XG5cbkJ1aWxkZXIucHJvdG90eXBlLmlzQXZhaWxhYmxlID0gZnVuY3Rpb24gKGtleSkge1xuICB2YXIgY3JpdGVyaWEgPSB0aGlzLmNyaXRlcmlhW2tleV07XG5cbiAgaWYgKCEgY3JpdGVyaWEpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gISBjcml0ZXJpYS5sb2NrZWQgJiYgISBjcml0ZXJpYS51c2VkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRlZmluaXRpb246IGRlZmluaXRpb24uY3JpdGVyaWEsXG4gIEJ1aWxkZXI6IEJ1aWxkZXJcbn07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZZMkZ6WlhNdlptbHNkR1Z5WDJKdmVGOWtaV1pwYm1sMGFXOXVMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxGbEJRVmtzUTBGQlF6czdRVUZGWWl4SlFVRkpMRU5CUVVNc1pVRkJaU3hQUVVGUExFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTTdRVUZETVVNc1NVRkJTU3hoUVVGaExFZEJRVWNzUTBGQlF5eExRVUZMTEVWQlFVVXNUVUZCVFN4RFFVRkRMRU5CUVVNN1FVRkRjRU1zU1VGQlNTeFhRVUZYTEV0QlFVc3NUMEZCVHl4RFFVRkRMREJDUVVFd1FpeERRVUZETEVOQlFVTTdRVUZEZUVRc1NVRkJTU3hWUVVGVkxFTkJRVU03TzBGQlJXWXNWVUZCVlN4SFFVRkhPMFZCUTFnc1VVRkJVU3hGUVVGRk8wbEJRMUlzU1VGQlNTeEZRVUZGTzAxQlEwb3NUMEZCVHl4SFFVRkhMRmRCUVZjN1RVRkRja0lzVFVGQlRTeEpRVUZKTEV0QlFVczdUVUZEWml4TFFVRkxMRXRCUVVzc1NVRkJTVHROUVVOa0xFbEJRVWtzVFVGQlRTeFJRVUZSTzAxQlEyeENMRTFCUVUwc1NVRkJTU3hMUVVGTE8wdEJRMmhDTzBsQlEwUXNVVUZCVVN4RlFVRkZPMDFCUTFJc1QwRkJUeXhIUVVGSExHRkJRV0U3VFVGRGRrSXNUVUZCVFN4SlFVRkpMRXRCUVVzN1RVRkRaaXhMUVVGTExFdEJRVXNzU1VGQlNUdE5RVU5rTEVsQlFVa3NUVUZCVFN4UlFVRlJPMDFCUTJ4Q0xFMUJRVTBzU1VGQlNTeExRVUZMTzB0QlEyaENPMGxCUTBRc1VVRkJVU3hGUVVGRk8wMUJRMUlzVDBGQlR5eEhRVUZITEdGQlFXRTdUVUZEZGtJc1VVRkJVU3hGUVVGRkxHRkJRV0U3VFVGRGRrSXNUVUZCVFN4SlFVRkpMRXRCUVVzN1RVRkRaaXhMUVVGTExFdEJRVXNzU1VGQlNUdE5RVU5rTEVsQlFVa3NUVUZCVFN4TFFVRkxPMDFCUTJZc1RVRkJUU3hKUVVGSkxFdEJRVXM3UzBGRGFFSTdTVUZEUkN4blFrRkJaMElzUlVGQlJUdE5RVU5vUWl4UFFVRlBMRWRCUVVjc2EwSkJRV3RDTzAxQlF6VkNMRkZCUVZFc1JVRkJSU3hoUVVGaE8wMUJRM1pDTEUxQlFVMHNTVUZCU1N4TFFVRkxPMDFCUTJZc1MwRkJTeXhMUVVGTExFVkJRVVU3VFVGRFdpeEpRVUZKTEUxQlFVMHNWMEZCVnp0TFFVTjBRanRKUVVORUxGZEJRVmNzUlVGQlJUdE5RVU5ZTEU5QlFVOHNSMEZCUnl4blFrRkJaMEk3VFVGRE1VSXNVVUZCVVN4RlFVRkZMR0ZCUVdFN1RVRkRka0lzVFVGQlRTeEpRVUZKTEV0QlFVczdUVUZEWml4TFFVRkxMRXRCUVVzc1NVRkJTVHROUVVOa0xFbEJRVWtzVFVGQlRTeExRVUZMTzB0QlEyaENPMGxCUTBRc1YwRkJWeXhGUVVGRk8wMUJRMWdzVDBGQlR5eEhRVUZITEdsQ1FVRnBRanROUVVNelFpeFJRVUZSTEVWQlFVVXNZVUZCWVR0TlFVTjJRaXhOUVVGTkxFbEJRVWtzUzBGQlN6dE5RVU5tTEV0QlFVc3NTMEZCU3l4SlFVRkpPMDFCUTJRc1NVRkJTU3hOUVVGTkxFdEJRVXM3UzBGRGFFSTdTVUZEUkN4UFFVRlBMRVZCUVVVN1RVRkRVQ3hQUVVGUExFZEJRVWNzV1VGQldUdE5RVU4wUWl4UlFVRlJMRVZCUVVVc1lVRkJZVHROUVVOMlFpeE5RVUZOTEVsQlFVa3NTMEZCU3p0TlFVTm1MRXRCUVVzc1MwRkJTeXhKUVVGSk8wMUJRMlFzU1VGQlNTeE5RVUZOTEV0QlFVczdUVUZEWml4TlFVRk5MRWxCUVVrc1MwRkJTenRMUVVOb1FqdEpRVU5FTEdWQlFXVXNSVUZCUlR0TlFVTm1MRTlCUVU4c1IwRkJSeXhwUWtGQmFVSTdUVUZETTBJc1VVRkJVU3hGUVVGRkxHRkJRV0U3VFVGRGRrSXNUVUZCVFN4SlFVRkpMRXRCUVVzN1RVRkRaaXhMUVVGTExFdEJRVXNzUlVGQlJUdE5RVU5hTEVsQlFVa3NUVUZCVFN4WFFVRlhPMHRCUTNSQ08wbEJRMFFzVlVGQlZTeEZRVUZGTzAxQlExWXNUMEZCVHl4SFFVRkhMR1ZCUVdVN1RVRkRla0lzVVVGQlVTeEZRVUZGTEdGQlFXRTdUVUZEZGtJc1RVRkJUU3hKUVVGSkxFdEJRVXM3VFVGRFppeExRVUZMTEV0QlFVc3NTVUZCU1R0TlFVTmtMRWxCUVVrc1RVRkJUU3hMUVVGTE8wdEJRMmhDTzBsQlEwUXNWVUZCVlN4RlFVRkZPMDFCUTFZc1QwRkJUeXhIUVVGSExHZENRVUZuUWp0TlFVTXhRaXhSUVVGUkxFVkJRVVVzWVVGQllUdE5RVU4yUWl4TlFVRk5MRWxCUVVrc1MwRkJTenROUVVObUxFdEJRVXNzUzBGQlN5eEpRVUZKTzAxQlEyUXNTVUZCU1N4TlFVRk5MRXRCUVVzN1MwRkRhRUk3U1VGRFJDeEpRVUZKTEVWQlFVVTdUVUZEU2l4UFFVRlBMRWRCUVVjc1RVRkJUVHROUVVOb1FpeE5RVUZOTEVsQlFVa3NTMEZCU3p0TlFVTm1MRWxCUVVrc1RVRkJUU3hMUVVGTE8wMUJRMllzVFVGQlRTeEpRVUZKTEV0QlFVczdUVUZEWml4TFFVRkxMRXRCUVVzc1NVRkJTVHRMUVVObU8wbEJRMFFzVVVGQlVTeEZRVUZGTzAxQlExSXNUMEZCVHl4SFFVRkhMRlZCUVZVN1RVRkRjRUlzVFVGQlRTeEpRVUZKTEV0QlFVczdUVUZEWml4SlFVRkpMRTFCUVUwc1VVRkJVVHROUVVOc1FpeE5RVUZOTEVsQlFVa3NTMEZCU3p0TFFVTm9RanRKUVVORUxGZEJRVmNzUlVGQlJUdE5RVU5ZTEU5QlFVOHNSMEZCUnl4blFrRkJaMEk3VFVGRE1VSXNUVUZCVFN4SlFVRkpMRXRCUVVzN1RVRkRaaXhKUVVGSkxFMUJRVTBzVVVGQlVUdExRVU51UWp0SlFVTkVMRmRCUVZjc1JVRkJSVHROUVVOWUxFOUJRVThzUjBGQlJ5eG5Ra0ZCWjBJN1RVRkRNVUlzVFVGQlRTeEpRVUZKTEV0QlFVczdUVUZEWml4SlFVRkpMRTFCUVUwc1VVRkJVVHRMUVVOdVFqdEpRVU5FTEZWQlFWVXNSVUZCUlR0TlFVTldMRTlCUVU4c1IwRkJSeXhaUVVGWk8wMUJRM1JDTEUxQlFVMHNTVUZCU1N4TFFVRkxPMDFCUTJZc1NVRkJTU3hOUVVGTkxGRkJRVkU3VFVGRGJFSXNTMEZCU3l4TFFVRkxMRWxCUVVrN1MwRkRaanRKUVVORUxHRkJRV0VzUlVGQlJUdE5RVU5pTEU5QlFVOHNSMEZCUnl4bFFVRmxPMDFCUTNwQ0xFMUJRVTBzU1VGQlNTeExRVUZMTzAxQlEyWXNTVUZCU1N4TlFVRk5MRkZCUVZFN1RVRkRiRUlzUzBGQlN5eExRVUZMTEVsQlFVazdTMEZEWmp0SFFVTkdPMEZCUTBnc1EwRkJReXhEUVVGRE96dEJRVVZHTEZOQlFWTXNUMEZCVHl4RlFVRkZMRkZCUVZFc1JVRkJSVHRGUVVNeFFpeEpRVUZKTEVOQlFVTXNVVUZCVVN4TFFVRkxMRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zUlVGQlJTeEZRVUZGTEZGQlFWRXNRMEZCUXl4RFFVRkRPMFZCUTNwRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVsQlFVa3NTVUZCU1N4RFFVRkRPMEZCUTNwQ0xFTkJRVU03TzBGQlJVUXNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhoUVVGaExFZEJRVWNzVlVGQlZTeE5RVUZOTEVWQlFVVTdSVUZEYkVRc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eGxRVUZsTEVOQlFVTTdSVUZETjBJc1NVRkJTU3hQUVVGUExFTkJRVU03UlVGRFdpeEpRVUZKTEU5QlFVOHNTMEZCU3l4SFFVRkhMRU5CUVVNN1JVRkRjRUlzU1VGQlNTeE5RVUZOTEUxQlFVMHNSVUZCUlN4RFFVRkRPMFZCUTI1Q0xFbEJRVWtzU1VGQlNTeFJRVUZSTEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzBGQlF6ZERMRVZCUVVVc1NVRkJTU3hUUVVGVExFZEJRVWNzV1VGQldTeERRVUZETEU5QlFVOHNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRenM3UlVGRk0wTXNTVUZCU1N4TlFVRk5MRWxCUVVrc1RVRkJUU3hEUVVGRExFMUJRVTBzUjBGQlJ5eERRVUZETEVWQlFVVTdTVUZETDBJc1QwRkJUeXhMUVVGTExFbEJRVWtzVFVGQlRTeERRVUZETEZkQlFWY3NRMEZCUXl4TlFVRk5MRWxCUVVrc1JVRkJSU3hEUVVGRExFVkJRVVVzUjBGQlJ5eERRVUZETEVOQlFVTTdTVUZEZGtRc1UwRkJVeXhIUVVGSExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8wRkJRek5ETEVkQlFVYzdPMFZCUlVRc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eFZRVUZWTEVkQlFVY3NSVUZCUlR0SlFVTXhRaXhKUVVGSkxGRkJRVkVzUTBGQlF6dEpRVU5pTEVsQlFVa3NRMEZCUXl4RFFVRkRPMGxCUTA0c1NVRkJTU3hIUVVGSExFTkJRVU03UVVGRFdpeEpRVUZKTEVsQlFVa3NVVUZCVVN4SFFVRkhMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdPMGxCUld4RExFbEJRVWtzUlVGQlJTeEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRk8wMUJRek5DTEU5QlFVOHNTMEZCU3l4RFFVRkRPMEZCUTI1Q0xFdEJRVXM3TzBsQlJVUXNTVUZCU1N4VFFVRlRMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVU3VFVGRGJFSXNUMEZCVHl4TlFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzBGQlF6bENMRXRCUVVzN08wbEJSVVFzU1VGQlNTeFRRVUZUTEVOQlFVTXNSMEZCUnl4SFFVRkhMRkZCUVZFc1EwRkJReXhQUVVGUExFZEJRVWNzUjBGQlJ5eERRVUZETEVWQlFVVTdUVUZETTBNc1QwRkJUeXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUXpsQ0xFdEJRVXM3TzBGQlJVd3NTVUZCU1N4UlFVRlJMRWRCUVVjc1VVRkJVU3hEUVVGRExGRkJRVkVzU1VGQlNTeEZRVUZGTEVOQlFVTTdPMGxCUlc1RExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlN4SFFVRkhMRWRCUVVjc1VVRkJVU3hEUVVGRExFMUJRVTBzUlVGQlJTeERRVUZETEVkQlFVY3NSMEZCUnl4RlFVRkZMRU5CUVVNc1JVRkJSU3hGUVVGRk8wMUJReTlETEVsQlFVa3NUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNSVUZCUlR0QlFVTnlReXhSUVVGUkxFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN08xRkJSV3BDTEU5QlFVOHNTVUZCU1N4RFFVRkRPMDlCUTJJN1MwRkRSanRCUVVOTUxFZEJRVWNzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXpzN1JVRkZWQ3hQUVVGUExFZEJRVWNzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1VVRkJVU3hGUVVGRkxFMUJRVTBzUTBGQlF5eERRVUZETzBGQlF6RkRMRVZCUVVVc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eGxRVUZsTEVOQlFVTTdPMFZCUldoRExFOUJRVThzVDBGQlR5eERRVUZETzBGQlEycENMRU5CUVVNc1EwRkJRenM3UVVGRlJpeFBRVUZQTEVOQlFVTXNVMEZCVXl4RFFVRkRMRk5CUVZNc1IwRkJSeXhWUVVGVkxFMUJRVTBzUlVGQlJUdEZRVU01UXl4SlFVRkpMRTlCUVU4c1IwRkJSeXhKUVVGSkxFTkJRVU1zWVVGQllTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMFZCUTNwRExFbEJRVWtzVDBGQlR5eEhRVUZITEVOQlFVTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1QwRkJUeXhGUVVGRkxGVkJRVlVzU1VGQlNTeEZRVUZGTEVkQlFVY3NSVUZCUlR0SlFVTm9SQ3hQUVVGUExFTkJRVU1zUzBGQlN5eEZRVUZGTEVkQlFVY3NSVUZCUlN4TFFVRkxMRVZCUVVVc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzBGQlF6ZERMRWRCUVVjc1EwRkJReXhEUVVGRE96dEZRVVZJTEVsQlFVa3NUVUZCVFN4SlFVRkpMRVZCUVVVc1NVRkJTU3hEUVVGRExGTkJRVk1zU1VGQlNTeEZRVUZGTEV0QlFVc3NRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFVkJRVVU3U1VGRGRFUXNUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJRenROUVVOa0xFdEJRVXNzUjBGQlJ5eE5RVUZOTzAxQlEyUXNTMEZCU3l4SFFVRkhMRTFCUVUwN1MwRkRaaXhEUVVGRExFTkJRVU03UVVGRFVDeEhRVUZIT3p0RlFVVkVMRTlCUVU4c1QwRkJUeXhEUVVGRE8wRkJRMnBDTEVOQlFVTXNRMEZCUXpzN1FVRkZSaXhQUVVGUExFTkJRVU1zVTBGQlV5eERRVUZETEVkQlFVY3NSMEZCUnl4VlFVRlZMRWRCUVVjc1JVRkJSU3hKUVVGSkxFVkJRVVVzUzBGQlN5eEZRVUZGTzBWQlEyeEVMRWxCUVVrc1JVRkJSU3hIUVVGSExFbEJRVWtzUlVGQlJTeEpRVUZKTEVWQlFVVTdTVUZEYmtJc1RVRkJUU3d5UWtGQk1rSXNRMEZCUXp0QlFVTjBReXhIUVVGSE96dEZRVVZFTEVsQlFVa3NTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhqUVVGakxFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVTdRVUZEZWtNc1NVRkJTU3hKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGSExFdEJRVXNzUTBGQlF6czdTVUZGYWtNc1QwRkJUeXhKUVVGSkxFTkJRVU03UjBGRFlqdEJRVU5JTEVOQlFVTXNRMEZCUXpzN1FVRkZSaXhQUVVGUExFTkJRVU1zVTBGQlV5eERRVUZETEVkQlFVY3NSMEZCUnl4VlFVRlZMRWRCUVVjc1JVRkJSVHRGUVVOeVF5eFBRVUZQTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1IwRkJSeXhGUVVGRkxFMUJRVTBzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTnlReXhEUVVGRExFTkJRVU03TzBGQlJVWXNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhOUVVGTkxFZEJRVWNzVlVGQlZTeEhRVUZITEVWQlFVVTdSVUZEZUVNc1QwRkJUeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVkQlFVY3NSVUZCUlN4TlFVRk5MRU5CUVVNc1EwRkJRenRCUVVNdlFpeERRVUZETEVOQlFVTTdPMEZCUlVZc1QwRkJUeXhEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTEVkQlFVY3NWVUZCVlN4SFFVRkhMRVZCUVVVN1JVRkRkRU1zVDBGQlR5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWRCUVVjc1JVRkJSU3hSUVVGUkxFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVTTdRVUZEZGtNc1EwRkJReXhEUVVGRE96dEJRVVZHTEU5QlFVOHNRMEZCUXl4VFFVRlRMRU5CUVVNc1RVRkJUU3hIUVVGSExGVkJRVlVzUjBGQlJ5eEZRVUZGTzBWQlEzaERMRTlCUVU4c1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEhRVUZITEVWQlFVVXNVVUZCVVN4RlFVRkZMRXRCUVVzc1EwRkJReXhEUVVGRE8wRkJRM2hETEVOQlFVTXNRMEZCUXpzN1FVRkZSaXhQUVVGUExFTkJRVU1zVTBGQlV5eERRVUZETEZkQlFWY3NSMEZCUnl4VlFVRlZMRWRCUVVjc1JVRkJSVHRCUVVNdlF5eEZRVUZGTEVsQlFVa3NVVUZCVVN4SFFVRkhMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdPMFZCUld4RExFbEJRVWtzUlVGQlJTeFJRVUZSTEVWQlFVVTdTVUZEWkN4UFFVRlBMRXRCUVVzc1EwRkJRenRCUVVOcVFpeEhRVUZIT3p0RlFVVkVMRTlCUVU4c1JVRkJSU3hSUVVGUkxFTkJRVU1zVFVGQlRTeEpRVUZKTEVWQlFVVXNVVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJRenRCUVVNNVF5eERRVUZETEVOQlFVTTdPMEZCUlVZc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ6dEZRVU5tTEZWQlFWVXNSVUZCUlN4VlFVRlZMRU5CUVVNc1VVRkJVVHRGUVVNdlFpeFBRVUZQTEVWQlFVVXNUMEZCVHp0RFFVTnFRaXhEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lYQ0oxYzJVZ2MzUnlhV04wWENJN1hHNWNiblpoY2lCZklDQWdJQ0FnSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duZFc1a1pYSnpZMjl5WlNjcE8xeHVkbUZ5SUdSaGRHVmZiV0YwWTJobGNuTWdQU0JiSjJSaGVTY3NJQ2RrWVhSbEoxMDdYRzUyWVhJZ1pYTmpZWEJsVW1WblpYZ2dJQ0E5SUhKbGNYVnBjbVVvSnk0dUx5NHVMM1YwYVd4ekwyVnpZMkZ3WlY5eVpXZGxlQ2NwTzF4dWRtRnlJR1JsWm1sdWFYUnBiMjQ3WEc1Y2JtUmxabWx1YVhScGIyNGdQU0I3WEc0Z0lHTnlhWFJsY21saE9pQjdYRzRnSUNBZ2QyVnNiRG9nZTF4dUlDQWdJQ0FnWkdsemNHeGhlVG9nSUNkWFpXeHNJRzVoYldVbkxGeHVJQ0FnSUNBZ2JHOWphMlZrT2lBZ0lHWmhiSE5sTEZ4dUlDQWdJQ0FnZG1Gc2RXVTZJQ0FnSUc1MWJHd3NYRzRnSUNBZ0lDQjBlWEJsT2lBZ0lDQWdKM04wY21sdVp5Y3NYRzRnSUNBZ0lDQnVaV2RoZEdVNklDQWdabUZzYzJWY2JpQWdJQ0I5TEZ4dUlDQWdJSEpsY0c5eWRHVnlPaUI3WEc0Z0lDQWdJQ0JrYVhOd2JHRjVPaUFnSjFKbGNHOXlkR1ZrSUdKNUp5eGNiaUFnSUNBZ0lHeHZZMnRsWkRvZ0lDQm1ZV3h6WlN4Y2JpQWdJQ0FnSUhaaGJIVmxPaUFnSUNCdWRXeHNMRnh1SUNBZ0lDQWdkSGx3WlRvZ0lDQWdJQ2R6ZEhKcGJtY25MRnh1SUNBZ0lDQWdibVZuWVhSbE9pQWdJR1poYkhObFhHNGdJQ0FnZlN4Y2JpQWdJQ0J5WlhCdmNuUmxaRG9nZTF4dUlDQWdJQ0FnWkdsemNHeGhlVG9nSUNkU1pYQnZjblJsWkNCdmJpY3NYRzRnSUNBZ0lDQnRZWFJqYUdWeWN6b2daR0YwWlY5dFlYUmphR1Z5Y3l4Y2JpQWdJQ0FnSUd4dlkydGxaRG9nSUNCbVlXeHpaU3hjYmlBZ0lDQWdJSFpoYkhWbE9pQWdJQ0J1ZFd4c0xGeHVJQ0FnSUNBZ2RIbHdaVG9nSUNBZ0lDZGtZWGtuTEZ4dUlDQWdJQ0FnYm1WbllYUmxPaUFnSUdaaGJITmxYRzRnSUNBZ2ZTeGNiaUFnSUNCeVpYQnZjblJsWkY5aVpYUjNaV1Z1T2lCN1hHNGdJQ0FnSUNCa2FYTndiR0Y1T2lBZ0oxSmxjRzl5ZEdWa0lHSmxkSGRsWlc0bkxGeHVJQ0FnSUNBZ2JXRjBZMmhsY25NNklHUmhkR1ZmYldGMFkyaGxjbk1zWEc0Z0lDQWdJQ0JzYjJOclpXUTZJQ0FnWm1Gc2MyVXNYRzRnSUNBZ0lDQjJZV3gxWlRvZ0lDQWdXMTBzWEc0Z0lDQWdJQ0IwZVhCbE9pQWdJQ0FnSjJSaGRHVnlZVzVuWlNkY2JpQWdJQ0I5TEZ4dUlDQWdJSEpsY0c5eWRHVmtYMmQwT2lCN1hHNGdJQ0FnSUNCa2FYTndiR0Y1T2lBZ0oxSmxjRzl5ZEdWa0lHRm1kR1Z5Snl4Y2JpQWdJQ0FnSUcxaGRHTm9aWEp6T2lCa1lYUmxYMjFoZEdOb1pYSnpMRnh1SUNBZ0lDQWdiRzlqYTJWa09pQWdJR1poYkhObExGeHVJQ0FnSUNBZ2RtRnNkV1U2SUNBZ0lHNTFiR3dzWEc0Z0lDQWdJQ0IwZVhCbE9pQWdJQ0FnSjJSaGVTZGNiaUFnSUNCOUxGeHVJQ0FnSUhKbGNHOXlkR1ZrWDJ4ME9pQjdYRzRnSUNBZ0lDQmthWE53YkdGNU9pQWdKMUpsY0c5eWRHVmtJR0psWm05eVpTY3NYRzRnSUNBZ0lDQnRZWFJqYUdWeWN6b2daR0YwWlY5dFlYUmphR1Z5Y3l4Y2JpQWdJQ0FnSUd4dlkydGxaRG9nSUNCbVlXeHpaU3hjYmlBZ0lDQWdJSFpoYkhWbE9pQWdJQ0J1ZFd4c0xGeHVJQ0FnSUNBZ2RIbHdaVG9nSUNBZ0lDZGtZWGtuWEc0Z0lDQWdmU3hjYmlBZ0lDQjFjR1JoZEdWa09pQjdYRzRnSUNBZ0lDQmthWE53YkdGNU9pQWdKMVZ3WkdGMFpXUWdiMjRuTEZ4dUlDQWdJQ0FnYldGMFkyaGxjbk02SUdSaGRHVmZiV0YwWTJobGNuTXNYRzRnSUNBZ0lDQnNiMk5yWldRNklDQWdabUZzYzJVc1hHNGdJQ0FnSUNCMllXeDFaVG9nSUNBZ2JuVnNiQ3hjYmlBZ0lDQWdJSFI1Y0dVNklDQWdJQ0FuWkdGNUp5eGNiaUFnSUNBZ0lHNWxaMkYwWlRvZ0lDQm1ZV3h6WlZ4dUlDQWdJSDBzWEc0Z0lDQWdkWEJrWVhSbFpGOWlaWFIzWldWdU9pQjdYRzRnSUNBZ0lDQmthWE53YkdGNU9pQWdKMVZ3WkdGMFpXUWdZbVYwZDJWbGJpY3NYRzRnSUNBZ0lDQnRZWFJqYUdWeWN6b2daR0YwWlY5dFlYUmphR1Z5Y3l4Y2JpQWdJQ0FnSUd4dlkydGxaRG9nSUNCbVlXeHpaU3hjYmlBZ0lDQWdJSFpoYkhWbE9pQWdJQ0JiWFN4Y2JpQWdJQ0FnSUhSNWNHVTZJQ0FnSUNBblpHRjBaWEpoYm1kbEoxeHVJQ0FnSUgwc1hHNGdJQ0FnZFhCa1lYUmxaRjluZERvZ2UxeHVJQ0FnSUNBZ1pHbHpjR3hoZVRvZ0lDZFZjR1JoZEdWa0lHRm1kR1Z5Snl4Y2JpQWdJQ0FnSUcxaGRHTm9aWEp6T2lCa1lYUmxYMjFoZEdOb1pYSnpMRnh1SUNBZ0lDQWdiRzlqYTJWa09pQWdJR1poYkhObExGeHVJQ0FnSUNBZ2RtRnNkV1U2SUNBZ0lHNTFiR3dzWEc0Z0lDQWdJQ0IwZVhCbE9pQWdJQ0FnSjJSaGVTZGNiaUFnSUNCOUxGeHVJQ0FnSUhWd1pHRjBaV1JmYkhRNklIdGNiaUFnSUNBZ0lHUnBjM0JzWVhrNklDQW5WWEJrWVhSbFpDQmlaV1p2Y21VbkxGeHVJQ0FnSUNBZ2JXRjBZMmhsY25NNklHUmhkR1ZmYldGMFkyaGxjbk1zWEc0Z0lDQWdJQ0JzYjJOclpXUTZJQ0FnWm1Gc2MyVXNYRzRnSUNBZ0lDQjJZV3gxWlRvZ0lDQWdiblZzYkN4Y2JpQWdJQ0FnSUhSNWNHVTZJQ0FnSUNBblpHRjVKMXh1SUNBZ0lIMHNYRzRnSUNBZ2RHRm5jem9nZTF4dUlDQWdJQ0FnWkdsemNHeGhlVG9nSUNkVVlXZHpKeXhjYmlBZ0lDQWdJR3h2WTJ0bFpEb2dJQ0JtWVd4elpTeGNiaUFnSUNBZ0lIUjVjR1U2SUNBZ0lDQW5kR0ZuSnl4Y2JpQWdJQ0FnSUc1bFoyRjBaVG9nSUNCbVlXeHpaU3hjYmlBZ0lDQWdJRzExYkhScE9pQWdJQ0IwY25WbFhHNGdJQ0FnZlN4Y2JpQWdJQ0J3Y21sdmNtbDBlVG9nZTF4dUlDQWdJQ0FnWkdsemNHeGhlVG9nSUNkUWNtbHZjbWwwZVNjc1hHNGdJQ0FnSUNCc2IyTnJaV1E2SUNBZ1ptRnNjMlVzWEc0Z0lDQWdJQ0IwZVhCbE9pQWdJQ0FnSjI1MWJXSmxjaWNzWEc0Z0lDQWdJQ0J1WldkaGRHVTZJQ0FnWm1Gc2MyVmNiaUFnSUNCOUxGeHVJQ0FnSUhCeWFXOXlhWFI1WDJkME9pQjdYRzRnSUNBZ0lDQmthWE53YkdGNU9pQWdKMUJ5YVc5eWFYUjVJR0ZpYjNabEp5eGNiaUFnSUNBZ0lHeHZZMnRsWkRvZ0lDQm1ZV3h6WlN4Y2JpQWdJQ0FnSUhSNWNHVTZJQ0FnSUNBbmJuVnRZbVZ5SjF4dUlDQWdJSDBzWEc0Z0lDQWdjSEpwYjNKcGRIbGZiSFE2SUh0Y2JpQWdJQ0FnSUdScGMzQnNZWGs2SUNBblVISnBiM0pwZEhrZ1ltVnNiM2NuTEZ4dUlDQWdJQ0FnYkc5amEyVmtPaUFnSUdaaGJITmxMRnh1SUNBZ0lDQWdkSGx3WlRvZ0lDQWdJQ2R1ZFcxaVpYSW5YRzRnSUNBZ2ZTeGNiaUFnSUNCcGMzTjFaVjkwZVhCbE9pQjdYRzRnSUNBZ0lDQmthWE53YkdGNU9pQWdKMGx6YzNWbElIUjVjR1VuTEZ4dUlDQWdJQ0FnYkc5amEyVmtPaUFnSUdaaGJITmxMRnh1SUNBZ0lDQWdkSGx3WlRvZ0lDQWdJQ2R6ZEhKcGJtY25MRnh1SUNBZ0lDQWdiWFZzZEdrNklDQWdJSFJ5ZFdWY2JpQWdJQ0I5TEZ4dUlDQWdJR2x6YzNWbFgzTjFZblI1Y0dVNklIdGNiaUFnSUNBZ0lHUnBjM0JzWVhrNklDQW5TWE56ZFdVZ2MzVmlkSGx3WlNjc1hHNGdJQ0FnSUNCc2IyTnJaV1E2SUNBZ1ptRnNjMlVzWEc0Z0lDQWdJQ0IwZVhCbE9pQWdJQ0FnSjNOMGNtbHVaeWNzWEc0Z0lDQWdJQ0J0ZFd4MGFUb2dJQ0FnZEhKMVpWeHVJQ0FnSUgxY2JpQWdmVnh1ZlR0Y2JseHVablZ1WTNScGIyNGdRblZwYkdSbGNpQW9ZM0pwZEdWeWFXRXBJSHRjYmlBZ2RHaHBjeTVqY21sMFpYSnBZU0FnSUQwZ1h5NWxlSFJsYm1Rb2UzMHNJR055YVhSbGNtbGhLVHRjYmlBZ2RHaHBjeTVtY21WbFgzUmxlSFFnSUQwZ2JuVnNiRHRjYm4xY2JseHVRblZwYkdSbGNpNXdjbTkwYjNSNWNHVXViV0YwWTJoRGNtbDBaWEpwWVNBOUlHWjFibU4wYVc5dUlDaHpkSEpwYm1jcElIdGNiaUFnWTI5dWMyOXNaUzUwYVcxbEtDZHRZWFJqYUVOeWFYUmxjbWxoSnlsY2JpQWdkbUZ5SUhKbGMzVnNkSE03WEc0Z0lIWmhjaUJ3WVhSMFpYSnVJQ0FnUFNBdkxpODdYRzRnSUhaaGNpQjJZV3gxWlhNZ0lDQWdQU0JiWFR0Y2JpQWdkbUZ5SUd0bGVYTWdJQ0FnSUNBOUlFOWlhbVZqZEM1clpYbHpLSFJvYVhNdVkzSnBkR1Z5YVdFcE8xeHVJQ0IyWVhJZ2RISjFkR2hVWlhOMElEMGdablZ1WTNScGIyNGdLQ2tnZTNKbGRIVnliaUIwY25WbE8zMDdYRzVjYmlBZ2FXWWdLSE4wY21sdVp5QW1KaUJ6ZEhKcGJtY3ViR1Z1WjNSb0lENGdNQ2tnZTF4dUlDQWdJSEJoZEhSbGNtNGdJQ0E5SUc1bGR5QlNaV2RGZUhBb1pYTmpZWEJsVW1WblpYZ29jM1J5YVc1bklIeDhJQ2NuS1N3Z0oya25LVHRjYmlBZ0lDQjBjblYwYUZSbGMzUWdQU0J3WVhSMFpYSnVMblJsYzNRdVltbHVaQ2h3WVhSMFpYSnVLVHRjYmlBZ2ZWeHVYRzRnSUd0bGVYTXVabTl5UldGamFDaG1kVzVqZEdsdmJpQW9hMlY1S1NCN1hHNGdJQ0FnZG1GeUlHMWhkR05vWlhKek8xeHVJQ0FnSUhaaGNpQnBPMXh1SUNBZ0lIWmhjaUJzWlc0N1hHNGdJQ0FnZG1GeUlHTnlhWFJsY21saElEMGdkR2hwY3k1amNtbDBaWEpwWVZ0clpYbGRPMXh1WEc0Z0lDQWdhV1lnS0NFZ2RHaHBjeTVwYzBGMllXbHNZV0pzWlNoclpYa3BLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tIUnlkWFJvVkdWemRDaHJaWGtwS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnZG1Gc2RXVnpMbkIxYzJnb2EyVjVLVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnBaaUFvZEhKMWRHaFVaWE4wS0NkYkp5QXJJR055YVhSbGNtbGhMbVJwYzNCc1lYa2dLeUFuWFNjcEtTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2RtRnNkV1Z6TG5CMWMyZ29hMlY1S1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0J0WVhSamFHVnljeUE5SUdOeWFYUmxjbWxoTG0xaGRHTm9aWEp6SUh4OElGdGRPMXh1WEc0Z0lDQWdabTl5SUNocElEMGdNQ3dnYkdWdUlEMGdiV0YwWTJobGNuTXViR1Z1WjNSb095QnBJRHdnYkdWdU95QnBLeXNwSUh0Y2JpQWdJQ0FnSUdsbUlDaHdZWFIwWlhKdUxuUmxjM1FvYldGMFkyaGxjbk5iYVYwcEtTQjdYRzRnSUNBZ0lDQWdJSFpoYkhWbGN5NXdkWE5vS0d0bGVTazdYRzVjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSFJ5ZFdVN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dUlDQjlMQ0IwYUdsektUdGNibHh1SUNCeVpYTjFiSFJ6SUQwZ1h5NXdhV05yS0hSb2FYTXVZM0pwZEdWeWFXRXNJSFpoYkhWbGN5azdYRzRnSUdOdmJuTnZiR1V1ZEdsdFpVVnVaQ2duYldGMFkyaERjbWwwWlhKcFlTY3BYRzVjYmlBZ2NtVjBkWEp1SUhKbGMzVnNkSE03WEc1OU8xeHVYRzVDZFdsc1pHVnlMbkJ5YjNSdmRIbHdaUzUwYjA5d2RHbHZibk1nUFNCbWRXNWpkR2x2YmlBb2MzUnlhVzVuS1NCN1hHNGdJSFpoY2lCeVpYTjFiSFJ6SUQwZ2RHaHBjeTV0WVhSamFFTnlhWFJsY21saEtITjBjbWx1WnlrN1hHNGdJSFpoY2lCdmNIUnBiMjV6SUQwZ1h5NXRZWEFvY21WemRXeDBjeXdnWm5WdVkzUnBiMjRnS0dsMFpXMHNJR3RsZVNrZ2UxeHVJQ0FnSUhKbGRIVnliaUI3ZG1Gc2RXVTZJR3RsZVN3Z2JHRmlaV3c2SUdsMFpXMHVaR2x6Y0d4aGVYMDdYRzRnSUgwcE8xeHVYRzRnSUdsbUlDaHpkSEpwYm1jZ0ppWWdJU0IwYUdsekxtWnlaV1ZmZEdWNGRDQW1KaUFoSUM5ZVhGeGJMeTUwWlhOMEtITjBjbWx1WnlrcElIdGNiaUFnSUNCdmNIUnBiMjV6TG5WdWMyaHBablFvZTF4dUlDQWdJQ0FnYkdGaVpXdzZJQ0J6ZEhKcGJtY3NYRzRnSUNBZ0lDQjJZV3gxWlRvZ0lITjBjbWx1WjF4dUlDQWdJSDBwTzF4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUc5d2RHbHZibk03WEc1OU8xeHVYRzVDZFdsc1pHVnlMbkJ5YjNSdmRIbHdaUzV6WlhRZ1BTQm1kVzVqZEdsdmJpQW9hMlY1TENCd2NtOXdMQ0IyWVd4MVpTa2dlMXh1SUNCcFppQW9JU0JyWlhrZ2ZId2dJU0J3Y205d0tTQjdYRzRnSUNBZ2RHaHliM2NnSjJ0bGVTQmhibVFnY0hKdmNDQmhjbVVnY21WeGRXbHlaV1FuTzF4dUlDQjlYRzVjYmlBZ2FXWWdLSFJvYVhNdVkzSnBkR1Z5YVdFdWFHRnpUM2R1VUhKdmNHVnlkSGtvYTJWNUtTa2dlMXh1SUNBZ0lIUm9hWE11WTNKcGRHVnlhV0ZiYTJWNVhWdHdjbTl3WFNBOUlIWmhiSFZsTzF4dVhHNGdJQ0FnY21WMGRYSnVJSFJ5ZFdVN1hHNGdJSDFjYm4wN1hHNWNia0oxYVd4a1pYSXVjSEp2ZEc5MGVYQmxMblZ6WlNBOUlHWjFibU4wYVc5dUlDaHJaWGtwSUh0Y2JpQWdjbVYwZFhKdUlIUm9hWE11YzJWMEtHdGxlU3dnSjNWelpXUW5MQ0IwY25WbEtUdGNibjA3WEc1Y2JrSjFhV3hrWlhJdWNISnZkRzkwZVhCbExuSmxablZ1WkNBOUlHWjFibU4wYVc5dUlDaHJaWGtwSUh0Y2JpQWdjbVYwZFhKdUlIUm9hWE11YzJWMEtHdGxlU3dnSjNWelpXUW5LVHRjYm4wN1hHNWNia0oxYVd4a1pYSXVjSEp2ZEc5MGVYQmxMbXh2WTJzZ1BTQm1kVzVqZEdsdmJpQW9hMlY1S1NCN1hHNGdJSEpsZEhWeWJpQjBhR2x6TG5ObGRDaHJaWGtzSUNkc2IyTnJaV1FuTENCMGNuVmxLVHRjYm4wN1hHNWNia0oxYVd4a1pYSXVjSEp2ZEc5MGVYQmxMblZ1Ykc5amF5QTlJR1oxYm1OMGFXOXVJQ2hyWlhrcElIdGNiaUFnY21WMGRYSnVJSFJvYVhNdWMyVjBLR3RsZVN3Z0oyeHZZMnRsWkNjc0lHWmhiSE5sS1R0Y2JuMDdYRzVjYmtKMWFXeGtaWEl1Y0hKdmRHOTBlWEJsTG1selFYWmhhV3hoWW14bElEMGdablZ1WTNScGIyNGdLR3RsZVNrZ2UxeHVJQ0IyWVhJZ1kzSnBkR1Z5YVdFZ1BTQjBhR2x6TG1OeWFYUmxjbWxoVzJ0bGVWMDdYRzVjYmlBZ2FXWWdLQ0VnWTNKcGRHVnlhV0VwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hHNGdJSDFjYmx4dUlDQnlaWFIxY200Z0lTQmpjbWwwWlhKcFlTNXNiMk5yWldRZ0ppWWdJU0JqY21sMFpYSnBZUzUxYzJWa08xeHVmVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCN1hHNGdJR1JsWm1sdWFYUnBiMjQ2SUdSbFptbHVhWFJwYjI0dVkzSnBkR1Z5YVdFc1hHNGdJRUoxYVd4a1pYSTZJRUoxYVd4a1pYSmNibjA3WEc0aVhYMD0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEJhY2tib25lICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgTW9kZWwgICAgID0gcmVxdWlyZSgnLi9oZWFkaW5nX21vZGVsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuICBtb2RlbDogTW9kZWwsXG4gIGxpbmtTaWJsaW5nczogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoaGVhZGVyLCBpbmRleCkge1xuICAgICAgaGVhZGVyLnByZXYgPSB0aGlzLmF0KGluZGV4IC0gMSk7XG4gICAgICBoZWFkZXIubmV4dCA9IHRoaXMuYXQoaW5kZXggKyAxKTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcbiAgcmVnaXN0ZXJXaXRoRGlzcGF0Y2hlcjogZnVuY3Rpb24gKGRpc3BhdGNoZXIpIHtcbiAgICB0aGlzLmRpc3BhdGNoX3Rva2VuID0gZGlzcGF0aGVyLnJlZ2lzdGVyKGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICBjb25zb2xlLmxvZyhwYXlsb2FkKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9XG59KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdlkyRnpaWE12YUdWaFpHbHVaMTlqYjJ4c1pXTjBhVzl1TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRmxCUVZrc1EwRkJRenM3UVVGRllpeEpRVUZKTEZGQlFWRXNTVUZCU1N4UFFVRlBMRU5CUVVNc1ZVRkJWU3hEUVVGRExFTkJRVU03UVVGRGNFTXNTVUZCU1N4TFFVRkxMRTlCUVU4c1QwRkJUeXhEUVVGRExHbENRVUZwUWl4RFFVRkRMRU5CUVVNN08wRkJSVE5ETEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1VVRkJVU3hEUVVGRExGVkJRVlVzUTBGQlF5eE5RVUZOTEVOQlFVTTdSVUZETVVNc1MwRkJTeXhGUVVGRkxFdEJRVXM3UlVGRFdpeFpRVUZaTEVWQlFVVXNXVUZCV1R0SlFVTjRRaXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEZWQlFWVXNUVUZCVFN4RlFVRkZMRXRCUVVzc1JVRkJSVHROUVVOcVF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4SFFVRkhMRWxCUVVrc1EwRkJReXhGUVVGRkxFTkJRVU1zUzBGQlN5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRPMDFCUTJwRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRMRVZCUVVVc1EwRkJReXhMUVVGTExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdTMEZEYkVNc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dEhRVU5XTzBWQlEwUXNjMEpCUVhOQ0xFVkJRVVVzVlVGQlZTeFZRVUZWTEVWQlFVVTdTVUZETlVNc1NVRkJTU3hEUVVGRExHTkJRV01zUjBGQlJ5eFRRVUZUTEVOQlFVTXNVVUZCVVN4RFFVRkRMRlZCUVZVc1QwRkJUeXhGUVVGRk8wMUJRekZFTEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UzBGRGRFSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF6dEhRVU5tTzBOQlEwWXNRMEZCUXl4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpWENKMWMyVWdjM1J5YVdOMFhDSTdYRzVjYm5aaGNpQkNZV05yWW05dVpTQWdQU0J5WlhGMWFYSmxLQ2RpWVdOclltOXVaU2NwTzF4dWRtRnlJRTF2WkdWc0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dmFHVmhaR2x1WjE5dGIyUmxiQ2NwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFSmhZMnRpYjI1bExrTnZiR3hsWTNScGIyNHVaWGgwWlc1a0tIdGNiaUFnYlc5a1pXdzZJRTF2WkdWc0xGeHVJQ0JzYVc1clUybGliR2x1WjNNNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjBhR2x6TG1WaFkyZ29ablZ1WTNScGIyNGdLR2hsWVdSbGNpd2dhVzVrWlhncElIdGNiaUFnSUNBZ0lHaGxZV1JsY2k1d2NtVjJJRDBnZEdocGN5NWhkQ2hwYm1SbGVDQXRJREVwTzF4dUlDQWdJQ0FnYUdWaFpHVnlMbTVsZUhRZ1BTQjBhR2x6TG1GMEtHbHVaR1Y0SUNzZ01TazdYRzRnSUNBZ2ZTd2dkR2hwY3lrN1hHNGdJSDBzWEc0Z0lISmxaMmx6ZEdWeVYybDBhRVJwYzNCaGRHTm9aWEk2SUdaMWJtTjBhVzl1SUNoa2FYTndZWFJqYUdWeUtTQjdYRzRnSUNBZ2RHaHBjeTVrYVhOd1lYUmphRjkwYjJ0bGJpQTlJR1JwYzNCaGRHaGxjaTV5WldkcGMzUmxjaWhtZFc1amRHbHZiaUFvY0dGNWJHOWhaQ2tnZTF4dUlDQWdJQ0FnWTI5dWMyOXNaUzVzYjJjb2NHRjViRzloWkNrN1hHNGdJQ0FnZlM1aWFXNWtLSFJvYVhNcEtUdGNiaUFnZlZ4dWZTazdYRzRpWFgwPSIsInZhciBNb2RlbDtcbnZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG5cbk1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgZGVmYXVsdHM6IHtcbiAgICBkaXJlY3Rpb246ICBudWxsLFxuICAgIGxvY2tlZDogICAgIGZhbHNlLFxuICAgIG1pbmltYWw6ICAgIGZhbHNlLFxuICAgIG5hbWU6ICAgICAgIG51bGwsXG4gICAgcmVzaXphYmxlOiAgZmFsc2UsXG4gICAgc29ydGFibGU6ICAgZmFsc2UsXG4gICAgdGl0bGU6ICAgICAgbnVsbCxcbiAgICB3aWR0aDogICAgICBudWxsXG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WTJGelpYTXZhR1ZoWkdsdVoxOXRiMlJsYkM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hKUVVGSkxFdEJRVXNzUTBGQlF6dEJRVU5XTEVsQlFVa3NVVUZCVVN4SFFVRkhMRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6czdRVUZGYmtNc1MwRkJTeXhIUVVGSExGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4RFFVRkRPMFZCUXpWQ0xGRkJRVkVzUlVGQlJUdEpRVU5TTEZOQlFWTXNSMEZCUnl4SlFVRkpPMGxCUTJoQ0xFMUJRVTBzVFVGQlRTeExRVUZMTzBsQlEycENMRTlCUVU4c1MwRkJTeXhMUVVGTE8wbEJRMnBDTEVsQlFVa3NVVUZCVVN4SlFVRkpPMGxCUTJoQ0xGTkJRVk1zUjBGQlJ5eExRVUZMTzBsQlEycENMRkZCUVZFc1NVRkJTU3hMUVVGTE8wbEJRMnBDTEV0QlFVc3NUMEZCVHl4SlFVRkpPMGxCUTJoQ0xFdEJRVXNzVDBGQlR5eEpRVUZKTzBkQlEycENPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhMUVVGTExFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKMllYSWdUVzlrWld3N1hHNTJZWElnUW1GamEySnZibVVnUFNCeVpYRjFhWEpsS0NkaVlXTnJZbTl1WlNjcE8xeHVYRzVOYjJSbGJDQTlJRUpoWTJ0aWIyNWxMazF2WkdWc0xtVjRkR1Z1WkNoN1hHNGdJR1JsWm1GMWJIUnpPaUI3WEc0Z0lDQWdaR2x5WldOMGFXOXVPaUFnYm5Wc2JDeGNiaUFnSUNCc2IyTnJaV1E2SUNBZ0lDQm1ZV3h6WlN4Y2JpQWdJQ0J0YVc1cGJXRnNPaUFnSUNCbVlXeHpaU3hjYmlBZ0lDQnVZVzFsT2lBZ0lDQWdJQ0J1ZFd4c0xGeHVJQ0FnSUhKbGMybDZZV0pzWlRvZ0lHWmhiSE5sTEZ4dUlDQWdJSE52Y25SaFlteGxPaUFnSUdaaGJITmxMRnh1SUNBZ0lIUnBkR3hsT2lBZ0lDQWdJRzUxYkd3c1hHNGdJQ0FnZDJsa2RHZzZJQ0FnSUNBZ2JuVnNiRnh1SUNCOVhHNTlLVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCTmIyUmxiRHRjYmlKZGZRPT0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIEljb25XcmFwcGVyO1xudmFyIG1hcHBpbmdzO1xudmFyIF8gICAgID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyIEljb24gID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9pY29uLmpzeCcpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuLyoqXG4gKiBBbGxvd3MgbWFwcGluZyBhIGNhc2Ugc3RhdHVzIHRvIGEgcGFydGljdWxhciBpY29uIHR5cGVcbiAqL1xubWFwcGluZ3MgPSB7XG4gIGFjdGl2ZTogICAncGxheS1jaXJjbGUnLFxuICBjbG9zZWQ6ICAgJ3RpbWVzLWNpcmNsZScsXG4gIG9wZW46ICAgICAnY2lyY2xlLW8nLFxuICByZXNvbHZlZDogJ2NoZWNrLWNpcmNsZSdcbn07XG5cbi8qKlxuICogV3JhcHMgdGhlIEljb24gY29tcG9uZW50LCBzZWUgdGhhdCBjb21wb25lbnQgZm9yIHVzYWdlIGV4YW1wbGVzXG4gKi9cbkljb25XcmFwcGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkljb25XcmFwcGVyXCIsXG4gIG1peGluczogW1JlYWN0LmFkZG9ucy5QdXJlUmVuZGVyTWl4aW5dLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbmV3UHJvcHMgPSBfLmV4dGVuZCh7fSwgdGhpcy5wcm9wcyk7XG5cbiAgICBuZXdQcm9wcy50eXBlID0gbWFwcGluZ3NbbmV3UHJvcHMudHlwZV0gfHwgbmV3UHJvcHMudHlwZTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIFJlYWN0Ll9fc3ByZWFkKHt9LCAgbmV3UHJvcHMpKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEljb25XcmFwcGVyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WTJGelpYTXZhV052Ymw5M2NtRndjR1Z5TG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHM3UVVGRlFTeEhRVUZIT3p0QlFVVklMRWxCUVVrc1YwRkJWeXhEUVVGRE8wRkJRMmhDTEVsQlFVa3NVVUZCVVN4RFFVRkRPMEZCUTJJc1NVRkJTU3hEUVVGRExFOUJRVThzVDBGQlR5eERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPMEZCUTJ4RExFbEJRVWtzU1VGQlNTeEpRVUZKTEU5QlFVOHNRMEZCUXl3eVFrRkJNa0lzUTBGQlF5eERRVUZETzBGQlEycEVMRWxCUVVrc1MwRkJTeXhIUVVGSExFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXpzN1FVRkZOMEk3TzBkQlJVYzdRVUZEU0N4UlFVRlJMRWRCUVVjN1JVRkRWQ3hOUVVGTkxFbEJRVWtzWVVGQllUdEZRVU4yUWl4TlFVRk5MRWxCUVVrc1kwRkJZenRGUVVONFFpeEpRVUZKTEUxQlFVMHNWVUZCVlR0RlFVTndRaXhSUVVGUkxFVkJRVVVzWTBGQll6dEJRVU14UWl4RFFVRkRMRU5CUVVNN08wRkJSVVk3TzBkQlJVYzdRVUZEU0N4cFEwRkJhVU1zTWtKQlFVRTdSVUZETDBJc1RVRkJUU3hGUVVGRkxFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXl4bFFVRmxMRU5CUVVNN1JVRkRkRU1zVFVGQlRTeEZRVUZGTEZsQlFWazdRVUZEZEVJc1NVRkJTU3hKUVVGSkxGRkJRVkVzUjBGQlJ5eERRVUZETEVOQlFVTXNUVUZCVFN4RFFVRkRMRVZCUVVVc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdPMEZCUlRWRExFbEJRVWtzVVVGQlVTeERRVUZETEVsQlFVa3NSMEZCUnl4UlFVRlJMRU5CUVVNc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEZGQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNN08wbEJSWHBFTzAxQlEwVXNiMEpCUVVNc1NVRkJTU3hGUVVGQkxHZENRVUZCTEVkQlFVRXNRMEZCUlN4SFFVRkhMRkZCUVZNc1EwRkJRU3hEUVVGSExFTkJRVUU3VFVGRGRFSTdSMEZEU0R0QlFVTklMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZJTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1YwRkJWeXhEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeW9xWEc0Z0tpQkFhbk40SUZKbFlXTjBMa1JQVFZ4dUlDb3ZYRzVjYm5aaGNpQkpZMjl1VjNKaGNIQmxjanRjYm5aaGNpQnRZWEJ3YVc1bmN6dGNiblpoY2lCZklDQWdJQ0E5SUhKbGNYVnBjbVVvSjNWdVpHVnljMk52Y21VbktUdGNiblpoY2lCSlkyOXVJQ0E5SUhKbGNYVnBjbVVvSnk0dUx5NHVMMk52YlhCdmJtVnVkSE12YVdOdmJpNXFjM2duS1R0Y2JuWmhjaUJTWldGamRDQTlJSEpsY1hWcGNtVW9KM0psWVdOMEp5azdYRzVjYmk4cUtseHVJQ29nUVd4c2IzZHpJRzFoY0hCcGJtY2dZU0JqWVhObElITjBZWFIxY3lCMGJ5QmhJSEJoY25ScFkzVnNZWElnYVdOdmJpQjBlWEJsWEc0Z0tpOWNibTFoY0hCcGJtZHpJRDBnZTF4dUlDQmhZM1JwZG1VNklDQWdKM0JzWVhrdFkybHlZMnhsSnl4Y2JpQWdZMnh2YzJWa09pQWdJQ2QwYVcxbGN5MWphWEpqYkdVbkxGeHVJQ0J2Y0dWdU9pQWdJQ0FnSjJOcGNtTnNaUzF2Snl4Y2JpQWdjbVZ6YjJ4MlpXUTZJQ2RqYUdWamF5MWphWEpqYkdVblhHNTlPMXh1WEc0dktpcGNiaUFxSUZkeVlYQnpJSFJvWlNCSlkyOXVJR052YlhCdmJtVnVkQ3dnYzJWbElIUm9ZWFFnWTI5dGNHOXVaVzUwSUdadmNpQjFjMkZuWlNCbGVHRnRjR3hsYzF4dUlDb3ZYRzVKWTI5dVYzSmhjSEJsY2lBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNiaUFnYldsNGFXNXpPaUJiVW1WaFkzUXVZV1JrYjI1ekxsQjFjbVZTWlc1a1pYSk5hWGhwYmwwc1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCdVpYZFFjbTl3Y3lBOUlGOHVaWGgwWlc1a0tIdDlMQ0IwYUdsekxuQnliM0J6S1R0Y2JseHVJQ0FnSUc1bGQxQnliM0J6TG5SNWNHVWdQU0J0WVhCd2FXNW5jMXR1WlhkUWNtOXdjeTUwZVhCbFhTQjhmQ0J1WlhkUWNtOXdjeTUwZVhCbE8xeHVYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4SlkyOXVJSHN1TGk1dVpYZFFjbTl3YzMwZ0x6NWNiaUFnSUNBcE8xeHVJQ0I5WEc1OUtUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JKWTI5dVYzSmhjSEJsY2p0Y2JpSmRmUT09IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRpc3BhdGNoZXI6ICAgICAgIHJlcXVpcmUoJy4vZGlzcGF0Y2hlcicpLFxuICBDYXNlTW9kZWw6ICAgICAgICByZXF1aXJlKCcuL2Nhc2VfbW9kZWwnKSxcbiAgQ2FzZUNvbGxlY3Rpb246ICAgcmVxdWlyZSgnLi9jYXNlX2NvbGxlY3Rpb24nKSxcbiAgTGlzdFZpZXc6ICAgICAgICAgcmVxdWlyZSgnLi9saXN0X3ZpZXcuanN4JyksXG4gIGxpc3Rfdmlld19zdG9yZTogIHJlcXVpcmUoJy4vbGlzdF92aWV3X3N0b3JlJylcbn07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZZMkZ6WlhNdmFXNWtaWGd1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSenRGUVVObUxGVkJRVlVzVVVGQlVTeFBRVUZQTEVOQlFVTXNZMEZCWXl4RFFVRkRPMFZCUTNwRExGTkJRVk1zVTBGQlV5eFBRVUZQTEVOQlFVTXNZMEZCWXl4RFFVRkRPMFZCUTNwRExHTkJRV01zU1VGQlNTeFBRVUZQTEVOQlFVTXNiVUpCUVcxQ0xFTkJRVU03UlVGRE9VTXNVVUZCVVN4VlFVRlZMRTlCUVU4c1EwRkJReXhwUWtGQmFVSXNRMEZCUXp0RlFVTTFReXhsUVVGbExFZEJRVWNzVDBGQlR5eERRVUZETEcxQ1FVRnRRaXhEUVVGRE8wTkJReTlETEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUp0YjJSMWJHVXVaWGh3YjNKMGN5QTlJSHRjYmlBZ1pHbHpjR0YwWTJobGNqb2dJQ0FnSUNBZ2NtVnhkV2x5WlNnbkxpOWthWE53WVhSamFHVnlKeWtzWEc0Z0lFTmhjMlZOYjJSbGJEb2dJQ0FnSUNBZ0lISmxjWFZwY21Vb0p5NHZZMkZ6WlY5dGIyUmxiQ2NwTEZ4dUlDQkRZWE5sUTI5c2JHVmpkR2x2YmpvZ0lDQnlaWEYxYVhKbEtDY3VMMk5oYzJWZlkyOXNiR1ZqZEdsdmJpY3BMRnh1SUNCTWFYTjBWbWxsZHpvZ0lDQWdJQ0FnSUNCeVpYRjFhWEpsS0NjdUwyeHBjM1JmZG1sbGR5NXFjM2duS1N4Y2JpQWdiR2x6ZEY5MmFXVjNYM04wYjNKbE9pQWdjbVZ4ZFdseVpTZ25MaTlzYVhOMFgzWnBaWGRmYzNSdmNtVW5LVnh1ZlR0Y2JpSmRmUT09IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBMaXN0RmlsdGVyO1xudmFyIFJlYWN0ICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBCYWNrYm9uZSAgICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgSWNvbiAgICAgICAgPSByZXF1aXJlKCcuL2ljb25fd3JhcHBlci5qc3gnKTtcbnZhciBEcm9wZG93biAgICA9IHJlcXVpcmUoJy4vZHJvcGRvd24uanN4Jyk7XG52YXIgRmlsdGVyQm94ICAgPSByZXF1aXJlKCcuL2ZpbHRlcl9ib3guanN4Jyk7XG52YXIgY3JpdGVyaWEgICAgPSByZXF1aXJlKCcuL2ZpbHRlcl9ib3hfZGVmaW5pdGlvbicpO1xuXG5MaXN0RmlsdGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkxpc3RGaWx0ZXJcIixcbiAgcHJvcFR5cGVzOiB7XG4gICAgc3RvcmU6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEJhY2tib25lLk1vZGVsKS5pc1JlcXVpcmVkXG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjaG9pY2VzO1xuICAgIHZhciBidWlsZGVyID0gbmV3IGNyaXRlcmlhLkJ1aWxkZXIoY3JpdGVyaWEuZGVmaW5pdGlvbik7XG5cbiAgICBjaG9pY2VzID0gW1xuICAgICAge3RleHQ6ICdOZXcgZnJvbSBjdXJyZW50Li4uJ30sXG4gICAgICB7dGV4dDogJ05ldyBmcm9tIGJsYW5rLi4uJ30sXG4gICAgICB7c2VwYXJhdG9yOiB0cnVlfSxcbiAgICAgIHt0ZXh0OiAnTmV3ZXN0IGNhc2VzJ30sXG4gICAgICB7dGV4dDogJ0Nhc2VzIG9wZW5lZCBieSBtZSd9LFxuICAgICAge3RleHQ6ICdDbG9zZWQgY2FzZXMnfVxuICAgIF07XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImNhcHRpb25cIiwge2NsYXNzTmFtZTogXCJsaXN0LWZpbHRlclwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJmaWx0ZXItc2VsZWN0aW9uXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwge2NsYXNzTmFtZTogXCJwdWxsLXJpZ2h0IGlubGluZVwifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgXCJRdWljayBmaWx0ZXJzOlwiKSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRHJvcGRvd24sIHtzZWxlY3RlZDogXCJBY3RpdmUgY2FzZXNcIiwgYWxpZ246IFwicmlnaHRcIiwgY2hvaWNlczogY2hvaWNlc30pXG4gICAgICAgICAgICApLCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7Y2xhc3NOYW1lOiBcImljb24tZ3JvdXBcIn0sIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7b25DbGljazogdGhpcy5fc2F2ZUZpbHRlcn0sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IFwic2F2ZVwiLCBzaXplOiBcImxnXCJ9KSksIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7b25DbGljazogdGhpcy5fZGVsZXRlRmlsdGVyfSwgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogXCJ0cmFzaC1vXCIsIHNpemU6IFwibGdcIn0pKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGaWx0ZXJCb3gsIHtjcml0ZXJpYTogYnVpbGRlcn0pXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdEZpbHRlcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyMXZaSFZzWlhNdlkyRnpaWE12YkdsemRGOW1hV3gwWlhJdWFuTjRJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCT3p0QlFVVkJMRWRCUVVjN08wRkJSVWdzU1VGQlNTeFZRVUZWTEVOQlFVTTdRVUZEWml4SlFVRkpMRXRCUVVzc1UwRkJVeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdRVUZEYmtNc1NVRkJTU3hSUVVGUkxFMUJRVTBzVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPMEZCUTNSRExFbEJRVWtzU1VGQlNTeFZRVUZWTEU5QlFVOHNRMEZCUXl4dlFrRkJiMElzUTBGQlF5eERRVUZETzBGQlEyaEVMRWxCUVVrc1VVRkJVU3hOUVVGTkxFOUJRVThzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhEUVVGRE8wRkJRelZETEVsQlFVa3NVMEZCVXl4TFFVRkxMRTlCUVU4c1EwRkJReXhyUWtGQmEwSXNRMEZCUXl4RFFVRkRPMEZCUXpsRExFbEJRVWtzVVVGQlVTeE5RVUZOTEU5QlFVOHNRMEZCUXl4NVFrRkJlVUlzUTBGQlF5eERRVUZET3p0QlFVVnlSQ3huUTBGQlowTXNNRUpCUVVFN1JVRkRPVUlzVTBGQlV5eEZRVUZGTzBsQlExUXNTMEZCU3l4RlFVRkZMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zVlVGQlZTeERRVUZETEZGQlFWRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhWUVVGVk8wZEJRemRFTzBWQlEwUXNUVUZCVFN4RlFVRkZMRmxCUVZrN1NVRkRiRUlzU1VGQlNTeFBRVUZQTEVOQlFVTTdRVUZEYUVJc1NVRkJTU3hKUVVGSkxFOUJRVThzUjBGQlJ5eEpRVUZKTEZGQlFWRXNRMEZCUXl4UFFVRlBMRU5CUVVNc1VVRkJVU3hEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZET3p0SlFVVjRSQ3hQUVVGUExFZEJRVWM3VFVGRFVpeERRVUZETEVsQlFVa3NSVUZCUlN4eFFrRkJjVUlzUTBGQlF6dE5RVU0zUWl4RFFVRkRMRWxCUVVrc1JVRkJSU3h0UWtGQmJVSXNRMEZCUXp0TlFVTXpRaXhEUVVGRExGTkJRVk1zUlVGQlJTeEpRVUZKTEVOQlFVTTdUVUZEYWtJc1EwRkJReXhKUVVGSkxFVkJRVVVzWTBGQll5eERRVUZETzAxQlEzUkNMRU5CUVVNc1NVRkJTU3hGUVVGRkxHOUNRVUZ2UWl4RFFVRkRPMDFCUXpWQ0xFTkJRVU1zU1VGQlNTeEZRVUZGTEdOQlFXTXNRMEZCUXp0QlFVTTFRaXhMUVVGTExFTkJRVU03TzBsQlJVWTdUVUZEUlN4dlFrRkJRU3hUUVVGUkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMR0ZCUVdNc1EwRkJRU3hGUVVGQk8xRkJReTlDTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNhMEpCUVcxQ0xFTkJRVUVzUlVGQlFUdFZRVU5vUXl4dlFrRkJRU3hKUVVGSExFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRzFDUVVGdlFpeERRVUZCTEVWQlFVRTdXVUZEYUVNc2IwSkJRVUVzU1VGQlJ5eEZRVUZCTEVsQlFVTXNSVUZCUVN4blFrRkJiVUlzUTBGQlFTeEZRVUZCTzFsQlEzWkNMRzlDUVVGQkxFbEJRVWNzUlVGQlFTeEpRVUZETEVWQlFVRTdZMEZEUml4dlFrRkJReXhSUVVGUkxFVkJRVUVzUTBGQlFTeERRVUZETEZGQlFVRXNSVUZCVVN4RFFVRkRMR05CUVVFc1JVRkJZeXhEUVVGRExFdEJRVUVzUlVGQlN5eERRVUZETEU5QlFVRXNSVUZCVHl4RFFVRkRMRTlCUVVFc1JVRkJUeXhEUVVGRkxFOUJRVkVzUTBGQlFTeERRVUZITEVOQlFVRTdXVUZEYWtVc1EwRkJRU3hGUVVGQk8xbEJRMHdzYjBKQlFVRXNTVUZCUnl4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eFpRVUZoTEVOQlFVRXNSVUZCUVR0alFVTjZRaXh2UWtGQlFTeEhRVUZGTEVWQlFVRXNRMEZCUVN4RFFVRkRMRTlCUVVFc1JVRkJUeXhEUVVGRkxFbEJRVWtzUTBGQlF5eFhRVUZoTEVOQlFVRXNSVUZCUVN4dlFrRkJReXhKUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEVsQlFVRXNSVUZCU1N4RFFVRkRMRTFCUVVFc1JVRkJUU3hEUVVGRExFbEJRVUVzUlVGQlNTeERRVUZETEVsQlFVa3NRMEZCUVN4RFFVRkhMRU5CUVVrc1EwRkJRU3hGUVVGQk8yTkJRMmhGTEc5Q1FVRkJMRWRCUVVVc1JVRkJRU3hEUVVGQkxFTkJRVU1zVDBGQlFTeEZRVUZQTEVOQlFVVXNTVUZCU1N4RFFVRkRMR0ZCUVdVc1EwRkJRU3hGUVVGQkxHOUNRVUZETEVsQlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1NVRkJRU3hGUVVGSkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNTVUZCUVN4RlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGQkxFTkJRVWNzUTBGQlNTeERRVUZCTzFsQlEyeEZMRU5CUVVFN1ZVRkRSaXhEUVVGQk8wRkJRMllzVVVGQll5eERRVUZCTEVWQlFVRTdPMUZCUlU0c2IwSkJRVU1zVTBGQlV5eEZRVUZCTEVOQlFVRXNRMEZCUXl4UlFVRkJMRVZCUVZFc1EwRkJSU3hQUVVGUkxFTkJRVUVzUTBGQlJ5eERRVUZCTzAxQlEzaENMRU5CUVVFN1RVRkRWanRIUVVOSU8wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFZRVUZWTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRXhwYzNSR2FXeDBaWEk3WEc1MllYSWdVbVZoWTNRZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQ2NwTzF4dWRtRnlJRUpoWTJ0aWIyNWxJQ0FnSUQwZ2NtVnhkV2x5WlNnblltRmphMkp2Ym1VbktUdGNiblpoY2lCSlkyOXVJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR2YVdOdmJsOTNjbUZ3Y0dWeUxtcHplQ2NwTzF4dWRtRnlJRVJ5YjNCa2IzZHVJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpOWtjbTl3Wkc5M2JpNXFjM2duS1R0Y2JuWmhjaUJHYVd4MFpYSkNiM2dnSUNBOUlISmxjWFZwY21Vb0p5NHZabWxzZEdWeVgySnZlQzVxYzNnbktUdGNiblpoY2lCamNtbDBaWEpwWVNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR2Wm1sc2RHVnlYMkp2ZUY5a1pXWnBibWwwYVc5dUp5azdYRzVjYmt4cGMzUkdhV3gwWlhJZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUhCeWIzQlVlWEJsY3pvZ2UxeHVJQ0FnSUhOMGIzSmxPaUJTWldGamRDNVFjbTl3Vkhsd1pYTXVhVzV6ZEdGdVkyVlBaaWhDWVdOclltOXVaUzVOYjJSbGJDa3VhWE5TWlhGMWFYSmxaRnh1SUNCOUxGeHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ1kyaHZhV05sY3p0Y2JpQWdJQ0IyWVhJZ1luVnBiR1JsY2lBOUlHNWxkeUJqY21sMFpYSnBZUzVDZFdsc1pHVnlLR055YVhSbGNtbGhMbVJsWm1sdWFYUnBiMjRwTzF4dVhHNGdJQ0FnWTJodmFXTmxjeUE5SUZ0Y2JpQWdJQ0FnSUh0MFpYaDBPaUFuVG1WM0lHWnliMjBnWTNWeWNtVnVkQzR1TGlkOUxGeHVJQ0FnSUNBZ2UzUmxlSFE2SUNkT1pYY2dabkp2YlNCaWJHRnVheTR1TGlkOUxGeHVJQ0FnSUNBZ2UzTmxjR0Z5WVhSdmNqb2dkSEoxWlgwc1hHNGdJQ0FnSUNCN2RHVjRkRG9nSjA1bGQyVnpkQ0JqWVhObGN5ZDlMRnh1SUNBZ0lDQWdlM1JsZUhRNklDZERZWE5sY3lCdmNHVnVaV1FnWW5rZ2JXVW5mU3hjYmlBZ0lDQWdJSHQwWlhoME9pQW5RMnh2YzJWa0lHTmhjMlZ6SjMxY2JpQWdJQ0JkTzF4dVhHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHhqWVhCMGFXOXVJR05zWVhOelRtRnRaVDFjSW14cGMzUXRabWxzZEdWeVhDSStYRzRnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2labWxzZEdWeUxYTmxiR1ZqZEdsdmJsd2lQbHh1SUNBZ0lDQWdJQ0FnSUR4MWJDQmpiR0Z6YzA1aGJXVTlYQ0p3ZFd4c0xYSnBaMmgwSUdsdWJHbHVaVndpUGx4dUlDQWdJQ0FnSUNBZ0lDQWdQR3hwUGxGMWFXTnJJR1pwYkhSbGNuTTZQQzlzYVQ1Y2JpQWdJQ0FnSUNBZ0lDQWdJRHhzYVQ1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEVSeWIzQmtiM2R1SUhObGJHVmpkR1ZrUFZ3aVFXTjBhWFpsSUdOaGMyVnpYQ0lnWVd4cFoyNDlYQ0p5YVdkb2RGd2lJR05vYjJsalpYTTllMk5vYjJsalpYTjlJQzgrWEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMnhwUGx4dUlDQWdJQ0FnSUNBZ0lDQWdQR3hwSUdOc1lYTnpUbUZ0WlQxY0ltbGpiMjR0WjNKdmRYQmNJajVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdQR0VnYjI1RGJHbGphejE3ZEdocGN5NWZjMkYyWlVacGJIUmxjbjArUEVsamIyNGdkSGx3WlQxY0luTmhkbVZjSWlCemFYcGxQVndpYkdkY0lpQXZQand2WVQ1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdFZ2IyNURiR2xqYXoxN2RHaHBjeTVmWkdWc1pYUmxSbWxzZEdWeWZUNDhTV052YmlCMGVYQmxQVndpZEhKaGMyZ3RiMXdpSUhOcGVtVTlYQ0pzWjF3aUlDOCtQQzloUGx4dUlDQWdJQ0FnSUNBZ0lDQWdQQzlzYVQ1Y2JpQWdJQ0FnSUNBZ0lDQThMM1ZzUGx4dUlDQWdJQ0FnSUNBOEwyUnBkajVjYmx4dUlDQWdJQ0FnSUNBOFJtbHNkR1Z5UW05NElHTnlhWFJsY21saFBYdGlkV2xzWkdWeWZTQXZQbHh1SUNBZ0lDQWdQQzlqWVhCMGFXOXVQbHh1SUNBZ0lDazdYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUV4cGMzUkdhV3gwWlhJN1hHNGlYWDA9IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBMaXN0Um93O1xudmFyIF8gICAgICAgICAgICAgPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG52YXIgUmVhY3QgICAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgQmFja2JvbmUgICAgICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgSGVhZGluZ01vZGVsICA9IHJlcXVpcmUoJy4vaGVhZGluZ19tb2RlbCcpO1xudmFyIENhc2VNb2RlbCAgICAgPSByZXF1aXJlKCcuL2Nhc2VfbW9kZWwnKTtcbnZhciBUciAgICAgICAgICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy90ci5qc3gnKTtcbnZhciBUZCAgICAgICAgICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy90ZC5qc3gnKTtcbnZhciB0cmFuc2Zvcm1lcnMgID0gcmVxdWlyZSgnLi90cmFuc2Zvcm1lcnMuanN4JylcblxuTGlzdFJvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJMaXN0Um93XCIsXG4gIHByb3BUeXBlczoge1xuICAgIGhlYWRpbmc6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEhlYWRpbmdNb2RlbCkuaXNSZXF1aXJlZCxcbiAgICBtYW5hZ2VkX2Nhc2U6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKENhc2VNb2RlbCkuaXNSZXF1aXJlZFxuICB9LFxuICBzaG91bGRDb21wb25lbnRVcGRhdGU6IGZ1bmN0aW9uIChuZXdQcm9wcywgbmV3U3RhdGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgICB2YXIgbmV3X2Nhc2UgID0gbmV3UHJvcHMubWFuYWdlZF9jYXNlID8gbmV3UHJvcHMubWFuYWdlZF9jYXNlLnRvSlNPTigpIDoge307XG4gICAgdmFyIG9sZF9jYXNlICA9IHRoaXMucHJvcHMubWFuYWdlZF9jYXNlLnRvSlNPTigpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuY2xhc3NOYW1lICE9PSBuZXdQcm9wcy5jbGFzc05hbWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICghIF8uaXNFcXVhbChvbGRfY2FzZSwgbmV3X2Nhc2UpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb2xzID0gdGhpcy5fYnVpbGRDb2xzKCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUciwge2NsYXNzTmFtZTogdGhpcy5wcm9wcy5jbGFzc05hbWUsIG9uQ2xpY2s6IHRoaXMuX2hhbmRsZUNsaWNrfSwgXG4gICAgICAgIGNvbHNcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBfaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKHRoaXMucHJvcHMub25DbGljaykge1xuICAgICAgdGhpcy5wcm9wcy5vbkNsaWNrKGUpO1xuICAgIH1cbiAgfSxcbiAgX2J1aWxkQ29sczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBuYW1lO1xuICAgIHZhciB2YWx1ZTtcbiAgICB2YXIgbWFuYWdlZF9jYXNlICA9IHRoaXMucHJvcHMubWFuYWdlZF9jYXNlO1xuICAgIHZhciBoZWFkaW5nICAgICAgID0gdGhpcy5wcm9wcy5oZWFkaW5nO1xuICAgIHZhciBmaWVsZHMgICAgICAgID0gW107XG5cbiAgICB3aGlsZSAoaGVhZGluZykge1xuICAgICAgbmFtZSAgPSBoZWFkaW5nLmdldCgnbmFtZScpO1xuICAgICAgdHlwZSAgPSBoZWFkaW5nLmdldCgndHlwZScpO1xuICAgICAgdmFsdWUgPSB0cmFuc2Zvcm1lcnNbdHlwZV0gJiYgdHJhbnNmb3JtZXJzW3R5cGVdLmNhbGwodGhpcywgbWFuYWdlZF9jYXNlLCBuYW1lKTtcblxuICAgICAgZmllbGRzLnB1c2goXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGQsIHtzdG9yZTogbWFuYWdlZF9jYXNlLCBrZXk6IGhlYWRpbmcuY2lkfSwgXG4gICAgICAgICAgdmFsdWVcbiAgICAgICAgKVxuICAgICAgKTtcblxuICAgICAgaGVhZGluZyA9IGhlYWRpbmcubmV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmllbGRzO1xuICB9LFxuICBfY2xvc2VDYXNlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGNvbmZpcm0oJ1RoaXMgd2lsbCBwZXJtYW5lbnRseSBjbG9zZSB0aGlzIGNhc2UuIEFyZSB5b3Ugc3VyZT8nKSkge1xuICAgICAgdGhpcy5wcm9wcy5tYW5hZ2VkX2Nhc2Uuc2V0KCdzdGF0dXMnLCAnY2xvc2VkJyk7XG4gICAgICB0aGlzLnNldFN0YXRlKHt9KTtcbiAgICB9XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3RSb3c7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZZMkZ6WlhNdmJHbHpkRjl5YjNjdWFuTjRJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCT3p0QlFVVkJMRWRCUVVjN08wRkJSVWdzU1VGQlNTeFBRVUZQTEVOQlFVTTdRVUZEV2l4SlFVRkpMRU5CUVVNc1pVRkJaU3hQUVVGUExFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTTdRVUZETVVNc1NVRkJTU3hMUVVGTExGZEJRVmNzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUTNKRExFbEJRVWtzVVVGQlVTeFJRVUZSTEU5QlFVOHNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJRenRCUVVONFF5eEpRVUZKTEZsQlFWa3NTVUZCU1N4UFFVRlBMRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNRMEZCUXp0QlFVTXZReXhKUVVGSkxGTkJRVk1zVDBGQlR5eFBRVUZQTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNN1FVRkROVU1zU1VGQlNTeEZRVUZGTEdOQlFXTXNUMEZCVHl4RFFVRkRMSGxDUVVGNVFpeERRVUZETEVOQlFVTTdRVUZEZGtRc1NVRkJTU3hGUVVGRkxHTkJRV01zVDBGQlR5eERRVUZETEhsQ1FVRjVRaXhEUVVGRExFTkJRVU03UVVGRGRrUXNTVUZCU1N4WlFVRlpMRWxCUVVrc1QwRkJUeXhEUVVGRExHOUNRVUZ2UWl4RFFVRkRPenRCUVVWcVJDdzJRa0ZCTmtJc2RVSkJRVUU3UlVGRE0wSXNVMEZCVXl4RlFVRkZPMGxCUTFRc1QwRkJUeXhGUVVGRkxFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNWVUZCVlN4RFFVRkRMRmxCUVZrc1EwRkJReXhEUVVGRExGVkJRVlU3U1VGRE5VUXNXVUZCV1N4RlFVRkZMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zVlVGQlZTeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRMRlZCUVZVN1IwRkRMMFE3UlVGRFJDeHhRa0ZCY1VJc1JVRkJSU3hWUVVGVkxGRkJRVkVzUlVGQlJTeFJRVUZSTEVWQlFVVTdTVUZEYmtRc1QwRkJUeXhKUVVGSkxFTkJRVU03U1VGRFdpeEpRVUZKTEZGQlFWRXNTVUZCU1N4UlFVRlJMRU5CUVVNc1dVRkJXU3hIUVVGSExGRkJRVkVzUTBGQlF5eFpRVUZaTEVOQlFVTXNUVUZCVFN4RlFVRkZMRWRCUVVjc1JVRkJSU3hEUVVGRE8wRkJRMmhHTEVsQlFVa3NTVUZCU1N4UlFVRlJMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFpRVUZaTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNN08wbEJSV3BFTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhUUVVGVExFdEJRVXNzVVVGQlVTeERRVUZETEZOQlFWTXNSVUZCUlR0TlFVTXZReXhQUVVGUExFbEJRVWtzUTBGQlF6dEJRVU5zUWl4TFFVRkxPenRKUVVWRUxFbEJRVWtzUlVGQlJTeERRVUZETEVOQlFVTXNUMEZCVHl4RFFVRkRMRkZCUVZFc1JVRkJSU3hSUVVGUkxFTkJRVU1zUlVGQlJUdE5RVU51UXl4UFFVRlBMRWxCUVVrc1EwRkJRenRCUVVOc1FpeExRVUZMT3p0SlFVVkVMRTlCUVU4c1MwRkJTeXhEUVVGRE8wZEJRMlE3UlVGRFJDeE5RVUZOTEVWQlFVVXNXVUZCV1R0QlFVTjBRaXhKUVVGSkxFbEJRVWtzU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXl4VlFVRlZMRVZCUVVVc1EwRkJRenM3U1VGRk4wSTdUVUZEUlN4dlFrRkJReXhGUVVGRkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVTBGQlV5eEZRVUZETEVOQlFVTXNUMEZCUVN4RlFVRlBMRU5CUVVVc1NVRkJTU3hEUVVGRExGbEJRV01zUTBGQlFTeEZRVUZCTzFGQlF6bEVMRWxCUVVzN1RVRkRTQ3hEUVVGQk8wMUJRMHc3UjBGRFNEdEZRVU5FTEZsQlFWa3NSVUZCUlN4VlFVRlZMRU5CUVVNc1JVRkJSVHRKUVVONlFpeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhGUVVGRk8wMUJRM1JDTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzB0QlEzWkNPMGRCUTBZN1JVRkRSQ3hWUVVGVkxFVkJRVVVzV1VGQldUdEpRVU4wUWl4SlFVRkpMRWxCUVVrc1EwRkJRenRKUVVOVUxFbEJRVWtzUzBGQlN5eERRVUZETzBsQlExWXNTVUZCU1N4WlFVRlpMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFpRVUZaTEVOQlFVTTdTVUZETlVNc1NVRkJTU3hQUVVGUExGTkJRVk1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNN1FVRkRNME1zU1VGQlNTeEpRVUZKTEUxQlFVMHNWVUZCVlN4RlFVRkZMRU5CUVVNN08wbEJSWFpDTEU5QlFVOHNUMEZCVHl4RlFVRkZPMDFCUTJRc1NVRkJTU3hKUVVGSkxFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1RVRkROVUlzU1VGQlNTeEpRVUZKTEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03UVVGRGJFTXNUVUZCVFN4TFFVRkxMRWRCUVVjc1dVRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEZsQlFWa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeEZRVUZGTEZsQlFWa3NSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenM3VFVGRmFFWXNUVUZCVFN4RFFVRkRMRWxCUVVrN1VVRkRWQ3h2UWtGQlF5eEZRVUZGTEVWQlFVRXNRMEZCUVN4RFFVRkRMRXRCUVVFc1JVRkJTeXhEUVVGRkxGbEJRVmtzUlVGQlF5eERRVUZETEVkQlFVRXNSVUZCUnl4RFFVRkZMRTlCUVU4c1EwRkJReXhIUVVGTExFTkJRVUVzUlVGQlFUdFZRVU40UXl4TFFVRk5PMUZCUTBvc1EwRkJRVHRCUVVOaUxFOUJRVThzUTBGQlF6czdUVUZGUml4UFFVRlBMRWRCUVVjc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF6dEJRVU0zUWl4TFFVRkxPenRKUVVWRUxFOUJRVThzVFVGQlRTeERRVUZETzBkQlEyWTdSVUZEUkN4VlFVRlZMRVZCUVVVc1dVRkJXVHRKUVVOMFFpeEpRVUZKTEU5QlFVOHNRMEZCUXl4elJFRkJjMFFzUTBGQlF5eEZRVUZGTzAxQlEyNUZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zV1VGQldTeERRVUZETEVkQlFVY3NRMEZCUXl4UlFVRlJMRVZCUVVVc1VVRkJVU3hEUVVGRExFTkJRVU03VFVGRGFFUXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF6dExRVU51UWp0SFFVTkdPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhQUVVGUExFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUV4cGMzUlNiM2M3WEc1MllYSWdYeUFnSUNBZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0ozVnVaR1Z5YzJOdmNtVW5LVHRjYm5aaGNpQlNaV0ZqZENBZ0lDQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbmNtVmhZM1FuS1R0Y2JuWmhjaUJDWVdOclltOXVaU0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25ZbUZqYTJKdmJtVW5LVHRjYm5aaGNpQklaV0ZrYVc1blRXOWtaV3dnSUQwZ2NtVnhkV2x5WlNnbkxpOW9aV0ZrYVc1blgyMXZaR1ZzSnlrN1hHNTJZWElnUTJGelpVMXZaR1ZzSUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR2WTJGelpWOXRiMlJsYkNjcE8xeHVkbUZ5SUZSeUlDQWdJQ0FnSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2N1TGk4dUxpOWpiMjF3YjI1bGJuUnpMM1J5TG1wemVDY3BPMXh1ZG1GeUlGUmtJQ0FnSUNBZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NjdUxpOHVMaTlqYjIxd2IyNWxiblJ6TDNSa0xtcHplQ2NwTzF4dWRtRnlJSFJ5WVc1elptOXliV1Z5Y3lBZ1BTQnlaWEYxYVhKbEtDY3VMM1J5WVc1elptOXliV1Z5Y3k1cWMzZ25LVnh1WEc1TWFYTjBVbTkzSUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVJQ0J3Y205d1ZIbHdaWE02SUh0Y2JpQWdJQ0JvWldGa2FXNW5PaUJTWldGamRDNVFjbTl3Vkhsd1pYTXVhVzV6ZEdGdVkyVlBaaWhJWldGa2FXNW5UVzlrWld3cExtbHpVbVZ4ZFdseVpXUXNYRzRnSUNBZ2JXRnVZV2RsWkY5allYTmxPaUJTWldGamRDNVFjbTl3Vkhsd1pYTXVhVzV6ZEdGdVkyVlBaaWhEWVhObFRXOWtaV3dwTG1selVtVnhkV2x5WldSY2JpQWdmU3hjYmlBZ2MyaHZkV3hrUTI5dGNHOXVaVzUwVlhCa1lYUmxPaUJtZFc1amRHbHZiaUFvYm1WM1VISnZjSE1zSUc1bGQxTjBZWFJsS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFJ5ZFdVN1hHNGdJQ0FnZG1GeUlHNWxkMTlqWVhObElDQTlJRzVsZDFCeWIzQnpMbTFoYm1GblpXUmZZMkZ6WlNBL0lHNWxkMUJ5YjNCekxtMWhibUZuWldSZlkyRnpaUzUwYjBwVFQwNG9LU0E2SUh0OU8xeHVJQ0FnSUhaaGNpQnZiR1JmWTJGelpTQWdQU0IwYUdsekxuQnliM0J6TG0xaGJtRm5aV1JmWTJGelpTNTBiMHBUVDA0b0tUdGNibHh1SUNBZ0lHbG1JQ2gwYUdsekxuQnliM0J6TG1Oc1lYTnpUbUZ0WlNBaFBUMGdibVYzVUhKdmNITXVZMnhoYzNOT1lXMWxLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkSEoxWlR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb0lTQmZMbWx6UlhGMVlXd29iMnhrWDJOaGMyVXNJRzVsZDE5allYTmxLU2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSFJ5ZFdVN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnY21WMGRYSnVJR1poYkhObE8xeHVJQ0I5TEZ4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnWTI5c2N5QTlJSFJvYVhNdVgySjFhV3hrUTI5c2N5Z3BPMXh1WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeFVjaUJqYkdGemMwNWhiV1U5ZTNSb2FYTXVjSEp2Y0hNdVkyeGhjM05PWVcxbGZTQnZia05zYVdOclBYdDBhR2x6TGw5b1lXNWtiR1ZEYkdsamEzMCtYRzRnSUNBZ0lDQWdJSHRqYjJ4emZWeHVJQ0FnSUNBZ1BDOVVjajVjYmlBZ0lDQXBPMXh1SUNCOUxGeHVJQ0JmYUdGdVpHeGxRMnhwWTJzNklHWjFibU4wYVc5dUlDaGxLU0I3WEc0Z0lDQWdhV1lnS0hSb2FYTXVjSEp2Y0hNdWIyNURiR2xqYXlrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTV3Y205d2N5NXZia05zYVdOcktHVXBPMXh1SUNBZ0lIMWNiaUFnZlN4Y2JpQWdYMkoxYVd4a1EyOXNjem9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQnVZVzFsTzF4dUlDQWdJSFpoY2lCMllXeDFaVHRjYmlBZ0lDQjJZWElnYldGdVlXZGxaRjlqWVhObElDQTlJSFJvYVhNdWNISnZjSE11YldGdVlXZGxaRjlqWVhObE8xeHVJQ0FnSUhaaGNpQm9aV0ZrYVc1bklDQWdJQ0FnSUQwZ2RHaHBjeTV3Y205d2N5NW9aV0ZrYVc1bk8xeHVJQ0FnSUhaaGNpQm1hV1ZzWkhNZ0lDQWdJQ0FnSUQwZ1cxMDdYRzVjYmlBZ0lDQjNhR2xzWlNBb2FHVmhaR2x1WnlrZ2UxeHVJQ0FnSUNBZ2JtRnRaU0FnUFNCb1pXRmthVzVuTG1kbGRDZ25ibUZ0WlNjcE8xeHVJQ0FnSUNBZ2RIbHdaU0FnUFNCb1pXRmthVzVuTG1kbGRDZ25kSGx3WlNjcE8xeHVJQ0FnSUNBZ2RtRnNkV1VnUFNCMGNtRnVjMlp2Y20xbGNuTmJkSGx3WlYwZ0ppWWdkSEpoYm5ObWIzSnRaWEp6VzNSNWNHVmRMbU5oYkd3b2RHaHBjeXdnYldGdVlXZGxaRjlqWVhObExDQnVZVzFsS1R0Y2JseHVJQ0FnSUNBZ1ptbGxiR1J6TG5CMWMyZ29YRzRnSUNBZ0lDQWdJRHhVWkNCemRHOXlaVDE3YldGdVlXZGxaRjlqWVhObGZTQnJaWGs5ZTJobFlXUnBibWN1WTJsa2ZUNWNiaUFnSUNBZ0lDQWdJQ0I3ZG1Gc2RXVjlYRzRnSUNBZ0lDQWdJRHd2VkdRK1hHNGdJQ0FnSUNBcE8xeHVYRzRnSUNBZ0lDQm9aV0ZrYVc1bklEMGdhR1ZoWkdsdVp5NXVaWGgwTzF4dUlDQWdJSDFjYmx4dUlDQWdJSEpsZEhWeWJpQm1hV1ZzWkhNN1hHNGdJSDBzWEc0Z0lGOWpiRzl6WlVOaGMyVTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0JwWmlBb1kyOXVabWx5YlNnblZHaHBjeUIzYVd4c0lIQmxjbTFoYm1WdWRHeDVJR05zYjNObElIUm9hWE1nWTJGelpTNGdRWEpsSUhsdmRTQnpkWEpsUHljcEtTQjdYRzRnSUNBZ0lDQjBhR2x6TG5CeWIzQnpMbTFoYm1GblpXUmZZMkZ6WlM1elpYUW9KM04wWVhSMWN5Y3NJQ2RqYkc5elpXUW5LVHRjYmlBZ0lDQWdJSFJvYVhNdWMyVjBVM1JoZEdVb2UzMHBPMXh1SUNBZ0lIMWNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVEdsemRGSnZkenRjYmlKZGZRPT0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIENhc2VzTGlzdDtcbnZhciBSZWFjdCAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBUaGVhZCAgID0gcmVxdWlyZSgnLi90aGVhZF93cmFwcGVyLmpzeCcpO1xudmFyIFRib2R5ICAgPSByZXF1aXJlKCcuL3Rib2R5X3dyYXBwZXIuanN4Jyk7XG52YXIgRmlsdGVyICA9IHJlcXVpcmUoJy4vbGlzdF9maWx0ZXIuanN4Jyk7XG5cbkNhc2VzTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJDYXNlc0xpc3RcIixcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb3BzID0ge3N0b3JlOiB0aGlzLnByb3BzLnN0b3JlfTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGFibGVcIiwge2NsYXNzTmFtZTogXCJmdWxsIGlubGluZS1kZXRhaWxzXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZpbHRlciwgUmVhY3QuX19zcHJlYWQoe30sICBwcm9wcykpLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRoZWFkLCBSZWFjdC5fX3NwcmVhZCh7fSwgIHByb3BzKSksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGJvZHksIFJlYWN0Ll9fc3ByZWFkKHt9LCAgcHJvcHMpKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FzZXNMaXN0O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WTJGelpYTXZiR2x6ZEY5MmFXVjNMbXB6ZUNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFUczdRVUZGUVN4SFFVRkhPenRCUVVWSUxFbEJRVWtzVTBGQlV5eERRVUZETzBGQlEyUXNTVUZCU1N4TFFVRkxMRXRCUVVzc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzBGQlF5OUNMRWxCUVVrc1MwRkJTeXhMUVVGTExFOUJRVThzUTBGQlF5eHhRa0ZCY1VJc1EwRkJReXhEUVVGRE8wRkJRemRETEVsQlFVa3NTMEZCU3l4TFFVRkxMRTlCUVU4c1EwRkJReXh4UWtGQmNVSXNRMEZCUXl4RFFVRkRPMEZCUXpkRExFbEJRVWtzVFVGQlRTeEpRVUZKTEU5QlFVOHNRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eERRVUZET3p0QlFVVXpReXdyUWtGQkswSXNlVUpCUVVFN1JVRkROMElzVFVGQlRTeEZRVUZGTEZsQlFWazdRVUZEZEVJc1NVRkJTU3hKUVVGSkxFdEJRVXNzUjBGQlJ5eERRVUZETEV0QlFVc3NSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZET3p0SlFVVjBRenROUVVORkxHOUNRVUZCTEV0QlFVa3NSVUZCUVN4SlFVRkRMRVZCUVVFN1VVRkRTQ3h2UWtGQlFTeFBRVUZOTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExIRkNRVUZ6UWl4RFFVRkJMRVZCUVVFN1ZVRkRja01zYjBKQlFVTXNUVUZCVFN4RlFVRkJMR2RDUVVGQkxFZEJRVUVzUTBGQlJTeEhRVUZITEV0QlFVMHNRMEZCUVN4RFFVRkhMRU5CUVVFc1JVRkJRVHRWUVVOeVFpeHZRa0ZCUXl4TFFVRkxMRVZCUVVFc1owSkJRVUVzUjBGQlFTeERRVUZGTEVkQlFVY3NTMEZCVFN4RFFVRkJMRU5CUVVjc1EwRkJRU3hGUVVGQk8xVkJRM0JDTEc5Q1FVRkRMRXRCUVVzc1JVRkJRU3huUWtGQlFTeEhRVUZCTEVOQlFVVXNSMEZCUnl4TFFVRk5MRU5CUVVFc1EwRkJSeXhEUVVGQk8xRkJRMlFzUTBGQlFUdE5RVU5LTEVOQlFVRTdUVUZEVGp0SFFVTklPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhUUVVGVExFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUVOaGMyVnpUR2x6ZER0Y2JuWmhjaUJTWldGamRDQWdJRDBnY21WeGRXbHlaU2duY21WaFkzUW5LVHRjYm5aaGNpQlVhR1ZoWkNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTkwYUdWaFpGOTNjbUZ3Y0dWeUxtcHplQ2NwTzF4dWRtRnlJRlJpYjJSNUlDQWdQU0J5WlhGMWFYSmxLQ2N1TDNSaWIyUjVYM2R5WVhCd1pYSXVhbk40SnlrN1hHNTJZWElnUm1sc2RHVnlJQ0E5SUhKbGNYVnBjbVVvSnk0dmJHbHpkRjltYVd4MFpYSXVhbk40SnlrN1hHNWNia05oYzJWelRHbHpkQ0E5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkbUZ5SUhCeWIzQnpJRDBnZTNOMGIzSmxPaUIwYUdsekxuQnliM0J6TG5OMGIzSmxmVHRjYmx4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThaR2wyUGx4dUlDQWdJQ0FnSUNBOGRHRmliR1VnWTJ4aGMzTk9ZVzFsUFZ3aVpuVnNiQ0JwYm14cGJtVXRaR1YwWVdsc2Mxd2lQbHh1SUNBZ0lDQWdJQ0FnSUR4R2FXeDBaWElnZXk0dUxuQnliM0J6ZlNBdlBseHVJQ0FnSUNBZ0lDQWdJRHhVYUdWaFpDQjdMaTR1Y0hKdmNITjlJQzgrWEc0Z0lDQWdJQ0FnSUNBZ1BGUmliMlI1SUhzdUxpNXdjbTl3YzMwZ0x6NWNiaUFnSUNBZ0lDQWdQQzkwWVdKc1pUNWNiaUFnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFTmhjMlZ6VEdsemREdGNiaUpkZlE9PSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3RvcmU7XG52YXIgQmFja2JvbmUgICAgICAgICAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyIEhlYWRpbmdDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9oZWFkaW5nX2NvbGxlY3Rpb24nKTtcbnZhciBDYXNlQ29sbGVjdGlvbiAgICA9IHJlcXVpcmUoJy4vY2FzZV9jb2xsZWN0aW9uJyk7XG5cbnN0b3JlID0gbmV3IEJhY2tib25lLk1vZGVsKHtcbiAgY2FzZXM6ICAgIG5ldyBDYXNlQ29sbGVjdGlvbigpLFxuICBmaXJzdDogICAgbnVsbCxcbiAgaGVhZGluZ3M6IG5ldyBIZWFkaW5nQ29sbGVjdGlvbigpLFxuICBzZWxlY3RlZDogbnVsbFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RvcmU7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZZMkZ6WlhNdmJHbHpkRjkyYVdWM1gzTjBiM0psTG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRmxCUVZrc1EwRkJRenM3UVVGRllpeEpRVUZKTEV0QlFVc3NRMEZCUXp0QlFVTldMRWxCUVVrc1VVRkJVU3haUVVGWkxFOUJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXp0QlFVTTFReXhKUVVGSkxHbENRVUZwUWl4SFFVRkhMRTlCUVU4c1EwRkJReXh6UWtGQmMwSXNRMEZCUXl4RFFVRkRPMEZCUTNoRUxFbEJRVWtzWTBGQll5eE5RVUZOTEU5QlFVOHNRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eERRVUZET3p0QlFVVnlSQ3hMUVVGTExFZEJRVWNzU1VGQlNTeFJRVUZSTEVOQlFVTXNTMEZCU3l4RFFVRkRPMFZCUTNwQ0xFdEJRVXNzUzBGQlN5eEpRVUZKTEdOQlFXTXNSVUZCUlR0RlFVTTVRaXhMUVVGTExFdEJRVXNzU1VGQlNUdEZRVU5rTEZGQlFWRXNSVUZCUlN4SlFVRkpMR2xDUVVGcFFpeEZRVUZGTzBWQlEycERMRkZCUVZFc1JVRkJSU3hKUVVGSk8wRkJRMmhDTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NTMEZCU3l4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpWENKMWMyVWdjM1J5YVdOMFhDSTdYRzVjYm5aaGNpQnpkRzl5WlR0Y2JuWmhjaUJDWVdOclltOXVaU0FnSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSjJKaFkydGliMjVsSnlrN1hHNTJZWElnU0dWaFpHbHVaME52Ykd4bFkzUnBiMjRnUFNCeVpYRjFhWEpsS0NjdUwyaGxZV1JwYm1kZlkyOXNiR1ZqZEdsdmJpY3BPMXh1ZG1GeUlFTmhjMlZEYjJ4c1pXTjBhVzl1SUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTlqWVhObFgyTnZiR3hsWTNScGIyNG5LVHRjYmx4dWMzUnZjbVVnUFNCdVpYY2dRbUZqYTJKdmJtVXVUVzlrWld3b2UxeHVJQ0JqWVhObGN6b2dJQ0FnYm1WM0lFTmhjMlZEYjJ4c1pXTjBhVzl1S0Nrc1hHNGdJR1pwY25OME9pQWdJQ0J1ZFd4c0xGeHVJQ0JvWldGa2FXNW5jem9nYm1WM0lFaGxZV1JwYm1kRGIyeHNaV04wYVc5dUtDa3NYRzRnSUhObGJHVmpkR1ZrT2lCdWRXeHNYRzU5S1R0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQnpkRzl5WlR0Y2JpSmRmUT09IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBUYm9keVdyYXBwZXI7XG52YXIgUmVhY3QgICAgICAgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEJhY2tib25lICAgICAgICAgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBTY3JvbGxlciAgICAgICAgICA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL3Njcm9sbGVyX2NvYXN0ZXInKTtcbnZhciBSb3dEZXRhaWxzICAgICAgICA9IHJlcXVpcmUoJy4vYWN0aXZlX3Jvd19kZXRhaWxzLmpzeCcpO1xudmFyIENhc2VIaXN0b3J5VmlldyAgID0gcmVxdWlyZSgnLi9jYXNlX2hpc3RvcnkuanN4Jyk7XG52YXIgSGlzdG9yeUNvbGxlY3Rpb24gPSByZXF1aXJlKCcuL2Nhc2VfaGlzdG9yeV9jb2xsZWN0aW9uJyk7XG52YXIgTGlzdFJvdyAgICAgICAgICAgPSByZXF1aXJlKCcuL2xpc3Rfcm93LmpzeCcpO1xudmFyIGNsYXNzTmFtZXMgICAgICAgID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG5UYm9keVdyYXBwZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGJvZHlXcmFwcGVyXCIsXG4gIHByb3BUeXBlczoge1xuICAgIHN0b3JlOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihCYWNrYm9uZS5Nb2RlbCkuaXNSZXF1aXJlZFxuICB9LFxuICBtaXhpbnM6IFtSZWFjdC5hZGRvbnMuUHVyZVJlbmRlck1peGluXSxcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjdGl2ZUNhc2U6IG51bGwsXG4gICAgICBtaW5pbWl6ZWQ6ICBmYWxzZSxcbiAgICAgIHByZXZpb3VzOiAgIG51bGwsXG4gICAgICBpbmNyZW1lbnQ6ICBmYWxzZVxuICAgIH07XG4gIH0sXG4gIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbGVtZW50cztcbiAgICB2YXIgYWN0aXZlID0gdGhpcy5zdGF0ZS5hY3RpdmVDYXNlO1xuXG4gICAgaWYgKCEgYWN0aXZlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZWxlbWVudHMgPSBbXG4gICAgICB0aGlzLnJlZnNbYWN0aXZlXS5nZXRET01Ob2RlKCksXG4gICAgICB0aGlzLnJlZnMuYWN0aXZlQ2FzZS5nZXRET01Ob2RlKClcbiAgICBdO1xuXG4gICAgU2Nyb2xsZXIoZWxlbWVudHMsIHtzdGVwczogMjUwfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciByb3dzID0gdGhpcy5fYnVpbGRSb3dzKCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRib2R5XCIsIHtjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lfSwgXG4gICAgICAgIHJvd3NcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBfYnVpbGRSb3dzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRhdGEgICAgPSBbXTtcbiAgICB2YXIgc3RvcmUgICA9IHRoaXMucHJvcHMuc3RvcmU7XG4gICAgdmFyIGNhc2VzICAgPSBzdG9yZS5nZXQoJ2Nhc2VzJyk7XG4gICAgdmFyIGhlYWRpbmcgPSBzdG9yZS5nZXQoJ2ZpcnN0Jyk7XG4gICAgdmFyIHByZXYgICAgPSBudWxsO1xuICAgIHZhciBuZXh0ICAgID0gbnVsbDtcblxuICAgIGNhc2VzLmVhY2goZnVuY3Rpb24gKG1vZGVsLCBpbmRleCkge1xuICAgICAgdmFyIGFjdGl2ZVByb3BzO1xuICAgICAgdmFyIHJvd1Byb3BzO1xuICAgICAgdmFyIHNlbGVjdGVkX3JvdztcbiAgICAgIHZhciBjbGFzc19uYW1lcztcbiAgICAgIHZhciBhY3RpdmUgID0gdGhpcy5zdGF0ZS5hY3RpdmVDYXNlID09PSBtb2RlbC5jaWQ7XG4gICAgICB2YXIgb2RkICAgICA9IGluZGV4ICUgMiA/ICdvZGQnIDogbnVsbDtcblxuICAgICAgbmV4dCA9IGNhc2VzLmF0KGluZGV4ICsgMSk7XG5cbiAgICAgIGNsYXNzX25hbWVzID0gY2xhc3NOYW1lcyh7XG4gICAgICAgIG9kZDogb2RkLFxuICAgICAgICBhY3RpdmU6IGFjdGl2ZVxuICAgICAgfSk7XG5cbiAgICAgIHJvd1Byb3BzID0ge1xuICAgICAgICBjbGFzc05hbWU6ICAgIGNsYXNzX25hbWVzLFxuICAgICAgICByZWY6ICAgICAgICAgIG1vZGVsLmNpZCxcbiAgICAgICAga2V5OiAgICAgICAgICBtb2RlbC5jaWQsXG4gICAgICAgIG9uQ2xpY2s6ICAgICAgdGhpcy5faGFuZGxlQ2FzZVNlbGVjdGlvbi5iaW5kKHRoaXMsIG1vZGVsLmNpZCksXG4gICAgICAgIG1hbmFnZWRfY2FzZTogbW9kZWwsXG4gICAgICAgIGhlYWRpbmc6ICAgICAgaGVhZGluZ1xuICAgICAgfTtcblxuICAgICAgZGF0YS5wdXNoKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpc3RSb3csIFJlYWN0Ll9fc3ByZWFkKHt9LCAgcm93UHJvcHMpKVxuICAgICAgKTtcblxuICAgICAgaWYgKGFjdGl2ZSkge1xuICAgICAgICBhY3RpdmVQcm9wcyA9IHtcbiAgICAgICAgICBjbGFzc05hbWU6ICBvZGQsXG4gICAgICAgICAgbW9kZWw6ICAgICAgbW9kZWwsXG4gICAgICAgICAgcHJldjogICAgICAgcHJldiAmJiBwcmV2LmNpZCxcbiAgICAgICAgICBuZXh0OiAgICAgICBuZXh0ICYmIG5leHQuY2lkLFxuICAgICAgICAgIHN3aXRjaGVyOiAgIHRoaXMuX2hhbmRsZUNhc2VTZWxlY3Rpb24sXG4gICAgICAgICAgc2l6ZVRvZ2dsZTogdGhpcy5fdG9nZ2xlTWluaW1pemUsXG4gICAgICAgICAga2V5OiAgICAgICAgbW9kZWwuY2lkICsgJy1hY3RpdmUnLFxuICAgICAgICAgIHJlZjogICAgICAgICdhY3RpdmVDYXNlJyxcbiAgICAgICAgICBtaW5pbWl6ZWQ6ICB0aGlzLnN0YXRlLm1pbmltaXplZFxuICAgICAgICB9O1xuXG4gICAgICAgIGRhdGEucHVzaChcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvd0RldGFpbHMsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgYWN0aXZlUHJvcHMpLCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2FzZUhpc3RvcnlWaWV3LCB7Y29sbGVjdGlvbjogbmV3IEhpc3RvcnlDb2xsZWN0aW9uKCl9KVxuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgcHJldiA9IG1vZGVsO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH0sXG4gIF9oYW5kbGVDYXNlU2VsZWN0aW9uOiBmdW5jdGlvbiAoY2lkLCBpbmNyZW1lbnQpIHtcbiAgICB2YXIgY3VycmVudCA9IHRoaXMuc3RhdGUuYWN0aXZlQ2FzZTtcblxuICAgIGlmIChjdXJyZW50ID09PSBjaWQpIHtcbiAgICAgIGNpZCA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBhY3RpdmVDYXNlOiBjaWQsXG4gICAgICBpbmNyZW1lbnQ6ICBpbmNyZW1lbnQgPT09IHRydWUsXG4gICAgICBwcmV2aW91czogICBjaWQgPyBjdXJyZW50IDogbnVsbFxuICAgIH0pO1xuICB9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGJvZHlXcmFwcGVyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WTJGelpYTXZkR0p2WkhsZmQzSmhjSEJsY2k1cWMzZ2lYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3TzBGQlJVRXNSMEZCUnpzN1FVRkZTQ3hKUVVGSkxGbEJRVmtzUTBGQlF6dEJRVU5xUWl4SlFVRkpMRXRCUVVzc1pVRkJaU3hQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdRVUZEZWtNc1NVRkJTU3hSUVVGUkxGbEJRVmtzVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPMEZCUXpWRExFbEJRVWtzVVVGQlVTeFpRVUZaTEU5QlFVOHNRMEZCUXl3NFFrRkJPRUlzUTBGQlF5eERRVUZETzBGQlEyaEZMRWxCUVVrc1ZVRkJWU3hWUVVGVkxFOUJRVThzUTBGQlF5d3dRa0ZCTUVJc1EwRkJReXhEUVVGRE8wRkJRelZFTEVsQlFVa3NaVUZCWlN4TFFVRkxMRTlCUVU4c1EwRkJReXh2UWtGQmIwSXNRMEZCUXl4RFFVRkRPMEZCUTNSRUxFbEJRVWtzYVVKQlFXbENMRWRCUVVjc1QwRkJUeXhEUVVGRExESkNRVUV5UWl4RFFVRkRMRU5CUVVNN1FVRkROMFFzU1VGQlNTeFBRVUZQTEdGQlFXRXNUMEZCVHl4RFFVRkRMR2RDUVVGblFpeERRVUZETEVOQlFVTTdRVUZEYkVRc1NVRkJTU3hWUVVGVkxGVkJRVlVzVDBGQlR5eERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPenRCUVVVNVF5eHJRMEZCYTBNc05FSkJRVUU3UlVGRGFFTXNVMEZCVXl4RlFVRkZPMGxCUTFRc1MwRkJTeXhGUVVGRkxFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNWVUZCVlN4RFFVRkRMRkZCUVZFc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eFZRVUZWTzBkQlF6ZEVPMFZCUTBRc1RVRkJUU3hGUVVGRkxFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXl4bFFVRmxMRU5CUVVNN1JVRkRkRU1zWlVGQlpTeEZRVUZGTEZsQlFWazdTVUZETTBJc1QwRkJUenROUVVOTUxGVkJRVlVzUlVGQlJTeEpRVUZKTzAxQlEyaENMRk5CUVZNc1IwRkJSeXhMUVVGTE8wMUJRMnBDTEZGQlFWRXNTVUZCU1N4SlFVRkpPMDFCUTJoQ0xGTkJRVk1zUjBGQlJ5eExRVUZMTzB0QlEyeENMRU5CUVVNN1IwRkRTRHRGUVVORUxHdENRVUZyUWl4RlFVRkZMRmxCUVZrN1NVRkRPVUlzU1VGQlNTeFJRVUZSTEVOQlFVTTdRVUZEYWtJc1NVRkJTU3hKUVVGSkxFMUJRVTBzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRlZCUVZVc1EwRkJRenM3U1VGRmJrTXNTVUZCU1N4RlFVRkZMRTFCUVUwc1JVRkJSVHROUVVOYUxFOUJRVThzUzBGQlN5eERRVUZETzBGQlEyNUNMRXRCUVVzN08wbEJSVVFzVVVGQlVTeEhRVUZITzAxQlExUXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF5eFZRVUZWTEVWQlFVVTdUVUZET1VJc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eFZRVUZWTEVOQlFVTXNWVUZCVlN4RlFVRkZPMEZCUTNaRExFdEJRVXNzUTBGQlF6czdTVUZGUml4UlFVRlJMRU5CUVVNc1VVRkJVU3hGUVVGRkxFTkJRVU1zUzBGQlN5eEZRVUZGTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNN1IwRkRiRU03UlVGRFJDeE5RVUZOTEVWQlFVVXNXVUZCV1R0QlFVTjBRaXhKUVVGSkxFbEJRVWtzU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXl4VlFVRlZMRVZCUVVVc1EwRkJRenM3U1VGRk4wSTdUVUZEUlN4dlFrRkJRU3hQUVVGTkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVTBGQlZ5eERRVUZCTEVWQlFVRTdVVUZEY2tNc1NVRkJTenROUVVOQkxFTkJRVUU3VFVGRFVqdEhRVU5JTzBWQlEwUXNWVUZCVlN4RlFVRkZMRmxCUVZrN1NVRkRkRUlzU1VGQlNTeEpRVUZKTEUxQlFVMHNSVUZCUlN4RFFVRkRPMGxCUTJwQ0xFbEJRVWtzUzBGQlN5eExRVUZMTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRE8wbEJReTlDTEVsQlFVa3NTMEZCU3l4TFFVRkxMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdTVUZEYWtNc1NVRkJTU3hQUVVGUExFZEJRVWNzUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRKUVVOcVF5eEpRVUZKTEVsQlFVa3NUVUZCVFN4SlFVRkpMRU5CUVVNN1FVRkRka0lzU1VGQlNTeEpRVUZKTEVsQlFVa3NUVUZCVFN4SlFVRkpMRU5CUVVNN08wbEJSVzVDTEV0QlFVc3NRMEZCUXl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hMUVVGTExFVkJRVVVzUzBGQlN5eEZRVUZGTzAxQlEycERMRWxCUVVrc1YwRkJWeXhEUVVGRE8wMUJRMmhDTEVsQlFVa3NVVUZCVVN4RFFVRkRPMDFCUTJJc1NVRkJTU3haUVVGWkxFTkJRVU03VFVGRGFrSXNTVUZCU1N4WFFVRlhMRU5CUVVNN1RVRkRhRUlzU1VGQlNTeE5RVUZOTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhWUVVGVkxFdEJRVXNzUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXp0QlFVTjRSQ3hOUVVGTkxFbEJRVWtzUjBGQlJ5eFBRVUZQTEV0QlFVc3NSMEZCUnl4RFFVRkRMRWRCUVVjc1MwRkJTeXhIUVVGSExFbEJRVWtzUTBGQlF6czdRVUZGTjBNc1RVRkJUU3hKUVVGSkxFZEJRVWNzUzBGQlN5eERRVUZETEVWQlFVVXNRMEZCUXl4TFFVRkxMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU03TzAxQlJUTkNMRmRCUVZjc1IwRkJSeXhWUVVGVkxFTkJRVU03VVVGRGRrSXNSMEZCUnl4RlFVRkZMRWRCUVVjN1VVRkRVaXhOUVVGTkxFVkJRVVVzVFVGQlRUdEJRVU4wUWl4UFFVRlBMRU5CUVVNc1EwRkJRenM3VFVGRlNDeFJRVUZSTEVkQlFVYzdVVUZEVkN4VFFVRlRMRXRCUVVzc1YwRkJWenRSUVVONlFpeEhRVUZITEZkQlFWY3NTMEZCU3l4RFFVRkRMRWRCUVVjN1VVRkRka0lzUjBGQlJ5eFhRVUZYTEV0QlFVc3NRMEZCUXl4SFFVRkhPMUZCUTNaQ0xFOUJRVThzVDBGQlR5eEpRVUZKTEVOQlFVTXNiMEpCUVc5Q0xFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NSVUZCUlN4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRE8xRkJRemRFTEZsQlFWa3NSVUZCUlN4TFFVRkxPMUZCUTI1Q0xFOUJRVThzVDBGQlR5eFBRVUZQTzBGQlF6ZENMRTlCUVU4c1EwRkJRenM3VFVGRlJpeEpRVUZKTEVOQlFVTXNTVUZCU1R0UlFVTlFMRzlDUVVGRExFOUJRVThzUlVGQlFTeG5Ra0ZCUVN4SFFVRkJMRU5CUVVVc1IwRkJSeXhSUVVGVExFTkJRVUVzUTBGQlJ5eERRVUZCTzBGQlEycERMRTlCUVU4c1EwRkJRenM3VFVGRlJpeEpRVUZKTEUxQlFVMHNSVUZCUlR0UlFVTldMRmRCUVZjc1IwRkJSenRWUVVOYUxGTkJRVk1zUjBGQlJ5eEhRVUZITzFWQlEyWXNTMEZCU3l4UFFVRlBMRXRCUVVzN1ZVRkRha0lzU1VGQlNTeFJRVUZSTEVsQlFVa3NTVUZCU1N4SlFVRkpMRU5CUVVNc1IwRkJSenRWUVVNMVFpeEpRVUZKTEZGQlFWRXNTVUZCU1N4SlFVRkpMRWxCUVVrc1EwRkJReXhIUVVGSE8xVkJRelZDTEZGQlFWRXNTVUZCU1N4SlFVRkpMRU5CUVVNc2IwSkJRVzlDTzFWQlEzSkRMRlZCUVZVc1JVRkJSU3hKUVVGSkxFTkJRVU1zWlVGQlpUdFZRVU5vUXl4SFFVRkhMRk5CUVZNc1MwRkJTeXhEUVVGRExFZEJRVWNzUjBGQlJ5eFRRVUZUTzFWQlEycERMRWRCUVVjc1UwRkJVeXhaUVVGWk8xVkJRM2hDTEZOQlFWTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk03UVVGRE1VTXNVMEZCVXl4RFFVRkRPenRSUVVWR0xFbEJRVWtzUTBGQlF5eEpRVUZKTzFWQlExQXNiMEpCUVVNc1ZVRkJWU3hGUVVGQkxHZENRVUZCTEVkQlFVRXNRMEZCUlN4SFFVRkhMRmRCUVdFc1EwRkJRU3hGUVVGQk8xbEJRek5DTEc5Q1FVRkRMR1ZCUVdVc1JVRkJRU3hEUVVGQkxFTkJRVU1zVlVGQlFTeEZRVUZWTEVOQlFVVXNTVUZCU1N4cFFrRkJhVUlzUlVGQlJ5eERRVUZCTEVOQlFVY3NRMEZCUVR0VlFVTTNReXhEUVVGQk8xTkJRMlFzUTBGQlF6dEJRVU5XTEU5QlFVODdPMDFCUlVRc1NVRkJTU3hIUVVGSExFdEJRVXNzUTBGQlF6dEJRVU51UWl4TFFVRkxMRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU03TzBsQlJWUXNUMEZCVHl4SlFVRkpMRU5CUVVNN1IwRkRZanRGUVVORUxHOUNRVUZ2UWl4RlFVRkZMRlZCUVZVc1IwRkJSeXhGUVVGRkxGTkJRVk1zUlVGQlJUdEJRVU5zUkN4SlFVRkpMRWxCUVVrc1QwRkJUeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNWVUZCVlN4RFFVRkRPenRKUVVWd1F5eEpRVUZKTEU5QlFVOHNTMEZCU3l4SFFVRkhMRVZCUVVVN1RVRkRia0lzUjBGQlJ5eEhRVUZITEVsQlFVa3NRMEZCUXp0QlFVTnFRaXhMUVVGTE96dEpRVVZFTEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNN1RVRkRXaXhWUVVGVkxFVkJRVVVzUjBGQlJ6dE5RVU5tTEZOQlFWTXNSMEZCUnl4VFFVRlRMRXRCUVVzc1NVRkJTVHROUVVNNVFpeFJRVUZSTEVsQlFVa3NSMEZCUnl4SFFVRkhMRTlCUVU4c1IwRkJSeXhKUVVGSk8wdEJRMnBETEVOQlFVTXNRMEZCUXp0SFFVTktPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhaUVVGWkxFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUZSaWIyUjVWM0poY0hCbGNqdGNiblpoY2lCU1pXRmpkQ0FnSUNBZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0ozSmxZV04wSnlrN1hHNTJZWElnUW1GamEySnZibVVnSUNBZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkaVlXTnJZbTl1WlNjcE8xeHVkbUZ5SUZOamNtOXNiR1Z5SUNBZ0lDQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpNHZMaTR2ZFhScGJITXZjMk55YjJ4c1pYSmZZMjloYzNSbGNpY3BPMXh1ZG1GeUlGSnZkMFJsZEdGcGJITWdJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTloWTNScGRtVmZjbTkzWDJSbGRHRnBiSE11YW5ONEp5azdYRzUyWVhJZ1EyRnpaVWhwYzNSdmNubFdhV1YzSUNBZ1BTQnlaWEYxYVhKbEtDY3VMMk5oYzJWZmFHbHpkRzl5ZVM1cWMzZ25LVHRjYm5aaGNpQklhWE4wYjNKNVEyOXNiR1ZqZEdsdmJpQTlJSEpsY1hWcGNtVW9KeTR2WTJGelpWOW9hWE4wYjNKNVgyTnZiR3hsWTNScGIyNG5LVHRjYm5aaGNpQk1hWE4wVW05M0lDQWdJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR2YkdsemRGOXliM2N1YW5ONEp5azdYRzUyWVhJZ1kyeGhjM05PWVcxbGN5QWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDZGpiR0Z6YzI1aGJXVnpKeWs3WEc1Y2JsUmliMlI1VjNKaGNIQmxjaUE5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JpQWdjSEp2Y0ZSNWNHVnpPaUI3WEc0Z0lDQWdjM1J2Y21VNklGSmxZV04wTGxCeWIzQlVlWEJsY3k1cGJuTjBZVzVqWlU5bUtFSmhZMnRpYjI1bExrMXZaR1ZzS1M1cGMxSmxjWFZwY21Wa1hHNGdJSDBzWEc0Z0lHMXBlR2x1Y3pvZ1cxSmxZV04wTG1Ga1pHOXVjeTVRZFhKbFVtVnVaR1Z5VFdsNGFXNWRMRnh1SUNCblpYUkpibWwwYVdGc1UzUmhkR1U2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCeVpYUjFjbTRnZTF4dUlDQWdJQ0FnWVdOMGFYWmxRMkZ6WlRvZ2JuVnNiQ3hjYmlBZ0lDQWdJRzFwYm1sdGFYcGxaRG9nSUdaaGJITmxMRnh1SUNBZ0lDQWdjSEpsZG1sdmRYTTZJQ0FnYm5Wc2JDeGNiaUFnSUNBZ0lHbHVZM0psYldWdWREb2dJR1poYkhObFhHNGdJQ0FnZlR0Y2JpQWdmU3hjYmlBZ1kyOXRjRzl1Wlc1MFJHbGtWWEJrWVhSbE9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkbUZ5SUdWc1pXMWxiblJ6TzF4dUlDQWdJSFpoY2lCaFkzUnBkbVVnUFNCMGFHbHpMbk4wWVhSbExtRmpkR2wyWlVOaGMyVTdYRzVjYmlBZ0lDQnBaaUFvSVNCaFkzUnBkbVVwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpUdGNiaUFnSUNCOVhHNWNiaUFnSUNCbGJHVnRaVzUwY3lBOUlGdGNiaUFnSUNBZ0lIUm9hWE11Y21WbWMxdGhZM1JwZG1WZExtZGxkRVJQVFU1dlpHVW9LU3hjYmlBZ0lDQWdJSFJvYVhNdWNtVm1jeTVoWTNScGRtVkRZWE5sTG1kbGRFUlBUVTV2WkdVb0tWeHVJQ0FnSUYwN1hHNWNiaUFnSUNCVFkzSnZiR3hsY2lobGJHVnRaVzUwY3l3Z2UzTjBaWEJ6T2lBeU5UQjlLVHRjYmlBZ2ZTeGNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZG1GeUlISnZkM01nUFNCMGFHbHpMbDlpZFdsc1pGSnZkM01vS1R0Y2JseHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4ZEdKdlpIa2dZMnhoYzNOT1lXMWxQWHQwYUdsekxuQnliM0J6TG1Oc1lYTnpUbUZ0WlgwK1hHNGdJQ0FnSUNBZ0lIdHliM2R6ZlZ4dUlDQWdJQ0FnUEM5MFltOWtlVDVjYmlBZ0lDQXBPMXh1SUNCOUxGeHVJQ0JmWW5WcGJHUlNiM2R6T2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2RtRnlJR1JoZEdFZ0lDQWdQU0JiWFR0Y2JpQWdJQ0IyWVhJZ2MzUnZjbVVnSUNBOUlIUm9hWE11Y0hKdmNITXVjM1J2Y21VN1hHNGdJQ0FnZG1GeUlHTmhjMlZ6SUNBZ1BTQnpkRzl5WlM1blpYUW9KMk5oYzJWekp5azdYRzRnSUNBZ2RtRnlJR2hsWVdScGJtY2dQU0J6ZEc5eVpTNW5aWFFvSjJacGNuTjBKeWs3WEc0Z0lDQWdkbUZ5SUhCeVpYWWdJQ0FnUFNCdWRXeHNPMXh1SUNBZ0lIWmhjaUJ1WlhoMElDQWdJRDBnYm5Wc2JEdGNibHh1SUNBZ0lHTmhjMlZ6TG1WaFkyZ29ablZ1WTNScGIyNGdLRzF2WkdWc0xDQnBibVJsZUNrZ2UxeHVJQ0FnSUNBZ2RtRnlJR0ZqZEdsMlpWQnliM0J6TzF4dUlDQWdJQ0FnZG1GeUlISnZkMUJ5YjNCek8xeHVJQ0FnSUNBZ2RtRnlJSE5sYkdWamRHVmtYM0p2ZHp0Y2JpQWdJQ0FnSUhaaGNpQmpiR0Z6YzE5dVlXMWxjenRjYmlBZ0lDQWdJSFpoY2lCaFkzUnBkbVVnSUQwZ2RHaHBjeTV6ZEdGMFpTNWhZM1JwZG1WRFlYTmxJRDA5UFNCdGIyUmxiQzVqYVdRN1hHNGdJQ0FnSUNCMllYSWdiMlJrSUNBZ0lDQTlJR2x1WkdWNElDVWdNaUEvSUNkdlpHUW5JRG9nYm5Wc2JEdGNibHh1SUNBZ0lDQWdibVY0ZENBOUlHTmhjMlZ6TG1GMEtHbHVaR1Y0SUNzZ01TazdYRzVjYmlBZ0lDQWdJR05zWVhOelgyNWhiV1Z6SUQwZ1kyeGhjM05PWVcxbGN5aDdYRzRnSUNBZ0lDQWdJRzlrWkRvZ2IyUmtMRnh1SUNBZ0lDQWdJQ0JoWTNScGRtVTZJR0ZqZEdsMlpWeHVJQ0FnSUNBZ2ZTazdYRzVjYmlBZ0lDQWdJSEp2ZDFCeWIzQnpJRDBnZTF4dUlDQWdJQ0FnSUNCamJHRnpjMDVoYldVNklDQWdJR05zWVhOelgyNWhiV1Z6TEZ4dUlDQWdJQ0FnSUNCeVpXWTZJQ0FnSUNBZ0lDQWdJRzF2WkdWc0xtTnBaQ3hjYmlBZ0lDQWdJQ0FnYTJWNU9pQWdJQ0FnSUNBZ0lDQnRiMlJsYkM1amFXUXNYRzRnSUNBZ0lDQWdJRzl1UTJ4cFkyczZJQ0FnSUNBZ2RHaHBjeTVmYUdGdVpHeGxRMkZ6WlZObGJHVmpkR2x2Ymk1aWFXNWtLSFJvYVhNc0lHMXZaR1ZzTG1OcFpDa3NYRzRnSUNBZ0lDQWdJRzFoYm1GblpXUmZZMkZ6WlRvZ2JXOWtaV3dzWEc0Z0lDQWdJQ0FnSUdobFlXUnBibWM2SUNBZ0lDQWdhR1ZoWkdsdVoxeHVJQ0FnSUNBZ2ZUdGNibHh1SUNBZ0lDQWdaR0YwWVM1d2RYTm9LRnh1SUNBZ0lDQWdJQ0E4VEdsemRGSnZkeUI3TGk0dWNtOTNVSEp2Y0hOOUlDOCtYRzRnSUNBZ0lDQXBPMXh1WEc0Z0lDQWdJQ0JwWmlBb1lXTjBhWFpsS1NCN1hHNGdJQ0FnSUNBZ0lHRmpkR2wyWlZCeWIzQnpJRDBnZTF4dUlDQWdJQ0FnSUNBZ0lHTnNZWE56VG1GdFpUb2dJRzlrWkN4Y2JpQWdJQ0FnSUNBZ0lDQnRiMlJsYkRvZ0lDQWdJQ0J0YjJSbGJDeGNiaUFnSUNBZ0lDQWdJQ0J3Y21WMk9pQWdJQ0FnSUNCd2NtVjJJQ1ltSUhCeVpYWXVZMmxrTEZ4dUlDQWdJQ0FnSUNBZ0lHNWxlSFE2SUNBZ0lDQWdJRzVsZUhRZ0ppWWdibVY0ZEM1amFXUXNYRzRnSUNBZ0lDQWdJQ0FnYzNkcGRHTm9aWEk2SUNBZ2RHaHBjeTVmYUdGdVpHeGxRMkZ6WlZObGJHVmpkR2x2Yml4Y2JpQWdJQ0FnSUNBZ0lDQnphWHBsVkc5bloyeGxPaUIwYUdsekxsOTBiMmRuYkdWTmFXNXBiV2w2WlN4Y2JpQWdJQ0FnSUNBZ0lDQnJaWGs2SUNBZ0lDQWdJQ0J0YjJSbGJDNWphV1FnS3lBbkxXRmpkR2wyWlNjc1hHNGdJQ0FnSUNBZ0lDQWdjbVZtT2lBZ0lDQWdJQ0FnSjJGamRHbDJaVU5oYzJVbkxGeHVJQ0FnSUNBZ0lDQWdJRzFwYm1sdGFYcGxaRG9nSUhSb2FYTXVjM1JoZEdVdWJXbHVhVzFwZW1Wa1hHNGdJQ0FnSUNBZ0lIMDdYRzVjYmlBZ0lDQWdJQ0FnWkdGMFlTNXdkWE5vS0Z4dUlDQWdJQ0FnSUNBZ0lEeFNiM2RFWlhSaGFXeHpJSHN1TGk1aFkzUnBkbVZRY205d2MzMCtYRzRnSUNBZ0lDQWdJQ0FnSUNBOFEyRnpaVWhwYzNSdmNubFdhV1YzSUdOdmJHeGxZM1JwYjI0OWUyNWxkeUJJYVhOMGIzSjVRMjlzYkdWamRHbHZiaWdwZlNBdlBseHVJQ0FnSUNBZ0lDQWdJRHd2VW05M1JHVjBZV2xzY3o1Y2JpQWdJQ0FnSUNBZ0tUdGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdjSEpsZGlBOUlHMXZaR1ZzTzF4dUlDQWdJSDBzSUhSb2FYTXBPMXh1WEc0Z0lDQWdjbVYwZFhKdUlHUmhkR0U3WEc0Z0lIMHNYRzRnSUY5b1lXNWtiR1ZEWVhObFUyVnNaV04wYVc5dU9pQm1kVzVqZEdsdmJpQW9ZMmxrTENCcGJtTnlaVzFsYm5RcElIdGNiaUFnSUNCMllYSWdZM1Z5Y21WdWRDQTlJSFJvYVhNdWMzUmhkR1V1WVdOMGFYWmxRMkZ6WlR0Y2JseHVJQ0FnSUdsbUlDaGpkWEp5Wlc1MElEMDlQU0JqYVdRcElIdGNiaUFnSUNBZ0lHTnBaQ0E5SUc1MWJHdzdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2RHaHBjeTV6WlhSVGRHRjBaU2g3WEc0Z0lDQWdJQ0JoWTNScGRtVkRZWE5sT2lCamFXUXNYRzRnSUNBZ0lDQnBibU55WlcxbGJuUTZJQ0JwYm1OeVpXMWxiblFnUFQwOUlIUnlkV1VzWEc0Z0lDQWdJQ0J3Y21WMmFXOTFjem9nSUNCamFXUWdQeUJqZFhKeVpXNTBJRG9nYm5Wc2JGeHVJQ0FnSUgwcE8xeHVJQ0I5TEZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVkdKdlpIbFhjbUZ3Y0dWeU8xeHVJbDE5IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBUaFdyYXBwZXI7XG52YXIgVGggICAgICAgICAgICAgID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy90aC5qc3gnKTtcbnZhciBSZWFjdCAgICAgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEJhY2tib25lICAgICAgICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG5cblRoV3JhcHBlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUaFdyYXBwZXJcIixcbiAgcHJvcFR5cGVzOiB7XG4gICAgc3RvcmU6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEJhY2tib25lLk1vZGVsKS5pc1JlcXVpcmVkXG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnN0b3JlLnRvSlNPTigpO1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucHJvcHMuc3RvcmUub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChzdG9yZSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZShzdG9yZS50b0pTT04oKSk7XG4gICAgfSwgdGhpcyk7XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgc3RvcmUub2ZmKCdjaGFuZ2UnLCBudWxsLCB0aGlzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5ld19wcm9wcztcbiAgICB2YXIgZGF0YSAgICAgID0gdGhpcy5zdGF0ZTtcblxuICAgIG5ld19wcm9wcyA9IHtcbiAgICAgIHRyaWdnZXJTb3J0OiAgICBkYXRhLnNvcnRhYmxlICYmIGRhdGEubmFtZSA/IGRhdGEubmFtZSA6IG51bGwsXG4gICAgICBzb3J0RGlyZWN0aW9uOiAgZGF0YS5kaXJlY3Rpb24sXG4gICAgICBtaW5pbWFsOiAgICAgICAgZGF0YS5taW5pbWFsLFxuICAgICAgbG9ja2VkOiAgICAgICAgIGRhdGEubG9ja2VkLFxuICAgICAgcmVzaXphYmxlOiAgICAgIGRhdGEucmVzaXphYmxlLFxuICAgICAgd2lkdGg6ICAgICAgICAgIGRhdGEud2lkdGhcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGgsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgdGhpcy5wcm9wcywgIG5ld19wcm9wcyksIFxuICAgICAgICBkYXRhLnRpdGxlXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGhXcmFwcGVyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WTJGelpYTXZkR2hmZDNKaGNIQmxjaTVxYzNnaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRTdPMEZCUlVFc1IwRkJSenM3UVVGRlNDeEpRVUZKTEZOQlFWTXNRMEZCUXp0QlFVTmtMRWxCUVVrc1JVRkJSU3huUWtGQlowSXNUMEZCVHl4RFFVRkRMSGxDUVVGNVFpeERRVUZETEVOQlFVTTdRVUZEZWtRc1NVRkJTU3hMUVVGTExHRkJRV0VzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUTNaRExFbEJRVWtzVVVGQlVTeFZRVUZWTEU5QlFVOHNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJRenM3UVVGRk1VTXNLMEpCUVN0Q0xIbENRVUZCTzBWQlF6ZENMRk5CUVZNc1JVRkJSVHRKUVVOVUxFdEJRVXNzUlVGQlJTeExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRlZCUVZVc1EwRkJReXhSUVVGUkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNWVUZCVlR0SFFVTTNSRHRGUVVORUxHVkJRV1VzUlVGQlJTeFpRVUZaTzBsQlF6TkNMRTlCUVU4c1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNN1IwRkRiRU03UlVGRFJDeHBRa0ZCYVVJc1JVRkJSU3haUVVGWk8wbEJRemRDTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRExFVkJRVVVzUTBGQlF5eFJRVUZSTEVWQlFVVXNWVUZCVlN4TFFVRkxMRVZCUVVVN1RVRkROME1zU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUTBGQlF6dExRVU12UWl4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE8wZEJRMVk3UlVGRFJDeHZRa0ZCYjBJc1JVRkJSU3haUVVGWk8wbEJRMmhETEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1VVRkJVU3hGUVVGRkxFbEJRVWtzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0SFFVTnFRenRGUVVORUxFMUJRVTBzUlVGQlJTeFpRVUZaTzBsQlEyeENMRWxCUVVrc1UwRkJVeXhEUVVGRE8wRkJRMnhDTEVsQlFVa3NTVUZCU1N4SlFVRkpMRkZCUVZFc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF6czdTVUZGTTBJc1UwRkJVeXhIUVVGSE8wMUJRMVlzVjBGQlZ5eExRVUZMTEVsQlFVa3NRMEZCUXl4UlFVRlJMRWxCUVVrc1NVRkJTU3hEUVVGRExFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTVUZCU1N4SFFVRkhMRWxCUVVrN1RVRkROMFFzWVVGQllTeEhRVUZITEVsQlFVa3NRMEZCUXl4VFFVRlRPMDFCUXpsQ0xFOUJRVThzVTBGQlV5eEpRVUZKTEVOQlFVTXNUMEZCVHp0TlFVTTFRaXhOUVVGTkxGVkJRVlVzU1VGQlNTeERRVUZETEUxQlFVMDdUVUZETTBJc1UwRkJVeXhQUVVGUExFbEJRVWtzUTBGQlF5eFRRVUZUTzAxQlF6bENMRXRCUVVzc1YwRkJWeXhKUVVGSkxFTkJRVU1zUzBGQlN6dEJRVU5vUXl4TFFVRkxMRU5CUVVNN08wbEJSVVk3VFVGRFJTeHZRa0ZCUXl4RlFVRkZMRVZCUVVFc1owSkJRVUVzUjBGQlFTeERRVUZGTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1JVRkJReXhEUVVGRkxFZEJRVWNzVTBGQlZ5eERRVUZCTEVWQlFVRTdVVUZEYUVNc1NVRkJTU3hEUVVGRExFdEJRVTA3VFVGRFZDeERRVUZCTzAxQlEwdzdSMEZEU0R0QlFVTklMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZJTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1UwRkJVeXhEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeW9xWEc0Z0tpQkFhbk40SUZKbFlXTjBMa1JQVFZ4dUlDb3ZYRzVjYm5aaGNpQlVhRmR5WVhCd1pYSTdYRzUyWVhJZ1ZHZ2dJQ0FnSUNBZ0lDQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpNHZMaTR2WTI5dGNHOXVaVzUwY3k5MGFDNXFjM2duS1R0Y2JuWmhjaUJTWldGamRDQWdJQ0FnSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDY3BPMXh1ZG1GeUlFSmhZMnRpYjI1bElDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0oySmhZMnRpYjI1bEp5azdYRzVjYmxSb1YzSmhjSEJsY2lBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNiaUFnY0hKdmNGUjVjR1Z6T2lCN1hHNGdJQ0FnYzNSdmNtVTZJRkpsWVdOMExsQnliM0JVZVhCbGN5NXBibk4wWVc1alpVOW1LRUpoWTJ0aWIyNWxMazF2WkdWc0tTNXBjMUpsY1hWcGNtVmtYRzRnSUgwc1hHNGdJR2RsZEVsdWFYUnBZV3hUZEdGMFpUb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TG5CeWIzQnpMbk4wYjNKbExuUnZTbE5QVGlncE8xeHVJQ0I5TEZ4dUlDQmpiMjF3YjI1bGJuUkVhV1JOYjNWdWREb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFJvYVhNdWNISnZjSE11YzNSdmNtVXViMjRvSjJOb1lXNW5aU2NzSUdaMWJtTjBhVzl1SUNoemRHOXlaU2tnZTF4dUlDQWdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaHpkRzl5WlM1MGIwcFRUMDRvS1NrN1hHNGdJQ0FnZlN3Z2RHaHBjeWs3WEc0Z0lIMHNYRzRnSUdOdmJYQnZibVZ1ZEZkcGJHeFZibTF2ZFc1ME9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdjM1J2Y21VdWIyWm1LQ2RqYUdGdVoyVW5MQ0J1ZFd4c0xDQjBhR2x6S1R0Y2JpQWdmU3hjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2RtRnlJRzVsZDE5d2NtOXdjenRjYmlBZ0lDQjJZWElnWkdGMFlTQWdJQ0FnSUQwZ2RHaHBjeTV6ZEdGMFpUdGNibHh1SUNBZ0lHNWxkMTl3Y205d2N5QTlJSHRjYmlBZ0lDQWdJSFJ5YVdkblpYSlRiM0owT2lBZ0lDQmtZWFJoTG5OdmNuUmhZbXhsSUNZbUlHUmhkR0V1Ym1GdFpTQS9JR1JoZEdFdWJtRnRaU0E2SUc1MWJHd3NYRzRnSUNBZ0lDQnpiM0owUkdseVpXTjBhVzl1T2lBZ1pHRjBZUzVrYVhKbFkzUnBiMjRzWEc0Z0lDQWdJQ0J0YVc1cGJXRnNPaUFnSUNBZ0lDQWdaR0YwWVM1dGFXNXBiV0ZzTEZ4dUlDQWdJQ0FnYkc5amEyVmtPaUFnSUNBZ0lDQWdJR1JoZEdFdWJHOWphMlZrTEZ4dUlDQWdJQ0FnY21WemFYcGhZbXhsT2lBZ0lDQWdJR1JoZEdFdWNtVnphWHBoWW14bExGeHVJQ0FnSUNBZ2QybGtkR2c2SUNBZ0lDQWdJQ0FnSUdSaGRHRXVkMmxrZEdoY2JpQWdJQ0I5TzF4dVhHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHhVYUNCN0xpNHVkR2hwY3k1d2NtOXdjMzBnZXk0dUxtNWxkMTl3Y205d2MzMCtYRzRnSUNBZ0lDQWdJSHRrWVhSaExuUnBkR3hsZlZ4dUlDQWdJQ0FnUEM5VWFENWNiaUFnSUNBcE8xeHVJQ0I5WEc1OUtUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JVYUZkeVlYQndaWEk3WEc0aVhYMD0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFRoZWFkO1xudmFyIFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgQmFja2JvbmUgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBUaCAgICAgICAgPSByZXF1aXJlKCcuL3RoX3dyYXBwZXIuanN4Jyk7XG5cblRoZWFkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRoZWFkXCIsXG4gIHByb3BUeXBlczoge1xuICAgIHN0b3JlOiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihCYWNrYm9uZS5Nb2RlbCkuaXNSZXF1aXJlZFxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29scyA9IHRoaXMuX2J1aWxkQ29sdW1ucygpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aGVhZFwiLCB7Y2xhc3NOYW1lOiB0aGlzLnByb3BzLmNsYXNzTmFtZX0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgbnVsbCwgXG4gICAgICAgICAgY29sc1xuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgX2J1aWxkQ29sdW1uczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBkYXRhO1xuICAgIHZhciBjb2x1bW5zID0gW107XG4gICAgdmFyIHN0b3JlID0gdGhpcy5wcm9wcy5zdG9yZTtcbiAgICB2YXIgY3VycmVudCA9IHN0b3JlLmdldCgnZmlyc3QnKTtcblxuICAgIHdoaWxlIChjdXJyZW50KSB7XG4gICAgICBkYXRhICAgICAgICAgICAgICA9IHt9O1xuICAgICAgZGF0YS5oYW5kbGVDbGljayAgPSBjdXJyZW50LmdldCgnc29ydGFibGUnKSA/IHRoaXMuX3NvcnRIYW5kbGVyLmJpbmQodGhpcywgY3VycmVudCkgOiBudWxsO1xuICAgICAgZGF0YS5zdG9yZSAgICAgICAgPSBjdXJyZW50O1xuICAgICAgZGF0YS5jbGFzc05hbWUgICAgPSBjdXJyZW50LmdldCgndHlwZScpID09PSAnY2FzZV9hY3Rpb25zJyA/ICdhY3Rpb25zLWNvbCcgOiAnJztcblxuICAgICAgY29sdW1ucy5wdXNoKFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGgsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgZGF0YSwge2tleTogY3VycmVudC5jaWR9KSkpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gY29sdW1ucztcbiAgfSxcbiAgX3NvcnRIYW5kbGVyOiBmdW5jdGlvbiAoc29ydGVlKSB7XG4gICAgdmFyIHN0b3JlICAgPSB0aGlzLnByb3BzLnN0b3JlO1xuICAgIHZhciBjdXJyZW50ID0gc3RvcmUuZ2V0KCdzb3J0ZWUnKTtcblxuICAgIGlmIChjdXJyZW50LmNpZCAhPT0gc29ydGVlLmNpZCkge1xuICAgICAgY3VycmVudC5lbmRTb3J0aW5nKCk7XG4gICAgfVxuXG4gICAgc3RvcmUuc2V0KCdzb3J0ZWUnLCBzb3J0ZWUpO1xuICAgIHNvcnRlZS50b2dnbGVTb3J0RGlyZWN0aW9uKCk7XG5cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGhlYWQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMjF2WkhWc1pYTXZZMkZ6WlhNdmRHaGxZV1JmZDNKaGNIQmxjaTVxYzNnaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRTdPMEZCUlVFc1IwRkJSenM3UVVGRlNDeEpRVUZKTEV0QlFVc3NRMEZCUXp0QlFVTldMRWxCUVVrc1MwRkJTeXhQUVVGUExFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0QlFVTnFReXhKUVVGSkxGRkJRVkVzU1VGQlNTeFBRVUZQTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNN1FVRkRjRU1zU1VGQlNTeEZRVUZGTEZWQlFWVXNUMEZCVHl4RFFVRkRMR3RDUVVGclFpeERRVUZETEVOQlFVTTdPMEZCUlRWRExESkNRVUV5UWl4eFFrRkJRVHRGUVVONlFpeFRRVUZUTEVWQlFVVTdTVUZEVkN4TFFVRkxMRVZCUVVVc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eFZRVUZWTEVOQlFVTXNVVUZCVVN4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExGVkJRVlU3UjBGRE4wUTdSVUZEUkN4TlFVRk5MRVZCUVVVc1dVRkJXVHRCUVVOMFFpeEpRVUZKTEVsQlFVa3NTVUZCU1N4SFFVRkhMRWxCUVVrc1EwRkJReXhoUVVGaExFVkJRVVVzUTBGQlF6czdTVUZGYUVNN1RVRkRSU3h2UWtGQlFTeFBRVUZOTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVnl4RFFVRkJMRVZCUVVFN1VVRkRkRU1zYjBKQlFVRXNTVUZCUnl4RlFVRkJMRWxCUVVNc1JVRkJRVHRWUVVORUxFbEJRVXM3VVVGRFNDeERRVUZCTzAxQlEwTXNRMEZCUVR0TlFVTlNPMGRCUTBnN1JVRkRSQ3hoUVVGaExFVkJRVVVzV1VGQldUdEpRVU42UWl4SlFVRkpMRWxCUVVrc1EwRkJRenRKUVVOVUxFbEJRVWtzVDBGQlR5eEhRVUZITEVWQlFVVXNRMEZCUXp0SlFVTnFRaXhKUVVGSkxFdEJRVXNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJRenRCUVVOcVF5eEpRVUZKTEVsQlFVa3NUMEZCVHl4SFFVRkhMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdPMGxCUldwRExFOUJRVThzVDBGQlR5eEZRVUZGTzAxQlEyUXNTVUZCU1N4blFrRkJaMElzUlVGQlJTeERRVUZETzAxQlEzWkNMRWxCUVVrc1EwRkJReXhYUVVGWExFbEJRVWtzVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRlZMRU5CUVVNc1IwRkJSeXhKUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRVZCUVVVc1QwRkJUeXhEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZETzAxQlF6TkdMRWxCUVVrc1EwRkJReXhMUVVGTExGVkJRVlVzVDBGQlR5eERRVUZETzBGQlEyeERMRTFCUVUwc1NVRkJTU3hEUVVGRExGTkJRVk1zVFVGQlRTeFBRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMRTFCUVUwc1EwRkJReXhMUVVGTExHTkJRV01zUjBGQlJ5eGhRVUZoTEVkQlFVY3NSVUZCUlN4RFFVRkRPenROUVVWb1JpeFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRzlDUVVGRExFVkJRVVVzUlVGQlFTeG5Ra0ZCUVN4SFFVRkJMRU5CUVVVc1IwRkJSeXhKUVVGSkxFVkJRVU1zUTBGQlF5eERRVUZCTEVkQlFVRXNSVUZCUnl4RFFVRkZMRTlCUVU4c1EwRkJReXhIUVVGSkxFTkJRVUVzUTBGQlFTeERRVUZITEVOQlFVRXNRMEZCUXl4RFFVRkRPMDFCUTJwRUxFOUJRVThzUjBGQlJ5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRPMEZCUXpkQ0xFdEJRVXM3TzBsQlJVUXNUMEZCVHl4UFFVRlBMRU5CUVVNN1IwRkRhRUk3UlVGRFJDeFpRVUZaTEVWQlFVVXNWVUZCVlN4TlFVRk5MRVZCUVVVN1NVRkRPVUlzU1VGQlNTeExRVUZMTEV0QlFVc3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU03UVVGRGJrTXNTVUZCU1N4SlFVRkpMRTlCUVU4c1IwRkJSeXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPenRKUVVWc1F5eEpRVUZKTEU5QlFVOHNRMEZCUXl4SFFVRkhMRXRCUVVzc1RVRkJUU3hEUVVGRExFZEJRVWNzUlVGQlJUdE5RVU01UWl4UFFVRlBMRU5CUVVNc1ZVRkJWU3hGUVVGRkxFTkJRVU03UVVGRE0wSXNTMEZCU3pzN1NVRkZSQ3hMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEZGQlFWRXNSVUZCUlN4TlFVRk5MRU5CUVVNc1EwRkJRenRCUVVOb1F5eEpRVUZKTEUxQlFVMHNRMEZCUXl4dFFrRkJiVUlzUlVGQlJTeERRVUZET3p0SFFVVTVRanRCUVVOSUxFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVklMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzUzBGQlN5eERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5b3FYRzRnS2lCQWFuTjRJRkpsWVdOMExrUlBUVnh1SUNvdlhHNWNiblpoY2lCVWFHVmhaRHRjYm5aaGNpQlNaV0ZqZENBZ0lDQWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDY3BPMXh1ZG1GeUlFSmhZMnRpYjI1bElDQTlJSEpsY1hWcGNtVW9KMkpoWTJ0aWIyNWxKeWs3WEc1MllYSWdWR2dnSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duTGk5MGFGOTNjbUZ3Y0dWeUxtcHplQ2NwTzF4dVhHNVVhR1ZoWkNBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNiaUFnY0hKdmNGUjVjR1Z6T2lCN1hHNGdJQ0FnYzNSdmNtVTZJRkpsWVdOMExsQnliM0JVZVhCbGN5NXBibk4wWVc1alpVOW1LRUpoWTJ0aWIyNWxMazF2WkdWc0tTNXBjMUpsY1hWcGNtVmtYRzRnSUgwc1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCamIyeHpJRDBnZEdocGN5NWZZblZwYkdSRGIyeDFiVzV6S0NrN1hHNWNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEhSb1pXRmtJR05zWVhOelRtRnRaVDE3ZEdocGN5NXdjbTl3Y3k1amJHRnpjMDVoYldWOVBseHVJQ0FnSUNBZ0lDQThkSEkrWEc0Z0lDQWdJQ0FnSUNBZ2UyTnZiSE45WEc0Z0lDQWdJQ0FnSUR3dmRISStYRzRnSUNBZ0lDQThMM1JvWldGa1BseHVJQ0FnSUNrN1hHNGdJSDBzWEc0Z0lGOWlkV2xzWkVOdmJIVnRibk02SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMllYSWdaR0YwWVR0Y2JpQWdJQ0IyWVhJZ1kyOXNkVzF1Y3lBOUlGdGRPMXh1SUNBZ0lIWmhjaUJ6ZEc5eVpTQTlJSFJvYVhNdWNISnZjSE11YzNSdmNtVTdYRzRnSUNBZ2RtRnlJR04xY25KbGJuUWdQU0J6ZEc5eVpTNW5aWFFvSjJacGNuTjBKeWs3WEc1Y2JpQWdJQ0IzYUdsc1pTQW9ZM1Z5Y21WdWRDa2dlMXh1SUNBZ0lDQWdaR0YwWVNBZ0lDQWdJQ0FnSUNBZ0lDQWdQU0I3ZlR0Y2JpQWdJQ0FnSUdSaGRHRXVhR0Z1Wkd4bFEyeHBZMnNnSUQwZ1kzVnljbVZ1ZEM1blpYUW9KM052Y25SaFlteGxKeWtnUHlCMGFHbHpMbDl6YjNKMFNHRnVaR3hsY2k1aWFXNWtLSFJvYVhNc0lHTjFjbkpsYm5RcElEb2diblZzYkR0Y2JpQWdJQ0FnSUdSaGRHRXVjM1J2Y21VZ0lDQWdJQ0FnSUQwZ1kzVnljbVZ1ZER0Y2JpQWdJQ0FnSUdSaGRHRXVZMnhoYzNOT1lXMWxJQ0FnSUQwZ1kzVnljbVZ1ZEM1blpYUW9KM1I1Y0dVbktTQTlQVDBnSjJOaGMyVmZZV04wYVc5dWN5Y2dQeUFuWVdOMGFXOXVjeTFqYjJ3bklEb2dKeWM3WEc1Y2JpQWdJQ0FnSUdOdmJIVnRibk11Y0hWemFDZzhWR2dnZXk0dUxtUmhkR0Y5SUd0bGVUMTdZM1Z5Y21WdWRDNWphV1I5SUM4K0tUdGNiaUFnSUNBZ0lHTjFjbkpsYm5RZ1BTQmpkWEp5Wlc1MExtNWxlSFE3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdjbVYwZFhKdUlHTnZiSFZ0Ym5NN1hHNGdJSDBzWEc0Z0lGOXpiM0owU0dGdVpHeGxjam9nWm5WdVkzUnBiMjRnS0hOdmNuUmxaU2tnZTF4dUlDQWdJSFpoY2lCemRHOXlaU0FnSUQwZ2RHaHBjeTV3Y205d2N5NXpkRzl5WlR0Y2JpQWdJQ0IyWVhJZ1kzVnljbVZ1ZENBOUlITjBiM0psTG1kbGRDZ25jMjl5ZEdWbEp5azdYRzVjYmlBZ0lDQnBaaUFvWTNWeWNtVnVkQzVqYVdRZ0lUMDlJSE52Y25SbFpTNWphV1FwSUh0Y2JpQWdJQ0FnSUdOMWNuSmxiblF1Wlc1a1UyOXlkR2x1WnlncE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUhOMGIzSmxMbk5sZENnbmMyOXlkR1ZsSnl3Z2MyOXlkR1ZsS1R0Y2JpQWdJQ0J6YjNKMFpXVXVkRzluWjJ4bFUyOXlkRVJwY21WamRHbHZiaWdwTzF4dVhHNGdJSDFjYm4wcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRlJvWldGa08xeHVJbDE5IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBCdXR0b24gICAgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL2J1dHRvbi5qc3gnKTtcbnZhciBJY29uICAgICAgPSByZXF1aXJlKCcuL2ljb25fd3JhcHBlci5qc3gnKTtcbnZhciBtb21lbnQgICAgPSByZXF1aXJlKCdtb21lbnQnKTtcbnZhciBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cycpO1xuXG4vKipcbiAqIEVhY2ggdHJhbnNmb3JtZXIgc2hvdWxkIHRha2UgY2FzZSBhbmQgYXR0cl9uYW1lIHBhcmFtc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY2FzZV9kZXRhaWxzOiBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICB2YXIgdHlwZSAgICA9IG1vZGVsLmdldCgndHlwZScpO1xuICAgIHZhciBhc3NldCAgID0gbW9kZWwuZ2V0KCdkZXZpY2UnKTtcbiAgICB2YXIgc3VidHlwZSA9IG1vZGVsLmdldCgnc3VidHlwZScpO1xuICAgIHZhciB0aXRsZSAgID0gdHlwZSArICc6ICcgKyBhc3NldCArICcgKCcgKyBzdWJ0eXBlICsgJyknO1xuICAgIHZhciB1cGRhdGVkID0gbW9tZW50KG1vZGVsLmdldCgndXBkYXRlZF9kYXRlJykpLmZvcm1hdChjb25zdGFudHMuREFURV9GT1JNQVQpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgdGl0bGUpLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJtdXRlZCBzbWFsbFwifSwgXCJMYXN0IHVwZGF0ZTogXCIsIHVwZGF0ZWQpLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2NsYXNzTmFtZTogXCJmZWF1eC1idXR0b24gc21hbGxcIn0sIFwiRGV0YWlsc1wiKVxuICAgICAgKVxuICAgIClcbiAgfSxcbiAgc3RhdHVzOiBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICB2YXIgc3RhdHVzICA9IG1vZGVsLmdldCgnc3RhdHVzJyk7XG4gICAgdmFyIHByb3BzICAgPSB7XG4gICAgICB0eXBlOiAgICAgICBzdGF0dXMsXG4gICAgICBjbGFzc05hbWU6ICBzdGF0dXMgPT09ICdjbG9zZWQnID8gJ211dGVkJyA6ICcnXG4gICAgfTtcblxuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCBSZWFjdC5fX3NwcmVhZCh7fSwgIHByb3BzKSkpO1xuICB9LFxuICBjYXNlX3JlcG9ydGVkOiBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICB2YXIgcmVwb3J0ZXIgID0gbW9kZWwuZ2V0KCdyZXBvcnRlcicpO1xuICAgIHZhciBjcmVhdGVkICAgPSBtb21lbnQobW9kZWwuZ2V0KCdjcmVhdGVkX2RhdGUnKSkuZm9ybWF0KGNvbnN0YW50cy5EQVRFX0ZPUk1BVCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCByZXBvcnRlciksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcIm11dGVkIHNtYWxsXCJ9LCBjcmVhdGVkKVxuICAgICAgKVxuICAgIClcbiAgfSxcbiAgY2FzZV9hc3NpZ25tZW50OiBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICB2YXIgYXNzaWdubWVudHMgPSAoUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJub2RhdGFcIn0sIFwiTm8gYXNzaWdubWVudFwiKSk7XG4gICAgdmFyIGdyb3VwICAgICAgID0gbW9kZWwuZ2V0KCdhc3NpZ25lZF9ncm91cCcpO1xuICAgIHZhciBwZXJzb24gICAgICA9IG1vZGVsLmdldCgnYXNzaWduZWRfcGVyc29uJyk7XG5cbiAgICBpZiAoZ3JvdXAgfHwgcGVyc29uKSB7XG4gICAgICBhc3NpZ25tZW50cyA9IFtcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7a2V5OiBcImdyb3VwXCJ9LCBncm91cCksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2tleTogXCJwZXJzb25cIn0sIHBlcnNvbilcbiAgICAgIF07XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG4gICAgICAgIGFzc2lnbm1lbnRzXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgcHJpb3JpdHk6IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgIHZhciBwcmlvcml0eSAgICA9IG1vZGVsLmdldCgncHJpb3JpdHknKTtcbiAgICB2YXIgY2xhc3NfbmFtZXMgPSBbJ3ByaW9yaXR5JywgJ3ByaW9yaXR5LScgKyBwcmlvcml0eV07XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogY2xhc3NfbmFtZXMuam9pbignICcpfSwgXG4gICAgICAgIHByaW9yaXR5XG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgY2FzZV9hY3Rpb25zOiBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICB2YXIgYnV0dG9uID0gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwibm9kYXRhXCJ9LCBcIk5vbmUgYXZhaWxhYmxlXCIpKTtcblxuICAgIGlmIChtb2RlbC5nZXQoJ3JlcG9ydGVyJykgIT09ICdCcmlhbicpIHtcbiAgICAgIHJldHVybiBidXR0b247XG4gICAgfVxuXG4gICAgaWYgKG1vZGVsLmdldCgnc3RhdHVzJykgPT09ICdjbG9zZWQnKSB7XG4gICAgICByZXR1cm4gYnV0dG9uO1xuICAgIH1cblxuICAgIGJ1dHRvbiA9IChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7aWNvbjogXCJwbHVzXCIsIHRleHQ6IFwiQ2xvc2UgY2FzZVwiLCBvbkNsaWNrOiB0aGlzLl9jbG9zZUNhc2V9KVxuICAgICk7XG5cbiAgICByZXR1cm4gYnV0dG9uO1xuICB9XG59O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDIxdlpIVnNaWE12WTJGelpYTXZkSEpoYm5ObWIzSnRaWEp6TG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHM3UVVGRlFTeEhRVUZIT3p0QlFVVklMRWxCUVVrc1RVRkJUU3hOUVVGTkxFOUJRVThzUTBGQlF5dzJRa0ZCTmtJc1EwRkJReXhEUVVGRE8wRkJRM1pFTEVsQlFVa3NTVUZCU1N4UlFVRlJMRTlCUVU4c1EwRkJReXh2UWtGQmIwSXNRMEZCUXl4RFFVRkRPMEZCUXpsRExFbEJRVWtzVFVGQlRTeE5RVUZOTEU5QlFVOHNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRCUVVOc1F5eEpRVUZKTEV0QlFVc3NUMEZCVHl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRGFrTXNTVUZCU1N4VFFVRlRMRWRCUVVjc1QwRkJUeXhEUVVGRExHbENRVUZwUWl4RFFVRkRMRU5CUVVNN08wRkJSVE5ET3p0SFFVVkhPMEZCUTBnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ6dEZRVU5tTEZsQlFWa3NSVUZCUlN4VlFVRlZMRXRCUVVzc1JVRkJSVHRKUVVNM1FpeEpRVUZKTEVsQlFVa3NUVUZCVFN4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETzBsQlEyaERMRWxCUVVrc1MwRkJTeXhMUVVGTExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1NVRkRiRU1zU1VGQlNTeFBRVUZQTEVkQlFVY3NTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEpRVU51UXl4SlFVRkpMRXRCUVVzc1MwRkJTeXhKUVVGSkxFZEJRVWNzU1VGQlNTeEhRVUZITEV0QlFVc3NSMEZCUnl4SlFVRkpMRWRCUVVjc1QwRkJUeXhIUVVGSExFZEJRVWNzUTBGQlF6dEJRVU0zUkN4SlFVRkpMRWxCUVVrc1QwRkJUeXhIUVVGSExFMUJRVTBzUTBGQlF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMR05CUVdNc1EwRkJReXhEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEZOQlFWTXNRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJRenM3U1VGRk9VVTdUVUZEUlN4dlFrRkJRU3hMUVVGSkxFVkJRVUVzU1VGQlF5eEZRVUZCTzFGQlEwZ3NiMEpCUVVFc1MwRkJTU3hGUVVGQkxFbEJRVU1zUlVGQlF5eExRVUZaTEVOQlFVRXNSVUZCUVR0UlFVTnNRaXh2UWtGQlFTeE5RVUZMTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExHRkJRV01zUTBGQlFTeEZRVUZCTEdWQlFVRXNSVUZCWXl4UFFVRmxMRU5CUVVFc1JVRkJRVHRSUVVNelJDeHZRa0ZCUVN4SFFVRkZMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEc5Q1FVRnhRaXhEUVVGQkxFVkJRVUVzVTBGQlZ5eERRVUZCTzAxQlEzcERMRU5CUVVFN1MwRkRVRHRIUVVOR08wVkJRMFFzVFVGQlRTeEZRVUZGTEZWQlFWVXNTMEZCU3l4RlFVRkZPMGxCUTNaQ0xFbEJRVWtzVFVGQlRTeEpRVUZKTEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03U1VGRGJFTXNTVUZCU1N4TFFVRkxMRXRCUVVzN1RVRkRXaXhKUVVGSkxGRkJRVkVzVFVGQlRUdE5RVU5zUWl4VFFVRlRMRWRCUVVjc1RVRkJUU3hMUVVGTExGRkJRVkVzUjBGQlJ5eFBRVUZQTEVkQlFVY3NSVUZCUlR0QlFVTndSQ3hMUVVGTExFTkJRVU03TzBsQlJVWXNVVUZCVVN4dlFrRkJReXhKUVVGSkxFVkJRVUVzWjBKQlFVRXNSMEZCUVN4RFFVRkZMRWRCUVVjc1MwRkJUU3hEUVVGQkxFTkJRVWNzUTBGQlFTeEZRVUZGTzBkQlF6bENPMFZCUTBRc1lVRkJZU3hGUVVGRkxGVkJRVlVzUzBGQlN5eEZRVUZGTzBsQlF6bENMRWxCUVVrc1VVRkJVU3hKUVVGSkxFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNN1FVRkRNVU1zU1VGQlNTeEpRVUZKTEU5QlFVOHNTMEZCU3l4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eGpRVUZqTEVOQlFVTXNRMEZCUXl4RFFVRkRMRTFCUVUwc1EwRkJReXhUUVVGVExFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTTdPMGxCUldoR08wMUJRMFVzYjBKQlFVRXNTMEZCU1N4RlFVRkJMRWxCUVVNc1JVRkJRVHRSUVVOSUxHOUNRVUZCTEV0QlFVa3NSVUZCUVN4SlFVRkRMRVZCUVVNc1VVRkJaU3hEUVVGQkxFVkJRVUU3VVVGRGNrSXNiMEpCUVVFc1RVRkJTeXhGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4aFFVRmpMRU5CUVVFc1JVRkJReXhQUVVGbExFTkJRVUU3VFVGRE1VTXNRMEZCUVR0TFFVTlFPMGRCUTBZN1JVRkRSQ3hsUVVGbExFVkJRVVVzVlVGQlZTeExRVUZMTEVWQlFVVTdTVUZEYUVNc1NVRkJTU3hYUVVGWExFbEJRVWtzYjBKQlFVRXNUVUZCU3l4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eFJRVUZUTEVOQlFVRXNSVUZCUVN4bFFVRnZRaXhEUVVGQkxFTkJRVU1zUTBGQlF6dEpRVU5zUlN4SlFVRkpMRXRCUVVzc1UwRkJVeXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEdkQ1FVRm5RaXhEUVVGRExFTkJRVU03UVVGRGJFUXNTVUZCU1N4SlFVRkpMRTFCUVUwc1VVRkJVU3hMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEdsQ1FVRnBRaXhEUVVGRExFTkJRVU03TzBsQlJTOURMRWxCUVVrc1MwRkJTeXhKUVVGSkxFMUJRVTBzUlVGQlJUdE5RVU51UWl4WFFVRlhMRWRCUVVjN1VVRkRXaXh2UWtGQlFTeExRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRWRCUVVFc1JVRkJSeXhEUVVGRExFOUJRVkVzUTBGQlFTeEZRVUZETEV0QlFWa3NRMEZCUVR0UlFVTTVRaXh2UWtGQlFTeExRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRWRCUVVFc1JVRkJSeXhEUVVGRExGRkJRVk1zUTBGQlFTeEZRVUZETEUxQlFXRXNRMEZCUVR0UFFVTnFReXhEUVVGRE8wRkJRMUlzUzBGQlN6czdTVUZGUkR0TlFVTkZMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeEpRVUZETEVWQlFVRTdVVUZEUml4WFFVRlpPMDFCUTFRc1EwRkJRVHROUVVOT08wZEJRMGc3UlVGRFJDeFJRVUZSTEVWQlFVVXNWVUZCVlN4TFFVRkxMRVZCUVVVN1NVRkRla0lzU1VGQlNTeFJRVUZSTEUxQlFVMHNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6dEJRVU0xUXl4SlFVRkpMRWxCUVVrc1YwRkJWeXhIUVVGSExFTkJRVU1zVlVGQlZTeEZRVUZGTEZkQlFWY3NSMEZCUnl4UlFVRlJMRU5CUVVNc1EwRkJRenM3U1VGRmRrUTdUVUZEUlN4dlFrRkJRU3hOUVVGTExFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkZMRmRCUVZjc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZITEVOQlFVRXNSVUZCUVR0UlFVTnlReXhSUVVGVE8wMUJRMHdzUTBGQlFUdE5RVU5RTzBkQlEwZzdSVUZEUkN4WlFVRlpMRVZCUVVVc1ZVRkJWU3hMUVVGTExFVkJRVVU3UVVGRGFrTXNTVUZCU1N4SlFVRkpMRTFCUVUwc1NVRkJTU3h2UWtGQlFTeE5RVUZMTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExGRkJRVk1zUTBGQlFTeEZRVUZCTEdkQ1FVRnhRaXhEUVVGQkxFTkJRVU1zUTBGQlF6czdTVUZGT1VRc1NVRkJTU3hMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFWVXNRMEZCUXl4TFFVRkxMRTlCUVU4c1JVRkJSVHROUVVOeVF5eFBRVUZQTEUxQlFVMHNRMEZCUXp0QlFVTndRaXhMUVVGTE96dEpRVVZFTEVsQlFVa3NTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhSUVVGUkxFTkJRVU1zUzBGQlN5eFJRVUZSTEVWQlFVVTdUVUZEY0VNc1QwRkJUeXhOUVVGTkxFTkJRVU03UVVGRGNFSXNTMEZCU3pzN1NVRkZSQ3hOUVVGTk8wMUJRMG9zYjBKQlFVTXNUVUZCVFN4RlFVRkJMRU5CUVVFc1EwRkJReXhKUVVGQkxFVkJRVWtzUTBGQlF5eE5RVUZCTEVWQlFVMHNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJReXhaUVVGQkxFVkJRVmtzUTBGQlF5eFBRVUZCTEVWQlFVOHNRMEZCUlN4SlFVRkpMRU5CUVVNc1ZVRkJWeXhEUVVGQkxFTkJRVWNzUTBGQlFUdEJRVU40UlN4TFFVRkxMRU5CUVVNN08wbEJSVVlzVDBGQlR5eE5RVUZOTEVOQlFVTTdSMEZEWmp0RFFVTkdMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlFQnFjM2dnVW1WaFkzUXVSRTlOWEc0Z0tpOWNibHh1ZG1GeUlFSjFkSFJ2YmlBZ0lDQTlJSEpsY1hWcGNtVW9KeTR1THk0dUwyTnZiWEJ2Ym1WdWRITXZZblYwZEc5dUxtcHplQ2NwTzF4dWRtRnlJRWxqYjI0Z0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dmFXTnZibDkzY21Gd2NHVnlMbXB6ZUNjcE8xeHVkbUZ5SUcxdmJXVnVkQ0FnSUNBOUlISmxjWFZwY21Vb0oyMXZiV1Z1ZENjcE8xeHVkbUZ5SUZKbFlXTjBJQ0FnSUNBOUlISmxjWFZwY21Vb0ozSmxZV04wSnlrN1hHNTJZWElnWTI5dWMzUmhiblJ6SUQwZ2NtVnhkV2x5WlNnbkxpNHZMaTR2WTI5dWMzUmhiblJ6SnlrN1hHNWNiaThxS2x4dUlDb2dSV0ZqYUNCMGNtRnVjMlp2Y20xbGNpQnphRzkxYkdRZ2RHRnJaU0JqWVhObElHRnVaQ0JoZEhSeVgyNWhiV1VnY0dGeVlXMXpYRzRnS2k5Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2UxeHVJQ0JqWVhObFgyUmxkR0ZwYkhNNklHWjFibU4wYVc5dUlDaHRiMlJsYkNrZ2UxeHVJQ0FnSUhaaGNpQjBlWEJsSUNBZ0lEMGdiVzlrWld3dVoyVjBLQ2QwZVhCbEp5azdYRzRnSUNBZ2RtRnlJR0Z6YzJWMElDQWdQU0J0YjJSbGJDNW5aWFFvSjJSbGRtbGpaU2NwTzF4dUlDQWdJSFpoY2lCemRXSjBlWEJsSUQwZ2JXOWtaV3d1WjJWMEtDZHpkV0owZVhCbEp5azdYRzRnSUNBZ2RtRnlJSFJwZEd4bElDQWdQU0IwZVhCbElDc2dKem9nSnlBcklHRnpjMlYwSUNzZ0p5QW9KeUFySUhOMVluUjVjR1VnS3lBbktTYzdYRzRnSUNBZ2RtRnlJSFZ3WkdGMFpXUWdQU0J0YjIxbGJuUW9iVzlrWld3dVoyVjBLQ2QxY0dSaGRHVmtYMlJoZEdVbktTa3VabTl5YldGMEtHTnZibk4wWVc1MGN5NUVRVlJGWDBaUFVrMUJWQ2s3WEc1Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQR1JwZGo1Y2JpQWdJQ0FnSUNBZ1BHUnBkajU3ZEdsMGJHVjlQQzlrYVhZK1hHNGdJQ0FnSUNBZ0lEeHpjR0Z1SUdOc1lYTnpUbUZ0WlQxY0ltMTFkR1ZrSUhOdFlXeHNYQ0krVEdGemRDQjFjR1JoZEdVNklIdDFjR1JoZEdWa2ZUd3ZjM0JoYmo1Y2JpQWdJQ0FnSUNBZ1BHRWdZMnhoYzNOT1lXMWxQVndpWm1WaGRYZ3RZblYwZEc5dUlITnRZV3hzWENJK1JHVjBZV2xzY3p3dllUNWNiaUFnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ2xjYmlBZ2ZTeGNiaUFnYzNSaGRIVnpPaUJtZFc1amRHbHZiaUFvYlc5a1pXd3BJSHRjYmlBZ0lDQjJZWElnYzNSaGRIVnpJQ0E5SUcxdlpHVnNMbWRsZENnbmMzUmhkSFZ6SnlrN1hHNGdJQ0FnZG1GeUlIQnliM0J6SUNBZ1BTQjdYRzRnSUNBZ0lDQjBlWEJsT2lBZ0lDQWdJQ0J6ZEdGMGRYTXNYRzRnSUNBZ0lDQmpiR0Z6YzA1aGJXVTZJQ0J6ZEdGMGRYTWdQVDA5SUNkamJHOXpaV1FuSUQ4Z0oyMTFkR1ZrSnlBNklDY25YRzRnSUNBZ2ZUdGNibHh1SUNBZ0lISmxkSFZ5YmlBb1BFbGpiMjRnZXk0dUxuQnliM0J6ZlNBdlBpazdYRzRnSUgwc1hHNGdJR05oYzJWZmNtVndiM0owWldRNklHWjFibU4wYVc5dUlDaHRiMlJsYkNrZ2UxeHVJQ0FnSUhaaGNpQnlaWEJ2Y25SbGNpQWdQU0J0YjJSbGJDNW5aWFFvSjNKbGNHOXlkR1Z5SnlrN1hHNGdJQ0FnZG1GeUlHTnlaV0YwWldRZ0lDQTlJRzF2YldWdWRDaHRiMlJsYkM1blpYUW9KMk55WldGMFpXUmZaR0YwWlNjcEtTNW1iM0p0WVhRb1kyOXVjM1JoYm5SekxrUkJWRVZmUms5U1RVRlVLVHRjYmx4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThaR2wyUGx4dUlDQWdJQ0FnSUNBOFpHbDJQbnR5WlhCdmNuUmxjbjA4TDJScGRqNWNiaUFnSUNBZ0lDQWdQSE53WVc0Z1kyeGhjM05PWVcxbFBWd2liWFYwWldRZ2MyMWhiR3hjSWo1N1kzSmxZWFJsWkgwOEwzTndZVzQrWEc0Z0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBcFhHNGdJSDBzWEc0Z0lHTmhjMlZmWVhOemFXZHViV1Z1ZERvZ1puVnVZM1JwYjI0Z0tHMXZaR1ZzS1NCN1hHNGdJQ0FnZG1GeUlHRnpjMmxuYm0xbGJuUnpJRDBnS0R4emNHRnVJR05zWVhOelRtRnRaVDFjSW01dlpHRjBZVndpUGs1dklHRnpjMmxuYm0xbGJuUThMM053WVc0K0tUdGNiaUFnSUNCMllYSWdaM0p2ZFhBZ0lDQWdJQ0FnUFNCdGIyUmxiQzVuWlhRb0oyRnpjMmxuYm1Wa1gyZHliM1Z3SnlrN1hHNGdJQ0FnZG1GeUlIQmxjbk52YmlBZ0lDQWdJRDBnYlc5a1pXd3VaMlYwS0NkaGMzTnBaMjVsWkY5d1pYSnpiMjRuS1R0Y2JseHVJQ0FnSUdsbUlDaG5jbTkxY0NCOGZDQndaWEp6YjI0cElIdGNiaUFnSUNBZ0lHRnpjMmxuYm0xbGJuUnpJRDBnVzF4dUlDQWdJQ0FnSUNBOFpHbDJJR3RsZVQwblozSnZkWEFuUG50bmNtOTFjSDA4TDJScGRqNHNYRzRnSUNBZ0lDQWdJRHhrYVhZZ2EyVjVQU2R3WlhKemIyNG5QbnR3WlhKemIyNTlQQzlrYVhZK1hHNGdJQ0FnSUNCZE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4WkdsMlBseHVJQ0FnSUNBZ0lDQjdZWE56YVdkdWJXVnVkSE45WEc0Z0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBcE8xeHVJQ0I5TEZ4dUlDQndjbWx2Y21sMGVUb2dablZ1WTNScGIyNGdLRzF2WkdWc0tTQjdYRzRnSUNBZ2RtRnlJSEJ5YVc5eWFYUjVJQ0FnSUQwZ2JXOWtaV3d1WjJWMEtDZHdjbWx2Y21sMGVTY3BPMXh1SUNBZ0lIWmhjaUJqYkdGemMxOXVZVzFsY3lBOUlGc25jSEpwYjNKcGRIa25MQ0FuY0hKcGIzSnBkSGt0SnlBcklIQnlhVzl5YVhSNVhUdGNibHh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOGMzQmhiaUJqYkdGemMwNWhiV1U5ZTJOc1lYTnpYMjVoYldWekxtcHZhVzRvSnlBbktYMCtYRzRnSUNBZ0lDQWdJSHR3Y21sdmNtbDBlWDFjYmlBZ0lDQWdJRHd2YzNCaGJqNWNiaUFnSUNBcE8xeHVJQ0I5TEZ4dUlDQmpZWE5sWDJGamRHbHZibk02SUdaMWJtTjBhVzl1SUNodGIyUmxiQ2tnZTF4dUlDQWdJSFpoY2lCaWRYUjBiMjRnUFNBb1BITndZVzRnWTJ4aGMzTk9ZVzFsUFZ3aWJtOWtZWFJoWENJK1RtOXVaU0JoZG1GcGJHRmliR1U4TDNOd1lXNCtLVHRjYmx4dUlDQWdJR2xtSUNodGIyUmxiQzVuWlhRb0ozSmxjRzl5ZEdWeUp5a2dJVDA5SUNkQ2NtbGhiaWNwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJpZFhSMGIyNDdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLRzF2WkdWc0xtZGxkQ2duYzNSaGRIVnpKeWtnUFQwOUlDZGpiRzl6WldRbktTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z1luVjBkRzl1TzF4dUlDQWdJSDFjYmx4dUlDQWdJR0oxZEhSdmJpQTlJQ2hjYmlBZ0lDQWdJRHhDZFhSMGIyNGdhV052YmoxY0luQnNkWE5jSWlCMFpYaDBQVndpUTJ4dmMyVWdZMkZ6WlZ3aUlHOXVRMnhwWTJzOWUzUm9hWE11WDJOc2IzTmxRMkZ6WlgwZ0x6NWNiaUFnSUNBcE8xeHVYRzRnSUNBZ2NtVjBkWEp1SUdKMWRIUnZianRjYmlBZ2ZWeHVmVHRjYmlKZGZRPT0iLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gU2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzQ0NjE3MC9lc2NhcGUtc3RyaW5nLWZvci11c2UtaW4tamF2YXNjcmlwdC1yZWdleFxuXG52YXIgc3BlY2lhbHM7XG52YXIgcmVnZXg7XG5cbnNwZWNpYWxzID0gW1xuICAvLyBvcmRlciBtYXR0ZXJzIGZvciB0aGVzZVxuICAgICctJ1xuICAsICdbJ1xuICAsICddJ1xuICAvLyBvcmRlciBkb2Vzbid0IG1hdHRlciBmb3IgYW55IG9mIHRoZXNlXG4gICwgJy8nXG4gICwgJ3snXG4gICwgJ30nXG4gICwgJygnXG4gICwgJyknXG4gICwgJyonXG4gICwgJysnXG4gICwgJz8nXG4gICwgJy4nXG4gICwgJ1xcXFwnXG4gICwgJ14nXG4gICwgJyQnXG4gICwgJ3wnXG5dO1xuXG5yZWdleCA9IG5ldyBSZWdFeHAoJ1snICsgc3BlY2lhbHMuam9pbignXFxcXCcpICsgJ10nLCAnZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKHJlZ2V4LCAnXFxcXCQmJyk7XG59O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDNWMGFXeHpMMlZ6WTJGd1pWOXlaV2RsZUM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3haUVVGWkxFTkJRVU03TzBGQlJXSXNNa1pCUVRKR096dEJRVVV6Uml4SlFVRkpMRkZCUVZFc1EwRkJRenRCUVVOaUxFbEJRVWtzUzBGQlN5eERRVUZET3p0QlFVVldMRkZCUVZFc1IwRkJSenM3U1VGRlVDeEhRVUZITzBsQlEwZ3NSMEZCUnp0QlFVTlFMRWxCUVVrc1IwRkJSenM3U1VGRlNDeEhRVUZITzBsQlEwZ3NSMEZCUnp0SlFVTklMRWRCUVVjN1NVRkRTQ3hIUVVGSE8wbEJRMGdzUjBGQlJ6dEpRVU5JTEVkQlFVYzdTVUZEU0N4SFFVRkhPMGxCUTBnc1IwRkJSenRKUVVOSUxFZEJRVWM3U1VGRFNDeEpRVUZKTzBsQlEwb3NSMEZCUnp0SlFVTklMRWRCUVVjN1NVRkRTQ3hIUVVGSE8wRkJRMUFzUTBGQlF5eERRVUZET3p0QlFVVkdMRXRCUVVzc1IwRkJSeXhKUVVGSkxFMUJRVTBzUTBGQlF5eEhRVUZITEVkQlFVY3NVVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eEhRVUZITEVWQlFVVXNSMEZCUnl4RFFVRkRMRU5CUVVNN08wRkJSWHBFTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1ZVRkJWU3hOUVVGTkxFVkJRVVU3UlVGRGFrTXNUMEZCVHl4TlFVRk5MRU5CUVVNc1QwRkJUeXhEUVVGRExFdEJRVXNzUlVGQlJTeE5RVUZOTEVOQlFVTXNRMEZCUXp0RFFVTjBReXhEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lYQ0oxYzJVZ2MzUnlhV04wWENJN1hHNWNiaTh2SUZObFpTQm9kSFJ3T2k4dmMzUmhZMnR2ZG1WeVpteHZkeTVqYjIwdmNYVmxjM1JwYjI1ekx6TTBORFl4TnpBdlpYTmpZWEJsTFhOMGNtbHVaeTFtYjNJdGRYTmxMV2x1TFdwaGRtRnpZM0pwY0hRdGNtVm5aWGhjYmx4dWRtRnlJSE53WldOcFlXeHpPMXh1ZG1GeUlISmxaMlY0TzF4dVhHNXpjR1ZqYVdGc2N5QTlJRnRjYmlBZ0x5OGdiM0prWlhJZ2JXRjBkR1Z5Y3lCbWIzSWdkR2hsYzJWY2JpQWdJQ0FuTFNkY2JpQWdMQ0FuV3lkY2JpQWdMQ0FuWFNkY2JpQWdMeThnYjNKa1pYSWdaRzlsYzI0bmRDQnRZWFIwWlhJZ1ptOXlJR0Z1ZVNCdlppQjBhR1Z6WlZ4dUlDQXNJQ2N2SjF4dUlDQXNJQ2Q3SjF4dUlDQXNJQ2Q5SjF4dUlDQXNJQ2NvSjF4dUlDQXNJQ2NwSjF4dUlDQXNJQ2NxSjF4dUlDQXNJQ2NySjF4dUlDQXNJQ2MvSjF4dUlDQXNJQ2N1SjF4dUlDQXNJQ2RjWEZ4Y0oxeHVJQ0FzSUNkZUoxeHVJQ0FzSUNja0oxeHVJQ0FzSUNkOEoxeHVYVHRjYmx4dWNtVm5aWGdnUFNCdVpYY2dVbVZuUlhod0tDZGJKeUFySUhOd1pXTnBZV3h6TG1wdmFXNG9KMXhjWEZ3bktTQXJJQ2RkSnl3Z0oyY25LVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCbWRXNWpkR2x2YmlBb2MzUnlhVzVuS1NCN1hHNGdJSEpsZEhWeWJpQnpkSEpwYm1jdWNtVndiR0ZqWlNoeVpXZGxlQ3dnSjF4Y1hGd2tKaWNwTzF4dWZUdGNiaUpkZlE9PSIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbmZ1bmN0aW9uIFNjcm9sbGVyQ29hc3RlciAoZWxlbWVudHMsIG9wdGlvbnMpIHtcbiAgaWYgKCEgKHRoaXMgaW5zdGFuY2VvZiBTY3JvbGxlckNvYXN0ZXIpKSB7XG4gICAgcmV0dXJuIG5ldyBTY3JvbGxlckNvYXN0ZXIoZWxlbWVudHMsIG9wdGlvbnMpO1xuICB9XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdGhpcy5lbGVtZW50cyAgICAgPSBBcnJheS5pc0FycmF5KGVsZW1lbnRzKSA/IGVsZW1lbnRzIDogW2VsZW1lbnRzXTtcbiAgdGhpcy5jdXJyZW50ICAgICAgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gIHRoaXMuc3RhcnQgICAgICAgID0gMDtcbiAgdGhpcy5zdGVwcyAgICAgICAgPSBvcHRpb25zLnN0ZXBzIHx8IDE1MDtcblxuICB0aGlzLmNhbGN1bGF0ZVNjcm9sbFBvc2l0aW9uKCkuc3RlcCgwKTtcbn1cblxuU2Nyb2xsZXJDb2FzdGVyLnByb3RvdHlwZS5nZXRUb3AgPSBmdW5jdGlvbiBnZXRUb3AgKCkge1xuICByZXR1cm4gJCh0aGlzLmVsZW1lbnRzWzBdKS5vZmZzZXQoKS50b3AgfHwgMDtcbn07XG5cblNjcm9sbGVyQ29hc3Rlci5wcm90b3R5cGUuZ2V0VG90YWxIZWlnaHQgPSBmdW5jdGlvbiBnZXRUb3RhbEhlaWdodCAoKSB7XG4gIHZhciBoZWlnaHQgPSAwO1xuXG4gIHRoaXMuZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICBoZWlnaHQgKz0gJChlbCkub3V0ZXJIZWlnaHQoKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhlaWdodDtcbn07XG5cblNjcm9sbGVyQ29hc3Rlci5wcm90b3R5cGUuY2FsY3VsYXRlU2Nyb2xsUG9zaXRpb24gPSBmdW5jdGlvbiBjYWxjdWxhdGVTY3JvbGxQb3NpdGlvbiAoKSB7XG4gIHZhciB3aW5kb3dfaGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xuICB2YXIgbWlkICAgICAgICAgICA9IHdpbmRvd19oZWlnaHQgLyAyO1xuICB2YXIgdG9wICAgICAgICAgICA9IHRoaXMuZ2V0VG9wKCk7XG4gIHZhciBoZWlnaHQgICAgICAgID0gdGhpcy5nZXRUb3RhbEhlaWdodCgpO1xuICB2YXIgZGVzdGluYXRpb24gICA9IGhlaWdodCA+IHdpbmRvd19oZWlnaHQgPyB0b3AgOiB0b3AgLSBtaWQgKyBoZWlnaHQgLSAoaGVpZ2h0IC8gMilcblxuICB0aGlzLmRpZmYgPSBkZXN0aW5hdGlvbiAtIHRoaXMuY3VycmVudDtcblxuICByZXR1cm4gdGhpcztcbn07XG5cblNjcm9sbGVyQ29hc3Rlci5wcm90b3R5cGUuc3RlcCA9IGZ1bmN0aW9uIHN0ZXAgKHRpbWVzdGFtcCkge1xuICB2YXIgcHJvZ3Jlc3M7XG4gIHZhciBwZXJjZW50O1xuXG4gIHRoaXMuc3RhcnQgID0gdGhpcy5zdGFydCB8fCB0aW1lc3RhbXA7XG4gIHByb2dyZXNzICAgID0gdGltZXN0YW1wIC0gdGhpcy5zdGFydDtcbiAgcGVyY2VudCAgICAgPSBNYXRoLm1pbihwcm9ncmVzcyAvIHRoaXMuc3RlcHMsIDEpO1xuXG4gIHNjcm9sbFRvKDAsIHRoaXMuY3VycmVudCArICh0aGlzLmRpZmYgKiBwZXJjZW50KSk7XG5cbiAgaWYgKHBlcmNlbnQgPCAxKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuc3RlcC5iaW5kKHRoaXMpKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTY3JvbGxlckNvYXN0ZXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM1YwYVd4ekwzTmpjbTlzYkdWeVgyTnZZWE4wWlhJdmFXNWtaWGd1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNTVUZCU1N4RFFVRkRMRWRCUVVjc1QwRkJUeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZET3p0QlFVVXhRaXhUUVVGVExHVkJRV1VzUlVGQlJTeFJRVUZSTEVWQlFVVXNUMEZCVHl4RlFVRkZPMFZCUXpORExFbEJRVWtzUjBGQlJ5eEpRVUZKTEZsQlFWa3NaVUZCWlN4RFFVRkRMRVZCUVVVN1NVRkRka01zVDBGQlR5eEpRVUZKTEdWQlFXVXNRMEZCUXl4UlFVRlJMRVZCUVVVc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRGJFUXNSMEZCUnpzN1FVRkZTQ3hGUVVGRkxFOUJRVThzUjBGQlJ5eFBRVUZQTEVsQlFVa3NSVUZCUlN4RFFVRkRPenRGUVVWNFFpeEpRVUZKTEVOQlFVTXNVVUZCVVN4UFFVRlBMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NVVUZCVVN4SFFVRkhMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03UlVGRGNFVXNTVUZCU1N4RFFVRkRMRTlCUVU4c1VVRkJVU3hEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNVMEZCVXl4RlFVRkZMRU5CUVVNN1JVRkRNVU1zU1VGQlNTeERRVUZETEV0QlFVc3NWVUZCVlN4RFFVRkRMRU5CUVVNN1FVRkRlRUlzUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4VlFVRlZMRTlCUVU4c1EwRkJReXhMUVVGTExFbEJRVWtzUjBGQlJ5eERRVUZET3p0RlFVVjZReXhKUVVGSkxFTkJRVU1zZFVKQlFYVkNMRVZCUVVVc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEZWtNc1EwRkJRenM3UVVGRlJDeGxRVUZsTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwc1IwRkJSeXhUUVVGVExFMUJRVTBzU1VGQlNUdEZRVU53UkN4UFFVRlBMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTXZReXhEUVVGRExFTkJRVU03TzBGQlJVWXNaVUZCWlN4RFFVRkRMRk5CUVZNc1EwRkJReXhqUVVGakxFZEJRVWNzVTBGQlV5eGpRVUZqTEVsQlFVazdRVUZEZEVVc1JVRkJSU3hKUVVGSkxFMUJRVTBzUjBGQlJ5eERRVUZETEVOQlFVTTdPMFZCUldZc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eFBRVUZQTEVOQlFVTXNWVUZCVlN4RlFVRkZMRVZCUVVVN1NVRkRiRU1zVFVGQlRTeEpRVUZKTEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJReXhYUVVGWExFVkJRVVVzUTBGQlF6dEJRVU5zUXl4SFFVRkhMRU5CUVVNc1EwRkJRenM3UlVGRlNDeFBRVUZQTEUxQlFVMHNRMEZCUXp0QlFVTm9RaXhEUVVGRExFTkJRVU03TzBGQlJVWXNaVUZCWlN4RFFVRkRMRk5CUVZNc1EwRkJReXgxUWtGQmRVSXNSMEZCUnl4VFFVRlRMSFZDUVVGMVFpeEpRVUZKTzBWQlEzUkdMRWxCUVVrc1lVRkJZU3hIUVVGSExFTkJRVU1zUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJRenRGUVVOMlF5eEpRVUZKTEVkQlFVY3NZVUZCWVN4aFFVRmhMRWRCUVVjc1EwRkJReXhEUVVGRE8wVkJRM1JETEVsQlFVa3NSMEZCUnl4aFFVRmhMRWxCUVVrc1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF6dEZRVU5zUXl4SlFVRkpMRTFCUVUwc1ZVRkJWU3hKUVVGSkxFTkJRVU1zWTBGQll5eEZRVUZGTEVOQlFVTTdRVUZETlVNc1JVRkJSU3hKUVVGSkxGZEJRVmNzUzBGQlN5eE5RVUZOTEVkQlFVY3NZVUZCWVN4SFFVRkhMRWRCUVVjc1IwRkJSeXhIUVVGSExFZEJRVWNzUjBGQlJ5eEhRVUZITEUxQlFVMHNTVUZCU1N4TlFVRk5MRWRCUVVjc1EwRkJReXhEUVVGRE96dEJRVVYwUml4RlFVRkZMRWxCUVVrc1EwRkJReXhKUVVGSkxFZEJRVWNzVjBGQlZ5eEhRVUZITEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNN08wVkJSWFpETEU5QlFVOHNTVUZCU1N4RFFVRkRPMEZCUTJRc1EwRkJReXhEUVVGRE96dEJRVVZHTEdWQlFXVXNRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTU3hIUVVGSExGTkJRVk1zU1VGQlNTeEZRVUZGTEZOQlFWTXNSVUZCUlR0RlFVTjZSQ3hKUVVGSkxGRkJRVkVzUTBGQlF6dEJRVU5tTEVWQlFVVXNTVUZCU1N4UFFVRlBMRU5CUVVNN08wVkJSVm9zU1VGQlNTeERRVUZETEV0QlFVc3NTVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhKUVVGSkxGTkJRVk1zUTBGQlF6dEZRVU4wUXl4UlFVRlJMRTFCUVUwc1UwRkJVeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTTdRVUZEZGtNc1JVRkJSU3hQUVVGUExFOUJRVThzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4UlFVRlJMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZia1FzUlVGQlJTeFJRVUZSTEVOQlFVTXNRMEZCUXl4RlFVRkZMRWxCUVVrc1EwRkJReXhQUVVGUExFbEJRVWtzU1VGQlNTeERRVUZETEVsQlFVa3NSMEZCUnl4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVGRE96dEZRVVZzUkN4SlFVRkpMRTlCUVU4c1IwRkJSeXhEUVVGRExFVkJRVVU3U1VGRFppeHhRa0ZCY1VJc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRE8wZEJRemRETzBGQlEwZ3NRMEZCUXl4RFFVRkRPenRCUVVWR0xFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NaVUZCWlN4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpZG1GeUlDUWdQU0J5WlhGMWFYSmxLQ2RxY1hWbGNua25LVHRjYmx4dVpuVnVZM1JwYjI0Z1UyTnliMnhzWlhKRGIyRnpkR1Z5SUNobGJHVnRaVzUwY3l3Z2IzQjBhVzl1Y3lrZ2UxeHVJQ0JwWmlBb0lTQW9kR2hwY3lCcGJuTjBZVzVqWlc5bUlGTmpjbTlzYkdWeVEyOWhjM1JsY2lrcElIdGNiaUFnSUNCeVpYUjFjbTRnYm1WM0lGTmpjbTlzYkdWeVEyOWhjM1JsY2lobGJHVnRaVzUwY3l3Z2IzQjBhVzl1Y3lrN1hHNGdJSDFjYmx4dUlDQnZjSFJwYjI1eklEMGdiM0IwYVc5dWN5QjhmQ0I3ZlR0Y2JseHVJQ0IwYUdsekxtVnNaVzFsYm5SeklDQWdJQ0E5SUVGeWNtRjVMbWx6UVhKeVlYa29aV3hsYldWdWRITXBJRDhnWld4bGJXVnVkSE1nT2lCYlpXeGxiV1Z1ZEhOZE8xeHVJQ0IwYUdsekxtTjFjbkpsYm5RZ0lDQWdJQ0E5SUNRb2QybHVaRzkzS1M1elkzSnZiR3hVYjNBb0tUdGNiaUFnZEdocGN5NXpkR0Z5ZENBZ0lDQWdJQ0FnUFNBd08xeHVJQ0IwYUdsekxuTjBaWEJ6SUNBZ0lDQWdJQ0E5SUc5d2RHbHZibk11YzNSbGNITWdmSHdnTVRVd08xeHVYRzRnSUhSb2FYTXVZMkZzWTNWc1lYUmxVMk55YjJ4c1VHOXphWFJwYjI0b0tTNXpkR1Z3S0RBcE8xeHVmVnh1WEc1VFkzSnZiR3hsY2tOdllYTjBaWEl1Y0hKdmRHOTBlWEJsTG1kbGRGUnZjQ0E5SUdaMWJtTjBhVzl1SUdkbGRGUnZjQ0FvS1NCN1hHNGdJSEpsZEhWeWJpQWtLSFJvYVhNdVpXeGxiV1Z1ZEhOYk1GMHBMbTltWm5ObGRDZ3BMblJ2Y0NCOGZDQXdPMXh1ZlR0Y2JseHVVMk55YjJ4c1pYSkRiMkZ6ZEdWeUxuQnliM1J2ZEhsd1pTNW5aWFJVYjNSaGJFaGxhV2RvZENBOUlHWjFibU4wYVc5dUlHZGxkRlJ2ZEdGc1NHVnBaMmgwSUNncElIdGNiaUFnZG1GeUlHaGxhV2RvZENBOUlEQTdYRzVjYmlBZ2RHaHBjeTVsYkdWdFpXNTBjeTVtYjNKRllXTm9LR1oxYm1OMGFXOXVJQ2hsYkNrZ2UxeHVJQ0FnSUdobGFXZG9kQ0FyUFNBa0tHVnNLUzV2ZFhSbGNraGxhV2RvZENncE8xeHVJQ0I5S1R0Y2JseHVJQ0J5WlhSMWNtNGdhR1ZwWjJoME8xeHVmVHRjYmx4dVUyTnliMnhzWlhKRGIyRnpkR1Z5TG5CeWIzUnZkSGx3WlM1allXeGpkV3hoZEdWVFkzSnZiR3hRYjNOcGRHbHZiaUE5SUdaMWJtTjBhVzl1SUdOaGJHTjFiR0YwWlZOamNtOXNiRkJ2YzJsMGFXOXVJQ2dwSUh0Y2JpQWdkbUZ5SUhkcGJtUnZkMTlvWldsbmFIUWdQU0FrS0hkcGJtUnZkeWt1YUdWcFoyaDBLQ2s3WEc0Z0lIWmhjaUJ0YVdRZ0lDQWdJQ0FnSUNBZ0lEMGdkMmx1Wkc5M1gyaGxhV2RvZENBdklESTdYRzRnSUhaaGNpQjBiM0FnSUNBZ0lDQWdJQ0FnSUQwZ2RHaHBjeTVuWlhSVWIzQW9LVHRjYmlBZ2RtRnlJR2hsYVdkb2RDQWdJQ0FnSUNBZ1BTQjBhR2x6TG1kbGRGUnZkR0ZzU0dWcFoyaDBLQ2s3WEc0Z0lIWmhjaUJrWlhOMGFXNWhkR2x2YmlBZ0lEMGdhR1ZwWjJoMElENGdkMmx1Wkc5M1gyaGxhV2RvZENBL0lIUnZjQ0E2SUhSdmNDQXRJRzFwWkNBcklHaGxhV2RvZENBdElDaG9aV2xuYUhRZ0x5QXlLVnh1WEc0Z0lIUm9hWE11WkdsbVppQTlJR1JsYzNScGJtRjBhVzl1SUMwZ2RHaHBjeTVqZFhKeVpXNTBPMXh1WEc0Z0lISmxkSFZ5YmlCMGFHbHpPMXh1ZlR0Y2JseHVVMk55YjJ4c1pYSkRiMkZ6ZEdWeUxuQnliM1J2ZEhsd1pTNXpkR1Z3SUQwZ1puVnVZM1JwYjI0Z2MzUmxjQ0FvZEdsdFpYTjBZVzF3S1NCN1hHNGdJSFpoY2lCd2NtOW5jbVZ6Y3p0Y2JpQWdkbUZ5SUhCbGNtTmxiblE3WEc1Y2JpQWdkR2hwY3k1emRHRnlkQ0FnUFNCMGFHbHpMbk4wWVhKMElIeDhJSFJwYldWemRHRnRjRHRjYmlBZ2NISnZaM0psYzNNZ0lDQWdQU0IwYVcxbGMzUmhiWEFnTFNCMGFHbHpMbk4wWVhKME8xeHVJQ0J3WlhKalpXNTBJQ0FnSUNBOUlFMWhkR2d1YldsdUtIQnliMmR5WlhOeklDOGdkR2hwY3k1emRHVndjeXdnTVNrN1hHNWNiaUFnYzJOeWIyeHNWRzhvTUN3Z2RHaHBjeTVqZFhKeVpXNTBJQ3NnS0hSb2FYTXVaR2xtWmlBcUlIQmxjbU5sYm5RcEtUdGNibHh1SUNCcFppQW9jR1Z5WTJWdWRDQThJREVwSUh0Y2JpQWdJQ0J5WlhGMVpYTjBRVzVwYldGMGFXOXVSbkpoYldVb2RHaHBjeTV6ZEdWd0xtSnBibVFvZEdocGN5a3BPMXh1SUNCOVhHNTlPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUZOamNtOXNiR1Z5UTI5aGMzUmxjanRjYmlKZGZRPT0iXX0=
