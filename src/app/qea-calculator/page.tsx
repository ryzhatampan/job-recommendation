
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BarChartBig, Wrench, GraduationCap, Award, Sparkles, Info } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { deriveQeaParameters, type DeriveQeaParametersInput, type DeriveQeaParametersOutput } from '@/ai/flows/derive-qea-parameters-flow';

const qeaFormSchema = z.object({
  skills: z.string().min(3, "Keahlian harus diisi, minimal 3 karakter.").default(""),
  major: z.string().min(3, "Jurusan harus diisi, minimal 3 karakter.").default(""),
  degree: z.string().min(2, "Gelar harus diisi, minimal 2 karakter.").default(""),
  benefitsExpected: z.string().min(10, "Deskripsi benefit yang diharapkan minimal 10 karakter.").default(""), // Changed from benefits to benefitsExpected
});

type QeaFormValues = z.infer<typeof qeaFormSchema>;

export default function QeaCalculatorPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize useRouter

  const form = useForm<QeaFormValues>({
    resolver: zodResolver(qeaFormSchema),
    defaultValues: {
      skills: '',
      major: '',
      degree: '',
      benefitsExpected: '',
    },
  });

  const onSubmit: SubmitHandler<QeaFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const derivedParamsInput: DeriveQeaParametersInput = {
        skills: data.skills,
        major: data.major,
        degree: data.degree,
        benefitsExpected: data.benefitsExpected,
      };
      
      const derivedParams: DeriveQeaParametersOutput = await deriveQeaParameters(derivedParamsInput);

      // Construct query string for navigation
      const queryParams = new URLSearchParams({
        pref_wlb: derivedParams.workLifeBalanceRating.toString(),
        pref_lp: derivedParams.learningPrograms.toString(),
        pref_fh: derivedParams.flexibleHours.toString(),
        pref_hm: derivedParams.hasMentorship.toString(),
      });

      router.push(`/jobs?${queryParams.toString()}`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal memproses permintaan.";
      console.error("QEA derivation or navigation error:", errorMessage);
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
            Kalkulator Preferensi Karir (QEA)
          </CardTitle>
          <CardDescription>
            Masukkan detail profil Anda. Kami akan menganalisisnya untuk menemukan pekerjaan yang paling sesuai dengan preferensi Quality of Employment Attributes (QEA) Anda.
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
                name="benefitsExpected" // Changed from benefits to benefitsExpected
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
                {isLoading ? <LoadingSpinner /> : 'Temukan Pekerjaan Sesuai Profil'}
              </Button>
              
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {/* QEA Score display removed from here */}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
