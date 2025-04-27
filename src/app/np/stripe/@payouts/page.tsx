"use client";

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { CreditCard, Loader2 } from 'lucide-react';

interface Payout {
    id: string;
    amount: number;
    status: string;
    arrival_date: number;
    description: string;
    bank_account: string;
}

export default function PayoutsPage() {
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPayouts = async () => {
            try {
                const response = await fetch('/api/stripe/payouts');
                const data = await response.json();
                setPayouts(data.payouts);
            } catch (error) {
                console.error('Error fetching payouts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPayouts();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    <p className="text-sm text-gray-500">Loading payouts...</p>
                </div>
            </div>
        );
    }

    if (payouts.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="rounded-full bg-gray-100 p-6">
                        <CreditCard className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No payouts yet</h3>
                    <p className="text-gray-500 max-w-sm">
                        When you receive payouts, they will appear here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Expected Arrival
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bank Account
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {payouts.map((payout) => (
                        <tr key={payout.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {formatCurrency(payout.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    payout.status === 'paid' ? 'bg-green-100 text-green-800' : 
                                    payout.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {payout.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(payout.arrival_date * 1000).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {payout.bank_account}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {payout.description || 'N/A'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}