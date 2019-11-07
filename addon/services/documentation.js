/* eslint-disable no-console */
import Service from '@ember/service';
import Docs from 'documentation';
import { isEmpty } from '@ember/utils';
import lunr from 'lunr';

export default Service.extend({

  init() {
    this._super(...arguments);

    if (Docs) {
      this.classes = Docs.classitems;
      this.index = this.generateIndex(this.classes);
    }
  },

  classes: null,
  index: null,
  generateIndex(items) {
    return lunr(function() {
      this.ref('module');
      this.field('name');
      this.field('description');
      this.field('file');
      this.field('class');

      items.forEach((doc) => {
          this.add(doc);
      });
    });
  },

  search(value) {
    return this.get('index').search(value);
  },

  getClass(className) {
    if (className && Docs.classes && Docs.classes[className]) {
      return Docs.classes[className];
    } else {
      if (!isEmpty(className)) console.warn(`No class documentation found for '${className}'`);
      return {};
    }
  }
});
