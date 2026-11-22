// Local preview server for the built Worker: node tools/serve.mjs  (http://localhost:8787)
import http from 'node:http';
import w from './out/worker.mjs';
http.createServer(async (q, s) => {
  const r = await w.fetch(new Request('http://localhost:8787' + q.url, { headers: q.headers }));
  s.writeHead(r.status, Object.fromEntries(r.headers)); s.end(Buffer.from(await r.arrayBuffer()));
}).listen(8787, () => console.log('preview on http://localhost:8787'));
