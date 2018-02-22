'use strict';
const path = require('path');
const fs = require('fs');
const DocGenerator = require('./lib/documentation');
const Funnel = require('broccoli-funnel');
const ShowcaseBroccoli = require('./lib/broccoli-showcase');
const writeFile = require('broccoli-file-creator');
const MergeTrees = require('broccoli-merge-trees');

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

  getConfig: function() {
    return this.project.config(process.env.EMBER_ENV)['ember-component-showcase'] || {};
  },

  treeForAddon(tree) {
    let addonTree = this._super.treeForAddon.apply(this, arguments);
    let moduleTree = [addonTree];

    const nodeModules = [
      path.join('remarkable', 'dist', 'remarkable.js'),
      path.join('js-beautify', 'js', 'lib', 'beautify.js'),
      path.join('js-beautify', 'js', 'lib', 'beautify-html.js')
    ];

    // use our local node_modules if available, otherwise use project version.
    nodeModules.forEach((modulePath) => {
      let localModulePath = path.resolve(this.root, 'node_modules');
      let projectModulePath = path.resolve(this.project.root, 'node_modules');
      let targetModulePath = projectModulePath;
      if (fs.existsSync(path.resolve(localModulePath, modulePath))) targetModulePath = localModulePath;

      let treeToFile = new Funnel(targetModulePath, {
        files: [modulePath]
      });

      moduleTree.push(treeToFile);
    });

    return new MergeTrees(moduleTree, {overwrite: true});
  },

  treeForVendor: function(tree) {
    let showcaseOptions = this.getConfig() || {};
    if (showcaseOptions.enabled) {
      let yuiOptions = showcaseOptions['yuidocjs'] || {
        "enabled": true,
        "writeJSON": false,
        "paths": ["addon", "app"],
        "exclude": "vendor",
        "linkNatives": true,
        "quiet": true,
        "parseOnly": true,
        "lint": false
      };

      this.yuidocs = DocGenerator(yuiOptions);
    }

    let remarkableShim = writeFile('/shims/remarkable.js', `define('remarkable', [], function() { return { 'default': Remarkable }; });`);
    let documentationShim = writeFile('/documentation.js', `define('documentation', [], function() { return ${JSON.stringify(this.yuidocs)}});`);
    return new MergeTrees([remarkableShim, documentationShim], {overwrite: true});
  },

  setupPreprocessorRegistry: function(type, registry) {
    let showcaseOptions = this.getConfig() || {};
    if (showcaseOptions.enabled) {
      ShowcaseBroccoli.import.apply(this, [type, registry, showcaseOptions]);
    }
  },

  included: function(app, parentAddon) {
    this._super.included.apply(this, arguments);

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
    let target = (parentAddon || app);
    this.options = target.options || {};
    let showcaseConfig = this.getConfig();
    if (showcaseConfig.enabled) {
      this.ui.writeLine('Generating Component Showcase Documentation...');
      ShowcaseBroccoli.export(app, showcaseConfig);
    }
    app.import('vendor/shims/remarkable.js');
    app.import('vendor/documentation.js');
  }
};
