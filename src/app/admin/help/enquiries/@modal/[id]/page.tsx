import NextModal from "@/components/NextModal"; 
import { Card } from "@/components/ui/card";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default async function EnquiryDetailModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    return (
        <NextModal>
            <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Edit Enquiry</h2>
                <Suspense fallback={<LoadingSpinner />}>
                    <EnquiryForm id={id} />
                </Suspense>
            </Card>
        </NextModal>
    );
} 