"use strict";

/**
 * Webpack configuration
 */
var os = require("os");
var path = require("path");
var alternateRequireLoader = require.resolve("../lib/index");
var failPlugin = require("webpack-fail-plugin");

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
        loader: alternateRequireLoader,
        query: JSON.stringify({
          "./nested/require": require
            .resolve("./nested/require")
            .replace(os.EOL, "/") // Normalize for resolve paths on Windows.
        })
      }
    ]
  },
  plugins: [
    failPlugin
  ]
};
