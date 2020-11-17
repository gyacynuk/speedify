const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        popup: './src/popup.js',
        background: './src/background.js',
        content: './src/content.js'
    },
    output: {
        filename: '[name].js'
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "public" },
                { from: "assets" },
            ],
            options: {
                concurrency: 100,
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/
            },
        ]
    }
};