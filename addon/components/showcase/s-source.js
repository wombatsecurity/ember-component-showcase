import Ember from 'ember';
import layout from '../../templates/components/showcase/s-source';

const ShowcaseSource = Ember.Component.extend({
  layout: layout,
	sample: null,
	sourceId: Ember.computed.alias('sample.sourceId'),
	src: Ember.computed.alias('sample.src'),
  hbs: Ember.computed.alias('sample.hbs'),
  selfHBS: Ember.computed.alias('sample.selfHBS'),
  hideHTML: true,
  showHTML: Ember.computed.not('hideHTML'),
  htmlTab: Ember.computed('sourceId', function() {
    return {
      title: "markup.html",
      language: "Markup",
      sourceId: this.get('sourceId'),
      active: false
    }
  }),
  hideHBS: false,
  showHBS: Ember.computed.not('hideHBS'),
  hbsTab: Ember.computed('hbs', function() {
    return {
      title: "example.hbs",
      language: "Handlebars",
      src: this.get('hbs'),
      active: false
    }
  }),
  hideSelfHBS: true,
  showSelfHBS: Ember.computed.not('hideSelfHBS'),
  selfHBSTab: Ember.computed('selfHBS', function() {
    return {
      title: "showcase.hbs",
      language: "Handlebars",
      src: this.get('selfHBS'),
      active: false
    }
  }),

  extraTabs: Ember.computed('tabsInput', function() {
    let tabsInput = this.get('tabsInput');
    let tabs = [];

    // for some reason the array helper wraps our input into another array, this correct this behavior
    if (tabsInput && tabsInput.length > 0 && tabsInput[0].length > 0) {
      tabsInput[0].forEach(function(tab) {
        tabs.push(tab);
      });
    }

    return tabs;
  }),

  tabs: Ember.computed('showHBS', 'hbsTab', 'showHTML', 'htmlTab', 'showSelfHBS', 'selfHBSTab', 'extraTabs', function() {
    let  tabs = [];
    if (this.get('showSelfHBS')) tabs.push(this.get('selfHBSTab'));
    if (this.get('showHBS')) tabs.push(this.get('hbsTab'));
    if (this.get('showHTML')) tabs.push(this.get('htmlTab'));

    let extraTabs = this.get('extraTabs');
    if (extraTabs.length > 0) {
      extraTabs.forEach(function(tab) {
        tabs.push(tab);
      });
    }
    return tabs;
  })
});

ShowcaseSource.reopenClass({
  positionalParams: 'tabsInput'
});

export default ShowcaseSource;
