import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class SampleDocComponent extends  Component {
  @service documentation;

	get classDocs() {
    let className = this.args.api;
    const docs = this.documentation.getClass(className);

    if (docs.name && !docs.modified) {
      console.log('ACTUAL DOC', docs);

      // Fix descriptions
      docs.description = docs.description.children[0].children[0].value;

      // Fix/Add some lines per prop
      docs.members.instance.forEach(inst => {
        inst.description = inst.description.children[0].children[0].value;
        inst.github = docs.github;
        inst.file = inst.context.file.slice(inst.context.file.indexOf('addon/'));
        inst.line = inst.context.loc.start.line;
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
