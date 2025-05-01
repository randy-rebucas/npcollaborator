import Search from "@/components/ui/member/search";
import { Metadata } from "next";
import { getUsers } from "@/app/actions/user";
import { Suspense } from "react";
import { SearchParams } from "@/types/search-params";
import UserTable from "@/components/user/UserTable";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { ProfileSkeleton } from "@/components/Skeletons";
import { SidebarInset } from "@/components/ui/sidebar";

export const metadata: Metadata = {
    title: 'Admin Users',
};

export default async function AdminUsers(props: {
    searchParams: SearchParams
}) {
    const ITEMS_PER_PAGE = 10;
    const params = await props.searchParams;
    const query = String(params?.query || '');
    const currentPage = Number(params?.page) || 1;

    // get users with pagination info
    const users = await getUsers({
        page: currentPage,
        page_size: ITEMS_PER_PAGE,
    });

    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

    // Generate array of page numbers to display
    const generatePagination = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage <= 3) {
            return [1, 2, 3, 4, 5, '...', totalPages];
        }

        if (currentPage >= totalPages - 2) {
            return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }

        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    const pages = generatePagination();

    return (
        <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Users</h1>
                        <div className="flex items-center gap-4">
                            <Search placeholder='Search users...' />
                        </div>
                    </div>
                    <div className="rounded-md border">
                        <Suspense
                            key={query + currentPage}
                            fallback={<ProfileSkeleton />}>
                            <UserTable users={users} />
                        </Suspense>
                    </div>

                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href={`?page=${currentPage - 1}`}
                                    aria-disabled={currentPage <= 1}
                                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>

                            {pages.map((page, i) => (
                                <PaginationItem key={i}>
                                    {page === '...' ? (
                                        <PaginationEllipsis />
                                    ) : (
                                        <PaginationLink
                                            href={`?page=${page}`}
                                            isActive={currentPage === page}
                                        >
                                            {page}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    href={`?page=${currentPage + 1}`}
                                    aria-disabled={currentPage >= totalPages}
                                    className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </SidebarInset>
    );
}   