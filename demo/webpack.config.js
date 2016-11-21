"use strict";

/**
 * Webpack configuration
 */
var path = require("path");
var AlternateRequireLoader = require.resolve("../lib/index");

module.exports = {
  cache: true,
  context: __dirname,
  entry: "./main.js",
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].js",
    pathinfo: true
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: __dirname,
        loader: AlternateRequireLoader,
        query: JSON.stringify({
          "./nested/require": require.resolve("./nested/require")
        })
      }
    ]
  }
};
