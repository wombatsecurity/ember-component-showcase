import Component from "@glimmer/component";
import { inject as service } from "@ember/service";

export default class SampleDocComponent extends Component {
  @service documentation;

  exampleLanguageRegex = new RegExp("^{(.*)}\\n(\\s*[.|\\n|\\W|\\w]*)");

  parseExample(exampleSet) {
    let examples = [];

    for (let exampleContent of exampleSet) {
      let example = {
        language: "JavaScript",
        content: exampleContent.description,
        title: "Show Example",
      };

      let regexMatch = exampleContent.description
        .trim()
        .match(this.exampleLanguageRegex);
      if (regexMatch && regexMatch[1] && regexMatch[2]) {
        example.language = regexMatch[1];
        example.content = regexMatch[2];
      }

      examples.push(example);
    }
    return examples.length > 0 ? examples : null;
  }

  get classDocs() {
    let className = this.args.api;
    const docs = this.documentation.getClass(className);

    if (docs.name && !docs.modified) {
      // Fix descriptions
      docs.description = docs.description.children[0].children[0].value;

      // Fix/Add some lines per prop
      docs.members.instance.forEach((inst) => {
        inst.description = inst.description.children[0].children[0].value;
        inst.github = docs.github;
        inst.file = inst.context.file.slice(
          inst.context.file.indexOf("addon/")
        );
        inst.line = inst.context.loc.start.line;
        if (inst.examples) inst.examples = this.parseExample(inst.examples);
      });

      // Done modifying
      docs.modified = true;
    }

    return docs;
  }

  get apiDocs() {
    return this.classDocs.members?.instance;
  }
}
