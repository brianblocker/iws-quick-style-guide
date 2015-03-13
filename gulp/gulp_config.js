var path = require('path');
var setup = require('./setup_config');
var build = setup.build;
var src = setup.src;
var dest = setup.dest;

var config = {
  build: build,
  dest: dest,
  clean: {
    src: dest
  },
  icons: {
    src: './node_modules/font-awesome/fonts/*',
    dest: dest + '/fonts'
  },
  browserify: {
    debug: true,
    extensions: ['.jsx'],
    bundleConfig: {
      entries: src + '/app.js',
      dest: dest + '/js',
      outputName: 'app.js',
      exts: ['.js', '.jsx'],
      transform: ['browserify-shim']
    },
    vendor: {
      outputName: 'vendor.js'
    }
  }
};

module.exports = config;
