import type { Metadata } from "next";
import { FilterGrid } from "@/components/filter-grid";
import { PageHero } from "@/components/page-hero";
import { SourceBanner } from "@/components/source-banner";
import { getPublicSnapshot } from "@/lib/supabase/data";

export const metadata: Metadata = { title: "Artistas", description: "Directorio de artistas y disciplinas de Compañía Turnoc." };
export default async function ArtistsPage() { const snapshot = await getPublicSnapshot(); const items = snapshot.artists.flatMap((artist) => artist.disciplines.length ? artist.disciplines.map((discipline) => ({ id: `${artist.id}-${discipline}`, href: `/artistas/${artist.slug}`, title: artist.stage_name ?? artist.name, copy: artist.excerpt, category: discipline, tags: artist.disciplines.filter((item) => item !== discipline) })) : [{ id: artist.id, href: `/artistas/${artist.slug}`, title: artist.stage_name ?? artist.name, copy: artist.excerpt, category: "Otras disciplinas", tags: [] }]); return <main id="contenido"><PageHero eyebrow="Elenco y red" title="Artistas con trayectoria propia." description="Perfiles reutilizables, conectados con sus obras, fechas, medios y materiales profesionales." index="04" /><SourceBanner source={snapshot.source} /><section className="section"><div className="site-shell"><FilterGrid items={items} allLabel="Todas las disciplinas" /></div></section></main>; }
