# kungfu-ai 🥋

You know that feeling when your agent gets the correct final answer, but took every wrong turn along the way? kungfu-ai is a minimal tool designed to help with that.

This Cloudflare Worker inserts structured reasoning patterns into your agent’s context *before* it begins a task. You provide the raw context; it returns that same context with matched, skill-based patterns prepended.

**Live instance:** https://kungfu-ai.casey-digennaro.workers.dev

---

## Why This Exists
You don't need another framework. You need your existing agent to skip fewer steps and handle edge cases more reliably. This is a single, deployable component that sits between your task setup and your LLM call.

---

## Quick Start
1.  **Fork** this repository. No signup or API keys are required.
2.  **Deploy** to Cloudflare Workers with one command: `npx wrangler deploy`.
3.  **Edit** the skill patterns in the single source file to match your needs.

---

## Features
- **Pre-thought Injection:** Patterns are inserted at the start of your agent's context window, aiming to shape its initial reasoning.
- **Skill Gating:** Basic patterns are available immediately; more advanced ones are unlocked after simulated proficiency checks.
- **Built-in Tests:** Each skill includes validation scenarios you run before enabling it live.
- **Runtime Agnostic:** Returns a modified context string. It works with any LLM or agent system you already use.
- **Zero Dependencies:** One file. No `npm install` required.
- **Fork-First Model:** You deploy and control your own instance. No upstream updates will affect you.

---

## How It Is Different
1.  It **modifies your context**, not your LLM call. You integrate it into your existing stack without replacing any core logic.
2.  Skills must be validated before they are fully accessible, aiming to reduce misapplication.
3.  You own your fork. There is no central service; we cannot push changes to your deployment.

## One Specific Limitation
The pattern-matching logic currently evaluates a maximum of 15 distinct skills per request. If your context triggers more, only the first 15 by priority order will be processed.

---

## Define Your Own Skills
You extend the base `Skill` interface in the source to create patterns, guardrails, and tests specific to your agent's domain.

<div style="text-align:center;padding:16px;color:#64748b;font-size:.8rem"><a href="https://the-fleet.casey-digennaro.workers.dev" style="color:#64748b">The Fleet</a> &middot; <a href="https://cocapn.ai" style="color:#64748b">Cocapn</a></div>