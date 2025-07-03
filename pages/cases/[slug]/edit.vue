<template>
	<div class="min-h-screen bg-background">
		<div class="container max-w-6xl mx-auto py-8 px-4">
			<div class="mb-8">
				<div class="flex items-center justify-between">
					<div>
						<h1 class="text-3xl font-bold tracking-tight mb-2">
							Edit Case
						</h1>
						<p class="text-lg text-muted-foreground">
							Modify your case study and AI agent settings
						</p>
					</div>
					<UButton
						variant="outline"
						@click="navigateTo(`/cases/${route.params.slug}`)"
					>
						<Icon
							name="lucide:arrow-left"
							class="h-4 w-4 mr-2"
							aria-hidden="true"
						/>
						Back to Case
					</UButton>
				</div>
			</div>

			<div
				v-if="pending"
				class="text-center py-12"
			>
				<Icon
					name="lucide:refresh-cw"
					class="animate-spin h-8 w-8 mx-auto mb-4"
					aria-hidden="true"
				/>
				<p>Loading case details...</p>
			</div>

			<div
				v-else-if="error"
				class="text-center py-12"
			>
				<Icon
					name="lucide:alert-circle"
					class="h-8 w-8 text-red-600 mx-auto mb-4"
					aria-hidden="true"
				/>
				<h3 class="text-lg font-semibold text-red-600 mb-2">
					Error Loading Case
				</h3>
				<p class="text-muted-foreground mb-4">
					{{ error }}
				</p>
				<UButton @click="refresh()">
					Try Again
				</UButton>
			</div>

			<div
				v-else-if="!caseData"
				class="text-center py-12"
			>
				<Icon
					name="lucide:file-x"
					class="h-8 w-8 text-muted-foreground mx-auto mb-4"
					aria-hidden="true"
				/>
				<h3 class="text-lg font-semibold mb-2">
					Case Not Found
				</h3>
				<p class="text-muted-foreground">
					The case you're looking for doesn't exist or you don't have permission to edit it.
				</p>
			</div>

			<div
				v-else
				class="grid grid-cols-1 lg:grid-cols-2 gap-8"
			>
				<!-- Case Details Section -->
				<UCard>
					<UCardHeader>
						<UCardTitle class="flex items-center gap-2">
							<Icon
								name="lucide:file-text"
								class="h-5 w-5"
								aria-hidden="true"
							/>
							Case Details
						</UCardTitle>
						<UCardDescription>
							Edit the case study information and settings
						</UCardDescription>
					</UCardHeader>
					<UCardContent class="space-y-6">
						<div class="space-y-2">
							<ULabel for="title">
								Title
							</ULabel>
							<UInput
								id="title"
								v-model="caseForm.title"
								placeholder="Enter case title"
							/>
						</div>

						<div class="space-y-2">
							<ULabel for="description">
								Description
							</ULabel>
							<UTextarea
								id="description"
								v-model="caseForm.description"
								placeholder="Brief description of the case"
								rows="3"
							/>
						</div>

						<div class="space-y-2">
							<ULabel for="story">
								Story
							</ULabel>
							<UTextarea
								id="story"
								v-model="caseForm.story"
								placeholder="The full case study scenario"
								rows="8"
							/>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div class="space-y-2">
								<ULabel for="difficulty">
									Difficulty Level (1-5)
								</ULabel>
								<UInput
									id="difficulty"
									v-model.number="caseForm.difficulty"
									type="number"
									min="1"
									max="5"
									placeholder="1"
								/>
							</div>

							<div class="space-y-2">
								<ULabel>Visibility</ULabel>
								<div class="flex items-center space-x-2">
									<input
										id="is_public"
										v-model="caseForm.is_public"
										type="checkbox"
										class="rounded border-gray-300"
									>
									<ULabel
										for="is_public"
										class="text-sm"
									>
										Make this case public
									</ULabel>
								</div>
								<p class="text-xs text-muted-foreground">
									Public cases can be seen by other authenticated users
								</p>
							</div>
						</div>

						<div class="space-y-2">
							<ULabel for="tags">
								Tags (comma-separated)
							</ULabel>
							<UInput
								id="tags"
								:model-value="tagsString"
								placeholder="project management, leadership, communication"
								@update:model-value="updateTags"
							/>
						</div>
					</UCardContent>
				</UCard>

				<!-- Agent Details Section -->
				<UCard>
					<UCardHeader>
						<UCardTitle class="flex items-center gap-2">
							<Icon
								name="lucide:bot"
								class="h-5 w-5"
								aria-hidden="true"
							/>
							AI Agent Settings
						</UCardTitle>
						<UCardDescription>
							Configure the AI agent's personality and behavior
						</UCardDescription>
					</UCardHeader>
					<UCardContent class="space-y-6">
						<div class="space-y-2">
							<ULabel for="agent-name">
								Agent Name
							</ULabel>
							<UInput
								id="agent-name"
								v-model="agentForm.name"
								placeholder="Enter agent name"
							/>
						</div>

						<div class="space-y-2">
							<ULabel for="agent-position">
								Position/Role
							</ULabel>
							<UInput
								id="agent-position"
								v-model="agentForm.position"
								placeholder="e.g., Senior Project Manager, Sales Director"
							/>
						</div>

						<div class="space-y-2">
							<ULabel for="agent-prompt">
								Agent Personality & Behavior
							</ULabel>
							<UTextarea
								id="agent-prompt"
								v-model="agentForm.prompt"
								placeholder="Describe the agent's personality, communication style, and how they should behave in conversations"
								rows="8"
							/>
							<p class="text-xs text-muted-foreground">
								This defines how the AI agent will interact with students during the case
							</p>
						</div>
					</UCardContent>
				</UCard>
			</div>

			<!-- Action Buttons -->
			<div
				v-if="caseData"
				class="mt-8 flex flex-col sm:flex-row gap-4 justify-between"
			>
				<div class="flex flex-col sm:flex-row gap-2">
					<UButton
						:disabled="saving || !hasChanges"
						class="sm:order-1"
						@click="saveChanges"
					>
						<Icon
							v-if="saving"
							name="lucide:refresh-cw"
							class="animate-spin h-4 w-4 mr-2"
							aria-hidden="true"
						/>
						<Icon
							v-else
							name="lucide:save"
							class="h-4 w-4 mr-2"
							aria-hidden="true"
						/>
						{{ saving ? 'Saving...' : 'Save Changes' }}
					</UButton>

					<UButton
						variant="outline"
						:disabled="saving"
						@click="resetForm"
					>
						<Icon
							name="lucide:undo"
							class="h-4 w-4 mr-2"
							aria-hidden="true"
						/>
						Reset
					</UButton>
				</div>

				<UButton
					variant="destructive"
					:disabled="saving"
					@click="confirmDelete = true"
				>
					<Icon
						name="lucide:trash-2"
						class="h-4 w-4 mr-2"
						aria-hidden="true"
					/>
					Delete Case
				</UButton>
			</div>
		</div>

		<!-- Delete Confirmation Dialog -->
		<UDialog v-model:open="confirmDelete">
			<UDialogContent>
				<UDialogHeader>
					<UDialogTitle>Delete Case</UDialogTitle>
					<UDialogDescription>
						Are you sure you want to delete this case? This action cannot be undone.
						All associated chats and progress will be permanently lost.
					</UDialogDescription>
				</UDialogHeader>
				<UDialogFooter>
					<UButton
						variant="outline"
						@click="confirmDelete = false"
					>
						Cancel
					</UButton>
					<UButton
						variant="destructive"
						:disabled="deleting"
						@click="deleteCase"
					>
						<Icon
							v-if="deleting"
							name="lucide:refresh-cw"
							class="animate-spin h-4 w-4 mr-2"
							aria-hidden="true"
						/>
						{{ deleting ? 'Deleting...' : 'Delete Case' }}
					</UButton>
				</UDialogFooter>
			</UDialogContent>
		</UDialog>
	</div>
