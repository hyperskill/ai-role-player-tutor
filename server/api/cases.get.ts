import { serverSupabaseClient } from '#supabase/server';
import type { Case } from '~/server/types';

export default defineEventHandler(async (event) => {
	const supabase = await serverSupabaseClient<{
		cases: Case[];
	}>(event);

	const casesQuery = supabase
		.from('cases')
		.select()
		.order('id', { ascending: true });

	const { data: cases, error } = await casesQuery;

	if (error) {
		console.error('Error fetching cases:', error);
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to fetch cases',
		});
	}

	return cases || [];
});
