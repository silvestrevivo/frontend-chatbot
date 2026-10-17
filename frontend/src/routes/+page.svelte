<script lang="ts">
	import type { PageProps } from './$types';
	import { renderMarkdown } from '#lib/markdown.js';
	import { sendMessage } from './chat.remote';

	type Message = { role: 'user' | 'assistant'; text: string };

	let { data }: PageProps = $props();

	let messages: Message[] = $state([]);
	let previousResponseId = $state('');
	let totalCost = $state(0);
	let errorMessage = $state('');
</script>

<svelte:head>
	<title>PyTutor</title>
</svelte:head>

<div class="flex h-dvh flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
	<header class="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
		<div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
			<div class="flex items-center gap-3">
				<div
					class="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white"
				>
					Py
				</div>
				<div>
					<h1 class="text-base leading-tight font-semibold">PyTutor</h1>
					<p class="text-xs text-slate-500 dark:text-slate-400">Your Python teacher</p>
				</div>
			</div>

			{#if data.health}
				<span
					class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
				>
					<span class="size-1.5 rounded-full bg-emerald-500"></span>
					API {data.health.status}
				</span>
			{:else}
				<span
					class="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 dark:bg-rose-950 dark:text-rose-300"
					title={data.error}
				>
					<span class="size-1.5 rounded-full bg-rose-500"></span>
					API unavailable
				</span>
			{/if}
		</div>
	</header>

	<!-- column-reverse keeps the scroll pinned to the newest message -->
	<main class="flex flex-1 flex-col-reverse overflow-y-auto">
		<div class="mx-auto flex w-full max-w-3xl grow flex-col gap-4 px-4 py-6">
			{#if messages.length === 0}
				<div class="my-auto py-16 text-center">
					<p class="text-lg font-medium">Hi! I'm PyTutor.</p>
					<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
						Ask me anything about Python to get started.
					</p>
				</div>
			{/if}

			{#each messages as message, index (index)}
				{#if message.role === 'user'}
					<div class="flex justify-end">
						<p
							class="max-w-[85%] rounded-2xl rounded-br-sm bg-emerald-600 px-4 py-2.5 whitespace-pre-wrap text-white"
						>
							{message.text}
						</p>
					</div>
				{:else}
					<div class="flex justify-start">
						<div
							class="prose max-w-[85%] min-w-0 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-2.5 shadow-sm prose-slate dark:border-slate-800 dark:bg-slate-900 dark:prose-invert prose-p:my-2 prose-pre:my-3 prose-pre:bg-[#0d1117] prose-pre:p-0 prose-ul:my-2 prose-ol:my-2"
						>
							{@html renderMarkdown(message.text)}
						</div>
					</div>
				{/if}
			{/each}

			{#if sendMessage.pending}
				<div class="flex justify-start">
					<div
						role="status"
						aria-label="PyTutor is thinking"
						class="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
					>
						<span class="size-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]"
						></span>
						<span class="size-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]"
						></span>
						<span class="size-2 animate-bounce rounded-full bg-slate-400"></span>
					</div>
				</div>
			{/if}

			{#if errorMessage}
				<p
					class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300"
				>
					{errorMessage}
				</p>
			{/if}
		</div>
	</main>

	<footer class="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
		<div class="mx-auto max-w-3xl px-4 py-3">
			<form
				class="flex gap-2"
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
					class="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
				/>
				<button
					disabled={!!sendMessage.pending}
					class="rounded-xl bg-emerald-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Send
				</button>
			</form>

			<p class="mt-2 text-right text-xs text-slate-500 tabular-nums dark:text-slate-400">
				Total cost: ${totalCost.toFixed(6)}
			</p>
		</div>
	</footer>
</div>
