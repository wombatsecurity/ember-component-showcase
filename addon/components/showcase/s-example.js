import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ShowcaseExample extends Component {
  @tracked _src = null;
	get src() { return this._src || this.args.src || '' }


  @action
	insertedElement(el) {
		this._src = el.innerHTML;
	}
}
