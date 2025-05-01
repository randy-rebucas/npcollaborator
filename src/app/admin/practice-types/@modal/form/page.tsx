import NextModal from "@/components/NextModal" 
import PracticeTypeForm from "@/components/forms/PracticeTypeForm"

export default function PracticeTypeFormModal() {


    return (
        <NextModal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Add Practice Type</h2>

                <PracticeTypeForm id={null} />
            </div>
        </NextModal>
    )
}