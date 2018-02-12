import { isEmpty } from '@ember/utils';
import { getOwner } from '@ember/application';
import { dasherize } from '@ember/string';
import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from '../templates/components/component-showcase';

/**
 * The Component-Showcase documentation component.
 *
 * @module Component-Showcase
 * @class ComponentShowcase
 */
const ComponentShowcase = Component.extend({
  layout: layout,
  currentPath: '',
  tagName: 'section',
  /**
   * The title for the current showcase sample.
   *
   * @property foobar
   * @type {User}
   */
  title: '',
  hbs: '', // where the hbs source code will end up from ast hook
  showcaseId: null, // uuid created by template preprocessor hook
  simple: false,
  description: '',
  selfHBS: '',
  selfReflection: false,

  sourceId: computed('elementId', function() {
    return this.get('elementId') + '-source';
  }),

  anchorId: computed('title', function() {
    return dasherize(this.get('title'));
  }).readOnly(),

  init() {
    let currentApplication = getOwner(this).lookup('route:application');
    if (!isEmpty(currentApplication)) {
      // Ember voodoo to get current route name
      this.set('currentPath', currentApplication.get('controller.currentRouteName'));
    }

    this._super(...arguments);
  }
});

ComponentShowcase.reopenClass({
  // showcaseId is always inserted as the first positional parameter
  positionalParams: ['showcaseId', 'title', 'description']
});

export default ComponentShowcase;
