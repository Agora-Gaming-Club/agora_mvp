import { resolve } from 'path';
import react from '@vitejs/plugin-react';

module.exports = {
  // this was changed
  plugins: [
    react({
      include: '**/*.disabled',
    }),
  ],
  root: resolve('./react-app'),
  base: '/static/',
  server: {
    host: 'localhost',
    port: 3000,
    open: false,
    watch: {
      usePolling: true,
      disableGlobbing: false,
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: [{ find: '@', replacement: resolve(__dirname, './react-app/src') }],
  },
  build: {
    outDir: resolve('./react-app/dist'),
    assetsDir: '',
    manifest: true,
    emptyOutDir: true,
    target: 'es2015',
    rollupOptions: {
      input: {
        main: resolve('./react-app/src/main.tsx'), // <- renamed from main.tsx
      },
      output: {
        chunkFileNames: undefined,
      },
    },
  },
};
