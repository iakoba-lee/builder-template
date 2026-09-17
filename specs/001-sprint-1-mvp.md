# Spec 001: Multi-tenant link page platform (sprint 1 MVP)

**Status:** Draft
**Date:** 2026-09-16

## Problem

The agency (Jacob and his business partner) needs a branded, on-domain link page it fully
controls for each client, both as a deliverable and as evidence (click data) to support
brand-deal pitches — the thing the agency is paid a commission on. Custom Adventurist, becoming
a client, is the first to use it; Kimball AI is next. See `sprints/sprint-1-plan.md` and
`decisions/001-stack-choice.md`.

## What we're building

A Next.js + Supabase app, deployed on Vercel, with two surfaces:

- **Admin panel** (magic-link login, agency team only): edit a client's title, bio, and profile
  picture; set colors and font; add/edit/delete/reorder links; view per-client total clicks, a
  clicks-over-time chart, and top links.
- **Public page**: renders a client's content and theme, responsive on mobile and desktop.
  Clicking a link redirects correctly and records a click event (device, country stored even
  though not charted yet).

Every table (`clients`, links, theme settings, click events) is multi-tenant from the first
commit — a `clients` table with name, `slug`, and a nullable `custom_domain`, everything else
carrying `client_id`. Public pages are addressed by `<agency-domain>/<slug>` by default; if a
client has `custom_domain` set, middleware routes that hostname straight to their page instead
(see `decisions/002-domain-routing.md`). Auth stays on the agency's own domain — custom domains
only ever serve public pages. Custom Adventurist is configured end-to-end (content, theme,
links) as the smoke test, live on `customadventurist.com` with valid HTTPS.

## Out of scope

- Any client-facing login (clients don't get admin access this sprint — only the agency team).
- Billing or automated tracking of the agency's commission.
- Configuring any client beyond Custom Adventurist's smoke test.
- Charting device/country on click events (stored, not displayed, this sprint).
- Roles/permissions beyond a single agency-team access level.

## Definition of done

- [ ] Every table is multi-tenant: `clients` (name, slug, custom_domain) plus `client_id` on
      every link, theme setting, and click event.
- [ ] Agency team member logs in to the admin panel via magic link.
- [ ] Admin can edit a client's title, bio, and profile picture.
- [ ] Admin can set a client's colors and font, reflected on the public page.
- [ ] Admin can add, edit, delete, and reorder links.
- [ ] Public page renders correctly on mobile and desktop.
- [ ] Clicking a link redirects correctly and records a click event, including device and
      country.
- [ ] Admin can view, per client: total clicks, clicks-over-time chart, top links.
- [ ] Deployed to a live Vercel environment the agency team can access.
- [ ] `customadventurist.com` attached in Vercel, serving over valid HTTPS.
- [ ] Custom Adventurist configured end-to-end (content, theme, links) as the smoke test.
