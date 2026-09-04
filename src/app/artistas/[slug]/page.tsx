import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentCard } from "@/components/content-card";
import { SourceBanner } from "@/components/source-banner";
import { getArtistBySlug, getPublicSnapshot } from "@/lib/supabase/data";
import { absoluteUrl, jsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) return { title: "Artista no encontrado" };
  return { title: artist.seo_title ?? artist.stage_name ?? artist.name, description: artist.seo_description ?? artist.excerpt, alternates: { canonical: `/artistas/${artist.slug}` }, openGraph: { title: artist.seo_title ?? artist.name, description: artist.seo_description ?? artist.excerpt, url: `/artistas/${artist.slug}`, type: "profile" } };
}

export default async function ArtistDetailPage({ params }: Props) {
  const { slug } = await params;
  const [artist, snapshot] = await Promise.all([getArtistBySlug(slug), getPublicSnapshot()]);
  if (!artist) notFound();
  const projectIds = new Set(snapshot.credits.filter((credit) => credit.artist_id === artist.id).map((credit) => credit.project_id));
  const projects = snapshot.projects.filter((project) => projectIds.has(project.id));
  const posts = snapshot.posts.filter((post) => post.artist_id === artist.id);
  const schema = { "@context": "https://schema.org", "@type": "Person", name: artist.stage_name ?? artist.name, description: artist.excerpt, url: absoluteUrl(`/artistas/${artist.slug}`), knowsAbout: artist.disciplines };
  return <main id="contenido"><SourceBanner source={snapshot.source} /><article><header className="detail-hero"><div className="site-shell"><span className="eyebrow">Artista</span><h1 className="display page-title">{artist.stage_name ?? artist.name}</h1><div className="detail-kicker">{artist.disciplines.map((item) => <span className="pill" key={item}>{item}</span>)}</div><p className="lede">{artist.excerpt}</p></div></header><div className="site-shell detail-body split"><div><span className="eyebrow">Trayectoria</span><h2 className="display section-title">Cuerpo de obra.</h2></div><div className="prose"><p>{artist.bio || "La biografía aprobada todavía no fue cargada."}</p><dl className="fact-list"><div className="fact-row"><dt>Experiencia</dt><dd>{artist.experience.length ? artist.experience.join(" · ") : "A completar"}</dd></div><div className="fact-row"><dt>Formación</dt><dd>{artist.training.length ? artist.training.join(" · ") : "A completar"}</dd></div><div className="fact-row"><dt>Contacto</dt><dd><Link href="/contacto">Gestionado por la compañía</Link></dd></div></dl></div></div></article><section className="section section-dark"><div className="site-shell"><div className="section-heading"><h2 className="display section-title">Proyectos relacionados.</h2></div><div className="card-grid">{projects.length ? projects.map((project, index) => <ContentCard index={index} eyebrow="Proyecto" title={project.title} copy={project.excerpt} href={`/proyectos/${project.slug}`} key={project.id} />) : <div className="empty-state">No hay proyectos relacionados publicados.</div>}</div>{posts.length ? <div className="card-grid" style={{ marginTop: "1rem" }}>{posts.map((post, index) => <ContentCard index={index} eyebrow="Publicación" title={post.title} copy={post.excerpt} href={`/actualidad/${post.slug}`} key={post.id} />)}</div> : null}</div></section><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} /></main>;
}
