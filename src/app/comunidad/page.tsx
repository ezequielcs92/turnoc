import type { Metadata } from "next";
import { ContentCard } from "@/components/content-card";
import { PageHero } from "@/components/page-hero";
import { PublicForm } from "@/components/public-form";
import { SourceBanner } from "@/components/source-banner";
import { getPublicSnapshot } from "@/lib/supabase/data";

export const metadata: Metadata = { title: "Comunidad de lectura", description: "Agenda cultural, convocatorias, talleres, newsletter y propuestas moderadas." };
export default async function CommunityPage() { const snapshot = await getPublicSnapshot(); const calls = snapshot.posts.filter((post) => post.kind === "call" || post.kind === "resource"); return <main id="contenido"><PageHero eyebrow="Curaduría y conversación" title="Una comunidad para leer el circo." description="Agenda cultural seleccionada, convocatorias, talleres y propuestas con moderación humana." index="08" /><SourceBanner source={snapshot.source} /><section className="section"><div className="site-shell"><div className="section-heading"><div><span className="eyebrow">Selección</span><h2 className="display section-title">Recursos y oportunidades.</h2></div><p className="lede">Sólo se muestra contenido publicado por el equipo administrador.</p></div><div className="card-grid">{calls.length ? calls.map((post, index) => <ContentCard index={index} eyebrow={post.kind === "call" ? "Convocatoria" : "Recurso"} title={post.title} copy={post.excerpt} href={`/actualidad/${post.slug}`} tags={post.tags} key={post.id} />) : <div className="empty-state">No hay selecciones publicadas todavía.</div>}</div></div></section><section className="section section-dark" id="proponer"><div className="site-shell split"><PublicForm kind="community_proposal" /><PublicForm kind="newsletter" /></div></section></main>; }
