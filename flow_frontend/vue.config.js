'use strict'
const path = require('path')


function resolve(dir) {
    return path.join(__dirname, dir)
}

//const name = 'test' // page title
// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
const port = 9528 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {

    /**
     * You will need to set publicPath if you plan to deploy your site under a sub path,
     * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then publicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     * Detail: https://cli.vuejs.org/config/#publicpath
     */
    publicPath: '/flow/',
    outputDir: 'flow',
    assetsDir: 'assets',
    lintOnSave: process.env.NODE_ENV === 'development',
    crossorigin: 'anonymous',
    productionSourceMap: false,
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            "/api": {
                target: 'http://39.105.21.62/flow/api',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
        output: {
            libraryExport: 'default'
        }
    },
    chainWebpack(config) {
        config.plugins.delete('preload') // TODO: need test
        config.plugins.delete('prefetch') // TODO: need test
        config.module.rule('svg').exclude.add(resolve('src/icons')).end()
        config.module.rule('icons').test(/\.svg$/).include.add(resolve('src/icons')).end().use('svg-sprite-loader').loader('svg-sprite-loader').options({
                symbolId: 'icon-[name]'
            }).end()
        config.module.rule('vue').use('vue-loader').loader('vue-loader').tap(options => {
                options.compilerOptions.preserveWhitespace = true
                return options
            }).end()
        config.when(process.env.NODE_ENV === 'development', config => config.devtool('cheap-source-map'))
    }
}
