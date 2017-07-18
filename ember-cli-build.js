var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
var getVersion = require('git-repo-version');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    'ember-cli-babel': {
      includePolyfill: true
    },
    'ember-cli-qunit': {
      useLintTree: false // disables JSHint
    },
    'ember-prism': {
      'theme': 'coy',
      'components': ['markup', 'javascript', 'handlebars'], //needs to be an array, or undefined.
      'plugins': ['toolbar', 'show-language']
    },
    'yuidocjs': {
      "enabled": true,
      "writeJSON": false,
      "paths": ["addon"],
      "githubRepo": "https://github.com/wombatsecurity/ember-component-showcase",
      "githubTag": "v" + getVersion(),
      "linkNatives": true,
      "quiet": true,
      "parseOnly": false,
      "lint": false
    }
  });

  return app.toTree();
};
