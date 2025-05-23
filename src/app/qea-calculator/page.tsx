
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'; // Removed FormLabel, FormDescription
import { Label } from '@/components/ui/label'; // Added Label
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BarChartBig, SunMoon, BookOpen, Clock, Users, Info, GraduationCap, Lightbulb, Briefcase, ArrowRight, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { UserQeaPreferences } from '@/lib/qea';

// Schema untuk Step 2
const qeaPreferencesSchema = z.object({
  workLifeBalanceRating: z.number().min(0).max(5).default(3),
  learningPrograms: z.boolean().default(false),
  flexibleHours: z.boolean().default(false),
  hasMentorship: z.boolean().default(false),
});

type QeaPreferencesFormValues = z.infer<typeof qeaPreferencesSchema>;

// Data untuk Step 1
interface UserProfileData {
  major: string;
  degree: string;
  skills: string; // Skills dipisahkan koma
}

const majorOptions = [
  { value: "teknik-informatika", label: "Teknik Informatika" },
  { value: "sistem-informasi", label: "Sistem Informasi" },
  { value: "manajemen", label: "Manajemen Bisnis" },
  { value: "akuntansi", label: "Akuntansi" },
  { value: "ilmu-komunikasi", label: "Ilmu Komunikasi" },
  { value: "desain-komunikasi-visual", label: "Desain Komunikasi Visual" },
  { value: "psikologi", label: "Psikologi" },
  { value: "teknik-elektro", label: "Teknik Elektro" },
  { value: "teknik-mesin", label: "Teknik Mesin" },
  { value: "sastra-inggris", label: "Sastra Inggris" },
  { value: "lainnya", label: "Lainnya" },
];

const degreeOptions = [
  { value: "sma-smk", label: "SMA/SMK Sederajat" },
  { value: "d3", label: "D3 - Ahli Madya" },
  { value: "s1", label: "S1 - Sarjana" },
  { value: "s2", label: "S2 - Magister" },
  { value: "s3", label: "S3 - Doktor" },
];


