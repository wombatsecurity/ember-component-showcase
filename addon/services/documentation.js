/* eslint-disable no-console */
import Service from "@ember/service";
import Docs from "docs";
import { isEmpty } from "@ember/utils";
import lunr from "lunr";

export default Service.extend({
  init() {
    this._super(...arguments);

    if (Docs) this.classes = Docs;
  },

  classes: null,
  index: null,
  generateIndex(items) {
    return lunr(function () {
      this.ref("module");
      this.field("name");
      this.field("description");
      this.field("file");
      this.field("class");

      items.forEach((doc) => {
        this.add(doc);
      });
    });
  },

  search(value) {
    return this.index.search(value);
  },

  getClass(className) {
    const foundClass = Docs.find((c) => c.name === className);
    if (className && foundClass) {
      return foundClass;
    } else {
      if (!isEmpty(className))
        console.warn(`No class documentation found for '${className}'`);
      return {};
    }
  },
});
