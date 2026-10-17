import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/common';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import 'highlight.js/styles/github-dark.css';

const marked = new Marked(
	markedHighlight({
		emptyLangClass: 'hljs',
		langPrefix: 'hljs language-',
		highlight(code, lang) {
			const language = hljs.getLanguage(lang) ? lang : 'plaintext';
			return hljs.highlight(code, { language }).value;
		}
	})
);

// Answers come from the model, so they are sanitized before being inserted as HTML.
export function renderMarkdown(text: string): string {
	return DOMPurify.sanitize(marked.parse(text, { async: false }));
}
