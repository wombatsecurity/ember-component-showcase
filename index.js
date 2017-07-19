/* jshint node: true */
'use strict';
const path = require('path');
const fs = require('fs');

const DocGenerator = require('./lib/documentation');
const ShowcaseBroccoli = require('./lib/broccoli-showcase');
const writeFile = require('broccoli-file-creator');
const mergeTrees = require('broccoli-merge-trees');

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
    let options = this.app.options['ember-component-showcase'] || {};

    if (options.enabled) {
      let yuiOptions = options['yuidocjs'] || {};

      this.yuidocs = DocGenerator(yuiOptions);

      let file = writeFile('/documentation.js', `define('documentation', [], function() { return ${JSON.stringify(this.yuidocs)}});`);
      var mergedTree = mergeTrees([tree, file], { overwrite: true });
      return mergedTree;
    } else {
      return tree;
    }
  },

  setupPreprocessorRegistry: function(type, registry) {
    ShowcaseBroccoli.import.apply(this, [type, registry]);
    this._super.setupPreprocessorRegistry.apply(this, arguments);
  },

  included: function(app, parentAddon) {
    this.ui.writeLine('Generating Component Showcase Documentation...');

    // Quick fix for add-on nesting
    // https://github.com/aexmachina/ember-cli-sass/blob/v5.3.0/index.js#L73-L75
    // see: https://github.com/ember-cli/ember-cli/issues/3718
    while (typeof app.import !== 'function' && (app.app || app.parent)) {
      app = app.app || app.parent;
    }

    // if app.import and parentAddon are blank, we're probably being consumed by an in-repo-addon
    // or engine, for which the "bust through" technique above does not work.
    if (typeof app.import !== 'function' && !parentAddon) {
      if (app.registry && app.registry.app) {
        app = app.registry.app;
      }
    }

    // Per the ember-cli documentation
    // http://ember-cli.com/extending/#broccoli-build-options-for-in-repo-addons
    var target = (parentAddon || app);

    this.options = target.options || {};

    // font-awesome shim
    this.otherAssetPaths = [];
    this.options['ember-font-awesome'] = this.options['ember-font-awesome'] || {};
    this.options['ember-font-awesome'].includeFontFiles = false;

    this.options['ember-component-showcase'] = this.options['ember-component-showcase'] || {};
    if (this.options['ember-component-showcase'].enabled) {
      this.options['ember-component-showcase']['yuidocjs'] = this.options['ember-component-showcase']['yuidocjs'] || {
          "enabled": true,
          "writeJSON": false,
          "paths": ["addon", "app"],
          "exclude": "vendor",
          "linkNatives": true,
          "quiet": true,
          "parseOnly": true,
          "lint": false
        };

      ShowcaseBroccoli.export(app, this.options['ember-component-showcase']);

      let bowerDirectory = this.project.bowerDirectory;
      app.import(bowerDirectory + '/remarkable/dist/remarkable.js');
      app.import(bowerDirectory + '/js-beautify/js/lib/beautify.js');
      app.import(bowerDirectory + '/js-beautify/js/lib/beautify-html.js');
      app.import('vendor/ember-remarkable/shim.js', {
        type: 'vendor',
        exports: { 'remarkable': ['default'] }
      });
      app.import('vendor/documentation.js');
    }

    this._super.included.apply(this, arguments);
  }
};
