create extension if not exists pgcrypto with schema extensions;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create type public.content_status as enum ('draft', 'scheduled', 'published', 'archived');
create type public.project_state as enum ('current', 'upcoming', 'archive');
create type public.post_kind as enum ('news', 'blog', 'interview', 'backstage', 'call', 'communique', 'resource');
create type public.event_kind as enum ('performance', 'workshop', 'festival', 'talk', 'other');
create type public.form_kind as enum ('contact', 'booking', 'press', 'community_proposal', 'newsletter');
create type public.form_status as enum ('new', 'reviewing', 'resolved', 'spam');
create type public.media_kind as enum ('image', 'video', 'audio', 'document');
create type public.app_role as enum ('admin', 'editor');

create table public.app_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 120),
  role public.app_role not null default 'editor',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.app_users
    where user_id = (select auth.uid())
      and role = 'admin'
      and active = true
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

create table public.artists (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 2 and 160),
  stage_name text check (stage_name is null or char_length(stage_name) <= 160),
  excerpt text not null default '' check (char_length(excerpt) <= 320),
  bio text not null default '' check (char_length(bio) <= 12000),
  disciplines text[] not null default '{}',
  experience text[] not null default '{}',
  training text[] not null default '{}',
  social_links jsonb not null default '{}'::jsonb check (jsonb_typeof(social_links) = 'object'),
  contact_email text,
  contact_public boolean not null default false,
  cv_url text,
  status public.content_status not null default 'draft',
  publish_at timestamptz,
  seo_title text check (seo_title is null or char_length(seo_title) <= 70),
  seo_description text check (seo_description is null or char_length(seo_description) <= 170),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 2 and 180),
  excerpt text not null default '' check (char_length(excerpt) <= 320),
  synopsis text not null default '' check (char_length(synopsis) <= 16000),
  state public.project_state not null default 'current',
  year_start integer check (year_start between 1900 and 2200),
  year_end integer check (year_end between 1900 and 2200),
  booking_enabled boolean not null default false,
  artistic_sheet jsonb not null default '{}'::jsonb check (jsonb_typeof(artistic_sheet) = 'object'),
  technical_sheet jsonb not null default '{}'::jsonb check (jsonb_typeof(technical_sheet) = 'object'),
  press_mentions jsonb not null default '[]'::jsonb check (jsonb_typeof(press_mentions) = 'array'),
  awards text[] not null default '{}',
  status public.content_status not null default 'draft',
  publish_at timestamptz,
  seo_title text check (seo_title is null or char_length(seo_title) <= 70),
  seo_description text check (seo_description is null or char_length(seo_description) <= 170),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  check (year_end is null or year_start is null or year_end >= year_start)
);

create table public.project_artists (
  project_id uuid not null references public.projects(id) on delete cascade,
  artist_id uuid not null references public.artists(id) on delete cascade,
  role_name text not null default '' check (char_length(role_name) <= 160),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (project_id, artist_id, role_name)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 2 and 180),
  kind public.event_kind not null default 'performance',
  excerpt text not null default '' check (char_length(excerpt) <= 320),
  description text not null default '' check (char_length(description) <= 12000),
  venue text not null default '' check (char_length(venue) <= 180),
  city text not null default '' check (char_length(city) <= 120),
  starts_at timestamptz not null,
  ends_at timestamptz,
  external_url text,
  project_id uuid references public.projects(id) on delete set null,
  artist_id uuid references public.artists(id) on delete set null,
  status public.content_status not null default 'draft',
  publish_at timestamptz,
  seo_title text check (seo_title is null or char_length(seo_title) <= 70),
  seo_description text check (seo_description is null or char_length(seo_description) <= 170),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  check (ends_at is null or ends_at >= starts_at)
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 2 and 200),
  kind public.post_kind not null default 'news',
  excerpt text not null default '' check (char_length(excerpt) <= 420),
  body text not null default '' check (char_length(body) <= 40000),
  tags text[] not null default '{}',
  cta_label text check (cta_label is null or char_length(cta_label) <= 80),
  cta_url text,
  closes_at timestamptz,
  project_id uuid references public.projects(id) on delete set null,
  artist_id uuid references public.artists(id) on delete set null,
  status public.content_status not null default 'draft',
  publish_at timestamptz,
  seo_title text check (seo_title is null or char_length(seo_title) <= 70),
  seo_description text check (seo_description is null or char_length(seo_description) <= 170),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 180),
  kind public.media_kind not null default 'image',
  bucket_id text not null check (bucket_id in ('turnoc-public', 'turnoc-private')),
  object_path text not null check (char_length(object_path) between 1 and 600),
  alt_text text not null default '' check (char_length(alt_text) <= 240),
  caption text not null default '' check (char_length(caption) <= 600),
  credit text not null default '' check (char_length(credit) <= 180),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  duration_seconds numeric(10, 2) check (duration_seconds is null or duration_seconds >= 0),
  status public.content_status not null default 'draft',
  publish_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  unique (bucket_id, object_path)
);

