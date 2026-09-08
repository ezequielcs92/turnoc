"use client";

import { useDeferredValue, useState } from "react";
import { ContentCard } from "@/components/content-card";

type FilterItem = { id: string; href: string; title: string; copy: string; category: string; tags: string[] };

export function FilterGrid({ items, allLabel = "Todo" }: { items: FilterItem[]; allLabel?: string }) {
  const [active, setActive] = useState("all");
  const deferredActive = useDeferredValue(active);
  const categories = Array.from(new Set(items.map((item) => item.category)));
  const filtered = deferredActive === "all" ? items : items.filter((item) => item.category === deferredActive);
  return <><div className="filter-heading"><div className="filter-bar" aria-label="Filtros de contenido"><button className="filter-button" type="button" aria-pressed={active === "all"} onClick={() => setActive("all")}>{allLabel}</button>{categories.map((category) => <button className="filter-button" type="button" aria-pressed={active === category} onClick={() => setActive(category)} key={category}>{category}</button>)}</div><span className="filter-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}</span></div><div className="card-grid" aria-live="polite">{filtered.length > 0 ? filtered.map((item, index) => <ContentCard index={index} eyebrow={item.category} title={item.title} copy={item.copy} href={item.href} tags={item.tags} key={item.id} />) : <div className="empty-state">No hay contenidos en este filtro todavía.</div>}</div></>;
}
