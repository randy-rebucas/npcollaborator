'use client';

import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/ui/table";
import Link from "next/link";
import { EyeIcon } from "lucide-react";
import { MemberResponse } from "@/app/admin/webhook/page";

interface MemberTableProps {
    members: MemberResponse[];
}

export default function MemberTable({ members }: MemberTableProps) {
    return (

        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Event</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Account Synced</TableHead>
                    <TableHead className="text-center">Created At</TableHead>
                    <TableHead className="text-center">Updated At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {members?.map((member: MemberResponse) => (
                    <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.event}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.accountSynced
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                                }`}>
                                {member.accountSynced ? 'Synced' : 'Not Synced'}
                            </span>
                        </TableCell>
                        <TableCell className="text-center">{member.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell className="text-center">{member.updatedAt.toLocaleDateString()}</TableCell>
                        <TableCell className="flex items-center justify-end gap-2 p-3">
                            <Link href={`/admin/memberstack/${member.memberstackId}`} className="flex justify-center items-center">
                                <EyeIcon className="w-4 h-4" />
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}