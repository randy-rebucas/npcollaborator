import { Card } from "@/components/ui/card";
import NextModal from "@/components/NextModal";
import TemplateForm from "@/components/forms/TemplateForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function TemplateNewModal() {
    return (
        <NextModal>
            <Card className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                    <TemplateForm id={null} />
                </Suspense>
            </Card>
        </NextModal>
    );
}
