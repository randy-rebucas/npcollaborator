import UserForm from "@/components/forms/UserForm";
import NextModal from "@/components/NextModal"; 

export default async function UserEdit({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    return (
        <NextModal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Edit User</h2>
                <UserForm id={id} />
            </div>
        </NextModal>
    )
}