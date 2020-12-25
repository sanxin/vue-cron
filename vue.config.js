const path = require("path");

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    // 当运行 vue-cli-service build 时生成的生产环境构建文件的目录
    outputDir: 'dist',
    // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
    assetsDir: 'assets',
    // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码。
    lintOnSave: false,
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    // 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。
    chainWebpack(config) {
        config.resolve.alias.set("assets", resolve("src/assets"));
        config.resolve.alias.set("components", resolve("src/components"));
        config.resolve.alias.set("views", resolve("src/views"));
    },
    configureWebpack: (config) => {
        config.entry.app = ["babel-polyfill", "./src/main.js"];
    },
    // 部署应用包时的基本 URL。
    publicPath: "./"
}