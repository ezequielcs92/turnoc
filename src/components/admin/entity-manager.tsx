import Link from "next/link";
import { archiveAdminEntity } from "@/app/admin/actions";
import { EntityEditor } from "@/components/admin/entity-editor";
import { getAdminCollection } from "@/lib/admin";
import type { AdminEntityKind } from "@/types/content";

const headings = { artists: ["Artistas", "Perfiles, disciplinas y trayectoria."], projects: ["Proyectos", "Obras actuales, próximas y de archivo."], posts: ["Publicaciones", "Noticias, blog, convocatorias y recursos."], events: ["Eventos", "Funciones, talleres, festivales y agenda."] } as const;

export async function EntityManager({ kind, searchParams }: { kind: AdminEntityKind; searchParams: Promise<{ edit?: string }> }) {
  const [rows, query] = await Promise.all([getAdminCollection(kind), searchParams]);
  const editing = rows.find((row) => row.id === query.edit) ?? null;
  return <div><header className="admin-page-heading"><span className="eyebrow">Contenido</span><h1>{headings[kind][0]}</h1><p>{headings[kind][1]}</p></header><div className="admin-workspace"><EntityEditor kind={kind} item={editing} /><section className="admin-list" aria-label={`Listado de ${headings[kind][0]}`}>{rows.length ? rows.map((row) => <article className="admin-list-item" key={row.id}><div><div className="card-meta"><span className={`status status-${row.status}`}>{row.status}</span><span>{row.category}</span></div><h2>{row.title}</h2><p>{row.excerpt || "Sin resumen"}</p></div><div className="admin-row-actions"><Link className="button button-quiet" href={`/admin/${kind}?edit=${row.id}`}>Editar</Link><Link className="button button-quiet" href={`/admin/preview/${kind}/${row.id}`}>Previsualizar</Link><form action={archiveAdminEntity.bind(null, kind, row.id)}><button className="button admin-danger" type="submit">Archivar</button></form></div></article>) : <div className="empty-state">Todavía no hay contenidos. Creá el primero como borrador.</div>}</section></div></div>;
}
