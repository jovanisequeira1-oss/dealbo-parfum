import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());

  // API Routes
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'DEALBO PARFUM API Server',
      environment: process.env.NODE_ENV || 'development'
    });
  });

  app.get('/api/store-info', (_req, res) => {
    res.json({
      storeName: 'DEALBO PARFUM',
      tagline: 'No te vayas sin oler bien',
      slogan: 'Perfumes y Fragancias Seleccionadas',
      locations: ['Jardín América, Misiones', 'Posadas, Misiones'],
      instagram: 'https://instagram.com/dealbo.parfum',
      whatsapp: 'https://wa.me/5493743542289',
      features: [
        'Sincronización en tiempo real con Firestore',
        'Stock y precios actualizados al instante',
        'Envíos en el día en Jardín América y Posadas',
        'Garantía de originalidad'
      ]
    });
  });

  // Vite middleware for development vs Static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DEALBO PARFUM Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
