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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().min(2, "Description must be at least 2 characters"),
    status: z.enum(["pending", "resolved", "closed", "in_progress"])
}).required();

type FormValues = z.infer<typeof formSchema>;

const STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
    { value: "in_progress", label: "In Progress" },
];

interface IssueFormProps {
    id: string | null;
}

export default function IssueForm({ id }: IssueFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            status: "pending" as const,
        },
    });

    const getIssue = async () => {
        const issue = await fetch(`/api/admin/help/issues/${id}`);
        const data = await issue.json();

        form.setValue("title", data?.title);
        form.setValue("description", data?.description);
        form.setValue("status", data?.status);
    }
    
    if (id) {
        getIssue()
    }

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        try {
            if (id) {
                const response = await fetch(`/api/admin/help/issues/${id}`, {
                    method: "PUT",
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    toast.success("Issue updated successfully");
                    form.reset();
                    router.push("/admin/help/issues");
                } else {
                    toast.error("Failed to update issue");
                }
            } else {
                // Handle form submission
                const response = await fetch("/api/admin/help/issues", {
                    method: "POST",
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    toast.success("Issue added successfully");
                    form.reset();
                    router.push("/admin/help/issues");
                } else {
                    console.error("Failed to add issue");
                    toast.error("Failed to add issue");
                }
            }
        } catch (error) {
            console.error("Error in issue:", error);
            toast.error("Error in issue");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Name of the issue" {...field} />
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
                                <Textarea
                                    placeholder="Describe the issue"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                We&apos;ll use this description to respond to your issue.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {STATUS_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Please select the status of your issue
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Submitting..." : id ? "Update Issue" : "Add Issue"}
                </Button>
            </form>
        </Form>
    )
}