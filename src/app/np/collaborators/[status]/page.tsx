import Items from "@/components/collaboration/Items";

export default async function CollaboratorsPage({
    params,
}: {
    params: Promise<{ status: string }>
}) {
    const status = (await params).status as "active" | "request";
    return <Items type={status}/>;
}