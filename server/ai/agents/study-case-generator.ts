import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { generateStudyCasePrompt } from '../prompts/generate-study-case';
import type { Case } from '~/server/types';

export async function generateStudyCase({ domain, language }: { domain: string; language: string }) {
	const { text } = await generateText({
		model: 'anthropic/claude-3-haiku',
		system: 'You are a case-design assistant for leadership assessments. Your job is to create structured, text-only case scenarios for evaluating junior and middle-level team leads or project managers using live dialogue-based exercises.',
		prompt: generateStudyCasePrompt(domain, language),
	});

	return text;
}

export async function generateStudyCaseObject(domain: string, language: string): Promise<Pick<Case, 'description' | 'difficulty' | 'story' | 'title' | 'criteria_outcomes' | 'slug' | 'tags'>> {
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
		model: 'anthropic/claude-3-haiku',
		system: 'You are a case-design assistant for leadership assessments. Your job is to create structured, text-only case scenarios for evaluating junior and middle-level team leads or project managers using live dialogue-based exercises.',
		prompt: generateStudyCasePrompt(domain, language),
		schema: z.object({
			description: z.string().describe('The description in 1-2 sentences for promotion purposes'),
			difficulty: z.number().describe('The difficulty from 1 to 3 (1 - easy, 2 - medium, 3 - hard)'),
			story: z.string().describe('The case card in markdown format, with the following sections: "Scenario", "Background", "Objectives", "Constraints", "Stakeholders", "Criteria"'),
			title: z.string().describe('The title in 1-3 words'),
			criteria_outcomes: criteriaOutcomesSchema,
			slug: z.string().describe('The slug in lowercase formed from the title'),
			tags: z.array(z.string().toLowerCase()).min(1).max(3).describe('The tags describing the Study Case'),
			language: z.string().describe('The output language'),
		}),
	});

	return object;
}
