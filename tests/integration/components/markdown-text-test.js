import { find, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | markdown text', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<MarkdownText />`);
    assert.dom('*', false); // Empty, tagless component = nothing rendered

    // Template block usage:
    await render(hbs`
      <MarkdownText>
        <p data-test-p>template block text</p>
      </MarkdownText>
    `);

    assert.equal(find('[data-test-p]').textContent.trim(), 'template block text');
  });
});
