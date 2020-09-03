'use strict';
// const lookupType = require('./types');
// const _filter = require('lodash/filter');
const documentation = require('documentation');

// uses a regex to strip out examples values so they can be better formatted in docs
// const exampleLanguageRegex = new RegExp('^{(.*)}\\n(\\s*[.|\\n|\\W|\\w]*)');
// const parseExample = function(exampleSet) {
//   let examples = [];
//   for (let exampleContent of exampleSet) {
//     let example = {
//       language: 'JavaScript',
//       content: exampleContent,
//       title: 'Show Example'
//     };

//     let regexMatch = exampleContent.trim().match(exampleLanguageRegex);
//     if (regexMatch && regexMatch[1] && regexMatch[2]) {
//       example.language = regexMatch[1];
//       example.content = regexMatch[2];
//     }

//     examples.push(example);
//   }
//   return examples.length > 0 ? examples : null;
// };

module.exports = function(options) {
  documentation.build(['addon/**/*.js'], options).then(res => {
    return res;
  });
  //(new yuidocs.YUIDoc(options)).run();

  // for (var classItem of docs.classitems) {
  //   // TODO: need a way to get the nested addon docs root github repo
  //   if (!classItem.file.includes('node_modules') && options.githubRepo) {
  //     let githubTag = options.githubTag || 'master';
  //     let githubPath = `${options.githubRepo}/tree/${githubTag}/${classItem.file}#L${classItem.line}`;
  //     classItem.github = githubPath;
  //   }
  //   if (classItem.type) classItem.types = lookupType(classItem.type);
  //   if (classItem.example) classItem.examples = parseExample(classItem.example);
  // }

  // // moves classitem references into parent class objects for convenient access
  // for (var className in docs.classes) {
  //   var classItems = _filter(docs.classitems, function(val) {
  //     return val.class === className;
  //   });
  //   docs.classes[className].classitems = classItems;
  // }
};
