const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const fs = require('fs');

class CopyIndexTo200Plugin {
  apply(compiler) {
    compiler.hooks.done.tap('CopyIndexTo200Plugin', () => {
      const indexPath = path.join(__dirname, 'dist', 'index.html');
      const destPath = path.join(__dirname, 'dist', '200.html');
      fs.copyFileSync(indexPath, destPath);
    });
  }
}

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new Dotenv(),
    new CopyIndexTo200Plugin()
  ],  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
    open: true,
    historyApiFallback: true,
  },
  mode: 'development',
};