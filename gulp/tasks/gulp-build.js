var gulp            = require('gulp');
var config          = require('../gulp_config');
var bundleLogger    = require('../util/bundle_logger');
var generators      = require('../util/bundle_generators');

function vendor () {
  var bundler = generators.vendor();

  bundleLogger.start('vendor');

  generators.bundle(bundler, config.browserify.vendor.outputName, {
    uglify: false,
    dest:   config.browserify.bundleConfig.dest,
    log_files: true
  });
};

gulp.task('vendor', vendor);

function app () {
  config.browserify.bundleConfig.entries.forEach(function (entry) {
    var src     = config.src + '/' + entry + '.js';
    var output  = entry + config.browserify.bundleConfig.outputName;
    var bundler = generators.app(entry, src, true);

    bundler.on('update', function () {
      bundleLogger.restart(entry);

      generators.bundle(bundler, output, {
        dest: config.browserify.bundleConfig.dest,
        log_files: true
      });
    });

    bundleLogger.start(entry);
    generators.bundle(bundler, output, {
      dest: config.browserify.bundleConfig.dest,
      log_files: true
    });
  });
}

gulp.task('app', app);
