import Ember from 'ember';
import layout from '../../templates/components/showcase/s-source';

export default Ember.Component.extend({
  layout: layout,
	sample: null,
	sourceId: Ember.computed.alias('sample.sourceId'),
	src: Ember.computed.alias('sample.src'),
  hbs: Ember.computed.alias('sample.hbs')
});
