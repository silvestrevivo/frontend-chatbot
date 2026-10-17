import { API_URL } from '$app/env/private';
import type { PageServerLoad } from './$types';

type Health = { status: string };

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const res = await fetch(`${API_URL}/health`);
		if (!res.ok) {
			return { health: null, error: `API responded with ${res.status}` };
		}
		return { health: (await res.json()) as Health, error: null };
	} catch {
		return { health: null, error: 'Could not reach the API' };
	}
};
