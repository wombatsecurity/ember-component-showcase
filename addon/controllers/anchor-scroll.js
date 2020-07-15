import Controller from '@ember/controller';
import { schedule } from '@ember/runloop';
import { action } from '@ember/object';

export default class AnchorScroll extends Controller {
  queryParams = ['anchor']

  init() {
    super.init();
    schedule('afterRender', this.scrollToAnchor);
  }

  @action
  scrollToAnchor() {
    if (this.anchor) {
      let el = document.querySelector(`#${this.anchor}`);
      if (el) {
        let fromTop = 90;
        document.querySelector('html, body').scrollTo({
          top: el.offsetTop - fromTop,
          left: 0,
          behavior: 'smooth'
        });
      }
    }
  }
}
