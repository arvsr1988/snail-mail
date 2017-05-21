let webpack = require('webpack');
let initialConfig = require('./common.js');
var WebpackMd5Hash = require('webpack-md5-hash');

initialConfig.plugins = initialConfig.plugins || [];
initialConfig.plugins = initialConfig.plugins.concat([
  new WebpackMd5Hash(),
  new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$")),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
  })
]);
module.exports = initialConfig;
