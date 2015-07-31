'use strict';

module.exports = function(karma) {
  karma.set({

    reporters: [ 'mocha', 'coverage' ],

    frameworks: [ 'jasmine' ],

    files: [
      'src/**/*.js',
      'tests/**/*.js'
    ],

    preprocessors: {
      'src/**/*.js': [ 'coverage']
    },

    browsers: [ 'Chrome' ],

    logLevel: 'LOG_INFO',

    singleRun: false,
    autoWatch: true,

    coverageReporter: {
      type : 'html',
      dir : 'coverage/',
      includeAllSources: true
    }

  });
};
