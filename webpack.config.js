var webpack = require('webpack');
var NODE_ENV = process.argv.indexOf('--build') > -1 ? 'production' : 'development';

module.exports = {

  output: {
    library: 'ReactVirtualTree',
    libraryTarget: 'umd',
  },

  externals: {
    react: 'react',
    'react-dom': 'react-dom',
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
    ],
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),
  ],

};
