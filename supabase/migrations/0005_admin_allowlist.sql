-- Closes the open-signup gap: `signInWithOtp` lets any email authenticate,
-- and RLS previously granted write access to any `authenticated` user with
-- no check on *who*. This adds an allowlist and scopes writes to it.
-- Per-client scoping (which agency member owns which client) stays out of
-- scope this sprint -- see specs/001-sprint-1-mvp.md.

create table admin_emails (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table admin_emails enable row level security;
-- No policies granted here on purpose: nobody should be able to read or
-- write this table through the API, anon or authenticated. Only the
-- security-definer function below, and the service role (migrations,
-- manual seeding), can see it.

create or replace function is_admin_email()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from admin_emails where email = auth.jwt() ->> 'email'
  );
$$;

grant execute on function is_admin_email() to anon, authenticated;

drop policy "Agency team can manage clients" on clients;
create policy "Agency team can manage clients" on clients
  for all using (is_admin_email());

drop policy "Agency team can manage theme settings" on theme_settings;
create policy "Agency team can manage theme settings" on theme_settings
  for all using (is_admin_email());

drop policy "Agency team can manage links" on links;
create policy "Agency team can manage links" on links
  for all using (is_admin_email());

drop policy "Agency team can read click events" on click_events;
create policy "Agency team can read click events" on click_events
  for select using (is_admin_email());

-- Seed the initial allowlist by hand in the Supabase SQL editor after
-- running this migration -- real email addresses don't belong in this
-- repo (see AGENTS.md):
--   insert into admin_emails (email) values ('you@example.com');
