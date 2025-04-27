import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";

export default function OverviewLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    )
}
