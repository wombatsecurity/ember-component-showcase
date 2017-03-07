import Ember from 'ember';
import layout from '../../templates/components/showcase/s-snippet';

export default Ember.Component.extend({
  layout: layout,
	sample: null,
	language: 'HTML',
	title: 'markup.html',
	icon: 'code',
	sourceId: null,
	classNames: ['sample-snippet']
});
