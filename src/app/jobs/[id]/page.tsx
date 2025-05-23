
"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useJobContext } from '@/contexts/JobContext';
import type { Job } from '@/types/job';
import JobDetail from '@/components/JobDetail';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const { jobs, isLoading: contextLoading, error: contextError, jobListUrl, setJobListUrl, setJobs: setContextJobs, setIsLoading: setContextIsLoading, setError: setContextError } = useJobContext();
  const [job, setJob] = useState<Job | null>(null);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    async function loadJob() {
      setPageLoading(true);
      setPageError(null);

      if (jobId) {
        if (jobs.length > 0) {
          const foundJob = jobs.find(j => j.id.toString() === jobId);
          if (foundJob) {
            setJob(foundJob);
          } else {
            setPageError(`Job with ID ${jobId} not found in the current list.`);
          }
          setPageLoading(false);
        } else if (jobListUrl) {
          // Attempt to refetch if context is empty but URL exists (e.g. direct navigation)
          setContextIsLoading(true);
          try {
            const response = await fetch(jobListUrl);
            if (!response.ok) throw new Error(`Failed to fetch job list: ${response.statusText}`);
            const data = await response.json();
            setContextJobs(data.jobs || []); // Assuming data.jobs is the array
            const foundJob = (data.jobs || []).find((j: Job) => j.id.toString() === jobId);
            if (foundJob) {
              setJob(foundJob);
            } else {
              setPageError(`Job with ID ${jobId} not found after refetching.`);
            }
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error fetching job list.";
            setPageError(msg);
            setContextError(msg);
          } finally {
            setContextIsLoading(false);
            setPageLoading(false);
          }
        } else {
          // No jobs in context and no URL to fetch from
           setPageError("No job data available. Please go to the homepage and fetch a job list first.");
           setPageLoading(false);
        }
      } else {
        setPageError("Invalid job ID.");
        setPageLoading(false);
      }
    }
    loadJob();
  }, [jobId, jobs, jobListUrl, setContextJobs, setContextIsLoading, setContextError]);


  if (pageLoading || contextLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
        <p className="mt-4 text-muted-foreground">Loading job details...</p>
      </div>
    );
  }

  if (pageError || contextError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{pageError || contextError}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go to Homepage
        </Button>
      </div>
    );
  }
  
  if (!job) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Alert className="max-w-md">
          <AlertTitle>Job Not Found</AlertTitle>
          <AlertDescription>The requested job could not be found.</AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go to Homepage
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => router.back()} variant="outline" className="mb-6 self-start">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
      </Button>
      <JobDetail job={job} />
    </div>
  );
}
