'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { CredentialsSkeleton } from "@/components/Skeletons"
import { useSession } from "@/providers/logto-session-provider";
import { getUser } from "@/app/actions/user";
import { IUser } from "@/models/User";
import { toast } from "sonner";
// Add form schema
const licenseSchema = z.object({
    medicalLicenseStates: z.array(z.object({
        state: z.string().min(1, "State is required"),
        licenseNumber: z.string().min(1, "License number is required"),
        expirationDate: z.string().min(1, "Expiration date is required")
    })),
    deaLicenseStates: z.array(z.object({
        state: z.string().min(1, "State is required"),
        licenseNumber: z.string().min(1, "License number is required"),
        expirationDate: z.string().min(1, "Expiration date is required")
    }))
})

export default function CredentialsPage() {
    const [user, setUser] = useState<IUser | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [states, setStates] = useState([]);
    const { claims } = useSession();

    // Update the form initialization
    const form = useForm<z.infer<typeof licenseSchema>>({
        resolver: zodResolver(licenseSchema),
        defaultValues: {
            medicalLicenseStates: [],
            deaLicenseStates: []
        }
    })

    // Memoize the setValue function
    const setValue = form.setValue;

    useEffect(() => {

        if (!claims?.sub) return;
        const getUserData = async () => {
            try {
                if (!claims.sub) return;
                const userData = await getUser(claims.sub);
                setUser(userData);
                if (userData) {
                    const profile = {
                        medicalLicenseStates: userData?.customData?.licenseAndCertification?.medicalLicenseStates?.map(license => ({
                            state: license.state,
                            licenseNumber: license.licenseNumber,
                            expirationDate: license.expirationDate ? new Date(license.expirationDate).toISOString().split('T')[0] : ''
                        })) || [],
                        deaLicenseStates: userData?.customData?.licenseAndCertification?.deaLicenseStates?.map(license => ({
                            state: license.state,
                            licenseNumber: license.licenseNumber,
                            expirationDate: license.expirationDate ? new Date(license.expirationDate).toISOString().split('T')[0] : ''
                        })) || []
                    };

                    Object.entries(profile).forEach(([key, value]) => {
                        setValue(key as keyof typeof profile, value);
                    });
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setIsLoading(false);
            }
        }

        getUserData();
    }, [setValue, claims?.sub]);

    useEffect(() => {
        const fetchStates = async () => {
            const states = await fetch(`/api/states`);
            const statesData = await states.json();
            setStates(statesData);
        }
        fetchStates();
    }, [isLoading]);

    // Update the submit function
    async function onSubmit(values: z.infer<typeof licenseSchema>) {
        setIsSubmitting(true);
        try {
            const formattedData = {
                customData: {
                    ...user?.customData,
                    licenseAndCertification: {
                        medicalLicenseStates: values.medicalLicenseStates.map(license => ({
                            state: license.state,
                            licenseNumber: license.licenseNumber,
                            expirationDate: license.expirationDate ? new Date(license.expirationDate).toISOString() : null,
                        })),
                        deaLicenseStates: values.deaLicenseStates.map(license => ({
                            state: license.state,
                            licenseNumber: license.licenseNumber,
                            expirationDate: license.expirationDate ? new Date(license.expirationDate).toISOString() : null,
                        }))
                    }
                }
            };

            const response = await fetch("/api/profile/custom-data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            toast.success("Your licenses have been updated.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update licenses. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return <CredentialsSkeleton />
    }

    return (
        <div className="bg-background max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">License Information</h2>
                <p className="text-muted-foreground mt-2">
                    License verification is checked prior to all collaboration initiations.
                </p>
                <p className="text-muted-foreground mt-2">
                    <span className="font-medium text-foreground">NP Collaborator</span> is currently serving{" "}
                    <span className="font-medium text-foreground">NJ, MI, OH, TX</span>
                </p>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Medical Licenses Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">
                        Medical Licenses
                        <span className="block text-sm font-normal text-muted-foreground">
                            Required for all NP Collaborators
                        </span>
                    </h3>

                    {form.watch("medicalLicenseStates").map((license, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-card hover:bg-card/80 transition-colors">
                            <div className="flex gap-4 items-center items-start">
                                <div className="flex-1">
                                    <select
                                        {...form.register(`medicalLicenseStates.${index}.state`)}
                                        className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-primary"
                                    >
                                        <option value="">Select State</option>
                                        {states.map(state => {
                                            // Check if state is already selected in another medical license
                                            const isStateSelected = form.watch("medicalLicenseStates")
                                                .some((l, i) => i !== index && l.state === state);
                                            return (
                                                <option
                                                    key={state}
                                                    value={state}
                                                    disabled={isStateSelected}
                                                >
                                                    {state} {isStateSelected ? '(Already Selected)' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    {form.formState.errors.medicalLicenseStates?.[index]?.state && (
                                        <p className="text-sm text-destructive mt-1">
                                            {form.formState.errors.medicalLicenseStates[index]?.state?.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <input
                                        type="text"
                                        {...form.register(`medicalLicenseStates.${index}.licenseNumber`)}
                                        placeholder="License number"
                                        className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-primary"
                                    />
                                </div>

                                <div className="flex-1">
                                    <input
                                        type="date"
                                        {...form.register(`medicalLicenseStates.${index}.expirationDate`)}
                                        className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-primary"
                                    />
                                </div>

                                {form.watch("medicalLicenseStates").length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const currentLicenses = form.getValues("medicalLicenseStates");
                                            form.setValue(
                                                "medicalLicenseStates",
                                                currentLicenses.filter((_, i) => i !== index)
                                            );
                                        }}
                                        className="p-2 text-destructive hover:text-destructive/80"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => {
                            const currentLicenses = form.getValues("medicalLicenseStates");
                            form.setValue("medicalLicenseStates", [
                                ...currentLicenses,
                                { state: "", licenseNumber: "", expirationDate: new Date().toISOString().split('T')[0] }
                            ]);
                        }}
                        className="mt-4 px-4 py-2 border rounded-md bg-card hover:bg-card/80 transition-colors"
                    >
                        + Add New License
                    </button>
                </div>

                <hr className="border-border" />

                {/* DEA Licenses Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">
                        DEA Licenses
                        <span className="block text-sm font-normal text-muted-foreground">
                            Required for prescribing controlled substances
                        </span>
                    </h3>

                    {form.watch("deaLicenseStates").map((license, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-card hover:bg-card/80 transition-colors">
                            <div className="flex gap-4 items-center items-start">
                                <div className="flex-1">
                                    <select
                                        {...form.register(`deaLicenseStates.${index}.state`)}
                                        className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-primary"
                                    >
                                        <option value="">Select State</option>
                                        {states.map(state => {
                                            // Check if state is already selected in another DEA license
                                            const isStateSelected = form.watch("deaLicenseStates")
                                                .some((l, i) => i !== index && l.state === state);
                                            return (
                                                <option
                                                    key={state}
                                                    value={state}
                                                    disabled={isStateSelected}
                                                >
                                                    {state} {isStateSelected ? '(Already Selected)' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    {form.formState.errors.deaLicenseStates?.[index]?.state && (
                                        <p className="text-sm text-destructive mt-1">
                                            {form.formState.errors.deaLicenseStates[index]?.state?.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <input
                                        type="text"
                                        {...form.register(`deaLicenseStates.${index}.licenseNumber`)}
                                        placeholder="DEA License number"
                                        className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-primary"
                                    />
                                </div>

                                <div className="flex-1">
                                    <input
                                        type="date"
                                        {...form.register(`deaLicenseStates.${index}.expirationDate`)}
                                        className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-primary"
                                    />
                                </div>

                                {form.watch("deaLicenseStates").length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const currentLicenses = form.getValues("deaLicenseStates");
                                            form.setValue(
                                                "deaLicenseStates",
                                                currentLicenses.filter((_, i) => i !== index)
                                            );
                                        }}
                                        className="p-2 text-destructive hover:text-destructive/80"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => {
                            const currentLicenses = form.getValues("deaLicenseStates");
                            form.setValue("deaLicenseStates", [
                                ...currentLicenses,
                                { state: "", licenseNumber: "", expirationDate: new Date().toISOString().split('T')[0] }
                            ]);
                        }}
                        className="mt-4 px-4 py-2 border rounded-md bg-card hover:bg-card/80 transition-colors"
                    >
                        + Add New DEA License
                    </button>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-md 
                                 hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    )
}