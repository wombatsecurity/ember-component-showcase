/* global html_beautify js_beautify */
import CodeBlock from 'ember-prism/components/code-block';
import layout from '../templates/components/code-sample';

export default CodeBlock.extend({
  layout: layout,
  language: 'Markup',
	attributeBindings: ['language:data-language'],
	src: '',

	wrap(elms) {
		if (!elms.length) elms = [elms];

		for (let i = elms.length - 1; i >= 0; i--) {
				const child = (i > 0) ? this.cloneNode(true) : this;
				const el    = elms[i];
				const parent  = el.parentNode;
				const sibling = el.nextSibling;

				child.appendChild(el);

				if (sibling) {
						parent.insertBefore(child, sibling);
				} else {
						parent.appendChild(child);
				}
		}
	},
	// clean up Ember droppings
	cleanEmberHTML(html) {
		let $element = document.createElement('div')
		$element.innerHTML = html;
		$element = $element.querySelector('code');
		console.log($element)

		// examples: id="ember123" class="ember-view" data-ember-action="123" data-ember-action-345="345"
		Array.from($element.querySelectorAll('[id]')).filter(function(el) {
			return el.id.match(new RegExp('ember[0-9]+', 'g'));
		}).forEach(function(el) {
			el.removeAttribute('id');
		});

		Array.from($element.querySelectorAll('[data-ember-action|=""]')).filter(function(el) {
			let matches = new RegExp('data-ember-action-[0-9]+', 'g').exec(el.outerHTML);
			el.removeAttribute('data-ember-action');
			matches.forEach(match => {
				el.removeAttribute(match);
			});
		});

		$element.querySelectorAll('.ember-view').forEach(el => {
			el.classList.remove('ember-view');
		});

		return $element.innerHTML;
	},

	didInsertElement() {
		let wrapper = this.getElement();
		let html = wrapper.innerHTML.trim();
		let language = this.get('language').toLowerCase();

		if (language === 'markup') {
			html = wrapper.parentNode.innerHTML;

			html = html.replace(/&lt;/g, '<'); 			// Temporarily remove 
			html = html.replace(/&gt;/g, '>'); 			// escaping for tags
			html = html.replace(/<!--.*?-->/g, ''); // and ALL html comments
			html = html.replace(/\n/g, '');					// and ALL newlines

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
			wrapper.innerHTML = html;
		}

		if (language === 'javascript' || language === 'json') {
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

		wrapper.innerHTML = html;

		// apply prism styling
		this._super(...arguments);
	}
});
