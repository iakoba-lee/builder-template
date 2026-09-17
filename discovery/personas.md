# Personas

> One entry per customer type. Update as interviews sharpen the picture:
> this file should get *more specific* over the semester, not longer.

## Sponsored-link influencer

- **Who:** Solo creator in adventure/consumer tech who makes money from affiliate links and
  sponsored product posts. Posts on TikTok, YouTube, and Instagram; the link-in-bio page is the
  one place every product they have promoted lives. Scale of the agency's first client: ~41k
  page views all time, ~100/day, 24 of 25 available link slots in use, nearly all of them
  product links or discount codes.
- **The problem in their words:** "I wish I could see the analytics for the products I promote
  without having to pay extra."
- **The job behind the quote:** Find out which promoted products people actually click, for two
  reasons — decide what is worth promoting again, and show a brand the promotion delivered.
  Page views answer neither question; only per-link clicks do.
- **Current workaround:** Free solo.to page, and going without. Views are visible on the free
  plan (today, all time, 7-day chart) but every click number is blurred behind an upgrade
  prompt — today, all time, and per link. solo.to gates per-link click charts at its
  Entrepreneur tier (~$5–6/mo). See `design/Analytics-·-solo-to-09-16-2026_08_18_PM.png` and
  `design/back-end-My-Page-·-solo-to-09-16-2026_08_13_PM.png`.
- **What they'd pay / have paid for:** Nothing yet. This is the uncomfortable part: click
  analytics has been purchasable for about $5/mo the whole time and they have not bought it.
  The want is evidenced; the willingness to pay is evidenced *against*. Read this as a reason
  analytics should arrive bundled inside an agency deliverable they do not pay for line-by-line,
  not as a feature to sell creators directly.
- **Evidence:** Quote above (source needs a write-up in `discovery/interviews/` — was this said
  in a real conversation, and when?) plus the two solo.to screenshots above, which are the
  live account, not a marketing page.

## Agency account manager

- The internal operator, not a paying customer — but the only person with a login in sprint 1,
  so every admin screen is designed for them. Clients get no account this sprint
  (`specs/001-sprint-1-mvp.md`).
- **Who:** Agency team member running the link pages for every client from one admin panel.
  One client today, a second signed and waiting.
- **The problem in their words:** [no interview yet — needs one, even if it is self-observation
  written up honestly]
- **The job behind it:** Set up and edit a client's page, then pull that client's click numbers
  when pitching a brand or reporting on a deal the agency earns its commission on.
- **Current workaround:** Working inside each client's own solo.to account. No view across
  clients, no custom domain below the ~$10/mo tier, and click data paywalled once per client.
- **What they'd pay / have paid for:** N/A. What is being avoided is a paid link-in-bio
  subscription per client plus the per-client dashboard hopping.
- **Evidence:** `sprints/sprint-1-plan.md`, `specs/001-sprint-1-mvp.md`,
  `decisions/001-stack-choice.md`.

## Open question this file cannot answer yet

The influencer feels the pain, but sprint 1 ships the relief to the agency: the account manager
sees the clicks and passes them on. Either that is the model on purpose — analytics is agency
service, not creator self-serve — or the influencer eventually needs a read-only view of their
own numbers. Decide it deliberately, not by default, and record it in `decisions/` when the next
interview makes the answer clear.
