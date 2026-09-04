"use client";

import { useActionState, useState } from "react";
import { submitPublicForm, type PublicFormState } from "@/app/actions";
import type { Database } from "@/types/database.types";

type FormKind = Database["public"]["Enums"]["form_kind"];
const labels: Record<FormKind, { title: string; button: string }> = {
  contact: { title: "Hablemos", button: "Enviar consulta" }, booking: { title: "Contrataciones", button: "Solicitar información" }, press: { title: "Prensa", button: "Pedir material" }, community_proposal: { title: "Proponer a la comunidad", button: "Enviar para revisión" }, newsletter: { title: "Recibir el pulso", button: "Suscribirme" },
};

export function PublicForm({ kind }: { kind: FormKind }) {
  const initialState: PublicFormState = { status: "idle", message: "" };
  const [state, action, pending] = useActionState(submitPublicForm, initialState);
  const [startedAt] = useState(() => Date.now());
  const compact = kind === "newsletter";
  return <form className="form-card" action={action} noValidate><span className="eyebrow">Formulario moderado</span><h2 className="display section-title">{labels[kind].title}</h2><input type="hidden" name="kind" value={kind} /><input type="hidden" name="startedAt" value={startedAt} /><div className="honeypot" aria-hidden="true"><label htmlFor={`${kind}-website`}>Sitio web</label><input id={`${kind}-website`} name="website" tabIndex={-1} autoComplete="off" /></div><div className="form-grid">{compact ? null : <div className="field"><label htmlFor={`${kind}-name`}>Nombre</label><input id={`${kind}-name`} name="name" autoComplete="name" required /><span className="field-error">{state.fieldErrors?.name?.[0]}</span></div>}<div className={`field ${compact ? "field-full" : ""}`}><label htmlFor={`${kind}-email`}>Email</label><input id={`${kind}-email`} name="email" type="email" autoComplete="email" required /><span className="field-error">{state.fieldErrors?.email?.[0]}</span></div>{compact ? null : <><div className="field"><label htmlFor={`${kind}-organization`}>Organización <small>(opcional)</small></label><input id={`${kind}-organization`} name="organization" autoComplete="organization" /></div><div className="field"><label htmlFor={`${kind}-phone`}>Teléfono <small>(opcional)</small></label><input id={`${kind}-phone`} name="phone" type="tel" autoComplete="tel" /></div><div className="field field-full"><label htmlFor={`${kind}-message`}>Mensaje</label><textarea id={`${kind}-message`} name="message" required /><span className="field-error">{state.fieldErrors?.message?.[0]}</span></div></>}<label className="consent field-full"><input name="consent" type="checkbox" required /><span>Acepto que Turnoc use estos datos únicamente para revisar y responder este envío. Nada se publica automáticamente.</span></label></div><p className="form-message" data-status={state.status} aria-live="polite">{state.message}</p><button className="button button-primary" type="submit" disabled={pending}>{pending ? "Enviando…" : labels[kind].button}</button></form>;
}
