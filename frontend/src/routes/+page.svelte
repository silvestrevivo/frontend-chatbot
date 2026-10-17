<script lang="ts">
	import type { PageProps } from './$types';
	import { sendMessage } from './chat.remote';

	type Message = { role: 'user' | 'assistant'; text: string };

	let { data }: PageProps = $props();

	let messages: Message[] = $state([]);
	let previousResponseId = $state('');
	let totalCost = $state(0);
	let errorMessage = $state('');
</script>

<h1>PyTutor</h1>

{#if data.health}
	<p>API status: <strong>{data.health.status}</strong></p>
{:else}
	<p>API unavailable: {data.error}</p>
{/if}

<div class="messages">
	{#each messages as message, index (index)}
		<p class={message.role}>
			<strong>{message.role === 'user' ? 'You' : 'PyTutor'}:</strong>
			{message.text}
		</p>
	{/each}

	{#if sendMessage.pending}
		<p class="assistant">PyTutor is thinking...</p>
	{/if}
</div>

{#if errorMessage}
	<p class="error">{errorMessage}</p>
{/if}

<form
	{...sendMessage.enhance(async (form) => {
		errorMessage = '';
		messages.push({ role: 'user', text: form.fields.message.value() ?? '' });

		try {
			await form.submit();
		} catch {
			errorMessage = 'PyTutor could not answer, please try again';
			return;
		}

		form.element.reset();

		const result = sendMessage.result;
		if (result) {
			messages.push({ role: 'assistant', text: result.answer });
			previousResponseId = result.response_id;
			totalCost += result.usage.cost;
		}
	})}
>
	<input {...sendMessage.fields.previous_response_id.as('hidden', previousResponseId)} />
	<input
		{...sendMessage.fields.message.as('text')}
		placeholder="Ask PyTutor about Python..."
		autocomplete="off"
	/>
	<button disabled={!!sendMessage.pending}>Send</button>
</form>

<p>Total cost: ${totalCost.toFixed(6)}</p>

<style>
	.messages {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.messages p {
		margin: 0;
		white-space: pre-wrap;
	}

	.user {
		color: steelblue;
	}

	.error {
		color: crimson;
	}
</style>
