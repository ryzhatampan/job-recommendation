
"use client";

import type { Job } from "@/types/job";
import React, { createContext, useState, useContext, type ReactNode } from "react";

interface JobContextType {
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  jobListUrl: string;
  setJobListUrl: (url: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobListUrl, setJobListUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <JobContext.Provider
      value={{
        jobs,
        setJobs,
        jobListUrl,
        setJobListUrl,
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
