# ember-component-showcase

Need to demonstrate how to configure your ember component?  Want some easy to setup front-end documentation for its usage?  Ember component showcase will let you easily exhibit your amazing ember addons with automatically generated HBS and HTML snippets, and support for component API documentation via JSDocs.

## Installation

* Install the ember addon: `ember install ember-component-showcase`
* Add `ember-cli-htmlbars-inline-precompile` and `ember-cli-htmlbars` to the `dependencies section` of your application.  Adding them to `devDependencies` will not work.

## Configuration

Provide a custom showcaseConfig to your environment.js or ember-cli-build.js:
``` json
showcaseConfig: {
    enabled: true,
    'yuidocjs': {
      'enabled': true,
      'writeJSON': false,
      'paths': ['addon'],
      'githubRepo': 'https://github.com/user/foo-bar',
      'githubTag': 'v1.0.0',
      'linkNatives': true,
      'quiet': true,
      'parseOnly': false,
      'lint': false
    }
  }
```

<<<<<<< HEAD
## Styling
The component and sub-components elements are prefixed with `.showcase` for ease of styling.
If you wish to use an icon font set such as Font-Awesome, the easiest option is to simply extend the styles with the appropriate icon font selectors.
```
.showcase-icon {
  @extend .fa;
}
=======
* Ember.js v3.4 or above
* Ember CLI v2.13 or above
* Node.js v8 or above
>>>>>>> 905252c... v3.10.1...v3.12.0

.showcase-icon-code {
  @extend .fa-code;
}

.showcase-icon-link {
  @extend .fa-link;
}
```

## Simple Usage Examples
If you just want to see your HBS source code, simply wrap a component with the component-showcase block.
```
{{#component-showcase "My Component" as |s|}}
    {{my-component "hello world" api=true onchange=(action "foobar") }}
{{/component-showcase}}
```

Usually you will want a little more documentation along with your samples.  Configure these with `docs` `example` and `source` sub-components.
```
{{#component-showcase "My Component" as |s|}}
  {{s.docs "A simple explanation of what my component does."}}
  {{#s.example}}
    {{my-component "hello world" api=true onchange=(action "foobar") }}
  {{/s.example}}
  {{s.source}}
{{/component-showcase}}
```

## Usage with nested addons
The `setupPreprocessorRegistry` hook will only act on its [direct parent's content](https://github.com/ember-cli/ember-cli/issues/6670).  
So to traverse for example a 'dummy' app's templates, you must manually import it into `ShowcaseBroccoli` by adding your own hook to `index.js`:
```
  setupPreprocessorRegistry: function(type, registry) {
    ShowcaseBroccoli.import(registry);
  },
```



## How does it work?

* HBS = Ember-CLI hooks + Regex + Glimmer AST traversal
* HTML = Ember Component hooks + jQuery selectors

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
