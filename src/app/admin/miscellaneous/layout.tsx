'use client';

import AdminHeader from "@/components/Header";
import { SidebarInset } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const miscTabs = [
    { value: "miscellaneous", label: "Overview", href: "/admin/miscellaneous" },
    { value: "license-states", label: "License States", href: "/admin/miscellaneous/license-states" },
    { value: "practice-types", label: "Practice Types", href: "/admin/miscellaneous/practice-types" }
];

type Breadcrumb = {
    label: string;
    href: string;
    active?: boolean;
};

export default function MiscellaneousLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const currentTab = pathname.split('/').pop();
    
    const currentTabData = miscTabs.find(tab => tab.value === currentTab);
    const title = currentTabData?.label || 'Miscellaneous';

    const breadcrumbs: Breadcrumb[] = [
        { label: 'Admin', href: '/admin' },
        { label: 'Miscellaneous', href: '/admin/miscellaneous', active: currentTab === 'miscellaneous' },
        ...(currentTabData && currentTab !== 'miscellaneous' ? [{ label: currentTabData.label, href: currentTabData.href, active: true }] : [])
    ];

    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={breadcrumbs} />
            <div className="flex flex-1 flex-col space-y-8 p-8">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                        <p className="text-muted-foreground">
                            Manage your miscellaneous settings
                        </p>
                    </div>
                </div>

                <Tabs defaultValue={currentTab} className="space-y-4">
                    <TabsList>
                        {miscTabs.map(tab => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className={cn("w-[120px]")}
                                asChild
                            >
                                <Link href={tab.href}>{tab.label}</Link>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <div className="border rounded-lg p-4">
                    {children}
                </div>
            </div>
        </SidebarInset>
    );
}