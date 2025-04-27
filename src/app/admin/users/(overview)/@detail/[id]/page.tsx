import { getUser } from "@/app/actions/user";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
// import Sync from "@/components/admin/user/actions/Sync";
import { Button } from "@/components/ui/button";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    const user = await getUser(id);

    return (
        <div className="space-y-6">
            {/* Header with back button */}
            <div className="flex items-center gap-4">
                <Link href={`/admin/users`} className="flex justify-start items-center py-2">
                    <ArrowLeftIcon className="w-4 h-4" />
                </Link>
                <h1 className="text-2xl font-bold">User Details</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Basic Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                                {user.avatar ? (
                                    <Image
                                        src={user.avatar}
                                        alt={user.name || ''}
                                        width={80}
                                        height={80}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-gray-400">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">{user.name}</h2>
                                <p className="text-sm text-gray-500">@{user.username}</p>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p>{user.primaryEmail}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Phone</p>
                                <p>{user.primaryPhone}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Role</p>
                                <p className="capitalize">{user.customData?.role}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

               
                {/* Account Status Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Account Status</p>
                                <p className={`font-medium ${user.isSuspended ? 'text-red-500' : 'text-green-500'}`}>
                                    {user.isSuspended ? 'Suspended' : 'Active'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Created</p>
                                <p>{formatDistanceToNow(user.createdAt || new Date())} ago</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Last Sign In</p>
                                <p>{formatDistanceToNow(user.lastSignInAt || new Date())} ago</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Password Status</p>
                                <p>{user.hasPassword ? 'Set' : 'Not Set'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* {user.customData && (
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Custom Data
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {Object.entries(user.customData).map(([key, value]) => (
                                    <div key={key} className="py-2 flex justify-between">
                                        <span className="font-medium text-muted-foreground">{key.replace(/-/g, ' ')}</span>
                                        <span className="text-foreground">{value}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                )} */}

            {/* Actions */}
            <div className="flex gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline">
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Edit User
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Edit user details</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                {/* <Sync userId={user.id} /> */}
            </div>
        </div>
    );
}