"use strict";

var path = require("path");
var loaderUtils = require("loader-utils");

var MODULE_PATTERN_RE = /require\(["'](.*?)["']\)\(["'](.*?)["']\)/g;

/**
 * Alternate require loader.
 *
 * This plugin allows a rewriting of a regular expression match with one match
 * group, then using a bespoke `require` command that has a `resolve` function
 * to resolve the match group argument.
 *
 * @param {String}  content  Source code chunk
 * @returns {void}
 *
 * @api public
 */
module.exports = function (content) {
  if (this.cacheable) { this.cacheable(); }

  var query = loaderUtils.parseQuery(this.query);

  // Inflate options to cache.
  if (!this._opts) {
    this._opts = Object.keys(query).reduce(function (memo, key) {
      // Lazy require the "require-like" function.
      memo[key] = require(query[key]); // eslint-disable-line global-require
      return memo;
    }, {});
  }

  // Now iterate through resolvers and rewrite.
  var opts = this._opts;
  content = content.replace(MODULE_PATTERN_RE, function (match, resolverKey, modPath) {
    // Must have a match.
    var resolver = opts[resolverKey];
    if (!resolver) {
      throw new Error("Unable to find resolver key: " + resolverKey);
    }

    var resolved = resolver
      // Resolve path.
      .resolve(modPath)
      // Normalize path separators back to forward slashes. (For Windows).
      .split(path.sep).join("/");

    // Mutate.
    return "require(\"" + resolved + "\")";
  });

  return content;
};
