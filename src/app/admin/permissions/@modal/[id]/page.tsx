import NextModal from "@/components/NextModal"; 
import { Card } from "@/components/ui/card";
import PermissionForm from "@/components/forms/PermissionForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default async function PermissionDetailModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    return (
        <NextModal>
            <Card className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                    <PermissionForm id={id} />
                </Suspense>
            </Card>
        </NextModal>
    );
}
