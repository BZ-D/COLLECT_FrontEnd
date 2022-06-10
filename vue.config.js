const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '': {
        // target: "http://collect.ilovese.cn/",
        target:"http://localhost:8081",
        changeOrigin: true,
        pathRewrite: {
          '^': ''
        }
      }
    },
  }
})
