type PageHeroProps = { eyebrow: string; title: string; description: string; index?: string };

export function PageHero({ eyebrow, title, description, index = "·" }: PageHeroProps) {
  return <header className="page-hero" data-index={index}><div className="site-shell page-hero-grid"><div data-reveal><span className="eyebrow">{eyebrow}</span><h1 className="display page-title">{title}</h1></div><p className="lede" data-reveal>{description}</p></div></header>;
}
