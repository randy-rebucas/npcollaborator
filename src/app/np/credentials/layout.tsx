'use client';

import { usePathname } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import Link from "next/link";


export default function CredentialsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const currentTab = pathname.split('/').pop();

    const tabs = ['Credentials', 'Education', 'Govid', 'Certification'];
    return (
        <div className="min-h-screen w-full bg-background">
            <AppHeader />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 flex-col">

                    <div className="border-b border-border">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <Link
                                    key={tab}
                                    href={`/np/credentials${tab.toLowerCase() === 'credentials' ? '' : `/${tab.toLowerCase()}`}`}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                            ${currentTab === tab.toLowerCase()
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
                                >
                                    {tab}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="rounded-lg p-6">
                        {children}
                    </div>

                </div>
            </main>
        </div>
    );
}