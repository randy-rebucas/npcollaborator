import { fetchFilteredMembers } from '@/lib/data/members-data';
import Sync from './sync';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"

export default async function MembersTable({
   query,
   currentPage,
   ITEMS_PER_PAGE,
}: {
   query: string;
   currentPage: number;
   ITEMS_PER_PAGE: number;
}) {
   const members = await fetchFilteredMembers(query, currentPage, ITEMS_PER_PAGE);

   return (
      <Table>
         <TableHeader>
            <TableRow>
               <TableHead className="w-[100px]">Event</TableHead>
               <TableHead>Email</TableHead>
               <TableHead>Account Synced</TableHead>
               <TableHead className="text-right">Created At</TableHead>
               <TableHead className="text-right">Updated At</TableHead>
               <TableHead className="text-right">Sync</TableHead>
            </TableRow>
         </TableHeader>
         <TableBody>
            {members?.map((member: { id: string; event: string; email: string; createdAt: Date; updatedAt: Date; accountSynced: boolean }) => (
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
                  <TableCell className="text-right">{member.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">{member.updatedAt.toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                     <Sync id={member.id} />
                  </TableCell>
               </TableRow>
            ))}
         </TableBody>
      </Table>
   );
}