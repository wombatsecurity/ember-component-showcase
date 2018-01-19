/*eslint-env node*/

module.exports = {
  description: 'Installation blueprint for ember-component-showcase',
	normalizeEntityName: function() {}, // no-op since we're just adding dependencies

	afterInstall: function() {
    return this.addBowerPackagesToProject([
      { name: 'remarkable', target: '^1.7.1'},
      { name: 'js-beautify', target: '^1.6.14'},
      { name: 'highlightjs', target: '^9.2.0'},
    ]).then(function() {
      return this.addPackagesToProject([
        {name: "prismjs", target: "^1.6.0",}
      ]);
    }.bind(this));
	}
};
