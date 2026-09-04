import type { ContentSource } from "@/types/content";

export function SourceBanner({ source }: { source: ContentSource }) {
  if (source !== "demo") return null;
  return <div className="site-shell source-banner" role="status"><span className="source-dot" aria-hidden="true" /><span>Modo demostración activo: nombres, fechas y textos marcados como demo son ficticios y reemplazables.</span></div>;
}
