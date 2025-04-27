'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BioSkeleton } from '@/components/Skeletons';
import { useSession } from "@/providers/logto-session-provider";  
import { getUser } from '@/app/actions/user';
import { IUser } from '@/models/User';
import { toast } from 'sonner';

const bioFormSchema = z.object({
    description: z.string().min(1, "Background is required"),
    boardCertification: z.string().min(1, "Board certifications are required"),
    linkedinProfile: z.string().url().optional().or(z.literal("")),
});

type BioFormValues = z.infer<typeof bioFormSchema>;

export default function Bio() {
    const { claims } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<BioFormValues>({
        resolver: zodResolver(bioFormSchema),
        defaultValues: {
            description: '',
            boardCertification: '',
            linkedinProfile: '',
        },
    });

    // Memoize the setValue function
    const setValue = form.setValue;

    useEffect(() => {
        if (!claims?.sub) return;
        const getUserData = async () => {
            try {
                if (!claims.sub) return;
                const userData = await getUser(claims.sub);
                setUser(userData);
                // Populate form with user data
                if (userData) {
                    setValue('description', userData.customData?.backgroundCertification?.description || '');
                    setValue('boardCertification', userData.customData?.backgroundCertification?.boardCertification || '');
                    setValue('linkedinProfile', userData.customData?.backgroundCertification?.linkedinProfile || '');
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setIsLoading(false);
            }
        }

        getUserData();
    }, [setValue, claims?.sub]);

    async function onSubmit(data: BioFormValues) {
        setIsSubmitting(true);
        // works
        const formattedData = {
            customData: {
                ...user?.customData,
                backgroundCertification: {
                    description: data.description,
                    boardCertification: data.boardCertification,
                    linkedinProfile: data.linkedinProfile,
                    additionalCertifications: user?.customData?.backgroundCertification?.additionalCertifications,
                },
            },
        };
        try {
            const response = await fetch('/api/profile/custom-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            toast.success("Your profile has been updated.");
        } catch (error) {
            console.error('Error:', error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return <BioSkeleton />;
    }

    return (
        <div className="bg-background max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">Bio</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    This will be shown to prospective Nurse Practitioners seeking a Collaborating Physician after our matching process.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                        Your Background:
                    </label>
                    <textarea
                        {...form.register("description")}
                        className="w-full min-h-[100px] p-3 bg-background border border-border rounded-lg 
                                 focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                        placeholder="Tell us about your medical background and experience..."
                    />
                    {form.formState.errors.description && (
                        <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                        Board Certifications:
                    </label>
                    <input
                        {...form.register("boardCertification")}
                        className="w-full p-3 bg-background border border-border rounded-lg 
                                 focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="e.g., American Board of Internal Medicine (ABIM)"
                    />
                    {form.formState.errors.boardCertification && (
                        <p className="text-sm text-destructive">{form.formState.errors.boardCertification.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                        LinkedIn Profile:
                    </label>
                    <input
                        type="url"
                        {...form.register("linkedinProfile")}
                        className="w-full p-3 bg-background border border-border rounded-lg 
                                 focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="https://linkedin.com/in/your-profile"
                    />
                    {form.formState.errors.linkedinProfile && (
                        <p className="text-sm text-destructive">{form.formState.errors.linkedinProfile.message}</p>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg 
                                 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary 
                                 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}