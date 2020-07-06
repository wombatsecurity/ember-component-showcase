import { guidFor } from '@ember/object/internals';
import Component from '@glimmer/component';

export default class ShowcaseSource extends Component {
  elementId = guidFor(this);

  get sample() { return this.args.sample || null; }
  get src() { return this.args.src || null; }
  get selfHBS() { return this.args.selfHBS || ''; }
  get hbs() { return this.args.hbs || ''; }

  get htmlTab() {
    return {
      title: "markup.html",
      language: "Markup",
      sourceId: this.args.sourceId,
      active: false
    }
  }

  // ======================
  // The predefined tabs
  // ======================

  get showHBS() {
    if (this.args.hideHBS) return false;
    return this.args.showHBS ?? true;
  }

  get hbsTab() {
    return {
      title: "example.hbs",
      language: "Handlebars",
      src: this.hbs,
      active: false
    }
  }

  get selfHBSTab() {
    return {
      title: "showcase.hbs",
      language: "Handlebars",
      src: this.selfHBS,
      active: false
    }
  }

  get extraTabs() {
    return this.args.tabsInput;
  }

  get tabs() {
    let tabs = [];
    if (this.args.showSelfHBS) tabs.push(this.selfHBSTab);
    if (this.showHBS) tabs.push(this.hbsTab);
    if (this.args.showHTML) tabs.push(this.htmlTab);

    if (this.extraTabs?.length) {
      this.extraTabs.forEach(function(tab) {
        tabs.push(tab);
      });
    }

    return tabs;
  }
}

