-- Public bucket for client profile pictures. Anyone can read; only the
-- logged-in agency team can upload, replace, or delete.

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly readable"
on storage.objects for select
using (bucket_id = 'avatars');

create policy "Agency team can upload avatars"
on storage.objects for insert to authenticated
with check (bucket_id = 'avatars');

create policy "Agency team can update avatars"
on storage.objects for update to authenticated
using (bucket_id = 'avatars')
with check (bucket_id = 'avatars');

create policy "Agency team can delete avatars"
on storage.objects for delete to authenticated
using (bucket_id = 'avatars');
