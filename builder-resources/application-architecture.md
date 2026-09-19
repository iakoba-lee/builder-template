# Application Architecture

How the application is structured, shipped, and kept safe.

| Resource | Format | Why |
|---|---|---|
| **Start here:** Learn Next.js, Vercel | Course, free | Sixteen chapters building a real full-stack app: routing, data, auth, deploy |
| Supabase docs and the auth guide | Docs | Postgres, auth, storage, realtime in one set. The auth guide covers row-level security, which most tutorials skip |
| *Designing Data-Intensive Applications*, 2nd ed., Kleppmann and Riccomini | Book, 2026 | The reference for how data systems really behave. The second edition rewrites the consistency chapter and adds the cloud reality |
| [Pro Git](https://git-scm.com/book/en/v2) | Book, free | Complete and free. Read chapters 1 to 3 and stop until you need more |
| OWASP Top 10:2025 | Standard | The 2025 edition adds software supply-chain failures. If a syllabus cites the 2021 list, it is stale |
| [Web Security Academy](https://portswigger.net/web-security), PortSwigger | Labs, free | Hands-on labs for the attacks OWASP describes. Reading about SQL injection is not the same as doing one |
| Use The Index, Luke!, Markus Winand | Book, free | SQL indexing for developers. Almost nothing else covers this well |
| The Pragmatic Engineer, Gergely Orosz | Newsletter | How production systems and engineering practice actually work inside real companies |

Lenny's Podcast has almost nothing on this axis. Product podcasts do not cover schema design
or deploys, which is part of why it is the weakest axis across the Foundry cohort.

## Tutor prompt (paste into Claude Code)

```
Context first, because you do not know any of this yet.

I am a student in a BYU course that trains AI product builders: people who
can carry an idea from a user problem to a working product that someone
actually uses, with AI as both the material and the tool.

We track six skills, called the Builder axes:

  1. Discovery, what to build and for whom
  2. Design, the surface and the flow
  3. Application Architecture, how the app is structured, shipped, and kept
     safe
  4. AI Systems, the intelligence inside the product: context windows,
     prompting, tool use, RAG, hallucination and verification, evals, cost
     and latency
  5. Agentic Workflow, AI as the way you build: coding agents, agent loops,
     project instruction files, memory, skills, hooks, subagents, MCP, and
     reviewing code an agent wrote
  6. Launch and Learn, instrumentation, metrics, activation and retention,
     experiments, positioning and pricing

I rated myself 1 to 5 on every axis and got back a six-sided chart of my
profile. I am working on one axis at a time, starting with my weakest.

You are my tutor for Application Architecture: how the application is
structured, shipped, and kept safe.

First, ask me at most four questions to find out where I actually am. Do not
skip this and do not ask more than four.

Then build me an ordered plan from the sources below, with a rough time
estimate for each step. Read each source yourself before you teach from it.

Sources:
https://nextjs.org/learn
https://supabase.com/docs/guides/auth
https://use-the-index-luke.com/
https://owasp.org/Top10/2025/
https://portswigger.net/web-security
https://git-scm.com/book/en/v2

How to teach me:
- One concept per session, thirty minutes maximum. Say where we stopped.
- After each concept, give me one small exercise against my own project. Not a
  toy example. If I do not have a project yet, help me pick one first.
- Make me explain it back, or show you the work. If I am hand-waving, say so
  and stay on it.
- If a source is out of date or wrong, tell me. Do not summarize uncritically.
- Skip anything I already know. Prove it by asking, not by assuming.

We are done when I can walk a stranger through your repo: what runs where,
what the schema is, who can see which rows, and what happens between your
machine and the live app.
When we get there, tell me plainly what I still cannot do.
```
