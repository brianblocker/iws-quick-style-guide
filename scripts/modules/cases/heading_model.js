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
