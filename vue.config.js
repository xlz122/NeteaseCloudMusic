const path = require('path');

function resolve(dir) {
  // 设置文件路径别名方法
  return path.join(__dirname, dir);
}

// 配置不进行webpack打包的文件
const externals = {
  'vue': 'Vue',
  'vue-router': 'VueRouter',
  'vuex': 'Vuex',
  'axios': 'axios',
  'lodash': '_',
  // 'echarts': 'echarts'
};
// 使用cdn引入
const cdn = {
  css: [],
  js: [
    'https://lib.baomitu.com/vue/3.1.2/vue.global.min.js',
    'https://lib.baomitu.com/vue-router/4.0.10/vue-router.global.min.js',
    'https://lib.baomitu.com/vuex/4.0.2/vuex.global.min.js',
    'https://lib.baomitu.com/axios/0.21.1/axios.min.js',
    'https://lib.baomitu.com/lodash.js/4.17.21/lodash.min.js',
  ],
};

// gzip压缩（需要安装插件）
// npm install compression-webpack-plugin --save-dev
// yarn add compression-webpack-plugin --save-dev
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// 可加入需要的其他文件类型，比如json
// 图片一般不要压缩，体积会比原来还大
const productionGzipExtensions = ['js', 'css', 'json'];

module.exports = {
  //如果使用了history.pushState pages的路由时； 选项构建多页面应用时；
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: 'dist', // 打包(build)生成文件目录 默认dist
  assetsDir: '', // 默认不写或空，css js img文件夹都将放置在根目录下，所有的静态文件放置路径
  indexPath: 'index.html', // 指定打包生成的index.html放置的路径 例：xlz/index.html，index.html将被放置在dist/xlz/index.html
  lintOnSave: true, // 是否开启eslint保存检测，有效值：ture | false | 'error'
  productionSourceMap: false, // 设置为true的时候,打包完成后生成一些js.map文件,如果有报错,可以精确的输出哪一个文件、哪一行报错
  css: {
    sourceMap: false, // 设置为true的时候 打包完成后会生成一些css.map文件,如果有报错,可以精确的输出哪一个文件、哪一行报错
    requireModuleExtension: false, // 是否开启样式模块 <style module></style>
    // 共享的全局变量
    loaderOptions: {
      // 给 less-loader 传递选项
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {
            // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
            hack: 'true; @import "@/assets/common.less";',
          },
        },
      },
    },
  },
  devServer: {
    open: false, // 启动后是否自动打开浏览器
    port: 8018, // 启动服务端口号
    // index: '',   //启动项目后，默认进入的页面地址
    proxy: {
      // 使用对象的方式设置多个代理
      api: {
        target: 'http://n.xlz122.cn/api', // 线上地址
        ws: true, // 允许跨域
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/' // 替换target中的请求地址 请求地址直接使用 /api/login 的形式
        }
      }
    }
  },
  configureWebpack: config => {
    // 必须添加环境判断代码
    // development(开发)环境下config.optimization是undefined
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      // 去掉所有console.log()
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;

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
            threshold: 10240, //对超过10k的数据进行压缩
            minRatio: 0.6 // 压缩比例，值为0 ~ 1
          })
        ]
      };
    } else {
      // 为开发环境修改配置...
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
    //       vuex: {
    //         name: 'vuex',
    //         test: /[\\/]node_modules[\\/]vuex[\\/]/,
    //         priority: -10
    //       },
    //       'vue-router': {
    //         name: 'vue-router',
    //         test: /[\\/]node_modules[\\/]vue-router[\\/]/,
    //         priority: -10
    //       },
    //       'element-ui': {
    //         name: 'element-ui',
    //         test: /[\\/]node_modules[\\/]element-ui[\\/]/,
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
    // 配置index.html title 、cdn引入
    config.plugin('html').tap(args => {
      args[0].title = '网易云音乐';

      if (process.env.NODE_ENV === 'production') {
        args[0].cdn = cdn;
      }
      return args;
    });
    // 图片打包成base64配置,limit为8k
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 8000 }));
    // 移除 prefetch 插件
    config.plugins.delete('prefetch');
    // 移除 preload 插件
    config.plugins.delete('preload');
  },
  pluginOptions: {
    // 第三方插件配置
  }
};
