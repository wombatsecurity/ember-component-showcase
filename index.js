/* jshint node: true */
'use strict';

let showcaseHBS = {};

const uuid = require('node-uuid');
const Filter = require('broccoli-filter');
// Regex digs through HBS templates to extract uncompiled source from component-showcase blocks
const showcaseRegex = /[^!-]{{#component-showcase\s(.*)}}([\s\S]*?){{\/component-showcase}}/g;
// get the title property of the component-showcase block
const titleRegex = /title="(.*)"/;
// Specifically extract the example hbs markup
const exampleRegex = /[^!-]{{#\w.example}}([\s\S]*?){{\/\w.example}}/;
const showcaseKey = "showcaseId";

function ShowcaseHBSTreeCopier(inputNodes, options) {
  options = options || {};
  Filter.call(this, inputNodes, {
    annotation: options.annotation
  });
  this.options = options;
}

ShowcaseHBSTreeCopier.prototype = Object.create(Filter.prototype);
ShowcaseHBSTreeCopier.prototype.extensions = ['hbs'];
ShowcaseHBSTreeCopier.prototype.targetExtension = 'hbs';
ShowcaseHBSTreeCopier.prototype.processString = function (string, relativePath) {

  // find hbs source to process
  let matches = [];
  let m;
  while ((m = showcaseRegex.exec(string.trim())) !== null) {
    matches.push(m);
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === showcaseRegex.lastIndex) {
      showcaseRegex.lastIndex++;
    }
  }

  // append a uuid to each match for lookup on the component later
  let indexDelta = 0; // replacing text offsets our target regex indexes, so have to manually track this offset
  matches.forEach((match) => {
    let matchShowcase = match[0];
    let matchConfig = match[1];
    let matchContent = match[2];
    let matchUuid = uuid.v4();
    let sample = {
      id: matchUuid
    };

    let hasTitle =  matchConfig.match(titleRegex);
    if (hasTitle) {
      let matchTitle = hasTitle[1];
      sample.title = matchTitle;
    }

    let hasExample = matchContent.match(exampleRegex);
    if (hasExample) {
      let matchExample = hasExample[1];
      sample.example = matchExample;
    }

    // append uuid to match configuration
    let updatedMatchConfig = `${showcaseKey}="${matchUuid}" ${matchConfig}`;
    let updatedShowcaseMatch = matchShowcase.replace(matchConfig, updatedMatchConfig);
    let matchStartIndex = match.index + indexDelta;
    let matchEndIndex = matchStartIndex + matchShowcase.length;
    string = string.substring(0, matchStartIndex) + updatedShowcaseMatch + string.substring(matchEndIndex);
    indexDelta += updatedShowcaseMatch.length - matchShowcase.length;
    sample.container = updatedShowcaseMatch;

    showcaseHBS[matchUuid] = sample;
  });

  return string;
};

function ShowcaseHBSInsertion(options) {
  this.options = options;
  this.syntax = null; // set by Glimmer
}

ShowcaseHBSInsertion.prototype.transform = function(ast) {
  var walker = new this.syntax.Walker();

  walker.visit(ast, (node) => {
    if (node.type === 'BlockStatement' && node.path.original === 'component-showcase') {

      if (node.hash && node.hash.pairs) {
        // THIS IS HOW READ A PROPERTY ON A COMPONENT
        for (var i = 0; i < node.hash.pairs.length; i++) {
          var pair = node.hash.pairs[i];
          if (pair.key === showcaseKey && pair.value.type === 'StringLiteral') {
            let key = pair.value.value;
            let hbs = showcaseHBS[key].example;

            if (hbs) {
              // THIS IS HOW YOU EDIT THAT PROPERTY
              // pair.value = this.syntax.builders.string('Foobar!');

              // THIS IS HOW YOU WRITE A PROPERTY TO A COMPONENT
              let newPair = this.syntax.builders.pair('hbs', this.syntax.builders.string(hbs));
              node.hash.pairs.push(newPair);
            }
          }
        }
      }
    }
  });

  return ast;
};

module.exports = {
  name: 'ember-component-showcase',

  setupPreprocessorRegistry: function(type, registry) {
    registry.add('template', {
      name: 'ember-component-showcase',
      ext: 'hbs',
      _addon: this,
      toTree: function(tree) {
        return new ShowcaseHBSTreeCopier(tree, this._addon.options);
      }
    });
  },

  included: function(app, parentAddon) {
    // Quick fix for add-on nesting
    // https://github.com/aexmachina/ember-cli-sass/blob/v5.3.0/index.js#L73-L75
    // see: https://github.com/ember-cli/ember-cli/issues/3718
    while (typeof app.import !== 'function' && (app.app || app.parent)) {
      app = app.app || app.parent;
    }

    this.app.registry.add('htmlbars-ast-plugin', {
      name: 'ember-component-showcase',
      plugin: ShowcaseHBSInsertion
    });

    this._super.included(app, parentAddon);
  }
};
