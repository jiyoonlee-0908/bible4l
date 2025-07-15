import express from "express";
import { createServer } from "vite";
import path from "path";

const app = express();
const port = 5000;

async function startServer() {
  if (process.env.NODE_ENV === "development") {
    // 개발 모드: Vite 개발 서버
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
      root: path.resolve(process.cwd(), 'client'),
      base: '/',
      resolve: {
        alias: {
          '@': path.resolve(process.cwd(), 'client/src'),
          '@shared': path.resolve(process.cwd(), 'shared'),
          '@assets': path.resolve(process.cwd(), 'attached_assets'),
        }
      }
    });

    app.use(vite.middlewares);
    
    // SPA 라우팅
    app.use('*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const template = await vite.transformIndexHtml(url, `
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BibleAudio 4L</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    // 프로덕션 모드: 정적 파일 서빙
    app.use(express.static(path.resolve(process.cwd(), 'dist/public')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist/public/index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
    console.log(`Development: http://localhost:${port}`);
  });
}

startServer().catch(console.error);