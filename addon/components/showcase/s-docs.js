import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';

const SampleDocComponent = Component.extend({
  documentation: service(),
	classNames: ['sample-docs'],
	src: computed('params.[]', function() {
		let params = this.params;
		if (!isEmpty(params) && params.length > 0) {
			return params[0];
		}
	}),
	api: null,
	classDocs: computed('api', 'documentation', function() {
		let className = this.api;
    return this.documentation.getClass(className);
	}),
	apiDocs: alias('classDocs.classitems')
});

SampleDocComponent.reopenClass({
	positionalParams: 'params'
});

export default SampleDocComponent;
