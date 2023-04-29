/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'
const path = require('path')

const resolve = (dir) => {
    return path.join(__dirname, './', dir)
}

const isProd = () => {
    return process.env.NODE_ENV === 'production'
}
module.exports = {
    publicPath: '/',
    lintOnSave: isProd(),
    productionSourceMap: false,
    transpileDependencies: [],
    devServer: {
    // open: process.platform === 'darwin',
        open: false,
        host: '0.0.0.0',
        port: '8083',
        disableHostCheck: false,
        https: false,
        hotOnly: false,
        overlay: {
            warnings: false,
            errors: true
        }
        // proxy: {
        //     '/api': {
        //         target: 'http://29.23.23.248:30005',
        //         changeOrigin: true,
        //         pathRewrite: {
        //             '^/api': '/'
        //         }
        //     }
        // }
    },
    configureWebpack: () => ({
        name: 'vue-cli3-template',
        resolve: {
            alias: {
                // vue快速路径
                '@': resolve('src')
            }
        }
    }),
    chainWebpack: (config) => {
    // webpack-html-plugin
        config.plugin('html').tap((args) => {
            args[0].minify = {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
            return args
        })

        const svgRule = config.module.rule('svg')
        svgRule.uses.clear()
        svgRule
            .test(/\.svg$/)
            .include.add(resolve('./src/assets/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'svg-[name]'
            })

        config.resolve.symlinks(true)
    },
    pwa: {
    // configure the workbox plugin
        include: [],
        workboxPluginMode: 'GenerateSW',
        workboxOptions: {
            mode: 'production'
        }
    },
    css: {
        loaderOptions: {
            sass: {
                prependData: `
                    @import "@/assets/scss/variable/index.scss";
                `
            }
        }
    }
}
