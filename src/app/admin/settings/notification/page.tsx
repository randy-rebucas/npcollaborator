"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"
import { FormControl, FormDescription, FormItem, FormLabel } from "@/components/ui/form";
import { FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

type ValidationConfig =
  | { type: "url"; message: string }
  | { type: "min"; min: number; message: string }
  | { type: "boolean" };

const INITIAL_CONFIG = {
  emailNotifications: {
    value: false,
    type: "boolean",
    label: "Email Notifications",
    description: "Receive email notifications for important updates.",
    placeholder: false,
    validation: { type: "boolean" } as ValidationConfig
  },
  pushNotifications: {
    value: false,
    type: "boolean",
    label: "Push Notifications",
    description: "Receive push notifications for important updates.",
    placeholder: false,
    validation: { type: "boolean" } as ValidationConfig
  },
  marketingEmails: {
    value: false,
    type: "boolean",
    label: "Marketing Emails",
    description: "Receive marketing emails for important updates.",
    placeholder: false,
    validation: { type: "boolean" } as ValidationConfig
  },
  securityAlerts: {
    value: true,
    type: "boolean",
    label: "Security Alerts",
    description: "Receive security alerts for important updates.",
    placeholder: true,
    validation: { type: "boolean" } as ValidationConfig
  },
  maintenanceMode: {
    value: false,
    type: "boolean",
    label: "Maintenance Mode",
    description: "Put the application in maintenance mode.",
    placeholder: false,
    validation: { type: "boolean" }
  }
} as const;

const formSchema = z.object(
  Object.entries(INITIAL_CONFIG).reduce((acc, [key, config]) => {
    let validator;
    if (config.type === "boolean") {
      validator = z.boolean().default(false);
    }
    return { ...acc, [key]: validator! };
  }, {})
);

type SiteConfig = {
  [K in keyof typeof INITIAL_CONFIG]: typeof INITIAL_CONFIG[K]["type"] extends "boolean"
  ? boolean
  : string;
};

export default function Notification() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SiteConfig>({
    resolver: zodResolver(formSchema) as unknown as Resolver<SiteConfig>,
    defaultValues: {
      emailNotifications: false,
      pushNotifications: false,
      marketingEmails: false,
      securityAlerts: true,
      maintenanceMode: false,
    },
  });

  useEffect(() => {
    fetch("/api/config").then(res => res.json()).then(data => {
      form.setValue("emailNotifications", data.emailNotifications || false);
      form.setValue("pushNotifications", data.pushNotifications || false);
      form.setValue("marketingEmails", data.marketingEmails || false);
      form.setValue("securityAlerts", data.securityAlerts || true);
      form.setValue("maintenanceMode", data.maintenanceMode || false);
    })
  }, [form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (res.ok) {
        toast.success("Notification settings updated successfully");
      } else {
        toast.error("Failed to update notification settings");
      }
    } catch (error) {
      console.error("Error in user:", error);
      toast.error("Failed to update notification settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {Object.entries(INITIAL_CONFIG).map(([key, config]) => (
              config.type === "boolean" ? (
                <FormField
                  key={key}
                  control={form.control}
                  name={key as keyof z.infer<typeof formSchema>}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {config.label}
                        </FormLabel>
                        <FormDescription>
                          {config.description}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          id={key}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ) : null
            ))}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
