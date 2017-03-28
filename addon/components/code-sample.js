/* global html_beautify js_beautify */
import Ember from 'ember';
import CodeBlock from 'ember-prism/components/code-block';
import layout from '../templates/components/code-sample';

export default CodeBlock.extend({
  layout: layout,
  language: 'Markup',
	attributeBindings: ['language:data-language'],
	src: '',

	// clean up Ember droppings
	cleanEmberHTML(html) {
		let $element = Ember.$(html);

		// examples: id="ember123" class="ember-view" data-ember-action="123" data-ember-action-345="345"
		$element.find('[id]').filter(function() {
			return this.id.match(new RegExp('ember[0-9]+', 'g'));
		}).removeAttr('id');
		$element.find('[data-ember-action|=""]').filter(function() {
			let matches = new RegExp('data-ember-action-[0-9]+', 'g').exec(this.outerHTML);
			this.removeAttribute('data-ember-action');
			matches.forEach((match) => {
				this.removeAttribute(match);
			});
		});
		$element.find('.ember-view').removeClass('ember-view');

		return $element.html();
	},

	didInsertElement() {
		let wrapper = Ember.$(this.getElement());
		let html = wrapper.html().trim();
		let language = this.get('language').toLowerCase();

		if (language === 'markup' || language === 'handlebars') {
			html = wrapper.wrap('<div/>').parent().html();

			// temporarily remove escaping for tags
			html = html.replace(/&lt;/g, '<');
			html = html.replace(/&gt;/g, '>');

			// Remove ALL html comments
			html = html.replace(/<!--.*?-->/g, '');

      // Remove ALL newlines
      html = html.replace(/\n/g, '');

			// Remove HTML Ember Droppings
			html = this.cleanEmberHTML(html);

			// reindent and align html whitespace, uses js-beautify options: https://github.com/beautify-web/js-beautify#css--html
			html = html_beautify(html, {
				unformatted: ['i'],
        indent_handlebars: true,
        indent_size: 2
			});

			// return tag escaping for proper rendering in HTML
			html = html.replace(/</g, '&lt;');
			html = html.replace(/>/g, '&gt;');

			// set our code element's markup to our newly reformatted version
			wrapper.html(html).unwrap();
		}

		if (language === 'javascript') {
      // Remove ALL newlines
      html = html.replace(/\n/g, '');
      // reindent and align js whitespace
      html = js_beautify(html, {
        indent_size: 2
      });
    }

		wrapper.html(html);

		// apply prism styling
		this._super(...arguments);
	}
});
