import { requireAuth } from '~/server/utils/requireAuth';
import { requireProSubscription } from '~/server/utils/requireProSubscription';
import { serverSupabaseClient } from '#supabase/server';
import type { Agent } from '~/server/types';

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);

	// Ensure user has Pro subscription for agent editing
	await requireProSubscription(event, user);

	const agentId = getRouterParam(event, 'id');
	const body = await readBody(event);

	if (!agentId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Agent ID is required',
		});
	}

	const supabase = await serverSupabaseClient<{
		agents: Agent;
	}>(event);

	// Verify agent ownership
	const { data: existingAgent, error: fetchError } = await supabase
		.from('agents')
		.select('user_id')
		.eq('id', agentId)
		.single();

	if (fetchError || !existingAgent) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Agent not found',
		});
	}

	if (existingAgent.user_id !== user.id) {
		throw createError({
			statusCode: 403,
			statusMessage: 'You do not have permission to edit this agent',
		});
	}

	// Update agent
	const { data: updatedAgent, error: updateError } = await supabase
		.from('agents')
		.update({
			name: body.name,
			position: body.position,
			prompt: body.prompt,
		})
		.eq('id', agentId)
		.eq('user_id', user.id) // Additional security check
		.select()
		.single();

	if (updateError) {
		console.error('Error updating agent:', updateError);
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to update agent',
		});
	}

	return updatedAgent;
});
