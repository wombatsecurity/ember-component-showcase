import EmberObject from '@ember/object';
import AnchorScrollMixin from 'ember-component-showcase/mixins/anchor-scroll';
import { module, test } from 'qunit';

module('Unit | Mixin | anchor scroll');

// Replace this with your real tests.
test('it works', function(assert) {
  let AnchorScrollObject = EmberObject.extend(AnchorScrollMixin);
  let subject = AnchorScrollObject.create();
  assert.ok(subject);
});
