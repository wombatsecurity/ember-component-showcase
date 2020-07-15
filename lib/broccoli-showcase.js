'use strict';
/* eslint-env node */

const uuid = require('node-uuid');
const Filter = require('broccoli-filter');

// Regex digs through HBS templates to extract uncompiled source from component-showcase blocks
const showcaseRegex = /<ComponentShowcase([\s\S]*?)(.*[^-])>([\s\S]*?)<\/ComponentShowcase>/g;

// get the title property of the component-showcase block
const titleRegex = /@title="(.[^"]+)"/;

// Specifically extract the example hbs markup
const exampleRegex = /[^!-]<\w+.Example>([\s\S]*?)<\/\w+.Example>/;

// WIP Regexes for experimenting with text extraction from showcase documentation.
// const htmlText = /<\w[^>]*>([^<]+)<\/\w>/;
// const textRegex = /["'](?:\\.|[^\\])*?["']/;

function ShowcaseHBSTreeCopier(inputNodes, options) {
  options = options || {};
  Filter.call(this, inputNodes, {
    annotation: options.annotation
  });
  this.options = options;
}

let showcaseHBS = {};

ShowcaseHBSTreeCopier.prototype = Object.create(Filter.prototype);
ShowcaseHBSTreeCopier.prototype.extensions = ['hbs'];
ShowcaseHBSTreeCopier.prototype.targetExtension = 'hbs';
ShowcaseHBSTreeCopier.prototype.processString = function (string) {
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
    let matchContent = match.pop();
    let matchUuid = uuid.v4();
    let sample = {
      id: matchUuid,
      self: matchShowcase
    };

    let hasTitle =  matchConfig.match(titleRegex);
    if (hasTitle) {
      let matchTitle = hasTitle[1];
      sample.title = matchTitle;
    }

    let hasExample = matchContent.match(exampleRegex);
    if (hasExample) {
      let matchExample = hasExample[1];
      sample.example = matchExample.trim();
      sample.simple = false;
    } else {
      sample.example = matchContent.trim();
      sample.simple = true;
    }

    // append uuid to match configuration
    let updatedShowcaseMatch = matchShowcase.replace("<ComponentShowcase", `<ComponentShowcase @showcaseId="${matchUuid}" `);
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
  let walker = new this.syntax.Walker();

  walker.visit(ast, (node) => {
    if (
      node.type === 'ElementNode'
      && node.tag === 'ComponentShowcase'
    ) {
      if (node.attributes.length && node.attributes[0].name === '@showcaseId') {
        // THIS IS HOW READ A PARAMETER ON A COMPONENT
        const showcaseUuid = node.attributes[0].value.chars;
        const match = showcaseHBS[showcaseUuid];

        if (match && match.example) {
          // THIS IS HOW YOU WRITE A PROPERTY TO A COMPONENT
          const selfHBS = showcaseHBS[showcaseUuid].self;
          const selfHBSAttr = this.syntax.builders.attr('@selfHBS', this.syntax.builders.text(selfHBS));
          node.attributes.push(selfHBSAttr);

          const hbs = showcaseHBS[showcaseUuid].example;
          let hbsAttr = this.syntax.builders.attr('@hbs', this.syntax.builders.text(hbs));
          node.attributes.push(hbsAttr);

          // if there isn't any example content set simple mode flag
          let simpleMode = showcaseHBS[showcaseUuid].simple;
          if (simpleMode) {
            let simpleModeBool = this.syntax.builders.attr(
              '@simple',
              this.syntax.builders.mustache(
                this.syntax.builders.boolean(simpleMode)
              )
            );

            node.attributes.push(simpleModeBool);
          }
        }
      }
    }
  });

  return ast;
};

module.exports = {
  import: function(registry, options) {
    registry.add('template', {
      name: 'ember-component-showcase',
      ext: 'hbs',
      toTree: (tree) => {
        return new ShowcaseHBSTreeCopier(tree, options);
      }
    });
  },
  export: function(app) {
    app.registry.add('htmlbars-ast-plugin', {
      name: 'showcase-ast-plugin',
      plugin: ShowcaseHBSInsertion,
      baseDir: function() {
        return app.project.root;
      }
    });
  }
};
