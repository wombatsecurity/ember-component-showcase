import Ember from 'ember';
import AnchorScrollMixin from 'ember-component-showcase/mixins/anchor-scroll';
import { module, test } from 'qunit';

module('Unit | Mixin | anchor scroll');

// Replace this with your real tests.
test('it works', function(assert) {
  let AnchorScrollObject = Ember.Object.extend(AnchorScrollMixin);
  let subject = AnchorScrollObject.create();
  assert.ok(subject);
});
