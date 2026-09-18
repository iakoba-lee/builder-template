# Decision 003: Attach customadventurist.com via A record, not nameserver delegation

**Date:** 2026-09-17
**Status:** Active

## Context

Sprint 1 requires `customadventurist.com` live on Vercel over HTTPS. The domain is registered with
GoDaddy, DNS is still on GoDaddy's own nameservers, and — because this domain belongs to the
partner's live influencer business, not a fresh domain — it may carry other records (GoDaddy's
Website Builder "Coming Soon" placeholder was still attached at the Website level).

Vercel supports two ways to point a domain at it:

## Options considered

1. **Change nameservers to Vercel's** (`ns1`/`ns2.vercel-dns.com`): Vercel's recommended path,
   simplest long-term, but hands it full control of every DNS record on the domain — any existing
   MX, TXT, or other records not explicitly recreated in Vercel would silently break.
2. **Add a single A record** (`@` → `76.76.21.21`) on GoDaddy's existing nameservers: leaves every
   other record (NS, `www` CNAME, `_domainconnect` CNAME, SOA) untouched. Slightly more moved parts
   if Vercel ever changes its edge IP.

## Decision

Chose the A record. This domain had no MX/TXT records to lose, but it's the partner's live
business domain — the deciding reason was not needing to audit and manually recreate every
existing record in Vercel just to get one page live.

## What would change our mind

If we outgrow a single A record (e.g. need Vercel-managed subdomain wildcards or DNSSEC), revisit
nameserver delegation then — recreate GoDaddy's existing records in Vercel's DNS first.

## Open issue at time of writing

GoDaddy's Website Builder "Coming Soon" site was still attached at the Website level on this
domain. It doesn't override the A record directly, but GoDaddy can silently re-park a domain (and
rewrite the A record) if that attachment isn't removed. HTTPS on the custom domain was also not
yet consistently resolving as of this writing — DNS and plain HTTP both correctly reach the Vercel
deployment, but the TLS handshake was intermittently failing. Follow up before treating the custom
domain as done.
