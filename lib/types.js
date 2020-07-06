const mozillaPath = 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/';
const mozillaTypes = [
  'Array',
  'Boolean',
  'Date',
  'Function',
  'Iterator',
  'Number',
  'Object',
  'RegExp',
  'String'
];

const emberPath = 'http://emberjs.com/api/classes/';
const emberTypes = [
  'Transition',
  'RSVP',
  'RSVP.EventTarget',
  'RSVP.Promise',
  'Ember.ApplicationInstance',
  'Ember.ApplicationInstance.BootOptions',
  'Ember.Application',
  'Ember.DefaultResolver',
  'Ember',
  'Ember.Debug',
  'Ember.ContainerDebugAdapter',
  'Ember.DataAdapter',
  'Ember.Templates.helpers',
  'Ember.HTMLBars',
  'Ember.String',
  'Ember.Helper',
  'Ember.Binding',
  'Ember.ComputedProperty',
  'Ember.computed',
  'Ember.Error',
  'Ember.FEATURES',
  'Backburner',
  'Ember.InjectedProperty',
  'Ember.Instrumentation',
  'Libraries',
  'Ember.Logger',
  'Ember.OrderedSet',
  'Ember.Map',
  'Ember.MapWithDefault',
  'Ember.Mixin',
  'Ember.LinkComponent',
  'Ember.ControllerMixin',
  'Ember.Location',
  'Ember.AutoLocation',
  'Ember.HashLocation',
  'Ember.HistoryLocation',
  'Ember.NoneLocation',
  'RoutingService',
  'Ember.Route',
  'Ember.Router',
  'Ember.Controller',
  'Ember.inject',
  'Function',
  'String',
  'Ember.ProxyMixin',
  'Ember.ActionHandler',
  'Ember.Array',
  'Ember.Comparable',
  'ContainerProxyMixin',
  'Ember.Copyable',
  'Ember.Enumerable',
  'Ember.Evented',
  'Ember.Freezable',
  'Ember.MutableArray',
  'Ember.MutableEnumerable',
  'Ember.Observable',
  'Ember.PromiseProxyMixin',
  'RegistryProxyMixin',
  'Ember.TargetActionSupport',
  'Ember.ArrayProxy',
  'Ember.CoreObject',
  'Ember.EachProxy',
  'Ember.Namespace',
  'Ember.NativeArray',
  'Ember.Object',
  'Ember.ObjectProxy',
  'Ember.Service',
  'Ember.Test.Adapter',
  'Ember.Test.QUnitAdapter',
  'Ember.Test',
  'Ember.Component',
  'Ember.AriaRoleSupport',
  'Ember.ClassNamesSupport',
  'Ember.InstrumentationSupport',
  'Ember.LegacyViewSupport',
  'Ember.TemplateRenderingSupport',
  'Ember.TextSupport',
  'Ember.ViewTargetActionSupport',
  'Ember.VisibilitySupport',
  'Ember.EventDispatcher',
  'Ember.Checkbox',
  'Ember.CoreView',
  'Ember.TextArea',
  'Ember.TextField',
  'Ember.Vie'
];

const emberDataPath = 'http://emberjs.com/api/data/classes/';
const emberDataTypes = [
  'DS.BuildURLMixin',
  'Ember.Date',
  'DS.Model',
  'DS.Errors',
  'DS.RootState',
  'DS.AdapterPopulatedRecordArray',
  'DS.FilteredRecordArray',
  'DS.RecordArray',
  'DS',
  'ContainerInstanceCache',
  'DS.ManyArray',
  'DS.PromiseArray',
  'DS.PromiseObject',
  'DS.PromiseManyArray',
  'DS.RecordArrayManager',
  'DS.SnapshotRecordArray',
  'DS.Snapshot',
  'DS.Store',
  'DS.BooleanTransform',
  'DS.DateTransform',
  'DS.NumberTransform',
  'DS.StringTransform',
  'DS.AdapterError',
  'DS.InvalidError',
  'DS.TimeoutError',
  'DS.AbortError',
  'DS.UnauthorizedError',
  'DS.ForbiddenError',
  'DS.NotFoundError',
  'DS.ConflictError',
  'DS.ServerError',
  'DS.JSONAPIAdapter',
  'DS.RESTAdapter',
  'DS.EmbeddedRecordsMixin',
  'DS.JSONAPISerializer',
  'DS.JSONSerializer',
  'DS.RESTSerializer',
  'DS.Adapter',
  'DS.Serializer',
  'DS.Transform',
  'DS.String',
  'DS.Ember.HTMLBars.helpers',
  'Ember.HTMLBars.helpers',
  'Ember.Inflecto'
];

const emberTemplateHelperPath = 'http://emberjs.com/api/classes/Ember.Templates.helpers.html';
const emberTemplateHelperTypes = [
  'action',
  'component',
  'concat',
  'debugger',
  'each',
  'each-in',
  'get',
  'hash',
  'if',
  'input',
  'link-to',
  'loc',
  'log',
  'mount',
  'mut',
  'outlet',
  'partial',
  'query-params',
  'render',
  'textarea',
  'unbound',
  'unless',
  'with'
];

// uses a regex to strip out type values so they can be matched to native and ember type maps
const typeRegex = new RegExp('{(.*?)}');

module.exports = function(typeString) {
  let types = [];

  let regexMatch = typeString.match(typeRegex);
  if (regexMatch && regexMatch[1]) {
    let matches = regexMatch[1].split('|');
    for (let match of matches) {
      let type = {
        label: match
      };
      if (emberTypes.includes(match)) type.link = emberPath + match + '.html';
      if (emberTemplateHelperTypes.includes(match)) type.link = emberTemplateHelperPath + '#method_' + match;
      if (emberDataTypes.includes(match)) type.link = emberDataPath + match + '.html';
      if (mozillaTypes.includes(match)) type.link = mozillaPath + match;
      types.push(type);
    }
  }

  return types.length > 0 ? types : null;
};
