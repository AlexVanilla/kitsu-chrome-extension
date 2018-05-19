const Dotenv = require('dotenv-webpack');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader' // create style nodes from JS strings
                }, {
                    loader: 'css-loader' // translate css to commonJS
                }, {
                    loader: 'sass-loader' // compile Sass to CSS
                }]
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    devtool: 'inline-source-map',
    plugins: [
        new Dotenv(),
        new ChromeExtensionReloader(),
    ]
};