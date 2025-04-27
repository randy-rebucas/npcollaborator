"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Resolver } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner"
import { useApplicationSettings } from "@/providers/application-settings-provider";

type ValidationConfig =
  | { type: "url"; message: string }
  | { type: "min"; min: number; message: string }
  | { type: "boolean" };

const INITIAL_CONFIG = {
  siteName: {
    value: "",
    type: "string",
    label: "Site Name",
    description: "This is your site's name as it appears throughout the application.",
    placeholder: "My Application",
    validation: { type: "min", min: 2, message: "Site name must be at least 2 characters." } as ValidationConfig
  },
  siteDescription: {
    value: "",
    type: "string",
    label: "Site Description",
    description: "This description will be used for SEO and meta tags.",
    placeholder: "A brief description of your site",
    validation: { min: 2, message: "Site description must be at least 2 characters." } as ValidationConfig
  },
  siteUrl: {
    value: "",
    type: "string",
    label: "Site URL",
    description: "The base URL of your application.",
    placeholder: "https://example.com",
    validation: { type: "url", message: "Please enter a valid URL." } as ValidationConfig
  },
  siteLogo: {
    value: "",
    type: "string",
    label: "Site Logo URL",
    description: "The URL of your site's logo image.",
    placeholder: "https://example.com/logo.png",
    validation: { type: "url", message: "Please enter a valid URL." } as ValidationConfig
  },
  siteFavicon: {
    value: "",
    type: "string",
    label: "Site Favicon URL",
    description: "The URL of your site's favicon.",
    placeholder: "https://example.com/favicon.ico",
    validation: { type: "url", message: "Please enter a valid URL." } as ValidationConfig
  }
} as const;

const formSchema = z.object(
  Object.entries(INITIAL_CONFIG).reduce((acc, [key, config]) => {
    let validator;
    if (config.type === "string") {
      validator = config.validation.type === "url"
        ? z.string().url({ message: config.validation.message })
        : config.validation.type === "min"
          ? z.string().min(config.validation.min, { message: config.validation.message })
          : z.string();
    } else if (config.type === "boolean") {
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

export default function Application() {
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useApplicationSettings();

  const form = useForm<SiteConfig>({
    resolver: zodResolver(formSchema) as unknown as Resolver<SiteConfig>,
    defaultValues: {
      siteName: "",
      siteDescription: "",
      siteUrl: "",
      siteLogo: "",
      siteFavicon: ""
    },
  });

  useEffect(() => {
    form.setValue("siteName", settings.siteName || "");
    form.setValue("siteDescription", settings.siteDescription || "");
    form.setValue("siteUrl", settings.siteUrl || "");
    form.setValue("siteLogo", settings.siteLogo || "");
    form.setValue("siteFavicon", settings.siteFavicon || "");
  }, [form, settings]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const res = await fetch("/api/config", {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (res.ok) {
        toast.success("Configuration updated successfully");
      } else {
        toast.error("Failed to update configuration");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update configuration");
    } finally {
      setIsLoading(false);
    }
  }

  return (

    <Card>
      <CardHeader>
        <CardTitle>Application</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {Object.entries(INITIAL_CONFIG).map(([key, config]) => (
              <FormField
                key={key}
                control={form.control}
                name={key as keyof z.infer<typeof formSchema>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{config.label}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={config.placeholder as string}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {config.description}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
