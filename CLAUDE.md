# CLAUDE.md

Loaded at the start of every Claude Code session in this repo. Keep it current. It should let
a brand new session act like a colleague who already knows what you are working on and why.

## What I am building

- **What it is:** A multi-tenant link-in-bio ("Linktree replacement") admin tool with click
  analytics, built as the agency's own product for managing its influencer clients' pages.
- **Who it is for:** Clients of the brand management agency Jacob co-owns — first Custom
  Adventurist, then Kimball AI, then future clients as the agency signs them.
- **My role:** Solo builder. Jacob co-owns the agency with one business partner; Jacob runs
  day-to-day ops, hiring, and delivery, the partner owns brand, story, marketing, sales, and content.
- **Why they would use it:** The agency is paid a commission on the brand deals it closes for its
  influencer clients. A branded, on-domain link page with real click data is both a deliverable
  for the client and evidence the agency can point to when pitching brand deals.

## Current state

- **This sprint's goal:** Ship the multi-tenant Linktree replacement for Custom Adventurist —
  admin login, content/theme/link management, click tracking, and basic analytics — live on
  `customadventurist.com`. See `sprints/sprint-1-plan.md`.
- **Live at:** Not yet deployed. Target: `customadventurist.com` via Vercel.
- **Biggest open risk:** The first client, Custom Adventurist, is the partner's own influencer business,
  not an arm's-length client. Watch that this stays a repeatable agency product (provable on
  Kimball AI next) rather than drifting into bespoke internal tooling for the partner's brand alone.

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
- **Testing and style:** [fill in as they emerge]

## Working with me

- Ask before large refactors or before adding a dependency.
- When I am wrong about something technical, say so directly and explain why.
- Show me the plan before executing anything that touches more than a couple of files.
- This is agency ops, not a personal SaaS. Custom Adventurist (the partner's influencer business),
  Kimball AI (the agency's first outside client), and the partner's personal brand are three distinct
  entities — the agency sits beside them, not inside them. Push back if a build mixes those
  brands, or doesn't clearly help the agency close or deliver brand deals.

## Voice

Copy that users read sounds like: [2 or 3 adjectives, plus one example line]
