
function parseContext(key) {
  var match = /^(flow|global)(\[(\w+)\])?\.(.+)/.exec(key);
  if (match) {
    var parts = {};
    parts.type = match[1];
    parts.store = (match[3] === '') ? "default" : match[3];
    parts.field = match[4];
    return parts;
  }
  return undefined;
}

module.exports = parseContext
