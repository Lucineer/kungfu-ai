import { addNode, addEdge, traverse, crossDomainQuery, findPath, domainStats, getDomainNodes } from './lib/knowledge-graph.js';
import { loadSeedIntoKG, FLEET_REPOS, loadAllSeeds } from './lib/seed-loader.js';

interface Env { SKILLS: KVNamespace; KG: KVNamespace }
export default {
  async fetch(req: Request, env: Env) {
    const url = new URL(req.url);
    const path = url.pathname;

  if (path === '/health') {
    return new Response(JSON.stringify({ status: 'ok', repo: 'kungfu-ai', timestamp: Date.now() }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
    const method = req.method;
    const _kj = (d: any, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });

    if (path === '/api/kg' && method === 'GET') return _kj({ domain: url.searchParams.get('domain') || 'kungfu-ai', nodes: await getDomainNodes(env, url.searchParams.get('domain') || 'kungfu-ai') });
    if (path === '/api/kg/explore' && method === 'GET') {
      const nid = url.searchParams.get('node');
      if (!nid) return _kj({ error: 'node required' }, 400);
      return _kj(await traverse(env, nid, parseInt(url.searchParams.get('depth') || '2'), url.searchParams.get('domain') || undefined));
    }
    if (path === '/api/kg/cross' && method === 'GET') return _kj({ query: url.searchParams.get('query') || '', domain: url.searchParams.get('domain') || 'kungfu-ai', results: await crossDomainQuery(env, url.searchParams.get('query') || '', url.searchParams.get('domain') || 'kungfu-ai') });
    if (path === '/api/kg/domains' && method === 'GET') return _kj(await domainStats(env));
    if (path === '/api/kg/sync' && method === 'POST') return _kj(await loadAllSeeds(env, FLEET_REPOS));
    if (path === '/api/kg/seed' && method === 'POST') { const b = await req.json(); return _kj(await loadSeedIntoKG(env, b, b.domain || 'kungfu-ai')); }

    if (path === '/') return new Response('<h1>KungFu AI</h1><p>Skill Injection — Phase 4B Knowledge Graph Active</p>', { headers: { 'Content-Type': 'text/html' } });

  if (path === '/api/efficiency' && request.method === 'GET') {    return new Response(JSON.stringify({ totalCached: 0, totalHits: 0, cacheHitRate: 0, tokensSaved: 0, repo: 'kungfu-ai', timestamp: Date.now() }), { headers: { 'Content-Type': 'application/json', ...corsHeaders() } });  }
    return new Response('Not found', { status: 404 });
  }
};
