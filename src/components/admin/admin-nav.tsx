import Link from "next/link";
import { signOutAction } from "@/app/admin/actions";

const links = [["Panel", "/admin"], ["Artistas", "/admin/artists"], ["Proyectos", "/admin/projects"], ["Publicaciones", "/admin/posts"], ["Eventos", "/admin/events"], ["Medios", "/admin/medios"], ["Formularios", "/admin/formularios"], ["Portada", "/admin/portada"], ["Universo", "/admin/universo"], ["SEO y ajustes", "/admin/configuracion"], ["Cuenta", "/admin/cuenta"]] as const;

export function AdminNav({ name }: { name: string }) {
  return <aside className="admin-sidebar"><div><span className="eyebrow">Área privada</span><p className="admin-user">{name}</p></div><nav aria-label="Panel de administración">{links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav><form action={signOutAction}><button className="button button-quiet" type="submit">Cerrar sesión</button></form></aside>;
}
