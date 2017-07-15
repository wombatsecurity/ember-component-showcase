/* jshint node: true */
'use strict';
const DocGenerator = require('./lib/documentation');
const ShowcaseBroccoli = require('./lib/broccoli-showcase');
const writeFile = require('broccoli-file-creator');
const mergeTrees = require('broccoli-merge-trees');
const importPrismSources = require('ember-prism').importPrismSources;

module.exports = {
  name: 'ember-component-showcase',
  yuidocs: null,

  // TODO: add support for genuine yuidocs
  // postprocessTree: function(type, workingTree) {
  //   if(type === 'all') {
  //     var env = this.app.env;
  //     let options = this.app.options['yuidocjs'] || {};
  //     let docs = this.yuidocs;
	//
  //     if (options.enabled) {
  //       var yuidocTree = new BroccoliYuiDocs(docs, options);
  //       return mergeTrees([workingTree, yuidocTree], { overwrite: true });
  //     }
  //   }
  //   return workingTree;
  // },

  treeForVendor: function(tree) {
    let app = this.app;
    let options = this.app.options['yuidocjs'] || {};

    this.yuidocs = DocGenerator(options);

    let file = writeFile('/documentation.js', `define('documentation', [], function() { return ${JSON.stringify(this.yuidocs)}});`);
    var mergedTree = mergeTrees([tree, file], { overwrite: true });
    return mergedTree;
  },

  setupPreprocessorRegistry: ShowcaseBroccoli.import,

  included: function(app, parentAddon) {
    this.ui.writeLine('Generating Component Showcase Documentation...');

    // Quick fix for add-on nesting
    // https://github.com/aexmachina/ember-cli-sass/blob/v5.3.0/index.js#L73-L75
    // see: https://github.com/ember-cli/ember-cli/issues/3718
    while (typeof app.import !== 'function' && (app.app || app.parent)) {
      app = app.app || app.parent;
    }

    // Per the ember-cli documentation
    // http://ember-cli.com/extending/#broccoli-build-options-for-in-repo-addons
    var target = (parentAddon || app);

    target.options = target.options || {};
    target.options['yuidocjs'] = target.options['yuidocjs'] || {
      "enabled": true,
      "writeJSON": false,
      "paths": ["addon", "app"],
      "exclude": "vendor",
      "linkNatives": true,
      "quiet": true,
      "parseOnly": true,
      "lint": false
    };

    ShowcaseBroccoli.export(app);

    let bowerDirectory = this.project.bowerDirectory;
    app.import(bowerDirectory + '/remarkable/dist/remarkable.js');
    app.import(bowerDirectory + '/js-beautify/js/lib/beautify.js');
    app.import(bowerDirectory + '/js-beautify/js/lib/beautify-html.js');

    app.import('vendor/ember-remarkable/shim.js', {
      type: 'vendor',
      exports: { 'remarkable': ['default'] }
    });
    app.import('vendor/documentation.js');

    importPrismSources(app, app.options['ember-prism']);
    this._super.included(app, parentAddon);
  }
};
