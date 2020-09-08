"use strict";
const documentation = require("documentation");

// uses a regex to strip out examples values so they can be better formatted in docs
const exampleLanguageRegex = new RegExp("^{(.*)}\\n(\\s*[.|\\n|\\W|\\w]*)");

function parseExample(exampleSet) {
  let examples = [];
  for (let exampleContent of exampleSet) {
    let example = {
      language: "JavaScript",
      content: exampleContent,
      title: "Show Example",
    };

    let regexMatch = exampleContent.trim().match(exampleLanguageRegex);
    if (regexMatch && regexMatch[1] && regexMatch[2]) {
      example.language = regexMatch[1];
      example.content = regexMatch[2];
    }

    examples.push(example);
  }
  return examples.length > 0 ? examples : null;
}

module.exports = function (options) {
  documentation.build(["addon/**/*.js"], options).then((docs) => {
    if (docs.name && !docs.modified) {
      // Fix descriptions
      const desc = docs.description.children[0].children.map((v) => {
        switch (v.type) {
          case "inlineCode":
            return `\`${v.value}\``;
          case "link":
            return `[${v.children[0].value}](${v.url})`;
          default:
            return v.value;
        }
      });

      docs.description = desc.join(" ");

      // Fix/Add some lines per prop
      docs.members.instance.forEach((inst) => {
        const desc = inst.description.children[0].children.map((v) => {
          switch (v.type) {
            case "inlineCode":
              return `\`${v.value}\``;
            case "link":
              return `[${v.children[0].value}](${v.url})`;
            default:
              return v.value;
          }
        });

        inst.description = desc.join(" ");
        inst.github = docs.github;
        inst.file = inst.context.file.slice(
          inst.context.file.indexOf("addon/")
        );
        inst.line = inst.context.loc.start.line;
        if (inst.examples) inst.examples = parseExample(inst.examples);
      });

      // Done modifying
      docs.modified = true;
    }

    return docs;
  });
};
