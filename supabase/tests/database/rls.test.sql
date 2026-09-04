begin;

create extension if not exists pgtap with schema extensions;
select plan(10);

select ok(
  (select bool_and(c.relrowsecurity)
   from pg_class c
   join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public'
     and c.relname = any(array['app_users','artists','projects','project_artists','events','posts','media_assets','artist_media','project_media','post_media','home_features','site_settings','form_submissions'])),
  'RLS is enabled on every application table'
);

select ok(has_table_privilege('anon', 'public.artists', 'SELECT'), 'anon may select published artists through RLS');
select ok(not has_table_privilege('anon', 'public.artists', 'INSERT'), 'anon cannot insert artists');
select ok(not has_column_privilege('anon', 'public.artists', 'contact_email', 'SELECT'), 'anon cannot read a private artist email');
select ok(has_table_privilege('anon', 'public.form_submissions', 'INSERT'), 'anon may submit a moderated form');
select ok(not has_table_privilege('anon', 'public.form_submissions', 'SELECT'), 'anon cannot read submissions');
select ok(has_function_privilege('authenticated', 'private.is_admin()', 'EXECUTE'), 'authenticated may execute the private role check');
select ok(not has_function_privilege('anon', 'private.is_admin()', 'EXECUTE'), 'anon cannot execute the private role check');
select is((select public from storage.buckets where id = 'turnoc-public'), false, 'logical public bucket does not bypass RLS');
select ok(
  exists (select 1 from pg_policies where schemaname = 'storage' and policyname = 'Published media files are readable'),
  'published media file access is guarded by a Storage RLS policy'
);

select * from finish();
rollback;
