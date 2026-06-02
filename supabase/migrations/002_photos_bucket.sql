-- Storage bucket for the photo library + portfolio/delivery images.
-- Public read (portfolios are shown publicly); writes restricted to the
-- owner's own folder (path is "<userId>/<file>"). Idempotent.

insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do update set public = true;

drop policy if exists "photos_insert_own" on storage.objects;
create policy "photos_insert_own" on storage.objects for insert to authenticated
with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "photos_update_own" on storage.objects;
create policy "photos_update_own" on storage.objects for update to authenticated
using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "photos_delete_own" on storage.objects;
create policy "photos_delete_own" on storage.objects for delete to authenticated
using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
