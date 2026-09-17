-- Tables were created without the usual Supabase API grants, so the Data API
-- roles could not read or write them even with RLS policies in place.

grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on table public.clients to anon, authenticated, service_role;
grant select, insert, update, delete on table public.theme_settings to anon, authenticated, service_role;
grant select, insert, update, delete on table public.links to anon, authenticated, service_role;
grant select, insert, update, delete on table public.click_events to anon, authenticated, service_role;
