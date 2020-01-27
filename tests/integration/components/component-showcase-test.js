import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | component showcase', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`
  {{#component-showcase "123" as |s|}}
    {{s.docs}}
    {{#s.example}}
    {{/s.example}}
    {{s.source hbs=''}}
  {{/component-showcase}}`);

    assert.dom('.showcase-title').hasText('','renders no title when empty');
    assert.dom('.showcase-body .description').hasText('', 'renders no body when empty');
    assert.dom('.showcase-tabs > *').exists({count: 1});
    assert.equal(find('.showcase-tabs').textContent.trim(), 'example.hbs', 'only tab visible is Handlebars');

    await render(hbs`
  {{#component-showcase "123" "Title" as |s|}}
    {{s.docs "body"}}
    {{#s.example}}
      {{showcase/s-icon "code"}}
    {{/s.example}}
    {{s.source hbs='{{fa-icon "code"}}'}}
  {{/component-showcase}}`);

    assert.dom('.showcase-title').hasText('Title', 'renders custom title');
    assert.dom('.showcase-body .description').hasText('body', 'renders custom body');

    await render(hbs`
  {{#component-showcase "123" as |s|}}
    {{s.docs "body"}}
    {{#s.example}}
      {{showcase/s-icon "code"}}
    {{/s.example}}
    {{s.source showHTML=true}}
  {{/component-showcase}}`);

    assert.dom('.showcase-tabs > *').exists({count: 2});
    assert.dom('.showcase-tabs').hasText('example.hbs markup.html');

    await render(hbs`
  {{#component-showcase "123" as |s|}}
    {{s.docs "body"}}
    {{#s.example}}
      {{showcase/s-icon "code"}}
    {{/s.example}}
    {{s.source hideHBS=true showHTML=true}}
  {{/component-showcase}}`);

    assert.dom('.showcase-tabs > *').exists({count: 1}, 'hideHBS hides hbs, and showHTML leaves 1 tab');
    assert.dom('.showcase-tabs').hasText('markup.html', 'only tab visible is Markup');

    await render(hbs`
  {{#component-showcase "123" as |s|}}
    {{#s.example}}
      {{showcase/s-icon "code"}}
    {{/s.example}}
  {{/component-showcase}}`);

    assert.dom('.showcase-tabs > *').doesNotExist('with no source, there are no tabs');
    assert.dom('.showcase-body .description').doesNotExist('with no docs, there are no body');

    await render(hbs`
  {{#component-showcase as |s|}}
    {{#s.example}}
      {{showcase/s-icon "code"}}
    {{/s.example}}
    {{s.source (array (hash title="route.js" language="JavaScript" src="var foo = 'foo';")) showHTML=true }}
  {{/component-showcase}}`);

    assert.dom('.showcase-tabs > *').exists({count: 3}, 'using showcase/s-source you can add custom tabs');
    assert.dom('.showcase-tabs').hasText('example.hbs markup.html route.js', 'will show custom tab names and orders correctly');

    await render(hbs`
  {{#component-showcase as |s|}}
    {{#s.example}}
      {{showcase/s-icon "code"}}
    {{/s.example}}
    {{s.source (array
          (hash title="Route.js" language="JavaScript" src="var foo = 'foo';")
          (hash title="Controller.js" language="JavaScript" src="var bar = 'bar';")
    ) hideHBS=true }}
  {{/component-showcase}}`);

    assert.dom('.showcase-tabs > *').exists({count: 2}, 'using showcase/s-source you can remove default tabs');
    assert.dom('.showcase-tabs').hasText('Route.js Controller.js', 'will show custom tab names and orders correctly without defaults');
  });
});
