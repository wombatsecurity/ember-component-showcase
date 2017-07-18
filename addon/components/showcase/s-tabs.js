import Ember from 'ember';
import layout from '../../templates/components/showcase/s-tabs';

const SampleTabs = Ember.Component.extend({
  layout: layout,
  sourceId: null,
  includeSource: false,
  tabs: Ember.computed('tabsInput', function () {
    let tabsInput = this.get('tabsInput');
    let elementId = this.get('elementId');
    let tabs = Ember.A();

    // for some reason the array helper wraps our input into another array, this correct this behavior
    if (tabsInput && tabsInput.length > 0 && tabsInput[0].length > 0) {
      tabsInput[0].forEach(function (tab) {
        tab.id = `${elementId}-${Ember.String.camelize(tab.title)}`.toLowerCase();
        tabs.push(Ember.Object.create(tab));
      });
    }

    return tabs;
  }),

  selectedTab: Ember.computed('tabs.@each.active', function () {
    return this.get('tabs').findBy('active', true);
  }),

  actions: {
    setSelectedTab(tabObject) {
      this.get('tabs').forEach((tab) => {
        if (tab === tabObject) {
          tab.toggleProperty('active');
        } else {
          tab.set('active', false);
        }
      });
    }
  }

});

SampleTabs.reopenClass({
  positionalParams: 'tabsInput'
});

export default SampleTabs;
