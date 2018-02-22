import Component from '@ember/component';
import layout from '../../templates/components/showcase/s-icon';

const ShowcaseIcon = Component.extend({
  layout:layout
});

ShowcaseIcon.reopenClass({
  positionalParams: ['icon'],
  icon: null
});

export default ShowcaseIcon;
