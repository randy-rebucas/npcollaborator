'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { toast } from "sonner"
import { IUser } from "@/models/User";

export default function UserTable({ users }: { users: IUser[] }) {
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const handleSuspendToggle = async (userId: string, currentStatus: boolean) => {
        try {
            setIsUpdating(userId);
            // TODO: Implement your API call here to update user suspension status
            const response = await fetch(`/api/user/${userId}/suspend`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isSuspended: !currentStatus }),
            }); 
            
            if (!response.ok) {
                throw new Error('Failed to update suspension status');
            }
            toast.success('User updated');
            // You might want to refresh the users data here or implement optimistic updates
        } catch (error) {
            console.error('Error updating suspension status:', error);
            // Handle error (show toast notification, etc.)
        } finally {
            setIsUpdating(null);
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Stripe Account</TableHead>
                    <TableHead>Onboarding</TableHead>
                    <TableHead>Submission Status</TableHead>
                    <TableHead>Synced</TableHead>
                    <TableHead>Suspended</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id} className="group">
                        <TableCell>
                            {user.name ?? 'N/A'}
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.primaryEmail}</TableCell>
                        <TableCell>{user.primaryPhone}</TableCell>
                        <TableCell>{user.customData?.role ? (user.customData.role.charAt(0).toUpperCase() + user.customData.role.slice(1)) : 'N/A'}</TableCell>
                        <TableCell>
                            {user.customData?.stripeAccountId ?? 'N/A'}
                        </TableCell>
                        <TableCell>
                            {/* {user.customData?.onboardingStatus ? user.customData?.onboardingStatus : 'N/A'} */}
                            {user.customData?.onboardingStatus === 'COMPLETED' && (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                                    {user.customData?.onboardingStatus}
                                </span>
                            )}
                            {user.customData?.onboardingStatus === 'INCOMPLETE' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {user.customData?.onboardingStatus}
                                </span>
                            )}
                        </TableCell>
                        <TableCell>
                            {user.customData?.submissionStatus || 'N/A'}
                        </TableCell>
                        <TableCell>
                            {user.customData?.accountSynced ? 'Yes' : 'No'}
                        </TableCell>
                        <TableCell>
                            <Switch
                                checked={user.isSuspended}
                                disabled={isUpdating === user.id}
                                onCheckedChange={() => handleSuspendToggle(user.id || '', user.isSuspended || false)}
                            />
                        </TableCell>
                        <TableCell>
                            {formatDistanceToNow(new Date(user.createdAt || new Date()), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="flex items-center justify-end gap-2 p-3">
                            <Link href={`/admin/users/${user.id}`}>
                                <EyeIcon className="w-4 h-4" /> 
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
