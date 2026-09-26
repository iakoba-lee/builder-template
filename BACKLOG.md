# Backlog

Ideas and known gaps that are out of scope for the current sprint but worth doing later.
Not a commitment or a queue — just a place to put things down so they aren't lost or forced
into a sprint they don't belong in. Pull from here when planning the next sprint with
`/sprint-plan`; delete an item once it's scoped into a plan or decided against.

- **Branded page titles.** The public page's `<title>` is a generic "Link page" for every
  client instead of the client's own name — should be per-client metadata for search/sharing.
- **Chart device/country on click events.** Already stored on every click event (see spec 001)
  but not surfaced anywhere in the admin analytics view.
- **Client-facing login.** Right now only the agency team can log in to admin; clients have no
  way to see their own page or data.
- **Second client onboarding.** Prove the multi-tenant model actually holds by onboarding
  Kimball AI, not just Custom Adventurist.
- **Billing / commission tracking.** No automated tracking of the agency's cut of brand deals
  yet — currently out of scope per spec 001.
- **Brand-management CRM (on hold until the process is mapped).** A version of the current CRM
  that needs less manual data entry and shows more metrics, so gaps in the agency's deal process
  are visible. Blocked on the process audit — map the workflow first, then decide what to build.
- **Automatic script generation (on hold until the process is mapped).** Generate a draft
  content script when a brand's product briefing is entered. Same blocker as the CRM.
- **Internal case studies page.** One place to show past campaigns: links to the videos on
  each platform, plus views, likes, comments, and link clicks (data the agency already has).
  Sales need either a brand-provided number or a later tracking approach (cookies/attribution —
  open question). Access: admin login, or a shareable page password so a brand can open a
  private study when sent the link — not a public gallery.
- **Media kit: top posts and recent posts.** Embedded post feeds on the media kit page, like the
  reference in `design/malpluscats-Media-kit-ex.png`. Deferred from Sprint 2.
- **Media kit: brand partners strip.** Logos of brands the creator has worked with. Deferred
  from Sprint 2; pairs with the case studies item above.
- **Link page redesign + richer click detail.** Creator's channels at the top of the public
  page; per-click device, country, referrer, and per-link trends in admin. Scoped during Sprint
  2 planning, deferred for a discovery sprint.
- **Media kit page.** Live follower counts and demographics for YouTube, Instagram, TikTok,
  Facebook, Threads, refreshed daily and falling back to the last good day on failure; agency
  admin for photo and kit prices. API research from Sprint 2 planning: YouTube, Instagram, and
  Threads demographics look feasible (Meta dev mode with creators as testers may avoid app
  review); TikTok and Facebook demographics likely need manual entry. Spike platform access
  first. Weigh against buying (e.g. CreatorJet) — record as a decision.
