
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BarChartBig, SunMoon, BookOpen, Clock, Users, Info } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { UserQeaPreferences } from '@/lib/qea';


const qeaFormSchema = z.object({
  workLifeBalanceRating: z.number().min(0).max(5).default(3),
  learningPrograms: z.boolean().default(false),
  flexibleHours: z.boolean().default(false),
  hasMentorship: z.boolean().default(false),
});

type QeaFormValues = z.infer<typeof qeaFormSchema>;

export default function QeaCalculatorPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<QeaFormValues>({
    resolver: zodResolver(qeaFormSchema),
    defaultValues: {
      workLifeBalanceRating: 3,
      learningPrograms: false,
      flexibleHours: false,
      hasMentorship: false,
    },
  });

  const onSubmit: SubmitHandler<QeaFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const userPreferences: UserQeaPreferences = {
        workLifeBalanceRating: data.workLifeBalanceRating,
        learningPrograms: data.learningPrograms,
        flexibleHours: data.flexibleHours,
        hasMentorship: data.hasMentorship,
      };
      
      const queryParams = new URLSearchParams({
        pref_wlb: userPreferences.workLifeBalanceRating.toString(),
        pref_lp: userPreferences.learningPrograms.toString(),
        pref_fh: userPreferences.flexibleHours.toString(),
        pref_hm: userPreferences.hasMentorship.toString(),
      });

      router.push(`/jobs?${queryParams.toString()}`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal memproses permintaan.";
      console.error("QEA preference submission or navigation error:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card className="shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-card">
          <CardTitle className="text-2xl flex items-center gap-3">
            <BarChartBig className="h-7 w-7 text-primary" />
            Filter Lowongan Berdasarkan Preferensi QEA
          </CardTitle>
          <CardDescription>
            Atur preferensi Quality of Employment Attributes (QEA) Anda. Kami akan menampilkan lowongan yang paling sesuai.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-8 pt-6">
              <FormField
                control={form.control}
                name="workLifeBalanceRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-md"><SunMoon className="h-5 w-5 text-muted-foreground" />Keseimbangan Kerja-Hidup ({field.value}/5)</FormLabel>
                    <FormControl>
                        <Slider
                            defaultValue={[field.value]}
                            min={0}
                            max={5}
                            step={0.5}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="py-2"
                        />
                    </FormControl>
                    <FormDescription>Seberapa penting keseimbangan antara pekerjaan dan kehidupan pribadi bagi Anda?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="learningPrograms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel className="text-md flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                            Program Pembelajaran
                        </FormLabel>
                        <FormDescription>
                            Apakah Anda mencari perusahaan dengan program pengembangan diri atau pelatihan?
                        </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="flexibleHours"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                     <div className="space-y-0.5">
                        <FormLabel className="text-md flex items-center gap-2">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            Jam Kerja Fleksibel
                        </FormLabel>
                        <FormDescription>
                           Apakah Anda menginginkan opsi jam kerja yang fleksibel?
                        </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hasMentorship"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel className="text-md flex items-center gap-2">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            Program Mentorship
                        </FormLabel>
                        <FormDescription>
                            Apakah Anda mencari perusahaan yang menyediakan program mentorship?
                        </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />

            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-4 pt-6">
              <Button type="submit" className="w-full text-base py-3" disabled={isLoading}>
                {isLoading ? <LoadingSpinner /> : 'Terapkan Preferensi & Cari Lowongan'}
              </Button>
              
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
