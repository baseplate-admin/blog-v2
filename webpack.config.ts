import path from 'node:path';
import type { Configuration } from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import BundleTracker from 'webpack-bundle-tracker';

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
    },
    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
    resolve: {
        extensions: [
            '.tsx',
            '.ts',
            '.jsx',
            '.js',
            '.mjs',
            '.json',
            '.css',
            '.svg',
        ],
        // Resolve tsconfig "paths" ($lib, $vendor) at bundle time natively
        // (webpack 5.105+). Replaces resolve.alias + tsconfig-paths-webpack-plugin.
        tsconfig: true,
    },
    // Break the Windows chokidar recompile loop: batch watcher events and
    // ignore node_modules + the two paths the build itself writes (static out
    // + webpack-stats.json), so their changes don't re-trigger a compile.
    watchOptions: {
        aggregateTimeout: 300,
        poll: false,
        ignored: /node_modules|static|webpack-stats\.json/,
    },
    module: {
        rules: [
            {
                // TS/TSX/JS -> JS via esbuild (fast, no Babel config needed).
                test: /\.(tsx|ts|jsx|js|mjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'esbuild-loader',
                    options: {
                        jsx: 'automatic',
                    },
                },
            },
            {
                // CSS entry (app.css): `style-loader` injects a <style> tag at
                // runtime (both dev and prod), so no separate CSS file is
                // emitted. `@tailwindcss/webpack` runs the Tailwind 4 engine as
                // a webpack loader (replaces postcss-loader + postcss.config.js).
                // Loaders run right-to-left: Tailwind compiles @apply/nesting,
                // then css-loader resolves, then style-loader injects.
                test: /\.css$/,
                use: ['style-loader', 'css-loader', '@tailwindcss/webpack'],
            },
            {
                // SVGs imported as React components via @svgr/webpack.
                test: /\.svg$/,
                use: ['@svgr/webpack'],
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
        // HMR in dev. (No CSS extract plugin - style-loader injects styles.)
        ...(isDev ? [new ReactRefreshWebpackPlugin()] : []),
    ],
    ...(isDev
        ? {
              devServer: {
                  host: 'localhost',
                  port: 3000,
                  allowedHosts: 'all',
                  // Serve the dev bundle under /static/ so it matches the
                  // production publicPath and the render_bundle tag in base.html.
                  static: {
                      directory: path.resolve(__dirname, 'static'),
                      publicPath: '/static/',
                  },
                  hot: true,
                  liveReload: true,
                  // Allow Django on :8000 to load the dev bundle from :3000.
                  headers: {
                      'Access-Control-Allow-Origin': 'http://localhost:8000',
                  },
                  client: { overlay: true },
              },
          }
        : {}),
    performance: {
        hints: false,
        maxEntrypointSize: Infinity,
        maxAssetSize: Infinity,
    },
    stats: 'errors-warnings',
};

export default config;
