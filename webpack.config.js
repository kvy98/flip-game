const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/game.js",
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.html$/i,
        use: "html-loader",
      },

      {
        test: /\.(jpg|svg|png|gif|jpeg)$/,
        use: {
          loader: "file-loader",
          options: {
            esModule: false,
            name: "[hash].[ext]",
            outputPath: "img",
          },
        },
        type: "javascript/auto",
      },
      {
        test: /\.mp3$/i,
        use: {
          loader: "file-loader",
          options: {
            esModule: false,
            name: "[hash].[ext]",
            outputPath: "audio",
          },
        },
        type: "javascript/auto",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new CleanWebpackPlugin(),
  ],
};
