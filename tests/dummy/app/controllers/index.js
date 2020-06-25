import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

const countries = [
  { name: 'United States',  flagUrl: '/flags/us.svg' },
  { name: 'Spain',          flagUrl: '/flags/es.svg' },
  { name: 'Portugal',       flagUrl: '/flags/pt.svg' },
  { name: 'Russia',         flagUrl: '/flags/ru.svg' },
  { name: 'Latvia',         flagUrl: '/flags/lv.svg' },
  { name: 'Brazil',         flagUrl: '/flags/br.svg' },
  { name: 'United Kingdom', flagUrl: '/flags/gb.svg' },
];

export default class Index extends Controller {
  countries = countries;
  @tracked country = null;

  foo(country) {
    this.country = country;
  }
}
