var gulp = require('gulp');

gulp.task('build', ['clean', 'vendor', 'app', 'less:build', 'less:watch']);
