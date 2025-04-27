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
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from "next-themes";
import { Checkbox } from "@/components/ui/checkbox";
const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    message: z.string().min(1, "Message is required").regex(/^[\s\S]*$/, {
        message: "Invalid HTML content",
    }),
    link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    autoSend: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface NotificationFormProps {
    id: string | null;
}

export default function NotificationForm({ id }: NotificationFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useTheme();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            link: "",
            message: "",
            autoSend: false,
        },
    });

    if (id) {
        const getNotification = async () => {
            const notification = await fetch(`/api/notification/${id}`)
            const data = await notification.json();
            form.setValue("title", data?.title || "");
            form.setValue("link", data?.link || "");
            form.setValue("message", data?.message || "");
            form.setValue("autoSend", data?.autoSend || false);
        }
        getNotification()
    }

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        try {
            if (id) {
                const response = await fetch(`/api/notification/${id}`, {
                    method: "PUT",
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    toast.success("Notification updated successfully");
                    form.reset();
                    router.push("/admin/notifications");
                } else {
                    toast.error("Failed to update notification");
                }
            } else {
                // Handle form submission
                const response = await fetch("/api/notification", {
                    method: "POST",
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    toast.success("Notification added successfully");
                    form.reset();
                    router.push("/admin/notifications");
                } else {
                    console.error("Failed to add notification");
                    toast.error("Failed to add notification");
                }
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
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter notification title..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Link</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter notification link..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Editor
                                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || ""}
                                    init={{
                                        height: 500,
                                        menubar: false,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'help', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | blocks | ' +
                                            'bold italic | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
                                        content_css: theme === 'dark' ? 'dark' : 'default',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                    }}
                                    value={field.value}
                                    onEditorChange={(content) => field.onChange(content)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="autoSend"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Auto Send</FormLabel>
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Submitting..." : id ? "Update Notification" : "Add Notification"}
                </Button>
            </form>
        </Form>
    );
}
