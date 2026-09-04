"use server";

import { publicSubmissionSchema } from "@/lib/validation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type PublicFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitPublicForm(
  _previousState: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  const parsed = publicSubmissionSchema.safeParse({
    kind: formData.get("kind"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    organization: formData.get("organization"),
    message: formData.get("message"),
    consent: formData.get("consent"),
    website: formData.get("website"),
    startedAt: formData.get("startedAt"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisá los campos señalados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const elapsed = Date.now() - parsed.data.startedAt;
  if (elapsed < 2500 || elapsed > 7_200_000) {
    return { status: "error", message: "El formulario venció o se envió demasiado rápido. Recargá e intentá de nuevo." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      status: "error",
      message: "El formulario está en modo demostración. Falta configurar la clave pública de Supabase para guardar envíos.",
    };
  }

  const { error } = await supabase.from("form_submissions").insert({
    kind: parsed.data.kind,
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    organization: parsed.data.organization,
    message: parsed.data.message,
    consent: true,
    honeypot: "",
    payload: { source: "website", version: 1 },
    status: "new",
  });

  if (error) {
    console.error("Public submission failed", error.message);
    return { status: "error", message: "No pudimos guardar el envío. Probá nuevamente en unos minutos." };
  }

  return { status: "success", message: "Gracias. La propuesta quedó recibida para revisión; nada se publica automáticamente." };
}
