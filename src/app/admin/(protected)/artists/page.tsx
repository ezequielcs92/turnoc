import { EntityManager } from "@/components/admin/entity-manager";
export default function AdminArtistsPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) { return <EntityManager kind="artists" searchParams={searchParams} />; }
