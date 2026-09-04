import Link from "next/link";

const navItems = [
  ["Compañía", "/compania"], ["Proyectos", "/proyectos"], ["Artistas", "/artistas"],
  ["Agenda", "/agenda"], ["Actualidad", "/actualidad"], ["Universo", "/universo"], ["Comunidad", "/comunidad"],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Link className="wordmark" href="/" aria-label="Compañía Turnoc — inicio">
          <span className="wordmark-mark" aria-hidden="true" /><span>TURNOC</span><span className="identity-note">Identidad provisional</span>
        </Link>
        <nav className="desktop-nav" aria-label="Navegación principal">
          {navItems.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          <Link className="nav-cta" href="/contacto">Contacto</Link>
        </nav>
        <details className="mobile-menu">
          <summary>Menú</summary>
          <nav className="mobile-nav" aria-label="Navegación móvil">
            {navItems.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
            <Link href="/contacto">Contacto</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
