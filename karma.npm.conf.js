'use strict';

module.exports = function(karma) {
  karma.set({

    reporters: [ 'mocha' ],

    frameworks: [ 'jasmine', 'browserify' ],

    files: [
      'src/**/*.js',
      'tests/**/*.js'
    ],
    preprocessors: {
      'tests/**/*.js': [ 'browserify' ]
    },

    browsers: [ "PhantomJS" ],

    logLevel: 'LOG_INFO',

    singleRun: true,
    autoWatch: false,

    // browserify configuration
    browserify: {
      debug: true,
      transform: [ 'brfs', 'browserify-shim' ],
      plugin : ['browsyquire/plugin']
    }
  });
};
