export type PublishedObject = { key: string; url: string };

export async function publishMediaWorkflow<TSource>({
  loadSource,
  uploadPublic,
  persistPublished,
  rollbackPublic,
}: {
  loadSource: () => Promise<TSource>;
  uploadPublic: (source: TSource) => Promise<PublishedObject>;
  persistPublished: (published: PublishedObject) => Promise<void>;
  rollbackPublic: (key: string) => Promise<void>;
}) {
  const source = await loadSource();
  const published = await uploadPublic(source);
  try {
    await persistPublished(published);
  } catch (error) {
    try {
      await rollbackPublic(published.key);
    } catch {
      // Preserve the original persistence error; the orphan can be removed using its deterministic key.
    }
    throw error;
  }
  return published;
}

export async function archiveMediaWorkflow({
  key,
  deletePublic,
  persistArchived,
}: {
  key: string;
  deletePublic: (key: string) => Promise<void>;
  persistArchived: () => Promise<void>;
}) {
  await deletePublic(key);
  await persistArchived();
}
