var Backbone = require('_backbone');
var jQuery    = require('jquery');

Backbone.$ = jQuery;
require('./backbone_mixin');

module.exports = Backbone;
