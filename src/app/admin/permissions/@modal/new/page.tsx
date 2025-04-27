import NextModal from "@/components/NextModal"; 
import { Card } from "@/components/ui/card";
import PermissionForm from "@/components/forms/PermissionForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function PermissionNewModal() {
    return (
        <NextModal>
            <Card className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                    <PermissionForm id={null} />
                </Suspense>
            </Card>
        </NextModal>
    );
}