export default function QeaCalculatorPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [userProfile, setUserProfile] = useState<Partial<UserProfileData>>({});
  const [profileError, setProfileError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Error untuk Step 2
  const router = useRouter();

  const formStep2 = useForm<QeaPreferencesFormValues>({
    resolver: zodResolver(qeaPreferencesSchema),
    defaultValues: {
      workLifeBalanceRating: 3,
      learningPrograms: false,
      flexibleHours: false,
      hasMentorship: false,
    },
  });

  const handleNextStep = () => {
    if (!userProfile.major || !userProfile.degree || !userProfile.skills) {
      setProfileError("Harap lengkapi semua field di Step 1.");
      return;
    }
    setProfileError(null);
    setCurrentStep(2);
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
  };

  const onSubmitPreferences: SubmitHandler<QeaPreferencesFormValues> = async (dataStep2) => {
    setIsLoading(true);
    setError(null);

    try {
      const finalPreferences: UserQeaPreferences = {
        workLifeBalanceRating: dataStep2.workLifeBalanceRating,
        learningPrograms: dataStep2.learningPrograms,
        flexibleHours: dataStep2.flexibleHours,
        hasMentorship: dataStep2.hasMentorship,
      };
      
      const queryParams = new URLSearchParams({
        // Data dari Step 1
        major: userProfile.major || '',
        degree: userProfile.degree || '',
        skills: userProfile.skills || '',
        // Data dari Step 2
        pref_wlb: finalPreferences.workLifeBalanceRating.toString(),
        pref_lp: finalPreferences.learningPrograms.toString(),
        pref_fh: finalPreferences.flexibleHours.toString(),
        pref_hm: finalPreferences.hasMentorship.toString(),
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
        {currentStep === 1 && (
          <>
            <CardHeader className="bg-card">
              <CardTitle className="text-2xl flex items-center gap-3">
                <GraduationCap className="h-7 w-7 text-primary" />
                Step 1: Profil Anda
              </CardTitle>
              <CardDescription>
                Lengkapi profil Anda untuk membantu kami menemukan preferensi yang sesuai.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <FormItem>
                <Label className="flex items-center gap-2 text-md"><Briefcase className="h-5 w-5 text-muted-foreground" />Jurusan Kuliah</Label>
                <Select
                  onValueChange={(value) => setUserProfile(prev => ({ ...prev, major: value }))}
                  defaultValue={userProfile.major}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jurusan kuliah Anda" />
                  </SelectTrigger>
                  <SelectContent>
                    {majorOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Jurusan yang Anda tempuh atau telah selesaikan.</p>
              </FormItem>

              <FormItem>
                <Label className="flex items-center gap-2 text-md"><GraduationCap className="h-5 w-5 text-muted-foreground" />Gelar Sarjana</Label>
                 <Select
                  onValueChange={(value) => setUserProfile(prev => ({ ...prev, degree: value }))}
                  defaultValue={userProfile.degree}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih gelar sarjana Anda" />
                  </SelectTrigger>
                  <SelectContent>
                    {degreeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Gelar akademis tertinggi yang Anda miliki.</p>
              </FormItem>

              <FormItem>
                <Label className="flex items-center gap-2 text-md"><Lightbulb className="h-5 w-5 text-muted-foreground" />Keahlian</Label>
                  <Input
                    placeholder="Contoh: UI/UX Design, Public Speaking, Data Analysis"
                    value={userProfile.skills || ''}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, skills: e.target.value }))}
                  />
                <p className="text-sm text-muted-foreground">Masukkan keahlian yang Anda kuasai, pisahkan dengan koma.</p>
              </FormItem>

              {profileError && (
                <Alert variant="destructive" className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Validasi Gagal</AlertTitle>
                  <AlertDescription>{profileError}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-end pt-6">
              <Button onClick={handleNextStep} className="text-base py-3">
                Lanjut ke Step 2 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}

        {currentStep === 2 && (
          <Form {...formStep2}>
            <form onSubmit={formStep2.handleSubmit(onSubmitPreferences)}>
              <CardHeader className="bg-card">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <BarChartBig className="h-7 w-7 text-primary" />
                  Step 2: Preferensi QEA Anda
                </CardTitle>
                <CardDescription>
                  Atur preferensi Quality of Employment Attributes (QEA) Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-6">
                <FormField
                  control={formStep2.control}
                  name="workLifeBalanceRating"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="flex items-center gap-2 text-md"><SunMoon className="h-5 w-5 text-muted-foreground" />Keseimbangan Kerja-Hidup ({field.value}/5)</Label>
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
                      <p className="text-sm text-muted-foreground">Seberapa penting keseimbangan antara pekerjaan dan kehidupan pribadi bagi Anda?</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formStep2.control}
                  name="learningPrograms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                          <Label className="text-md flex items-center gap-2">
                              <BookOpen className="h-5 w-5 text-muted-foreground" />
                              Program Pembelajaran
                          </Label>
                          <p className="text-sm text-muted-foreground">
                              Apakah Anda mencari perusahaan dengan program pengembangan diri atau pelatihan?
                          </p>
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
                  control={formStep2.control}
                  name="flexibleHours"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                       <div className="space-y-0.5">
                          <Label className="text-md flex items-center gap-2">
                              <Clock className="h-5 w-5 text-muted-foreground" />
                              Jam Kerja Fleksibel
                          </Label>
                          <p className="text-sm text-muted-foreground">
                             Apakah Anda menginginkan opsi jam kerja yang fleksibel?
                          </p>
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
                  control={formStep2.control}
                  name="hasMentorship"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                          <Label className="text-md flex items-center gap-2">
                              <Users className="h-5 w-5 text-muted-foreground" />
                              Program Mentorship
                          </Label>
                          <p className="text-sm text-muted-foreground">
                              Apakah Anda mencari perusahaan yang menyediakan program mentorship?
                          </p>
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
                <div className="flex justify-between w-full">
                  <Button type="button" variant="outline" onClick={handlePreviousStep} className="text-base py-3">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Step 1
                  </Button>
                  <Button type="submit" className="text-base py-3" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner /> : 'Terapkan Preferensi & Cari Lowongan'}
                  </Button>
                </div>
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
        )}
      </Card>
    </div>
  );
}

    