</template>

<script setup lang="ts">
import type { Case, Agent } from '~/server/types';
import { useSupabaseUser } from '#imports';
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

definePageMeta({
	middleware: 'auth',
});

const route = useRoute();
const user = useSupabaseUser();

// Form state
const caseForm = ref({
	title: '',
	description: '',
	story: '',
	difficulty: 1,
	is_public: true,
	tags: [] as string[],
});

const agentForm = ref({
	name: '',
	position: '',
	prompt: '',
});

// UI state
const saving = ref(false);
const deleting = ref(false);
const confirmDelete = ref(false);

// Computed for tags handling
const tagsString = computed(() => caseForm.value.tags.join(', '));

const updateTags = (value: string | number) => {
	const stringValue = String(value);
	caseForm.value.tags = stringValue.split(',').map(tag => tag.trim()).filter(Boolean);
};

// Fetch case data
const { data: caseData, pending, error, refresh } = await useFetch<Case & { agent_id: Agent }>(`/api/cases/${route.params.slug}`, {
	server: false,
});

// Initialize forms when data loads
watch(caseData, (newData) => {
	if (newData) {
		// Check if user owns this case
		if (newData.user_id !== user.value?.id) {
			throw createError({
				statusCode: 403,
				statusMessage: 'You do not have permission to edit this case',
			});
		}

		// Initialize case form
		caseForm.value = {
			title: newData.title || '',
			description: newData.description || '',
			story: newData.story || '',
			difficulty: newData.difficulty || 1,
			is_public: newData.is_public,
			tags: newData.tags || [],
		};

		// Initialize agent form
		if (newData.agent_id) {
			agentForm.value = {
				name: newData.agent_id.name || '',
				position: newData.agent_id.position || '',
				prompt: newData.agent_id.prompt || '',
			};
		}
	}
}, { immediate: true });

