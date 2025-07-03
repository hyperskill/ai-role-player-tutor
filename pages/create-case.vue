<template>
	<div class="min-h-screen bg-background">
		<!-- Loading state while checking subscription -->
		<div
			v-if="subscriptionLoading"
			class="min-h-screen flex items-center justify-center"
		>
			<div class="text-center space-y-4">
				<Icon
					name="lucide:loader-2"
					class="h-8 w-8 animate-spin mx-auto text-muted-foreground"
					aria-hidden="true"
				/>
				<p class="text-muted-foreground">
					Checking subscription...
				</p>
			</div>
		</div>

		<div
			v-else
			class="container max-w-4xl mx-auto py-8 px-4"
		>
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold tracking-tight mb-4">
					Create New Case
				</h1>
				<p class="text-lg text-muted-foreground">
					Generate a new study case with AI-powered agent for any domain
				</p>
			</div>

			<UCard class="max-w-2xl mx-auto">
				<UCardHeader>
					<UCardTitle>Case Generation</UCardTitle>
					<UCardDescription>
						Enter a domain or subject area to generate a new interactive case study
					</UCardDescription>
				</UCardHeader>

				<UCardContent>
					<!-- Domain Input Form -->
					<div
						v-if="!isGenerating && !generationComplete"
						class="space-y-6"
					>
						<div class="space-y-2">
							<ULabel
								for="domain"
								class="text-sm font-medium"
							>
								Domain or Subject
							</ULabel>
							<UInput
								id="domain"
								v-model="domain"
								placeholder="e.g., Project Management, Sales, Customer Service"
								class="w-full"
								:disabled="isGenerating"
							/>
							<p class="text-sm text-muted-foreground">
								Describe the business domain or subject area for your case study
							</p>
						</div>

						<div class="space-y-2">
							<ULabel
								for="language"
								class="text-sm font-medium"
							>
								Language
							</ULabel>
							<UInput
								id="language"
								v-model="language"
								placeholder="e.g., English, Spanish, French, etc."
								class="w-full"
								:disabled="isGenerating"
							/>
							<p class="text-sm text-muted-foreground">
								Enter the language for your case study (English is recommended)
							</p>
						</div>
						<UButton
							:disabled="!domain.trim() || isGenerating"
							class="w-full"
							size="lg"
							@click="startGeneration"
						>
							<Icon
								v-if="isGenerating"
								name="lucide:refresh-cw"
								class="animate-spin h-4 w-4 mr-2"
								aria-hidden="true"
							/>
							<Icon
								v-else
								name="lucide:wand-2"
								class="h-4 w-4 mr-2"
								aria-hidden="true"
							/>
							{{ isGenerating ? 'Generating...' : 'Generate Case' }}
						</UButton>
					</div>

					<!-- Progress Tracking -->
					<div
						v-if="isGenerating"
						class="space-y-6"
					>
						<div class="space-y-4">
							<h3 class="font-medium text-center">
								Creating your case...
							</h3>

							<!-- Step 1: Case Creation -->
							<div class="flex items-center space-x-3">
								<div
									class="flex items-center justify-center w-8 h-8 rounded-full"
									:class="caseCreated ? 'bg-green-100 text-green-600'
										: caseInProgress ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'"
								>
									<Icon
										v-if="caseCreated"
										name="lucide:check"
										class="h-4 w-4"
										aria-hidden="true"
									/>
									<Icon
										v-else-if="caseInProgress"
										name="lucide:refresh-cw"
										class="animate-spin h-4 w-4"
										aria-hidden="true"
									/>
									<span
										v-else
										class="text-sm font-medium"
									>1</span>
								</div>
								<div class="flex-1">
									<p class="font-medium">
										Creating Case Study
									</p>
									<p class="text-sm text-muted-foreground">
										Generating story, description, and learning outcomes
									</p>
								</div>
							</div>

							<!-- Step 2: Agent Creation -->
							<div class="flex items-center space-x-3">
								<div
									class="flex items-center justify-center w-8 h-8 rounded-full"
									:class="agentCreated ? 'bg-green-100 text-green-600'
										: agentInProgress ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'"
								>
									<Icon
										v-if="agentCreated"
										name="lucide:check"
										class="h-4 w-4"
										aria-hidden="true"
									/>
									<Icon
										v-else-if="agentInProgress"
										name="lucide:refresh-cw"
										class="animate-spin h-4 w-4"
										aria-hidden="true"
									/>
									<span
										v-else
										class="text-sm font-medium"
									>2</span>
								</div>
								<div class="flex-1">
									<p class="font-medium">
										Creating AI Agent
									</p>
									<p class="text-sm text-muted-foreground">
										Generating persona, role, and conversation style
									</p>
								</div>
							</div>

							<!-- Step 3: Connecting -->
							<div class="flex items-center space-x-3">
								<div
									class="flex items-center justify-center w-8 h-8 rounded-full"
									:class="generationComplete ? 'bg-green-100 text-green-600'
										: connectingInProgress ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'"
								>
									<Icon
										v-if="generationComplete"
										name="lucide:check"
										class="h-4 w-4"
										aria-hidden="true"
									/>
									<Icon
										v-else-if="connectingInProgress"
										name="lucide:refresh-cw"
										class="animate-spin h-4 w-4"
										aria-hidden="true"
									/>
									<span
										v-else
										class="text-sm font-medium"
									>3</span>
								</div>
								<div class="flex-1">
									<p class="font-medium">
										Finalizing Setup
									</p>
									<p class="text-sm text-muted-foreground">
										Connecting agent to case and setting up permissions
									</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Success State -->
					<div
						v-if="generationComplete && newCase"
						class="space-y-6 text-center"
					>
						<div class="space-y-2">
							<Icon
								name="lucide:check-circle-2"
								class="h-12 w-12 text-green-600 mx-auto"
								aria-hidden="true"
							/>
							<h3 class="text-xl font-semibold">
								Case Created Successfully!
							</h3>
							<p class="text-muted-foreground">
								Your new case "{{ newCase.title }}" is ready to use.
							</p>
						</div>

						<div class="space-y-3">
							<UButton
								class="w-full"
								size="lg"
								@click="openNewCase"
							>
								<Icon
									name="lucide:play"
									class="h-4 w-4 mr-2"
									aria-hidden="true"
								/>
								Start Case
							</UButton>

							<UButton
								variant="outline"
								class="w-full"
								@click="editCase"
							>
								<Icon
									name="lucide:edit"
									class="h-4 w-4 mr-2"
									aria-hidden="true"
								/>
								Edit Case
							</UButton>

							<UButton
								variant="ghost"
								class="w-full"
								@click="createAnother"
							>
								<Icon
									name="lucide:plus"
									class="h-4 w-4 mr-2"
									aria-hidden="true"
								/>
								Create Another Case
							</UButton>
						</div>
					</div>

					<!-- Error State -->
					<div
						v-if="error"
						class="space-y-4 text-center"
					>
						<Icon
							name="lucide:alert-circle"
							class="h-12 w-12 text-red-600 mx-auto"
							aria-hidden="true"
						/>
						<h3 class="text-xl font-semibold text-red-600">
							Generation Failed
						</h3>
						<p class="text-muted-foreground">
							{{ error }}
						</p>
						<UButton
							variant="outline"
							class="w-full"
							@click="resetForm"
						>
							Try Again
						</UButton>
					</div>
				</UCardContent>
			</UCard>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Case } from '~/server/types';

