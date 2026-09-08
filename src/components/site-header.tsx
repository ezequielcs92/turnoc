"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

const navItems = [
  ["Compañía", "/compania"], ["Proyectos", "/proyectos"], ["Artistas", "/artistas"],
  ["Agenda", "/agenda"], ["Actualidad", "/actualidad"], ["Universo", "/universo"], ["Comunidad", "/comunidad"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const closeMenu = () => menuRef.current?.removeAttribute("open");

  return (
    <header className="site-header">
      <div className="scroll-progress" aria-hidden="true" />
      <div className="site-shell header-inner">
        <Link className="wordmark" href="/" prefetch aria-label="Compañía Turnoc — inicio">
          <span className="wordmark-mark" aria-hidden="true" /><span>TURNOC</span><span className="identity-note">Identidad provisional</span>
        </Link>
        <nav className="desktop-nav" aria-label="Navegación principal">
          {navItems.map(([label, href]) => <Link className={isActive(href) ? "is-active" : undefined} href={href} prefetch aria-current={isActive(href) ? "page" : undefined} key={href}>{label}</Link>)}
          <Link className={`nav-cta ${isActive("/contacto") ? "is-active" : ""}`} href="/contacto" prefetch aria-current={isActive("/contacto") ? "page" : undefined}>Contacto</Link>
        </nav>
        <details className="mobile-menu" ref={menuRef}>
          <summary><span>Menú</span><span className="menu-icon" aria-hidden="true"><i /><i /></span></summary>
          <nav className="mobile-nav" aria-label="Navegación móvil">
            <div className="mobile-nav-intro"><span>Explorar</span><strong>Compañía Turnoc</strong></div>
            {navItems.map(([label, href], index) => <Link className={isActive(href) ? "is-active" : undefined} href={href} prefetch aria-current={isActive(href) ? "page" : undefined} onClick={closeMenu} key={href}><span>{String(index + 1).padStart(2, "0")}</span>{label}<span aria-hidden="true">↗</span></Link>)}
            <Link className={`mobile-contact ${isActive("/contacto") ? "is-active" : ""}`} href="/contacto" prefetch aria-current={isActive("/contacto") ? "page" : undefined} onClick={closeMenu}>Contacto <span aria-hidden="true">↗</span></Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
