import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PublicForm } from "@/components/public-form";

export const metadata: Metadata = { title: "Contacto y contrataciones", description: "Consultas, contrataciones y pedidos de prensa para Compañía Turnoc." };
export default function ContactPage() { return <main id="contenido"><PageHero eyebrow="Contacto" title="Hagamos lugar para lo que sigue." description="Tres formularios adaptados, una misma bandeja moderada. Los datos públicos de contacto se incorporarán cuando sean aprobados." index="09" /><section className="section"><div className="site-shell"><PublicForm kind="booking" /></div></section><section className="section section-dark" id="prensa"><div className="site-shell split"><PublicForm kind="press" /><PublicForm kind="contact" /></div></section></main>; }
