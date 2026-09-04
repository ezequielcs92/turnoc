import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: { default: "Panel", template: "%s · Panel Turnoc" }, robots: { index: false, follow: false } };

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireAdmin();
  return <div className="admin-shell"><AdminNav name={profile.display_name} /><main id="contenido" className="admin-main">{children}</main></div>;
}
