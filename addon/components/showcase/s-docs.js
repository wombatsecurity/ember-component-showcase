import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import layout from '../../templates/components/showcase/s-docs';

const SampleDocComponent = Component.extend({
  documentation: service(),
  layout: layout,
	classNames: ['sample-docs'],
	src: computed('params.[]', function() {
		let params = this.get('params');
		if (!isEmpty(params) && params.length > 0) {
			return params[0];
		}
	}),
	api: null,
	classDocs: computed('api', 'documentation', function() {
		let className = this.get('api');
    return this.get('documentation').getClass(className);
	}),
	apiDocs: alias('classDocs.classitems')
});

SampleDocComponent.reopenClass({
	positionalParams: 'params'
});

export default SampleDocComponent;
