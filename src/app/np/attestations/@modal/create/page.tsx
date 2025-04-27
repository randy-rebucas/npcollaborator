'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormField
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import NextModal from "@/components/NextModal" 
import { toast } from 'sonner';

// Define the schema using zod
const formSchema = z.object({
  stateRequirements: z.enum(['Yes', 'No']),
  meetings: z.enum(['Yes', 'No', 'Other']),
  lastMeetingDate: z.string().nonempty('Date is required'),
  numberOfPatients: z.string().regex(/^\d+$/, 'Must be a number'),
});

export default function CreateAttestationModal() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stateRequirements: "No",
      meetings: "No",
      lastMeetingDate: "",
      numberOfPatients: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/attestations", {
        method: "POST",
        body: JSON.stringify(values),
      });
      if (response.ok) {
        toast.success("Attestation submitted successfully");
        form.reset();
        router.push("/np/attestations");
      } else {
        console.error("Failed to submit report");
        toast.error("Failed to submit attestation");
      }
    } catch (error) {
      console.error("Error in attestation:", error);
      toast.error("Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <NextModal>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Monthly Attestation</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="stateRequirements" render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>
                  1. Have you referred to the &apos;State Requirements&apos; for FL in which you are currently in this active collaborative relationship?
                </FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1">
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Yes" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Yes
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="No" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        No
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
            />

            <FormField control={form.control} name="meetings" render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>
                  2. Can you attest to having completed any &apos;Virtual Meetings&apos;, &apos;In-Person Meetings&apos;, or required communication as per the state guidelines provided for you or collaboration protocol this month?
                </FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1">
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Yes" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Yes
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="No" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        No
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Other" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Other
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
            />

            <FormField control={form.control} name="lastMeetingDate" render={({ field }) => (
              <FormItem>
                <FormLabel>3. Date of last meeting with your collaborator?</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
            />

            <FormField control={form.control} name="numberOfPatients" render={({ field }) => (
              <FormItem>
                <FormLabel>4. What is the estimated number of patients that you saw this month?</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter number of patients" {...field} />
                </FormControl>
              </FormItem>
            )}
            />

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </NextModal>
  );
}

