"use client";

import type { Job } from "@/types/job";
import { useEffect, useState } from "react";
import {
  genZJobSummary,
  type GenZJobSummaryInput,
} from "@/ai/flows/gen-z-job-summarizer";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import LoadingSpinner from "./LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

import {
  BarChart3 as BarChartBig,
  AlertCircle,
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  Brain,
  Zap,
  Smile,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Info, // ⬅️ dipakai untuk icon info
} from "lucide-react";

interface JobDetailProps {
  job: Job;
}

const DetailItem: React.FC<{
  icon: React.ElementType;
  label: string;
  value?: string | number | boolean | string[];
  className?: string;
}> = ({ icon: Icon, label, value, className }) => {
  if (
    value === undefined ||
    value === null ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return null;
  }

  let displayValue: React.ReactNode;
  if (typeof value === "boolean") {
    displayValue = value ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  } else if (Array.isArray(value)) {
    displayValue = (
      <div className="flex flex-wrap gap-2">
        {value.map((item, index) => (
          <Badge key={index} variant="secondary">
            {item}
          </Badge>
        ))}
      </div>
    );
  } else {
    displayValue = <span className="text-foreground">{value.toString()}</span>;
  }

  return (
    <div className={`py-3 ${className ?? ""}`}>
      <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4" />
        {label}
      </dt>
      <dd className="text-base">{displayValue}</dd>
    </div>
  );
};

export default function JobDetail({ job }: JobDetailProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      if (!job) return;
      setSummaryLoading(true);
      setSummaryError(null);
      try {
        const input: GenZJobSummaryInput = {
          title: job.title,
          company: job.company,
          location: job.location,
          workType: job.workType,
          salary: job.salary,
          benefits: job.benefits,
          workCulture: job.workCulture,
          learningPrograms: job.learningPrograms,
        };
        const result = await genZJobSummary(input);
        setSummary(result.summary);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate summary.";
        console.error("Summary generation error:", errorMessage);
        setSummaryError(errorMessage);
      } finally {
        setSummaryLoading(false);
      }
    }
    fetchSummary();
  }, [job]);

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">{job.title}</CardTitle>
        <CardDescription className="text-lg text-muted-foreground flex items-center gap-2 pt-1">
          <Briefcase className="h-5 w-5" /> {job.company}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Gen Z Summary */}
        <section aria-labelledby="gen-z-summary-heading">
          <h2
            id="gen-z-summary-heading"
            className="text-xl font-semibold mb-2 text-foreground flex items-center gap-2"
          >
            <Zap className="h-5 w-5" /> Gen Z Vibe Check
          </h2>

          {summaryLoading && <LoadingSpinner />}

          {summaryError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Summary Error</AlertTitle>
              <AlertDescription>{summaryError}</AlertDescription>
            </Alert>
          )}

          {summary && !summaryLoading && (
            <Alert variant="info" className="mt-2">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm leading-relaxed">
                {summary}
              </AlertDescription>
            </Alert>
          )}
        </section>

        <Separator />

        {/* Description */}
        <section aria-labelledby="job-description-heading">
          <h2
            id="job-description-heading"
            className="text-xl font-semibold mb-2 flex items-center gap-2"
          >
            <Briefcase className="h-5 w-5" /> Job Description
          </h2>
          <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {job.description}
          </p>
        </section>

        <Separator />

        {/* Details */}
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <DetailItem icon={MapPin} label="Location" value={job.location} />
          <DetailItem
            icon={DollarSign}
            label="Salary"
            value={
              typeof job.salary === "number"
                ? job.salary.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  })
                : job.salary || "Not specified"
            }
          />
          <DetailItem
            icon={Award}
            label="Work Type"
            value={job.workType}
            className="capitalize"
          />
          {job.qeaScore !== undefined && (
            <DetailItem
              icon={BarChartBig}
              label="QEA Score"
              value={`${job.qeaScore.toFixed(1)} / 100`}
            />
          )}
          <DetailItem icon={Users} label="Industry" value={job.industry} />
          <DetailItem
            icon={Smile}
            label="Work-Life Balance Rating"
            value={`${job.workLifeBalanceRating} / 5`}
          />
          <DetailItem
            icon={Brain}
            label="Learning Programs"
            value={job.learningPrograms}
          />
          <DetailItem
            icon={Users}
            label="Mentorship Available"
            value={job.hasMentorship}
          />
          <DetailItem
            icon={Clock}
            label="Flexible Hours"
            value={job.flexibleHours}
          />
        </dl>

        <Separator />

        <div className="space-y-3">
          <DetailItem
            icon={CheckCircle}
            label="Required Skills"
            value={job.requiredSkills}
          />
          <DetailItem icon={Award} label="Benefits" value={job.benefits} />
        </div>

        {job.careerPath && (
          <>
            <Separator />
            <section aria-labelledby="career-path-heading">
              <h2 id="career-path-heading" className="text-xl font-semibold mb-2">
                Career Path
              </h2>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium text-muted-foreground">
                    Next Role:
                  </span>{" "}
                  {job.careerPath.nextRole}
                </p>
                <p>
                  <span className="font-medium text-muted-foreground">
                    Timeframe:
                  </span>{" "}
                  {job.careerPath.timeframe}
                </p>
                <p>
                  <span className="font-medium text-muted-foreground">
                    Salary Increase:
                  </span>{" "}
                  {job.careerPath.salaryIncrease}%
                </p>
              </div>
            </section>
          </>
        )}
      </CardContent>
    </Card>
  );
}
