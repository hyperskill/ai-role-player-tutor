import { generateCaseAndAgentByDomain } from '~/server/ai/workflows/generate-case-and-agent-by-domain';
import { requireAuth } from '~/server/utils/requireAuth';
import { serverSupabaseServiceRole } from '#supabase/server';
import type { Agent, Case } from '~/server/types';

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);
	const { domain } = getQuery(event);

	if (!domain || typeof domain !== 'string') {
		throw createError({
			statusCode: 400,
			statusMessage: 'Domain is required',
		});
	}

	const caseGenerator = generateCaseAndAgentByDomain({ domain });
	// Generate case by domain
	const { value: caseValue } = await caseGenerator.next();
	console.log('Case generated');

	const supabase = serverSupabaseServiceRole<{
		cases: Case;
		agents: Agent;
	}>(event);

	// Store case to database
	const { data: caseData, error } = await supabase.from('cases')
		.insert(caseValue)
		.select()
		.single();

	if (error) {
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to store case',
		});
	}

	console.log('Case stored');

	// Generate persona
	const { value: generatedPersona } = await caseGenerator.next();
	console.log('Persona generated');
	// Store persona to database
	const { data: personaData, error: personaError } = await supabase.from('agents')
		.insert(generatedPersona)
		.select()
		.single();

	if (personaError) {
		// Delete created case
		supabase.from('cases')
			.delete()
			.eq('id', caseData.id);

		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to store persona',
		});
	}

	console.log('Persona stored');

	// Connect agent to case
	const { error: caseAgentError } = await supabase.from('cases')
		.update({
			agent_id: personaData.id,
			user_id: user.id,
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
