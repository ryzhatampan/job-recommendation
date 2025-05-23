
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useToast } from "@/hooks/use-toast";
import { useJobContext } from "@/contexts/JobContext";
import type { JobListResponse, Job } from "@/types/job";
import { calculateQEA } from "@/lib/qea";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const FormSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
});

interface UrlInputFormProps {
  onFetchStart?: () => void;
  onFetchSuccess?: (jobs: Job[]) => void;
  onFetchError?: (error: string) => void;
}

export default function UrlInputForm({ onFetchStart, onFetchSuccess, onFetchError }: UrlInputFormProps) {
  const { setJobs, setJobListUrl, setIsLoading, setError: setGlobalError } = useJobContext();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setGlobalError(null);
    setJobs([]);
    if (onFetchStart) onFetchStart();

    try {
      const response = await fetch(data.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      const jsonData: JobListResponse = await response.json();
      
      if (!jsonData.jobs || !Array.isArray(jsonData.jobs)) {
        throw new Error("Invalid JSON format: 'jobs' array not found.");
      }

      const jobsWithQEA = jsonData.jobs.map(job => ({
        ...job,
        qeaScore: calculateQEA(job),
      }));

      setJobs(jobsWithQEA);
      setJobListUrl(data.url);
      toast({
        title: "Success",
        description: `Fetched ${jobsWithQEA.length} jobs.`,
      });
      if (onFetchSuccess) onFetchSuccess(jobsWithQEA);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      console.error("Fetch error:", errorMessage);
      setGlobalError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error fetching jobs",
        description: errorMessage,
      });
      if (onFetchError) onFetchError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-lg shadow">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Job List JSON URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com/jobs.json" 
                  {...field} 
                  aria-describedby="url-form-message"
                />
              </FormControl>
              <FormMessage id="url-form-message" />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
          Fetch Jobs
        </Button>
        {form.formState.errors.url && (
           <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Input Error</AlertTitle>
            <AlertDescription>
              {form.formState.errors.url.message}
            </AlertDescription>
          </Alert>
        )}
      </form>
    </Form>
  );
}
