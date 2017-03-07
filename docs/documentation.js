import Ember from 'ember';
import ENV from '../config/environment';
import Docs from './yuidoc';
import Types from './types';
import _ from 'lodash';

const targetTag = ENV.APP.VERSION;
const githubPath = 'https://github.com/wombatsecurity/wombat-style-guide/tree/v' + targetTag + '/';

// uses a regex to strip out examples values so they can be better formatted in docs
const exampleLanguageRegex = new RegExp('^{(.*)}\\n(\\s*[.|\\n|\\W|\\w]*)');
const parseExample = function(exampleSet) {
  let examples = [];
  for (let exampleContent of exampleSet) {
    let example = {
      language: 'JavaScript',
      content: exampleContent,
      title: 'Show Example'
    };

    let regexMatch = exampleContent.trim().match(exampleLanguageRegex);
    if (regexMatch && regexMatch[1] && regexMatch[2]) {
      example.language = regexMatch[1];
      example.content = regexMatch[2];
    }

    examples.push(example);
  }
  return examples.length > 0 ? examples : null;
};

const mapClassItems = function(docs) {
  for (var classItem of docs.classitems) {
    classItem.github = githubPath + classItem.file + '#L' + classItem.line;
    if (classItem.type) classItem.types = Types(classItem.type);
    if (classItem.example) classItem.examples = parseExample(classItem.example);
  }

  // moves classitem references into parent class objects for convenient access
  for (var className in docs.classes) {
    var classItems = _.filter(docs.classitems, function(val) {
      return val.class === className;
    });
    docs.classes[className].classitems = classItems;
  }
  return docs;
};

const loadDocs = function(rawDocs) {
  try {
    return mapClassItems(rawDocs);
  } catch(e) {
    Ember.Logger.warn('No documentation found in \'dummy/app/docs/yuidoc.json\', run \'gulp docs\' and try again.');
  }
};

export default loadDocs(Docs);
