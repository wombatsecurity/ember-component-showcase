import Ember from 'ember';
import layout from '../../templates/components/showcase/s-example';

export default Ember.Component.extend({
  layout: layout,
	sample: null,
	sourceId: Ember.computed.alias('sample.sourceId'),
	src: '',

	didInsertElement() {
		this._super(...arguments);
		let src = Ember.$(this.get('element')).find('[sample-example-source]').html();
		this.set('src', src);
	}
});
