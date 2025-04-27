'use client'

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Suspense } from "react";
import AdminHeader from "@/components/Header";
import { SidebarInset } from "@/components/ui/sidebar";

interface UserLayoutProps {
    children: React.ReactNode;
}

const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Users', href: '/admin/users', active: true },
];

export default function UserLayout({ children }: UserLayoutProps) {
    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={breadcrumbs} />
            <ErrorBoundary>
                <div className="flex flex-1 gap-4 p-4">
                    <div className={`space-y-4 w-full`}>
                        <Suspense fallback={<LoadingSpinner />}>
                            {children}
                        </Suspense>
                    </div>
                </div>
            </ErrorBoundary>
        </SidebarInset>
    );
}