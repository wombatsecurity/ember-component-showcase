/* global html_beautify, js_beautify */
import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';

module('Integration | Component | code sample', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders Markup', async function(assert) {
    assert.throws(() => { run(render(hbs`<CodeSample />`))}, new Error('Missing code for showcase!'), "Throws when not provided code");

    let snippet = "<h1>Earth</h1><h2>Wind</h2><h3>Fire</h3>";
    this.set('snippet', snippet);
    await render(hbs`<CodeSample @src={{this.snippet}} />`);
    assert.dom('code').exists();
    assert.dom('code').hasText(html_beautify(snippet), 'renders manual source content correctly');
    assert.dom('code > *').exists({ count: 6 }); // 1 child per <tag> OR </tag>
    assert.dom('.toolbar .toolbar-item').hasText('HTML', 'displays default language label');

      // Template block usage:"
    await render(hbs`
      <CodeSample>
        {{this.snippet}}
      </CodeSample>
    `);
      assert.dom('code').hasClass('language-markup', 'sets default language');
      assert.dom('.toolbar .toolbar-item').hasText('HTML', 'displays default language label');
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
      <CodeSample @language="javascript">
        {{this.snippet}}
      </CodeSample>
    `);

    assert.dom('.toolbar .toolbar-item').hasText('JavaScript', 'displays JavaScript language label');
    assert.dom('code').hasText(js_beautify(snippet, {indent_size: 2}), 'correctly renders block content');
    assert.dom('code > *').exists({count: 31}, 'generate correct number of child nodes'); // 1 child per <tag> OR </tag>
  });

  test('it does not render unsupported languages', async function(assert) {
    assert.throws(() => { run(render(hbs`<CodeSample @language="foobar" />`))}, new Error('Missing Prism grammar for foobar. Please try updating your environment.js and try again.'), "Throws when not provided valid language");
  });
});
