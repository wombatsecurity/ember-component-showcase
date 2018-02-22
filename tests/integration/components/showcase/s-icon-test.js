import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('showcase/s-icon', 'Integration | Component | showcase/s icon', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{showcase/s-icon}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#showcase/s-icon}}
      template block text
    {{/showcase/s-icon}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
