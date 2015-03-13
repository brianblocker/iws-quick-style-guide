var gutil = require('gulp-util');

module.exports = {
  start: function () {
    gutil.log('Running', gutil.colors.green('bundle'), '...');
  },
  adding: function (file, message) {
    gutil.log('Adding', gutil.colors.green('./' + path ), message);
  },
  end: function () {
    gutil.log('Finished', gutil.colors.green('bundle'));
  }
};