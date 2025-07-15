const express = require('express');
const { createServer } = require('vite');

async function startServer() {
  const app = express();
  
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });
  
  app.use(vite.middlewares);
  
  app.listen(5000, '0.0.0.0', () => {
    console.log('Server running on port 5000');
  });
}

startServer();