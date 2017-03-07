import Ember from 'ember';
// import Docs from '../../../docs/documentation';
import layout from '../../templates/components/showcase/s-docs';

const SampleDocComponent = Ember.Component.extend({
  layout: layout,
	classNames: ['sample-docs'],
	src: Ember.computed('params.[]', function() {
		let params = this.get('params');
		if (!Ember.isEmpty(params) && params.length > 0) {
			return params[0];
		}
	}),
	api: null,
	classDocs: Ember.computed('api', function() {
		let className = this.get('api');
		if (className && Docs.classes && Docs.classes[className]) {
			return Docs.classes[className];
		} else {
			if (!Ember.isEmpty(className)) Ember.Logger.warn(`No class documentation found for '${className}'`);
			return {};
		}
	}),
	apiDocs: Ember.computed.alias('classDocs.classitems')
});

SampleDocComponent.reopenClass({
	positionalParams: 'params'
});

export default SampleDocComponent;
