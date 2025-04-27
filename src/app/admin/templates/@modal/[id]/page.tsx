import NextModal from "@/components/NextModal"; 
import { Card } from "@/components/ui/card";
import TemplateForm from "@/components/forms/TemplateForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default async function TemplateDetailModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    return (
        <NextModal>
            <Card className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                    <TemplateForm id={id} />
                </Suspense>
            </Card>
        </NextModal>
    );
}
