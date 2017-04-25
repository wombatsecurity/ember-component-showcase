/* global html_beautify js_beautify */
import Ember from 'ember';
import CodeBlock from 'ember-prism/components/code-block';
import layout from '../templates/components/code-sample';

export default CodeBlock.extend({
  layout: layout,
  language: 'Markup',
	attributeBindings: ['language:data-language'],
	src: '',

  getMatches(string, regex, index) {
    index || (index = 0); // default to the first capturing group
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
      matches.push(match[index]);
    }
    return matches;
  },

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

		if (language === 'markup') {
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
        indent_size: 2,
        wrap_line_length: 100
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
        indent_size: 2,
        wrap_line_length: 100
      });
    }

    if (language === 'handlebars') {

      // temporarily remove escaping for tags
      html = html.replace(/&lt;/g, '<');
      html = html.replace(/&gt;/g, '>');

      // reindent and align html whitespace, uses js-beautify options: https://github.com/beautify-web/js-beautify#css--html
      html = html_beautify(html, {
        unformatted: ['i'],
        indent_handlebars: true,
        indent_size: 2,
        wrap_line_length: 100
      });

      // currently there is no good way to format inline handlebars content: https://github.com/beautify-web/js-beautify/issues/1173
      // let handlebarsMatches = this.getMatches(html, new RegExp('{{([^#\/{]+)}}', 'g'));

      html = html.replace(/</g, '&lt;');
      html = html.replace(/>/g, '&gt;');
    }

		wrapper.html(html);

		// apply prism styling
		this._super(...arguments);
	}
});
