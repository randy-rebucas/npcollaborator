'use client';

import AppHeader from "@/components/AppHeader"; 
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HelpLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
    const pathname = usePathname();
    const currentTab = pathname.split('/').pop();

    const tabs = ['Help', 'FAQ', 'Contact Us'];
    return (
        <div className="bg-background min-h-screen w-full">
            <AppHeader />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 flex-col">
                    <div className="border-b border-border">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <Link
                                    key={tab}
                                    href={`/np/help${tab.toLowerCase() === 'help' ? '' : `/${tab.toLowerCase().replace(/\s+/g, '-')}`}`}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                            ${currentTab === tab.toLowerCase().replace(/\s+/g, '-')
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'} `}
                                >
                                    {tab}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="rounded-lg p-6">
                        {children}
                        {modal}
                    </div>
                </div>
            </main>
        </div>
    );
}