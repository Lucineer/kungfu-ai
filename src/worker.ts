// ═══════════════════════════════════════════════════════════════════════════
// kungfu-ai — The Dojo ("I Know Kung Fu")
// Skill injection, simulation, and belt progression for Cocapn agents.
// Reshapes the inside of the model, not bolt-on tools.
// Equipment-agnostic skills that work across vessel types.
//
// Superinstance & Lucineer (DiGennaro et al.) — 2026-04-03
// ═══════════════════════════════════════════════════════════════════════════

const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*;";

interface Env { DOJO_KV: KVNamespace; }

// ── Types ──

type Belt = 'white' | 'yellow' | 'green' | 'blue' | 'brown' | 'black';

interface Skill {
  id: string;
  name: string;
  description: string;
  category: 'reasoning' | 'coding' | 'creative' | 'analysis' | 'communication' | 'planning' | 'debugging' | 'optimization';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'master';
  requiredBelt: Belt;
  patterns: string[];        // few-shot examples
  promptTemplate: string;    // system prompt injection
  compatibleVessels: string[];
  compatibleProviders: string[];
  simulations: Simulation[];
  stats: { attempts: number; passes: number; avgScore: number; };
  author: string;
  version: string;
  createdAt: number;
}

interface Simulation {
  id: string;
  skillId: string;
  scenario: string;           // the test case
  expectedBehavior: string;   // what success looks like
  difficulty: number;         // 0-1
  vesselType: string;         // which vessel this simulates
  timeLimit: number;          // seconds
  tokenBudget: number;
  results: SimResult[];
}

interface SimResult {
  agentId: string;
  score: number;              // 0-1
  tokensUsed: number;
  timeTaken: number;
  passed: boolean;
  feedback: string;
  timestamp: number;
}

interface AgentProfile {
  id: string;
  name: string;
  repoUrl: string;
  belt: Belt;
  skills: { skillId: string; level: number; lastPracticed: number; }[];
  simHistory: SimResult[];
  totalSims: number;
  passRate: number;
  bestScores: Record<string, number>;
  createdAt: number;
  updatedAt: number;
}

const BELT_ORDER: Belt[] = ['white', 'yellow', 'green', 'blue', 'brown', 'black'];
const BELT_XP: Record<Belt, number> = { white: 0, yellow: 3, green: 10, blue: 25, brown: 50, black: 100 };
const BELT_EMOJI: Record<Belt, string> = { white: '🤍', yellow: '💛', green: '💚', blue: '💙', brown: '🤎', black: '🖤' };

function nextBelt(current: Belt, passedSims: number): Belt {
  if (passedSims >= BELT_XP.black) return 'black';
  for (const b of BELT_ORDER) {
    if (passedSims >= BELT_XP[b]) continue;
    return b;
  }
  return 'black';
}

// ── Landing Page ──

