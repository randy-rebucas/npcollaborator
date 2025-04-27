'use client';

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation"
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
    emailOption: z.enum(["all", "selected"]),
    selectedEmails: z.string().optional().superRefine((val, ctx) => {
        if (!val && ctx.path[0] === "selectedEmails") return true;
        
        const emails = val?.split(',')
            .map(e => e.trim())
            .filter(e => e.length > 0);

        if (emails?.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "At least one email address is required",
            });
            return false;
        }

        const invalidEmails = (emails || []).filter(
            email => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        );

        if (invalidEmails.length > 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Invalid email(s): ${invalidEmails.join(", ")}`,
            });
            return false;
        }

        return true;
    }),
});

interface NotificationFormProps {
    id: string | null;
}

export default function NotificationSendForm({ id }: NotificationFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            emailOption: "all",
            selectedEmails: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            // Clean up emails before sending
            const cleanedValues = {
                ...values,
                selectedEmails: values.selectedEmails
                    ? values.selectedEmails
                        .split(',')
                        .map(e => e.trim())
                        .filter(e => e.length > 0)
                        .join(',')
                    : undefined
            };

            const response = await fetch(`/api/admin/notification/${id}/send`, {
                method: "POST",
                body: JSON.stringify(cleanedValues),
            });
            if (response.ok) {
                toast.success("Notification updated successfully");
                form.reset();
                router.push("/admin/notifications");
            } else {
                toast.error("Failed to update notification");
            }
        } catch (error) {
            console.error("Error in notification:", error);
            toast.error("Error in notification");
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="emailOption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Recipients</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="all" id="all" />
                                        <FormLabel htmlFor="all">Send to All Users</FormLabel>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="selected" id="selected" />
                                        <FormLabel htmlFor="selected">Send to Selected Users</FormLabel>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                        </FormItem>
                    )}
                />

                {form.watch("emailOption") === "selected" && (
                    <FormField
                        control={form.control}
                        name="selectedEmails"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Addresses</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter comma-separated email addresses..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Send Notification"}
                </Button>
            </form>
        </Form>
    );
}