create table public.artist_media (
  artist_id uuid not null references public.artists(id) on delete cascade,
  media_id uuid not null references public.media_assets(id) on delete cascade,
  usage text not null default 'gallery' check (usage in ('portrait', 'hero', 'gallery', 'video', 'press')),
  sort_order integer not null default 0,
  primary key (artist_id, media_id, usage)
);

create table public.project_media (
  project_id uuid not null references public.projects(id) on delete cascade,
  media_id uuid not null references public.media_assets(id) on delete cascade,
  usage text not null default 'gallery' check (usage in ('cover', 'hero', 'gallery', 'video', 'technical')),
  sort_order integer not null default 0,
  primary key (project_id, media_id, usage)
);

create table public.post_media (
  post_id uuid not null references public.posts(id) on delete cascade,
  media_id uuid not null references public.media_assets(id) on delete cascade,
  usage text not null default 'inline' check (usage in ('cover', 'hero', 'inline', 'attachment')),
  sort_order integer not null default 0,
  primary key (post_id, media_id, usage)
);

create table public.home_features (
  id uuid primary key default gen_random_uuid(),
  slot text not null check (slot in ('hero', 'project', 'artist', 'agenda', 'news', 'call')),
  eyebrow text not null default '' check (char_length(eyebrow) <= 80),
  title text not null check (char_length(title) between 2 and 180),
  summary text not null default '' check (char_length(summary) <= 420),
  entity_type text check (entity_type is null or entity_type in ('artist', 'project', 'event', 'post')),
  entity_id uuid,
  href text not null default '/',
  sort_order integer not null default 0,
  status public.content_status not null default 'draft',
  publish_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create table public.site_settings (
  key text primary key check (key ~ '^[a-z0-9]+(?:[._-][a-z0-9]+)*$'),
  value jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  kind public.form_kind not null,
  name text not null default '' check (char_length(name) <= 160),
  email text not null check (char_length(email) between 5 and 320),
  phone text not null default '' check (char_length(phone) <= 80),
  organization text not null default '' check (char_length(organization) <= 180),
  message text not null default '' check (char_length(message) <= 6000),
  consent boolean not null,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and pg_column_size(payload) <= 12000),
  honeypot text not null default '' check (honeypot = ''),
  status public.form_status not null default 'new',
  assigned_to uuid references public.app_users(user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index artists_publication_idx on public.artists (status, publish_at);
create index projects_publication_idx on public.projects (status, publish_at, state);
create index events_publication_idx on public.events (status, publish_at, starts_at);
create index posts_publication_idx on public.posts (status, publish_at, kind);
create index media_assets_publication_idx on public.media_assets (status, publish_at);
create index form_submissions_queue_idx on public.form_submissions (status, created_at desc);
create index project_artists_artist_idx on public.project_artists (artist_id);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger app_users_set_updated_at before update on public.app_users for each row execute function private.set_updated_at();
create trigger artists_set_updated_at before update on public.artists for each row execute function private.set_updated_at();
create trigger projects_set_updated_at before update on public.projects for each row execute function private.set_updated_at();
create trigger events_set_updated_at before update on public.events for each row execute function private.set_updated_at();
create trigger posts_set_updated_at before update on public.posts for each row execute function private.set_updated_at();
create trigger media_assets_set_updated_at before update on public.media_assets for each row execute function private.set_updated_at();
create trigger home_features_set_updated_at before update on public.home_features for each row execute function private.set_updated_at();
create trigger site_settings_set_updated_at before update on public.site_settings for each row execute function private.set_updated_at();
create trigger form_submissions_set_updated_at before update on public.form_submissions for each row execute function private.set_updated_at();

alter table public.app_users enable row level security;
alter table public.artists enable row level security;
alter table public.projects enable row level security;
alter table public.project_artists enable row level security;
alter table public.events enable row level security;
alter table public.posts enable row level security;
alter table public.media_assets enable row level security;
alter table public.artist_media enable row level security;
alter table public.project_media enable row level security;
alter table public.post_media enable row level security;
alter table public.home_features enable row level security;
alter table public.site_settings enable row level security;
alter table public.form_submissions enable row level security;

revoke all on all tables in schema public from anon, authenticated;

grant select, insert, update, delete on public.app_users to authenticated;
grant select on public.artists, public.projects, public.project_artists, public.events, public.posts,
  public.media_assets, public.artist_media, public.project_media, public.post_media, public.home_features,
  public.site_settings to authenticated;
grant select (id, slug, name, stage_name, excerpt, bio, disciplines, experience, training, social_links,
  cv_url, status, publish_at, seo_title, seo_description, created_at, updated_at) on public.artists to anon;
grant select (id, slug, title, excerpt, synopsis, state, year_start, year_end, booking_enabled, artistic_sheet,
  technical_sheet, press_mentions, awards, status, publish_at, seo_title, seo_description, created_at, updated_at)
  on public.projects to anon;
grant select (project_id, artist_id, role_name, sort_order, created_at) on public.project_artists to anon;
grant select (id, slug, title, kind, excerpt, description, venue, city, starts_at, ends_at, external_url,
  project_id, artist_id, status, publish_at, seo_title, seo_description, created_at, updated_at) on public.events to anon;
grant select (id, slug, title, kind, excerpt, body, tags, cta_label, cta_url, closes_at, project_id, artist_id,
  status, publish_at, seo_title, seo_description, created_at, updated_at) on public.posts to anon;
grant select (id, title, kind, bucket_id, object_path, alt_text, caption, credit, width, height, duration_seconds,
  status, publish_at, created_at, updated_at) on public.media_assets to anon;
grant select on public.artist_media, public.project_media, public.post_media to anon;
grant select (id, slot, eyebrow, title, summary, entity_type, entity_id, href, sort_order, status, publish_at,
  created_at, updated_at) on public.home_features to anon;
grant select (key, value, is_public, updated_at) on public.site_settings to anon;
grant insert, update, delete on public.artists, public.projects, public.project_artists, public.events, public.posts,
  public.media_assets, public.artist_media, public.project_media, public.post_media, public.home_features,
  public.site_settings to authenticated;
grant insert on public.form_submissions to anon, authenticated;
grant select, update, delete on public.form_submissions to authenticated;

create policy "Admins manage app users"
on public.app_users for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Published artists are public"
on public.artists for select to anon, authenticated
using (status = 'published' and coalesce(publish_at, '-infinity'::timestamptz) <= now());
create policy "Admins manage artists"
on public.artists for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Published projects are public"
on public.projects for select to anon, authenticated
using (status = 'published' and coalesce(publish_at, '-infinity'::timestamptz) <= now());
create policy "Admins manage projects"
on public.projects for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Published project credits are public"
on public.project_artists for select to anon, authenticated
using (
  exists (select 1 from public.projects p where p.id = project_id)
  and exists (select 1 from public.artists a where a.id = artist_id)
);
create policy "Admins manage project credits"
on public.project_artists for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Published events are public"
on public.events for select to anon, authenticated
using (status = 'published' and coalesce(publish_at, '-infinity'::timestamptz) <= now());
create policy "Admins manage events"
on public.events for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Published posts are public"
on public.posts for select to anon, authenticated
using (status = 'published' and coalesce(publish_at, '-infinity'::timestamptz) <= now());
create policy "Admins manage posts"
on public.posts for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Published media metadata is public"
on public.media_assets for select to anon, authenticated
using (status = 'published' and coalesce(publish_at, '-infinity'::timestamptz) <= now());
create policy "Admins manage media metadata"
on public.media_assets for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Published artist media is public"
on public.artist_media for select to anon, authenticated
using (
  exists (select 1 from public.artists a where a.id = artist_id)
  and exists (select 1 from public.media_assets m where m.id = media_id)
);
create policy "Admins manage artist media"
on public.artist_media for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Published project media is public"
on public.project_media for select to anon, authenticated
using (
  exists (select 1 from public.projects p where p.id = project_id)
  and exists (select 1 from public.media_assets m where m.id = media_id)
);
create policy "Admins manage project media"
on public.project_media for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Published post media is public"
on public.post_media for select to anon, authenticated
using (
  exists (select 1 from public.posts p where p.id = post_id)
  and exists (select 1 from public.media_assets m where m.id = media_id)
);
create policy "Admins manage post media"
on public.post_media for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Published home features are public"
on public.home_features for select to anon, authenticated
using (status = 'published' and coalesce(publish_at, '-infinity'::timestamptz) <= now());
create policy "Admins manage home features"
on public.home_features for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Public settings are readable"
on public.site_settings for select to anon, authenticated
using (is_public = true);
create policy "Admins manage site settings"
on public.site_settings for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Visitors submit moderated forms"
on public.form_submissions for insert to anon, authenticated
with check (
  status = 'new'
  and assigned_to is null
  and honeypot = ''
  and consent = true
  and char_length(email) between 5 and 320
  and char_length(message) <= 6000
);
create policy "Admins manage form submissions"
on public.form_submissions for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('turnoc-public', 'turnoc-public', false, 15728640, array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'application/pdf']),
  ('turnoc-private', 'turnoc-private', false, 26214400, array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

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

create policy "Admins read private media files"
on storage.objects for select to authenticated
using (bucket_id = 'turnoc-private' and (select private.is_admin()));

create policy "Admins upload managed media files"
on storage.objects for insert to authenticated
with check (bucket_id in ('turnoc-public', 'turnoc-private') and (select private.is_admin()));

create policy "Admins update managed media files"
on storage.objects for update to authenticated
using (bucket_id in ('turnoc-public', 'turnoc-private') and (select private.is_admin()))
with check (bucket_id in ('turnoc-public', 'turnoc-private') and (select private.is_admin()));

create policy "Admins delete managed media files"
on storage.objects for delete to authenticated
using (bucket_id in ('turnoc-public', 'turnoc-private') and (select private.is_admin()));

comment on table public.app_users is 'Private application roles mapped to Supabase Auth users.';
comment on table public.form_submissions is 'Moderated public intake. No public SELECT policy exists.';
comment on function private.is_admin() is 'RLS-safe role check. Not exposed through the Data API.';
