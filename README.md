# ember-component-showcase

Need to demonstrate how to configure your ember component?  Want some easy to setup front-end documentation for its usage?  Ember component showcase will let you easily exhibit your amazing ember addons with automatically generated HBS and HTML snippets, and support for component API documentation via JSDocs.

## Installation

* Install the ember addon: `ember install ember-component-showcase`
* Add `ember-cli-htmlbars-inline-precompile` and `ember-cli-htmlbars` to the `dependencies section` of your application.  Adding them to `devDependencies` will not work.

## Demo Site

* Coming soon...

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

## How does it work?

* HBS = Ember-CLI hooks + Regex + Glimmer AST traversal
* HTML = Ember Component hooks + jQuery selectors
