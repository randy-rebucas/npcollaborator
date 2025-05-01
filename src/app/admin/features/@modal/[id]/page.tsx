import NextModal from "@/components/NextModal"; 
import { Card } from "@/components/ui/card";
import FeatureForm from "@/components/forms/FeatureForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";


export default async function FeatureDetailModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    return (
        <NextModal>
            <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Edit Feature</h2>
                <Suspense fallback={<LoadingSpinner />}>
                    <FeatureForm id={id} />
                </Suspense>
            </Card>
        </NextModal>
    );
} 