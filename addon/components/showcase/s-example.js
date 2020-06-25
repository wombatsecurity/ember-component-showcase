import Component from '@ember/component';

export default Component.extend({
	sourceId: null,
	src: '',

	didInsertElement() {
		this._super(...arguments);
		let src = this.element.querySelector('[sample-example-source]').innerHTML;
		this.set('src', src);
	}
});
