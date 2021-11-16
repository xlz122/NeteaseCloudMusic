const path = require('path');

// 设置文件路径别名
function resolve(dir) {
  return path.join(__dirname, dir);
}

// 配置不进行webpack打包的文件
const externals = {
  'vue': 'Vue',
  'vue-router': 'VueRouter',
  'vuex': 'Vuex',
  'axios': 'axios',
  'lodash': '_',
};
// 使用cdn引入的文件
const cdn = {
  css: [],
  js: [
    'https://lib.baomitu.com/vue/3.2.4/vue.global.min.js',
    'https://lib.baomitu.com/vue-router/4.0.11/vue-router.global.min.js',
    'https://lib.baomitu.com/vuex/4.0.2/vuex.global.min.js',
    'https://lib.baomitu.com/axios/0.21.1/axios.min.js',
    'https://lib.baomitu.com/lodash.js/4.17.21/lodash.min.js',
  ],
};

// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// 配置需要进行压缩的文件
const productionGzipExtensions = ['js', 'css', 'json'];

module.exports = {
  // 基础路径
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // 打包生成文件目录，默认dist
  outputDir: 'dist',
  // 静态资源放置路径，默认为空，css/js/img文件夹都将放置在根目录下
  assetsDir: '',
  // 打包生成的index.html放置的路径 例：xlz/index.html，index.html将被放置在dist/xlz/index.html
  indexPath: 'index.html',
  // 是否开启eslint检测，有效值：ture | false | 'error'
  lintOnSave: true,
  // 设置为true的时候,打包完成后生成一些js.map文件,如果有报错,可以精确的输出哪一个文件、哪一行报错
  productionSourceMap: false,
  css: {
    // 设置为true的时候 打包完成后会生成一些css.map文件,如果有报错,可以精确的输出哪一个文件、哪一行报错
    sourceMap: false,
    // 是否开启样式模块 <style module></style>(v5已废弃)
    // requireModuleExtension: false,
    // 共享的全局变量
    loaderOptions: {
      // 给 less-loader 传递选项
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {
            // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
            // hack: 'true; @import "@/assets/common.less";',
          },
        },
      },
    },
  },
  devServer: {
    // 启动后是否自动打开浏览器
    open: false,
    // 启动服务端口号
    port: 8018,
    proxy: {
      api: {
        target: process.env.VUE_APP_BASE_URL,
        // 允许跨域
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },
  configureWebpack: config => {
    // 环境判断
    // development(开发)环境下config.optimization是undefined
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      // 去掉所有console.log()，cli 5.0版本配置更改（无效）
      // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;

      // 打包文件大小配置
      config.performance = {
        hints: 'warning',
        // 入口起点的最大体积 整数类型（以字节为单位）
        maxEntrypointSize: 50000000,
        // 生成文件的最大体积 整数类型（以字节为单位 300k）
        maxAssetSize: 30000000,
        // 只给出 js 文件的性能提示
        assetFilter: function (assetFilename) {
          return assetFilename.endsWith('.js');
        }
      }

      return {
        // 配置不进行webpack打包的文件
        externals: externals,
        // 配置gzip压缩
        plugins: [
          new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
              '\\.(' + productionGzipExtensions.join('|') + ')$'
            ),
            // 对超过10k的数据进行压缩
            threshold: 10240,
            // 压缩比例，值为0 ~ 1
            minRatio: 0.6
          })
        ]
      };
    } else {
      // 为开发环境修改配置...
      return {
        devtool: 'source-map'
      }
    }

    // 代码拆分
    // config.optimization = {
    //   splitChunks: {
    //     chunks: 'all',
    //     cacheGroups: {
    //       vue: {
    //         name: 'vue',
    //         test: /[\\/]node_modules[\\/]vue[\\/]/,
    //         priority: -10
    //       },
    //       'vue-router': {
    //         name: 'vue-router',
    //         test: /[\\/]node_modules[\\/]vue-router[\\/]/,
    //         priority: -10
    //       },
    //       'vendors': {
    //         name: 'vendors',
    //         test: /[\\/]node_modules[\\/]/,
    //         priority: -20
    //       }
    //     }
    //   }
    // }
  },
  chainWebpack: config => {
    // 设置文件路径别名(需要配合顶部的方法)
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@router', resolve('src/router'))
      .set('@store', resolve('src/store'))
      .set('@types', resolve('src/types'))
      .set('@utils', resolve('src/utils'))
      .set('@views', resolve('src/views'));

    // 配置index.html title、cdn引入
    config.plugin('html').tap(args => {
      args[0].title = '网易云音乐';

      if (process.env.NODE_ENV === 'production') {
        args[0].cdn = cdn;
      }
      return args;
    });

    // 图片打包成base64配置，limit: 10240为10k（v5版本无效）
    // config.module
    //   .rule('images')
    //   .test(/\.(jpg|png|gif)$/)
    //   .use('url-loader')
    //   .loader('url-loader')
    //   .tap(options => Object.assign(options, { limit: 10240 }));

    // 移除 prefetch 插件
    config.plugins.delete('prefetch');
    // 移除 preload 插件
    config.plugins.delete('preload');
  },
  pluginOptions: {
    // 第三方插件配置
  }
};
