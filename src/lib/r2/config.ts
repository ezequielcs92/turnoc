import "server-only";

const REQUIRED_KEYS = [
  "R2_ACCOUNT_ID",
  "R2_BUCKET_NAME",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "NEXT_PUBLIC_R2_PUBLIC_URL",
] as const;

export type R2Config = {
  accountId: string;
  bucketName: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicUrl: string;
};

export function getR2Config(): R2Config | null {
  const values = Object.fromEntries(
    REQUIRED_KEYS.map((key) => [key, process.env[key]?.trim() ?? ""]),
  ) as Record<(typeof REQUIRED_KEYS)[number], string>;

  if (REQUIRED_KEYS.some((key) => !values[key])) return null;
  if (!/^[0-9a-f]{32}$/i.test(values.R2_ACCOUNT_ID)) return null;
  if (!/^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])$/.test(values.R2_BUCKET_NAME)) return null;

  let publicUrl: URL;
  try {
    publicUrl = new URL(values.NEXT_PUBLIC_R2_PUBLIC_URL);
  } catch {
    return null;
  }

  if (publicUrl.protocol !== "https:" || publicUrl.username || publicUrl.password) return null;

  return {
    accountId: values.R2_ACCOUNT_ID,
    bucketName: values.R2_BUCKET_NAME,
    accessKeyId: values.R2_ACCESS_KEY_ID,
    secretAccessKey: values.R2_SECRET_ACCESS_KEY,
    publicUrl: publicUrl.toString().replace(/\/$/, ""),
  };
}

export function isR2Configured() {
  return getR2Config() !== null;
}
