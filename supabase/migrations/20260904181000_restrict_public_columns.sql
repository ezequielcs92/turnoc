-- RLS decides which rows are public; column grants also prevent visitors from
-- requesting editorial UUIDs or a non-public artist email directly via REST.
revoke select on public.artists, public.projects, public.project_artists, public.events, public.posts,
  public.media_assets, public.artist_media, public.project_media, public.post_media, public.home_features,
  public.site_settings from anon;

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
