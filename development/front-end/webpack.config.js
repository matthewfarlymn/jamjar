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
            // All
            Body: 'app/components/Body.jsx',
            Header: 'app/components/Header.jsx',
            Footer: 'app/components/Footer.jsx',

            // Home
            Home: 'app/components/Home.jsx',
            Slider: 'app/components/Slider.jsx',
            CtaRegister: 'app/components/CtaRegister.jsx',
            CarouselPopular: 'app/components/CarouselPopular.jsx',
            CarouselRecent: 'app/components/CarouselRecent.jsx',
            CtaContact: 'app/components/CtaContact.jsx',

            //Access
            Access: 'app/components/Access.jsx',

            // About
            About: 'app/components/About.jsx',

            // Products
            Products: 'app/components/Products.jsx',

            // Styles & Scripts
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