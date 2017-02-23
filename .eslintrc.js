module.exports = {
    "env": {
        "browser": true,
        "es6": true,
	    "jquery": true,
	    "embertest": true
    },
    "extends": "eslint:recommended",
    "parser" : "babel-eslint",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-unused-vars": [
          "error",
          {
            "vars": "all",
            "varsIgnorePattern": "^[A-Z]",
            "args": "none"
          }
        ],
        "space-before-function-paren": [
          "error",
          {
            "anonymous": "never",
            "named": "never"
          }
        ],
	    "no-console": [
		    "error",
		    {
			    "allow": ["warn", "error"]
		    }
	    ]
    }
};
