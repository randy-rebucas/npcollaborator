export default function PracticeTypesLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
    return (
        <>
            {children}
            {modal}
        </>
    )
}