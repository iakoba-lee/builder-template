-- Sprint 1 MVP schema.
-- See specs/001-sprint-1-mvp.md and decisions/002-domain-routing.md.
-- Every table below is scoped to a client; row-level security enforces it.

create table clients (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  custom_domain text unique,
  name text not null,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table theme_settings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null unique references clients(id) on delete cascade,
  color text not null default '#2563eb',
  font text not null default 'Inter',
  updated_at timestamptz not null default now()
);

create table links (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  title text not null,
  url text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table click_events (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  link_id uuid not null references links(id) on delete cascade,
  device text,
  country text,
  created_at timestamptz not null default now()
);

create index links_client_id_idx on links (client_id);
create index click_events_client_id_idx on click_events (client_id);
create index click_events_link_id_idx on click_events (link_id);

-- Row-level security. Public pages need anonymous read access to clients,
-- theme_settings, and links, and anonymous insert access to click_events
-- (recording a click). Everything else -- writing clients/theme/links, and
-- reading click_events for the analytics dashboard -- is restricted to
-- logged-in agency-team users. There is no client-facing login this sprint
-- (specs/001-sprint-1-mvp.md), so "authenticated" always means agency team.

alter table clients enable row level security;
alter table theme_settings enable row level security;
alter table links enable row level security;
alter table click_events enable row level security;

create policy "Public can read clients" on clients
  for select using (true);
create policy "Agency team can manage clients" on clients
  for all using (auth.role() = 'authenticated');

create policy "Public can read theme settings" on theme_settings
  for select using (true);
create policy "Agency team can manage theme settings" on theme_settings
  for all using (auth.role() = 'authenticated');

create policy "Public can read links" on links
  for select using (true);
create policy "Agency team can manage links" on links
  for all using (auth.role() = 'authenticated');

create policy "Public can record click events" on click_events
  for insert with check (true);
create policy "Agency team can read click events" on click_events
  for select using (auth.role() = 'authenticated');

grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on table public.clients to anon, authenticated, service_role;
grant select, insert, update, delete on table public.theme_settings to anon, authenticated, service_role;
grant select, insert, update, delete on table public.links to anon, authenticated, service_role;
grant select, insert, update, delete on table public.click_events to anon, authenticated, service_role;
