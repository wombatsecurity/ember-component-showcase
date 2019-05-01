import { schedule } from '@ember/runloop';
import { observer } from '@ember/object';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  queryParams: {
    anchor: {
      refreshModel: false,
      as: 'anchor',
      scope: 'controller'
    }
  },
  anchorChanged: observer('anchor', function() {
    schedule('afterRender', this, function() {
      let anchor = this.get('anchor');
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
    });
  }),
});
