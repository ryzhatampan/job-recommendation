'use server';
/**
 * @fileOverview A Gen Z job summarizer AI agent.
 *
 * - genZJobSummary - A function that handles the job summary process.
 * - GenZJobSummaryInput - The input type for the genZJobSummary function.
 * - GenZJobSummaryOutput - The return type for the genZJobSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenZJobSummaryInputSchema = z.object({
  title: z.string().describe('The title of the job.'),
  company: z.string().describe('The company offering the job.'),
  location: z.string().describe('The location of the job.'),
  workType: z.string().describe('The type of work (e.g., remote, hybrid, on-site).'),
  salary: z.number().describe('The salary offered for the job.'),
  benefits: z.array(z.string()).describe('A list of benefits offered with the job.'),
  workCulture: z.string().describe('The work culture of the company.'),
  learningPrograms: z.boolean().describe('Whether the company offers learning programs.'),
});
export type GenZJobSummaryInput = z.infer<typeof GenZJobSummaryInputSchema>;

const GenZJobSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the job, tailored to Gen Z interests.'),
});
export type GenZJobSummaryOutput = z.infer<typeof GenZJobSummaryOutputSchema>;

export async function genZJobSummary(input: GenZJobSummaryInput): Promise<GenZJobSummaryOutput> {
  return genZJobSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'genZJobSummaryPrompt',
  input: {schema: GenZJobSummaryInputSchema},
  output: {schema: GenZJobSummaryOutputSchema},
  prompt: `You are a career advisor specializing in advising Gen Z job seekers. You will receive details about a job and will provide a summary highlighting aspects that are most appealing to Gen Z, such as work-life balance, opportunities for growth, company culture, and benefits.

Job Title: {{{title}}}
Company: {{{company}}}
Location: {{{location}}}
Work Type: {{{workType}}}
Salary: {{{salary}}}
Benefits: {{#each benefits}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Work Culture: {{{workCulture}}}
Learning Programs: {{#if learningPrograms}}Yes{{else}}No{{/if}}

Provide a concise summary (around 100 words) that emphasizes the elements of this job that would be most attractive to a Gen Z audience. Focus on aspects like work-life balance, opportunities for growth and learning, company culture, and any unique benefits or perks. Be enthusiastic and encouraging. Be sure to mention the salary.
`,
});

const genZJobSummaryFlow = ai.defineFlow(
  {
    name: 'genZJobSummaryFlow',
    inputSchema: GenZJobSummaryInputSchema,
    outputSchema: GenZJobSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
