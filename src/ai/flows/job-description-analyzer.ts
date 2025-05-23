// src/ai/flows/job-description-analyzer.ts
'use server';

/**
 * @fileOverview Analyzes a job description from a URL to extract key attributes.
 *
 * - analyzeJobDescription - A function that analyzes a job description from a URL.
 * - AnalyzeJobDescriptionInput - The input type for the analyzeJobDescription function.
 * - AnalyzeJobDescriptionOutput - The return type for the analyzeJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeJobDescriptionInputSchema = z.object({
  jobDescriptionUrl: z.string().describe('URL of the job description to analyze.'),
});
export type AnalyzeJobDescriptionInput = z.infer<typeof AnalyzeJobDescriptionInputSchema>;

const AnalyzeJobDescriptionOutputSchema = z.object({
  title: z.string().describe('The title of the job.'),
  company: z.string().describe('The company offering the job.'),
  location: z.string().describe('The location of the job.'),
  description: z.string().describe('A detailed description of the job.'),
  requiredSkills: z.array(z.string()).describe('A list of required skills for the job.'),
  industry: z.string().describe('The industry the job belongs to.'),
  workLifeBalanceRating: z.number().describe('A rating of the work-life balance offered by the job.'),
  benefits: z.array(z.string()).describe('A list of benefits offered by the job.'),
  workCulture: z.string().describe('The work culture at the company.'),
  learningPrograms: z.boolean().describe('Whether the company offers learning programs.'),
  hasMentorship: z.boolean().describe('Whether the company offers mentorship programs.'),
  flexibleHours: z.boolean().describe('Whether the job offers flexible hours.'),
});
export type AnalyzeJobDescriptionOutput = z.infer<typeof AnalyzeJobDescriptionOutputSchema>;

export async function analyzeJobDescription(input: AnalyzeJobDescriptionInput): Promise<AnalyzeJobDescriptionOutput> {
  return analyzeJobDescriptionFlow(input);
}

const analyzeJobDescriptionPrompt = ai.definePrompt({
  name: 'analyzeJobDescriptionPrompt',
  input: {schema: AnalyzeJobDescriptionInputSchema},
  output: {schema: AnalyzeJobDescriptionOutputSchema},
  prompt: `You are an AI job analyzer. Extract key attributes from the job description provided at the following URL: {{{jobDescriptionUrl}}}.\n\n    Return the job attributes as a JSON object with the following keys:\n    - title: The title of the job.\n    - company: The company offering the job.\n    - location: The location of the job.\n    - description: A detailed description of the job.\n    - requiredSkills: A list of required skills for the job.\n    - industry: The industry the job belongs to.\n    - workLifeBalanceRating: A rating of the work-life balance offered by the job.\n    - benefits: A list of benefits offered by the job.\n    - workCulture: The work culture at the company.\n    - learningPrograms: Whether the company offers learning programs (true/false).\n    - hasMentorship: Whether the company offers mentorship programs (true/false).\n    - flexibleHours: Whether the job offers flexible hours (true/false).`,
});

const analyzeJobDescriptionFlow = ai.defineFlow(
  {
    name: 'analyzeJobDescriptionFlow',
    inputSchema: AnalyzeJobDescriptionInputSchema,
    outputSchema: AnalyzeJobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await analyzeJobDescriptionPrompt(input);
    return output!;
  }
);
