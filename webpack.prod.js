const path = require("path");
const { merge } = require("webpack-merge");
const commond = require("./webpack.config");
module.exports = merge(commond, {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },
});
