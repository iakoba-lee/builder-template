-- Profile icon row vs main page link blocks.
-- Existing channel profile URLs are backfilled to placement = 'profile'.

alter table links
  add column placement text not null default 'page'
  check (placement in ('page', 'profile'));

create index links_client_id_placement_idx on links (client_id, placement);

update links
set placement = 'profile'
where
  (
    url ilike '%instagram.com/%'
    and url not ilike '%/p/%'
    and url not ilike '%/reel%'
    and url not ilike '%/tv/%'
  )
  or (
    url ilike '%tiktok.com/%'
    and url not ilike '%/video/%'
  )
  or (
    url ilike '%youtube.com/%'
    and url not ilike '%/watch%'
    and url not ilike '%/shorts%'
    and url not ilike '%/embed%'
    and url not ilike '%/live%'
    and url not ilike '%/clip%'
  )
  or (
    (url ilike '%twitter.com/%' or url ilike '%://x.com/%' or url ilike '%://www.x.com/%')
    and url not ilike '%/status/%'
  )
  or (
    (url ilike '%facebook.com/%' or url ilike '%fb.com/%')
    and url not ilike '%/posts/%'
    and url not ilike '%/photo%'
    and url not ilike '%/watch/%'
  );
