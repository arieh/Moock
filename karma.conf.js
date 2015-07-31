'use strict';

module.exports = function(karma) {
  karma.set({

    reporters: [ 'mocha' ],

    frameworks: [ 'jasmine'],

    files: [
      'src/**/*.js',
      'tests/**/*.js'
    ],

    browsers: [ ],

    logLevel: 'LOG_INFO',

    singleRun: false,
    autoWatch: true
  });
};
