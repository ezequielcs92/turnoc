import type { Metadata } from "next";
import { FilterGrid } from "@/components/filter-grid";
import { PageHero } from "@/components/page-hero";
import { SourceBanner } from "@/components/source-banner";
import { postKindLabels } from "@/lib/format";
import { getPublicSnapshot } from "@/lib/supabase/data";

export const metadata: Metadata = { title: "Actualidad", description: "Noticias, entrevistas, backstage, convocatorias y comunicados de Turnoc." };
export default async function NewsPage() { const snapshot = await getPublicSnapshot(); const items = snapshot.posts.map((post) => ({ id: post.id, href: `/actualidad/${post.slug}`, title: post.title, copy: post.excerpt, category: postKindLabels[post.kind], tags: post.tags })); return <main id="contenido"><PageHero eyebrow="Publicaciones" title="Actualidad, procesos y señales." description="Una superficie editorial para noticias, blog, entrevistas, backstage, convocatorias y comunicados." index="06" /><SourceBanner source={snapshot.source} /><section className="section"><div className="site-shell"><FilterGrid items={items} allLabel="Toda la actualidad" /></div></section></main>; }
