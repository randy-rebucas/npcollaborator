import NextModal from "@/components/NextModal"; 
import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";


export default async function ListingDetailModal({
    params,
}: {
    params: Promise<{ id: string | null }>
}) {
    const { id } = await params;
    console.log(id);
    return (
        <NextModal>
            <Card className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                    {/* <ListingForm id={params.id} /> */}
                </Suspense>
            </Card>
        </NextModal>
    );
} 