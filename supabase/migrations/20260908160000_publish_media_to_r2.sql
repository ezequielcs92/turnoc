alter table public.media_assets
  add column public_provider text,
  add column public_object_key text,
  add column public_url text,
  add constraint media_assets_public_copy_consistent check (
    (public_provider is null and public_object_key is null and public_url is null)
    or
    (public_provider = 'r2' and public_object_key is not null and public_url is not null)
  );

comment on column public.media_assets.bucket_id is
  'Private Supabase Storage bucket containing the canonical source file.';
comment on column public.media_assets.object_path is
  'Private Supabase Storage path containing the canonical source file.';
comment on column public.media_assets.public_object_key is
  'Validated R2 object key for the explicit published copy; null for private-only media.';

drop policy if exists "Published media files are readable" on storage.objects;

revoke select (bucket_id, object_path) on public.media_assets from anon;
grant select (public_provider, public_object_key, public_url) on public.media_assets to anon;

update storage.buckets
set allowed_mime_types = array[
  'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4',
  'audio/mpeg', 'audio/wav', 'audio/ogg', 'application/pdf'
]
where id = 'turnoc-private';
