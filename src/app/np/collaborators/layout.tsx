'use client';

import AppHeader from "@/components/AppHeader";
// import { useSession } from "@/providers/logto-session-provider";
import Link from "next/link";
import {  usePathname } from "next/navigation";
// import { useEffect } from "react";

export default function CollaboratorsLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
    const pathname = usePathname();
    const currentTab = pathname.split('/').pop();
    // const { claims } = useSession();

    // useEffect(() => {
    //     const getUserSubmissionStatus = async (id: string) => {
    //         const response = await fetch(`/api/user/${id}/submission-status`);
    //         const data = await response.json();
    //         if (data.submissionStatus !== 'APPROVED') {
    //             redirect("/not-authorized");
    //         }
    //     }
    //     if (claims?.sub) {
    //         getUserSubmissionStatus(claims.sub);
    //     }
    // }, [claims?.sub]);

    return (
        <div className="min-h-screen w-full bg-background">
            <AppHeader />
            <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 flex-col space-y-8">
                    <div className="space-y-6">
                        <div className="mb-4 flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-foreground">Collaborators</h1>
                            <Link
                                href="/np/collaborators/form"
                                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                Add Collaborator
                            </Link>
                        </div>

                        {/* Filter Tabs */}
                        <div className="border-b border-border">
                            <nav className="-mb-px flex space-x-8">
                                <Link
                                    href="/np/collaborators/active"
                                    className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium ${
                                        currentTab === 'active'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                    }`}
                                >
                                    Active Collaborators
                                </Link>
                                <Link
                                    href="/np/collaborators/request"
                                    className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium ${
                                        currentTab === 'request'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                    }`}
                                >
                                    Pending Requests
                                </Link>
                            </nav>
                        </div>

                        {/* Collaborators Grid */}
                        {children}
                    </div>
                </div>
            </main>
            {modal}
        </div>
    )
}