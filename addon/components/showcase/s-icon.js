import Component from '@ember/component';
import { computed } from '@ember/object';

const ShowcaseIcon = Component.extend({
  tagName: 'i',
  icon: null,
  ariaHidden: "true",
  iconClass: computed('icon', function() {
    return `fa fa-${this.get('icon')}`;
  }),
  classNameBindings: ['iconClass'],
  attributeBindings: ['ariaHidden:aria-hidden']
});

ShowcaseIcon.reopenClass({
  positionalParams: ['icon'],
});

export default ShowcaseIcon;
