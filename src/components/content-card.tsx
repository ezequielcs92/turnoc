import Link from "next/link";

type ContentCardProps = { index: number; eyebrow: string; title: string; copy: string; href: string; tags?: string[] };

export function ContentCard({ index, eyebrow, title, copy, href, tags = [] }: ContentCardProps) {
  return <Link className="content-card" href={href} prefetch data-reveal><div className="card-visual" aria-hidden="true"><span className="card-number">{String(index + 1).padStart(2, "0")}</span><i /><i /><i /></div><div className="card-content"><div className="card-meta"><span>{eyebrow}</span>{tags.slice(0, 3).map((tag) => <span className="pill" key={tag}>{tag}</span>)}</div><h2 className="card-title">{title}</h2><p className="card-copy">{copy}</p></div><span className="card-arrow" aria-hidden="true">↗</span></Link>;
}
