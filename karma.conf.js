module.exports = function (config) {
  config.set({
    basePath: '',
    client: {
      captureConsole: true
    },
    files: [
      'utils/phantomjs_shim.js',
      'build/test/vendor_test.js',
      'build/**/test_bundle.js'
    ],
    frameworks: ['mocha', 'sinon-chai'],
    preprocessors: {

    },
    plugins: [
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-browserify',
      'karma-chai',
      'karma-teamcity-reporter',
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-sinon-chai'
    ],
    browsers: ['PhantomJS'],
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    autoWatch: true,
    autoWatchBatchDelay: 1000,
    singleRun: false,
    browserify: {
      bundleDelay: 1000
    },
    logLevel: config.LOG_WARN
  });
};
