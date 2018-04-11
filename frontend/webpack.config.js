const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development', // overriden by cli --mode argument when building for production
    entry: './src/main.jsx',
    output: {
        filename: 'bundle.[hash].js',
        publicPath: '/'
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-react',
                        ['@babel/preset-env', {
                            useBuiltIns: 'entry',
                            shippedProposals: true
                        }]
                    ],
                    plugins: [
                        'babel-plugin-syntax-dynamic-import',
                        'babel-plugin-transform-decorators-legacy',
                        ['babel-plugin-transform-class-properties', { loose: true }],
                        'babel-plugin-emotion'
                    ]
                }
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },

    plugins: [
        new CleanWebpackPlugin('dist/'),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
};
