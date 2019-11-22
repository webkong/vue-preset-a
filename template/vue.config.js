let publicPath = '/'
let outputDir = 'release'
let serverCopy = false
let pages
let pageClient = {
  client: {
    entry: 'src/main.js',
    template: 'public/index.html',
    filename: 'client.html',
    title: 'SHAREit'
  }
}
pages = pageClient;
// // 获取script参数
// const script = process.env.npm_lifecycle_script
// // console.log(script);
// // 打包online的包，只打包client页面
// if (process.env.VUE_APP_ONLINE_SOURCE_HOST) {
//   console.log('---build online---')
//   publicPath = process.env.VUE_APP_ONLINE_SOURCE_HOST
//   outputDir += '/online'
//   pages = {
//     ...pageOnline
//   }
// } else if (script.indexOf('--server') > -1) {
//   // 只打包server，production mode
//   outputDir += '/server'
//   console.log('---build server---')
//   serverCopy = true
//   pages = {
//     ...pageServer
//   }
// } else if (script.indexOf('--client') > -1) {
//   outputDir += '/client'
//   // 只打包client， production mode
//   console.log('---build client---')
//   pages = {
//     ...pageClient
//   }
// } else {
//   pages = {
//     ...pageClient,
//     ...pageServer
//   }
// }

module.exports = {
  outputDir: outputDir,
  publicPath: publicPath,
  productionSourceMap: false,
  filenameHashing: false,
  pages: pages,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.15.150:2999',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },
  transpileDependencies: [''],
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 方便调试，dev不压缩js
      if (process.env.VUE_APP_TYPE === 'dev') {
        config.optimization.minimize(false)
      }
    }
    // 打包server将refresh复制到release/server目录
    if (serverCopy) {
      config.plugin('copy').tap(args => {
        args[0].push({
          from: './src/server/refresh.html',
          toType: 'dir'
        })
        return args
      })
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      if (process.env.VUE_APP_TYPE !== 'dev') {
        config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
        config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
        config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
        config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = [
          'console.log'
        ]
      }
    }
  }
}
