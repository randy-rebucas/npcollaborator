export default function EnquiriesLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
    return (
        <>
            {children}
            {modal}
        </>
    )
}