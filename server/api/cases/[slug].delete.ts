import { requireAuth } from '~/server/utils/requireAuth';
import { requireProSubscription } from '~/server/utils/requireProSubscription';
import { serverSupabaseClient } from '#supabase/server';
import type { Case, Agent } from '~/server/types';

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);

	// Ensure user has Pro subscription for case deletion
	await requireProSubscription(event, user);

	const slug = getRouterParam(event, 'slug');

	if (!slug) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Slug is required',
		});
	}

	const supabase = await serverSupabaseClient<{
		cases: Case;
		agents: Agent;
	}>(event);

	// Verify case ownership and get agent info
	const { data: existingCase, error: fetchError } = await supabase
		.from('cases')
		.select('user_id, agent, id')
		.eq('slug', slug)
		.single();

	if (fetchError || !existingCase) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Case not found',
		});
	}

	if (existingCase.user_id !== user.id) {
		throw createError({
			statusCode: 403,
			statusMessage: 'You do not have permission to delete this case',
		});
	}

	// Delete associated chats first (to maintain referential integrity)
	const { error: chatDeleteError } = await supabase
		.from('chats')
		.delete()
		.eq('case_id', existingCase.id);

	if (chatDeleteError) {
		console.error('Error deleting associated chats:', chatDeleteError);
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to delete associated chats',
		});
	}

	// Delete the case
	const { error: caseDeleteError } = await supabase
		.from('cases')
		.delete()
		.eq('id', existingCase.id)
		.eq('user_id', user.id); // Additional security check

	if (caseDeleteError) {
		console.error('Error deleting case:', caseDeleteError);
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to delete case',
		});
	}

	// Delete associated agent if it exists and belongs to this user
	if (existingCase.agent) {
		const { error: agentDeleteError } = await supabase
			.from('agents')
			.delete()
			.eq('id', existingCase.agent)
			.eq('user_id', user.id);

		if (agentDeleteError) {
			console.error('Error deleting associated agent:', agentDeleteError);
			// Don't throw error here as case is already deleted
		}
	}

	return { success: true, message: 'Case deleted successfully' };
});
