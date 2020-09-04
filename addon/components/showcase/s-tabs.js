import { camelize } from '@ember/string';
import { A } from '@ember/array';
import { action, set } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';

export default class SampleTabs extends Component {
  sourceId = null;
  includeSource = false;

  @tracked _tabs = null;

  get tabs() {
    if (this._tabs) return this._tabs;

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
    const updatedTabs = [];

    this.tabs.forEach((tab) => {
      if (tab) {
        set(
          tab, 
          "active", 
          tab.src === tabObject.src 
            ? !tab.active 
            : false
        );
        updatedTabs.push(tab)
      }
    });

    this._tabs = [...updatedTabs];
  }
}

