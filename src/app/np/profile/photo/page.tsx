'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { PhotoSkeleton } from '@/components/Skeletons';
import { useSession } from '@/providers/logto-session-provider';
import { getUser } from '@/app/actions/user';
import { IUser } from '@/models/User';
import { toast } from 'sonner';

const formSchema = z.object({
    photo: z.instanceof(File).optional(),
})

export default function Photo() {
    const { claims } = useSession();
    const [photoUrl, setPhotoUrl] = useState('');
    const [user, setUser] = useState<IUser | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    // Memoize the setValue function
    const setValue = form.setValue;

    useEffect(() => {
        if (!claims?.sub) return;
        const getUserData = async () => {
            try {
                if (!claims.sub) return;
                const userData = await getUser(claims.sub);
                // Populate form with user data
                setUser(userData);

                if (userData) {
                    setPhotoUrl(userData?.customData?.profilePhotoPath || '');
                }

            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setIsLoading(false);
            }
        }

        getUserData();

    }, [setValue, claims?.sub]);

    if (isLoading) {
        return <PhotoSkeleton />;
    }


    const handleUpload = async (file: File) => {
        setIsUploading(true);

        try {
            // Delete old file
            const deleteResponse = await fetch("/api/upload", {
                method: "DELETE",
                body: JSON.stringify({ path: photoUrl }),
            });

            if (!deleteResponse.ok) {
                throw new Error("Failed to delete old file");
            }

            // Create FormData object
            const formData = new FormData();
            formData.append('file', file);

            // Upload file to server
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }
            const data = await response.json();

            setPhotoUrl(data.url);

            if (data.url) {
                const formattedData = {
                    customData: {
                        ...user?.customData,
                        profilePhotoPath: data.url,
                    },
                };
                // Update profile photo path
                await fetch("/api/profile", {
                    method: "POST",
                    body: JSON.stringify(formattedData),
                });

                toast.success("Your profile has been updated.");
            } else {
                toast.error("Failed to upload file. Please try again.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload file. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-background max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">Profile Picture</h2>
                <p className="text-sm text-muted-foreground">
                    Please make sure your information is up to date.
                </p>
            </div>

            <div className="flex flex-col items-center gap-6">
                {/* Profile Image */}
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted">
                    {(photoUrl) ? (
                        <Image
                            src={photoUrl || ''}
                            alt='avatar'
                            className="w-full h-full object-cover"
                            width={128}
                            height={128}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-muted-foreground">
                            {''}
                        </div>
                    )}
                </div>

                {/* Upload Button */}
                <div className="relative">
                    <input
                        type="file"
                        className="hidden"
                        id="profile-upload"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                                form.setValue('photo', file);
                                handleUpload(file);
                            }
                        }}
                    />
                    <button
                        onClick={() => document.getElementById("profile-upload")?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-4 py-2 rounded-md bg-card hover:bg-card/80 
                                 transition-colors text-foreground font-medium disabled:opacity-50"
                    >
                        <svg
                            className="w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        {isUploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                </div>


            </div>
        </div>
    );
}