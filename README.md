Webpack Alternate Require Loader
================================

[![Build Status][trav_img]][trav_site]

This loader allows webpack to approximate arcane Node.js `require` semantics for
advanced use cases when a normal `require` doesn't suffice

## Installation

The loader is available via [npm](https://www.npmjs.com/package/webpack-alternate-require-loader):

```
$ npm install --save webpack-alternate-require-loader
```

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
module.export = require;
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

## Usage

This plugin allows the import of a _different_ `require` compatible loader for
non-standard require scenarios, such as using the [module pattern][]

*TODO: REST OF SECTION*

## Examples

Additional examples are provided in:
[`demo/webpack.config.js`](demo/webpack.config.js). If you have a clone of this
repository with `devDependencies`, you can run:

```sh
$ npm run build-demo-wp
```

and see the results in the [`demo`](demo) directory.

### Basic

*TODO: REST OF SECTION*

## Contributions

Contributions welcome! Make sure to pass `$ npm run check`.

[trav]: https://travis-ci.org/
[trav_img]: https://api.travis-ci.org/FormidableLabs/webpack-alternate-require-loader.svg
[trav_site]: https://travis-ci.org/FormidableLabs/webpack-alternate-require-loader
[module pattern]: https://github.com/FormidableLabs/builder#node-require-resolution-and-module-pattern
