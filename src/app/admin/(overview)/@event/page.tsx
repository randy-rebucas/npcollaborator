import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, RefreshCcw, UserCog, UserPlus, UserMinus } from "lucide-react";
import { getEvents } from "@/app/actions/events";
import Link from "next/link";

type EventType = 'logged-in' | 'member-updated' | 'member-created' | 'member-deleted' | 'member-synced';

const EVENT_ICONS: Record<EventType, React.ElementType> = {
    'logged-in': LogIn,
    'member-updated': UserCog,
    'member-created': UserPlus,
    'member-deleted': UserMinus,
    'member-synced': RefreshCcw
};

export default async function AdminEventPage() {
    const getEventIcon = (type: string): React.ElementType => {
        return EVENT_ICONS[type as EventType] || LogIn;
    };

    const { events } = await getEvents({ page: 1, limit: 6 });

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Event Log</CardTitle>
                <Link href="/admin/events" className="text-sm text-blue-600 hover:underline">View all</Link>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {events.map((event) => {
                        const Icon = getEventIcon(event.type);
                        return (
                            <EventLogItem
                                key={event.id}
                                id={event.id}
                                type={event.type}
                                icon={Icon}
                            />
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

interface EventLogItemProps {
    id: string;
    type: string;
    icon: React.ElementType;
}

function EventLogItem({ id, type, icon: Icon }: EventLogItemProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="rounded-full p-2 bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
                <p className="text-sm font-medium text-foreground">
                    ID: {id}
                </p>
                <p className="text-xs text-muted-foreground">
                    Type: {type}
                </p>
            </div>
        </div>
    );
}