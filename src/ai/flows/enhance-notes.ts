// src/ai/flows/enhance-notes.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for enhancing user-provided notes on a book by suggesting insightful questions or discussion prompts.
 *
 * - enhanceNotes - The main function to trigger the note enhancement flow.
 * - EnhanceNotesInput - The expected input schema for the enhanceNotes function.
 * - EnhanceNotesOutput - The structure of the output returned by the enhanceNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceNotesInputSchema = z.object({
  notes: z
    .string()
    .describe('The user-provided notes on a book to be enhanced.'),
  bookTitle: z.string().describe('The title of the book the notes are about.'),
});
export type EnhanceNotesInput = z.infer<typeof EnhanceNotesInputSchema>;

const EnhanceNotesOutputSchema = z.object({
  suggestedQuestions: z
    .array(z.string())
    .describe(
      'A list of insightful questions or discussion prompts based on the user notes.'
    ),
});
export type EnhanceNotesOutput = z.infer<typeof EnhanceNotesOutputSchema>;

export async function enhanceNotes(input: EnhanceNotesInput): Promise<EnhanceNotesOutput> {
  return enhanceNotesFlow(input);
}

const enhanceNotesPrompt = ai.definePrompt({
  name: 'enhanceNotesPrompt',
  input: {schema: EnhanceNotesInputSchema},
  output: {schema: EnhanceNotesOutputSchema},
  prompt: `You are an AI assistant designed to help readers engage more deeply with books.

  Based on the user's notes for the book "{{bookTitle}}", suggest a few insightful questions or discussion prompts that encourage deeper thinking about the text.

  User Notes: {{{notes}}}

  Consider suggesting questions that:
  * Explore the themes of the book.
  * Analyze the characters' motivations.
  * Discuss the author's writing style.
  * Relate the book to broader social or historical contexts.
  * Prompt reflection on the reader's own experiences and perspectives.

  Please provide the questions or prompts in a numbered list.
  `,
});

const enhanceNotesFlow = ai.defineFlow(
  {
    name: 'enhanceNotesFlow',
    inputSchema: EnhanceNotesInputSchema,
    outputSchema: EnhanceNotesOutputSchema,
  },
  async input => {
    const {output} = await enhanceNotesPrompt(input);
    return output!;
  }
);
