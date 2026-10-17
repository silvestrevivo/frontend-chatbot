import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	API_URL: {
		description: 'Base URL of the Python backend, as reachable from the SvelteKit server',
		schema: (value) => value || 'http://localhost:8000'
	}
});
