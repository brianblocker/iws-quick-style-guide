var path = require('path');
var setup = require('./setup_config');
var build = setup.build;
var src = setup.src;
var dest = setup.dest;

var config = {
  src:    src,
  build:  build,
  dest:   dest,
  clean: {
    src: dest
  },
  icons: {
    src: './node_modules/font-awesome/fonts/*',
    dest: dest + '/fonts'
  },
  less: {
    src:                './less/main.less',
    dest:               dest + '/css',
    build_dependencies: ['clean'],
    task_dependencies:  []
  },
  browserify: {
    debug:      true,
    extensions: ['.jsx'],
    bundleConfig: {
      entries:    ['app', 'cases'],
      dest:       dest + '/js',
      outputName: '_bundle.js',
      exts:       ['.js', '.jsx'],
      transform:  ['browserify-shim'],
      utils:      '../../utils/*.js'
    },
    testConfig: {
      dest:       dest + '/test',
      outputName: 'test_bundle.js',
      exts:       ['.js.test', '.jsx.test'],
      transform:  ['browserify-shim']
    },
    vendor: {
      outputName: 'vendor.js'
    }
  },
  tests: {
    src:  src + '/**/*.test',
    dest: dest + '/js/test',
    karma: path.normalize(__dirname + '/../karma.conf.js')
  }
};

module.exports = config;
