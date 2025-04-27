import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, RefreshCcw, Webhook, Shrub } from "lucide-react";
import { MemberstackAdminService } from "@/utils/memberstack-admin";
import { Metadata } from "next";
import { startOfMonth, subMonths } from "date-fns";
import { calculatePercentageChange } from "@/lib/utils";
import { countMembers } from "@/app/actions/members";
import { getNewUserCount, getTotalUserCount } from "@/app/actions/dashboard";

export const metadata: Metadata = {
    title: 'Admin Dashboard',
};

export default async function AdminDashboard() {

    const { totalCount: currentMemberstackCount } = await MemberstackAdminService.listMembers();
    const currentMembers = await countMembers();
    const currentUsers = await getTotalUserCount();
    const currentSyncedMembers = await countMembers(undefined, "true");

    // Get last month's counts
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const { last7Days } = await getNewUserCount();
    const lastMonthMembers = await countMembers(lastMonthStart);

    // Calculate percentage changes
    const userChange = calculatePercentageChange(last7Days.count, currentUsers.count);
    const memberChange = calculatePercentageChange(lastMonthMembers ?? 0, currentMembers ?? 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
                title="Total Users"
                value={currentUsers.count.toString()}
                description={`${userChange.toFixed(2)}% vs last month`}
                icon={Users}
            />
            <StatsCard
                title="Webhook Events"
                value={(currentMembers ?? 0).toString()}
                description={`${memberChange.toFixed(2)}% vs last month`}
                icon={Webhook}
            />
            <StatsCard
                title="Memstack Members"
                value={currentMemberstackCount}
                icon={Shrub}
            />
            <StatsCard
                title="Synced Members"
                value={(currentSyncedMembers ?? 0).toString()}
                icon={RefreshCcw}
            />
        </div>
    );
}

interface StatsCardProps {
    title: string;
    value: string;
    description?: string;
    icon: React.ElementType;
}

function StatsCard({ title, value, description, icon: Icon }: StatsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground">{description}</p>
                )}
            </CardContent>
        </Card>
    );
}


