import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { generateStudyCasePrompt } from '../prompts/generate-study-case';
import type { Case } from '~/server/types';

export async function generateStudyCase({ domain }: { domain: string }) {
	const { text } = await generateText({
		model: 'gpt-4o-mini',
		prompt: generateStudyCasePrompt(domain),
	});

	return text;
}

export async function generateStudyCaseObject(studyCase: string): Promise<Pick<Case, 'description' | 'difficulty' | 'story' | 'title' | 'criteria_outcomes'>> {
	const criteriaOutcomesSchema = z.object({
		prioritization_skill: z.object({
			description: z.string().describe('The prioritization skill description'),
			negative_feedback: z.string().describe('The prioritization skill negative feedback'),
			positive_feedback: z.string().describe('The prioritization skill positive feedback'),
		}),
		stakeholder_management: z.object({
			description: z.string().describe('The stakeholder management description'),
			negative_feedback: z.string().describe('The stakeholder management negative feedback'),
			positive_feedback: z.string().describe('The stakeholder management positive feedback'),
		}),
		technical_team_leadership: z.object({
			description: z.string().describe('The technical team leadership description'),
			negative_feedback: z.string().describe('The technical team leadership negative feedback'),
			positive_feedback: z.string().describe('The technical team leadership positive feedback'),
		}),
	});

	const { object } = await generateObject({
		model: 'gpt-4o-mini',
		prompt: studyCase,
		schema: z.object({
			description: z.string().describe('The description'),
			difficulty: z.number().describe('The difficulty'),
			story: z.string().describe('The story'),
			title: z.string().describe('The title'),
			criteria_outcomes: criteriaOutcomesSchema,
		}),
	});

	return object;
}
