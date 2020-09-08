"use strict";
const path = require("path");
const buildDocs = require("./lib/documentation");
const Funnel = require("broccoli-funnel");
const ShowcaseBroccoli = require("./lib/broccoli-showcase");
const writeFile = require("broccoli-file-creator");
const MergeTrees = require("broccoli-merge-trees");

module.exports = {
  name: require("./package").name,
  docs: null,

  // 1) project config, 2) build config, 3) default config
  getShowcaseConfig: function () {
    const projectConfig = this.project.config(process.env.EMBER_ENV)[
      "showcaseConfig"
    ];

    if (projectConfig) return projectConfig;

    if (this.options && this.options.showcaseConfig)
      return this.options.showcaseConfig;

    return false;
  },

  treeForAddon() {
    const addonTree = this._super.treeForAddon.apply(this, arguments);
    const nodeModules = [
      path.join("remarkable", "dist", "remarkable.js"),
      path.join("js-beautify", "js", "lib", "beautify.js"),
      path.join("js-beautify", "js", "lib", "beautify-html.js"),
    ];

    let moduleTree = [addonTree];
    nodeModules.forEach((modulePath) => {
      const fileName = path.basename(modulePath);
      const targetModulePath = path.dirname(
        require.resolve(modulePath, { paths: [this.root, this.project.root] })
      );

      const treeToFile = new Funnel(targetModulePath, {
        files: [fileName],
      });

      moduleTree.push(treeToFile);
    });

    return new MergeTrees(moduleTree, { overwrite: true });
  },

  treeForVendor() {
    let showcaseOptions = this.getShowcaseConfig();

    const opts =
      showcaseOptions && showcaseOptions.enabled && showcaseOptions.docs
        ? showcaseOptions.docs
        : {};
    this.docs = { default: false };

    let docShim = writeFile("/docs.js", async () => {
      const d = await buildDocs(opts);

      if (opts.githubRepo) {
        let githubTag = opts.githubTag || "master";
        let githubPath = `${opts.githubRepo}/tree/${githubTag}/`;

        d.forEach((item) => {
          item.github = githubPath;
        });
      }

      if (d.length) this.docs = d;
      return `define('docs', [], function() { return ${JSON.stringify(d)}});`;
    });

    return new MergeTrees([docShim], { overwrite: true });
  },

  setupPreprocessorRegistry: function (type, registry) {
    let showcaseOptions = this.getShowcaseConfig();
    if (showcaseOptions && showcaseOptions.enabled && type === "parent") {
      ShowcaseBroccoli.import(registry, showcaseOptions);
    }
  },

  prismOptions: {
    components: ["markup", "javascript", "handlebars", "markup-templating"], //needs to be an array, or undefined.
    plugins: ["toolbar", "show-language"],
  },

  included: function (app, parentAddon) {
    // Per the ember-cli documentation
    // http://ember-cli.com/extending/#broccoli-build-options-for-in-repo-addons
    let target = parentAddon || app;
    this.options = target.options || {};
    this.options["ember-prism"] =
      target.options["ember-prism"] || this.prismOptions;
    this.options.showcaseConfig =
      target.options.showcaseConfig || this.getShowcaseConfig();

    if (this.options.showcaseConfig && this.options.showcaseConfig.enabled) {
      this.ui.writeLine("Generating Component Showcase Documentation...");
      ShowcaseBroccoli.export(app, this.options.showcaseConfig);
    }

    app.import("vendor/docs.js");

    this._super.included.apply(this, arguments);
  },
};
