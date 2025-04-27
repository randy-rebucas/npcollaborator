import { SidebarInset } from "@/components/ui/sidebar";
import AdminHeader from "@/components/Header";
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Metadata } from "next";
import { SearchParams } from "@/types/search-params";
import Pagination from "@/components/ui/member/pagination";
import Search from "@/components/ui/member/search";
import { deleteFaq, getFaqs } from "@/app/actions/faq"; 
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: 'Admin FAQ',
};

export default async function FAQPage(props: {
    searchParams: SearchParams
}) {
    const ITEMS_PER_PAGE = 10;
    const searchParams = await props.searchParams
    const currentPage = Number(searchParams?.page) || 1;
    const query = String(searchParams?.query || '');

    const { faqs, total } = await getFaqs({
        page: currentPage,
        search: query,
        limit: ITEMS_PER_PAGE
    });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);

    const handleDelete = async (formData: FormData) => {
        'use server'
        const id = formData.get('itemId') as string
        await deleteFaq(id)
    }
    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'FAQ', href: '/admin/faq', active: true },
            ]} />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-foreground">FAQ</h1>
                        <Button asChild>
                            <Link href="/admin/faq/new" className="flex items-center gap-2">
                                <PlusIcon className="w-4 h-4" />
                                Add FAQ
                            </Link>
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <Search placeholder='Search FAQs...' />
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Question</TableHead>
                                    <TableHead>Answer</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {faqs.map((faq) => (
                                    <TableRow key={faq._id}>
                                        <TableCell className="font-medium">{faq.question}</TableCell>
                                        <TableCell className="max-w-md truncate">{faq.answer}</TableCell>
                                        <TableCell className="flex items-center justify-end gap-2 p-3">
                                            <Link href={`/admin/faq/${faq._id}`}>
                                                <PencilIcon className="w-4 h-4 text-foreground hover:text-primary" />
                                            </Link>
                                            <form action={handleDelete}>
                                                <input type="hidden" name="itemId" value={faq._id} />
                                                <button type="submit" className="flex justify-center items-center">
                                                    <TrashIcon className="w-4 h-4 text-destructive hover:text-destructive/80" />
                                                </button>
                                            </form>
                                        </TableCell>
                                    </TableRow>
                                ))}
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