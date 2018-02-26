'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const path = require('path');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    'ember-cli-babel': {
      includePolyfill: true
    },
    'ember-prism': {
      'theme': 'coy',
      'components': ['markup', 'javascript', 'handlebars'], //needs to be an array, or undefined.
      'plugins': ['toolbar', 'show-language']
    },
    sassOptions: {
      includePaths: [
        path.join(__dirname, 'node_modules', 'font-awesome', 'scss')
      ]
    }
  });

  return app.toTree();
};
