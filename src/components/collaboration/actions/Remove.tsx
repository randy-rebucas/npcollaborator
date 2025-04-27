'use client';

import { useState } from "react";
import { toast } from "sonner";

export default function Remove({ collaboratorId, refetch }: { collaboratorId: string, refetch: () => void }) {
    const [dialog, setDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        action: async () => { },
    });
    const handleRemove = (id: string) => {
        setDialog({
            isOpen: true,
            title: 'Remove Collaborator',
            message: `Are you sure you want to remove this collaborator?`,
            action: async () => {
                try {
                    // Replace with your actual API endpoint
                    const response = await fetch(`/api/collaborators/${id}`, {
                        method: 'DELETE',
                    });
                    const data = await response.json();
                    if (data.success) {
                        toast.success('Collaborator removed');
                        refetch();
                    } else {
                        toast.error('Failed to remove collaborator');
                    }
                } catch (err) {
                    console.error('Error removing collaborator:', err);
                    toast.error('Please try again later.');
                }
                setDialog(prev => ({ ...prev, isOpen: false }));
            },
        });

    };

    return (
        <>
            <button
                onClick={() => handleRemove(collaboratorId)}
                className="flex-1 bg-destructive/10 text-destructive border border-destructive/30 rounded-md py-2 px-4 text-sm font-medium hover:bg-destructive/20"
            >
                Remove
            </button>

            {/* Custom Modal Dialog */}
            {dialog.isOpen && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative transform overflow-hidden rounded-lg bg-background px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-foreground">
                                    {dialog.title}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-muted-foreground">
                                        {dialog.message}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                <button
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-md bg-destructive px-3 py-2 text-sm font-semibold text-destructive-foreground shadow-sm hover:bg-destructive/90 sm:col-start-2"
                                    onClick={() => dialog.action()}
                                >
                                    Confirm
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-secondary/80 sm:col-start-1 sm:mt-0"
                                    onClick={() => setDialog(prev => ({ ...prev, isOpen: false }))}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
