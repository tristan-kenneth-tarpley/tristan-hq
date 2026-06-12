---
title: The Role of Senior+ Engineers in 2026
date: 2026-05-18
description: Thoughts on how senior+ engineers scale their impact in an engineering world built around LLMs.
---

# The Role of Senior+ Engineers in 2026

The practices that make a codebase legible to an agent are the same ones that make it legible to a new engineer joining the team, a tired senior engineer reviewing a PR at 10pm, or a team from another org making a contribution to your service. This isn't a new observation. What's changed is that LLMs make it easier to do it, as well as increase the cost of _not_ doing it.

Humans are still equally responsible for codebase design, but the role has shifted. Previously, senior+ engineers scaled their impact through tech specs and code reviews, downstream of the primary "thinking" work. Now, their impact should largely move upstream by articulating design principles, how to review code against those design principles, and encoding hard-won wisdom into artifacts that agents and humans can operate off of.

---

For most teams, the real system of record for design intent has never been documentation. It's been people. Senior+ engineers carry the principles in their heads and distribute them through code reviews, design discussions, and the conversation that happens when a new engineer touches a service for the first time: *"before you go too far, there are a few things you should know."* Many good engineers have become proficient writers, able to clearly articulate complex technical concepts in a digestible way. But those are usually discovered via "Hey, there's a doc about this, hopefully it helps."

 Documentation has been the least bad alternative, but an inherently imperfect one. Stale docs are often worse than no docs: a gap sends you to the source. The problem is treating docs as a historical record rather than a live cache of current design thinking. When the thinking changes, the cache needs to be invalidated. Maintaining that discipline across an entire engineering organization is virtually impossible.

Agents inherit this problem and amplify it. They can't hop on a call, and they do architectural drift at scale.

---

**What to encode.** The instinct is to document architecture through diagrams, data flows, service maps. Architecture is tactics, and tactics change. What doesn't change are design principles: why the system is shaped the way it is, what tradeoffs were made consciously, what you'd sacrifice and what you wouldn't. Give agents a map, not a blueprint. Principles travel. Blueprints rot.

| Design principle                                                                                                                                        | Architecture                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| User data never leaves the service that owns it — other services request it via API, never direct DB access                                             | Checkout calls `/internal/users/{id}/payment-methods` on the payments service                                 |
| Prefer async over sync for anything that doesn't need an immediate response — degrade gracefully rather than block                                      | Email notifications go through SQS → Lambda with a 3-retry exponential backoff policy                         |
| Every step of the AI loop should be inspectable without reading raw logs — tool calls, model responses, and spans are first-class observability targets | LLM traces go to Langfuse, mounted as an MCP server in Claude Code for cross-referencing with production code |

The principle survives a rewrite. The architecture doesn't have to.

**Where it lives.** Design context isn't centralized. It's scoped to the code that implements that design. Context files co-located with the code they describe work better than one top-level document that becomes either too abstract or too brittle to maintain. The specific convention matters less than having one: pick a name, document it in your top-level `CLAUDE.md` or `AGENTS.md`, and tell agents to read those files when they encounter them. It's less of, "here is the tech spec," and more of "here's why it's designed like this and what's important to maintain."

**Code review guides.** Before reviewing a PR that touches a given service, an agent reads that service's review guide. It's not a formatting checklist, but the design goals, the tradeoffs the team has made, the patterns it's moving toward. The same thing a senior engineer would walk you through before your first PR. Short, opinionated, updated when intent evolves.

---

While most of the focus in the industry has been on code generation, the same shift applies to observability and product analysis. At Webflow, running Claude Code in the monorepo connected to LLM and application observability MCPs collapses that gap. The agent has production data, the ability to slice it, and the ability to read the code that produced it, all at once. An anomaly in a span gets cross-referenced with the code path immediately. 

The qualitative layer matters just as much. Questions like "what were users frustrated about in the last 24 hours" go from hours of analyst work to minutes — and that speed means engineers with the most context are now the ones closest to how users are actually experiencing the product. Find what surfaces real signal, then automate it downstream through scripts, dashboards, skills, and LLM judges.

Did you find a few needles in a haystack of particularly successful users, or particularly frustrated ones? Grab their userId, find their email, reach out to them and get on a call. Talk to your customers.

This is how you move into the role of a true product engineer. Getting closer to the data gets you closer to your customers. The friction for doing this is lower than ever.

---

The friction for encoding design intent has dropped significantly. Agents can help draft these context files from existing code, surface where a spec is underspecified, ask the questions that reveal what's missing. The old excuse of *it's faster to just hop on a call* is harder to defend. The "hopping on a call" still has a place, but it's upstream of the actual code production, where the thinking work must also move.
