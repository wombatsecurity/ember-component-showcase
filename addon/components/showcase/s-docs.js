/* eslint-disable no-console */
import { alias } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import Component from '@ember/component';
import Docs from 'documentation';
import layout from '../../templates/components/showcase/s-docs';

const SampleDocComponent = Component.extend({
  layout: layout,
	classNames: ['sample-docs'],
	src: computed('params.[]', function() {
		let params = this.get('params');
		if (!isEmpty(params) && params.length > 0) {
			return params[0];
		}
	}),
	api: null,
	classDocs: computed('api', function() {
		let className = this.get('api');
		if (className && Docs.classes && Docs.classes[className]) {
			return Docs.classes[className];
		} else {
			if (!isEmpty(className)) console.warn(`No class documentation found for '${className}'`);
			return {};
		}
	}),
	apiDocs: alias('classDocs.classitems')
});

SampleDocComponent.reopenClass({
	positionalParams: 'params'
});

export default SampleDocComponent;
