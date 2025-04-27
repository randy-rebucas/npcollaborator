'use client';

import { InfoIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { RatesSkeleton } from "@/components/Skeletons";
import { useSession } from "@/providers/logto-session-provider";
import { IUser } from "@/models/User";
import { getUser } from "@/app/actions/user";
import { toast } from "sonner";

const ratesSchema = z.object({
    monthlyCollaborationRate: z.number().min(0, "Base rate must be positive"),
    additionalStateFee: z.number().min(0, "State rate must be positive"),
    additionalNPFee: z.number().min(0, "NP rate must be positive"),
    controlledSubstancesMonthlyFee: z.number().nullable()
});

type RatesFormValues = z.infer<typeof ratesSchema>;

export default function Rates() {
    const { claims } = useSession();
    const [user, setUser] = useState<IUser | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<RatesFormValues>({
        resolver: zodResolver(ratesSchema),
        defaultValues: {
            monthlyCollaborationRate: 0,
            additionalStateFee: 0,
            additionalNPFee: 0,
            controlledSubstancesMonthlyFee: 0
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
                    setValue('monthlyCollaborationRate', userData.customData?.rateMatrix?.monthlyCollaborationRate || 0);
                    setValue('additionalStateFee', userData.customData?.rateMatrix?.additionalStateFee || 0);
                    setValue('additionalNPFee', userData.customData?.rateMatrix?.additionalNPFee || 0);
                    setValue('controlledSubstancesMonthlyFee', userData.customData?.rateMatrix?.controlledSubstancesMonthlyFee || 0);
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
        return <RatesSkeleton />;
    }

    const onSubmit = async (data: RatesFormValues) => {
        setIsSubmitting(true);
        
        const formattedData = {
            customData: {
                ...user?.customData,
                rateMatrix: {
                    monthlyCollaborationRate: data.monthlyCollaborationRate,
                    additionalStateFee: data.additionalStateFee,
                    additionalNPFee: data.additionalNPFee,
                    controlledSubstancesMonthlyFee: data.controlledSubstancesMonthlyFee,
                },
            },
        };
        try {
            const response = await fetch("/api/profile/custom-data", {
                method: "POST",
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            toast.success("Your profile has been updated.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const InputField = ({ label, name, tooltip }: { label: string; name: keyof RatesFormValues; tooltip: string }) => (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-foreground">{label}</label>
                <div className="relative group">
                    <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block 
                                  w-48 p-2 bg-popover text-popover-foreground text-xs rounded-md shadow-lg">
                        {tooltip}
                    </div>
                </div>
            </div>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <input
                    type="number"
                    {...form.register(name, { valueAsNumber: true })}
                    className="w-full pl-7 pr-4 py-2 bg-background border border-border rounded-lg 
                             focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
            </div>
            {form.formState.errors[name] && (
                <p className="mt-1 text-sm text-destructive">{form.formState.errors[name]?.message}</p>
            )}
        </div>
    );

    return (
        <div className="bg-background max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">Update Your Rate Matrix</h2>
                <p className="text-sm text-muted-foreground">
                    During our matching process, we will quote your base rate plus any additional fees based on your choices below.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                    Please be aware, adjustments in Rates may take 2-3 business days to appear in your profile.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <InputField
                    label="Monthly Base Collaboration Rate"
                    name="monthlyCollaborationRate"
                    tooltip="Base monthly rate for collaboration services"
                />

                <InputField
                    label="Additional State Fee (per state)"
                    name="additionalStateFee"
                    tooltip="Extra fee charged per additional state"
                />

                <InputField
                    label="Additional Nurse Practitioner Fee"
                    name="additionalNPFee"
                    tooltip="Fee for multi-NP practices"
                />

                <InputField
                    label="Controlled Substances Monthly Fee"
                    name="controlledSubstancesMonthlyFee"
                    tooltip="Optional monthly fee for controlled substances"
                />

                <div className="flex justify-end mt-8">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg 
                                 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed 
                                 transition-colors"
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}