import { describe, expect, it } from "vitest";
import { publicSubmissionSchema, slugSchema, splitList } from "./validation";

describe("publicSubmissionSchema", () => {
  it("accepts a moderated proposal", () => {
    const result = publicSubmissionSchema.safeParse({ kind: "community_proposal", name: "Persona de prueba", email: "test@example.com", phone: "", organization: "", message: "Una propuesta suficientemente descriptiva.", consent: "on", website: "", startedAt: Date.now() });
    expect(result.success).toBe(true);
  });

  it("rejects honeypot content", () => {
    const result = publicSubmissionSchema.safeParse({ kind: "contact", name: "Bot", email: "bot@example.com", phone: "", organization: "", message: "Mensaje automatizado largo.", consent: "on", website: "spam.example", startedAt: Date.now() });
    expect(result.success).toBe(false);
  });

  it("allows a compact newsletter form", () => {
    const result = publicSubmissionSchema.safeParse({ kind: "newsletter", name: "", email: "reader@example.com", phone: "", organization: "", message: "", consent: "on", website: "", startedAt: Date.now() });
    expect(result.success).toBe(true);
  });
});

describe("editorial helpers", () => {
  it("accepts canonical slugs and rejects spaces", () => {
    expect(slugSchema.safeParse("obra-en-altura-2026").success).toBe(true);
    expect(slugSchema.safeParse("Obra con espacios").success).toBe(false);
  });

  it("normalizes comma-separated lists", () => {
    expect(splitList("Tela, Lira, Trapecio, ")).toEqual(["Tela", "Lira", "Trapecio"]);
  });
});
