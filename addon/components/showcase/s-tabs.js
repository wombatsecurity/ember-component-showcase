import { camelize } from '@ember/string';
import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import Component from '@ember/component';

const SampleTabs = Component.extend({
  sourceId: null,
  includeSource: false,
  tabs: computed('tabsInput', function () {
    let tabsInput = this.get('tabsInput');
    let elementId = this.get('elementId');
    let tabs = A();

    // for some reason the array helper wraps our input into another array, this correct this behavior
    if (tabsInput && tabsInput.length > 0 && tabsInput[0].length > 0) {
      tabsInput[0].forEach(function (tab) {
        tab.id = `${elementId}-${camelize(tab.title.trim())}`.toLowerCase();
        if (tab.language) tab.language = tab.language.trim().toLowerCase();
        tabs.push(EmberObject.create(tab));
      });
    }

    return tabs;
  }),

  selectedTab: computed('tabs.@each.active', function () {
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
