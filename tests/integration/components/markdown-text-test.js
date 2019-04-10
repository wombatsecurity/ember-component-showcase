import { find, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | markdown text', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{markdown-text}}`);
    assert.equal(find('*').textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#markdown-text}}
        template block text
      {{/markdown-text}}
    `);

    assert.equal(find('*').textContent.trim(), 'template block text');
  });
});
