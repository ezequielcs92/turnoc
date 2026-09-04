import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SourceBanner } from "@/components/source-banner";
import { eventKindLabels, formatDateTime } from "@/lib/format";
import { getPublicSnapshot } from "@/lib/supabase/data";

export const metadata: Metadata = { title: "Agenda", description: "Funciones, talleres, festivales y actividades de Compañía Turnoc." };
export default async function AgendaPage() { const snapshot = await getPublicSnapshot(); return <main id="contenido"><PageHero eyebrow="Fechas" title="Dónde sucede lo próximo." description="Funciones, talleres, festivales y conversaciones. Los enlaces externos sólo aparecen cuando fueron cargados y publicados." index="05" /><SourceBanner source={snapshot.source} /><section className="section"><div className="site-shell"><div className="timeline">{snapshot.events.length ? snapshot.events.map((event) => <article className="timeline-item" key={event.id}><span className="timeline-year">{formatDateTime(event.starts_at)}</span><div><div className="card-meta"><span>{eventKindLabels[event.kind]}</span><span className="pill">{event.city || "Lugar a confirmar"}</span></div><h2 className="card-title">{event.title}</h2><p className="card-copy">{event.excerpt}</p><p>{event.venue}</p>{event.external_url ? <Link className="button button-primary" href={event.external_url} target="_blank" rel="noreferrer">Ir al enlace oficial ↗</Link> : null}</div></article>) : <div className="empty-state">No hay fechas publicadas. El archivo de eventos queda igualmente disponible desde el panel.</div>}</div></div></section></main>; }
