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
