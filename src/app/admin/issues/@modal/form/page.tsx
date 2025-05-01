import IssueForm from "@/components/forms/IssueForm";
import NextModal from "@/components/NextModal"; 

export default function IssuesFormModal() {
    return (
        <NextModal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Issue</h2>
                <IssueForm id={null} />
            </div>
        </NextModal>
    )
}