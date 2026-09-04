"use client";

import { useRef, useState } from "react";
import { registerMediaAction } from "@/app/admin/actions";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function MediaUploader() {
  const formRef = useRef<HTMLFormElement>(null); const [message, setMessage] = useState(""); const [pending, setPending] = useState(false);
  async function upload(formData: FormData) {
    setPending(true); setMessage(""); const client = createBrowserSupabaseClient(); const file = formData.get("file");
    if (!client || !(file instanceof File) || file.size === 0) { setMessage("Falta la configuración pública de Supabase o un archivo válido."); setPending(false); return; }
    const bucket = String(formData.get("bucket")); const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-"); const path = `${crypto.randomUUID()}/${safeName}`;
    const { error } = await client.storage.from(bucket).upload(path, file, { contentType: file.type, upsert: false });
    if (error) { setMessage(`No se pudo subir: ${error.message}`); setPending(false); return; }
    const metadata = new FormData(); metadata.set("title", String(formData.get("title"))); metadata.set("bucket", bucket); metadata.set("path", path); metadata.set("alt", String(formData.get("alt"))); metadata.set("kind", String(formData.get("kind")));
    const result = await registerMediaAction({ status: "idle", message: "" }, metadata);
    if (result.status === "error") await client.storage.from(bucket).remove([path]); else formRef.current?.reset();
    setMessage(result.message); setPending(false);
  }
  return <form ref={formRef} className="admin-editor" action={upload}><span className="eyebrow">Carga segura</span><h2>Nuevo medio</h2><div className="form-grid"><div className="field"><label htmlFor="media-title">Título</label><input id="media-title" name="title" required /></div><div className="field"><label htmlFor="media-file">Archivo</label><input id="media-file" name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,audio/mpeg,audio/wav,audio/ogg,application/pdf" required /></div><div className="field"><label htmlFor="media-kind">Tipo</label><select id="media-kind" name="kind"><option value="image">Imagen</option><option value="video">Video</option><option value="document">Documento</option><option value="audio">Audio</option></select></div><div className="field"><label htmlFor="media-bucket">Destino editorial</label><select id="media-bucket" name="bucket"><option value="turnoc-private">Privado / dossier</option><option value="turnoc-public">Publicable</option></select><small>“Publicable” sigue protegido hasta que uses Publicar en la biblioteca.</small></div><div className="field field-full"><label htmlFor="media-alt">Texto alternativo</label><input id="media-alt" name="alt" /></div></div><p className="form-message" aria-live="polite">{message}</p><button className="button button-primary" type="submit" disabled={pending}>{pending ? "Subiendo…" : "Subir como borrador"}</button></form>;
}
