import { EntityManager } from "@/components/admin/entity-manager";
export default function AdminProjectsPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) { return <EntityManager kind="projects" searchParams={searchParams} />; }
