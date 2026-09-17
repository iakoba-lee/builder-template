# Decision 002: Single custom-domain column, not a domains table

**Date:** 2026-09-16
**Status:** Active

## Context

Sprint 1's definition of done requires `customadventurist.com` to serve the Custom Adventurist
public page directly over HTTPS — not `<agency-domain>/customadventurist`. Only one client
(Custom Adventurist) exists this sprint; Kimball AI is next sprint at the earliest.

## Options considered

1. **Agency domain + `/slug` only**: simplest, but contradicts the already-committed
   `customadventurist.com` requirement — would mean revising the sprint plan.
2. **Full per-client custom domains**: a `domains` table (supporting multiple/rotating domains
   per client) plus general host-based routing and admin UI to manage them. Correct end state,
   but more than one client needs this sprint.
3. **Single nullable `custom_domain` column on `clients`, with middleware routing**: satisfies
   the sprint 1 requirement with the smallest schema and routing surface; generalizes to a
   `domains` table later without a rewrite, since it's additive.

## Decision

Option 3. Add `custom_domain text unique` (nullable) to `clients`. Next.js middleware reads the
request's `Host` header: if it matches a client's `custom_domain`, rewrite to that client's page;
otherwise treat the path as `<agency-domain>/<slug>`. Auth (magic-link login) stays on the
agency's own domain only — client custom domains serve public pages, never the admin panel — so
custom domains never need to be registered as Supabase auth redirect URLs.

## What would change our mind

If a second client needs a custom domain before the routing/admin work to manage many domains
well is justified, or if any client needs more than one domain (e.g. bare + www, or a domain
migration), promote `custom_domain` to a `domains` table at that point.
