import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AdminEntityKind, EditorialStatus } from "@/types/content";

export type AdminRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  status: EditorialStatus;
  publishAt: string | null;
  category: string;
  list: string[];
  startsAt: string | null;
  venue: string;
  city: string;
  externalUrl: string;
};

export async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/admin/login?setup=missing");
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect("/admin/login");
  const { data: profile } = await supabase.from("app_users").select("user_id,display_name,role,active").eq("user_id", user.id).eq("role", "admin").eq("active", true).maybeSingle();
  if (!profile) redirect("/admin/login?error=unauthorized");
  return { supabase, user, profile };
}

export async function getAdminCollection(kind: AdminEntityKind): Promise<AdminRow[]> {
  const { supabase } = await requireAdmin();
  if (kind === "artists") {
    const { data, error } = await supabase.from("artists").select("id,name,slug,excerpt,bio,status,publish_at,disciplines").order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((item) => ({ id: item.id, title: item.name, slug: item.slug, excerpt: item.excerpt, body: item.bio, status: item.status, publishAt: item.publish_at, category: "artist", list: item.disciplines, startsAt: null, venue: "", city: "", externalUrl: "" }));
  }
  if (kind === "projects") {
    const { data, error } = await supabase.from("projects").select("id,title,slug,excerpt,synopsis,status,publish_at,state").order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((item) => ({ id: item.id, title: item.title, slug: item.slug, excerpt: item.excerpt, body: item.synopsis, status: item.status, publishAt: item.publish_at, category: item.state, list: [], startsAt: null, venue: "", city: "", externalUrl: "" }));
  }
  if (kind === "posts") {
    const { data, error } = await supabase.from("posts").select("id,title,slug,excerpt,body,status,publish_at,kind,tags").order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((item) => ({ id: item.id, title: item.title, slug: item.slug, excerpt: item.excerpt, body: item.body, status: item.status, publishAt: item.publish_at, category: item.kind, list: item.tags, startsAt: null, venue: "", city: "", externalUrl: "" }));
  }
  const { data, error } = await supabase.from("events").select("id,title,slug,excerpt,description,status,publish_at,kind,starts_at,venue,city,external_url").order("starts_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((item) => ({ id: item.id, title: item.title, slug: item.slug, excerpt: item.excerpt, body: item.description, status: item.status, publishAt: item.publish_at, category: item.kind, list: [], startsAt: item.starts_at, venue: item.venue, city: item.city, externalUrl: item.external_url ?? "" }));
}

export async function getAdminCounts() {
  const { supabase } = await requireAdmin();
  const tables = ["artists", "projects", "posts", "events", "media_assets", "form_submissions"] as const;
  const results = await Promise.all(tables.map((table) => supabase.from(table).select("id", { count: "exact", head: true })));
  return Object.fromEntries(tables.map((table, index) => [table, results[index].count ?? 0])) as Record<(typeof tables)[number], number>;
}
