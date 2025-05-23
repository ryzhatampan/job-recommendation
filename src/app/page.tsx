
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
      {/* Bagian UrlInputForm dihapus */}

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
          <p className="text-muted-foreground text-lg">Tidak ada daftar pekerjaan untuk ditampilkan. Backend akan menyediakan data.</p>
        </div>
      )}
    </div>
  );
}
