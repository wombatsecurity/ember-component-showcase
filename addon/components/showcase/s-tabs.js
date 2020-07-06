import { camelize } from '@ember/string';
import { A } from '@ember/array';
import { action, set } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import Component from '@glimmer/component';

export default class SampleTabs extends Component {
  sourceId = null;
  includeSource = false;

  get tabs() {
    const tabsInput = this.args.tabsInput;
    const elementId = guidFor(this);
    const tabs = A();

    // for some reason the array helper wraps our input into another array, this correct this behavior
    tabsInput.forEach(function (tab) {
      tab.id = `${elementId}-${camelize(tab.title.trim())}`.toLowerCase();
      if (tab.language) set(tab, "language", tab.language.trim().toLowerCase());
      tabs.push(tab);
    });

    return tabs;
  }

  get selectedTab() {
    return this.tabs.findBy('active', true);
  }

  @action
  setSelectedTab(tabObject) {
    this.tabs.forEach((tab) => {
      if (tab) set(tab, "active", tab === tabObject ? !tab.active : false);
    });
  }
}

