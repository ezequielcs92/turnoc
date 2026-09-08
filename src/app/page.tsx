import type { CSSProperties } from "react";
import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import { KineticStage } from "@/components/kinetic-stage";
import { SourceBanner } from "@/components/source-banner";
import { formatDateTime, postKindLabels, projectStateLabels } from "@/lib/format";
import { getPublicSnapshot } from "@/lib/supabase/data";

const journey = [
  ["01", "Obras", "#obras", "Presente, futuro y archivo"],
  ["02", "Agenda", "#agenda", "Funciones y encuentros"],
  ["03", "Actualidad", "#actualidad", "Procesos y convocatorias"],
  ["04", "Comunidad", "#comunidad", "Recursos para leer el circo"],
] as const;

export default async function HomePage() {
  const snapshot = await getPublicSnapshot();
  const feature = snapshot.features.find((item) => item.slot === "hero") ?? snapshot.features[0];
  const hero = feature ?? { eyebrow: "Compañía Turnoc", title: "Cuerpos en riesgo. Historias en movimiento.", summary: "Archivo, escena y comunidad en un mismo espacio.", href: "/proyectos" };

  return (
    <main id="contenido" className="site-main">
      <SourceBanner source={snapshot.source} />
      <section className="hero">
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="site-shell hero-shell">
          <div className="hero-topline"><span>Circo contemporáneo</span><span>Archivo vivo · Argentina</span></div>
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">{hero.eyebrow}</span>
              <h1 className="display hero-title" aria-label={hero.title}>{hero.title.split(/\s+/).map((word, index) => <span className="hero-word" style={{ "--word-index": index } as CSSProperties} aria-hidden="true" key={`${word}-${index}`}>{word}</span>)}</h1>
              <div className="button-row hero-actions"><Link className="button button-primary" href={hero.href} prefetch>Entrar en escena <span aria-hidden="true">↗</span></Link><Link className="button button-quiet" href="/contacto" prefetch>Contratar</Link></div>
            </div>
            <div className="hero-aside">
              <KineticStage />
              <div className="hero-aside-copy" data-reveal="right"><div className="hero-index" aria-hidden="true">01</div><p className="lede">{hero.summary}</p></div>
            </div>
          </div>
          <a className="scroll-cue" href="#recorrido"><span>Descubrir el recorrido</span><i aria-hidden="true">↓</i></a>
        </div>
      </section>

      <div className="ticker" aria-hidden="true"><div className="ticker-track"><span>Obras ✦ Artistas ✦ Archivo ✦ Comunidad ✦ Agenda ✦</span><span>Obras ✦ Artistas ✦ Archivo ✦ Comunidad ✦ Agenda ✦</span></div></div>

      <nav className="journey" id="recorrido" aria-label="Recorrido por la portada">
        <div className="site-shell"><div className="journey-heading"><span className="eyebrow">Elegí tu entrada</span><p>Cuatro accesos para llegar antes a lo que buscás.</p></div><div className="journey-grid">{journey.map(([number, label, href, copy]) => <a href={href} className="journey-link" key={href}><span>{number}</span><strong>{label}</strong><small>{copy}</small><i aria-hidden="true">↓</i></a>)}</div></div>
      </nav>

      <section className="section section-dark section-numbered" id="obras" data-section="01">
        <div className="site-shell"><div className="section-heading" data-reveal="left"><div><span className="eyebrow">Obras</span><h2 className="display section-title">Ahora y siempre.</h2></div><p className="lede">Los proyectos viven en presente, futuro y archivo; cada ficha reúne escena, equipo, memoria y contratación.</p></div><div className="card-grid">{snapshot.projects.length ? snapshot.projects.slice(0, 3).map((project, index) => <ContentCard key={project.id} index={index} eyebrow={projectStateLabels[project.state]} title={project.title} copy={project.excerpt} href={`/proyectos/${project.slug}`} />) : <div className="empty-state">La programación publicada aparecerá acá.</div>}</div></div>
      </section>

      <section className="section section-paper section-numbered" id="agenda" data-section="02">
        <div className="site-shell split"><div data-reveal="left"><span className="eyebrow eyebrow-coral">Próximamente</span><h2 className="display section-title">Encontrarnos en tiempo real.</h2><p className="lede">Funciones, talleres, festivales y conversaciones, sin obligar a nadie a crear una cuenta.</p><Link className="button button-coral" href="/agenda" prefetch>Ver agenda completa <span aria-hidden="true">↗</span></Link></div><div className="timeline">{snapshot.events.length ? snapshot.events.slice(0, 4).map((event) => <Link className="timeline-item" href="/agenda" prefetch key={event.id}><span className="timeline-year">{formatDateTime(event.starts_at)}</span><span><strong>{event.title}</strong><br />{event.venue} · {event.city}</span><i aria-hidden="true">↗</i></Link>) : <div className="empty-state">No hay fechas publicadas todavía.</div>}</div></div>
      </section>

      <section className="section section-dark section-numbered" id="actualidad" data-section="03">
        <div className="site-shell"><div className="section-heading" data-reveal="right"><div><span className="eyebrow">Actualidad</span><h2 className="display section-title">Lo que pasa detrás.</h2></div><Link className="button button-quiet" href="/actualidad" prefetch>Abrir el archivo <span aria-hidden="true">↗</span></Link></div><div className="card-grid">{snapshot.posts.length ? snapshot.posts.slice(0, 3).map((post, index) => <ContentCard key={post.id} index={index} eyebrow={postKindLabels[post.kind]} title={post.title} copy={post.excerpt} href={`/actualidad/${post.slug}`} tags={post.tags} />) : <div className="empty-state">Las publicaciones editadas aparecerán acá.</div>}</div></div>
      </section>

      <section className="section section-paper section-numbered community-panel" id="comunidad" data-section="04">
        <div className="site-shell split"><div data-reveal="left"><span className="eyebrow eyebrow-coral">Comunidad de lectura</span><h2 className="display section-title">Curar también es hacer cultura.</h2></div><div className="prose" data-reveal="right"><p>Agenda seleccionada, convocatorias y recursos para leer el circo más allá de una función.</p><p>Las propuestas ingresan a una bandeja moderada. Nada se publica automáticamente.</p><Link className="button button-coral" href="/comunidad" prefetch>Sumar una propuesta <span aria-hidden="true">↗</span></Link></div></div>
      </section>
    </main>
  );
}
