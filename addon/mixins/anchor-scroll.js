import $ from 'jquery';
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
        let el = $(`#${anchor}`);
        if (el && el.offset()) {
          let fromTop = 90;
          $('html, body').animate({ scrollTop: el.offset().top - fromTop});
        }
      }
    });
  }),
});
