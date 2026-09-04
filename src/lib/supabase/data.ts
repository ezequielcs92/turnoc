import { cache } from "react";
import { demoSnapshot } from "@/lib/content/demo";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { isDemoContentEnabled } from "@/lib/supabase/env";
import type { PublicSnapshot } from "@/types/content";

export const getPublicSnapshot = cache(async (): Promise<PublicSnapshot> => {
  const supabase = createPublicSupabaseClient();

  if (!supabase || isDemoContentEnabled()) {
    return demoSnapshot;
  }

  const [artistsResult, projectsResult, eventsResult, postsResult, featuresResult, creditsResult] = await Promise.all([
    supabase.from("artists").select("id,slug,name,stage_name,excerpt,bio,disciplines,experience,training,social_links,cv_url,seo_title,seo_description,updated_at").order("name"),
    supabase.from("projects").select("id,slug,title,excerpt,synopsis,state,year_start,year_end,booking_enabled,artistic_sheet,technical_sheet,press_mentions,awards,seo_title,seo_description,updated_at").order("year_start", { ascending: false }),
    supabase.from("events").select("id,slug,title,kind,excerpt,description,venue,city,starts_at,ends_at,external_url,project_id,artist_id,updated_at").order("starts_at"),
    supabase.from("posts").select("id,slug,title,kind,excerpt,body,tags,cta_label,cta_url,closes_at,project_id,artist_id,seo_title,seo_description,publish_at,updated_at").order("publish_at", { ascending: false }),
    supabase.from("home_features").select("id,slot,eyebrow,title,summary,entity_type,entity_id,href,sort_order").order("sort_order"),
    supabase.from("project_artists").select("project_id,artist_id,role_name,sort_order").order("sort_order"),
  ]);

  const firstError = [artistsResult, projectsResult, eventsResult, postsResult, featuresResult, creditsResult].find((result) => result.error)?.error;
  if (firstError) {
    console.error("Public content query failed", firstError.message);
  }

  return {
    source: "supabase",
    artists: artistsResult.data ?? [],
    projects: projectsResult.data ?? [],
    events: eventsResult.data ?? [],
    posts: postsResult.data ?? [],
    features: featuresResult.data ?? [],
    credits: creditsResult.data ?? [],
  };
});

export const getArtistBySlug = cache(async (slug: string) => {
  const snapshot = await getPublicSnapshot();
  return snapshot.artists.find((artist) => artist.slug === slug) ?? null;
});

export const getProjectBySlug = cache(async (slug: string) => {
  const snapshot = await getPublicSnapshot();
  return snapshot.projects.find((project) => project.slug === slug) ?? null;
});

export const getPostBySlug = cache(async (slug: string) => {
  const snapshot = await getPublicSnapshot();
  return snapshot.posts.find((post) => post.slug === slug) ?? null;
});
