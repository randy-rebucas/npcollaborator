import AdminHeader from "@/components/Header";
import { SidebarInset } from "@/components/ui/sidebar";

export default function LicenseStatesLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'License States', href: '/admin/license-states', active: true },
            ]} />
            {children}
            {modal}
        </SidebarInset>
    )
}