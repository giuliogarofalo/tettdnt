import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'crypto-api-proxy',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.includes('/api/cryptos')) {
            try {
              const url = new URL(req.url, 'http://localhost');
              const page = parseInt(url.searchParams.get('page') || '0') + 1;

              const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=4&page=${page}`
              );
              const data = await response.json();

              const transformed = {
                count: 100,
                results: data.map(coin => ({
                  id: coin.id,
                  name: coin.symbol.toUpperCase(),
                  price: coin.current_price,
                  description: coin.name,
                })),
              };

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(transformed));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }
          next();
        });
      },
    },
  ],
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
  },
});
