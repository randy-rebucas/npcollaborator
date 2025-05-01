import NextModal from "@/components/NextModal"; 
import MedicalLicenseStateForm from "@/components/forms/MedicalLicenseStateForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default async function LicenseStateFormModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    return (
        <NextModal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Edit License State</h2>
                <Suspense fallback={<LoadingSpinner />}>
                    <MedicalLicenseStateForm id={id} />
                </Suspense>
            </div>
        </NextModal>
    );
}