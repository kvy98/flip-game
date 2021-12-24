const path = require("path");
const { merge } = require("webpack-merge");
const commond = require("./webpack.config");
module.exports = merge(commond, {
  mode: "development",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
});
