import Pagination from "@/components/ui/member/pagination";
import Search from "@/components/ui/member/search";
import Filter from "@/components/ui/member/filter";
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { SearchParams } from '@/types/search-params';
import { getPracticeTypesPaginated, deletePracticeType } from '@/app/actions/practicetypes';
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "lucide-react";


export default async function PracticeTypesPage(props: {
    searchParams: SearchParams
}) {
    const ITEMS_PER_PAGE = 10;

    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;
    const query = String(searchParams?.query || '');
    const enabled = String(searchParams?.enabled || 'all');

    const { practiceTypes, total } = await getPracticeTypesPaginated({ page: currentPage, search: query, enabled: enabled, limit: ITEMS_PER_PAGE });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);

    const handleDelete = async (data: FormData) => {
        "use server";
        const itemId = data.get("itemId");
        await deletePracticeType(itemId as string);
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="mx-auto w-full space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Practice Types</h1>
                    <div className="flex items-center gap-4">
                        <Search placeholder='Search practice types...' />
                        <Filter target="enabled" options={[{ 'true': 'Enabled' }, { 'false': 'Disabled' }]} placeholder="Filter" defaultValue="all" />
                        <Link href="/admin/practice-types/form" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md">
                            Add
                        </Link>
                    </div>
                </div>
                <div className="rounded-md border bg-background">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Practice Type</TableHead>
                                <TableHead>Enabled</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {practiceTypes.map((practiceType) => (
                                <TableRow key={practiceType._id}>
                                    <TableCell>{practiceType.type}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            practiceType.enabled ? 'default' :
                                                'secondary'
                                        }>
                                            {practiceType.enabled ? 'Enabled' : 'Disabled'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="flex items-center justify-end gap-2 p-3">
                                        <Link href={`/admin/practice-types/form/${practiceType._id}`} className="flex justify-center items-center hover:text-primary">
                                            <PencilIcon className="w-4 h-4" />
                                        </Link>
                                        <form action={handleDelete} className="flex justify-center items-center">
                                            <input type="hidden" name="itemId" value={practiceType._id} />
                                            <button type="submit" className="flex justify-center items-center hover:text-destructive">
                                                <TrashIcon className="w-4 h-4 text-destructive" />
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
    );
}
