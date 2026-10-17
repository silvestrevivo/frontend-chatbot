import { error } from '@sveltejs/kit';
import { form } from '$app/server';
import { API_URL } from '$app/env/private';

type ChatInput = {
	message: string;
	previous_response_id: string;
};

export type ChatResponse = {
	answer: string;
	response_id: string;
	usage: {
		input_tokens: number;
		cached_tokens: number;
		output_tokens: number;
		cost: number;
	};
};

export const sendMessage = form(
	'unchecked',
	async ({ message, previous_response_id }: ChatInput) => {
		const res = await fetch(`${API_URL}/chat`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message, previous_response_id: previous_response_id || null })
		});

		if (!res.ok) {
			error(res.status, 'PyTutor could not answer, please try again');
		}

		return (await res.json()) as ChatResponse;
	}
);
