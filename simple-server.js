const express = require('express');
const path = require('path');
const { createServer: createViteServer } = require('vite');

async function createServer() {
  const app = express();
  
  // Vite를 middleware 모드로 생성하되 에러 플러그인 제거
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
    clearScreen: false,
    optimizeDeps: {
      exclude: ['@replit/vite-plugin-runtime-error-modal']
    },
    plugins: [],  // 모든 플러그인 제거하고 기본만 사용
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'client/src'),
        '@shared': path.resolve(__dirname, 'shared'),
        '@assets': path.resolve(__dirname, 'attached_assets')
      }
    },
    root: path.resolve(__dirname, 'client'),
    server: {
      hmr: { overlay: false },
      fs: { strict: false }
    }
  });

  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);

  return { app, vite };
}

createServer().then(({ app }) => {
  app.listen(5000, '0.0.0.0', () => {
    console.log('🚀 Simple server running on port 5000');
  });
}).catch(console.error);