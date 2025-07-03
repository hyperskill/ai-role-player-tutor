import { generateObject } from 'ai';
import { z } from 'zod';
import { generatePersonaPrompt } from '../prompts/generate-persona';
import type { Agent } from '~/server/types';

export async function generatePersona({ caseCard }: { caseCard: string }) {
	const { object } = await generateObject({
		model: 'gpt-4o-mini',
		prompt: generatePersonaPrompt(caseCard),
		schema: z.object({
			persona: z.string().describe('The persona script'),
		}),
	});

	return object;
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
