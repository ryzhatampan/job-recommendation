
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { calculateQEA } from '@/lib/qea';
import type { Job } from '@/types/job';
import { BarChartBig, CheckCircle, Lightbulb, Users, Watch } from 'lucide-react';

// Schema for form validation
const qeaFormSchema = z.object({
  workLifeBalanceRating: z.coerce
    .number()
    .min(0, "Rating must be at least 0")
    .max(5, "Rating must be at most 5")
    .default(3),
  learningPrograms: z.boolean().default(false),
  flexibleHours: z.boolean().default(false),
  hasMentorship: z.boolean().default(false),
});

type QeaFormValues = z.infer<typeof qeaFormSchema>;

export default function QeaCalculatorPage() {
  const [qeaScore, setQeaScore] = useState<number | null>(null);

  const form = useForm<QeaFormValues>({
    resolver: zodResolver(qeaFormSchema),
    defaultValues: {
      workLifeBalanceRating: 3,
      learningPrograms: false,
      flexibleHours: false,
      hasMentorship: false,
    },
  });

  const onSubmit: SubmitHandler<QeaFormValues> = (data) => {
    // Create a Job object compatible with calculateQEA
    // calculateQEA expects a full Job object. We provide dummy values for fields not used in QEA calculation.
    const jobDataForQea: Job = {
      // Fields from form input, used by calculateQEA
      workLifeBalanceRating: data.workLifeBalanceRating,
      learningPrograms: data.learningPrograms,
      flexibleHours: data.flexibleHours,
      hasMentorship: data.hasMentorship,
      
      // Dummy values for other required Job fields to satisfy the type
      id: 0, 
      title: 'User Input Job',
      company: 'User Company',
      location: 'N/A',
      workType: 'N/A', 
      salary: 0, 
      requiredSkills: [], 
      industry: 'N/A', 
      description: 'N/A', 
      benefits: [],
      workCulture: 'N/A',
      // careerPath is optional, so it can be omitted
      // agePreference is optional
    };

    const score = calculateQEA(jobDataForQea);
    setQeaScore(score);
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card className="shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-card">
          <CardTitle className="text-2xl flex items-center gap-3">
            <BarChartBig className="h-7 w-7 text-primary" />
            Kalkulator Skor QEA
          </CardTitle>
          <CardDescription>
            Masukkan detail berikut untuk menghitung skor Quality of Employment Attributes (QEA).
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6 pt-6">
              <FormField
                control={form.control}
                name="workLifeBalanceRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-md"><Watch className="h-5 w-5 text-muted-foreground" />Peringkat Keseimbangan Kehidupan Kerja (0-5)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="contoh: 4.2" {...field} className="text-base"/>
                    </FormControl>
                    <FormDescription>Beri peringkat keseimbangan kehidupan kerja dari skala 0 hingga 5.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="learningPrograms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2"><Lightbulb className="h-5 w-5 text-muted-foreground" />Menawarkan Program Pembelajaran</FormLabel>
                      <FormDescription>Apakah kesempatan ini menyediakan program pembelajaran atau pengembangan?</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} aria-label="Offers learning programs"/>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="flexibleHours"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2"><CheckCircle className="h-5 w-5 text-muted-foreground" />Menawarkan Jam Kerja Fleksibel</FormLabel>
                      <FormDescription>Apakah kesempatan ini menawarkan jam kerja yang fleksibel?</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} aria-label="Offers flexible hours"/>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasMentorship"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2"><Users className="h-5 w-5 text-muted-foreground" />Menawarkan Program Mentorship</FormLabel>
                      <FormDescription>Apakah program mentorship tersedia?</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} aria-label="Offers mentorship programs"/>
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-4 pt-6">
              <Button type="submit" className="w-full text-base py-3" disabled={form.formState.isSubmitting}>
                Hitung Skor QEA
              </Button>
              {qeaScore !== null && (
                <Alert variant="default" className="mt-6 bg-primary/10 border-primary/30 rounded-lg p-6">
                   <BarChartBig className="h-6 w-6 text-primary" />
                  <AlertTitle className="font-semibold text-primary text-xl">Skor QEA Dihitung!</AlertTitle>
                  <AlertDescription className="text-2xl font-bold text-foreground mt-2">
                    Skor QEA yang dihitung adalah: {qeaScore.toFixed(1)} / 100
                  </AlertDescription>
                </Alert>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
