export default function AdminDashboardPermissionsLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
    return (
        <>
            {children}
            {modal}
        </>
    );
}
