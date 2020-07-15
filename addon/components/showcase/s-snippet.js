import Component from '@glimmer/component';

export default class ShowcaseSnippet extends Component {
	get sample() { return this.args.sample || null; }
	get language() { return this.args.language || 'HTML'; }
	get title() { return this.args.title || 'markup.html'; }
	get icon() { return this.args.icon || 'code'; }
}
