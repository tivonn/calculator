module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  indexPath: 'index.html',
  lintOnSave: 'error',
  runtimeCompiler: true,
  configureWebpack: (config) => {
    config.resolve.alias.vue$ = 'vue/dist/vue.esm.js'
  },
  chainWebpack: (config) => {
    config.module.rule('eslint').use('eslint-loader')
      .loader('eslint-loader')
      .tap(options => {
        options.fix = true
        return options
      })
  }
}
