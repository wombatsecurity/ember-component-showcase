import Ember from 'ember';
import layout from '../templates/components/component-showcase';

const ComponentShowcase = Ember.Component.extend({
  layout: layout,
  // Ember voodoo to get current route name
  currentPath: '',
  tagName: 'section',
  title: '',
  hbs: '', // where the hbs source code will end up from ast hook
  showcaseId: null, // uuid created by template preprocessor hook
  simple: false,
  description: '',
  selfHBS: '',
  selfReflection: false,

  sourceId: Ember.computed('elementId', function() {
    return this.get('elementId') + '-source';
  }),

  anchorId: Ember.computed('title', function() {
    return Ember.String.dasherize(this.get('title'));
  }).readOnly(),

  init() {
    let currentApplication = Ember.getOwner(this).lookup('route:application');
    if (!Ember.isEmpty(currentApplication)) {
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
