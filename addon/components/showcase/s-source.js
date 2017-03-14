import Ember from 'ember';
import layout from '../../templates/components/showcase/s-source';

export default Ember.Component.extend({
  layout: layout,
	sample: null,
	sourceId: Ember.computed.alias('sample.sourceId'),
	src: Ember.computed.alias('sample.src'),
  hbs: Ember.computed.alias('sample.hbs'),
  hideHTML: false,
  htmlTab: Ember.computed('sourceId', function() {
    return {
      title: "Markup",
      language: "Markup",
      sourceId: this.get('sourceId'),
      active: false
    }
  }),
  hideHBS: false,
  hbsTab: Ember.computed('hbs', function() {
    return {
      title: "Handlebars",
      language: "Handlebars",
      src: this.get('hbs'),
      active: false
    }
  }),
  tabs: Ember.computed('hideHBS', 'hbsTab', 'hideHTML', 'htmlTab', function() {
    let tabs = [];
    if (!this.get('hideHBS')) tabs.push(this.get('hbsTab'));
    if (!this.get('hideHTML')) tabs.push(this.get('htmlTab'));
    return tabs;
  })
});
