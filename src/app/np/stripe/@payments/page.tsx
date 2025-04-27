"use client";

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { CreditCard, Loader2 } from 'lucide-react';

interface Payment {
    id: string;
    amount: number;
    status: string;
    created: number;
    customer: string;
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await fetch('/api/stripe/payments');
                const data = await response.json();
                console.log(data);
                setPayments(data.payments);
            } catch (error) {
                console.error('Error fetching payments:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPayments();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading payments...</p>
                </div>
            </div>
        );
    }

    if (payments.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="rounded-full bg-muted p-6">
                        <CreditCard className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">No payments yet</h3>
                    <p className="text-muted-foreground max-w-sm">
                        When you receive payments, they will appear here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Customer
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                    {payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-muted/50">
                            <td className="px-6 py-4 whitespace-nowrap text-foreground">
                                {formatCurrency(payment.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    payment.status === 'succeeded' ? 'bg-success/20 text-success' : 
                                    payment.status === 'pending' ? 'bg-warning/20 text-warning' : 
                                    'bg-destructive/20 text-destructive'
                                }`}>
                                    {payment.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(payment.created * 1000).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                {payment.customer}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 