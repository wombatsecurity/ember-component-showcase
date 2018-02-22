'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    'ember-cli-babel': {
      includePolyfill: true
    },
    'ember-prism': {
      'theme': 'coy',
      'components': ['markup', 'javascript', 'handlebars'], //needs to be an array, or undefined.
      'plugins': ['toolbar', 'show-language']
    }
  });

  return app.toTree();
};
