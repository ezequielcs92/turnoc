import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Compañía Turnoc", template: "%s · Compañía Turnoc" },
  description: "Archivo cultural, vidriera profesional y comunidad de lectura de Compañía Turnoc.",
  openGraph: {
    title: "Compañía Turnoc",
    description: "Circo contemporáneo: obras, artistas, agenda, archivo y comunidad.",
    type: "website",
    locale: "es_AR",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { colorScheme: "dark", themeColor: "#120f10" };
export const revalidate = 60;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <a className="skip-link" href="#contenido">Saltar al contenido</a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
