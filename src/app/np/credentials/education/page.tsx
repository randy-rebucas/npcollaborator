"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect, useState } from "react"
import { EducationSkeleton } from "@/components/Skeletons"
import { useSession } from "@/providers/logto-session-provider";
import { getUser } from "@/app/actions/user"
import { IUser } from "@/models/User";
import { toast } from "sonner";

export type Education = {
    undergrad?: string;
    medical?: string;
    residency?: string;
}

const educationFormSchema = z.object({
    clinicalDegree: z.string().min(2, "Clinical degree is required"),
    practiceTypes: z.array(z.string()),
    education: z.object({
        undergrad: z.string().min(2, "Undergraduate institution is required"),
        medical: z.string().min(2, "Medical school is required"),
        residency: z.string().min(2, "Residency program is required"),
    }),
})

type EducationFormValues = z.infer<typeof educationFormSchema>;

// Add this type definition near the top with other types
type PracticeType = string;

export default function EducationPage() {
    const { claims } = useSession();
    const [user, setUser] = useState<IUser | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [practices, setPractices] = useState<PracticeType[]>([]);

    const form = useForm<EducationFormValues>({
        resolver: zodResolver(educationFormSchema),
        defaultValues: {
            clinicalDegree: "",
            practiceTypes: [],
            education: {
                undergrad: "",
                medical: "",
                residency: "",
            },
        },
    })

    // Memoize the setValue function
    const setValue = form.setValue;

    useEffect(() => {

        const getUserData = async () => {
            try {
                if (!claims.sub) return;
                const userData = await getUser(claims.sub);
                setUser(userData);
                if (userData) {
                    const profile = {
                        clinicalDegree: userData?.customData?.clinicalDegree || "",
                        practiceTypes: userData?.customData?.practiceTypes || [],
                        education: {
                            undergrad: userData?.customData?.education?.undergrad || "",
                            medical: userData?.customData?.education?.medical || "",
                            residency: userData?.customData?.education?.residency || ""
                        },
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
        const getPracticeTypes = async () => {
            const response = await fetch(`/api/practicetypes`);
            if (!response.ok) {
                throw new Error('Failed to fetch practice types');
            }
            const practicesData = await response.json();
            setPractices(practicesData);
        };
        getPracticeTypes();
    }, []);

    async function onSubmit(data: EducationFormValues) {
        setIsSubmitting(true);
        const formattedData = {
            customData: {
                ...user?.customData,
                education: {
                    undergrad: data.education.undergrad,
                    medical: data.education.medical,
                    residency: data.education.residency
                },
                practiceTypes: data.practiceTypes,
                clinicalDegree: data.clinicalDegree
            }
        };

        try {
            const response = await fetch("/api/profile/custom-data", {
                method: "POST",
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) throw new Error("Failed to update education");

            toast.success("Your education has been updated.");

        } catch (error) {
            console.error(error);
            toast.error("Failed to update education. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return <EducationSkeleton />;
    }

    return (
        <div className="bg-background max-w-2xl mx-auto p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground">Degree</h2>
                <p className="text-muted-foreground mt-2">
                    This will be shown to prospective Nurse Practitioners seeking a Collaborating Physician
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Clinical Degree Field */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                        Clinical Degree Type
                    </label>
                    <input
                        type="text"
                        {...form.register("clinicalDegree")}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg 
                                 focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="MD"
                    />
                </div>

                {/* Practice Types Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Practice Types</h3>
                    <div className="flex flex-wrap gap-2">
                        {form.watch("practiceTypes").map((type) => (
                            <span key={type} className="inline-flex items-center px-3 py-1 rounded-full 
                                                      bg-primary/10 text-primary">
                                {type}
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newTypes = form.getValues("practiceTypes").filter(t => t !== type);
                                        form.setValue("practiceTypes", newTypes);
                                    }}
                                    className="ml-2 text-primary hover:text-primary/80"
                                >×</button>
                            </span>
                        ))}
                    </div>
                    <select
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value && !form.getValues("practiceTypes").includes(value)) {
                                form.setValue("practiceTypes", [...form.getValues("practiceTypes"), value]);
                            }
                        }}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg 
                                 focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                        <option value="">Select practice types</option>
                        {practices
                            .filter(practice => !form.watch("practiceTypes").includes(practice))
                            .map((type, index) => (
                                <option key={`practice-${index}-${type}`} value={type}>{type}</option>
                            ))
                        }
                    </select>
                </div>

                <hr className="border-border" />

                {/* Education Fields */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground">Education</h3>
                    {(['undergrad', 'medical', 'residency'] as const).map((field: keyof Education) => (
                        <div key={field} className="space-y-2">
                            <label className="block text-sm font-medium text-foreground">
                                {field.charAt(0).toUpperCase() + field.slice(1)} Institution
                            </label>
                            <input
                                type="text"
                                {...form.register(`education.${field}`)}
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg 
                                         focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder={`Enter your ${field} institution`}
                            />
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg 
                                 hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
