
import Link from 'next/link';
import type { Job } from '@/types/job';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, DollarSign, BarChartBig, Sparkles } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const displayQeaScore = job.personalizedQeaScore ?? job.qeaScore;
  const qeaScoreLabel = job.personalizedQeaScore !== undefined ? "Personalized QEA" : "QEA Score";
  const QeaIcon = job.personalizedQeaScore !== undefined ? Sparkles : BarChartBig;


  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">{job.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-1">
          <Briefcase className="h-4 w-4 text-muted-foreground" /> {job.company}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <DollarSign className="h-4 w-4" />
          <span>{job.salary ? job.salary.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }) : 'Not specified'}</span>
        </div>
         {displayQeaScore !== undefined && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <QeaIcon className="h-4 w-4" />
            <span>{qeaScoreLabel}: <Badge variant="secondary">{displayQeaScore.toFixed(1)}</Badge></span>
          </div>
        )}
        <div>
          <Badge variant={job.workType === 'remote' ? 'default' : 'outline'} className="capitalize">
            {job.workType}
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/jobs/${job.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
