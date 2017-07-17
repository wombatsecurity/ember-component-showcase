/*jshint node:true*/
'use strict';

module.exports = function(environment, appConfig) {
  return {
    'remarkable': {
      excludeHighlightJs: false
    },
    'ember-prism': {
      'theme': 'coy',
      'components': ['markup', 'javascript', 'handlebars'], //needs to be an array, or undefined.
      'plugins': ['toolbar', 'show-language']
    },
    'yuidocjs': {
      "enabled": true,
      "writeJSON": false,
      "paths": ["addon", "app"],
      "exclude": "vendor",
      "linkNatives": true,
      "quiet": true,
      "parseOnly": true,
      "lint": false
    },
    'ember-font-awesome': {
      includeFontFiles: false
    }
  };
};
