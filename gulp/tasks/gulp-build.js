var gulp            = require('gulp');
var gutil           = require('gulp-util');
var browserify      = require('browserify');
var config          = require('../gulp_config');
var resolve         = require('resolve');
var getNPMPackages  = require('../util/get_npm_packages');
var bundleLogger    = require('../util/bundle_logger');
var handleErrors    = require('../util/handle_errors');
var package_path    = '../../package.json';
var source          = require('vinyl-source-stream');
var watchify        = require('watchify');
var reactify        = require('reactify');
var streamify       = require('gulp-streamify');
var uglify          = require('gulp-uglify');

function vendor () {
  var brwsrfy;
  var stream;

  brwsrfy = browserify({
    debug: false//config.browserify.debug
  });

  getNPMPackages(package_path).forEach(function (id) {
    gutil.log('Adding', gutil.colors.green(id), 'to bundle');
    brwsrfy.require(resolve.sync(id), {expose: id});
  });

  brwsrfy.require(resolve.sync('react/addons'), {expose: 'react/addons'});

  stream = brwsrfy.bundle().pipe(source(config.browserify.vendor.outputName));

  stream.pipe(streamify(uglify({})));
  stream.pipe(gulp.dest(config.browserify.bundleConfig.dest));
};

gulp.task('vendor', vendor);

function app () {
  var bundler;

  bundler = watchify(browserify(config.browserify.bundleConfig.entries, {
    debug: config.browserify.debug
  }));

  bundler.transform(reactify);

  getNPMPackages(package_path).forEach(function (id) {
    bundler.external(id);
  });

  bundler.on('update', rebundle.bind(null, bundler));

  return rebundle(bundler);
}

gulp.task('app', app);

function rebundle (bundler) {
  bundleLogger.start();

  return bundler.bundle()
    .on('error', handleErrors)
    .on('end', bundleLogger.end)
    .pipe(source(config.browserify.bundleConfig.outputName))
    .pipe(gulp.dest(config.browserify.bundleConfig.dest));
}
