const MIME_CONFIG = {
  "image/jpeg": { kind: "image", extension: "jpg" },
  "image/png": { kind: "image", extension: "png" },
  "image/webp": { kind: "image", extension: "webp" },
  "image/avif": { kind: "image", extension: "avif" },
  "video/mp4": { kind: "video", extension: "mp4" },
  "audio/mpeg": { kind: "audio", extension: "mp3" },
  "audio/wav": { kind: "audio", extension: "wav" },
  "audio/ogg": { kind: "audio", extension: "ogg" },
  "application/pdf": { kind: "document", extension: "pdf" },
} as const;

export type MediaKind = "image" | "video" | "audio" | "document";
export const MAX_MEDIA_BYTES = 25 * 1024 * 1024;

export function validateMediaSource(blob: Blob, expectedKind: MediaKind) {
  if (blob.size <= 0 || blob.size > MAX_MEDIA_BYTES) {
    throw new Error("El archivo debe pesar entre 1 byte y 25 MiB.");
  }

  const mime = blob.type.toLowerCase() as keyof typeof MIME_CONFIG;
  const config = MIME_CONFIG[mime];
  if (!config || config.kind !== expectedKind) {
    throw new Error("El MIME del archivo no coincide con su tipo editorial.");
  }

  return { contentType: mime, extension: config.extension };
}

export function buildR2ObjectKey(assetId: string, extension: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(assetId)) {
    throw new Error("Identificador de medio inválido.");
  }
  if (!/^[a-z0-9]{2,5}$/.test(extension)) throw new Error("Extensión de medio inválida.");
  return `media/${assetId}/public.${extension}`;
}

export function assertR2ObjectKey(key: string) {
  if (!/^media\/[0-9a-f-]{36}\/public\.[a-z0-9]{2,5}$/i.test(key) || key.includes("..")) {
    throw new Error("Clave pública de medio inválida.");
  }
  return key;
}

export function buildPublicObjectUrl(baseUrl: string, key: string) {
  const safeKey = assertR2ObjectKey(key).split("/").map(encodeURIComponent).join("/");
  const base = new URL(baseUrl);
  if (base.protocol !== "https:" || base.username || base.password) throw new Error("URL pública de R2 inválida.");
  return `${base.toString().replace(/\/$/, "")}/${safeKey}`;
}
