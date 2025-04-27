'use client';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "@/providers/logto-session-provider";

import { ProfileSkeleton } from "@/components/Skeletons";
import { IUser } from "@/models/User";
import { getUser } from "@/app/actions/user";
import { toast } from "sonner";

const formSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().regex(
        /^\+?[1-9]\d{1,14}$/,
        "Please enter a valid international phone number (e.g. +12125551234)"
    ),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
})


export default function ProfilePage() {
    const { claims } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            zip: '',
        }
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
                    setValue('firstName', userData.profile?.familyName || '');
                    setValue('lastName', userData.profile?.givenName || '');
                    setValue('phone', userData.primaryPhone || '');
                    setValue('address', userData.profile?.address?.formatted || '');
                    setValue('city', userData.profile?.address?.locality || '');
                    setValue('state', userData.profile?.address?.region || '');
                    setValue('zip', userData.profile?.address?.postalCode || '');
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setIsLoading(false);
            }
        }
        getUserData();
    }, [claims?.sub, setValue]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        const formattedData = {
            name: data.firstName + " " + data.lastName,
            profile: {
                familyName: data.lastName,
                givenName: data.firstName,
                address: {
                    formatted: data.address,
                    streetAddress: data.address,
                    locality: data.city,
                    region: data.state,
                    postalCode: data.zip,
                },
            },
        };
        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            // Update local user state with new data
            setUser(prev => prev ? { ...prev, ...data } : null);

            toast.success("Your profile has been updated.");
        } catch (error) {
            console.error('Error:', error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="bg-background max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
                <p className="text-sm text-muted-foreground">
                    Please make sure your information is up to date.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Section */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
                        <input
                            {...form.register("firstName")}
                            className="w-full px-3 py-2 bg-background border border-border rounded-md 
                                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="First name"
                        />
                        {form.formState.errors.firstName && (
                            <p className="text-destructive text-sm mt-1">{form.formState.errors.firstName.message}</p>
                        )}
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
                        <input
                            {...form.register("lastName")}
                            className="w-full px-3 py-2 bg-background border border-border rounded-md 
                                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Last name"
                        />
                        {form.formState.errors.lastName && (
                            <p className="text-destructive text-sm mt-1">{form.formState.errors.lastName.message}</p>
                        )}
                    </div>
                </div>

                {/* Phone Section */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                    <p className="text-sm text-muted-foreground mb-1">Please include country code (e.g. +1 for US/Canada)</p>
                    <input
                        {...form.register("phone")}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md 
                                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="e.g. +12125551234"
                    />
                    {form.formState.errors.phone && (
                        <p className="text-destructive text-sm mt-1">{form.formState.errors.phone.message}</p>
                    )}
                </div>

                {/* Address Section with City, State, ZIP labels */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Address</label>
                    <input
                        {...form.register("address")}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md 
                                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Address"
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground mb-1">City</label>
                        <input
                            {...form.register("city")}
                            className="w-full px-3 py-2 bg-background border border-border rounded-md 
                                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="City"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground mb-1">State</label>
                        <input
                            {...form.register("state")}
                            className="w-full px-3 py-2 bg-background border border-border rounded-md 
                                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="State"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground mb-1">ZIP</label>
                        <input
                            {...form.register("zip")}
                            className="w-full px-3 py-2 bg-background border border-border rounded-md 
                                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="ZIP"
                        />
                    </div>
                </div>

                {/* Email Section */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                    <div className="flex items-center gap-4">
                        <input
                            value={user?.primaryEmail || ''}
                            className="flex-1 px-3 py-2 bg-muted border border-border rounded-md"
                            readOnly
                        />
                        <button
                            type="button"
                            onClick={() => {
                                toast.error("Email change functionality will be available soon.");
                            }}
                            className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
                        >
                            Change Email Address
                        </button>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md 
                                 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed 
                                 transition-colors"
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
}
