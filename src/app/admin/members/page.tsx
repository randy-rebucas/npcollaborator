import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { MemberstackAdminService } from '@/utils/memberstack-admin';
import { countMembers } from '@/app/actions/members';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Admin Members',
};

export default async function AdminMembersPage() {
    const { totalCount: nodeApiCount } = await MemberstackAdminService.listMembers();
    const webhookCount = await countMembers();
    
    // Calculate sync status
    const syncDifference = Math.abs(nodeApiCount - (webhookCount ?? 0));
    const isSynced = syncDifference === 0;

    return (
        <div className="space-y-6">
            <div className="gap-4 grid grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Webhook Members
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="text-xs" asChild>
                            <Link href="/admin/members/webhook">View all</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{webhookCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Total webhook members
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Node API Members
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="text-xs" asChild>
                            <Link href="/admin/members/node-api">View all</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{nodeApiCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Total node API members
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${isSynced ? 'text-green-500' : 'text-red-500'}`}>
                            {isSynced ? 'Synced' : `${syncDifference} out of sync`}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {isSynced 
                                ? 'All members are properly synchronized'
                                : 'Difference between webhook and API member counts'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}