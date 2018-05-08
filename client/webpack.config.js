var webpack = require('webpack')
var path = require('path')

module.exports = {
  entry: [
    'react-hot-loader/patch',
    './src/app.js'
  ],
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'app.bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: ['node_modules', 'components'],
    alias: {
      config: path.resolve(__dirname, 'src/config'),
    }
  },
  devtool: 'source-map',
  plugins: [
    new webpack.NamedModulesPlugin()
  ]
}
