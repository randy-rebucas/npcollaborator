import { MemberstackAdminService } from "@/utils/memberstack-admin";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Migrate from "@/components/member/actions/Migrate";

// Assuming you have a type or interface for the member object
export interface Member {
    id: string;
    auth: {
        email: string;
    };
    createdAt?: string;
    lastLogin?: string;
    customFields: {
        [key: string]: string;
    };
    verified: boolean;
    loginRedirect: string | null;
    metaData: object;
    permissions: string[];
    profileImage?: string | null;
    stripeCustomerId?: string | null;
}

export default async function DetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;

    const { data: member } = await MemberstackAdminService.getMemberById(id);

    if (!member) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="text-destructive text-center mt-4">
                    <h2 className="text-3xl font-bold">Oops!</h2>
                    <p className="text-lg">We couldn&apos;t find the member you&apos;re looking for.</p>
                    <Link href={`/admin/memberstack`} className="mt-4 text-primary underline">
                        Go back to Members List
                    </Link>
                </div>
            </div>
        );
    }

    const typedMember = member as Member; // Type assertion

    return (
        <div className="px-2">
            <Card>
                <CardHeader className="flex gap-4 p-6 space-y-1.5 flex-row">
                    <Link href={`/admin/memberstack`} className="flex justify-start items-center py-2">
                        <ArrowLeftIcon className="w-4 h-4" />
                    </Link>
                    <CardTitle>Member Detail</CardTitle>
                </CardHeader>
                <CardContent>
                    <dl className="divide-y divide-border">
                        <div className="py-2 flex justify-between">
                            <dt className="font-medium text-muted-foreground">ID</dt>
                            <dd className="text-foreground">{typedMember.id}</dd>
                        </div>
                        <div className="py-2 flex justify-between">
                            <dt className="font-medium text-muted-foreground">Email</dt>
                            <dd className="text-foreground">{typedMember.auth.email}</dd>
                        </div>
                        <div className="py-2 flex justify-between">
                            <dt className="font-medium text-muted-foreground">Created At</dt>
                            <dd className="text-foreground">{new Date(typedMember.createdAt || '').toLocaleString()}</dd>
                        </div>
                        <div className="py-2 flex justify-between">
                            <dt className="font-medium text-muted-foreground">Last Login</dt>
                            <dd className="text-foreground">{new Date(typedMember.lastLogin || '').toLocaleString()}</dd>
                        </div>
                        {Object.entries(typedMember.customFields).map(([key, value]) => (
                            <div key={key} className="py-2 flex justify-between">
                                <dt className="font-medium text-muted-foreground">{key.replace(/-/g, ' ')}</dt>
                                <dd className="text-foreground break-words">{value}</dd>
                            </div>
                        ))}
                        <div className="py-2 flex justify-between">
                            <dt className="font-medium text-muted-foreground">Verified</dt>
                            <dd className="text-foreground">
                                <Badge variant={typedMember.verified ? 'secondary' : 'outline'} className="text-sm">
                                    {typedMember.verified ? 'Yes' : 'No'}
                                </Badge>
                            </dd>
                        </div>
                    </dl>
                </CardContent>
                <CardFooter>
                    <div className="flex justify-end space-x-2">
                        <Migrate id={typedMember.id}/>  
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}