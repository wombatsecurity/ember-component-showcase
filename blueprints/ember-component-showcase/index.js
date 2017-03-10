/*eslint-env node*/
module.exports = {
	normalizeEntityName: function() {}, // no-op since we're just adding dependencies

	afterInstall: function() {
		return this.addBowerPackagesToProject([
			{ name: 'prism',   target: '^1.6.0'},
			{ name: 'highlightjs',     target: '^9.9.0'},
			{ name: 'remarkable',  target: '^1.7.1'},
			{ name: 'js-beautify',          target: '^1.6.8'}
		]);
	}
};
