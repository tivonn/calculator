module.export = {
  baseUrl: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  indexPath: 'index.html',
  filenameHashing: true,
  lintOnSave: 'error',
  runtimeCompiler: true,
  productionSourceMap: true,
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
