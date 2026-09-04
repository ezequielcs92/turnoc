import Link from "next/link";
import { getAdminCounts } from "@/lib/admin";

export default async function AdminDashboardPage() {
  const counts = await getAdminCounts();
  const cards = [["Artistas", counts.artists, "/admin/artists"], ["Proyectos", counts.projects, "/admin/projects"], ["Publicaciones", counts.posts, "/admin/posts"], ["Eventos", counts.events, "/admin/events"], ["Medios", counts.media_assets, "/admin/medios"], ["Formularios", counts.form_submissions, "/admin/formularios"]] as const;
  return <><header className="admin-page-heading"><span className="eyebrow">Dashboard</span><h1>Todo conectado.</h1><p>Creá una entidad una vez, relacionála y reutilizala en el archivo, la agenda y la portada.</p></header><section className="admin-stats">{cards.map(([label, count, href]) => <Link className="admin-stat" href={href} key={href}><span>{label}</span><strong>{count}</strong><span>Gestionar ↗</span></Link>)}</section><section className="section"><h2 className="display section-title">Flujo editorial</h2><div className="timeline"><div className="timeline-item"><span className="timeline-year">01</span><span><strong>Borrador.</strong> Trabajá sin exposición pública.</span></div><div className="timeline-item"><span className="timeline-year">02</span><span><strong>Vista previa.</strong> Revisá contenido y relaciones dentro del panel.</span></div><div className="timeline-item"><span className="timeline-year">03</span><span><strong>Publicar o programar.</strong> RLS controla qué puede leer el público.</span></div></div></section></>;
}
