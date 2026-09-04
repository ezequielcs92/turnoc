-- New application tables and sequences stay closed by default. Explicit grants
-- must accompany every future migration, so RLS cannot be bypassed accidentally.
revoke all on all sequences in schema public from anon, authenticated;

alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;

alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated;
