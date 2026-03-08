'use server';
/**
 * @fileOverview An AI agent that generates art concepts, themes, or starting prompts based on user input.
 *
 * - generativeArtInspiration - A function that handles the art inspiration generation process.
 * - GenerativeArtInspirationInput - The input type for the generativeArtInspiration function.
 * - GenerativeArtInspirationOutput - The return type for the generativeArtInspiration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerativeArtInspirationInputSchema = z.object({
  keywords: z
    .array(z.string())
    .describe('A list of keywords or moods to inspire art concepts.'),
});
export type GenerativeArtInspirationInput = z.infer<
  typeof GenerativeArtInspirationInputSchema
>;

const GenerativeArtInspirationOutputSchema = z.object({
  concept: z
    .string()
    .describe(
      'A creative and unique art concept based on the provided keywords.'
    ),
  theme: z.string().describe('An overarching theme for the artwork.'),
  prompt: z
    .string()
    .describe(
      'A detailed starting prompt for a drawing, including visual elements, style suggestions, and mood.'
    ),
});
export type GenerativeArtInspirationOutput = z.infer<
  typeof GenerativeArtInspirationOutputSchema
>;

export async function generativeArtInspiration(
  input: GenerativeArtInspirationInput
): Promise<GenerativeArtInspirationOutput> {
  return generativeArtInspirationFlow(input);
}

const artInspirationPrompt = ai.definePrompt({
  name: 'artInspirationPrompt',
  input: {schema: GenerativeArtInspirationInputSchema},
  output: {schema: GenerativeArtInspirationOutputSchema},
  prompt: `You are an AI assistant specialized in generating creative art concepts, themes, and drawing prompts.
Your goal is to help users overcome artist's block by providing inspiring ideas based on their input.

Generate a creative art concept, an overarching theme, and a detailed drawing prompt based on the following keywords or moods:

Keywords/Moods: {{#each keywords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Focus on generating unique and engaging ideas that blend the given keywords into a coherent artistic vision. The drawing prompt should be descriptive enough to spark imagination but also allow for artistic freedom.`,
});

const generativeArtInspirationFlow = ai.defineFlow(
  {
    name: 'generativeArtInspirationFlow',
    inputSchema: GenerativeArtInspirationInputSchema,
    outputSchema: GenerativeArtInspirationOutputSchema,
  },
  async input => {
    const {output} = await artInspirationPrompt(input);
    return output!;
  }
);
