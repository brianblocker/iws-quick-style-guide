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
