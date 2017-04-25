import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('component-showcase', 'Integration | Component | component showcase', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`
{{#component-showcase "123" as |s|}}
  {{s.docs}}
  {{#s.example}}
  {{/s.example}}
  {{s.source hbs=''}}
{{/component-showcase}}`);

  assert.equal(this.$('.card-title').text().trim(), '', 'renders no title when empty');
  assert.equal(this.$('.description').text().trim(), '', 'renders no description when empty');
  assert.equal(this.$('.tab-nav').children().length, 1, 'shows 1 tab');
  assert.equal(this.$('.tab-nav').children().text().trim(), 'example.hbs', 'only tab visible is Handlebars');

  this.render(hbs`
{{#component-showcase "123" "Title" as |s|}}
  {{s.docs "description"}}
  {{#s.example}}
    {{fa-icon "code"}}
  {{/s.example}}
  {{s.source hbs='{{fa-icon "code"}}'}}
{{/component-showcase}}`);

  assert.equal(this.$('.card-title').text().trim(), 'Title', 'renders custom title');
  assert.equal(this.$('.description').text().trim(), 'description', 'renders custom description');

  this.render(hbs`
{{#component-showcase "123" as |s|}}
  {{s.docs "description"}}
  {{#s.example}}
    {{fa-icon "code"}}
  {{/s.example}}
  {{s.source showHTML=true}}
{{/component-showcase}}`);

  assert.equal(this.$('.tab-nav').children().length, 2, 'showHTML shows two tabs');
  assert.equal(this.$('.tab-nav').children().text().trim(), 'example.hbs markup.html', 'shows both Handlebars and HTML');

  this.render(hbs`
{{#component-showcase "123" as |s|}}
  {{s.docs "description"}}
  {{#s.example}}
    {{fa-icon "code"}}
  {{/s.example}}
  {{s.source hideHBS=true showHTML=true}}
{{/component-showcase}}`);

  assert.equal(this.$('.tab-nav').children().length, 1, 'hideHBS hides hbs, and showHTML leaves 1 tab');
  assert.equal(this.$('.tab-nav').children().text().trim(), 'markup.html', 'only tab visible is Markup');

  this.render(hbs`
{{#component-showcase "123" as |s|}}
  {{#s.example}}
    {{fa-icon "code"}}
  {{/s.example}}
{{/component-showcase}}`);

  assert.notOk(this.$('.tab-nav').length, 'with no source, there are no tabs');
  assert.notOk(this.$('.description').length, 'with no docs, there are no description');

  this.render(hbs`
{{#component-showcase as |s|}}
  {{#s.example}}
    {{fa-icon "code"}}
  {{/s.example}}
  {{s.source (array (hash title="route.js" language="JavaScript" src="var foo = 'foo';")) showHTML=true }}
{{/component-showcase}}`);

  assert.equal(this.$('.tab-nav').children().length, 3, 'using showcase/s-source you can add custom tabs');
  assert.equal(this.$('.tab-nav').children().text().trim(), 'example.hbs markup.html route.js', 'will show custom tab names and orders correctly');

  this.render(hbs`
{{#component-showcase as |s|}}
  {{#s.example}}
    {{fa-icon "code"}}
  {{/s.example}}
  {{s.source (array
        (hash title="Route.js" language="JavaScript" src="var foo = 'foo';")
        (hash title="Controller.js" language="JavaScript" src="var bar = 'bar';")
  ) hideHBS=true }}
{{/component-showcase}}`);

  assert.equal(this.$('.tab-nav').children().length, 2, 'using showcase/s-source you can remove default tabs');
  assert.equal(this.$('.tab-nav').children().text().trim(), 'Route.js Controller.js', 'will show custom tab names and orders correctly without defaults');
});
