/* global html_beautify js_beautify Prism */
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import CodeBlock from 'ember-prism/components/code-base';
import { htmlSafe } from '@ember/template';
import classic from 'ember-classic-decorator';

@classic
export default class CodeSample extends CodeBlock {
  classNames = ['code-block', 'code-toolbar', 'showcase-code'];

  @alias('code') src;

  @computed('language')
  get languageLabel() {
    switch(this.language) {
      case 'html':
        return 'HTML';
      case 'markup':
        return 'HTML';
      case 'handlebars':
        return 'HBS';
      case 'javascript':
        return 'JavaScript';
      case 'json':
        return 'JSON';
      default:
        return this.language;
    }
  }

  @computed('code', 'hasBlock', 'language') // eslint-disable-line
  get prismCode() {
    const html = this.element.querySelector('section')?.innerHTML;
    const code = this.hasBlock ? html : this.code;
    if (!code) throw new Error('Missing code for showcase!');

    switch(this.language) {
      case 'html':
        return this.formatHTML(code);
      case 'markup':
        return this.formatHTML(code);
      case 'handlebars':
        return this.formatHtmlBars(code);
      case 'javascript':
        return this.formatJavaScript(code);
      case 'json':
        return this.formatJavaScript(code);
      default:
        return code.trim();
    }
  }

  @computed('prismCode', 'language')
  get safePrismCode() {
    const language = this.language;
    const grammar = Prism.languages[language];
    if (!grammar) throw new Error(`Missing Prism grammar for ${language}. Please try updating your environment.js and try again.`);

    let code = this.prismCode;
    const prismCode = Prism.highlight(code, grammar, language);
    return htmlSafe(prismCode);
  }

	cleanEmberHTML(html) {
		let el = document.createElement('div');
		el.innerHTML = html;

		// examples: id="ember123" class="ember-view" data-ember-action="123" data-ember-action-345="345"
		Array.from(el.querySelectorAll('[id]')).filter(function(el) {
			return el.id.match(new RegExp('ember[0-9]+', 'g'));
		}).forEach(function(el) {
			el.removeAttribute('id');
		});

		Array.from(el.querySelectorAll('[data-ember-action|=""]')).filter(function(el) {
			let matches = new RegExp('data-ember-action-[0-9]+', 'g').exec(el.outerHTML);
			el.removeAttribute('data-ember-action');
			matches.forEach(match => {
				el.removeAttribute(match);
			});
		});

		el.querySelectorAll('.ember-view').forEach(el => {
			el.classList.remove('ember-view');
		});

		return el.innerHTML;
	}

  formatHtmlBars(hbs) {
    // currently there is no good way to format inline handlebars content: https://github.com/beautify-web/js-beautify/issues/1173
    return html_beautify(hbs, {
      unformatted: ['i'],
      indent_handlebars: true,
      indent_size: 2,
      wrap_line_length: 120
    });
  }

  formatJavaScript(js) {
    return js_beautify(js, {
      indent_size: 2,
      wrap_line_length: 120
    });
  }

  formatHTML(html) {
    html = html.replace(/<!--.*?-->/g, ''); // remove ALL inline html comments

    // Remove HTML Ember Droppings
    html = this.cleanEmberHTML(html);

    // reindent and align html whitespace, uses js-beautify options: https://github.com/beautify-web/js-beautify#css--html
    html = html_beautify(html, {
      unformatted: ['i'],
      indent_size: 2,
      wrap_line_length: 120
    });

    return html;
  }
}
