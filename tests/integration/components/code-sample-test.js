import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('lib-code-block', 'Integration | Component | code sample', {
	integration: true
});

test('it renders Markup', function(assert) {
	this.render(hbs`{{code-sample}}`);
  assert.equal(this.$('.toolbar .toolbar-item').text(), 'Markup', 'displays default language label');
	assert.equal(this.$('code').text().trim(), '', 'renders empty component correctly');

	var snippet = "<h1>Earth</h1><h2>Wind</h2><h3>Fire</h3>";
	this.set('snippet', snippet);
  this.render(hbs`{{code-sample src=snippet}}`);
  assert.equal(this.$('code').text().trim(), html_beautify(snippet), 'renders manual source content correctly');
  assert.equal(this.$('code').children().length, 6, 'generate correct number of child nodes'); // 1 child per <tag> OR </tag>

	// Template block usage:"
	this.render(hbs`
    {{#code-sample}}
      {{snippet}}
    {{/code-sample}}
  `);
	assert.ok(this.$('code').hasClass('language-markup'), 'sets default language');
	assert.equal(this.$('.toolbar .toolbar-item').text(), 'Markup', 'displays default language label');
	assert.equal(this.$('code').text().trim(), html_beautify(snippet), 'correctly renders block content');
	assert.equal(this.$('code').children().length, 6, 'generate correct number of child nodes'); // 1 child per <tag> OR </tag>
});

test('it renders JavaScript', function(assert) {

  var snippet = `
  var earth = 'earth';
  let wind = ['w', 'i', 'n', 'd'];
  const fire = {'fire': true};
  console.log(earth, wind, fire);
  `;
  this.set('snippet', snippet);

  this.render(hbs`
    {{#code-sample language="JavaScript"}}
      {{snippet}}
    {{/code-sample}}
  `);

  assert.equal(this.$('.toolbar .toolbar-item').text(), 'JavaScript', 'displays JavaScript language label');
  assert.equal(this.$('code').text().trim(), js_beautify(snippet), 'correctly renders block content');
  assert.equal(this.$('code').children().length, 31, 'generate correct number of child nodes'); // 1 child per <tag> OR </tag>
});
