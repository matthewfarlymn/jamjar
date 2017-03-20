var webpack = require('webpack');

module.exports = {
    entry: [
        'script!jquery/dist/jquery.min.js',
        './app/app.jsx'
    ],
    externals: {
        jquery: 'jQuery'
    },
    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery'
        })
    ],
    output: {
        path: __dirname,
        filename: './public/bundle.js'
    },
    resolve: {
        root: __dirname,
        alias: {
            Body: 'app/components/Body.jsx',
            Header: 'app/components/Header.jsx',
            Footer: 'app/components/Footer.jsx',
            Home: 'app/components/Home.jsx',
            Slider: 'app/components/Slider.jsx',
            CTA: 'app/components/CTA.jsx',
            Access: 'app/components/Access.jsx',
            Weather: 'app/components/Weather.jsx',
            WeatherForm: 'app/components/WeatherForm.jsx',
            WeatherMessage: 'app/components/WeatherMessage.jsx',
            About: 'app/components/About.jsx',
            Products: 'app/components/Products.jsx',
            OpenWeatherMap: 'app/api/OpenWeatherMap.jsx',
            ErrorModal: 'app/components/ErrorModal.jsx',
            ApplicationStyles: 'app/assets/scss/app.scss'
        },
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                query: {
                presets: ['react', 'es2015', 'stage-0']
            },
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/
            }
        ]
    },
    devtool: 'cheap-module-eval-source-map'
};