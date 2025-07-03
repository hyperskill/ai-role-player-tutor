<template>
	<div
		class="flex"
		:class="message.type === 'user' ? 'justify-end' : 'justify-start'"
	>
		<div class="max-w-[80%]">
			<MDC
				:value="message.text"
				class="rounded-lg px-4 py-2 text-sm!"
				:class="message.type === 'user'
					? 'bg-primary text-primary-foreground ml-auto'
					: 'bg-muted'"
			/>
			<div
				class="text-xs text-muted-foreground mt-1"
				:class="message.type === 'user' ? 'text-right' : 'text-left'"
			>
				{{ formatTime(message.timestamp) }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { MDC } from '#components';

interface Message {
	type: 'user' | 'agent';
	text: string;
	timestamp: string;
}

interface Props {
	message: Message;
}

defineProps<Props>();

function formatTime(timestamp: string) {
	if (!timestamp) return '';
	return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
</script>
