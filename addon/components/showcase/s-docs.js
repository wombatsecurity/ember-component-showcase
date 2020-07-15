import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class SampleDocComponent extends  Component {
  @service documentation;

	get classDocs() {
		let className = this.args.api;
    return this.documentation.getClass(className);
  }

	get apiDocs() { return this.classDocs?.classitems; }
}
