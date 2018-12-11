import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../../templates/components/showcase/s-example';

export default Component.extend({
  layout: layout,
	sample: null,
	sourceId: alias('sample.sourceId'),
	src: '',

	didInsertElement() {
		this._super(...arguments);
		let src = this.element.querySelector('[sample-example-source]').innerHTML;
		this.set('src', src);
	}
});
