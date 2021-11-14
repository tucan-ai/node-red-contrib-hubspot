function extractTokens(tokens,set) {
  set = set || new Set();
  tokens.forEach(function(token) {
    if (token[0] !== 'text') {
      set.add(token[1]);
      if (token.length > 4) {
        extractTokens(token[4],set);
      }
    }
  });
  return set;
}

module.exports = extractTokens
