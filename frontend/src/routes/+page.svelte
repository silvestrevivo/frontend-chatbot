<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h1>Chatbot</h1>

{#if data.health}
	<p>API status: <strong>{data.health.status}</strong></p>
{:else}
	<p>API unavailable: {data.error}</p>
{/if}
