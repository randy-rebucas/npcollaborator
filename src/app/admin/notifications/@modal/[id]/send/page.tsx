import NextModal from "@/components/NextModal"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotificationSendForm from "@/components/forms/NotificationSendForm";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default async function NotificationSendModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    return (
        <NextModal>
            <Card className="p-6">
                <CardHeader>
                    <CardTitle>Send Notification</CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<LoadingSpinner />}>
                        <NotificationSendForm id={id} />
                    </Suspense>
                </CardContent>
            </Card>
        </NextModal>
    );
}