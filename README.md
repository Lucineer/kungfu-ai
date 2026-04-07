# kungfu-ai 🥋
Skill injection for your repository-native agents.

Your codebase has specific patterns and needs. This worker injects those patterns into an agent's reasoning loop, aiming to align its thinking with your context.

**Live Instance:** https://kungfu-ai.casey-digennaro.workers.dev

---

## Try it now
You can call the live endpoint to test skill injection. No API keys required. To modify or self-host, fork the repository.

## The difference
This is a skill dojo for the Cocapn Fleet. It inserts structured capability patterns into an agent's context before it reasons, unlike tools that run commands after a decision is made.

*   Runs on Cloudflare Workers with zero runtime dependencies.
*   Skills are injected at reasoning time.
*   Tracks a simple mastery progression (belt system).
*   Fork-first design: you are meant to run your own instance.

---

## Quick Start
1.  Fork this repository.
2.  Clone it, then deploy with `npx wrangler deploy`.
3.  Edit skills and progression rules directly in the source.

## How it works
This worker integrates with the Cocapn Fleet protocol. It serves validated skill patterns from Cloudflare KV storage to an agent. Each skill includes a definition and simulation test cases. A basic belt system tracks usage.

## Features
- **Skill Injection:** Provides context patterns before an agent reasons.
- **Belt Progression:** Tracks skill usage with a simple white-to-black belt metaphor.
- **Simulation Tests:** Each skill includes test scenarios for validation.
- **Vessel Agnostic:** Designed to work with Cocapn Fleet agents.
- **Self-Hosted:** You run it. Your skills stay with your code.
- **Zero Dependencies:** The runtime is a single Cloudflare Worker.

## One Limitation
Skill effectiveness is influenced by the agent's underlying model and how well the skill patterns are defined. Poorly crafted skills may not improve reasoning.

## Add Your Own Skills
You can extend the `Skill` interface in the source code. Define the pattern, a prompt template, and validation simulations.

## Contributing
Fork the repository, make your changes on a feature branch, and open a pull request. Please include tests for new skills.

## License
MIT License · Superinstance & Lucineer (DiGennaro et al.)

---

<div align="center">
  <a href="https://the-fleet.casey-digennaro.workers.dev">The Fleet</a> · <a href="https://cocapn.ai">Cocapn</a>
</div>