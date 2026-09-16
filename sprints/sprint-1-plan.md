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
