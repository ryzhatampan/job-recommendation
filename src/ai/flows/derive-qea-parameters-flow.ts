
'use server';
/**
 * @fileOverview A flow to derive QEA (Quality of Employment Attributes) parameters
 * from user profile data like skills, major, degree, and expected benefits.
 *
 * - deriveQeaParameters - A function that handles the derivation process.
 * - DeriveQeaParametersInput - The input type for the deriveQeaParameters function.
 * - DeriveQeaParametersOutput - The return type for the deriveQeaParameters function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DeriveQeaParametersInputSchema = z.object({
  skills: z.string().describe('Keahlian yang dimiliki pengguna, bisa berupa daftar atau deskripsi.'),
  major: z.string().describe('Jurusan kuliah pengguna.'),
  degree: z.string().describe('Gelar akademis pengguna.'),
  benefitsExpected: z.string().describe('Deskripsi benefit atau fasilitas yang diharapkan pengguna dari pekerjaan.'),
});
export type DeriveQeaParametersInput = z.infer<typeof DeriveQeaParametersInputSchema>;

const DeriveQeaParametersOutputSchema = z.object({
  workLifeBalanceRating: z.number().min(0).max(5).describe('Estimasi peringkat keseimbangan kehidupan kerja (0-5) berdasarkan input. Pertimbangkan apakah benefit atau keahlian menyiratkan tekanan tinggi atau fleksibilitas.'),
  learningPrograms: z.boolean().describe('Estimasi apakah program pembelajaran atau pengembangan kemungkinan tersedia (true/false). Cari kata kunci dalam benefit seperti "pelatihan", "kursus", "pengembangan", "sertifikasi".'),
  flexibleHours: z.boolean().describe('Estimasi apakah jam kerja fleksibel kemungkinan ditawarkan (true/false). Cari kata kunci dalam benefit seperti "jadwal fleksibel", "opsi remote", "otonomi", "WFH".'),
  hasMentorship: z.boolean().describe('Estimasi apakah program mentorship kemungkinan tersedia (true/false). Cari kata kunci dalam benefit seperti "mentorship", "bimbingan karir", "coaching".'),
});
export type DeriveQeaParametersOutput = z.infer<typeof DeriveQeaParametersOutputSchema>;

export async function deriveQeaParameters(input: DeriveQeaParametersInput): Promise<DeriveQeaParametersOutput> {
  return deriveQeaParametersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'deriveQeaParametersPrompt',
  input: {schema: DeriveQeaParametersInputSchema},
  output: {schema: DeriveQeaParametersOutputSchema},
  prompt: `Anda adalah seorang analis karir AI yang ahli. Tugas Anda adalah untuk memperkirakan beberapa atribut kualitas pekerjaan (Quality of Employment Attributes - QEA) berdasarkan profil pengguna.
Profil Pengguna:
- Keahlian: {{{skills}}}
- Jurusan Kuliah: {{{major}}}
- Gelar Akademis: {{{degree}}}
- Benefit yang Diharapkan: {{{benefitsExpected}}}

Berdasarkan informasi di atas, berikan estimasi untuk atribut-atribut berikut. Jawab HANYA dalam format JSON yang valid sesuai dengan skema output yang diminta.

Pertimbangan untuk estimasi:
- workLifeBalanceRating: Berikan angka antara 0 (sangat buruk) hingga 5 (sangat baik). Pertimbangkan apakah benefit seperti "jam kerja fleksibel", "cuti tidak terbatas", atau keahlian yang menyiratkan tekanan tinggi (misalnya, "manajemen krisis") mempengaruhinya. Jika tidak ada informasi relevan, berikan nilai tengah seperti 2.5 atau 3.
- learningPrograms: Jika benefit menyebutkan "pelatihan", "kursus", "pengembangan profesional", "sertifikasi", atau sejenisnya, set ke true. Jika tidak, set ke false.
- flexibleHours: Jika benefit menyebutkan "jam kerja fleksibel", "remote", "WFH", "hybrid", atau "otonomi jadwal", set ke true. Jika tidak, set ke false.
- hasMentorship: Jika benefit menyebutkan "program mentorship", "bimbingan karir", "coaching", atau dukungan pengembangan karir personal, set ke true. Jika tidak, set ke false.

Pastikan output Anda adalah objek JSON tunggal yang valid tanpa teks tambahan sebelum atau sesudahnya.
`,
});

const deriveQeaParametersFlow = ai.defineFlow(
  {
    name: 'deriveQeaParametersFlow',
    inputSchema: DeriveQeaParametersInputSchema,
    outputSchema: DeriveQeaParametersOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate QEA parameters.");
    }
    // Default values if AI fails for some specific fields, though Zod schema should catch this during parsing.
    // This is more of a fallback if AI returns a structurally valid JSON but with missing fields not caught by Zod (unlikely with strict schema).
    return {
        workLifeBalanceRating: output.workLifeBalanceRating ?? 3, // Default to neutral if missing
        learningPrograms: output.learningPrograms ?? false,
        flexibleHours: output.flexibleHours ?? false,
        hasMentorship: output.hasMentorship ?? false,
    };
  }
);

    