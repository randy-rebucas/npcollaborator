"use client"

import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";

export default function StripeConnectPage() {
    const [isLoading, setIsLoading] = useState(false);

    const connectWithStripe = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/stripe/connect', {
                method: 'POST',
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Error connecting to Stripe:', error);
            setIsLoading(false); // Reset loading state on error
        }
    }, []); // Empty dependency array since function doesn't depend on any props or state
    
    return (
        <div className="max-w-2xl mx-auto text-center bg-card p-8 rounded-lg border border-border">
            <div className="mb-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to Stripe Connect</h2>
            <p className="text-muted-foreground mb-8">
                We&apos;ve partnered with Stripe to provide secure, reliable payments for healthcare professionals. Let&apos;s get your account set up to receive payments.
            </p>

            <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold">Business Information</h3>
                        <p className="text-sm text-muted-foreground">Provide your practice details and tax information</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold">Bank Account Connection</h3>
                        <p className="text-sm text-muted-foreground">Connect your bank account for direct deposits</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold">Start Receiving Payments</h3>
                        <p className="text-sm text-muted-foreground">Track your earnings and manage payments in one place</p>
                    </div>
                </div>
            </div>

            <Button
                onClick={connectWithStripe}
                className="w-full sm:w-auto"
                disabled={isLoading}
            >
                {isLoading ? "Connecting..." : "Connect with Stripe"}
            </Button>

            <p className="text-sm text-muted-foreground mt-6">
                By continuing, you agree to Stripe&apos;s terms of service and privacy policy.
            </p>
        </div>
    );
}