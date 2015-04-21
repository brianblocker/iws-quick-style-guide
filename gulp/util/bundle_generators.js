var browserify      = require('browserify');
var watchify        = require('watchify');
var reactify        = require('reactify');
var resolve         = require('resolve');
var gulp            = require('gulp');
var streamify       = require('gulp-streamify');
var uglify          = require('gulp-uglify');
var gutil           = require('gulp-util');
var source          = require('vinyl-source-stream');
var getNPMPackages  = require('../util/get_npm_packages');
var handleErrors    = require('../util/handle_errors');
var bundleLogger    = require('../util/bundle_logger');
var package_path    = '../../package.json';
var vendor_packages = getNPMPackages(package_path);
var vendor_excludes = ['react', 'jquery', 'backbone'];

function vendor () {
  var packages  = vendor_packages.slice(0);
  var extras    = Array.prototype.slice.call(arguments, 0);
  var bundler   = browserify({
    debug: false
  });

  bundler.require(resolve.sync('jquery'), {expose: '_jquery'});
  bundler.require(resolve.sync('../../utils/jquery_shim.js'), {expose: 'jquery'});
  bundler.require(resolve.sync('backbone'), {expose: '_backbone'});
  bundler.require(resolve.sync('../../utils/backbone_shim.js'), {expose: 'backbone'});
  bundler.require(resolve.sync('react/addons'), {expose: 'react'});

  Array.prototype.push.apply(packages, extras);

  packages.forEach(function (package_name) {
    if (vendor_excludes.indexOf(package_name) >= 0) {
      return;
    }

    bundler.require(resolve.sync(package_name), {expose: package_name});
  });

  return bundler;
}

function app (name, files, watch) {
  var bundler = browserify(files, {
    debug:      true,
    standalone: name + '_bundle'
  });

  bundler.transform(reactify);

  if (watch) {
    bundler = watchify(bundler);
  }

  vendor_packages.forEach(function (package_name) {
    bundler.external(package_name);
  });

  return bundler;
}

function bundle (bundler, out_name, options) {
  options = options || {};

  var stream = bundler.bundle()
    .on('error', handleErrors)
    .on('end', function () {
      bundleLogger.end(out_name);
    })
    .on('file', function (file) {
      if (! options.log_files) {
        return false;
      }

      bundleLogger.adding(file, gutil.colors.yellow(out_name));
    })
    .pipe(source(out_name));

  if (options.uglify) {
    stream.pipe(streamify(uglify({})));
  }

  return stream.pipe(gulp.dest(options.dest));
}

module.exports = {
  vendor: vendor,
  app:    app,
  bundle: bundle
};
