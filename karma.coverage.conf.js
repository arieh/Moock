'use strict';

module.exports = function(karma) {
  karma.set({

    reporters: [ 'mocha', 'coverage' ],

    frameworks: [ 'jasmine' ],

    files: [
      'src/Moock.js',
      'src/**/*.js',
      'tests/**/*.js'
    ],

    preprocessors: {
      'src/Moock.js': [ 'coverage']
    },

    browsers: [ 'Chrome' ],

    logLevel: 'LOG_INFO',

    singleRun: true,
    autoWatch: false,

    coverageReporter: {
      type : 'html',
      dir : 'coverage/',
      includeAllSources: true
    }

  });
};
