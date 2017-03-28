import Ember from 'ember';
import layout from '../templates/components/component-showcase';

const ComponentShowcase = Ember.Component.extend({
  layout: layout,
  pageTitleList: Ember.inject.service(),
  currentPath: Ember.computed.readOnly('pageTitleList.currentPath'),
  tagName: 'section',
  title: '',
  hbs: '', // where the hbs source code will end up from ast hook
  showcaseId: null, // uuid created by template preprocessor hook
  simple: false,
  description: '',

  sourceId: Ember.computed('elementId', function() {
    return this.get('elementId') + '-source';
  }),

  anchorId: Ember.computed('title', function() {
    return Ember.String.dasherize(this.get('title'));
  }).readOnly()
});

ComponentShowcase.reopenClass({
  // showcaseId is always inserted as the first positional parameter
  positionalParams: ['showcaseId', 'title', 'description']
});

export default ComponentShowcase;
