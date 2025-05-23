
"use client";

import type { Job, JobListResponse } from "@/types/job";
import React, { createContext, useState, useContext, type ReactNode, useEffect } from "react";
import { calculateQEA } from "@/lib/qea";

interface JobContextType {
  jobs: Job[];
  setJobs: (jobs: Job[]) => void; // Kept for potential future manual overrides, though not used by default fetch
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void; // Kept for potential future manual overrides
  error: string | null;
  setError: (error: string | null) => void; // Kept for potential future manual overrides
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/data/jobs.json'); // Fetch from the public path
        if (!response.ok) {
          throw new Error(`Failed to fetch job data: ${response.status} ${response.statusText}`);
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
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while fetching jobs.";
        console.error("Fetch error in JobContext:", errorMessage);
        setError(errorMessage);
        setJobs([]); // Clear jobs on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobs();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <JobContext.Provider
      value={{
        jobs,
        setJobs,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error("useJobContext must be used within a JobProvider");
  }
  return context;
};
