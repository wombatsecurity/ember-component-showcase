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

    assert.dom('.card-title').hasText('','renders no title when empty');
    assert.dom('.description').hasText('', 'renders no description when empty');
    assert.dom('.tab-nav > *').exists({count: 1});
    assert.equal(find('.tab-nav').textContent.trim(), 'example.hbs', 'only tab visible is Handlebars');

    await render(hbs`
  {{#component-showcase "123" "Title" as |s|}}
    {{s.docs "description"}}
    {{#s.example}}
      {{showcase/s-icon "code"}}
    {{/s.example}}
    {{s.source hbs='{{fa-icon "code"}}'}}
  {{/component-showcase}}`);

    assert.dom('.card-title').hasText('Title', 'renders custom title');
    assert.dom('.description').hasText('description', 'renders custom description');

    await render(hbs`
  {{#component-showcase "123" as |s|}}
    {{s.docs "description"}}
    {{#s.example}}
      {{showcase/s-icon "code"}}
    {{/s.example}}
    {{s.source showHTML=true}}
  {{/component-showcase}}`);

    assert.dom('.tab-nav > *').exists({count: 2});
    assert.dom('.tab-nav').hasText('example.hbs markup.html');

    await render(hbs`
  {{#component-showcase "123" as |s|}}
    {{s.docs "description"}}
    {{#s.example}}
      {{showcase/s-icon "code"}}
    {{/s.example}}
    {{s.source hideHBS=true showHTML=true}}
  {{/component-showcase}}`);

    assert.dom('.tab-nav > *').exists({count: 1}, 'hideHBS hides hbs, and showHTML leaves 1 tab');
    assert.dom('.tab-nav').hasText('markup.html', 'only tab visible is Markup');

    await render(hbs`
  {{#component-showcase "123" as |s|}}
    {{#s.example}}
      {{showcase/s-icon "code"}}
    {{/s.example}}
  {{/component-showcase}}`);

    assert.dom('.tab-nav > *').doesNotExist('with no source, there are no tabs');
    assert.dom('.description').doesNotExist('with no docs, there are no description');

    await render(hbs`
  {{#component-showcase as |s|}}
    {{#s.example}}
      {{showcase/s-icon "code"}}
    {{/s.example}}
    {{s.source (array (hash title="route.js" language="JavaScript" src="var foo = 'foo';")) showHTML=true }}
  {{/component-showcase}}`);

    assert.dom('.tab-nav > *').exists({count: 3}, 'using showcase/s-source you can add custom tabs');
    assert.dom('.tab-nav').hasText('example.hbs markup.html route.js', 'will show custom tab names and orders correctly');

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

    assert.dom('.tab-nav > *').exists({count: 2}, 'using showcase/s-source you can remove default tabs');
    assert.dom('.tab-nav').hasText('Route.js Controller.js', 'will show custom tab names and orders correctly without defaults');
  });
});
