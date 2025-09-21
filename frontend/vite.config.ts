import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  const shouldAnalyze = process.env.ANALYZE === 'true'

  return {
    plugins: [
      react(),
      // Bundle analyzer plugin
      shouldAnalyze && visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    ].filter(Boolean),

    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
        '@pages': resolve(__dirname, './src/pages'),
        '@services': resolve(__dirname, './src/services'),
        '@types': resolve(__dirname, './src/types'),
        '@utils': resolve(__dirname, './src/utils'),
        '@config': resolve(__dirname, './src/config'),
      },
    },

    build: {
      target: 'esnext',
      minify: 'terser',
      sourcemap: !isProduction,
      rollupOptions: {
        output: {
          manualChunks: {
            // Split React and related libraries
            react: ['react', 'react-dom', 'react-router-dom'],
            // Split Firebase
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            // Split Mantine UI
            mantine: ['@mantine/core', '@mantine/hooks', '@mantine/notifications'],
            // Split form libraries
            forms: ['react-hook-form', 'zod'],
            // Split utility libraries
            utils: ['date-fns', 'lodash-es'],
          },
        },
      },
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
      },
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000,
    },

    // Development server configuration
    server: {
      port: 3000,
      host: true,
      open: true,
    },

    // Preview server configuration
    preview: {
      port: 4173,
      host: true,
    },

    // Environment variables prefix
    envPrefix: 'VITE_',

    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
  }
})
