'use strict';
const path = require('path');
const DocGenerator = require('./lib/documentation');
const Funnel = require('broccoli-funnel');
const ShowcaseBroccoli = require('./lib/broccoli-showcase');
const writeFile = require('broccoli-file-creator');
const MergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: require('./package').name,
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

  // 1) project config, 2) build config, 3) default config
  getConfig: function() {
    const projectConfig = this.project.config(process.env.EMBER_ENV)['showcaseConfig'];
    if (projectConfig) return projectConfig;
    if (this.options && this.options.showcaseConfig) return this.options.showcaseConfig;
    return {
      enabled: true,
      yuidocjs: {
        "enabled": true,
        "writeJSON": false,
        "paths": ["addon", "app"],
        "exclude": "vendor",
        "linkNatives": true,
        "quiet": true,
        "parseOnly": true,
        "lint": false
      }
    };
  },

  treeForAddon() {
    const addonTree = this._super.treeForAddon.apply(this, arguments);
    const nodeModules = [
      path.join('remarkable', 'dist', 'remarkable.js'),
      path.join('js-beautify', 'js', 'lib', 'beautify.js'),
      path.join('js-beautify', 'js', 'lib', 'beautify-html.js')
    ];

    let moduleTree = [addonTree];
    nodeModules.forEach((modulePath) => {
      const fileName = path.basename(modulePath);
      const targetModulePath = path.dirname(require.resolve(modulePath, {paths: [this.root, this.project.root]}));
      const treeToFile = new Funnel(targetModulePath, {
        files: [fileName]
      });
      moduleTree.push(treeToFile);
    });

    return new MergeTrees(moduleTree, {overwrite: true});
  },

  treeForVendor: function() {
    let showcaseOptions = this.getConfig();
    if (showcaseOptions.enabled && showcaseOptions.yuidocjs) {
      this.yuidocs = DocGenerator(showcaseOptions.yuidocjs);
    } else {
      this.yuidocs = { 'default': false };
    }

    let remarkableShim = writeFile('/shims/remarkable.js', `define('remarkable', [], function() { return { 'default': Remarkable }; });`);
    let documentationShim = writeFile('/documentation.js', `define('documentation', [], function() { return ${JSON.stringify(this.yuidocs)}});`);
    let lunrTree = new Funnel(path.dirname(require.resolve('lunr/package.json')), { destDir: 'lunr' });

    return new MergeTrees([lunrTree, remarkableShim, documentationShim], { overwrite: true });
  },

  setupPreprocessorRegistry: function(type, registry) {
    let showcaseOptions = this.getConfig();
    if (showcaseOptions.enabled) {
      ShowcaseBroccoli.import.apply(this, [type, registry, showcaseOptions]);
    }
  },

  prismOptions: {
    'theme': 'coy',
    'components': ['markup', 'javascript', 'handlebars', 'markup-templating'], //needs to be an array, or undefined.
    'plugins': ['toolbar', 'show-language']
  },

  included: function(app, parentAddon) {
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
    this.options['ember-prism'] = target.options['ember-prism'] || this.prismOptions;
    this.options.showcaseConfig = target.options.showcaseConfig || this.getConfig();

    if (this.options.showcaseConfig.enabled) {
      this.ui.writeLine('Generating Component Showcase Documentation...');
      ShowcaseBroccoli.export(app, this.options.showcaseConfig);
    }
    app.import('vendor/shims/remarkable.js');
    app.import('vendor/documentation.js');
    app.import('vendor/lunr/lunr.js', {
      using: [{ transformation: 'amd', as: 'lunr' }]
    });

    this._super.included.apply(this, arguments);
  }
};
