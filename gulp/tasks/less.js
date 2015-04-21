var gulp      = require('gulp');
var clean     = require('del');
var less      = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var watchLess = require('gulp-watch-less');
var gulpDebug = require('gulp-debug');
var path      = require('path');
var config    = require('../gulp_config');
var depends   = config.depends;
var less_conf = config.less;

function lessMain () {
  var stream = gulp.src(less_conf.src);

  console.log(less_conf.src);

  return stream.pipe(less({
    paths: [
      './node_modules/bootstrap/less'
    ]
  }));
}

gulp.task('less', less_conf.task_dependencies, function () {
  return clean([less_conf.dest], function () {
    lessMain().pipe(gulp.dest(less_conf.dest));
  });
});

gulp.task('less:build', less_conf.build_dependencies, function () {
  return gulp.src(less_conf.src)
    .pipe(less())
    .pipe(gulp.dest(less_conf.dest));
});

gulp.task('less:watch', less_conf.build_dependencies, function () {
  watchLess(less_conf.src, function () {
    gulp.src(less_conf.src)
      .pipe(less())
      .pipe(gulp.dest(less_conf.dest))
  });
});

