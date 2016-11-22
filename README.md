Webpack Alternate Require Loader
================================

[![Build Status][trav_img]][trav_site]

This loader allows webpack to approximate arcane Node.js `require` semantics for
advanced use cases when a normal `require` doesn't suffice

## Background

*The Problem*

Let's say you have a project like:

```
src/index.js
src/outside-of-resolution-path/node_modules/foo
```

if you
try:

```js
// src/index.js
// BAD: Fails
var foo = require("foo");
```

This will fail, because `src/outside-of-resolution-path/node_modules` is not in
the resolution path, which is:

```
src/node_modules
node_modules
```

*The Module Pattern*

One solution to this problem is called the "[module pattern][]", which adds
an extra file to start Node.js module resolution from a _different_ directory.
Basically, say we add a simple file in a directory _outside_ of the current
Node.js `require` resolution path:

```js
// src/outside-of-resolution-path/require.js
// Re-export the `require` to start resolution from `src/outside-of-resolution-path/node_modules`
module.exports = require;
```

And switched our importing code to:

```js
// src/index.js
// GOOD: Module pattern (re-exported `require`) works!
var foo = require("./outside-of-resolution-path/require")("foo");
```

this _works_ because the Node.js resolution path starts from the re-exported
`require`:

```
src/outside-of-resolution-path/node_modules
src/node_modules
node_modules
```

*Webpack*

The above pattern works just fine for Node.js. Unfortunately, this non-standard
`require` usage fails in Webpack.

_Enter this loader_, which allows a bridge for webpack builds to also use the
module pattern / other non-standard requires.

## Installation

The loader is available via [npm](https://www.npmjs.com/package/webpack-alternate-require-loader):

```sh
$ npm install --save webpack-alternate-require-loader
```

## Usage

The plugin takes a configuration object of a re-exported module path to search
for in code and then a resolved path to that same code on disk like:

```js
{
  "CODE_TO_MATCH": require.resolve("REEXPORTED_CODE_PATH")
  "./outside-of-resolution-path/require": require.resolve("./outside-of-resolution-path/require")
}
```

It will then effectively transform something like:

```js
var foo = require("CODE_TO_MATCH")("foo");
var foo = require("./outside-of-resolution-path/require")("foo");
```

to:

```js
var foo = require("/RESOLVED/PATH/TO/foo");
```

This effectively simulates what Node.js would do at execution time to the code.

## Examples

A basic configuration:

```js
module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "webpack-alternate-require-loader",
        query: JSON.stringify({
          "./outside-of-resolution-path/require": require.resolve("./outside-of-resolution-path/require")
        })
      }
    ]
  }
};
```

Additional examples are provided in:
[`demo/webpack.config.js`](demo/webpack.config.js). If you have a clone of this
repository with `devDependencies`, you can run:

```sh
$ npm run build-demo-wp
```

and see the results in the [`demo`](demo) directory.

## Notes

**Do I have to use _exactly_ the module / require pattern above?**

Yes. Although Node.js can figure out:

```js
var altRequire = require("./outside-of-resolution-path/require");
var foo = altRequire("foo");
```

This plugin currently cannot because it is naive and uses regexes. You _must_
follow the form:

```js
var foo = require("./outside-of-resolution-path/require")("foo");
```

Fortunately, if you are using
[`babel-plugin-replace-require`](https://github.com/FormidableLabs/babel-plugin-replace-require),
you can easily produce `require` expressions that work with this plugin.

**Why can't I just prepend the non-standard `node_modules` path in code?**

See the [module pattern][] discussion page. Basically, with top-level
dependencies you _can_. But with nested dependencies and modern `npm` / `yarn`
the real depended on code can be located anywhere in the tree. And you need
the `node_modules` search path to be different than normal.

**You're using regexes? Yuck!**

Indeed. But that's basically how webpack / some loaders roll. We stick to an
easy pattern and avoid the cost of a full babel install + parsing. But, we may
be open to _real_ code parsing in the future.

## Contributions

Contributions welcome! Make sure to pass `$ npm run check`.

[trav]: https://travis-ci.org/
[trav_img]: https://api.travis-ci.org/FormidableLabs/webpack-alternate-require-loader.svg
[trav_site]: https://travis-ci.org/FormidableLabs/webpack-alternate-require-loader
[module pattern]: https://github.com/FormidableLabs/builder#node-require-resolution-and-module-pattern
