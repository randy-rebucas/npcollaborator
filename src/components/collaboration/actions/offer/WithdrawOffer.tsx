'use client';

import { toast } from "sonner";

export default function WithdrawOffer({ collaboratorId, refetch }: { collaboratorId: string, refetch: () => void }) {

    const handleWithdrawOffer = async (id: string) => {
        try {
            const response = await fetch(`/api/collaborators/${id}/offer/withdraw`, {
                method: 'POST',
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Offer withdrawn' );
                refetch();
            } else {
                toast.error('Failed to withdraw offer');
            }
        } catch (err) {
            console.error('Error withdrawing offer:', err);
            toast.error('Please try again later.');
        }
    };

    return (
        <button
            onClick={() => handleWithdrawOffer(collaboratorId)}
            className="flex-1 bg-background text-foreground border border-border rounded-md py-2 px-4 text-sm font-medium hover:bg-muted"
        >
            Withdraw Offer
        </button>
    );
}
