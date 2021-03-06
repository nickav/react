const path = require('path');
const packageJson = require('./package.json');

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    pathinfo: false,
    publicPath: '/',
    filename: `${packageJson.name}.js`,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['@babel/plugin-proposal-class-properties'],
            },
          },
        ],
      },
    ],
  },
};
