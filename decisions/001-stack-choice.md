# Decision 001: Next.js + Supabase + Vercel for the link page platform

**Date:** 2026-09-16
**Status:** Active

## Context

Sprint 1 needs, from day one: a multi-tenant Postgres schema (`clients` table, every other table
carrying `client_id`), magic-link login for agency team members, an admin panel, a public page
per client, click-event tracking, a couple of charts, and a live deploy on a client's own domain
(`customadventurist.com`) over HTTPS — done by a solo builder in about two weeks.

## Options considered

1. **Next.js + Supabase, on Vercel**: Postgres and magic-link auth ship together out of the box,
   Supabase's row-level security maps naturally onto multi-tenant tables, and Next.js on Vercel
   is a one-command deploy with per-project custom domains. Less control over the exact auth
   flow and ORM than rolling it by hand.
2. **Next.js + Prisma + Neon (Postgres) + NextAuth, on Vercel**: More control over schema
   migrations (Prisma) and the auth flow, but three services to wire together instead of one,
   and magic-link auth needs more manual setup than Supabase's built-in version.
3. **No-code / low-code builder (e.g. a Bubble/Webflow-style tool)**: Fastest to a demo, but
   click-event storage, custom multi-tenant logic, and reselling this as agency infrastructure
   later would fight the tool rather than being straightforward extensions.

## Decision

Next.js + Supabase on Vercel. The deciding reason: Supabase collapses "multi-tenant Postgres" and
"magic-link auth" — the two hardest requirements in the sprint 1 list — into one service, which
matters most for a solo, two-week build.

## What would change our mind

If Supabase's row-level security or client libraries get in the way of the multi-tenant model
once real schema work starts, or if auth needs grow past magic links (e.g. client-facing SSO),
revisit — most likely toward Prisma + Neon + NextAuth for more direct control.
