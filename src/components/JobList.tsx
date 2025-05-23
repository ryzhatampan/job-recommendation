
"use client";

import type { Job } from '@/types/job';
import JobCard from './JobCard';
import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface JobListProps {
  jobs: Job[]; // Expects jobs that might have personalizedQeaScore
}

type SortKey = "qeaScore" | "salary" | "title" | "company";

export default function JobList({ jobs }: JobListProps) {
  const [sortKey, setSortKey] = useState<SortKey>("qeaScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => {
      let valA: string | number | undefined;
      let valB: string | number | undefined;

      switch (sortKey) {
        case "qeaScore":
          // Prioritize personalizedQeaScore if available, otherwise fallback to generic qeaScore
          valA = a.personalizedQeaScore ?? a.qeaScore;
          valB = b.personalizedQeaScore ?? b.qeaScore;
          break;
        case "salary":
          valA = a.salary;
          valB = b.salary;
          break;
        case "title":
          valA = a.title.toLowerCase();
          valB = b.title.toLowerCase();
          break;
        case "company":
          valA = a.company.toLowerCase();
          valB = b.company.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (valA === undefined && valB === undefined) return 0;
      if (valA === undefined) return sortOrder === 'asc' ? 1 : -1; // Push undefined to the end for asc, beginning for desc
      if (valB === undefined) return sortOrder === 'asc' ? -1 : 1;

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [jobs, sortKey, sortOrder]);

  if (jobs.length === 0) {
    // Message will be handled by the parent page (JobsPage)
    return null; 
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-card rounded-lg shadow">
        <h2 className="text-2xl font-semibold">Available Jobs ({jobs.length})</h2>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Label htmlFor="sort-key" className="text-sm">Sort by:</Label>
            <Select value={sortKey} onValueChange={(value) => setSortKey(value as SortKey)}>
              <SelectTrigger id="sort-key" className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qeaScore">QEA Score</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="company">Company</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
             <Label htmlFor="sort-order" className="text-sm">Order:</Label>
            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
              <SelectTrigger id="sort-order" className="w-[120px]">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
