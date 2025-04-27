import FaqForm from "@/components/forms/FaqForm";
import NextModal from "@/components/NextModal"; 
import { Card } from "@/components/ui/card";

export default function FaqNewModal() {
    return (
        <NextModal>
            <Card className="p-6">
                <FaqForm id={null} />
            </Card>
        </NextModal>
    )
}