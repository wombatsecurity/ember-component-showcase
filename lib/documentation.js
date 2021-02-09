"use strict";
const documentation = require("documentation");

// uses a regex to strip out examples values so they can be better formatted in docs
const exampleLanguageRegex = new RegExp("^{(.*)}\\n(\\s*[.|\\n|\\W|\\w]*)");

function parseExample(exampleSet) {
  let examples = [];
  for (let exampleContent of exampleSet) {
    let example = {
      language: "JavaScript",
      content: exampleContent.description,
      title: "Show Example",
    };

    let exContent =
      exampleContent && exampleContent.length && exampleContent[0].description
        ? exampleContent[0].description
        : "";

    let regexMatch = exContent.trim().match(exampleLanguageRegex);
    if (regexMatch && regexMatch[1] && regexMatch[2]) {
      example.language = regexMatch[1];
      example.content = regexMatch[2];
    }

    examples.push(example);
  }
  return examples.length > 0 ? examples : null;
}

module.exports = async function (options) {
  let paths = ["addon/**/*.js"];
  if (options.paths) {
    paths = options.paths.length ? options.paths : [options.paths];
  }

  const docs = await documentation.build(paths, options);

  docs.map((d) => {
    if (d.name) {
      // Fix descriptions
      const desc = d.description.children
        ? d.description.children[0].children.map((v) => {
            switch (v.type) {
              case "inlineCode":
                return `\`${v.value}\``;
              case "link":
                return `[${v.children[0].value}](${v.url})`;
              default:
                return v.value;
            }
          })
        : [];

      d.description = desc.join(" ");

      // Fix/Add some lines per prop
      d.members.instance.forEach((inst) => {
        const desc = inst.description.children
          ? inst.description.children[0].children.map((v) => {
              switch (v.type) {
                case "inlineCode":
                  return `\`${v.value}\``;
                case "link":
                  return `[${v.children[0].value}](${v.url})`;
                default:
                  return v.value;
              }
            })
          : [inst.description];

        inst.description = desc.join(" ");
        inst.github = d.github;
        inst.file = inst.context.file.slice(
          inst.context.file.indexOf("addon/")
        );
        inst.line = inst.context.loc.start.line;
        if (inst.examples) inst.examples = parseExample(inst.examples);
      });
    }

    return d;
  });

  return docs;
};
