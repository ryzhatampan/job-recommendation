
"use client";

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import JobList from "@/components/JobList";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useJobContext } from "@/contexts/JobContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { calculateQEA, type UserQeaPreferences } from "@/lib/qea";
import type { Job } from '@/types/job';

export default function JobsPage() {
  const { jobs: originalJobs, isLoading, error } = useJobContext();
  const searchParams = useSearchParams();

  const userPreferences = useMemo((): UserQeaPreferences | undefined => {
    const prefWLB = searchParams.get('pref_wlb');
    const prefLP = searchParams.get('pref_lp');
    const prefFH = searchParams.get('pref_fh');
    const prefHM = searchParams.get('pref_hm');

    if (prefWLB && prefLP && prefFH && prefHM) {
      return {
        workLifeBalanceRating: parseFloat(prefWLB),
        learningPrograms: prefLP === 'true',
        flexibleHours: prefFH === 'true',
        hasMentorship: prefHM === 'true',
      };
    }
    return undefined;
  }, [searchParams]);

  const processedJobs = useMemo(() => {
    if (!userPreferences) {
      // If no preferences, use original jobs (which have generic qeaScore)
      // and ensure personalizedQeaScore is explicitly undefined or same as qeaScore
      return originalJobs.map(job => ({...job, personalizedQeaScore: job.qeaScore}));
    }
    // If preferences exist, calculate personalized QEA score for each job
    return originalJobs.map(job => ({
      ...job,
      personalizedQeaScore: calculateQEA(job, userPreferences)
    }));
  }, [originalJobs, userPreferences]);
  
  const pageTitle = userPreferences 
    ? "Lowongan Pekerjaan Sesuai Profil Anda" 
    : "Daftar Lowongan Pekerjaan";

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-4 mb-8">
        {pageTitle}
      </h1>
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

      {!isLoading && !error && processedJobs.length > 0 && (
        <section aria-labelledby="job-listings-heading">
           <h2 id="job-listings-heading" className="sr-only">Job Listings</h2>
           <JobList jobs={processedJobs} />
        </section>
      )}
      
      {!isLoading && !error && processedJobs.length === 0 && (
         <div className="text-center py-10">
          <p className="text-muted-foreground text-lg">
            {userPreferences 
              ? "Tidak ada pekerjaan yang cocok dengan profil Anda saat ini."
              : "Tidak ada daftar pekerjaan untuk ditampilkan. Pastikan file `/public/data/jobs.json` ada dan berisi data pekerjaan yang valid."
            }
          </p>
        </div>
      )}
    </div>
  );
}
