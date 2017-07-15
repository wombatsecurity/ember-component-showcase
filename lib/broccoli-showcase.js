const uuid = require('node-uuid');
const Filter = require('broccoli-filter');
// Regex digs through HBS templates to extract uncompiled source from component-showcase blocks
const showcaseRegex = /{{#component-showcase\s(.*[^-])}}([\s\S]*?){{\/component-showcase}}/g;
// get the title property of the component-showcase block
const titleRegex = /title="(.*)"/;
// Specifically extract the example hbs markup
const exampleRegex = /[^!-]{{#\w+.example}}([\s\S]*?){{\/\w+.example}}/;

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
      sample.example = matchExample;
      sample.simple = false;
    } else {
      sample.example = matchContent;
      sample.simple = true;
    }

    // append uuid to match configuration
    let updatedMatchConfig = `"${matchUuid}" ${matchConfig}`;
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

function ShowcaseHBSInsertion(options, showcase) {
  this.options = options;
  this.syntax = null; // set by Glimmer
}

ShowcaseHBSInsertion.prototype.transform = function(ast) {
  let walker = new this.syntax.Walker();

  walker.visit(ast, (node) => {
    if (node.type === 'BlockStatement' && node.path.original === 'component-showcase') {
      if (node.hash && node.hash.pairs) {
        // THIS IS HOW READ A PARAMETER ON A COMPONENT
        if (node.params && node.params[0] && node.params[0].value) {
          let showcaseUuid = node.params[0].value;
          let match = showcaseHBS[showcaseUuid];
          if (match && match.example) {
            // THIS IS HOW YOU WRITE A PROPERTY TO A COMPONENT
            let selfHBS = showcaseHBS[showcaseUuid].self;
            let selfHBSPair = this.syntax.builders.pair('selfHBS', this.syntax.builders.string(selfHBS));
            node.hash.pairs.push(selfHBSPair);
            let hbs = showcaseHBS[showcaseUuid].example;
            let hbsPair = this.syntax.builders.pair('hbs', this.syntax.builders.string(hbs));
            node.hash.pairs.push(hbsPair);
            // if there isn't any example content set simple mode flag
            let simpleMode = showcaseHBS[showcaseUuid].simple;
            if (simpleMode) {
              let simpleModePair = this.syntax.builders.pair('simple', this.syntax.builders.boolean(simpleMode));
              node.hash.pairs.push(simpleModePair);
            }
          }
        }
      }
    }
  });

  return ast;
};

module.exports = {
  import: function(type, registry) {
    registry.add('template', {
      name: 'ember-component-showcase',
      ext: 'hbs',
      _addon: this,
      toTree: function (tree) {
        return new ShowcaseHBSTreeCopier(tree, this._addon.options);
      }
    });
  },
  export: function(app) {
    app.registry.add('htmlbars-ast-plugin', {
      name: 'ember-component-showcase',
      plugin: ShowcaseHBSInsertion,
    });
  }
};
