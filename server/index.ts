import express from "express";
import { createServer } from "vite";
import path from "path";

const app = express();
const port = 5000;

async function startServer() {
  if (process.env.NODE_ENV === "development") {
    // Vite 개발 서버를 강제로 runtime error 없이 설정
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
      plugins: [
        {
          name: 'react-refresh',
          apply: 'serve',
          configResolved(config) {
            // React 플러그인만 유지하고 runtime error 플러그인 제거
            config.plugins = config.plugins.filter(plugin => 
              !plugin.name?.includes('runtime-error') && 
              !plugin.name?.includes('error-overlay')
            );
          }
        }
      ],
      resolve: {
        alias: {
          "@": path.resolve(process.cwd(), "client", "src"),
          "@shared": path.resolve(process.cwd(), "shared"),
          "@assets": path.resolve(process.cwd(), "attached_assets"),
        },
      },
      root: path.resolve(process.cwd(), "client"),
      server: {
        hmr: { overlay: false },
        fs: { strict: false },
      },
    });

    app.use(vite.ssrFixStacktrace);
    app.use(vite.middlewares);
  } else {
    // 프로덕션 모드
    app.use(express.static(path.resolve(process.cwd(), "dist/public")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(process.cwd(), "dist/public/index.html"));
    });
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

startServer().catch(console.error);