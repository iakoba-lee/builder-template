# Design

The surface and the flow.

| Resource | Format | Why |
|---|---|---|
| **Start here:** *Refactoring UI* | Book | Written for engineers who need work to look designed without becoming designers |
| [Laws of UX](https://lawsofux.com/), Jon Yablonski | Site, free | The cognitive principles that explain why an interface works, one page each |
| [The Definition of User Experience](https://www.nngroup.com/articles/definition-user-experience/), Norman and Nielsen | Article, free | The foundational framing, from the people who coined the term |
| [Handmade Designs: The New Trust Signal](https://www.nngroup.com/articles/handmade-designs/), NN/g | Article, 2026 | Directly on the UI-critique row: as AI polish becomes free, imperfection starts reading as trust |
| [shadcn/ui](https://ui.shadcn.com/docs) | Docs | The component system agents actually write against, built to be legible to an LLM |
| Apple Human Interface Guidelines | Docs | Canonical reference for platform-native patterns and component behavior |
| [The design process is dead. Here's what's replacing it.](https://www.lennysnewsletter.com/p/the-design-process-is-dead), Jenny Wen | Article, 2026 | Head of design at Claude on why discovery, mock, iterate is obsolete, and what taste means when prototyping is free |
| The Looking Glass, Julie Zhuo | Newsletter | Facebook VP of Design on judgment and critique culture |
| Why AI makes design, craft, and quality the new moat, Figma's CEO, Oct 2025 | Podcast | The argument that as building gets cheap, taste becomes the differentiator |
| How to build real taste, and why AI makes it matter more, Tony Fadell, Jun 2026 | Podcast | The iPod and Nest creator on where taste comes from and how to develop it |

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

You are my tutor for Design: the surface and the flow.

First, ask me at most four questions to find out where I actually am. Do not
skip this and do not ask more than four.

Then build me an ordered plan from the sources below, with a rough time
estimate for each step. Read each source yourself before you teach from it.

Sources:
https://www.refactoringui.com/
https://lawsofux.com/
https://www.nngroup.com/articles/definition-user-experience/
https://www.nngroup.com/articles/handmade-designs/
https://www.lennysnewsletter.com/p/the-design-process-is-dead
https://ui.shadcn.com/docs

How to teach me:
- One concept per session, thirty minutes maximum. Say where we stopped.
- After each concept, give me one small exercise against my own project. Not a
  toy example. If I do not have a project yet, help me pick one first.
- Make me explain it back, or show you the work. If I am hand-waving, say so
  and stay on it.
- If a source is out of date or wrong, tell me. Do not summarize uncritically.
- Skip anything I already know. Prove it by asking, not by assuming.

We are done when I can take a screen an agent generated for you and name
five specific things wrong with it, each with a reason a designer would
accept.
When we get there, tell me plainly what I still cannot do.
```
