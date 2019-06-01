const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: isProd ? './src/index.js' : './entry.js',
  devtool: 'eval-source-map',
  output: {
    path: __dirname + '/dist',
    pathinfo: !isProd,
    publicPath: '/',
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: '.',
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
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      react: path.resolve(__dirname, './src/index.js'),
    },
  },
};
