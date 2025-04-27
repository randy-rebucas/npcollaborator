"use client"

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GovidSkeleton } from "@/components/Skeletons";
import { IUser } from "@/models/User";
import { useSession } from "@/providers/logto-session-provider";
import { getUser } from "@/app/actions/user";
import { toast } from "sonner";

const formSchema = z.object({
    governmentId: z.instanceof(File).optional(),
    governmentIdPath: z.string().optional(),
});

export default function GovidPage() {
    const { claims } = useSession();
    const [govIdUrl, setGovIdUrl] = useState('');
    const [user, setUser] = useState<IUser | null>(null);
    const [currentGovId, setCurrentGovId] = useState<{ governmentIdPath: string }>({ governmentIdPath: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    // Memoize the setValue function
    const setValue = form.setValue;

    useEffect(() => {
        const getUserData = async () => {
            try {
                if (!claims.sub) return;
                const userData = await getUser(claims.sub);
                setUser(userData);
                if (userData) {
                    setCurrentGovId({ governmentIdPath: userData?.customData?.governmentIdPath || "" });
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setIsLoading(false);
            }
        }

        getUserData();
    }, [setValue, claims?.sub]);

    async function onSubmit(values: z.infer<typeof formSchema>) {

        setIsSubmitting(true);

        try {
            // Only delete if there's an existing path and a new file
            if (currentGovId.governmentIdPath && values.governmentId) {
                const deleteResponse = await fetch("/api/upload", {
                    method: "DELETE",
                    body: JSON.stringify({ path: currentGovId.governmentIdPath }),
                });

                if (!deleteResponse.ok) {
                    throw new Error("Failed to delete old file");
                }
            }

            // Only upload if there's a new file
            if (values.governmentId) {
                // Create FormData object
                const formData = new FormData();
                formData.append('file', values.governmentId as File);

                // Upload file to server
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }
                const data = await response.json();

                setGovIdUrl(data.url);

                if (data.url) {
                    const formattedData = {
                        customData: {
                            ...user?.customData,
                            governmentIdPath: data.url,
                        },
                    };
                    // Update profile photo path
                    await fetch("/api/profile", {
                        method: "POST",
                        body: JSON.stringify(formattedData),
                    });

                    toast.success("Your government ID has been updated.");
                } else {
                    toast.error("Failed to upload file. Please try again.");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload file. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return <GovidSkeleton />;
    }

    return (
        <div className="bg-background max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">Government ID</h2>
                <p className="text-muted-foreground mt-1">
                    Your record of upload of your Government Issue ID.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                        Upload Government ID
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => form.setValue('governmentId', e.target.files?.[0])}
                            className="block w-full text-muted-foreground
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-primary/10 file:text-primary
                                hover:file:bg-primary/20
                                cursor-pointer"
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-sm 
                        ${currentGovId.governmentIdPath
                            ? 'bg-success/20 text-success'
                            : 'bg-muted text-muted-foreground'}`}>
                        {currentGovId.governmentIdPath ? 'Document Uploaded' : 'No Document'}
                    </span>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg
                            hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors duration-200"
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                {(govIdUrl || currentGovId.governmentIdPath) && (
                    <p className="text-sm text-muted-foreground">
                        Uploaded: {govIdUrl || currentGovId.governmentIdPath}
                    </p>
                )}
            </form>

        </div>
    );
}
