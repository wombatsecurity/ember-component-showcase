import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from '../../templates/components/showcase/s-source';

const ShowcaseSource = Component.extend({
  layout: layout,
	sample: null,
	sourceId: null,
	src: null,
  hbs: '',
  selfHBS: '',
  hideHTML: true,
  showHTML: computed('hideHTML', {
    get() {
      if (this._showHTML) return this._showHTML;
      return !this.hideHTML;
    },
    set(key, value) {
      return this._showHTML = value;
    }
  }),
  htmlTab: computed('sourceId', function() {
    return {
      title: "markup.html",
      language: "Markup",
      sourceId: this.sourceId,
      active: false
    }
  }),
  hideHBS: false,
  showHBS: computed('hideHBS', {
    get() {
      if (this._showHBS) return this._showHBS;
      return !this.hideHBS;
    },
    set(key, value) {
      return this._showHBS = value;
    }
  }),
  hbsTab: computed('hbs', function() {
    return {
      title: "example.hbs",
      language: "Handlebars",
      src: this.hbs,
      active: false
    }
  }),
  hideSelfHBS: true,
  showSelfHBS: computed('hideSelfHBS', {
    get() {
      if (this._showSelfHBS) return this._showSelfHBS;
      return !this.hideSelfHBS;
    },
    set(key, value) {
      return this._showSelfHBS = value;
    }
  }),
  selfHBSTab: computed('selfHBS', function() {
    return {
      title: "showcase.hbs",
      language: "Handlebars",
      src: this.selfHBS,
      active: false
    }
  }),

  extraTabs: computed('tabsInput', function() {
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

  tabs: computed('showHBS', 'hbsTab', 'showHTML', 'htmlTab', 'showSelfHBS', 'selfHBSTab', 'extraTabs', function() {
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
