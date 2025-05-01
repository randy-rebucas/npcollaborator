import { SidebarInset } from "@/components/ui/sidebar";
import AdminHeader from "@/components/Header";

import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Metadata } from "next";
import { SearchParams } from "@/types/search-params";
import Pagination from "@/components/ui/member/pagination";
import Search from "@/components/ui/member/search";
import { deleteNotification, getNotifications } from "@/app/actions/emailNotifications";
import { PencilIcon, PlusIcon, TrashIcon, SendIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: 'Admin Notifications',
};

export default async function NotificationsPage(props: {
    searchParams: SearchParams
}) {
    const ITEMS_PER_PAGE = 10;

    const searchParams = await props.searchParams
    const currentPage = Number(searchParams?.page) || 1;
    const query = String(searchParams?.query || '');

    const { notifications, total } = await getNotifications({ page: currentPage, search: query, limit: ITEMS_PER_PAGE });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);

    const handleDelete = async (data: FormData) => {
        "use server";
        const itemId = data.get("itemId");
        await deleteNotification(itemId as string);
    };

    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'Notifications', href: '/admin/notifications', active: true },
            ]} />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Notifications</h1>
                        <div className="flex items-center gap-4">
                            <Search placeholder='Search templates...' />
                            <Button asChild>
                                <Link href="/admin/notifications/new">
                                    <PlusIcon className="w-4 h-4" />
                                    Add Notification
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-md border border-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {notifications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-52 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <div className="space-y-2">
                                                    <h3 className="text-lg font-semibold">No notifications yet</h3>
                                                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                                        Create your first notification to start managing your content more efficiently.
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    notifications.map((notification) => {
                                        return (
                                            <TableRow key={notification._id}>
                                                <TableCell className="text-sm font-medium text-foreground truncate">{notification.title}</TableCell>
                                                <TableCell className="flex items-center justify-end gap-2 p-3">
                                                    <Link href={`/admin/notifications/${notification._id}/send`}>
                                                        <SendIcon className="w-4 h-4 text-foreground hover:text-primary" />
                                                    </Link>
                                                    <Link href={`/admin/notifications/${notification._id}`}>
                                                        <PencilIcon className="w-4 h-4 text-foreground hover:text-primary" />
                                                    </Link>
                                                    <form action={handleDelete} className="flex justify-center items-center">
                                                        <input type="hidden" name="itemId" value={notification._id} />
                                                        <button type="submit" className="flex justify-center items-center">
                                                            <TrashIcon className="w-4 h-4 text-destructive hover:text-destructive/80" />
                                                        </button>
                                                    </form>
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
    )
}

