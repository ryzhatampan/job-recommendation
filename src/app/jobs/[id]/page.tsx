
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
  const { jobs, isLoading: contextLoading, error: contextError } = useJobContext();
  const [job, setJob] = useState<Job | null>(null);
  const [pageLoading, setPageLoading] = useState<boolean>(true); // Page specific loading
  const [pageError, setPageError] = useState<string | null>(null); // Page specific error

  useEffect(() => {
    setPageLoading(true); // Always start loading when jobId or context changes
    setPageError(null);

    if (contextLoading) {
      // If context is still loading, wait for it.
      // JobDetail component will show its own loading state or the context's.
      return;
    }

    if (contextError) {
      setPageError(`Gagal memuat data pekerjaan: ${contextError}`);
      setPageLoading(false);
      return;
    }

    if (jobId && jobs.length > 0) {
      const foundJob = jobs.find(j => j.id.toString() === jobId);
      if (foundJob) {
        setJob(foundJob);
      } else {
        setPageError(`Pekerjaan dengan ID ${jobId} tidak ditemukan.`);
      }
    } else if (jobId && !contextLoading && jobs.length === 0 && !contextError) {
      // Context loaded, no jobs, and no error from context, means jobs.json might be empty or job not found.
      setPageError(`Tidak ada data pekerjaan yang tersedia, atau pekerjaan dengan ID ${jobId} tidak ditemukan.`);
    } else if (!jobId) {
      setPageError("ID pekerjaan tidak valid.");
    }
    setPageLoading(false);

  }, [jobId, jobs, contextLoading, contextError]);


  if (pageLoading || contextLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
        <p className="mt-4 text-muted-foreground">Memuat detail pekerjaan...</p>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{pageError}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Halaman Utama
        </Button>
      </div>
    );
  }
  
  if (!job) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Alert className="max-w-md">
          <AlertTitle>Pekerjaan Tidak Ditemukan</AlertTitle>
          <AlertDescription>Pekerjaan yang diminta tidak dapat ditemukan.</AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Halaman Utama
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => router.back()} variant="outline" className="mb-6 self-start">
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar
      </Button>
      <JobDetail job={job} />
    </div>
  );
}
