"use client"

import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SyncProps {
    id: string;
}

export default function Sync({ id }: SyncProps) {

    const [isLoading, setIsLoading] = useState(false);

    const handleSync = async () => {
        setIsLoading(true);
        try {
            // Send the formData to the server
            const response = await fetch('/api/sharetribe', {
                method: 'POST',
                body: JSON.stringify({ id }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('User synced to Sharetribe');
            } else {
                toast.error('Failed to sync user to Sharetribe', {
                    description: data.message,
                });
            }
        } catch (error) {
            console.error('Error syncing user to Sharetribe:', error);
            toast.error('Failed to sync user to Sharetribe', {
                description: 'Please try again later.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <Button variant="outline" size="icon" onClick={handleSync}
                disabled={isLoading}>
                <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
        </div>
    );
}