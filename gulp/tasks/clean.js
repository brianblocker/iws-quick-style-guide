var gulp    = require('gulp');
var clean   = require('del');
var config  = require('../gulp_config');

gulp.task('clean', function () {
  return clean(['./' + config.build]);
});

gulp.task('clean:build', function () {
  return clean([config.build]);
});

gulp.task('clean:tests', function () {
  return clean(['./build/test']);
});
