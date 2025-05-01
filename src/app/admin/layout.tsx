import { AdminSidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      {children}
    </SidebarProvider>
  );
}
