import FeatureForm from "@/components/forms/FeatureForm";
import NextModal from "@/components/NextModal"; 

export default function FeatureFormModal() {
    return (
        <NextModal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Feature</h2>
                <FeatureForm id={null} />
            </div>
        </NextModal>
    )
}