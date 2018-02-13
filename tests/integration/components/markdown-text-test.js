import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('markdown-text', 'Integration | Component | markdown text', {
  integration: true
});

test('it renders', async function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  await this.render(hbs`{{markdown-text}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  await this.render(hbs`
    {{#markdown-text}}
      template block text
    {{/markdown-text}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
