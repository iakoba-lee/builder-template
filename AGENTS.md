# AGENTS.md

The project brief every AI agent reads at the start of a session in this repo — Cursor, Codex,
Copilot, and Claude Code (which reaches this file through the one-line `CLAUDE.md` import, since
Claude Code only looks for its own filename). Keep it current. It should let a brand new session
act like a colleague who already knows what you are working on and why.

## What I am building

- **What it is:** A multi-tenant link-in-bio ("Linktree replacement") admin tool with click
  analytics, built as the agency's own product for managing its influencer clients' pages.
- **Who it is for:** Clients of the brand management agency Jacob co-owns — first Custom
  Adventurist, then Kimball AI, then future clients as the agency signs them.
- **My role:** Solo builder. Jacob co-owns the agency with one business partner; Jacob runs
  day-to-day ops, hiring, and delivery, and the partner owns brand, story, marketing, sales,
  and content.
- **Why they would use it:** The agency is paid a percentage of the brand deals it closes for
  its influencer clients. A branded, on-domain link page with real click data is both a deliverable
  for the client and evidence the agency can point to when pitching brand deals.

## Current state

- **This sprint's goal:** Discovery, not a build. Complete 5–10 interviews (creators seeking
  sponsorships, the agency's current clients, and any brands) and write a synthesis of the pains
  creators experience, the solutions they have tried, and the language they use. See
  `sprints/sprint-2-plan.md`. Build ideas deferred from this sprint are in `BACKLOG.md`.
- **Last sprint:** Sprint 1 shipped the multi-tenant link page for Custom Adventurist — see
  `sprints/sprint-1-review.md`.
- **Live at:** Deployed to Vercel (`agency-x-zeta.vercel.app`) and on `customadventurist.com`
  over valid HTTPS (confirmed in the Sprint 1 review).
- **Biggest open risk:** The first client, Custom Adventurist, is the partner's own influencer
  business, not an arm's-length client. Watch that this stays a repeatable agency product
  (provable on the second client next) rather than drifting into bespoke internal tooling for
  that one brand.

## How this repo works

- Non-code work is committed as files, same as code. Interviews, experiments, pricing models,
  and usability findings all live here.
- Specs go in `specs/` and are written before building. When asked to build something
  non-trivial, check for its spec first. If there is none, draft one and confirm it before
  writing code.
- Meaningful choices get a numbered record in `decisions/`, written when the choice is made,
  including what was rejected and why.
- Sprint plans and reviews live in `sprints/`. The plan is committed on day one.
- Never put real names, emails, or phone numbers in this repo. Anonymize.

## Stack and conventions

- **Stack:** Next.js, deployed on Vercel. Supabase for Postgres (multi-tenant tables keyed by
  `client_id`) and magic-link auth. See `decisions/001-stack-choice.md`.
- **Deploy:** Push to `main` → Vercel build → live. Each client's custom domain (e.g.
  `customadventurist.com`) is attached in Vercel, served over Vercel-issued HTTPS.
- **Testing and style:** No test framework yet. `npm run lint` and `npm run build` must both
  pass clean before a push — the build is what type-checks. TypeScript strict, Tailwind for
  styling, Server Components by default with `"use client"` only where a component needs state
  or effects.

## Working with me

- Ask before large refactors or before adding a dependency.
- When I am wrong about something technical, say so directly and explain why.
- Show me the plan before executing anything that touches more than a couple of files.
- This is agency ops, not a personal SaaS. Custom Adventurist (the partner's influencer
  business), Kimball AI (the agency's first outside client), and the partner's personal brand
  are three distinct entities — the agency sits beside them, not inside them. Push back if a
  build mixes those brands, or doesn't clearly help the agency close or deliver brand deals.

## Voice

Copy that users read is plain and confident, with no hype. Say what the thing does and what a
number means, then stop. No exclamation points, no "effortlessly" or "supercharge."

> Your links, your domain, real numbers.

## Self-correcting rules

The "Learned Rules" section at the bottom of this file grows over time. Read it before starting
any task and scan it for constraints that apply to what you are about to do.

- When I correct you, or you make a mistake, immediately append a new rule to "Learned Rules".
- Number rules sequentially and write them as imperatives:
  `N. [CATEGORY] Always/Never do X — because Y.`
- Categories: `[STYLE]`, `[CODE]`, `[ARCH]`, `[TOOL]`, `[PROCESS]`, `[DATA]`, `[UX]`, `[OTHER]`.
- If two rules conflict, the higher-numbered rule wins.
- Never delete a rule. If one becomes obsolete, append a new rule that supersedes it.

Add a rule when I explicitly correct your output, reject an approach or a file, state a
preference ("always use X", "never do Y"), or when you hit a bug caused by a wrong assumption
about this repo. A rule is worth writing only if it would change what a future session does.

## Learned Rules

<!-- New rules are appended below this line. Do not edit above this section. -->

1. [PROCESS] Push to `origin`, never `upstream` — `upstream` is the shared BYU class template,
   `origin` is my fork.
2. [CODE] Both `npm run lint` and `npm run build` must pass before a push — lint alone does not
   type-check.
