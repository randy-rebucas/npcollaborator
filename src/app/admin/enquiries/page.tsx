import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { SearchParams } from "@/types/search-params";
import Pagination from "@/components/ui/member/pagination";
import Search from "@/components/ui/member/search";
import { formatDistanceToNow } from "date-fns";
import { IEnquiry } from "@/models/Enquiry";
import { Badge } from "@/components/ui/badge";
import Filter from "@/components/ui/member/filter";
import { PencilIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { deleteEnquiry, getEnquiries } from "@/app/actions/enquiry";
import { Suspense } from "react";
import { MembersTableSkeleton } from "@/components/Skeletons";

export default async function EnquiriesPage(props: {
    searchParams: SearchParams
}) {
    const ITEMS_PER_PAGE = 10;

    const searchParams = await props.searchParams
    const currentPage = Number(searchParams?.page) || 1;
    const query = String(searchParams?.query || '');

    const status = String(searchParams?.status || 'all');

    const { enquiries, total } = await getEnquiries({ page: currentPage, search: query, status: status, limit: ITEMS_PER_PAGE });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);

    const handleDelete = async (data: FormData) => {
        "use server";
        const itemId = data.get("itemId");
        await deleteEnquiry(itemId as string);
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="mx-auto w-full space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Enquiries</h1>
                    <div className="flex items-center gap-4">
                        <Search placeholder='Search enquiries...' />
                        <Filter target="status" options={[{ 'pending': 'Pending' }, { 'resolved': 'Resolved' }, { 'closed': 'Closed' }]} placeholder="Filter by status" defaultValue="all" />
                    </div>
                </div>

                <div className="rounded-md border">
                    <Suspense
                        key={query + currentPage}
                        fallback={<MembersTableSkeleton />}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {enquiries.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                <p>No enquiries found</p>
                                                {query && <p className="text-sm">Try adjusting your search or filter</p>}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    enquiries.map((enquiry: IEnquiry) => {
                                        return (
                                            <TableRow key={enquiry.id}>
                                                <TableCell>{enquiry.email}</TableCell>
                                                <TableCell>{enquiry.subject}</TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        enquiry.status === 'pending' ? 'destructive' :
                                                            enquiry.status === 'resolved' ? 'default' :
                                                                enquiry.status === 'closed' ? 'secondary' :
                                                                    'outline'
                                                    }>
                                                        {enquiry.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{formatDistanceToNow(new Date(enquiry.createdAt), { addSuffix: true })}</TableCell>
                                                <TableCell className="flex items-center justify-end gap-2 p-3">
                                                    <Link href={`/admin/enquiries/form/${enquiry.id}`} className="flex justify-center items-center">
                                                        <PencilIcon className="w-4 h-4" />
                                                    </Link>
                                                    <form action={handleDelete} className="flex justify-center items-center">
                                                        <input type="hidden" name="itemId" value={enquiry.id} />
                                                        <button type="submit" className="flex justify-center items-center">
                                                            <TrashIcon className="w-4 h-4 text-red-500" />
                                                        </button>
                                                    </form>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </Suspense>
                </div>

                <Pagination
                    startItem={startItem}
                    endItem={endItem}
                    totalItems={total}
                    currentPage={currentPage}
                    query={query}
                    totalPages={totalPages}
                />
            </div>
        </div>
    );
}

export async function generateMetadata() {
    return {
        title: 'Admin Enquiries',
    };
}
