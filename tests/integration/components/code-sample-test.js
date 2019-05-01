import { find, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
/* global html_beautify, js_beautify */
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | code sample', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders Markup', async function(assert) {
    await render(hbs`{{code-sample}}`);
    assert.dom('.toolbar .toolbar-item').hasText('markup', 'displays default language label');
      assert.dom('code').exists();
    assert.dom('code').hasText('', 'renders empty component correctly');

      let snippet = "<h1>Earth</h1><h2>Wind</h2><h3>Fire</h3>";
      this.set('snippet', snippet);
      await render(hbs`{{code-sample src=snippet}}`);
    assert.dom('code').hasText(html_beautify(snippet), 'renders manual source content correctly');
    assert.dom('code > *').exists({ count: 6 }); // 1 child per <tag> OR </tag>

      // Template block usage:"
    await render(hbs`
      {{#code-sample}}
        {{snippet}}
      {{/code-sample}}
    `);
      assert.dom('code').hasClass('language-markup', 'sets default language');
      assert.dom('.toolbar .toolbar-item').hasText('markup', 'displays default language label');
      assert.dom('code').hasText(html_beautify(snippet), 'correctly renders block content');
      assert.dom('code > *').exists({count: 6});
  });

  test('it renders JavaScript', async function(assert) {
    let snippet = `
    var earth = 'earth';
    let wind = ['w', 'i', 'n', 'd'];
    const fire = {'fire': true};
    console.log(earth, wind, fire);
    `;
    this.set('snippet', snippet);

    await render(hbs`
      {{#code-sample language="JavaScript"}}
        {{snippet}}
      {{/code-sample}}
    `);

    assert.equal(find('.toolbar .toolbar-item').textContent, 'JavaScript', 'displays JavaScript language label');
    assert.equal(find('code').textContent.trim(), js_beautify(snippet, {indent_size: 2}), 'correctly renders block content');
    assert.equal(find('code').children.length, 31, 'generate correct number of child nodes'); // 1 child per <tag> OR </tag>
  });
});
