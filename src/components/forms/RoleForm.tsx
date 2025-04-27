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
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
    name: z.string().min(1, "Role name is required"),
    description: z.string().min(1, "Description is required"),
    permissions: z.array(z.string()).min(1, "At least one permission must be selected"),
});

interface Permission {
    id: string;
    name: string;
    description: string;
    resource?: string;
}

export default function RoleForm({ id }: { id: string | null }) {
    const router = useRouter();
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            permissions: [],
        },
    });

    useEffect(() => {
        if (id) {
            const fetchRole = async () => {
                const role = await fetch(`/api/roles/${id}`);
                const data = await role.json();
                form.reset(data);
            }
            fetchRole();
        }
    }, [id, form]);

    useEffect(() => {
        const fetchPermissions = async () => {
            setIsLoadingPermissions(true);
            try {
                const response = await fetch("/api/permissions");
                if (!response.ok) {
                    throw new Error("Failed to fetch permissions");
                }
                const data = await response.json();
                setPermissions(data);
            } catch (error) {
                console.error("Error fetching permissions:", error);
                toast.error("Error fetching permissions");
            } finally {
                setIsLoadingPermissions(false);
            }
        };
        fetchPermissions();
    }, []);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            if (id) {
                const response = await fetch(`/api/roles/${id}`, {
                    method: "PUT",
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    toast.success("Role updated successfully");
                    form.reset();
                    router.push("/admin/roles");
                } else {
                    toast.error("Failed to update role");
                }
            } else {
                // Handle form submission
                const response = await fetch("/api/roles", {
                    method: "POST",
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    toast.success("Role added successfully");
                    form.reset();
                    router.push("/admin/roles");
                } else {
                    console.error("Failed to add role");
                    toast.error("Failed to add role");
                }
            }
        } catch (error) {
            console.error("Error in role:", error);
            toast.error("Error in role");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Role Details</h2>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name of the role" {...field} />
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
                                    <Input placeholder="Description of the role" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="permissions"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel className="text-lg font-semibold">Permissions</FormLabel>
                                {isLoadingPermissions && <div>Loading permissions...</div>}
                            </div>
                            <FormControl>
                                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4">
                                    {Object.entries(
                                        permissions.reduce((acc, permission) => {
                                            const resource = permission.resource;
                                            return {
                                                ...acc,
                                                [resource || 'Other']: [...(acc[resource || 'Other'] || []), permission],
                                            };
                                        }, {} as Record<string, Permission[]>)
                                    ).map(([resource, resourcePermissions]) => (
                                        <div key={resource} className="border rounded-lg p-4">
                                            <h3 className="font-medium mb-3 capitalize">{resource}</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                {resourcePermissions.map((permission, index) => {
                                                    return (<div key={index} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            checked={field.value?.includes(permission.name)}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    field.onChange([...field.value, permission.name]);
                                                                } else {
                                                                    field.onChange(field.value?.filter((value) => value !== permission.name));
                                                                }
                                                            }}
                                                        />
                                                        <div className="space-y-1">
                                                            <label
                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                title={permission.description}
                                                            >
                                                                {permission.name}
                                                            </label>
                                                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                                                        </div>
                                                    </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading || isLoadingPermissions} className="w-full">
                    {isLoading ? "Saving..." : id ? "Update Role" : "Create Role"}
                </Button>
            </form>
        </Form>
    )
}