import { describe, expect, it, vi } from "vitest";
import { buildPublicObjectUrl, buildR2ObjectKey, validateMediaSource } from "./object";
import { archiveMediaWorkflow, publishMediaWorkflow } from "./workflow";

const ID = "123e4567-e89b-42d3-a456-426614174000";

describe("R2 media helpers", () => {
  it("builds a deterministic and encoded public object URL", () => {
    const key = buildR2ObjectKey(ID, "webp");
    expect(key).toBe(`media/${ID}/public.webp`);
    expect(buildPublicObjectUrl("https://media.example.com/", key)).toBe(`https://media.example.com/media/${ID}/public.webp`);
  });

  it("rejects unsupported or oversized sources", () => {
    expect(() => validateMediaSource(new Blob(["ok"], { type: "image/png" }), "image")).not.toThrow();
    expect(() => validateMediaSource(new Blob(["no"], { type: "text/plain" }), "document")).toThrow(/MIME/);
  });
});

describe("R2 publication workflow", () => {
  it("does not persist metadata when the public upload fails", async () => {
    const persistPublished = vi.fn();
    await expect(publishMediaWorkflow({
      loadSource: async () => "private-source",
      uploadPublic: async () => { throw new Error("R2 unavailable"); },
      persistPublished,
      rollbackPublic: vi.fn(),
    })).rejects.toThrow("R2 unavailable");
    expect(persistPublished).not.toHaveBeenCalled();
  });

  it("removes the uploaded copy when metadata persistence fails", async () => {
    const rollbackPublic = vi.fn(async () => undefined);
    await expect(publishMediaWorkflow({
      loadSource: async () => "private-source",
      uploadPublic: async () => ({ key: "safe-key", url: "https://example.com/safe-key" }),
      persistPublished: async () => { throw new Error("database unavailable"); },
      rollbackPublic,
    })).rejects.toThrow("database unavailable");
    expect(rollbackPublic).toHaveBeenCalledWith("safe-key");
  });

  it("deletes the public copy before marking the source archived", async () => {
    const order: string[] = [];
    await archiveMediaWorkflow({
      key: "safe-key",
      deletePublic: async () => { order.push("delete-public"); },
      persistArchived: async () => { order.push("persist-archived"); },
    });
    expect(order).toEqual(["delete-public", "persist-archived"]);
  });
});
