
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { calculateQEA } from '@/lib/qea';
import type { Job } from '@/types/job';
import { BarChartBig, Wrench, GraduationCap, Award, Sparkles, Info } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { deriveQeaParameters, type DeriveQeaParametersInput } from '@/ai/flows/derive-qea-parameters-flow'; // Flow baru

// Skema baru untuk form validasi
const qeaFormSchema = z.object({
  skills: z.string().min(3, "Keahlian harus diisi, minimal 3 karakter.").default(""),
  major: z.string().min(3, "Jurusan harus diisi, minimal 3 karakter.").default(""),
  degree: z.string().min(2, "Gelar harus diisi, minimal 2 karakter.").default(""),
  benefits: z.string().min(10, "Deskripsi benefit yang diharapkan minimal 10 karakter.").default(""),
});

type QeaFormValues = z.infer<typeof qeaFormSchema>;

export default function QeaCalculatorPage() {
  const [qeaScore, setQeaScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<QeaFormValues>({
    resolver: zodResolver(qeaFormSchema),
    defaultValues: {
      skills: '',
      major: '',
      degree: '',
      benefits: '',
    },
  });

  const onSubmit: SubmitHandler<QeaFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setQeaScore(null);

    try {
      const derivedParamsInput: DeriveQeaParametersInput = {
        skills: data.skills,
        major: data.major,
        degree: data.degree,
        benefitsExpected: data.benefits, // Sesuaikan nama field dengan input schema flow
      };
      
      const derivedParams = await deriveQeaParameters(derivedParamsInput);

      const jobDataForQea: Job = {
        workLifeBalanceRating: derivedParams.workLifeBalanceRating,
        learningPrograms: derivedParams.learningPrograms,
        flexibleHours: derivedParams.flexibleHours,
        hasMentorship: derivedParams.hasMentorship,
        
        // Dummy values untuk field Job lainnya yang dibutuhkan oleh calculateQEA
        id: 0, 
        title: 'Profil Pengguna',
        company: 'N/A',
        location: 'N/A',
        workType: 'N/A', 
        salary: 0, 
        requiredSkills: data.skills.split(',').map(s => s.trim()), 
        industry: 'N/A', 
        description: 'Berdasarkan input pengguna.', 
        benefits: data.benefits.split(',').map(b => b.trim()), // Bisa juga dari input benefits
        workCulture: 'N/A',
      };

      const score = calculateQEA(jobDataForQea);
      setQeaScore(score);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal memproses permintaan.";
      console.error("QEA calculation error:", errorMessage);
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
            Kalkulator QEA Berbasis Profil
          </CardTitle>
          <CardDescription>
            Masukkan detail profil Anda untuk memperkirakan skor Quality of Employment Attributes (QEA) yang sesuai.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6 pt-6">
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-md"><Wrench className="h-5 w-5 text-muted-foreground" />Keahlian</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Contoh: Pemrograman Python, Analisis Data, Komunikasi Interpersonal" {...field} className="text-base min-h-[100px]" />
                    </FormControl>
                    <FormDescription>Jelaskan keahlian relevan yang Anda miliki.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="major"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-md"><GraduationCap className="h-5 w-5 text-muted-foreground" />Jurusan Kuliah</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Contoh: Teknik Informatika" {...field} className="text-base"/>
                    </FormControl>
                    <FormDescription>Apa jurusan kuliah Anda (jika ada)?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-md"><Award className="h-5 w-5 text-muted-foreground" />Gelar Akademis</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Contoh: S.Kom, S.E., M.B.A" {...field} className="text-base"/>
                    </FormControl>
                    <FormDescription>Apa gelar akademis terakhir Anda (jika ada)?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="benefits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-md"><Sparkles className="h-5 w-5 text-muted-foreground" />Benefit yang Diharapkan</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Contoh: Gaji di atas rata-rata, asuransi kesehatan keluarga, tunjangan transportasi, program pelatihan, jam kerja fleksibel." {...field} className="text-base min-h-[120px]" />
                    </FormControl>
                    <FormDescription>Sebutkan benefit atau fasilitas penting yang Anda harapkan dari sebuah pekerjaan.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-4 pt-6">
              <Button type="submit" className="w-full text-base py-3" disabled={isLoading}>
                {isLoading ? <LoadingSpinner /> : 'Hitung Skor QEA'}
              </Button>
              
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {qeaScore !== null && !isLoading && !error && (
                <Alert variant="default" className="mt-6 bg-primary/10 border-primary/30 rounded-lg p-6">
                   <BarChartBig className="h-6 w-6 text-primary" />
                  <AlertTitle className="font-semibold text-primary text-xl">Skor QEA Dihitung!</AlertTitle>
                  <AlertDescription className="text-2xl font-bold text-foreground mt-2">
                    Estimasi Skor QEA untuk profil Anda adalah: {qeaScore.toFixed(1)} / 100
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

    