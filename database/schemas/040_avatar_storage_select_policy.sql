-- ============================================================
-- VYRO AVATAR STORAGE SELECT POLICY
--
-- Required for authenticated avatar upserts.
-- Users may read storage object metadata only inside
-- their own folder in the avatars bucket.
-- ============================================================

drop policy if exists "Users can view own avatar"
on storage.objects;

create policy "Users can view own avatar"
on storage.objects
for select
to authenticated
using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
);