// Check authentication and subscription
definePageMeta({
	middleware: 'auth',
});

const user = useSupabaseUser();
const { isPro, loading: subscriptionLoading } = useSubscription();
const supabase = useSupabaseClient();

// Client-side subscription check to avoid SSR issues
onMounted(() => {
	// Watch for subscription loading to complete, then check Pro status
	watchEffect(() => {
		// Only check after subscription has loaded and user is authenticated
		if (!subscriptionLoading.value && user.value && !isPro.value) {
			navigateTo('/pricing');
		}
	});
});

// Form state
const domain = ref('');
const isGenerating = ref(false);
const error = ref<string | null>(null);
const language = ref('English');

// Progress tracking state
const caseCreated = ref(false);
const agentCreated = ref(false);
const generationComplete = ref(false);
const newCase = ref<Case | null>(null);

// Computed progress states
const caseInProgress = computed(() => isGenerating.value && !caseCreated.value);
const agentInProgress = computed(() => isGenerating.value && caseCreated.value && !agentCreated.value);
const connectingInProgress = computed(() => isGenerating.value && agentCreated.value && !generationComplete.value);

// Real-time subscription to track case creation
let caseSubscription: ReturnType<typeof supabase.channel> | null = null;
let agentSubscription: ReturnType<typeof supabase.channel> | null = null;

const startGeneration = async () => {
	if (!domain.value.trim()) return;

	isGenerating.value = true;
	error.value = null;
	caseCreated.value = false;
	agentCreated.value = false;
	generationComplete.value = false;
	newCase.value = null;

	try {
		// Set up real-time subscriptions before starting generation
		setupSubscriptions();

		// Start generation process
		await $fetch('/api/cases/generate-case-by-domain', {
			method: 'POST',
			body: { domain: domain.value.trim(), language: language.value.trim() },
		});
	}
	catch (err) {
		console.error('Generation failed:', err);
		error.value = err instanceof Error ? err.message : 'Failed to generate case';
		isGenerating.value = false;
		cleanupSubscriptions();
	}
};

