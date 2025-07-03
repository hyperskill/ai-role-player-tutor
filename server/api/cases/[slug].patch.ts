import { requireAuth } from '~/server/utils/requireAuth';
import { requireProSubscription } from '~/server/utils/requireProSubscription';
import { serverSupabaseClient } from '#supabase/server';
import type { Case } from '~/server/types';

export default defineEventHandler(async (event) => {
	const user = await requireAuth(event);

	// Ensure user has Pro subscription for case editing
	await requireProSubscription(event, user);

	const slug = getRouterParam(event, 'slug');
	const body = await readBody(event);

	if (!slug) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Slug is required',
		});
	}

	const supabase = await serverSupabaseClient<{
		cases: Case;
	}>(event);

	// Verify case ownership
	const { data: existingCase, error: fetchError } = await supabase
		.from('cases')
		.select('user_id, id')
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
			statusMessage: 'You do not have permission to edit this case',
		});
	}

	// Update case
	const { data: updatedCase, error: updateError } = await supabase
		.from('cases')
		.update({
			title: body.title,
			description: body.description,
			story: body.story,
			difficulty: body.difficulty,
			is_public: body.is_public,
			tags: body.tags,
		})
		.eq('id', existingCase.id)
		.eq('user_id', user.id) // Additional security check
		.select()
		.single();

	if (updateError) {
		console.error('Error updating case:', updateError);
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to update case',
		});
	}

	return updatedCase;
});
