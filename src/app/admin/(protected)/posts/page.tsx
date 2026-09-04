import { EntityManager } from "@/components/admin/entity-manager";
export default function AdminPostsPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) { return <EntityManager kind="posts" searchParams={searchParams} />; }
