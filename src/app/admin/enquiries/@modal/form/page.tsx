import EnquiryForm from "@/components/forms/EnquiryForm";
import NextModal from "@/components/NextModal"; 

export default function EnquiryFormModal() {
    return (
        <NextModal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Enquiry</h2>
                <EnquiryForm id={null} />
            </div>
        </NextModal>
    )
}