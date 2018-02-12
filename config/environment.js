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
    'ember-font-awesome': {
      includeFontFiles: false
    }
  };
};
