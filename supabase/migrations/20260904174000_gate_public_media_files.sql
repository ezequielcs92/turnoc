-- A logically public asset is still private at bucket level. Access goes through
-- the Storage API and is granted only after its editorial metadata is published.
alter table public.media_assets
  add column if not exists updated_by uuid references auth.users(id) on delete set null;

update storage.buckets
set public = false,
    allowed_mime_types = array[
      'image/jpeg', 'image/png', 'image/webp', 'image/avif',
      'video/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg',
      'application/pdf'
    ]
where id = 'turnoc-public';

update storage.buckets
set allowed_mime_types = array[
  'image/jpeg', 'image/png', 'image/webp',
  'video/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg',
  'application/pdf'
]
where id = 'turnoc-private';

drop policy if exists "Public media files are readable" on storage.objects;

create policy "Published media files are readable"
on storage.objects for select to anon, authenticated
using (
  bucket_id = 'turnoc-public'
  and exists (
    select 1
    from public.media_assets asset
    where asset.bucket_id = storage.objects.bucket_id
      and asset.object_path = storage.objects.name
      and asset.status in ('published', 'scheduled')
      and coalesce(asset.publish_at, '-infinity'::timestamptz) <= now()
  )
);
