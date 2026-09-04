import type { MetadataRoute } from "next";
import { getPublicSnapshot } from "@/lib/supabase/data";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const snapshot = await getPublicSnapshot();
  const staticPaths = ["", "/compania", "/proyectos", "/artistas", "/agenda", "/actualidad", "/universo", "/comunidad", "/contacto"];
  return [
    ...staticPaths.map((path) => ({ url: absoluteUrl(path || "/"), changeFrequency: "weekly" as const, priority: path === "" ? 1 : .7 })),
    ...snapshot.artists.map((item) => ({ url: absoluteUrl(`/artistas/${item.slug}`), lastModified: item.updated_at, changeFrequency: "monthly" as const, priority: .7 })),
    ...snapshot.projects.map((item) => ({ url: absoluteUrl(`/proyectos/${item.slug}`), lastModified: item.updated_at, changeFrequency: "monthly" as const, priority: .8 })),
    ...snapshot.posts.map((item) => ({ url: absoluteUrl(`/actualidad/${item.slug}`), lastModified: item.updated_at, changeFrequency: "monthly" as const, priority: .6 })),
  ];
}
