import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
// gzip
import viteCompression from 'vite-plugin-compression';
import path from 'path';
import type { ConfigEnv } from 'vite';

export default ({ mode }: ConfigEnv) => {
  // 获取env环境变量
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    base: '',
    plugins: [
      vue(),
      viteCompression()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@views': path.resolve(__dirname, './src/views')
      }
    },
    server: {
      host: true,
      https: false,
      open: false,
      port: 8018,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          ws: true,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      outDir: 'dist',
      // 生成静态资源的存放路径
      assetsDir: 'static',
      sourcemap: false,
      // 混淆器, terser构建后文件体积更小
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.dir']
        }
      },
      rollupOptions: {
        // js/css/img分不同文件存放
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/name-[hash].[ext]"
        }
      }
    }
  });
}