import NextModal from "@/components/NextModal"; 
import { Card } from "@/components/ui/card";
import RoleForm from "@/components/forms/RoleForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function RoleNewModal() {
    return (
        <NextModal>
            <Card className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                    <RoleForm id={null} />
                </Suspense>
            </Card>
        </NextModal>
    );
}
