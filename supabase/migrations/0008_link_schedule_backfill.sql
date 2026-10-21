-- Backfill bio-slot end dates from the Oct 20 schedule.
-- Timestamps are the end of that calendar day in America/Denver.

alter table links add column if not exists expires_at timestamptz;
alter table links add column if not exists archived_at timestamptz;
create index if not exists links_client_id_archived_at_idx on links (client_id, archived_at);

update links set expires_at = '2026-11-12T06:59:59.999Z', archived_at = null where placement = 'page' and title = $t$Hollyland LARK M3$t$;
update links set expires_at = '2026-11-10T06:59:59.999Z', archived_at = null where placement = 'page' and title = $t$Strong 3-in-1 Charger$t$;
update links set expires_at = '2026-11-10T06:59:59.999Z', archived_at = null where placement = 'page' and title = $t$Airdroid Parental Control App$t$;
update links set expires_at = '2026-10-28T05:59:59.999Z', archived_at = null where placement = 'page' and title = $t$Shop ESR Clear Classic Hybrid Magnetic Case (Flex Stand) iPhone 18 Pro Max$t$;
update links set expires_at = '2026-10-28T05:59:59.999Z', archived_at = null where placement = 'page' and title = $t$ESR Classic Hybrid Magnetic Case (Flex Stand) iPhone 18 Pro Max (amazon)$t$;
update links set expires_at = '2026-10-28T05:59:59.999Z', archived_at = null where placement = 'page' and title = $t$Anti-Yellowing Clear cases (ESR)$t$;

-- Still on the page through Oct 20, then archived.
update links set expires_at = '2026-10-21T05:59:59.999Z', archived_at = null where placement = 'page' and title = $t$Plaud NotePin S - Use code "CA10" for 10% off$t$;
update links set expires_at = '2026-10-21T05:59:59.999Z', archived_at = null where placement = 'page' and title = $t$TESSAN Magic 65$t$;
update links set expires_at = '2026-10-21T05:59:59.999Z', archived_at = null where placement = 'page' and title = $t$JOIN UGREEN GIVEAWAY HERE$t$;

-- Already ended. archived_at is that end, so they leave the public page now.
update links set expires_at = '2026-10-16T05:59:59.999Z', archived_at = '2026-10-16T05:59:59.999Z' where placement = 'page' and title = $t$TCL NXTPAPER 70 Pro Smartphone; Code: 2ZKH2MZG$t$;
update links set expires_at = '2026-10-15T05:59:59.999Z', archived_at = '2026-10-15T05:59:59.999Z' where placement = 'page' and title = $t$Anker Soundcore Liberty 5 Pro (amazon)$t$;
update links set expires_at = '2026-10-15T05:59:59.999Z', archived_at = '2026-10-15T05:59:59.999Z' where placement = 'page' and title = $t$Anker soundcore Liberty 5 Pro$t$;
update links set expires_at = '2026-10-16T05:59:59.999Z', archived_at = '2026-10-16T05:59:59.999Z' where placement = 'page' and title = $t$RayNeo GT Max AR Glasses$t$;
update links set expires_at = '2026-10-16T05:59:59.999Z', archived_at = '2026-10-16T05:59:59.999Z' where placement = 'page' and title = $t$RayNeo GT Max AR/XR Glasses - Amazon$t$;
update links set expires_at = '2026-10-11T05:59:59.999Z', archived_at = '2026-10-11T05:59:59.999Z' where placement = 'page' and title = $t$VITURE Pro 2 XR Glasses$t$;
update links set expires_at = '2026-10-04T05:59:59.999Z', archived_at = '2026-10-04T05:59:59.999Z' where placement = 'page' and title = $t$iFlyTek AI Note$t$;
update links set expires_at = '2026-09-29T05:59:59.999Z', archived_at = '2026-09-29T05:59:59.999Z' where placement = 'page' and title = $t$Dreo Air Purifier - Discount Code: Ben15$t$;
update links set expires_at = '2026-09-26T05:59:59.999Z', archived_at = '2026-09-26T05:59:59.999Z' where placement = 'page' and title = $t$TeraBox$t$;
update links set expires_at = '2026-09-01T05:59:59.999Z', archived_at = '2026-09-01T05:59:59.999Z' where placement = 'page' and title = $t$Forma PDF Editor App$t$;
update links set expires_at = '2026-09-01T05:59:59.999Z', archived_at = '2026-09-01T05:59:59.999Z' where placement = 'page' and title = $t$Joyroom Podix Pr70$t$;
update links set expires_at = '2026-08-20T05:59:59.999Z', archived_at = '2026-08-20T05:59:59.999Z' where placement = 'page' and title = $t$Hollyland Lark A1 Microphone$t$;
update links set expires_at = '2026-08-18T05:59:59.999Z', archived_at = '2026-08-18T05:59:59.999Z' where placement = 'page' and title = $t$DOOGEE V50 Pro Rugged Phone$t$;
update links set expires_at = '2026-08-17T05:59:59.999Z', archived_at = '2026-08-17T05:59:59.999Z' where placement = 'page' and title = $t$Melo P1 Microphone$t$;
update links set expires_at = '2026-06-23T05:59:59.999Z', archived_at = '2026-06-23T05:59:59.999Z' where placement = 'page' and title = $t$XREAL One Pro! Use code CUSTOM$t$;
update links set expires_at = '2026-05-29T05:59:59.999Z', archived_at = '2026-05-29T05:59:59.999Z' where placement = 'page' and title = $t$Viture Glasses - CODE: customadventurist$t$;

-- No closed deal, or the bio slot was not part of the deal.
update links set archived_at = '2026-10-21T00:00:00.000Z' where placement = 'page' and title = $t$RayNeo GT AR Glasses$t$;
update links set archived_at = '2026-10-21T00:00:00.000Z' where placement = 'page' and title = $t$RayNeo GT AR/XR Glasses - Amazon$t$;
update links set archived_at = '2026-10-21T00:00:00.000Z' where placement = 'page' and title = $t$Anker Smart Display Hub 25% discount: 2026AnkerHub$t$;
update links set archived_at = '2026-10-21T00:00:00.000Z' where placement = 'page' and title = $t$Speak On - Discount Code: Ben10$t$;
update links set archived_at = '2026-10-21T00:00:00.000Z' where placement = 'page' and title = $t$Dream Traveller Luggage$t$;
update links set archived_at = '2026-10-21T00:00:00.000Z' where placement = 'page' and title = $t$Unplug Earbuds$t$;