function landingPage(): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>KungFu.ai — The Dojo</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui;background:#0a0a1a;color:#e2e8f0}
.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:2rem;background:radial-gradient(ellipse at 50% 0%,#1a0a2e 0%,#0a0a1a 70%)}
.hero h1{font-size:clamp(2rem,5vw,3.5rem);background:linear-gradient(135deg,#f59e0b,#ef4444,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:.5rem}
.hero .sub{font-size:1.1rem;color:#64748b;margin-bottom:2rem}
.hero p{color:#94a3b8;max-width:700px;line-height:1.7;margin:0 auto 1.5rem}
.quote{font-style:italic;color:#f59e0b;font-size:1.2rem;margin-bottom:2rem}
.btn{display:inline-block;padding:.7rem 1.8rem;border-radius:10px;text-decoration:none;font-weight:600;transition:transform .2s}
.btn-primary{background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff}
.btn:hover{transform:translateY(-2px)}
.belts{display:flex;justify-content:center;gap:1.5rem;padding:2rem;flex-wrap:wrap}
.belt{display:flex;flex-direction:column;align-items:center;gap:.25rem;padding:1rem;background:#111;border:1px solid #1e293b;border-radius:12px;min-width:100px}
.belt .emoji{font-size:2rem}.belt .name{font-size:.8rem;color:#94a3b8}.belt .xp{font-size:.7rem;color:#64748b}
.sections{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;padding:4rem 2rem;max-width:1100px;margin:0 auto}
.section{background:#111;border:1px solid #1e293b;border-radius:12px;padding:1.5rem}
.section h3{margin-bottom:.5rem;color:#f59e0b}
.section p{color:#94a3b8;font-size:.85rem;line-height:1.6}
.distinction{padding:4rem 2rem;background:#0d0d1a;text-align:center}
.distinction h2{color:#7c3aed;margin-bottom:1rem}
.dist-grid{display:grid;grid-template-columns:1fr 1fr;gap:2rem;max-width:800px;margin:0 auto}
.dist-card{background:#111;border-radius:12px;padding:1.5rem;text-align:left}
.dist-card h4{margin-bottom:.5rem}
.dist-card p{color:#94a3b8;font-size:.85rem}
footer{text-align:center;padding:2rem;color:#475569;font-size:.8rem}
</style></head><body>
<div class="hero"><div>

      <img src="https://cocapn-logos.casey-digennaro.workers.dev/img/cocapn-logo-v1.png" alt="Cocapn" style="width:64px;height:auto;margin-bottom:.5rem;border-radius:8px;display:block;margin-left:auto;margin-right:auto">
      <h1>KungFu.ai</h1>
<div class="sub">The Dojo</div>
<p class="quote">"I know kung fu."</p>
<p>The catalog rigs your mech. The dojo trains your pilot. Skill injection reshapes the inside of the model — prompt patterns, few-shot examples, custom weights — so your agent handles the storm it's heading into.</p>
<a href="/app" class="btn btn-primary">Enter the Dojo</a>
</div></div>
<div class="belts">
<div class="belt"><div class="emoji">🤍</div><div class="name">White</div><div class="xp">0 sims</div></div>
<div class="belt"><div class="emoji">💛</div><div class="name">Yellow</div><div class="xp">3 sims</div></div>
<div class="belt"><div class="emoji">💚</div><div class="name">Green</div><div class="xp">10 sims</div></div>
<div class="belt"><div class="emoji">💙</div><div class="name">Blue</div><div class="xp">25 sims</div></div>
<div class="belt"><div class="emoji">🤎</div><div class="name">Brown</div><div class="xp">50 sims</div></div>
<div class="belt"><div class="emoji">🖤</div><div class="name">Black</div><div class="xp">100 sims</div></div>
</div>
<div class="sections">
<div class="section"><h3>🥋 Skill Injection</h3><p>Not equipment — training. Reshape the model's behavior with prompt patterns, few-shot examples, and simulation-tested techniques. Equipment bolts on; skills become part of the agent.</p></div>
<div class="section"><h3>🏟️ Simulation Arena</h3><p>Test skills against realistic scenarios before deployment. Each sim has a scenario, expected behavior, time limit, and token budget. Pass enough sims and you belt up.</p></div>
<div class="section"><h3>📊 Belt Progression</h3><p>White → Yellow → Green → Blue → Brown → Black. Belts are evidence, not self-reported. Every belt requires passing simulations. Your portfolio shows the work.</p></div>
<div class="section"><h3>🎯 Equipment-Agnostic</h3><p>Skills work across any vessel. A reasoning skill learned in studylog-ai applies to dmlog-ai. The pilot's training transfers, regardless of what they're driving.</p></div>
</div>
<div class="distinction">
<h2>Rigging vs Training</h2>
<div class="dist-grid">
<div class="dist-card" style="border:1px solid #3b82f6"><h4 style="color:#60a5fa">🔧 Catalog (cocapn.com)</h4><p>Bolt-on equipment. STT modules, vision systems, memory layers. External tools that plug into slots. <em>"Guns, lots of guns."</em></p></div>
<div class="dist-card" style="border:1px solid #f59e0b"><h4 style="color:#fbbf24">🥋 Dojo (kungfu-ai)</h4><p>Internal reshaping. Prompt patterns, few-shot skills, simulation training. The pilot learns kung fu. Equipment is useless without a trained pilot.</p></div>
</div>
</div>
<footer>Superinstance & Lucineer (DiGennaro et al.) — The catalog rigs the mech. The dojo trains the pilot.</footer>
</body></html>`;
}

// ── Worker ──

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const h = { 'Content-Type': 'application/json', 'Content-Security-Policy': CSP };
    const hh = { 'Content-Type': 'text/html;charset=UTF-8', 'Content-Security-Policy': CSP };

    if (url.pathname === '/') return new Response(landingPage(), { headers: hh });
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', vessel: 'kungfu-ai', timestamp: Date.now() }), { headers: h });
    }

    // ── Skills API ──

    if (url.pathname === '/api/skills' && request.method === 'GET') {
      const cat = url.searchParams.get('category');
      const list = await env.DOJO_KV.list({ prefix: 'skill:', limit: 100 });
      const results: Skill[] = [];
      for (const key of list.keys) {
        const skill = await env.DOJO_KV.get<Skill>(key.name, 'json');
        if (skill && (!cat || skill.category === cat)) results.push(skill);
      }
      return new Response(JSON.stringify(results), { headers: h });
    }

    if (url.pathname === '/api/skills' && request.method === 'POST') {
      const body = await request.json() as Omit<Skill, 'id' | 'stats' | 'createdAt'>;
      const id = body.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString(36);
      const skill: Skill = { ...body, id, stats: { attempts: 0, passes: 0, avgScore: 0 }, createdAt: Date.now() };
      await env.DOJO_KV.put(`skill:${id}`, JSON.stringify(skill));
      return new Response(JSON.stringify(skill), { headers: h, status: 201 });
    }

    if (url.pathname.startsWith('/api/skills/') && url.pathname.endsWith('/try') && request.method === 'POST') {
      const id = url.pathname.split('/')[3];
      const { agentId, response } = await request.json() as { agentId: string; response: string };
      const skill = await env.DOJO_KV.get<Skill>(`skill:${id}`, 'json');
      if (!skill) return new Response(JSON.stringify({ error: 'Skill not found' }), { status: 404, headers: h });

      // Find a simulation for this skill
      const sim = skill.simulations[0];
      if (!sim) return new Response(JSON.stringify({ error: 'No simulations for this skill' }), { status: 400, headers: h });

      // Simple scoring: check if response addresses expected behavior
      const expected = sim.expectedBehavior.toLowerCase();
      const resp = response.toLowerCase();
      const keywordHits = expected.split(/\s+/).filter(w => w.length > 4 && resp.includes(w));
      const score = Math.min(1, keywordHits.length / Math.max(1, expected.split(/\s+/).filter(w => w.length > 4).length));
      const passed = score >= 0.5;

      const result: SimResult = { agentId, score, tokensUsed: 0, timeTaken: 0, passed, feedback: passed ? 'Addresses key concepts' : 'Missing core elements', timestamp: Date.now() };
      sim.results.push(result);
      skill.stats.attempts++;
      if (passed) skill.stats.passes++;
      skill.stats.avgScore = +(skill.simulations.flatMap(s => s.results).reduce((a, r) => a + r.score, 0) / Math.max(1, skill.simulations.flatMap(s => s.results).length)).toFixed(3);
      await env.DOJO_KV.put(`skill:${id}`, JSON.stringify(skill));

      // Update agent profile
      const agent = await env.DOJO_KV.get<AgentProfile>(`agent:${agentId}`, 'json') || {
        id: agentId, name: agentId, repoUrl: '', belt: 'white' as Belt, skills: [],
        simHistory: [], totalSims: 0, passRate: 0, bestScores: {}, createdAt: Date.now(), updatedAt: Date.now(),
      };
      agent.simHistory.push(result);
      agent.totalSims++;
      agent.passRate = +(agent.simHistory.filter(r => r.passed).length / agent.totalSims).toFixed(3);
      if (!agent.bestScores[id] || score > agent.bestScores[id]) agent.bestScores[id] = score;
      const existingSkill = agent.skills.find(s => s.skillId === id);
      if (existingSkill) { existingSkill.level = Math.max(existingSkill.level, score); existingSkill.lastPracticed = Date.now(); }
      else agent.skills.push({ skillId: id, level: score, lastPracticed: Date.now() });
      agent.belt = nextBelt(agent.belt, agent.simHistory.filter(r => r.passed).length);
      agent.updatedAt = Date.now();
      await env.DOJO_KV.put(`agent:${agentId}`, JSON.stringify(agent));

      return new Response(JSON.stringify({ result, belt: agent.belt, skillStats: skill.stats }), { headers: h });
    }

    // ── Agent Profiles ──

    if (url.pathname.startsWith('/api/agents/') && request.method === 'GET') {
      const id = url.pathname.split('/')[3];
      const agent = await env.DOJO_KV.get<AgentProfile>(`agent:${id}`, 'json');
      if (!agent) return new Response(JSON.stringify({ error: 'Agent not found' }), { status: 404, headers: h });
      return new Response(JSON.stringify({ ...agent, beltEmoji: BELT_EMOJI[agent.belt] }), { headers: h });
    }

    // ── Leaderboard ──

    if (url.pathname === '/api/leaderboard' && request.method === 'GET') {
      const list = await env.DOJO_KV.list({ prefix: 'agent:', limit: 100 });
      const agents: (AgentProfile & { beltEmoji: string })[] = [];
      for (const key of list.keys) {
        const agent = await env.DOJO_KV.get<AgentProfile>(key.name, 'json');
        if (agent) agents.push({ ...agent, beltEmoji: BELT_EMOJI[agent.belt] });
      }
      agents.sort((a, b) => BELT_ORDER.indexOf(b.belt) - BELT_ORDER.indexOf(a.belt) || b.passRate - a.passRate);
      return new Response(JSON.stringify(agents), { headers: h });
    }

    // ── A2A: Machine-readable skill catalog ──

    if (url.pathname === '/api/a2a/skills') {
      const list = await env.DOJO_KV.list({ prefix: 'skill:', limit: 100 });
      const skills: { name: string; category: string; difficulty: string; belt: string; passRate: number; }[] = [];
      for (const key of list.keys) {
        const skill = await env.DOJO_KV.get<Skill>(key.name, 'json');
        if (skill) skills.push({ name: skill.name, category: skill.category, difficulty: skill.difficulty, belt: skill.requiredBelt, passRate: skill.stats.avgScore });
      }
      return new Response(JSON.stringify({ version: '1.0', count: skills.length, skills }), { headers: h });
    }

    return new Response('Not found', { status: 404 });
  },
};
