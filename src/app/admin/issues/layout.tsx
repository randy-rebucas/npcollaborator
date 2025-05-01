import AdminHeader from "@/components/Header";
import { SidebarInset } from "@/components/ui/sidebar";

export default function IssuesLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'Issues', href: '/admin/issues', active: true },
            ]} />
            {children}
            {modal}
        </SidebarInset>
    );
}