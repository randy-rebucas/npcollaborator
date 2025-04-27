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

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    code: z.string().min(1, "Code is required"),
    content: z.string().min(1, "Content is required").regex(/^[\s\S]*$/, {
        message: "Invalid HTML content",
    }),
});

interface TemplateFormProps {
    id: string | null;
}

export default function TemplateForm({ id }: TemplateFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useTheme();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            code: "",
            content: "",
        },
    });

    if (id) {
        const getTemplate = async () => {
            const template = await fetch(`/api/template/${id}`)
            const data = await template.json();
            form.setValue("name", data?.name || "");
            form.setValue("code", data?.code || "");
            form.setValue("content", data?.content || "");
        }
        getTemplate()
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            if (id) {
                const response = await fetch(`/api/template/${id}`, {
                    method: "PUT",
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    toast.success("Template updated successfully");
                    form.reset();
                    router.push("/admin/templates");
                } else {
                    toast.error("Failed to update template");
                }
            } else {
                // Handle form submission
                const response = await fetch("/api/template", {
                    method: "POST",
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    toast.success("Template added successfully");
                    form.reset();
                    router.push("/admin/templates");
                } else {
                    console.error("Failed to add template");
                    toast.error("Failed to add template");
                }
            }
        } catch (error) {
            console.error("Error in template:", error);
            toast.error("Error in template");
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
                                <Input placeholder="Enter template name..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter template code..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
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

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Submitting..." : id ? "Update Template" : "Add Template"}
                </Button>
            </form>
        </Form>
    );
}
