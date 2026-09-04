drop policy "Published artists are public" on public.artists;
create policy "Published artists are public"
on public.artists for select to anon, authenticated
using (status in ('published', 'scheduled') and coalesce(publish_at, '-infinity'::timestamptz) <= now());

drop policy "Published projects are public" on public.projects;
create policy "Published projects are public"
on public.projects for select to anon, authenticated
using (status in ('published', 'scheduled') and coalesce(publish_at, '-infinity'::timestamptz) <= now());

drop policy "Published events are public" on public.events;
create policy "Published events are public"
on public.events for select to anon, authenticated
using (status in ('published', 'scheduled') and coalesce(publish_at, '-infinity'::timestamptz) <= now());

drop policy "Published posts are public" on public.posts;
create policy "Published posts are public"
on public.posts for select to anon, authenticated
using (status in ('published', 'scheduled') and coalesce(publish_at, '-infinity'::timestamptz) <= now());

drop policy "Published media metadata is public" on public.media_assets;
create policy "Published media metadata is public"
on public.media_assets for select to anon, authenticated
using (status in ('published', 'scheduled') and coalesce(publish_at, '-infinity'::timestamptz) <= now());

drop policy "Published home features are public" on public.home_features;
create policy "Published home features are public"
on public.home_features for select to anon, authenticated
using (status in ('published', 'scheduled') and coalesce(publish_at, '-infinity'::timestamptz) <= now());
