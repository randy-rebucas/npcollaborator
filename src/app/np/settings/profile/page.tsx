'use client';

import { useEffect, useState } from 'react';
import { IUser } from '@/models/User';
import PictureForm from '@/components/forms/PictureForm';
import ProfileForm from '@/components/forms/ProfileForm';
import ClientForm from '@/components/forms/ClientForm';
import { toast } from 'sonner';

export default function ProfilePage() {
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                // setIsLoading(true);
                const response = await fetch('/api/profile');
                if (!response.ok) {
                    toast.error('Failed to fetch profile');
                    return;
                }
                const responseData = await response.json();
                console.log(responseData);
                setUser(responseData);
            } catch (error) {
                console.error(error);
                toast.error(error instanceof Error ? error.message : 'Failed to load profile data');
            } finally {
                // setIsLoading(false);
            }
        };
        getUser();
    }, []);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {user && (
                <>
                    <div className="rounded-lg border bg-card p-4">
                        <PictureForm user={user} />
                    </div>

                    <details className="rounded-lg border bg-card p-4">
                        <summary className="text-xl font-semibold cursor-pointer text-foreground">
                            User Information
                        </summary>
                        <div className="mt-4">
                            <ClientForm user={user} />
                        </div>
                    </details>

                    <details className="rounded-lg border bg-card p-4">
                        <summary className="text-xl font-semibold cursor-pointer text-foreground">
                            Profile Information
                        </summary>
                        <div className="mt-4">
                            <ProfileForm user={user} />
                        </div>
                    </details>
                </>
            )}
        </div>
    );
}
