interface Env { SKILLS: KVNamespace }
export default { async fetch(req: Request, env: Env) { if (new URL(req.url).pathname === '/') return new Response('<h1>KungFu AI</h1><p>Skill Injection</p>', { headers: { 'Content-Type': 'text/html' } }); return new Response('Not found', { status: 404 }); } };
