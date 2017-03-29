import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: {
    anchor: {
      refreshModel: false,
      as: 'anchor',
      scope: 'controller'
    }
  },
  anchorChanged: Ember.observer('anchor', function() {
    Ember.run.schedule('afterRender', this, function() {
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
