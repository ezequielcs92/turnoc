"use client";

import { useDeferredValue, useState } from "react";
import Link from "next/link";

type FilterItem = { id: string; href: string; title: string; copy: string; category: string; tags: string[] };

export function FilterGrid({ items, allLabel = "Todo" }: { items: FilterItem[]; allLabel?: string }) {
  const [active, setActive] = useState("all");
  const deferredActive = useDeferredValue(active);
  const categories = Array.from(new Set(items.map((item) => item.category)));
  const filtered = deferredActive === "all" ? items : items.filter((item) => item.category === deferredActive);
  return <><div className="filter-bar" aria-label="Filtros de contenido"><button className="filter-button" type="button" aria-pressed={active === "all"} onClick={() => setActive("all")}>{allLabel}</button>{categories.map((category) => <button className="filter-button" type="button" aria-pressed={active === category} onClick={() => setActive(category)} key={category}>{category}</button>)}</div><div className="card-grid" aria-live="polite">{filtered.length > 0 ? filtered.map((item, index) => <Link className="content-card" href={item.href} key={item.id}><div><div className="card-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div><div className="card-meta"><span>{item.category}</span>{item.tags.slice(0, 3).map((tag) => <span className="pill" key={tag}>{tag}</span>)}</div><h2 className="card-title">{item.title}</h2><p className="card-copy">{item.copy}</p></div><span className="card-arrow" aria-hidden="true">↗</span></Link>) : <div className="empty-state">No hay contenidos en este filtro todavía.</div>}</div></>;
}
