const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    port:8888,    // 修改启动端口号
  },
  // 增强 vue-cli 的 webpack 配置项
  // 在 externals 中的第三方包不会打包
  configureWebpack: {
    // 打包优化
    externals: {
      // import导包的包名: window全局的成员名称
      echarts: 'echarts',
    }
  }
})