import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getUsers, GetUsersResponse } from "@/app/actions/user";
import Link from "next/link";
import { subDays, isAfter } from 'date-fns';

export default async function AdminUserPage() {
    const users = await getUsers({ page: 1, page_size: 10 })

    const sevenDaysAgo = subDays(new Date(), 7);
    const filteredUsers = users.filter((user: GetUsersResponse) => 
        isAfter(new Date(user.createdAt), sevenDaysAgo)
    );

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">New Users</CardTitle>
                <Link href="/admin/users" className="text-sm text-blue-600 hover:underline">View all</Link>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Join Date</TableHead>
                            <TableHead>Name</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user: GetUsersResponse) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.primaryEmail}</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                        {user.customData.role}
                                    </span>
                                </TableCell>
                                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{user.username}</TableCell>
                            </TableRow>
                        ))}
                        {filteredUsers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-4">
                                    <div className="flex flex-col items-center">
                                        <span className="text-lg font-semibold">No new users found</span>
                                        <p className="text-sm text-gray-500">Check back later for new user sign-ups.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}