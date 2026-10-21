# Spec 002: Timed link archive

**Status:** Building
**Date:** 2026-10-20

## Problem

Brand deals buy a bio slot for a fixed window. Today a link stays on the public page until someone deletes it, and deleting it also deletes its click history.

## What we're building

Each page link can stay up with no end date, for 7 days, for 30 days, or through a chosen date (end of that day, America/Denver). When the time passes, or when someone archives it early, the link disappears from the public page and from its short URL. The title, URL, and click history stay in an Archive list on My Page, and the clicks still count in analytics.

Putting a link back clears the end date so it does not immediately archive again. Deleting from the archive removes the link and its clicks.

## Out of scope

- A clock that archives links while nobody has the admin open. The public page hides expired links on read. The archive timestamp is written the next time an admin page loads.
- End dates on profile social icons.
- Email or other notice when a slot ends.

## Definition of done

- [ ] A new link can be given 7 days, 30 days, a date, or no end date.
- [ ] An expired or archived link is absent from the public page and does not redirect.
- [ ] The archive shows the title, URL, and click count, and opens the click trend for the days the link was on the page.
- [ ] Restoring a link puts it back on the page with no end date.
