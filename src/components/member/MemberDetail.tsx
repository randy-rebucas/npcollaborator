import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Migrate from "@/components/member/actions/Migrate";

interface Member {
    id: string;
    auth: {
        email: string;
    };
    createdAt?: string;
    lastLogin?: string;
    customFields: object;
    verified: boolean;
    loginRedirect: string | null;
    metaData: object;
    permissions: string[];
    profileImage?: string | null;
    stripeCustomerId?: string | null;
}

interface MemberDetailProps {
    member: Member;
    returnPath: string;
}

export default function MemberDetail({ member, returnPath }: MemberDetailProps) {
    return (
        <div className="px-2">
            <Card>
                <CardHeader className="flex gap-4 p-6 space-y-1.5 flex-row">
                    <Link href={returnPath} className="flex justify-start items-center py-2">
                        <ArrowLeftIcon className="w-4 h-4" />
                    </Link>
                    <CardTitle>Member Detail</CardTitle>
                </CardHeader>
                <CardContent>
                    <dl className="divide-y divide-border">
                        <div className="py-2 flex justify-between">
                            <dt className="font-medium text-muted-foreground">ID</dt>
                            <dd className="text-foreground">{member.id}</dd>
                        </div>
                        <div className="py-2 flex justify-between">
                            <dt className="font-medium text-muted-foreground">Email</dt>
                            <dd className="text-foreground">{member.auth.email}</dd>
                        </div>
                        <div className="py-2 flex justify-between">
                            <dt className="font-medium text-muted-foreground">Created At</dt>
                            <dd className="text-foreground">{new Date(member.createdAt || '').toLocaleString()}</dd>
                        </div>
                        <div className="py-2 flex justify-between">
                            <dt className="font-medium text-muted-foreground">Last Login</dt>
                            <dd className="text-foreground">{new Date(member.lastLogin || '').toLocaleString()}</dd>
                        </div>
                        {Object.entries(member.customFields).map(([key, value]) => (
                            <div key={key} className="py-2 flex justify-between">
                                <dt className="font-medium text-muted-foreground">{key.replace(/-/g, ' ')}</dt>
                                <dd className="text-foreground break-words">{value}</dd>
                            </div>
                        ))}
                        <div className="py-2 flex justify-between">
                            <dt className="font-medium text-muted-foreground">Verified</dt>
                            <dd className="text-foreground">
                                <Badge variant={member.verified ? 'secondary' : 'outline'} className="text-sm">
                                    {member.verified ? 'Yes' : 'No'}
                                </Badge>
                            </dd>
                        </div>
                    </dl>
                </CardContent>
                <CardFooter>
                    <div className="flex justify-end space-x-2">
                        <Migrate id={member.id}/>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
} 