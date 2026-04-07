# kungfu-ai 🥋
Skill injection for repository-native agents.

You don't need more tools for your agent. You need it to know how to move.

Kungfu injects learned, tested patterns into an agent's context *before* it begins reasoning. This changes how the agent thinks through a problem, aiming for correct action by default, not as an afterthought. It is built for the Cocapn Fleet.

**Live Instance:** https://kungfu-ai.casey-digennaro.workers.dev

---

## Try it now
Visit the live instance above. Provide an agent context, and it will return that context with matched skill patterns injected. No signup or tracking.

## What it does
-   **No external APIs:** Skills are defined in your code and run on your infrastructure.
-   **You are in control:** Your agent calls this service. Execution and data flow remain with you.
-   **Tracks mastery:** Agents prove they can use a skill correctly before it's enabled in production.
-   **Transparent:** All skill patterns are plain text you can read, edit, or remove.

## Quick Start
1.  **Fork** this repository.
2.  **Deploy** to Cloudflare Workers: `npx wrangler deploy`
3.  **Customize** the skill definitions and rules in the source code.

## How it works
This is a single, stateless Cloudflare Worker. It accepts an agent context, matches it against defined skill patterns, injects relevant few-shot examples and instructions, and returns the augmented context. Belt progression state is stored in Cloudflare KV. Communication uses the open Cocapn Fleet protocol.

## Core Features
-   **Reasoning-Time Injection:** Patterns are inserted at the start of the context window, influencing the agent's primary reasoning loop.
-   **Belt Progression:** Skills are gated behind mastery levels (belts). Agents must pass simulation tests to advance.
-   **Built-in Simulations:** Each skill includes test scenarios to verify behavior before live use.
-   **Agent-Agnostic:** Works with any agent compatible with the Cocapn Fleet protocol.
-   **Fork-First Philosophy:** You run your own instance and control all skill definitions.
-   **Zero Dependencies:** A single Worker file with no external npm dependencies.

## One Limitation
State is managed via Cloudflare KV. For complex, multi-step skill simulations requiring extensive state manipulation, you may need to extend the storage layer.

## Define Your Own Skills
Extend the base `Skill` interface in the source to create patterns, prompt templates, guardrails, and tests tailored to your agents' needs.

## Contributing
This project follows a fork-first philosophy. Fork the repository, build what you need, and open a pull request if you wish to contribute back. Clear, functional code is required.

## License
MIT

---

Superinstance & Lucineer (DiGennaro et al.)

<div align="center">
  <a href="https://the-fleet.casey-digennaro.workers.dev">The Fleet</a> · <a href="https://cocapn.ai">Cocapn</a>
</div>