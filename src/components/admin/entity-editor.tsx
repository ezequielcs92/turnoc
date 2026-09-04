"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveAdminEntity, type AdminActionState } from "@/app/admin/actions";
import type { AdminRow } from "@/lib/admin";
import type { AdminEntityKind } from "@/types/content";

const labels = {
  artists: { singular: "artista", title: "Nombre", body: "Biografía", list: "Disciplinas (separadas por coma)" },
  projects: { singular: "proyecto", title: "Título", body: "Sinopsis", list: "" },
  posts: { singular: "publicación", title: "Título", body: "Contenido", list: "Etiquetas (separadas por coma)" },
  events: { singular: "evento", title: "Título", body: "Descripción", list: "" },
} as const;

const categoryOptions = {
  artists: [["artist", "Artista"]],
  projects: [["current", "Actual"], ["upcoming", "Próximo"], ["archive", "Archivo"]],
  posts: [["news", "Noticia"], ["blog", "Blog"], ["interview", "Entrevista"], ["backstage", "Backstage"], ["call", "Convocatoria"], ["communique", "Comunicado"], ["resource", "Recurso"]],
  events: [["performance", "Función"], ["workshop", "Taller"], ["festival", "Festival"], ["talk", "Conversación"], ["other", "Otra"]],
} as const;

function localDateTime(value: string | null) { return value ? value.slice(0, 16) : ""; }

export function EntityEditor({ kind, item }: { kind: AdminEntityKind; item: AdminRow | null }) {
  const actionWithKind = saveAdminEntity.bind(null, kind);
  const initialState: AdminActionState = { status: "idle", message: "" };
  const [state, action, pending] = useActionState(actionWithKind, initialState);
  const text = labels[kind];
  const previewPath = item ? `/admin/preview/${kind}/${item.id}` : null;
  return <form className="admin-editor" action={action}><div className="admin-editor-heading"><div><span className="eyebrow">{item ? "Editar" : "Nuevo borrador"}</span><h2>{item ? item.title : `Crear ${text.singular}`}</h2></div>{previewPath ? <Link className="button button-quiet" href={previewPath}>Vista previa</Link> : null}</div><input type="hidden" name="id" value={item?.id ?? ""} /><div className="form-grid"><div className="field"><label htmlFor={`${kind}-title`}>{text.title}</label><input id={`${kind}-title`} name="title" defaultValue={item?.title} required /><span className="field-error">{state.fieldErrors?.title?.[0]}</span></div><div className="field"><label htmlFor={`${kind}-slug`}>Slug</label><input id={`${kind}-slug`} name="slug" defaultValue={item?.slug} placeholder="nombre-en-minusculas" required /><span className="field-error">{state.fieldErrors?.slug?.[0]}</span></div><div className="field field-full"><label htmlFor={`${kind}-excerpt`}>Resumen</label><textarea id={`${kind}-excerpt`} name="excerpt" defaultValue={item?.excerpt} style={{ minHeight: "6rem" }} /></div><div className="field field-full"><label htmlFor={`${kind}-body`}>{text.body}</label><textarea id={`${kind}-body`} name="body" defaultValue={item?.body} /></div>{text.list ? <div className="field field-full"><label htmlFor={`${kind}-list`}>{text.list}</label><input id={`${kind}-list`} name="list" defaultValue={item?.list.join(", ")} /></div> : null}<div className="field"><label htmlFor={`${kind}-category`}>Tipo / estado</label><select id={`${kind}-category`} name="category" defaultValue={item?.category ?? categoryOptions[kind][0][0]}>{categoryOptions[kind].map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></div>{kind === "events" ? <><div className="field"><label htmlFor="event-starts">Fecha del evento</label><input id="event-starts" name="startsAt" type="datetime-local" defaultValue={localDateTime(item?.startsAt ?? null)} required /><span className="field-error">{state.fieldErrors?.startsAt?.[0]}</span></div><div className="field"><label htmlFor="event-venue">Lugar</label><input id="event-venue" name="venue" defaultValue={item?.venue} /></div><div className="field"><label htmlFor="event-city">Ciudad</label><input id="event-city" name="city" defaultValue={item?.city} /></div><div className="field field-full"><label htmlFor="event-url">Enlace externo</label><input id="event-url" name="externalUrl" type="url" defaultValue={item?.externalUrl} /></div></> : <><input type="hidden" name="startsAt" value="" /><input type="hidden" name="venue" value="" /><input type="hidden" name="city" value="" /><input type="hidden" name="externalUrl" value="" /></>}<div className="field"><label htmlFor={`${kind}-status`}>Flujo editorial</label><select id={`${kind}-status`} name="status" defaultValue={item?.status ?? "draft"}><option value="draft">Borrador</option><option value="scheduled">Programado</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></div><div className="field"><label htmlFor={`${kind}-publish-at`}>Publicar desde</label><input id={`${kind}-publish-at`} name="publishAt" type="datetime-local" defaultValue={localDateTime(item?.publishAt ?? null)} /><span className="field-error">{state.fieldErrors?.publishAt?.[0]}</span></div></div><p className="form-message" data-status={state.status} aria-live="polite">{state.message}</p><div className="button-row"><button className="button button-primary" type="submit" disabled={pending}>{pending ? "Guardando…" : "Guardar"}</button>{item ? <Link className="button button-quiet" href={`/admin/${kind}`}>Cancelar edición</Link> : null}</div></form>;
}
