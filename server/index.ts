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
      appType: 'spa'
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
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer().catch(console.error);