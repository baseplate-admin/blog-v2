import path from 'node:path';
import type { Configuration } from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import BundleTracker from 'webpack-bundle-tracker';
import webpack from 'webpack';

const isDev = process.env.WEBPACK_MODE === 'development';
const src = path.resolve(__dirname, 'web/src');
const out = path.resolve(__dirname, 'static');

const config: Configuration = {
    mode: isDev ? 'development' : 'production',
    entry: {
        main: path.resolve(src, 'main.ts'),
    },
    output: {
        path: out,
        filename: 'assets/[name].[contenthash:8].js',
        chunkFilename: 'assets/[name].[contenthash:8].js',
        assetModuleFilename: 'assets/[name].[hash:8][ext]',
        publicPath: '/static/',
        clean: true,
        hashFunction: 'xxhash64',
    },
    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json', '.css', '.svg'],
        alias: {
            $lib: path.resolve(src, 'lib'),
            $vendor: path.resolve(src, 'vendor'),
        },
        // main.ts imports 'vite/modulepreload-polyfill' — a Vite-only module.
        // Stub it out so webpack resolves it to nothing.
        fallback: {
            'vite/modulepreload-polyfill': false,
        },
    },
    module: {
        rules: [
            {
                test: /\.(tsx|ts|jsx|js|mjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: 'defaults' }],
                            ['@babel/preset-react', { runtime: 'automatic' }],
                            ['@babel/preset-typescript', { ignoreExtensions: false }],
                        ],
                        // Inject the React Fast Refresh transform in dev only.
                        plugins: isDev ? [require.resolve('react-refresh/babel')] : [],
                        cacheDirectory: true,
                        compact: !isDev,
                    },
                },
            },
            {
                // CSS entry (app.css): extracted in production, inlined in dev.
                test: /\.css$/,
                use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ],
            },
            {
                // SVGs imported as React components via svgr-loader.
                test: /\.svg$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: { presets: ['@babel/preset-react'] },
                    },
                    'svgr-loader',
                ],
            },
            {
                // Other images: emit as static assets.
                test: /\.(png|jpe?g|gif|webp|avif|ico)$/i,
                type: 'asset',
            },
            {
                // Fonts: emit as static assets.
                test: /\.(woff2?|eot|ttf|otf)$/i,
                type: 'asset',
            },
        ],
    },
    plugins: [
        // Emit webpack-stats.json for django-webpack-loader.
        // webpack-bundle-tracker is the officially supported way to do this.
        new BundleTracker({
            path: __dirname,
            filename: 'webpack-stats.json',
            integrity: false,
        }),
        new webpack.DefinePlugin({
            __VITE__: JSON.stringify(false),
            'import.meta.env': JSON.stringify({
                MODE: isDev ? 'development' : 'production',
                DEV: isDev,
                PROD: !isDev,
                BASE_URL: '/static/',
            }),
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(src, 'vendor/twemoji/svg'),
                    to: 'twemoji/svg/[name][ext]',
                },
            ],
        }),
        ...(isDev
            ? [new ReactRefreshWebpackPlugin()]
            : [
                  new MiniCssExtractPlugin({
                      filename: 'assets/main.[contenthash:8].css',
                      chunkFilename: 'assets/[name].[contenthash:8].css',
                  }),
              ]),
    ],
    optimization: isDev
        ? {}
        : {
              splitChunks: {
                  chunks: 'all',
                  cacheGroups: {
                      // Keep third-party deps in their own cacheable chunk.
                      vendor: {
                          test: /[\\/]node_modules[\\/]/,
                          name: 'vendor',
                          priority: -10,
                          reuseExistingChunk: true,
                      },
                  },
              },
          },
    ...(isDev
        ? {
              devServer: {
                  host: 'localhost',
                  port: 5173,
                  // Serve the dev bundle under /static/ so it matches the production
                  // publicPath and the webpack tag in base.html.
                  static: {
                      directory: path.resolve(__dirname, 'static'),
                      publicPath: '/static/',
                  },
                  hot: true,
                  liveReload: true,
                  headers: { 'Access-Control-Allow-Origin': 'http://localhost:8000' },
                  client: { overlay: true },
              },
          }
        : {}),
    performance: { hints: false, maxEntrypointSize: Infinity, maxAssetSize: Infinity },
    stats: 'errors-warnings',
};

export default config;
