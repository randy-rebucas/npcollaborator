export default function FaqLayout({
    children,
    modal,
}: {
    children: React.ReactNode
    modal: React.ReactNode
}) {
    return (
        <>
            {children}
            {modal}
        </>
    )
}