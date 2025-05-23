
"use client";

import JobList from "@/components/JobList";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useJobContext } from "@/contexts/JobContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function HomePage() {
  const { jobs, isLoading, error } = useJobContext();

  return (
    <div className="space-y-8">
      {isLoading && (
        <div className="flex flex-col items-center justify-center pt-10">
          <LoadingSpinner />
          <p className="mt-4 text-muted-foreground">Memuat daftar pekerjaan...</p>
        </div>
      )}
      
      {error && !isLoading && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Memuat Pekerjaan</AlertTitle>
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
          <p className="text-muted-foreground text-lg">Tidak ada daftar pekerjaan untuk ditampilkan. Pastikan file `/public/data/jobs.json` ada dan berisi data pekerjaan yang valid.</p>
        </div>
      )}
    </div>
  );
}
