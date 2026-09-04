import { EntityManager } from "@/components/admin/entity-manager";
export default function AdminEventsPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) { return <EntityManager kind="events" searchParams={searchParams} />; }
