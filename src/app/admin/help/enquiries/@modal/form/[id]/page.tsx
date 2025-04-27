import NextModal from "@/components/NextModal"; 
import EnquiryForm from "@/components/forms/EnquiryForm";
export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    return (
        <NextModal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Edit Enquiry</h2>

                <EnquiryForm id={id} />
            </div>
        </NextModal>
    )
}