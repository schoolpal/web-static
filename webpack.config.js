const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const ROOT_PATH = path.resolve(__dirname);
const DEV_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'webapp/web/html/dist');

module.exports = {
    entry: {
        bundle: path.resolve(DEV_PATH, 'app.jsx'),
        vendor: [
            './src/utils/vendor',
            'bootstrap/dist/js/bootstrap'
        ],
        react: [
            'react',
            'react-dom',
            'react-router'
        ]
    },
    output: {
        path: BUILD_PATH,
        filename: '[name].js',
        chunkFilename: "[name].js",
        publicPath: '/web/html/dist/'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel',
            include: DEV_PATH,
            query: {
                presets: ['es2015', 'react']
            }
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
        }, {
            test: /\.less$/,
            loader: 'style-loader!css-loader!less-loader'
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url?limit=8192'
        }, {
            test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
            loader: 'url'
        }]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ["vendor", "react"],
            minChunks: Infinity
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(DEV_PATH, 'app.html'),
            filename: '../index.html'
        }),
        new ExtractTextPlugin('bundle.css')
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
}
