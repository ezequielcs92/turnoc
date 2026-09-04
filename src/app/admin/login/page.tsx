import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Acceso privado", robots: { index: false, follow: false } };
type Props = { searchParams: Promise<{ setup?: string; error?: string }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  const query = await searchParams;
  return <main id="contenido" className="admin-login"><section className="admin-login-card"><span className="eyebrow">Sólo equipo Turnoc</span><h1 className="display section-title">Panel editorial.</h1><p className="lede">No existen cuentas públicas en esta versión.</p>{query.setup === "missing" ? <p className="admin-note">Falta configurar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` en el entorno local. No pegues secretos ni uses la service-role key.</p> : null}{query.error === "unauthorized" ? <p className="admin-note">La sesión es válida, pero este usuario no está asociado al rol administrador. Usá el procedimiento documentado de bootstrap.</p> : null}<LoginForm /></section></main>;
}
