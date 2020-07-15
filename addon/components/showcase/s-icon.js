import Component from '@glimmer/component';

export default class ShowcaseIcon extends Component {
  get iconClass() { return this.args.iconClass || 'showcase-icon'; }
  get iconClassModifier() {
    return `${this.iconClass}-${this.args.icon}`;
  }
}
