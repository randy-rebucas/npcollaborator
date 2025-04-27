"use client"

import { Skeleton } from "@/components/ui/skeleton";
import AppHeader from '@/components/AppHeader';
import { useEffect, useState } from "react";
// import { useSession } from "@/providers/logto-session-provider";
// import { redirect } from "next/navigation";


export default function StripeLayout({      
    children,
    connect,
    statsCard,
    payments,
    payouts
}: {
    children: React.ReactNode,
    connect: React.ReactNode,
    statsCard: React.ReactNode,
    payments: React.ReactNode,
    payouts: React.ReactNode
}) {
    const [activeTab, setActiveTab] = useState('payments');
    const [stripeConnected, setStripeConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
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

    useEffect(() => {
        const fetchAccount = async () => {
            const accountStatus = await fetch("/api/stripe/status");

            const { account } = await accountStatus.json();
            if (account) {
                setStripeConnected(account.charges_enabled && account.payouts_enabled ? true : false);
            }
        };
        fetchAccount();
    }, []);

    useEffect(() => {
        setIsLoading(false);
    }, [stripeConnected]);

    return (
        <div className="min-h-screen w-full bg-background">
            <AppHeader />
            <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {isLoading &&
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-card p-6 rounded-lg border border-border">
                                <Skeleton className="h-4 w-24 mb-4" />
                                <Skeleton className="h-8 w-32 mb-2" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                        ))}
                    </div>
                }
                {stripeConnected &&
                    <>
                        {children}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {statsCard}
                        </div>
                        <div className="border-b border-border mb-6">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveTab('payments')}
                                    className={`${activeTab === 'payments'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Payments
                                </button>
                                <button
                                    onClick={() => setActiveTab('payouts')}
                                    className={`${activeTab === 'payouts'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Payouts
                                </button>
                            </nav>
                        </div>

                        <div className="bg-card rounded-lg border border-border mb-8">
                            {activeTab === 'payments' && payments}
                            {activeTab === 'payouts' && payouts}
                        </div>
                    </>
                }
                {!stripeConnected && connect}
            </main>
        </div>
    );
}