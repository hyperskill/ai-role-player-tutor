import { generateCaseAndAgentByDomain } from '~/server/ai/workflows/generate-case-and-agent-by-domain';
import { requireAuth } from '~/server/utils/requireAuth';
import { requireProSubscription } from '~/server/utils/requireProSubscription';
import { serverSupabaseServiceRole } from '#supabase/server';
import type { Agent, Case } from '~/server/types';

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);

	// Ensure user has Pro subscription for case creation
	await requireProSubscription(event, user);

	const { domain, language } = await readBody(event);

	if (!domain || typeof domain !== 'string') {
		throw createError({
			statusCode: 400,
			statusMessage: 'Domain is required',
		});
	}

	const caseGenerator = generateCaseAndAgentByDomain({ domain, language });
	// Generate case by domain
	const { value: caseValue } = await caseGenerator.next();
	console.log('Case generated');

	const supabase = serverSupabaseServiceRole<{
		cases: Case;
		agents: Agent;
	}>(event);

	// Store case to database with user_id and public by default
	const { data: caseData, error } = await supabase.from('cases')
		.insert({
			...caseValue,
			user_id: user.id,
		})
		.select()
		.single();

	if (error) {
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to store case',
		});
	}

	console.log('Case stored');

	// Generate agent
	const { value: generatedAgent } = await caseGenerator.next();
	console.log('Agent generated');
	// Store agent to database with user_id
	const { data: agentData, error: agentError } = await supabase.from('agents')
		.insert({
			...generatedAgent,
			user_id: user.id,
		})
		.select()
		.single();

	if (agentError) {
		// Delete created case
		supabase.from('cases')
			.delete()
			.eq('id', caseData.id);

		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to store agent',
		});
	}

	console.log('Agent stored');

	// Connect agent to case
	const { error: caseAgentError } = await supabase.from('cases')
		.update({
			agent: agentData.id,
		})
		.eq('id', caseData.id);

	if (caseAgentError) {
		// Delete created case
		await supabase.from('cases')
			.delete()
			.eq('id', caseData.id);

		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to connect agent to case',
		});
	}

	console.log('Agent connected to case');

	return {
		success: true,
		message: 'Case and agent generated successfully',
	};
});
