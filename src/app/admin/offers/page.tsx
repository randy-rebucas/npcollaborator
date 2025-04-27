import { TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableBody } from "@/components/ui/table";
import { SidebarInset } from "@/components/ui/sidebar";
import { Table } from "@/components/ui/table";
import Pagination from "@/components/ui/member/pagination";
import Search from "@/components/ui/member/search";
import Filter from "@/components/ui/member/filter";
import AdminHeader from "@/components/Header";
import { formatCurrency } from "@/lib/utils";
import { Eye } from "lucide-react";
import Link from "next/link";
import { SearchParams } from "@/types/search-params";
import { getOffers } from "@/app/actions/offer";

export default async function OffersPage(props: {
    searchParams: SearchParams
}) {

    const ITEMS_PER_PAGE = 10;

    const searchParams = await props.searchParams
    const currentPage = Number(searchParams?.page) || 1;
    const query = String(searchParams?.query || '');
    const status = String(searchParams?.status || 'all');

    const { offers, total } = await getOffers({ page: currentPage, search: query, limit: ITEMS_PER_PAGE, status: status });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);

    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'Offers', href: '/admin/dashboard/offers', active: true },
            ]} />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-foreground">Offers</h1>
                        <div className="flex items-center gap-4">
                            <Search placeholder='Search offers...' />
                            <Filter 
                                target="status" 
                                options={[
                                    { 'PENDING': 'Pending' }, 
                                    { 'ACCEPTED': 'Accepted' }, 
                                    { 'DECLINED': 'Declined' }, 
                                    { 'EXPIRED': 'Expired' }, 
                                    { 'CANCELLED': 'Cancelled' }, 
                                    { 'WITHDRAWN': 'Withdrawn' }
                                ]} 
                                placeholder="Status" 
                                defaultValue="all" 
                            />
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Physician</TableHead>
                                    <TableHead>NP</TableHead>
                                    <TableHead>Offer Date</TableHead>
                                    <TableHead>Exp Date</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Comp Type</TableHead>
                                    <TableHead>Basic Salary</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {offers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-48">
                                            <div className="flex flex-col items-center justify-center gap-2 text-center">
                                                <svg
                                                    className="h-12 w-12 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">No offers found</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    There are no offers matching your search criteria.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    offers.map((offer) => {
                                        return (
                                            <TableRow key={offer._id}>
                                                <TableCell>{offer.physicianUser.primaryEmail}</TableCell>
                                                <TableCell>{offer.nursePractitionerUser.primaryEmail}</TableCell>
                                                <TableCell>{offer.offerDate.toLocaleString()}</TableCell>
                                                <TableCell>{offer.expirationDate.toLocaleString()}</TableCell>
                                                <TableCell>{offer.position.title}</TableCell>
                                                <TableCell>{offer.compensationType}</TableCell>
                                                <TableCell>{formatCurrency(offer.baseSalary * 100)}</TableCell>
                                                <TableCell>{offer.status}</TableCell>
                                                <TableCell className="flex items-center justify-end gap-2 p-3">
                                                    <Link href={`/admin/dashboard/offers/${offer._id}`}>
                                                        <Eye className="w-4 h-4 text-foreground hover:text-primary" />
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
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
        </SidebarInset>
    );
}

