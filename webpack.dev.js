const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const RefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    port: 5500,
    hot: true,
    allowedHosts: ['.loca.lt'],
    historyApiFallback: true,
    proxy: {
      '/api': { target: 'https://calendar.hcjang.com', changeOrigin: true },
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new RefreshWebpackPlugin(),
  ],
});
