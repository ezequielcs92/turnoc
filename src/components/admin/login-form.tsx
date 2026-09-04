"use client";

import { useActionState } from "react";
import { signInAction, type AdminActionState } from "@/app/admin/actions";

export function LoginForm() {
  const initialState: AdminActionState = { status: "idle", message: "" };
  const [state, action, pending] = useActionState(signInAction, initialState);
  return <form className="admin-login-form" action={action}><div className="field"><label htmlFor="admin-email">Email</label><input id="admin-email" name="email" type="email" autoComplete="email" required /></div><div className="field"><label htmlFor="admin-password">Contraseña</label><input id="admin-password" name="password" type="password" autoComplete="current-password" required /></div><p className="form-message" data-status={state.status} aria-live="polite">{state.message}</p><button className="button button-primary" type="submit" disabled={pending}>{pending ? "Ingresando…" : "Ingresar al panel"}</button></form>;
}