const setupSubscriptions = () => {
	if (!user.value?.id) return;

	// Set up polling as fallback mechanism
	startPolling();

	// Subscribe to cases table for new cases by this user
	caseSubscription = supabase
		.channel('case-creation')
		.on(
			'postgres_changes',
			{
				event: 'INSERT',
				schema: 'public',
				table: 'cases',
				filter: `user_id=eq.${user.value.id}`,
			},
			(payload) => {
				console.log('New case created via real-time:', payload);
				caseCreated.value = true;
				newCase.value = payload.new as Case;
			},
		)
		.subscribe();

	// Subscribe to agents table for new agents
	agentSubscription = supabase
		.channel('agent-creation')
		.on(
			'postgres_changes',
			{
				event: 'INSERT',
				schema: 'public',
				table: 'agents',
				filter: `user_id=eq.${user.value.id}`,
			},
			(payload) => {
				console.log('New agent created via real-time:', payload);
				agentCreated.value = true;
			},
		)
		.subscribe();

	// Subscribe to case updates (when agent_id is connected)
	supabase
		.channel('case-updates')
		.on(
			'postgres_changes',
			{
				event: 'UPDATE',
				schema: 'public',
				table: 'cases',
				filter: `user_id=eq.${user.value.id}`,
			},
			(payload) => {
				console.log('Case updated via real-time:', payload);
				const updatedCase = payload.new as Case;
				if (updatedCase.agent && caseCreated.value && agentCreated.value) {
					generationComplete.value = true;
					newCase.value = updatedCase;
					isGenerating.value = false;
					cleanupSubscriptions();
				}
			},
		)
		.subscribe();
};

// Polling fallback mechanism
let pollingInterval: NodeJS.Timeout | null = null;

const startPolling = () => {
	// Poll every 2 seconds for updates
	pollingInterval = setInterval(async () => {
		if (!user.value?.id || !isGenerating.value) return;

		try {
			// Check for recent cases and agents created by this user
			const [casesResponse, agentsResponse] = await Promise.all([
				supabase
					.from('cases')
					.select('*')
					.eq('user_id', user.value.id)
					.gte('created_at', new Date(Date.now() - 60000).toISOString()) // Last minute
					.order('created_at', { ascending: false })
					.limit(1),
				supabase
					.from('agents')
					.select('*')
					.eq('user_id', user.value.id)
					.gte('created_at', new Date(Date.now() - 60000).toISOString()) // Last minute
					.order('created_at', { ascending: false })
					.limit(1),
			]);

			// Check for new case
			if (casesResponse.data && casesResponse.data.length > 0 && !caseCreated.value) {
				console.log('New case detected via polling:', casesResponse.data[0]);
				caseCreated.value = true;
				newCase.value = casesResponse.data[0] as Case;
			}

			// Check for new agent
			if (agentsResponse.data && agentsResponse.data.length > 0 && !agentCreated.value) {
				console.log('New agent detected via polling:', agentsResponse.data[0]);
				agentCreated.value = true;
			}

			// Check if case has been connected to agent (generation complete)
			if (caseCreated.value && agentCreated.value && newCase.value && !generationComplete.value) {
				const { data: updatedCase } = await supabase
					.from('cases')
					.select('*')
					.eq('id', newCase.value.id)
					.single();

				if (updatedCase && (updatedCase as Case).agent) {
					console.log('Case-agent connection detected via polling');
					generationComplete.value = true;
					newCase.value = updatedCase as Case;
					isGenerating.value = false;
					cleanupSubscriptions();
				}
			}
		}
		catch (error) {
			console.error('Polling error:', error);
		}
	}, 2000);
};

const stopPolling = () => {
	if (pollingInterval) {
		clearInterval(pollingInterval);
		pollingInterval = null;
	}
};

const cleanupSubscriptions = () => {
	// Stop polling
	stopPolling();

	// Remove real-time subscriptions
	if (caseSubscription) {
		supabase.removeChannel(caseSubscription);
		caseSubscription = null;
	}
	if (agentSubscription) {
		supabase.removeChannel(agentSubscription);
		agentSubscription = null;
	}
};

const resetForm = () => {
	domain.value = '';
	isGenerating.value = false;
	error.value = null;
	caseCreated.value = false;
	agentCreated.value = false;
	generationComplete.value = false;
	newCase.value = null;
	cleanupSubscriptions();
};

const openNewCase = async () => {
	if (newCase.value?.slug) {
		await navigateTo(`/cases/${newCase.value.slug}`);
	}
};

const editCase = async () => {
	if (newCase.value?.id) {
		await navigateTo(`/cases/${newCase.value.slug}/edit`);
	}
};

const createAnother = () => {
	resetForm();
};

// Cleanup subscriptions on unmount
onUnmounted(() => {
	cleanupSubscriptions();
});
</script>
