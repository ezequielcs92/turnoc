const dateFormatter = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "long", year: "numeric", timeZone: "America/Argentina/Buenos_Aires" });
const dateTimeFormatter = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "America/Argentina/Buenos_Aires" });

export function formatDate(value: string) { return dateFormatter.format(new Date(value)); }
export function formatDateTime(value: string) { return dateTimeFormatter.format(new Date(value)); }
export const projectStateLabels = { current: "En cartel / actual", upcoming: "Próximo", archive: "Archivo" } as const;
export const postKindLabels = { news: "Noticias", blog: "Blog", interview: "Entrevistas", backstage: "Backstage", call: "Convocatorias", communique: "Comunicados", resource: "Recursos" } as const;
export const eventKindLabels = { performance: "Función", workshop: "Taller", festival: "Festival", talk: "Conversación", other: "Actividad" } as const;
