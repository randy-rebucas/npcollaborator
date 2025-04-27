import { SidebarInset } from "@/components/ui/sidebar";
import AdminHeader from "@/components/Header";

import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Metadata } from "next";
import { SearchParams } from "@/types/search-params";
import Pagination from "@/components/ui/member/pagination";
import Search from "@/components/ui/member/search";
import { deletePermission, getPermissions, PermissionDocument } from "@/app/actions/permissions";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: 'Admin Permissions',
};

export default async function PermissionsPage(props: {
    searchParams: SearchParams
}) {
    const ITEMS_PER_PAGE = 10;

    const searchParams = await props.searchParams
    const currentPage = Number(searchParams?.page) || 1;
    const query = String(searchParams?.query || '');

    const { permissions, total } = await getPermissions({ page: currentPage, search: query, limit: ITEMS_PER_PAGE });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);

    const handleDelete = async (data: FormData) => {
        "use server";
        const itemId = data.get("itemId");
        await deletePermission(itemId as string); 
    };

    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'Permissions', href: '/admin/permissions', active: true },
            ]} />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-foreground">Permissions</h1>
                        <Button asChild>
                            <Link href="/admin/permissions/new" className="flex items-center gap-2">
                                <PlusIcon className="w-4 h-4" />
                                Add Permission
                            </Link>
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <Search placeholder='Search permissions...' />
                    </div>

                    <div className="rounded-md border border-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Permission</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Resource</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {permissions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-52 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <div className="space-y-2">
                                                    <h3 className="text-lg font-semibold">No permissions yet</h3>
                                                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                                        Create your first permission to start managing your users more efficiently.
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    permissions.map((permission: PermissionDocument) => {
                                        return (
                                            <TableRow key={permission._id}>
                                                <TableCell className="text-sm font-medium text-foreground truncate">{permission.name}</TableCell>
                                                <TableCell>{permission.description}</TableCell>
                                                <TableCell>{permission.resource}</TableCell>
                                                <TableCell className="flex items-center justify-end gap-2 p-3">
                                                    <Link href={`/admin/permissions/${permission._id}`}>
                                                        <PencilIcon className="w-4 h-4 text-foreground hover:text-primary" />
                                                    </Link>
                                                    <form action={handleDelete} className="flex justify-center items-center">
                                                        <input type="hidden" name="itemId" value={permission._id} />
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
