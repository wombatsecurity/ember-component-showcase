import { dasherize } from '@ember/string';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import Component from '@glimmer/component';

/** 
 * The Component-Showcase documentation component. 
 * @extends Component
 */
export default class ComponentShowcase extends Component {
  @service router;
  @tracked currentPath = this.router.currentRouteName;

  /**
   * The title for the current showcase sample.
   *
   * @property title
   * @type {String}
   * @default ''
   */
  get title() { return this.args.title || ''; }

  /**
   * A flag for displaying the entire documentation block's content, not just the example section.
   *
   * @property selfReflection
   * @type {Boolean}
   * @default false
   */
  get selfReflection() { return this.args.selfReflection || this.args.simple || false; }
  /**
   * The description for the current showcase sample.
   *
   * @property description
   * @type {String\Number}
   * @default ''
   */
  get description() { return this.args.description || ''; }
  get selfHBS() { return this.args.selfHBS || ''; }

  get sourceId() {
    return `${guidFor(this)}-source`;
  }

  get anchorId() {
    return dasherize(this.title);
  }

  // The following 3 props are added with broccoli magic
  // ====================================================
  get src() { return this.args.src || ''; }

  // where the hbs source code will end up from ast hook
  get hbs() { return this.args.hbs || ''; }

  // uuid created by template preprocessor hook
  get showcaseId() { return this.args.showcaseId || null; }
}
