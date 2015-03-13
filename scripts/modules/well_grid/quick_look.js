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
