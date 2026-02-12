import { defineConfig, loadEnv } from 'vite';
import type { ConfigEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import viteCompression from 'vite-plugin-compression';
import path from 'path';

export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    base: '',
    plugins: [vue(), viteCompression()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    server: {
      open: false,
      host: true,
      port: 8088,
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_API_BASE_URL,
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_APP_BASE_API}`), ''),
        },
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: false,
      rolldownOptions: {
        output: {
          minify: {
            compress: { dropConsole: true },
          },
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/name-[hash].[ext]',
        },
      },
    },
  });
};
