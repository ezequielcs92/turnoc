import Link from "next/link";

type PageHeroProps = { eyebrow: string; title: string; description: string; index?: string };

export function PageHero({ eyebrow, title, description, index = "·" }: PageHeroProps) {
  return <header className="page-hero" data-index={index}><div className="page-hero-visual" aria-hidden="true"><span /><span /><span /></div><div className="site-shell"><nav className="breadcrumb" aria-label="Ruta de navegación"><Link href="/" prefetch>Inicio</Link><span aria-hidden="true">/</span><span aria-current="page">{eyebrow}</span></nav><div className="page-hero-grid"><div data-reveal="left"><span className="eyebrow">{eyebrow}</span><h1 className="display page-title">{title}</h1></div><p className="lede" data-reveal="right">{description}</p></div></div></header>;
}
