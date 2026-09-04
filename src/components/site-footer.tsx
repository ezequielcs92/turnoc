import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="footer"><div className="site-shell">
      <div className="footer-grid"><div className="footer-title">El circo sigue.</div><div className="footer-meta"><Link href="/contacto">Contrataciones</Link><Link href="/contacto#prensa">Prensa</Link><Link href="/admin/login">Acceso Turnoc</Link></div></div>
      <p className="provisional">Sistema visual y contenidos de demostración — reemplazar con la identidad y materiales aprobados por Compañía Turnoc.</p>
    </div></footer>
  );
}
