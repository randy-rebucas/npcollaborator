import NextModal from "@/components/NextModal"; 
import { Card } from "@/components/ui/card";
import NotificationForm from "@/components/forms/NotificationForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function NotificationNewModal() {
    return (
        <NextModal>
            <Card className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                    <NotificationForm id={null} />
                </Suspense>
            </Card>
        </NextModal>
    );
}