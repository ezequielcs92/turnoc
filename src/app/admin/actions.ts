"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { slugSchema, splitList } from "@/lib/validation";
import type { AdminEntityKind } from "@/types/content";

export type AdminActionState = { status: "idle" | "success" | "error"; message: string; fieldErrors?: Record<string, string[]> };
const commonSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(2, "Ingresá un título.").max(200),
  slug: slugSchema,
  excerpt: z.string().trim().max(420),
  body: z.string().trim().max(40000),
  status: z.enum(["draft", "scheduled", "published", "archived"]),
  publishAt: z.string().trim().optional(),
  category: z.string().trim().min(1).max(40),
  startsAt: z.string().trim().optional(),
  venue: z.string().trim().max(180),
  city: z.string().trim().max(120),
  externalUrl: z.string().trim().url("Ingresá una URL completa.").optional().or(z.literal("")),
}).superRefine((value, context) => {
  if (value.status === "scheduled" && !value.publishAt) context.addIssue({ code: "custom", path: ["publishAt"], message: "La programación necesita fecha y hora." });
});

function toIso(value?: string) {
  if (!value) return null;
  const normalized = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) ? `${value}:00-03:00` : value;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export async function signInAction(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { status: "error", message: "Completá email y contraseña." };
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { status: "error", message: "Falta configurar la URL y la publishable key públicas de Supabase." };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { status: "error", message: "No pudimos iniciar sesión con esos datos." };
  redirect("/admin");
}

export async function signOutAction() { const supabase = await createServerSupabaseClient(); if (supabase) await supabase.auth.signOut(); redirect("/admin/login"); }

export async function saveAdminEntity(kind: AdminEntityKind, _state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const parsed = commonSchema.safeParse({ id: formData.get("id"), title: formData.get("title"), slug: formData.get("slug"), excerpt: formData.get("excerpt"), body: formData.get("body"), status: formData.get("status"), publishAt: formData.get("publishAt"), category: formData.get("category"), startsAt: formData.get("startsAt"), venue: formData.get("venue") ?? "", city: formData.get("city") ?? "", externalUrl: formData.get("externalUrl") ?? "" });
  if (!parsed.success) return { status: "error", message: "Revisá los campos marcados.", fieldErrors: parsed.error.flatten().fieldErrors };
  const { supabase, user } = await requireAdmin();
  const values = parsed.data; const id = values.id || null; const publishAt = toIso(values.publishAt); let error: { message: string } | null = null;
  if (kind === "artists") {
    const payload = { name: values.title, slug: values.slug, excerpt: values.excerpt, bio: values.body, disciplines: splitList(formData.get("list")), status: values.status, publish_at: publishAt, updated_by: user.id };
    ({ error } = id ? await supabase.from("artists").update(payload).eq("id", id) : await supabase.from("artists").insert({ ...payload, created_by: user.id }));
  } else if (kind === "projects") {
    const categoryResult = z.enum(["current", "upcoming", "archive"]).safeParse(values.category);
    if (!categoryResult.success) return { status: "error", message: "La categoría del proyecto no es válida.", fieldErrors: { category: ["Elegí una categoría válida."] } };
    const category = categoryResult.data;
    const payload = { title: values.title, slug: values.slug, excerpt: values.excerpt, synopsis: values.body, state: category, status: values.status, publish_at: publishAt, updated_by: user.id };
    ({ error } = id ? await supabase.from("projects").update(payload).eq("id", id) : await supabase.from("projects").insert({ ...payload, created_by: user.id }));
  } else if (kind === "posts") {
    const categoryResult = z.enum(["news", "blog", "interview", "backstage", "call", "communique", "resource"]).safeParse(values.category);
    if (!categoryResult.success) return { status: "error", message: "La categoría de la publicación no es válida.", fieldErrors: { category: ["Elegí una categoría válida."] } };
    const category = categoryResult.data;
    const payload = { title: values.title, slug: values.slug, excerpt: values.excerpt, body: values.body, kind: category, tags: splitList(formData.get("list")), status: values.status, publish_at: publishAt, updated_by: user.id };
    ({ error } = id ? await supabase.from("posts").update(payload).eq("id", id) : await supabase.from("posts").insert({ ...payload, created_by: user.id }));
  } else {
    const categoryResult = z.enum(["performance", "workshop", "festival", "talk", "other"]).safeParse(values.category);
    if (!categoryResult.success) return { status: "error", message: "La categoría del evento no es válida.", fieldErrors: { category: ["Elegí una categoría válida."] } };
    const category = categoryResult.data;
    const startsAt = toIso(values.startsAt); if (!startsAt) return { status: "error", message: "El evento necesita una fecha válida.", fieldErrors: { startsAt: ["Ingresá fecha y hora."] } };
    const payload = { title: values.title, slug: values.slug, excerpt: values.excerpt, description: values.body, kind: category, starts_at: startsAt, venue: values.venue, city: values.city, external_url: values.externalUrl || null, status: values.status, publish_at: publishAt, updated_by: user.id };
    ({ error } = id ? await supabase.from("events").update(payload).eq("id", id) : await supabase.from("events").insert({ ...payload, created_by: user.id }));
  }
  if (error) return { status: "error", message: `No se pudo guardar: ${error.message}` };
  revalidatePath("/", "layout"); revalidatePath(`/admin/${kind}`);
  return { status: "success", message: id ? "Cambios guardados." : "Borrador creado. Ya podés abrir su vista previa." };
}

export async function archiveAdminEntity(kind: AdminEntityKind, id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from(kind).update({ status: "archived" }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout"); revalidatePath(`/admin/${kind}`);
}

export async function registerMediaAction(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const parsed = z.object({ title: z.string().trim().min(2).max(180), bucket: z.enum(["turnoc-public", "turnoc-private"]), path: z.string().trim().min(1).max(600), alt: z.string().trim().max(240), kind: z.enum(["image", "video", "audio", "document"]) }).safeParse({ title: formData.get("title"), bucket: formData.get("bucket"), path: formData.get("path"), alt: formData.get("alt"), kind: formData.get("kind") });
  if (!parsed.success) return { status: "error", message: "No se pudo registrar el archivo.", fieldErrors: parsed.error.flatten().fieldErrors };
  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("media_assets").insert({ title: parsed.data.title, bucket_id: parsed.data.bucket, object_path: parsed.data.path, alt_text: parsed.data.alt, kind: parsed.data.kind, created_by: user.id, status: "draft" });
  if (error) return { status: "error", message: `El archivo se subió, pero falló el registro: ${error.message}` };
  revalidatePath("/admin/medios"); return { status: "success", message: "Archivo cargado como borrador." };
}

export async function setMediaStatusAction(id: string, status: "draft" | "published" | "archived") {
  const parsed = z.object({ id: z.string().uuid(), status: z.enum(["draft", "published", "archived"]) }).safeParse({ id, status });
  if (!parsed.success) throw new Error("Estado de medio inválido.");
  const { supabase, user } = await requireAdmin();
  const { data: asset, error: readError } = await supabase.from("media_assets").select("bucket_id,publish_at").eq("id", parsed.data.id).single();
  if (readError) throw new Error(readError.message);
  if (parsed.data.status === "published" && asset.bucket_id !== "turnoc-public") throw new Error("Mové el archivo al destino publicable antes de publicarlo.");
  const publishAt = parsed.data.status === "published" ? (asset.publish_at ?? new Date().toISOString()) : asset.publish_at;
  const { error } = await supabase.from("media_assets").update({ status: parsed.data.status, publish_at: publishAt, updated_by: user.id }).eq("id", parsed.data.id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  revalidatePath("/admin/medios");
}
