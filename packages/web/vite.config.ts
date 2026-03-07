import { readFileSync, readdirSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

function netrockTemplates(): Plugin {
	const virtualId = 'virtual:templates';
	const resolvedId = '\0' + virtualId;
	const templatesDir = resolve(__dirname, '../../templates');

	function walk(dir: string): [string, string][] {
		const entries: [string, string][] = [];
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const full = resolve(dir, entry.name);
			if (entry.isDirectory()) {
				entries.push(...walk(full));
			} else {
				const rel = relative(templatesDir, full).replaceAll('\\', '/');
				entries.push([rel, readFileSync(full, 'utf-8')]);
			}
		}
		return entries;
	}

	return {
		name: 'netrock-templates',
		resolveId(id) {
			if (id === virtualId) return resolvedId;
		},
		load(id) {
			if (id === resolvedId) {
				const entries = walk(templatesDir);
				return `export default new Map(${JSON.stringify(entries)});`;
			}
		}
	};
}

export default defineConfig({
	plugins: [tailwindcss(), netrockTemplates(), sveltekit()]
});
