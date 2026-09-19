# Agentic Workflow

AI as the way you build. This axis moves fastest, so favor docs and primary sources over books.

| Resource | Format | Why |
|---|---|---|
| **Start here:** [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents), Anthropic | Article | The shared vocabulary of the field: workflows versus agents, patterns over frameworks |
| [Claude Code documentation](https://code.claude.com/docs/en/overview) | Docs | CLAUDE.md, memory, skills, hooks, subagents, and MCP, all in one place. Note the URL moved in 2025 |
| Anthropic Academy | Courses, free | Around 23 free courses with certificates, including Claude Code in Action, MCP, skills, and subagents |
| [Agentic Engineering Patterns](https://simonwillison.net/guides/agentic-engineering-patterns/), Simon Willison | Guide, free | Six chapters on principles, testing, and annotated real prompts. The best free text on loop design |
| [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system), Anthropic | Article | Orchestrator and subagent architecture, when parallelism wins, and the token cost it carries |
| [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents), Anthropic | Article | Read before you write an MCP server, not after |
| [Model Context Protocol](https://modelcontextprotocol.io) and AGENTS.md | Specs | Both are now multi-vendor open standards rather than proprietary to one company |
| [How far can we push AI autonomy in code generation?](https://martinfowler.com/articles/pushing-ai-autonomy.html), Birgitta Böckeler | Article | The most rigorous treatment of where human review is still non-negotiable |
| Vibe coding and agentic engineering are getting closer than I'd like, Simon Willison | Article | An honest admission that review discipline is eroding, from one of its advocates |
| What happens after coding is solved, Boris Cherny, Feb 2026 | Podcast | The head of Claude Code on where agentic development is going. The most watched episode on this list |
| Claude Code and Cowork, Fiona Fung, Jun 2026 | Podcast | The follow-up, four months later, on how the workflow changed again |

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

You are my tutor for Agentic Workflow: AI as the way you build.

First, ask me at most four questions to find out where I actually am. Do not
skip this and do not ask more than four.

Then build me an ordered plan from the sources below, with a rough time
estimate for each step. Read each source yourself before you teach from it.

Sources:
https://www.anthropic.com/engineering/building-effective-agents
https://code.claude.com/docs/en/overview
https://simonwillison.net/guides/agentic-engineering-patterns/
https://www.anthropic.com/engineering/writing-tools-for-agents
https://www.anthropic.com/engineering/multi-agent-research-system
https://martinfowler.com/articles/pushing-ai-autonomy.html
https://modelcontextprotocol.io

How to teach me:
- One concept per session, thirty minutes maximum. Say where we stopped.
- After each concept, give me one small exercise against my own project. Not a
  toy example. If I do not have a project yet, help me pick one first.
- Make me explain it back, or show you the work. If I am hand-waving, say so
  and stay on it.
- If a source is out of date or wrong, tell me. Do not summarize uncritically.
- Skip anything I already know. Prove it by asking, not by assuming.

We are done when I can set your project up so an agent does good work in it,
and review what it wrote well enough to catch what it got wrong.
When we get there, tell me plainly what I still cannot do.
```
