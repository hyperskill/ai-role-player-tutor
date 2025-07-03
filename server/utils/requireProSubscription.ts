import { serverSupabaseClient } from '#supabase/server';
import type { Database } from '~/database.types';
import type { H3Event } from 'h3';

/**
 * Server-side utility to require Pro subscription access
 * Throws a 403 error if user doesn't have active Pro subscription
 */
export async function requireProSubscription(event: H3Event, user: { id: string }) {
	const supabase = await serverSupabaseClient<Database>(event);

	// Fetch user's subscription
	const { data: subscription, error } = await supabase
		.from('subscriptions')
		.select('plan, status, current_period_end')
		.eq('user_id', user.id)
		.single();

	if (error || !subscription) {
		throw createError({
			statusCode: 403,
			statusMessage: 'Pro subscription required. Please upgrade your plan.',
		});
	}

	// Check if user has active Pro subscription
	const isPro = (
		subscription.plan === 'pro'
		&& subscription.status === 'active'
		&& (!subscription.current_period_end
			|| new Date(subscription.current_period_end) > new Date())
	);

	if (!isPro) {
		throw createError({
			statusCode: 403,
			statusMessage: 'Pro subscription required. Please upgrade your plan.',
		});
	}

	return subscription;
}
