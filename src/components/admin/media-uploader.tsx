"use client";

import { useRef, useState } from "react";
import { registerMediaAction } from "@/app/admin/actions";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function MediaUploader() {
  const formRef = useRef<HTMLFormElement>(null); const [message, setMessage] = useState(""); const [pending, setPending] = useState(false);
  async function upload(formData: FormData) {
    setPending(true); setMessage(""); const client = createBrowserSupabaseClient(); const file = formData.get("file");
    if (!client || !(file instanceof File) || file.size === 0) { setMessage("Falta la configuración pública de Supabase o un archivo válido."); setPending(false); return; }
    const bucket = "turnoc-private"; const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").slice(0, 200); const path = `${crypto.randomUUID()}/${safeName}`;
    const expectedKind = String(formData.get("kind"));
    const mimeKinds: Record<string, string> = { "image/jpeg": "image", "image/png": "image", "image/webp": "image", "image/avif": "image", "video/mp4": "video", "audio/mpeg": "audio", "audio/wav": "audio", "audio/ogg": "audio", "application/pdf": "document" };
    if (!safeName || file.size > 25 * 1024 * 1024 || mimeKinds[file.type] !== expectedKind) { setMessage("El archivo debe coincidir con el tipo elegido y pesar hasta 25 MiB."); setPending(false); return; }
    const { error } = await client.storage.from(bucket).upload(path, file, { contentType: file.type, upsert: false });
    if (error) { setMessage(`No se pudo subir: ${error.message}`); setPending(false); return; }
    const metadata = new FormData(); metadata.set("title", String(formData.get("title"))); metadata.set("path", path); metadata.set("alt", String(formData.get("alt"))); metadata.set("kind", expectedKind);
    const result = await registerMediaAction({ status: "idle", message: "" }, metadata);
    if (result.status === "error") await client.storage.from(bucket).remove([path]); else formRef.current?.reset();
    setMessage(result.message); setPending(false);
  }
  return <form ref={formRef} className="admin-editor" action={upload}><span className="eyebrow">Carga segura</span><h2>Nuevo medio</h2><div className="form-grid"><div className="field"><label htmlFor="media-title">Título</label><input id="media-title" name="title" required /></div><div className="field"><label htmlFor="media-file">Archivo</label><input id="media-file" name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,audio/mpeg,audio/wav,audio/ogg,application/pdf" required /></div><div className="field"><label htmlFor="media-kind">Tipo</label><select id="media-kind" name="kind"><option value="image">Imagen</option><option value="video">Video</option><option value="document">Documento</option><option value="audio">Audio</option></select></div><div className="field"><label>Fuente editorial</label><input value="Supabase privado" readOnly aria-label="Fuente editorial" /><small>El original permanece privado. Publicar crea una copia explícita en R2.</small></div><div className="field field-full"><label htmlFor="media-alt">Texto alternativo</label><input id="media-alt" name="alt" /></div></div><p className="form-message" aria-live="polite">{message}</p><button className="button button-primary" type="submit" disabled={pending}>{pending ? "Subiendo…" : "Subir como borrador"}</button></form>;
}
