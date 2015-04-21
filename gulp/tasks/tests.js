var gulp            = require('gulp');
var glob            = require('glob');
var config          = require('../gulp_config');
var bundleLogger    = require('../util/bundle_logger');
var karma           = require('karma-as-promised');
var generators      = require('../util/bundle_generators');

gulp.task('tests', ['clean:tests', 'tests:vendor', 'tests:app'], function (done) {
  return karma.server.start({
    configFile: __dirname + '/../../karma.conf.js',
  }, done);
});

function vendor (done) {
  var bundler = generators.vendor('chai', 'sinon');

  bundleLogger.start('vendor_test');

  generators.bundle(bundler, 'vendor_test.js', {
    dest: config.browserify.testConfig.dest
  });

  done();
};

gulp.task('tests:vendor', vendor);

function app (done) {
  var bundler;
  var output      = config.browserify.testConfig.outputName;
  var test_files  = glob.sync(config.tests.src);

  bundler = generators.app('test', test_files, true);

  bundler.on('update', function () {
    bundleLogger.restart('test');

    generators.bundle(bundler, output, {
      dest: config.browserify.testConfig.dest
    });
  });

  bundleLogger.start('test');

  generators.bundle(bundler, output, {
    dest: config.browserify.testConfig.dest
  });

  done();
}

gulp.task('tests:app', app);
