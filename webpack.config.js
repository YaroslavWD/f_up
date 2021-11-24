const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default

const isProd = true

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimizer = [
            new CssMinimizerPlugin(),
        ]
    }

    return config
}

module.exports = {
    context: path.resolve(__dirname, 'source'),
    mode: 'development',
    entry: {
        main: './js/index.js',
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'build')
    },
    target: 'web',
    optimization: optimization(),
    devServer: {
        port: 4200
    },
    resolve: {
      extensions: ['.js', '.png', '.svg'],
      alias: {
          '@': path.resolve(__dirname, 'source')
      }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: true
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin(
            {
                patterns: [
                    {
                        from: path.resolve(__dirname, 'source/favicon.ico'),
                        to: path.resolve(__dirname, 'build')
                    },
                    {
                        from: path.resolve(__dirname, 'source/assets/img/**'),
                        to: path.resolve(__dirname, 'build')
                    }
                ]
            }
        ),
        new ImageminPlugin({ test: 'source/assets/img/**' }),
    ],
    module: {
        rules: [
            {
                test: /.s?css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
                generator: {
                    publicPath: '/style/[hash][ext]',
                },
            },
            {
                test: /\.(ttf|woff|woff2|eot)/,
                use: ['file-loader'],
                type: 'asset/inline',
            },
        ]
    }
}