import NextModal from "@/components/NextModal"; 
import { Card } from "@/components/ui/card";
import RoleForm from "@/components/forms/RoleForm"; 
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default async function RoleDetailModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    return (
        <NextModal>
            <Card className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                    <RoleForm id={id} />
                </Suspense>
            </Card>
        </NextModal>
    );
}
