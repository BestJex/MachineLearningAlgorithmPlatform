const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    publicPath: '/flow/',
    outputDir: 'flow',      // build 生成文件的目录，若已存在则会被先清除，传入 --no-clean 可关闭该行为
    assetsDir: 'assets',    // 放置生成的静态资源 (js、css、img、fonts) 的目录，相对于 outputDir
    lintOnSave: process.env.NODE_ENV !== 'production',  // 生产构建时禁用 eslint-loader
    crossorigin: 'anonymous',   // anonymous 不会通过 cookies，客户端 SSL 证书或 HTTP 认证交换用户凭据
    productionSourceMap: false, // 生产环境的 source map，可以将其设置为 false 以加速生产环境构建
    // 配置 webpack-dev-server
    devServer: {
        port: 9528,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: null
    },
    // webpack 配置
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src'),
            }
        },
        output: {
            libraryExport: 'default'
        },
    },
    // 接收一个基于 webpack-chain 的 ChainableConfig 实例，对内部的 webpack 配置进行更细粒度的修改
    chainWebpack: config => {
        config.plugins.delete('preload');   // TODO: need test
        config.plugins.delete('prefetch');  // TODO: need test
        config.module.rule('svg').exclude.add(resolve('src/icons')).end();
        config.module.rule('icons').test(/\.svg$/).include.add(resolve('src/icons')).end().use('svg-sprite-loader').loader('svg-sprite-loader').options({
            symbolId: 'icon-[name]'
        }).end();
        config.module.rule('vue').use('vue-loader').loader('vue-loader').tap(options => {
            options.compilerOptions.preserveWhitespace = true
            return options
        }).end();
        config.when(process.env.NODE_ENV === 'development', config => config.devtool('cheap-source-map'));
    }
}