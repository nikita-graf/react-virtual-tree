var webpack = require('webpack');
var path = require('path');
var util = require('util');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var config;

function createWebpackConfig(options) {
  var config = {};
  var plugins;
  var entry;

  options = options || {};
  entry = {
    app: [
      './src/index.js',
      './example/index.js',
    ],
  };

  if (!options.build) {
    plugins = [
      new webpack.NoErrorsPlugin(),
    ];
    config.devtool = '#eval-cheap-module-source-map';
    config.debug = true;
    config.watch = true;
  } else {
    plugins = [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"',
        },
      }),
      new webpack.optimize.UglifyJsPlugin(),
    ];
    config.devtool = 'source-map';
  }

  plugins.push(new ExtractTextPlugin("styles.css"));

  util._extend(config, {
    entry: entry,
    output: {
      filename: 'app.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      loaders: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel',
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('css-loader'),
        }
      ],
    },
    plugins: plugins,
  });

  return config;
}

if (process.argv.indexOf('--build') > -1) {
  config = createWebpackConfig({ build: true });
} else {
  config = createWebpackConfig({});
}

module.exports = config;
