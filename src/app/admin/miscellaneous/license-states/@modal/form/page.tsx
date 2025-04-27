import MedicalLicenseStateForm from "@/components/forms/MedicalLicenseStateForm";
import NextModal from "@/components/NextModal"; 

export default function LicenseStateFormModal() {
    return (
        <NextModal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">License State</h2>
                <MedicalLicenseStateForm id={null} />
            </div>
        </NextModal>
    )
}