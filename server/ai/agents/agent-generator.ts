import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { generatePersonaPrompt } from '../prompts/generate-agent';
import type { Agent } from '~/server/types';

export async function generatePersona({ caseCard }: { caseCard: string }) {
	const { text } = await generateText({
		model: 'gpt-4o-mini',
		prompt: generatePersonaPrompt(caseCard),
	});

	return text;
}

export async function generatePersonaObject(persona: string): Promise<Pick<Agent, 'name' | 'position' | 'prompt'>> {
	const personaSchema = z.object({
		name: z.string().describe('The name'),
		position: z.string().describe('The position'),
		prompt: z.string().describe('The prompt'),
	});

	const { object } = await generateObject({
		model: 'gpt-4o-mini',
		prompt: persona,
		schema: personaSchema,
	});

	return object;
}
