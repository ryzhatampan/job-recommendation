
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Briefcase, Calculator, Lightbulb, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/70 via-primary/50 to-background py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
            Temukan Karir Impianmu Bersama FutureGen!
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-3xl mx-auto">
            Panduan karir AI untuk Generasi Z. Analisis profilmu, dapatkan rekomendasi pekerjaan cerdas, dan hitung potensi Quality of Employment Attributes (QEA) untuk masa depanmu.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-transform hover:scale-105">
              <Link href="/jobs">
                Jelajahi Lowongan <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-background/80 hover:bg-background text-foreground shadow-lg transition-transform hover:scale-105">
              <Link href="/qea-calculator">
                Hitung Skor QEA <Calculator className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Placeholder Image Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="relative aspect-video max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden group">
            <Image
              src="https://placehold.co/1200x675.png"
              alt="Aplikasi FutureGen Career Guide sedang digunakan"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 group-hover:scale-105"
              data-ai-hint="career guidance app interface"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h2 className="text-2xl md:text-3xl font-semibold">Karir Generasi Baru, Teknologi Terkini</h2>
              <p className="text-sm md:text-base">Visualisasikan langkah karirmu dengan alat bantu AI kami.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">Fitur Unggulan Kami</h2>
            <p className="text-md md:text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
              Dirancang khusus untuk membantu kamu mengambil keputusan karir yang lebih baik.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Briefcase className="h-10 w-10 text-primary" />}
              title="Pencarian Kerja Cerdas"
              description="Temukan lowongan yang paling sesuai dengan profil dan aspirasi karirmu menggunakan teknologi AI terkini."
              link="/jobs"
              linkLabel="Lihat Lowongan"
            />
            <FeatureCard
              icon={<Calculator className="h-10 w-10 text-primary" />}
              title="Kalkulator QEA Profil"
              description="Masukkan profilmu (keahlian, jurusan, dll.) dan dapatkan estimasi skor Quality of Employment Attributes."
              link="/qea-calculator"
              linkLabel="Hitung QEA"
            />
            <FeatureCard
              icon={<Sparkles className="h-10 w-10 text-primary" />}
              title="Ringkasan Pekerjaan Gen Z"
              description="Dapatkan ringkasan pekerjaan yang to-the-point dan menyoroti aspek penting bagi Gen Z, ditenagai oleh AI."
              link="/jobs/1" // Example link to a job detail page
              linkLabel="Contoh Ringkasan"
            />
          </div>
        </div>
      </section>

       {/* Call to Action Section */}
       <section className="py-16 md:py-24 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-6">
            Siap Memulai Perjalanan Karirmu?
          </h2>
          <p className="text-md md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Jangan tunda lagi. Ambil langkah pertama menuju karir yang kamu impikan bersama FutureGen Career Guide.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-transform hover:scale-105 px-10 py-6 text-lg">
            <Link href="/jobs">
              Mulai Sekarang <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkLabel: string;
}

function FeatureCard({ icon, title, description, link, linkLabel }: FeatureCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card">
      <CardHeader className="items-center text-center">
        <div className="p-4 bg-primary/20 rounded-full mb-4">
          {icon}
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow text-center">
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <div className="p-6 pt-0 text-center">
        <Button asChild variant="link" className="text-primary hover:text-primary/80">
          <Link href={link}>
            {linkLabel} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
