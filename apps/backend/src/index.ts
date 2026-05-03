import http from 'http';

export const server = http.createServer((req, res) => {
  if (req.url === '/api/hello' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello from Backend' }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found\n');
  }
});

import { fileURLToPath } from 'url';

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const port = process.env.PORT || 4000;
  server.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}
