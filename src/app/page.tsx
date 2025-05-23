
"use client";

import UrlInputForm from "@/components/UrlInputForm";
import JobList from "@/components/JobList";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useJobContext } from "@/contexts/JobContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function HomePage() {
  const { jobs, isLoading, error } = useJobContext();

  return (
    <div className="space-y-8">
      <section aria-labelledby="job-url-input-heading">
        <h1 id="job-url-input-heading" className="sr-only">Enter Job List URL</h1>
        <UrlInputForm />
      </section>

      {isLoading && <LoadingSpinner />}
      
      {error && !isLoading && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && jobs.length > 0 && (
        <section aria-labelledby="job-listings-heading">
           <h2 id="job-listings-heading" className="sr-only">Job Listings</h2>
           <JobList jobs={jobs} />
        </section>
      )}
      
      {!isLoading && !error && jobs.length === 0 && (
         <div className="text-center py-10">
          <p className="text-muted-foreground text-lg">Enter a URL above to fetch and display job listings.</p>
        </div>
      )}
    </div>
  );
}
