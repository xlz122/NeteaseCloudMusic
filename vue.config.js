const path = require('path');

// 不进行webpack打包的文件
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
    'https://lib.baomitu.com/vue/3.2.13/vue.global.prod.min.js',
    'https://lib.baomitu.com/vue-router/4.0.3/vue-router.global.prod.min.js',
    'https://lib.baomitu.com/vuex/4.0.0/vuex.global.prod.min.js',
    'https://lib.baomitu.com/axios/0.27.2/axios.min.js',
    'https://lib.baomitu.com/lodash.js/4.17.21/lodash.min.js',
  ],
};

// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// 需要进行压缩的文件
const productionGzipExtensions = ['js', 'css', 'json'];

module.exports = {
  // 基础路径
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // 打包生成文件目录(默认dist)
  outputDir: 'dist',
  // 静态资源放置路径(默认为空,静态资源放置在根目录)
  assetsDir: '',
  // 打包生成的index.html放置路径(例: xlz/index.html,将被放置在dist/xlz/index.html)
  indexPath: 'index.html',
  // 是否开启eslint(ture/false/'error')
  lintOnSave: true,
  // 是否生成js.map文件(生产环境下,可以精确的输出哪一个文件、哪一行报错)
  productionSourceMap: false,
  css: {
    // 是否生成css.map文件
    sourceMap: false
  },
  devServer: {
    // 是否自动打开浏览器
    open: false,
    // 启动端口号
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
    if (process.env.NODE_ENV === 'production') {
      // 配置删除console.*函数调用
      config.optimization.minimizer[0].options.minimizer.options.compress = Object.assign(
        config.optimization.minimizer[0].options.minimizer.options.compress,
        {
          drop_console: false, // 删除所有console.*函数的调用
          drop_debugger: true, // 删除所有debugger
          pure_funcs: ['console.log', 'console.dir'], // 删除特定的console.*函数的调用
        }
      );

      // webpack4.x版本支持
      // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;

      // 打包文件大小配置
      config.performance = {
        hints: 'warning',
        // 入口起点的最大体积 整数类型(以字节为单位)
        maxEntrypointSize: 50000000,
        // 生成文件的最大体积 整数类型(以字节为单位 300k)
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
            filename: '[path][base].gz',
            algorithm: 'gzip',
            test: new RegExp(
              '\\.(' + productionGzipExtensions.join('|') + ')$'
            ),
            // 对超过10k的数据进行压缩
            threshold: 10240,
            // 压缩比例,值为0 ~ 1
            minRatio: 0.6
          })
        ]
      };
    } else {
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
    // 配置文件路径别名
    config.resolve.alias
      .set('@', path.join(__dirname, 'src'))
      .set('@api', path.join(__dirname, 'src/api'))
      .set('@assets', path.join(__dirname, 'src/assets'))
      .set('@components', path.join(__dirname, 'src/components'))
      .set('@router', path.join(__dirname, 'src/router'))
      .set('@store', path.join(__dirname, 'src/store'))
      .set('@types', path.join(__dirname, 'src/types'))
      .set('@utils', path.join(__dirname, 'src/utils'))
      .set('@views', path.join(__dirname, 'src/views'));

    // 配置index.html(title、cdn引入)
    config.plugin('html').tap(args => {
      args[0].title = '网易云音乐';

      if (process.env.NODE_ENV === 'production') {
        args[0].cdn = cdn;
      }

      return args;
    });

    // 配置小图片base64(webpack5.x版本: url-loader、file-loader被移除)
    config.module
      .rule('images')
      .test(/\.(jpg|png|gif)$/)
      .set('parser', {
        dataUrlCondition: {
          maxSize: 10 * 1024 // 10KiB
        }
      })

    // webpack4.x 版本支持
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
