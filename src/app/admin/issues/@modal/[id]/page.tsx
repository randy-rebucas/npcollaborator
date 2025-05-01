import NextModal from "@/components/NextModal"; 
import { Card } from "@/components/ui/card";
import IssueForm from "@/components/forms/IssueForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default async function IssueDetailModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    return (
        <NextModal>
            <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Edit Issue</h2>
                <Suspense fallback={<LoadingSpinner />}>
                    <IssueForm id={id} />
                </Suspense>
            </Card>
        </NextModal>
    );
} 