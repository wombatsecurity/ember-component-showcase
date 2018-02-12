import Component from '@ember/component';
import layout from '../../templates/components/showcase/s-snippet';

export default Component.extend({
  layout: layout,
	sample: null,
	language: 'HTML',
	title: 'markup.html',
	icon: 'code',
	sourceId: null,
	classNames: ['sample-snippet']
});
