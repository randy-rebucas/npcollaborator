import { MemberstackAdminService } from "@/utils/memberstack-admin";
import { Metadata } from "next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/ui/member/pagination";
import Search from "@/components/ui/member/search";
import { Suspense } from "react";
import { MembersTableSkeleton } from "@/components/Skeletons";  
import { SearchParams } from "@/types/search-params";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Member {
    id: string
    profileImage?: string
    createdAt: string
    auth: {
        email: string
    },
    verified: boolean,
    customFields: {
        [key: string]: string
    }
}

export const metadata: Metadata = {
    title: 'Admin Node API',
};

export default async function Page(props: {
    searchParams: SearchParams
}) {

    const ITEMS_PER_PAGE = 10;

    const params = await props.searchParams;

    const currentPage = Number(params?.page) || 1;

    const { data: members, totalCount: count } = await MemberstackAdminService.listMembers(currentPage, ITEMS_PER_PAGE)

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, count);


    return (
        <>
            <div className="flex items-center gap-4">
                <Search placeholder='Search members...' />
            </div>
            <div className="rounded-md border">
                <Suspense
                    key={currentPage}
                    fallback={<MembersTableSkeleton />}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Verified</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((member: Member) => (
                                <TableRow key={member.id}>
                                    <TableCell>{member.auth.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={member.verified ? 'default' : 'destructive'}>
                                            {member.verified ? 'Validated' : 'Not Validated'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(member.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="flex items-center justify-end gap-2 p-3">
                                        <Link href={`/admin/members/node-api/${member.id}`} className="flex justify-center items-center">
                                            <EyeIcon className="w-4 h-4" />
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Suspense>
            </div>
            <Pagination totalPages={totalPages} currentPage={currentPage} totalItems={count} startItem={startItem} endItem={endItem} query={''} />
        </>
    );
}