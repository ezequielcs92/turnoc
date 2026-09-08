import { setMediaStatusAction } from "@/app/admin/actions";
import { MediaUploader } from "@/components/admin/media-uploader";
import { requireAdmin } from "@/lib/admin";
import { isR2Configured } from "@/lib/r2/config";

export default async function AdminMediaPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("media_assets")
    .select("id,title,kind,object_path,status,alt_text,public_url")
    .order("updated_at", { ascending: false });
  const r2Ready = isR2Configured();

  return <>
    <header className="admin-page-heading">
      <span className="eyebrow">Biblioteca</span>
      <h1>Medios.</h1>
      <p>Supabase conserva cada fuente privada. R2 recibe una copia sólo cuando una persona administradora publica.</p>
      <p className="form-message" role="status">{r2Ready ? "R2 listo para publicar." : "R2 no está configurado: los medios seguirán privados y en borrador."}</p>
    </header>
    <div className="admin-workspace">
      <MediaUploader />
      <section className="admin-list">
        {data?.length ? data.map((item) => <article className="admin-list-item" key={item.id}>
          <div>
            <div className="card-meta"><span>{item.kind}</span><span className={`status status-${item.status}`}>{item.status}</span><span>Fuente privada</span></div>
            <h2>{item.title}</h2>
            <p>{item.alt_text || "Sin texto alternativo"}</p>
            <code>{item.object_path}</code>
            {item.public_url ? <p><a href={item.public_url} target="_blank" rel="noreferrer">Abrir copia pública en R2</a></p> : null}
          </div>
          <div className="admin-row-actions">
            {item.status !== "published" ? <form action={setMediaStatusAction.bind(null, item.id, "published")}><button className="button button-primary" type="submit" disabled={!r2Ready}>Publicar en R2</button></form> : null}
            {item.status === "published" ? <form action={setMediaStatusAction.bind(null, item.id, "archived")}><button className="button admin-danger" type="submit">Archivar</button></form> : null}
            {item.status === "archived" ? <form action={setMediaStatusAction.bind(null, item.id, "draft")}><button className="button button-quiet" type="submit">Volver a borrador</button></form> : null}
          </div>
        </article>) : <div className="empty-state">No hay medios registrados.</div>}
      </section>
    </div>
  </>;
}
