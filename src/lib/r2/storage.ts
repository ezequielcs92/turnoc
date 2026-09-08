import "server-only";

import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getR2Config } from "@/lib/r2/config";
import { assertR2ObjectKey, buildPublicObjectUrl } from "@/lib/r2/object";

function requireR2Config() {
  const config = getR2Config();
  if (!config) throw new Error("R2 no está configurado; el medio sigue privado y sin publicar.");
  return config;
}

function createClient() {
  const config = requireR2Config();
  return {
    config,
    client: new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
    }),
  };
}

export async function putPublicObject(key: string, body: Uint8Array, contentType: string) {
  const safeKey = assertR2ObjectKey(key);
  const { client, config } = createClient();
  await client.send(new PutObjectCommand({
    Bucket: config.bucketName,
    Key: safeKey,
    Body: body,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  }));
  return { key: safeKey, url: buildPublicObjectUrl(config.publicUrl, safeKey) };
}

export async function deletePublicObject(key: string) {
  const safeKey = assertR2ObjectKey(key);
  const { client, config } = createClient();
  await client.send(new DeleteObjectCommand({ Bucket: config.bucketName, Key: safeKey }));
}
