"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export default function CollaboratorForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            // Handle form submission
            const response = await fetch("/api/collaborators/invite", {
                method: "POST",
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Nurse Practitioner invited successfully");
                form.reset();
                router.push("/np/collaborators");
            } else {
                toast.error("Failed to invite Nurse Practitioner");
            }

        } catch (error) {
            console.error("Error in invite Nurse Practitioner:", error);
            toast.error("Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }

    if (!isMounted) {
        return null;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                                    <Input
                                        type="email"
                                        placeholder="practitioner@example.com"
                                        className="pl-10"
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormDescription>
                                The practitioner will receive an email with instructions to join.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="loading loading-spinner loading-sm mr-2"></span>
                            Sending Invitation...
                        </>
                    ) : (
                        "Send Invitation"
                    )}
                </Button>
            </form>
        </Form>
    );
}