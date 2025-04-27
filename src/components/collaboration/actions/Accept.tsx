'use client';

import { toast } from "sonner";

export default function Accept({ collaboratorId, refetch }: { collaboratorId: string, refetch: () => void }) {
    const handleAccept = async (id: string) => {
        const response = await fetch(`/api/collaborators/${id}/accept`, {
            method: 'POST',
        });
        const data = await response.json();
        if (data.success) {
            toast.success('Collaborator accepted');
            refetch();
        } else {
            toast.error('Failed to accept collaborator');
        }
    };

    return (
        <button
            onClick={() => handleAccept(collaboratorId)}
            className="flex-1 bg-primary text-primary-foreground rounded-md py-2 px-4 text-sm font-medium hover:bg-primary/90"
        >
            Accept
        </button>
    );
}
