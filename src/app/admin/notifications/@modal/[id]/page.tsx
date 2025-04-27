import NextModal from "@/components/NextModal";
import { Card } from "@/components/ui/card";
import NotificationForm from "@/components/forms/NotificationForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";


export default async function NotificationDetailModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    return (
        <NextModal>
            <Card className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                    <NotificationForm id={id} />
                </Suspense>
            </Card>
        </NextModal>
    );
}