"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const submissionStatus = ["INCOMPLETE", "INCORRECT", "APPROVED", "REJECTED", "PENDING"];
// Define form schema
const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    role: z.string().optional(),
    submissionStatus: z.string().optional(),
    canCreateListings: z.boolean().optional(),
    metaData: z.array(z.object({
        key: z.string(),
        value: z.string()
    }))
})

export default function UserForm({ id }: { id: string | null }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Define form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            role: "",
            submissionStatus: "",
            canCreateListings: false,
            metaData: [{ key: "", value: "" }]

        },
    })

    // Add metadata field handler
    const addMetaDataField = () => {
        const currentMetaData = form.getValues("metaData")
        form.setValue("metaData", [...currentMetaData, { key: "", value: "" }])
    }

    // Remove metadata field handler
    const removeMetaDataField = (index: number) => {
        const currentMetaData = form.getValues("metaData")
        form.setValue("metaData", currentMetaData.filter((_, i) => i !== index))
    }

    // Submit handler
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {

            const response = await fetch(`/api/admin/users/${id}`, {
                method: "PUT",
                body: JSON.stringify({
                    ...values,
                    metaData: Object.fromEntries(values.metaData.map(item => [item.key, item.value]))
                }),
            });
            if (response.ok) {
                toast.success("User updated successfully");
                form.reset();
                router.push("/admin/users");
            } else {
                toast.error("Failed to update user");
            }
        } catch (error) {
            console.error("Error in user:", error);
            toast.error("Error in user");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            const getUser = async () => {
                const user = await fetch(`/api/user/${id}`)
                const data = await user.json();
                form.setValue("username", data?.username || "");
                form.setValue("email", data?.email || "");
                form.setValue("role", data?.role || "");
                form.setValue("submissionStatus", data?.submissionStatus || "");
                form.setValue("canCreateListings", data?.canCreateListings || false);
                form.setValue("metaData", Object.keys(data?.metaData || {}).map(key => ({ key, value: data?.metaData[key] })) || [{ key: "", value: "" }]);
            }
            getUser()

        }
    }, [id, form]);

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-foreground">Username</FormLabel>
                            <FormControl>
                                <Input placeholder="username" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the username of the user and its only editable if you are the owner of the account.
                            </FormDescription>
                            <FormMessage> {form.formState.errors.username?.message} </FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-foreground">Email</FormLabel>
                            <FormControl>
                                <Input placeholder="email" {...field} {...(id ? { readOnly: true } : {})} />
                            </FormControl>
                            <FormDescription>
                                This is the email of the user and its only editable if you are the owner of the account.
                            </FormDescription>
                            <FormMessage> {form.formState.errors.email?.message} </FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-foreground">Role</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="PHYSICIAN">Physician</SelectItem>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage> {form.formState.errors.role?.message} </FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="submissionStatus"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-foreground">Submission Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.values(submissionStatus).map((status) => (
                                        <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage> {form.formState.errors.submissionStatus?.message} </FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="canCreateListings"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-foreground gap-2">Can Create Listings</FormLabel>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* MetaData Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-foreground">Metadata</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addMetaDataField}
                        >
                            Add Field
                        </Button>
                    </div>

                    <div className="grid gap-4 p-4 border rounded-lg bg-background dark:bg-background">
                        {form.watch("metaData").map((_, index) => (
                            <div key={index} className="grid grid-cols-[1fr,1fr,auto] gap-4 items-end">
                                <FormField
                                    control={form.control}
                                    name={`metaData.${index}.key`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm">Key</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter key" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`metaData.${index}.value`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm">Value</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter value" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeMetaDataField(index)}
                                    className="h-10 w-10"
                                >
                                    <span className="sr-only">Remove field</span>
                                    ✕
                                </Button>
                            </div>
                        ))}

                        {form.watch("metaData").length === 0 && (
                            <div className="text-center py-4 text-muted-foreground dark:text-muted-foreground">
                                No metadata fields added
                            </div>
                        )}
                    </div>
                </div>
                <Button type="submit" disabled={isLoading}>{isLoading ? "Updating..." : "Update User"}</Button>
            </form>
        </Form>
    );
}