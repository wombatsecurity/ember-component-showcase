import { schedule } from '@ember/runloop';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  queryParams: {
    anchor: {
      refreshModel: false,
      as: 'anchor',
      scope: 'controller'
    }
  },

  init: function() {
    this._super();
    schedule('afterRender', () => this.send('scrollToAnchor'));
  },

  actions: {
    scrollToAnchor() {
      let anchor = this.anchor;
      if (anchor) {
        let el = document.querySelector(`#${anchor}`);
        if (el) {
          let fromTop = 90;
          document.querySelector('html, body').scrollTo({
            top: el.offsetTop - fromTop,
            left: 0,
            behavior: 'smooth'
          });
        }
      }
    }
  }
});
