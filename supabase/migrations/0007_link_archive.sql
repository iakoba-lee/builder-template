-- Optional end time for a bio slot, and the moment it left the public page.
-- Null expires_at means the link stays until someone archives it.
-- Null archived_at means it is still on the page, unless expires_at has passed.

alter table links
  add column expires_at timestamptz,
  add column archived_at timestamptz;

create index links_client_id_archived_at_idx on links (client_id, archived_at);
