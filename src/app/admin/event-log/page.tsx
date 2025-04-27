import AdminHeader from "@/components/Header";
import { SidebarInset } from "@/components/ui/sidebar";
import { getEvents } from "@/app/actions/events";
import { formatDistanceToNow } from "date-fns";
import { LogIn, UserCog, UserPlus, UserMinus, RefreshCcw } from "lucide-react";
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Metadata } from "next";
import { SearchParams } from "@/types/search-params";
import Pagination from "@/components/ui/member/pagination";
import Search from "@/components/ui/member/search";
import Filter from "@/components/ui/member/filter";


export const metadata: Metadata = {
    title: 'Admin Event Log',
};

export default async function EventLog(props: {
    searchParams: SearchParams
}) {
    const ITEMS_PER_PAGE = 10;
    const searchParams = await props.searchParams
    const currentPage = Number(searchParams?.page) || 1;
    const query = String(searchParams?.query || '');
    const type = String(searchParams?.type || 'all');
    const { events, total } = await getEvents({ 
        page: currentPage, 
        search: query, 
        type: type, 
        limit: ITEMS_PER_PAGE 
    });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);

    const eventTypes = [
        { key: 'logged-in', value: 'Logged In' },
        { key: 'member-updated', value: 'Member Updated' },
        { key: 'member-created', value: 'Member Created' },
        { key: 'member-deleted', value: 'Member Deleted' },
        { key: 'member-synced', value: 'Member Synced' }
    ].map(({ key, value }) => ({ [key]: value }));

    const getEventIcon = (type: string) => {
        const icons = {
            'logged-in': LogIn,
            'member-updated': UserCog,
            'member-created': UserPlus,
            'member-deleted': UserMinus,
            'member-synced': RefreshCcw
        } as const;
        
        return icons[type as keyof typeof icons] || LogIn;
    };

    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'Event Log', href: '/admin/event-log', active: true },
            ]} />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-foreground">Event Log</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <Search placeholder='Search events...' />
                        <Filter 
                            target="type" 
                            options={eventTypes} 
                            placeholder="Type" 
                            defaultValue="all" 
                        />
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Event</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8">
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                <p>No events found</p>
                                                {query && <p className="text-sm">Try adjusting your search or filter</p>}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    events.map((event) => {
                                        const Icon = getEventIcon(event.type);
                                        return (
                                            <TableRow key={event.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="rounded-full p-2 bg-muted">
                                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{event.user}</TableCell>
                                                <TableCell>{event.type}</TableCell>
                                                <TableCell>{formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}</TableCell>
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