
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
  const { jobs, isLoading: contextLoading, error: contextError, setJobs: setContextJobs, setIsLoading: setContextIsLoading, setError: setContextError } = useJobContext();
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
            setPageError(`Pekerjaan dengan ID ${jobId} tidak ditemukan dalam daftar saat ini.`);
          }
          setPageLoading(false);
        } else if (contextLoading) {
          // Tunggu jika konteks sedang dimuat
          return;
        }
         else {
          // Tidak ada pekerjaan di konteks, dan tidak ada URL untuk diambil (karena JSON dari backend)
           setPageError("Data pekerjaan tidak tersedia. Backend mungkin belum menyediakan data, atau pekerjaan tidak ditemukan.");
           setPageLoading(false);
        }
      } else {
        setPageError("ID pekerjaan tidak valid.");
        setPageLoading(false);
      }
    }
    loadJob();
  }, [jobId, jobs, contextLoading, setContextJobs, setContextIsLoading, setContextError]);


  if (pageLoading || contextLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
        <p className="mt-4 text-muted-foreground">Memuat detail pekerjaan...</p>
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
