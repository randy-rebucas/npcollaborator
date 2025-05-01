import AdminHeader from "@/components/Header";
import { SidebarInset } from "@/components/ui/sidebar";

export default function PracticeTypesLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'Practice Types', href: '/admin/practice-types', active: true },
            ]} />
            {children}
            {modal}
        </SidebarInset>
    )
}