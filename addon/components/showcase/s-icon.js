import Component from '@ember/component';
import { computed } from '@ember/object';

const ShowcaseIcon = Component.extend({
  tagName: 'span',
  classNameBindings: ['iconClass', 'iconClassModifier'],
  attributeBindings: ['ariaHidden:aria-hidden'],
  ariaHidden: 'true',

  icon: null,
  iconClass: 'showcase-icon',
  iconClassModifier: computed('iconClass', 'icon', function() {
    return `${this.get('iconClass')}-${this.get('icon')}`;
  })
});

ShowcaseIcon.reopenClass({
  positionalParams: ['icon'],
});

export default ShowcaseIcon;
