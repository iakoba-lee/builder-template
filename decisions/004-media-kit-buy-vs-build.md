# Decision 004: Media kit — buy, build, or hybrid

**Date:** 2026-10-01
**Status:** Open — not decided

## Context

The agency wants a live media kit per client: follower counts and (where possible) demographics
for YouTube, Instagram, TikTok, and related platforms, plus rates, past brand work, and a
shareable page brands can open. This is both a client deliverable and pitch evidence for brand
deals.

Sprint 2 planning already scoped a build path (own page, daily refresh, fallback to last good
day; TikTok/Facebook demographics likely manual). The backlog also says to weigh buying a
finished tool (e.g. CreatorsJet) before committing engineering time. Discovery is still the
sprint goal — this decision is recorded so the buy-vs-build question is explicit, not deferred
by default into a build.

Two layers exist in the market and must not be confused:

1. **End-product tools** (CreatorsJet, Beacons, similar): creator or manager pays; they host the
   kit and refresh stats. No API integration on our side.
2. **Infrastructure APIs** (Phyllo / InsightIQ, Modash, HypeAuditor): we keep our own kit UI and
   pay for normalized creator data behind OAuth or a public index.

## Options considered

1. **Buy CreatorsJet (or similar) for the roster**
   - Pros: Live kits in days; daily stats on paid plans; Manager plans cover multi-creator
     agencies; low engineering cost. Public creator pricing (as of late 2025 / 2026 listing):
     Free ($0, no daily refresh), Starter (~$10–15/mo), Pro (~$19–29/mo); Manager/custom is
     sales-priced by creator count.
   - Cons: Kit lives on their product/domain story, not ours. Multi-tenant agency branding and
     on-domain deliverables (`customadventurist.com`, future clients) are weaker. Switching
     later means redoing kits. Manager pricing is opaque until we talk to sales.

2. **Build the media kit in this product + direct platform APIs**
   - Pros: Matches the agency product thesis (owned, multi-tenant, on-domain). Reuses admin,
     clients, and auth we already have. YouTube is straightforward; Meta (IG/Threads) can work
     with creators as app testers in some setups.
   - Cons: Real engineering and ongoing platform API breakage. TikTok (and often Facebook)
     demographics are weak or manual. Demographics and “live” credibility take longer than a
     hosted tool. Solo-builder cost is time, not a clear monthly invoice.

3. **Build our kit UI + buy an aggregator (e.g. Phyllo) for social pulls**
   - Pros: One OAuth/data shape across platforms; we still own the page and tenant model.
   - Cons: Cash cost jumps from tens of dollars/creator to roughly hundreds–thousands/month
     once past a tiny roster (entry often cited ~$199/mo; growth tiers much higher). Overkill
     for one or two clients. Still need kit UX, storage, and failure/fallback logic.

4. **Hybrid: buy a kit tool short-term; build later if discovery proves demand**
   - Pros: Validates what brands actually open and ask for during discovery without a spike.
     Cheap for Custom Adventurist alone. Leaves build options open.
   - Cons: Temporary double system if we later build. Risk of treating the vendor as permanent
     and never proving the owned product. Two places for “the” media kit link in pitches.

5. **Manual kit (Canva/PDF or static page) with hand-entered stats**
   - Pros: Zero integration cost; full control of layout; fine for one pitch at a time.
   - Cons: Goes stale; does not scale across clients; weak “real numbers” story vs live kits.

## Decision

**Not decided.** No option is chosen yet. Prefer not to start a media-kit build or a Phyllo
integration until discovery interviews and a concrete first use (Custom Adventurist pitch or
Kimball AI onboarding) force the choice.

## Decision criteria (when we choose)

Pick based on the first hard constraint that shows up, not on feature completeness:

1. **If brands need a live link this month for one creator** → lean Option 1 or 4 (buy /
   hybrid), not a build.
2. **If the agency needs kits on each client’s domain as a repeatable deliverable** → lean
   Option 2 (or 3 if direct APIs are too slow), and treat CreatorsJet as a temporary bridge at
   most.
3. **If discovery shows brands mainly want a PDF of rates + a few screenshots** → Option 5 is
   enough; do not buy or build live social sync yet.
4. **If roster size grows past a handful of creators and we still own the kit** → revisit
   Option 3; aggregator cost may beat maintaining N platform integrations.

## What would change our mind after a choice

- **If we buy:** Second outside client (Kimball AI) needs on-domain / white-label kits we cannot
  get from the vendor, or Manager pricing exceeds the value of avoided engineering.
- **If we build:** Platform access (especially Meta review or TikTok) blocks shipping for more
  than one sprint, or a Manager plan for our real roster is cheaper than the build time.
- **If we hybrid:** The temporary CreatorsJet link is still what gets sent to brands six months
  later — either commit to buy permanently or schedule the build.

## Pricing snapshot (approximate; verify at decision time)

| Path | Rough cost |
|------|------------|
| CreatorsJet Free / Starter / Pro | $0 / ~$10–15 / ~$19–29 per month per creator seat |
| CreatorsJet Managers | Custom; scales with creators, decks, seats |
| Phyllo-class API | Often ~$199/mo entry; growth tiers ~$1k+/mo |
| Direct platform APIs | Mostly engineering time; platform quotas/app review |
| Manual PDF / static | Time only |

## Related

- Backlog: “Media kit page” and related kit items
- Spec TBD if Option 2 or 3 is chosen — draft before coding
- Design refs: `design/creator-jet-ref/`, `design/malpluscats-Media-kit-ex.png`
