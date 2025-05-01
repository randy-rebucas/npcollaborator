import { SidebarInset } from "@/components/ui/sidebar";
import AdminHeader from "@/components/Header";

export default function EnquiriesLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'Enquiries', href: '/admin/enquiries', active: true },
            ]} />
            {children}
            {modal}
        </SidebarInset>
    )
}