// Track changes
const originalCaseForm = ref<typeof caseForm.value | null>(null);
const originalAgentForm = ref<typeof agentForm.value | null>(null);

watch(caseData, (newData) => {
	if (newData) {
		originalCaseForm.value = {
			title: newData.title || '',
			description: newData.description || '',
			story: newData.story || '',
			difficulty: newData.difficulty || 1,
			is_public: newData.is_public,
			tags: newData.tags || [],
		};

		if (newData.agent_id) {
			originalAgentForm.value = {
				name: newData.agent_id.name || '',
				position: newData.agent_id.position || '',
				prompt: newData.agent_id.prompt || '',
			};
		}
	}
}, { immediate: true });

const hasChanges = computed(() => {
	if (!originalCaseForm.value || !originalAgentForm.value) return false;

	return JSON.stringify(caseForm.value) !== JSON.stringify(originalCaseForm.value)
		|| JSON.stringify(agentForm.value) !== JSON.stringify(originalAgentForm.value);
});

const resetForm = () => {
	if (originalCaseForm.value) {
		caseForm.value = { ...originalCaseForm.value };
	}
	if (originalAgentForm.value) {
		agentForm.value = { ...originalAgentForm.value };
	}
};

const saveChanges = async () => {
	if (!caseData.value || !hasChanges.value) return;

	saving.value = true;

	try {
		// Update case
		await $fetch(`/api/cases/${caseData.value.slug}`, {
			method: 'PATCH',
			body: caseForm.value,
		});

		// Update agent if it exists
		if (caseData.value.agent_id?.id) {
			await $fetch(`/api/agents/${caseData.value.agent_id.id}`, {
				method: 'PATCH',
				body: agentForm.value,
			});
		}

		// Update original forms to reflect saved state
		originalCaseForm.value = { ...caseForm.value };
		originalAgentForm.value = { ...agentForm.value };

		// Show success message (you could add a toast notification here)
		console.log('Changes saved successfully');
	}
	catch (err) {
		console.error('Failed to save changes:', err);
		// Handle error (you could add error notification here)
	}
	finally {
		saving.value = false;
	}
};

const deleteCase = async () => {
	console.log('deleteCase');
	if (!caseData.value) return;

	deleting.value = true;

	try {
		await $fetch(`/api/cases/${caseData.value.slug}`, {
			method: 'DELETE',
		});

		// Redirect to main page after successful deletion
		await navigateTo('/');
	}
	catch (err) {
		console.error('Failed to delete case:', err);
		// Handle error
	}
	finally {
		deleting.value = false;
		confirmDelete.value = false;
	}
};
</script>
