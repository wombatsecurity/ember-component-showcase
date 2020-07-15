import Component from '@glimmer/component';
import { htmlSafe } from "@ember/string";
import { Remarkable } from 'remarkable';
import _hbs from 'htmlbars-inline-precompile';

export default class MDText extends Component {
  get text() { return this.args.text || ''; }
  typographer = false;
  linkify = false;
  linkTarget = '';
  html = false;
  extensions = true;

  // @computed('text', 'html', 'typographer', 'linkify', 'linkTarget')
  get parsedMarkdownUnsafe() {
    const md = new Remarkable({
      typographer: this.typographer,
      linkTarget: this.linkTarget,
      html: this.html
    });

    if (this.extensions) {
      md.core.ruler.enable([
        'abbr'
      ]);
      md.block.ruler.enable([
        'footnote',
        'deflist'
      ]);
      md.inline.ruler.enable([
        'footnote_inline',
        'ins',
        'mark',
        'sub',
        'sup'
      ]);
    }

    return md.render(this.text);
  }

  get parsedMarkdown() {
    const parsedMarkdownUnsafe = this.parsedMarkdownUnsafe;
    return new htmlSafe(parsedMarkdownUnsafe);
  }

  get precompiledTemplate() {
    const parsedMarkdownUnsafe = this.parsedMarkdownUnsafe;
    return _hbs.compile(parsedMarkdownUnsafe, false);
  }
}
