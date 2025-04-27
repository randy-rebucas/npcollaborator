'use client';

import { IAttestation } from '@/models/Attestation';
import AppHeader from '@/components/AppHeader';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AttestationsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [attestations, setAttestations] = useState<IAttestation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Add data fetching
    useEffect(() => {
        const fetchAttestations = async () => {
            try {
                const response = await fetch('/api/attestations');
                if (!response.ok) throw new Error('Failed to fetch attestations');
                const data = await response.json();
                console.log(data);
                setAttestations(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchAttestations();
    }, []);

    // Add search filter
    const filteredAttestations = attestations.filter((attestation) =>
        Object.values(attestation).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Add loading state
    if (loading) {
        return <div className="flex justify-center p-8">Loading attestations...</div>;
    }

    // Add error handling
    if (error) {
        return <div className="text-red-500 p-8">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen w-full bg-background">
            <AppHeader />
            <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 flex-col space-y-8">
                    <div className="space-y-6">
                        <div className="mb-4 flex justify-between items-center">
                            <input
                                type="text"
                                placeholder="Search attestations..."
                                className="w-full max-w-md px-4 py-2 rounded-lg border border-input bg-background"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="rounded-md border border-border">
                            <table className="w-full">
                                <thead className="border-b border-border bg-muted">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Schema
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Timestamp
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-background">
                                    {filteredAttestations.map((attestation) => (
                                        <tr key={attestation._id} className="hover:bg-muted/50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                {attestation.schema}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                {attestation.timestamp.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    attestation.status === 'verified'
                                                        ? 'bg-success/20 text-success'
                                                        : attestation.status === 'rejected'
                                                        ? 'bg-destructive/20 text-destructive'
                                                        : 'bg-warning/20 text-warning'
                                                }`}>
                                                    {attestation.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Link
                                                    href={`/np/attestations/${attestation._id}`}
                                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Empty state */}
                                    {filteredAttestations.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-4">
                                                    <div className="text-muted-foreground">
                                                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-foreground text-lg font-medium">No attestations found</div>
                                                    <p className="text-muted-foreground text-sm">
                                                        {searchTerm
                                                            ? "Try adjusting your search terms or clear the search"
                                                            : "Get started by creating your first attestation"}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

