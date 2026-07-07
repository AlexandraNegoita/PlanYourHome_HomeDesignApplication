import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
export default {
  entry: path.resolve(path.resolve(), 'index.ts'),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(path.resolve(), '../../build/src/pages'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Planner Page',
      template: 'index.html',
      filename: 'index.html'
    }),
    new CopyPlugin({
      patterns: [
          { from: "../pages/assets", to: "../../src/pages/assets" }
      ],
    })
  ]
};