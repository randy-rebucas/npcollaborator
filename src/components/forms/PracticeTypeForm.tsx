"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"

const formSchema = z.object({
    type: z.string().min(2, "Type must be at least 2 characters"),
    enabled: z.boolean(),
}).required();

type FormValues = z.infer<typeof formSchema>;

export default function PracticeTypeForm({ id }: { id: string | null }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "",
            enabled: false,
        },
    });

    if (id) {
        const getPracticeType = async () => {
            const practiceType = await fetch(`/api/miscellaneous/practice-types/${id}`)
            const data = await practiceType.json();
            form.setValue("type", data?.type || "");
            form.setValue("enabled", data?.enabled || false);


            console.log(form.getValues())
        }
        getPracticeType()
    }

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        try {
            if (id) {
                const response = await fetch(`/api/miscellaneous/practice-types/${id}`, {
                    method: "PUT",
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    toast.success("Practice type updated successfully");
                    form.reset();
                    router.push("/admin/practice-types");
                } else {
                    toast.error("Failed to update practice type");
                }
            } else {
                // Handle form submission
                const response = await fetch("/api/miscellaneous/practice-types", {
                    method: "POST",
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    toast.success("Practice type added successfully");
                    form.reset();
                    router.push("/admin/practice-types");
                } else {
                    console.error("Failed to add practice type");
                    toast.error("Failed to add practice type");
                }
            }
        } catch (error) {
            console.error("Error in practice type:", error);
            toast.error("Error in practice type");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Name of the practice type" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="enabled"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Enabled</FormLabel>
                            <FormControl className="flex items-center space-x-2">
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormDescription>
                                Enabled or disabled
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Submitting..." : id ? "Update Practice Type" : "Add Practice Type"}
                </Button>
            </form>
        </Form>
    )
}