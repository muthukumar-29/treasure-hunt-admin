import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import autoprefixer from 'autoprefixer'

export default defineConfig(() => {
  return {
    base: '/',
    build: {
      outDir: 'build',
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({}), // add options if needed
        ],
      },
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: ['import', 'legacy-js-api'],
        },
      },
    },
    esbuild: {
      loader: 'jsx',
      target: 'esnext',
      include: /src\/.*\.jsx?$/,
      exclude: [],
      legalComments: 'none',
      jsx: 'automatic',
      keepNames: true
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
      include: ['react', 'react-dom'],
      exclude: ['core-js'],
    },
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: 'src/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
    server: {
      port: parseInt(process.env.PORT) || 3000,
      proxy: {
        // https://vitejs.dev/config/server-options.html
      },
      open: true,
      host: '0.0.0.0',
      allowedHosts: ['treasure-hunt-admin.onrender.com'],
      hmr: {
        overlay: false, // Disable error overlay
      },
    },
  }
})
