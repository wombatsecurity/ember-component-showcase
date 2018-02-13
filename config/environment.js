'use strict';

module.exports = function(environment, appConfig) {
  return {
    'ember-prism': {
      'theme': 'coy',
      'components': ['markup', 'javascript', 'handlebars'], //needs to be an array, or undefined.
      'plugins': ['toolbar', 'show-language']
    }
  };
};
