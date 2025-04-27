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
    question: z.string().min(1, "Question is required"),
    answer: z.string().min(1, "Answer is required").regex(/^[\s\S]*$/, {
        message: "Invalid HTML content",
    }),
});

interface FaqFormProps {
    id: string | null;
}

export default function FaqForm({ id }: FaqFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useTheme();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: "",
            answer: "",
        },
    });

    if (id) {
        const getFaq = async () => {
            const faq = await fetch(`/api/faq/${id}`)
            const data = await faq.json();
            form.setValue("question", data?.question || "");
            form.setValue("answer", data?.answer || "");
        }
        getFaq()
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            if (id) {
                const response = await fetch(`/api/faq/${id}`, {
                    method: "PUT",
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    toast.success("Faq updated successfully");
                    form.reset();
                    router.push("/admin/faq");
                } else {
                    toast.error("Failed to update faq");
                }
            } else {
                // Handle form submission
                const response = await fetch("/api/faq", {
                    method: "POST",
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    toast.success("Faq added successfully");
                    form.reset();
                    router.push("/admin/faq");
                } else {
                    console.error("Failed to add faq");
                    toast.error("Failed to add faq");
                }
            }
        } catch (error) {
            console.error("Error in faq:", error);
            toast.error("Error");
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Question</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter FAQ question..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="answer"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Answer</FormLabel>
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
                    {isLoading ? "Submitting..." : id ? "Update Faq" : "Add Faq"}
                </Button>
            </form>
        </Form>
    );
}
