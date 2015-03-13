var requireDir;

require('./gulp/gulp_config');

requireDir = require('require-dir');
requireDir('./gulp/tasks', {recurse: true});
