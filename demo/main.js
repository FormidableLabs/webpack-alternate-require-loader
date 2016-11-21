"use strict";

// Can run in node as:
//
// ```sh
// $ node demo/index.js
// ```

// This errors because resolution doesn't go _up_ to `nested`
//var foo = require("foo");

// This succeeds using an alternate require.
var foo = require("./nested/require")("foo");

console.log("Hello World! " + foo); // eslint-disable-line no-console
