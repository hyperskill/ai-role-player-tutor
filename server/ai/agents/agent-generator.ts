import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { generateAgentPrompt } from '../prompts/generate-agent';
import type { Agent } from '~/server/types';

export async function generateAgent({ caseCard, language }: { caseCard: string; language: string }) {
	const { text } = await generateText({
		model: 'anthropic/claude-3-haiku',
		system: 'You are a persona-design assistant.',
		prompt: generateAgentPrompt(caseCard, language),
	});

	return text;
}

export async function generateAgentObject({ caseCard, language }: { caseCard: string; language: string }): Promise<Pick<Agent, 'name' | 'position' | 'prompt'>> {
	const agentSchema = z.object({
		name: z.string().describe('The name'),
		position: z.string().describe('The position'),
		prompt: z.string().describe('The prompt in markdown format that will instruct the agent to act as a persona in the case study'),
		language: z.string().toLowerCase().describe('The language'),
	});

	const { object } = await generateObject({
		model: 'anthropic/claude-3-haiku',
		system: 'You are a persona-design assistant.',
		prompt: generateAgentPrompt(caseCard, language),
		schema: agentSchema,
	});

	return object;
}
