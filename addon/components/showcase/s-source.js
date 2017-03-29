import Ember from 'ember';
import layout from '../../templates/components/showcase/s-source';

export default Ember.Component.extend({
  layout: layout,
	sample: null,
	sourceId: Ember.computed.alias('sample.sourceId'),
	src: Ember.computed.alias('sample.src'),
  hbs: Ember.computed.alias('sample.hbs'),
  selfHBS: Ember.computed.alias('sample.selfHBS'),
  hideHTML: false,
  htmlTab: Ember.computed('sourceId', function() {
    return {
      title: "markup.html",
      language: "Markup",
      sourceId: this.get('sourceId'),
      active: false
    }
  }),
  hideHBS: false,
  hbsTab: Ember.computed('hbs', function() {
    return {
      title: "example.hbs",
      language: "Handlebars",
      src: this.get('hbs'),
      active: false
    }
  }),
  showSelfHBS: false,
  selfHBSTab: Ember.computed('selfHBS', function() {
    return {
      title: "showcase.hbs",
      language: "Handlebars",
      src: this.get('selfHBS'),
      active: false
    }
  }),

  tabs: Ember.computed('hideHBS', 'hbsTab', 'hideHTML', 'htmlTab', 'showSelfHBS', 'selfHBSTab', function() {
    let  tabs = [];
    if (this.get('showSelfHBS')) tabs.push(this.get('selfHBSTab'));
    if (!this.get('hideHBS')) tabs.push(this.get('hbsTab'));
    if (!this.get('hideHTML')) tabs.push(this.get('htmlTab'));
    return tabs;
  })
});
