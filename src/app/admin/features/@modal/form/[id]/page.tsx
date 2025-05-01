import NextModal from "@/components/NextModal"; 
import FeatureForm from "@/components/forms/FeatureForm";
export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    return (
        <NextModal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Edit Feature</h2>

                <FeatureForm id={id} />
            </div>
        </NextModal>
    )
}