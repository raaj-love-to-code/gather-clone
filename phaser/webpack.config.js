const path =  require('path');

module.exports = {
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devServer: {
        static: {
          directory: path.join(__dirname, '/'),
        },
        compress: true,
        port: 8000,
        hot: true,
    },
    mode: 'development'
}