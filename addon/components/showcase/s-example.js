import Component from '@ember/component';
import layout from '../../templates/components/showcase/s-example';

export default Component.extend({
  layout: layout,
	sourceId: null,
	src: '',

	didInsertElement() {
		this._super(...arguments);
		let src = this.element.querySelector('[sample-example-source]').innerHTML;
		this.set('src', src);
	}
});
