var gutil = require('gulp-util');

module.exports = {
  start: function (type) {
    var message = [type || '', 'bundle'].join(' ');

    gutil.log('Running', gutil.colors.green(message), '...');
  },
  restart: function (type) {
    var message = [type || '', 'bundle'].join(' ');

    gutil.log('Re-running', gutil.colors.green(message), '...');
  },
  adding: function (file, message) {
    var regex = /iws-quick-style-guide\/(.*)/i;
    var path  = file.match(regex)[1];

    gutil.log('Adding to', message, gutil.colors.green('./' + path ));
  },
  end: function (type) {
    var message = [type || '', 'bundle'].join(' ');

    gutil.log('Finished', gutil.colors.green(message));
  }
};
