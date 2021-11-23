const mustache = require("mustache")
const parseContext = require('./parse.context')
/**
 * Custom Mustache Context capable to collect message property and node
 * flow and global context
 */

function NodeContext(msg, nodeContext, parent, escapeStrings, cachedContextTokens) {
  this.msgContext = new mustache.Context(msg,parent);
  this.nodeContext = nodeContext;
  this.escapeStrings = escapeStrings;
  this.cachedContextTokens = cachedContextTokens;
}

NodeContext.prototype = new mustache.Context();

NodeContext.prototype.lookup = function (name) {
  // try message first:
  try {
    var value = this.msgContext.lookup(name);
    if (value !== undefined) {
      if (this.escapeStrings && typeof value === "string") {
        value = value.replace(/\\/g, "\\\\");
        value = value.replace(/\n/g, "\\n");
        value = value.replace(/\t/g, "\\t");
        value = value.replace(/\r/g, "\\r");
        value = value.replace(/\f/g, "\\f");
        value = value.replace(/[\b]/g, "\\b");
      }
      return value;
    }

    // try flow/global context:
    var context = parseContext(name);
    if (context) {
      var type = context.type;
      var store = context.store;
      var field = context.field;
      var target = this.nodeContext[type];
      if (target) {
        return this.cachedContextTokens[name];
      }
    }
    return '';
  } catch(err) {
    throw err;
  }
}

NodeContext.prototype.push = function push (view) {
  return new NodeContext(view, this.nodeContext, this.msgContext, undefined, this.cachedContextTokens);
};

module.exports = NodeContext
