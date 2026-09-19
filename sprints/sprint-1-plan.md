# Sprint 1 Plan

**Goal:** A Linktree replacement, branded Custom Adventurist, live on the client's own domain
`customadventurist.com`, built on a multi-tenant foundation so the agency can add more clients
later without a rewrite.

**Why this:** It is an intro-sized project I can actually finish and demo, my client asked for
it, and it is the first of the tools I want to upsell agency clients. The Notion deal dashboard
already works well, so rebuilding that is a later sprint.

**Done looks like:**

- Every table is multi-tenant from the first commit: a `clients` table with a name and slug, and
  every link, theme setting, and click event carries a `client_id`.
- An agency team member can log in to the admin panel via magic link.
- Admin can edit a client's title, bio, and profile picture.
- Admin can set the client's colors and font, and the public page reflects them.
- Admin can add, edit, delete, and order links.
- The public page renders correctly on both mobile and desktop.
- Clicking a link redirects correctly and records a click event, storing device and country on
  the event even though those are not charted yet.
- Admin can view, per client: total clicks, a clicks-over-time chart, and top links.
- The app is deployed to a live Vercel environment the agency team can access.
- `customadventurist.com` is attached in Vercel and serves the page over valid HTTPS.
- Custom Adventurist is configured end-to-end as a smoke test: content, theme, and links.

**Predicted difficulty:** 3.7

**Actual difficulty:** 1.5

**Why it differed:** Prior experience building and hosting with Supabase/Vercel this summer,
plus existing familiarity with CNAME/DNS from Go High Level, made the one genuinely new piece
(attaching a real domain) much less difficult than expected.

**Retro:** Hit the goal, and hit it much faster and more easily than predicted. That's a signal
to raise the bar on what's worth building next, not to relax it — with these tools, the
constraint isn't build speed anymore, it's picking the right thing to build. Before starting
the next big build (a software product to make the brand-manager job itself easier), the plan
is to audit and document the actual day-to-day process in detail first, including interviews
with others who experience the same pain, and only then figure out what to simplify and build.
That audit/documentation work — not a build — is the likely candidate for what comes next.
