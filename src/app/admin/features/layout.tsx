import AdminHeader from "@/components/Header";
import { SidebarInset } from "@/components/ui/sidebar";

export default function FeaturesLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'Features', href: '/admin/features', active: true },
            ]} />
            {children}
            {modal}
        </SidebarInset>
    );
}