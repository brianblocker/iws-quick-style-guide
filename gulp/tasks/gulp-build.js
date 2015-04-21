var gulp            = require('gulp');
var config          = require('../gulp_config');
var bundleLogger    = require('../util/bundle_logger');
var generators      = require('../util/bundle_generators');
var merge           = require('merge-stream');

function vendor () {
  var bundler = generators.vendor();

  bundleLogger.start('vendor');

  return generators.bundle(bundler, config.browserify.vendor.outputName, {
    uglify: false,
    dest:   config.browserify.bundleConfig.dest,
    log_files: true
  });
};

gulp.task('vendor', vendor);

function app () {
  var streams = [];

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

    streams.push(generators.bundle(bundler, output, {
      dest: config.browserify.bundleConfig.dest,
      log_files: true
    }));
  });

  return merge.apply(null, streams);
}

gulp.task('app', app);
