import type { Enums, Tables } from "@/types/database.types";

export type ContentSource = "supabase" | "demo";

export type PublicArtist = Pick<
  Tables<"artists">,
  | "id"
  | "slug"
  | "name"
  | "stage_name"
  | "excerpt"
  | "bio"
  | "disciplines"
  | "experience"
  | "training"
  | "social_links"
  | "cv_url"
  | "seo_title"
  | "seo_description"
  | "updated_at"
>;

export type PublicProject = Pick<
  Tables<"projects">,
  | "id"
  | "slug"
  | "title"
  | "excerpt"
  | "synopsis"
  | "state"
  | "year_start"
  | "year_end"
  | "booking_enabled"
  | "artistic_sheet"
  | "technical_sheet"
  | "press_mentions"
  | "awards"
  | "seo_title"
  | "seo_description"
  | "updated_at"
>;

export type PublicEvent = Pick<
  Tables<"events">,
  | "id"
  | "slug"
  | "title"
  | "kind"
  | "excerpt"
  | "description"
  | "venue"
  | "city"
  | "starts_at"
  | "ends_at"
  | "external_url"
  | "project_id"
  | "artist_id"
  | "updated_at"
>;

export type PublicPost = Pick<
  Tables<"posts">,
  | "id"
  | "slug"
  | "title"
  | "kind"
  | "excerpt"
  | "body"
  | "tags"
  | "cta_label"
  | "cta_url"
  | "closes_at"
  | "project_id"
  | "artist_id"
  | "seo_title"
  | "seo_description"
  | "publish_at"
  | "updated_at"
>;

export type PublicFeature = Pick<
  Tables<"home_features">,
  "id" | "slot" | "eyebrow" | "title" | "summary" | "entity_type" | "entity_id" | "href" | "sort_order"
>;

export type PublicProjectArtist = Pick<Tables<"project_artists">, "project_id" | "artist_id" | "role_name" | "sort_order">;

export type PublicSnapshot = {
  source: ContentSource;
  artists: PublicArtist[];
  projects: PublicProject[];
  events: PublicEvent[];
  posts: PublicPost[];
  features: PublicFeature[];
  credits: PublicProjectArtist[];
};

export type AdminEntityKind = "artists" | "projects" | "posts" | "events";
export type EditorialStatus = Enums<"content_status">;
