'use strict';
// TODO - add support for genuine yuidocs
// https://github.com/cibernox/ember-cli-yuidoc/blob/master/lib/broccoli-yuidoc.js
var rsvp = require('rsvp');
var path = require('path');
var fs = require('fs');
var CachingWriter = require('broccoli-caching-writer');

BroccoliYuidoc.prototype = Object.create(CachingWriter.prototype);
BroccoliYuidoc.prototype.constructor = BroccoliYuidoc;
function BroccoliYuidoc(docs, options) {
  this.options = options || {};
  this.docs = docs || {};

  CachingWriter.call(this, options.paths, {
    annotation: this.options.annotation
  });
};

BroccoliYuidoc.prototype.build = function() {
  var Y = require('yuidocjs');
  var options = this.options;
  options.outdir = path.resolve(this.outputPath, "docs");

  if (!fs.existsSync(options.outdir)) {
    fs.mkdirSync(options.outdir);
  }

  if (this.options.parseOnly) {
    return;
  }

  var builder = new Y.DocBuilder(options, this.docs);
  return new rsvp.Promise(function(resolve) {
    builder.compile(function() { resolve(); });
  });
};

module.exports = BroccoliYuidoc;
