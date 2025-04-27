"use client"

import { formatCurrency } from "@/lib/utils";

import { useEffect, useState } from "react";

export default function StatsCardPage() {
    
    const [balances, setBalances] = useState({
        available: 0,
        pending: 0,
        instant: 0
    });
    
    useEffect(() => {
        const fetchAccount = async () => {
            const balanceStatus = await fetch("/api/stripe/balance");

            const { balance } = await balanceStatus.json();

            setBalances({
                available: balance.available[0]?.amount || 0,
                pending: balance.pending[0]?.amount || 0,
                instant: balance.instant_available[0]?.amount || 0
            });
        };
        fetchAccount();
    }, []);

    return (
        <>
            {/* Total Balance card */}
            <div className="bg-card p-6 rounded-lg border border-border">
                <div className="flex items-center text-muted-foreground text-sm font-medium mb-2">
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Total Balance
                </div>
                <div className="text-2xl font-normal mb-1 text-foreground">
                    {formatCurrency(balances.available)}
                </div>
                <div className="text-sm text-muted-foreground">Available now</div>
            </div>

            {/* Future Payouts card */}
            <div className="bg-card p-6 rounded-lg border border-border">
                <div className="flex items-center text-muted-foreground text-sm font-medium mb-2">
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                    Future Payouts
                </div>
                <div className="text-2xl font-normal mb-1 text-foreground">
                    {formatCurrency(balances.pending)}
                </div>
                <div className="text-sm text-muted-foreground">Processing</div>
            </div>

            {/* In Transit card */}
            <div className="bg-card p-6 rounded-lg border border-border">
                <div className="flex items-center text-muted-foreground text-sm font-medium mb-2">
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    In Transit
                </div>
                <div className="text-2xl font-normal mb-1 text-foreground">
                    {formatCurrency(balances.instant)}
                </div>
                <div className="text-sm text-muted-foreground">To bank account</div>
            </div>
        </>
    );
}