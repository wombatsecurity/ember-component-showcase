/*eslint-env node*/

var installPrismBowerPackage = require('ember-prism/blueprints/ember-prism').installPrismBowerPackage;

module.exports = {
	normalizeEntityName: function() {}, // no-op since we're just adding dependencies

	afterInstall: function() {
    return installPrismBowerPackage(this).then(() => {
      return this.addBowerPackagesToProject([
        { name: 'remarkable',  target: '^1.7.1'},
        { name: 'js-beautify',          target: '^1.6.8'}
      ])
    });
	}
};
