"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"
import { useEffect, useState } from "react";
import { useSession } from "@/providers/logto-session-provider";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2)
    .max(30)
    .refine(
      async (username) => {
        const response = await fetch(`/api/user/validate?username=${username}`);
        return response.ok;
      },
      { message: "Username is already taken" }
    ),
  email: z
    .string()
    .email()
    .refine(
      async (email) => {
        const response = await fetch(`/api/user/validate?email=${email}`);
        return response.ok;
      },
      { message: "Email is already in use" }
    ),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function Profile() {
  const { claims } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      email: ""
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (claims?.sub) {
      const fetchUser = async () => {
        const response = await fetch(`/api/user/${claims.sub}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const userData = await response.json();
        form.setValue("username", userData.username);
        form.setValue("email", userData.primaryEmail);
      }
      fetchUser();
    }
  }, [form, claims]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {

      const response = await fetch(`/api/user/${claims.sub}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  }

  return (

    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
