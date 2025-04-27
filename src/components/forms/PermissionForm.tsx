"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(2, "Description must be at least 2 characters"),
    resource: z.string().min(2, "Resource must be at least 2 characters"),
});

export default function PermissionForm({ id }: { id: string | null }) { 
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            resource: "",
        },
    });

    useEffect(() => {
        const getPermission = async () => {
            if (id) {
                try {
                    const permission = await fetch(`/api/permissions/${id}`)
                    const data = await permission.json();
                    form.reset(data);
                } catch (error) {
                    console.error("Error fetching permission:", error);
                    toast.error("Failed to load permission data");
                }
            }
        }
        getPermission();
    }, [id, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            if (id) {
                const response = await fetch(`/api/permissions/${id}`, {
                    method: "PUT",
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    toast.success("Permission updated successfully");
                    form.reset();
                    router.push("/admin/permissions");
                } else {
                    toast.error("Failed to update permission");
                }
            } else {
                // Handle form submission
                const response = await fetch("/api/permissions", {
                    method: "POST",
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    toast.success("Permission added successfully");
                    form.reset();
                    router.push("/admin/permissions");
                } else {
                    console.error("Failed to add permission");
                    toast.error("Failed to add permission");
                }
            }
        } catch (error) {
            console.error("Error in permission:", error);
            toast.error("Error in permission");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Name of the permission" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Description of the permission" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="resource"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Resource</FormLabel>
                            <FormControl>
                                <Input placeholder="Resource of the permission" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Submitting..." : id ? "Update Permission" : "Add Permission"}
                </Button>
            </form>
        </Form>
    )
}