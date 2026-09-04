import type { Metadata } from "next";
import { FilterGrid } from "@/components/filter-grid";
import { PageHero } from "@/components/page-hero";
import { SourceBanner } from "@/components/source-banner";
import { projectStateLabels } from "@/lib/format";
import { getPublicSnapshot } from "@/lib/supabase/data";

export const metadata: Metadata = { title: "Proyectos", description: "Obras actuales, próximas y archivo de Compañía Turnoc." };
export default async function ProjectsPage() { const snapshot = await getPublicSnapshot(); const items = snapshot.projects.map((project) => ({ id: project.id, href: `/proyectos/${project.slug}`, title: project.title, copy: project.excerpt, category: projectStateLabels[project.state], tags: project.year_start ? [String(project.year_start)] : [] })); return <main id="contenido"><PageHero eyebrow="Obras" title="Proyectos en presente, futuro y memoria." description="Cada landing conecta sinopsis, estado, equipo, materiales, agenda, prensa y contratación." index="03" /><SourceBanner source={snapshot.source} /><section className="section"><div className="site-shell"><FilterGrid items={items} allLabel="Todos los proyectos" /></div></section></main>; }
