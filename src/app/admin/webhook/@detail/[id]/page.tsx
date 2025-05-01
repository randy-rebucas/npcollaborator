import MemberDetail from "@/components/member/MemberDetail";
import { MemberstackAdminService } from "@/utils/memberstack-admin";


export default async function DetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const { data: member } = await MemberstackAdminService.getMemberById(id);

    if (!member) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="text-destructive text-center mt-4">
                    <h2 className="text-3xl font-bold">Oops!</h2>
                    <p className="text-lg">We couldn&apos;t find the member you&apos;re looking for.</p>
                </div>
            </div>
        );
    }

    return <MemberDetail member={member} returnPath="/admin/webhook" />;
}