import { z } from "zod";

const optionalShortText = z.string().trim().max(180).default("");

export const publicSubmissionSchema = z.object({
  kind: z.enum(["contact", "booking", "press", "community_proposal", "newsletter"]),
  name: z.string().trim().max(160).default(""),
  email: z.string().trim().email("Ingresá un email válido.").max(320),
  phone: z.string().trim().max(80).default(""),
  organization: optionalShortText,
  message: z.string().trim().max(6000).default(""),
  consent: z.literal("on", { message: "Necesitamos tu consentimiento para responder." }),
  website: z.string().trim().max(0, "No se pudo validar el envío.").default(""),
  startedAt: z.coerce.number().int().positive(),
}).superRefine((value, context) => {
  if (value.kind !== "newsletter" && value.name.length < 2) {
    context.addIssue({ code: "custom", path: ["name"], message: "Ingresá tu nombre." });
  }
  if (value.kind !== "newsletter" && value.message.length < 12) {
    context.addIssue({ code: "custom", path: ["message"], message: "Contanos un poco más (mínimo 12 caracteres)." });
  }
});

export const slugSchema = z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usá minúsculas, números y guiones.");

export function splitList(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return [];
  return value.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 30);
}
