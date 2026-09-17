# Agency Link Page Platform

> A multi-tenant Linktree replacement with click analytics, built by a creator-growth agency for
> its own influencer clients. First client: Custom Adventurist.

**Live:** Not yet deployed. Target: `customadventurist.com`
**Built by:** Jacob, MSB 341 Product Management, BYU

## Context

Fill this in during Sprint 1 and keep it current. Every sprint is read against it.

- **What I am building:** A multi-tenant link-in-bio admin tool the agency runs for its clients'
  public pages — content, theme, links, and click analytics, all keyed by client.
- **Who it is for:** The agency's brand-deal clients. Custom Adventurist first, Kimball AI next.
  Not a consumer product — the admin users are the agency team, the public page visitors are
  each client's audience.
- **My role:** Solo builder. co-owner of the agency itself with one business partner — Jacob runs
  day-to-day ops, hiring, and delivery; the partner owns brand, story, marketing, sales, and content.
- **My user:** The agency's clients. This product serves them; it is not part of Custom
  Adventurist's own brand, Kimball AI's own brand, or the partner's personal brand — keep those three
  distinct even as the tooling serves all of them.

If your situation changes, revise this and note what changed. That is normal; a silent
mismatch between this file and your work is not.

## What is in this repo

| Folder | What lives here |
|---|---|
| `sprints/` | One plan and one review per sprint |
| `discovery/` | Interviews, personas, what you learned about your user |
| `design/` | Flows, screens, usability test notes |
| `specs/` | One spec per feature, written before building it |
| `decisions/` | Numbered records of what you decided and why |
| `gtm/` | Launch, channels, copy, experiments |
| `metrics/` | What you measure and what it says |
| `app/`, `lib/`, `public/` | The build itself: the Next.js admin panel and public pages |
| `supabase/migrations/` | Ordered SQL for the multi-tenant schema |

The template put code under `product/`; this repo keeps the Next.js app at the root instead,
because the framework expects `app/` there and Vercel builds from the repository root.

Non-code work belongs here too. An interview, a pricing model, a landing page draft, and a
usability finding are all artifacts, and they get committed like anything else.

If you build an AI feature, put its eval set in `product/evals/`. A test set is how you know
whether a change to a prompt helped or hurt.

## Running it

Next.js on Vercel, with Supabase for Postgres (multi-tenant tables, one row per client per
resource) and magic-link auth (`decisions/001-stack-choice.md`).

```bash
npm install
cp .env.example .env.local   # then fill in values from the Supabase dashboard
npm run dev                  # http://localhost:3000
```

`.env.local` needs the three variables listed in `.env.example`: `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` for the browser client, plus `SUPABASE_SERVICE_ROLE_KEY` for
server-side work that bypasses row-level security. The service role key must never be prefixed
with `NEXT_PUBLIC_`.

Apply the schema by running the files in `supabase/migrations/` oldest to newest. `0003` seeds
Custom Adventurist as the smoke-test client, so a fresh database has a public page to look at.

The admin panel is at `/admin`. A client's public page is at `/<slug>`, or at their
`custom_domain` when one is set (`decisions/002-domain-routing.md`).

## Sprints

Each sprint:

```bash
/sprint-plan     # day one, then commit the plan
# ...build...
/sprint-review   # last day, then commit the report and write your retro
```

## Ground rules

- **Spec before build.** For anything non-trivial, the spec's commit should predate the
  feature's commits.
- **Decisions get recorded.** When you make a real choice, write it in `decisions/` with the
  alternatives you rejected.
- **No real customer contact details anywhere in this repo.** Anonymize people in interview
  notes: "dental office manager, Provo" rather than a name and an email.
- **Keep `CLAUDE.md` current.** It is what your agent knows about your work. Stale context
  produces bad output.
